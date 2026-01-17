mod router;

use alloy_primitives::Signature;
use axum::{
    Router,
    extract::{Json, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{get, post},
};
use base64::{Engine, prelude::BASE64_STANDARD};
use borsh::{BorshDeserialize, BorshSerialize};
use dotenvy::dotenv;
use near_min_api::{
    QueryFinality, RpcClient,
    types::{
        AccessKey, AccountId, Action, AddKeyAction, BlockHeight, BlockReference,
        CreateAccountAction, CryptoHash, FinalExecutionStatus, Finality, FunctionCallAction,
        NearGas, NearToken, SignedDelegateAction, SignedTransaction, Transaction, TransactionV0,
        TxExecutionStatus, U64, U128,
        near_crypto::{PublicKey, SecretKey},
    },
};
use rand::seq::SliceRandom;
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use serde_with::serde_as;
use std::{
    collections::{BTreeMap, HashMap},
    env,
    fmt::Display,
    hash::Hash,
    net::SocketAddr,
    str::FromStr,
    sync::Arc,
    time::{Duration, SystemTime},
};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

use crate::router::{Amount, DexId, Slippage, SwapRequest, TokenId, get_routes};

#[derive(Debug, Deserialize, Clone)]
struct RelayerConfig {
    relayer_id: AccountId,
    relayer_private_keys: Vec<SecretKey>,
    rpc_urls: Vec<String>,
    #[serde(default)]
    finality: TxExecutionStatus,
    factory: Option<AccountId>,
    create_account_deposit: Option<String>,
    intear_dex: Option<AccountId>,
    slimedrop: Option<AccountId>,
}

struct RelayerState {
    rpc_client: Arc<RpcClient>,
    relayer_id: AccountId,
    key_queues: Arc<HashMap<PublicKey, Arc<Mutex<()>>>>,
    relayer_keys: Vec<SecretKey>,
    desired_finality: TxExecutionStatus,
    factory: Option<AccountId>,
    create_account_deposit_amount: NearToken,
    intear_dex: Option<AccountId>,
    slimedrop: Option<AccountId>,
}

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

#[derive(Debug, Serialize)]
struct GetRootResponse {
    root_account_id: AccountId,
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

#[derive(Clone)]
struct AppState {
    relayers: Arc<HashMap<String, RelayerState>>,
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

    let config_content =
        std::fs::read_to_string("relayers.json").expect("Failed to read relayers config file");

    let relayers_config: HashMap<String, RelayerConfig> =
        serde_json::from_str(&config_content).expect("Failed to parse relayers config JSON");

    tracing::info!("Loaded {} relayers from config", relayers_config.len());

    let mut relayers = HashMap::new();

    for (relayer_id, config) in relayers_config {
        tracing::info!("Initializing relayer: {}", relayer_id);

        if config.relayer_private_keys.is_empty() {
            panic!(
                "At least one private key must be provided for relayer {}",
                relayer_id
            );
        }

        let key_queues = Arc::new(
            config
                .relayer_private_keys
                .iter()
                .map(|key| (key.public_key(), Arc::new(Mutex::new(()))))
                .collect::<HashMap<_, _>>(),
        );

        let rpc_client = Arc::new(RpcClient::new(config.rpc_urls.clone()));

        let create_account_deposit_amount = config
            .create_account_deposit
            .map(|deposit| {
                deposit.parse::<NearToken>().unwrap_or_else(|_| panic!("Invalid CREATE_ACCOUNT_DEPOSIT format for relayer {}",
                    relayer_id))
            })
            .unwrap_or_default();

        if let Some(ref slimedrop) = config.slimedrop {
            tracing::info!("Relayer {} - Slimedrop enabled: {}", relayer_id, slimedrop);
        }

        if let Some(ref dex) = config.intear_dex {
            tracing::info!("Relayer {} - Intear DEX enabled: {}", relayer_id, dex);
        }

        let relayer_state = RelayerState {
            rpc_client,
            relayer_id: config.relayer_id.clone(),
            key_queues,
            relayer_keys: config.relayer_private_keys,
            desired_finality: config.finality,
            factory: config.factory.clone(),
            create_account_deposit_amount,
            intear_dex: config.intear_dex.clone(),
            slimedrop: config.slimedrop.clone(),
        };

        if let Some(intear_dex) = config.intear_dex.clone() {
            let balance_check_state = relayer_state.clone();
            let relayer_id_check = relayer_id.clone();
            tokio::spawn(async move {
                let mut interval = tokio::time::interval(Duration::from_secs(60));
                loop {
                    interval.tick().await;
                    check_otc_balances(&balance_check_state, &intear_dex, &relayer_id_check).await;
                }
            });
        }

        relayers.insert(relayer_id, relayer_state);
    }

    let state = AppState {
        relayers: Arc::new(relayers),
    };

    let app = Router::new()
        .route("/create", post(create_account))
        .route("/recover", post(recover_account))
        .route(
            "/relay-signed-delegate-action",
            post(relay_signed_delegate_action),
        )
        .route("/swap-for-gas", post(swap_for_gas))
        .route("/get-root", get(get_root))
        .layer(CorsLayer::permissive())
        .with_state(state.clone());

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

impl Clone for RelayerState {
    fn clone(&self) -> Self {
        Self {
            rpc_client: self.rpc_client.clone(),
            relayer_id: self.relayer_id.clone(),
            key_queues: self.key_queues.clone(),
            relayer_keys: self.relayer_keys.clone(),
            desired_finality: self.desired_finality.clone(),
            factory: self.factory.clone(),
            create_account_deposit_amount: self.create_account_deposit_amount,
            intear_dex: self.intear_dex.clone(),
            slimedrop: self.slimedrop.clone(),
        }
    }
}

fn get_relayer_state(
    state: &AppState,
    headers: &HeaderMap,
) -> Result<RelayerState, (StatusCode, String)> {
    let relayer_id = headers
        .get("x-relayer-id")
        .and_then(|h| h.to_str().ok())
        .ok_or_else(|| {
            (
                StatusCode::BAD_REQUEST,
                "Missing x-relayer-id header".to_string(),
            )
        })?;

    state.relayers.get(relayer_id).cloned().ok_or_else(|| {
        (
            StatusCode::NOT_FOUND,
            format!("Relayer not found: {}", relayer_id),
        )
    })
}

async fn get_root(
    State(app_state): State<AppState>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let state = get_relayer_state(&app_state, &headers)?;

    let root_account_id = state.factory.as_ref().unwrap_or(&state.relayer_id).clone();

    Ok(Json(GetRootResponse { root_account_id }))
}

#[axum::debug_handler]
async fn create_account(
    State(app_state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<CreateAccountRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let state = get_relayer_state(&app_state, &headers)?;

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

    let actual_deposit = if account.amount >= state.create_account_deposit_amount.saturating_mul(2)
    {
        state.create_account_deposit_amount
    } else {
        tracing::warn!(
            "Insufficient balance for 2x deposit. Account balance: {}, Required: {}",
            account.amount,
            state.create_account_deposit_amount
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

    let create_account_actions = if state.factory.is_none() {
        vec![
            Action::CreateAccount(CreateAccountAction {}),
            Action::AddKey(Box::new(AddKeyAction {
                public_key: payload.public_key.clone(),
                access_key: AccessKey::full_access(),
            })),
        ]
    } else {
        vec![Action::FunctionCall(Box::new(FunctionCallAction {
            method_name: "create_account".to_string(),
            args: serde_json::to_vec(&serde_json::json!({
                "new_account_id": payload.account_id.clone(),
                "new_public_key": payload.public_key.clone(),
            }))
            .unwrap(),
            deposit: actual_deposit,
            gas: NearGas::from_tgas(30).into(),
        }))]
    };

    let tx = Transaction::V0(TransactionV0 {
        signer_id: state.relayer_id.clone(),
        public_key: relayer_key.public_key(),
        nonce: access_key.nonce + 1,
        receiver_id: match state.factory {
            Some(factory) => factory,
            None => {
                if !payload.account_id.is_sub_account_of(&state.relayer_id) {
                    return Err((
                        StatusCode::BAD_REQUEST,
                        "Account ID is not a subaccount of relayer ID".to_string(),
                    ));
                }
                payload.account_id.clone()
            }
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
        actions: create_account_actions,
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
    State(app_state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<RecoverAccountRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let state = get_relayer_state(&app_state, &headers)?;

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
        gas: NearGas::from_tgas(30).into(),
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
    State(app_state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<RelaySignedDelegateActionRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let state = get_relayer_state(&app_state, &headers)?;

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

const SWAP_FOR_GAS_WHITELIST: &[&str] = &[
    "jambo-1679.meme-cooking.near",
    "usdt.tether-token.near",
    "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    "nbtc.bridge.near",
    "zec.omft.near",
];

#[axum::debug_handler]
async fn swap_for_gas(
    State(app_state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<SwapForGasRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let state = get_relayer_state(&app_state, &headers)?;

    if state.intear_dex.is_none() {
        return Err((
            StatusCode::NOT_FOUND,
            "Swap for gas functionality is not available on this network".to_string(),
        ));
    }

    if !SWAP_FOR_GAS_WHITELIST.contains(&payload.token_contract_id.as_str()) {
        return Err((
            StatusCode::BAD_REQUEST,
            "This token can't be used in swap for gas".to_string(),
        ));
    }

    tracing::info!(
        "Received swap for gas request from user {}",
        payload.user_id
    );
    let relayer_key = state
        .relayer_keys
        .first()
        .expect("No private keys available");
    let nonce = rand::random::<u128>();
    let current_time_millis = SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64;
    let expiry_millis = current_time_millis + 90_000;
    let inverse_route = get_routes(SwapRequest {
        token_in: TokenId::Near,
        token_out: TokenId::Nep141(payload.token_contract_id.clone()),
        amount: Amount::AmountIn("0.3 NEAR".parse::<NearToken>().unwrap().as_yoctonear()),
        max_wait_ms: 3_000,
        slippage: Slippage::Auto {
            max_slippage: 0.1,
            min_slippage: 0.001,
        },
        dexes: Some(vec![DexId::Rhea]),
        trader_account_id: Some(state.relayer_id.clone()),
        signing_public_key: Some(relayer_key.public_key()),
    })
    .await?;
    let inverse_route = inverse_route.first().ok_or((
        StatusCode::INTERNAL_SERVER_ERROR,
        "No route found".to_string(),
    ))?;
    let trade_intent = OtcTradeIntent {
        user_id: state.relayer_id.clone(),
        asset_in: AssetId::Near,
        asset_out: AssetId::Nep141(payload.token_contract_id),
        amount_in: U128::from("0.3 NEAR".parse::<NearToken>().unwrap().as_yoctonear()),
        amount_out: U128::from(match inverse_route.estimated_amount {
            Amount::AmountIn(_) => unreachable!(),
            Amount::AmountOut(amount) => amount / 10 * 9, // 10% fee
        }),
        validity: OtcValidity {
            expiry: Some(OtcExpiryCondition::Timestamp {
                milliseconds: U64::from(expiry_millis),
            }),
            nonce: Some(U128::from(nonce)),
            only_for_whitelisted_parties: Some(vec![payload.user_id]),
        },
    };
    let hash = CryptoHash::hash_borsh(&trade_intent);
    let signature = relayer_key.sign(hash.as_bytes());
    let signature_bytes = match signature {
        near_min_api::types::near_crypto::Signature::ED25519(signature) => {
            signature.to_bytes().to_vec()
        }
        near_min_api::types::near_crypto::Signature::SECP256K1(signature) => {
            <[u8; 65]>::from(signature).to_vec()
        }
    };
    let authorized_trade_intent = OtcAuthorizedTradeIntent {
        trade_intent,
        authorization_method: OtcAuthorizationMethod::Signature(signature_bytes),
    };
    Ok(Json(SwapForGasResponse {
        authorized_trade_intent,
    }))
}

async fn validate_signed_delegate_action(
    state: RelayerState,
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
            tracing::error!("Actions length is not 2");
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
    let is_gift_claim = {
        if signed_delegate_action.delegate_action.actions.len() != 1 {
            tracing::error!("Actions length is not 1");
            false
        } else if let Action::FunctionCall(f) = signed_delegate_action.delegate_action.actions[0]
            .clone()
            .into()
        {
            f.method_name == "claim"
                && state.slimedrop.is_some_and(|contract| {
                    contract == signed_delegate_action.delegate_action.receiver_id
                })
        } else {
            tracing::error!("Actions is not a FunctionCall action");
            false
        }
    };
    let is_add_key = {
        if signed_delegate_action.delegate_action.actions.len() != 1 {
            tracing::error!("Actions length is not 1");
            false
        } else if let Action::AddKey(_) = signed_delegate_action.delegate_action.actions[0]
            .clone()
            .into()
        {
            true
        } else {
            tracing::error!("Actions is not a AddKey action");
            false
        }
    };
    let is_swap_for_gas = {
        if let Some(intear_dex) = &state.intear_dex {
            if signed_delegate_action.delegate_action.actions.len() != 1 {
                tracing::error!("Actions length is not 1");
                false
            } else if let Action::FunctionCall(f) = signed_delegate_action.delegate_action.actions
                [0]
            .clone()
            .into()
            {
                if SWAP_FOR_GAS_WHITELIST
                    .contains(&signed_delegate_action.delegate_action.receiver_id.as_str())
                {
                    if f.method_name == "ft_transfer_call"
                        && let Ok(args) = serde_json::from_slice::<serde_json::Value>(&f.args)
                        && args.get("receiver_id")
                            == Some(&serde_json::Value::String(intear_dex.to_string()))
                    {
                        if let Some(serde_json::Value::String(msg)) = args.get("msg")
                            && let Some(ft_transfer_amount) = args
                                .get("amount")
                                .and_then(|v| v.as_str())
                                .and_then(|s| s.parse::<u128>().ok())
                        {
                            if let Ok(operations) = serde_json::from_str::<Vec<Operation>>(msg) {
                                if operations.len() != 1 {
                                    tracing::error!("operations array length is not 1");
                                    false
                                } else if let Some(Operation::DexCall {
                                    dex_id,
                                    method,
                                    args,
                                    attached_assets,
                                }) = operations.first()
                                {
                                    let valid_dex_id = dex_id == "slimedragon.near/otc";
                                    let valid_method = method == "match";

                                    let valid_args = if let Ok(args) = BASE64_STANDARD.decode(args)
                                    {
                                        if let Ok(match_args) =
                                            borsh::from_slice::<OtcMatchArgs>(&args)
                                        {
                                            if !matches!(
                                                match_args.output_destination,
                                                OtcOutputDestination::WithdrawToUser
                                            ) {
                                                tracing::error!(
                                                    "output_destination must be WithdrawToUser, got {:?}",
                                                    match_args.output_destination
                                                );
                                                false
                                            } else if match_args.authorized_trade_intents.len() != 2
                                            {
                                                tracing::error!(
                                                    "Expected exactly 2 authorized trade intents, got {}",
                                                    match_args.authorized_trade_intents.len()
                                                );
                                                false
                                            } else {
                                                let first_intent =
                                                    &match_args.authorized_trade_intents[0];

                                                let valid_signature =
                                                    if let OtcAuthorizationMethod::Signature(
                                                        sig_bytes,
                                                    ) = &first_intent.authorization_method
                                                    {
                                                        let relayer_key = state
                                                            .relayer_keys
                                                            .first()
                                                            .expect("No relayer keys");
                                                        let hash = CryptoHash::hash_borsh(
                                                            &first_intent.trade_intent,
                                                        );
                                                        if let Ok(signature) = near_min_api::types::near_crypto::Signature::from_parts(relayer_key.key_type(), sig_bytes) {
                                                        signature.verify(
                                                            hash.as_bytes(),
                                                            &relayer_key.public_key(),
                                                        )
                                                    } else {
                                                        tracing::error!("Failed to deserialize signature");
                                                        false
                                                    }
                                                    } else {
                                                        tracing::error!(
                                                            "First intent authorization method is not Signature"
                                                        );
                                                        false
                                                    };

                                                let valid_timestamp = if let Some(
                                                    OtcExpiryCondition::Timestamp { milliseconds },
                                                ) =
                                                    first_intent.trade_intent.validity.expiry
                                                {
                                                    let current_time_millis = SystemTime::now()
                                                        .duration_since(std::time::UNIX_EPOCH)
                                                        .unwrap()
                                                        .as_millis()
                                                        as u64;
                                                    let expiry_millis = *milliseconds;

                                                    if expiry_millis < current_time_millis {
                                                        tracing::error!(
                                                            "First intent has expired: expiry={}, current={}",
                                                            expiry_millis,
                                                            current_time_millis
                                                        );
                                                        false
                                                    } else {
                                                        true
                                                    }
                                                } else {
                                                    tracing::error!(
                                                        "First intent does not have timestamp expiry"
                                                    );
                                                    false
                                                };

                                                let valid_attached_assets = {
                                                    println!("first_intent: {:?}", first_intent);
                                                    let expected_asset =
                                                        &first_intent.trade_intent.asset_out;
                                                    let expected_amount =
                                                        first_intent.trade_intent.amount_out;

                                                    if let Some(attached_amount) =
                                                        attached_assets.get(expected_asset)
                                                    {
                                                        if *attached_amount == expected_amount
                                                            && ft_transfer_amount
                                                                == *expected_amount
                                                        {
                                                            true
                                                        } else {
                                                            tracing::error!(
                                                                "attached_assets amount mismatch"
                                                            );
                                                            false
                                                        }
                                                    } else {
                                                        tracing::error!(
                                                            "attached_assets does not contain expected asset: {}",
                                                            expected_asset
                                                        );
                                                        false
                                                    }
                                                };

                                                valid_signature
                                                    && valid_timestamp
                                                    && valid_attached_assets
                                            }
                                        } else {
                                            tracing::error!("Failed to deserialize OtcMatchArgs");
                                            false
                                        }
                                    } else {
                                        tracing::error!("args is not valid base64");
                                        false
                                    };

                                    valid_dex_id && valid_method && valid_args
                                } else {
                                    tracing::error!("first operation is not a DexCall");
                                    false
                                }
                            } else {
                                tracing::error!("msg is not valid");
                                false
                            }
                        } else {
                            tracing::error!("msg field is missing or not a string");
                            false
                        }
                    } else {
                        tracing::error!("Actions is not a ft_transfer_call action");
                        false
                    }
                } else {
                    tracing::error!("Receiver ID is not whitelisted for swap for gas");
                    false
                }
            } else {
                tracing::error!("Actions is not a FunctionCall action");
                false
            }
        } else {
            false
        }
    };
    let is_withdraw_wnear = {
        if signed_delegate_action.delegate_action.actions.len() != 1 {
            tracing::error!("Actions length is not 1");
            false
        } else if let Action::FunctionCall(f) = signed_delegate_action.delegate_action.actions[0]
            .clone()
            .into()
        {
            f.method_name == "near_withdraw"
                && signed_delegate_action.delegate_action.receiver_id == "wrap.near"
        } else {
            tracing::error!("Actions is not a FunctionCall action");
            false
        }
    };
    if !is_subaccount_creation
        && !is_gift_claim
        && !is_add_key
        && !is_swap_for_gas
        && !is_withdraw_wnear
    {
        return Err((
            StatusCode::BAD_REQUEST,
            "Not a supported transaction".to_string(),
        ));
    }
    Ok(())
}

#[derive(
    PartialEq, Eq, Hash, Clone, PartialOrd, Ord, Debug, BorshSerialize, borsh::BorshDeserialize,
)]
pub enum AssetId {
    Near,
    Nep141(AccountId),
    Nep245(AccountId, String),
    Nep171(AccountId, String),
}

impl Display for AssetId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AssetId::Near => write!(f, "near"),
            AssetId::Nep141(contract_id) => write!(f, "nep141:{contract_id}"),
            AssetId::Nep245(contract_id, token_id) => write!(f, "nep245:{contract_id}:{token_id}"),
            AssetId::Nep171(contract_id, token_id) => write!(f, "nep171:{contract_id}:{token_id}"),
        }
    }
}

impl FromStr for AssetId {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "near" => Ok(AssetId::Near),
            _ => match s.split_once(':') {
                Some(("nep141", contract_id)) => {
                    Ok(AssetId::Nep141(contract_id.parse().map_err(|e| {
                        format!("Invalid account id {contract_id}: {e}")
                    })?))
                }
                Some(("nep245", rest)) => {
                    if let Some((contract_id, token_id)) = rest.split_once(':') {
                        Ok(AssetId::Nep245(
                            contract_id
                                .parse()
                                .map_err(|e| format!("Invalid account id {contract_id}: {e}"))?,
                            token_id.to_string(),
                        ))
                    } else {
                        Err(format!("Invalid asset id: {s}"))
                    }
                }
                Some(("nep171", rest)) => {
                    if let Some((contract_id, token_id)) = rest.split_once(':') {
                        Ok(AssetId::Nep171(
                            contract_id
                                .parse()
                                .map_err(|e| format!("Invalid account id {contract_id}: {e}"))?,
                            token_id.to_string(),
                        ))
                    } else {
                        Err(format!("Invalid asset id: {s}"))
                    }
                }
                _ => Err(format!("Invalid asset id: {s}")),
            },
        }
    }
}

impl Serialize for AssetId {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serde::Serialize::serialize(&self.to_string(), serializer)
    }
}

impl<'de> Deserialize<'de> for AssetId {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s: String = Deserialize::deserialize(deserializer)?;
        AssetId::from_str(&s).map_err(serde::de::Error::custom)
    }
}

#[derive(Serialize, Deserialize, BorshSerialize, borsh::BorshDeserialize, Debug)]
struct OtcTradeIntent {
    user_id: AccountId,
    asset_in: AssetId,
    asset_out: AssetId,
    amount_in: U128,
    amount_out: U128,
    validity: OtcValidity,
}

#[derive(Clone, PartialEq, Serialize, Deserialize, Debug)]
pub enum AccountOrDexId {
    Account(AccountId),
    Dex(String),
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum Operation {
    /// Call a method on a dex.
    DexCall {
        dex_id: String,
        method: String,
        args: String,
        attached_assets: BTreeMap<AssetId, U128>,
    },
    /// Transfer assets to a different account or dex.
    TransferAsset {
        to: AccountOrDexId,
        asset_id: AssetId,
        amount: U128,
    },
}

#[derive(Debug, BorshDeserialize)]
struct OtcMatchArgs {
    authorized_trade_intents: Vec<OtcAuthorizedTradeIntent>,
    output_destination: OtcOutputDestination,
}

#[derive(Default, PartialEq, Serialize, Deserialize, BorshSerialize, BorshDeserialize, Debug)]
struct OtcValidity {
    expiry: Option<OtcExpiryCondition>,
    nonce: Option<U128>,
    only_for_whitelisted_parties: Option<Vec<AccountId>>,
}

#[derive(
    PartialEq, Clone, Copy, Serialize, Deserialize, BorshSerialize, BorshDeserialize, Debug,
)]
enum OtcExpiryCondition {
    BlockHeight(BlockHeight),
    Timestamp { milliseconds: U64 },
}

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize, Debug)]
#[serde_as]
enum OtcAuthorizationMethod {
    Signature(#[serde_as(as = "Base64")] Vec<u8>),
    Predecessor,
}

#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize, Debug)]
struct OtcAuthorizedTradeIntent {
    trade_intent: OtcTradeIntent,
    authorization_method: OtcAuthorizationMethod,
}

#[derive(borsh::BorshDeserialize, Debug)]
#[allow(unused)]
enum OtcOutputDestination {
    InternalOtcBalance,
    IntearDexBalance,
    WithdrawToUser,
}

#[derive(Deserialize)]
struct SwapForGasRequest {
    user_id: AccountId,
    token_contract_id: AccountId,
}

#[derive(Serialize, Debug)]
struct SwapForGasResponse {
    authorized_trade_intent: OtcAuthorizedTradeIntent,
}

async fn get_otc_balance(
    rpc_client: &RpcClient,
    intear_dex: &AccountId,
    relayer_id: AccountId,
    asset_id: AssetId,
) -> Result<U128, String> {
    #[derive(BorshSerialize)]
    struct GetBalanceArgs {
        user_id: AccountId,
        asset_id: AssetId,
    }

    let result = rpc_client
        .call::<String>(
            intear_dex.clone(),
            "dex_view",
            serde_json::json!({
                "dex_id": "slimedragon.near/otc",
                "method": "get_balance",
                "args": BASE64_STANDARD.encode(borsh::to_vec(&GetBalanceArgs {
                    user_id: relayer_id.clone(),
                    asset_id: asset_id.clone(),
                }).unwrap()),
            }),
            QueryFinality::Finality(Finality::DoomSlug),
        )
        .await
        .map_err(|e| e.to_string())?;
    let Ok(result_bytes) = BASE64_STANDARD.decode(result) else {
        return Err("Failed to decode result".to_string());
    };
    let result: Option<U128> = borsh::from_slice(&result_bytes).map_err(|e| e.to_string())?;
    Ok(result.unwrap_or_default())
}

#[derive(BorshSerialize)]
struct WithdrawAssetsArgs {
    assets: Vec<WithdrawRequest>,
}

#[derive(BorshSerialize)]
struct WithdrawRequest {
    asset_id: AssetId,
    amount: Option<U128>,
    to: Option<AccountId>,
    to_inner_balance: bool,
}

async fn check_otc_balances(state: &RelayerState, intear_dex: &AccountId, relayer_id: &str) {
    tracing::info!(
        "[{}] Checking OTC balances for whitelisted tokens...",
        relayer_id
    );

    let mut assets_to_withdraw = Vec::new();

    for token_contract_id in SWAP_FOR_GAS_WHITELIST {
        let asset_id = AssetId::Nep141(
            token_contract_id
                .parse()
                .expect("Invalid token contract id in whitelist"),
        );

        match get_otc_balance(
            &state.rpc_client,
            intear_dex,
            state.relayer_id.clone(),
            asset_id.clone(),
        )
        .await
        {
            Ok(balance) => {
                let balance_u128: u128 = balance.into();
                tracing::info!(
                    "[{}] OTC Balance for {}: {}",
                    relayer_id,
                    token_contract_id,
                    balance_u128
                );

                if balance_u128 > 0 {
                    assets_to_withdraw.push(WithdrawRequest {
                        asset_id,
                        amount: None,
                        to: None,
                        to_inner_balance: false,
                    });
                }
            }
            Err(e) => {
                tracing::error!(
                    "[{}] Failed to get OTC balance for {}: {}",
                    relayer_id,
                    token_contract_id,
                    e
                );
            }
        }
    }

    if !assets_to_withdraw.is_empty() {
        tracing::info!(
            "[{}] Withdrawing {} assets from OTC",
            relayer_id,
            assets_to_withdraw.len()
        );

        let relayer_key = state
            .relayer_keys
            .first()
            .expect("No private keys available");

        let access_key = match state
            .rpc_client
            .get_access_key(
                state.relayer_id.clone(),
                relayer_key.public_key(),
                QueryFinality::Finality(Finality::None),
            )
            .await
        {
            Ok(key) => key,
            Err(e) => {
                tracing::error!(
                    "[{}] Failed to get access key for withdrawal: {}",
                    relayer_id,
                    e
                );
                return;
            }
        };

        let block_hash = match state
            .rpc_client
            .block(BlockReference::Finality(Finality::Final))
            .await
            .map(|block| block.header.hash)
        {
            Ok(hash) => hash,
            Err(e) => {
                tracing::error!(
                    "[{}] Failed to fetch block hash for withdrawal: {}",
                    relayer_id,
                    e
                );
                return;
            }
        };

        let withdraw_action = Action::FunctionCall(Box::new(FunctionCallAction {
            method_name: "dex_call".to_string(),
            args: serde_json::to_vec(&serde_json::json!({
                "dex_id": "slimedragon.near/otc",
                "method": "withdraw_assets",
                "args": BASE64_STANDARD.encode(borsh::to_vec(&WithdrawAssetsArgs {
                    assets: assets_to_withdraw,
                }).unwrap()),
                "attached_assets": {},
            }))
            .unwrap(),
            gas: NearGas::from_tgas(300).into(),
            deposit: NearToken::from_yoctonear(1),
        }));

        let tx = Transaction::V0(TransactionV0 {
            signer_id: state.relayer_id.clone(),
            public_key: relayer_key.public_key(),
            nonce: access_key.nonce + 1,
            receiver_id: intear_dex.clone(),
            block_hash,
            actions: vec![withdraw_action],
        });

        let (tx_hash, _) = tx.get_hash_and_size();
        let signature = relayer_key.sign(tx_hash.as_ref());
        let signed_tx = SignedTransaction::new(signature, tx);

        match state.rpc_client.send_tx(signed_tx).await {
            Ok(_) => {
                tracing::info!("[{}] Withdrawal transaction sent: {}", relayer_id, tx_hash);
            }
            Err(e) => {
                tracing::error!(
                    "[{}] Failed to send withdrawal transaction: {}",
                    relayer_id,
                    e
                );
            }
        }
    }
}
