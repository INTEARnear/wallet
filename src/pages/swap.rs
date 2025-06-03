use std::{fmt, fmt::Display};

use chrono::{DateTime, Utc};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::Icon;
use near_min_api::{
    types::{AccountId, Action, Balance, CryptoHash},
    utils::dec_format,
};
use serde::{Deserialize, Serialize};

use crate::{
    contexts::{
        accounts_context::{Account, AccountsContext},
        network_context::Network,
        tokens_context::{Token, TokenContext, TokenData, TokenInfo, TokenScore},
    },
    utils::{format_token_amount, format_usd_value_no_hide},
};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SwapMode {
    ExactIn,
    ExactOut,
}

async fn fetch_token_by_id(token_id: &str, account: Account) -> Result<TokenInfo, String> {
    let api_url = match account.network {
        Network::Mainnet => "https://prices.intear.tech",
        Network::Testnet => "https://prices-testnet.intear.tech",
    };

    let response = reqwest::Client::new()
        .get(format!("{api_url}/token"))
        .query(&[("token_id", token_id)])
        .send()
        .await
        .map_err(|e| format!("Failed to fetch token: {}", e))?;

    let token_info: TokenInfo = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse token response: {}", e))?;

    Ok(token_info)
}

async fn search_tokens(query: &str, account: Account) -> Result<Vec<TokenInfo>, String> {
    #[derive(Serialize)]
    struct SearchParams {
        q: String,
        n: u32,
        acc: AccountId,
        rep: TokenScore,
    }

    let params = SearchParams {
        q: query.to_string(),
        n: 50,
        acc: account.account_id,
        rep: TokenScore::Unknown,
    };

    let api_url = match account.network {
        Network::Mainnet => "https://prices.intear.tech",
        Network::Testnet => "https://prices-testnet.intear.tech",
    };
    let response = reqwest::Client::new()
        .get(format!("{api_url}/token-search"))
        .query(&params)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch tokens: {}", e))?;

    let token_infos: Vec<TokenInfo> = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(token_infos)
}

