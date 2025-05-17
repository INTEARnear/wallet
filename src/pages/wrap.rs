use crate::{
    contexts::{
        accounts_context::AccountsContext,
        network_context::{Network, NetworkContext},
        tokens_context::{Token, TokenContext},
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::{format_token_amount, format_usd_value_no_hide},
};
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::Icon;
use leptos_router::components::A;
use near_min_api::types::{AccountId, Action, Balance, FunctionCallAction, NearGas, NearToken};

#[component]
pub fn WrapToken() -> impl IntoView {
    let TokenContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokenContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let NetworkContext { network, .. } = expect_context::<NetworkContext>();
    let (amount, set_amount) = signal("".to_string());
    let (amount_error, set_amount_error) = signal::<Option<String>>(None);
    let (has_typed_amount, set_has_typed_amount) = signal(false);

    let near_token = move || {
        tokens
            .get()
            .into_iter()
            .find(|t| matches!(t.token.account_id, Token::Near))
    };

    let check_amount = move |amount: String| {
        set_has_typed_amount.set(true);

        if let Some(token) = near_token() {
            if let Ok(amount_value) = amount.parse::<f64>() {
                if amount_value <= 0.0 {
                    set_amount_error.set(Some("Amount must be greater than 0".to_string()));
                    return;
                }

                let max_amount =
                    token.balance as f64 / 10f64.powi(token.token.metadata.decimals as i32);
                if amount_value > max_amount {
                    set_amount_error.set(Some("Amount exceeds balance".to_string()));
                    return;
                }

                set_amount_error.set(None);
            } else {
                set_amount_error.set(Some("Please enter amount".to_string()));
            }
        }
    };

    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let handle_wrap = move |_| {
        if amount_error.get().is_some() {
            return;
        }

        let transaction_description = format!("Wrap {} NEAR", amount.get(),);
        let Ok(amount_normalized) = amount.get().parse::<f64>() else {
            panic!(
                "Amount '{}' cannot be parsed as f64, yet amount_error is None",
                amount()
            );
        };
        let Some(token) = near_token() else {
            panic!("NEAR token not found, but tried to wrap it");
        };
        let amount =
            (amount_normalized * 10f64.powi(token.token.metadata.decimals as i32)) as Balance;
        let signer_id = accounts
            .get_untracked()
            .selected_account_id
            .expect("No account selected yet tried to wrap tokens");

        let wrap_contract_id: AccountId = match network.get() {
            Network::Mainnet => "wrap.near".parse().unwrap(),
            Network::Testnet => "wrap.testnet".parse().unwrap(),
        };

        spawn_local(async move {
            let actions = vec![Action::FunctionCall(Box::new(FunctionCallAction {
                method_name: "near_deposit".to_string(),
                args: serde_json::to_vec(&serde_json::json!({})).unwrap(),
                gas: NearGas::from_tgas(2).as_gas(),
                deposit: NearToken::from_yoctonear(amount),
            }))];

            add_transaction.update(|txs| {
                txs.push(
                    EnqueuedTransaction::create(
                        transaction_description,
                        signer_id,
                        wrap_contract_id,
                        actions,
                    )
                    .1,
                )
            });
        });

        // Clear form fields
        set_amount.set("".to_string());
        set_has_typed_amount.set(false);
        set_amount_error.set(None);
    };

    view! {
        <div class="flex flex-col gap-4 p-2 md:p-4 transition-all duration-100">
            <A
                href="/"
                attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 cursor-pointer"
            >
                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                <span>Back</span>
            </A>

            {move || {
                if loading_tokens() {
                    view! {
                        <div class="flex items-center justify-center h-32">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    }
                        .into_any()
                } else if let Some(token) = near_token() {
                    view! {
                        <div class="flex flex-col gap-4">
                            <div class="bg-neutral-900 rounded-xl p-4">
                                <div class="flex items-center gap-3">
                                    {match token.token.metadata.icon.clone() {
                                        Some(icon) => {
                                            view! { <img src=icon class="w-12 h-12 rounded-full" /> }
                                                .into_any()
                                        }
                                        None => {
                                            view! {
                                                <div class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
                                                    {token.token.metadata.symbol.chars().next().unwrap_or('?')}
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }} <div>
                                        <h2 class="text-white text-xl font-bold">Wrap NEAR</h2>
                                        <p class="text-gray-400">
                                            {format_token_amount(
                                                token.balance,
                                                token.token.metadata.decimals,
                                                &token.token.metadata.symbol,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col gap-2">
                                    <label class="text-gray-400">Amount to Wrap</label>
                                    <div class="relative">
                                        <input
                                            type="text"
                                            class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
                                            style=move || {
                                                if has_typed_amount.get() {
                                                    if amount_error.get().is_some() {
                                                        "border: 2px solid rgb(239 68 68)"
                                                    } else {
                                                        "border: 2px solid rgb(34 197 94)"
                                                    }
                                                } else {
                                                    "border: 2px solid transparent"
                                                }
                                            }
                                            placeholder="0.0"
                                            prop:value=amount
                                            on:input=move |ev| {
                                                let value = event_target_value(&ev);
                                                set_amount.set(value.clone());
                                                check_amount(value);
                                            }
                                        />
                                        <button
                                            class="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200"
                                            on:click=move |_| {
                                                let max_amount = token.balance as f64
                                                    / 10f64.powi(token.token.metadata.decimals as i32);
                                                let rounded_gas_cost = 0.0003;
                                                let max_amount = (max_amount - rounded_gas_cost).max(0.0);
                                                set_amount.set(max_amount.to_string());
                                                check_amount(max_amount.to_string());
                                            }
                                        >
                                            MAX
                                        </button>
                                    </div>
                                    {move || {
                                        let error_message = amount_error.get();
                                        let usd_display = if let Ok(amount_value) = amount
                                            .get()
                                            .parse::<f64>()
                                        {
                                            let usd_value = amount_value
                                                * token.token.price_usd_hardcoded;
                                            format_usd_value_no_hide(usd_value)
                                        } else {
                                            "$0".to_string()
                                        };

                                        view! {
                                            <div class="flex justify-between items-center mt-2">
                                                <p class="text-red-500 text-sm font-medium">
                                                    {error_message.unwrap_or_default()}
                                                </p>
                                                <p class="text-gray-400 text-sm">{usd_display}</p>
                                            </div>
                                        }
                                            .into_any()
                                    }}
                                </div>

                                <button
                                    class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden hover:bg-neutral-900/70 enabled:bg-gradient-to-r enabled:from-blue-500 enabled:to-purple-500 enabled:hover:from-blue-600 enabled:hover:to-purple-600"
                                    disabled=move || {
                                        amount_error.get().is_some() || amount.get().is_empty()
                                    }
                                    on:click=handle_wrap
                                >
                                    <div class="flex items-center justify-center gap-2">
                                        <Icon
                                            icon=icondata::LuArrowDownCircle
                                            width="20"
                                            height="20"
                                        />
                                        <span>Wrap NEAR</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="flex flex-col items-center justify-center h-32 gap-4">
                            <div class="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                <div class="flex items-center gap-2 text-red-400">
                                    <Icon icon=icondata::LuAlertTriangle width="20" height="20" />
                                    <p class="text-white font-medium">NEAR token not found</p>
                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
