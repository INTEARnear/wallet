use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use futures_util::FutureExt;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_use::{UseIntervalReturn, use_interval};
use near_min_api::{
    types::{AccountId, Balance},
    utils::dec_format,
};
use serde::{Deserialize, Serialize};
use std::{collections::HashSet, str::FromStr, time::Duration};

use crate::contexts::accounts_context::AccountsContext;
use crate::pages::settings::open_live_chat;
use crate::utils::{decimal_to_balance, generate_qr_code};
use crate::{
    components::select::{Select, SelectOption},
    utils::format_token_amount_full_precision,
};

const DESTINATION_USDC: &str =
    "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1";
const DESTINATION_USDT: &str = "nep141:usdt.tether-token.near";
const DESTINATION_NEAR: &str = "nep141:wrap.near";
const BRIDGE_HISTORY_KEY: &str = "smile_wallet_bridge_history";

fn load_bridge_history() -> Vec<BridgeHistoryEntry> {
    if let Some(storage) = window().local_storage().ok().flatten()
        && let Ok(Some(json)) = storage.get_item(BRIDGE_HISTORY_KEY)
        && let Ok(history) = serde_json::from_str::<Vec<BridgeHistoryEntry>>(&json)
    {
        return history;
    }

    Vec::new()
}

fn save_bridge_history(history: &[BridgeHistoryEntry]) {
    if let Some(storage) = window().local_storage().ok().flatten()
        && let Ok(json) = serde_json::to_string(history)
    {
        let _ = storage.set_item(BRIDGE_HISTORY_KEY, &json);
    }
}

