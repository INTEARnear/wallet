use std::str::FromStr;

use crate::{
    contexts::{
        accounts_context::AccountsContext,
        config_context::ConfigContext,
        modal_context::ModalContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        search_context::SearchContext,
        tokens_context::{Token, TokenBalanceSource, TokenData, TokenScore, TokensContext},
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::{
        balance_to_decimal, format_token_amount, format_usd_value, power_of_10, StorageBalance,
        USDT_DECIMALS,
    },
};
use bigdecimal::{BigDecimal, ToPrimitive};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::Icon;
use leptos_router::components::A;
use near_min_api::{
    types::{Action, Finality, FunctionCallAction, NearGas, NearToken},
    QueryFinality,
};

#[component]
fn RheaBalanceCard(rhea_tokens: Vec<TokenData>, total_usd: BigDecimal) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let token_count = rhea_tokens.iter().filter(|t| t.balance > 0).count();

    view! {
        <button
            class="relative overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-5 hover:border-purple-500/50 transition-all gap-4 mobile-ripple cursor-pointer"
            on:click=move |_| {
                let rhea_tokens_clone = rhea_tokens.clone();
                modal
                    .set(
                        Some(
                            Box::new(move || {
                                view! { <RheaBalanceModal rhea_tokens=rhea_tokens_clone.clone() /> }
                                    .into_any()
                            }),
                        ),
                    );
            }
        >
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white">
                        <Icon icon=icondata::LuWallet width="24" height="24" />
                    </div>
                    <div class="text-left">
                        <div class="flex items-center gap-2">
                            <span class="text-white text-lg font-semibold">
                                "Rhea Inner Balance"
                            </span>
                            <div class="px-2 py-0.5 bg-purple-500/20 border border-purple-400/30 rounded-full">
                                <span class="text-purple-300 text-xs font-medium">
                                    {format!(
                                        "{} token{}",
                                        token_count,
                                        if token_count == 1 { "" } else { "s" },
                                    )}
                                </span>
                            </div>
                        </div>
                        <p class="text-purple-300/70 text-sm mt-1">
                            "Tap to view & manage internal balances"
                        </p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-white text-2xl font-bold">
                        {move || format_usd_value(total_usd.clone())}
                    </p>
                    <div class="flex items-center gap-1 text-purple-300/70 text-sm mt-1 justify-end">
                        <span>"View details"</span>
                        <Icon icon=icondata::LuChevronRight width="16" height="16" />
                    </div>
                </div>
            </div>
        </button>
    }
}

