use crate::contexts::config_context::ConfigContext;
use crate::contexts::network_context::{Network, NetworkContext};
use crate::contexts::tokens_context::TokenContext;
use crate::utils::format_usd_value;
use leptos::prelude::*;
use web_sys::window;

const USDT_DECIMALS: u32 = 6;

#[component]
pub fn TotalPortfolioValue() -> impl IntoView {
    let TokenContext {
        tokens,
        loading_tokens,
    } = expect_context::<TokenContext>();
    let ConfigContext { set_config, .. } = expect_context::<ConfigContext>();
    let network = expect_context::<NetworkContext>().network;
    let (last_tap, set_last_tap) = signal(0.0);

    let handle_tap = move |_| {
        let now = window()
            .and_then(|w| w.performance())
            .map(|p| p.now())
            .unwrap_or(0.0);
        let time_since_last_tap = now - last_tap.get();

        if time_since_last_tap < 300.0 {
            // 300ms threshold for double tap
            set_config.update(|config| {
                config.amounts_hidden = !config.amounts_hidden;
            });
            set_last_tap(0.0);
        } else {
            set_last_tap(now);
        }
    };

    let display_value = move || {
        if loading_tokens.get() {
            "$-.--".to_string()
        } else {
            let total = tokens.get().iter().fold(0.0, |acc, token| {
                let normalized_balance =
                    token.balance as f64 / 10f64.powi(token.token.metadata.decimals as i32);
                acc + (token.token.price_usd_hardcoded * normalized_balance)
            });
            format_usd_value(total)
        }
    };

    let pnl_24h = move || {
        if loading_tokens.get() {
            (0.0, 0.0)
        } else {
            let (current_total, previous_total) =
                tokens
                    .get()
                    .iter()
                    .fold((0.0, 0.0), |(acc_current, acc_previous), token| {
                        let current_value = (token.token.price_usd_raw
                            / 10f64.powi(USDT_DECIMALS as i32))
                            * token.balance as f64;
                        let previous_value = (token.token.price_usd_raw_24h_ago
                            / 10f64.powi(USDT_DECIMALS as i32))
                            * token.balance as f64;
                        (acc_current + current_value, acc_previous + previous_value)
                    });
            let pnl = current_total - previous_total;
            let pnl_percentage = if previous_total > 0.0 {
                (pnl / previous_total) * 100.0
            } else {
                0.0
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
                    let pnl_class = if pnl > 0.0 {
                        "text-green-500"
                    } else if pnl < 0.0 {
                        "text-red-500"
                    } else {
                        "text-neutral-400"
                    };
                    view! {
                        <span class=pnl_class>
                            {if pnl > 0.0 {
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
