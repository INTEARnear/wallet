use std::future::Future;
use std::pin::Pin;
use std::time::Duration;

use futures_channel::oneshot::Canceled;
use futures_timer::Delay;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::hooks::use_location;
use near_min_api::types::{
    AccessKey, AccessKeyPermission, Action, AddKeyAction, CreateAccountAction, FinalExecutionStatus,
};
use near_min_api::{
    QueryFinality,
    types::{AccessKeyPermissionView, AccessKeyView, AccountId, Finality},
};
use web_sys::KeyboardEvent;

use crate::components::account_selector::{
    AccountCreateParent, AccountCreateRecoveryMethod, ModalState, mnemonic_to_key,
};
use crate::components::derivation_path_input::DerivationPathInput;
use crate::components::gift_amount_display::GiftAmountDisplay;
use crate::components::select::{Select, SelectOption};
use crate::contexts::account_selector_context::AccountSelectorContext;
use crate::contexts::accounts_context::{
    Account, AccountsContext, SecretKeyHolder, format_ledger_error,
};
use crate::contexts::config_context::ConfigContext;
use crate::contexts::network_context::Network;
use crate::contexts::security_log_context::add_security_log;
use crate::contexts::transaction_queue_context::{
    EnqueuedTransaction, TransactionQueueContext, TransactionType,
};
use crate::pages::settings::LedgerSelector;
use crate::pages::settings::{JsWalletRequest, JsWalletResponse};
use crate::utils::serialize_to_js_value;
use bs58;
use leptos_use::{use_event_listener, use_window};
use serde_wasm_bindgen;

#[derive(Debug, Clone, serde::Deserialize)]
struct GetRootResponse {
    root_account_id: AccountId,
    network: Network,
}

struct AccountCreationDetails {
    subaccount_of: AccountId,
    account_to_sign_with: Option<Account>,
    network: Network,
}

impl AccountCreateParent {
    fn into_details(
        self,
        accounts_context: &AccountsContext,
    ) -> Result<AccountCreationDetails, String> {
        match self {
            AccountCreateParent::Mainnet => Ok(AccountCreationDetails {
                subaccount_of: "near".parse().unwrap(),
                account_to_sign_with: None,
                network: Network::Mainnet,
            }),
            AccountCreateParent::Testnet => Ok(AccountCreationDetails {
                subaccount_of: "testnet".parse().unwrap(),
                account_to_sign_with: None,
                network: Network::Testnet,
            }),
            AccountCreateParent::CustomRelayer(_relayer_id, network, root_account_id) => {
                Ok(AccountCreationDetails {
                    subaccount_of: root_account_id,
                    account_to_sign_with: None,
                    network,
                })
            }
            AccountCreateParent::SubAccount(network, subaccount_of) => {
                if let Some(account) =
                    accounts_context
                        .accounts
                        .get()
                        .accounts
                        .into_iter()
                        .find(|account| {
                            account.account_id == subaccount_of && account.network == network
                        })
                {
                    Ok(AccountCreationDetails {
                        subaccount_of,
                        network,
                        account_to_sign_with: Some(account),
                    })
                } else {
                    Err(format!("Subaccount of {subaccount_of} not found"))
                }
            }
        }
    }
}

