use std::{
    collections::HashMap,
    fmt::{self, Display},
    num::NonZeroU64,
    str::FromStr,
    time::Duration,
};

use bigdecimal::{BigDecimal, FromPrimitive, RoundingMode, Zero, num_bigint::Sign};
use codee::string::FromToStringCodec;
use futures_channel::oneshot;
use leptos::prelude::AnyView;
use leptos::prelude::*;
use leptos_icons::Icon;
use leptos_router::{components::A, hooks::use_location, location::Location};
use leptos_use::{
    ReconnectLimit, UseWebSocketOptions, core::ConnectionReadyState, use_websocket_with_options,
};
use near_min_api::{
    QueryFinality, RpcClient,
    types::{
        AccountId, AccountIdRef, Action, Balance, CryptoHash, Finality, U128,
        near_crypto::PublicKey,
    },
    utils::dec_format,
};
use serde::{Deserialize, Serialize};

use crate::{
    components::{
        danger_confirm_input::DangerConfirmInput, token_selector::TokenSelector, tooltip::Tooltip,
    },
    contexts::{
        accounts_context::{Account, AccountsContext},
        config_context::ConfigContext,
        modal_context::ModalContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        tokens_context::{Token, TokenBalanceSource, TokenData, TokenInfo, TokensContext},
        transaction_queue_context::{EnqueuedTransaction, OverlayMode, TransactionQueueContext},
    },
    pages::settings::SLIPPAGE_PRESETS,
    translations::TranslationKey,
    utils::{
        balance_to_decimal, decimal_to_balance, fetch_token_info, format_token_amount,
        format_token_amount_no_hide, format_usd_value_no_hide,
    },
};

// 0.01%
const SWAP_FEE: f64 = 0.0001;
const SWAP_FEE_RECIPIENT: &str = "wallet.intear.near";

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
pub struct SwapConfirmation {
    // A confirmation is bound to the identity that requested the quote.
    pub trader_account_id: AccountId,
    pub signing_public_key: PublicKey,
    pub network: Network,
    pub token_in: TokenInfo,
    pub token_out: TokenInfo,
    /// For ExactIn: the exact input amount. For ExactOut: the estimated input amount.
    pub amount_in: Balance,
    /// For ExactIn: the estimated output amount. For ExactOut: the exact output amount.
    pub estimated_amount_out: Balance,
    /// For ExactIn: same as amount_in. For ExactOut: the worst-case (maximum) input amount.
    pub worst_case_amount_in: Balance,
    /// For ExactIn: the worst-case (minimum) output amount. For ExactOut: same as estimated_amount_out.
    pub worst_case_amount_out: Balance,
    pub route: Route,
    pub swap_mode: SwapMode,
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
    view! {
        <Show
            when=move || network.get() == Network::Mainnet
            fallback=move || view! { <SwapUnavailable/> }
        >
            <SwapMainnet/>
        </Show>
    }
}

#[component]
fn SwapUnavailable() -> impl IntoView {
    view! {
        <div class="flex flex-col items-center justify-center h-full p-8 text-center">
            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <Icon icon=icondata::LuCircleX attr:class="w-8 h-8 text-red-500"/>
            </div>
            <h2 class="text-xl font-bold text-white mb-2">
                {move || TranslationKey::PagesSwapMainnetOnlyTitle.format(&[])}
            </h2>
            <p class="text-gray-400 max-w-md mb-6">
                {move || TranslationKey::PagesSwapMainnetOnlyDescription.format(&[])}
            </p>
            <A href="/" attr:class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer">
                {move || TranslationKey::PagesSwapGoBack.format(&[])}
            </A>
        </div>
    }
}

