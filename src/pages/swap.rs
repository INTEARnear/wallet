use std::{
    fmt::{self, Display},
    num::NonZeroU64,
    str::FromStr,
    time::Duration,
};

use bigdecimal::{num_bigint::Sign, BigDecimal, FromPrimitive, RoundingMode, Zero};
use chrono::{DateTime, TimeDelta, Utc};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::Icon;
use leptos_router::{
    hooks::{use_location, use_navigate},
    location::Location,
};
use near_min_api::{
    types::{
        near_crypto::PublicKey, AccountId, AccountIdRef, Action, Balance, CryptoHash, Finality,
        FunctionCallAction, NearGas, NearToken, U128,
    },
    utils::dec_format,
    QueryFinality, RpcClient,
};
use serde::{Deserialize, Serialize};

use crate::{
    contexts::{
        accounts_context::{Account, AccountsContext},
        config_context::ConfigContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        tokens_context::{Token, TokenContext, TokenData, TokenInfo, TokenScore},
        transaction_queue_context::{
            EnqueuedTransaction, OverlayMode, TransactionQueueContext, TransactionType,
        },
    },
    pages::settings::SLIPPAGE_PRESETS,
    utils::{
        balance_to_decimal, decimal_to_balance, fetch_token_info, format_token_amount,
        format_token_amount_no_hide, format_usd_value_no_hide,
    },
};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SwapMode {
    ExactIn,
    ExactOut,
}

#[derive(Debug, Clone)]
pub struct SwapResult {
    pub token_in: TokenInfo,
    pub token_out: TokenInfo,
    pub amount_in: Balance,
    pub amount_out: Balance,
}

