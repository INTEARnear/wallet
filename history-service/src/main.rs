use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use futures::future::join_all;
use near_min_api::{
    types::{AccountId, CryptoHash},
    utils::dec_format,
    ExperimentalTxDetails, RpcClient,
};
use rocksdb::{Options, DB};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::env;
use std::path::PathBuf;
use std::sync::Arc;
use std::{net::SocketAddr, time::Duration};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

#[derive(Clone, Copy)]
enum Network {
    Mainnet,
    Testnet,
}

#[derive(Clone)]
struct AppState {
    rpc_client: Arc<RpcClient>,
    http_client: Arc<reqwest::Client>,
    db: Arc<DB>,
    network: Network,
}

#[derive(Debug, Serialize)]
enum TransactionType {
    TxSigner,
    TxReceiver,
    // FtReceiver, // not implemented yet
}

#[derive(Debug, Deserialize)]
struct HistoricalSignerTransaction {
    #[serde(with = "dec_format")]
    block_timestamp_nanosec: u64,
    receiver_id: AccountId,
    transaction_id: CryptoHash,
}

#[derive(Debug, Deserialize)]
struct HistoricalReceiverTransaction {
    #[serde(with = "dec_format")]
    block_timestamp_nanosec: u64,
    signer_id: AccountId,
    transaction_id: CryptoHash,
}

#[derive(Debug, Serialize)]
struct TransactionResponse {
    block_timestamp_nanosec: u64,
    meta: TransactionMeta,
    transaction: ExperimentalTxDetails,
}

#[derive(Debug, Serialize)]
struct TransactionMeta {
    other_account_id: AccountId,
    tx_type: TransactionType,
}

#[derive(Debug)]
struct TransactionMetadata {
    timestamp: u64,
    account_id: AccountId,
    tx_type: TransactionType,
    transaction_id: CryptoHash,
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

    tracing::info!("Starting history service...");

    // Initialize RocksDB
    let db_path = PathBuf::from("transaction_cache");
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
    let db = DB::open(&opts, &db_path).expect("Failed to open RocksDB");
    let db = Arc::new(db);

    let http_client = Arc::new(reqwest::Client::new());

    let network = match env::var("NETWORK") {
        Ok(network) => match network.as_str() {
            "mainnet" => Network::Mainnet,
            "testnet" => Network::Testnet,
            _ => panic!(
                "Invalid NETWORK environment variable. Should be either 'mainnet' or 'testnet'"
            ),
        },
        Err(_) => {
            panic!("Invalid NETWORK environment variable. Should be either 'mainnet' or 'testnet'")
        }
    };

    let rpc_client = Arc::new({
        let mut rpc_client = RpcClient::new(
            env::var("RPC_URLS")
                .map(|urls| urls.split(',').map(String::from).collect::<Vec<_>>())
                .unwrap_or_else(|_| match network {
                    Network::Mainnet => vec![
                        "https://rpc.intear.tech".to_string(),
                        "https://rpc.near.org".to_string(),
                        "https://rpc.shitzuapes.xyz".to_string(),
                        "https://archival-rpc.mainnet.near.org".to_string(),
                    ],
                    Network::Testnet => vec!["https://rpc.testnet.near.org".to_string()],
                }),
        );
        rpc_client.set_client(
            reqwest::Client::builder()
                .timeout(Duration::from_secs(1)) // Connection might just hang if it's not archival
                .build()
                .unwrap(),
        );
        rpc_client
    });

    let state = AppState {
        rpc_client,
        http_client,
        db,
        network: match env::var("NETWORK") {
            Ok(network) => match network.as_str() {
                "mainnet" => Network::Mainnet,
                "testnet" => Network::Testnet,
                _ => panic!(
                    "Invalid NETWORK environment variable. Should be either 'mainnet' or 'testnet'"
                ),
            },
            Err(_) => panic!(
                "Invalid NETWORK environment variable. Should be either 'mainnet' or 'testnet'"
            ),
        },
    };

    let app = Router::new()
        .route("/api/transactions/{account_id}", get(get_transactions))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = env::var("HISTORY_SERVICE_BIND")
        .map(|s| s.parse().expect("Invalid HISTORY_SERVICE_BIND format"))
        .unwrap_or_else(|_| SocketAddr::from(([127, 0, 0, 1], 3001)));
    tracing::info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("Server started successfully");
    axum::serve(listener, app).await.unwrap();
}

