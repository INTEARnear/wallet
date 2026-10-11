use axum::{
    Json, Router,
    extract::{Path, Query, State},
    http::StatusCode,
    routing::get,
};
use futures::future::join_all;
use near_min_api::{
    ExperimentalTxDetails, RpcClient,
    types::{AccountId, CryptoHash},
};
use rocksdb::{DB, Options};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::env;
use std::sync::Arc;
use std::{net::SocketAddr, time::Duration};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

#[derive(Clone)]
struct AppState {
    rpc_client: RpcClient,
    http_client: reqwest::Client,
    db: Arc<DB>,
    prices_api_url: String,
}

/// A page of price-indexer's `/transfers`, of transfers and transactions alike
#[derive(Debug, Deserialize)]
struct TransfersPage {
    transfers: Vec<TransfersRow>,
    next_cursor: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
enum TransfersRow {
    Transaction {
        timestamp_millis: u64,
        transaction_id: CryptoHash,
        sender: AccountId,
        receiver: AccountId,
    },
    /// `sender` is None for a mint, `receiver` is None for a burn
    Transfer {
        timestamp_millis: u64,
        transaction_id: CryptoHash,
        token: AccountId,
        sender: Option<AccountId>,
        receiver: Option<AccountId>,
    },
}

impl TransfersRow {
    /// The transaction this row puts in `account_id`'s history, with whoever is on the other side
    /// of it, or the token for a mint or burn.
    fn into_history_entry(self, account_id: &AccountId) -> HistoryEntry {
        match self {
            TransfersRow::Transaction {
                timestamp_millis,
                transaction_id,
                sender,
                receiver,
            } => HistoryEntry {
                transaction_id,
                timestamp_millis,
                other_account_id: if sender == *account_id {
                    receiver
                } else {
                    sender
                },
            },
            TransfersRow::Transfer {
                timestamp_millis,
                transaction_id,
                token,
                sender,
                receiver,
            } => HistoryEntry {
                transaction_id,
                timestamp_millis,
                other_account_id: if sender.as_ref() == Some(account_id) {
                    receiver
                } else {
                    sender
                }
                .unwrap_or(token),
            },
        }
    }
}

#[derive(Debug, Deserialize)]
struct HistoryQuery {
    cursor: Option<String>,
}

#[derive(Debug, Serialize)]
struct HistoryPage {
    transactions: Vec<HistoryTransaction>,
    next_cursor: Option<String>,
}

#[derive(Debug, Serialize)]
struct HistoryEntry {
    transaction_id: CryptoHash,
    timestamp_millis: u64,
    other_account_id: AccountId,
}

#[derive(Debug, Serialize)]
struct HistoryTransaction {
    #[serde(flatten)]
    entry: HistoryEntry,
    transaction: ExperimentalTxDetails,
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

    let rpc_urls: Vec<String> = env::var("RPC_URLS")
        .expect("RPC_URLS must be set")
        .split(',')
        .map(String::from)
        .collect();
    let mut rpc_client = RpcClient::new(rpc_urls);
    rpc_client.set_client(
        reqwest::Client::builder()
            .timeout(Duration::from_secs(1)) // Connection might just hang if it's not archival
            .build()
            .unwrap(),
    );
    let prices_api_url = env::var("PRICES_API_URL").expect("PRICES_API_URL must be set");

