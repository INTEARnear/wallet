#![feature(ip)]

use anyhow::anyhow;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use base64::{engine::general_purpose, Engine};
use bytes::Bytes;
use image::{imageops::FilterType, DynamicImage};
use moka::future::Cache;
use near_min_api::types::AccountId;
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use reqwest::Client;
use rocksdb::{Options, DB};
use serde::{Deserialize, Serialize};
use std::{
    env,
    io::Cursor,
    net::SocketAddr,
    sync::Arc,
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use teloxide::{
    dispatching::UpdateHandler,
    prelude::*,
    types::{InlineKeyboardButton, InlineKeyboardMarkup, ParseMode},
    utils::markdown,
    Bot,
};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;
use url::{Host, Url};

const LOW_RES_SIZE: u32 = 64;
const HIGH_RES_SIZE: u32 = 576;

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, Eq)]
pub enum HiddenNft {
    Collection(AccountId),
    Token(AccountId, String),
}

#[derive(Deserialize)]
struct AirdropClaimRequest {
    addr: AccountId,
    airdrop_id: i32,
}

#[derive(Deserialize)]
struct MemeCookingRequest {
    image: String,
    reference: String,
}

#[derive(Clone)]
struct AppState {
    client: Client,
    cache: Cache<String, Result<Bytes, u16>>,
    max_size: u64,
    spam_db: Arc<DB>,
    reported_db: Arc<DB>,
    bot: Bot,
    telegram_chat_id: String,
}

type HandlerResult = Result<(), anyhow::Error>;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive("info".parse().unwrap())
                .from_env_lossy(),
        )
        .init();

    let spam_db_path = env::var("SPAM_DB_PATH").unwrap_or_else(|_| "spam".to_string());
    let mut spam_opts = Options::default();
    spam_opts.create_if_missing(true);
    let spam_db =
        DB::open(&spam_opts, &spam_db_path).expect("Failed to open RocksDB for spam list");

    let reported_db_path = env::var("REPORTED_DB_PATH").unwrap_or_else(|_| "reported".to_string());
    let mut reported_opts = Options::default();
    reported_opts.create_if_missing(true);
    let reported_db = DB::open(&reported_opts, &reported_db_path)
        .expect("Failed to open RocksDB for reported list");

    let max_size = env::var("MAX_IMAGE_SIZE_BYTES")
        .unwrap_or_else(|_| "20971520".to_string())
        .parse::<u64>()
        .expect("Failed to parse MAX_IMAGE_SIZE_BYTES");

    let cache_duration = env::var("CACHE_DURATION_SECONDS")
        .unwrap_or_else(|_| "86400".to_string())
        .parse::<u64>()
        .expect("Failed to parse CACHE_DURATION_SECONDS");

    let cache: Cache<String, Result<Bytes, u16>> = Cache::builder()
        .time_to_live(Duration::from_secs(cache_duration))
        .build();

    let bot = Bot::from_env();
    let telegram_chat_id = env::var("TELEGRAM_CHAT_ID").expect("TELEGRAM_CHAT_ID must be set");

    let state = AppState {
        client: Client::builder()
            .timeout(Duration::from_secs(10))
            .build()
            .unwrap(),
        cache,
        max_size,
        spam_db: Arc::new(spam_db),
        reported_db: Arc::new(reported_db),
        bot: bot.clone(),
        telegram_chat_id: telegram_chat_id.clone(),
    };

    let teloxide_state = state.clone();
    tokio::spawn(async move {
        Dispatcher::builder(teloxide_state.bot.clone(), schema())
            .dependencies(dptree::deps![teloxide_state])
            .build()
            .dispatch()
            .await;
    });

    let app = Router::new()
        .route("/media/low/{*url}", get(proxy_handler_low_res))
        .route("/media/high/{*url}", get(proxy_handler_high_res))
        .route("/traits/{*url}", get(traits_proxy_handler))
        .route("/airdrop/{id}/{addr}", get(airdrop_proxy_handler))
        .route("/airdrop/claim", post(airdrop_claim_handler))
        .route("/report-spam", post(report_spam_handler))
        .route("/spam-list", get(spam_list_handler))
        .route("/meme-cooking-create", post(meme_cooking_create_handler))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = env::var("NFT_PROXY_SERVICE_BIND")
        .map(|s| s.parse().expect("Invalid NFT_PROXY_SERVICE_BIND format"))
        .unwrap_or_else(|_| SocketAddr::from(([127, 0, 0, 1], 3005)));

    tracing::info!("NFT proxy service listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind");
    axum::serve(listener, app).await.unwrap();
}

