use std::{
    collections::BTreeMap,
    env,
    net::SocketAddr,
    str::FromStr,
    sync::{Arc, RwLock},
    time::Duration,
};

use axum::{
    Json, Router,
    body::Bytes,
    extract::{Path, State},
    http::{StatusCode, header},
    response::{IntoResponse, Response},
    routing::get,
};
use chrono::{DateTime, Utc};
use dotenvy::dotenv;
use near_min_api::{
    QueryFinality, RpcClient,
    types::{
        AccountId, Finality, HandlerError, RpcError, RpcErrorKind, RpcQueryError,
        near_crypto::{KeyType, ParseKeyError, PublicKey, PublicKeyHandle},
    },
};
use serde::Serialize;
use sqlx::{PgPool, postgres::PgPoolOptions};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

#[derive(Clone)]
struct AppState {
    pool: PgPool,
    rpc_client: RpcClient,
    stats_cache: Arc<RwLock<Bytes>>,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

type ApiError = (StatusCode, Json<ErrorResponse>);

fn internal_error(error: sqlx::Error) -> ApiError {
    tracing::error!(%error, "Database error");
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(ErrorResponse {
            error: "internal error".to_string(),
        }),
    )
}

#[derive(Serialize)]
struct PublicKeyLookupResponse {
    account_ids: Vec<AccountId>,
}

async fn public_key_lookup(
    State(state): State<AppState>,
    Path(key_or_handle): Path<String>,
) -> Result<Json<PublicKeyLookupResponse>, ApiError> {
    let handle = parse_public_key_or_handle(&key_or_handle).map_err(|error| {
        (
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: error.to_string(),
            }),
        )
    })?;

    let mut account_ids = sqlx::query!(
        "SELECT account_id FROM access_keys WHERE key_handle = $1",
        handle.to_string()
    )
    .fetch_all(&state.pool)
    .await
    .map_err(internal_error)?
    .into_iter()
    .map(|row| {
        row.account_id
            .parse()
            .expect("stored account_id is always a valid AccountId")
    })
    .collect::<Vec<_>>();

    if let Some(public_key) = handle.full_pubkey()
        && let Some(implicit_account_id) = implicit_account_id(&public_key)
        && !account_ids.contains(&implicit_account_id)
        && implicit_account_should_be_visible(&state.rpc_client, implicit_account_id.clone()).await
    {
        account_ids.push(implicit_account_id);
    }

    Ok(Json(PublicKeyLookupResponse { account_ids }))
}

#[derive(Serialize)]
struct HourlyTransactionsByKeyType {
    hour: DateTime<Utc>,
    ed25519: i64,
    secp256k1: i64,
    ml_dsa_65: i64,
}

#[derive(Serialize)]
struct HourlyPqAdoption {
    hour: DateTime<Utc>,
    active_accounts: i64,
    exclusively_ml_dsa_65_accounts: i64,
}

#[derive(Serialize)]
struct Totals {
    quantum_safe_accounts: i64,
    quantum_safe_transactions: i64,
}

#[derive(Serialize)]
struct StatsResponse {
    hourly_transactions_by_key_type: Vec<HourlyTransactionsByKeyType>,
    hourly_pq_adoption: Vec<HourlyPqAdoption>,
    totals: Totals,
}

const STATS_REFRESH_INTERVAL: Duration = Duration::from_secs(10);

async fn compute_stats(pool: &PgPool) -> Result<StatsResponse, sqlx::Error> {
    let key_type_rows = sqlx::query!(
        "SELECT hour, key_type, transaction_count FROM hourly_key_type_stats
         ORDER BY hour, key_type",
    )
    .fetch_all(pool)
    .await?;
    let mut by_hour: BTreeMap<DateTime<Utc>, HourlyTransactionsByKeyType> = BTreeMap::new();
    for row in key_type_rows {
        let entry = by_hour
            .entry(row.hour)
            .or_insert_with(|| HourlyTransactionsByKeyType {
                hour: row.hour,
                ed25519: 0,
                secp256k1: 0,
                ml_dsa_65: 0,
            });
        if let Ok(key_type) = row.key_type.parse() {
            match key_type {
                KeyType::ED25519 => entry.ed25519 = row.transaction_count,
                KeyType::SECP256K1 => entry.secp256k1 = row.transaction_count,
                KeyType::MLDSA65 => entry.ml_dsa_65 = row.transaction_count,
            }
        }
    }

    let hourly_pq_adoption = sqlx::query!(
        "SELECT hour, active_accounts_count, exclusively_pq_accounts_count FROM hourly_stats
         ORDER BY hour",
    )
    .fetch_all(pool)
    .await?
    .into_iter()
    .map(|row| HourlyPqAdoption {
        hour: row.hour,
        active_accounts: row.active_accounts_count,
        exclusively_ml_dsa_65_accounts: row.exclusively_pq_accounts_count,
    })
    .collect();

    let quantum_safe_accounts =
        sqlx::query_scalar!("SELECT count(*) FROM account_key_counts WHERE is_exclusively_pq")
            .fetch_one(pool)
            .await?
            .unwrap_or(0);

    let quantum_safe_transactions = sqlx::query_scalar!(
        "SELECT coalesce(sum(transaction_count), 0)::bigint FROM hourly_key_type_stats
         WHERE key_type = 'ml-dsa-65'"
    )
    .fetch_one(pool)
    .await?
    .unwrap_or(0);

    Ok(StatsResponse {
        hourly_transactions_by_key_type: by_hour.into_values().collect(),
        hourly_pq_adoption,
        totals: Totals {
            quantum_safe_accounts,
            quantum_safe_transactions,
        },
    })
}

