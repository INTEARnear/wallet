use bigdecimal::BigDecimal;
use chrono::Utc;
use futures_util::FutureExt;
use itertools::Itertools;
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_use::{UseIntervalReturn, use_interval};
use near_min_api::{
    types::{AccountId, Balance},
    utils::dec_format,
};
use serde::{Deserialize, Serialize};
use std::{str::FromStr, time::Duration};

use crate::components::{
    bridge_history::{
        DepositMode, DepositType, QuoteData, QuoteRequest, QuoteResponse, RecipientType,
        RefundType, SwapType,
    },
    select::{Select, SelectOption},
};
use crate::contexts::accounts_context::AccountsContext;
use crate::contexts::network_context::{Network, NetworkContext};
use crate::data::bridge_networks::{
    ChainInfo, NETWORK_NAMES, USDC_ON_NEAR, USDT_ON_NEAR, WRAPPED_NEAR,
};
use crate::utils::balance_to_decimal;
use crate::utils::decimal_to_balance;
use crate::utils::format_token_amount_full_precision;
use crate::{
    components::{
        bridge_history::{
            AddBridgeHistoryEntry, DepositAddress, DepositStatus, HistoryTab,
            add_to_bridge_history, build_explorer_url, fetch_deposit_status,
        },
        bridge_termination_screen::BridgeTerminationScreen,
        copy_button::CopyButton,
        copyable_address::CopyableAddress,
        qrcode_display::QRCodeDisplay,
    },
    pages::settings::open_live_chat,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SupportedTokensResponse {
    pub tokens: Vec<BridgeToken>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct BridgeToken {
    pub defuse_asset_identifier: String,
    pub near_token_id: AccountId,
    pub decimals: u32,
    pub asset_name: String,
    #[serde(with = "dec_format")]
    pub min_deposit_amount: Balance,
    #[serde(with = "dec_format")]
    pub min_withdrawal_amount: Balance,
    #[serde(with = "dec_format")]
    pub withdrawal_fee: Balance,
    pub standard: String,
    pub intents_token_id: String,
    pub multi_token_id: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct JsonRpcRequest {
    pub id: u32,
    pub jsonrpc: String,
    pub method: String,
    pub params: Vec<SupportedTokensParams>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SupportedTokensParams {
    pub chains: Vec<String>,
}

#[derive(Debug, Clone, PartialEq)]
enum Tab {
    ToNear,
    Stables,
    History,
}

#[derive(Debug, Clone, PartialEq)]
enum StableCoin {
    Usdc,
    Usdt,
}

fn get_chain_info(defuse_asset_identifier: &str) -> Option<&'static ChainInfo<'static>> {
    let mut parts = defuse_asset_identifier.splitn(3, ':');
    let chain_type = parts.next()?;
    let chain_id = parts.next()?;

    NETWORK_NAMES
        .iter()
        .find(|c| c.chain_type == chain_type && c.chain_id == chain_id)
}

#[derive(Debug, Clone)]
struct TerminalScreenData {
    deposit_address: DepositAddress,
}

#[component]
pub fn Bridge() -> impl IntoView {
    let NetworkContext { network } = expect_context::<NetworkContext>();
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
        <Show
            when=move || network.get() == Network::Mainnet
            fallback=move || {
                view! {
                    <div class="flex flex-col gap-6 p-2 md:p-4">
                        <A
                            href="/receive"
                            attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                            <span>"Back"</span>
                        </A>
                        <div class="flex flex-col items-center justify-center h-full p-8 text-center">
                            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                <Icon icon=icondata::LuCircleX attr:class="w-8 h-8 text-red-500" />
                            </div>
                            <h2 class="text-xl font-bold text-white mb-2">
                                "Bridge Only Available on Mainnet"
                            </h2>
                            <p class="text-gray-400 max-w-md">
                                "The bridge feature is only available on NEAR Mainnet. Please switch to a Mainnet account to use the bridge."
                            </p>
                        </div>
                    </div>
                }
            }
        >
            <div class="flex flex-col gap-6 p-2 md:p-4">
                <A
                    href="/"
                    attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                    <span>"Back"</span>
                </A>

                {move || match terminal_screen.get() {
                    None => {
                        view! {
                            <div class="flex flex-col items-center gap-6">
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
                            .into_any()
                    }
                    Some(data) => {
                        view! {
                            <BridgeTerminationScreen
                                deposit_address=data.deposit_address.clone()
                                is_send=false
                            />
                        }
                            .into_any()
                    }
                }}
            </div>
        </Show>
    }
}

#[component]
fn ToNearTab(
    tokens: Vec<BridgeToken>,
    set_terminal_screen: WriteSignal<Option<TerminalScreenData>>,
) -> impl IntoView {
    let tokens_stored = StoredValue::new(tokens.clone());
    let networks = tokens
        .iter()
        .filter_map(|t| get_chain_info(&t.defuse_asset_identifier))
        .sorted_unstable_by_key(|c| c.display_name)
        .dedup_by(|c1, c2| c1.display_name == c2.display_name)
        .collect::<Vec<_>>();
    let networks_clone = networks.clone();

    let network_options = Signal::derive(move || {
        networks
            .iter()
            .map(|chain_info| {
                let display_name = chain_info.display_name.to_string();
                SelectOption::new(display_name.clone(), move || {
                    view! { {display_name.clone()} }.into_any()
                })
            })
            .collect::<Vec<_>>()
    });

    let (selected_network, set_selected_network) = signal::<Option<&'static ChainInfo>>(None);
    let (selected_token, set_selected_token) = signal::<Option<BridgeToken>>(None);

    let network_tokens = move || {
        if let Some(network) = selected_network.get() {
            let mut token_list: Vec<BridgeToken> = tokens_stored
                .get_value()
                .into_iter()
                .filter(|t| {
                    t.defuse_asset_identifier
                        .starts_with(&format!("{}:{}:", network.chain_type, network.chain_id))
                })
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
                SelectOption::new(asset_name.clone(), move || {
                    view! { {asset_name.clone()} }.into_any()
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
                    filter_enabled=true
                    on_change=Callback::new(move |value: String| {
                        let previously_selected_network = selected_network.get_untracked();
                        if previously_selected_network.is_some_and(|n| n.display_name == value) {
                            return;
                        }
                        set_selected_token(None);
                        if let Some(chain_info) = networks_clone
                            .iter()
                            .find(|ci| ci.display_name == value)
                        {
                            set_selected_network(Some(chain_info));
                        }
                    })
                />
            </div>

            <Show when=move || selected_network.read().is_some()>
                <div class="bg-neutral-800 rounded-lg p-4">
                    <label class="text-gray-400 text-sm mb-2 block">"Select Token"</label>
                    <Select
                        options=token_options
                        placeholder="Choose a token...".to_string()
                        class="bg-neutral-700 text-white rounded-lg"
                        filter_enabled=true
                        on_change=Callback::new(move |value: String| {
                            if !value.is_empty() {
                                let selected_network = selected_network.get_untracked();
                                if let Some(token) = tokens_stored
                                    .get_value()
                                    .into_iter()
                                    .find(|t| {
                                        t.asset_name == value
                                            && t
                                                .defuse_asset_identifier
                                                .starts_with(
                                                    &format!(
                                                        "{}:{}:",
                                                        selected_network.unwrap().chain_type,
                                                        selected_network.unwrap().chain_id,
                                                    ),
                                                )
                                    })
                                {
                                    set_selected_token(Some(token));
                                }
                            } else {
                                set_selected_token(None);
                            }
                        })
                    />
                </div>
            </Show>

            <Show when=move || {
                selected_token.read().is_some() && selected_network.read().is_some()
            }>
                <TokenDepositForm
                    token=selected_token
                    chain_info=selected_network
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
    let (selected_network, set_selected_network) = signal::<Option<&'static ChainInfo>>(None);
    let (selected_token, set_selected_token) = signal::<Option<BridgeToken>>(None);

    let networks = move || {
        let stable_name = match selected_stable.get() {
            StableCoin::Usdc => "USDC",
            StableCoin::Usdt => "USDT",
        };
        tokens
            .iter()
            .filter(|t| t.asset_name.to_uppercase() == stable_name)
            .filter_map(|t| get_chain_info(&t.defuse_asset_identifier))
            .sorted_unstable_by_key(|c| c.display_name)
            .dedup_by(|c1, c2| c1.display_name == c2.display_name)
            .collect::<Vec<_>>()
    };
    let networks_clone = networks.clone();
    let network_options = Signal::derive(move || {
        networks()
            .into_iter()
            .map(|chain_info| {
                let display_name = chain_info.display_name.to_string();
                SelectOption::new(display_name.clone(), move || {
                    view! { {display_name.clone()} }.into_any()
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
                    && t.defuse_asset_identifier
                        .starts_with(&format!("{}:{}:", network.chain_type, network.chain_id))
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
                                        t
                                            .defuse_asset_identifier
                                            .starts_with(
                                                &format!("{}:{}:", network.chain_type, network.chain_id),
                                            ) && t.asset_name.to_uppercase() == "USDC"
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
                                        t
                                            .defuse_asset_identifier
                                            .starts_with(
                                                &format!("{}:{}:", network.chain_type, network.chain_id),
                                            ) && t.asset_name.to_uppercase() == "USDT"
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
                    options=network_options
                    placeholder="Choose a network...".to_string()
                    class="bg-neutral-700 text-white rounded-lg"
                    filter_enabled=true
                    on_change=Callback::new(move |value: String| {
                        let previously_selected_network = selected_network.get_untracked();
                        if previously_selected_network.is_some_and(|n| n.display_name == value) {
                            return;
                        }
                        set_selected_token(None);
                        if let Some(chain_info) = networks_clone()
                            .into_iter()
                            .find(|ci| ci.display_name == value)
                        {
                            set_selected_network(Some(chain_info));
                        }
                    })
                />
            </div>

            <Show when=move || {
                selected_token.read().is_some() && selected_network.read().is_some()
            }>
                <TokenDepositForm
                    token=selected_token
                    chain_info=selected_network
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
    chain_info: ReadSignal<Option<&'static ChainInfo<'static>>>,
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
    let (quote_data, set_quote_data) = signal::<Option<QuoteData>>(None);
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
        let current_chain_info = chain_info.get();
        let destination_asset = match receive_token_symbol.get().as_str() {
            "USDC" => format!("nep141:{USDC_ON_NEAR}"),
            "USDT" => format!("nep141:{USDT_ON_NEAR}"),
            "NEAR" => format!("nep141:{WRAPPED_NEAR}"),
            _ => unreachable!("Invalid destination asset"),
        };

        async move {
            let Some(current_chain_info) = current_chain_info else {
                return Err("No chain info, can't get a quote".to_string());
            };
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
                deposit_mode: if current_chain_info.requires_memo {
                    DepositMode::Memo
                } else {
                    DepositMode::Simple
                },
                swap_type: SwapType::ExactInput,
                slippage_tolerance: match receive_token_symbol.get().as_str() {
                    "USDC" | "USDT" => 0,
                    _ => 200,
                },
                origin_asset: current_token.intents_token_id.clone(),
                deposit_type: DepositType::OriginChain,
                destination_asset: destination_asset.to_string(),
                amount: amount_raw,
                refund_to: current_recipient.to_string(),
                refund_type: RefundType::Intents,
                recipient: current_recipient.to_string(),
                recipient_type: RecipientType::DestinationChain,
                deadline,
                referral: "wallet.intear.near".parse().unwrap(),
                quote_waiting_time_ms: 0,
                app_fees: vec![],
                virtual_chain_recipient: None,
                virtual_chain_refund_recipient: None,
            };

            match reqwest::Client::new()
                .post("https://1click.chaindefuser.com/v0/quote")
                .bearer_auth("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjUtMDQtMjMtdjEifQ.eyJ2IjoxLCJrZXlfdHlwZSI6ImRpc3RyaWJ1dGlvbl9jaGFubmVsIiwicGFydG5lcl9pZCI6InNsaW1lIiwiaWF0IjoxNzQ5NTU3MDk4LCJleHAiOjE3ODEwOTMwOTh9.Dd6TweB3c1nDHILMfApFfcvVd4XDXu015hR6122j6fLRMzZvPXJNb1JkPkXXy9RN9ToIWITaDMSCBRsQv2it-lgP0lxCO7AFWxcNrZ8f9GkhTXfXBaeaeYDh_7YVRADMwIaw6_Ayt3NTeYI8poab3TdV2ubWT2_0MVQRYfHJqSGrBdBs_iqT0t9Henjn36UQjg6SU0sFA0N31fKKcFp2MbuwioUnyywvYOA4zVrTfAVmyPFS7_DowPYTC_ZkTKZBy0bLB_GYf6NoV3i_lCkT4_8JOkhQXKCfk2TRw_DIWZRl7x4jVG3q-l1fodXDLUgZZC7_1o6Z3No6amjYamQO6A")
                .json(&request)
                .send()
                .await
            {
                Ok(response) => {
                    let response_text = response.text().await
                        .map_err(|e| format!("Failed to read response: {e}"))?;

                    match serde_json::from_str::<QuoteResponse>(&response_text) {
                        Ok(quote_response) => Ok(quote_response.quote),
                        Err(e) => {
                            if let Ok(error_json) = serde_json::from_str::<serde_json::Value>(&response_text)
                                && let Some(message) = error_json.get("message").and_then(|m| m.as_str()) {
                                    if message == "Failed to get quote" {
                                        return Err(format!("{} on {} is temporarily out of liquidity", current_token.asset_name, current_chain_info.display_name));
                                    }
                                    if let Some(min_amount_str) = message.strip_prefix("Amount is too low for bridge, try at least ")
                                        && let Ok(min_amount_raw) = min_amount_str.parse::<u128>() {
                                            let min_amount_decimal = balance_to_decimal(min_amount_raw, current_token.decimals);
                                            let mut min_amount_formatted = min_amount_decimal.to_string();
                                            if min_amount_formatted.contains('.') {
                                                min_amount_formatted = min_amount_formatted
                                                    .trim_end_matches('0')
                                                    .trim_end_matches('.')
                                                    .to_string();
                                            }
                                            return Err(format!("Amount is too low for bridge, try at least {} {}", min_amount_formatted, current_token.asset_name));
                                        }
                                }
                            let error_msg = format!("{e}");
                            if error_msg.contains("error decoding response body") {
                                Err("".to_string())
                            } else {
                                log::error!("Failed to parse quote: {error_msg}");
                                Err(format!("Token temporarily not available to bridge"))
                            }
                        }
                    }
                },
                Err(e) => Err(format!("Failed to get quote: {e}")),
            }
        }
        .boxed_local()
    });

    // Guaranteed to be Some for non-dry quotes
    let deposit_address = move || {
        quote_data.get().map(|q| match q.deposit_memo {
            Some(memo) => DepositAddress::WithMemo(q.deposit_address.clone().unwrap(), memo),
            None => DepositAddress::Simple(q.deposit_address.clone().unwrap()),
        })
    };

    let (deposit_status, set_deposit_status) = signal::<Option<DepositStatus>>(None);

    Effect::new(move || {
        status_counter.track();
        if let Some(address) = deposit_address() {
            let address = address.clone();
            leptos::task::spawn_local(async move {
                if deposit_status.get().is_some_and(|s| {
                    matches!(
                        s,
                        DepositStatus::Success | DepositStatus::Failed | DepositStatus::Refunded
                    )
                }) {
                    return;
                }
                if let Ok(status_response) = fetch_deposit_status(&address).await {
                    let status = status_response.status;
                    set_deposit_status.set(Some(status.clone()));

                    if matches!(
                        status,
                        DepositStatus::Success | DepositStatus::Failed | DepositStatus::Refunded
                    ) {
                        set_terminal_screen.set(Some(TerminalScreenData {
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
        let current_chain_info = chain_info.get();
        let destination_asset = match receive_token_symbol.get().as_str() {
            "USDC" => format!("nep141:{USDC_ON_NEAR}"),
            "USDT" => format!("nep141:{USDT_ON_NEAR}"),
            "NEAR" => format!("nep141:{WRAPPED_NEAR}"),
            _ => unreachable!("Invalid destination asset"),
        };

        set_is_creating_address(true);
        set_error_message(None);

        leptos::task::spawn_local(async move {
            let Some(current_chain_info) = current_chain_info else {
                set_error_message(Some(
                    "No chain info, can't create a deposit address".to_string(),
                ));
                set_is_creating_address(false);
                return;
            };
            let amount_bd = match BigDecimal::from_str(&current_amount) {
                Ok(amt) => amt,
                Err(_) => {
                    set_error_message(Some("Invalid amount".to_string()));
                    set_is_creating_address(false);
                    return;
                }
            };

            let amount = decimal_to_balance(amount_bd, current_token.decimals);

            let now = Utc::now();
            let deadline = now + Duration::from_secs(60 * 60 * 24);

            let request = QuoteRequest {
                dry: false,
                deposit_mode: if current_chain_info.requires_memo {
                    DepositMode::Memo
                } else {
                    DepositMode::Simple
                },
                swap_type: SwapType::ExactInput,
                slippage_tolerance: match receive_token_symbol.get().as_str() {
                    "USDC" | "USDT" => 0,
                    _ => 200,
                },
                origin_asset: current_token.intents_token_id.clone(),
                deposit_type: DepositType::OriginChain,
                destination_asset: destination_asset.to_string(),
                amount,
                refund_to: current_recipient.to_string(),
                refund_type: RefundType::Intents,
                recipient: current_recipient.to_string(),
                recipient_type: RecipientType::DestinationChain,
                deadline,
                referral: "wallet.intear.near".parse().unwrap(),
                quote_waiting_time_ms: 2500,
                app_fees: vec![],
                virtual_chain_recipient: None,
                virtual_chain_refund_recipient: None,
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

                        let history_entry = AddBridgeHistoryEntry {
                            deposit_address: match quote.deposit_memo {
                                Some(memo) => DepositAddress::WithMemo(quote.deposit_address.clone().unwrap(), memo),
                                None => DepositAddress::Simple(quote.deposit_address.clone().unwrap()),
                            },
                            created_at: Utc::now(),
                            is_send: false,
                        };

                        spawn_local(async move {
                            if let Err(e) = add_to_bridge_history(history_entry).await {
                                log::error!("Failed to add bridge history entry: {e}");
                            }
                        });

                        set_is_creating_address(false);
                    }
                    Err(e) => {
                        log::error!("Failed to create deposit address: {}", e);
                        set_is_creating_address(false);
                    }
                },
                Err(e) => {
                    log::error!("Failed to send request: {}", e);
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
                            <Show when=move || {
                                deposit_address()
                                    .is_some_and(|address| {
                                        matches!(address, DepositAddress::Simple(_))
                                    })
                            }>
                                <QRCodeDisplay
                                    text=match deposit_address() {
                                        Some(DepositAddress::Simple(address)) => address,
                                        Some(DepositAddress::WithMemo(_, _)) => unreachable!(),
                                        None => unreachable!(),
                                    }
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
                                                        format_token_amount_full_precision(
                                                            q.amount_in,
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
                                    address=match deposit_address() {
                                        Some(DepositAddress::Simple(address)) => address,
                                        Some(DepositAddress::WithMemo(address, _)) => address,
                                        None => String::new(),
                                    }
                                    label="To address:"
                                />

                                {move || {
                                    deposit_address()
                                        .map(|address| match address {
                                            DepositAddress::WithMemo(_, memo) => {
                                                view! {
                                                    <CopyableAddress
                                                        address=memo
                                                        label="With memo (IMPORTANT):"
                                                    />
                                                }
                                                    .into_any()
                                            }
                                            DepositAddress::Simple(_) => ().into_any(),
                                        })
                                }}

                                <div class="text-[10px] text-gray-400 text-center px-2 leading-2.5">
                                    "Bridge service is provided by Near Intents, HOT Bridge, and Omnibridge. While they have good reputation in the ecosystem and uptime, these bridges are not affiliated with Intear, so we can provide limited customer support. "
                                    <a
                                        href="https://docs.near-intents.org/near-intents/integration/distribution-channels/1click-terms-of-service"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        "Terms of Service"
                                    </a>
                                </div>
                            </div>

                            <div class="flex items-center justify-center gap-2">
                                <p class="text-sm text-gray-400 text-center">
                                    "Send the exact amount shown above to receive ≈"
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
                                        countdown_counter.track();
                                        if let Some(status) = deposit_status.get() {
                                            let is_expired = quote_data
                                                .get()
                                                .and_then(|q| q.deadline)
                                                .map(|deadline| deadline < Utc::now())
                                                .unwrap_or(false);
                                            let should_show_expired = is_expired
                                                && matches!(
                                                    status,
                                                    DepositStatus::PendingDeposit
                                                    | DepositStatus::IncompleteDeposit
                                                );

                                            view! {
                                                <span class=if should_show_expired {
                                                    "text-red-400"
                                                } else {
                                                    status.color_class()
                                                }>
                                                    {if should_show_expired {
                                                        "Expired"
                                                    } else {
                                                        status.display()
                                                    }}
                                                </span>
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

                            {move || {
                                let is_terminal = deposit_status
                                    .get()
                                    .map(|s| {
                                        matches!(
                                            s,
                                            DepositStatus::Success
                                            | DepositStatus::Failed
                                            | DepositStatus::Refunded
                                        )
                                    })
                                    .unwrap_or(false);
                                if !is_terminal && deposit_address().is_some() {
                                    view! {
                                        <div class="w-full">
                                            <a
                                                href=move || {
                                                    deposit_address()
                                                        .map(|addr| build_explorer_url(&addr))
                                                        .unwrap_or_default()
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-blue-400 hover:text-blue-300 transition-colors text-sm break-all block text-center"
                                            >
                                                "View on Intents Explorer"
                                            </a>
                                        </div>
                                        <button
                                            class="w-full mt-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm"
                                            on:click=move |_| {
                                                open_live_chat(recipient(), deposit_address())
                                            }
                                        >
                                            "Contact Support"
                                        </button>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
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
                                    .unwrap_or_else(|| "Getting a quote...".to_string())
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