fn schema() -> UpdateHandler<anyhow::Error> {
    dptree::entry()
        .branch(Update::filter_message().endpoint(message_handler))
        .branch(Update::filter_callback_query().endpoint(callback_handler))
}

async fn message_handler(bot: Bot, msg: Message, state: AppState) -> HandlerResult {
    if msg.chat.id.to_string() != state.telegram_chat_id {
        bot.send_message(msg.chat.id, "Unauthorized").await?;
        return Ok(());
    }

    if let Some(text) = msg.text() {
        if let Some(account_id_str) = text.strip_prefix("/ban ") {
            let account_id = account_id_str.trim();
            if account_id.is_empty() {
                bot.send_message(msg.chat.id, "Usage: /ban <AccountId>")
                    .await?;
                return Ok(());
            }

            let account_id: AccountId = account_id
                .parse()
                .map_err(|e| anyhow!("Failed to parse AccountId: {}", e))?;

            let collection_item = HiddenNft::Collection(account_id.clone());
            let collection_bytes = serde_json::to_vec(&collection_item)
                .map_err(|e| anyhow!("Failed to serialize collection: {}", e))?;

            match state.spam_db.put(&collection_bytes, b"") {
                Ok(_) => {
                    bot.send_message(msg.chat.id, format!("Banned collection `{account_id}`"))
                        .parse_mode(ParseMode::MarkdownV2)
                        .await?;
                }
                Err(e) => {
                    tracing::error!("Failed to ban collection: {e}");
                    bot.send_message(msg.chat.id, format!("Failed to ban collection: {e}"))
                        .await?;
                }
            }
        } else {
            bot.send_message(msg.chat.id, format!("Unknown command: {text}"))
                .await?;
        }
    }

    Ok(())
}

