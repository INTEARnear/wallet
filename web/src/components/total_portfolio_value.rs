use crate::components::swap_for_gas_modal::{
    MIN_NEAR_BALANCE_FOR_GAS, MIN_TOKEN_VALUE_USD, SWAP_FOR_GAS_WHITELIST, SwapForGasModal,
};
use crate::contexts::config_context::ConfigContext;
use crate::contexts::modal_context::ModalContext;
use crate::contexts::network_context::{Network, NetworkContext};
use crate::contexts::tokens_context::{Token, TokensContext};
use crate::utils::{USDT_DECIMALS, balance_to_decimal, format_usd_value, is_tauri, power_of_10};
use bigdecimal::{BigDecimal, ToPrimitive};
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use std::str::FromStr;

#[component]
pub fn TotalPortfolioValue() -> impl IntoView {
    let TokensContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokensContext>();
    let ConfigContext {
        config, set_config, ..
    } = expect_context::<ConfigContext>();
    let ModalContext { modal } = expect_context::<ModalContext>();
    let network = expect_context::<NetworkContext>().network;
    let (last_tap, set_last_tap) = signal(0u64);

    let storage_persisted = LocalResource::new(|| async {
        if is_tauri() {
            return true;
        }
        match window()
            .navigator()
            .storage()
            .persisted()
            .map(wasm_bindgen_futures::JsFuture::from)
        {
            Ok(persisted) => persisted
                .await
                .ok()
                .and_then(|v| v.as_bool())
                .unwrap_or(true),
            Err(_) => true,
        }
    });

    let handle_tap = move |_| {
        let now_ms = window().performance().map(|p| p.now() as u64).unwrap_or(0);
        let last_tap_time = last_tap.get();
        let time_since_last_tap_ms = if now_ms > last_tap_time {
            now_ms - last_tap_time
        } else {
            u64::MAX
        };

        if time_since_last_tap_ms < 500 {
            // 500ms threshold for double tap
            set_config.update(|config| {
                config.amounts_hidden = !config.amounts_hidden;
            });
            set_last_tap.set(0);
        } else {
            set_last_tap.set(now_ms);
        }
    };

    let has_non_zero_balance = move || {
        if loading_tokens.get() {
            false
        } else {
            let total = tokens.get().iter().fold(BigDecimal::from(0), |acc, token| {
                let normalized_balance =
                    balance_to_decimal(token.balance, token.token.metadata.decimals);
                acc + (&token.token.price_usd_hardcoded * &normalized_balance)
            });
            total > BigDecimal::from(0)
        }
    };

    let should_show_swap_for_gas = move || {
        if !matches!(network.get(), Network::Mainnet) {
            return false;
        }

        if loading_tokens.get() {
            return false;
        }

        let token_list = tokens.get();

        let near_token = token_list
            .iter()
            .find(|t| t.token.account_id == Token::Near);

        let near_balance = near_token
            .map(|t| balance_to_decimal(t.balance, 24))
            .unwrap_or_default();

        if near_balance >= BigDecimal::from_str(MIN_NEAR_BALANCE_FOR_GAS).unwrap() {
            return false;
        }

        token_list.iter().any(|token_data| {
            if let Token::Nep141(account_id) = &token_data.token.account_id {
                if account_id.as_str() == "wrap.near" {
                    return token_data.balance > 0;
                }

                if SWAP_FOR_GAS_WHITELIST.contains(&account_id.as_str()) {
                    let normalized_balance =
                        balance_to_decimal(token_data.balance, token_data.token.metadata.decimals);
                    let usd_value = &token_data.token.price_usd_hardcoded * &normalized_balance;
                    return usd_value > BigDecimal::from_str(MIN_TOKEN_VALUE_USD).unwrap();
                }
            }
            false
        })
    };

    let open_swap_for_gas_modal = move |_| {
        modal.set(Some(Box::new(move || {
            view! { <SwapForGasModal /> }.into_any()
        })));
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
        <div class="text-center mb-4">
            <h1
                class="text-white text-4xl min-[400px]:text-5xl sm:text-6xl font-semibold tracking-wider cursor-pointer select-none hover:text-neutral-200 pt-8 pb-2 transition-all duration-100 wrap-anywhere"
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

            <div class="mt-4 mx-auto space-y-2">
                <Show when=move || {
                    has_non_zero_balance() && storage_persisted.get() == Some(false)
                        && !config.get().storage_persistence_warning_dismissed
                }>
                    <div>
                        <A
                            href="/settings/security#storage"
                            attr:class="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 transition-colors cursor-pointer"
                        >
                            <Icon icon=icondata::LuTriangleAlert width="16" height="16" />
                            <span class="text-xs font-medium">"Enable Persistent Storage"</span>
                        </A>
                    </div>
                </Show>
                <Show when=move || should_show_swap_for_gas()>
                    <div>
                        <button
                            class="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
                            on:click=open_swap_for_gas_modal
                        >
                            <Icon icon=icondata::LuArrowLeftRight width="16" height="16" />
                            <span class="text-xs font-medium">"Swap For Gas"</span>
                        </button>
                    </div>
                </Show>
            </div>
        </div>
    }
}
