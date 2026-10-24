#![feature(ip)]

use anyhow::anyhow;
use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
};
use base64::{Engine, engine::general_purpose};
use bytes::Bytes;
use image::{DynamicImage, ImageReader, Limits, imageops::FilterType};
use moka::future::Cache;
use near_min_api::types::AccountId;
use percent_encoding::{NON_ALPHANUMERIC, utf8_percent_encode};
use reqwest::Client;
use rocksdb::{DB, Options};
use serde::{Deserialize, Serialize, de::IgnoredAny};
use std::{
    env,
    io::Cursor,
    net::{IpAddr, Ipv4Addr, SocketAddr},
    sync::Arc,
    time::Duration,
};
use teloxide::{
    Bot,
    dispatching::UpdateHandler,
    prelude::*,
    types::{InlineKeyboardButton, InlineKeyboardMarkup, ParseMode},
    utils::markdown,
};
use tokio::sync::Semaphore;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;
use url::{Host, Url};

const LOW_RES_SIZE: u32 = 64;
const HIGH_RES_SIZE: u32 = 576;
const MAX_CACHE_BYTES: u64 = 1024 * 1024 * 1024;
// Approximate moka bookkeeping per entry (key Arc, entry info, deque nodes, hash bucket).
const CACHE_ENTRY_OVERHEAD_BYTES: usize = 512;
const MAX_REDIRECTS: usize = 5;
// Images over these limits are proxied as-is instead of being resized.
const MAX_DECODED_IMAGE_DIMENSION: u32 = 8192;
const MAX_DECODER_ALLOC_BYTES: u64 = 256 * 1024 * 1024;
// usvg decompresses svgz without any size limit.
const GZIP_MAGIC: [u8; 2] = [0x1f, 0x8b];

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, Eq)]
pub enum HiddenNft {
    Collection(AccountId),
    Token(AccountId, String),
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
    image_jobs: Arc<Semaphore>,
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
        .weigher(|key: &String, value: &Result<Bytes, u16>| {
            let body_len = value.as_ref().map_or(0, Bytes::len);
            u32::try_from(key.len() + body_len + CACHE_ENTRY_OVERHEAD_BYTES).unwrap_or(u32::MAX)
        })
        .max_capacity(MAX_CACHE_BYTES)
        .time_to_live(Duration::from_secs(cache_duration))
        .build();

    // Image work runs on blocking threads
    let image_job_permits = std::thread::available_parallelism()
        .expect("Failed to determine available parallelism")
        .get();

    let bot = Bot::from_env();
    let telegram_chat_id = env::var("TELEGRAM_CHAT_ID").expect("TELEGRAM_CHAT_ID must be set");

    let state = AppState {
        client: Client::builder()
            .timeout(Duration::from_secs(10))
            .dns_resolver(Arc::new(PublicAddressResolver))
            .redirect(public_redirect_policy())
            .no_proxy()
            .build()
            .unwrap(),
        cache,
        max_size,
        image_jobs: Arc::new(Semaphore::new(image_job_permits)),
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

    let content_type = response
        .headers()
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .map(str::to_owned);

    let bytes = match read_body_limited(response, state.max_size).await {
        Ok(bytes) => bytes,
        Err(LimitedBodyError::TooLarge) => {
            let status = StatusCode::PAYLOAD_TOO_LARGE;
            state
                .cache
                .insert(cache_key_low, Err(status.as_u16()))
                .await;
            state
                .cache
                .insert(cache_key_high, Err(status.as_u16()))
                .await;
            return Err((
                status,
                "Image size exceeds the maximum allowed limit".into(),
            ));
        }
        Err(LimitedBodyError::Read(e)) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to read image bytes: {e}"),
            ));
        }
    };

    let looks_like_svg = is_svg(content_type.as_deref(), &bytes);
    let image_job = state
        .image_jobs
        .clone()
        .acquire_owned()
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Image job queue closed: {e}"),
            )
        })?;
    let input = bytes.clone();
    let processed = tokio::task::spawn_blocking(move || {
        let processed = process_image(&input, looks_like_svg);
        drop(image_job);
        processed
    })
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Image processing task failed: {e}"),
        )
    })?;

    let (low_res, high_res) = match processed {
        ProcessedImage::Resized { low_res, high_res } => (low_res, high_res),
        ProcessedImage::SvgRasterizeFailed(e) => {
            tracing::warn!("Failed to rasterize SVG: {e}");
            let status = StatusCode::UNPROCESSABLE_ENTITY;
            state
                .cache
                .insert(cache_key_low, Err(status.as_u16()))
                .await;
            state
                .cache
                .insert(cache_key_high, Err(status.as_u16()))
                .await;
            return Err((status, format!("Failed to rasterize SVG: {e}")));
        }
        ProcessedImage::Undecodable(e) => {
            tracing::warn!("Failed to decode image, proxying as is. Error: {e}");
            state.cache.insert(cache_key_low, Ok(bytes.clone())).await;
            state.cache.insert(cache_key_high, Ok(bytes.clone())).await;
            return Ok(bytes);
        }
    };

    for (cache_key, resized) in [(cache_key_low, &low_res), (cache_key_high, &high_res)] {
        match resized {
            Ok(webp_bytes) => state.cache.insert(cache_key, Ok(webp_bytes.clone())).await,
            Err(e) => tracing::error!("Failed to encode resized image to WebP: {e}"),
        }
    }

    let requested = if size == LOW_RES_SIZE {
        low_res
    } else {
        high_res
    };
    requested.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to encode resized image to WebP: {e}"),
        )
    })
}