async fn callback_handler(bot: Bot, q: CallbackQuery, state: AppState) -> HandlerResult {
    if q.from.id.to_string() != state.telegram_chat_id.replace('@', "") {
        bot.answer_callback_query(q.id).text("Unauthorized").await?;
        return Ok(());
    }

    if let Some(data) = q.data {
        let Some((action, id)) = data.split_once('_') else {
            bot.answer_callback_query(q.id)
                .text("Invalid action.")
                .await?;
            return Ok(());
        };

        match state.reported_db.get(id) {
            Ok(Some(item_bytes)) => {
                let original_item: HiddenNft = serde_json::from_slice(&item_bytes)
                    .map_err(|e| anyhow!("Failed to deserialize item: {}", e))?;

                let (new_keyboard, answer_text) = match action {
                    "confirmtoken" => {
                        if !matches!(original_item, HiddenNft::Token(..)) {
                            return Err(anyhow!("Invalid action for collection report"));
                        }
                        state.spam_db.put(&item_bytes, b"")?;
                        (
                            InlineKeyboardMarkup::new(vec![vec![
                                InlineKeyboardButton::callback(
                                    "Unban Token",
                                    format!("canceltoken_{id}"),
                                ),
                                InlineKeyboardButton::callback(
                                    "Ban Collection",
                                    format!("confirmcollection_{id}"),
                                ),
                            ]]),
                            "Token banned!",
                        )
                    }
                    "canceltoken" => {
                        if !matches!(original_item, HiddenNft::Token(..)) {
                            return Err(anyhow!("Invalid action for collection report"));
                        }
                        state.spam_db.delete(&item_bytes)?;
                        (
                            InlineKeyboardMarkup::new(vec![vec![
                                InlineKeyboardButton::callback(
                                    "Ban Token",
                                    format!("confirmtoken_{id}"),
                                ),
                                InlineKeyboardButton::callback(
                                    "Ban Collection",
                                    format!("confirmcollection_{id}"),
                                ),
                            ]]),
                            "Token unbanned.",
                        )
                    }
                    "confirmcollection" => {
                        let contract_id = match &original_item {
                            HiddenNft::Collection(cid) => cid.clone(),
                            HiddenNft::Token(cid, _) => cid.clone(),
                        };
                        let collection_item = HiddenNft::Collection(contract_id);
                        let collection_bytes = serde_json::to_vec(&collection_item)?;
                        state.spam_db.put(&collection_bytes, b"")?;
                        (
                            InlineKeyboardMarkup::new(vec![vec![InlineKeyboardButton::callback(
                                "Unban Collection",
                                format!("cancelcollection_{id}"),
                            )]]),
                            "Collection banned.",
                        )
                    }
                    "cancelcollection" => {
                        let contract_id = match &original_item {
                            HiddenNft::Collection(cid) => cid.clone(),
                            HiddenNft::Token(cid, _) => cid.clone(),
                        };
                        let collection_item = HiddenNft::Collection(contract_id);
                        let collection_bytes = serde_json::to_vec(&collection_item)?;
                        state.spam_db.delete(&collection_bytes)?;

                        let keyboard = match original_item {
                            HiddenNft::Token(..) => InlineKeyboardMarkup::new(vec![vec![
                                InlineKeyboardButton::callback(
                                    "Ban Token",
                                    format!("confirmtoken_{id}"),
                                ),
                                InlineKeyboardButton::callback(
                                    "Ban Collection",
                                    format!("confirmcollection_{id}"),
                                ),
                            ]]),
                            HiddenNft::Collection(..) => InlineKeyboardMarkup::new(vec![vec![
                                InlineKeyboardButton::callback(
                                    "Ban Collection",
                                    format!("confirmcollection_{id}"),
                                ),
                            ]]),
                        };
                        (keyboard, "Collection unbanned.")
                    }
                    _ => {
                        bot.answer_callback_query(q.id)
                            .text("Unknown action.")
                            .await?;
                        return Ok(());
                    }
                };

                bot.answer_callback_query(q.id).text(answer_text).await?;

                if let Some(msg) = q.message {
                    bot.edit_message_reply_markup(msg.chat.id, msg.id)
                        .reply_markup(new_keyboard)
                        .await?;
                }
            }
            Ok(None) => {
                bot.answer_callback_query(q.id)
                    .text("Report not found.")
                    .await?;
            }
            Err(e) => {
                tracing::error!("Failed to get from reported_db: {e}");
                bot.answer_callback_query(q.id)
                    .text("Database error")
                    .await?;
            }
        }
    }

    Ok(())
}

async fn report_spam_handler(
    State(state): State<AppState>,
    Json(item): Json<HiddenNft>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let id = nanoid::nanoid!();
    let Ok(serialized_item) = serde_json::to_vec(&item) else {
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to serialize item".to_string(),
        ));
    };

    if let Err(e) = state.reported_db.put(&id, &serialized_item) {
        tracing::error!("Failed to store reported item: {e}");
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to store report".to_string(),
        ));
    }

    let (text, keyboard) = match &item {
        HiddenNft::Collection(contract_id) => {
            let encoded_contract_id =
                utf8_percent_encode(contract_id.as_ref(), NON_ALPHANUMERIC).to_string();
            let link = format!("https://nearblocks.io/nft-token/{encoded_contract_id}");
            let text = format!(
                "New collection spam report:\n\nContract ID: `{contract_id}`\n\n[View on NearBlocks]({link})"
            );
            let keyboard = InlineKeyboardMarkup::new(vec![vec![InlineKeyboardButton::callback(
                "Ban Collection",
                format!("confirmcollection_{id}"),
            )]]);
            (text, keyboard)
        }
        HiddenNft::Token(contract_id, token_id) => {
            let escaped_token_id = markdown::escape_code(token_id);
            let encoded_contract_id =
                utf8_percent_encode(contract_id.as_ref(), NON_ALPHANUMERIC).to_string();
            let encoded_token_id = utf8_percent_encode(token_id, NON_ALPHANUMERIC).to_string();
            let link =
                format!("https://nearblocks.io/nft-token/{encoded_contract_id}/{encoded_token_id}");
            let text = format!(
                "New token spam report:\n\nContract ID: `{contract_id}`\nToken ID: `{escaped_token_id}`\n\n[View on NearBlocks]({link})"
            );
            let keyboard = InlineKeyboardMarkup::new(vec![vec![
                InlineKeyboardButton::callback("Ban Token", format!("confirmtoken_{id}")),
                InlineKeyboardButton::callback("Ban Collection", format!("confirmcollection_{id}")),
            ]]);
            (text, keyboard)
        }
    };

    let res = state
        .bot
        .send_message(state.telegram_chat_id.clone(), text)
        .parse_mode(ParseMode::MarkdownV2)
        .reply_markup(keyboard)
        .await;

    if let Err(e) = res {
        tracing::error!("Failed to send Telegram message: {e}");
    }

    Ok(StatusCode::OK)
}

