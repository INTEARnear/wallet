use futures_channel::oneshot;
use icondata::*;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::Icon;
use near_min_api::{
    types::{
        near_crypto::{PublicKey, Signature},
        AccountId, CryptoHash, FinalExecutionOutcomeViewEnum, NearGas, NearToken,
    },
    ExperimentalTxDetails,
};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use wasm_bindgen::JsCast;
use web_sys::{js_sys::Date, Window};

use crate::{
    components::DangerConfirmInput,
    contexts::{
        accounts_context::{Account, AccountsContext},
        config_context::ConfigContext,
        connected_apps_context::{
            action_attaches_deposit, is_dangerous_action, ConnectedAppsContext,
        },
        security_log_context::add_security_log,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::{
        is_debug_enabled, WalletSelectorAccessKeyPermission, WalletSelectorAction,
        WalletSelectorTransaction,
    },
};

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SendTransactionsRequest {
    account_id: AccountId,
    nonce: u64,
    public_key: PublicKey,
    signature: Signature,
    transactions: String,
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ReceiveMessage {
    SignAndSendTransactions { data: SendTransactionsRequest },
}

#[derive(Serialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum SendMessage {
    Ready,
    Sent {
        outcomes: Vec<FinalExecutionOutcomeViewEnum>,
    },
    Error {
        message: String,
    },
}

#[component]
fn TransactionAction(
    tx_idx: usize,
    action_idx: usize,
    action: WalletSelectorAction,
    expanded_actions: ReadSignal<HashSet<(usize, usize)>>,
    set_expanded_actions: WriteSignal<HashSet<(usize, usize)>>,
) -> impl IntoView {
    let is_expandable = matches!(action, WalletSelectorAction::FunctionCall { .. });
    let is_expanded = move || expanded_actions.get().contains(&(tx_idx, action_idx));
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let (json_copied, set_json_copied) = signal(false);
    let (cli_copied, set_cli_copied) = signal(false);

    let toggle_action = move |_| {
        set_expanded_actions.update(|set| {
            if !set.remove(&(tx_idx, action_idx)) {
                set.insert((tx_idx, action_idx));
            }
        });
    };

    let copy_args_json = move |args: &serde_json::Value| {
        let minified = serde_json::to_string(args).unwrap_or_default();
        let window = web_sys::window().unwrap();
        let navigator = window.navigator();
        let _ = navigator.clipboard().write_text(&minified);
        set_json_copied(true);
        set_timeout(
            move || set_json_copied(false),
            std::time::Duration::from_millis(2000),
        );
    };

    let copy_cli_command = move |method_name: &str,
                                 args: &serde_json::Value,
                                 gas: NearGas,
                                 deposit: NearToken,
                                 signer: Account| {
        let minified_args = serde_json::to_string(args).unwrap_or_default();

        let command_parts = vec![
            "near".to_string(),
            "contract".to_string(),
            "call-function".to_string(),
            "as-transaction".to_string(),
            "contract_id".to_string(),
            method_name.to_string(),
            "json-args".to_string(),
            minified_args,
            "prepaid-gas".to_string(),
            format!("{gas}"),
            "attached-deposit".to_string(),
            format!("{deposit}"),
            "sign-as".to_string(),
            signer.account_id.to_string(),
            "network-config".to_string(),
            signer.network.to_string().to_lowercase(),
        ];

        let command = shell_words::join(&command_parts);
        let window = web_sys::window().unwrap();
        let navigator = window.navigator();
        let _ = navigator.clipboard().write_text(&command);
        set_cli_copied(true);
        set_timeout(
            move || set_cli_copied(false),
            std::time::Duration::from_millis(2000),
        );
    };

    let format_action = move |action: &WalletSelectorAction| -> String {
        match action {
            WalletSelectorAction::CreateAccount => "Create Account".into(),
            WalletSelectorAction::DeployContract { code } => {
                format!("Deploy Contract ({:?})", CryptoHash::hash_bytes(code))
            }
            WalletSelectorAction::FunctionCall {
                method_name,
                gas,
                deposit,
                ..
            } => {
                let deposit_str = if *deposit == 0 {
                    String::new()
                } else {
                    format!(" and deposit {}", NearToken::from_yoctonear(*deposit))
                };
                format!(
                    "Call '{method_name}' with {gas}{deposit_str}",
                    gas = NearGas::from_gas(*gas)
                )
            }
            WalletSelectorAction::Transfer { deposit } => {
                format!("Transfer {}", NearToken::from_yoctonear(*deposit))
            }
            WalletSelectorAction::Stake { stake, public_key } => {
                format!(
                    "Stake {} with key {public_key}",
                    NearToken::from_yoctonear(*stake)
                )
            }
            WalletSelectorAction::AddKey {
                public_key,
                access_key,
            } => match &access_key.permission {
                WalletSelectorAccessKeyPermission::FullAccess => {
                    format!("Add Full Access Key {public_key}")
                }
                WalletSelectorAccessKeyPermission::FunctionCall {
                    receiver_id,
                    allowance,
                    method_names,
                } => {
                    let methods = method_names
                        .as_ref()
                        .map(|m| m.join(", "))
                        .unwrap_or_else(|| "any".into());
                    let allowance_str = allowance
                        .map(|a| format!(" and allowance {a}"))
                        .unwrap_or_default();
                    format!("Add Function Call Key {public_key} for contract {receiver_id} with methods: {methods}{allowance_str}")
                }
            },
            WalletSelectorAction::DeleteKey { public_key } => {
                format!("Delete Key {public_key}")
            }
            WalletSelectorAction::DeleteAccount { beneficiary_id } => {
                format!("Delete Account (funds go to {beneficiary_id})")
            }
        }
    };

    view! {
        <div class="flex flex-col gap-1">
            <div class="flex items-start gap-2">
                <span class="text-neutral-400 text-sm min-w-[1.5rem]">
                    {format!("{}.", action_idx + 1)}
                </span>
                <span class="text-neutral-300 text-sm flex-1">{format_action(&action)}</span>
                {move || {
                    if is_expandable {
                        view! {
                            <button
                                class="text-blue-400 hover:text-blue-300 transition-colors text-sm px-2"
                                on:click=toggle_action
                            >
                                {if is_expanded() { "Hide args" } else { "Show args" }}
                            </button>
                        }
                            .into_any()
                    } else {
                        ().into_any()
                    }
                }}
            </div>
            {move || {
                if is_expanded() {
                    if let WalletSelectorAction::FunctionCall { method_name, args, gas, deposit } = &action {
                        let args_clone = args.clone();
                        let args_clone2 = args.clone();
                        let method_name_clone = method_name.clone();
                        let gas_clone = *gas;
                        let deposit_clone = *deposit;
                        view! {
                            <div class="flex flex-col gap-2">
                                <pre class="text-xs font-mono bg-neutral-800 text-neutral-300 rounded-lg p-3 overflow-x-auto">
                                    {serde_json::to_string_pretty(&args_clone2).unwrap()}
                                </pre>
                                <div class="flex gap-2">
                                    <button
                                        class="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-neutral-800 rounded flex items-center gap-2 relative"
                                        on:click=move |_| copy_args_json(&args_clone2)
                                    >
                                        <Icon icon=LuClipboard width="14" height="14" />
                                        "Copy JSON"
                                        {move || {
                                            if json_copied.get() {
                                                view! {
                                                    <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 rounded">
                                                        "Copied!"
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </button>
                                    <button
                                        class="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-neutral-800 rounded flex items-center gap-2 relative"
                                        on:click=move |_| copy_cli_command(
                                            &method_name_clone,
                                            &args_clone,
                                            NearGas::from_gas(gas_clone),
                                            NearToken::from_yoctonear(deposit_clone),
                                            accounts
                                                .get()
                                                .accounts
                                                .into_iter()
                                                .find(|a| {
                                                    a.account_id == accounts.get().selected_account_id.unwrap()
                                                })
                                                .unwrap(),
                                        )
                                    >
                                        <Icon icon=LuTerminal width="14" height="14" />
                                        "Copy CLI Command"
                                        {move || {
                                            if cli_copied.get() {
                                                view! {
                                                    <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-700 text-white text-xs px-2 py-1 rounded">
                                                        "Copied!"
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </button>
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
    }
}

#[component]
fn TransactionItem<'a>(
    tx: &'a WalletSelectorTransaction,
    tx_idx: usize,
    expanded_actions: ReadSignal<HashSet<(usize, usize)>>,
    set_expanded_actions: WriteSignal<HashSet<(usize, usize)>>,
) -> impl IntoView {
    view! {
        <div class="py-4 first:pt-0 last:pb-0">
            <div class="flex items-start gap-3 mb-2">
                <div class="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-700/50 text-sm text-neutral-300 font-medium">
                    {(tx_idx + 1).to_string()}
                </div>
                <div class="flex-1">
                    <p class="text-neutral-200 font-medium mb-1">
                        {"Transaction to "}
                        <code class="px-1.5 py-0.5 bg-neutral-700/50 rounded text-sm font-mono">
                            {tx.receiver_id.to_string()}
                        </code>
                    </p>
                    <div class="pl-4 flex flex-col gap-2">
                        {tx
                            .actions
                            .iter()
                            .enumerate()
                            .map(|(action_idx, action)| {
                                view! {
                                    <TransactionAction
                                        tx_idx=tx_idx
                                        action_idx=action_idx
                                        action=action.clone()
                                        expanded_actions=expanded_actions
                                        set_expanded_actions=set_expanded_actions
                                    />
                                }
                            })
                            .collect_view()}
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
fn TransactionList(
    transactions: Vec<WalletSelectorTransaction>,
    expanded_actions: ReadSignal<HashSet<(usize, usize)>>,
    set_expanded_actions: WriteSignal<HashSet<(usize, usize)>>,
) -> impl IntoView {
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();

    let toggle_details = move |_| {
        set_config.update(|cfg| {
            cfg.show_transaction_details = !cfg.show_transaction_details;
        });
    };

    view! {
        <div class="flex flex-col gap-4">
            <div class="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <p class="text-neutral-400 text-sm">
                    "Transaction preview is not yet available. Stay tuned for wallet updates!"
                </p>
            </div>

            <div>
                <div class="flex justify-between items-center mb-2">
                    <p class="text-neutral-300 text-sm font-medium">"Transaction Details:"</p>
                    <button
                        class="text-blue-400 hover:text-blue-300 transition-colors text-sm px-2"
                        on:click=toggle_details
                    >
                        {move || {
                            if config.get().show_transaction_details {
                                "Hide details"
                            } else {
                                "Show details"
                            }
                        }}
                    </button>
                </div>
                {move || {
                    if config.get().show_transaction_details {
                        view! {
                            <div class="flex flex-col divide-y divide-neutral-700/50">
                                {transactions
                                    .iter()
                                    .enumerate()
                                    .map(|(tx_idx, tx)| {
                                        view! {
                                            <TransactionItem
                                                tx=tx
                                                tx_idx=tx_idx
                                                expanded_actions=expanded_actions
                                                set_expanded_actions=set_expanded_actions
                                            />
                                        }
                                    })
                                    .collect_view()}
                            </div>
                        }
                            .into_any()
                    } else {
                        view! {
                            <div class="p-3 bg-neutral-800/50 rounded-lg text-neutral-400 text-sm">
                                {format!(
                                    "{} {}",
                                    transactions.len(),
                                    if transactions.len() == 1 {
                                        "transaction"
                                    } else {
                                        "transactions"
                                    },
                                )} " to be executed"
                            </div>
                        }
                            .into_any()
                    }
                }}
            </div>
        </div>
    }
}

#[component]
pub fn SendTransactions() -> impl IntoView {
    let (loading, set_loading) = signal(true);
    let (request_data, set_request_data) = signal::<Option<SendTransactionsRequest>>(None);
    let (origin, set_origin) = signal::<String>("*".to_string());
    let (started_sending, set_started_sending) = signal(false);
    let (is_confirmed, set_is_confirmed) = signal(false);
    let (remember_contract, set_remember_contract) = signal(false);
    let (remember_non_financial, set_remember_non_financial) = signal(false);
    let ConnectedAppsContext { apps, set_apps, .. } = expect_context::<ConnectedAppsContext>();
    let AccountsContext {
        accounts,
        set_accounts,
        ..
    } = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let (expanded_actions, set_expanded_actions) =
        signal::<HashSet<(usize, usize)>>(HashSet::new());

    let is_localhost_app = move |app: &crate::contexts::connected_apps_context::ConnectedApp| {
        let domain = app
            .origin
            .trim_start_matches("http://")
            .trim_start_matches("https://")
            .split("/")
            .next()
            .unwrap()
            .split(":")
            .next()
            .unwrap();
        domain == "localhost"
            || domain == "127.0.0.1"
            || domain.starts_with("192.168.")
            || domain.ends_with(".local")
    };

    let opener = || {
        if let Ok(opener) = window().opener() {
            opener.unchecked_into::<Window>()
        } else {
            window()
        }
    };

    window_event_listener(leptos::ev::message, move |event| {
        if is_debug_enabled() {
            log::info!(
                "Received message event from origin: {}, data: {:?}",
                event.origin(),
                event.data()
            );
        }

        if let Ok(message) = serde_wasm_bindgen::from_value::<ReceiveMessage>(event.data()) {
            if is_debug_enabled() {
                log::info!("Successfully parsed message: {:?}", message);
            }
            match message {
                ReceiveMessage::SignAndSendTransactions { data } => {
                    set_origin(event.origin());
                    set_loading(false);
                    set_request_data(Some(data));
                }
            }
        } else if is_debug_enabled() {
            log::info!("Failed to parse message as ReceiveMessage");
        }
    });

    Effect::new(move || {
        let ready_message = SendMessage::Ready;
        let js_value = serde_wasm_bindgen::to_value(&ready_message).unwrap();
        opener()
            .post_message(&js_value, "*")
            .expect("Failed to send message");
    });

    let connected_app = Memo::new(move |_| {
        if let Some(request_data) = &*request_data.read() {
            let text_to_prove = format!("{}|{}", request_data.nonce, request_data.transactions);
            let to_prove = text_to_prove.as_bytes();
            let to_prove = CryptoHash::hash_bytes(to_prove); // sha256
            let is_valid = request_data
                .signature
                .verify(to_prove.as_bytes(), &request_data.public_key)
                && request_data.nonce > Date::now() as u64 - 1000 * 60 * 5
                && request_data.nonce <= Date::now() as u64;
            is_valid
                .then(|| {
                    apps.get()
                        .apps
                        .iter()
                        .find(|app| {
                            app.public_key == request_data.public_key
                                && app.account_id == request_data.account_id
                                && app.origin == origin()
                                && app.logged_out_at.is_none()
                        })
                        .cloned()
                })
                .flatten()
        } else {
            None
        }
    });
    Effect::new(move || {
        if let Some(app) = connected_app() {
            if accounts.get().selected_account_id != Some(app.account_id.clone()) {
                set_accounts.update(|accounts| {
                    accounts.selected_account_id = Some(app.account_id);
                });
            }
        }
    });

    let transactions = Memo::new(move |_| {
        request_data
            .get()
            .and_then(|request_data| {
                serde_json::from_str::<Vec<WalletSelectorTransaction>>(&request_data.transactions)
                    .ok()
            })
            .map(|txs| txs.to_vec())
    });

    let has_deposit = Memo::new(move |_| {
        transactions
            .get()
            .map(|transactions| {
                transactions.iter().any(|tx| {
                    tx.actions
                        .iter()
                        .any(|action| action_attaches_deposit(&action.clone().into()))
                })
            })
            .unwrap_or(true)
    });

    let has_dangerous_actions = Memo::new(move |_| {
        request_data
            .get()
            .and_then(|request_data| {
                serde_json::from_str::<Vec<WalletSelectorTransaction>>(&request_data.transactions)
                    .ok()
                    .map(|transactions| {
                        transactions.iter().any(|tx| {
                            tx.actions
                                .iter()
                                .any(|action| is_dangerous_action(&action.clone().into()))
                        })
                    })
            })
            .unwrap_or(false)
    });

    let is_approve_enabled = Memo::new(move |_| {
        if started_sending.get() {
            return false;
        }
        if has_dangerous_actions.get() {
            is_confirmed.get()
        } else {
            true
        }
    });

    let common_receiver = Memo::new(move |_| {
        transactions.get().and_then(|txs| {
            if txs.is_empty() {
                return None;
            }
            let first_receiver = txs[0].receiver_id.clone();
            if txs.iter().all(|tx| tx.receiver_id == first_receiver) {
                Some(first_receiver)
            } else {
                None
            }
        })
    });

    let should_autoconfirm = Memo::new(move |_| {
        if has_dangerous_actions.get() || has_deposit.get() {
            return false;
        }

        let Some(app) = connected_app() else {
            return false;
        };
        let Some(txs) = transactions.get() else {
            return false;
        };

        // Check if all transactions are eligible for auto-confirm
        txs.iter().all(|tx| {
            app.autoconfirm_non_financial
                || app.autoconfirm_contracts.contains(&tx.receiver_id)
                || app.autoconfirm_all
        })
    });

    let has_multiple_txs_same_receiver = Memo::new(move |_| {
        transactions
            .get()
            .map(|txs| {
                let mut seen_receivers = std::collections::HashMap::new();
                for tx in txs.iter() {
                    *seen_receivers.entry(tx.receiver_id.clone()).or_insert(0) += 1;
                }
                seen_receivers.values().any(|&count| count > 1)
            })
            .unwrap_or(false)
    });

    let has_high_gas_function_call = Memo::new(move |_| {
        transactions
            .get()
            .map(|txs| {
                txs.iter().any(|tx| {
                    tx.actions.iter().any(|action| {
                        if let WalletSelectorAction::FunctionCall { gas, .. } = action {
                            *gas >= NearGas::from_tgas(300).as_gas()
                        } else {
                            false
                        }
                    })
                })
            })
            .unwrap_or(false)
    });

    let handle_approve = move || {
        if started_sending.get_untracked() {
            return;
        }
        set_started_sending(true);
        let Some(request_data) = &*request_data.read() else {
            log::error!("No request data found");
            return;
        };

        // Update app settings if checkboxes are checked
        if let Some(app) = connected_app() {
            if let Some(receiver_id) = common_receiver.get() {
                set_apps.update(|state| {
                    if let Some(app_to_update) = state.apps.iter_mut().find(|a| {
                        a.account_id == app.account_id
                            && a.public_key == app.public_key
                            && a.origin == app.origin
                            && a.logged_out_at.is_none()
                    }) {
                        if remember_contract.get() {
                            app_to_update.autoconfirm_contracts.insert(receiver_id);
                            if remember_non_financial.get() {
                                app_to_update.autoconfirm_non_financial = true;
                            }
                        }
                    }
                });
            }
        }

        let deserialized_transactions =
            serde_json::from_str::<Vec<WalletSelectorTransaction>>(&request_data.transactions);
        let mut transactions: Vec<(
            oneshot::Receiver<Result<ExperimentalTxDetails, String>>,
            EnqueuedTransaction,
        )> = if let Ok(transactions) = deserialized_transactions {
            transactions
                .into_iter()
                .map(|transaction| {
                    EnqueuedTransaction::create(
                        "App Interaction".to_string(),
                        transaction.signer_id,
                        transaction.receiver_id,
                        transaction
                            .actions
                            .into_iter()
                            .map(|action| action.into())
                            .collect(),
                    )
                })
                .collect()
        } else {
            log::error!("Failed to deserialize transactions");
            let message = SendMessage::Error {
                message: "Failed to deserialize transactions".to_string(),
            };
            let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
            opener()
                .post_message(&js_value, &origin())
                .expect("Failed to send message");
            return;
        };
        if transactions.is_empty() {
            let message = SendMessage::Error {
                message: "No transactions (an empty array) passed to the wallet".to_string(),
            };
            let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
            opener()
                .post_message(&js_value, &origin())
                .expect("Failed to send message");
            return;
        }
        add_security_log(
            format!(
                "Sent{} transactions on /send-transactions from {}: {}",
                if has_dangerous_actions.get_untracked() {
                    if is_confirmed.get_untracked() {
                        " dangerous (typed 'CONFIRM')"
                    } else {
                        " dangerous (not typed 'CONFIRM')"
                    }
                } else {
                    ""
                },
                origin.get_untracked(),
                if request_data.transactions.len() > 5000 {
                    format!("{}...", &request_data.transactions[..5000])
                } else {
                    request_data.transactions.clone()
                }
            ),
            request_data.account_id.clone(),
        );

        let (first_details_tx, first_transaction) = transactions.remove(0);
        let rest_transactions = transactions
            .into_iter()
            .map(|(details_tx, transaction)| {
                (details_tx, transaction.in_same_queue_as(&first_transaction))
            })
            .collect::<Vec<_>>();
        let transactions =
            std::iter::once((first_details_tx, first_transaction)).chain(rest_transactions);

        let (details_receivers, transactions): (Vec<_>, Vec<_>) = transactions.into_iter().unzip();
        add_transaction.update(|queue| queue.extend(transactions));
        let details = futures_util::future::join_all(details_receivers);
        spawn_local(async move {
            let details = details.await.into_iter().collect::<Result<Vec<_>, _>>();
            match details {
                Ok(details) => {
                    let outcomes = details
                        .into_iter()
                        .enumerate()
                        .map(|(i, outcome_result)| {
                            outcome_result
                                .map(|d| d.final_execution_outcome)
                                .map_err(|e| format!("Failed to send transaction {}: {e}", i + 1))
                        })
                        .collect::<Result<Option<Vec<_>>, String>>();
                    let outcomes = match outcomes {
                        Ok(Some(outcomes)) => outcomes,
                        Ok(None) => {
                            // Not available ..?
                            panic!(
                                "Transaction details not available for one or more transactions"
                            );
                        }
                        Err(error) => {
                            let message = SendMessage::Error { message: error };
                            let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
                            opener()
                                .post_message(&js_value, &origin())
                                .expect("Failed to send message");
                            return;
                        }
                    };
                    let message = SendMessage::Sent {
                        outcomes: outcomes
                            .into_iter()
                            .map(|d| {
                                FinalExecutionOutcomeViewEnum::FinalExecutionOutcomeWithReceipt(d)
                            })
                            .collect(),
                    };
                    let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
                    opener()
                        .post_message(&js_value, &origin())
                        .expect("Failed to send message");
                }
                Err(_) => {
                    log::error!("Failed to fetch transaction details");
                    let js_value = serde_wasm_bindgen::to_value(&SendMessage::Error {
                        message: "Failed to fetch transaction details".to_string(),
                    })
                    .unwrap();
                    opener()
                        .post_message(&js_value, &origin())
                        .expect("Failed to send message");
                }
            }
        });
    };

    let handle_cancel = move |_| {
        let message = SendMessage::Error {
            message: "User rejected the transactions".to_string(),
        };
        let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
        opener()
            .post_message(&js_value, &origin())
            .expect("Failed to send message");
    };

    Effect::new(move || {
        if should_autoconfirm.get() {
            log::info!("Auto-confirming transactions");
            handle_approve();
        }
    });

    view! {
        <div class="flex flex-col items-center justify-center min-h-[calc(80vh-100px)] pt-4 pb-4">
            {move || {
                if loading.get() {
                    view! {
                        <div class="flex flex-col items-center gap-4">
                            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                            <p class="text-white text-lg">"Receiving transaction details..."</p>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="flex flex-col items-center gap-6 max-w-md w-full">
                            <h2 class="text-2xl font-bold text-white mb-2 wrap-anywhere">
                                "Approve Transactions"
                            </h2>
                            <div class="flex flex-col gap-4 w-full">
                                <div class="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 shadow-lg">
                                    <div class="flex items-center gap-3 pb-4 mb-4 border-b border-neutral-700/50">
                                        <div class="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center">
                                            <span class="text-neutral-300 text-lg">{"📝"}</span>
                                        </div>
                                        <div>
                                            <p class="text-neutral-400 text-sm">"Request from"</p>
                                            <p class="text-white font-medium wrap-anywhere">
                                                {if let Some(app) = connected_app() {
                                                    if is_localhost_app(&app) {
                                                        "🛠 Localhost".to_string()
                                                    } else {
                                                        format!("🔒 {}", app.origin)
                                                    }
                                                } else {
                                                    "⚠️ Unknown".to_string()
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                    {move || {
                                        transactions
                                            .get()
                                            .map(|txs| {
                                                view! {
                                                    <TransactionList
                                                        transactions=txs
                                                        expanded_actions=expanded_actions
                                                        set_expanded_actions=set_expanded_actions
                                                    />
                                                }
                                                    .into_any()
                                            })
                                            .unwrap_or(().into_any())
                                    }}
                                </div>
                                {move || {
                                    let mut warnings = Vec::new();
                                    if has_multiple_txs_same_receiver.get() {
                                        warnings
                                            .push(
                                                view! {
                                                    <div class="flex items-center gap-2 text-yellow-500">
                                                        <Icon
                                                            icon=LuAlertTriangle
                                                            width="20"
                                                            height="20"
                                                            attr:class="min-w-5 min-h-5"
                                                        />
                                                        <div>
                                                            <p class="font-medium">
                                                                "Multiple Transactions to Same Contract"
                                                            </p>
                                                            <p class="text-yellow-500/80 text-sm">
                                                                "Consider combining these into a single transaction with multiple actions to speed up the user experience and have atomicity between these transactions."
                                                            </p>
                                                        </div>
                                                    </div>
                                                },
                                            );
                                    }
                                    if has_high_gas_function_call.get() {
                                        warnings
                                            .push(
                                                view! {
                                                    <div class="flex items-center gap-2 text-yellow-500">
                                                        <Icon
                                                            icon=LuAlertTriangle
                                                            width="20"
                                                            height="20"
                                                            attr:class="min-w-5 min-h-5"
                                                        />
                                                        <div>
                                                            <p class="font-medium">"High Gas Usage Detected"</p>
                                                            <p class="text-yellow-500/80 text-sm">
                                                                "One or more function calls attach 300 TGas or more. Consider reducing the gas if the full amount isn't needed, because it can make some people unable to use your app, and there will be a high fee penalty introduced in the future NEAR release."
                                                            </p>
                                                        </div>
                                                    </div>
                                                },
                                            );
                                    }
                                    if let Some(app) = connected_app() {
                                        if is_localhost_app(&app) && !warnings.is_empty() {
                                            view! {
                                                <div class="p-4 bg-yellow-500/10 backdrop-blur-sm rounded-xl border border-yellow-500/20 flex flex-col gap-4">
                                                    {warnings}
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
                                {move || {
                                    if has_dangerous_actions.get() {
                                        view! {
                                            <DangerConfirmInput
                                                set_is_confirmed=set_is_confirmed
                                                warning_title="⚠️ Warning: This transaction is dangerous!"
                                                warning_message="It can allow the app to do things that can affect your account. Please confirm only if you trust the app and know that you risk losing your account."
                                            />
                                        }
                                            .into_any()
                                    } else if !has_deposit.get() && !should_autoconfirm.get()
                                        && connected_app.read().is_some()
                                    {
                                        view! {
                                            <div class="p-4 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50">
                                                <div class="flex flex-col gap-3">
                                                    {move || {
                                                        if let Some(receiver_id) = common_receiver.get() {
                                                            view! {
                                                                <label class="flex items-center gap-2 text-neutral-200">
                                                                    <input
                                                                        type="checkbox"
                                                                        class="form-checkbox rounded bg-neutral-700 border-neutral-600 text-blue-500 focus:ring-blue-500"
                                                                        prop:checked=remember_contract
                                                                        on:change=move |ev| {
                                                                            set_remember_contract(event_target_checked(&ev));
                                                                            if !event_target_checked(&ev) {
                                                                                set_remember_non_financial(false);
                                                                            }
                                                                        }
                                                                    />
                                                                    <span>
                                                                        "Remember for all app interactions with "
                                                                        <code class="px-1 py-0.5 bg-neutral-700/50 rounded">
                                                                            {receiver_id.to_string()}
                                                                        </code>
                                                                    </span>
                                                                </label>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    }}
                                                    {move || {
                                                        if remember_contract.get() {
                                                            view! {
                                                                <label class="flex items-center gap-2 text-neutral-200 pl-6">
                                                                    <input
                                                                        type="checkbox"
                                                                        class="form-checkbox rounded bg-neutral-700 border-neutral-600 text-blue-500 focus:ring-blue-500"
                                                                        prop:checked=remember_non_financial
                                                                        on:change=move |ev| set_remember_non_financial(
                                                                            event_target_checked(&ev),
                                                                        )
                                                                    />
                                                                    <span>
                                                                        "Remember for non-financial interactions with all contracts"
                                                                    </span>
                                                                </label>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    }}
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }
                                }}
                            </div>
                            <div class="flex flex-col gap-3 w-full mt-2">
                                <button
                                    class=move || {
                                        let base_classes = "w-full px-6 py-3.5 text-white font-medium rounded-xl transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
                                        if has_dangerous_actions.get() {
                                            format!(
                                                "{base_classes} bg-red-600 hover:bg-red-700 shadow-red-500/10 hover:shadow-red-500/20 disabled:hover:bg-red-600 disabled:hover:shadow-red-500/10",
                                            )
                                        } else {
                                            format!(
                                                "{base_classes} bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 hover:shadow-blue-500/20 disabled:hover:bg-blue-600 disabled:hover:shadow-blue-500/10",
                                            )
                                        }
                                    }
                                    on:click=move |_| handle_approve()
                                    disabled=move || {
                                        !is_approve_enabled.get() || should_autoconfirm.get()
                                    }
                                >
                                    {move || {
                                        if should_autoconfirm.get() {
                                            "Auto-confirming..."
                                        } else {
                                            "Approve"
                                        }
                                    }}
                                </button>
                                <button
                                    class="w-full px-6 py-3.5 bg-neutral-800 text-white font-medium rounded-xl hover:bg-neutral-700 transition-all duration-200 shadow-lg shadow-black/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-800"
                                    on:click=handle_cancel
                                    disabled=started_sending
                                >
                                    "Cancel"
                                </button>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
