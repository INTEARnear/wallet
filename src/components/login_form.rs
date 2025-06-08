use std::time::Duration;

use chrono;
use futures_timer::Delay;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_use::{use_event_listener, use_window};
use near_min_api::types::Finality;
use near_min_api::types::{near_crypto::SecretKey, AccountId};
use near_min_api::QueryFinality;
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen;

use crate::components::account_selector::{seed_phrase_to_key, LoginMethod, ModalState};
use crate::contexts::accounts_context::{Account, AccountsContext};
use crate::contexts::network_context::Network;
use crate::contexts::security_log_context::add_security_log;
use crate::pages::settings::{JsWalletMessage, JsWalletRequest};

#[derive(Serialize, Deserialize, Debug)]
struct RecoverAccountResponse {
    success: bool,
    message: String,
    transaction_hash: Option<String>,
}

#[derive(Serialize, Debug)]
#[serde(tag = "type", rename_all = "kebab-case")]
enum RecoverRequest {
    EthereumSignature {
        account_id: AccountId,
        ethereum_signature: alloy_primitives::Signature,
        message: String,
    },
    SolanaSignature {
        account_id: AccountId,
        solana_signature: solana_signature::Signature,
        message: String,
    },
}

#[component]
pub fn LoginForm(
    set_modal_state: WriteSignal<ModalState>,
    show_back_button: bool,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let (login_method, set_login_method) = signal(LoginMethod::Selection);
    let (private_key, set_private_key) = signal("".to_string());
    let (is_valid, set_is_valid) = signal(None);
    let (error, set_error) = signal::<Option<String>>(None);
    let (is_hovered, set_is_hovered) = signal(false);
    let (available_accounts, set_available_accounts) = signal::<Vec<(AccountId, Network)>>(vec![]);
    let (selected_account, set_selected_account) = signal::<Option<(AccountId, Network)>>(None);
    let (ethereum_connection_in_progress, set_ethereum_connection_in_progress) = signal(false);
    let (connected_ethereum_address, set_connected_ethereum_address) =
        signal::<Option<alloy_primitives::Address>>(None);
    let (solana_connection_in_progress, set_solana_connection_in_progress) = signal(false);
    let (connected_solana_address, set_connected_solana_address) =
        signal::<Option<solana_pubkey::Pubkey>>(None);
    let (generated_mnemonic, set_generated_mnemonic) = signal::<Option<bip39::Mnemonic>>(None);
    let (import_in_progress, set_import_in_progress) = signal(false);

    // Message listener for wallet communication (from JS)
    let _ = use_event_listener(
        use_window(),
        leptos::ev::message,
        move |event: web_sys::MessageEvent| {
            if let Ok(data) = serde_wasm_bindgen::from_value::<JsWalletMessage>(event.data()) {
                match data {
                    JsWalletMessage::EthereumWalletConnection { address } => {
                        set_ethereum_connection_in_progress(false);
                        if let Some(address) = address {
                            set_connected_ethereum_address(Some(address));
                            spawn_local(async move {
                                let mut all_accounts = vec![];

                                for (network, api_base) in [
                                    (Network::Mainnet, "https://events-v3.intear.tech"),
                                    (Network::Testnet, "https://events-v3-testnet.intear.tech"),
                                ] {
                                    let url = format!("{}/v3/log_nep297/users_by_ethereum_address?ethereum_address={}", api_base, address.to_string().to_lowercase());

                                    if let Ok(response) = reqwest::get(&url).await {
                                        if let Ok(data) = response.json::<serde_json::Value>().await
                                        {
                                            if let Some(users) = data.as_array() {
                                                for user in users {
                                                    if let Some(near_account_id) = user
                                                        .get("near_account_id")
                                                        .and_then(|id| id.as_str())
                                                    {
                                                        if let Ok(account_id) =
                                                            near_account_id.parse::<AccountId>()
                                                        {
                                                            if !accounts_context
                                                                .accounts
                                                                .get_untracked()
                                                                .accounts
                                                                .iter()
                                                                .any(|a| a.account_id == account_id)
                                                            {
                                                                all_accounts
                                                                    .push((account_id, network));
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if all_accounts.is_empty() {
                                    set_error.set(Some(format!(
                                        "No NEAR accounts found for {}",
                                        address
                                    )));
                                } else {
                                    set_available_accounts.set(all_accounts);
                                    set_error.set(None);
                                }
                            });
                        } else {
                            set_error.set(Some("Ethereum wallet connection cancelled".to_string()));
                        }
                    }
                    JsWalletMessage::EthereumWalletSignature { signature, message } => {
                        let Some(signature) = signature else {
                            set_error.set(Some("Signature request cancelled".to_string()));
                            return;
                        };

                        set_import_in_progress(true);
                        set_error.set(None);

                        let Ok(parsed_signature) = signature.parse::<alloy_primitives::Signature>()
                        else {
                            set_error.set(Some("Invalid signature format".to_string()));
                            set_import_in_progress(false);
                            return;
                        };

                        let Ok(recovered_address) =
                            parsed_signature.recover_address_from_msg(message.as_bytes())
                        else {
                            set_error
                                .set(Some("Failed to recover address from signature".to_string()));
                            set_import_in_progress(false);
                            return;
                        };

                        // Verify that the signer matches the connected address
                        if let Some(connected_address) = connected_ethereum_address.get_untracked()
                        {
                            if recovered_address != connected_address {
                                set_error.set(Some(
                                    "Signature does not match connected wallet address".to_string(),
                                ));
                                set_import_in_progress(false);
                                return;
                            }

                            let Some((account_id, network)) = selected_account.get_untracked()
                            else {
                                set_error.set(Some("No account selected".to_string()));
                                set_import_in_progress(false);
                                return;
                            };

                            let Some(mnemonic) = generated_mnemonic.get_untracked() else {
                                set_error.set(Some("No mnemonic generated".to_string()));
                                set_import_in_progress(false);
                                return;
                            };

                            let Some(secret_key) = seed_phrase_to_key(&mnemonic.to_string()) else {
                                set_error
                                    .set(Some("Failed to derive key from mnemonic".to_string()));
                                set_import_in_progress(false);
                                return;
                            };

                            let public_key = secret_key.public_key();

                            spawn_local(async move {
                                let client = reqwest::Client::new();
                                let account_creation_service_addr = match network {
                                    Network::Mainnet => {
                                        dotenvy_macro::dotenv!(
                                            "MAINNET_ACCOUNT_CREATION_SERVICE_ADDR"
                                        )
                                    }
                                    Network::Testnet => {
                                        dotenvy_macro::dotenv!(
                                            "TESTNET_ACCOUNT_CREATION_SERVICE_ADDR"
                                        )
                                    }
                                };

                                let payload = RecoverRequest::EthereumSignature {
                                    account_id: account_id.clone(),
                                    ethereum_signature: parsed_signature,
                                    message,
                                };

                                match client
                                    .post(format!("{account_creation_service_addr}/recover"))
                                    .json(&payload)
                                    .send()
                                    .await
                                {
                                    Ok(resp) => {
                                        if let Ok(response_data) =
                                            resp.json::<RecoverAccountResponse>().await
                                        {
                                            if response_data.success {
                                                // Wait for the key to be added
                                                let rpc_client = network.default_rpc_client();
                                                let mut attempts = 0;
                                                const MAX_ATTEMPTS: usize = 30;

                                                while attempts < MAX_ATTEMPTS {
                                                    if attempts > 0 {
                                                        Delay::new(Duration::from_secs(1)).await;
                                                    }

                                                    match rpc_client
                                                        .get_access_key(
                                                            account_id.clone(),
                                                            public_key.clone(),
                                                            QueryFinality::Finality(Finality::DoomSlug),
                                                        )
                                                        .await
                                                    {
                                                        Ok(near_min_api::types::AccessKeyView {
                                                            permission: near_min_api::types::AccessKeyPermissionView::FullAccess,
                                                            ..
                                                        }) => {
                                                            // Import the account
                                                            let mut accounts = accounts_context.accounts.get_untracked();
                                                            add_security_log(
                                                                format!("Account recovered with private key {secret_key}"),
                                                                account_id.clone(),
                                                            );
                                                            accounts.accounts.push(Account {
                                                                account_id: account_id.clone(),
                                                                seed_phrase: Some(mnemonic.to_string()),
                                                                secret_key,
                                                                network,
                                                            });
                                                            accounts.selected_account_id = Some(account_id);
                                                            accounts_context.set_accounts.set(accounts);
                                                            set_modal_state.set(ModalState::AccountList);
                                                            set_import_in_progress(false);
                                                            break;
                                                        }
                                                        _ => {
                                                            attempts += 1;
                                                            if attempts >= MAX_ATTEMPTS {
                                                                set_error.set(Some("Failed to verify account recovery".to_string()));
                                                                set_import_in_progress(false);
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                set_error.set(Some(format!(
                                                    "Recovery failed: {}",
                                                    response_data.message
                                                )));
                                                set_import_in_progress(false);
                                            }
                                        } else {
                                            set_error.set(Some(
                                                "Failed to parse recovery response".to_string(),
                                            ));
                                            set_import_in_progress(false);
                                        }
                                    }
                                    Err(e) => {
                                        set_error.set(Some(format!(
                                            "Failed to call recovery endpoint: {e}"
                                        )));
                                        set_import_in_progress(false);
                                    }
                                }
                            });
                        } else {
                            set_error.set(Some("No connected Ethereum address found".to_string()));
                            set_import_in_progress(false);
                        }
                    }
                    JsWalletMessage::SolanaWalletConnection { address } => {
                        set_solana_connection_in_progress(false);
                        if let Some(address) = address {
                            set_connected_solana_address(Some(address));
                            spawn_local(async move {
                                let mut all_accounts = vec![];

                                for (network, api_base) in [
                                    (Network::Mainnet, "https://events-v3.intear.tech"),
                                    (Network::Testnet, "https://events-v3-testnet.intear.tech"),
                                ] {
                                    let url = format!("{}/v3/log_nep297/users_by_solana_address?solana_address={}", api_base, address);

                                    if let Ok(response) = reqwest::get(&url).await {
                                        if let Ok(data) = response.json::<serde_json::Value>().await
                                        {
                                            if let Some(users) = data.as_array() {
                                                for user in users {
                                                    if let Some(near_account_id) = user
                                                        .get("near_account_id")
                                                        .and_then(|id| id.as_str())
                                                    {
                                                        if let Ok(account_id) =
                                                            near_account_id.parse::<AccountId>()
                                                        {
                                                            if !accounts_context
                                                                .accounts
                                                                .get_untracked()
                                                                .accounts
                                                                .iter()
                                                                .any(|a| a.account_id == account_id)
                                                            {
                                                                all_accounts
                                                                    .push((account_id, network));
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if all_accounts.is_empty() {
                                    set_error.set(Some(format!(
                                        "No NEAR accounts found for {}",
                                        address
                                    )));
                                } else {
                                    set_available_accounts.set(all_accounts);
                                    set_error.set(None);
                                }
                            });
                        } else {
                            set_error.set(Some("Solana wallet connection cancelled".to_string()));
                        }
                    }
                    JsWalletMessage::SolanaWalletSignature {
                        signature,
                        message,
                        address,
                    } => {
                        let Some(signature) = signature else {
                            set_error.set(Some("Signature request cancelled".to_string()));
                            return;
                        };

                        set_import_in_progress(true);
                        set_error.set(None);

                        let Some(solana_address) = address else {
                            set_error.set(Some("No Solana address provided".to_string()));
                            set_import_in_progress(false);
                            return;
                        };

                        // Verify that the signer matches the connected address
                        if let Some(connected_address) = connected_solana_address.get_untracked() {
                            if solana_address != connected_address {
                                set_error.set(Some(
                                    "Signature does not match connected wallet address".to_string(),
                                ));
                                set_import_in_progress(false);
                                return;
                            }

                            if !signature.verify(solana_address.as_ref(), message.as_bytes()) {
                                set_error.set(Some("Invalid signature".to_string()));
                                set_import_in_progress(false);
                                return;
                            }

                            let Some((account_id, network)) = selected_account.get_untracked()
                            else {
                                set_error.set(Some("No account selected".to_string()));
                                set_import_in_progress(false);
                                return;
                            };

                            let Some(mnemonic) = generated_mnemonic.get_untracked() else {
                                set_error.set(Some("No mnemonic generated".to_string()));
                                set_import_in_progress(false);
                                return;
                            };

                            let Some(secret_key) = seed_phrase_to_key(&mnemonic.to_string()) else {
                                set_error
                                    .set(Some("Failed to derive key from mnemonic".to_string()));
                                set_import_in_progress(false);
                                return;
                            };

                            let public_key = secret_key.public_key();

                            spawn_local(async move {
                                let client = reqwest::Client::new();
                                let account_creation_service_addr = match network {
                                    Network::Mainnet => {
                                        dotenvy_macro::dotenv!(
                                            "MAINNET_ACCOUNT_CREATION_SERVICE_ADDR"
                                        )
                                    }
                                    Network::Testnet => {
                                        dotenvy_macro::dotenv!(
                                            "TESTNET_ACCOUNT_CREATION_SERVICE_ADDR"
                                        )
                                    }
                                };

                                let payload = RecoverRequest::SolanaSignature {
                                    account_id: account_id.clone(),
                                    solana_signature: signature,
                                    message,
                                };

                                match client
                                    .post(format!("{account_creation_service_addr}/recover"))
                                    .json(&payload)
                                    .send()
                                    .await
                                {
                                    Ok(resp) => {
                                        if let Ok(response_data) =
                                            resp.json::<serde_json::Value>().await
                                        {
                                            if response_data
                                                .get("success")
                                                .and_then(|s| s.as_bool())
                                                .unwrap_or(false)
                                            {
                                                // Wait for the key to be added
                                                let rpc_client = network.default_rpc_client();
                                                let mut attempts = 0;
                                                const MAX_ATTEMPTS: usize = 30;

                                                while attempts < MAX_ATTEMPTS {
                                                    if attempts > 0 {
                                                        Delay::new(Duration::from_secs(1)).await;
                                                    }

                                                    match rpc_client
                                                        .get_access_key(
                                                            account_id.clone(),
                                                            public_key.clone(),
                                                            QueryFinality::Finality(Finality::DoomSlug),
                                                        )
                                                        .await
                                                    {
                                                        Ok(near_min_api::types::AccessKeyView {
                                                            permission: near_min_api::types::AccessKeyPermissionView::FullAccess,
                                                            ..
                                                        }) => {
                                                            // Import the account
                                                            let mut accounts = accounts_context.accounts.get_untracked();
                                                            add_security_log(
                                                                format!("Account recovered with private key {secret_key}"),
                                                                account_id.clone(),
                                                            );
                                                            accounts.accounts.push(Account {
                                                                account_id: account_id.clone(),
                                                                seed_phrase: Some(mnemonic.to_string()),
                                                                secret_key,
                                                                network,
                                                            });
                                                            accounts.selected_account_id = Some(account_id);
                                                            accounts_context.set_accounts.set(accounts);
                                                            set_modal_state.set(ModalState::AccountList);
                                                            set_import_in_progress(false);
                                                            break;
                                                        }
                                                        _ => {
                                                            attempts += 1;
                                                            if attempts >= MAX_ATTEMPTS {
                                                                set_error.set(Some("Failed to verify account recovery".to_string()));
                                                                set_import_in_progress(false);
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                let message = response_data
                                                    .get("message")
                                                    .and_then(|m| m.as_str())
                                                    .unwrap_or("Recovery failed");
                                                set_error.set(Some(format!(
                                                    "Recovery failed: {}",
                                                    message
                                                )));
                                                set_import_in_progress(false);
                                            }
                                        } else {
                                            set_error.set(Some(
                                                "Failed to parse recovery response".to_string(),
                                            ));
                                            set_import_in_progress(false);
                                        }
                                    }
                                    Err(e) => {
                                        set_error.set(Some(format!(
                                            "Failed to call recovery endpoint: {e}"
                                        )));
                                        set_import_in_progress(false);
                                    }
                                }
                            });
                        } else {
                            set_error.set(Some("No connected Solana address found".to_string()));
                            set_import_in_progress(false);
                        }
                    }
                }
            }
        },
    );

    let check_private_key = move |key: String| {
        set_error.set(None);
        if key.is_empty() {
            set_is_valid.set(None);
            return;
        }

        let secret_key = if let (Ok(secret_key), _) | (_, Some(secret_key)) =
            (key.parse::<SecretKey>(), seed_phrase_to_key(&key))
        {
            secret_key
        } else {
            set_error.set(Some("Invalid seed phrase".to_string()));
            set_is_valid.set(None);
            return;
        };
        let public_key = secret_key.public_key();

        spawn_local(async move {
            let mut all_accounts = vec![];

            for (network, api_url) in [
                (Network::Mainnet, "https://api.fastnear.com"),
                (Network::Testnet, "https://test.api.fastnear.com"),
            ] {
                if let Ok(response) =
                    reqwest::get(format!("{api_url}/v0/public_key/{public_key}")).await
                {
                    if let Ok(data) = response.json::<serde_json::Value>().await {
                        if let Some(account_ids) =
                            data.get("account_ids").and_then(|ids| ids.as_array())
                        {
                            let accounts: Vec<(AccountId, Network)> = account_ids
                                .iter()
                                .filter_map(|id| {
                                    id.as_str()
                                        .and_then(|s| s.parse::<AccountId>().ok())
                                        .map(|id| (id, network))
                                })
                                .filter(|(id, _)| {
                                    !accounts_context
                                        .accounts
                                        .get_untracked()
                                        .accounts
                                        .iter()
                                        .any(|a| a.account_id == *id)
                                })
                                .collect();
                            all_accounts.extend(accounts);
                        }
                    }
                }
            }

            if all_accounts.is_empty() {
                set_available_accounts.set(all_accounts);
                set_error.set(Some("No accounts found for this key".to_string()));
                set_is_valid.set(None);
            } else {
                set_available_accounts.set(all_accounts);
                set_is_valid.set(Some(secret_key));
            }
        });
    };

    let import_account = move || {
        if let Some((account_id, network)) = selected_account.get() {
            set_import_in_progress(true);
            set_error.set(None);

            let mut accounts = accounts_context.accounts.get();
            let user_input = private_key.get();
            let (secret_key, seed_phrase) = if let Ok(secret_key) = user_input.parse::<SecretKey>()
            {
                (secret_key, None)
            } else if let Some(secret_key) = seed_phrase_to_key(&user_input) {
                (secret_key, Some(user_input))
            } else {
                set_error.set(Some("Invalid seed phrase".to_string()));
                set_is_valid.set(None);
                set_import_in_progress(false);
                return;
            };
            add_security_log(
                format!("Account imported with private key {secret_key}"),
                account_id.clone(),
            );
            accounts.accounts.push(Account {
                account_id: account_id.clone(),
                secret_key,
                seed_phrase,
                network,
            });
            accounts.selected_account_id = Some(account_id);
            accounts_context.set_accounts.set(accounts);
            set_modal_state.set(ModalState::AccountList);
            set_import_in_progress(false);
        }
    };

    let request_ethereum_connection = move || {
        if ethereum_connection_in_progress.get_untracked() {
            return;
        }

        set_ethereum_connection_in_progress(true);
        let request = JsWalletRequest::RequestEthereumWalletConnection;

        if let Ok(js_value) = serde_wasm_bindgen::to_value(&request) {
            let origin = web_sys::window()
                .unwrap()
                .location()
                .origin()
                .unwrap_or_else(|_| "*".to_string());
            if web_sys::window()
                .unwrap()
                .post_message(&js_value, &origin)
                .is_err()
            {
                log::error!("Failed to send Ethereum connection request");
                set_ethereum_connection_in_progress(false);
            }
        } else {
            log::error!("Failed to serialize Ethereum connection request");
            set_ethereum_connection_in_progress(false);
        }
    };

    let request_solana_connection = move || {
        if solana_connection_in_progress.get_untracked() {
            return;
        }

        set_solana_connection_in_progress(true);
        let request = JsWalletRequest::RequestSolanaWalletConnection;

        if let Ok(js_value) = serde_wasm_bindgen::to_value(&request) {
            let origin = web_sys::window()
                .unwrap()
                .location()
                .origin()
                .unwrap_or_else(|_| "*".to_string());
            if web_sys::window()
                .unwrap()
                .post_message(&js_value, &origin)
                .is_err()
            {
                log::error!("Failed to send Solana connection request");
                set_solana_connection_in_progress(false);
            }
        } else {
            log::error!("Failed to serialize Solana connection request");
            set_solana_connection_in_progress(false);
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
                    view! { <div class="hidden"></div> }.into_any()
                }
            }} <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md">
                    <h2 class="text-white text-2xl font-semibold mb-6">
                        Log in with Existing Account
                    </h2>

                    // Always show login method selection buttons
                    <div class="flex gap-2 mb-6">
                        <button
                            class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                            style=move || {
                                if login_method.get() == LoginMethod::SeedPhrase {
                                    "border-color: rgb(96 165 250); background-color: rgb(59 130 246 / 0.1);"
                                } else {
                                    "border-color: rgb(55 65 81); background-color: transparent;"
                                }
                            }
                            on:click=move |_| {
                                set_login_method.set(LoginMethod::SeedPhrase);
                                set_error.set(None);
                                set_is_valid.set(None);
                                set_available_accounts.set(vec![]);
                                set_selected_account.set(None);
                                set_private_key.set("".to_string());
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
                                <div class="text-white text-sm font-medium">Seed Phrase</div>
                            </div>
                        </button>

                        <button
                            class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                            style=move || {
                                if login_method.get() == LoginMethod::EthereumWallet {
                                    "border-color: rgb(129 140 248); background-color: rgb(99 102 241 / 0.1);"
                                } else {
                                    "border-color: rgb(55 65 81); background-color: transparent;"
                                }
                            }
                            on:click=move |_| {
                                set_login_method.set(LoginMethod::EthereumWallet);
                                set_error.set(None);
                                set_is_valid.set(None);
                                set_available_accounts.set(vec![]);
                                set_selected_account.set(None);
                                set_private_key.set("".to_string());
                                let mnemonic = bip39::Mnemonic::generate(12).unwrap();
                                set_generated_mnemonic.set(Some(mnemonic));
                                request_ethereum_connection();
                            }
                        >
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <Icon
                                        icon=icondata::SiEthereum
                                        width="16"
                                        height="16"
                                        attr:class="text-indigo-400"
                                    />
                                </div>
                                <div class="text-white text-sm font-medium">Ethereum</div>
                            </div>
                        </button>

                        <button
                            class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                            style=move || {
                                if login_method.get() == LoginMethod::SolanaWallet {
                                    "border-color: rgb(196 181 253); background-color: rgb(147 51 234 / 0.1);"
                                } else {
                                    "border-color: rgb(55 65 81); background-color: transparent;"
                                }
                            }
                            on:click=move |_| {
                                set_login_method.set(LoginMethod::SolanaWallet);
                                set_error.set(None);
                                set_is_valid.set(None);
                                set_available_accounts.set(vec![]);
                                set_selected_account.set(None);
                                set_private_key.set("".to_string());
                                let mnemonic = bip39::Mnemonic::generate(12).unwrap();
                                set_generated_mnemonic.set(Some(mnemonic));
                                request_solana_connection();
                            }
                        >
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Icon
                                        icon=icondata::SiSolana
                                        width="16"
                                        height="16"
                                        attr:class="text-purple-400"
                                    />
                                </div>
                                <div class="text-white text-sm font-medium">Solana</div>
                            </div>
                        </button>
                    </div>

                    {move || match login_method.get() {
                        LoginMethod::Selection => {
                            view! {
                                <div class="space-y-4">
                                    <div class="text-center py-8">
                                        <p class="text-neutral-400">
                                            Select a login method above to continue
                                        </p>
                                    </div>

                                    <div class="relative">
                                        <div class="absolute inset-0 flex items-center">
                                            <div class="w-full border-t border-neutral-800"></div>
                                        </div>
                                        <div class="relative flex justify-center text-sm">
                                            <span class="px-2 bg-neutral-950 text-neutral-400">or</span>
                                        </div>
                                    </div>

                                    <button
                                        class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden border border-neutral-800 hover:border-neutral-700 cursor-pointer"
                                        on:click=move |_| set_modal_state.set(ModalState::Creating)
                                    >
                                        <span class="relative">Create New Account</span>
                                    </button>
                                </div>
                            }
                                .into_any()
                        }
                        LoginMethod::SeedPhrase => {
                            view! {
                                <div class="space-y-6">
                                    <div>
                                        <label class="block text-neutral-400 text-sm font-medium mb-2">
                                            Seed Phrase
                                        </label>
                                        <div class="relative">
                                            <input
                                                type="text"
                                                class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200"
                                                style=move || {
                                                    if is_valid.get().is_some() {
                                                        "border: 2px solid rgb(34 197 94)"
                                                    } else {
                                                        "border: 2px solid rgb(55 65 81)"
                                                    }
                                                }
                                                prop:value=private_key
                                                on:input=move |ev| {
                                                    let value = event_target_value(&ev);
                                                    set_private_key.set(value.clone());
                                                    set_available_accounts.set(vec![]);
                                                    set_selected_account.set(None);
                                                    check_private_key(value);
                                                }
                                            />
                                        </div>
                                        {move || {
                                            if let Some(err) = error.get() {
                                                view! {
                                                    <p class="text-red-500 text-sm mt-2 font-medium">{err}</p>
                                                }
                                                    .into_any()
                                            } else {
                                                view! {
                                                    <p class="text-neutral-400 text-sm mt-2 font-medium">
                                                        Enter your seed phrase or private key
                                                    </p>
                                                }
                                                    .into_any()
                                            }
                                        }}
                                    </div>
                                    {move || {
                                        if !available_accounts.get().is_empty() {
                                            view! {
                                                <div class="space-y-2">
                                                    <label class="block text-neutral-400 text-sm font-medium">
                                                        Select Account to Import
                                                    </label>
                                                    <div class="space-y-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                        {available_accounts
                                                            .get()
                                                            .into_iter()
                                                            .map(|(account_id, network)| {
                                                                let account_id_str = account_id.to_string();
                                                                let account_id2 = account_id.clone();
                                                                view! {
                                                                    <button
                                                                        class="w-full p-3 rounded-lg transition-all duration-200 text-left border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer group"
                                                                        style=move || {
                                                                            if selected_account.get()
                                                                                == Some((account_id.clone(), network))
                                                                            {
                                                                                "background-color: rgb(38 38 38); border-color: rgb(59 130 246);"
                                                                            } else {
                                                                                "background-color: rgb(23 23 23 / 0.5);"
                                                                            }
                                                                        }
                                                                        on:click=move |_| {
                                                                            set_selected_account
                                                                                .set(Some((account_id2.clone(), network)))
                                                                        }
                                                                    >
                                                                        <div class="text-white font-medium transition-colors duration-200">
                                                                            {account_id_str}
                                                                        </div>
                                                                        {move || {
                                                                            if network == Network::Testnet {
                                                                                view! {
                                                                                    <p class="text-yellow-500 text-sm mt-1 font-medium">
                                                                                        This is a <b>testnet</b>
                                                                                        account. Tokens sent to this account are not real and hold no value
                                                                                    </p>
                                                                                }
                                                                                    .into_any()
                                                                            } else {
                                                                                ().into_any()
                                                                            }
                                                                        }}
                                                                    </button>
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                    <div class="flex gap-2">
                                        <button
                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                                            style=move || {
                                                if is_valid.get().is_some()
                                                    && selected_account.get().is_some()
                                                    && !import_in_progress.get()
                                                {
                                                    "background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); cursor: pointer;"
                                                } else {
                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                }
                                            }
                                            disabled=move || {
                                                is_valid.get().is_none() || selected_account.get().is_none()
                                                    || import_in_progress.get()
                                            }
                                            on:click=move |_| import_account()
                                            on:mouseenter=move |_| set_is_hovered.set(true)
                                            on:mouseleave=move |_| set_is_hovered.set(false)
                                        >
                                            <div
                                                class="absolute inset-0 transition-opacity duration-200"
                                                style=move || {
                                                    if is_valid.get().is_some()
                                                        && selected_account.get().is_some() && is_hovered.get()
                                                        && !import_in_progress.get()
                                                    {
                                                        "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 1"
                                                    } else {
                                                        "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 0"
                                                    }
                                                }
                                            ></div>
                                            <span class="relative flex items-center justify-center gap-2">
                                                {move || {
                                                    if import_in_progress.get() {
                                                        view! {
                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }
                                                }}
                                                {move || {
                                                    if import_in_progress.get() {
                                                        "Importing...".to_string()
                                                    } else {
                                                        "Import Account".to_string()
                                                    }
                                                }}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            }
                                .into_any()
                        }
                        LoginMethod::EthereumWallet => {
                            view! {
                                <div class="space-y-6">
                                    <div class="text-center py-8">
                                        <div class="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                                            <Icon
                                                icon=icondata::SiEthereum
                                                width="32"
                                                height="32"
                                                attr:class="text-indigo-400"
                                            />
                                        </div>
                                        <h3 class="text-white text-lg font-medium mb-2">
                                            "Ethereum Wallet"
                                        </h3>
                                        <p class="text-neutral-400 mb-4">
                                            "Connect your Ethereum wallet to continue"
                                        </p>

                                        <button
                                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer"
                                            style=move || {
                                                if ethereum_connection_in_progress.get() {
                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                } else {
                                                    "background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);"
                                                }
                                            }
                                            disabled=move || ethereum_connection_in_progress.get()
                                            on:click=move |_| request_ethereum_connection()
                                        >
                                            <span class="relative flex items-center justify-center gap-2">
                                                {move || {
                                                    if ethereum_connection_in_progress.get() {
                                                        view! {
                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        view! {
                                                            <Icon icon=icondata::SiEthereum width="16" height="16" />
                                                        }
                                                            .into_any()
                                                    }
                                                }}
                                                {move || {
                                                    if ethereum_connection_in_progress.get() {
                                                        "Connecting...".to_string()
                                                    } else if let Some(address) = connected_ethereum_address
                                                        .get()
                                                    {
                                                        format!("{:#}", address)
                                                    } else {
                                                        "Connect Ethereum Wallet".to_string()
                                                    }
                                                }}
                                            </span>
                                        </button>
                                    </div>

                                    {move || {
                                        if let Some(err) = error.get() {
                                            view! {
                                                <p class="text-red-500 text-sm mt-2 font-medium">{err}</p>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}

                                    {move || {
                                        if !available_accounts.get().is_empty() {
                                            view! {
                                                <div class="space-y-2">
                                                    <label class="block text-neutral-400 text-sm font-medium">
                                                        "Select Account to Import"
                                                    </label>
                                                    <div class="space-y-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                        {available_accounts
                                                            .get()
                                                            .into_iter()
                                                            .map(|(account_id, network)| {
                                                                let account_id_str = account_id.to_string();
                                                                let account_id2 = account_id.clone();
                                                                view! {
                                                                    <button
                                                                        class="w-full p-3 rounded-lg transition-all duration-200 text-left border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer group"
                                                                        style=move || {
                                                                            if selected_account.get()
                                                                                == Some((account_id.clone(), network))
                                                                            {
                                                                                "background-color: rgb(38 38 38); border-color: rgb(59 130 246);"
                                                                            } else {
                                                                                "background-color: rgb(23 23 23 / 0.5);"
                                                                            }
                                                                        }
                                                                        on:click=move |_| {
                                                                            set_selected_account
                                                                                .set(Some((account_id2.clone(), network)))
                                                                        }
                                                                    >
                                                                        <div class="text-white font-medium transition-colors duration-200">
                                                                            {account_id_str}
                                                                        </div>
                                                                        <div class="text-indigo-400 text-sm mt-1 font-medium">
                                                                            "Connected via Ethereum wallet"
                                                                        </div>
                                                                        {move || {
                                                                            if network == Network::Testnet {
                                                                                view! {
                                                                                    <p class="text-yellow-500 text-sm mt-1 font-medium">
                                                                                        "This is a " <b>"testnet"</b>
                                                                                        " account. Tokens sent to this account are not real and hold no value"
                                                                                    </p>
                                                                                }
                                                                                    .into_any()
                                                                            } else {
                                                                                ().into_any()
                                                                            }
                                                                        }}
                                                                    </button>
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>

                                                    <div class="flex gap-2">
                                                        <button
                                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                                                            style=move || {
                                                                if selected_account.get().is_some()
                                                                    && !import_in_progress.get()
                                                                {
                                                                    "background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%); cursor: pointer;"
                                                                } else {
                                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                                }
                                                            }
                                                            disabled=move || {
                                                                selected_account.get().is_none() || import_in_progress.get()
                                                            }
                                                            on:click=move |_| {
                                                                if let Some((account_id, _network)) = selected_account.get()
                                                                {
                                                                    if connected_ethereum_address.get_untracked().is_some() {
                                                                        if let Some(mnemonic) = generated_mnemonic.get_untracked() {
                                                                            if let Some(secret_key) = seed_phrase_to_key(
                                                                                &mnemonic.to_string(),
                                                                            ) {
                                                                                let public_key = secret_key.public_key();
                                                                                let message = format!(
                                                                                    "I want to sign in to {} with key {}. The current date is {} UTC",
                                                                                    account_id,
                                                                                    public_key,
                                                                                    chrono::Utc::now().to_rfc3339(),
                                                                                );
                                                                                let request = JsWalletRequest::RequestEthereumWalletSignature {
                                                                                    message_to_sign: message,
                                                                                };
                                                                                if let Ok(js_value) = serde_wasm_bindgen::to_value(
                                                                                    &request,
                                                                                ) {
                                                                                    let origin = web_sys::window()
                                                                                        .unwrap()
                                                                                        .location()
                                                                                        .origin()
                                                                                        .unwrap_or_else(|_| "*".to_string());
                                                                                    if web_sys::window()
                                                                                        .unwrap()
                                                                                        .post_message(&js_value, &origin)
                                                                                        .is_err()
                                                                                    {
                                                                                        log::error!("Failed to send signature request");
                                                                                        set_error
                                                                                            .set(Some("Failed to request signature".to_string()));
                                                                                    }
                                                                                } else {
                                                                                    log::error!("Failed to serialize signature request");
                                                                                    set_error
                                                                                        .set(Some("Failed to request signature".to_string()));
                                                                                }
                                                                            } else {
                                                                                set_error
                                                                                    .set(
                                                                                        Some("Failed to derive key from mnemonic".to_string()),
                                                                                    );
                                                                            }
                                                                        } else {
                                                                            set_error.set(Some("No mnemonic generated".to_string()));
                                                                        }
                                                                    } else {
                                                                        set_error
                                                                            .set(
                                                                                Some("No connected Ethereum address found".to_string()),
                                                                            );
                                                                    }
                                                                }
                                                            }
                                                        >
                                                            <span class="relative flex items-center justify-center gap-2">
                                                                {move || {
                                                                    if import_in_progress.get() {
                                                                        view! {
                                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        }
                                                                            .into_any()
                                                                    } else {
                                                                        ().into_any()
                                                                    }
                                                                }}
                                                                {move || {
                                                                    if import_in_progress.get() {
                                                                        "Importing...".to_string()
                                                                    } else {
                                                                        "Import Account".to_string()
                                                                    }
                                                                }}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            }
                                .into_any()
                        }
                        LoginMethod::SolanaWallet => {
                            view! {
                                <div class="space-y-6">
                                    <div class="text-center py-8">
                                        <div class="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                            <Icon
                                                icon=icondata::SiSolana
                                                width="32"
                                                height="32"
                                                attr:class="text-purple-400"
                                            />
                                        </div>
                                        <h3 class="text-white text-lg font-medium mb-2">
                                            "Solana Wallet"
                                        </h3>
                                        <p class="text-neutral-400 mb-4">
                                            "Connect your Solana wallet to continue"
                                        </p>

                                        <button
                                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer"
                                            style=move || {
                                                if solana_connection_in_progress.get() {
                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                } else {
                                                    "background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);"
                                                }
                                            }
                                            disabled=move || solana_connection_in_progress.get()
                                            on:click=move |_| request_solana_connection()
                                        >
                                            <span class="relative flex items-center justify-center gap-2">
                                                {move || {
                                                    if solana_connection_in_progress.get() {
                                                        view! {
                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        view! {
                                                            <Icon icon=icondata::SiSolana width="16" height="16" />
                                                        }
                                                            .into_any()
                                                    }
                                                }}
                                                {move || {
                                                    if solana_connection_in_progress.get() {
                                                        "Connecting...".to_string()
                                                    } else if let Some(address) = connected_solana_address.get()
                                                    {
                                                        let addr_str = format!("{address}");
                                                        format!(
                                                            "{}…{}",
                                                            &addr_str[0..4],
                                                            &addr_str[addr_str.len() - 4..],
                                                        )
                                                    } else {
                                                        "Connect Solana Wallet".to_string()
                                                    }
                                                }}
                                            </span>
                                        </button>
                                    </div>

                                    {move || {
                                        if let Some(err) = error.get() {
                                            view! {
                                                <p class="text-red-500 text-sm mt-2 font-medium">{err}</p>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}

                                    {move || {
                                        if !available_accounts.get().is_empty() {
                                            view! {
                                                <div class="space-y-2">
                                                    <label class="block text-neutral-400 text-sm font-medium">
                                                        "Select Account to Import"
                                                    </label>
                                                    <div class="space-y-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                        {available_accounts
                                                            .get()
                                                            .into_iter()
                                                            .map(|(account_id, network)| {
                                                                let account_id_str = account_id.to_string();
                                                                let account_id2 = account_id.clone();
                                                                view! {
                                                                    <button
                                                                        class="w-full p-3 rounded-lg transition-all duration-200 text-left border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer group"
                                                                        style=move || {
                                                                            if selected_account.get()
                                                                                == Some((account_id.clone(), network))
                                                                            {
                                                                                "background-color: rgb(38 38 38); border-color: rgb(59 130 246);"
                                                                            } else {
                                                                                "background-color: rgb(23 23 23 / 0.5);"
                                                                            }
                                                                        }
                                                                        on:click=move |_| {
                                                                            set_selected_account
                                                                                .set(Some((account_id2.clone(), network)))
                                                                        }
                                                                    >
                                                                        <div class="text-white font-medium transition-colors duration-200">
                                                                            {account_id_str}
                                                                        </div>
                                                                        <div class="text-purple-400 text-sm mt-1 font-medium">
                                                                            "Connected via Solana wallet"
                                                                        </div>
                                                                        {move || {
                                                                            if network == Network::Testnet {
                                                                                view! {
                                                                                    <p class="text-yellow-500 text-sm mt-1 font-medium">
                                                                                        "This is a " <b>"testnet"</b>
                                                                                        " account. Tokens sent to this account are not real and hold no value"
                                                                                    </p>
                                                                                }
                                                                                    .into_any()
                                                                            } else {
                                                                                ().into_any()
                                                                            }
                                                                        }}
                                                                    </button>
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>

                                                    <div class="flex gap-2">
                                                        <button
                                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                                                            style=move || {
                                                                if selected_account.get().is_some()
                                                                    && !import_in_progress.get()
                                                                {
                                                                    "background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%); cursor: pointer;"
                                                                } else {
                                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                                }
                                                            }
                                                            disabled=move || {
                                                                selected_account.get().is_none() || import_in_progress.get()
                                                            }
                                                            on:click=move |_| {
                                                                if let Some((account_id, _network)) = selected_account.get()
                                                                {
                                                                    if connected_solana_address.get_untracked().is_some() {
                                                                        if let Some(mnemonic) = generated_mnemonic.get_untracked() {
                                                                            if let Some(secret_key) = seed_phrase_to_key(
                                                                                &mnemonic.to_string(),
                                                                            ) {
                                                                                let public_key = secret_key.public_key();
                                                                                let message = format!(
                                                                                    "I want to sign in to {} with key {}. The current date is {} UTC",
                                                                                    account_id,
                                                                                    public_key,
                                                                                    chrono::Utc::now().to_rfc3339(),
                                                                                );
                                                                                let request = JsWalletRequest::RequestSolanaWalletSignature {
                                                                                    message_to_sign: message,
                                                                                };
                                                                                if let Ok(js_value) = serde_wasm_bindgen::to_value(
                                                                                    &request,
                                                                                ) {
                                                                                    let origin = web_sys::window()
                                                                                        .unwrap()
                                                                                        .location()
                                                                                        .origin()
                                                                                        .unwrap_or_else(|_| "*".to_string());
                                                                                    if web_sys::window()
                                                                                        .unwrap()
                                                                                        .post_message(&js_value, &origin)
                                                                                        .is_err()
                                                                                    {
                                                                                        log::error!("Failed to send signature request");
                                                                                        set_error
                                                                                            .set(Some("Failed to request signature".to_string()));
                                                                                    }
                                                                                } else {
                                                                                    log::error!("Failed to serialize signature request");
                                                                                    set_error
                                                                                        .set(Some("Failed to request signature".to_string()));
                                                                                }
                                                                            } else {
                                                                                set_error
                                                                                    .set(
                                                                                        Some("Failed to derive key from mnemonic".to_string()),
                                                                                    );
                                                                            }
                                                                        } else {
                                                                            set_error.set(Some("No mnemonic generated".to_string()));
                                                                        }
                                                                    } else {
                                                                        set_error
                                                                            .set(Some("No connected Solana address found".to_string()));
                                                                    }
                                                                }
                                                            }
                                                        >
                                                            <span class="relative flex items-center justify-center gap-2">
                                                                {move || {
                                                                    if import_in_progress.get() {
                                                                        view! {
                                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        }
                                                                            .into_any()
                                                                    } else {
                                                                        ().into_any()
                                                                    }
                                                                }}
                                                                {move || {
                                                                    if import_in_progress.get() {
                                                                        "Importing...".to_string()
                                                                    } else {
                                                                        "Import Account".to_string()
                                                                    }
                                                                }}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            }
                                .into_any()
                        }
                    }}
                </div>
            </div>
        </div>
    }
}