enum LimitedBodyError {
    TooLarge,
    Read(reqwest::Error),
}

async fn read_body_limited(
    mut response: reqwest::Response,
    max_size: u64,
) -> Result<Bytes, LimitedBodyError> {
    if response.content_length().is_some_and(|len| len > max_size) {
        return Err(LimitedBodyError::TooLarge);
    }
    let mut body = Vec::new();
    while let Some(chunk) = response.chunk().await.map_err(LimitedBodyError::Read)? {
        if (body.len() + chunk.len()) as u64 > max_size {
            return Err(LimitedBodyError::TooLarge);
        }
        body.extend_from_slice(&chunk);
    }
    // Bytes::from(Vec) would keep the unused capacity alive in the cache.
    Ok(Bytes::from(body.into_boxed_slice()))
}

enum ProcessedImage {
    Resized {
        low_res: image::ImageResult<Bytes>,
        high_res: image::ImageResult<Bytes>,
    },
    SvgRasterizeFailed(anyhow::Error),
    Undecodable(image::ImageError),
}

fn process_image(bytes: &[u8], looks_like_svg: bool) -> ProcessedImage {
    let img = match decode_image(bytes) {
        Ok(img) => img,
        Err(_) if looks_like_svg => match rasterize_svg(bytes, HIGH_RES_SIZE) {
            Ok(img) => img,
            Err(e) => return ProcessedImage::SvgRasterizeFailed(e),
        },
        Err(e) => return ProcessedImage::Undecodable(e),
    };
    ProcessedImage::Resized {
        low_res: resize_to_webp(&img, LOW_RES_SIZE),
        high_res: resize_to_webp(&img, HIGH_RES_SIZE),
    }
}

fn decode_image(bytes: &[u8]) -> image::ImageResult<DynamicImage> {
    let mut limits = Limits::default();
    limits.max_image_width = Some(MAX_DECODED_IMAGE_DIMENSION);
    limits.max_image_height = Some(MAX_DECODED_IMAGE_DIMENSION);
    limits.max_alloc = Some(MAX_DECODER_ALLOC_BYTES);
    let mut reader = ImageReader::new(Cursor::new(bytes)).with_guessed_format()?;
    reader.limits(limits);
    reader.decode()
}

fn resize_to_webp(img: &DynamicImage, size: u32) -> image::ImageResult<Bytes> {
    let resized_img = img.resize(size, size, FilterType::Lanczos3);
    let mut buffer = Cursor::new(Vec::new());
    resized_img.write_to(&mut buffer, image::ImageFormat::WebP)?;
    Ok(Bytes::from(buffer.into_inner().into_boxed_slice()))
}

fn is_svg(content_type: Option<&str>, bytes: &[u8]) -> bool {
    if content_type.is_some_and(|ct| ct.to_ascii_lowercase().contains("image/svg")) {
        return true;
    }
    let head = &bytes[..bytes.len().min(1024)];
    String::from_utf8_lossy(head).contains("<svg")
}

