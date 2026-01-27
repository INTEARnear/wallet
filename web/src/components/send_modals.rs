use crate::{
    contexts::{
        accounts_context::AccountsContext, modal_context::ModalContext, rpc_context::RpcContext,
        tokens_context::TokenData, transaction_queue_context::TransactionQueueContext,
    },
    pages::send::execute_send,
    utils::{
        balance_to_decimal, format_account_id_no_hide, format_token_amount_full_precision,
        format_usd_value_no_hide,
    },
};
use bigdecimal::Zero;
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::Icon;
use near_min_api::types::{AccountId, Balance};

#[derive(Debug, Clone)]
pub struct SendConfirmationData {
    pub token: TokenData,
    pub transfers: Vec<SendConfirmationTransfer>,
}

#[derive(Debug, Clone)]
pub struct SendConfirmationTransfer {
    pub recipient: AccountId,
    pub amount: Balance,
}

#[derive(Debug, Clone)]
pub struct SendResult {
    pub token: TokenData,
    pub recipients: Vec<AccountId>,
    pub amount: Balance,
}

#[component]
pub fn SendConfirmationModal(
    confirmation_data: SendConfirmationData,
    clear_fields: impl Fn() + Copy + 'static,
) -> impl IntoView {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let ModalContext { modal } = expect_context::<ModalContext>();
    let RpcContext {
        client: rpc_client, ..
    } = expect_context::<RpcContext>();
    let confirmation_for_button = confirmation_data.clone();
    let transfers = confirmation_data.transfers.clone();

    let total_amount = transfers
        .iter()
        .map(|transfer| transfer.amount)
        .sum::<Balance>();
    let amount_formatted = format_token_amount_full_precision(
        total_amount,
        confirmation_data.token.token.metadata.decimals,
        &confirmation_data.token.token.metadata.symbol,
    );
    let amount_decimal = balance_to_decimal(
        total_amount,
        confirmation_data.token.token.metadata.decimals,
    );
    let amount_usd = if !confirmation_data.token.token.price_usd_hardcoded.is_zero() {
        Some(&amount_decimal * &confirmation_data.token.token.price_usd_hardcoded)
    } else {
        None
    };
    let amount_usd_clone = amount_usd.clone();

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
                        <h3 class="text-white font-bold text-xl mb-2">"Confirm Send"</h3>
                        <p class="text-gray-400 text-sm">
                            "Review the details below and confirm to proceed with the transfer."
                        </p>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">"You're sending"</div>
                            <div class="flex items-center gap-3">
                                {match confirmation_data.token.token.metadata.icon {
                                    Some(icon) => {
                                        view! {
                                            <img
                                                src=icon
                                                alt=confirmation_data.token.token.metadata.symbol.clone()
                                                class="w-8 h-8 rounded-full"
                                            />
                                        }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                                                {confirmation_data
                                                    .token
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
                                    <div class="text-white font-medium text-lg">
                                        {amount_formatted.clone()}
                                    </div>
                                    <div class="text-gray-400 text-sm">
                                        {move || {
                                            if let Some(usd_amount) = amount_usd.clone() {
                                                format_usd_value_no_hide(usd_amount)
                                            } else {
                                                String::new()
                                            }
                                        }}
                                    </div>
                                    {if confirmation_data.transfers.len() > 1 {
                                        view! {
                                            <div class="text-gray-500 text-xs mt-1">
                                                {format!(
                                                    "Total across {} recipients",
                                                    confirmation_data.transfers.len(),
                                                )}
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }}
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
                            <div class="text-gray-400 text-sm mb-3">
                                {if confirmation_data.transfers.len() == 1 {
                                    "To account".to_string()
                                } else {
                                    format!("To {} accounts", confirmation_data.transfers.len())
                                }}
                            </div>
                            <div class="space-y-2 max-h-48 overflow-y-auto">
                                {transfers
                                    .into_iter()
                                    .enumerate()
                                    .map(|(index, transfer)| {
                                        let recipient = transfer.recipient.clone();
                                        let individual_amount_formatted = format_token_amount_full_precision(
                                            transfer.amount,
                                            confirmation_data.token.token.metadata.decimals,
                                            &confirmation_data.token.token.metadata.symbol,
                                        );
                                        let individual_amount_decimal = balance_to_decimal(
                                            transfer.amount,
                                            confirmation_data.token.token.metadata.decimals,
                                        );
                                        let individual_usd = if !confirmation_data
                                            .token
                                            .token
                                            .price_usd_hardcoded
                                            .is_zero()
                                        {
                                            Some(
                                                &individual_amount_decimal
                                                    * &confirmation_data.token.token.price_usd_hardcoded,
                                            )
                                        } else {
                                            None
                                        };
                                        view! {
                                            <div class="flex justify-between items-center p-3 bg-neutral-700/50 rounded-lg border border-neutral-600/30 text-left">
                                                <div class="flex-1 mr-3 justify-start">
                                                    <div class="text-white font-medium text-sm break-all">
                                                        {format_account_id_no_hide(&recipient)}
                                                    </div>
                                                    {if confirmation_data.transfers.len() > 1 {
                                                        view! {
                                                            <div class="text-gray-500 text-xs mt-1">
                                                                {format!("#{}", index + 1)}
                                                            </div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }}
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-gray-300 text-sm font-mono font-medium">
                                                        {individual_amount_formatted}
                                                    </div>
                                                    {if let Some(usd) = individual_usd {
                                                        view! {
                                                            <div class="text-gray-400 text-xs mt-1">
                                                                {format_usd_value_no_hide(usd)}
                                                            </div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }}
                                                </div>
                                            </div>
                                        }
                                    })
                                    .collect::<Vec<_>>()}
                            </div>
                            {if confirmation_data.transfers.len() > 1 {
                                view! {
                                    <div class="mt-3 pt-3 border-t border-neutral-600/30">
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-400 text-sm font-medium">
                                                "Total:"
                                            </span>
                                            <div class="text-right">
                                                <div class="text-white font-medium text-sm font-mono">
                                                    {amount_formatted}
                                                </div>
                                                {if let Some(usd_amount) = amount_usd_clone {
                                                    view! {
                                                        <div class="text-gray-400 text-xs">
                                                            {format_usd_value_no_hide(usd_amount)}
                                                        </div>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                }
                                    .into_any()
                            } else {
                                ().into_any()
                            }}
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button
                            class="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                            on:click=move |_| modal.set(None)
                        >
                            "Cancel"
                        </button>
                        <button
                            class="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-4 py-3 font-medium transition-all cursor-pointer"
                            on:click={
                                let confirmation_clone = confirmation_for_button.clone();
                                move |_| {
                                    let Some(selected_account_id) = accounts
                                        .get_untracked()
                                        .selected_account_id else {
                                        return;
                                    };
                                    modal.set(None);
                                    let confirmation_exec = confirmation_clone.clone();
                                    spawn_local(
                                        execute_send(
                                            confirmation_exec,
                                            selected_account_id,
                                            add_transaction,
                                            modal,
                                            clear_fields,
                                            rpc_client(),
                                        ),
                                    );
                                }
                            }
                        >
                            "Confirm Send"
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn SendSuccessModal(result: SendResult) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let amount_formatted = format_token_amount_full_precision(
        result.amount,
        result.token.token.metadata.decimals,
        &result.token.token.metadata.symbol,
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
                        <h3 class="text-white font-bold text-xl mb-2">"Sent!"</h3>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">"You sent"</div>
                            <div class="flex items-center gap-3">
                                {match result.token.token.metadata.icon {
                                    Some(icon) => {
                                        view! {
                                            <img
                                                src=icon
                                                alt=result.token.token.metadata.symbol.clone()
                                                class="w-8 h-8 rounded-full"
                                            />
                                        }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                                                {result
                                                    .token
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
                                }} <div>
                                    <div class="text-white font-medium text-lg">
                                        {amount_formatted}
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
                            <div class="text-gray-400 text-sm mb-3">
                                {if result.recipients.len() == 1 {
                                    "To recipient".to_string()
                                } else {
                                    format!("To {} recipients", result.recipients.len())
                                }}
                            </div>
                            <div class="max-h-32 overflow-y-auto space-y-2">
                                {result
                                    .recipients
                                    .iter()
                                    .enumerate()
                                    .map(|(index, recipient)| {
                                        view! {
                                            <div class="flex items-center justify-between p-2 bg-neutral-700/50 rounded border border-neutral-600/30">
                                                <span class="text-white font-medium text-sm break-all">
                                                    {format_account_id_no_hide(recipient)}
                                                </span>
                                                {if result.recipients.len() > 1 {
                                                    view! {
                                                        <span class="text-gray-500 text-xs ml-2 shrink-0">
                                                            {format!("#{}", index + 1)}
                                                        </span>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }}
                                            </div>
                                        }
                                    })
                                    .collect::<Vec<_>>()}
                            </div>
                        </div>
                    </div>

                    <button
                        class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn SendErrorModal() -> impl IntoView {
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
                        <h3 class="text-white font-bold text-xl mb-2">"Send Failed"</h3>
                        <p class="text-gray-400 text-sm">
                            "The send transaction failed. Please check the transaction details and try again."
                        </p>
                    </div>

                    <button
                        class="w-full mt-6 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}
