use crate::{
    contexts::{
        accounts_context::AccountsContext,
        rpc_context::RpcContext,
        tokens_context::{Token, TokenContext},
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::{
        format_token_amount, format_token_amount_no_hide, format_usd_value_no_hide, StorageBalance,
    },
};
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::Icon;
use leptos_router::components::A;
use leptos_router::hooks::use_params_map;
use near_min_api::{
    types::{
        AccountId, Action, Balance, Finality, FunctionCallAction, NearGas, NearToken,
        TransferAction, U128,
    },
    QueryFinality,
};

#[component]
pub fn SendToken() -> impl IntoView {
    let params = use_params_map();
    let token_id = move || params.get().get("token_id").unwrap_or_default();
    let TokenContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokenContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let (recipient, set_recipient) = signal("".to_string());
    let (amount, set_amount) = signal("".to_string());
    let (is_loading_recipient, set_is_loading_recipient) = signal(false);
    let (amount_error, set_amount_error) = signal::<Option<String>>(None);
    let (recipient_balance, set_recipient_balance) = signal(None);
    let (has_typed_recipient, set_has_typed_recipient) = signal(false);
    let (has_typed_amount, set_has_typed_amount) = signal(false);

    let token = move || {
        tokens
            .get()
            .into_iter()
            .find(|t| match &t.token.account_id {
                Token::Near => token_id() == "near",
                Token::Nep141(account_id) => *account_id == token_id(),
            })
    };

    let check_recipient = move |recipient_to_check: String| {
        set_has_typed_recipient.set(true);

        let Ok(recipient_to_check) = recipient_to_check.parse::<AccountId>() else {
            set_recipient_balance.set(None);
            set_is_loading_recipient.set(false);
            return;
        };
        set_is_loading_recipient.set(true);
        let Some(token) = token() else {
            return;
        };

        let rpc_client = client();
        spawn_local(async move {
            let recipient_is_implicit = recipient_to_check
                .as_str()
                .chars()
                .all(|c| c.is_ascii_hexdigit())
                && recipient_to_check.as_str().len() == 64;
            let recipient_is_evm_implicit = recipient_to_check.as_str().starts_with("0x")
                && recipient_to_check
                    .as_str()
                    .chars()
                    .skip(2)
                    .all(|c| c.is_ascii_hexdigit())
                && recipient_to_check.as_str().len() == 42;
            let account_exists = recipient_is_implicit
                || recipient_is_evm_implicit
                || rpc_client
                    .view_account(
                        recipient_to_check.clone(),
                        QueryFinality::Finality(Finality::DoomSlug),
                    )
                    .await
                    .is_ok();

            if recipient_to_check == recipient.get_untracked() {
                if account_exists {
                    let balance = match token.token.account_id {
                        Token::Near => rpc_client
                            .view_account(
                                recipient_to_check.clone(),
                                QueryFinality::Finality(Finality::DoomSlug),
                            )
                            .await
                            .map(|acc| acc.amount.as_yoctonear())
                            .unwrap_or(0),
                        Token::Nep141(token_id) => rpc_client
                            .call::<U128>(
                                token_id,
                                "ft_balance_of",
                                serde_json::json!({"account_id": recipient_to_check.clone()}),
                                QueryFinality::Finality(Finality::DoomSlug),
                            )
                            .await
                            .as_deref()
                            .copied()
                            .unwrap_or(0),
                    };
                    set_recipient_balance.set(Some(balance));
                } else {
                    set_recipient_balance.set(None);
                }
                set_is_loading_recipient.set(false);
            }
        });
    };

    let check_amount = move |amount: String| {
        set_has_typed_amount.set(true);

        if let Some(token) = token() {
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
    let handle_send = move |_| {
        let rpc_client = client();
        if recipient_balance.get().is_none() || amount_error.get().is_some() {
            return;
        }

        let transaction_description = format!(
            "Sending {} {} to {}",
            amount.get(),
            token().unwrap().token.metadata.symbol,
            recipient.get()
        );
        let Ok(recipient) = recipient.get().parse::<AccountId>() else {
            panic!(
                "Recipient '{}' cannot be parsed as AccountId, yet is_valid_recipient is true",
                recipient()
            );
        };
        let Ok(amount_normalized) = amount.get().parse::<f64>() else {
            panic!(
                "Amount '{}' cannot be parsed as f64, yet is_valid_amount is true",
                amount()
            );
        };
        let Some(token) = token() else {
            panic!("Token not found, but tried to send it");
        };
        let amount =
            (amount_normalized * 10f64.powi(token.token.metadata.decimals as i32)) as Balance;
        let signer_id = accounts
            .get_untracked()
            .selected_account
            .expect("No account selected yet tried to send tokens");
        spawn_local(async move {
            let actions = match &token.token.account_id {
                Token::Near => vec![Action::Transfer(TransferAction {
                    deposit: NearToken::from_yoctonear(amount),
                })],
                Token::Nep141(token_id) => {
                    let transfer = Action::FunctionCall(Box::new(FunctionCallAction {
                        method_name: "ft_transfer".to_string(),
                        args: serde_json::to_vec(&serde_json::json!({
                            "receiver_id": recipient,
                            "amount": amount.to_string(),
                        }))
                        .unwrap(),
                        gas: NearGas::from_tgas(5).as_gas(),
                        deposit: NearToken::from_yoctonear(1),
                    }));
                    let Ok(storage_balance_of_recipient) = rpc_client
                        .call::<Option<StorageBalance>>(
                            token_id.clone(),
                            "storage_balance_of",
                            serde_json::json!({"account_id": recipient.clone()}),
                            QueryFinality::Finality(Finality::DoomSlug),
                        )
                        .await
                    else {
                        return;
                    };
                    let needs_storage_deposit = match storage_balance_of_recipient {
                        Some(storage_balance) => storage_balance.total.is_zero(),
                        None => true,
                    };
                    let mut actions = Vec::new();
                    if needs_storage_deposit {
                        actions.push(Action::FunctionCall(Box::new(FunctionCallAction {
                            method_name: "storage_deposit".to_string(),
                            args: serde_json::to_vec(&serde_json::json!({
                                "account_id": recipient.clone(),
                                "registration_only": true,
                            }))
                            .unwrap(),
                            gas: NearGas::from_tgas(5).as_gas(),
                            deposit: "0.00125 NEAR".parse().unwrap(),
                        })));
                    }
                    actions.push(transfer);
                    actions
                }
            };
            add_transaction.update(|txs| {
                txs.push(EnqueuedTransaction::new(
                    transaction_description,
                    signer_id,
                    match &token.token.account_id {
                        Token::Near => recipient.clone(),
                        Token::Nep141(token_id) => token_id.clone(),
                    },
                    actions,
                ))
            });
        });

        // Clear form fields
        set_recipient.set("".to_string());
        set_amount.set("".to_string());
        set_has_typed_recipient.set(false);
        set_has_typed_amount.set(false);
        set_recipient_balance.set(None);
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
                } else if let Some(token) = token() {
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
                                        <h2 class="text-white text-xl font-bold">
                                            {token.token.metadata.name.clone()}
                                        </h2>
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
                                    <label class="text-gray-400">Recipient</label>
                                    <input
                                        type="text"
                                        class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200"
                                        style=move || {
                                            if has_typed_recipient.get() {
                                                if recipient_balance.get().is_none() {
                                                    "border: 2px solid rgb(239 68 68)"
                                                } else if !is_loading_recipient.get() {
                                                    "border: 2px solid rgb(34 197 94)"
                                                } else {
                                                    "border: 2px solid rgb(55 65 81)"
                                                }
                                            } else {
                                                "border: 2px solid transparent"
                                            }
                                        }
                                        placeholder="account.near"
                                        prop:value=recipient
                                        on:input=move |ev| {
                                            let value = event_target_value(&ev);
                                            set_recipient.set(value.clone());
                                            check_recipient(value);
                                        }
                                    />
                                    {move || {
                                        if let Some(recipient_balance) = recipient_balance.get() {
                                            view! {
                                                <p class="text-green-500 text-sm mt-2 font-medium">
                                                    {recipient}" has "
                                                    {format_token_amount_no_hide(
                                                        recipient_balance,
                                                        token.token.metadata.decimals,
                                                        &token.token.metadata.symbol,
                                                    )}
                                                </p>
                                            }
                                                .into_any()
                                        } else if is_loading_recipient.get() {
                                            view! {
                                                <p class="text-gray-400 text-sm mt-2 font-medium">
                                                    Checking...
                                                </p>
                                            }
                                                .into_any()
                                        } else if has_typed_recipient.get() {
                                            view! {
                                                <p class="text-red-500 text-sm mt-2 font-medium">
                                                    "Account does not exist"
                                                </p>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label class="text-gray-400">Amount</label>
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
                                        recipient_balance.get().is_none()
                                            || amount_error.get().is_some()
                                            || is_loading_recipient.get()
                                    }
                                    on:click=handle_send
                                >
                                    <div class="flex items-center justify-center gap-2">
                                        {move || {
                                            if is_loading_recipient.get() {
                                                view! {
                                                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                }
                                                    .into_any()
                                            } else {
                                                view! {
                                                    <>
                                                        <Icon icon=icondata::LuSend width="20" height="20" />
                                                        <span>Send</span>
                                                    </>
                                                }
                                                    .into_any()
                                            }
                                        }}
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
                                    <p class="text-white font-medium">Token not found</p>
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
