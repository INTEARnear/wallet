use crate::contexts::config_context::ConfigContext;
use crate::contexts::network_context::{Network, NetworkContext};
use crate::contexts::tokens_context::TokensContext;
use crate::utils::{balance_to_decimal, format_usd_value, power_of_10, USDT_DECIMALS};
use bigdecimal::{BigDecimal, ToPrimitive};
use leptos::prelude::*;
use web_sys::window;

#[component]
pub fn TotalPortfolioValue() -> impl IntoView {
    let TokensContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokensContext>();
    let ConfigContext { set_config, .. } = expect_context::<ConfigContext>();
    let network = expect_context::<NetworkContext>().network;
    let (last_tap, set_last_tap) = signal(0u64);

    let handle_tap = move |_| {
        let now_ms = window()
            .and_then(|w| w.performance())
            .map(|p| p.now() as u64)
            .unwrap_or(0);
        let last_tap_time = last_tap.get();
        let time_since_last_tap_ms = if now_ms > last_tap_time {
            now_ms - last_tap_time
        } else {
            u64::MAX
        };

        if time_since_last_tap_ms < 300 {
            // 300ms threshold for double tap
            set_config.update(|config| {
                config.amounts_hidden = !config.amounts_hidden;
            });
        }
        set_last_tap.set(now_ms);
    };

    let display_value = move || {
        if loading_tokens.get() {
            "$-.--".to_string()
        } else {
            let total = tokens.get().iter().fold(BigDecimal::from(0), |acc, token| {
                let normalized_balance =
                    balance_to_decimal(token.balance, token.token.metadata.decimals);
                acc + (&token.token.price_usd_hardcoded * &normalized_balance)
            });
            format_usd_value(total)
        }
    };

    let pnl_24h = move || {
        if loading_tokens.get() {
            (BigDecimal::from(0), BigDecimal::from(0))
        } else {
            let (current_total, previous_total) = tokens.get().iter().fold(
                (BigDecimal::from(0), BigDecimal::from(0)),
                |(acc_current, acc_previous), token| {
                    let usdt_decimals_decimal = power_of_10(USDT_DECIMALS);
                    let current_value =
                        (&token.token.price_usd_raw / &usdt_decimals_decimal) * token.balance;
                    let previous_value = (&token.token.price_usd_raw_24h_ago
                        / &usdt_decimals_decimal)
                        * token.balance;
                    (acc_current + current_value, acc_previous + previous_value)
                },
            );
            let pnl = &current_total - &previous_total;
            let pnl_percentage = if previous_total > BigDecimal::from(0) {
                (&pnl / &previous_total) * BigDecimal::from(100)
            } else {
                BigDecimal::from(0)
            };
            (pnl, pnl_percentage)
        }
    };

    view! {
        <div class="text-center mb-8">
            <h1
                class="text-white text-4xl min-[400px]:text-5xl sm:text-6xl font-semibold tracking-wider cursor-pointer select-none hover:text-neutral-200 py-8 transition-all duration-100 wrap-anywhere"
                on:click=handle_tap
            >
                {display_value}
            </h1>
            {move || {
                if network.get() == Network::Testnet {
                    view! {
                        <div class="text-yellow-500 text-sm font-medium mb-4">
                            This is a testnet account. Assets have no real value.
                        </div>
                    }
                        .into_any()
                } else {
                    ().into_any()
                }
            }}
            <div class="text-neutral-400 text-lg">
                {move || {
                    let (pnl, _) = pnl_24h();
                    let pnl_f64 = pnl.to_f64().unwrap_or(0.0);
                    let pnl_class = if pnl_f64 > 0.0 {
                        "text-green-500"
                    } else if pnl_f64 < 0.0 {
                        "text-red-500"
                    } else {
                        "text-neutral-400"
                    };
                    view! {
                        <span class=pnl_class>
                            {if pnl_f64 > 0.0 {
                                format!("+{}", format_usd_value(pnl))
                            } else {
                                format_usd_value(pnl)
                            }}
                        </span>
                    }
                }}
            </div>
        </div>
    }
}
