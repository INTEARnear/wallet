use std::{fmt, fmt::Display};

use bigdecimal::{BigDecimal, FromPrimitive, ToPrimitive};
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

    let (show, set_show) = signal(false);
    let (search_query, set_search_query) = signal("".to_string());

    let search_resource = LocalResource::new(move || async move {
        let query = search_query.get();
        if query.is_empty() {
            return Ok::<Vec<TokenInfo>, String>(vec![]);
        }

        let current_account = accounts.get().selected_account_id.map(|id| {
            accounts
                .get()
                .accounts
                .into_iter()
                .find(|a| a.account_id == id)
                .unwrap()
        });

        if let Some(current_account) = current_account {
            search_tokens(&query, current_account).await
        } else {
            Ok(vec![])
        }
    });

    view! {
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

        <Show when=move || show.get()>
            <div
                class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                on:click=move |_| {
                    set_show.set(false);
                }
            >
                <div on:click=|ev| ev.stop_propagation() class="md:min-w-md">
                    <div class="bg-neutral-900 rounded-2xl w-full max-w-lg max-h-[60vh] overflow-hidden flex flex-col">
                        <div class="p-4 border-b border-neutral-800 flex-shrink-0">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-white font-medium">"Select Token"</h3>
                                <button
                                    class="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    on:click=move |_| set_show.set(false)
                                >
                                    <Icon icon=icondata::LuX width="20" height="20" />
                                </button>
                            </div>
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
                                        set_search_query.set(value);
                                    }
                                />
                                {move || {
                                    let is_loading = search_resource.get().is_none()
                                        && !search_query.get().is_empty();
                                    if is_loading {
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
                                    let search_query = search_query.get();
                                    let user_tokens = tokens.get();
                                    if search_query.is_empty() {
                                        user_tokens
                                            .into_iter()
                                            .map(|token_data| {
                                                let token_clone = token_data.clone();
                                                let balance_decimal = BigDecimal::from(token_data.balance);
                                                let ten = BigDecimal::from(10);
                                                let mut decimals_decimal = BigDecimal::from(1);
                                                for _ in 0..token_data.token.metadata.decimals {
                                                    decimals_decimal *= &ten;
                                                }
                                                let balance_formatted = balance_decimal / decimals_decimal;
                                                let price_decimal = BigDecimal::from_f64(
                                                        token_data.token.price_usd_hardcoded,
                                                    )
                                                    .unwrap_or_default();
                                                let usd_value_decimal = balance_formatted * price_decimal;
                                                let usd_value = usd_value_decimal.to_f64().unwrap_or(0.0);

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
                                    } else {
                                        match search_resource.get() {
                                            Some(Ok(search_results)) => {
                                                if search_results.is_empty() {
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
                                                            let owned_token = user_tokens
                                                                .iter()
                                                                .find(|t| t.token.account_id == token_info.account_id);
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
                                                            let balance_decimal = BigDecimal::from(balance);
                                                            let ten = BigDecimal::from(10);
                                                            let mut decimals_decimal = BigDecimal::from(1);
                                                            for _ in 0..token_data.token.metadata.decimals {
                                                                decimals_decimal *= &ten;
                                                            }
                                                            let balance_formatted = balance_decimal / decimals_decimal;
                                                            let price_decimal = BigDecimal::from_f64(
                                                                    token_data.token.price_usd_hardcoded,
                                                                )
                                                                .unwrap_or_default();
                                                            let usd_value_decimal = balance_formatted * price_decimal;
                                                            let usd_value = usd_value_decimal.to_f64().unwrap_or(0.0);

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
                                            Some(Err(_)) => {
                                                view! {
                                                    <div class="flex items-center justify-center h-32 text-red-400">
                                                        "Error loading search results"
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                            None => {
                                                view! {
                                                    <div class="flex items-center justify-center h-32">
                                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                        }
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

    let (token_in, set_token_in) = signal::<Option<TokenData>>(None);
    let (token_out, set_token_out) = signal::<Option<TokenData>>(None);

    Effect::new(move |_| {
        let tokens_list = tokens.get();
        if tokens_list.is_empty() {
            return;
        }

        let current_account = accounts.get_untracked().selected_account_id.map(|id| {
            accounts
                .get_untracked()
                .accounts
                .into_iter()
                .find(|a| a.account_id == id)
                .unwrap()
        });

        if let Some(account) = current_account {
            // Set default input token (NEAR)
            if token_in.get_untracked().is_none() {
                let near_token = tokens_list
                    .iter()
                    .find(|t| matches!(t.token.account_id, Token::Near));
                if let Some(near) = near_token {
                    set_token_in.set(Some(near.clone()));
                }
            }

            // Set default output token (USDC)
            if token_out.get_untracked().is_none() {
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

    // Update selected token balances when accounts or tokens change
    Effect::new(move |_| {
        accounts.track();
        tokens.track();
        let tokens_list = tokens.get();

        if let Some(current_token_in) = token_in.get_untracked() {
            if let Some(updated_token) = tokens_list
                .iter()
                .find(|t| t.token.account_id == current_token_in.token.account_id)
            {
                if updated_token.balance != current_token_in.balance {
                    set_token_in.set(Some(updated_token.clone()));
                }
            }
        }

        if let Some(current_token_out) = token_out.get_untracked() {
            if let Some(updated_token) = tokens_list
                .iter()
                .find(|t| t.token.account_id == current_token_out.token.account_id)
            {
                if updated_token.balance != current_token_out.balance {
                    set_token_out.set(Some(updated_token.clone()));
                }
            }
        }
    });

    let (amount_entered, set_amount_entered) = signal("".to_string());
    let (swap_mode, set_swap_mode) = signal(SwapMode::ExactIn);
    let swap_mode_memo = Memo::new(move |_| swap_mode.get());

    let validate_amount = |amount_str: &str, token_data: &TokenData| -> Option<u128> {
        if amount_str.is_empty() {
            return None;
        }

        let amount_decimal = amount_str.parse::<BigDecimal>().ok()?;

        if amount_decimal <= BigDecimal::from(0) {
            return None;
        }

        let decimals = token_data.token.metadata.decimals;
        let ten = BigDecimal::from(10);
        let mut multiplier = BigDecimal::from(1);
        for _ in 0..decimals {
            multiplier *= &ten;
        }
        let amount_raw_decimal = amount_decimal * multiplier;
        let amount_raw = amount_raw_decimal.to_u128()?;

        Some(amount_raw)
    };

    let validated_amount_entered = Memo::new(move |_| {
        let amount_str = amount_entered.get();
        let token_data = match swap_mode_memo.get() {
            SwapMode::ExactIn => token_in.get()?,
            SwapMode::ExactOut => token_out.get()?,
        };
        validate_amount(&amount_str, &token_data)
    });

    let get_routes_action = leptos::prelude::Action::new(|swap_request: &SwapRequest| {
        let swap_request = swap_request.clone();
        async move {
            let (oneshot_tx, oneshot_rx) = futures_channel::oneshot::channel();
            spawn_local(async move {
                let routes = get_routes(swap_request).await;
                oneshot_tx.send(routes).unwrap();
            });
            oneshot_rx.await.unwrap()
        }
    });

    let has_sufficient_balance = Memo::new(move |_| {
        let swap_mode = swap_mode_memo.get();

        if let Some(amount_raw) = validated_amount_entered.get() {
            match swap_mode {
                SwapMode::ExactIn => {
                    if let Some(token) = token_in.get() {
                        amount_raw <= token.balance
                    } else {
                        false
                    }
                }
                SwapMode::ExactOut => {
                    if let (Some(routes), Some(input_token)) =
                        (get_routes_action.value().get().flatten(), token_in.get())
                    {
                        if let Some(route) = routes.first() {
                            match route.estimated_amount {
                                Amount::AmountIn(estimated_input_needed) => {
                                    estimated_input_needed <= input_token.balance
                                }
                                _ => false, // Should not happen in ExactOut mode
                            }
                        } else {
                            false
                        }
                    } else {
                        true // No route yet
                    }
                }
            }
        } else {
            false
        }
    });

    let get_input_style = move |is_from_field: bool, is_loading: bool| -> String {
        let current_mode = swap_mode_memo.get();
        let is_editable = match (is_from_field, current_mode) {
            (true, SwapMode::ExactIn) => true,   // From field in ExactIn mode
            (false, SwapMode::ExactOut) => true, // To field in ExactOut mode
            _ => false,                          // All other combinations are read-only
        };

        if !is_editable && !has_sufficient_balance.get() && is_from_field && !is_loading {
            "border: 2px solid rgb(239 68 68);".to_string() // Insufficient balance
        } else if !is_editable {
            "opacity: 0.6; border: 2px solid rgba(255, 255, 255, 0.2);".to_string()
        } else if !amount_entered.get().is_empty() && validated_amount_entered.get().is_none() {
            "border: 2px solid rgb(239 68 68);".to_string() // Invalid format
        } else if !amount_entered.get().is_empty() && !has_sufficient_balance.get() && is_from_field
        {
            "border: 2px solid rgb(239 68 68);".to_string() // Insufficient balance
        } else if !amount_entered.get().is_empty() {
            "border: 2px solid rgb(34 197 94);".to_string() // Valid amount
        } else {
            "border: 2px solid rgba(255, 255, 255, 0.2);".to_string() // Default
        }
    };

    let create_swap_request = move |token_in: TokenData,
                                    token_out: TokenData,
                                    amount_raw: Balance,
                                    mode: SwapMode|
          -> Option<SwapRequest> {
        let current_account = accounts
            .get_untracked()
            .selected_account_id
            .and_then(|id| {
                accounts
                    .get_untracked()
                    .accounts
                    .into_iter()
                    .find(|a| a.account_id == id)
            })?;

        let token_in_id = match &token_in.token.account_id {
            Token::Near => TokenId::Near,
            Token::Nep141(account_id) => TokenId::Nep141(account_id.clone()),
        };

        let token_out_id = match &token_out.token.account_id {
            Token::Near => TokenId::Near,
            Token::Nep141(account_id) => TokenId::Nep141(account_id.clone()),
        };

        let amount = match mode {
            SwapMode::ExactIn => Amount::AmountIn(amount_raw),
            SwapMode::ExactOut => Amount::AmountOut(amount_raw),
        };

        Some(SwapRequest {
            token_in: token_in_id,
            token_out: token_out_id,
            amount,
            max_wait_ms: 5000,
            slippage: 0.01, // 1%
            dexes: None,
            trader_account_id: Some(current_account.account_id),
        })
    };

    Effect::new(move |_| {
        let current_mode = swap_mode_memo.get();
        let token_in_data = token_in.get();
        let token_out_data = token_out.get();
        validated_amount_entered.track();

        if let (Some(token_in), Some(token_out)) = (token_in_data, token_out_data) {
            if let Some(validated_amount) = validated_amount_entered.get() {
                if let Some(swap_request) =
                    create_swap_request(token_in, token_out, validated_amount, current_mode)
                {
                    get_routes_action.dispatch(swap_request);
                }
            }
        }
    });

    let handle_amount_change = move |value: String, mode: SwapMode| {
        set_amount_entered.set(value);
        set_swap_mode.set(mode);
    };

    let handle_reverse = move |_| {
        let current_token_in = token_in.get();
        let current_token_out = token_out.get();
        set_token_in.set(current_token_out);
        set_token_out.set(current_token_in);
        handle_amount_change(
            amount_entered.get(),
            match swap_mode_memo.get() {
                SwapMode::ExactIn => SwapMode::ExactOut,
                SwapMode::ExactOut => SwapMode::ExactIn,
            },
        );
    };

    // Helper to get estimated amount from route response
    let get_estimated_amount = move || -> Option<String> {
        let routes = get_routes_action.value().get()??;
        let route = routes.first()?;
        let current_mode = swap_mode_memo.get();

        match route.estimated_amount {
            Amount::AmountIn(amount) => {
                if let (Some(token_in), SwapMode::ExactOut) = (token_in.get(), current_mode) {
                    let amount_decimal = BigDecimal::from(amount);
                    let ten = BigDecimal::from(10);
                    let mut decimals_decimal = BigDecimal::from(1);
                    for _ in 0..token_in.token.metadata.decimals {
                        decimals_decimal *= &ten;
                    }
                    let formatted_amount = amount_decimal / decimals_decimal;
                    Some(formatted_amount.to_string())
                } else {
                    None
                }
            }
            Amount::AmountOut(amount) => {
                if let (Some(token_out), SwapMode::ExactIn) = (token_out.get(), current_mode) {
                    let amount_decimal = BigDecimal::from(amount);
                    let ten = BigDecimal::from(10);
                    let mut decimals_decimal = BigDecimal::from(1);
                    for _ in 0..token_out.token.metadata.decimals {
                        decimals_decimal *= &ten;
                    }
                    let formatted_amount = amount_decimal / decimals_decimal;
                    Some(formatted_amount.to_string())
                } else {
                    None
                }
            }
        }
    };

    view! {
        <div class="max-w-lg mx-auto h-full">
            <div class="flex items-center justify-center h-full">
                <div class="w-full">
                    <div class="bg-neutral-900 rounded-2xl p-4 space-y-4">
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
                                <TokenSelector
                                    selected_token=token_in
                                    on_select=move |token: TokenData| {
                                        set_token_in.set(Some(token));
                                        set_amount_entered.set("".to_string());
                                    }
                                    tokens=tokens
                                    loading_tokens=loading_tokens
                                    placeholder="Select token"
                                />

                                <div class="flex-1 relative">
                                    <div class="relative">
                                        <input
                                            type="text"
                                            class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                                            style=move || get_input_style(
                                                true,
                                                get_routes_action.pending().get(),
                                            )
                                            placeholder="0.0"
                                            prop:value=move || {
                                                match swap_mode_memo.get() {
                                                    SwapMode::ExactIn => amount_entered.get(),
                                                    SwapMode::ExactOut => {
                                                        if get_routes_action.pending().get() {
                                                            "".to_string()
                                                        } else {
                                                            get_estimated_amount().unwrap_or_default()
                                                        }
                                                    }
                                                }
                                            }
                                            on:input=move |ev| {
                                                let value = event_target_value(&ev);
                                                handle_amount_change(value, SwapMode::ExactIn);
                                            }
                                        />
                                        <button
                                            class="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200 no-mobile-ripple"
                                            on:click=move |_| {
                                                if let Some(token) = token_in.get() {
                                                    let balance_decimal = BigDecimal::from(token.balance);
                                                    let ten = BigDecimal::from(10);
                                                    let mut decimals_decimal = BigDecimal::from(1);
                                                    for _ in 0..token.token.metadata.decimals {
                                                        decimals_decimal *= &ten;
                                                    }
                                                    let max_amount_decimal = balance_decimal / decimals_decimal;
                                                    let gas_cost_decimal = match token.token.account_id {
                                                        Token::Near => {
                                                            BigDecimal::from_f64(0.0001).unwrap_or_default()
                                                        }
                                                        Token::Nep141(_) => {
                                                            BigDecimal::from_f64(0.001).unwrap_or_default()
                                                        }
                                                    };
                                                    let final_amount = (max_amount_decimal - gas_cost_decimal)
                                                        .max(BigDecimal::from(0));
                                                    let amount_str = final_amount.to_string();
                                                    handle_amount_change(amount_str, SwapMode::ExactIn);
                                                }
                                            }
                                        >
                                            "MAX"
                                        </button>
                                    </div>
                                    {move || {
                                        if let Some(token) = token_in.get() {
                                            let amount_to_use = match swap_mode_memo.get() {
                                                SwapMode::ExactIn => amount_entered.get(),
                                                SwapMode::ExactOut => {
                                                    get_estimated_amount().unwrap_or_default()
                                                }
                                            };
                                            if let Ok(amount_decimal) = amount_to_use
                                                .parse::<BigDecimal>()
                                            {
                                                let price_decimal = BigDecimal::from_f64(
                                                        token.token.price_usd_hardcoded,
                                                    )
                                                    .unwrap_or_default();
                                                let usd_value_decimal = amount_decimal * price_decimal;
                                                let usd_value = usd_value_decimal.to_f64().unwrap_or(0.0);
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
                        </div>

                        <div class="flex justify-center">
                            <button
                                class="bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-colors cursor-pointer"
                                on:click=handle_reverse
                            >
                                <Icon
                                    icon=icondata::LuArrowUpDown
                                    width="20"
                                    height="20"
                                    attr:class="text-white"
                                />
                            </button>
                        </div>

                        <div class="space-y-3 mb-8">
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
                                <TokenSelector
                                    selected_token=token_out
                                    on_select=move |token: TokenData| {
                                        set_token_out.set(Some(token));
                                        set_amount_entered.set("".to_string());
                                    }
                                    tokens=tokens
                                    loading_tokens=loading_tokens
                                    placeholder="Select token"
                                />

                                <div class="flex-1 relative">
                                    <input
                                        type="text"
                                        class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                                        style=move || get_input_style(
                                            false,
                                            get_routes_action.pending().get(),
                                        )
                                        placeholder="0.0"
                                        prop:value=move || {
                                            match swap_mode_memo.get() {
                                                SwapMode::ExactOut => amount_entered.get(),
                                                SwapMode::ExactIn => {
                                                    if get_routes_action.pending().get() {
                                                        "".to_string()
                                                    } else {
                                                        get_estimated_amount().unwrap_or_default()
                                                    }
                                                }
                                            }
                                        }
                                        on:input=move |ev| {
                                            let value = event_target_value(&ev);
                                            handle_amount_change(value, SwapMode::ExactOut);
                                        }
                                    />
                                    {move || {
                                        if let Some(token) = token_out.get() {
                                            let amount_to_use = match swap_mode_memo.get() {
                                                SwapMode::ExactOut => amount_entered.get(),
                                                SwapMode::ExactIn => {
                                                    get_estimated_amount().unwrap_or_default()
                                                }
                                            };
                                            if let Ok(amount_decimal) = amount_to_use
                                                .parse::<BigDecimal>()
                                            {
                                                let price_decimal = BigDecimal::from_f64(
                                                        token.token.price_usd_hardcoded,
                                                    )
                                                    .unwrap_or_default();
                                                let usd_value_decimal = amount_decimal * price_decimal;
                                                let usd_value = usd_value_decimal.to_f64().unwrap_or(0.0);
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
                        </div>

                        {move || {
                            if let Some(Some(routes)) = get_routes_action.value().get() {
                                if let Some(best_route) = routes.first() {
                                    view! {
                                        <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3 w-full">
                                            {match best_route.dex_id {
                                                DexId::Aidols => {
                                                    view! {
                                                        <img src="/aidols.svg" alt="Aidols" class="w-auto h-8" />
                                                    }
                                                        .into_any()
                                                }
                                                DexId::GraFun => {
                                                    view! {
                                                        <img src="/grafun.svg" alt="GraFun" class="w-auto h-8" />
                                                    }
                                                        .into_any()
                                                }
                                                DexId::NearIntents => {
                                                    view! {
                                                        <img
                                                            src="/near-intents.svg"
                                                            alt="Near Intents"
                                                            class="w-auto h-8"
                                                        />
                                                    }
                                                        .into_any()
                                                }
                                                DexId::Rhea => {
                                                    view! {
                                                        <img src="/rhea.svg" alt="Rhea" class="w-auto h-8" />
                                                    }
                                                        .into_any()
                                                }
                                                DexId::Veax => {
                                                    view! {
                                                        <img src="/veax.svg" alt="Veax" class="w-auto h-8" />
                                                    }
                                                        .into_any()
                                                }
                                                DexId::Jumpdefi => {
                                                    view! {
                                                        <img
                                                            src="/jumpdefi.svg"
                                                            alt="Jumpdefi"
                                                            class="w-auto h-8"
                                                        />
                                                    }
                                                        .into_any()
                                                }
                                                _ => {
                                                    view! {
                                                        <span class="text-white font-medium text-sm">
                                                            {format!("{:?}", best_route.dex_id)}
                                                        </span>
                                                    }
                                                        .into_any()
                                                }
                                            }}
                                            <span class="text-white font-medium text-sm">
                                                "Best Route"
                                            </span>
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

                        <button
                            class="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:from-neutral-600 disabled:to-neutral-700 text-white rounded-xl px-4 py-4 font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                            disabled=move || {
                                token_in.get().is_none() || token_out.get().is_none()
                                    || amount_entered.get().is_empty()
                                    || validated_amount_entered.get().is_none()
                                    || !has_sufficient_balance.get()
                                    || get_routes_action.value().get().is_none()
                            }
                        >
                            {move || {
                                if get_routes_action.pending().get() {
                                    view! {
                                        <div class="flex items-center justify-center gap-2">
                                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>"Loading..."</span>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    view! { <span>"Swap"</span> }.into_any()
                                }
                            }}
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
