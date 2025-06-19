#![feature(ip)]

use anyhow::anyhow;
use axum::{
    body::Body,
    extract::{Path, State},
    http::{header, HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use bytes::Bytes;
use image::codecs::webp;
use moka::future::Cache;
use near_min_api::types::AccountId;
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use reqwest::Client;
use rocksdb::{Options, DB};
use serde::{Deserialize, Serialize};
use std::{env, net::SocketAddr, sync::Arc, time::Duration};
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

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, Eq)]
pub enum HiddenNft {
    Collection(AccountId),
    Token(AccountId, String),
}

#[derive(Clone)]
struct AppState {
    client: Client,
    cache: Cache<String, Result<(Bytes, String), u16>>,
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

    let cache: Cache<String, Result<(Bytes, String), u16>> = Cache::builder()
        .time_to_live(Duration::from_secs(cache_duration))
        .build();

    let bot = Bot::from_env();
    let telegram_chat_id = env::var("TELEGRAM_CHAT_ID").expect("TELEGRAM_CHAT_ID must be set");

    let state = AppState {
        client: Client::new(),
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
        .route("/media/{*url}", get(proxy_handler))
        .route("/report-spam", post(report_spam_handler))
        .route("/spam-list", get(spam_list_handler))
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
        bot.send_message(msg.chat.id, format!("Unknown command: {text}"))
            .await?;
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

async fn proxy_handler(
    State(state): State<AppState>,
    Path(url): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let decoded_url = match percent_encoding::percent_decode_str(&url).decode_utf8() {
        Ok(u) => u.to_string(),
        Err(_) => return Err((StatusCode::BAD_REQUEST, "Invalid URL encoding".to_string())),
    };

    if let Some(cached_result) = state.cache.get(&decoded_url).await {
        tracing::info!("Cache hit for {}", decoded_url);
        return match cached_result {
            Ok((bytes, content_type)) => {
                let mut headers = HeaderMap::new();
                headers.insert(header::CONTENT_TYPE, content_type.parse().unwrap());
                Ok((headers, Body::from(bytes)).into_response())
            }
            Err(status_code) => Err((
                StatusCode::from_u16(status_code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
                "Cached error".to_string(),
            )),
        };
    }

    tracing::info!("Cache miss for {}, fetching from origin", decoded_url);

    let parsed_url = match Url::parse(&decoded_url) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, "Invalid URL".to_string())),
    };

    if parsed_url.scheme() != "https" {
        return Err((
            StatusCode::BAD_REQUEST,
            "URL scheme must be https".to_string(),
        ));
    }

    if is_local(parsed_url.host()) {
        return Err((
            StatusCode::FORBIDDEN,
            "Access to this resource is denied".to_string(),
        ));
    }

    let response = match state.client.get(decoded_url.clone()).send().await {
        Ok(res) => res,
        Err(e) => {
            tracing::error!("Failed to fetch from origin: {}", e);
            let status = e.status().map(|s| s.as_u16()).unwrap_or(500);
            state.cache.insert(decoded_url, Err(status)).await;
            return Err((
                StatusCode::BAD_GATEWAY,
                "Failed to fetch from origin".to_string(),
            ));
        }
    };

    if !response.status().is_success() {
        let status = response.status().as_u16();
        state.cache.insert(decoded_url, Err(status)).await;
        return Err((
            StatusCode::from_u16(status).unwrap(),
            "Upstream error".to_string(),
        ));
    }

    let content_type = response
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("application/octet-stream")
        .to_string();

    if let Some(content_length) = response.content_length() {
        if content_length > state.max_size {
            state
                .cache
                .insert(decoded_url, Err(StatusCode::PAYLOAD_TOO_LARGE.as_u16()))
                .await;
            return Err((
                StatusCode::PAYLOAD_TOO_LARGE,
                "Content too large".to_string(),
            ));
        }
    }

    let bytes = match response.bytes().await {
        Ok(b) => b,
        Err(e) => {
            tracing::error!("Failed to read bytes from origin: {}", e);
            let status = e.status().map(|s| s.as_u16()).unwrap_or(500);
            state.cache.insert(decoded_url, Err(status)).await;
            return Err((
                StatusCode::BAD_GATEWAY,
                "Failed to read content".to_string(),
            ));
        }
    };

    if bytes.len() as u64 > state.max_size {
        state
            .cache
            .insert(decoded_url, Err(StatusCode::PAYLOAD_TOO_LARGE.as_u16()))
            .await;
        return Err((
            StatusCode::PAYLOAD_TOO_LARGE,
            "Content too large".to_string(),
        ));
    }

    let (processed_bytes, final_content_type) = if content_type.starts_with("image/") {
        match image::load_from_memory(&bytes) {
            Ok(img) => {
                let resized = img.resize_to_fill(512, 512, image::imageops::FilterType::Lanczos3);
                let mut webp_bytes = Vec::new();
                let encoder = webp::WebPEncoder::new_lossless(&mut webp_bytes);
                match resized.write_with_encoder(encoder) {
                    Ok(_) => (Bytes::from(webp_bytes), "image/webp".to_string()),
                    Err(e) => {
                        tracing::error!("Failed to encode to webp: {}", e);
                        (bytes, content_type)
                    }
                }
            }
            Err(e) => {
                tracing::warn!("Failed to decode image, serving as is: {}", e);
                (bytes, content_type)
            }
        }
    } else {
        (bytes, content_type)
    };

    state
        .cache
        .insert(
            decoded_url.clone(),
            Ok((processed_bytes.clone(), final_content_type.clone())),
        )
        .await;

    let mut headers = HeaderMap::new();
    headers.insert(header::CONTENT_TYPE, final_content_type.parse().unwrap());
    Ok((headers, Body::from(processed_bytes)).into_response())
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
