use axum::{
    extract::{Json, State},
    http::StatusCode,
    response::IntoResponse,
    routing::post,
    Router,
};
use dotenv::dotenv;
use near_min_api::{
    types::{
        near_crypto::{PublicKey, SecretKey},
        AccountId, Action, Finality, FunctionCallAction, NearGas, NearToken, SignedTransaction,
        Transaction, TransactionV0, TxExecutionStatus,
    },
    QueryFinality, RpcClient,
};
use rand::seq::SliceRandom;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, env, net::SocketAddr, sync::Arc, time::Duration};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

#[derive(Debug, Deserialize)]
struct CreateAccountRequest {
    account_id: AccountId,
    public_key: PublicKey,
}

#[derive(Debug, Serialize)]
struct CreateAccountResponse {
    success: bool,
    message: String,
}

#[derive(Clone)]
struct AppState {
    rpc_client: Arc<RpcClient>,
    relayer_id: AccountId,
    key_queues: Arc<HashMap<PublicKey, Arc<Mutex<()>>>>,
    relayer_keys: Vec<SecretKey>,
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

    tracing::info!("Starting account creation service...");

    let relayer_id = env::var("RELAYER_ID")
        .expect("RELAYER_ID must be set")
        .parse::<AccountId>()
        .expect("Invalid RELAYER_ID format");
    let relayer_private_keys = env::var("RELAYER_PRIVATE_KEYS")
        .expect("RELAYER_PRIVATE_KEYS must be set")
        .split(',')
        .map(|key| {
            key.trim()
                .parse::<SecretKey>()
                .expect("Invalid private key format")
        })
        .collect::<Vec<_>>();

    if relayer_private_keys.is_empty() {
        panic!("At least one private key must be provided in RELAYER_PRIVATE_KEYS");
    }

    // Create a queue for each key
    let key_queues = Arc::new(
        relayer_private_keys
            .iter()
            .map(|key| (key.public_key(), Arc::new(Mutex::new(()))))
            .collect::<HashMap<_, _>>(),
    );

    let rpc_client = Arc::new(RpcClient::new(
        env::var("RPC_URLS")
            .map(|urls| urls.split(',').map(String::from).collect::<Vec<_>>())
            .unwrap_or_else(|_| {
                vec![
                    "https://rpc.intear.tech".to_string(),
                    "https://rpc.near.org".to_string(),
                    "https://rpc.shitzuapes.xyz".to_string(),
                    "https://archival-rpc.mainnet.near.org".to_string(),
                ]
            }),
    ));

    let state = AppState {
        rpc_client,
        relayer_id,
        key_queues,
        relayer_keys: relayer_private_keys,
    };

    let app = Router::new()
        .route("/create", post(create_account))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = env::var("ACCOUNT_CREATION_SERVICE_BIND")
        .map(|s| {
            s.parse()
                .expect("Invalid ACCOUNT_CREATION_SERVICE_BIND format")
        })
        .unwrap_or_else(|_| SocketAddr::from(([127, 0, 0, 1], 3002)));
    tracing::info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind");
    tracing::info!("Server started successfully");
    axum::serve(listener, app).await.unwrap();
}

#[axum::debug_handler]
async fn create_account(
    State(state): State<AppState>,
    Json(payload): Json<CreateAccountRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    tracing::info!(
        "Received account creation request for {}",
        payload.account_id
    );

    let (relayer_key, queue) = loop {
        let key = state
            .relayer_keys
            .choose(&mut rand::thread_rng())
            .expect("No private keys available");
        let public_key = key.public_key();
        if let Some(queue) = state.key_queues.get(&public_key) {
            break (key.clone(), queue.clone());
        }
    };

    let _guard = queue.lock().await;

    let access_key = state
        .rpc_client
        .get_access_key(
            state.relayer_id.clone(),
            relayer_key.public_key(),
            QueryFinality::Finality(Finality::None),
        )
        .await
        .map_err(|e| {
            tracing::error!("Failed to get access key: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to get access key".to_string(),
            )
        })?;

    let create_account_action = Action::FunctionCall(Box::new(FunctionCallAction {
        method_name: "create_account".to_string(),
        args: serde_json::to_vec(&serde_json::json!({
            "new_account_id": payload.account_id,
            "new_public_key": payload.public_key,
        }))
        .unwrap(),
        deposit: NearToken::from_yoctonear(0),
        gas: NearGas::from_tgas(30).as_gas(),
    }));

    let tx = Transaction::V0(TransactionV0 {
        signer_id: state.relayer_id.clone(),
        public_key: relayer_key.public_key(),
        nonce: access_key.nonce + 1,
        receiver_id: "near".parse().unwrap(),
        block_hash: state
            .rpc_client
            .fetch_recent_block_hash()
            .await
            .map_err(|e| {
                tracing::error!("Failed to fetch block hash: {}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Failed to fetch block hash".to_string(),
                )
            })?,
        actions: vec![create_account_action],
    });

    let signature = relayer_key.sign(tx.get_hash_and_size().0.as_ref());
    let signed_tx = SignedTransaction::new(signature, tx);

    // Send transaction
    let pending_tx = state.rpc_client.send_tx(signed_tx).await.map_err(|e| {
        tracing::error!("Failed to send transaction: {}", e);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to send transaction".to_string(),
        )
    })?;

    // Wait for transaction to be included
    pending_tx
        .wait_for(TxExecutionStatus::Final, Duration::from_secs(60))
        .await
        .map_err(|e| {
            tracing::error!("Transaction not included: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Transaction not included".to_string(),
            )
        })?;

    tracing::info!("Successfully created account for {}", payload.account_id);
    Ok(Json(CreateAccountResponse {
        success: true,
        message: "Account created successfully".to_string(),
    }))
}
