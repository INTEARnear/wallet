use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use chrono::{DateTime, Utc};
use rocksdb::{Options, DB};
use serde::{Deserialize, Serialize};
use std::{env, net::SocketAddr, path::PathBuf, sync::Arc, time::Duration};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

const MAX_DATA_SIZE: usize = 1024; // 1KB limit
const CLEANUP_INTERVAL_MINUTES: u64 = 10;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct StoreRequest {
    data: String,
    expires_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct StoreResponse {
    id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct RetrieveResponse {
    data: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct StoredData {
    data: String,
    expires_at: DateTime<Utc>,
}

#[derive(Clone)]
struct AppState {
    db: Arc<DB>,
}

impl AppState {
    fn store_data(
        &self,
        id: &str,
        stored_data: &StoredData,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let serialized = serde_json::to_vec(stored_data)?;
        self.db.put(id.as_bytes(), serialized)?;
        Ok(())
    }

    fn retrieve_data(&self, id: &str) -> Result<Option<StoredData>, Box<dyn std::error::Error>> {
        if let Some(data) = self.db.get(id.as_bytes())? {
            let stored_data: StoredData = serde_json::from_slice(&data)?;

            // Check if expired
            if stored_data.expires_at <= Utc::now() {
                // Delete expired data
                self.db.delete(id.as_bytes())?;
                return Ok(None);
            }

            Ok(Some(stored_data))
        } else {
            Ok(None)
        }
    }

    fn cleanup_expired(&self) -> Result<usize, Box<dyn std::error::Error>> {
        let mut deleted_count = 0;
        let mut keys_to_delete = Vec::new();

        let iterator = self.db.iterator(rocksdb::IteratorMode::Start);

        for item in iterator {
            let (key, value) = item?;
            if let Ok(stored_data) = serde_json::from_slice::<StoredData>(&value) {
                if stored_data.expires_at <= Utc::now() {
                    keys_to_delete.push(key.to_vec());
                }
            }
        }

        for key in keys_to_delete {
            self.db.delete(&key)?;
            deleted_count += 1;
        }

        tracing::info!("Cleaned up {} expired entries", deleted_count);
        Ok(deleted_count)
    }
}

async fn handle_store(
    State(state): State<AppState>,
    Json(request): Json<StoreRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if request.data.len() > MAX_DATA_SIZE {
        return Err((
            StatusCode::BAD_REQUEST,
            format!("Data size exceeds maximum of {} bytes", MAX_DATA_SIZE),
        ));
    }
    if request.expires_at <= Utc::now() {
        return Err((
            StatusCode::BAD_REQUEST,
            "Expiration time must be in the future".to_string(),
        ));
    }
    if request.expires_at > Utc::now() + Duration::from_secs(7 * 24 * 60 * 60) {
        return Err((
            StatusCode::BAD_REQUEST,
            "Expiration time must be less than 7 days".to_string(),
        ));
    }

    let id = nanoid::nanoid!();

    let stored_data = StoredData {
        data: request.data,
        expires_at: request.expires_at,
    };

    match state.store_data(&id, &stored_data) {
        Ok(()) => {
            tracing::info!(
                "Stored data with id: {}, expires at: {}",
                id,
                request.expires_at
            );
            Ok(Json(StoreResponse { id }))
        }
        Err(e) => {
            tracing::error!("Failed to store data: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to store data".to_string(),
            ))
        }
    }
}

async fn handle_retrieve(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    match state.retrieve_data(&id) {
        Ok(Some(stored_data)) => {
            tracing::info!("Retrieved data for id: {}", id);
            Ok(Json(RetrieveResponse {
                data: stored_data.data,
            }))
        }
        Ok(None) => {
            tracing::info!("Data not found or expired for id: {}", id);
            Err((
                StatusCode::NOT_FOUND,
                "Data not found or expired".to_string(),
            ))
        }
        Err(e) => {
            tracing::error!("Failed to retrieve data for id {}: {}", id, e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to retrieve data".to_string(),
            ))
        }
    }
}

async fn cleanup_task(state: AppState) {
    let mut interval = tokio::time::interval(Duration::from_secs(CLEANUP_INTERVAL_MINUTES * 60));

    loop {
        interval.tick().await;

        match state.cleanup_expired() {
            Ok(count) => {
                if count > 0 {
                    tracing::info!("Cleanup completed, removed {} expired entries", count);
                }
            }
            Err(e) => {
                tracing::error!("Cleanup failed: {}", e);
            }
        }
    }
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive("info".parse().unwrap())
                .from_env_lossy(),
        )
        .init();

    tracing::info!("Starting password storage service...");

    // Initialize RocksDB
    let db_path = PathBuf::from("passwords");
    let mut opts = Options::default();
    opts.create_if_missing(true);
    opts.set_compression_type(rocksdb::DBCompressionType::Lz4);
    let db = DB::open(&opts, &db_path).expect("Failed to open RocksDB");
    let db = Arc::new(db);

    let state = AppState { db };

    // Start cleanup task
    let cleanup_state = state.clone();
    tokio::spawn(async move {
        cleanup_task(cleanup_state).await;
    });

    let app = Router::new()
        .route("/store", post(handle_store))
        .route("/retrieve/{id}", get(handle_retrieve))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = env::var("PASSWORD_STORAGE_SERVICE_BIND")
        .map(|s| {
            s.parse()
                .expect("Invalid PASSWORD_STORAGE_SERVICE_BIND format")
        })
        .unwrap_or_else(|_| SocketAddr::from(([127, 0, 0, 1], 3004)));
    tracing::info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("Server started successfully");
    axum::serve(listener, app).await.unwrap();
}
