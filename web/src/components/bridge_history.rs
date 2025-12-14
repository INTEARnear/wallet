use chrono::{DateTime, Utc};
use deli::{CursorDirection, Database, Model};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_use::{UseIntervalReturn, use_interval};
use near_min_api::types::{AccountId, Balance, CryptoHash};
use near_min_api::utils::dec_format;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::collections::{HashMap, HashSet};

use crate::components::{
    copy_button::CopyButton, copyable_address::CopyableAddress, qrcode_display::QRCodeDisplay,
};
use crate::contexts::accounts_context::AccountsContext;
use crate::data::bridge_networks::{ChainInfo, NEAR, NETWORK_NAMES};
use crate::pages::settings::open_live_chat;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct BridgeToken {
    pub defuse_asset_identifier: String,
    pub decimals: u32,
    pub asset_name: String,
    #[serde(with = "dec_format")]
    pub min_deposit_amount: Balance,
    #[serde(with = "dec_format")]
    pub min_withdrawal_amount: Balance,
    #[serde(with = "dec_format")]
    pub withdrawal_fee: Balance,
    pub intents_token_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SupportedTokensResponse {
    pub tokens: Vec<BridgeToken>,
}

async fn fetch_supported_tokens() -> Result<HashMap<String, BridgeToken>, String> {
    let request_body = json!({
        "id": 1,
        "jsonrpc": "2.0",
        "method": "supported_tokens",
        "params": [{"chains": []}]
    });

    let response = reqwest::Client::new()
        .post("https://bridge.chaindefuser.com/rpc")
        .header("content-type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch supported tokens: {e}"))?;

    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {e}"))?;

    let tokens_response: SupportedTokensResponse = serde_json::from_value(
        json.get("result")
            .ok_or("No result field in response")?
            .clone(),
    )
    .map_err(|e| format!("Failed to deserialize tokens: {e}"))?;

    let token_map: HashMap<String, BridgeToken> = tokens_response
        .tokens
        .into_iter()
        .map(|t| (t.intents_token_id.clone(), t))
        .collect();

    Ok(token_map)
}

const DB_NAME: &str = "bridge_history";

pub async fn setup_db() -> Result<Database, deli::Error> {
    Database::builder(DB_NAME)
        .version(1)
        .add_model::<BridgeHistoryEntry>()
        .build()
        .await
        .map_err(|e| {
            log::error!("Failed to open bridge history database: {e:?}");
            e
        })
}

pub async fn load_bridge_history_page(
    start_index: u32,
    limit: u32,
) -> Result<Vec<BridgeHistoryEntry>, String> {
    let db = setup_db()
        .await
        .map_err(|e| format!("Failed to open database: {e:?}"))?;

    let tx = db
        .transaction()
        .with_model::<BridgeHistoryEntry>()
        .build()
        .map_err(|e| format!("Failed to create transaction: {e:?}"))?;

    let store = BridgeHistoryEntry::with_transaction(&tx)
        .map_err(|e| format!("Failed to instantiate store: {e:?}"))?;

    let Some(mut cursor) = store
        .cursor(.., Some(CursorDirection::Prev))
        .await
        .map_err(|e| format!("Failed to create cursor: {e:?}"))?
    else {
        return Ok(Vec::new());
    };

    let mut values = Vec::new();
    cursor.advance(start_index).await.ok();

    while let Some(value) = cursor
        .value()
        .map_err(|e| format!("Failed to get cursor value: {e:?}"))?
    {
        values.push(value);
        if values.len() >= limit as usize {
            break;
        }
        if let Err(e) = cursor.advance(1).await {
            log::error!("Failed to advance cursor: {e:?}");
            break;
        }
    }

    Ok(values)
}

pub async fn count_bridge_history() -> Result<u32, String> {
    let db = setup_db()
        .await
        .map_err(|e| format!("Failed to open database: {e:?}"))?;

    let tx = db
        .transaction()
        .with_model::<BridgeHistoryEntry>()
        .build()
        .map_err(|e| format!("Failed to create transaction: {e:?}"))?;

    let store = BridgeHistoryEntry::with_transaction(&tx)
        .map_err(|e| format!("Failed to instantiate store: {e:?}"))?;

    store
        .count(..)
        .await
        .map_err(|e| format!("Failed to count entries: {e:?}"))
}

pub async fn add_to_bridge_history(entry: AddBridgeHistoryEntry) -> Result<u32, String> {
    let db = setup_db()
        .await
        .map_err(|e| format!("Failed to open database: {e:?}"))?;

    let tx = db
        .transaction()
        .writable()
        .with_model::<BridgeHistoryEntry>()
        .build()
        .map_err(|e| format!("Failed to create transaction: {e:?}"))?;

    let store = BridgeHistoryEntry::with_transaction(&tx)
        .map_err(|e| format!("Failed to instantiate store: {e:?}"))?;

    let id = store
        .add(&entry)
        .await
        .map_err(|e| format!("Failed to add entry: {e:?}"))?;

    tx.commit()
        .await
        .map_err(|e| format!("Failed to commit transaction: {e:?}"))?;

    Ok(id)
}

