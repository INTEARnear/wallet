use axum::extract::ws::{Message, WebSocket};
use axum::{
    extract::{Path, State, WebSocketUpgrade},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use futures_util::{SinkExt, StreamExt};
use near_min_api::{
    types::{
        near_crypto::{PublicKey, Signature},
        AccessKeyPermissionView, AccountId, Finality,
    },
    QueryFinality, RpcClient,
};
use rocksdb::{Options, DB};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    env,
    net::SocketAddr,
    path::PathBuf,
    sync::{Arc, Mutex},
    time::{SystemTime, UNIX_EPOCH},
};
use tokio::sync::broadcast;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

const MAX_SUBSCRIBERS_PER_APP: usize = 25;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, Hash, Eq, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Network {
    Testnet,
    Mainnet,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LoginRequest {
    account_id: AccountId,
    app_public_key: PublicKey,
    user_logout_public_key: PublicKey,
    nonce: u64,
    signature: Signature,
    // not stored anywhere, just for the initial verification
    user_on_chain_public_key: PublicKey,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LogoutAppRequest {
    account_id: AccountId,
    app_public_key: PublicKey,
    nonce: u64,
    signature: Signature,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LogoutUserRequest {
    account_id: AccountId,
    app_public_key: PublicKey,
    nonce: u64,
    signature: Signature,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum LogoutCause {
    User,
    App,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LogoutInfo {
    nonce: u64,
    signature: Signature,
    caused_by: LogoutCause,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum SessionStatus {
    Active,
    LoggedOut(LogoutInfo),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SessionInfo {
    status: SessionStatus,
    app_public_key: PublicKey,
    user_logout_public_key: PublicKey,
    #[serde(default)]
    verification_result: AccountVerificationResult,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CheckLogoutRequest {
    nonce: u64,
    signature: Signature,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct WebSocketAuthRequest {
    network: Network,
    account_id: AccountId,
    app_public_key: PublicKey,
    nonce: u64,
    signature: Signature,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct LogoutNotification {
    network: Network,
    account_id: AccountId,
    app_public_key: PublicKey,
    logout_info: LogoutInfo,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum WsClientMessage {
    Auth(WebSocketAuthRequest),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum WsServerMessage {
    Error { message: String },
    Success { message: String },
    LoggedOut(LogoutNotification),
}

type SubscriberKey = (Network, AccountId, PublicKey);
type LogoutSubscribers =
    Arc<Mutex<HashMap<SubscriberKey, Vec<broadcast::Sender<LogoutNotification>>>>>;

#[derive(Clone)]
struct AppState {
    db: Arc<DB>,
    mainnet_rpc_client: RpcClient,
    testnet_rpc_client: RpcClient,
    subscribers: LogoutSubscribers,
}

fn get_db_key(network: &Network, account_id: &AccountId, app_public_key: &PublicKey) -> String {
    format!(
        "{}|{account_id}|{app_public_key}",
        match network {
            Network::Testnet => "testnet",
            Network::Mainnet => "mainnet",
        }
    )
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
enum AccountVerificationResult {
    #[default]
    Verified,
    NotVerified,
    Invalid,
}

async fn verify_account(
    network: &Network,
    account_id: &AccountId,
    public_key: &PublicKey,
    app_state: &AppState,
) -> AccountVerificationResult {
    if public_key.to_string() == "ed25519:4zvwRjXUKGfvwnParsHAS3HuSVzV5cA4McphgmoCtajS" {
        // Zero key - used for Ledger. Not secure, but better than making people
        // sign a message every time they log in. The security is not important
        // here, actually, since app public key is known only to the wallet and
        // the app, and there's no way to enumerate them.
        return AccountVerificationResult::NotVerified;
    }
    let client = match network {
        Network::Mainnet => &app_state.mainnet_rpc_client,
        Network::Testnet => &app_state.testnet_rpc_client,
    };
    if let Ok(key) = client
        .get_access_key(
            account_id.clone(),
            public_key.clone(),
            QueryFinality::Finality(Finality::None),
        )
        .await
    {
        if matches!(key.permission, AccessKeyPermissionView::FullAccess) {
            AccountVerificationResult::Verified
        } else {
            AccountVerificationResult::Invalid
        }
    } else {
        AccountVerificationResult::Invalid
    }
}

async fn handle_login(
    State(state): State<AppState>,
    Path(network): Path<Network>,
    Json(request): Json<LoginRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let verification_result = verify_account(
        &network,
        &request.account_id,
        &request.user_on_chain_public_key,
        &state,
    )
    .await;
    if matches!(verification_result, AccountVerificationResult::Invalid) {
        return Err((
            StatusCode::UNAUTHORIZED,
            "Account does not have this key".to_string(),
        ));
    }

    let message = format!(
        "login|{}|{}|{}",
        request.nonce, request.account_id, request.app_public_key
    );

    if !request
        .signature
        .verify(message.as_bytes(), &request.user_on_chain_public_key)
        || request.nonce
            > SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64
        || request.nonce
            < SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64
                - 60 * 5
    {
        return Err((StatusCode::UNAUTHORIZED, "Invalid signature".to_string()));
    }

    let key = get_db_key(&network, &request.account_id, &request.app_public_key);

    // Store active session
    let session_info = SessionInfo {
        status: SessionStatus::Active,
        app_public_key: request.app_public_key,
        user_logout_public_key: request.user_logout_public_key,
        verification_result,
    };

    let serialized = serde_json::to_vec(&session_info)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    state
        .db
        .put(key, serialized)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(session_info.status))
}

async fn handle_logout_app(
    State(state): State<AppState>,
    Path(network): Path<Network>,
    Json(request): Json<LogoutAppRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let key = get_db_key(&network, &request.account_id, &request.app_public_key);

    let existing_session = match state
        .db
        .get(&key)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    {
        Some(data) => serde_json::from_slice::<SessionInfo>(&data)
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?,
        None => return Err((StatusCode::NOT_FOUND, "No active session found".to_string())),
    };

    if let SessionStatus::LoggedOut(_) = existing_session.status {
        return Err((
            StatusCode::CONFLICT,
            "Session already logged out".to_string(),
        ));
    }

    let message = format!(
        "logout|{}|{}|{}",
        request.nonce, request.account_id, request.app_public_key
    );

    if !request
        .signature
        .verify(message.as_bytes(), &existing_session.app_public_key)
        || request.nonce
            > SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64
        || request.nonce
            < SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64
                - 60 * 5
    {
        return Err((StatusCode::UNAUTHORIZED, "Invalid signature".to_string()));
    }

    let session_status = SessionStatus::LoggedOut(LogoutInfo {
        nonce: request.nonce,
        signature: request.signature,
        caused_by: LogoutCause::App,
    });

    notify_logout(
        &state,
        &network,
        &request.account_id,
        &request.app_public_key,
        match &session_status {
            SessionStatus::LoggedOut(info) => info,
            _ => unreachable!(),
        },
    )
    .await;

    let session_info = SessionInfo {
        status: session_status,
        ..existing_session
    };

    let serialized = serde_json::to_vec(&session_info)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    state
        .db
        .put(key, serialized)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(session_info.status))
}

async fn handle_logout_user(
    State(state): State<AppState>,
    Path(network): Path<Network>,
    Json(request): Json<LogoutUserRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let key = get_db_key(&network, &request.account_id, &request.app_public_key);

    let existing_session = match state
        .db
        .get(&key)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    {
        Some(data) => serde_json::from_slice::<SessionInfo>(&data)
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?,
        None => return Err((StatusCode::NOT_FOUND, "No active session found".to_string())),
    };

    if let SessionStatus::LoggedOut(_) = existing_session.status {
        return Err((
            StatusCode::CONFLICT,
            "Session already logged out".to_string(),
        ));
    }

    let message = format!(
        "logout|{}|{}|{}",
        request.nonce, request.account_id, request.app_public_key
    );

    if !request
        .signature
        .verify(message.as_bytes(), &existing_session.user_logout_public_key)
        || request.nonce
            > SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64
        || request.nonce
            < SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64
                - 60 * 5
    {
        return Err((StatusCode::UNAUTHORIZED, "Invalid signature".to_string()));
    }

    let session_status = SessionStatus::LoggedOut(LogoutInfo {
        nonce: request.nonce,
        signature: request.signature,
        caused_by: LogoutCause::User,
    });

    notify_logout(
        &state,
        &network,
        &request.account_id,
        &request.app_public_key,
        match &session_status {
            SessionStatus::LoggedOut(info) => info,
            _ => unreachable!(),
        },
    )
    .await;

    let session_info = SessionInfo {
        status: session_status,
        ..existing_session
    };

    let serialized = serde_json::to_vec(&session_info)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    state
        .db
        .put(key, serialized)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(session_info.status))
}

async fn handle_check_logout(
    State(state): State<AppState>,
    Path((network, account_id, app_public_key)): Path<(Network, AccountId, PublicKey)>,
    Json(request): Json<CheckLogoutRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let key = get_db_key(&network, &account_id, &app_public_key);

    match state
        .db
        .get(key)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    {
        Some(data) => {
            let session_info: SessionInfo = serde_json::from_slice(&data)
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
            let message = format!("check|{}", request.nonce);
            let signature_is_valid = request
                .signature
                .verify(message.as_bytes(), &session_info.app_public_key)
                || request
                    .signature
                    .verify(message.as_bytes(), &session_info.user_logout_public_key);
            if !signature_is_valid
                || request.nonce
                    > SystemTime::now()
                        .duration_since(UNIX_EPOCH)
                        .unwrap()
                        .as_millis() as u64
                || request.nonce
                    < SystemTime::now()
                        .duration_since(UNIX_EPOCH)
                        .unwrap()
                        .as_millis() as u64
                        - 60 * 5
            {
                Err((StatusCode::UNAUTHORIZED, "Invalid signature".to_string()))
            } else {
                Ok(Json(session_info.status))
            }
        }
        None => Ok(Json(SessionStatus::Active)),
    }
}

async fn handle_websocket(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_websocket_connection(socket, state))
}

async fn handle_websocket_connection(socket: WebSocket, state: AppState) {
    let (mut sender, mut receiver) = socket.split();

    let auth = match receiver.next().await {
        Some(Ok(Message::Text(text))) => match serde_json::from_str::<WsClientMessage>(&text) {
            Ok(WsClientMessage::Auth(auth)) => auth,
            Err(e) => {
                let error = WsServerMessage::Error {
                    message: format!("Invalid auth message: {e}"),
                };
                let _ = sender
                    .send(Message::Text(serde_json::to_string(&error).unwrap().into()))
                    .await;
                return;
            }
        },
        _ => {
            let error = WsServerMessage::Error {
                message: "Expected text message".to_string(),
            };
            let _ = sender
                .send(Message::Text(serde_json::to_string(&error).unwrap().into()))
                .await;
            return;
        }
    };

    let message = format!("subscribe|{}", auth.nonce);
    if !auth
        .signature
        .verify(message.as_bytes(), &auth.app_public_key)
        || auth.nonce
            > SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64
        || auth.nonce
            < SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64
                - 60 * 5
    {
        let error = WsServerMessage::Error {
            message: "Invalid signature".to_string(),
        };
        let _ = sender
            .send(Message::Text(serde_json::to_string(&error).unwrap().into()))
            .await;
        return;
    }

    let (tx, mut rx) = broadcast::channel(100);
    let key = (
        auth.network,
        auth.account_id.clone(),
        auth.app_public_key.clone(),
    );

    let can_subscribe = {
        let mut subscribers = state.subscribers.lock().unwrap();
        let txs = subscribers.entry(key.clone()).or_default();

        txs.retain(|tx| tx.receiver_count() > 0);

        if txs.len() >= MAX_SUBSCRIBERS_PER_APP {
            false
        } else {
            txs.push(tx.clone());
            true
        }
    };

    if !can_subscribe {
        let error = WsServerMessage::Error {
            message: format!(
                "Maximum number of subscribers ({MAX_SUBSCRIBERS_PER_APP}) reached for this app"
            ),
        };
        let _ = sender
            .send(Message::Text(serde_json::to_string(&error).unwrap().into()))
            .await;
        return;
    }

    let success = WsServerMessage::Success {
        message: "Subscribed".to_string(),
    };
    let _ = sender
        .send(Message::Text(
            serde_json::to_string(&success).unwrap().into(),
        ))
        .await;

    let mut client_disconnected = false;

    let wait_for_disconnection = tokio::spawn(async move {
        while let Some(msg) = receiver.next().await {
            if msg.is_err() {
                return true;
            }
        }
        true
    });

    tokio::select! {
        disconnect = wait_for_disconnection => {
            client_disconnected = disconnect.unwrap_or(true);
        }
        notification_result = rx.recv() => {
            let mut current_notification = notification_result;
            while let Ok(notification) = current_notification {
                let message = WsServerMessage::LoggedOut(notification);
                if let Ok(json) = serde_json::to_string(&message) {
                    if sender.send(Message::Text(json.into())).await.is_err() {
                        client_disconnected = true;
                        break;
                    }
                }

                match rx.recv().await {
                    Ok(next_notification) => current_notification = Ok(next_notification),
                    Err(_) => break,
                }
            }
        }
    }

    // Clean up subscriber when the client disconnects
    if client_disconnected {
        let mut subscribers = state.subscribers.lock().unwrap();
        if let Some(txs) = subscribers.get_mut(&key) {
            // Remove channels with no receivers
            txs.retain(|tx| tx.receiver_count() > 0);
            if txs.is_empty() {
                subscribers.remove(&key);
            }
        }
    }
}

async fn notify_logout(
    state: &AppState,
    network: &Network,
    account_id: &AccountId,
    app_public_key: &PublicKey,
    logout_info: &LogoutInfo,
) {
    let key = (*network, account_id.clone(), app_public_key.clone());
    let notification = LogoutNotification {
        network: *network,
        account_id: account_id.clone(),
        app_public_key: app_public_key.clone(),
        logout_info: logout_info.clone(),
    };

    let mut subscribers = state.subscribers.lock().unwrap();
    if let Some(txs) = subscribers.get_mut(&key) {
        // Remove channels with no receivers
        txs.retain(|tx| tx.receiver_count() > 0);
        // Notify all remaining subscribers
        for tx in txs.iter() {
            let _ = tx.send(notification.clone());
        }
        // Remove the key if no subscribers left
        if txs.is_empty() {
            subscribers.remove(&key);
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

    tracing::info!("Starting logout bridge service...");

    // Initialize RocksDB
    let db_path = PathBuf::from("sessions");
    let mut opts = Options::default();
    opts.create_if_missing(true);
    opts.set_compression_type(rocksdb::DBCompressionType::Zstd);
    let db = DB::open(&opts, &db_path).expect("Failed to open RocksDB");
    let db = Arc::new(db);

    let mainnet_rpc_client = RpcClient::new(
        env::var("MAINNET_RPC_URLS")
            .map(|urls| urls.split(',').map(String::from).collect::<Vec<_>>())
            .unwrap_or_else(|_| {
                vec![
                    "https://rpc.intea.rs".to_string(),
                    "https://rpc.near.org".to_string(),
                    "https://rpc.shitzuapes.xyz".to_string(),
                    "https://archival-rpc.mainnet.near.org".to_string(),
                ]
            }),
    );
    let testnet_rpc_client = RpcClient::new(
        env::var("TESTNET_RPC_URLS")
            .map(|urls| urls.split(',').map(String::from).collect::<Vec<_>>())
            .unwrap_or_else(|_| {
                vec![
                    "https://rpc.testnet.near.org".to_string(),
                    "https://archival-rpc.testnet.near.org".to_string(),
                ]
            }),
    );

    let state = AppState {
        db: db.clone(),
        mainnet_rpc_client,
        testnet_rpc_client,
        subscribers: Arc::new(Mutex::new(HashMap::new())),
    };

    let app = Router::new()
        .route("/api/login/{network}", post(handle_login))
        .route("/api/logout_app/{network}", post(handle_logout_app))
        .route("/api/logout_user/{network}", post(handle_logout_user))
        .route(
            "/api/check_logout/{network}/{account_id}/{app_public_key}",
            post(handle_check_logout),
        )
        .route("/api/subscribe", get(handle_websocket))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = env::var("LOGOUT_BRIDGE_SERVICE_BIND")
        .map(|s| {
            s.parse()
                .expect("Invalid LOGOUT_BRIDGE_SERVICE_BIND format")
        })
        .unwrap_or_else(|_| SocketAddr::from(([127, 0, 0, 1], 3003)));
    tracing::info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("Server started successfully");
    axum::serve(listener, app).await.unwrap();
}