async fn spam_list_handler(
    State(state): State<AppState>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let mut spam_list = Vec::new();
    let iter = state.spam_db.iterator(rocksdb::IteratorMode::Start);
    for item in iter {
        let (key, _) = match item {
            Ok(i) => i,
            Err(e) => {
                tracing::error!("Failed to read from spam db: {}", e);
                continue;
            }
        };
        if let Ok(hidden_nft) = serde_json::from_slice::<HiddenNft>(&key) {
            spam_list.push(hidden_nft);
        }
    }
    Ok(Json(spam_list))
}

async fn proxy_handler_low_res(
    state: State<AppState>,
    url: Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    proxy_handler(state, url, LOW_RES_SIZE).await
}

async fn proxy_handler_high_res(
    state: State<AppState>,
    url: Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    proxy_handler(state, url, HIGH_RES_SIZE).await
}

async fn proxy_handler(
    State(state): State<AppState>,
    Path(url): Path<String>,
    size: u32,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let decoded_url = percent_encoding::percent_decode_str(&url)
        .decode_utf8_lossy()
        .to_string();

    let parsed_url = Url::parse(&decoded_url)
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("Invalid URL format: {e}")))?;

    if is_local(parsed_url.host()) {
        return Err((
            StatusCode::FORBIDDEN,
            "Access to local IPs is forbidden".into(),
        ));
    }

    let cache_key_low = format!("low:{}", decoded_url);
    let cache_key_high = format!("high:{}", decoded_url);
    let cache_key_current = if size == LOW_RES_SIZE {
        cache_key_low.clone()
    } else {
        cache_key_high.clone()
    };

    if let Some(cached) = state.cache.get(&cache_key_current).await {
        return match cached {
            Ok(bytes) => Ok(bytes),
            Err(status_code) => Err((
                StatusCode::from_u16(status_code).unwrap(),
                format!("Failed to fetch from origin with status {status_code}"),
            )),
        };
    }

    let res = state.client.get(&decoded_url).send().await;

    let response = match res {
        Ok(response) => response,
        Err(e) => {
            let status = e.status().map(|s| s.as_u16()).unwrap_or(500);
            state.cache.insert(cache_key_low, Err(status)).await;
            state.cache.insert(cache_key_high, Err(status)).await;
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch image: {e}"),
            ));
        }
    };

    if response.status() != StatusCode::OK {
        let status = response.status().as_u16();
        state.cache.insert(cache_key_low, Err(status)).await;
        state.cache.insert(cache_key_high, Err(status)).await;
        return Err((
            response.status(),
            format!("Upstream returned status: {}", response.status()),
        ));
    }

    let bytes = match response.bytes().await {
        Ok(bytes) => bytes,
        Err(e) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to read image bytes: {e}"),
            ));
        }
    };

    if bytes.len() as u64 > state.max_size {
        return Err((
            StatusCode::PAYLOAD_TOO_LARGE,
            "Image size exceeds the maximum allowed limit".into(),
        ));
    }

    let img = match image::load_from_memory(&bytes) {
        Ok(img) => img,
        Err(e) => {
            tracing::warn!("Failed to decode image, proxying as is. Error: {e}");
            state.cache.insert(cache_key_low, Ok(bytes.clone())).await;
            state.cache.insert(cache_key_high, Ok(bytes.clone())).await;
            return Ok(bytes);
        }
    };

    let process_and_cache = |size: u32, img: DynamicImage, cache_key: String| {
        let state = state.clone();
        async move {
            let resized_img = img.resize(size, size, FilterType::Lanczos3);
            let mut buffer = Cursor::new(Vec::new());
            if let Err(e) = resized_img.write_to(&mut buffer, image::ImageFormat::WebP) {
                tracing::error!("Failed to encode resized image to WebP: {e}");
                return;
            }
            let webp_bytes = Bytes::from(buffer.into_inner());
            state.cache.insert(cache_key, Ok(webp_bytes)).await;
        }
    };

    tokio::join!(
        process_and_cache(LOW_RES_SIZE, img.clone(), cache_key_low),
        process_and_cache(HIGH_RES_SIZE, img.clone(), cache_key_high)
    );

    let resized_img = img.resize(size, size, FilterType::Lanczos3);
    let mut buffer = Cursor::new(Vec::new());
    if let Err(e) = resized_img.write_to(&mut buffer, image::ImageFormat::WebP) {
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to encode resized image to WebP: {e}"),
        ));
    };

    let webp_bytes = Bytes::from(buffer.into_inner());
    Ok(webp_bytes)
}