#[component]
fn SwapMainnet() -> impl IntoView {
    let TokensContext { tokens, .. } = expect_context::<TokensContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    let Location { query, .. } = use_location();

    let initial_query = query.get_untracked();
    let (selected_token_in, set_selected_token_in) = signal(
        initial_query
            .get("from")
            .and_then(|value| value.parse().ok())
            .unwrap_or(Token::Near),
    );
    let (selected_token_out, set_selected_token_out) = signal(
        initial_query
            .get("to")
            .and_then(|value| value.parse().ok())
            .unwrap_or_else(|| Token::Nep141("token.intear.near".parse().unwrap())),
    );
    let account_key = Memo::new(move |_| {
        accounts.with(|state| {
            let id = state.selected_account_id.as_ref()?;
            let account = state
                .accounts
                .iter()
                .find(|account| &account.account_id == id)?;
            (account.network == Network::Mainnet)
                .then(|| (account.account_id.clone(), account.network.clone()))
        })
    });
    let token_in = use_swap_token(selected_token_in, tokens.into(), account_key);
    let token_out = use_swap_token(selected_token_out, tokens.into(), account_key);

    let (show_slippage_settings, set_show_slippage_settings) = signal(false);
    let (custom_slippage_input, set_custom_slippage_input) =
        signal(match config.get_untracked().slippage {
            Slippage::Auto { .. } => "".to_string(),
            Slippage::Fixed { slippage } => (slippage * BigDecimal::from(100))
                .normalized()
                .to_plain_string(),
        });

    let ModalContext { modal } = expect_context::<ModalContext>();
    let (show_advanced_options, set_show_advanced_options) = signal(false);

    let (selected_dexes, set_selected_dexes) = signal(vec![
        DexId::Rhea,
        DexId::Wrap,
        DexId::RheaDcl,
        DexId::IntearDex,
    ]);

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

        if amount_decimal <= 0 {
            return None;
        }

        let decimals = token_data.token.metadata.decimals;
        let amount_raw = decimal_to_balance(amount_decimal, decimals);

        Some(amount_raw)
    });

    // Compare the serialized request so balance and unrelated config updates don't resend it.
    let route_query = Memo::new(move |_| {
        let token_in = token_in.get()?.token.account_id;
        let token_out = token_out.get()?.token.account_id;
        let amount_raw = validated_amount_entered.get()?;
        let (trader_account_id, signing_public_key) = accounts.with(|state| {
            let id = state.selected_account_id.as_ref()?;
            let account = state
                .accounts
                .iter()
                .find(|account| &account.account_id == id)?;
            (account.network == Network::Mainnet)
                .then(|| (account.account_id.clone(), account.secret_key.public_key()))
        })?;
        let dexes = selected_dexes.get();
        let request = SwapRequest {
            token_in: token_in.into(),
            token_out: token_out.into(),
            amount: match swap_mode_memo.get() {
                SwapMode::ExactIn => Amount::AmountIn(amount_raw),
                SwapMode::ExactOut => Amount::AmountOut(amount_raw),
            },
            slippage: config.get().slippage,
            dexes: if dexes.is_empty() { None } else { Some(dexes) },
            trader_account_id: Some(trader_account_id),
            signing_public_key: Some(signing_public_key),
            referrer_id: Some(SWAP_FEE_RECIPIENT.parse().unwrap()),
            fees: Some(HashMap::from([(
                SWAP_FEE_RECIPIENT.parse().unwrap(),
                SWAP_FEE,
            )])),
        };
        Some(serde_urlencoded::to_string(request).unwrap())
    });

    let router_url = Memo::new(move |_| {
        config
            .get()
            .custom_router_url
            .unwrap_or_else(|| dotenvy_macro::dotenv!("ROUTER_URL").to_string())
            .trim_end_matches('/')
            .to_string()
    });
    let router_ws_url =
        Memo::new(move |_| format!("{}/route/subscribe", router_url().replacen("http", "ws", 1)));
    let (routes, is_fetching_route) = use_route_subscription(router_ws_url, route_query);
    let best_route = move || {
        routes.with(|result| {
            result
                .as_ref()
                .and_then(|result| result.as_ref().ok())
                .and_then(|routes| routes.first().cloned())
        })
    };
    let has_route =
        move || routes.with(|result| matches!(result, Some(Ok(routes)) if !routes.is_empty()));

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
                    if let (Some(Ok(routes)), Some(input_token)) = (routes.get(), token_in.get()) {
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

    let get_input_style = move |is_from_field: bool| -> String {
        let current_mode = swap_mode_memo.get();
        let is_editable = match (is_from_field, current_mode) {
            (true, SwapMode::ExactIn) => true,   // From field in ExactIn mode
            (false, SwapMode::ExactOut) => true, // To field in ExactOut mode
            _ => false,                          // All other combinations are read-only
        };

        let no_routes_found = match routes.get() {
            Some(Ok(routes)) => routes.is_empty(),
            _ => false,
        };

        let is_loading = is_fetching_route.get() && routes.get().is_none();

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

    // The amount the max button set, which for NEAR leaves out what the route needs for gas and
    // storage, so it's re-quoted whenever the route changes. It only goes down, so routes
    // flipping between amounts can't loop
    let (max_input_amount, set_max_input_amount) = signal::<Option<String>>(None);

    Effect::new(move |_| {
        let Some(route) = best_route() else {
            return;
        };
        let Some(token) = token_in.get() else {
            return;
        };
        let is_max_near_input = swap_mode_memo.get() == SwapMode::ExactIn
            && token.token.account_id == Token::Near
            && max_input_amount.get().as_ref() == Some(&amount_entered.get());
        if !is_max_near_input {
            return;
        }
        let required = route.gas_reserve() + route.storage_deposits;
        // Keeps the amount so the missing NEAR error shows
        if token.balance <= required {
            return;
        }
        let max_amount_in = token.balance - required;
        let Some(amount_in) = validated_amount_entered.get() else {
            return;
        };
        if max_amount_in >= amount_in {
            return;
        }
        let amount = balance_to_decimal(max_amount_in, token.token.metadata.decimals)
            .normalized()
            .to_plain_string();
        set_max_input_amount.set(Some(amount.clone()));
        set_amount_entered.set(amount);
    });

    // NEAR the wallet needs for the route's gas reserve and storage deposits, and for the input
    // if it's NEAR, or None if it has enough
    let missing_near = Memo::new(move |_| {
        let route = best_route()?;
        let token = token_in.get()?;
        let mut required = route.gas_reserve() + route.storage_deposits;
        if token.token.account_id == Token::Near {
            required += match swap_mode_memo.get() {
                SwapMode::ExactIn => validated_amount_entered.get()?,
                SwapMode::ExactOut => {
                    let Amount::AmountIn(worst_case_amount_in) = route.worst_case_amount else {
                        return None;
                    };
                    worst_case_amount_in
                }
            };
        }
        let near_balance = tokens
            .read()
            .iter()
            .find(|token| token.token.account_id == Token::Near)?
            .balance;
        (near_balance < required).then_some(required)
    });

    let handle_amount_change = move |value: String, mode: SwapMode| {
        set_amount_entered.set(value);
        set_swap_mode.set(mode);
    };

    let handle_reverse = move |_| {
        let current_token_in = selected_token_in.get_untracked();
        let current_token_out = selected_token_out.get_untracked();
        set_selected_token_in.set(current_token_out);
        set_selected_token_out.set(current_token_in);
        handle_amount_change(
            amount_entered.get(),
            match swap_mode_memo.get() {
                SwapMode::ExactIn => SwapMode::ExactOut,
                SwapMode::ExactOut => SwapMode::ExactIn,
            },
        );
    };

    // Keep numeric values numeric until the final display conversion.
    let estimated_amount = Memo::new(move |_| {
        let estimated = routes.with(|result| {
            result
                .as_ref()
                .and_then(|result| result.as_ref().ok())
                .and_then(|routes| routes.first())
                .map(|route| route.estimated_amount)
        })?;
        match (estimated, swap_mode.get()) {
            (Amount::AmountIn(amount), SwapMode::ExactOut) => Some(balance_to_decimal(
                amount,
                token_in.get()?.token.metadata.decimals,
            )),
            (Amount::AmountOut(amount), SwapMode::ExactIn) => Some(balance_to_decimal(
                amount,
                token_out.get()?.token.metadata.decimals,
            )),
            _ => None,
        }
    });
    let get_estimated_amount = move || estimated_amount.get().map(round_precision_or_significant);
    let numeric_input = Memo::new(move |_| match swap_mode.get() {
        SwapMode::ExactIn => Some(balance_to_decimal(
            validated_amount_entered.get()?,
            token_in.get()?.token.metadata.decimals,
        )),
        SwapMode::ExactOut => estimated_amount.get(),
    });
    let numeric_output = Memo::new(move |_| match swap_mode.get() {
        SwapMode::ExactOut => Some(balance_to_decimal(
            validated_amount_entered.get()?,
            token_out.get()?.token.metadata.decimals,
        )),
        SwapMode::ExactIn => estimated_amount.get(),
    });
    let input_usd =
        Memo::new(move |_| Some(numeric_input.get()? * token_in.get()?.token.price_usd_hardcoded));
    let output_usd = Memo::new(move |_| {
        Some(numeric_output.get()? * token_out.get()?.token.price_usd_hardcoded)
    });
    let price_impact = Memo::new(move |_| swap_price_impact(input_usd.get()?, output_usd.get()?));

    let TransactionQueueContext {
        add_transaction,
        overlay_mode,
        ..
    } = expect_context::<TransactionQueueContext>();

    // The action owns its asynchronous execution. Navigating away disables new submissions,
    // but does not cancel transactions that have already been submitted to the queue.
    let page_alive = ArcRwSignal::new(true);
    on_cleanup({
        let page_alive = page_alive.clone();
        move || page_alive.set(false)
    });
    let execute_swap = leptos::prelude::Action::new_unsync(
        move |(confirmation, account): &(SwapConfirmation, Account)| {
            let confirmation = confirmation.clone();
            let account = account.clone();
            let router_url = router_url.get_untracked();
            async move {
                execute_route(
                    match confirmation.swap_mode {
                        SwapMode::ExactIn => confirmation.amount_in,
                        SwapMode::ExactOut => confirmation.estimated_amount_out,
                    },
                    confirmation.swap_mode,
                    confirmation.token_in,
                    confirmation.token_out,
                    confirmation.route,
                    account,
                    add_transaction,
                    overlay_mode,
                    router_url,
                    modal,
                )
                .await;
            }
        },
    );
    let swap_pending = execute_swap.pending();
    // This callback may live in the global modal after the page has been disposed.
    // Check the independently-owned lifetime flag before touching page-owned signals.
    let can_submit: std::sync::Arc<dyn Fn() -> bool + Send + Sync> = {
        let page_alive = page_alive.clone();
        std::sync::Arc::new(move || page_alive.get() && !swap_pending.get())
    };
    let submit_swap: std::rc::Rc<dyn Fn(SwapConfirmation)> = {
        let page_alive = page_alive.clone();
        std::rc::Rc::new(move |confirmation| {
            if !page_alive.get_untracked() || swap_pending.get_untracked() {
                return;
            }
            let account = accounts.with_untracked(|state| {
                let id = state.selected_account_id.as_ref()?;
                state
                    .accounts
                    .iter()
                    .find(|account| &account.account_id == id)
                    .cloned()
            });
            let Some(account) = account else {
                return;
            };
            let valid_identity = account.account_id == confirmation.trader_account_id
                && account.network == confirmation.network
                && account.secret_key.public_key() == confirmation.signing_public_key;
            if !valid_identity {
                log::warn!("Swap confirmation is stale; request a new quote");
                modal.set(Some(Box::new(move || {
                    view! { <SwapErrorModal error=None/> }.into_any()
                })));
                return;
            }
            modal.set(None);
            execute_swap.dispatch_local((confirmation, account));
            set_swap_mode.set(SwapMode::ExactIn);
            set_amount_entered.set(String::new());
            set_max_input_amount.set(None);
        })
    };

    view! {
            <div class="max-w-lg mx-auto min-h-full flex flex-col">
                <div class="flex items-start justify-center flex-1">
                    <div class="w-full mt-8">
                        <div class="bg-neutral-900 rounded-2xl p-4 space-y-4 relative">
                            <div class="absolute -top-4 right-4">
                                <button
                                    class="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg px-2 py-1 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    on:click=move |_| {
                                        set_show_slippage_settings
                                            .set(!show_slippage_settings.get())
                                    }
                                >
                                    <Icon icon=icondata::LuSettings width="16" height="16" />
                                    <span>{move || format!("{}", config.get().slippage)}</span>
                                </button>

                                <Show when=move || show_slippage_settings.get()>
                                    <>
                                        <div
                                            class="fixed inset-0 z-5"
                                            on:click=move |_| set_show_slippage_settings.set(false)
                                        ></div>
                                        <div
                                            class="absolute top-8 right-0 bg-neutral-800 rounded-xl p-3 shadow-lg border border-neutral-700 z-10 w-48"
                                            on:click=|ev| ev.stop_propagation()
                                        >
                                            <div class="text-white text-sm font-medium mb-3">
                                                {move || {
                                                    TranslationKey::PagesSwapSlippageTolerance.format(&[])
                                                }}
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
                                                        config
                                                            .update(|c| {
                                                                c.slippage = Slippage::default();
                                                            });
                                                        set_custom_slippage_input.set("".to_string());
                                                    }
                                                >
                                                    {move || TranslationKey::PagesSwapSlippageAuto.format(&[])}
                                                </button>
                                            </div>
                                            <div class="grid grid-cols-2 gap-2 mb-3">
                                                {SLIPPAGE_PRESETS
                                                    .into_iter()
                                                    .map(|percentage| {
                                                        let is_selected = move || {
                                                            if let Slippage::Fixed { slippage } = config.get().slippage
                                                            {
                                                                slippage == BigDecimal::from_f64(percentage).unwrap() / 100
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
                                                                    config
                                                                        .update(|c| {
                                                                            c.slippage = Slippage::Fixed {
                                                                                slippage: BigDecimal::from_f64(percentage).unwrap() / 100,
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
                                                <div class="text-gray-400 text-xs">
                                                    {move || {
                                                        TranslationKey::PagesSwapSlippageCustom.format(&[])
                                                    }}
                                                </div>
                                                <div class="flex gap-2">
                                                    <input
                                                        type="text"
                                                        class="flex-1 bg-neutral-700 text-white rounded-lg px-2 py-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                                                        placeholder="0-100"
                                                        prop:value=custom_slippage_input
                                                        on:input=move |ev| {
                                                            let value = event_target_value(&ev);
                                                            set_custom_slippage_input.set(value.clone());
                                                            if let Ok(percentage) = value.parse::<BigDecimal>() {
                                                                let percentage = percentage
                                                                    .clamp(
                                                                        BigDecimal::from_str("0.01").unwrap(),
                                                                        BigDecimal::from(100),
                                                                    );
                                                                config
                                                                    .update(|c| {
                                                                        c.slippage = Slippage::Fixed {
                                                                            slippage: percentage / 100,
                                                                        };
                                                                    });
                                                            }
                                                        }
                                                    />
                                                    <span class="text-gray-400 text-sm self-center">"%"</span>
                                                </div>
                                            </div>
                                            <div class="mt-3 text-xs text-gray-400">
                                                {move || TranslationKey::PagesSwapSlippageHelp.format(&[])}
                                            </div>
                                        </div>
                                    </>
                                </Show>
                            </div>

                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <label class="text-gray-400 text-sm">
                                        {move || TranslationKey::PagesSwapLabelFrom.format(&[])}
                                    </label>
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
                                    <SwapTokenSelector
                                        selected_token=token_in
                                        on_select=move |token: TokenData| {
                                            set_selected_token_in.set(token.token.account_id);
                                            set_amount_entered.set("".to_string());
                                        }
                                        placeholder=move || {
                                            TranslationKey::PagesSwapSelectToken.format(&[])
                                        }
                                        allow_native_near=true
                                    />

                                    <div class="flex-1 relative">
                                        <div class="relative">
                                            <input
                                                type="text"
                                                class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 text-base"
                                                style=move || get_input_style(true)
                                                prop:placeholder=move || {
                                                    let no_input = validated_amount_entered.get().is_none();
                                                    let no_routes_found = match routes.get() {
                                                        Some(Ok(routes)) => routes.is_empty(),
                                                        _ => false,
                                                    };
                                                    if no_routes_found {
                                                        return "-".to_string();
                                                    }
                                                    match swap_mode_memo.get() {
                                                        SwapMode::ExactIn => "0.0".to_string(),
                                                        SwapMode::ExactOut if no_input => "0.0".to_string(),
                                                        SwapMode::ExactOut => {
                                                            TranslationKey::PagesSwapLoading.format(&[])
                                                        }
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
                                                        let amount = balance_to_decimal(
                                                                token.balance,
                                                                token.token.metadata.decimals,
                                                            )
                                                            .normalized()
                                                            .to_plain_string();
                                                        set_max_input_amount.set(Some(amount.clone()));
                                                        handle_amount_change(amount, SwapMode::ExactIn);
                                                    }
                                                }
                                            >
                                                {move || TranslationKey::PagesSwapMaxButton.format(&[])}
                                            </button>
                                        </div>
                                        {move || input_usd.get().map(|amount| view! {
                                            <div class="absolute right-3 -bottom-5 text-xs text-gray-400">
                                                {format_usd_value_no_hide(amount)}
                                            </div>
                                        })}
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
                                    <label class="text-gray-400 text-sm">
                                        {move || TranslationKey::PagesSwapLabelTo.format(&[])}
                                    </label>
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
                                    <SwapTokenSelector
                                        selected_token=token_out
                                        on_select=move |token: TokenData| {
                                            set_selected_token_out.set(token.token.account_id);
                                            set_amount_entered.set("".to_string());
                                        }
                                        placeholder=move || {
                                            TranslationKey::PagesSwapSelectToken.format(&[])
                                        }
                                        allow_native_near=true
                                    />

                                    <div class="flex-1 relative">
                                        <input
                                            type="text"
                                            class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 text-base"
                                            style=move || get_input_style(false)
                                            prop:placeholder=move || {
                                                let no_input = validated_amount_entered.get().is_none();
                                                let no_routes_found = match routes.get() {
                                                    Some(Ok(routes)) => routes.is_empty(),
                                                    _ => false,
                                                };
                                                if no_routes_found {
                                                    return "-".to_string();
                                                }
                                                match swap_mode_memo.get() {
                                                    SwapMode::ExactIn if no_input => "0.0".to_string(),
                                                    SwapMode::ExactIn => {
                                                        TranslationKey::PagesSwapLoading.format(&[])
                                                    }
                                                    SwapMode::ExactOut => "0.0".to_string(),
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
                                        {move || output_usd.get().map(|amount| view! {
                                            <div class="absolute right-3 -bottom-5 text-xs text-gray-400">
                                                {format_usd_value_no_hide(amount)}
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>

                            {move || {
                                let has_amount = validated_amount_entered.get().is_some();
                                let is_loading = is_fetching_route.get() && routes.get().is_none();
                                if !has_amount {
                                    view! {
                                        <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                            <span class="text-gray-400 font-medium text-sm">
                                                {move || TranslationKey::PagesSwapEnterAmount.format(&[])}
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                } else if is_loading {
                                    view! {
                                        <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                            <span class="text-white font-medium text-sm">
                                                {move || {
                                                    TranslationKey::PagesSwapFetchingBestRoute.format(&[])
                                                }}
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                } else if let Some(Ok(routes)) = routes.get() {
                                    if let Some(best_route) = routes.first() {
                                        view! {
                                            <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3 w-full min-h-[56px]">
                                                {match best_route.dex_id {
                                                    DexId::Rhea => {
                                                        view! {
                                                            <img
                                                                src="/rhea.svg"
                                                                alt=move || pages_swap_dex_label(DexId::Rhea)
                                                                class="w-auto h-8"
                                                            />
                                                        }
                                                            .into_any()
                                                    }
                                                    DexId::RheaDcl => {
                                                        view! {
                                                            <img
                                                                src="/rhea.svg"
                                                                alt=move || pages_swap_dex_label(DexId::RheaDcl)
                                                                class="w-auto h-8"
                                                            />
                                                        }
                                                            .into_any()
                                                    }
                                                    DexId::Wrap => {
                                                        view! {
                                                            <span class="text-white font-medium text-sm">
                                                                {move || {
                                                                    TranslationKey::PagesSwapRouteWrapDirectly.format(&[])
                                                                }}
                                                            </span>
                                                        }
                                                            .into_any()
                                                    }
                                                    DexId::IntearDex => {
                                                        view! {
                                                            <div class="flex items-center gap-2">
                                                                <img
                                                                    src="/intear.svg"
                                                                    alt=move || pages_swap_dex_label(DexId::IntearDex)
                                                                    class="w-auto h-8"
                                                                />
                                                                <span class="text-white font-medium text-sm">
                                                                    {move || TranslationKey::PagesSwapRouteIntearDex.format(&[])}
                                                                </span>
                                                            </div>
                                                        }
                                                            .into_any()
                                                    }
                                                }} <div class="flex items-center gap-2">
                                                    <span class="text-white font-medium text-sm">
                                                        {move || TranslationKey::PagesSwapBestRoute.format(&[])}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        view! {
                                            <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                                <div class="text-center">
                                                    <div class="text-red-400 text-sm font-medium mb-1">
                                                        {move || TranslationKey::PagesSwapNoRoutesTitle.format(&[])}
                                                    </div>
                                                    <div class="text-red-300 text-xs">
                                                        {move || {
                                                            match swap_mode_memo.get() {
                                                                SwapMode::ExactOut => {
                                                                    TranslationKey::PagesSwapNoRoutesHintExactOut.format(&[])
                                                                }
                                                                SwapMode::ExactIn => {
                                                                    TranslationKey::PagesSwapNoRoutesHintExactIn.format(&[])
                                                                }
                                                            }
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    }
                                } else if let Some(Err(error)) = routes.get() {
                                    view! {
                                        <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                            <span class="text-red-400 font-medium text-sm text-center">
                                                {move || {
                                                    TranslationKey::PagesSwapRouterConnectionError
                                                        .format(&[("error", &error)])
                                                }}
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    // Fallback case
                                    view! {
                                        <div class="bg-neutral-800 rounded-lg px-4 py-3 flex items-center justify-center gap-3 w-full min-h-[56px]">
                                            <span class="text-gray-400 font-medium text-sm">
                                                {move || TranslationKey::PagesSwapEnterAmount.format(&[])}
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                }
                            }}

                            <button
                                class="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:from-neutral-600 disabled:to-neutral-700 text-white rounded-xl px-4 py-4 font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                                disabled=move || {
                                    swap_pending.get() || token_in.get().is_none() || token_out.get().is_none()
                                        || amount_entered.get().is_empty()
                                        || validated_amount_entered.get().is_none()
                                        || !has_sufficient_balance.get()
                                        || missing_near.get().is_some()
                                        || !has_route()
                                }
                                on:click=move |_| {
                                    if let Some(best_route) = best_route() {
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
                                        let (
                                            amount_in,
                                            estimated_amount_out,
                                            worst_case_amount_in,
                                            worst_case_amount_out,
                                        ) = match swap_mode_memo.get() {
                                            SwapMode::ExactIn => {
                                                match (
                                                    best_route.estimated_amount,
                                                    best_route.worst_case_amount,
                                                ) {
                                                    (
                                                        Amount::AmountOut(estimated),
                                                        Amount::AmountOut(worst_case),
                                                    ) => {
                                                        (
                                                            validated_amount_entered,
                                                            estimated,
                                                            validated_amount_entered,
                                                            worst_case,
                                                        )
                                                    }
                                                    _ => {
                                                        log::error!("Invalid route amounts for ExactIn mode");
                                                        return;
                                                    }
                                                }
                                            }
                                            SwapMode::ExactOut => {
                                                match (
                                                    best_route.estimated_amount,
                                                    best_route.worst_case_amount,
                                                ) {
                                                    (
                                                        Amount::AmountIn(estimated_in),
                                                        Amount::AmountIn(worst_case_in),
                                                    ) => {
                                                        (
                                                            estimated_in,
                                                            validated_amount_entered,
                                                            worst_case_in,
                                                            validated_amount_entered,
                                                        )
                                                    }
                                                    _ => {
                                                        log::error!("Invalid route amounts for ExactOut mode");
                                                        return;
                                                    }
                                                }
                                            }
                                        };
                                        if swap_pending.get_untracked() {
                                            return;
                                        }
                                        let identity = accounts.with_untracked(|state| {
                                            let id = state.selected_account_id.as_ref()?;
                                            let account = state.accounts.iter().find(|account| &account.account_id == id)?;
                                            Some((account.account_id.clone(), account.secret_key.public_key(), account.network.clone()))
                                        });
                                        let Some((trader_account_id, signing_public_key, network)) = identity else { return; };
                                        let requires_impact_confirmation = swap_price_impact(
                                            balance_to_decimal(amount_in, token_in.token.metadata.decimals)
                                                * &token_in.token.price_usd_hardcoded,
                                            balance_to_decimal(estimated_amount_out, token_out.token.metadata.decimals)
                                                * &token_out.token.price_usd_hardcoded,
                                        ).is_some_and(|impact| impact > 10);
                                        let confirmation = SwapConfirmation {
                                            trader_account_id,
                                            signing_public_key,
                                            network,
                                            token_in: token_in.token,
                                            token_out: token_out.token,
                                            amount_in,
                                            estimated_amount_out,
                                            worst_case_amount_in,
                                            worst_case_amount_out,
                                            route: best_route,
                                            swap_mode: swap_mode.get_untracked(),
                                        };
                                        if config.with_untracked(|config| config.swap_confirmation_enabled)
                                            || requires_impact_confirmation
                                        {
                                            let submit_swap = submit_swap.clone();
                                            let can_submit = can_submit.clone();
                                            modal.set(Some(Box::new(move || {
                                                view! {
                                                    <SwapConfirmationModal
                                                        confirmation=confirmation.clone()
                                                        on_confirm=submit_swap.clone()
                                                        can_submit=can_submit.clone()
                                                    />
                                                }.into_any()
                                            })));
                                        } else {
                                            submit_swap(confirmation);
                                        }
                                    }
                                }
                            >
                                {move || {
                                    if swap_pending.get()
                                        || (is_fetching_route.get() && routes.get().is_none()
                                            && validated_amount_entered.get().is_some())
                                        || routes
                                            .get()
                                            .and_then(|routes| routes.ok())
                                            .map(|routes| { routes.is_empty() })
                                            .unwrap_or(false)
                                    {
                                        view! {
                                            <div class="flex items-center justify-center gap-2">
                                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>
                                                    {move || TranslationKey::PagesSwapLoading.format(&[])}
                                                </span>
                                            </div>
                                        }
                                            .into_any()
                                    } else if missing_near.get().is_some() {
                                        view! {
                                            <span>
                                                {move || {
                                                    if best_route()
                                                        .is_some_and(|route| route.storage_deposits > 0)
                                                    {
                                                        TranslationKey::PagesSwapButtonNotEnoughNearForGasAndStorage
                                                            .format(&[])
                                                    } else {
                                                        TranslationKey::PagesSwapButtonNotEnoughNearForGas
                                                            .format(&[])
                                                    }
                                                }}
                                            </span>
                                        }
                                            .into_any()
                                    } else {
                                        view! {
                                            <span>
                                                {move || TranslationKey::PagesSwapButtonSwap.format(&[])}
                                            </span>
                                        }
                                            .into_any()
                                    }
                                }}
                            </button>

                            {move || {
                                let route = best_route();
                                let format_near = |amount: Balance| {
                                    format_token_amount_no_hide(amount, 24, "NEAR")
                                };
                                let gas_fee_tooltip = TranslationKey::PagesSwapGasFeeTooltip
                                    .format(
                                        &[
                                            (
                                                "gas_reserve",
                                                format_near(
                                                        route.as_ref().map_or(0, |route| route.gas_reserve()),
                                                    )
                                                    .as_str(),
                                            ),
                                        ],
                                    );
                                let storage_deposit_tooltip = TranslationKey::PagesSwapStorageDepositTooltip
                                    .format(&[]);
                                let gas_fee = route
                                    .as_ref()
                                    .map_or_else(
                                        || "-".to_string(),
                                        |route| format_near(route.estimated_gas_usage),
                                    );
                                let storage_deposit = route
                                    .as_ref()
                                    .map_or_else(
                                        || "-".to_string(),
                                        |route| format_near(route.storage_deposits),
                                    );
                                view! {
                                    <div class="bg-neutral-800 rounded-lg px-4 py-3 space-y-2 text-sm">
                                        <div class="flex items-center justify-between gap-3">
                                            <span class="text-gray-400">
                                                {TranslationKey::PagesSwapFee.format(&[])}
                                            </span>
                                            <span class="text-white">
                                                {format!("{:.2}%", BigDecimal::from_f64(SWAP_FEE).unwrap() * BigDecimal::from(100))}
                                            </span>
                                        </div>
                                        <div class="flex items-center justify-between gap-3">
                                            <span class="flex items-center gap-1 text-gray-400">
                                                {TranslationKey::PagesSwapGasFee.format(&[])}
                                                <Tooltip text=gas_fee_tooltip />
                                            </span>
                                            <span class="text-white">{gas_fee}</span>
                                        </div>
                                        <Show when=move || route.as_ref().is_some_and(|r| !r.storage_deposits.is_zero())>
                                            <div class="flex items-center justify-between gap-3">
                                                <span class="flex items-center gap-1 text-gray-400">
                                                    {TranslationKey::PagesSwapStorageDeposit.format(&[])}
                                                    <Tooltip text=storage_deposit_tooltip.clone() />
                                                </span>
                                                <span class="text-white">{storage_deposit.clone()}</span>
                                            </div>
                                        </Show>
                                    </div>
                                }
                            }}

                            {move || {
                                let missing_near = missing_near.get()?;
                                let route = best_route()?;
                                let format_near = |amount: Balance| {
                                    format_token_amount_no_hide(amount, 24, "NEAR")
                                };
                                let mut message = TranslationKey::PagesSwapNearRequired
                                    .format(
                                        &[
                                            ("amount", format_near(missing_near).as_str()),
                                            ("gas_reserve", format_near(route.gas_reserve()).as_str()),
                                        ],
                                    );
                                if route.storage_deposits > 0 {
                                    message
                                        += &TranslationKey::PagesSwapNearRequiredStorageDeposit
                                            .format(
                                                &[
                                                    (
                                                        "storage_deposit",
                                                        format_near(route.storage_deposits).as_str(),
                                                    ),
                                                ],
                                            );
                                }
                                if token_in.get()?.token.account_id == Token::Near {
                                    message
                                        += &TranslationKey::PagesSwapNearRequiredPlusSwappedNear
                                            .format(&[]);
                                }
                                message.push('.');
                                Some(
                                    view! {
                                        <div
                                            class="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-300 text-sm"
                                            role="alert"
                                        >
                                            {message}
                                        </div>
                                    },
                                )
                            }}

                            // Advanced Options Section
                            <div>
                                <button
                                    class="w-full flex items-center justify-end gap-1 text-left cursor-pointer transition-colors no-mobile-ripple"
                                    on:click=move |_| {
                                        set_show_advanced_options.set(!show_advanced_options.get())
                                    }
                                >
                                    <span class="text-gray-400 text-sm hover:text-gray-300">
                                        {move || {
                                            TranslationKey::PagesSwapAdvancedOptions.format(&[])
                                        }}
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
                                        <div>
                                            <div class="text-gray-400 text-sm mb-2">
                                                {move || {
                                                    TranslationKey::PagesSwapSectionConfirmation.format(&[])
                                                }}
                                            </div>
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    class="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500 focus:ring-2"
                                                    prop:checked=move || config.get().swap_confirmation_enabled
                                                    on:change=move |ev| {
                                                        let checked = event_target_checked(&ev);
                                                        config
                                                            .update(|c| {
                                                                c.swap_confirmation_enabled = checked;
                                                            });
                                                    }
                                                />
                                                <span class="text-gray-300 text-sm">
                                                    {move || {
                                                        TranslationKey::PagesSwapCheckboxAskConfirmation.format(&[])
                                                    }}
                                                </span>
                                            </label>
                                        </div>
                                        {move || {
                                            if let Some(Ok(routes)) = routes.get() {
                                                if let Some(best_route) = routes.first() {
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
                                                                            {move || {
                                                                                TranslationKey::PagesSwapLabelMaximumSpent.format(&[])
                                                                            }}
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
                                                                            {move || {
                                                                                TranslationKey::PagesSwapLabelMinimumReceived.format(&[])
                                                                            }}
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
                                                                {move || {
                                                                    TranslationKey::PagesSwapLabelMinimumReceived.format(&[])
                                                                }}
                                                            </div>
                                                            <div class="text-white text-sm">"-"</div>
                                                        </div>
                                                    }
                                                        .into_any()
                                                }
                                            } else {
                                                view! {
                                                    <div>
                                                        <div class="text-gray-400 text-xs mb-1">
                                                            {move || {
                                                                TranslationKey::PagesSwapLabelMinimumReceived.format(&[])
                                                            }}
                                                        </div>
                                                        <div class="text-white text-sm">"-"</div>
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                        }}
                                        <div>
                                            <div class="text-gray-400 text-sm mb-2">
                                                {move || {
                                                    TranslationKey::PagesSwapSectionExchanges.format(&[])
                                                }}
                                            </div>
                                            <div class="grid grid-cols-2 gap-2">
                                                {move || {
                                                    let all_dexes = vec![
                                                        DexId::Rhea,
                                                        DexId::RheaDcl,
                                                        DexId::Wrap,
                                                        DexId::IntearDex,
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
                                                                    }
                                                                >
                                                                    {move || pages_swap_dex_label(dex)}
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
                                if let Some(percentage_diff) = price_impact.get() {
                                        let five_percent = 5;
                                        let two_percent = 2;
                                        if percentage_diff > five_percent {
                                            let percentage = format!("{:.1}", percentage_diff);
                                            view! {
                                                <div class="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-center">
                                                    <div class="text-red-400 text-sm font-medium mb-1">
                                                        {move || {
                                                            TranslationKey::PagesSwapHighPriceImpactTitle.format(&[])
                                                        }}
                                                    </div>
                                                    <div class="text-red-300 text-xs">
                                                        {move || {
                                                            TranslationKey::PagesSwapPriceImpactRedDetail
                                                                .format(&[("percent", percentage.as_str())])
                                                        }}
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else if percentage_diff > two_percent {
                                            let percentage = format!("{:.2}", percentage_diff);
                                            view! {
                                                <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg px-4 py-3 text-center">
                                                    <div class="text-yellow-400 text-sm font-medium mb-1">
                                                        {move || {
                                                            TranslationKey::PagesSwapHighPriceImpactTitle.format(&[])
                                                        }}
                                                    </div>
                                                    <div class="text-yellow-300 text-xs">
                                                        {move || {
                                                            TranslationKey::PagesSwapPriceImpactYellowDetail
                                                                .format(&[("percent", percentage.as_str())])
                                                        }}
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
                                alt=move || TranslationKey::PagesSwapBettearAdAlt.format(&[])
                                class="w-full h-auto"
                            />
                        </a>
                    </div>
                </div>
            </div>
    }
}

/// The shared policy for the page, confirmation requirement, and confirmation modal.
fn swap_price_impact(input_usd: BigDecimal, output_usd: BigDecimal) -> Option<BigDecimal> {
    if input_usd <= 0 {
        return None;
    }
    let difference = &input_usd - output_usd;
    (difference.sign() == Sign::Plus).then(|| (difference / input_usd) * 100)
}

/// Selection is independent of metadata and balances. Fetch results never mutate selection
/// or the account's token list, and are accepted only for the current request key.
fn use_swap_token(
    selected: ReadSignal<Token>,
    tokens: Signal<Vec<TokenData>>,
    account_key: Memo<Option<(AccountId, Network)>>,
) -> Signal<Option<TokenData>> {
    let RpcContext { client: rpc_client } = expect_context::<RpcContext>();
    let missing_key = Memo::new(move |_| {
        let (account_id, network) = account_key.get()?;
        let selected = selected.get();
        if tokens.with(|tokens| {
            tokens
                .iter()
                .any(|token| token.token.account_id == selected)
        }) {
            return None;
        }
        match selected {
            Token::Nep141(token_id) => Some((account_id, network, token_id)),
            Token::Near | Token::Rhea(_) => None,
        }
    });
    let metadata = LocalResource::new(move || {
        let key = missing_key.get();
        let rpc = rpc_client.get();
        async move {
            let (account_id, network, token_id) = key?;
            let token = fetch_token_info(token_id.clone(), network.clone()).await?;
            // Metadata success alone does not imply a zero balance.
            let balance =
                get_ft_balance(&account_id, Token::Nep141(token_id.clone()), &rpc).await?;
            Some((
                (account_id, network, token_id),
                TokenData {
                    token,
                    balance,
                    source: TokenBalanceSource::Direct,
                },
            ))
        }
    });
    Signal::derive(move || {
        account_key.get()?;
        let selected = selected.get();
        if let Some(token) = tokens.with(|tokens| {
            tokens
                .iter()
                .find(|token| token.token.account_id == selected)
                .cloned()
        }) {
            return Some(token);
        }
        let current_key = missing_key.get()?;
        let (loaded_key, token) = metadata.get()??;
        (loaded_key == current_key).then_some(token)
    })
}

/// Compatibility boundary for TokenSelector's existing ReadSignal prop. This mirror is
/// display-only: validation and submission always read the derived token data above.
#[component]
fn SwapTokenSelector(
    selected_token: Signal<Option<TokenData>>,
    on_select: impl Fn(TokenData) + Copy + Send + Sync + 'static,
    placeholder: impl Fn() -> String + Copy + Send + Sync + 'static,
    allow_native_near: bool,
) -> impl IntoView {
    let (display_token, set_display_token) = signal(selected_token.get_untracked());
    Effect::watch(
        move || selected_token.get(),
        move |token, _, _| set_display_token.set(token.clone()),
        true,
    );
    view! {
        <TokenSelector
            selected_token=display_token
            on_select=on_select
            placeholder=placeholder
            allow_native_near=allow_native_near
        />
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
    router_url: String,
    modal: RwSignal<Option<Box<dyn Fn() -> AnyView>>, LocalStorage>,
) {
    let description = TranslationKey::MiscTransactionSwap.format(&[
        (
            "token_in",
            &match swap_mode {
                SwapMode::ExactIn => format_token_amount_no_hide(
                    amount,
                    token_in.metadata.decimals,
                    &token_in.metadata.symbol,
                ),
                SwapMode::ExactOut => token_in.metadata.symbol.clone(),
            },
        ),
        (
            "token_out",
            &match swap_mode {
                SwapMode::ExactIn => token_out.metadata.symbol.clone(),
                SwapMode::ExactOut => format_token_amount_no_hide(
                    amount,
                    token_out.metadata.decimals,
                    &token_out.metadata.symbol,
                ),
            },
        ),
    ]);

    let (fee_instructions, swap_instructions): (Vec<_>, Vec<_>) =
        route.execution_instructions.into_iter().partition(
            |ExecutionInstruction::NearTransaction {
                 is_fee_transaction, ..
             }| { *is_fee_transaction },
        );
    let steps = swap_instructions.len() + fee_instructions.len();
    let describe_step = |index: usize| {
        if steps > 1 {
            TranslationKey::MiscTransactionSwapStep.format(&[
                ("description", &description),
                ("step", &(index + 1).to_string()),
                ("steps", &steps.to_string()),
            ])
        } else {
            description.clone()
        }
    };

    let swap_hash_receivers = enqueue_route_transactions(
        swap_instructions,
        describe_step,
        &account.account_id,
        add_transaction,
    );
    // The outcome endpoint waits for the transactions to execute, so the hashes are enough
    let Ok(tx_hashes) = futures_util::future::try_join_all(swap_hash_receivers).await else {
        modal.set(Some(Box::new(move || {
            view! { <SwapErrorModal error=None /> }.into_any()
        })));
        return;
    };

    let token_in_id = TokenId::from(token_in.account_id.clone());
    let token_out_id = TokenId::from(token_out.account_id.clone());
    let tx_hashes = tx_hashes
        .iter()
        .map(|hash| hash.to_string())
        .collect::<Vec<_>>()
        .join(",");
    let outcome_request = |wait_until| SwapOutcomeRequest {
        token_in: &token_in_id,
        token_out: &token_out_id,
        trader_account_id: &account.account_id,
        tx_hashes: &tx_hashes,
        fee_amount: route.fee_amount,
        wait_until,
    };

    let optimistic_outcome =
        match fetch_swap_outcome(&router_url, &outcome_request(OutcomeWaitUntil::Swap)).await {
            Ok(outcome) => outcome,
            Err(error) => {
                log::error!("Failed to fetch swap outcome: {error}");
                modal.set(Some(Box::new(move || {
                    view! { <SwapErrorModal error=None /> }.into_any()
                })));
                return;
            }
        };

    set_tx_overlay_mode.set(OverlayMode::Background);
    if optimistic_outcome.charge_fee {
        let result = SwapResult {
            token_in,
            token_out,
            amount_in: optimistic_outcome.amount_in,
            amount_out: optimistic_outcome.amount_out,
        };
        modal.set(Some(Box::new(move || {
            view! { <SwapSuccessModal result=result.clone() /> }.into_any()
        })));
        let first_fee_step = steps - fee_instructions.len();
        enqueue_route_transactions(
            fee_instructions,
            |index| describe_step(first_fee_step + index),
            &account.account_id,
            add_transaction,
        );
    } else {
        let error = optimistic_outcome.error.clone();
        modal.set(Some(Box::new(move || {
            view! { <SwapErrorModal error=error.clone() /> }.into_any()
        })));
    }

    let next_steps = if optimistic_outcome.settled {
        optimistic_outcome.next_steps
    } else {
        match fetch_swap_outcome(&router_url, &outcome_request(OutcomeWaitUntil::Executed)).await {
            Ok(outcome) => outcome.next_steps,
            Err(error) => {
                log::error!("Failed to fetch settled swap outcome: {error}");
                return;
            }
        }
    };
    enqueue_route_transactions(
        next_steps,
        |_| description.clone(),
        &account.account_id,
        add_transaction,
    );
}

/// Links the transactions into one queue, so a failed one cancels the ones after it
fn enqueue_route_transactions(
    instructions: Vec<ExecutionInstruction>,
    describe_step: impl Fn(usize) -> String,
    signer_id: &AccountId,
    add_transaction: WriteSignal<Vec<EnqueuedTransaction>>,
) -> Vec<oneshot::Receiver<CryptoHash>> {
    let mut transactions: Vec<EnqueuedTransaction> = Vec::new();
    let mut hash_receivers = Vec::new();
    for (index, instruction) in instructions.into_iter().enumerate() {
        let ExecutionInstruction::NearTransaction {
            receiver_id,
            actions,
            ..
        } = instruction;
        let (_, transaction) = EnqueuedTransaction::create(
            describe_step(index),
            signer_id.clone(),
            receiver_id,
            actions,
            false,
        );
        let (hash_rx, transaction) = transaction.with_hash_notification();
        let transaction = match transactions.first() {
            Some(first_transaction) => transaction.in_same_queue_as(first_transaction),
            None => transaction,
        };
        transactions.push(transaction);
        hash_receivers.push(hash_rx);
    }
    add_transaction.update(|txs| txs.extend(transactions));
    hash_receivers
}

async fn fetch_swap_outcome(
    router_url: &str,
    request: &SwapOutcomeRequest<'_>,
) -> Result<SwapOutcome, String> {
    let response = reqwest::get(format!(
        "{router_url}/route/outcome?{}",
        serde_urlencoded::to_string(request).unwrap()
    ))
    .await
    .map_err(|error| error.to_string())?;
    if !response.status().is_success() {
        return Err(response.text().await.map_err(|error| error.to_string())?);
    }
    response.json().await.map_err(|error| error.to_string())
}

async fn get_ft_balance(
    account_id: &AccountIdRef,
    token_id: Token,
    rpc: &RpcClient,
) -> Option<Balance> {
    match token_id {
        Token::Near => rpc
            .view_account(
                account_id.to_owned(),
                QueryFinality::Finality(Finality::None),
            )
            .await
            .ok()
            .map(|account_view| account_view.amount.as_yoctonear()),
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
        Token::Rhea(_) => unreachable!(),
    }
}

const ROUTE_REQUEST_INITIAL_RETRY_DELAY: Duration = Duration::from_millis(1500);
const ROUTE_REQUEST_MAX_RETRY_DELAY: Duration = Duration::from_secs(30);

type RoutesState = Option<Result<Vec<Route>, String>>;

/// Owns the socket, request generations, and application-level retries for a route stream.
fn use_route_subscription(
    url: Memo<String>,
    query: Memo<Option<String>>,
) -> (ReadSignal<RoutesState>, ReadSignal<bool>) {
    let (routes, set_routes) = signal(None);
    let (is_fetching, set_is_fetching) = signal(false);
    let (socket, set_socket) = signal(None);
    let request_id = StoredValue::new(0u64);
    let active_query = StoredValue::new(None::<String>);
    let retry_timer = StoredValue::new(None::<TimeoutHandle>);
    let retry_delay = StoredValue::new(ROUTE_REQUEST_INITIAL_RETRY_DELAY);
    let retry_tick = RwSignal::new(0u64);

    let clear_retry = move || {
        if let Some(timer) = retry_timer.get_value() {
            timer.clear();
            retry_timer.set_value(None);
        }
    };
    on_cleanup(clear_retry);

    let on_message = move |message: &String| {
        let update = match serde_json::from_str::<RouteUpdate>(message) {
            Ok(update) => update,
            Err(error) => {
                log::error!("Failed to parse route update: {error}");
                return;
            }
        };
        let current_query = query.get_untracked();
        if update.id != request_id.get_value()
            || current_query.is_none()
            || current_query != active_query.get_value()
        {
            return;
        }

        // A successful update cancels a pending retry; repeated errors replace it.
        clear_retry();
        set_is_fetching.set(false);
        match update.result {
            RouteUpdateResult::Routes(new_routes) => {
                retry_delay.set_value(ROUTE_REQUEST_INITIAL_RETRY_DELAY);
                set_routes.set(Some(Ok(new_routes)));
            }
            RouteUpdateResult::Error(error) => {
                log::error!("Route request failed, retrying: {error}");
                set_routes.set(Some(Err(error)));
                let delay = retry_delay.get_value();
                let failed_id = update.id;
                match set_timeout_with_handle(
                    move || {
                        retry_timer.set_value(None);
                        if request_id.get_value() == failed_id && query.get_untracked().is_some() {
                            retry_tick.update(|tick| *tick += 1);
                        }
                    },
                    delay,
                ) {
                    Ok(timer) => {
                        retry_timer.set_value(Some(timer));
                        retry_delay
                            .set_value(delay.mul_f32(1.8).min(ROUTE_REQUEST_MAX_RETRY_DELAY));
                    }
                    Err(error) => log::error!("Failed to schedule route retry: {error:?}"),
                }
            }
        }
    };

    // The hook takes a static URL. This effect intentionally owns each socket so a URL
    // change disposes the old hook (including its reconnect timer) before creating another.
    Effect::new(move |_| {
        let url = url.get();
        clear_retry();
        request_id.update_value(|id| *id += 1);
        active_query.set_value(None);
        set_routes.set(None);
        set_is_fetching.set(query.get_untracked().is_some());
        set_socket.set(Some(use_websocket_with_options::<
            String,
            String,
            FromToStringCodec,
            _,
            _,
        >(
            &url,
            UseWebSocketOptions::default()
                .reconnect_limit(ReconnectLimit::Infinite)
                .reconnect_interval(1500)
                .on_message(on_message),
        )));
    });

    Effect::watch(
        move || {
            // Track readiness even with no query, so the first request and reconnects
            // cannot be missed while waiting for the socket to open.
            let ready_state = socket.get().map(|ws| ws.ready_state.get());
            (query.get(), ready_state, retry_tick.get())
        },
        move |(query, ready_state, _), previous, _| {
            let query_changed = previous.is_none_or(|(old_query, _, _)| old_query != query);
            let connection_changed =
                previous.is_none_or(|(_, old_state, _)| old_state != ready_state);
            clear_retry();
            request_id.update_value(|id| *id += 1);
            active_query.set_value(query.clone());

            if query_changed {
                retry_delay.set_value(ROUTE_REQUEST_INITIAL_RETRY_DELAY);
            }
            if query_changed || connection_changed {
                set_routes.set(None);
            }
            set_is_fetching.set(query.is_some());

            if *ready_state != Some(ConnectionReadyState::Open) {
                return;
            }
            let Some(ws) = socket.get_untracked() else {
                return;
            };
            let id = request_id.get_value();
            let request = match query {
                Some(query) => serde_json::json!({ "id": id, "query": query }),
                None => serde_json::json!({ "id": id }),
            };
            (ws.send)(&request.to_string());
        },
        true,
    );

    (routes, is_fetching)
}

#[derive(Debug, Deserialize)]
struct RouteUpdate {
    id: u64,
    #[serde(flatten)]
    result: RouteUpdateResult,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
enum RouteUpdateResult {
    Routes(Vec<Route>),
    Error(String),
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

impl From<Token> for TokenId {
    fn from(token: Token) -> Self {
        match token {
            Token::Near => TokenId::Near,
            Token::Nep141(account_id) => TokenId::Nep141(account_id),
            Token::Rhea(_) => unreachable!(),
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
    /// The account ID of the referrer. If provided, the route will include referral
    /// parameter for DEXes that support it
    pub referrer_id: Option<AccountId>,
    /// Accounts to pay a fee to, and the fee each one charges. `0.005` means 0.5%.
    #[serde(with = "json_encoded", default)]
    pub fees: Option<HashMap<AccountId, f64>>,
}

mod json_encoded {
    use serde::{Deserialize, Deserializer, Serialize, Serializer, de::DeserializeOwned};

    pub fn serialize<S, T>(value: &Option<T>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
        T: Serialize,
    {
        value
            .as_ref()
            .map(|value| serde_json::to_string(value).map_err(serde::ser::Error::custom))
            .transpose()?
            .serialize(serializer)
    }

    pub fn deserialize<'de, D, T>(deserializer: D) -> Result<Option<T>, D::Error>
    where
        D: Deserializer<'de>,
        T: DeserializeOwned,
    {
        Option::<String>::deserialize(deserializer)?
            .map(|s| serde_json::from_str(&s).map_err(serde::de::Error::custom))
            .transpose()
    }
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
    /// What the fee transactions pay out of the wallet balance of the input token
    #[serde(with = "dec_format")]
    pub fee_amount: Balance,
    /// yoctoNEAR the transactions cost in gas if all attached gas is burnt
    #[serde(with = "dec_format")]
    pub estimated_max_gas_cost: Balance,
    /// yoctoNEAR the transactions are expected to cost in gas
    #[serde(with = "dec_format")]
    pub estimated_gas_usage: Balance,
    /// yoctoNEAR the transactions attach to storage deposits, less what they withdraw right after
    #[serde(with = "dec_format")]
    pub storage_deposits: Balance,
}

impl Route {
    /// Attached gas is bought at the minimum gas purchase price, 10x the gas price, and the
    /// unused part is refunded after the transaction
    fn gas_reserve(&self) -> Balance {
        self.estimated_max_gas_cost * 10
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ExecutionInstruction {
    /// Sign a transaction with the given actions and send it to the RPC.
    NearTransaction {
        receiver_id: AccountId,
        actions: Vec<Action>,
        is_fee_transaction: bool,
    },
}

#[derive(Debug, Serialize)]
struct SwapOutcomeRequest<'a> {
    token_in: &'a TokenId,
    token_out: &'a TokenId,
    trader_account_id: &'a AccountId,
    tx_hashes: &'a str,
    #[serde(with = "dec_format")]
    fee_amount: Balance,
    wait_until: OutcomeWaitUntil,
}

#[derive(Debug, Serialize, Clone, Copy)]
#[serde(rename_all = "snake_case")]
enum OutcomeWaitUntil {
    /// As soon as the swap executed optimistically, before the output reaches the trader
    Swap,
    /// Once every transaction and receipt executed and the balances were compared
    Executed,
}

#[derive(Debug, Deserialize)]
struct SwapOutcome {
    /// Whether the swap went through and fee should be charged
    charge_fee: bool,
    /// Spent from all places the input token is held in, without gas and storage deposits
    #[serde(with = "dec_format")]
    amount_in: Balance,
    /// Received to all places the output token is held in
    #[serde(with = "dec_format")]
    amount_out: Balance,
    /// Move what ended up somewhere other than token_in or token_out, after the fee transactions
    next_steps: Vec<ExecutionInstruction>,
    /// Why the swap failed, written to show to the trader
    error: Option<String>,
    /// False for an answer at the swap, which has no `next_steps` yet
    settled: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Hash)]
pub enum DexId {
    /// https://app.rhea.finance/
    /// AMM DEX
    ///
    /// Supports AmountIn, doesn't support AmountOut
    Rhea,
    /// Directly wrap NEAR to wNEAR, or unwrap wNEAR to NEAR
    ///
    /// Supports both AmountIn and AmountOut
    Wrap,
    /// https://app.rhea.finance/
    /// AMM DEX
    ///
    /// Supports both AmountIn and AmountOut
    RheaDcl,
    /// AMM DEX
    ///
    /// Supports AmountIn and AmountOut
    IntearDex,
}

const RHEA_STR: &str = "Rhea";
const WRAP_STR: &str = "Wrap";
const RHEA_DCL_STR: &str = "RheaDcl";
const INTEAR_DEX_STR: &str = "IntearDex";

impl Display for DexId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DexId::Rhea => f.write_str(RHEA_STR),
            DexId::Wrap => f.write_str(WRAP_STR),
            DexId::RheaDcl => f.write_str(RHEA_DCL_STR),
            DexId::IntearDex => f.write_str(INTEAR_DEX_STR),
        }
    }
}

fn pages_swap_dex_label(dex: DexId) -> String {
    match dex {
        DexId::Rhea => TranslationKey::PagesSwapDexRhea.format(&[]),
        DexId::Wrap => TranslationKey::PagesSwapDexWrap.format(&[]),
        DexId::RheaDcl => TranslationKey::PagesSwapDexRheaDcl.format(&[]),
        DexId::IntearDex => TranslationKey::PagesSwapDexIntear.format(&[]),
    }
}

impl FromStr for DexId {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            RHEA_STR => DexId::Rhea,
            WRAP_STR => DexId::Wrap,
            RHEA_DCL_STR => DexId::RheaDcl,
            INTEAR_DEX_STR => DexId::IntearDex,
            _ => return Err(format!("Invalid dex id: {}", s)),
        })
    }
}

#[component]
fn SwapSuccessModal(result: SwapResult) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
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
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
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
                        <h3 class="text-white font-bold text-xl mb-2">
                            {move || TranslationKey::PagesSwapSuccessModalTitle.format(&[])}
                        </h3>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">
                                {move || TranslationKey::PagesSwapSuccessModalYouSpent.format(&[])}
                            </div>
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
                            <div class="text-gray-400 text-sm mb-2">
                                {move || {
                                    TranslationKey::PagesSwapSuccessModalYouReceived.format(&[])
                                }}
                            </div>
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
                        class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        {move || TranslationKey::PagesSwapSuccessModalButtonClose.format(&[])}
                    </button>
                </div>
            </div>
        </div>
    }
}

#[derive(Clone, Copy)]
enum SwapPriceDangerTier {
    Extreme,
    High,
}

#[component]
fn SwapConfirmationModal(
    confirmation: SwapConfirmation,
    on_confirm: std::rc::Rc<dyn Fn(SwapConfirmation)>,
    can_submit: std::sync::Arc<dyn Fn() -> bool + Send + Sync>,
) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    // Clone all the values we need to avoid partial moves
    let token_in = confirmation.token_in.clone();
    let token_out = confirmation.token_out.clone();
    let route = confirmation.route.clone();
    let swap_mode = confirmation.swap_mode;

    let amount_in_decimal = balance_to_decimal(confirmation.amount_in, token_in.metadata.decimals);
    let amount_in_formatted = format!(
        "{} {}",
        round_precision_or_significant(amount_in_decimal.clone()),
        token_in.metadata.symbol
    );
    let amount_in_usd = if !token_in.price_usd_hardcoded.is_zero() {
        Some(&amount_in_decimal * &token_in.price_usd_hardcoded)
    } else {
        None
    };

    let estimated_amount_out_decimal = balance_to_decimal(
        confirmation.estimated_amount_out,
        token_out.metadata.decimals,
    );
    let estimated_amount_out_formatted = format!(
        "{} {}",
        round_precision_or_significant(estimated_amount_out_decimal.clone()),
        token_out.metadata.symbol
    );
    let estimated_amount_out_usd = if !token_out.price_usd_hardcoded.is_zero() {
        Some(&estimated_amount_out_decimal * &token_out.price_usd_hardcoded)
    } else {
        None
    };

    let worst_case_amount_in_decimal = balance_to_decimal(
        confirmation.worst_case_amount_in,
        token_in.metadata.decimals,
    );
    let worst_case_amount_in_formatted = format!(
        "{} {}",
        round_precision_or_significant(worst_case_amount_in_decimal.clone()),
        token_in.metadata.symbol
    );

    let worst_case_amount_out_decimal = balance_to_decimal(
        confirmation.worst_case_amount_out,
        token_out.metadata.decimals,
    );
    let worst_case_amount_out_formatted = format!(
        "{} {}",
        round_precision_or_significant(worst_case_amount_out_decimal.clone()),
        token_out.metadata.symbol
    );

    let price_impact = swap_price_impact(
        &amount_in_decimal * &token_in.price_usd_hardcoded,
        &estimated_amount_out_decimal * &token_out.price_usd_hardcoded,
    );
    let danger_confirmation: Option<(SwapPriceDangerTier, BigDecimal)> = match price_impact.as_ref()
    {
        Some(impact) if *impact > 90 => Some((SwapPriceDangerTier::Extreme, impact.clone())),
        Some(impact) if *impact > 10 => Some((SwapPriceDangerTier::High, impact.clone())),
        _ => None,
    };
    let requires_danger_confirmation = danger_confirmation.is_some();
    let (is_danger_confirmed, set_is_danger_confirmed) = signal(!requires_danger_confirmation);

    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <h3 class="text-white font-bold text-xl mb-2">
                            {move || TranslationKey::PagesSwapConfirmationModalTitle.format(&[])}
                        </h3>
                        <p class="text-gray-400 text-sm">
                            {move || TranslationKey::PagesSwapConfirmationModalSubtitle.format(&[])}
                        </p>
                    </div>

                    <div class="space-y-4">
                        // From section
                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">
                                {move || {
                                    TranslationKey::PagesSwapConfirmationModalYoureSwapping
                                        .format(&[])
                                }}
                            </div>
                            <div class="flex items-center gap-3">
                                {match token_in.metadata.icon {
                                    Some(icon) => {
                                        view! {
                                            <img
                                                src=icon
                                                alt=token_in.metadata.symbol.clone()
                                                class="w-8 h-8 rounded-full"
                                            />
                                        }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                                                {token_in.metadata.symbol.chars().next().unwrap_or('?')}
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }} <div class="text-left">
                                    <div class="text-white font-medium text-lg">
                                        {amount_in_formatted}
                                    </div>
                                    <div class="text-gray-400 text-sm">
                                        {move || {
                                            if let Some(usd_amount) = &amount_in_usd {
                                                format_usd_value_no_hide(usd_amount.clone())
                                            } else {
                                                String::new()
                                            }
                                        }}
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

                        // To section
                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">
                                {move || {
                                    TranslationKey::PagesSwapConfirmationModalToReceive.format(&[])
                                }}
                            </div>
                            <div class="flex items-center gap-3">
                                {match token_out.metadata.icon {
                                    Some(icon) => {
                                        view! {
                                            <img
                                                src=icon
                                                alt=token_out.metadata.symbol.clone()
                                                class="w-8 h-8 rounded-full"
                                            />
                                        }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                                                {token_out.metadata.symbol.chars().next().unwrap_or('?')}
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }} <div class="text-left">
                                    <div class="text-white font-medium text-lg">
                                        {estimated_amount_out_formatted}
                                    </div>
                                    <div class="text-gray-400 text-sm">
                                        {move || {
                                            if let Some(usd_amount) = &estimated_amount_out_usd {
                                                format_usd_value_no_hide(usd_amount.clone())
                                            } else {
                                                String::new()
                                            }
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        // Transaction details
                        <div class="bg-neutral-800 rounded-lg p-4 space-y-3">
                            <div class="text-gray-400 text-sm font-medium">
                                {move || {
                                    TranslationKey::PagesSwapConfirmationModalTransactionDetails
                                        .format(&[])
                                }}
                            </div>

                            // DEX info
                            <div class="flex justify-between items-center">
                                <span class="text-gray-400 text-sm">
                                    {move || {
                                        TranslationKey::PagesSwapConfirmationModalExchange
                                            .format(&[])
                                    }}
                                </span>
                                <div class="flex items-center gap-2">
                                    {match route.dex_id {
                                        DexId::Rhea => {
                                            view! {
                                                <img
                                                    src="/rhea.svg"
                                                    alt=move || pages_swap_dex_label(DexId::Rhea)
                                                    class="w-auto h-5"
                                                />
                                            }
                                                .into_any()
                                        }
                                        DexId::RheaDcl => {
                                            view! {
                                                <img
                                                    src="/rhea.svg"
                                                    alt=move || pages_swap_dex_label(DexId::RheaDcl)
                                                    class="w-auto h-5"
                                                />
                                            }
                                                .into_any()
                                        }
                                        DexId::Wrap => {
                                            view! {
                                                <span class="text-white text-sm">
                                                    {move || {
                                                        TranslationKey::PagesSwapRouteWrapDirectly.format(&[])
                                                    }}
                                                </span>
                                            }
                                                .into_any()
                                        }
                                        DexId::IntearDex => {
                                            view! {
                                                <div class="flex items-center gap-1">
                                                    <img
                                                        src="/intear.svg"
                                                        alt=move || pages_swap_dex_label(DexId::IntearDex)
                                                        class="w-auto h-5"
                                                    />
                                                    <span class="text-white text-sm">
                                                        {move || TranslationKey::PagesSwapRouteIntearDex.format(&[])}
                                                    </span>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }}
                                </div>
                            </div>

                            // Minimum received / Maximum spent
                            <div class="flex justify-between items-center">
                                <span class="text-gray-400 text-sm">
                                    {move || match swap_mode {
                                        SwapMode::ExactIn => {
                                            TranslationKey::PagesSwapConfirmationModalMinimumReceived
                                                .format(&[])
                                        }
                                        SwapMode::ExactOut => {
                                            TranslationKey::PagesSwapConfirmationModalMaximumSpent
                                                .format(&[])
                                        }
                                    }}
                                </span>
                                <span class="text-white text-sm">
                                    {match swap_mode {
                                        SwapMode::ExactIn => worst_case_amount_out_formatted.clone(),
                                        SwapMode::ExactOut => worst_case_amount_in_formatted.clone(),
                                    }}
                                </span>
                            </div>

                            // Price impact (only show if 5% or above)
                            {
                                let price_impact_clone = price_impact.clone();
                                move || {
                                    if let Some(impact) = price_impact_clone.as_ref() {
                                        if impact >= 5 {
                                            let impact_clone = impact.clone();
                                            view! {
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-400 text-sm">
                                                        {move || {
                                                            TranslationKey::PagesSwapConfirmationModalPriceImpact
                                                                .format(&[])
                                                        }}
                                                    </span>
                                                    <span class=move || {
                                                        format!(
                                                            "text-sm {}",
                                                            if impact_clone > 5 {
                                                                "text-red-400"
                                                            } else {
                                                                "text-yellow-400"
                                                            },
                                                        )
                                                    }>{format!("{:.2}%", impact_clone)}</span>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    } else {
                                        ().into_any()
                                    }
                                }
                            }
                        </div>
                        {match danger_confirmation.clone() {
                            Some((SwapPriceDangerTier::Extreme, impact)) => {
                                let impact_fmt = format!("{:.2}", impact);
                                view! {
                                    <DangerConfirmInput
                                        set_is_confirmed=set_is_danger_confirmed
                                        expected_text=Signal::derive(move || {
                                            TranslationKey::PagesSwapPriceImpactDangerExtremeExpectedPhrase
                                                .format(&[])
                                        })
                                        label_text=Signal::derive(move || {
                                            TranslationKey::PagesSwapPriceImpactDangerExtremeLabelText
                                                .format(&[])
                                        })
                                        placeholder_text=Signal::derive(move || {
                                            TranslationKey::PagesSwapPriceImpactDangerExtremePlaceholderText
                                                .format(&[])
                                        })
                                        warning_title=Signal::derive(move || {
                                            TranslationKey::PagesSwapPriceImpactDangerExtremeWarningTitle
                                                .format(&[])
                                        })
                                        warning_message=Signal::derive(move || {
                                            TranslationKey::PagesSwapPriceImpactDangerExtremeWarningBody
                                                .format(&[("impact", impact_fmt.as_str())])
                                        })
                                    />
                                }
                                    .into_any()
                            }
                            Some((SwapPriceDangerTier::High, impact)) => {
                                let impact_fmt = format!("{:.2}", impact);
                                view! {
                                    <DangerConfirmInput
                                        set_is_confirmed=set_is_danger_confirmed
                                        warning_title=Signal::derive(move || {
                                            TranslationKey::PagesSwapPriceImpactDangerHighWarningTitle
                                                .format(&[])
                                        })
                                        warning_message=Signal::derive(move || {
                                            TranslationKey::PagesSwapPriceImpactDangerHighWarningBody
                                                .format(&[("impact", impact_fmt.as_str())])
                                        })
                                    />
                                }
                                    .into_any()
                            }
                            None => ().into_any(),
                        }}
                    </div>

                    // Action buttons
                    <div class="flex gap-3 mt-6">
                        <button
                            class="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                            on:click=move |_| modal.set(None)
                        >
                            {move || {
                                TranslationKey::PagesSwapConfirmationModalButtonCancel.format(&[])
                            }}
                        </button>
                        <button
                            class="flex-1 bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-4 py-3 font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-purple-500"
                            disabled={
                                let can_submit = can_submit.clone();
                                move || !can_submit()
                                    || (requires_danger_confirmation && !is_danger_confirmed.get())
                            }
                            on:click={
                                let confirmation = confirmation.clone();
                                move |_| {
                                    if requires_danger_confirmation && !is_danger_confirmed.get_untracked()
                                    {
                                        return;
                                    }
                                    on_confirm(confirmation.clone());
                                }
                            }
                        >
                            {move || {
                                TranslationKey::PagesSwapConfirmationModalButtonConfirmSwap
                                    .format(&[])
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
fn SwapErrorModal(error: Option<String>) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuX
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">
                            {move || TranslationKey::PagesSwapErrorModalTitle.format(&[])}
                        </h3>
                        <p class="text-gray-400 text-sm">
                            {move || {
                                error
                                    .clone()
                                    .unwrap_or_else(|| {
                                        TranslationKey::PagesSwapErrorModalDescription.format(&[])
                                    })
                            }}
                        </p>
                    </div>

                    <button
                        class="w-full mt-6 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        {move || TranslationKey::PagesSwapErrorModalClose.format(&[])}
                    </button>
                </div>
            </div>
        </div>
    }
}
