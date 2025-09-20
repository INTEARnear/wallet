use alloy_primitives::Signature;
use axum::{
    Router,
    extract::{Json, State},
    http::StatusCode,
    response::IntoResponse,
    routing::post,
};
use dotenv::dotenv;
use near_min_api::{
    QueryFinality, RpcClient,
    types::{
        AccountId, Action, BlockReference, CreateAccountAction, CryptoHash, FinalExecutionStatus,
        Finality, FunctionCallAction, NearGas, NearToken, SignedDelegateAction, SignedTransaction,
        Transaction, TransactionV0, TxExecutionStatus,
        near_crypto::{PublicKey, SecretKey},
    },
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
#[serde(tag = "type", rename_all = "kebab-case")]
enum RecoverAccountRequest {
    EthereumSignature {
        account_id: AccountId,
        ethereum_signature: Signature,
        message: String,
    },
    SolanaSignature {
        account_id: AccountId,
        solana_signature: solana_signature::Signature,
        message: String,
    },
}

#[derive(Debug, Serialize)]
struct RecoverAccountResponse {
    success: bool,
    message: String,
    transaction_hash: Option<String>,
}

#[derive(Debug, Deserialize)]
struct RelaySignedDelegateActionRequest {
    signed_delegate_action: SignedDelegateAction,
}

#[derive(Debug, Serialize)]
struct RelaySignedDelegateActionResponse {
    message: String,
    transaction_hash: Option<CryptoHash>,
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
                    "https://rpc.intea.rs".to_string(),
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
        .route(
            "/relay-signed-delegate-action",
            post(relay_signed_delegate_action),
        )
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
            "new_account_id": payload.account_id.clone(),
            "new_public_key": payload.public_key.clone(),
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
            .block(BlockReference::Finality(Finality::Final))
            .await
            .map(|block| block.header.hash)
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
    let (account_id, signature_data, message) = match payload {
        RecoverAccountRequest::EthereumSignature {
            account_id,
            ethereum_signature,
            message,
        } => {
            tracing::info!(
                "Received Ethereum account recovery request for {}",
                account_id
            );
            (
                account_id,
                serde_json::to_value(ethereum_signature).unwrap(),
                message,
            )
        }
        RecoverAccountRequest::SolanaSignature {
            account_id,
            solana_signature,
            message,
        } => {
            tracing::info!(
                "Received Solana account recovery request for {}",
                account_id
            );
            (
                account_id,
                serde_json::to_value(solana_signature).unwrap(),
                message,
            )
        }
    };

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
                "signature": signature_data,
                "message": message,
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
        receiver_id: account_id.clone(),
        block_hash: state
            .rpc_client
            .block(BlockReference::Finality(Finality::Final))
            .await
            .map(|block| block.header.hash)
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
                        tracing::info!("Successfully recovered account for {}", account_id);
                        Ok(Json(RecoverAccountResponse {
                            success: true,
                            message: format!(
                                "Account recovered successfully in transaction {}",
                                outcome.transaction.hash
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

#[axum::debug_handler]
async fn relay_signed_delegate_action(
    State(state): State<AppState>,
    Json(payload): Json<RelaySignedDelegateActionRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    validate_signed_delegate_action(state.clone(), &payload.signed_delegate_action).await?;

    let signed_delegate_action = payload.signed_delegate_action;
    let receiver_id = signed_delegate_action.delegate_action.sender_id.clone();

    tracing::info!(
        "Received relay request for delegate action from {} to {}",
        signed_delegate_action.delegate_action.sender_id,
        signed_delegate_action.delegate_action.receiver_id
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
        .await;

    let access_key = match access_key {
        Ok(key) => key,
        Err(e) => {
            tracing::error!("Failed to get access key: {}", e);
            return Ok(Json(RelaySignedDelegateActionResponse {
                message: format!("Failed to get access key: {}", e),
                transaction_hash: None,
            }));
        }
    };

    let delegate_action = Action::Delegate(Box::new(signed_delegate_action));

    let block_hash = match state
        .rpc_client
        .block(BlockReference::Finality(Finality::Final))
        .await
        .map(|block| block.header.hash)
    {
        Ok(hash) => hash,
        Err(e) => {
            tracing::error!("Failed to fetch block hash: {}", e);
            return Ok(Json(RelaySignedDelegateActionResponse {
                message: format!("Failed to fetch block hash: {}", e),
                transaction_hash: None,
            }));
        }
    };

    let tx = Transaction::V0(TransactionV0 {
        signer_id: state.relayer_id.clone(),
        public_key: relayer_key.public_key(),
        nonce: access_key.nonce + 1,
        receiver_id: receiver_id.clone(),
        block_hash,
        actions: vec![delegate_action],
    });

    let (tx_hash, _) = tx.get_hash_and_size();
    let signature = relayer_key.sign(tx_hash.as_ref());
    let signed_tx = SignedTransaction::new(signature, tx);

    match state.rpc_client.send_tx(signed_tx).await {
        Ok(_) => Ok(Json(RelaySignedDelegateActionResponse {
            message: "Transaction sent".to_string(),
            transaction_hash: Some(tx_hash),
        })),
        Err(e) => {
            tracing::error!("Failed to send transaction: {}", e);
            Ok(Json(RelaySignedDelegateActionResponse {
                message: format!("Failed to send transaction: {}", e),
                transaction_hash: None,
            }))
        }
    }
}

async fn validate_signed_delegate_action(
    #[allow(unused)] state: AppState,
    signed_delegate_action: &SignedDelegateAction,
) -> Result<(), (StatusCode, String)> {
    if !signed_delegate_action.verify() {
        return Err((StatusCode::BAD_REQUEST, "Invalid signature".to_string()));
    }
    let is_subaccount_creation = {
        if !signed_delegate_action
            .delegate_action
            .receiver_id
            .is_sub_account_of(&signed_delegate_action.delegate_action.sender_id)
        {
            tracing::error!("Receiver ID is not a subaccount of sender ID");
            false
        } else if signed_delegate_action.delegate_action.actions.len() != 2 {
            tracing::error!("Actions length is not 1");
            false
        } else if let Action::CreateAccount(CreateAccountAction {}) =
            signed_delegate_action.delegate_action.actions[0]
                .clone()
                .into()
            && let Action::AddKey(_) = signed_delegate_action.delegate_action.actions[1]
                .clone()
                .into()
        {
            true
        } else {
            tracing::error!("Actions is not a CreateAccount and AddKey action");
            false
        }
    };
    if !is_subaccount_creation {
        return Err((
            StatusCode::BAD_REQUEST,
            "Not a supported transaction".to_string(),
        ));
    }
    Ok(())
}
