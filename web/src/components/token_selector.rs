use leptos::prelude::*;
use leptos_icons::Icon;
use near_min_api::types::AccountId;
use serde::Serialize;

use crate::{
    contexts::{
        accounts_context::{Account, AccountsContext},
        modal_context::ModalContext,
        network_context::Network,
        tokens_context::{
            Token, TokenBalanceSource, TokenData, TokenInfo, TokenScore, TokensContext,
        },
    },
    utils::{balance_to_decimal, format_token_amount, format_usd_value, format_usd_value_no_hide},
};

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
        Network::Mainnet => "https://prices.intear.tech".to_string(),
        Network::Testnet => "https://prices-testnet.intear.tech".to_string(),
        Network::Localnet(network) => {
            if let Some(url) = &network.prices_api_url {
                url.clone()
            } else {
                return Ok(vec![]);
            }
        }
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

#[derive(Debug, Clone)]
enum SearchError {
    QueryIsEmpty,
    SearchFailed(#[allow(dead_code)] String),
}

#[component]
fn TokenSelectorModal(
    on_select: impl Fn(TokenData) + Send + Sync + 'static + Copy,
    allow_native_near: bool,
) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let TokensContext {
        tokens,
        set_tokens,
        loading_tokens,
    } = expect_context::<TokensContext>();

    let (search_query, set_search_query) = signal("".to_string());

    let search_resource = LocalResource::new(move || async move {
        let query = search_query.get();
        if query.is_empty() {
            return Err(SearchError::QueryIsEmpty);
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
            search_tokens(&query, current_account)
                .await
                .map(|results| {
                    results
                        .into_iter()
                        .map(|mut r| {
                            if let Some(icon) = r.metadata.icon.as_ref()
                                && !icon.starts_with("data:")
                            {
                                r.metadata.icon = None;
                            }
                            r
                        })
                        .collect::<Vec<_>>()
                })
                .map_err(SearchError::SearchFailed)
        } else {
            Ok(vec![])
        }
    });

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div on:click=|ev| ev.stop_propagation() class="md:w-md">
                <div class="bg-neutral-900 rounded-2xl w-full max-h-[60vh] overflow-hidden flex flex-col">
                    <div class="p-4 border-b border-neutral-800 flex-shrink-0">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-white font-bold text-lg">"Select Token"</h3>
                            <button
                                class="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                on:click=move |_| modal.set(None)
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
                                class="w-full bg-neutral-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
                    <div
                        class="p-4 space-y-2 flex-1"
                        style=move || {
                            if !search_query.get().is_empty() {
                                if let None | Some(Err(SearchError::QueryIsEmpty)) = search_resource
                                    .get()
                                {
                                    "overflow-y: hidden;"
                                } else {
                                    "overflow-y: auto;"
                                }
                            } else {
                                "overflow-y: auto;"
                            }
                        }
                    >
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
                                        .filter(|token_data| {
                                            if allow_native_near {
                                                matches!(
                                                    token_data.token.account_id,
                                                    Token::Near | Token::Nep141(_)
                                                )
                                            } else {
                                                matches!(token_data.token.account_id, Token::Nep141(_))
                                            }
                                        })
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
                                                            modal.set(None);
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
                                                                        class="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full"
                                                                    />
                                                                }
                                                                    .into_any()
                                                            }
                                                            None => {
                                                                view! {
                                                                    <div class="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
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
                                                                <div class="text-white font-medium wrap-anywhere">
                                                                    {token_data.token.metadata.symbol.clone()}
                                                                </div>
                                                                {if matches!(
                                                                    token_data.token.reputation,
                                                                    TokenScore::Unknown
                                                                ) {
                                                                    view! {
                                                                        <Icon
                                                                            icon=icondata::LuTriangleAlert
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
                                                            <div class="text-gray-400 text-sm wrap-anywhere">
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
                                                                Token::Rhea(_) => unreachable!(),
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
                                                            {format_usd_value(usd_value_decimal)}
                                                        </div>
                                                    </div>
                                                </button>
                                            }
                                        })
                                        .collect_view()
                                        .into_any()
                                } else {
                                    match search_resource.get() {
                                        Some(Ok(mut search_results)) => {
                                            let query_lower = search_query.to_lowercase();
                                            if allow_native_near && "near".contains(&query_lower)
                                                && let Some(near_token_data) = user_tokens
                                                    .iter()
                                                    .find(|t| t.token.account_id == Token::Near)
                                                {
                                                    search_results.insert(0, near_token_data.token.clone());
                                                }
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
                                                            source: TokenBalanceSource::Direct,
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
                                                                        modal.set(None);
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
                                                                                    class="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full"
                                                                                />
                                                                            }
                                                                                .into_any()
                                                                        }
                                                                        None => {
                                                                            view! {
                                                                                <div class="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
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
                                                                            <div class="text-white font-medium wrap-anywhere">
                                                                                {token_data.token.metadata.symbol.clone()}
                                                                            </div>
                                                                            {if matches!(
                                                                                token_data.token.reputation,
                                                                                TokenScore::Unknown
                                                                            ) {
                                                                                view! {
                                                                                    <Icon
                                                                                        icon=icondata::LuTriangleAlert
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
                                                                        <div class="text-gray-400 text-sm wrap-anywhere">
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
                                                                            Token::Rhea(_) => unreachable!(),
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
                                        Some(Err(SearchError::SearchFailed(_))) => {
                                            view! {
                                                <div class="flex items-center justify-center h-32 text-red-400">
                                                    "Error loading search results"
                                                </div>
                                            }
                                                .into_any()
                                        }
                                        None | Some(Err(SearchError::QueryIsEmpty)) => {
                                            view! {
                                                <div class="space-y-2 h-full overflow-y-hidden">
                                                    {(0..10)
                                                        .map(|_| {
                                                            view! {
                                                                <div class="w-full flex items-center justify-between bg-neutral-800 rounded-xl p-4">
                                                                    <div class="flex items-center gap-3">
                                                                        <div class="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full bg-neutral-700 animate-pulse"></div>
                                                                        <div class="space-y-2">
                                                                            <div class="h-4 w-24 bg-neutral-700 rounded animate-pulse"></div>
                                                                            <div class="h-3 w-32 bg-neutral-700/70 rounded"></div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-right space-y-2">
                                                                        <div class="h-4 w-16 bg-neutral-700 rounded animate-pulse ml-auto"></div>
                                                                        <div class="h-3 w-20 bg-neutral-700/70 rounded ml-auto"></div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        })
                                                        .collect_view()}
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
    }
}

#[component]
pub fn TokenSelector(
    selected_token: impl Fn() -> Option<TokenData> + Send + Sync + 'static,
    on_select: impl Fn(TokenData) + Send + Sync + 'static + Copy,
    placeholder: &'static str,
    allow_native_near: bool,
) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();

    let open_modal = move |_| {
        modal.set(Some(Box::new(move || {
            view! { <TokenSelectorModal on_select=on_select allow_native_near=allow_native_near /> }.into_any()
        })));
    };

    view! {
        <button
            class="flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-xl px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 transition-colors cursor-pointer w-[120px] sm:w-[140px] md:w-[160px] wrap-anywhere text-[13px] sm:text-[16px]"
            on:click=open_modal
        >
            {move || {
                if let Some(token) = selected_token() {
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
                                                    icon=icondata::LuTriangleAlert
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
    }
}