#[derive(Debug, Clone, Serialize, Deserialize, Model)]
#[serde(rename_all = "camelCase")]
pub struct BridgeHistoryEntry {
    #[deli(auto_increment)]
    pub id: u32,
    pub deposit_address: DepositAddress,
    pub created_at: DateTime<Utc>,
    #[serde(default)]
    pub is_send: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Hash, Eq)]
pub enum DepositAddress {
    Simple(String),
    WithMemo(String, String),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StatusResponse {
    pub status: DepositStatus,
    pub swap_details: SwapDetails,
    pub quote_response: QuoteResponse,
    pub updated_at: DateTime<Utc>,
    pub correlation_id: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SwapDetails {
    #[serde(with = "dec_format")]
    pub deposited_amount: Option<Balance>,
    pub deposited_amount_usd: Option<String>,
    pub deposited_amount_formatted: Option<String>,
    #[serde(default)]
    pub intent_hashes: Vec<CryptoHash>,
    #[serde(default)]
    pub near_tx_hashes: Vec<CryptoHash>,
    #[serde(with = "dec_format")]
    pub amount_in: Option<Balance>,
    pub amount_in_formatted: Option<String>,
    pub amount_in_usd: Option<String>,
    #[serde(with = "dec_format")]
    pub amount_out: Option<Balance>,
    pub amount_out_formatted: Option<String>,
    pub amount_out_usd: Option<String>,
    pub slippage: Option<i32>,
    #[serde(with = "dec_format")]
    pub refunded_amount: Balance,
    pub refunded_amount_formatted: String,
    pub refunded_amount_usd: String,
    pub refund_reason: Option<String>,
    pub origin_chain_tx_hashes: Vec<ChainTxHash>,
    pub destination_chain_tx_hashes: Vec<ChainTxHash>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChainTxHash {
    pub hash: String,
    pub explorer_url: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuoteResponse {
    pub timestamp: DateTime<Utc>,
    pub signature: String,
    pub quote_request: QuoteRequest,
    pub quote: QuoteData,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SwapType {
    ExactInput,
    ExactOutput,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DepositType {
    OriginChain,
    #[allow(dead_code)]
    Intents,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RefundType {
    OriginChain,
    Intents,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RecipientType {
    DestinationChain,
    #[allow(dead_code)]
    Intents,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DepositMode {
    Simple,
    Memo,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuoteRequest {
    pub dry: bool,
    pub swap_type: SwapType,
    pub deposit_mode: DepositMode,
    pub slippage_tolerance: u32,
    pub origin_asset: String,
    pub deposit_type: DepositType,
    pub destination_asset: String,
    #[serde(with = "dec_format")]
    pub amount: Balance,
    pub refund_to: String,
    pub refund_type: RefundType,
    pub recipient: String,
    pub recipient_type: RecipientType,
    pub deadline: DateTime<Utc>,
    pub app_fees: Vec<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub virtual_chain_recipient: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub virtual_chain_refund_recipient: Option<String>,
    pub referral: AccountId,
    #[serde(default)]
    pub quote_waiting_time_ms: u64,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuoteData {
    #[serde(with = "dec_format")]
    pub amount_in: Balance,
    pub amount_in_formatted: String,
    pub amount_in_usd: String,
    #[serde(with = "dec_format")]
    pub min_amount_in: Balance,
    #[serde(with = "dec_format")]
    pub amount_out: Balance,
    pub amount_out_formatted: String,
    pub amount_out_usd: String,
    #[serde(with = "dec_format")]
    pub min_amount_out: Balance,
    pub time_when_inactive: Option<DateTime<Utc>>,
    pub deposit_address: Option<String>,
    pub deposit_memo: Option<String>,
    pub deadline: Option<DateTime<Utc>>,
    pub time_estimate: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DepositStatus {
    KnownDepositTx,
    PendingDeposit,
    IncompleteDeposit,
    Processing,
    Success,
    Refunded,
    Failed,
}

impl DepositStatus {
    pub fn display(&self) -> &str {
        match self {
            DepositStatus::KnownDepositTx => "Deposit detected, please wait...",
            DepositStatus::PendingDeposit => "Waiting for deposit",
            DepositStatus::IncompleteDeposit => {
                "Incomplete deposit, please deposit the rest of the amount to the same address"
            }
            DepositStatus::Processing => "Processing...",
            DepositStatus::Success => "Success",
            DepositStatus::Refunded => {
                "Something went wrong, please contact support in Settings to get assistance"
            }
            DepositStatus::Failed => {
                "Bridge failed, please contact support in Settings to get assistance"
            }
        }
    }

    pub fn color_class(&self) -> &str {
        match self {
            DepositStatus::KnownDepositTx | DepositStatus::Processing => "text-blue-400",
            DepositStatus::PendingDeposit => "text-gray-400",
            DepositStatus::IncompleteDeposit => "text-yellow-400",
            DepositStatus::Success => "text-green-400",
            DepositStatus::Failed | DepositStatus::Refunded => "text-red-400",
        }
    }
}

pub async fn fetch_deposit_status(
    deposit_address: &DepositAddress,
) -> Result<StatusResponse, String> {
    let status_url = match deposit_address {
        DepositAddress::WithMemo(address, memo) => format!(
            "https://1click.chaindefuser.com/v0/status?depositAddress={address}&depositMemo={memo}"
        ),
        DepositAddress::Simple(address) => {
            format!("https://1click.chaindefuser.com/v0/status?depositAddress={address}")
        }
    };

    let response = reqwest::Client::new()
        .get(&status_url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch status: {e}"))?;

    let response_text = response
        .text()
        .await
        .map_err(|e| format!("Failed to fetch status: {e}"))?;

    let status_response = match serde_json::from_str::<StatusResponse>(&response_text) {
        Ok(status_response) => status_response,
        Err(e) => {
            log::error!("Failed to parse status response: {e}, response text: {response_text}");
            return Err(format!("Failed to parse status response: {e}"));
        }
    };

    Ok(status_response)
}

fn get_chain_info(defuse_asset_identifier: &str) -> Option<&'static ChainInfo<'static>> {
    let mut parts = defuse_asset_identifier.splitn(3, ':');
    let chain_type = parts.next()?;
    let chain_id = parts.next()?;

    if chain_type == "near" && chain_id == "mainnet" {
        return Some(&NEAR);
    }

    NETWORK_NAMES
        .iter()
        .find(|c| c.chain_type == chain_type && c.chain_id == chain_id)
}

#[component]
pub fn HistoryTab() -> impl IntoView {
    let (expanded_entries, set_expanded_entries) = signal(HashSet::<DepositAddress>::new());
    let (current_page, set_current_page) = signal(0);
    let (loaded_statuses, set_loaded_statuses) = signal(HashSet::<u32>::new());

    const ITEMS_PER_PAGE: u32 = 5;

    let supported_tokens_resource = LocalResource::new(fetch_supported_tokens);

    let history_resource = LocalResource::new(move || {
        let page = current_page.get();
        async move {
            let start_index = page * ITEMS_PER_PAGE;
            load_bridge_history_page(start_index, ITEMS_PER_PAGE)
                .await
                .map_err(|e| format!("Failed to load history: {e}"))
        }
    });

    // Reset loaded statuses when page changes
    Effect::new(move || {
        current_page.track();
        set_loaded_statuses.set(HashSet::new());
    });

    let total_count_resource = LocalResource::new(move || async move {
        count_bridge_history()
            .await
            .map_err(|e| format!("Failed to count history: {e}"))
    });

    let total_pages = Signal::derive(move || {
        total_count_resource
            .get()
            .and_then(|result| result.ok())
            .map(|total| {
                if total == 0 {
                    0
                } else {
                    total.div_ceil(ITEMS_PER_PAGE)
                }
            })
            .unwrap_or(0)
    });

    view! {
        <div class="w-full max-w-2xl">
            <div class="bg-neutral-800 rounded-lg p-4 flex flex-col gap-3">
                <Suspense fallback=move || {
                    view! {
                        <div class="text-center py-8 text-gray-400">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p>"Loading history..."</p>
                        </div>
                    }
                }>
                    {move || {
                        match history_resource.get() {
                            Some(Ok(history)) => {
                                if history.is_empty() {
                                    view! {
                                        <div class="text-center py-8 text-gray-400">
                                            <Icon
                                                icon=icondata::LuHistory
                                                width="48"
                                                height="48"
                                                attr:class="mx-auto mb-4 opacity-50"
                                            />
                                            <p>"No bridge history yet"</p>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    let history_stored = StoredValue::new(history.clone());
                                    let all_loaded = move || {
                                        let loaded = loaded_statuses.get();
                                        loaded.len() == history_stored.read_value().len()
                                    };

                                    view! {
                                        <div
                                            class="text-center py-8 text-gray-400"
                                            class:hidden=all_loaded
                                        >
                                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                            <p>"Loading history..."</p>
                                        </div>
                                        <div
                                            class="flex flex-col gap-2 dis"
                                            class:hidden=move || !all_loaded()
                                        >
                                            <For
                                                each=move || history_stored.get_value()
                                                key=|entry| entry.id
                                                children=move |entry: BridgeHistoryEntry| {
                                                    let entry_id = entry.id;
                                                    let deposit_address = entry.deposit_address.clone();
                                                    let expanded = Signal::derive(move || {
                                                        expanded_entries.get().contains(&deposit_address)
                                                    });
                                                    let deposit_address = entry.deposit_address.clone();
                                                    let toggle_expanded = Callback::new(move |value: bool| {
                                                        let deposit_address = deposit_address.clone();
                                                        set_expanded_entries
                                                            .update(move |set| {
                                                                if value {
                                                                    set.insert(deposit_address.clone());
                                                                } else {
                                                                    set.remove(&deposit_address);
                                                                }
                                                            });
                                                    });
                                                    let supported_tokens = Signal::derive(move || {
                                                        supported_tokens_resource
                                                            .get()
                                                            .and_then(|result| result.ok())
                                                    });
                                                    let on_status_loaded = Callback::new(move |_: ()| {
                                                        log::info!("Status loaded for entry {entry_id}");
                                                        set_loaded_statuses
                                                            .update(|set| {
                                                                set.insert(entry_id);
                                                            });
                                                    });
                                                    if entry.is_send {
                                                        view! {
                                                            <SendHistoryItem
                                                                entry=entry
                                                                expanded=expanded
                                                                toggle_expanded=toggle_expanded
                                                                supported_tokens=supported_tokens
                                                                on_status_loaded=on_status_loaded
                                                            />
                                                        }
                                                            .into_any()
                                                    } else {
                                                        view! {
                                                            <ReceiveHistoryItem
                                                                entry=entry
                                                                expanded=expanded
                                                                toggle_expanded=toggle_expanded
                                                                supported_tokens=supported_tokens
                                                                on_status_loaded=on_status_loaded
                                                            />
                                                        }
                                                            .into_any()
                                                    }
                                                }
                                            />
                                        </div>
                                        <Show when=move || {
                                            let pages = total_pages.get();
                                            pages > 1
                                        }>
                                            <div
                                                class="flex items-center justify-center gap-2 mt-4"
                                                class:hidden=move || !all_loaded()
                                            >
                                                <button
                                                    class=move || {
                                                        format!(
                                                            "px-3 py-1 rounded-lg transition-colors text-sm {}",
                                                            if current_page.get() == 0 {
                                                                "bg-neutral-700 text-gray-500 cursor-not-allowed"
                                                            } else {
                                                                "bg-neutral-700 text-white hover:bg-neutral-600 cursor-pointer"
                                                            },
                                                        )
                                                    }
                                                    disabled=move || current_page.get() == 0
                                                    on:click=move |_| {
                                                        if current_page.get() > 0 {
                                                            set_current_page(current_page.get() - 1);
                                                        }
                                                    }
                                                >
                                                    "Previous"
                                                </button>
                                                <span class="text-gray-400 text-sm">
                                                    {move || {
                                                        format!(
                                                            "Page {} of {}",
                                                            current_page.get() + 1,
                                                            total_pages.get(),
                                                        )
                                                    }}
                                                </span>
                                                <button
                                                    class=move || {
                                                        format!(
                                                            "px-3 py-1 rounded-lg transition-colors text-sm {}",
                                                            if current_page.get() >= total_pages.get().saturating_sub(1)
                                                            {
                                                                "bg-neutral-700 text-gray-500 cursor-not-allowed"
                                                            } else {
                                                                "bg-neutral-700 text-white hover:bg-neutral-600 cursor-pointer"
                                                            },
                                                        )
                                                    }
                                                    disabled=move || {
                                                        current_page.get() >= total_pages.get().saturating_sub(1)
                                                    }
                                                    on:click=move |_| {
                                                        if current_page.get() < total_pages.get().saturating_sub(1)
                                                        {
                                                            set_current_page(current_page.get() + 1);
                                                        }
                                                    }
                                                >
                                                    "Next"
                                                </button>
                                            </div>
                                        </Show>
                                    }
                                        .into_any()
                                }
                            }
                            Some(Err(e)) => {
                                view! {
                                    <div class="text-center py-8 text-red-400">
                                        <p>"Failed to load history: " {e}</p>
                                    </div>
                                }
                                    .into_any()
                            }
                            None => {
                                view! {
                                    <div class="text-center py-8 text-gray-400">
                                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                        <p>"Loading history..."</p>
                                    </div>
                                }
                                    .into_any()
                            }
                        }
                    }}
                </Suspense>
            </div>
        </div>
    }
}

#[component]
fn ReceiveHistoryItem(
    entry: BridgeHistoryEntry,
    expanded: Signal<bool>,
    toggle_expanded: Callback<bool>,
    supported_tokens: Signal<Option<HashMap<String, BridgeToken>>>,
    on_status_loaded: Callback<()>,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();

    let deposit_address = entry.deposit_address.clone();
    let (status_data, set_status_data) = signal::<Option<StatusResponse>>(None);

    let is_terminal = Memo::new(move |_| {
        if let Some(data) = status_data.get() {
            matches!(
                data.status,
                DepositStatus::Success | DepositStatus::Failed | DepositStatus::Refunded
            )
        } else {
            false
        }
    });

    let UseIntervalReturn {
        counter: status_counter,
        ..
    } = use_interval(10000);
    let UseIntervalReturn {
        counter: countdown_counter,
        ..
    } = use_interval(1000);

    let deposit_address_stored = StoredValue::new(deposit_address.clone());
    Effect::new(move || {
        status_counter.track();
        if !is_terminal() {
            spawn_local(async move {
                let deposit_addr = deposit_address_stored.get_value();
                if let Ok(status_response) = fetch_deposit_status(&deposit_addr).await {
                    set_status_data.set(Some(status_response));
                    on_status_loaded.run(());
                }
            });
        } else {
            on_status_loaded.run(());
        }
    });

    let status_display = move || {
        if let Some(data) = status_data.get() {
            let is_expired = data
                .quote_response
                .quote
                .deadline
                .map(|deadline| deadline < Utc::now())
                .unwrap_or(false);
            let status = &data.status;

            let should_show_expired = is_expired
                && matches!(
                    status,
                    DepositStatus::PendingDeposit | DepositStatus::IncompleteDeposit
                );

            if should_show_expired {
                ("Expired".to_string(), "text-red-400".to_string())
            } else {
                (
                    status.display().to_string(),
                    status.color_class().to_string(),
                )
            }
        } else {
            ("Loading".to_string(), "text-gray-400".to_string())
        }
    };

    let is_pending = move || {
        if let Some(data) = status_data.get() {
            matches!(
                data.status,
                DepositStatus::PendingDeposit | DepositStatus::IncompleteDeposit
            )
        } else {
            true
        }
    };

    let is_failed = move || {
        if let Some(data) = status_data.get() {
            matches!(data.status, DepositStatus::Failed | DepositStatus::Refunded)
        } else {
            false
        }
    };

    let format_date = |date: DateTime<Utc>| date.format("%b %d, %Y %H:%M UTC").to_string();

    let countdown_text = move || {
        countdown_counter.track();
        if is_terminal() {
            return String::new();
        }

        if let Some(data) = status_data.get() {
            if let Some(deadline) = data.quote_response.quote.deadline {
                let now = Utc::now();
                let duration = deadline.signed_duration_since(now);

                if duration.num_seconds() <= 0 {
                    "Expired".to_string()
                } else {
                    let hours = duration.num_hours();
                    let minutes = duration.num_minutes() % 60;
                    let seconds = duration.num_seconds() % 60;
                    format!("Expires: {:02}:{:02}:{:02}", hours, minutes, seconds)
                }
            } else {
                String::new()
            }
        } else {
            String::new()
        }
    };

    let get_token_symbols = move || {
        let tokens = supported_tokens.get();
        if let Some(data) = status_data.get() {
            let origin_asset = &data.quote_response.quote_request.origin_asset;
            let dest_asset = &data.quote_response.quote_request.destination_asset;

            let mut origin_symbol = tokens
                .as_ref()
                .and_then(|t| t.get(origin_asset).cloned())
                .map(|t| t.asset_name.clone())
                .unwrap_or("Unknown".to_string());
            let mut dest_symbol = tokens
                .and_then(|t| t.get(dest_asset).cloned())
                .map(|t| t.asset_name.clone())
                .unwrap_or("Unknown".to_string());

            if origin_symbol == "wNEAR" {
                origin_symbol = "NEAR".to_string();
            }
            if dest_symbol == "wNEAR" {
                dest_symbol = "NEAR".to_string();
            }

            (origin_symbol, dest_symbol)
        } else {
            ("Loading...".to_string(), "Loading...".to_string())
        }
    };

    let get_networks_display = move || {
        if let Some(data) = status_data.get() {
            let tokens = supported_tokens.get();
            let origin_asset = &data.quote_response.quote_request.origin_asset;
            let dest_asset = &data.quote_response.quote_request.destination_asset;

            let origin_network = tokens
                .as_ref()
                .and_then(|t| t.get(origin_asset).cloned())
                .and_then(|asset| get_chain_info(&asset.defuse_asset_identifier))
                .map(|chain| chain.display_name)
                .unwrap_or("Unknown");

            let dest_network = tokens
                .and_then(|t| t.get(dest_asset).cloned())
                .and_then(|asset| get_chain_info(&asset.defuse_asset_identifier))
                .map(|chain| chain.display_name)
                .unwrap_or("Unknown");

            (origin_network.to_string(), dest_network.to_string())
        } else {
            ("Loading...".to_string(), "Loading...".to_string())
        }
    };

    let get_amounts_display = move || {
        if let Some(data) = status_data.get() {
            let swap_type = &data.quote_response.quote_request.swap_type;
            let amount_in = data
                .quote_response
                .quote
                .amount_in_formatted
                .trim_end_matches('0')
                .trim_end_matches('.')
                .to_string();
            let amount_out = data
                .quote_response
                .quote
                .amount_out_formatted
                .trim_end_matches('0')
                .trim_end_matches('.')
                .to_string();

            let is_exact_output = matches!(swap_type, SwapType::ExactOutput);

            (amount_in, amount_out, is_exact_output)
        } else {
            ("Loading...".to_string(), "Loading...".to_string(), false)
        }
    };

    view! {
        <div class="bg-neutral-700 rounded-lg overflow-hidden">
            <button
                class="w-full p-4 text-left hover:bg-neutral-600 transition-colors"
                on:click=move |_| {
                    toggle_expanded.run(!expanded.get());
                }
            >
                <div class="flex justify-between items-start gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-white">
                                {move || {
                                    let (origin_token, dest_token) = get_token_symbols();
                                    let (origin_network, dest_network) = get_networks_display();
                                    format!(
                                        "{origin_token} ({origin_network}) → {dest_token} ({dest_network})",
                                    )
                                }}

                            </span>
                            <span class=move || {
                                format!("text-sm {}", status_display().1)
                            }>{move || status_display().0}</span>
                        </div>
                        <div class="text-sm text-gray-400">{format_date(entry.created_at)}</div>
                        <div class="flex items-center gap-1 mt-1">
                            <div class="text-sm text-gray-300">
                                {move || {
                                    let (_, amount_out, is_exact_output) = get_amounts_display();
                                    let (_, dest) = get_token_symbols();
                                    let formatted_amount = if let Ok(val) = amount_out
                                        .parse::<f64>()
                                    {
                                        format!("{:.4}", val)
                                            .trim_end_matches('0')
                                            .trim_end_matches('.')
                                            .to_string()
                                    } else {
                                        amount_out
                                    };
                                    if is_exact_output {
                                        format!("{formatted_amount} {dest}")
                                    } else {
                                        format!("≈{formatted_amount} {dest}")
                                    }
                                }}

                            </div>
                            <CopyButton text=Signal::derive(move || {
                                let (_, amount_out, _) = get_amounts_display();
                                amount_out
                            }) />
                        </div>
                        <Show when=move || !is_terminal()>
                            <div class="text-xs text-gray-400 mt-1">
                                {move || {
                                    let countdown = countdown_text();
                                    if !countdown.is_empty() { countdown } else { String::new() }
                                }}
                            </div>
                        </Show>
                    </div>
                    <Icon
                        icon=icondata::LuChevronDown
                        width="20"
                        height="20"
                        attr:class=move || {
                            if expanded.get() {
                                "transform rotate-180 transition-transform"
                            } else {
                                "transition-transform"
                            }
                        }
                    />
                </div>
            </button>

            <Show when=expanded>
                <div class="px-4 pb-4 border-t border-neutral-600 pt-4">
                    <div class="space-y-3">
                        <CopyableAddress
                            address=match entry.deposit_address.clone() {
                                DepositAddress::Simple(address) => address,
                                DepositAddress::WithMemo(address, _) => address,
                            }
                            label="Deposit Address"
                        />

                        {match entry.deposit_address.clone() {
                            DepositAddress::WithMemo(_, memo) => {
                                view! {
                                    <CopyableAddress address=memo label="With memo (IMPORTANT):" />
                                }
                                    .into_any()
                            }
                            DepositAddress::Simple(_) => ().into_any(),
                        }}

                        <div>
                            <p class="text-sm text-gray-400 mb-1">
                                {move || { if is_terminal() { "Sent" } else { "To Send" } }}
                            </p>
                            <p class="text-white">
                                {move || {
                                    if let Some(_data) = status_data.get() {
                                        let (amount_in, _, is_exact_output) = get_amounts_display();
                                        let (origin_symbol, _) = get_token_symbols();
                                        if is_exact_output {
                                            format!("≈{amount_in} {origin_symbol}")
                                        } else {
                                            format!("{amount_in} {origin_symbol}")
                                        }
                                    } else {
                                        "Loading...".to_string()
                                    }
                                }}

                            </p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-400 mb-1">"Expected to receive"</p>
                            <p class="text-white">
                                {move || {
                                    if status_data.read().is_some() {
                                        let (_, amount_out, is_exact_output) = get_amounts_display();
                                        let (_, dest_symbol) = get_token_symbols();
                                        if is_exact_output {
                                            format!("{amount_out} {dest_symbol}")
                                        } else {
                                            format!("≈{amount_out} {dest_symbol}")
                                        }
                                    } else {
                                        "Loading...".to_string()
                                    }
                                }}

                            </p>
                        </div>

                        <Show when=move || {
                            is_pending()
                                && matches!(
                                    deposit_address_stored.get_value(),
                                    DepositAddress::Simple(_)
                                )
                        }>
                            <QRCodeDisplay text=match deposit_address_stored.get_value() {
                                DepositAddress::Simple(address) => address,
                                DepositAddress::WithMemo(_, _) => unreachable!(),
                            } />
                        </Show>

                        <Show when=is_failed>
                            <button
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                on:click=move |_| {
                                    open_live_chat(
                                        accounts_context
                                            .accounts
                                            .get_untracked()
                                            .selected_account_id
                                            .unwrap(),
                                        Some(deposit_address_stored.get_value()),
                                    )
                                }
                            >
                                "Contact Support"
                            </button>
                        </Show>
                    </div>
                </div>
            </Show>
        </div>
    }
}

#[component]
fn SendHistoryItem(
    entry: BridgeHistoryEntry,
    expanded: Signal<bool>,
    toggle_expanded: Callback<bool>,
    supported_tokens: Signal<Option<HashMap<String, BridgeToken>>>,
    on_status_loaded: Callback<()>,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();

    let deposit_address = entry.deposit_address.clone();
    let (status_data, set_status_data) = signal::<Option<StatusResponse>>(None);

    let is_terminal = Memo::new(move |_| {
        if let Some(data) = status_data.get() {
            matches!(
                data.status,
                DepositStatus::Success | DepositStatus::Failed | DepositStatus::Refunded
            )
        } else {
            false
        }
    });

    let UseIntervalReturn {
        counter: status_counter,
        ..
    } = use_interval(10000);

    let deposit_address_stored = StoredValue::new(deposit_address.clone());
    Effect::new(move || {
        status_counter.track();
        if !is_terminal() {
            spawn_local(async move {
                let deposit_addr = deposit_address_stored.get_value();
                if let Ok(status_response) = fetch_deposit_status(&deposit_addr).await {
                    set_status_data.set(Some(status_response));
                    on_status_loaded.run(());
                }
            });
        } else {
            on_status_loaded.run(());
        }
    });

    let status_display = move || {
        if let Some(data) = status_data.get() {
            let is_expired = data
                .quote_response
                .quote
                .deadline
                .map(|deadline| deadline < Utc::now())
                .unwrap_or(false);
            let status = &data.status;

            let should_show_expired = is_expired
                && matches!(
                    status,
                    DepositStatus::PendingDeposit | DepositStatus::IncompleteDeposit
                );

            if should_show_expired {
                ("Expired".to_string(), "text-red-400".to_string())
            } else {
                (
                    status.display().to_string(),
                    status.color_class().to_string(),
                )
            }
        } else {
            ("Loading".to_string(), "text-gray-400".to_string())
        }
    };

    let is_failed = move || {
        if let Some(data) = status_data.get() {
            matches!(data.status, DepositStatus::Failed | DepositStatus::Refunded)
        } else {
            false
        }
    };

    let format_date = |date: DateTime<Utc>| date.format("%b %d, %Y %H:%M UTC").to_string();

    let get_token_symbols = move || {
        let tokens = supported_tokens.get();
        if let Some(data) = status_data.get() {
            let origin_asset = &data.quote_response.quote_request.origin_asset;
            let dest_asset = &data.quote_response.quote_request.destination_asset;

            let origin_symbol = tokens
                .as_ref()
                .and_then(|t| t.get(origin_asset).cloned())
                .map(|t| t.asset_name.clone())
                .unwrap_or("Unknown".to_string());
            let dest_symbol = tokens
                .and_then(|t| t.get(dest_asset).cloned())
                .map(|t| t.asset_name.clone())
                .unwrap_or("Unknown".to_string());

            (origin_symbol, dest_symbol)
        } else {
            ("Loading...".to_string(), "Loading...".to_string())
        }
    };

    let get_networks_display = move || {
        if let Some(data) = status_data.get() {
            let tokens = supported_tokens.get();
            let origin_asset = &data.quote_response.quote_request.origin_asset;
            let dest_asset = &data.quote_response.quote_request.destination_asset;

            let origin_network = tokens
                .as_ref()
                .and_then(|t| t.get(origin_asset).cloned())
                .and_then(|asset| get_chain_info(&asset.defuse_asset_identifier))
                .map(|chain| chain.display_name)
                .unwrap_or("Unknown");

            let dest_network = tokens
                .and_then(|t| t.get(dest_asset).cloned())
                .and_then(|asset| get_chain_info(&asset.defuse_asset_identifier))
                .map(|chain| chain.display_name)
                .unwrap_or("Unknown");

            (origin_network.to_string(), dest_network.to_string())
        } else {
            ("Loading...".to_string(), "Loading...".to_string())
        }
    };

    let get_amounts_display = move || {
        if let Some(data) = status_data.get() {
            let swap_type = &data.quote_response.quote_request.swap_type;
            let amount_in = data
                .quote_response
                .quote
                .amount_in_formatted
                .trim_end_matches('0')
                .trim_end_matches('.')
                .to_string();
            let amount_out = data
                .quote_response
                .quote
                .amount_out_formatted
                .trim_end_matches('0')
                .trim_end_matches('.')
                .to_string();

            let is_exact_output = matches!(swap_type, SwapType::ExactOutput);

            (amount_in, amount_out, is_exact_output)
        } else {
            ("Loading...".to_string(), "Loading...".to_string(), false)
        }
    };

    view! {
        <div class="bg-neutral-700 rounded-lg overflow-hidden">
            <button
                class="w-full p-4 text-left hover:bg-neutral-600 transition-colors"
                on:click=move |_| {
                    toggle_expanded.run(!expanded.get());
                }
            >
                <div class="flex justify-between items-start gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-white">
                                {move || {
                                    let (origin_token, dest_token) = get_token_symbols();
                                    let (origin_network, dest_network) = get_networks_display();
                                    format!(
                                        "{origin_token} ({origin_network}) → {dest_token} ({dest_network})",
                                    )
                                }}

                            </span>
                            <span class=move || {
                                format!("text-sm {}", status_display().1)
                            }>{move || status_display().0}</span>
                        </div>
                        <div class="text-sm text-gray-400">{format_date(entry.created_at)}</div>
                        <div class="flex items-center gap-1 mt-1">
                            <div class="text-sm text-gray-300">
                                {move || {
                                    let (_, amount_out, is_exact_output) = get_amounts_display();
                                    let (_, dest) = get_token_symbols();
                                    let formatted_amount = if let Ok(val) = amount_out
                                        .parse::<f64>()
                                    {
                                        format!("{:.4}", val)
                                            .trim_end_matches('0')
                                            .trim_end_matches('.')
                                            .to_string()
                                    } else {
                                        amount_out
                                    };
                                    if is_exact_output {
                                        format!("{formatted_amount} {dest}")
                                    } else {
                                        format!("≈{formatted_amount} {dest}")
                                    }
                                }}

                            </div>
                            <CopyButton text=Signal::derive(move || {
                                let (_, amount_out, _) = get_amounts_display();
                                amount_out
                            }) />
                        </div>
                    </div>
                    <Icon
                        icon=icondata::LuChevronDown
                        width="20"
                        height="20"
                        attr:class=move || {
                            if expanded.get() {
                                "transform rotate-180 transition-transform"
                            } else {
                                "transition-transform"
                            }
                        }
                    />
                </div>
            </button>

            <Show when=expanded>
                <div class="px-4 pb-4 border-t border-neutral-600 pt-4">
                    <div class="space-y-3">
                        <div>
                            <p class="text-sm text-gray-400 mb-1">"Sent"</p>
                            <p class="text-white">
                                {move || {
                                    if let Some(_data) = status_data.get() {
                                        let (amount_in, _, is_exact_output) = get_amounts_display();
                                        let (origin_symbol, _) = get_token_symbols();
                                        if is_exact_output {
                                            format!("≈{amount_in} {origin_symbol}")
                                        } else {
                                            format!("{amount_in} {origin_symbol}")
                                        }
                                    } else {
                                        "Loading...".to_string()
                                    }
                                }}

                            </p>
                        </div>

                        <div>
                            <p class="text-sm text-gray-400 mb-1">"Expected to receive"</p>
                            <p class="text-white">
                                {move || {
                                    if status_data.read().is_some() {
                                        let (_, amount_out, is_exact_output) = get_amounts_display();
                                        let (_, dest_symbol) = get_token_symbols();
                                        if is_exact_output {
                                            format!("{amount_out} {dest_symbol}")
                                        } else {
                                            format!("≈{amount_out} {dest_symbol}")
                                        }
                                    } else {
                                        "Loading...".to_string()
                                    }
                                }}

                            </p>
                        </div>

                        <Show when=is_failed>
                            <button
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                on:click=move |_| {
                                    open_live_chat(
                                        accounts_context
                                            .accounts
                                            .get_untracked()
                                            .selected_account_id
                                            .unwrap(),
                                        Some(deposit_address_stored.get_value()),
                                    )
                                }
                            >
                                "Contact Support"
                            </button>
                        </Show>
                    </div>
                </div>
            </Show>
        </div>
    }
}
