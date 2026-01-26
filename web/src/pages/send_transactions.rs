use base64::{Engine, prelude::BASE64_STANDARD};
use futures_channel::oneshot;
use icondata::*;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::Icon;
use leptos_router::hooks::use_location;
use near_min_api::{
    ExperimentalTxDetails,
    types::{
        AccessKeyPermission, AccountId, Action, AddKeyAction, CryptoHash, DeleteAccountAction,
        DeleteKeyAction, DeployContractAction, DeployGlobalContractAction,
        FinalExecutionOutcomeViewEnum, FunctionCallAction, FunctionCallPermission,
        GlobalContractDeployMode, GlobalContractIdentifier, NearGas, NearToken, StakeAction,
        TransferAction, UseGlobalContractAction,
        near_crypto::{PublicKey, Signature},
    },
};
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    time::Duration,
};
use wasm_bindgen::JsCast;
use web_sys::{Window, js_sys::Date};

use crate::{
    components::danger_confirm_input::DangerConfirmInput,
    contexts::{
        accounts_context::{Account, AccountsContext},
        connected_apps_context::{
            ConnectedAppsContext, action_attaches_deposit, is_dangerous_action,
        },
        network_context::Network,
        security_log_context::add_security_log,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    pages::connect::submit_tauri_response,
    utils::{
        SendTransactionsAction, WalletSelectorAction, WalletSelectorTransaction,
        format_token_amount_no_hide, is_debug_enabled, serialize_to_js_value,
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
    action: SendTransactionsAction,
    expanded_actions: ReadSignal<HashSet<(usize, usize)>>,
    set_expanded_actions: WriteSignal<HashSet<(usize, usize)>>,
    receiver_id: AccountId,
) -> impl IntoView {
    let is_expandable = matches!(
        action,
        SendTransactionsAction::Native(Action::FunctionCall(_))
            | SendTransactionsAction::WalletSelector(WalletSelectorAction::FunctionCall { .. })
    );
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
        let navigator = window().navigator();
        let _ = navigator.clipboard().write_text(&minified);
        set_json_copied(true);
        set_timeout(move || set_json_copied(false), Duration::from_millis(2000));
    };

    let copy_cli_command = move |contract_id: &AccountId,
                                 method_name: &str,
                                 args: &[u8],
                                 gas: NearGas,
                                 deposit: NearToken,
                                 signer: Account| {
        let (args_type, args_value) =
            if let Ok(value) = serde_json::from_slice::<serde_json::Value>(args) {
                (
                    "json-args".to_string(),
                    serde_json::to_string(&value).unwrap(),
                )
            } else {
                ("base64-args".to_string(), BASE64_STANDARD.encode(args))
            };

        fn exact_gas_display(gas: u64) -> String {
            const ONE_TERA_GAS: u64 = 10u64.pow(12);
            const ONE_GIGA_GAS: u64 = 10u64.pow(9);
            if gas.is_multiple_of(ONE_TERA_GAS) {
                format!("{} TGas", gas / ONE_TERA_GAS)
            } else if gas.is_multiple_of(ONE_GIGA_GAS) {
                format!("{}.{} TGas", gas / ONE_TERA_GAS, gas % 1000)
            } else {
                format!("{} Gas", gas)
            }
        }
        let command_parts = vec![
            "near".to_string(),
            "contract".to_string(),
            "call-function".to_string(),
            "as-transaction".to_string(),
            contract_id.to_string(),
            method_name.to_string(),
            args_type,
            args_value,
            "prepaid-gas".to_string(),
            format!("{}", exact_gas_display(gas.as_gas())),
            "attached-deposit".to_string(),
            format!("{}", deposit.exact_amount_display()),
            "sign-as".to_string(),
            signer.account_id.to_string(),
            "network-config".to_string(),
            match signer.network {
                Network::Mainnet => "mainnet".to_string(),
                Network::Testnet => "testnet".to_string(),
                Network::Localnet(network) => network.id.clone(),
            }
            .to_string(),
        ];

        let command = shell_words::join(&command_parts);
        let window = window();
        let navigator = window.navigator();
        let _ = navigator.clipboard().write_text(&command);
        set_cli_copied(true);
        set_timeout(move || set_cli_copied(false), Duration::from_millis(2000));
    };

    let format_action = move |action: &SendTransactionsAction| -> String {
        match Action::from(action.clone()) {
            Action::CreateAccount(_) => "Create Account".into(),
            Action::DeployContract(DeployContractAction { code }) => {
                format!("Deploy Contract ({:?})", CryptoHash::hash_bytes(&code))
            }
            Action::FunctionCall(box FunctionCallAction {
                method_name,
                gas,
                deposit,
                ..
            }) => {
                let deposit_str = if deposit.is_zero() {
                    String::new()
                } else {
                    format!(" and deposit {deposit}")
                };
                format!("Call '{method_name}' with {gas}{deposit_str}")
            }
            Action::Transfer(TransferAction { deposit }) => {
                format!("Transfer {deposit}")
            }
            Action::Stake(box StakeAction { stake, public_key }) => {
                format!("Stake {stake} with key {public_key}")
            }
            Action::AddKey(box AddKeyAction {
                public_key,
                access_key,
            }) => match &access_key.permission {
                AccessKeyPermission::FullAccess => {
                    format!("Add Full Access Key {public_key}")
                }
                AccessKeyPermission::FunctionCall(FunctionCallPermission {
                    receiver_id,
                    allowance,
                    method_names,
                }) => {
                    let methods = if method_names.is_empty() {
                        "any".to_string()
                    } else {
                        method_names.join(", ")
                    };
                    let allowance_str = allowance
                        .map(|a| format!(" and allowance {a}"))
                        .unwrap_or_default();
                    format!(
                        "Add Function Call Key {public_key} for contract {receiver_id} with methods: {methods}{allowance_str}"
                    )
                }
            },
            Action::DeleteKey(box DeleteKeyAction { public_key }) => {
                format!("Delete Key {public_key}")
            }
            Action::DeleteAccount(DeleteAccountAction { beneficiary_id }) => {
                format!("Delete Account (funds go to {beneficiary_id})")
            }
            Action::UseGlobalContract(box UseGlobalContractAction {
                contract_identifier,
            }) => {
                format!(
                    "Deploy Global Contract on this account from {}",
                    match contract_identifier {
                        GlobalContractIdentifier::AccountId(account_id) =>
                            format!("account {account_id}"),
                        GlobalContractIdentifier::CodeHash(code_hash) =>
                            format!("code hash {code_hash}"),
                    }
                )
            }
            Action::DeployGlobalContract(DeployGlobalContractAction { code, deploy_mode }) => {
                const GLOBAL_CONTRACT_DEPLOY_MULTIPLIER: usize = 10;
                format!(
                    "Deploy Global Contract {} and bind to {} for {}",
                    CryptoHash::hash_bytes(&code),
                    match deploy_mode {
                        GlobalContractDeployMode::CodeHash => "the code hash",
                        GlobalContractDeployMode::AccountId => "this account",
                    },
                    format_token_amount_no_hide(
                        "0.00001 NEAR"
                            .parse::<NearToken>()
                            .unwrap()
                            .saturating_mul(code.len() as u128)
                            .saturating_mul(GLOBAL_CONTRACT_DEPLOY_MULTIPLIER as u128)
                            .as_yoctonear(),
                        24,
                        "NEAR",
                    )
                )
            }
            Action::Delegate(_) => panic!("Delegate actions are not supported"),
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
                    if let Action::FunctionCall(
                        box FunctionCallAction { method_name, args, gas, deposit, .. },
                    ) = action.clone().into()
                    {
                        let args_clone = args.clone();
                        let args_clone2 = args.clone();
                        let method_name_clone = method_name.clone();
                        let receiver_id_clone = receiver_id.clone();
                        let args_json = serde_json::from_slice::<serde_json::Value>(&args_clone)
                            .ok();
                        let args_json_clone = args_json.clone();
                        view! {
                            <div class="flex flex-col gap-2">
                                <pre class="text-xs font-mono bg-neutral-800 text-neutral-300 rounded-lg p-3 whitespace-pre-wrap">
                                    {if let Some(args_json) = args_json {
                                        serde_json::to_string_pretty(&args_json).unwrap()
                                    } else {
                                        format!(
                                            "binary: {}",
                                            args_clone2
                                                .iter()
                                                .map(|byte| format!("{byte:02x}"))
                                                .collect::<Vec<String>>()
                                                .join(""),
                                        )
                                    }}
                                </pre>
                                <div class="flex gap-2">
                                    {if let Some(args_json) = args_json_clone {
                                        view! {
                                            <button
                                                class="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-neutral-800 rounded flex items-center gap-2 relative"
                                                on:click=move |_| copy_args_json(&args_json)
                                            >
                                                <Icon icon=LuClipboard width="14" height="14" />
                                                {move || {
                                                    if json_copied.get() { "Copied!" } else { "Copy JSON" }
                                                }}
                                            </button>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }}
                                    <button
                                        class="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-neutral-800 rounded flex items-center gap-2 relative"
                                        on:click=move |_| copy_cli_command(
                                            &receiver_id_clone,
                                            &method_name_clone,
                                            &args_clone,
                                            gas.0,
                                            deposit,
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
                                        {move || {
                                            if cli_copied.get() { "Copied!" } else { "Copy CLI" }
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
) -> impl IntoView + use<> {
    view! {
        <div class="py-4 first:pt-0 last:pb-0">
            <div class="flex items-start gap-3 mb-2">
                <div class="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-700/50 text-sm text-neutral-300 font-medium">
                    {(tx_idx + 1).to_string()}
                </div>
                <div class="flex-1 max-w-full wrap-anywhere">
                    <p class="text-neutral-200 font-medium mb-1">
                        {"Transaction to "}
                        <code class="px-1.5 py-0.5 bg-neutral-700/50 rounded text-sm font-mono wrap-anywhere">
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
                                        receiver_id=tx.receiver_id.clone()
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
    view! {
        <div class="flex flex-col gap-4">
            <div class="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <p class="text-neutral-400 text-sm">
                    "Transaction preview is not yet available. Stay tuned for wallet updates!"
                </p>
            </div>

            <div>
                {move || {
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
    let (tauri_session_id, set_tauri_session_id) = signal::<Option<String>>(None);
    let (started_sending, set_started_sending) = signal(false);
    let (is_confirmed, set_is_confirmed) = signal(false);
    let (remember_contract, set_remember_contract) = signal(false);
    let (remember_non_financial, set_remember_non_financial) = signal(false);
    let ConnectedAppsContext { apps, set_apps, .. } = expect_context::<ConnectedAppsContext>();
    let accounts_context = expect_context::<AccountsContext>();
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
            || domain.ends_with(".localhost")
    };

    let process_sign_and_send = move |data: SendTransactionsRequest, evt_origin: String| {
        set_origin(evt_origin);
        set_loading(false);
        set_request_data(Some(data));
    };

    let retrieve_bridge_session = move |session_id: String| {
        spawn_local(async move {
            let url = dotenvy_macro::dotenv!("SHARED_LOGOUT_BRIDGE_SERVICE_ADDR");
            let retrieve_url = format!("{url}/api/session/{session_id}/retrieve-request");

            match reqwest::Client::new().get(&retrieve_url).send().await {
                Ok(response) if response.status().is_success() => {
                    match response.json::<serde_json::Value>().await {
                        Ok(json) => {
                            if let Some(message) = json.get("message") {
                                let Some(message) = message.as_str() else {
                                    log::error!("Bridge: Message is not a string");
                                    return;
                                };
                                let Ok(message) = serde_json::from_str::<ReceiveMessage>(message)
                                else {
                                    log::error!("Bridge: Failed to parse message: {message}");
                                    return;
                                };
                                log::info!("Bridge: Request data: {:?}", message);
                                set_tauri_session_id(Some(session_id.clone()));
                                match message {
                                    ReceiveMessage::SignAndSendTransactions { data } => {
                                        process_sign_and_send(data, "".to_string());
                                    }
                                }
                            } else {
                                log::warn!("Bridge: No message field in response");
                            }
                        }
                        Err(e) => {
                            log::error!("Bridge: Failed to parse response JSON: {e}");
                        }
                    }
                }
                Ok(response) => {
                    log::error!(
                        "Bridge: Bridge service responded with status {}",
                        response.status()
                    );
                }
                Err(e) => {
                    log::error!("Bridge: Failed to connect to bridge service: {e}");
                }
            }
        });
    };

    Effect::new(move |_| {
        let location = use_location();
        let params = location.query.get();
        if let Some(session_id) = params.get("session_id")
            && !session_id.is_empty()
        {
            log::info!("Found session_id in URL: {session_id}");
            retrieve_bridge_session(session_id.clone());
        }
    });

    let opener = || match window().opener() {
        Ok(opener) => {
            let opener = opener.unchecked_into::<Window>();
            if opener.is_truthy() { opener } else { window() }
        }
        _ => window(),
    };

    let post_to_opener = move |message: SendMessage, close_window: bool| {
        if let Some(session_id) = tauri_session_id.get_untracked() {
            spawn_local(submit_tauri_response(session_id, message, close_window));
        } else {
            let js_value = serialize_to_js_value(&message).unwrap();
            opener()
                .post_message(&js_value, &origin.read_untracked())
                .expect("Failed to send message");
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

        match serde_wasm_bindgen::from_value::<ReceiveMessage>(event.data()) {
            Ok(message) => {
                if is_debug_enabled() {
                    log::info!("Successfully parsed message: {:?}", message);
                }
                match message {
                    ReceiveMessage::SignAndSendTransactions { data } => {
                        process_sign_and_send(data, event.origin());
                    }
                }
            }
            Err(err) => {
                if is_debug_enabled() {
                    log::info!("Failed to parse message as ReceiveMessage: {err:?}");
                }
            }
        }
    });

    Effect::new(move || {
        let ready_message = SendMessage::Ready;
        let js_value = serialize_to_js_value(&ready_message).unwrap();
        opener()
            .post_message(&js_value, "*")
            .expect("Failed to send message");
    });

    let connected_app = Memo::new(move |_| {
        match &*request_data.read() {
            Some(request_data) => {
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
                                    && app.logged_out_at.is_none()
                            })
                            .cloned()
                    })
                    .flatten()
            }
            _ => None,
        }
    });
    Effect::new(move || {
        if let Some(app) = connected_app()
            && accounts_context.accounts.get().selected_account_id != Some(app.account_id.clone())
        {
            accounts_context.set_accounts.update(|accounts| {
                accounts.selected_account_id = Some(app.account_id);
            });
        }
    });

    let transactions = Memo::new(move |_| {
        request_data
            .get()
            .and_then(|request_data| {
                serde_json::from_str::<Vec<WalletSelectorTransaction>>(&request_data.transactions)
                    .inspect_err(|e| log::error!("Failed to deserialize transactions: {e}"))
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

    let has_signer_mismatch = move || {
        let Some(app) = connected_app() else {
            return false;
        };
        let Some(txs) = transactions.get() else {
            return false;
        };

        txs.iter().any(|tx| tx.signer_id != app.account_id)
    };

    let is_approve_enabled = Memo::new(move |_| {
        if started_sending.get() {
            return false;
        }
        if has_signer_mismatch() {
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
                let mut seen_receivers = HashMap::new();
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
                        if let SendTransactionsAction::WalletSelector(
                            WalletSelectorAction::FunctionCall { gas, .. },
                        ) = action
                        {
                            *gas >= NearGas::from_tgas(300).as_gas()
                        } else if let SendTransactionsAction::Native(Action::FunctionCall(
                            box FunctionCallAction { gas, .. },
                        )) = action
                        {
                            gas.0 >= NearGas::from_tgas(300)
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
        if let Some(app) = connected_app()
            && let Some(receiver_id) = common_receiver.get()
        {
            set_apps.update(|state| {
                if let Some(app_to_update) = state.apps.iter_mut().find(|a| {
                    a.account_id == app.account_id
                        && a.public_key == app.public_key
                        && a.logged_out_at.is_none()
                }) && remember_contract.get()
                {
                    app_to_update.autoconfirm_contracts.insert(receiver_id);
                    if remember_non_financial.get() {
                        app_to_update.autoconfirm_non_financial = true;
                    }
                }
            });
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
                        false,
                    )
                })
                .collect()
        } else {
            log::error!(
                "Failed to deserialize transactions: {:?}",
                serde_json::from_str::<Vec<WalletSelectorTransaction>>(&request_data.transactions)
            );
            let message = SendMessage::Error {
                message: "Failed to deserialize transactions".to_string(),
            };
            post_to_opener(message, true);
            return;
        };
        if transactions.is_empty() {
            let message = SendMessage::Error {
                message: "No transactions (an empty array) passed to the wallet".to_string(),
            };
            post_to_opener(message, true);
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
            accounts_context,
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
                            post_to_opener(message, true);
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
                    post_to_opener(message, true);
                }
                Err(_) => {
                    log::error!("Failed to fetch transaction details");
                    let message = SendMessage::Error {
                        message: "Failed to fetch transaction details".to_string(),
                    };
                    post_to_opener(message, true);
                }
            }
        });
    };

    let handle_cancel = move |_| {
        let message = SendMessage::Error {
            message: "User rejected the transactions".to_string(),
        };
        post_to_opener(message, true);
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
                                                            icon=LuTriangleAlert
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
                                                            icon=LuTriangleAlert
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
                                    if has_signer_mismatch() {
                                        view! {
                                            <div class="p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-400">
                                                <div class="flex items-center gap-2 text-red-400">
                                                    <Icon
                                                        icon=LuTriangleAlert
                                                        width="20"
                                                        height="20"
                                                        attr:class="min-w-5 min-h-5"
                                                    />
                                                    <div>
                                                        <p class="font-medium">"Account Mismatch Error"</p>
                                                        <p class="text-red-400 text-sm">
                                                            "The transaction signer does not match the connected account. This is probably a bug in the app that requested the transaction. Please report this to the app developer."
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    } else if has_dangerous_actions.get() {
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
                                                                        <code class="px-1 py-0.5 bg-neutral-700/50 rounded wrap-anywhere">
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