#[component]
pub fn AccountCreationForm(show_back_button: bool) -> impl IntoView {
    let AccountSelectorContext {
        set_modal_state,
        set_expanded,
        modal_state,
        ..
    } = expect_context::<AccountSelectorContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let (account_name, set_account_name) = signal("".to_string());
    let (is_valid, set_is_valid) = signal(None);
    let (is_loading, set_is_loading) = signal(false);
    let (is_creating, set_is_creating) = signal(false);
    let (error, set_error) = signal::<Option<String>>(None);
    let (is_hovered, set_is_hovered) = signal(false);
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();

    let config_context = expect_context::<ConfigContext>();
    let (ledger_connection_in_progress, set_ledger_connection_in_progress) = signal(false);
    let (ledger_connected, set_ledger_connected) = signal(false);
    let (ledger_input_hd_path_input, set_ledger_hd_path_input) =
        signal("44'/397'/0'/0'/1'".to_string());
    let (ledger_getting_public_key, set_ledger_getting_public_key) = signal(false);
    let (ledger_current_key_data, set_ledger_current_key_data) =
        signal::<Option<(String, near_min_api::types::near_crypto::PublicKey)>>(None);

    let (ledger_account_number, set_ledger_account_number) = signal(0u32);
    let (ledger_change_number, set_ledger_change_number) = signal(0u32);
    let (ledger_address_number, set_ledger_address_number) = signal(1u32);

    let location = use_location();
    let is_on_gift_page = Memo::new(move |_| location.pathname.get().starts_with("/gifts/"));

    let custom_relayer_id =
        Memo::new(move |_| location.hash.get().strip_prefix('#').map(|h| h.to_string()));

    let custom_root_account = LocalResource::new(move || async move {
        let relayer_id = custom_relayer_id.get()?;

        let client = reqwest::Client::new();
        let account_creation_service_addr =
            dotenvy_macro::dotenv!("SHARED_ACCOUNT_CREATION_SERVICE_ADDR");

        match client
            .get(format!("{account_creation_service_addr}/get-root"))
            .header("x-relayer-id", relayer_id.clone())
            .send()
            .await
        {
            Ok(resp) => match resp.json::<GetRootResponse>().await {
                Ok(data) => {
                    set_modal_state.update(|state| {
                        if let ModalState::Creating { parent, .. } = state {
                            *parent = AccountCreateParent::CustomRelayer(
                                relayer_id.clone(),
                                data.network.clone(),
                                data.root_account_id.clone(),
                            );
                        }
                    });
                    Some((relayer_id.clone(), data.network, data.root_account_id))
                }
                Err(e) => {
                    log::error!("Failed to parse root account response: {e}");
                    None
                }
            },
            Err(e) => {
                log::error!("Failed to fetch root account: {e}");
                None
            }
        }
    });

    let on_path_change = move || {
        set_ledger_current_key_data.set(None);
    };

    let parent = Memo::new(move |_| match modal_state.get() {
        ModalState::Creating { parent, .. } => parent,
        _ => unreachable!(),
    });
    let parent_untracked = move || match modal_state.get_untracked() {
        ModalState::Creating { parent, .. } => parent,
        _ => unreachable!(),
    };
    let recovery_method = Memo::new(move |_| match modal_state.get() {
        ModalState::Creating {
            recovery_method, ..
        } => recovery_method,
        _ => unreachable!(),
    });
    let recovery_method_untracked = move || match modal_state.get_untracked() {
        ModalState::Creating {
            recovery_method, ..
        } => recovery_method,
        _ => unreachable!(),
    };

    let check_account = move |name: String| {
        set_error.set(None);
        if name.is_empty() {
            set_is_valid.set(None);
            return;
        }
        set_is_loading.set(true);

        let AccountCreationDetails {
            subaccount_of,
            network,
            ..
        } = match parent_untracked().into_details(&accounts_context) {
            Ok(details) => details,
            Err(e) => {
                set_error.set(Some(e));
                set_is_valid.set(None);
                set_is_loading.set(false);
                return;
            }
        };

        let full_name = format!("{name}.{subaccount_of}");
        let Some(account_id) = full_name.parse::<AccountId>().ok() else {
            set_error.set(Some("Invalid account name format".to_string()));
            set_is_valid.set(None);
            set_is_loading.set(false);
            return;
        };

        let rpc_client = network.default_rpc_client();
        spawn_local(async move {
            let account_exists = rpc_client
                .view_account(
                    account_id.clone(),
                    QueryFinality::Finality(Finality::DoomSlug),
                )
                .await
                .is_ok();

            if account_id == format!("{}.{subaccount_of}", account_name.get_untracked()) {
                if account_exists {
                    set_error.set(Some("Account already exists".to_string()));
                    set_is_valid.set(None);
                } else {
                    set_is_valid.set(Some(account_id));
                }
                set_is_loading.set(false);
            }
        });
    };

    let do_create_account = move || {
        let Some(account_id) = is_valid.get() else {
            return;
        };

        let (secret_key, seed_phrase) = match recovery_method_untracked() {
            AccountCreateRecoveryMethod::RecoveryPhrase
            | AccountCreateRecoveryMethod::EthereumWallet
            | AccountCreateRecoveryMethod::SolanaWallet => {
                let mnemonic = bip39::Mnemonic::generate(12).unwrap();
                (
                    SecretKeyHolder::SecretKey(mnemonic_to_key(mnemonic.clone()).unwrap()),
                    Some(mnemonic.to_string()),
                )
            }
            AccountCreateRecoveryMethod::Ledger => {
                let Some((path, public_key)) = ledger_current_key_data.get() else {
                    set_error.set(Some("Please get the Ledger public key first".to_string()));
                    return;
                };
                (
                    SecretKeyHolder::Ledger {
                        path: path.clone(),
                        public_key: public_key.clone(),
                    },
                    None,
                )
            }
        };

        let AccountCreationDetails {
            account_to_sign_with,
            network,
            ..
        } = match parent_untracked().into_details(&accounts_context) {
            Ok(details) => details,
            Err(e) => {
                log::error!("Couldn't extract data from parent: {e}");
                return;
            }
        };
        let rpc_client = network.default_rpc_client();
        add_security_log(
            format!("Account creation started with private key {secret_key}"),
            account_id.clone(),
            accounts_context,
        );

        spawn_local(async move {
            set_is_creating.set(true);
            set_error.set(None);

            let creation_future: Pin<Box<dyn Future<Output = Result<(), String>>>> = if let Some(
                account_to_sign_with,
            ) =
                account_to_sign_with
            {
                let actions = vec![
                    Action::CreateAccount(CreateAccountAction {}),
                    Action::AddKey(Box::new(AddKeyAction {
                        public_key: secret_key.public_key(),
                        access_key: AccessKey {
                            nonce: 0,
                            permission: AccessKeyPermission::FullAccess,
                        },
                    })),
                ];

                let transaction_description = format!("Create account {account_id}");
                let (tx_details_rx, tx) = EnqueuedTransaction::create_with_type(
                    transaction_description,
                    account_to_sign_with.account_id.clone(),
                    TransactionType::MetaTransaction {
                        actions,
                        receiver_id: account_id.clone(),
                    },
                );
                add_transaction.update(|txs| {
                    txs.push(tx);
                });
                Box::pin(async move {
                    let tx_details = match tx_details_rx.await {
                        Ok(tx_details) => tx_details,
                        Err(Canceled) => {
                            return Err("Cancelled".to_string());
                        }
                    };
                    let tx_details = match tx_details {
                        Ok(tx_details) => tx_details,
                        Err(e) => {
                            return Err(format!("Failed to create account: {e}"));
                        }
                    };
                    let Some(outcome) = tx_details.final_execution_outcome else {
                        return Err("Transaction outcome not found".to_string());
                    };
                    match outcome.final_outcome.status {
                        FinalExecutionStatus::SuccessValue(_) => Ok(()),
                        _ => Err("Transaction failed".to_string()),
                    }
                })
            } else {
                let payload = serde_json::json!({
                    "account_id": account_id.to_string(),
                    "public_key": secret_key.public_key().to_string(),
                });
                let parent = parent_untracked();
                Box::pin(async move {
                    let client = reqwest::Client::new();
                    let account_creation_service_addr =
                        dotenvy_macro::dotenv!("SHARED_ACCOUNT_CREATION_SERVICE_ADDR");
                    let relayer_id = match parent {
                        AccountCreateParent::CustomRelayer(relayer_id, _, _) => relayer_id,
                        AccountCreateParent::Mainnet => "mainnet".to_string(),
                        AccountCreateParent::Testnet => "testnet".to_string(),
                        AccountCreateParent::SubAccount(network, _) => match network {
                            Network::Mainnet => "mainnet".to_string(),
                            Network::Testnet => "testnet".to_string(),
                            Network::Localnet { .. } => unreachable!(),
                        },
                    };
                    let response = client
                        .post(format!("{account_creation_service_addr}/create"))
                        .header("x-relayer-id", relayer_id)
                        .json(&payload)
                        .send()
                        .await;
                    match response {
                        Ok(resp) => match resp.json::<serde_json::Value>().await {
                            Ok(data) => {
                                let success = data
                                    .get("success")
                                    .and_then(|s| s.as_bool())
                                    .unwrap_or(false);
                                if success {
                                    Ok(())
                                } else {
                                    Err(format!(
                                        "Failed to create account: Server returned error: {}",
                                        data.get("message")
                                            .and_then(|s| s.as_str())
                                            .unwrap_or("Unknown error")
                                    ))
                                }
                            }
                            _ => {
                                Err("Failed to create account: Couldn't parse response".to_string())
                            }
                        },
                        Err(e) => Err(format!("Failed to create account: {e}")),
                    }
                })
            };

            match creation_future.await {
                Ok(()) => {
                    // Verify account creation by checking access key with retries
                    let mut attempts = 0;

                    const MAX_ATTEMPTS: usize = 30;
                    while attempts < MAX_ATTEMPTS {
                        if attempts > 0 {
                            Delay::new(Duration::from_secs(1)).await;
                        }

                        match rpc_client
                            .get_access_key(
                                account_id.clone(),
                                secret_key.public_key(),
                                QueryFinality::Finality(Finality::DoomSlug),
                            )
                            .await
                        {
                            Ok(AccessKeyView {
                                permission: AccessKeyPermissionView::FullAccess,
                                ..
                            }) => {
                                let mut accounts = accounts_context.accounts.get_untracked();
                                add_security_log(
                                    format!("Account created with private key {secret_key}"),
                                    account_id.clone(),
                                    accounts_context,
                                );
                                accounts.accounts.push(Account {
                                    account_id: account_id.clone(),
                                    seed_phrase,
                                    secret_key,
                                    network: network.clone(),
                                    exported: false,
                                });
                                accounts.selected_account_id = Some(account_id);
                                accounts_context.set_accounts.set(accounts);
                                set_modal_state.set(ModalState::AccountList);
                                set_expanded(false);
                                break;
                            }
                            _ => {
                                attempts += 1;
                                if attempts >= MAX_ATTEMPTS {
                                    log::error!(
                                        "Failed to create account: Couldn't verify by getting access key after 3 attempts"
                                    );
                                    set_error.set(Some("Failed to create account".to_string()));
                                }
                            }
                        }
                    }
                }
                Err(e) => {
                    log::error!("Failed to create account: {e}");
                    set_error.set(Some(format!("Failed to create account: {e}")));
                }
            }
            set_is_creating.set(false);
        });
    };

    let handle_keydown = move |ev: KeyboardEvent| {
        if ev.key() == "Enter"
            && is_valid.get().is_some()
            && !is_creating.get()
            && !is_loading.get()
        {
            do_create_account();
        }
    };

    let input_ref = NodeRef::<leptos::html::Input>::new();

    Effect::new(move || {
        if let Some(input) = input_ref.get() {
            let _ = input.focus();
        }
    });

    Effect::new(move || {
        let path = format!(
            "44'/397'/{}'/{}'/{}'",
            ledger_account_number.get(),
            ledger_change_number.get(),
            ledger_address_number.get()
        );
        set_ledger_hd_path_input.set(path);
    });

    let _ = use_event_listener(
        use_window(),
        leptos::ev::message,
        move |event: web_sys::MessageEvent| {
            if let Ok(data) = serde_wasm_bindgen::from_value::<JsWalletResponse>(event.data()) {
                match data {
                    JsWalletResponse::LedgerConnected => {
                        set_ledger_connection_in_progress(false);
                        set_ledger_connected(true);
                    }
                    JsWalletResponse::LedgerPublicKey { path, key } => {
                        set_ledger_getting_public_key(false);
                        set_error.set(None);

                        if path != ledger_input_hd_path_input.get_untracked() {
                            return;
                        }

                        if key.len() == 32 {
                            let bs58_key = bs58::encode(&key).into_string();
                            let public_key_str = format!("ed25519:{}", bs58_key);
                            if let Ok(public_key) = public_key_str
                                .parse::<near_min_api::types::near_crypto::PublicKey>(
                            ) {
                                set_ledger_current_key_data(Some((path.clone(), public_key)));
                            } else {
                                set_error.set(Some("Failed to parse public key".to_string()));
                            }
                        } else {
                            set_error
                                .set(Some("Invalid public key length from Ledger".to_string()));
                        }
                    }
                    JsWalletResponse::LedgerConnectError { error } => {
                        set_ledger_connection_in_progress(false);
                        set_ledger_connected(false);
                        set_error.set(Some(format_ledger_error(&error)));
                    }
                    JsWalletResponse::LedgerGetPublicKeyError { error } => {
                        set_ledger_getting_public_key(false);
                        set_error.set(Some(format_ledger_error(&error)));
                    }
                    _ => {}
                }
            }
        },
    );

    let request_ledger_connection = move || {
        if ledger_connection_in_progress.get_untracked() || ledger_connected.get_untracked() {
            return;
        }
        set_error.set(None);
        set_ledger_connection_in_progress(true);
        let ledger_mode = config_context.config.get_untracked().ledger_mode;
        let request = JsWalletRequest::LedgerConnect { mode: ledger_mode };
        match serialize_to_js_value(&request) {
            Ok(js_value) => {
                let origin = window()
                    .location()
                    .origin()
                    .unwrap_or_else(|_| "*".to_string());
                if window().post_message(&js_value, &origin).is_err() {
                    log::error!("Failed to send Ledger connection request");
                    set_ledger_connection_in_progress(false);
                }
            }
            _ => {
                log::error!("Failed to serialize Ledger connection request");
                set_ledger_connection_in_progress(false);
            }
        }
    };

    let connect_ledger = move || {
        set_error.set(None);
        set_ledger_getting_public_key(true);
        set_ledger_current_key_data.set(None);
        let path = ledger_input_hd_path_input.get_untracked();
        let ledger_mode = config_context.config.get_untracked().ledger_mode;
        let request = JsWalletRequest::LedgerGetPublicKey {
            path,
            mode: ledger_mode,
        };
        match serialize_to_js_value(&request) {
            Ok(js_value) => {
                let origin = window()
                    .location()
                    .origin()
                    .unwrap_or_else(|_| "*".to_string());
                if window().post_message(&js_value, &origin).is_err() {
                    log::error!("Failed to send Ledger public key request");
                    set_ledger_getting_public_key(false);
                }
            }
            _ => {
                log::error!("Failed to serialize Ledger public key request");
                set_ledger_getting_public_key(false);
            }
        }
    };

    view! {
        <div class="absolute inset-0 bg-neutral-950 lg:rounded-3xl">
            {move || {
                if show_back_button {
                    view! {
                        <button
                            class="absolute left-4 top-4 w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 group hover:bg-neutral-300 z-10"
                            on:click=move |_| set_modal_state.set(ModalState::AccountList)
                        >
                            <div class="group-hover:text-black">
                                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                            </div>
                        </button>
                    }
                        .into_any()
                } else {
                    ().into_any()
                }
            }} <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md max-h-full overflow-y-auto">
                    {move || {
                        if is_on_gift_page() {
                            view! {
                                <div class="mb-6">
                                    <h2 class="text-white text-2xl font-semibold mb-4">
                                        "Claim Your Gift"
                                    </h2>
                                    <p class="text-gray-400 text-sm mb-4">
                                        "Create an account to claim this gift"
                                    </p>
                                    <GiftAmountDisplay />
                                </div>
                            }
                                .into_any()
                        } else {
                            view! {
                                <h2 class="text-white text-2xl font-semibold mb-6">
                                    "Create New Account"
                                </h2>
                            }
                                .into_any()
                        }
                    }} <div class="mb-6">
                        <label class="block text-neutral-400 text-sm font-medium mb-2">
                            "Account Name"
                        </label>
                        <div class="relative">
                            <input
                                node_ref=input_ref
                                type="text"
                                class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                style=move || {
                                    if is_valid.get().is_some() {
                                        "border: 2px solid rgb(34 197 94)"
                                    } else {
                                        "border: 2px solid rgb(55 65 81)"
                                    }
                                }
                                prop:value=account_name
                                on:input=move |ev| {
                                    let value = event_target_value(&ev)
                                        .to_lowercase()
                                        .chars()
                                        .filter(|c| {
                                            c.is_ascii_lowercase() || c.is_ascii_digit() || *c == '_'
                                                || *c == '-'
                                        })
                                        .collect::<String>();
                                    set_account_name.set(value.clone());
                                    check_account(value);
                                }
                                on:keydown=handle_keydown
                                disabled=move || is_creating.get()
                            />
                            <div class="absolute top-1/2 right-2 -translate-y-1/2 max-w-40 z-10">
                                {move || {
                                    if is_on_gift_page() {
                                        view! {
                                            <div class="text-right min-w-25 px-3 py-2 text-gray-400 text-sm">
                                                ".near"
                                            </div>
                                        }
                                            .into_any()
                                    } else if custom_root_account.read().is_none() {
                                        view! {
                                            <div class="flex items-center justify-center px-3 py-2">
                                                <div class="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        log::info!(
                                            "Custom root account: {:?}", *custom_root_account.read()
                                        );
                                        view! {
                                            <Select
                                                options=Signal::derive(move || {
                                                    let mut options = vec![];
                                                    if let Some(Some((relayer_id, network, root_account_id))) = custom_root_account
                                                        .get()
                                                    {
                                                        options
                                                            .push(
                                                                SelectOption::new(
                                                                    format!(
                                                                        "relayer:{}:{relayer_id}",
                                                                        match network {
                                                                            Network::Mainnet => "mainnet",
                                                                            Network::Testnet => "testnet",
                                                                            Network::Localnet { .. } => unreachable!(),
                                                                        },
                                                                    ),
                                                                    move || format!(".{root_account_id}").into_any(),
                                                                ),
                                                            );
                                                    }
                                                    options
                                                        .push(
                                                            SelectOption::new(
                                                                "near".to_string(),
                                                                move || ".near".into_any(),
                                                            ),
                                                        );
                                                    options
                                                        .push(
                                                            SelectOption::new(
                                                                "testnet".to_string(),
                                                                move || ".testnet".into_any(),
                                                            ),
                                                        );
                                                    for account in accounts_context
                                                        .accounts
                                                        .get_untracked()
                                                        .accounts
                                                        .iter()
                                                    {
                                                        let id = account.account_id.to_string();
                                                        let network = match account.network {
                                                            Network::Mainnet => "mainnet",
                                                            Network::Testnet => "testnet",
                                                            Network::Localnet { .. } => continue,
                                                        };
                                                        options
                                                            .push(
                                                                SelectOption::new(
                                                                    format!("{network}:{id}"),
                                                                    move || format!(".{id}").into_any(),
                                                                ),
                                                            );
                                                    }
                                                    options
                                                })
                                                on_change=Callback::new(move |value: String| {
                                                    let parent_val = if let Some(rest) = value
                                                        .strip_prefix("relayer:")
                                                        && let Some((_, relayer_id)) = rest.split_once(':')
                                                        && let Some(
                                                            Some((provided_relayer_id, network, root_account_id)),
                                                        ) = custom_root_account.get()
                                                    {
                                                        if relayer_id == provided_relayer_id {
                                                            AccountCreateParent::CustomRelayer(
                                                                provided_relayer_id,
                                                                network,
                                                                root_account_id,
                                                            )
                                                        } else {
                                                            log::error!(
                                                                "Custom relayer selected but relayer ID mismatch"
                                                            );
                                                            return;
                                                        }
                                                    } else {
                                                        match value.as_str() {
                                                            "near" => AccountCreateParent::Mainnet,
                                                            "testnet" => AccountCreateParent::Testnet,
                                                            other => {
                                                                if let Some((network, id)) = other.split_once(':') {
                                                                    AccountCreateParent::SubAccount(
                                                                        match network {
                                                                            "mainnet" => Network::Mainnet,
                                                                            "testnet" => Network::Testnet,
                                                                            _ => unreachable!(),
                                                                        },
                                                                        id.parse().unwrap(),
                                                                    )
                                                                } else {
                                                                    unreachable!()
                                                                }
                                                            }
                                                        }
                                                    };
                                                    set_modal_state
                                                        .update(|state| {
                                                            if let ModalState::Creating { parent, .. } = state {
                                                                *parent = parent_val;
                                                            } else {
                                                                unreachable!()
                                                            }
                                                        });
                                                    check_account(account_name.get_untracked());
                                                })
                                                // Select can be re-rendered, so supply current "initial" value
                                                initial_value=match parent_untracked() {
                                                    AccountCreateParent::Mainnet => "near".to_string(),
                                                    AccountCreateParent::Testnet => "testnet".to_string(),
                                                    AccountCreateParent::CustomRelayer(relayer_id, network, _) => {
                                                        format!("relayer:{}:{relayer_id}", match network {
                                                            Network::Mainnet => "mainnet",
                                                            Network::Testnet => "testnet",
                                                            Network::Localnet { .. } => unreachable!(),
                                                        })
                                                    }
                                                    AccountCreateParent::SubAccount(network, id) => {
                                                        format!(
                                                            "{network}:{id}",
                                                            network = match network {
                                                                Network::Mainnet => "mainnet",
                                                                Network::Testnet => "testnet",
                                                                Network::Localnet { .. } => unreachable!(),
                                                            },
                                                        )
                                                    }
                                                }
                                                width="220px"
                                                class="text-right min-w-25"
                                            />
                                        }
                                            .into_any()
                                    }
                                }}
                            </div>
                        </div>
                        {move || {
                            if let Some(err) = error.get() {
                                view! { <p class="text-red-500 text-sm mt-2 font-medium">{err}</p> }
                                    .into_any()
                            } else if is_loading.get() {
                                view! {
                                    <p class="text-neutral-400 text-sm mt-2 font-medium">
                                        "Checking availability..."
                                    </p>
                                }
                                    .into_any()
                            } else if is_valid.get().is_some() {
                                view! {
                                    <p class="text-green-500 text-sm mt-2 font-medium">
                                        "Name is available!"
                                    </p>
                                }
                                    .into_any()
                            } else {
                                view! {
                                    <p class="text-neutral-400 text-sm mt-2 font-medium">
                                        "Enter your account name"
                                    </p>
                                }
                                    .into_any()
                            }
                        }}
                        {move || {
                            let is_testnet = if let Ok(AccountCreationDetails { network, .. }) = parent()
                                .into_details(&accounts_context)
                            {
                                network == Network::Testnet
                            } else {
                                false
                            };
                            if is_testnet {
                                view! {
                                    <p class="text-yellow-500 text-sm mt-2 font-medium">
                                        "This is a " <b>"testnet"</b>
                                        " account. Tokens sent to this account are not real and hold no value"
                                    </p>
                                }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
                    // Recovery method selector
                    </div> <div>
                        <div class="flex gap-2 mb-4">
                            <button
                                class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                                style=move || {
                                    if recovery_method()
                                        == AccountCreateRecoveryMethod::RecoveryPhrase
                                    {
                                        "border-color: rgb(96 165 250); background-color: rgb(59 130 246 / 0.1);"
                                    } else {
                                        "border-color: rgb(55 65 81); background-color: transparent;"
                                    }
                                }
                                on:click=move |_| {
                                    set_modal_state
                                        .update(|state| {
                                            if let ModalState::Creating { recovery_method, .. } = state {
                                                *recovery_method = AccountCreateRecoveryMethod::RecoveryPhrase;
                                            } else {
                                                unreachable!()
                                            }
                                        });
                                    set_error.set(None);
                                }
                            >
                                <div class="flex flex-col items-center gap-2">
                                    <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Icon
                                            icon=icondata::LuKey
                                            width="16"
                                            height="16"
                                            attr:class="text-blue-400"
                                        />
                                    </div>
                                    <div class="text-white text-sm font-medium">
                                        "Recovery Phrase"
                                    </div>
                                </div>
                            </button>

                            // <button
                            // class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                            // style=move || {
                            // if recovery_method()
                            // == AccountCreateRecoveryMethod::EthereumWallet
                            // {
                            // "border-color: rgb(129 140 248); background-color: rgb(99 102 241 / 0.1);"
                            // } else {
                            // "border-color: rgb(55 65 81); background-color: transparent;"
                            // }
                            // }
                            // on:click=move |_| {
                            // set_modal_state
                            // .update(|state| {
                            // if let ModalState::Creating { recovery_method, .. } = state {
                            // *recovery_method = AccountCreateRecoveryMethod::EthereumWallet;
                            // } else {
                            // unreachable!()
                            // }
                            // });
                            // set_error.set(None);
                            // window()
                            // .alert_with_message(
                            // "Come back in a few days for Ethereum support",
                            // )
                            // .unwrap();
                            // }
                            // >
                            // <div class="flex flex-col items-center gap-2">
                            // <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            // <Icon
                            // icon=icondata::SiEthereum
                            // width="16"
                            // height="16"
                            // attr:class="text-indigo-400"
                            // />
                            // </div>
                            // <div class="text-white text-sm font-medium">Ethereum</div>
                            // </div>
                            // </button>

                            // <button
                            // class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                            // style=move || {
                            // if recovery_method()
                            // == AccountCreateRecoveryMethod::SolanaWallet
                            // {
                            // "border-color: rgb(196 181 253); background-color: rgb(147 51 234 / 0.1);"
                            // } else {
                            // "border-color: rgb(55 65 81); background-color: transparent;"
                            // }
                            // }
                            // on:click=move |_| {
                            // set_modal_state
                            // .update(|state| {
                            // if let ModalState::Creating { recovery_method, .. } = state {
                            // *recovery_method = AccountCreateRecoveryMethod::SolanaWallet;
                            // } else {
                            // unreachable!()
                            // }
                            // });
                            // set_error.set(None);
                            // window()
                            // .alert_with_message(
                            // "Come back in a few days for Solana support",
                            // )
                            // .unwrap();
                            // }
                            // >
                            // <div class="flex flex-col items-center gap-2">
                            // <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            // <Icon
                            // icon=icondata::SiSolana
                            // width="16"
                            // height="16"
                            // attr:class="text-purple-400"
                            // />
                            // </div>
                            // <div class="text-white text-sm font-medium">Solana</div>
                            // </div>
                            // </button>

                            <button
                                class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                                style=move || {
                                    if recovery_method() == AccountCreateRecoveryMethod::Ledger {
                                        "border-color: rgb(196 181 253); background-color: rgb(147 51 234 / 0.1);"
                                    } else {
                                        "border-color: rgb(55 65 81); background-color: transparent;"
                                    }
                                }
                                on:click=move |_| {
                                    set_modal_state
                                        .update(|state| {
                                            if let ModalState::Creating { recovery_method, .. } = state {
                                                *recovery_method = AccountCreateRecoveryMethod::Ledger;
                                            } else {
                                                unreachable!()
                                            }
                                        });
                                    set_error.set(None);
                                    request_ledger_connection();
                                }
                            >
                                <div class="flex flex-col items-center gap-2">
                                    <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <Icon
                                            icon=icondata::LuWallet
                                            width="16"
                                            height="16"
                                            attr:class="text-purple-400"
                                        />
                                    </div>
                                    <div class="text-white text-sm font-medium">"Ledger"</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    {move || {
                        if recovery_method() == AccountCreateRecoveryMethod::Ledger {
                            view! {
                                <div class="space-y-6">
                                    <div class="text-center py-2">
                                        <div class="mb-4">
                                            <LedgerSelector on_change=Callback::new(move |_| {
                                                connect_ledger();
                                            }) />
                                        </div>
                                        <Show
                                            when=move || error.read().is_some()
                                            fallback=move || {
                                                view! {
                                                    <p class="text-neutral-400 mb-4">
                                                        "Connect your Ledger to continue"
                                                    </p>
                                                }
                                            }
                                        >
                                            <p class="text-red-400 mb-4">{error.get().unwrap()}</p>
                                        </Show>
                                        <Show when=move || !ledger_connected()>
                                            <button
                                                class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer"
                                                style=move || {
                                                    if ledger_connection_in_progress.get() {
                                                        "background: rgb(55 65 81); cursor: not-allowed;"
                                                    } else {
                                                        "background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);"
                                                    }
                                                }
                                                disabled=move || ledger_connection_in_progress.get()
                                                on:click=move |_| request_ledger_connection()
                                            >
                                                <span class="relative flex items-center justify-center gap-2">
                                                    {move || {
                                                        if ledger_connection_in_progress.get() {
                                                            view! {
                                                                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    }}
                                                    {move || {
                                                        if ledger_connection_in_progress.get() {
                                                            "Connecting...".to_string()
                                                        } else {
                                                            "Connect Ledger".to_string()
                                                        }
                                                    }}
                                                </span>
                                            </button>
                                        </Show>

                                        {move || {
                                            if ledger_connected.get() {
                                                view! {
                                                    <div class="space-y-4 w-full">
                                                        <DerivationPathInput
                                                            ledger_account_number=ledger_account_number
                                                            set_ledger_account_number=set_ledger_account_number
                                                            ledger_change_number=ledger_change_number
                                                            set_ledger_change_number=set_ledger_change_number
                                                            ledger_address_number=ledger_address_number
                                                            set_ledger_address_number=set_ledger_address_number
                                                            on_change=on_path_change.into()
                                                        />
                                                        <Show
                                                            when=move || ledger_current_key_data.get().is_none()
                                                            fallback=move || {
                                                                view! { <p class="text-green-400 mb-4">"Connected"</p> }
                                                            }
                                                        >
                                                            <button
                                                                class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer"
                                                                style=move || {
                                                                    if ledger_getting_public_key.get() {
                                                                        "background: rgb(55 65 81); cursor: not-allowed;"
                                                                    } else {
                                                                        "background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);"
                                                                    }
                                                                }
                                                                disabled=move || ledger_getting_public_key.get()
                                                                on:click=move |_| connect_ledger()
                                                            >
                                                                <span class="relative flex items-center justify-center gap-2">
                                                                    {move || {
                                                                        if ledger_getting_public_key.get() {
                                                                            view! {
                                                                                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                            }
                                                                                .into_any()
                                                                        } else {
                                                                            ().into_any()
                                                                        }
                                                                    }}
                                                                    {move || {
                                                                        if ledger_getting_public_key.get() {
                                                                            "Confirm in your Ledger...".to_string()
                                                                        } else {
                                                                            "Connect Ledger".to_string()
                                                                        }
                                                                    }}
                                                                </span>
                                                            </button>
                                                        </Show>
                                                    </div>
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
                    }} <div class="flex gap-2 mt-2">
                        <button
                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                            style=move || {
                                if is_valid.get().is_some()
                                    && ((recovery_method()
                                        == AccountCreateRecoveryMethod::RecoveryPhrase)
                                        || (recovery_method() == AccountCreateRecoveryMethod::Ledger
                                            && ledger_current_key_data.get().is_some()))
                                {
                                    "background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);"
                                } else {
                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                }
                            }
                            disabled=move || {
                                is_valid.get().is_none() || is_creating.get() || is_loading.get()
                                    || match recovery_method() {
                                        AccountCreateRecoveryMethod::RecoveryPhrase => false,
                                        AccountCreateRecoveryMethod::Ledger => {
                                            ledger_current_key_data.get().is_none()
                                        }
                                        _ => true,
                                    }
                            }
                            on:click=move |_| do_create_account()
                            on:mouseenter=move |_| set_is_hovered.set(true)
                            on:mouseleave=move |_| set_is_hovered.set(false)
                        >
                            <div
                                class="absolute inset-0 transition-opacity duration-200"
                                style=move || {
                                    if is_valid.get().is_some() && !is_loading.get()
                                        && is_hovered.get()
                                        && ((recovery_method()
                                            == AccountCreateRecoveryMethod::RecoveryPhrase)
                                            || (recovery_method() == AccountCreateRecoveryMethod::Ledger
                                                && ledger_current_key_data.get().is_some()))
                                    {
                                        "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 1"
                                    } else {
                                        "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 0"
                                    }
                                }
                            ></div>
                            <span class="relative flex items-center justify-center gap-2">
                                {move || {
                                    if is_creating.get() || is_loading.get() {
                                        view! {
                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }
                                }}
                                {move || {
                                    if is_on_gift_page() {
                                        "Create Account & Claim Gift"
                                    } else {
                                        "Create Account"
                                    }
                                }}
                            </span>
                        </button>
                    </div> <div class="relative mt-6 mb-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-neutral-800"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-neutral-950 text-neutral-400">"or"</span>
                        </div>
                    </div>
                    <button
                        class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden border border-neutral-800 hover:border-neutral-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        on:click=move |_| set_modal_state.set(ModalState::LoggingIn)
                        disabled=move || is_creating.get()
                    >
                        <span class="relative">
                            {move || {
                                if is_on_gift_page() {
                                    "Log in & Claim Gift"
                                } else {
                                    "Log in with Existing Account"
                                }
                            }}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    }
}