#[component]
fn TokenSelector(
    selected_token: ReadSignal<Option<TokenData>>,
    on_select: impl Fn(TokenData) + Send + Sync + 'static + Copy,
    tokens: ReadSignal<Vec<TokenData>>,
    loading_tokens: ReadSignal<bool>,
    placeholder: &'static str,
) -> impl IntoView {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();

    // Modal show/hide state
    let (show, set_show) = signal(false);

    // Internal state for search
    let (search_query, set_search_query) = signal("".to_string());
    let (search_results, set_search_results) = signal::<Vec<TokenInfo>>(vec![]);
    let (searching, set_searching) = signal(false);

    // Search handling
    let handle_search = move |query: String| {
        set_search_query.set(query.clone());
        if !query.is_empty() {
            set_searching.set(true);
            let current_account = accounts.get().selected_account_id.map(|id| {
                accounts
                    .get()
                    .accounts
                    .into_iter()
                    .find(|a| a.account_id == id)
                    .unwrap()
            });
            let Some(current_account) = current_account else {
                set_search_results.set(vec![]);
                set_searching.set(false);
                return;
            };
            spawn_local(async move {
                match search_tokens(&query, current_account).await {
                    Ok(results) => {
                        set_search_results.set(results);
                    }
                    Err(_) => {
                        set_search_results.set(vec![]);
                    }
                }
                set_searching.set(false);
            });
        } else {
            set_search_results.set(vec![]);
        }
    };

    view! {
        // Token selector button
        <button
            class="flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-xl px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 transition-colors cursor-pointer w-[120px] sm:w-[140px] md:w-[160px] wrap-anywhere text-[13px] sm:text-[16px]"
            on:click=move |_| set_show.set(true)
        >
            {move || {
                if let Some(token) = selected_token.get() {
                    view! {
                        <>
                            <div class="flex items-center gap-2 min-w-0">
                                {match token.token.metadata.icon {
                                    Some(icon) => {
                                        view! {
                                            <img
                                                src=icon
                                                alt=token.token.metadata.symbol.clone()
                                                class="w-6 h-6 rounded-full flex-shrink-0"
                                            />
                                        }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs flex-shrink-0">
                                                {token.token.metadata.symbol.chars().next().unwrap_or('?')}
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }}
                                <span class="text-white font-bold truncate">
                                    {if token.token.metadata.symbol.len() >= 10 {
                                        format!(
                                            "{}…{}",
                                            &token.token.metadata.symbol[..4],
                                            &token
                                                .token
                                                .metadata
                                                .symbol[token.token.metadata.symbol.len() - 4..],
                                        )
                                    } else {
                                        token.token.metadata.symbol
                                    }}
                                </span>
                            </div>
                            <Icon
                                icon=icondata::LuChevronDown
                                width="16"
                                height="16"
                                attr:class="text-gray-400 min-w-4 min-h-4 flex-shrink-0"
                            />
                        </>
                    }
                        .into_any()
                } else {
                    view! {
                        <>
                            <span class="text-gray-400 truncate">{placeholder}</span>
                            <Icon
                                icon=icondata::LuChevronDown
                                width="16"
                                height="16"
                                attr:class="text-gray-400 min-w-4 min-h-4 flex-shrink-0"
                            />
                        </>
                    }
                        .into_any()
                }
            }}
        </button>

        // Modal
        <Show when=move || show.get()>
            <div
                class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                on:click=move |_| {
                    set_show.set(false);
                }
            >
                <div on:click=|ev| ev.stop_propagation()>
                    <div class="bg-neutral-900 rounded-2xl w-full max-w-lg max-h-[60vh] overflow-hidden flex flex-col">
                        <div class="p-4 border-b border-neutral-800 flex-shrink-0">
                            // Search input
                            <div class="relative">
                                <Icon
                                    icon=icondata::LuSearch
                                    width="20"
                                    height="20"
                                    attr:class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    class="w-full bg-neutral-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search tokens..."
                                    prop:value=search_query
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        handle_search(value);
                                    }
                                />
                                {move || {
                                    if searching.get() {
                                        view! {
                                            <div class="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }
                                }}
                            </div>
                        </div>
                        <div class="p-4 space-y-2 overflow-y-auto flex-1">
                            {move || {
                                if loading_tokens.get() {
                                    view! {
                                        <div class="flex items-center justify-center h-32">
                                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    let search_results = search_results.get();
                                    let search_query = search_query.get();
                                    let user_tokens = tokens.get();
                                    if search_query.is_empty() {
                                        user_tokens
                                            .into_iter()
                                            .map(|token_data| {
                                                let token_clone = token_data.clone();
                                                let balance_f64 = token_data.balance as f64
                                                    / 10f64.powi(token_data.token.metadata.decimals as i32);
                                                let usd_value = balance_f64
                                                    * token_data.token.price_usd_hardcoded;

                                                // Show user's owned tokens when no search query

                                                view! {
                                                    <button
                                                        class="w-full flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 transition-colors cursor-pointer"
                                                        on:click={
                                                            let token_clone = token_clone.clone();
                                                            move |_| {
                                                                on_select(token_clone.clone());
                                                                set_show.set(false);
                                                            }
                                                        }
                                                    >
                                                        <div class="flex items-center gap-3">
                                                            {match token_data.token.metadata.icon {
                                                                Some(icon) => {
                                                                    view! {
                                                                        <img
                                                                            src=icon
                                                                            alt=token_data.token.metadata.symbol.clone()
                                                                            class="w-10 h-10 rounded-full"
                                                                        />
                                                                    }
                                                                        .into_any()
                                                                }
                                                                None => {
                                                                    view! {
                                                                        <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                                                            {token_data
                                                                                .token
                                                                                .metadata
                                                                                .symbol
                                                                                .chars()
                                                                                .next()
                                                                                .unwrap_or('?')}
                                                                        </div>
                                                                    }
                                                                        .into_any()
                                                                }
                                                            }} <div class="text-left">
                                                                <div class="text-white font-medium">
                                                                    {token_data.token.metadata.symbol.clone()}
                                                                </div>
                                                                <div class="text-gray-400 text-sm">
                                                                    {token_data.token.metadata.name.clone()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="text-right">
                                                            <div class="text-white">
                                                                {format_token_amount(
                                                                    token_data.balance,
                                                                    token_data.token.metadata.decimals,
                                                                    "",
                                                                )}
                                                            </div>
                                                            <div class="text-gray-400 text-sm">
                                                                {format_usd_value_no_hide(usd_value)}
                                                            </div>
                                                        </div>
                                                    </button>
                                                }
                                            })
                                            .collect_view()
                                            .into_any()
                                    } else if search_results.is_empty() && !searching.get() {
                                        view! {
                                            <div class="flex items-center justify-center h-32 text-gray-400">
                                                "No tokens found"
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        search_results
                                            .into_iter()
                                            .map(|token_info| {
                                                log::info!("user_tokens: {:?}", user_tokens);
                                                let owned_token = user_tokens
                                                    .iter()
                                                    .find(|t| t.token.account_id == token_info.account_id);
                                                log::info!(
                                                    "owned_token {:?}: {:?}", token_info.account_id, owned_token
                                                );
                                                let (balance, is_owned) = if let Some(owned) = owned_token {
                                                    (owned.balance, true)
                                                } else {
                                                    (0, false)
                                                };
                                                let token_data = TokenData {
                                                    balance,
                                                    token: token_info,
                                                };
                                                let token_clone = token_data.clone();
                                                let balance_f64 = balance as f64
                                                    / 10f64.powi(token_data.token.metadata.decimals as i32);
                                                let usd_value = balance_f64
                                                    * token_data.token.price_usd_hardcoded;

                                                view! {
                                                    <button
                                                        class="w-full flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 transition-colors cursor-pointer"
                                                        on:click={
                                                            let token_clone = token_clone.clone();
                                                            move |_| {
                                                                on_select(token_clone.clone());
                                                                set_show.set(false);
                                                            }
                                                        }
                                                    >
                                                        <div class="flex items-center gap-3">
                                                            {match token_data.token.metadata.icon {
                                                                Some(icon) => {
                                                                    view! {
                                                                        <img
                                                                            src=icon
                                                                            alt=token_data.token.metadata.symbol.clone()
                                                                            class="w-10 h-10 rounded-full"
                                                                        />
                                                                    }
                                                                        .into_any()
                                                                }
                                                                None => {
                                                                    view! {
                                                                        <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                                                            {token_data
                                                                                .token
                                                                                .metadata
                                                                                .symbol
                                                                                .chars()
                                                                                .next()
                                                                                .unwrap_or('?')}
                                                                        </div>
                                                                    }
                                                                        .into_any()
                                                                }
                                                            }} <div class="text-left">
                                                                <div class="text-white font-medium">
                                                                    {token_data.token.metadata.symbol.clone()}
                                                                </div>
                                                                <div class="text-gray-400 text-sm">
                                                                    {token_data.token.metadata.name.clone()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="text-right">
                                                            {move || {
                                                                if is_owned {
                                                                    view! {
                                                                        <>
                                                                            <div class="text-white">
                                                                                {format_token_amount(
                                                                                    balance,
                                                                                    token_data.token.metadata.decimals,
                                                                                    "",
                                                                                )}
                                                                            </div>
                                                                            <div class="text-gray-400 text-sm">
                                                                                {format_usd_value_no_hide(usd_value)}
                                                                            </div>
                                                                        </>
                                                                    }
                                                                        .into_any()
                                                                } else {
                                                                    view! {
                                                                        <>
                                                                            <div class="text-gray-500">"0"</div>
                                                                        </>
                                                                    }
                                                                        .into_any()
                                                                }
                                                            }}
                                                        </div>
                                                    </button>
                                                }
                                            })
                                            .collect_view()
                                            .into_any()
                                    }
                                }
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    }
}

#[component]
pub fn Swap() -> impl IntoView {
    let TokenContext {
        tokens,
        loading_tokens,
    } = expect_context::<TokenContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();

    // Token selection states with defaults based on network
    let (token_in, set_token_in) = signal::<Option<TokenData>>(None);
    let (token_out, set_token_out) = signal::<Option<TokenData>>(None);

    // Set default tokens based on network
    Effect::new(move |_| {
        let tokens_list = tokens.get();
        if tokens_list.is_empty() {
            return;
        }

        let current_account = accounts.get().selected_account_id.map(|id| {
            accounts
                .get()
                .accounts
                .into_iter()
                .find(|a| a.account_id == id)
                .unwrap()
        });

        if let Some(account) = current_account {
            // Set default input token (NEAR)
            if token_in.get().is_none() {
                let near_token = tokens_list
                    .iter()
                    .find(|t| matches!(t.token.account_id, Token::Near));
                if let Some(near) = near_token {
                    set_token_in.set(Some(near.clone()));
                }
            }

            // Set default output token
            if token_out.get().is_none() {
                let default_token_id = match account.network {
                    Network::Mainnet => {
                        "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1"
                    }
                    Network::Testnet => "usdc.fakes.testnet",
                };

                let owned_token = tokens_list.iter().find(|t| {
                    if let Token::Nep141(account_id) = &t.token.account_id {
                        account_id.as_str() == default_token_id
                    } else {
                        false
                    }
                });

                if let Some(token) = owned_token {
                    // User owns the token, use it
                    set_token_out.set(Some(token.clone()));
                } else {
                    // User doesn't own the token, fetch from API
                    let account_clone = account.clone();
                    let default_token_id = default_token_id.to_string();
                    spawn_local(async move {
                        match fetch_token_by_id(&default_token_id, account_clone).await {
                            Ok(token_info) => {
                                let token_data = TokenData {
                                    balance: 0,
                                    token: token_info,
                                };
                                set_token_out.set(Some(token_data));
                            }
                            Err(e) => {
                                log::warn!("Failed to fetch default output token: {}", e);
                            }
                        }
                    });
                }
            }
        }
    });

    // Amount states
    let (amount_in, set_amount_in) = signal("".to_string());
    let (amount_out, set_amount_out) = signal("".to_string());
    let (swap_mode, set_swap_mode) = signal(SwapMode::ExactIn);

    // Error states
    let (amount_in_error, set_amount_in_error) = signal::<Option<String>>(None);
    let (amount_out_error, set_amount_out_error) = signal::<Option<String>>(None);

    // Handle swap direction change
    let handle_swap_tokens = move |_| {
        let current_token_in = token_in.get();
        let current_token_out = token_out.get();
        set_token_in.set(current_token_out);
        set_token_out.set(current_token_in);

        // Clear amounts when swapping
        set_amount_in.set("".to_string());
        set_amount_out.set("".to_string());
        set_amount_in_error.set(None);
        set_amount_out_error.set(None);
    };

    // Validate amount input
    let validate_amount = move |amount: String, token: Option<TokenData>| -> Option<String> {
        if amount.is_empty() {
            return None;
        }

        let Some(token_data) = token else {
            return Some("Please select a token".to_string());
        };

        let Ok(amount_value) = amount.parse::<f64>() else {
            return Some("Invalid amount".to_string());
        };

        if amount_value <= 0.0 {
            return Some("Amount must be greater than 0".to_string());
        }

        // Convert user input to raw balance for precise comparison
        let decimals = token_data.token.metadata.decimals;
        let multiplier = 10f64.powi(decimals as i32);
        let amount_raw = (amount_value * multiplier).round() as u128;

        if amount_raw > token_data.balance {
            return Some("Amount exceeds balance".to_string());
        }

        None
    };

    // Handle amount input changes
    let handle_amount_in_change = move |value: String| {
        set_amount_in.set(value.clone());
        set_swap_mode.set(SwapMode::ExactIn);
        let error = validate_amount(value, token_in.get());
        set_amount_in_error.set(error);

        // Clear out amount when typing in
        set_amount_out.set("".to_string());
        set_amount_out_error.set(None);
    };

    let handle_amount_out_change = move |value: String| {
        set_amount_out.set(value.clone());
        set_swap_mode.set(SwapMode::ExactOut);
        let error = validate_amount(value, token_out.get());
        set_amount_out_error.set(error);

        // Clear in amount when typing out
        set_amount_in.set("".to_string());
        set_amount_in_error.set(None);
    };

    view! {
        <div class="max-w-lg mx-auto h-full">
            <div class="flex items-center justify-center h-full">
                <div class="w-full">
                    <div class="bg-neutral-900 rounded-2xl p-4 space-y-4">
                        // Token In Section
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <label class="text-gray-400 text-sm">"From"</label>
                                {move || {
                                    if let Some(token) = token_in.get() {
                                        view! {
                                            <span class="text-gray-400 text-sm">
                                                {format_token_amount(
                                                    token.balance,
                                                    token.token.metadata.decimals,
                                                    &token.token.metadata.symbol,
                                                )}
                                            </span>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }
                                }}
                            </div>

                            <div class="flex gap-3">
                                // Token selector
                                <TokenSelector
                                    selected_token=token_in
                                    on_select=move |token: TokenData| {
                                        set_token_in.set(Some(token));
                                        set_amount_in.set("".to_string());
                                        set_amount_out.set("".to_string());
                                        set_amount_in_error.set(None);
                                        set_amount_out_error.set(None);
                                    }
                                    tokens=tokens
                                    loading_tokens=loading_tokens
                                    placeholder="Select token"
                                />

                                // Amount input
                                <div class="flex-1 relative">
                                    <input
                                        type="text"
                                        class="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 text-right text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        style=move || {
                                            if swap_mode.get() == SwapMode::ExactOut {
                                                "opacity: 0.6;"
                                            } else if amount_in_error.get().is_some() {
                                                "border: 2px solid rgb(239 68 68);"
                                            } else if !amount_in.get().is_empty() {
                                                "border: 2px solid rgb(34 197 94);"
                                            } else {
                                                ""
                                            }
                                        }
                                        placeholder="0.0"
                                        prop:value=amount_in
                                        prop:disabled=move || swap_mode.get() == SwapMode::ExactOut
                                        on:input=move |ev| {
                                            let value = event_target_value(&ev);
                                            handle_amount_in_change(value);
                                        }
                                    />
                                    {move || {
                                        if let Some(token) = token_in.get() {
                                            if let Ok(amount_value) = amount_in.get().parse::<f64>() {
                                                let usd_value = amount_value
                                                    * token.token.price_usd_hardcoded;
                                                view! {
                                                    <div class="absolute right-3 -bottom-5 text-xs text-gray-400">
                                                        {format_usd_value_no_hide(usd_value)}
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            </div>

                            {move || {
                                if let Some(error) = amount_in_error.get() {
                                    view! { <p class="text-red-400 text-xs">{error}</p> }.into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>

                        // Swap direction button
                        <div class="flex justify-center">
                            <button
                                class="bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-colors cursor-pointer"
                                on:click=handle_swap_tokens
                            >
                                <Icon
                                    icon=icondata::LuArrowUpDown
                                    width="20"
                                    height="20"
                                    attr:class="text-white"
                                />
                            </button>
                        </div>

                        // Token Out Section
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <label class="text-gray-400 text-sm">"To"</label>
                                {move || {
                                    if let Some(token) = token_out.get() {
                                        view! {
                                            <span class="text-gray-400 text-sm">
                                                {format_token_amount(
                                                    token.balance,
                                                    token.token.metadata.decimals,
                                                    &token.token.metadata.symbol,
                                                )}
                                            </span>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }
                                }}
                            </div>

                            <div class="flex gap-3">
                                // Token selector
                                <TokenSelector
                                    selected_token=token_out
                                    on_select=move |token: TokenData| {
                                        set_token_out.set(Some(token));
                                        set_amount_in.set("".to_string());
                                        set_amount_out.set("".to_string());
                                        set_amount_in_error.set(None);
                                        set_amount_out_error.set(None);
                                    }
                                    tokens=tokens
                                    loading_tokens=loading_tokens
                                    placeholder="Select token"
                                />

                                // Amount input
                                <div class="flex-1 relative">
                                    <input
                                        type="text"
                                        class="w-full bg-neutral-800 text-white rounded-xl px-4 py-3 text-right text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        style=move || {
                                            if swap_mode.get() == SwapMode::ExactIn {
                                                "opacity: 0.6;"
                                            } else if amount_out_error.get().is_some() {
                                                "border: 2px solid rgb(239 68 68);"
                                            } else if !amount_out.get().is_empty() {
                                                "border: 2px solid rgb(34 197 94);"
                                            } else {
                                                ""
                                            }
                                        }
                                        placeholder="0.0"
                                        prop:value=amount_out
                                        prop:disabled=move || swap_mode.get() == SwapMode::ExactIn
                                        on:input=move |ev| {
                                            let value = event_target_value(&ev);
                                            handle_amount_out_change(value);
                                        }
                                    />
                                    {move || {
                                        if let Some(token) = token_out.get() {
                                            if let Ok(amount_value) = amount_out.get().parse::<f64>() {
                                                let usd_value = amount_value
                                                    * token.token.price_usd_hardcoded;
                                                view! {
                                                    <div class="absolute right-3 -bottom-5 text-xs text-gray-400">
                                                        {format_usd_value_no_hide(usd_value)}
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            </div>

                            {move || {
                                if let Some(error) = amount_out_error.get() {
                                    view! { <p class="text-red-400 text-xs">{error}</p> }.into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>

                        // Swap button
                        <button
                            class="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:from-neutral-600 disabled:to-neutral-700 text-white rounded-xl px-4 py-4 font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                            disabled=move || {
                                token_in.get().is_none() || token_out.get().is_none()
                                    || (amount_in.get().is_empty() && amount_out.get().is_empty())
                                    || amount_in_error.get().is_some()
                                    || amount_out_error.get().is_some()
                            }
                        >
                            "Get Quote"
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
#[serde(rename_all = "snake_case")]
pub enum Amount {
    AmountIn(#[serde(with = "dec_format")] Balance),
    AmountOut(#[serde(with = "dec_format")] Balance),
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum TokenId {
    Near,
    Nep141(AccountId),
}

impl Serialize for TokenId {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}

impl<'de> Deserialize<'de> for TokenId {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        if s == "near" {
            Ok(TokenId::Near)
        } else {
            Ok(TokenId::Nep141(
                s.parse().map_err(serde::de::Error::custom)?,
            ))
        }
    }
}

impl Display for TokenId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TokenId::Near => write!(f, "near"),
            TokenId::Nep141(account_id) => write!(f, "{account_id}"),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SwapRequest {
    /// The token to swap from. This and token_out must be different.
    pub token_in: TokenId,
    /// The token to swap to. This and token_in must be different.
    pub token_out: TokenId,
    /// The amount to swap. If it's AmountOut, some dexes might not support this.
    #[serde(flatten)]
    pub amount: Amount,
    /// The maximum amount of time to wait for the route to be found. Some dexes
    /// like near intents might show a better quote if you wait a bit longer.
    /// Usually, 2-3 seconds is enough. Maximum is 60 seconds.
    pub max_wait_ms: u64,
    /// The slippage tolerance. `1.00` means 100%, `0.001` means 0.1%. Must be
    /// between 0.00 and 1.00.
    pub slippage: f64,
    /// The dexes to use. You might want to remove Near Intents if you don't want
    /// to implement its own swap logic, which relies on signing and sending messages
    /// to a centralized RPC rather than just sending a transaction. If not provided,
    /// all dexes will be used. Must not be an empty array.
    pub dexes: Option<Vec<DexId>>,
    /// The account ID of the trader. If provided, the route will include storage
    /// deposit actions.
    pub trader_account_id: Option<AccountId>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Route {
    /// The deadline for the route. If provided, you should refresh the route by
    /// calling the /route endpoint again 2-3 seconds before the deadline to account
    /// for network and block production latency.
    pub deadline: Option<DateTime<Utc>>,
    /// Whether the route has slippage. Usually it's true for AMM models like Rhea
    /// and false for OTC / guaranteed-quote models like Near Intents.
    pub has_slippage: bool,
    /// The amount of tokens this route will swap. If you provided `Amount::AmountOut`,
    /// this amount will be `Amount::AmountIn` and vice versa.
    pub estimated_amount: Amount,
    /// The amount of tokens this route will swap in the worst case scenario (with
    /// slippage). If you provided `Amount::AmountOut`, this amount will be
    /// `Amount::AmountIn` and vice versa. If you set slippage to `0.01`, this will be
    /// 1% more / less than `estimated_amount`. If it's a dex like Near Intents,
    /// this will be the same as `estimated_amount`.
    pub worst_case_amount: Amount,
    /// The id of the dex that provided this route.
    pub dex_id: DexId,
    /// How to execute the swap. Need to be executed sequentially.
    pub execution_instructions: Vec<ExecutionInstruction>,
    /// Whether the route needs to unwrap the tokens after completing the swap. Only
    /// true for dexes that don't auto-unwrap tokens, and when token_out is NEAR.
    /// A transaction is not included in `execution_instructions` because the unwrapping
    /// can't be done deterministically due to slippage. The recommended behavior is
    /// to remember the current wrap.near balance and compare it to the balance after the
    /// swap, and unwrap the difference. When choosing amount_out, it can also happen
    /// when we wrap too much NEAR into wNEAR (because we're accounting for slippage)
    /// but the resulting wNEAR amount spent is less than what we wrapped.
    pub needs_unwrap: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ExecutionInstruction {
    /// Sign a transaction with the given actions and send it to the RPC.
    NearTransaction {
        receiver_id: AccountId,
        actions: Vec<Action>,
        /// Some .omft.near tokens don't implement `storage_deposit` method and
        /// fail
        continue_if_failed: bool,
    },
    /// A quote from Near Intents. You should sign the message and send it to
    /// POST https://solver-relay-v2.chaindefuser.com/rpc with method
    /// `publish_intent`. More details on how to publish a signed intent:
    /// https://docs.near-intents.org/near-intents/market-makers/bus/solver-relay
    IntentsQuote {
        message_to_sign: String,
        quote_hash: CryptoHash,
    },
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Hash)]
#[non_exhaustive]
pub enum DexId {
    /// https://dex.rhea.finance/
    /// AMM DEX
    ///
    /// Supports AmountIn, doesn't support AmountOut
    Rhea,
    /// https://app.near-intents.org/
    /// guaranteed-quote DEX & Bridge
    ///
    /// Supports both AmountIn and AmountOut
    NearIntents,
    /// https://app.veax.com/
    /// AMM DEX
    ///
    /// Not implemented yet
    Veax,
    /// https://aidols.bot/
    /// bonding-curve launchpad
    ///
    /// Supports both AmountIn and AmountOut, only *.aidols.near tokens
    Aidols,
    /// https://gra.fun/
    /// bonding-curve launchpad
    ///
    /// Supports AmountIn, doesn't support AmountOut, only *.gra-fun.near tokens
    GraFun,
    /// https://app.jumpdefi.xyz/swap
    /// AMM DEX
    ///
    /// Not implemented yet
    Jumpdefi,
}

async fn get_routes(swap_request: SwapRequest) -> Option<Vec<Route>> {
    let response = reqwest::Client::new()
        .get(format!(
            "{}/route",
            std::env::var("ROUTER_URL")
                .unwrap_or_else(|_| "https://router.intear.tech".to_string())
        ))
        .query(&swap_request)
        .send()
        .await
        .ok()?
        .json::<Vec<Route>>()
        .await
        .ok()?;
    Some(response)
}
