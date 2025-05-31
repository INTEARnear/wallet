use alloy_primitives::Signature;
use axum::{
    extract::{Json, State},
    http::StatusCode,
    response::IntoResponse,
    routing::post,
    Router,
};
use chrono::{DateTime, Utc};
use dotenv::dotenv;
use near_min_api::{
    types::{
        near_crypto::{PublicKey, SecretKey},
        AccountId, Action, FinalExecutionStatus, Finality, FunctionCallAction, NearGas, NearToken,
        SignedTransaction, Transaction, TransactionV0, TxExecutionStatus,
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

#[derive(Debug, Deserialize)]
struct RecoverAccountRequest {
    account_id: AccountId,
    public_key: PublicKey,
    ethereum_signature: Signature,
    message: String,
    timestamp: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
struct RecoverAccountResponse {
    success: bool,
    message: String,
    transaction_hash: Option<String>,
}

#[derive(Clone, Copy)]
enum Network {
    Mainnet,
    Testnet,
}

#[derive(Clone)]
struct AppState {
    rpc_client: Arc<RpcClient>,
    relayer_id: AccountId,
    key_queues: Arc<HashMap<PublicKey, Arc<Mutex<()>>>>,
    relayer_keys: Vec<SecretKey>,
    desired_finality: TxExecutionStatus,
    network: Network,
    deposit_amount: NearToken,
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

    let deposit_amount = env::var("CREATE_ACCOUNT_DEPOSIT")
        .map(|s| {
            s.parse::<NearToken>()
                .expect("Invalid CREATE_ACCOUNT_DEPOSIT format")
        })
        .unwrap_or(NearToken::from_yoctonear(0));

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

    let rpc_client = Arc::new(RpcClient::new(
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
    ));

    let state = AppState {
        rpc_client,
        relayer_id,
        key_queues,
        relayer_keys: relayer_private_keys,
        desired_finality: env::var("FINALITY")
            .map(|s| match s.as_str() {
                "NONE" => TxExecutionStatus::None,
                "INCLUDED" => TxExecutionStatus::Included,
                "EXECUTED_OPTIMISTIC" => TxExecutionStatus::ExecutedOptimistic,
                "INCLUDED_FINAL" => TxExecutionStatus::IncludedFinal,
                "EXECUTED" => TxExecutionStatus::Executed,
                "FINAL" => TxExecutionStatus::Final,
                _ => TxExecutionStatus::Final,
            })
            .unwrap_or(TxExecutionStatus::Final),
        network,
        deposit_amount,
    };

    let app = Router::new()
        .route("/create", post(create_account))
        .route("/recover", post(recover_account))
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

    let account = state
        .rpc_client
        .view_account(
            state.relayer_id.clone(),
            QueryFinality::Finality(Finality::None),
        )
        .await
        .map_err(|e| {
            tracing::error!("Failed to view account: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to view account balance".to_string(),
            )
        })?;

    let actual_deposit = if account.amount >= state.deposit_amount.saturating_mul(2) {
        state.deposit_amount
    } else {
        tracing::warn!(
            "Insufficient balance for 2x deposit. Account balance: {}, Required: {}",
            account.amount,
            state.deposit_amount
        );
        NearToken::from_yoctonear(0)
    };

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
        deposit: actual_deposit,
        gas: NearGas::from_tgas(30).as_gas(),
    }));

    let tx = Transaction::V0(TransactionV0 {
        signer_id: state.relayer_id.clone(),
        public_key: relayer_key.public_key(),
        nonce: access_key.nonce + 1,
        receiver_id: match state.network {
            Network::Mainnet => "near".parse().unwrap(),
            Network::Testnet => "testnet".parse().unwrap(),
        },
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
        .wait_for(state.desired_finality, Duration::from_secs(60))
        .await
        .map_err(|e| {
            tracing::error!("Transaction not included: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Transaction not included".to_string(),
            )
        })?;
    let tx = pending_tx.fetch_details().await;

    match tx {
        Ok(tx) => {
            if let Some(outcome) = tx.final_execution_outcome {
                match outcome.status {
                    FinalExecutionStatus::SuccessValue(_) => {
                        tracing::info!("Successfully created account for {}", payload.account_id);
                        Ok(Json(CreateAccountResponse {
                            success: true,
                            message: format!(
                                "Account created successfully in transaction {}",
                                outcome.transaction.hash
                            ),
                        }))
                    }
                    _ => {
                        tracing::error!("Transaction failed: {:?}", outcome.status);
                        Ok(Json(CreateAccountResponse {
                            success: false,
                            message: format!("Transaction failed: {:?}", outcome.status),
                        }))
                    }
                }
            } else {
                tracing::error!("Transaction outcome not found");
                Ok(Json(CreateAccountResponse {
                    success: false,
                    message: "Transaction outcome not found".to_string(),
                }))
            }
        }
        Err(e) => {
            tracing::error!("Failed to fetch transaction details: {}", e);
            Ok(Json(CreateAccountResponse {
                success: false,
                message: format!("Failed to fetch transaction details: {e}"),
            }))
        }
    }
}

#[axum::debug_handler]
async fn recover_account(
    State(state): State<AppState>,
    Json(payload): Json<RecoverAccountRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    tracing::info!(
        "Received account recovery request for {}",
        payload.account_id
    );

    let now = Utc::now();
    let time_diff = (now - payload.timestamp).num_seconds();
    if time_diff < 0 {
        return Err((
            StatusCode::BAD_REQUEST,
            "Signature timestamp cannot be in the future".to_string(),
        ));
    }
    if time_diff > 300 {
        return Err((
            StatusCode::BAD_REQUEST,
            "Signature timestamp is too old".to_string(),
        ));
    }

    let recovered_address = payload
        .ethereum_signature
        .recover_address_from_msg(&payload.message)
        .map_err(|e| {
            tracing::error!("Failed to recover address from signature: {}", e);
            (StatusCode::BAD_REQUEST, "Invalid signature".to_string())
        })?;

    tracing::info!("Recovering with Ethereum address: {:#}", recovered_address);

    let expected_message = format!(
        "I want to sign in to {} with key {}. The current date is {} UTC",
        payload.account_id,
        payload.public_key,
        payload.timestamp.to_rfc3339()
    );

    if payload.message != expected_message {
        return Err((
            StatusCode::BAD_REQUEST,
            "Message format is invalid".to_string(),
        ));
    }

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

    let recover_action = Action::FunctionCall(Box::new(FunctionCallAction {
        method_name: "ext1_recover".to_string(),
        args: serde_json::to_vec(&serde_json::json!({
            "message": serde_json::to_string(&serde_json::json!({
                "signature": payload.ethereum_signature,
                "message": payload.message
            })).unwrap(),
        }))
        .unwrap(),
        deposit: NearToken::from_yoctonear(0),
        gas: NearGas::from_tgas(30).as_gas(),
    }));

    let tx = Transaction::V0(TransactionV0 {
        signer_id: state.relayer_id.clone(),
        public_key: relayer_key.public_key(),
        nonce: access_key.nonce + 1,
        receiver_id: payload.account_id.clone(),
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
        actions: vec![recover_action],
    });

    let signature = relayer_key.sign(tx.get_hash_and_size().0.as_ref());
    let signed_tx = SignedTransaction::new(signature, tx);

    let pending_tx = state.rpc_client.send_tx(signed_tx).await.map_err(|e| {
        tracing::error!("Failed to send transaction: {}", e);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to send transaction".to_string(),
        )
    })?;

    pending_tx
        .wait_for(state.desired_finality, Duration::from_secs(60))
        .await
        .map_err(|e| {
            tracing::error!("Transaction not included: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Transaction not included".to_string(),
            )
        })?;
    let tx = pending_tx.fetch_details().await;

    match tx {
        Ok(tx) => {
            if let Some(outcome) = tx.final_execution_outcome {
                match outcome.status {
                    FinalExecutionStatus::SuccessValue(_) => {
                        tracing::info!("Successfully recovered account for {}", payload.account_id);
                        Ok(Json(RecoverAccountResponse {
                            success: true,
                            message: format!(
                                "Account recovered successfully in transaction {}",
                                outcome.transaction.hash.to_string()
                            ),
                            transaction_hash: Some(outcome.transaction.hash.to_string()),
                        }))
                    }
                    _ => {
                        tracing::error!("Transaction failed: {:?}", outcome.status);
                        Ok(Json(RecoverAccountResponse {
                            success: false,
                            message: format!("Transaction failed: {:?}", outcome.status),
                            transaction_hash: None,
                        }))
                    }
                }
            } else {
                tracing::error!("Transaction outcome not found");
                Ok(Json(RecoverAccountResponse {
                    success: false,
                    message: "Transaction outcome not found".to_string(),
                    transaction_hash: None,
                }))
            }
        }
        Err(e) => {
            tracing::error!("Failed to fetch transaction details: {}", e);
            Ok(Json(RecoverAccountResponse {
                success: false,
                message: format!("Failed to fetch transaction details: {e}"),
                transaction_hash: None,
            }))
        }
    }
}