fn rasterize_svg(data: &[u8], target: u32) -> anyhow::Result<DynamicImage> {
    if data.starts_with(&GZIP_MAGIC) {
        return Err(anyhow!("Compressed SVG is not supported"));
    }
    let mut opt = resvg::usvg::Options::default();
    opt.image_href_resolver.resolve_string = Box::new(|_, _| None);
    // resvg decodes embedded rasters without limits; nested SVGs reuse this resolver.
    let default_data_resolver = resvg::usvg::ImageHrefResolver::default_data_resolver();
    opt.image_href_resolver.resolve_data = Box::new(move |mime, data, opts| {
        if data.starts_with(&GZIP_MAGIC) {
            return None;
        }
        let kind = default_data_resolver(mime, data, opts)?;
        let within_limits = match &kind {
            resvg::usvg::ImageKind::SVG(_) => true,
            resvg::usvg::ImageKind::JPEG(raster)
            | resvg::usvg::ImageKind::PNG(raster)
            | resvg::usvg::ImageKind::GIF(raster)
            | resvg::usvg::ImageKind::WEBP(raster) => raster_within_decoder_limits(raster),
        };
        within_limits.then_some(kind)
    });

    let tree = resvg::usvg::Tree::from_data(data, &opt)?;
    let size = tree.size();
    let (width, height) = (size.width(), size.height());
    let scale = target as f32 / width.max(height);
    let pixel_width = (width * scale).round().max(1.0) as u32;
    let pixel_height = (height * scale).round().max(1.0) as u32;

    let mut pixmap = resvg::tiny_skia::Pixmap::new(pixel_width, pixel_height)
        .ok_or_else(|| anyhow!("Invalid SVG size {pixel_width}x{pixel_height}"))?;
    resvg::render(
        &tree,
        resvg::tiny_skia::Transform::from_scale(scale, scale),
        &mut pixmap.as_mut(),
    );

    let rgba = image::RgbaImage::from_raw(pixel_width, pixel_height, pixmap.take_demultiplied())
        .ok_or_else(|| anyhow!("Rasterized SVG buffer has unexpected size"))?;
    Ok(DynamicImage::ImageRgba8(rgba))
}

fn raster_within_decoder_limits(data: &[u8]) -> bool {
    ImageReader::new(Cursor::new(data))
        .with_guessed_format()
        .ok()
        .and_then(|reader| reader.into_dimensions().ok())
        .is_some_and(|(width, height)| {
            width <= MAX_DECODED_IMAGE_DIMENSION && height <= MAX_DECODED_IMAGE_DIMENSION
        })
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

    let bytes = match read_body_limited(response, state.max_size).await {
        Ok(bytes) => bytes,
        Err(LimitedBodyError::TooLarge) => {
            let status = StatusCode::PAYLOAD_TOO_LARGE;
            state.cache.insert(cache_key, Err(status.as_u16())).await;
            return Err((
                status,
                "Traits size exceeds the maximum allowed limit".into(),
            ));
        }
        Err(LimitedBodyError::Read(e)) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to read traits bytes: {e}"),
            ));
        }
    };

    if serde_json::from_slice::<IgnoredAny>(&bytes).is_err() {
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
        Some(Host::Domain(host)) if (host == "localhost" || !host.contains('.')) => {
            return true;
        }
        Some(Host::Ipv4(ip)) if !is_global_ip(IpAddr::V4(ip)) => {
            return true;
        }
        Some(Host::Ipv6(ip)) if !is_global_ip(IpAddr::V6(ip)) => {
            return true;
        }
        _ => {}
    }
    false
}

fn is_global_ip(ip: IpAddr) -> bool {
    match ip.to_canonical() {
        // NAT64 (RFC 6052) translates these to the embedded IPv4 address.
        IpAddr::V6(v6) if matches!(v6.segments(), [0x64, 0xff9b, 0, 0, 0, 0, _, _]) => {
            let [.., a, b, c, d] = v6.octets();
            Ipv4Addr::new(a, b, c, d).is_global()
        }
        ip => ip.is_global(),
    }
}

// Literal-IP hosts never reach the resolver, so they are checked by is_local
// before the request and in public_redirect_policy for every redirect hop.
struct PublicAddressResolver;

impl reqwest::dns::Resolve for PublicAddressResolver {
    fn resolve(&self, name: reqwest::dns::Name) -> reqwest::dns::Resolving {
        Box::pin(resolve_public_addrs(name))
    }
}

async fn resolve_public_addrs(
    name: reqwest::dns::Name,
) -> Result<reqwest::dns::Addrs, Box<dyn std::error::Error + Send + Sync>> {
    let host = name.as_str();
    let addrs: Vec<SocketAddr> = tokio::net::lookup_host((host, 0)).await?.collect();
    if let Some(addr) = addrs.iter().find(|addr| !is_global_ip(addr.ip())) {
        return Err(format!("{host} resolves to non-global address {}", addr.ip()).into());
    }
    Ok(Box::new(addrs.into_iter()))
}

fn public_redirect_policy() -> reqwest::redirect::Policy {
    reqwest::redirect::Policy::custom(|attempt| {
        let url = attempt.url();
        let rejection = if attempt.previous().len() > MAX_REDIRECTS {
            Some(format!("Too many redirects (max {MAX_REDIRECTS})"))
        } else if !matches!(url.scheme(), "http" | "https") {
            Some(format!("Redirect to unsupported scheme: {url}"))
        } else if is_local(url.host()) {
            Some(format!("Redirect to local host is forbidden: {url}"))
        } else {
            None
        };
        match rejection {
            Some(reason) => attempt.error(reason),
            None => attempt.follow(),
        }
    })
}