async fn airdrop_claim_handler(
    State(state): State<AppState>,
    Json(claim_request): Json<AirdropClaimRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("System time error: {}", e),
            )
        })?
        .as_millis()
        .to_string();

    let claim_payload = serde_json::json!({
        "addr": claim_request.addr,
        "callback_url": "https://app.rhea.finance/airdrop/detail",
        "data": claim_request.airdrop_id.to_string(),
        "public_key": &timestamp,
        "redirect_uri": "https://app.rhea.finance/airdrop/detail",
        "signature": &timestamp
    });

    let res = state
        .client
        .post("https://api.ref.finance/v3/airdrop/claim")
        .json(&claim_payload)
        .send()
        .await;

    let response = match res {
        Ok(response) => response,
        Err(e) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to claim airdrop: {}", e),
            ));
        }
    };

    let status = response.status();
    let bytes = match response.bytes().await {
        Ok(bytes) => bytes,
        Err(e) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to read claim response bytes: {}", e),
            ));
        }
    };

    if serde_json::from_slice::<serde_json::Value>(&bytes).is_err() {
        return Err((StatusCode::BAD_REQUEST, "Response is not valid JSON".into()));
    }

    // Give time to process the claim instead of polling (can cause 429 since all requests are from the same IP)
    tokio::time::sleep(Duration::from_secs(15)).await;

    // If claim was successful, invalidate the cached airdrop data for this account
    if status == StatusCode::OK {
        if let Ok(json) = serde_json::from_slice::<serde_json::Value>(&bytes) {
            if json.get("code").and_then(|v| v.as_i64()) == Some(0)
                && json.get("data").is_some_and(|v| v.is_null())
            {
                let cache_key = format!(
                    "airdrop:{}:{}",
                    claim_request.airdrop_id, claim_request.addr
                );
                state.cache.invalidate(&cache_key).await;
            }
        }
    }

    Ok((status, bytes))
}

async fn airdrop_proxy_handler(
    State(state): State<AppState>,
    Path((id, addr)): Path<(String, String)>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    // Cache key includes both airdrop id and account address for individual account caching
    let cache_key = format!("airdrop:{}:{}", id, addr);

    if let Some(cached) = state.cache.get(&cache_key).await {
        return match cached {
            Ok(bytes) => Ok(bytes),
            Err(status_code) => Err((
                StatusCode::from_u16(status_code).unwrap(),
                format!("Failed to fetch airdrop data from origin with status {status_code}"),
            )),
        };
    }

    let airdrop_url = format!(
        "https://api.ref.finance/v3/airdrop/check?id={}&addr={}",
        id, addr
    );

    let res = state.client.get(&airdrop_url).send().await;

    let response = match res {
        Ok(response) => response,
        Err(e) => {
            let status = e.status().map(|s| s.as_u16()).unwrap_or(500);
            state.cache.insert(cache_key, Err(status)).await;
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch airdrop data: {e}"),
            ));
        }
    };

    if response.status() != StatusCode::OK {
        let status = response.status().as_u16();
        state.cache.insert(cache_key.clone(), Err(status)).await;
        return Err((
            response.status(),
            format!("Upstream returned status: {}", response.status()),
        ));
    }

    let bytes = match response.bytes().await {
        Ok(bytes) => bytes,
        Err(e) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to read airdrop data bytes: {e}"),
            ));
        }
    };

    if serde_json::from_slice::<serde_json::Value>(&bytes).is_err() {
        return Err((StatusCode::BAD_REQUEST, "Response is not valid JSON".into()));
    }

    state.cache.insert(cache_key, Ok(bytes.clone())).await;

    Ok(bytes)
}