#[derive(Debug, Clone)]
pub enum SwapModalState {
    None,
    Success(Box<SwapResult>),
    Error,
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
    let TokenContext { set_tokens, .. } = expect_context::<TokenContext>();

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
                                <div class="relative flex-shrink-0">
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
                                    {if matches!(token.token.reputation, TokenScore::Unknown) {
                                        view! {
                                            <div class="absolute -bottom-1 -right-1 bg-neutral-900 rounded-full p-0.5">
                                                <Icon
                                                    icon=icondata::LuAlertTriangle
                                                    width="12"
                                                    height="12"
                                                    attr:class="text-yellow-500"
                                                    attr:title="Warning: This token has unknown reputation. Exercise caution."
                                                />
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }}
                                </div>
                                <span class="text-white font-bold truncate">
                                    {token.token.metadata.symbol}
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
                <div on:click=|ev| ev.stop_propagation() class="md:w-md">
                    <div class="bg-neutral-900 rounded-2xl w-full max-h-[60vh] overflow-hidden flex flex-col">
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
                                                let balance_formatted = balance_to_decimal(
                                                    token_data.balance,
                                                    token_data.token.metadata.decimals,
                                                );
                                                let price_decimal = token_data
                                                    .token
                                                    .price_usd_hardcoded
                                                    .clone();
                                                let usd_value_decimal = balance_formatted * price_decimal;

                                                view! {
                                                    <button
                                                        class="w-full flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 transition-colors cursor-pointer"
                                                        on:click={
                                                            let token_clone = token_clone.clone();
                                                            move |_| {
                                                                set_tokens
                                                                    .update(|tokens| {
                                                                        if let Some(token) = tokens
                                                                            .iter_mut()
                                                                            .find(|t| {
                                                                                t.token.account_id == token_clone.token.account_id
                                                                            })
                                                                        {
                                                                            *token = token_clone.clone();
                                                                        } else {
                                                                            tokens.push(token_clone.clone());
                                                                        }
                                                                    });
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
                                                                <div class="flex items-center gap-1">
                                                                    <div class="text-white font-medium">
                                                                        {token_data.token.metadata.symbol.clone()}
                                                                    </div>
                                                                    {if matches!(
                                                                        token_data.token.reputation,
                                                                        TokenScore::Unknown
                                                                    ) {
                                                                        view! {
                                                                            <Icon
                                                                                icon=icondata::LuAlertTriangle
                                                                                width="16"
                                                                                height="16"
                                                                                attr:class="text-yellow-500 flex-shrink-0"
                                                                                attr:title="Warning: This token has unknown reputation. Exercise caution."
                                                                            />
                                                                        }
                                                                            .into_any()
                                                                    } else {
                                                                        ().into_any()
                                                                    }}
                                                                </div>
                                                                <div class="text-gray-400 text-sm">
                                                                    {token_data.token.metadata.name.clone()}
                                                                </div>
                                                                {match &token_data.token.account_id {
                                                                    Token::Near => ().into_any(),
                                                                    Token::Nep141(account_id) => {
                                                                        view! {
                                                                            <div class="text-gray-500 text-xs mt-1 font-mono wrap-anywhere pr-2">
                                                                                {account_id.to_string()}
                                                                            </div>
                                                                        }
                                                                            .into_any()
                                                                    }
                                                                }}
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
                                                                {format_usd_value_no_hide(usd_value_decimal)}
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

                                                            view! {
                                                                <button
                                                                    class="w-full flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 transition-colors cursor-pointer"
                                                                    on:click={
                                                                        let token_clone = token_clone.clone();
                                                                        move |_| {
                                                                            set_tokens
                                                                                .update(|tokens| {
                                                                                    if let Some(token) = tokens
                                                                                        .iter_mut()
                                                                                        .find(|t| {
                                                                                            t.token.account_id == token_clone.token.account_id
                                                                                        })
                                                                                    {
                                                                                        *token = token_clone.clone();
                                                                                    } else {
                                                                                        tokens.push(token_clone.clone());
                                                                                    }
                                                                                });
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
                                                                            <div class="flex items-center gap-1">
                                                                                <div class="text-white font-medium">
                                                                                    {token_data.token.metadata.symbol.clone()}
                                                                                </div>
                                                                                {if matches!(
                                                                                    token_data.token.reputation,
                                                                                    TokenScore::Unknown
                                                                                ) {
                                                                                    view! {
                                                                                        <Icon
                                                                                            icon=icondata::LuAlertTriangle
                                                                                            width="16"
                                                                                            height="16"
                                                                                            attr:class="text-yellow-500 flex-shrink-0"
                                                                                            attr:title="Warning: This token has unknown reputation. Exercise caution."
                                                                                        />
                                                                                    }
                                                                                        .into_any()
                                                                                } else {
                                                                                    ().into_any()
                                                                                }}
                                                                            </div>
                                                                            <div class="text-gray-400 text-sm">
                                                                                {token_data.token.metadata.name.clone()}
                                                                            </div>
                                                                            {match &token_data.token.account_id {
                                                                                Token::Near => ().into_any(),
                                                                                Token::Nep141(account_id) => {
                                                                                    view! {
                                                                                        <div class="text-gray-500 text-xs mt-1 font-mono wrap-anywhere pr-2">
                                                                                            {account_id.to_string()}
                                                                                        </div>
                                                                                    }
                                                                                        .into_any()
                                                                                }
                                                                            }}
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-right">
                                                                        {move || {
                                                                            if is_owned {
                                                                                let balance_formatted = balance_to_decimal(
                                                                                    balance,
                                                                                    token_data.token.metadata.decimals,
                                                                                );
                                                                                let price_decimal = token_data
                                                                                    .token
                                                                                    .price_usd_hardcoded
                                                                                    .clone();
                                                                                let usd_value_decimal = balance_formatted * price_decimal;

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
                                                                                            {format_usd_value_no_hide(usd_value_decimal)}
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

/// Round amount down to either 6 significant digits or 6 decimals, whichever is longest
fn round_precision_or_significant(amount: BigDecimal) -> String {
    if amount.is_zero() {
        return "0".to_string();
    }

    let six_sig_digits =
        amount.with_precision_round(NonZeroU64::new(6).unwrap(), RoundingMode::Down);

    let six_decimals = amount.with_scale_round(6, RoundingMode::Down);

    let sig_str = six_sig_digits.to_string();
    let dec_str = six_decimals.to_string();

    let trim_trailing =
        |s: &str| -> String { s.trim_end_matches('0').trim_end_matches('.').to_string() };

    let sig_str_trimmed = trim_trailing(&sig_str);
    let dec_str_trimmed = trim_trailing(&dec_str);

    let count_digits = |s: &str| -> usize { s.chars().filter(|c| c.is_ascii_digit()).count() };

    let sig_count = count_digits(&sig_str_trimmed);
    let dec_count = count_digits(&dec_str_trimmed);

    if sig_count > dec_count {
        trim_trailing(&six_sig_digits.to_string())
    } else {
        trim_trailing(&six_decimals.to_string())
    }
}

#[component]
pub fn Swap() -> impl IntoView {
    let NetworkContext { network } = expect_context::<NetworkContext>();
    let navigate = use_navigate();

    Effect::new(move |_| {
        if network.get() == Network::Testnet {
            navigate("/", Default::default());
        }
    });

    let TokenContext {
        tokens,
        loading_tokens,
        set_tokens,
    } = expect_context::<TokenContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let Location { query, .. } = use_location();

    let (token_in, set_token_in) = signal::<Option<TokenData>>(None);
    let (token_out, set_token_out) = signal::<Option<TokenData>>(None);

    let (show_slippage_settings, set_show_slippage_settings) = signal(false);
    let (custom_slippage_input, set_custom_slippage_input) =
        signal(match config.get_untracked().slippage {
            Slippage::Auto { .. } => "".to_string(),
            Slippage::Fixed { slippage } => slippage.to_string(),
        });

    let (swap_modal_state, set_swap_modal_state) = signal(SwapModalState::None);
    let (show_advanced_options, set_show_advanced_options) = signal(false);

    // DEX selection state - all enabled by default
    let (selected_dexes, set_selected_dexes) = signal(vec![
        DexId::Rhea,
        DexId::NearIntents,
        DexId::Veax,
        DexId::Aidols,
        DexId::GraFun,
        DexId::Jumpdefi,
        DexId::Wrap,
        DexId::RheaDcl,
    ]);

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
            if token_in.get_untracked().is_none() {
                let default_token_id = Token::Near;

                let initial_token_in: Token = if let Some(from) = query.get().get("from") {
                    from.parse().unwrap_or(default_token_id)
                } else {
                    default_token_id
                };

                let owned_token = tokens_list
                    .iter()
                    .find(|t| t.token.account_id == initial_token_in);

                if let Some(token) = owned_token {
                    // User owns the token, use it
                    set_token_in.set(Some(token.clone()));
                } else {
                    // User doesn't own the token, fetch from API
                    let account_clone = account.clone();
                    let initial_token_in = match initial_token_in {
                        Token::Near => unreachable!(), // user always owns NEAR
                        Token::Nep141(token_id) => token_id,
                    };
                    spawn_local(async move {
                        match fetch_token_info(initial_token_in.clone(), account_clone.network)
                            .await
                        {
                            Some(token_info) => {
                                let token_data = TokenData {
                                    balance: 0,
                                    token: token_info,
                                };
                                set_tokens.update(|tokens| {
                                    if let Some(token) = tokens.iter_mut().find(|t| {
                                        t.token.account_id
                                            == Token::Nep141(initial_token_in.clone())
                                    }) {
                                        *token = token_data.clone();
                                    } else {
                                        tokens.push(token_data.clone());
                                    }
                                });
                                set_token_in.set(Some(token_data));
                            }
                            None => {
                                log::warn!("Failed to fetch default output token");
                            }
                        }
                    });
                }
            }

            // Set default output token (USDC)
            if token_out.get_untracked().is_none() {
                let default_token_id = match account.network {
                    Network::Mainnet => {
                        "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1"
                    }
                    Network::Testnet => "usdc.fakes.testnet",
                }
                .parse()
                .unwrap();

                let initial_token_out: Token = if let Some(to) = query.get().get("to") {
                    to.parse().unwrap_or(default_token_id)
                } else {
                    default_token_id
                };

                let owned_token = tokens_list
                    .iter()
                    .find(|t| t.token.account_id == initial_token_out);

                if let Some(token) = owned_token {
                    // User owns the token, use it
                    set_token_out.set(Some(token.clone()));
                } else {
                    // User doesn't own the token, fetch from API
                    let account_clone = account.clone();
                    let initial_token_out = match initial_token_out {
                        Token::Near => unreachable!(), // user always owns NEAR
                        Token::Nep141(token_id) => token_id,
                    };
                    spawn_local(async move {
                        match fetch_token_info(initial_token_out.clone(), account_clone.network)
                            .await
                        {
                            Some(token_info) => {
                                let token_data = TokenData {
                                    balance: 0,
                                    token: token_info,
                                };
                                set_tokens.update(|tokens| {
                                    if let Some(token) = tokens.iter_mut().find(|t| {
                                        t.token.account_id
                                            == Token::Nep141(initial_token_out.clone())
                                    }) {
                                        *token = token_data.clone();
                                    } else {
                                        tokens.push(token_data.clone());
                                    }
                                });
                                set_token_out.set(Some(token_data));
                            }
                            None => {
                                log::warn!("Failed to fetch default output token");
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
                if updated_token.balance != current_token_in.balance
                    || updated_token.token.price_usd_hardcoded
                        != current_token_in.token.price_usd_hardcoded
                {
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

    let validated_amount_entered = Memo::new(move |_| {
        let amount_str = amount_entered.get();
        let token_data = match swap_mode_memo.get() {
            SwapMode::ExactIn => token_in.get()?,
            SwapMode::ExactOut => token_out.get()?,
        };

        if amount_str.is_empty() {
            return None;
        }

        let amount_decimal = amount_str.parse::<BigDecimal>().ok()?;

        if amount_decimal <= BigDecimal::from(0) {
            return None;
        }

        let decimals = token_data.token.metadata.decimals;
        let amount_raw = decimal_to_balance(amount_decimal, decimals);

        Some(amount_raw)
    });

    let (_routes_action_handle, set_routes_action_handle) =
        signal::<Option<ActionAbortHandle>>(None);
    let get_routes_action =
        leptos::prelude::Action::new(move |(swap_request, wait_mode): &(SwapRequest, WaitMode)| {
            let swap_request = swap_request.clone();
            // This should always run before set_routes_action_handle.set(get_routes_action.dispatch(...)),
            // so we have time to abort the previous request
            if let Some(handle) = set_routes_action_handle.write().take() {
                handle.abort();
            }
            let wait_mode = *wait_mode;
            async move {
                let (oneshot_tx, oneshot_rx) = futures_channel::oneshot::channel();
                spawn_local(async move {
                    let routes = get_routes(swap_request, wait_mode).await;
                    let _ = oneshot_tx.send(routes);
                });
                oneshot_rx.await.unwrap()
            }
        });

    Effect::new(move || {
        validated_amount_entered.track();
        get_routes_action.clear();
    });

    Effect::new(move || {
        if get_routes_action.value().get().is_some()
            && validated_amount_entered.get_untracked().is_none()
        {
            get_routes_action.clear();
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
                    if let (Some(Ok(routes)), Some(input_token)) =
                        (get_routes_action.value().get(), token_in.get())
                    {
                        if let Some(route) = routes.routes.first() {
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

    let get_input_style = move |is_from_field: bool| -> String {
        let current_mode = swap_mode_memo.get();
        let is_editable = match (is_from_field, current_mode) {
            (true, SwapMode::ExactIn) => true,   // From field in ExactIn mode
            (false, SwapMode::ExactOut) => true, // To field in ExactOut mode
            _ => false,                          // All other combinations are read-only
        };

        let no_routes_found = match get_routes_action.value().get() {
            Some(Ok(routes)) => routes.routes.is_empty(),
            _ => false,
        };

        let is_loading =
            get_routes_action.pending().get() && get_routes_action.value().get().is_none();

        if no_routes_found {
            "border: 2px solid rgb(234 179 8);".to_string() // No route found
        } else if validated_amount_entered.get().is_none() {
            "border: 2px solid rgba(255, 255, 255, 0.2);".to_string() // Default
        } else if !is_editable && !has_sufficient_balance.get() && is_from_field && !is_loading {
            "border: 2px solid rgb(239 68 68);".to_string() // Insufficient balance
        } else if !is_editable && is_from_field {
            "border: 2px solid rgba(255, 255, 255, 0.2);".to_string() // Estimated input amount
        } else if !is_editable {
            "opacity: 0.6; border: 2px solid rgba(255, 255, 255, 0.2);".to_string()
        // Estimated output amount
        } else if validated_amount_entered.get().is_some()
            && !has_sufficient_balance.get()
            && is_from_field
        {
            "border: 2px solid rgb(239 68 68);".to_string() // Invalid format or insufficient balance
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
            max_wait_ms: 0, // will be set by WaitMode
            slippage: config.get().slippage,
            dexes: Some(selected_dexes.get()), // Use selected DEXes
            trader_account_id: Some(current_account.account_id),
            signing_public_key: Some(current_account.secret_key.public_key()),
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
                    // Request 1: Fast, skip intents. When skipping intents,
                    // usually the best quote is found in less than 1.5 seconds.
                    get_routes_action.dispatch((
                        swap_request.clone(),
                        WaitMode::Fast {
                            skip_intents: true,
                            duration: Duration::from_millis(1500),
                        },
                    ));
                    // Request 2: Fast, include intents. When including intents,
                    // usually takes nearly 1.5 seconds.
                    get_routes_action.dispatch((
                        swap_request.clone(),
                        WaitMode::Fast {
                            skip_intents: false,
                            duration: Duration::from_millis(1500),
                        },
                    ));
                    // Request 3: Full, include intents. Takes nearly 3 seconds.
                    set_routes_action_handle.set(Some(get_routes_action.dispatch((
                        swap_request,
                        WaitMode::Full {
                            duration: Duration::from_millis(3000),
                        },
                    ))));
                }
            }
        }
    });

    let handle_amount_change = move |value: String, mode: SwapMode| {
        set_amount_entered.set(value);
        set_swap_mode.set(mode);
    };

    let handle_reverse = move |_| {
        get_routes_action.clear();
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

    let get_estimated_amount = move || -> Option<String> {
        let routes = get_routes_action.value().get()?.ok()?;
        let route = routes.routes.first()?;
        let current_mode = swap_mode_memo.get();

        match route.estimated_amount {
            Amount::AmountIn(amount) => {
                if let (Some(token_in), SwapMode::ExactOut) = (token_in.get(), current_mode) {
                    let formatted_amount =
                        balance_to_decimal(amount, token_in.token.metadata.decimals);
                    let formatted_amount = round_precision_or_significant(formatted_amount);
                    Some(formatted_amount)
                } else {
                    None
                }
            }
            Amount::AmountOut(amount) => {
                if let (Some(token_out), SwapMode::ExactIn) = (token_out.get(), current_mode) {
                    let formatted_amount =
                        balance_to_decimal(amount, token_out.token.metadata.decimals);
                    let formatted_amount = round_precision_or_significant(formatted_amount);
                    Some(formatted_amount)
                } else {
                    None
                }
            }
        }
    };

    let (last_dispatched_at, set_last_dispatched_at) = signal::<Option<DateTime<Utc>>>(None);
    Effect::new(move || {
        let handle = set_interval_with_handle(
            move || {
                if let Some(Ok(_)) = get_routes_action.value().get_untracked() {
                    if get_routes_action.pending().get_untracked() {
                        return;
                    }
                    let Some(token_in) = token_in.get_untracked() else {
                        return;
                    };
                    let Some(token_out) = token_out.get_untracked() else {
                        return;
                    };
                    let Some(validated_amount) = validated_amount_entered.get_untracked() else {
                        return;
                    };
                    if let Some(last_dispatched_at) = last_dispatched_at.get_untracked() {
                        if Utc::now() - last_dispatched_at
                            < TimeDelta::from_std(Duration::from_secs(5)).unwrap()
                        {
                            return;
                        }
                    }
                    if let Some(swap_request) = create_swap_request(
                        token_in,
                        token_out,
                        validated_amount,
                        swap_mode_memo.get_untracked(),
                    ) {
                        set_last_dispatched_at.set(Some(Utc::now()));
                        set_routes_action_handle.set(Some(get_routes_action.dispatch((
                            swap_request,
                            WaitMode::Full {
                                duration: Duration::from_millis(3000),
                            },
                        ))));
                    }
                }
            },
            Duration::from_millis(100),
        )
        .unwrap();

        on_cleanup(move || {
            handle.clear();
        });
    });

    let TransactionQueueContext {
        add_transaction,
        overlay_mode,
        ..
    } = expect_context::<TransactionQueueContext>();
    let RpcContext { client: rpc_client } = expect_context::<RpcContext>();

    view! {
        <div class="max-w-lg mx-auto min-h-full flex flex-col">
            <div class="flex items-center justify-center flex-1">
                <div class="w-full mt-8">
                    <div class="bg-neutral-900 rounded-2xl p-4 space-y-4 relative">
                        <div class="absolute -top-4 right-4">
                            <button
                                class="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg px-2 py-1 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                                on:click=move |_| {
                                    set_show_slippage_settings.set(!show_slippage_settings.get())
                                }
                            >
                                <Icon icon=icondata::LuSettings width="16" height="16" />
                                <span>{move || format!("{}", config.get().slippage)}</span>
                            </button>

                            <Show when=move || show_slippage_settings.get()>
                                <>
                                    <div
                                        class="fixed inset-0 z-[5]"
                                        on:click=move |_| set_show_slippage_settings.set(false)
                                    ></div>
                                    <div
                                        class="absolute top-8 right-0 bg-neutral-800 rounded-xl p-3 shadow-lg border border-neutral-700 z-10 w-48"
                                        on:click=|ev| ev.stop_propagation()
                                    >
                                        <div class="text-white text-sm font-medium mb-3">
                                            "Slippage Tolerance"
                                        </div>
                                        <div class="mb-3">
                                            <button
                                                class=move || {
                                                    format!(
                                                        "w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer {}",
                                                        if matches!(config.get().slippage, Slippage::Auto { .. }) {
                                                            "bg-blue-500 text-white"
                                                        } else {
                                                            "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
                                                        },
                                                    )
                                                }
                                                on:click=move |_| {
                                                    set_config
                                                        .update(|config| {
                                                            config.slippage = Slippage::default();
                                                        });
                                                    set_custom_slippage_input.set("".to_string());
                                                }
                                            >
                                                "Auto"
                                            </button>
                                        </div>
                                        <div class="grid grid-cols-2 gap-2 mb-3">
                                            {SLIPPAGE_PRESETS
                                                .into_iter()
                                                .map(|percentage| {
                                                    let is_selected = move || {
                                                        if let Slippage::Fixed { slippage } = config.get().slippage
                                                        {
                                                            slippage
                                                                == BigDecimal::from_f64(percentage).unwrap()
                                                                    / BigDecimal::from(100)
                                                        } else {
                                                            false
                                                        }
                                                    };
                                                    view! {
                                                        <button
                                                            class=move || {
                                                                format!(
                                                                    "px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer {}",
                                                                    if is_selected() {
                                                                        "bg-blue-500 text-white"
                                                                    } else {
                                                                        "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
                                                                    },
                                                                )
                                                            }
                                                            on:click=move |_| {
                                                                set_config
                                                                    .update(|config| {
                                                                        config.slippage = Slippage::Fixed {
                                                                            slippage: BigDecimal::from_f64(percentage).unwrap()
                                                                                / BigDecimal::from(100),
                                                                        };
                                                                    });
                                                                set_custom_slippage_input.set("".to_string());
                                                            }
                                                        >
                                                            {format!("{}%", percentage)}
                                                        </button>
                                                    }
                                                })
                                                .collect_view()}
                                        </div>
                                        <div class="space-y-2">
                                            <div class="text-gray-400 text-xs">"Custom"</div>
                                            <div class="flex gap-2">
                                                <input
                                                    type="text"
                                                    class="flex-1 bg-neutral-700 text-white rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                                                    placeholder="0-100"
                                                    prop:value=custom_slippage_input
                                                    on:input=move |ev| {
                                                        let value = event_target_value(&ev);
                                                        set_custom_slippage_input.set(value.clone());
                                                        if let Ok(percentage) = value.parse::<BigDecimal>() {
                                                            let percentage = percentage
                                                                .clamp(
                                                                    BigDecimal::from_f64(0.01).unwrap(),
                                                                    BigDecimal::from_f64(100.0).unwrap(),
                                                                );
                                                            set_config
                                                                .update(|config| {
                                                                    config.slippage = Slippage::Fixed {
                                                                        slippage: percentage / BigDecimal::from(100),
                                                                    };
                                                                });
                                                        }
                                                    }
                                                />
                                                <span class="text-gray-400 text-sm self-center">"%"</span>
                                            </div>
                                        </div>
                                        <div class="mt-3 text-xs text-gray-400">
                                            "If the price moves unfavorably by more than this percentage while you're clicking the button, the transaction will be cancelled."
                                        </div>
                                    </div>
                                </>
                            </Show>
                        </div>

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
                                        get_routes_action.clear();
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
                                            style=move || get_input_style(true)
                                            prop:placeholder=move || {
                                                let no_input = validated_amount_entered.get().is_none();
                                                let no_routes_found = match get_routes_action.value().get()
                                                {
                                                    Some(Ok(routes)) => routes.routes.is_empty(),
                                                    _ => false,
                                                };
                                                if no_routes_found {
                                                    return "-";
                                                }
                                                match swap_mode_memo.get() {
                                                    SwapMode::ExactIn => "0.0",
                                                    SwapMode::ExactOut if no_input => "0.0",
                                                    SwapMode::ExactOut => "Loading...",
                                                }
                                            }
                                            prop:value=move || {
                                                match swap_mode_memo.get() {
                                                    SwapMode::ExactIn => amount_entered.get(),
                                                    SwapMode::ExactOut => {
                                                        get_estimated_amount().unwrap_or_default()
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
                                                    let max_amount_decimal = balance_to_decimal(
                                                        token.balance,
                                                        token.token.metadata.decimals,
                                                    );
                                                    let gas_cost_decimal = match token.token.account_id {
                                                        Token::Near => BigDecimal::from_f64(0.05).unwrap(),
                                                        Token::Nep141(_) => BigDecimal::from_u32(0).unwrap(),
                                                    };
                                                    let final_amount = (max_amount_decimal - gas_cost_decimal)
                                                        .max(BigDecimal::from(0));
                                                    let amount_str = round_precision_or_significant(
                                                        final_amount,
                                                    );
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
                                                let price_decimal = token.token.price_usd_hardcoded.clone();
                                                let usd_value_decimal = amount_decimal * price_decimal;

                                                view! {
                                                    <div class="absolute right-3 -bottom-5 text-xs text-gray-400">
                                                        {format_usd_value_no_hide(usd_value_decimal)}
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
                                        get_routes_action.clear();
                                    }
                                    tokens=tokens
                                    loading_tokens=loading_tokens
                                    placeholder="Select token"
                                />

                                <div class="flex-1 relative">
                                    <input
                                        type="text"
                                        class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                                        style=move || get_input_style(false)
                                        prop:placeholder=move || {
                                            let no_input = validated_amount_entered.get().is_none();
                                            let no_routes_found = match get_routes_action.value().get()
                                            {
                                                Some(Ok(routes)) => routes.routes.is_empty(),
                                                _ => false,
                                            };
                                            if no_routes_found {
                                                return "-";
                                            }
                                            match swap_mode_memo.get() {
                                                SwapMode::ExactIn if no_input => "0.0",
                                                SwapMode::ExactIn => "Loading...",
                                                SwapMode::ExactOut => "0.0",
                                            }
                                        }
                                        prop:value=move || {
                                            match swap_mode_memo.get() {
                                                SwapMode::ExactOut => amount_entered.get(),
                                                SwapMode::ExactIn => {
                                                    get_estimated_amount().unwrap_or_default()
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
                                                let price_decimal = token.token.price_usd_hardcoded.clone();
                                                let usd_value_decimal = amount_decimal * price_decimal;

                                                view! {
                                                    <div class="absolute right-3 -bottom-5 text-xs text-gray-400">
                                                        {format_usd_value_no_hide(usd_value_decimal)}
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
                            let has_amount = validated_amount_entered.get().is_some();
                            let is_loading = get_routes_action.pending().get()
                                && get_routes_action.value().get().is_none();
                            if !has_amount {
                                view! {
                                    <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-start gap-3 w-full min-h-[56px]">
                                        <span class="text-gray-400 font-medium text-sm">
                                            "Enter amount"
                                        </span>
                                    </div>
                                }
                                    .into_any()
                            } else if is_loading {
                                view! {
                                    <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                        <span class="text-white font-medium text-sm">
                                            "Fetching best route"
                                        </span>
                                    </div>
                                }
                                    .into_any()
                            } else if let Some(Ok(routes)) = get_routes_action.value().get() {
                                if let Some(best_route) = routes.routes.first() {
                                    view! {
                                        <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3 w-full min-h-[56px]">
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
                                                        <img src="/veax.svg" alt="Veax" class="w-auto h-5" />
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
                                                DexId::RheaDcl => {
                                                    view! {
                                                        <img src="/rhea.svg" alt="Rhea" class="w-auto h-8" />
                                                    }
                                                        .into_any()
                                                }
                                                DexId::Wrap => {
                                                    view! {
                                                        <span class="text-white font-medium text-sm">
                                                            "Wrap Directly"
                                                        </span>
                                                    }
                                                        .into_any()
                                                }
                                            }} <div class="flex items-center gap-2">
                                                <span class="text-white font-medium text-sm">
                                                    "Best Route"
                                                </span>
                                                {if !best_route.has_slippage {
                                                    view! {
                                                        <span class="hidden md:inline bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                                                            "No Slippage"
                                                        </span>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }}
                                            </div>
                                        </div>
                                    }
                                        .into_any()
                                } else if matches!(routes.wait_mode, WaitMode::Fast { .. }) {
                                    view! {
                                        <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                            <span class="text-white font-medium text-sm">
                                                "Fetching more routes"
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                            <div class="text-center">
                                                <div class="text-red-400 text-sm font-medium mb-1">
                                                    "No routes found"
                                                </div>
                                                <div class="text-red-300 text-xs">
                                                    {move || {
                                                        let base_message = "Try adjusting the amount or selecting different tokens";
                                                        match swap_mode_memo.get() {
                                                            SwapMode::ExactOut => {
                                                                format!(
                                                                    "{}, or specifying the input amount instead of output amount",
                                                                    base_message,
                                                                )
                                                            }
                                                            SwapMode::ExactIn => base_message.to_string(),
                                                        }
                                                    }}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                        .into_any()
                                }
                            } else {
                                // Fallback case
                                view! {
                                    <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                        <span class="text-gray-400 font-medium text-sm">
                                            "Enter amount"
                                        </span>
                                    </div>
                                }
                                    .into_any()
                            }
                        }}

                        <button
                            class="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:from-neutral-600 disabled:to-neutral-700 text-white rounded-xl px-4 py-4 font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                            disabled=move || {
                                token_in.get().is_none() || token_out.get().is_none()
                                    || amount_entered.get().is_empty()
                                    || validated_amount_entered.get().is_none()
                                    || !has_sufficient_balance.get()
                                    || match get_routes_action.value().get() {
                                        Some(Ok(routes)) => routes.routes.is_empty(),
                                        _ => true,
                                    }
                            }
                            on:click=move |_| {
                                if let Some(Ok(routes)) = get_routes_action.value().write().take() {
                                    if let Some(best_route) = routes.routes.into_iter().next() {
                                        let Some(selected_account_id) = accounts
                                            .get_untracked()
                                            .selected_account_id else {
                                            return;
                                        };
                                        let Some(selected_account) = accounts
                                            .get_untracked()
                                            .accounts
                                            .into_iter()
                                            .find(|account| account.account_id == selected_account_id)
                                        else {
                                            return;
                                        };
                                        log::info!("Swapping with route: {best_route:?}");
                                        let Some(validated_amount_entered) = validated_amount_entered
                                            .get() else {
                                            log::error!(
                                                "No validated amount entered, yet clicked swap"
                                            );
                                            return;
                                        };
                                        let Some(token_in) = token_in.get() else {
                                            log::error!("No token in selected, yet clicked swap");
                                            return;
                                        };
                                        let Some(token_out) = token_out.get() else {
                                            log::error!("No token out selected, yet clicked swap");
                                            return;
                                        };
                                        spawn_local(
                                            execute_route(
                                                validated_amount_entered,
                                                swap_mode_memo.get(),
                                                token_in.token,
                                                token_out.token,
                                                best_route,
                                                selected_account,
                                                add_transaction,
                                                overlay_mode,
                                                rpc_client.get_untracked(),
                                                set_swap_modal_state,
                                            ),
                                        );
                                    }
                                }
                                set_swap_mode.set(SwapMode::ExactIn);
                                set_amount_entered.set("".to_string());
                            }
                        >
                            {move || {
                                if (get_routes_action.pending().get()
                                    && get_routes_action.value().get().is_none()
                                    && validated_amount_entered.get().is_some())
                                    || get_routes_action
                                        .value()
                                        .get()
                                        .and_then(|routes| routes.ok())
                                        .map(|routes| {
                                            routes.routes.is_empty()
                                                && matches!(routes.wait_mode, WaitMode::Fast { .. })
                                        })
                                        .unwrap_or(false)
                                {
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

                        // Advanced Options Section
                        <div>
                            <button
                                class="w-full flex items-center justify-end gap-1 text-left cursor-pointer transition-colors"
                                on:click=move |_| {
                                    set_show_advanced_options.set(!show_advanced_options.get())
                                }
                            >
                                <span class="text-gray-400 text-sm hover:text-gray-300">
                                    "Advanced Options"
                                </span>
                                <Icon
                                    icon=icondata::LuChevronDown
                                    width="16"
                                    height="16"
                                    attr:class="text-gray-400 transition-transform"
                                    attr:style=move || {
                                        format!(
                                            "transform: rotate({}deg);",
                                            if show_advanced_options.get() { 180 } else { 0 },
                                        )
                                    }
                                />
                            </button>

                            <Show when=move || show_advanced_options.get()>
                                <div class="bg-neutral-800 rounded-lg p-4 space-y-4 mt-2">
                                    // Minimum received / Maximum spent section
                                    {move || {
                                        if let Some(Ok(routes)) = get_routes_action.value().get() {
                                            if let Some(best_route) = routes.routes.first() {
                                                let current_mode = swap_mode_memo.get();
                                                match best_route.worst_case_amount {
                                                    Amount::AmountIn(amount) => {
                                                        if let (Some(token_in), SwapMode::ExactOut) = (
                                                            token_in.get(),
                                                            current_mode,
                                                        ) {
                                                            let formatted_amount = balance_to_decimal(
                                                                amount,
                                                                token_in.token.metadata.decimals,
                                                            );
                                                            let formatted_amount = round_precision_or_significant(
                                                                formatted_amount,
                                                            );
                                                            view! {
                                                                <div>
                                                                    <div class="text-gray-400 text-xs mb-1">
                                                                        "Maximum Spent"
                                                                    </div>
                                                                    <div class="text-white text-sm">
                                                                        {format!(
                                                                            "{} {}",
                                                                            formatted_amount,
                                                                            token_in.token.metadata.symbol,
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    }
                                                    Amount::AmountOut(amount) => {
                                                        if let (Some(token_out), SwapMode::ExactIn) = (
                                                            token_out.get(),
                                                            current_mode,
                                                        ) {
                                                            let formatted_amount = balance_to_decimal(
                                                                amount,
                                                                token_out.token.metadata.decimals,
                                                            );
                                                            let formatted_amount = round_precision_or_significant(
                                                                formatted_amount,
                                                            );
                                                            view! {
                                                                <div>
                                                                    <div class="text-gray-400 text-xs mb-1">
                                                                        "Minimum Received"
                                                                    </div>
                                                                    <div class="text-white text-sm">
                                                                        {format!(
                                                                            "{} {}",
                                                                            formatted_amount,
                                                                            token_out.token.metadata.symbol,
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    }
                                                }
                                            } else {
                                                view! {
                                                    <div>
                                                        <div class="text-gray-400 text-xs mb-1">
                                                            "Minimum Received"
                                                        </div>
                                                        <div class="text-white text-sm">
                                                            "-"
                                                        </div>
                                                    </div>
                                                }.into_any()
                                            }
                                        } else {
                                            view! {
                                                <div>
                                                    <div class="text-gray-400 text-xs mb-1">
                                                        "Minimum Received"
                                                    </div>
                                                    <div class="text-white text-sm">
                                                        "-"
                                                    </div>
                                                </div>
                                            }.into_any()
                                        }
                                    }} // DEX Selection
                                    <div>
                                        <div class="text-gray-400 text-sm mb-2">"Exchanges"</div>
                                        <div class="grid grid-cols-2 gap-2">
                                            {move || {
                                                let all_dexes = vec![
                                                    DexId::Rhea,
                                                    DexId::RheaDcl,
                                                    DexId::NearIntents,
                                                    DexId::Veax,
                                                    DexId::Aidols,
                                                    DexId::GraFun,
                                                    // DexId::Jumpdefi,
                                                    DexId::Wrap,
                                                ];
                                                all_dexes
                                                    .into_iter()
                                                    .map(|dex| {
                                                        let is_selected = move || {
                                                            selected_dexes.get().contains(&dex)
                                                        };

                                                        view! {
                                                            <button
                                                                class=move || {
                                                                    format!(
                                                                        "px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer {}",
                                                                        if is_selected() {
                                                                            "bg-blue-500 text-white"
                                                                        } else {
                                                                            "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
                                                                        },
                                                                    )
                                                                }
                                                                on:click=move |_| {
                                                                    set_selected_dexes
                                                                        .update(|dexes| {
                                                                            if dexes.contains(&dex) {
                                                                                dexes.retain(|d| *d != dex);
                                                                            } else {
                                                                                dexes.push(dex);
                                                                            }
                                                                        });
                                                                    get_routes_action.clear();
                                                                }
                                                            >
                                                                {format!("{}", dex)}
                                                            </button>
                                                        }
                                                    })
                                                    .collect_view()
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </Show>
                        </div>

                        {move || {
                            let input_usd = if let Some(token_in_data) = token_in.get() {
                                let amount_to_use = match swap_mode_memo.get() {
                                    SwapMode::ExactIn => amount_entered.get(),
                                    SwapMode::ExactOut => get_estimated_amount().unwrap_or_default(),
                                };
                                if let Ok(amount_decimal) = amount_to_use.parse::<BigDecimal>() {
                                    Some(
                                        amount_decimal
                                            * token_in_data.token.price_usd_hardcoded.clone(),
                                    )
                                } else {
                                    None
                                }
                            } else {
                                None
                            };
                            let output_usd = if let Some(token_out_data) = token_out.get() {
                                let amount_to_use = match swap_mode_memo.get() {
                                    SwapMode::ExactOut => amount_entered.get(),
                                    SwapMode::ExactIn => get_estimated_amount().unwrap_or_default(),
                                };
                                if let Ok(amount_decimal) = amount_to_use.parse::<BigDecimal>() {
                                    Some(
                                        amount_decimal
                                            * token_out_data.token.price_usd_hardcoded.clone(),
                                    )
                                } else {
                                    None
                                }
                            } else {
                                None
                            };
                            if let (Some(input_usd_val), Some(output_usd_val)) = (
                                input_usd,
                                output_usd,
                            ) {
                                if !input_usd_val.is_zero() && !output_usd_val.is_zero() {
                                    let difference = &input_usd_val - &output_usd_val;
                                    if difference.sign() != Sign::Plus {
                                        return ().into_any();
                                    }
                                    let percentage_diff = (&difference / &input_usd_val)
                                        * BigDecimal::from(100);
                                    let five_percent = BigDecimal::from(5);
                                    let two_percent = BigDecimal::from(2);
                                    if percentage_diff > five_percent {
                                        view! {
                                            <div class="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-center">
                                                <div class="text-red-400 text-sm font-medium mb-1">
                                                    "High Price Impact"
                                                </div>
                                                <div class="text-red-300 text-xs">
                                                    {format!(
                                                        "Price difference: {:.1}% - You may receive significantly less value. We recommend splitting the swap into multiple smaller swaps (dollar-cost averaging) to avoid price impact.",
                                                        percentage_diff,
                                                    )}
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    } else if percentage_diff > two_percent {
                                        view! {
                                            <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg px-4 py-3 text-center">
                                                <div class="text-yellow-400 text-sm font-medium mb-1">
                                                    "High Price Impact"
                                                </div>
                                                <div class="text-yellow-300 text-xs">
                                                    {format!(
                                                        "Price difference: {:.2}% - Please review the swap carefully, as you might incur losses. We recommend splitting the swap into multiple smaller swaps (dollar-cost averaging) to avoid price impact.",
                                                        percentage_diff,
                                                    )}
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }
                                } else {
                                    ().into_any()
                                }
                            } else {
                                ().into_any()
                            }
                        }}
                    </div>

                    <a
                        href="http://t.me/bettearbot?start=smile-trade"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block mt-4 hover:opacity-80 transition-opacity border border-neutral-700 rounded-lg"
                    >
                        <img
                            src="/bettear-ad.png"
                            alt="Bettear Bot - #1 Trading Bot on NEAR"
                            class="w-full h-auto"
                        />
                    </a>
                </div>
            </div>
        </div>

        {move || {
            match swap_modal_state.get() {
                SwapModalState::Success(result) => {
                    view! {
                        <SwapSuccessModal
                            result=*result
                            set_swap_modal_state=set_swap_modal_state
                        />
                    }
                        .into_any()
                }
                SwapModalState::Error => {
                    view! { <SwapErrorModal set_swap_modal_state=set_swap_modal_state /> }
                        .into_any()
                }
                SwapModalState::None => ().into_any(),
            }
        }}
    }
}

#[allow(clippy::too_many_arguments)]
async fn execute_route(
    amount: Balance,
    swap_mode: SwapMode,
    token_in: TokenInfo,
    token_out: TokenInfo,
    route: Route,
    account: Account,
    add_transaction: WriteSignal<Vec<EnqueuedTransaction>>,
    set_tx_overlay_mode: RwSignal<OverlayMode>,
    rpc: RpcClient,
    set_swap_modal_state: WriteSignal<SwapModalState>,
) {
    let wrap_near_id = Token::Nep141("wrap.near".parse().unwrap());

    let initial_balance_futures = vec![
        get_ft_balance(&account.account_id, token_in.account_id.clone(), &rpc),
        get_ft_balance(&account.account_id, token_out.account_id.clone(), &rpc),
        get_ft_balance(&account.account_id, wrap_near_id.clone(), &rpc),
    ];

    let initial_balances = futures_util::future::join_all(initial_balance_futures).await;
    let initial_token_in_balance = initial_balances[0];
    let initial_token_out_balance = initial_balances[1];
    let initial_wrap_balance = initial_balances[2];

    let steps = route.execution_instructions.len() + if route.needs_unwrap { 1 } else { 0 };
    let mut last_rx = None;
    let description = format!(
        "Swap {} for {}",
        match swap_mode {
            SwapMode::ExactIn => format_token_amount_no_hide(
                amount,
                token_in.metadata.decimals,
                &token_in.metadata.symbol
            ),
            SwapMode::ExactOut => token_in.metadata.symbol.clone(),
        },
        match swap_mode {
            SwapMode::ExactIn => token_out.metadata.symbol.clone(),
            SwapMode::ExactOut => format_token_amount_no_hide(
                amount,
                token_out.metadata.decimals,
                &token_out.metadata.symbol
            ),
        }
    );

    for (i, step) in route.execution_instructions.into_iter().enumerate() {
        match step {
            ExecutionInstruction::NearTransaction {
                receiver_id,
                actions,
            } => {
                let (rx, pending_tx) = EnqueuedTransaction::create(
                    format!(
                        "{description}{}",
                        if steps > 1 {
                            format!(" {}/{steps}", i + 1)
                        } else {
                            String::new()
                        }
                    ),
                    account.account_id.clone(),
                    receiver_id.clone(),
                    actions,
                );
                add_transaction.update(|txs| {
                    txs.push(pending_tx);
                });
                last_rx = Some(rx);
            }
            ExecutionInstruction::IntentsQuote {
                message_to_sign,
                quote_hash,
            } => {
                let (rx, pending_tx) = EnqueuedTransaction::create_with_type(
                    format!(
                        "{description}{}",
                        if steps > 1 {
                            format!(" {}/{steps}", i + 1)
                        } else {
                            String::new()
                        }
                    ),
                    account.account_id.clone(),
                    TransactionType::NearIntents {
                        message_to_sign,
                        quote_hash,
                    },
                );
                add_transaction.update(|txs| {
                    txs.push(pending_tx);
                });
                last_rx = Some(rx);
            }
        }
    }

    let Some(last_rx) = last_rx else {
        // Should never happen as long as router is ok
        return;
    };

    let tx_result = last_rx.await;
    let Ok(Ok(_)) = tx_result else {
        set_swap_modal_state.set(SwapModalState::Error);
        return;
    };

    let final_wrap_balance = get_ft_balance(&account.account_id, wrap_near_id, &rpc).await;

    if let Some(wrap_near_balance) = initial_wrap_balance {
        if let Some(new_wrap_near_balance) = final_wrap_balance {
            if let Some(difference) = new_wrap_near_balance.checked_sub(wrap_near_balance) {
                if !difference.is_zero() {
                    set_tx_overlay_mode.set(OverlayMode::Background);
                    let (rx, enqueued_tx) = EnqueuedTransaction::create(
                        format!("{description} ({steps}/{steps})"),
                        account.account_id.clone(),
                        "wrap.near".parse().unwrap(),
                        vec![Action::FunctionCall(Box::new(FunctionCallAction {
                            method_name: "near_withdraw".to_string(),
                            args: serde_json::to_vec(&serde_json::json!({
                                "amount": difference.to_string(),
                            }))
                            .unwrap(),
                            gas: NearGas::from_tgas(5).as_gas(),
                            deposit: NearToken::from_yoctonear(1),
                        }))],
                    );
                    add_transaction.update(|txs| {
                        txs.push(enqueued_tx);
                    });
                    let _ = rx.await;
                }
            }
        }
    }

    let final_balance_futures = vec![
        get_ft_balance(&account.account_id, token_in.account_id.clone(), &rpc),
        get_ft_balance(&account.account_id, token_out.account_id.clone(), &rpc),
    ];
    let final_balances = futures_util::future::join_all(final_balance_futures).await;
    let final_token_in_balance = final_balances[0];
    let final_token_out_balance = final_balances[1];

    let amount_spent = if let (Some(initial), Some(final_balance)) =
        (initial_token_in_balance, final_token_in_balance)
    {
        initial.saturating_sub(final_balance)
    } else {
        return;
    };

    let amount_received = if let (Some(initial), Some(final_balance)) =
        (initial_token_out_balance, final_token_out_balance)
    {
        final_balance.saturating_sub(initial)
    } else {
        return;
    };

    set_swap_modal_state.set(SwapModalState::Success(Box::new(SwapResult {
        token_in,
        token_out,
        amount_in: amount_spent,
        amount_out: amount_received,
    })));
}

async fn get_ft_balance(
    account_id: &AccountIdRef,
    token_id: Token,
    rpc: &RpcClient,
) -> Option<Balance> {
    match token_id {
        Token::Nep141(token_id) => rpc
            .call::<U128>(
                token_id,
                "ft_balance_of",
                serde_json::json!({
                    "account_id": account_id,
                }),
                QueryFinality::Finality(Finality::None),
            )
            .await
            .ok()
            .map(|balance| *balance),
        Token::Near => rpc
            .view_account(
                account_id.to_owned(),
                QueryFinality::Finality(Finality::None),
            )
            .await
            .ok()
            .map(|account_view| account_view.amount.as_yoctonear()),
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum WaitMode {
    /// Fast fetch, don't use intents
    Fast {
        skip_intents: bool,
        duration: Duration,
    },
    /// Include slow dexes like near intents, wait for better quote
    Full { duration: Duration },
}

async fn get_routes(swap_request: SwapRequest, wait_mode: WaitMode) -> Result<Routes, String> {
    let mut filtered_dexes = swap_request.dexes.clone().unwrap_or_default();

    // Filter out NearIntents for fast mode when skip_intents is true
    if let WaitMode::Fast {
        skip_intents: true, ..
    } = wait_mode
    {
        filtered_dexes.retain(|dex| *dex != DexId::NearIntents);
    }

    let swap_request = SwapRequest {
        max_wait_ms: match wait_mode {
            WaitMode::Fast { duration, .. } => duration.as_millis() as u64,
            WaitMode::Full { duration } => duration.as_millis() as u64,
        },
        dexes: if filtered_dexes.is_empty() {
            None
        } else {
            Some(filtered_dexes)
        },
        ..swap_request
    };
    let routes = reqwest::Client::new()
        .get(format!("{}/route", dotenvy_macro::dotenv!("ROUTER_URL")))
        .query(&swap_request)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<Vec<Route>>()
        .await
        .map_err(|e| e.to_string())?;
    Ok(Routes { routes, wait_mode })
}

#[derive(Debug, Clone)]
struct Routes {
    routes: Vec<Route>,
    wait_mode: WaitMode,
}

impl Default for Slippage {
    fn default() -> Self {
        Self::Auto {
            // From 0.1% to 10%
            max_slippage: "0.1".parse().unwrap(),
            min_slippage: "0.001".parse().unwrap(),
        }
    }
}

impl Display for Slippage {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Slippage::Auto { .. } => write!(f, "Auto"),
            Slippage::Fixed { slippage } => write!(f, "{:.2}%", slippage * BigDecimal::from(100)),
        }
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
        s.parse().map_err(serde::de::Error::custom)
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

impl FromStr for TokenId {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s == "near" {
            Ok(TokenId::Near)
        } else {
            Ok(TokenId::Nep141(s.parse().map_err(|_| "Invalid token ID")?))
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
    /// The slippage tolerance. `1.00` means 100%, `0.001` means 0.1%.
    #[serde(flatten)]
    pub slippage: Slippage,
    /// The dexes to use. You might want to remove Near Intents if you don't want
    /// to implement its own swap logic, which relies on signing and sending messages
    /// to a centralized RPC rather than just sending a transaction. If not provided,
    /// all dexes will be used. Must not be an empty array.
    #[serde(with = "comma_separated", default)]
    pub dexes: Option<Vec<DexId>>,
    /// The account ID of the trader. If provided, the route will include storage
    /// deposit actions.
    pub trader_account_id: Option<AccountId>,
    /// The public key to use for signing. Can be used for `add_public_key` method in
    /// NEAR Intents.
    pub signing_public_key: Option<PublicKey>,
}

mod comma_separated {
    use std::{fmt::Display, str::FromStr};

    use serde::{Deserialize, Deserializer, Serialize, Serializer};

    pub fn serialize<S, T>(value: &Option<Vec<T>>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
        T: Display,
    {
        if let Some(value) = value {
            let s = value
                .iter()
                .map(|v| v.to_string())
                .collect::<Vec<_>>()
                .join(",");
            Some(s).serialize(serializer)
        } else {
            None::<String>.serialize(serializer)
        }
    }

    pub fn deserialize<'de, D, T>(deserializer: D) -> Result<Option<Vec<T>>, D::Error>
    where
        D: Deserializer<'de>,
        T: FromStr,
        T::Err: Display,
    {
        let s = Option::<String>::deserialize(deserializer)?;
        if let Some(s) = s {
            let values = s
                .split(',')
                .map(|v| v.parse::<T>())
                .collect::<Result<Vec<_>, _>>()
                .map_err(serde::de::Error::custom)?;
            Ok(Some(values))
        } else {
            Ok(None)
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "slippage_type")]
pub enum Slippage {
    /// Automatically determine the optimal slippage based on the current market
    /// conditions (liquidity, 24h volume, etc).
    Auto {
        max_slippage: BigDecimal,
        min_slippage: BigDecimal,
    },
    /// Fixed slippage percentage. Must be between 0.00 and 1.00.
    Fixed { slippage: BigDecimal },
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
    /// Directly wrap NEAR to wNEAR, or unwrap wNEAR to NEAR
    ///
    /// Supports both AmountIn and AmountOut
    Wrap,
    /// https://dex.rhea.finance/
    /// AMM DEX
    ///
    /// Supports both AmountIn and AmountOut
    RheaDcl,
}

const RHEA_STR: &str = "Rhea";
const NEAR_INTENTS_STR: &str = "NearIntents";
const VEAX_STR: &str = "Veax";
const AIDOLS_STR: &str = "Aidols";
const GRA_FUN_STR: &str = "GraFun";
const JUMPDEFI_STR: &str = "Jumpdefi";
const WRAP_STR: &str = "Wrap";
const RHEA_DCL_STR: &str = "RheaDcl";

impl Display for DexId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DexId::Rhea => f.write_str(RHEA_STR),
            DexId::NearIntents => f.write_str(NEAR_INTENTS_STR),
            DexId::Veax => f.write_str(VEAX_STR),
            DexId::Aidols => f.write_str(AIDOLS_STR),
            DexId::GraFun => f.write_str(GRA_FUN_STR),
            DexId::Jumpdefi => f.write_str(JUMPDEFI_STR),
            DexId::Wrap => f.write_str(WRAP_STR),
            DexId::RheaDcl => f.write_str(RHEA_DCL_STR),
        }
    }
}

impl FromStr for DexId {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            RHEA_STR => DexId::Rhea,
            NEAR_INTENTS_STR => DexId::NearIntents,
            VEAX_STR => DexId::Veax,
            AIDOLS_STR => DexId::Aidols,
            GRA_FUN_STR => DexId::GraFun,
            JUMPDEFI_STR => DexId::Jumpdefi,
            WRAP_STR => DexId::Wrap,
            RHEA_DCL_STR => DexId::RheaDcl,
            _ => return Err(format!("Invalid dex id: {}", s)),
        })
    }
}

#[component]
fn SwapSuccessModal(
    result: SwapResult,
    set_swap_modal_state: WriteSignal<SwapModalState>,
) -> impl IntoView {
    let amount_in_decimal = balance_to_decimal(result.amount_in, result.token_in.metadata.decimals);
    let amount_in_formatted = format!(
        "{} {}",
        round_precision_or_significant(amount_in_decimal),
        result.token_in.metadata.symbol
    );

    let amount_out_decimal =
        balance_to_decimal(result.amount_out, result.token_out.metadata.decimals);
    let amount_out_formatted = format!(
        "{} {}",
        round_precision_or_significant(amount_out_decimal),
        result.token_out.metadata.symbol
    );

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            on:click=move |_| set_swap_modal_state.set(SwapModalState::None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuCheck
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">"Swap Successful!"</h3>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">"You spent"</div>
                            <div class="flex items-center gap-3">
                                {match result.token_in.metadata.icon {
                                    Some(icon) => {
                                        view! {
                                            <img
                                                src=icon
                                                alt=result.token_in.metadata.symbol.clone()
                                                class="w-8 h-8 rounded-full"
                                            />
                                        }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                                                {result
                                                    .token_in
                                                    .metadata
                                                    .symbol
                                                    .chars()
                                                    .next()
                                                    .unwrap_or('?')}
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }} <div>
                                    <div class="text-white font-medium text-lg">
                                        {amount_in_formatted}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-center">
                            <Icon
                                icon=icondata::LuArrowDown
                                width="20"
                                height="20"
                                attr:class="text-gray-400"
                            />
                        </div>

                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">"You received"</div>
                            <div class="flex items-center gap-3">
                                {match result.token_out.metadata.icon {
                                    Some(icon) => {
                                        view! {
                                            <img
                                                src=icon
                                                alt=result.token_out.metadata.symbol.clone()
                                                class="w-8 h-8 rounded-full"
                                            />
                                        }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                                                {result
                                                    .token_out
                                                    .metadata
                                                    .symbol
                                                    .chars()
                                                    .next()
                                                    .unwrap_or('?')}
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }} <div>
                                    <div class="text-white font-medium text-lg">
                                        {amount_out_formatted}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        class="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| set_swap_modal_state.set(SwapModalState::None)
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
fn SwapErrorModal(set_swap_modal_state: WriteSignal<SwapModalState>) -> impl IntoView {
    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            on:click=move |_| set_swap_modal_state.set(SwapModalState::None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuX
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">"Swap Failed"</h3>
                        <p class="text-gray-400 text-sm">
                            "The swap transaction was rejected or failed. Please try again."
                        </p>
                    </div>

                    <button
                        class="w-full mt-6 bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| set_swap_modal_state.set(SwapModalState::None)
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}