async fn get_transactions(
    State(state): State<AppState>,
    Path(account_id): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    tracing::debug!("Fetching transactions for account: {}", account_id);

    let api_url = match state.network {
        Network::Mainnet => "https://events-v3.intear.tech",
        Network::Testnet => "https://events-v3-testnet.intear.tech",
    };

    // Run both requests in parallel
    let (signer_response, receiver_response) = tokio::join!(
        async {
            tracing::debug!("Fetching signer transactions...");
            let response = state
                .http_client
                .get(format!(
                    "{api_url}/v3/tx_transaction/by_signer_newest?signer_id={account_id}"
                ))
                .send()
                .await
                .map_err(|e| {
                    tracing::error!("Failed to fetch signer transactions: {}", e);
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to fetch signer transactions: {e}"),
                    )
                })?;
            tracing::debug!("Successfully fetched signer transactions");
            response
                .json::<Vec<HistoricalSignerTransaction>>()
                .await
                .map_err(|e| {
                    tracing::error!("Failed to parse signer transactions: {}", e);
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to parse signer transactions: {e}"),
                    )
                })
        },
        async {
            tracing::debug!("Fetching receiver transactions...");
            let response = state
                .http_client
                .get(format!(
                    "{api_url}/v3/tx_transaction/by_receiver_newest?receiver_id={account_id}"
                ))
                .send()
                .await
                .map_err(|e| {
                    tracing::error!("Failed to fetch receiver transactions: {}", e);
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to fetch receiver transactions: {e}"),
                    )
                })?;
            tracing::debug!("Successfully fetched receiver transactions");
            response
                .json::<Vec<HistoricalReceiverTransaction>>()
                .await
                .map_err(|e| {
                    tracing::error!("Failed to parse receiver transactions: {}", e);
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to parse receiver transactions: {e}"),
                    )
                })
        }
    );

    let signer_response = signer_response?;
    let receiver_response = receiver_response?;

    tracing::debug!(
        "Received {} signer and {} receiver transactions",
        signer_response.len(),
        receiver_response.len()
    );

    // Collect all transaction metadata
    let mut transaction_metadata: Vec<TransactionMetadata> = Vec::new();
    let mut seen_transactions = HashSet::new();

    // Process signer transactions
    for tx in signer_response.into_iter().take(50) {
        if seen_transactions.insert(tx.transaction_id) {
            let timestamp = tx.block_timestamp_nanosec;
            transaction_metadata.push(TransactionMetadata {
                timestamp,
                account_id: tx.receiver_id,
                tx_type: TransactionType::TxSigner,
                transaction_id: tx.transaction_id,
            });
        }
    }

    // Process receiver transactions
    for tx in receiver_response.into_iter().take(50) {
        if seen_transactions.insert(tx.transaction_id) {
            let timestamp = tx.block_timestamp_nanosec;
            transaction_metadata.push(TransactionMetadata {
                timestamp,
                account_id: tx.signer_id,
                tx_type: TransactionType::TxReceiver,
                transaction_id: tx.transaction_id,
            });
        }
    }

    // Sort by timestamp in descending order (newest first)
    transaction_metadata.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    transaction_metadata.truncate(50);

    tracing::debug!(
        "Fetching details for {} transactions",
        transaction_metadata.len()
    );

    // Fetch transaction details and create responses in parallel
    let transactions = join_all(transaction_metadata.into_iter().map(|meta| {
        let rpc_client = state.rpc_client.clone();
        let db = state.db.clone();
        async move {
            let Ok(transaction) =
                fetch_transaction_details(rpc_client, db, meta.transaction_id).await
            else {
                return None;
            };
            Some(TransactionResponse {
                block_timestamp_nanosec: meta.timestamp,
                meta: TransactionMeta {
                    other_account_id: meta.account_id,
                    tx_type: meta.tx_type,
                },
                transaction,
            })
        }
    }))
    .await;

    tracing::info!("Successfully processed request for account: {}", account_id);
    Ok(Json(transactions.into_iter().flatten().collect::<Vec<_>>()))
}

async fn fetch_transaction_details(
    rpc_client: Arc<RpcClient>,
    db: Arc<DB>,
    transaction_id: CryptoHash,
) -> Result<ExperimentalTxDetails, near_min_api::Error> {
    tracing::debug!("Fetching transaction details for: {}", transaction_id);

    // Try to get from cache first using blocking thread
    let cached_result = tokio::task::spawn_blocking({
        let db = db.clone();
        move || {
            db.get(transaction_id.as_ref())
                .map_err(|e| {
                    tracing::error!("Failed to read from cache: {}", e);
                    e
                })
                .ok()
                .flatten()
                .and_then(|cached| {
                    serde_json::from_slice::<ExperimentalTxDetails>(&cached)
                        .map_err(|e| {
                            tracing::error!("Failed to deserialize cached transaction: {}", e);
                            e
                        })
                        .ok()
                })
        }
    })
    .await
    .unwrap_or(None);

    if let Some(transaction) = cached_result {
        tracing::debug!("Cache hit for transaction: {}", transaction_id);
        return Ok(transaction);
    }

    tracing::debug!("Cache miss for transaction: {}", transaction_id);
    let tx_details = rpc_client
        .EXPERIMENTAL_tx_status(transaction_id)
        .await
        .inspect_err(|e| {
            tracing::error!("Failed to fetch transaction details: {:?}", e);
        })?;

    if tx_details.final_execution_outcome.is_some() {
        // Cache the result using blocking thread
        let db = db.clone();
        let serialized = serde_json::to_vec(&tx_details).unwrap();

        tokio::task::spawn_blocking(move || {
            if let Err(e) = db.put(transaction_id.as_ref(), &serialized) {
                tracing::error!("Failed to cache transaction {}: {}", transaction_id, e);
            } else {
                tracing::debug!("Cached transaction: {}", transaction_id);
            }
        });
    }

    Ok(tx_details)
}