fn add_to_bridge_history(entry: BridgeHistoryEntry) {
    let mut history = load_bridge_history();

    if let Some(existing) = history
        .iter_mut()
        .find(|e| e.deposit_address == entry.deposit_address)
    {
        *existing = entry;
    } else {
        history.insert(0, entry);
    }

    // Keep only the last 100 entries
    if history.len() > 100 {
        history.truncate(100);
    }

    save_bridge_history(&history);
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SupportedTokensResponse {
    tokens: Vec<BridgeToken>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct QuoteRequest {
    dry: bool,
    swap_type: SwapType,
    slippage_tolerance: u32,
    origin_asset: String,
    deposit_type: DepositType,
    destination_asset: String,
    #[serde(with = "dec_format")]
    amount: Balance,
    refund_to: AccountId,
    refund_type: RefundType,
    recipient: AccountId,
    recipient_type: RecipientType,
    deadline: DateTime<Utc>,
    referral: AccountId,
    quote_waiting_time_ms: u64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
enum SwapType {
    ExactInput,
    #[allow(dead_code)]
    ExactOutput,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
enum DepositType {
    OriginChain,
    #[allow(dead_code)]
    Intents,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
enum RefundType {
    #[allow(dead_code)]
    OriginChain,
    Intents,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
enum RecipientType {
    DestinationChain,
    #[allow(dead_code)]
    Intents,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
struct QuoteResponse {
    quote: Quote,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
struct Quote {
    amount_in: String,
    amount_in_formatted: String,
    amount_out: String,
    amount_out_formatted: String,
    deposit_address: Option<String>,
    deadline: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Deserialize)]
struct StatusResponse {
    status: DepositStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
enum DepositStatus {
    KnownDepositTx,
    PendingDeposit,
    IncompleteDeposit,
    Processing,
    Success,
    Refunded,
    Failed,
}

impl DepositStatus {
    fn display(&self) -> &str {
        match self {
            DepositStatus::KnownDepositTx => "Deposit detected, please wait...",
            DepositStatus::PendingDeposit => "Waiting for deposit",
            DepositStatus::IncompleteDeposit => {
                "Incomplete deposit, please deposit the rest of the amount to the same address"
            }
            DepositStatus::Processing => "Processing...",
            DepositStatus::Success => "Success!",
            DepositStatus::Refunded => {
                "Something went wrong, please contact support in Settings to get assistance"
            }
            DepositStatus::Failed => {
                "Bridge failed, please contact support in Settings to get assistance"
            }
        }
    }

    fn color_class(&self) -> &str {
        match self {
            DepositStatus::KnownDepositTx | DepositStatus::Processing => "text-blue-400",
            DepositStatus::PendingDeposit => "text-gray-400",
            DepositStatus::IncompleteDeposit => "text-yellow-400",
            DepositStatus::Success => "text-green-400",
            DepositStatus::Failed | DepositStatus::Refunded => "text-red-400",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
struct BridgeToken {
    defuse_asset_identifier: String,
    near_token_id: AccountId,
    decimals: u32,
    asset_name: String,
    #[serde(with = "dec_format")]
    min_deposit_amount: Balance,
    #[serde(with = "dec_format")]
    min_withdrawal_amount: Balance,
    #[serde(with = "dec_format")]
    withdrawal_fee: Balance,
    standard: String,
    intents_token_id: String,
    multi_token_id: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
struct JsonRpcRequest {
    id: u32,
    jsonrpc: String,
    method: String,
    params: Vec<SupportedTokensParams>,
}

#[derive(Debug, Clone, Serialize)]
struct SupportedTokensParams {
    chains: Vec<String>,
}

#[derive(Debug, Clone, PartialEq)]
enum Tab {
    ToNear,
    Stables,
    History,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BridgeHistoryEntry {
    deposit_address: String,
    amount_in_formatted: String,
    amount_out_formatted: String,
    origin_token_symbol: String,
    destination_token_symbol: String,
    network_display: String,
    created_at: DateTime<Utc>,
    deadline: DateTime<Utc>,
    status: Option<DepositStatus>,
}

#[derive(Debug, Clone, PartialEq)]
enum StableCoin {
    Usdc,
    Usdt,
}

pub const NETWORK_NAMES: &[((&str, &str), &str)] = &[
    (("eth", "1"), "Ethereum"),
    (("eth", "10"), "Optimism"),
    (("eth", "56"), "BNB Chain"),
    (("eth", "100"), "Gnosis"),
    (("eth", "137"), "Polygon"),
    (("eth", "143"), "Monad"),
    (("eth", "196"), "X Layer"),
    (("eth", "8453"), "Base"),
    (("eth", "36900"), "ADI Testnet"),
    (("eth", "42161"), "Arbitrum"),
    (("eth", "43114"), "Avalanche"),
    (("eth", "80094"), "Berachain"),
    (("btc", "mainnet"), "Bitcoin"),
    (("doge", "mainnet"), "Dogecoin"),
    (("sol", "mainnet"), "Solana"),
    (("xrp", "mainnet"), "Ripple"),
    (("zec", "mainnet"), "Zcash"),
    (("tron", "mainnet"), "Tron"),
    (("aptos", "mainnet"), "Aptos"),
    (("cardano", "mainnet"), "Cardano"),
    (("stellar", "mainnet"), "Stellar"),
    (("ton", "mainnet"), "TON"),
    (("sui", "mainnet"), "Sui"),
    (("ltc", "mainnet"), "Litecoin"),
    (("bch", "mainnet"), "Bitcoin Cash"),
];

fn get_network_name(network_key: &str) -> Option<&'static str> {
    let mut parts = network_key.splitn(3, ':');
    let chain = parts.next()?;
    let network = parts.next()?;

    NETWORK_NAMES
        .iter()
        .find(|((c, n), _)| *c == chain && *n == network)
        .map(|(_, name)| *name)
}

fn extract_network_key(defuse_asset_identifier: &str) -> String {
    let mut parts = defuse_asset_identifier.splitn(3, ':');
    if let (Some(chain_type), Some(chain_id)) = (parts.next(), parts.next()) {
        format!("{chain_type}:{chain_id}")
    } else {
        defuse_asset_identifier.to_string()
    }
}

#[derive(Debug, Clone)]
struct TerminalScreenData {
    status: DepositStatus,
    quote: Quote,
    receive_token_symbol: String,
    recipient: AccountId,
    deposit_address: String,
}

#[component]
pub fn Bridge() -> impl IntoView {
    let (active_tab, set_active_tab) = signal(Tab::ToNear);
    let (selected_stable, set_selected_stable) = signal(StableCoin::Usdc);
    let (terminal_screen, set_terminal_screen) = signal::<Option<TerminalScreenData>>(None);

    let supported_tokens = LocalResource::new(move || async move {
        let request = JsonRpcRequest {
            id: 1,
            jsonrpc: "2.0".to_string(),
            method: "supported_tokens".to_string(),
            params: vec![SupportedTokensParams { chains: vec![] }],
        };

        let response = reqwest::Client::new()
            .post("https://bridge.chaindefuser.com/rpc")
            .json(&request)
            .send()
            .await
            .map_err(|e| format!("Request failed: {e}"))?;

        let json: serde_json::Value = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {e}"))?;

        let tokens: SupportedTokensResponse = serde_json::from_value(
            json.get("result")
                .ok_or("No result field in response")?
                .clone(),
        )
        .map_err(|e| format!("Failed to deserialize tokens: {e}"))?;

        Ok::<_, String>(tokens.tokens)
    });

    view! {
        <div class="flex flex-col gap-6 p-2 md:p-4">
            <A
                href="/"
                attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                <span>"Back"</span>
            </A>

            <Show
                when=move || terminal_screen.get().is_some()
                fallback=move || {
                    view! {
                        <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                            <h1 class="text-2xl font-bold text-white mb-4">"Bridge"</h1>

                            <div class="flex gap-2 w-full max-w-md">
                                <button
                                    class=move || {
                                        format!(
                                            "flex-1 py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base {}",
                                            match active_tab.get() {
                                                Tab::ToNear => "bg-blue-600 text-white",
                                                _ => "bg-neutral-800 text-gray-400 hover:bg-neutral-700",
                                            },
                                        )
                                    }

                                    on:click=move |_| set_active_tab(Tab::ToNear)
                                >
                                    "To NEAR"
                                </button>
                                <button
                                    class=move || {
                                        format!(
                                            "flex-1 py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base {}",
                                            match active_tab.get() {
                                                Tab::Stables => "bg-blue-600 text-white",
                                                _ => "bg-neutral-800 text-gray-400 hover:bg-neutral-700",
                                            },
                                        )
                                    }

                                    on:click=move |_| set_active_tab(Tab::Stables)
                                >
                                    "Stables"
                                </button>
                                <button
                                    class=move || {
                                        format!(
                                            "py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base flex items-center justify-center {}",
                                            match active_tab.get() {
                                                Tab::History => "bg-blue-600 text-white",
                                                _ => "bg-neutral-800 text-gray-400 hover:bg-neutral-700",
                                            },
                                        )
                                    }

                                    on:click=move |_| set_active_tab(Tab::History)
                                >
                                    <Icon icon=icondata::LuHistory width="20" height="20" />
                                </button>
                            </div>

                            <Suspense fallback=move || {
                                view! {
                                    <div class="w-full max-w-md bg-neutral-800 rounded-lg p-6 flex items-center justify-center">
                                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                    </div>
                                }
                            }>
                                {move || {
                                    supported_tokens
                                        .get()
                                        .map(|result| match result {
                                            Ok(tokens) => {
                                                match active_tab.get() {
                                                    Tab::ToNear => {
                                                        view! {
                                                            <ToNearTab
                                                                tokens=tokens.clone()
                                                                set_terminal_screen=set_terminal_screen
                                                            />
                                                        }
                                                            .into_any()
                                                    }
                                                    Tab::Stables => {
                                                        view! {
                                                            <StablesTab
                                                                tokens=tokens.clone()
                                                                selected_stable=selected_stable
                                                                set_selected_stable=set_selected_stable
                                                                set_terminal_screen=set_terminal_screen
                                                            />
                                                        }
                                                            .into_any()
                                                    }
                                                    Tab::History => view! { <HistoryTab /> }.into_any(),
                                                }
                                            }
                                            Err(e) => {
                                                view! {
                                                    <div class="w-full max-w-md bg-neutral-800 rounded-lg p-6 text-red-400 text-center">
                                                        "Failed to load tokens: " {e}
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                        })
                                        .unwrap_or_else(|| {
                                            view! {
                                                <div class="w-full max-w-md bg-neutral-800 rounded-lg p-6 flex items-center justify-center">
                                                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                                </div>
                                            }
                                                .into_any()
                                        })
                                }}

                            </Suspense>
                        </div>
                    }
                }
            >

                {move || {
                    terminal_screen
                        .get()
                        .map(|data| {
                            match data.status {
                                DepositStatus::Success => {
                                    let amount_formatted = if let Ok(amount) = BigDecimal::from_str(
                                        &data.quote.amount_out_formatted,
                                    ) {
                                        format!("{amount:.6}")
                                    } else {
                                        data.quote
                                            .amount_out_formatted
                                            .trim_end_matches('0')
                                            .trim_end_matches('.')
                                            .to_string()
                                    };
                                    view! {
                                        <div class="flex flex-col items-center justify-center gap-6 py-8 min-h-[60vh]">
                                            <div class="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center">
                                                <Icon
                                                    icon=icondata::LuCheck
                                                    width="48"
                                                    height="48"
                                                    attr:class="text-green-400"
                                                />
                                            </div>
                                            <h2 class="text-2xl font-bold text-white">
                                                "Bridge Complete!"
                                            </h2>
                                            <div class="bg-neutral-800 rounded-lg p-6 max-w-md w-full">
                                                <div class="text-center">
                                                    <p class="text-gray-400 text-sm mb-2">"You received"</p>
                                                    <p class="text-3xl font-bold text-white">
                                                        {amount_formatted
                                                            .trim_end_matches('0')
                                                            .trim_end_matches('.')} " " {data.receive_token_symbol}
                                                    </p>
                                                </div>
                                            </div>
                                            <p class="text-gray-400 text-center max-w-md">
                                                "Your tokens have been successfully bridged to NEAR."
                                            </p>
                                            <A
                                                href="/"
                                                attr:class="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer text-center text-base"
                                            >
                                                "Done"
                                            </A>
                                        </div>
                                    }
                                        .into_any()
                                }
                                DepositStatus::Failed | DepositStatus::Refunded => {
                                    view! {
                                        <div class="flex flex-col items-center justify-center gap-6 py-8 min-h-[60vh]">
                                            <div class="w-16 h-16 rounded-full bg-red-400/20 flex items-center justify-center">
                                                <Icon
                                                    icon=icondata::LuX
                                                    width="48"
                                                    height="48"
                                                    attr:class="text-red-400"
                                                />
                                            </div>
                                            <h2 class="text-2xl font-bold text-white">
                                                "Bridge Failed"
                                            </h2>
                                            <p class="text-gray-400 text-center max-w-md">
                                                "Your bridge transaction has failed. Please contact support for assistance."
                                            </p>
                                            <button
                                                class="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer text-base"
                                                on:click=move |_| {
                                                    open_live_chat(
                                                        data.recipient.clone(),
                                                        Some(data.deposit_address.clone()),
                                                    )
                                                }
                                            >
                                                "Contact Support"
                                            </button>
                                        </div>
                                    }
                                        .into_any()
                                }
                                _ => ().into_any(),
                            }
                        })
                        .unwrap_or_else(|| ().into_any())
                }}

            </Show>
        </div>
    }
}

#[component]
fn ToNearTab(
    tokens: Vec<BridgeToken>,
    set_terminal_screen: WriteSignal<Option<TerminalScreenData>>,
) -> impl IntoView {
    let tokens_stored = StoredValue::new(tokens.clone());
    let networks = {
        let mut network_list: Vec<String> = tokens
            .iter()
            .map(|t| extract_network_key(&t.defuse_asset_identifier))
            .filter(|network_key| get_network_name(network_key).is_some())
            .collect::<HashSet<_>>()
            .into_iter()
            .collect();
        network_list.sort_by(|a, b| {
            let name_a = get_network_name(a).unwrap();
            let name_b = get_network_name(b).unwrap();
            name_a.cmp(name_b)
        });
        network_list
    };

    let network_options = Signal::derive(move || {
        networks
            .iter()
            .map(|network| {
                let display_name = get_network_name(network).unwrap().to_string();
                SelectOption::new(network.clone(), move || {
                    view! { <span>{display_name.clone()}</span> }.into_any()
                })
            })
            .collect::<Vec<_>>()
    });

    let (selected_network, set_selected_network) = signal::<Option<String>>(None);
    let (selected_token, set_selected_token) = signal::<Option<BridgeToken>>(None);

    let network_tokens = move || {
        if let Some(network) = selected_network.get() {
            let mut token_list: Vec<BridgeToken> = tokens_stored
                .get_value()
                .into_iter()
                .filter(|t| t.defuse_asset_identifier.starts_with(&network))
                .collect();
            token_list.sort_by(|a, b| a.asset_name.cmp(&b.asset_name));
            token_list
        } else {
            vec![]
        }
    };

    let token_options = Signal::derive(move || {
        network_tokens()
            .into_iter()
            .map(|token| {
                let asset_name = token.asset_name.clone();
                SelectOption::new(token.defuse_asset_identifier.clone(), move || {
                    view! { <span>{asset_name.clone()}</span> }.into_any()
                })
            })
            .collect::<Vec<_>>()
    });

    view! {
        <div class="w-full max-w-md flex flex-col gap-4">
            <div class="bg-neutral-800 rounded-lg p-4">
                <label class="text-gray-400 text-sm mb-2 block">"Select Network"</label>
                <Select
                    options=network_options
                    placeholder="Choose a network...".to_string()
                    class="bg-neutral-700 text-white rounded-lg"
                    on_change=Callback::new(move |value: String| {
                        set_selected_network(if value.is_empty() { None } else { Some(value) });
                        set_selected_token(None);
                    })
                    initial_value="Select Network"
                />
            </div>

            <Show when=move || selected_network.get().is_some()>
                <div class="bg-neutral-800 rounded-lg p-4">
                    <label class="text-gray-400 text-sm mb-2 block">"Select Token"</label>
                    <Select
                        options=token_options
                        placeholder="Choose a token...".to_string()
                        class="bg-neutral-700 text-white rounded-lg"
                        on_change=Callback::new(move |value: String| {
                            if !value.is_empty() {
                                if let Some(token) = tokens_stored
                                    .get_value()
                                    .into_iter()
                                    .find(|t| t.defuse_asset_identifier == value)
                                {
                                    set_selected_token(Some(token));
                                }
                            } else {
                                set_selected_token(None);
                            }
                        })
                        initial_value="Select Token"
                    />
                </div>
            </Show>

            <Show when=move || selected_token.get().is_some()>
                <TokenDepositForm
                    token=selected_token
                    receive_token_symbol=Signal::derive(|| "NEAR".to_string())
                    set_terminal_screen=set_terminal_screen
                />
            </Show>
        </div>
    }
}

#[component]
fn StablesTab(
    tokens: Vec<BridgeToken>,
    selected_stable: ReadSignal<StableCoin>,
    set_selected_stable: WriteSignal<StableCoin>,
    set_terminal_screen: WriteSignal<Option<TerminalScreenData>>,
) -> impl IntoView {
    let tokens_stored = StoredValue::new(tokens.clone());
    let (selected_network, set_selected_network) = signal::<Option<String>>(None);
    let (selected_token, set_selected_token) = signal::<Option<BridgeToken>>(None);

    let stable_networks = move || {
        let stable_name = match selected_stable.get() {
            StableCoin::Usdc => "USDC",
            StableCoin::Usdt => "USDT",
        };

        let mut network_list: Vec<String> = tokens
            .iter()
            .filter(|t| t.asset_name.to_uppercase() == stable_name)
            .map(|t| extract_network_key(&t.defuse_asset_identifier))
            .filter(|network_key| get_network_name(network_key).is_some())
            .collect::<HashSet<_>>()
            .into_iter()
            .collect();
        network_list.sort_by(|a, b| {
            let name_a = get_network_name(a).unwrap();
            let name_b = get_network_name(b).unwrap();
            name_a.cmp(name_b)
        });
        network_list
    };

    let stable_network_options = Signal::derive(move || {
        stable_networks()
            .into_iter()
            .map(|network| {
                let display_name = get_network_name(&network).unwrap().to_string();
                SelectOption::new(network.clone(), move || {
                    view! { <span>{display_name.clone()}</span> }.into_any()
                })
            })
            .collect::<Vec<_>>()
    });

    // Update token when stable or network changes
    Effect::new(move || {
        let stable_name = match selected_stable.get() {
            StableCoin::Usdc => "USDC",
            StableCoin::Usdt => "USDT",
        };

        if let Some(network) = selected_network.get() {
            if let Some(token) = tokens_stored.get_value().into_iter().find(|t| {
                t.asset_name.to_uppercase() == stable_name
                    && t.defuse_asset_identifier.starts_with(&network)
            }) {
                set_selected_token(Some(token));
            } else {
                set_selected_token(None);
            }
        }
    });

    view! {
        <div class="w-full max-w-md flex flex-col gap-4">
            <div class="bg-neutral-800 rounded-lg p-4">
                <label class="text-gray-400 text-sm mb-2 block">"Select Stablecoin"</label>
                <div class="flex gap-2">
                    <button
                        class=move || {
                            format!(
                                "flex-1 py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base {}",
                                match selected_stable.get() {
                                    StableCoin::Usdc => "bg-blue-600 text-white",
                                    _ => "bg-neutral-700 text-gray-400 hover:bg-neutral-600",
                                },
                            )
                        }

                        on:click=move |_| {
                            set_selected_stable(StableCoin::Usdc);
                            if let Some(network) = selected_network.get_untracked() {
                                if let Some(token) = tokens_stored
                                    .get_value()
                                    .into_iter()
                                    .find(|t| {
                                        t.defuse_asset_identifier.starts_with(&network)
                                            && t.asset_name.to_uppercase() == "USDC"
                                    })
                                {
                                    set_selected_token(Some(token.clone()));
                                } else {
                                    set_selected_network(None);
                                    set_selected_token(None);
                                }
                            }
                        }
                    >

                        "USDC"
                    </button>
                    <button
                        class=move || {
                            format!(
                                "flex-1 py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base {}",
                                match selected_stable.get() {
                                    StableCoin::Usdt => "bg-blue-600 text-white",
                                    _ => "bg-neutral-700 text-gray-400 hover:bg-neutral-600",
                                },
                            )
                        }

                        on:click=move |_| {
                            set_selected_stable(StableCoin::Usdt);
                            if let Some(network) = selected_network.get_untracked() {
                                if let Some(token) = tokens_stored
                                    .get_value()
                                    .into_iter()
                                    .find(|t| {
                                        t.defuse_asset_identifier.starts_with(&network)
                                            && t.asset_name.to_uppercase() == "USDT"
                                    })
                                {
                                    set_selected_token(Some(token.clone()));
                                } else {
                                    set_selected_network(None);
                                    set_selected_token(None);
                                }
                            }
                        }
                    >

                        "USDT"
                    </button>
                </div>
            </div>

            <div class="bg-neutral-800 rounded-lg p-4">
                <label class="text-gray-400 text-sm mb-2 block">"Select Network"</label>
                <Select
                    options=stable_network_options
                    placeholder="Choose a network...".to_string()
                    class="bg-neutral-700 text-white rounded-lg"
                    on_change=Callback::new(move |value: String| {
                        set_selected_network(if value.is_empty() { None } else { Some(value) });
                    })
                    initial_value="Select Network"
                />
            </div>

            <Show when=move || selected_token.get().is_some()>
                <TokenDepositForm
                    token=selected_token
                    receive_token_symbol=Signal::derive(move || {
                        match selected_stable.get() {
                            StableCoin::Usdc => "USDC".to_string(),
                            StableCoin::Usdt => "USDT".to_string(),
                        }
                    })
                    set_terminal_screen=set_terminal_screen
                />
            </Show>
        </div>
    }
}

#[component]
fn TokenDepositForm(
    token: ReadSignal<Option<BridgeToken>>,
    receive_token_symbol: Signal<String>,
    set_terminal_screen: WriteSignal<Option<TerminalScreenData>>,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let recipient = move || accounts_context.accounts.get().selected_account_id.unwrap();

    let token = move || {
        token
            .get()
            .expect("Token should be Some when form is shown")
    };
    let (amount, set_amount) = signal(String::new());
    let (quote_data, set_quote_data) = signal::<Option<Quote>>(None);
    let (is_creating_address, set_is_creating_address) = signal(false);
    let (error_message, set_error_message) = signal::<Option<String>>(None);

    // Reset quote when token or amount changes
    Effect::new(move || {
        let _ = token();
        set_quote_data(None);
        set_error_message(None);
    });

    let UseIntervalReturn {
        counter: status_counter,
        ..
    } = use_interval(5000);
    let UseIntervalReturn {
        counter: countdown_counter,
        ..
    } = use_interval(1000);

    let is_amount_valid = move || {
        let amt = amount.get();
        !amt.trim().is_empty() && BigDecimal::from_str(&amt).is_ok()
    };

    let dry_quote = LocalResource::new(move || {
        let current_token = token();
        let current_amount = amount.get();
        let current_recipient = recipient();
        let destination_asset = match receive_token_symbol.get().as_str() {
            "USDC" => DESTINATION_USDC,
            "USDT" => DESTINATION_USDT,
            "NEAR" => DESTINATION_NEAR,
            _ => unreachable!("Invalid destination asset"),
        };

        async move {
            if current_amount.trim().is_empty() {
                return Err("Empty amount".to_string());
            }

            let parsed_amount = match BigDecimal::from_str(&current_amount) {
                Ok(amt) => amt,
                Err(_) => return Err("Invalid amount".to_string()),
            };

            let amount_raw = decimal_to_balance(parsed_amount, current_token.decimals);
            let now = Utc::now();
            let deadline = now + Duration::from_secs(60 * 60 * 24);

            let request = QuoteRequest {
                dry: true,
                swap_type: SwapType::ExactInput,
                slippage_tolerance: 100,
                origin_asset: current_token.intents_token_id.clone(),
                deposit_type: DepositType::OriginChain,
                destination_asset: destination_asset.to_string(),
                amount: amount_raw,
                refund_to: current_recipient.clone(),
                refund_type: RefundType::Intents,
                recipient: current_recipient,
                recipient_type: RecipientType::DestinationChain,
                deadline,
                referral: "wallet.intear.near".parse().unwrap(),
                quote_waiting_time_ms: 1000,
            };

            match reqwest::Client::new()
                .post("https://1click.chaindefuser.com/v0/quote")
                .bearer_auth("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjUtMDQtMjMtdjEifQ.eyJ2IjoxLCJrZXlfdHlwZSI6ImRpc3RyaWJ1dGlvbl9jaGFubmVsIiwicGFydG5lcl9pZCI6InNsaW1lIiwiaWF0IjoxNzQ5NTU3MDk4LCJleHAiOjE3ODEwOTMwOTh9.Dd6TweB3c1nDHILMfApFfcvVd4XDXu015hR6122j6fLRMzZvPXJNb1JkPkXXy9RN9ToIWITaDMSCBRsQv2it-lgP0lxCO7AFWxcNrZ8f9GkhTXfXBaeaeYDh_7YVRADMwIaw6_Ayt3NTeYI8poab3TdV2ubWT2_0MVQRYfHJqSGrBdBs_iqT0t9Henjn36UQjg6SU0sFA0N31fKKcFp2MbuwioUnyywvYOA4zVrTfAVmyPFS7_DowPYTC_ZkTKZBy0bLB_GYf6NoV3i_lCkT4_8JOkhQXKCfk2TRw_DIWZRl7x4jVG3q-l1fodXDLUgZZC7_1o6Z3No6amjYamQO6A")
                .json(&request)
                .send()
                .await
            {
                Ok(response) => match response.json::<QuoteResponse>().await {
                    Ok(quote_response) => Ok(quote_response.quote),
                    Err(e) => {
                        let error_msg = format!("{e}");
                        if error_msg.contains("error decoding response body") {
                            Err("".to_string())
                        } else {
                            Err(format!("Failed to parse quote: {error_msg}"))
                        }
                    }
                },
                Err(e) => Err(format!("Failed to get quote: {e}")),
            }
        }
        .boxed_local()
    });

    // Guaranteed to be Some for non-dry quotes
    let deposit_address = move || quote_data.get().map(|q| q.deposit_address.clone().unwrap());

    let (deposit_status, set_deposit_status) = signal::<Option<DepositStatus>>(None);

    Effect::new(move || {
        status_counter.track();
        if let Some(address) = deposit_address() {
            let address = address.clone();
            let current_quote = quote_data.get();
            let current_recipient = recipient();
            let current_symbol = receive_token_symbol.get();
            leptos::task::spawn_local(async move {
                if let Ok(response) = reqwest::Client::new()
                    .get(format!(
                        "https://1click.chaindefuser.com/v0/status?depositAddress={address}"
                    ))
                    .send()
                    .await
                    && let Ok(status_response) = response.json::<StatusResponse>().await
                {
                    let status = status_response.status;
                    set_deposit_status.set(Some(status.clone()));

                    if matches!(
                        status,
                        DepositStatus::Success | DepositStatus::Failed | DepositStatus::Refunded
                    ) && let Some(quote) = current_quote
                    {
                        set_terminal_screen.set(Some(TerminalScreenData {
                            status,
                            quote,
                            receive_token_symbol: current_symbol,
                            recipient: current_recipient,
                            deposit_address: address,
                        }));
                    }
                }
            });
        } else {
            set_deposit_status.set(None);
        }
    });

    let create_deposit_address = move |_| {
        if !is_amount_valid() {
            return;
        }

        let current_token = token();
        let current_amount = amount.get();
        let current_recipient = recipient();
        let destination_asset = match receive_token_symbol.get().as_str() {
            "USDC" => DESTINATION_USDC,
            "USDT" => DESTINATION_USDT,
            "NEAR" => DESTINATION_NEAR,
            _ => unreachable!("Invalid destination asset"),
        };

        set_is_creating_address(true);
        set_error_message(None);

        leptos::task::spawn_local(async move {
            // Parse amount and convert to base units
            let parsed_amount = match BigDecimal::from_str(&current_amount) {
                Ok(amt) => amt,
                Err(_) => {
                    set_error_message(Some("Invalid amount".to_string()));
                    set_is_creating_address(false);
                    return;
                }
            };

            let amount_raw = decimal_to_balance(parsed_amount, current_token.decimals);

            let now = Utc::now();
            let deadline = now + Duration::from_secs(60 * 60 * 24);

            let request = QuoteRequest {
                dry: false,
                swap_type: SwapType::ExactInput,
                slippage_tolerance: 100,
                origin_asset: current_token.intents_token_id.clone(),
                deposit_type: DepositType::OriginChain,
                destination_asset: destination_asset.to_string(),
                amount: amount_raw,
                refund_to: current_recipient.clone(),
                refund_type: RefundType::Intents,
                recipient: current_recipient,
                recipient_type: RecipientType::DestinationChain,
                deadline,
                referral: "wallet.intear.near".parse().unwrap(),
                quote_waiting_time_ms: 2500,
            };

            match reqwest::Client::new()
                .post("https://1click.chaindefuser.com/v0/quote")
                .bearer_auth("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjUtMDQtMjMtdjEifQ.eyJ2IjoxLCJrZXlfdHlwZSI6ImRpc3RyaWJ1dGlvbl9jaGFubmVsIiwicGFydG5lcl9pZCI6InNsaW1lIiwiaWF0IjoxNzQ5NTU3MDk4LCJleHAiOjE3ODEwOTMwOTh9.Dd6TweB3c1nDHILMfApFfcvVd4XDXu015hR6122j6fLRMzZvPXJNb1JkPkXXy9RN9ToIWITaDMSCBRsQv2it-lgP0lxCO7AFWxcNrZ8f9GkhTXfXBaeaeYDh_7YVRADMwIaw6_Ayt3NTeYI8poab3TdV2ubWT2_0MVQRYfHJqSGrBdBs_iqT0t9Henjn36UQjg6SU0sFA0N31fKKcFp2MbuwioUnyywvYOA4zVrTfAVmyPFS7_DowPYTC_ZkTKZBy0bLB_GYf6NoV3i_lCkT4_8JOkhQXKCfk2TRw_DIWZRl7x4jVG3q-l1fodXDLUgZZC7_1o6Z3No6amjYamQO6A")
                .json(&request)
                .send()
                .await
            {
                Ok(response) => match response.json::<QuoteResponse>().await {
                    Ok(quote_response) => {
                        let quote = quote_response.quote.clone();
                        set_quote_data(Some(quote.clone()));

                        let network_key = extract_network_key(&current_token.defuse_asset_identifier);
                        let network_display = get_network_name(&network_key)
                            .unwrap_or(&network_key)
                            .to_string();

                        let history_entry = BridgeHistoryEntry {
                            deposit_address: quote.deposit_address.clone().unwrap_or_default(),
                            amount_in_formatted: quote.amount_in_formatted.clone(),
                            amount_out_formatted: quote.amount_out_formatted.clone(),
                            origin_token_symbol: current_token.asset_name.clone(),
                            destination_token_symbol: receive_token_symbol.get(),
                            network_display,
                            created_at: Utc::now(),
                            // Guaranteed to be Some for non-dry quotes
                            deadline: quote.deadline.unwrap(),
                            status: None,
                        };

                        add_to_bridge_history(history_entry);

                        set_is_creating_address(false);
                    }
                    Err(e) => {
                        let error_msg = format!("{e}");
                        let network_key = extract_network_key(&current_token.defuse_asset_identifier);
                        let network_display = get_network_name(&network_key)
                            .unwrap_or(&network_key);

                        if error_msg.contains("error decoding response body") {
                            set_error_message(Some(format!(
                                "{} on {} is temporarily not available",
                                current_token.asset_name,
                                network_display
                            )));
                        } else {
                            set_error_message(Some(format!("Failed to parse quote: {error_msg}")));
                        }
                        set_is_creating_address(false);
                    }
                },
                Err(e) => {
                    set_error_message(Some(format!("Failed to create deposit address: {e}")));
                    set_is_creating_address(false);
                }
            }
        });
    };

    view! {
        <div class="bg-neutral-800 rounded-lg p-4 flex flex-col gap-4">
            <Show
                when=move || quote_data.get().is_none()
                fallback=move || {

                    view! {
                        <div class="flex flex-col gap-4 items-center">
                            <Show when=move || deposit_address().is_some()>
                                <QRCodeDisplay
                                    address=deposit_address().unwrap_or_default()
                                    size_class="w-64 h-64"
                                />
                            </Show>

                            <div class="w-full bg-neutral-700 rounded-lg p-4 flex flex-col gap-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-400 text-sm">"Send exactly:"</span>
                                    <div class="flex items-center gap-2">
                                        <span class="text-white text-base font-semibold">
                                            {move || {
                                                quote_data
                                                    .get()
                                                    .map(|q| {
                                                        let decimals = token().decimals;
                                                        let amount_u128 = q.amount_in.parse::<u128>().unwrap_or(0);
                                                        format_token_amount_full_precision(
                                                            amount_u128,
                                                            decimals,
                                                            &token().asset_name,
                                                        )
                                                    })
                                                    .unwrap_or_default()
                                            }}
                                        </span>
                                        {move || {
                                            quote_data
                                                .get()
                                                .map(|q| {
                                                    let amount_only = q
                                                        .amount_in_formatted
                                                        .trim_end_matches('0')
                                                        .trim_end_matches('.');
                                                    view! { <CopyButton text=amount_only.to_string() /> }
                                                        .into_any()
                                                })
                                                .unwrap_or_else(|| ().into_any())
                                        }}
                                    </div>
                                </div>
                                <CopyableAddress
                                    address=deposit_address().unwrap_or_default()
                                    label="To address:"
                                />

                                <div class="text-[10px] text-gray-400 text-center px-2">
                                    "Bridge service is provided by Near Intents, HOT Bridge, and Omnibridge. While generally trusted in the ecosystem, these bridges are not affiliated with Intear, so we can provide limited customer support"
                                </div>
                            </div>

                            <div class="flex items-center justify-center gap-2">
                                <p class="text-sm text-gray-400 text-center">
                                    "Send the exact amount shown above to receive "
                                    {move || {
                                        quote_data
                                            .get()
                                            .map(|q| {
                                                if let Ok(amount) = BigDecimal::from_str(
                                                    &q.amount_out_formatted,
                                                ) {
                                                    format!("{amount:.6}")
                                                } else {
                                                    q.amount_out_formatted
                                                        .trim_end_matches('0')
                                                        .trim_end_matches('.')
                                                        .to_string()
                                                }
                                            })
                                            .unwrap_or_default()
                                    }} " " {move || receive_token_symbol.get()}
                                    {move || {
                                        if receive_token_symbol.get() != "NEAR" {
                                            " on NEAR"
                                        } else {
                                            ""
                                        }
                                    }}
                                </p>
                                {move || {
                                    quote_data
                                        .get()
                                        .map(|q| {
                                            let amount_str = if let Ok(amount) = BigDecimal::from_str(
                                                &q.amount_out_formatted,
                                            ) {
                                                format!("{amount:.6}")
                                            } else {
                                                q.amount_out_formatted
                                                    .trim_end_matches('0')
                                                    .trim_end_matches('.')
                                                    .to_string()
                                            };
                                            view! { <CopyButton text=amount_str /> }.into_any()
                                        })
                                        .unwrap_or_else(|| ().into_any())
                                }}
                            </div>

                            <div class="flex justify-between items-center text-xs w-full gap-6">
                                <div>
                                    {move || {
                                        if let Some(status) = deposit_status.get() {
                                            view! {
                                                <span class=status.color_class()>{status.display()}</span>
                                            }
                                                .into_any()
                                        } else {
                                            view! { <span class="text-gray-500">"Loading..."</span> }
                                                .into_any()
                                        }
                                    }}

                                </div>
                                <div class="text-gray-500">
                                    {move || {
                                        countdown_counter.track();
                                        quote_data
                                            .get()
                                            .map(|q| {
                                                let now = Utc::now();
                                                let duration = q
                                                    .deadline
                                                    .unwrap()
                                                    .signed_duration_since(now);
                                                if duration.num_seconds() <= 0 {
                                                    "Expired".to_string()
                                                } else {
                                                    let hours = duration.num_hours();
                                                    let minutes = duration.num_minutes() % 60;
                                                    let seconds = duration.num_seconds() % 60;
                                                    format!("{hours:02}:{minutes:02}:{seconds:02}")
                                                }
                                            })
                                            .unwrap_or_default()
                                    }}

                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            >

                <div>
                    <label class="text-gray-400 text-sm mb-2 block">"Amount"</label>
                    <input
                        type="text"
                        class="w-full bg-neutral-700 text-white rounded-lg p-3 text-base"
                        placeholder="0.00"
                        prop:value=move || amount.get()
                        on:input=move |ev| set_amount(event_target_value(&ev))
                    />
                    <div class="mt-2 text-sm text-gray-400">
                        <Suspense>
                            {move || {
                                let amt = amount.get();
                                if amt.trim().is_empty() {
                                    return "Enter an amount to see what you'll receive".to_string();
                                }
                                if BigDecimal::from_str(&amt).is_err() {
                                    return "Invalid amount".to_string();
                                }
                                dry_quote
                                    .get()
                                    .map(|result| match result {
                                        Ok(quote) => {
                                            let symbol = receive_token_symbol.get();
                                            format!(
                                                "You will receive: {} {}",
                                                if let Ok(amount) = BigDecimal::from_str(
                                                    &quote.amount_out_formatted,
                                                ) {
                                                    format!("{amount:.6}")
                                                } else {
                                                    quote
                                                        .amount_out_formatted
                                                        .trim_end_matches('0')
                                                        .trim_end_matches('.')
                                                        .to_string()
                                                },
                                                symbol,
                                            )
                                        }
                                        Err(e) => {
                                            if e.is_empty() {
                                                String::new()
                                            } else {
                                                format!("Error: {e}")
                                            }
                                        }
                                    })
                                    .unwrap_or_else(|| "Calculating...".to_string())
                            }}

                        </Suspense>
                    </div>
                </div>

                <Show when=move || error_message.get().is_some()>
                    <div class="bg-red-900/20 border border-red-500 text-red-400 rounded-lg p-3 text-sm">
                        {move || error_message.get().unwrap_or_default()}
                    </div>
                </Show>

                <button
                    class=move || {
                        format!(
                            "w-full font-semibold py-3 px-4 rounded-lg transition-colors text-base {}",
                            if is_creating_address.get() {
                                "bg-neutral-700 text-gray-400 cursor-wait"
                            } else if is_amount_valid() {
                                "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            } else {
                                "bg-neutral-700 text-gray-500 cursor-not-allowed"
                            },
                        )
                    }

                    disabled=move || !is_amount_valid() || is_creating_address.get()
                    on:click=create_deposit_address
                >
                    {move || {
                        if is_creating_address.get() {
                            "Creating Deposit Address..."
                        } else {
                            "Create Deposit Address"
                        }
                    }}

                </button>
            </Show>
        </div>
    }
}

#[component]
fn HistoryTab() -> impl IntoView {
    let (history, _set_history) = signal(load_bridge_history());
    let (expanded_entry, set_expanded_entry) = signal::<Option<String>>(None);

    view! {
        <div class="w-full max-w-2xl">
            <div class="bg-neutral-800 rounded-lg p-4 flex flex-col gap-3">
                <Show
                    when=move || !history.get().is_empty()
                    fallback=move || {
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
                    }
                >
                    <div class="flex flex-col gap-2">
                        <For
                            each=move || history.get()
                            key=|entry| entry.deposit_address.clone()
                            children=move |entry: BridgeHistoryEntry| {
                                view! {
                                    <HistoryItem
                                        entry=entry
                                        expanded_entry=expanded_entry
                                        set_expanded_entry=set_expanded_entry
                                    />
                                }
                            }
                        />
                    </div>
                </Show>
            </div>
        </div>
    }
}

#[component]
fn HistoryItem(
    entry: BridgeHistoryEntry,
    expanded_entry: ReadSignal<Option<String>>,
    set_expanded_entry: WriteSignal<Option<String>>,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();

    let deposit_address = entry.deposit_address.clone();
    let (current_status, set_current_status) = signal(entry.status);

    let is_terminal = Memo::new(move |_| {
        matches!(
            current_status.get(),
            Some(DepositStatus::Success)
                | Some(DepositStatus::Failed)
                | Some(DepositStatus::Refunded)
        )
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
            leptos::task::spawn_local(async move {
                if let Ok(response) = reqwest::Client::new()
                    .get(format!(
                        "https://1click.chaindefuser.com/v0/status?depositAddress={}",
                        deposit_address_stored.read_value()
                    ))
                    .send()
                    .await
                    && let Ok(status_response) = response.json::<serde_json::Value>().await
                    && let Some(status_str) = status_response.get("status").and_then(|s| s.as_str())
                    && let Ok(status) =
                        serde_json::from_value::<DepositStatus>(serde_json::json!(status_str))
                {
                    set_current_status.set(Some(status.clone()));

                    if matches!(
                        status,
                        DepositStatus::Success | DepositStatus::Failed | DepositStatus::Refunded
                    ) {
                        let mut history = load_bridge_history();
                        if let Some(entry) = history
                            .iter_mut()
                            .find(|e| e.deposit_address == deposit_address_stored.get_value())
                        {
                            entry.status = Some(status);
                            save_bridge_history(&history);
                        }
                    }
                }
            });
        }
    });

    let is_expanded =
        move || expanded_entry.get().as_ref() == Some(&*deposit_address_stored.read_value());

    let status_display = move || match current_status.get() {
        Some(DepositStatus::PendingDeposit) => ("Waiting for deposit", "text-yellow-400"),
        Some(DepositStatus::KnownDepositTx) => ("Deposit detected", "text-blue-400"),
        Some(DepositStatus::Processing) => ("Processing", "text-blue-400"),
        Some(DepositStatus::Success) => ("Success", "text-green-400"),
        Some(DepositStatus::Failed) | Some(DepositStatus::Refunded) => ("Failed", "text-red-400"),
        Some(DepositStatus::IncompleteDeposit) => ("Incomplete", "text-orange-400"),
        None => ("Pending", "text-gray-400"),
    };

    let is_pending = move || {
        matches!(
            current_status.get(),
            Some(DepositStatus::PendingDeposit) | Some(DepositStatus::IncompleteDeposit) | None
        )
    };

    let is_failed = move || {
        matches!(
            current_status.get(),
            Some(DepositStatus::Failed) | Some(DepositStatus::Refunded)
        )
    };

    let format_date = |date: DateTime<Utc>| date.format("%b %d, %Y %H:%M UTC").to_string();

    let countdown_text = move || {
        countdown_counter.track();
        if is_terminal() {
            return String::new();
        }

        let now = Utc::now();
        let duration = entry.deadline.signed_duration_since(now);

        if duration.num_seconds() <= 0 {
            "Expired".to_string()
        } else {
            let hours = duration.num_hours();
            let minutes = duration.num_minutes() % 60;
            let seconds = duration.num_seconds() % 60;
            format!("{:02}:{:02}:{:02}", hours, minutes, seconds)
        }
    };

    view! {
        <div class="bg-neutral-700 rounded-lg overflow-hidden">
            <button
                class="w-full p-4 text-left hover:bg-neutral-600 transition-colors"
                on:click=move |_| {
                    if is_expanded() {
                        set_expanded_entry(None);
                    } else {
                        set_expanded_entry(Some(deposit_address_stored.get_value()));
                    }
                }
            >
                <div class="flex justify-between items-start gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-white">
                                {entry.origin_token_symbol.clone()} " → "
                                {entry.destination_token_symbol.clone()}
                            </span>
                            <span class=move || {
                                format!("text-sm {}", status_display().1)
                            }>{move || status_display().0}</span>
                        </div>
                        <div class="text-sm text-gray-400">
                            {entry.network_display} " • " {format_date(entry.created_at)}
                        </div>
                        <div class="flex items-center gap-1 mt-1">
                            <div class="text-sm text-gray-300">
                                {entry
                                    .amount_in_formatted
                                    .trim_end_matches('0')
                                    .trim_end_matches('.')} " " {entry.origin_token_symbol.clone()}
                            </div>
                            <CopyButton text=entry
                                .amount_in_formatted
                                .trim_end_matches('0')
                                .trim_end_matches('.')
                                .to_string() />
                        </div>
                        <Show when=move || !is_terminal()>
                            <div class="text-xs text-gray-500 mt-1">
                                {move || {
                                    let countdown = countdown_text();
                                    if !countdown.is_empty() {
                                        format!("Expires: {}", countdown)
                                    } else {
                                        String::new()
                                    }
                                }}
                            </div>
                        </Show>
                    </div>
                    <Icon
                        icon=icondata::LuChevronDown
                        width="20"
                        height="20"
                        attr:class=move || {
                            if is_expanded() {
                                "transform rotate-180 transition-transform"
                            } else {
                                "transition-transform"
                            }
                        }
                    />
                </div>
            </button>

            <Show when=move || is_expanded()>
                <div class="px-4 pb-4 border-t border-neutral-600 pt-4">
                    <div class="space-y-3">
                        <CopyableAddress
                            address=entry.deposit_address.clone()
                            label="Deposit Address"
                        />

                        <div>
                            <p class="text-sm text-gray-400 mb-1">"Expected to receive"</p>
                            <p class="text-white">
                                {if let Ok(amount) = entry.amount_out_formatted.parse::<f64>() {
                                    format!("{:.6} {}", amount, entry.destination_token_symbol)
                                } else {
                                    format!(
                                        "{} {}",
                                        entry
                                            .amount_out_formatted
                                            .trim_end_matches('0')
                                            .trim_end_matches('.'),
                                        entry.destination_token_symbol,
                                    )
                                }}
                            </p>
                        </div>

                        <Show when=is_pending>
                            <QRCodeDisplay address=deposit_address_stored.get_value() />
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
fn QRCodeDisplay(
    address: String,
    #[prop(optional)] size_class: Option<&'static str>,
) -> impl IntoView {
    let size = size_class.unwrap_or("w-48 h-48");
    let qr_code_resource = LocalResource::new(move || {
        let addr = address.clone();
        async move { generate_qr_code(&addr, false).await }
    });

    view! {
        <div class="flex flex-col items-center gap-2">
            <Suspense fallback=move || {
                view! {
                    <div class=format!(
                        "{} bg-neutral-800 rounded-lg flex items-center justify-center",
                        size,
                    )>
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            }>
                {move || {
                    qr_code_resource
                        .get()
                        .map(|qr_result| {
                            if let Ok(qr_code_data_url) = qr_result {
                                view! {
                                    <img
                                        src=qr_code_data_url
                                        alt="QR Code for deposit address"
                                        class=format!("{} rounded-lg", size)
                                    />
                                }
                                    .into_any()
                            } else {
                                view! {
                                    <div class=format!(
                                        "{} bg-neutral-800 rounded-lg flex items-center justify-center text-red-400",
                                        size,
                                    )>"Failed to generate QR code"</div>
                                }
                                    .into_any()
                            }
                        })
                }}
            </Suspense>
        </div>
    }
}

#[component]
fn CopyableAddress(
    address: String,
    #[prop(optional)] label: Option<&'static str>,
) -> impl IntoView {
    let (is_copied, set_is_copied) = signal(false);

    let address_clone = address.clone();
    view! {
        <div>
            {label
                .map(|l| {
                    view! { <p class="text-sm text-gray-400 mb-2">{l}</p> }
                })} <div class="flex items-center gap-2 w-full bg-neutral-600 rounded-lg p-3">
                <span class="text-white text-sm font-mono break-all flex-1">{address}</span>
                <button
                    class="bg-neutral-500 hover:bg-neutral-400 rounded-lg p-2 transition-colors cursor-pointer flex-shrink-0"
                    on:click=move |_| {
                        let clipboard = window().navigator().clipboard();
                        let _ = clipboard.write_text(&address_clone);
                        set_is_copied(true);
                        set_timeout(move || set_is_copied(false), Duration::from_millis(2000));
                    }
                    title="Copy address"
                >
                    {move || {
                        if is_copied.get() {
                            view! {
                                <Icon
                                    icon=icondata::LuCheck
                                    width="20"
                                    height="20"
                                    attr:class="text-green-400"
                                />
                            }
                                .into_any()
                        } else {
                            view! {
                                <Icon
                                    icon=icondata::LuCopy
                                    width="20"
                                    height="20"
                                    attr:class="text-white"
                                />
                            }
                                .into_any()
                        }
                    }}
                </button>
            </div>
        </div>
    }
}

#[component]
fn CopyButton(text: String) -> impl IntoView {
    let (is_copied, set_is_copied) = signal(false);

    let text_clone = text.clone();
    view! {
        <button
            class="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
            on:click=move |ev| {
                ev.stop_propagation();
                let clipboard = window().navigator().clipboard();
                let _ = clipboard.write_text(&text_clone);
                set_is_copied(true);
                set_timeout(move || set_is_copied(false), Duration::from_millis(2000));
            }
            title="Copy amount"
        >
            {move || {
                if is_copied.get() {
                    view! {
                        <Icon
                            icon=icondata::LuCheck
                            width="16"
                            height="16"
                            attr:class="text-green-400"
                        />
                    }
                        .into_any()
                } else {
                    view! { <Icon icon=icondata::LuCopy width="16" height="16" /> }.into_any()
                }
            }}
        </button>
    }
}