fn serialize_stats(stats: &StatsResponse) -> Bytes {
    Bytes::from(serde_json::to_vec(stats).expect("StatsResponse is always serializable"))
}

async fn stats(State(state): State<AppState>) -> Response {
    let body = state.stats_cache.read().unwrap().clone();
    (
        [
            (header::CONTENT_TYPE, "application/json"),
            (header::CACHE_CONTROL, "public, max-age=10"),
        ],
        body,
    )
        .into_response()
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive("info".parse().unwrap())
                .from_env_lossy(),
        )
        .init();

    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL environment variable is required");
    let pool = PgPoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Failed to connect to Postgres");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run database migrations");

    let rpc_urls = env::var("RPC_URLS")
        .map(|urls| urls.split(',').map(String::from).collect::<Vec<_>>())
        .expect("RPC_URLS environment variable is required");
    let rpc_client = RpcClient::new(rpc_urls);

    let stats_cache = Arc::new(RwLock::new(serialize_stats(
        &compute_stats(&pool)
            .await
            .expect("Failed to compute initial stats"),
    )));
    tokio::spawn({
        let pool = pool.clone();
        let stats_cache = Arc::clone(&stats_cache);
        async move {
            loop {
                tokio::time::sleep(STATS_REFRESH_INTERVAL).await;
                match compute_stats(&pool).await {
                    Ok(stats) => {
                        *stats_cache
                            .write()
                            .expect("stats cache lock is never poisoned") = serialize_stats(&stats);
                    }
                    Err(error) => tracing::error!(%error, "Failed to refresh stats"),
                }
            }
        }
    });

    let app = Router::new()
        .route("/public_key/{key_or_handle}", get(public_key_lookup))
        .route("/stats", get(stats))
        .layer(CorsLayer::permissive())
        .with_state(AppState {
            pool,
            rpc_client,
            stats_cache,
        });

    let addr = env::var("ACCOUNT_INDEXER_BIND")
        .map(|value| value.parse().expect("Invalid ACCOUNT_INDEXER_BIND format"))
        .unwrap_or_else(|_| SocketAddr::from(([127, 0, 0, 1], 3007)));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind ACCOUNT_INDEXER_BIND address");
    tracing::info!(%addr, "account-indexer API listening");
    axum::serve(listener, app).await.unwrap();
}

fn parse_public_key_or_handle(input: &str) -> Result<PublicKeyHandle, ParseKeyError> {
    if let Ok(handle) = PublicKeyHandle::from_str(input) {
        return Ok(handle);
    }
    let public_key = PublicKey::from_str(input)?;
    Ok((&public_key).into())
}

fn implicit_account_id(public_key: &PublicKey) -> Option<AccountId> {
    let PublicKey::ED25519(key) = public_key else {
        return None;
    };
    AccountId::from_str(&to_hex(&key.0)).ok()
}

async fn implicit_account_should_be_visible(rpc_client: &RpcClient, account_id: AccountId) -> bool {
    match rpc_client
        .view_account(account_id, QueryFinality::Finality(Finality::Final))
        .await
    {
        Ok(account) => account.amount.as_yoctonear() > 0,
        Err(near_min_api::Error::JsonRpc(RpcError {
            error_struct:
                Some(RpcErrorKind::HandlerError(HandlerError::RpcQueryError(
                    RpcQueryError::UnknownAccount { .. },
                ))),
            ..
        })) => false,
        Err(_) => true,
    }
}

fn to_hex(bytes: &[u8]) -> String {
    bytes.iter().map(|byte| format!("{byte:02x}")).collect()
}
