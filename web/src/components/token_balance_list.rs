use std::str::FromStr;

use crate::{
    contexts::{
        config_context::ConfigContext,
        network_context::{Network, NetworkContext},
        search_context::SearchContext,
        tokens_context::{Token, TokenScore, TokensContext},
    },
    utils::{
        balance_to_decimal, format_token_amount, format_usd_value, power_of_10, USDT_DECIMALS,
    },
};
use bigdecimal::{BigDecimal, ToPrimitive};
use leptos::prelude::*;
use leptos_icons::Icon;
use leptos_router::components::A;

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
                    let filtered_tokens = tokens
                        .get()
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
                            if market_cap_is_abnormal && network.get() != Network::Testnet {
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
                    // Probably a bug in price indexer

                    view! {
                        <>
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
                                    } else if token.token.price_usd_raw_24h_ago
                                        > BigDecimal::from(0)
                                    {
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
                                        crate::contexts::tokens_context::Token::Near => {
                                            "near".to_string()
                                        }
                                        crate::contexts::tokens_context::Token::Nep141(
                                            account_id,
                                        ) => account_id.to_string(),
                                    };
                                    let symbol = token.token.metadata.symbol.clone();
                                    let symbol2 = token.token.metadata.symbol.clone();

                                    view! {
                                        <A
                                            href=format!("/token/{}", token_id)
                                            attr:class="flex items-center justify-between bg-neutral-900 rounded-xl p-4 hover:bg-neutral-800 transition-colors gap-4 mobile-ripple"
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
                                .collect_view()} <div class="flex justify-center">
                                <button
                                    class="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors no-mobile-ripple"
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
                        </>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