#[component]
fn RheaBalanceModal(rhea_tokens: Vec<TokenData>) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let RpcContext { client: rpc_client } = expect_context::<RpcContext>();

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                class="bg-neutral-900 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto overflow-x-hidden"
                on:click=|ev| ev.stop_propagation()
            >
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white">"Rhea Internal Balance"</h2>
                    <button
                        class="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        <Icon icon=icondata::LuX width="18" height="18" />
                    </button>
                </div>
                <p class="text-gray-400 text-sm mb-6">
                    "These tokens are stored in Rhea's internal balance, apps like BettearBot use this feature to trade faster. Withdraw them to use in your wallet."
                </p>
                <div class="flex flex-col gap-3">
                    {move || {
                        rhea_tokens
                            .clone()
                            .into_iter()
                            .filter(|token| token.balance > 0)
                            .map(|token| {
                                let balance = token.balance;
                                let decimals = token.token.metadata.decimals;
                                let formatted_balance = format_token_amount(
                                    balance,
                                    decimals,
                                    &token.token.metadata.symbol,
                                );
                                let normalized_balance = balance_to_decimal(balance, decimals);
                                let usd_value = format_usd_value(
                                    &token.token.price_usd * &normalized_balance,
                                );
                                let symbol = token.token.metadata.symbol.clone();
                                let token_id = match token.token.account_id {
                                    Token::Near => "near".parse().unwrap(),
                                    Token::Nep141(id) => id.clone(),
                                    Token::Rhea(id) => id.clone(),
                                };

                                view! {
                                    <div class="flex flex-col bg-neutral-800 rounded-xl p-4 gap-3">
                                        <div class="flex items-center justify-between gap-4">
                                            <div class="flex items-center gap-3 wrap-anywhere min-w-0 flex-1">
                                                {match token.token.metadata.icon.clone() {
                                                    Some(icon) => {
                                                        view! {
                                                            <img
                                                                src=icon
                                                                alt=token.token.metadata.symbol.clone()
                                                                class="w-10 h-10 rounded-full"
                                                            />
                                                        }
                                                            .into_any()
                                                    }
                                                    None => {
                                                        view! {
                                                            <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
                                                                {token.token.metadata.symbol.chars().next().unwrap_or('?')}
                                                            </div>
                                                        }
                                                            .into_any()
                                                    }
                                                }} <div>
                                                    <span
                                                        class="text-white text-lg font-medium"
                                                        style=move || {
                                                            if symbol.len() > 14 {
                                                                "font-size: 0.8rem;"
                                                            } else if symbol.len() > 10 {
                                                                "font-size: 1rem;"
                                                            } else {
                                                                ""
                                                            }
                                                        }
                                                    >
                                                        {token.token.metadata.symbol.clone()}
                                                    </span>
                                                    <p class="text-gray-400 text-sm">{formatted_balance}</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-white text-lg">{usd_value}</p>
                                            </div>
                                        </div>
                                        <button
                                            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                                            on:click=move |_| {
                                                let selected_account_id = accounts
                                                    .get()
                                                    .selected_account_id;
                                                if let Some(signer_id) = selected_account_id {
                                                    let token_id_clone = token_id.clone();
                                                    let token_symbol = token.token.metadata.symbol.clone();
                                                    let rpc = rpc_client.get_untracked();
                                                    let signer_clone = signer_id.clone();
                                                    spawn_local(async move {
                                                        let storage_result = rpc
                                                            .call::<
                                                                Option<StorageBalance>,
                                                            >(
                                                                token_id_clone.clone(),
                                                                "storage_balance_of",
                                                                serde_json::json!(
                                                                    {
                                                                "account_id": signer_id,
                                                            }
                                                                ),
                                                                QueryFinality::Finality(Finality::DoomSlug),
                                                            )
                                                            .await;
                                                        let needs_storage_deposit = match storage_result {
                                                            Ok(storage_balance) => {
                                                                match storage_balance {
                                                                    Some(storage_balance) => storage_balance.total.is_zero(),
                                                                    None => true,
                                                                }
                                                            }
                                                            Err(_) => false,
                                                        };
                                                        let mut transactions = Vec::new();
                                                        if needs_storage_deposit {
                                                            let (_rx, storage_tx) = EnqueuedTransaction::create(
                                                                format!("Storage deposit on {}", token_symbol),
                                                                signer_clone.clone(),
                                                                token_id_clone.clone(),
                                                                vec![
                                                                    Action::FunctionCall(
                                                                        Box::new(FunctionCallAction {
                                                                            method_name: "storage_deposit".to_string(),
                                                                            args: serde_json::json!(
                                                                                {
                                                                    "account_id": signer_clone,
                                                                    "registration_only": true,
                                                                }
                                                                            )
                                                                                .to_string()
                                                                                .into_bytes(),
                                                                            gas: NearGas::from_tgas(5).as_gas(),
                                                                            deposit: "0.00125 NEAR".parse().unwrap(),
                                                                        }),
                                                                    ),
                                                                ],
                                                            );
                                                            transactions.push(storage_tx);
                                                        }
                                                        let (_rx, withdraw_tx) = EnqueuedTransaction::create(
                                                            format!("Withdraw {} from Rhea", token_symbol),
                                                            signer_clone,
                                                            "v2.ref-finance.near".parse().unwrap(),
                                                            vec![
                                                                Action::FunctionCall(
                                                                    Box::new(FunctionCallAction {
                                                                        method_name: "withdraw".to_string(),
                                                                        args: serde_json::json!(
                                                                            {
                                                                "token_id": token_id_clone,
                                                                "amount": balance.to_string(),
                                                            }
                                                                        )
                                                                            .to_string()
                                                                            .into_bytes(),
                                                                        gas: NearGas::from_tgas(50).as_gas(),
                                                                        deposit: NearToken::from_yoctonear(1),
                                                                    }),
                                                                ),
                                                            ],
                                                        );
                                                        if !transactions.is_empty() {
                                                            transactions
                                                                .push(withdraw_tx.in_same_queue_as(&transactions[0]));
                                                        } else {
                                                            transactions.push(withdraw_tx);
                                                        }
                                                        add_transaction.update(|txs| txs.extend(transactions));
                                                        modal.set(None);
                                                    });
                                                }
                                            }
                                        >
                                            <Icon
                                                icon=icondata::LuArrowUpFromLine
                                                width="16"
                                                height="16"
                                            />
                                            "Withdraw"
                                        </button>
                                    </div>
                                }
                            })
                            .collect_view()
                    }}
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn TokenBalanceList() -> impl IntoView {
    let TokensContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokensContext>();
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let SearchContext { query, .. } = expect_context::<SearchContext>();
    let NetworkContext { network } = expect_context::<NetworkContext>();

    let toggle_low_balance = move |_| {
        set_config.update(|config| {
            config.show_low_balance_tokens = !config.show_low_balance_tokens;
        });
    };

    view! {
        <div class="flex flex-col gap-3">
            {move || {
                if loading_tokens.get() {
                    view! {
                        <div class="flex items-center justify-center h-32">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    }
                        .into_any()
                } else {
                    let all_tokens = tokens.get();
                    let (direct_tokens, rhea_tokens): (Vec<_>, Vec<_>) = all_tokens
                        .into_iter()
                        .partition(|token| matches!(token.source, TokenBalanceSource::Direct));
                    let filtered_tokens = direct_tokens
                        .into_iter()
                        .filter(|token| {
                            let matches_search = query.get().is_empty()
                                || token
                                    .token
                                    .metadata
                                    .name
                                    .to_lowercase()
                                    .contains(&query.get().to_lowercase())
                                || token
                                    .token
                                    .metadata
                                    .symbol
                                    .to_lowercase()
                                    .contains(&query.get().to_lowercase());
                            if !matches_search {
                                return false;
                            }
                            if matches!(token.token.reputation, TokenScore::Spam) {
                                return false;
                            }
                            let market_cap_is_abnormal = &token.token.price_usd_raw
                                * &BigDecimal::from(token.token.circulating_supply)
                                / power_of_10(USDT_DECIMALS)
                                >= BigDecimal::from(100_000_000_000_000u128);
                            if market_cap_is_abnormal && network.get() == Network::Mainnet {
                                log::warn!(
                                    "Hiding token {:?} as it has abnormal market cap",
                                    token.token.account_id
                                );
                                return false;
                            }
                            if query.get().is_empty() && !config.get().show_low_balance_tokens
                                && token.token.account_id != Token::Near
                            {
                                let balance = token.balance;
                                let decimals = token.token.metadata.decimals;
                                let price = &token.token.price_usd;
                                let normalized_balance = balance_to_decimal(balance, decimals);
                                let threshold = BigDecimal::from_str("0.01").unwrap_or_default();
                                return (price * &normalized_balance) >= threshold;
                            }
                            true
                        })
                        .collect::<Vec<_>>();
                    let has_rhea_balance = rhea_tokens.iter().any(|token| token.balance > 0);
                    let rhea_total_usd = rhea_tokens
                        .iter()
                        .map(|token| {
                            let normalized_balance = balance_to_decimal(
                                token.balance,
                                token.token.metadata.decimals,
                            );
                            &token.token.price_usd * &normalized_balance
                        })
                        .fold(BigDecimal::from(0), |acc, val| acc + val);
                    let rhea_total_is_significant = rhea_total_usd >= BigDecimal::from(10);
                    let visible_token_count = filtered_tokens.len();

                    view! {
                        {if has_rhea_balance && rhea_total_is_significant {
                            view! {
                                <RheaBalanceCard
                                    rhea_tokens=rhea_tokens.clone()
                                    total_usd=rhea_total_usd.clone()
                                />
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }}
                        {filtered_tokens
                            .into_iter()
                            .map(|token| {
                                let balance = token.balance;
                                let decimals = token.token.metadata.decimals;
                                let formatted_balance = format_token_amount(
                                    balance,
                                    decimals,
                                    &token.token.metadata.symbol,
                                );
                                let normalized_balance = balance_to_decimal(balance, decimals);
                                let usd_value = format_usd_value(
                                    &token.token.price_usd * &normalized_balance,
                                );
                                let price_change = if token.token.price_usd_hardcoded
                                    == BigDecimal::from(1)
                                {
                                    BigDecimal::from(0)
                                } else if token.token.price_usd_raw_24h_ago > BigDecimal::from(0) {
                                    let hundred = BigDecimal::from(100);
                                    ((&token.token.price_usd_raw
                                        - &token.token.price_usd_raw_24h_ago)
                                        / &token.token.price_usd_raw_24h_ago) * &hundred
                                } else {
                                    BigDecimal::from(0)
                                };
                                let price_change_f64 = price_change.to_f64().unwrap_or(0.0);
                                let price_change_formatted = if price_change_f64 > 0.0 {
                                    format!("+{price_change:.2}%")
                                } else {
                                    format!("{price_change:.2}%")
                                };
                                let token_id = match &token.token.account_id {
                                    Token::Near => "near".to_string(),
                                    Token::Nep141(account_id) => account_id.to_string(),
                                    Token::Rhea(account_id) => account_id.to_string(),
                                };
                                let symbol = token.token.metadata.symbol.clone();
                                let symbol2 = token.token.metadata.symbol.clone();

                                view! {
                                    <A
                                        href=format!("/token/{}", token_id)
                                        attr:class="flex items-center justify-between bg-neutral-900 rounded-xl p-4 hover:bg-neutral-800 transition-colors gap-4 mobile-ripple cursor-pointer"
                                    >
                                        <div class="flex items-center gap-3 wrap-anywhere">
                                            {match token.token.metadata.icon.clone() {
                                                Some(icon) => {
                                                    view! {
                                                        <img
                                                            src=icon
                                                            alt=token.token.metadata.symbol.clone()
                                                            class="w-10 h-10 rounded-full"
                                                        />
                                                    }
                                                        .into_any()
                                                }
                                                None => {
                                                    view! {
                                                        <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
                                                            {token.token.metadata.symbol.chars().next().unwrap_or('?')}
                                                        </div>
                                                    }
                                                        .into_any()
                                                }
                                            }} <div>
                                                <span
                                                    class="text-white text-lg font-medium"
                                                    style=move || {
                                                        if symbol.len() > 14 {
                                                            "font-size: 0.8rem;"
                                                        } else if symbol.len() > 10 {
                                                            "font-size: 1rem;"
                                                        } else {
                                                            ""
                                                        }
                                                    }
                                                >
                                                    {token.token.metadata.symbol.clone()}
                                                </span>
                                                <p
                                                    class="text-gray-400 text-sm"
                                                    style=move || {
                                                        if symbol2.len() > 14 {
                                                            "font-size: 0.7rem;"
                                                        } else if symbol2.len() > 10 {
                                                            "font-size: 0.8rem;"
                                                        } else {
                                                            ""
                                                        }
                                                    }
                                                >
                                                    {formatted_balance}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="text-white text-lg text-right">{usd_value}</p>
                                            <p
                                                class="text-sm text-right"
                                                style=format!(
                                                    "color: {}",
                                                    if price_change_f64 > 0.0 {
                                                        "rgb(34 197 94)"
                                                    } else if price_change_f64 < 0.0 {
                                                        "rgb(239 68 68)"
                                                    } else {
                                                        "rgb(156 163 175)"
                                                    },
                                                )
                                            >
                                                {price_change_formatted}
                                            </p>
                                        </div>
                                    </A>
                                }
                            })
                            .collect_view()}
                        {if has_rhea_balance && !rhea_total_is_significant {
                            view! {
                                <RheaBalanceCard
                                    rhea_tokens=rhea_tokens.clone()
                                    total_usd=rhea_total_usd.clone()
                                />
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }}
                        <Show when={move || visible_token_count > 5}>
                            <A
                                href="/settings/developer/create_token"
                                attr:class="flex items-center justify-between bg-neutral-900 rounded-xl p-4 hover:bg-neutral-800 transition-colors gap-4 mobile-ripple cursor-pointer"
                            >
                                <div class="flex items-center gap-3 wrap-anywhere">
                                    <div class="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-gray-300">
                                        <Icon icon=icondata::LuPlus width="20" height="20" />
                                    </div>
                                    <div>
                                        <span class="text-white text-lg font-medium">
                                            "Create Your Own Token"
                                        </span>
                                        <p class="text-gray-400 text-sm">
                                            "Available in Developer Settings"
                                        </p>
                                    </div>
                                </div>
                                <Icon
                                    icon=icondata::LuChevronRight
                                    width="20"
                                    height="20"
                                    attr:class="text-gray-400"
                                />
                            </A>
                        </Show>
                        <div class="flex justify-center">
                            <button
                                class="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors no-mobile-ripple cursor-pointer"
                                on:click=toggle_low_balance
                            >
                                {move || {
                                    if config.get().show_low_balance_tokens {
                                        view! {
                                            <Icon icon=icondata::LuEyeOff width="16" height="16" />
                                        }
                                    } else {
                                        view! {
                                            <Icon icon=icondata::LuEye width="16" height="16" />
                                        }
                                    }
                                }}
                                {move || {
                                    if config.get().show_low_balance_tokens {
                                        "Hide Low Balance Tokens"
                                    } else {
                                        "Show Low Balance Tokens"
                                    }
                                }}
                            </button>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
