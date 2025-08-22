use crate::{
    contexts::{
        accounts_context::AccountsContext,
        network_context::NetworkContext,
        rpc_context::RpcContext,
        tokens_context::{Token, TokenMetadata, TokensContext},
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    pages::stake::is_validator_supported,
    utils::{
        balance_to_decimal, decimal_to_balance, format_account_id_no_hide, format_token_amount,
        format_token_amount_no_hide, format_usd_value_no_hide, StorageBalance,
    },
};
use bigdecimal::{BigDecimal, FromPrimitive};
use futures_util::join;
use leptos::prelude::set_timeout_with_handle;
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
use std::future::Future;
use std::pin::Pin;
use std::time::Duration;

#[component]
pub fn SendToken() -> impl IntoView {
    let params = use_params_map();
    let token_id = move || params.get().get("token_id").unwrap_or_default();
    let TokensContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokensContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let NetworkContext { network, .. } = expect_context::<NetworkContext>();
    let (recipient, set_recipient) = signal("".to_string());
    let (amount, set_amount) = signal("".to_string());
    let (is_loading_recipient, set_is_loading_recipient) = signal(false);
    let (amount_error, set_amount_error) = signal::<Option<String>>(None);
    let (recipient_balance, set_recipient_balance) = signal(None);
    let (has_typed_recipient, set_has_typed_recipient) = signal(false);
    let (has_typed_amount, set_has_typed_amount) = signal(false);
    #[derive(Clone, Debug)]
    struct RecipientWarning {
        message: String,
        link: Option<String>,
        link_text: Option<String>,
    }

    let (recipient_warning, set_recipient_warning) = signal::<Option<RecipientWarning>>(None);
    let (balance_error_count, set_balance_error_count) = signal(0);
    let (balance_error_timeout, set_balance_error_timeout) = signal::<Option<TimeoutHandle>>(None);

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
            set_recipient_warning.set(None);
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
                    // Clone recipient for validator check and futures
                    let recipient_for_validator_check = recipient_to_check.clone();

                    let ft_metadata_future = rpc_client.call::<TokenMetadata>(
                        recipient_to_check.clone(),
                        "ft_metadata",
                        serde_json::json!({}),
                        QueryFinality::Finality(Finality::None),
                    );

                    let nft_metadata_future = rpc_client.call::<serde_json::Value>(
                        recipient_to_check.clone(),
                        "nft_metadata",
                        serde_json::json!({}),
                        QueryFinality::Finality(Finality::None),
                    );

                    let balance_future: Pin<
                        Box<dyn Future<Output = Result<Balance, near_min_api::Error>> + '_>,
                    > = match token.token.account_id {
                        Token::Near => {
                            let rpc_client = rpc_client.clone();
                            Box::pin(async move {
                                Ok(rpc_client
                                    .view_account(
                                        recipient_to_check.clone(),
                                        QueryFinality::Finality(Finality::DoomSlug),
                                    )
                                    .await
                                    .map(|acc| acc.amount.as_yoctonear())
                                    .unwrap_or(0))
                            })
                        }
                        Token::Nep141(token_id) => {
                            let rpc_client = rpc_client.clone();
                            Box::pin(async move {
                                Ok(rpc_client
                                    .call::<U128>(
                                        token_id,
                                        "ft_balance_of",
                                        serde_json::json!({"account_id": recipient_to_check.clone()}),
                                        QueryFinality::Finality(Finality::DoomSlug),
                                    )
                                    .await
                                    .map(u128::from)
                                    .unwrap_or(0))
                            })
                        }
                    };

                    let (ft_metadata_result, nft_metadata_result, balance_result) =
                        join!(ft_metadata_future, nft_metadata_future, balance_future);
                    if ft_metadata_result.is_ok() {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is a token contract address, not someone's wallet address, sending tokens to it would likely result in asset loss".to_string(),
                            link: Some(format!("/token/{}", recipient_for_validator_check)),
                            link_text: Some("View token details".to_string()),
                        }));
                    } else if nft_metadata_result.is_ok() {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is an NFT contract address, not someone's wallet address, sending tokens to it would likely result in asset loss".to_string(),
                            link: Some(format!("/nfts/{}", recipient_for_validator_check)),
                            link_text: Some("View NFT collection".to_string()),
                        }));
                    } else if is_validator_supported(
                        &recipient_for_validator_check,
                        network.get_untracked(),
                    ) {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is a validator address. Sending tokens to validators will result in asset loss. Consider using the staking functionality instead".to_string(),
                            link: Some(format!("/stake/{}/stake", recipient_for_validator_check)),
                            link_text: Some("Stake instead".to_string()),
                        }));
                    } else {
                        set_recipient_warning.set(None);
                    }

                    let balance = balance_result.unwrap_or(0);
                    set_recipient_balance.set(Some(balance));
                } else {
                    set_recipient_balance.set(None);
                    set_recipient_warning.set(None);
                }
                set_is_loading_recipient.set(false);
            }
        });
    };

    let check_amount = move |amount: String| {
        set_has_typed_amount.set(true);

        if let Some(handle) = balance_error_timeout.get_untracked() {
            handle.clear();
        }

        if let Some(token) = token() {
            if let Ok(amount_decimal) = amount.parse::<BigDecimal>() {
                if amount_decimal <= BigDecimal::from(0) {
                    set_amount_error.set(Some("Amount must be greater than 0".to_string()));
                    set_balance_error_count.set(0);
                    return;
                }

                let max_amount_decimal =
                    balance_to_decimal(token.balance, token.token.metadata.decimals);
                if amount_decimal > max_amount_decimal {
                    let current_count = balance_error_count.get_untracked();

                    if current_count == 0 {
                        set_amount_error.set(Some("Not enough balance".to_string()));
                        set_balance_error_count.set(1);
                    } else if let Ok(handle) = set_timeout_with_handle(
                        move || {
                            let error_messages = [
                                "Not enough balance",
                                "Still not enough",
                                "Your persistence won't increase your balance",
                                "Try again?",
                                "Minting new tokens...",
                                "Minting failed. Still not enough balance",
                                "Please stop trying",
                                "It won't change anything",
                            ];

                            let message_index = current_count % error_messages.len();
                            set_amount_error.set(Some(error_messages[message_index].to_string()));
                            set_balance_error_count.set(current_count + 1);
                        },
                        Duration::from_millis(750),
                    ) {
                        set_balance_error_timeout.set(Some(handle));
                    }
                    return;
                }

                set_amount_error.set(None);
                set_balance_error_count.set(0);
            } else {
                set_amount_error.set(Some("Please enter amount".to_string()));
                set_balance_error_count.set(0);
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
            "Send {} {} to {}",
            amount.get(),
            token().unwrap().token.metadata.symbol,
            recipient.get()
        );
        let Ok(recipient) = recipient.get().parse::<AccountId>() else {
            panic!(
                "Recipient '{}' cannot be parsed as AccountId, yet recipient_balance is Some",
                recipient()
            );
        };
        let Ok(amount_decimal) = amount.get().parse::<BigDecimal>() else {
            panic!(
                "Amount '{}' cannot be parsed as BigDecimal, yet amount_error is None",
                amount()
            );
        };
        let Some(token) = token() else {
            panic!("Token not found, but tried to send it");
        };
        let amount = decimal_to_balance(amount_decimal, token.token.metadata.decimals);
        let signer_id = accounts
            .get_untracked()
            .selected_account_id
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
                txs.push(
                    EnqueuedTransaction::create(
                        transaction_description,
                        signer_id,
                        match &token.token.account_id {
                            Token::Near => recipient.clone(),
                            Token::Nep141(token_id) => token_id.clone(),
                        },
                        actions,
                    )
                    .1,
                )
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
                                        class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                        style=move || {
                                            if has_typed_recipient.get() {
                                                if recipient_balance.get().is_none()
                                                    && !is_loading_recipient.get()
                                                {
                                                    "border: 2px solid rgb(239 68 68)"
                                                } else if !is_loading_recipient.get()
                                                    && recipient_warning.get().is_none()
                                                {
                                                    "border: 2px solid rgb(34 197 94)"
                                                } else if !is_loading_recipient.get()
                                                    && recipient_warning.get().is_some()
                                                {
                                                    "border: 2px solid rgb(234 179 8)"
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
                                            let value = event_target_value(&ev).to_lowercase();
                                            set_recipient.set(value.clone());
                                            set_is_loading_recipient.set(true);
                                            set_recipient_balance.set(None);
                                            check_recipient(value);
                                        }
                                    />
                                    {move || {
                                        if let Some(warning) = recipient_warning.get() {
                                            view! {
                                                <div class="text-yellow-500 text-sm mt-2 font-medium">
                                                    <div class="flex items-center gap-2 mb-1">
                                                        <Icon
                                                            icon=icondata::LuTriangleAlert
                                                            width="16"
                                                            height="16"
                                                            attr:class="min-w-4 min-h-4"
                                                        />
                                                        <span>{warning.message}</span>
                                                    </div>
                                                    {if let (Some(link), Some(link_text)) = (
                                                        warning.link,
                                                        warning.link_text,
                                                    ) {
                                                        view! {
                                                            <div class="ml-6">
                                                                <A
                                                                    href=link
                                                                    attr:class="text-yellow-400 hover:text-yellow-300 underline cursor-pointer"
                                                                >
                                                                    {link_text}
                                                                </A>
                                                            </div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }}
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                    {move || {
                                        if let Some(recipient_balance) = recipient_balance.get() {
                                            view! {
                                                <p class="text-green-500 text-sm mt-2 font-medium">
                                                    {move || {
                                                        if let Ok(recipient) = recipient.get().parse::<AccountId>()
                                                        {
                                                            format_account_id_no_hide(&recipient)
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    }}" has "
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
                                            class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 text-base"
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
                                            class="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200 no-mobile-ripple"
                                            on:click=move |_| {
                                                let max_amount_decimal = balance_to_decimal(
                                                    token.balance,
                                                    token.token.metadata.decimals,
                                                );
                                                let gas_cost_decimal = if token.token.account_id
                                                    == Token::Near
                                                {
                                                    BigDecimal::from_f64(0.0001).unwrap_or_default()
                                                } else {
                                                    BigDecimal::from(0)
                                                };
                                                let final_amount_decimal = (&max_amount_decimal
                                                    - &gas_cost_decimal)
                                                    .max(BigDecimal::from(0));
                                                let max_amount_str = final_amount_decimal.to_string();
                                                set_amount.set(max_amount_str.clone());
                                                check_amount(max_amount_str);
                                            }
                                        >
                                            MAX
                                        </button>
                                    </div>
                                    {move || {
                                        let error_message = amount_error.get();
                                        let usd_display = if let Ok(amount_decimal) = amount
                                            .get()
                                            .parse::<BigDecimal>()
                                        {
                                            let usd_value_decimal = &amount_decimal
                                                * &token.token.price_usd_hardcoded;
                                            format_usd_value_no_hide(usd_value_decimal)
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
                                    <Icon icon=icondata::LuTriangleAlert width="20" height="20" />
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