    let state = AppState {
        rpc_client,
        http_client: reqwest::Client::new(),
        db: Arc::new(open_transaction_cache()),
        prices_api_url,
    };
    let app = Router::new()
        .route("/api/transactions/{account_id}", get(get_transactions))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = env::var("HISTORY_SERVICE_BIND")
        .map(|s| s.parse().expect("Invalid HISTORY_SERVICE_BIND format"))
        .unwrap_or_else(|_| SocketAddr::from(([127, 0, 0, 1], 3001)));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("Server listening on {addr}");
    axum::serve(listener, app).await.unwrap();
}

/// Finished transactions' details by hash, so each is only fetched from RPC once
fn open_transaction_cache() -> DB {
    let mut opts = Options::default();
    opts.create_if_missing(true);
    opts.set_compression_type(rocksdb::DBCompressionType::Zstd);
    opts.set_bottommost_compression_type(rocksdb::DBCompressionType::Zstd);
    let dict_size = 2 * 16384;
    let max_train_bytes = dict_size * 100;
    opts.set_compression_options(
        /*window_bits */ -14, /*compression_level */ 32767,
        /*compression_strategy */ 0, dict_size,
    );
    opts.set_zstd_max_train_bytes(max_train_bytes);
    opts.set_bottommost_compression_options(
        /*window_bits */ -14, /*compression_level */ 32767,
        /*compression_strategy */ 0, dict_size, /*enabled */ true,
    );
    opts.set_bottommost_zstd_max_train_bytes(max_train_bytes, true);
    DB::open(&opts, "transaction_cache").expect("Failed to open RocksDB")
}

/// A page of the transactions `account_id` sent or received, and the ones that moved its tokens or
/// NEAR, such as an incoming FT transfer, newest first.
async fn get_transactions(
    State(state): State<AppState>,
    Path(account_id): Path<AccountId>,
    Query(query): Query<HistoryQuery>,
) -> Result<Json<HistoryPage>, (StatusCode, String)> {
    let page = fetch_transfers(&state, &account_id, query.cursor)
        .await
        .map_err(|e| {
            tracing::error!("Failed to fetch transfers of {account_id}: {e}");
            (
                StatusCode::BAD_GATEWAY,
                format!("Failed to fetch transfers: {e}"),
            )
        })?;

    // A transaction and the transfers it made are separate rows, so each transaction is shown once
    let mut seen_transactions = HashSet::new();
    let entries = page
        .transfers
        .into_iter()
        .map(|row| row.into_history_entry(&account_id))
        .filter(|entry| seen_transactions.insert(entry.transaction_id));

    let state = &state;
    let transactions = join_all(entries.map(|entry| async move {
        let transaction = transaction_details(state, entry.transaction_id).await?;
        Some(HistoryTransaction { entry, transaction })
    }))
    .await;

    Ok(Json(HistoryPage {
        transactions: transactions.into_iter().flatten().collect(),
        next_cursor: page.next_cursor,
    }))
}

async fn fetch_transfers(
    state: &AppState,
    account_id: &AccountId,
    cursor: Option<String>,
) -> reqwest::Result<TransfersPage> {
    let mut request = state
        .http_client
        .get(format!("{}/transfers", state.prices_api_url))
        .query(&[
            ("account", account_id.as_str()),
            ("include_transactions", "true"),
            ("limit", "50"),
        ]);
    if let Some(cursor) = cursor {
        request = request.query(&[("cursor", cursor)]);
    }
    request.send().await?.error_for_status()?.json().await
}

/// From the cache, or from RPC, caching it once it's finished executing. None if RPC fails.
async fn transaction_details(
    state: &AppState,
    transaction_id: CryptoHash,
) -> Option<ExperimentalTxDetails> {
    let db = Arc::clone(&state.db);
    let cached = tokio::task::spawn_blocking(move || db.get(transaction_id))
        .await
        .expect("cache read panicked");
    match cached {
        Ok(Some(bytes)) => match serde_json::from_slice(&bytes) {
            Ok(transaction) => return Some(transaction),
            Err(e) => tracing::error!("Failed to parse cached {transaction_id}: {e}"),
        },
        Ok(None) => {}
        Err(e) => tracing::error!("Failed to read {transaction_id} from the cache: {e}"),
    }

    let transaction = state
        .rpc_client
        .EXPERIMENTAL_tx_status(transaction_id)
        .await
        .inspect_err(|e| tracing::error!("Failed to fetch {transaction_id}: {e:?}"))
        .ok()?;
    if transaction.final_execution_outcome.is_some() {
        let db = Arc::clone(&state.db);
        let serialized = serde_json::to_vec(&transaction).unwrap();
        tokio::task::spawn_blocking(move || {
            if let Err(e) = db.put(transaction_id, serialized) {
                tracing::error!("Failed to cache {transaction_id}: {e}");
            }
        })
        .await
        .expect("cache write panicked");
    }
    Some(transaction)
}