async fn traits_proxy_handler(
    State(state): State<AppState>,
    Path(url): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let decoded_url = percent_encoding::percent_decode_str(&url)
        .decode_utf8_lossy()
        .to_string();

    let parsed_url = Url::parse(&decoded_url)
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("Invalid URL format: {e}")))?;

    if is_local(parsed_url.host()) {
        return Err((
            StatusCode::FORBIDDEN,
            "Access to local IPs is forbidden".into(),
        ));
    }

    let cache_key = format!("traits:{}", decoded_url);

    if let Some(cached) = state.cache.get(&cache_key).await {
        return match cached {
            Ok(bytes) => Ok(bytes),
            Err(status_code) => Err((
                StatusCode::from_u16(status_code).unwrap(),
                format!("Failed to fetch traits from origin with status {status_code}"),
            )),
        };
    }

    let res = state.client.get(&decoded_url).send().await;

    let response = match res {
        Ok(response) => response,
        Err(e) => {
            let status = e.status().map(|s| s.as_u16()).unwrap_or(500);
            state.cache.insert(cache_key, Err(status)).await;
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch traits: {e}"),
            ));
        }
    };

    if response.status() != StatusCode::OK {
        let status = response.status().as_u16();
        state.cache.insert(cache_key.clone(), Err(status)).await;
        return Err((
            response.status(),
            format!("Upstream returned status: {}", response.status()),
        ));
    }

    let bytes = match response.bytes().await {
        Ok(bytes) => bytes,
        Err(e) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to read traits bytes: {e}"),
            ));
        }
    };

    if serde_json::from_slice::<serde_json::Value>(&bytes).is_err() {
        return Err((StatusCode::BAD_REQUEST, "Response is not valid JSON".into()));
    }

    state.cache.insert(cache_key, Ok(bytes.clone())).await;

    Ok(bytes)
}

async fn meme_cooking_create_handler(
    State(state): State<AppState>,
    Json(payload): Json<MemeCookingRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let image_bytes = general_purpose::STANDARD
        .decode(&payload.image)
        .map_err(|e| {
            (
                StatusCode::BAD_REQUEST,
                format!("Invalid base64 image: {}", e),
            )
        })?;

    let reference_bytes = general_purpose::STANDARD
        .decode(&payload.reference)
        .map_err(|e| {
            (
                StatusCode::BAD_REQUEST,
                format!("Invalid base64 reference: {}", e),
            )
        })?;

    let form = reqwest::multipart::Form::new()
        .part(
            "imageFile",
            reqwest::multipart::Part::bytes(image_bytes)
                .file_name("token.webp".to_string())
                .mime_str("image/webp")
                .map_err(|e| {
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to create image part: {}", e),
                    )
                })?,
        )
        .part(
            "reference",
            reqwest::multipart::Part::bytes(reference_bytes),
        );

    let res = state
        .client
        .post("https://meme.cooking/api/create")
        .header("Origin", "https://meme.cooking")
        .multipart(form)
        .send()
        .await;

    let response = match res {
        Ok(response) => response,
        Err(e) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to forward request to meme.cooking: {}", e),
            ));
        }
    };

    let status = response.status();
    let bytes = match response.bytes().await {
        Ok(bytes) => bytes,
        Err(e) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to read response bytes: {}", e),
            ));
        }
    };

    Ok((status, bytes))
}

fn is_local(host: Option<Host<&str>>) -> bool {
    match host {
        Some(Host::Domain(host)) => {
            if host == "localhost" || !host.contains('.') {
                return true;
            }
        }
        Some(Host::Ipv4(ip)) => {
            if !ip.is_global() {
                return true;
            }
        }
        Some(Host::Ipv6(ip)) => {
            if !ip.is_global() {
                return true;
            }
        }
        _ => {}
    }
    false
}
