use std::collections::HashSet;

use chrono::Utc;
use ed25519_dalek::SECRET_KEY_LENGTH;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use near_min_api::types::{
    near_crypto::{ED25519SecretKey, KeyType, PublicKey, SecretKey, Signature},
    AccessKey, AccessKeyPermission, AccountId, Action, AddKeyAction, CryptoHash,
    FunctionCallPermission, NearToken,
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsCast;
use web_sys::{js_sys::Date, Window};

use crate::contexts::config_context::ConfigContext;
use crate::contexts::{
    accounts_context::{AccountsContext, SecretKeyHolder},
    connected_apps_context::{ConnectedApp, ConnectedAppsContext},
    network_context::Network,
    security_log_context::add_security_log,
    transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
};
use crate::utils::{format_account_id, is_debug_enabled};
use crate::{
    contexts::account_selector_context::AccountSelectorContext, utils::tauri_invoke_no_args,
};

const GAS_ALLOWANCE: NearToken = NearToken::from_millinear(1000); // 1 NEAR

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WalletSelectorAccount {
    account_id: AccountId,
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
#[allow(clippy::large_enum_variant)]
pub enum ReceiveMessage {
    SignIn {
        data: SignInRequest,
    },
    #[serde(rename_all = "camelCase")]
    TauriWalletSession {
        session_id: String,
    },
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SignInRequest {
    #[serde(default)]
    contract_id: Option<String>,
    #[serde(default)]
    method_names: Option<Vec<String>>,
    public_key: PublicKey,
    network_id: NetworkLowercase,
    nonce: u64,
    signature: Signature,
    message: String,
    // Below: added in V2
    #[serde(default)]
    version: Version,
    #[serde(default)]
    actual_origin: Option<String>,
}

#[derive(Deserialize, Debug, Clone, Default)]
enum Version {
    #[default]
    V1,
    V2,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SignedOrigin {
    origin: String,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub enum NetworkLowercase {
    Mainnet,
    Testnet,
}

impl From<NetworkLowercase> for Network {
    fn from(network: NetworkLowercase) -> Self {
        match network {
            NetworkLowercase::Mainnet => Network::Mainnet,
            NetworkLowercase::Testnet => Network::Testnet,
        }
    }
}

#[derive(Serialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum SendMessage {
    Ready,
    #[serde(rename_all = "camelCase")]
    Connected {
        accounts: Vec<WalletSelectorAccount>,
        function_call_key_added: bool,
        logout_key: PublicKey,
        use_bridge: bool,
        wallet_url: String,
    },
    Error {
        message: String,
    },
}

#[derive(Serialize, Debug)]
struct LoginBridgeRequest {
    account_id: AccountId,
    app_public_key: PublicKey,
    user_logout_public_key: PublicKey,
    nonce: u64,
    signature: Signature,
    user_on_chain_public_key: PublicKey,
}

#[derive(Serialize, Debug)]
struct SessionResponse {
    message: String,
}

pub async fn submit_tauri_response(
    session_id: String,
    message: impl Serialize,
    close_window: bool,
) {
    let response = SessionResponse {
        message: serde_json::to_string(&message).unwrap(),
    };

    let url = dotenvy_macro::dotenv!("SHARED_LOGOUT_BRIDGE_SERVICE_ADDR");
    let submit_url = format!("{url}/api/session/{session_id}/submit-response");

    match reqwest::Client::new()
        .post(&submit_url)
        .json(&response)
        .send()
        .await
    {
        Ok(response) if response.status().is_success() => {
            log::info!("Bridge: Successfully submitted response");
        }
        Ok(response) => {
            log::error!(
                "Bridge: Submit response failed with status {}",
                response.status()
            );
        }
        Err(e) => {
            log::error!("Bridge: Failed to submit response: {e}");
        }
    }

    if close_window {
        let _ = tauri_invoke_no_args("close_temporary_window");
    }
}

#[component]
pub fn Connect() -> impl IntoView {
    let (loading, set_loading) = signal(true);
    let (request_data, set_request_data) = signal::<Option<SignInRequest>>(None);
    let (origin_for_post_message, set_origin) = signal::<String>("*".to_string());
    let (actual_origin, set_actual_origin) = signal::<Option<String>>(None);
    let (add_function_call_key, set_add_function_call_key) = signal(false);
    let AccountSelectorContext { set_expanded, .. } = expect_context::<AccountSelectorContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let ConnectedAppsContext { apps, set_apps } = expect_context::<ConnectedAppsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let (tauri_session_id, set_tauri_session_id) = signal::<Option<String>>(None);

    let opener = || {
        if let Ok(opener) = window().opener() {
            let opener = opener.unchecked_into::<Window>();
            if opener.is_truthy() {
                opener
            } else {
                window()
            }
        } else {
            window()
        }
    };

    let is_public_key_valid = Memo::new(move |_| {
        if let Some(request_data) = &*request_data.read() {
            let Ok(message) = serde_json::from_str::<SignedOrigin>(&request_data.message) else {
                return false;
            };

            // No origin check in V2+
            if matches!(request_data.version, Version::V1)
                && message.origin != origin_for_post_message()
                && message.origin != "*"
            {
                return false;
            }

            let text_to_prove = format!("{}|{}", request_data.nonce, request_data.message);
            let to_prove = text_to_prove.as_bytes();
            let to_prove = CryptoHash::hash_bytes(to_prove); // sha256
            let is_valid = request_data
                .signature
                .verify(to_prove.as_bytes(), &request_data.public_key)
                && request_data.nonce > Date::now() as u64 - 1000 * 60 * 5
                && request_data.nonce <= Date::now() as u64;

            if !is_valid {
                return false;
            }

            true
        } else {
            false
        }
    });

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
            let process_sign_in = move |data: SignInRequest| {
                let evt_origin = event.origin();
                if matches!(data.version, Version::V1) {
                    // In V1 the event origin in the dapp. In V2+ it's an iframe which can't
                    // possibly navigate to a different location under normal circumstances,
                    // so we can use "*"
                    set_origin(evt_origin.clone());
                    set_actual_origin(Some(evt_origin.clone()));
                } else {
                    set_actual_origin(Some(
                        data.actual_origin
                            .clone()
                            .expect("No actual_origin sent in V2+"),
                    ));
                }
                set_loading(false);
                let has_contract = data.contract_id.as_deref().is_some_and(|v| !v.is_empty());
                let default_checked = has_contract;
                let restored = config
                    .get_untracked()
                    .autoconfirm_preference_by_origin
                    .get(&evt_origin)
                    .copied();
                set_add_function_call_key(restored.unwrap_or(default_checked));
                set_request_data(Some(data));
            };
            match message {
                ReceiveMessage::SignIn { data } => {
                    process_sign_in(data);
                }
                ReceiveMessage::TauriWalletSession { session_id } => {
                    spawn_local(async move {
                        let url = dotenvy_macro::dotenv!("SHARED_LOGOUT_BRIDGE_SERVICE_ADDR");
                        let retrieve_url =
                            format!("{url}/api/session/{session_id}/retrieve-request");

                        match reqwest::Client::new().get(&retrieve_url).send().await {
                            Ok(response) if response.status().is_success() => {
                                match response.json::<serde_json::Value>().await {
                                    Ok(json) => {
                                        if let Some(message) = json.get("message") {
                                            let Some(message) = message.as_str() else {
                                                log::error!("Bridge: Message is not a string");
                                                return;
                                            };
                                            let Ok(message) =
                                                serde_json::from_str::<ReceiveMessage>(message)
                                            else {
                                                log::error!(
                                                    "Bridge: Failed to parse message: {message}"
                                                );
                                                return;
                                            };
                                            log::info!(
                                                "Bridge request data: {:?}",
                                                message
                                            );
                                            set_tauri_session_id(Some(session_id.clone()));
                                            match message {
                                                ReceiveMessage::SignIn { data } => {
                                                    process_sign_in(data)
                                                }
                                                other => {
                                                    log::error!(
                                                        "Bridge: Unexpected message: {other:?}"
                                                    );
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
                }
            }
        } else if is_debug_enabled() {
            log::info!("Failed to parse message as ReceiveMessage");
        }
    });

    let post_to_opener = move |message: SendMessage, close_window: bool| {
        if let Some(session_id) = tauri_session_id.get_untracked() {
            spawn_local(submit_tauri_response(session_id, message, close_window));
        } else {
            let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
            opener()
                .post_message(&js_value, &origin_for_post_message.read_untracked())
                .expect("Failed to send message");
        }
    };

    Effect::new(move || {
        if is_debug_enabled() {
            log::info!("Sending ready message");
        }
        let ready_message = SendMessage::Ready;
        post_to_opener(ready_message, false);
        if is_debug_enabled() {
            log::info!("Sent ready message");
        }
    });

    let handle_connect = move |_| {
        let request_data = request_data().expect("No request data");
        let Some(selected_account_id) = accounts_context.accounts.get().selected_account_id else {
            log::error!("No account selected");
            return;
        };
        let selected_account = accounts_context
            .accounts
            .get()
            .accounts
            .into_iter()
            .find(|a| a.account_id == selected_account_id)
            .expect("Selected account not found");

        if !is_public_key_valid() {
            let message = SendMessage::Error {
                message: "Invalid signature or nonce".to_string(),
            };
            post_to_opener(message, true);
            return;
        }

        if apps
            .read_untracked()
            .apps
            .iter()
            .any(|app| app.public_key == request_data.public_key)
        {
            // Now it's safe to reveal this, no one can identify whether a certain
            // app is connected by just having the public key, they would also need a
            // signed message with the origin
            log::error!("App with the same key already connected");
            let message = SendMessage::Error {
                message: "App with the same key already connected".to_string(),
            };
            post_to_opener(message, true);
            return;
        }
        let logout_key = SecretKey::from_random(KeyType::ED25519);

        // Send login request to bridge service
        let nonce = Date::now() as u64;
        let message = format!(
            "login|{nonce}|{selected_account_id}|{}",
            request_data.public_key,
        );

        spawn_local({
            let selected_account_secret_key = selected_account.secret_key.clone();
            let selected_account = selected_account_id.clone();
            let request_data = request_data.clone();
            let logout_key = logout_key.clone();
            let add_function_call_key = add_function_call_key();
            async move {
                let secret_key = match selected_account_secret_key {
                    SecretKeyHolder::SecretKey(secret_key) => secret_key,
                    SecretKeyHolder::Ledger { .. } => {
                        // Don't ask for Ledger signing, it's too bad UX
                        SecretKey::ED25519(ED25519SecretKey(
                            ed25519_dalek::SigningKey::from_bytes(&[0; SECRET_KEY_LENGTH])
                                .to_keypair_bytes(),
                        ))
                    }
                };
                let secret_key_bytes = secret_key.unwrap_as_ed25519().0;
                let (_secret_key, verifying_key) = secret_key_bytes.split_at(SECRET_KEY_LENGTH);
                let _signing_key = ed25519_dalek::SigningKey::try_from(_secret_key)
                    .expect("Failed to create signing key");
                let _verifying_key = ed25519_dalek::VerifyingKey::try_from(verifying_key)
                    .expect("Failed to create verifying key");
                log::info!("Equal: {}", _signing_key.verifying_key() == _verifying_key);
                log::info!("Signing message: {message}");
                let signature = secret_key.sign(message.as_bytes());
                log::info!("Signature: {signature}");

                let login_request = LoginBridgeRequest {
                    account_id: selected_account_id.clone(),
                    app_public_key: request_data.public_key.clone(),
                    user_logout_public_key: logout_key.public_key(),
                    nonce,
                    signature,
                    user_on_chain_public_key: secret_key.public_key(),
                };

                let url = dotenvy_macro::dotenv!("SHARED_LOGOUT_BRIDGE_SERVICE_ADDR");
                let network = match request_data.network_id {
                    NetworkLowercase::Mainnet => "mainnet",
                    NetworkLowercase::Testnet => "testnet",
                };

                match reqwest::Client::new()
                    .post(format!("{url}/api/login/{network}"))
                    .json(&login_request)
                    .send()
                    .await
                {
                    Ok(failed_response) if !failed_response.status().is_success() => {
                        log::error!("Logout bridge responsed with {failed_response:?}");
                    }
                    Ok(_successful_response) => (),
                    Err(err) => {
                        log::error!("Failed to connect to bridge service: {err:?}");
                    }
                }
                set_apps.update(|apps| {
                    let app = ConnectedApp {
                        account_id: selected_account.clone(),
                        public_key: request_data.public_key.clone(),
                        requested_contract_id: match request_data.contract_id.as_deref() {
                            None => None,
                            Some("") => None,
                            Some(contract_id) => {
                                if let Ok(account_id) = contract_id.parse::<AccountId>() {
                                    if add_function_call_key {
                                        Some(account_id)
                                    } else {
                                        None
                                    }
                                } else {
                                    log::error!("Invalid contract ID: {contract_id}");
                                    None
                                }
                            }
                        },
                        requested_method_names: request_data
                            .method_names
                            .clone()
                            .unwrap_or_default(),
                        requested_gas_allowance: if request_data.contract_id.is_some() {
                            GAS_ALLOWANCE
                        } else {
                            NearToken::from_yoctonear(0)
                        },
                        origin: actual_origin.get_untracked().expect("No actual origin").clone(),
                        connected_at: Utc::now(),
                        autoconfirm_contracts: HashSet::new(),
                        autoconfirm_non_financial: false,
                        autoconfirm_all: false,
                        logged_out_at: None,
                        logout_key: logout_key.clone(),
                    };
                    add_security_log(
                        format!("Connected to {app:?} on /connect"),
                        selected_account.clone(),
                        accounts_context,
                    );
                    apps.apps.push(app);
                });

                // Continue with function call key addition if needed
                if add_function_call_key && request_data.contract_id.is_some() {
                    let contract_id = request_data
                        .contract_id
                        .expect("Contract ID must be present, otherwise checkbox can't be checked");
                    let method_names = request_data.method_names.clone().unwrap_or_default();

                    let action = Action::AddKey(Box::new(AddKeyAction {
                        public_key: request_data.public_key.clone(),
                        access_key: AccessKey {
                            nonce: 0,
                            permission: AccessKeyPermission::FunctionCall(FunctionCallPermission {
                                allowance: Some(GAS_ALLOWANCE),
                                receiver_id: contract_id.clone(),
                                method_names: method_names.clone(),
                            }),
                        },
                    }));

                    let (details_receiver, transaction) = EnqueuedTransaction::create(
                        format!("Grant permission to call {contract_id} without confirmation"),
                        selected_account.clone(),
                        selected_account.clone(),
                        vec![action],
                    );

                    add_transaction.update(|queue| queue.push(transaction));

                    match details_receiver.await {
                        Ok(details) => {
                            log::info!("Transaction details: {details:?}");
                            if details.is_ok_and(|d| d.final_execution_outcome.is_some()) {
                                let accounts = vec![WalletSelectorAccount {
                                    account_id: selected_account,
                                }];
                                let message = SendMessage::Connected {
                                    accounts,
                                    function_call_key_added: true,
                                    logout_key: logout_key.public_key(),
                                    use_bridge: tauri_session_id.get_untracked().is_some(),
                                    wallet_url: location().origin().expect("No origin"),
                                };
                                post_to_opener(message, true);
                            } else {
                                let message = SendMessage::Error {
                                    message: "Failed to add function call key".to_string(),
                                };
                                post_to_opener(message, true);
                            }
                        }
                        Err(err) => {
                            let message = SendMessage::Error {
                                message: format!("Failed to add function call key: {err}"),
                            };
                            post_to_opener(message, true);
                        }
                    }
                } else {
                    let accounts = vec![WalletSelectorAccount {
                        account_id: selected_account,
                    }];
                    let message = SendMessage::Connected {
                        accounts,
                        function_call_key_added: false,
                        logout_key: logout_key.public_key(),
                        use_bridge: tauri_session_id.get_untracked().is_some(),
                        wallet_url: location().origin().expect("No origin"),
                    };
                    post_to_opener(message, true);
                }
            }
        });
    };

    let handle_cancel = move |_| {
        let message = SendMessage::Error {
            message: "User rejected the connection".to_string(),
        };
        post_to_opener(message, true);
    };

    view! {
        <div class="flex flex-col items-center justify-center min-h-[calc(80vh-100px)] p-4">
            {move || {
                if loading.get() {
                    view! {
                        <div class="flex flex-col items-center gap-4">
                            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                            <p class="text-white text-lg">"Receiving connection details..."</p>
                        </div>
                    }
                        .into_any()
                } else if let Some(selected_account_id) = accounts_context
                    .accounts
                    .get()
                    .selected_account_id
                {
                    let selected_account_network = accounts_context
                        .accounts
                        .get()
                        .accounts
                        .iter()
                        .find(|a| a.account_id == selected_account_id)
                        .expect("Selected account not found")
                        .network;
                    let request_network: Network = request_data()
                        .expect("No request data")
                        .network_id
                        .into();
                    let network_mismatch = selected_account_network != request_network;

                    view! {
                        <div class="flex flex-col items-center gap-6 max-w-md w-full">
                            <div class="flex flex-col items-center gap-4 w-full">
                                <h2 class="text-xl font-bold text-white text-center">
                                    "Connect as"
                                </h2>
                                <button
                                    class="cursor-pointer w-full px-6 py-4 bg-neutral-800/70 backdrop-blur-sm rounded-xl border border-neutral-700/50 hover:bg-neutral-700/70 transition-all duration-200 shadow-lg flex items-center justify-between gap-3"
                                    on:click=move |_| set_expanded(true)
                                >
                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                        <div class="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                                            <Icon
                                                icon=icondata::LuUser
                                                width="20"
                                                height="20"
                                                attr:class="text-blue-400"
                                            />
                                        </div>
                                        <div class="flex flex-col items-start min-w-0 flex-1">
                                            <span class="text-neutral-400 text-sm">
                                                "Selected Account"
                                            </span>
                                            <div class="text-white text-lg font-medium wrap-anywhere">
                                                {move || format_account_id(&selected_account_id)}
                                            </div>
                                        </div>
                                    </div>
                                    <Icon
                                        icon=icondata::LuChevronDown
                                        width="20"
                                        height="20"
                                        attr:class="text-neutral-400"
                                    />
                                </button>
                            </div>
                            <div class="flex flex-col gap-4 w-full">
                                <div class="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 shadow-lg">
                                    <div class="flex items-center gap-3 pb-4 mb-4 border-b border-neutral-700/50">
                                        <div class="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center">
                                            <span class="text-neutral-300 text-lg">{"🔒"}</span>
                                        </div>
                                        <div>
                                            <p class="text-neutral-400 text-sm">"Connecting to"</p>
                                            <p class="text-white font-medium wrap-anywhere">
                                                {move || {
                                                    let actual_origin = actual_origin()
                                                        .expect("No actual origin");
                                                    let domain = actual_origin
                                                        .trim_start_matches("http://")
                                                        .trim_start_matches("https://")
                                                        .split("/")
                                                        .next()
                                                        .unwrap()
                                                        .split(":")
                                                        .next()
                                                        .unwrap();
                                                    if domain == "localhost" || domain == "127.0.0.1"
                                                        || domain.starts_with("192.168.")
                                                        || domain.ends_with(".local")
                                                        || domain.ends_with(".localhost")
                                                    {
                                                        "🛠 Localhost".to_string()
                                                    } else {
                                                        format!("🔒 {}", actual_origin)
                                                    }
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                    <p class="text-neutral-300 text-sm font-medium mb-2">
                                        "This app will be able to:"
                                    </p>
                                    <ul class="space-y-2">
                                        <li class="flex items-center gap-2 text-sm">
                                            <div class="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <span class="text-blue-400 text-xs">{"👤"}</span>
                                            </div>
                                            <span class="text-neutral-300">
                                                "View your account name"
                                            </span>
                                        </li>
                                        <li class="flex items-center gap-2 text-sm">
                                            <div class="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <span class="text-blue-400 text-xs">{"💰"}</span>
                                            </div>
                                            <span class="text-neutral-300">
                                                "View your account balance"
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                {move || {
                                    let request = request_data().expect("No request data");
                                    match request.contract_id.as_deref() {
                                        None | Some("") => ().into_any(),
                                        Some(contract_id) => {
                                            let method_names = request.method_names.unwrap_or_default();
                                            let label = if method_names.is_empty() {
                                                format!("Allow calling {contract_id} without confirmation")
                                            } else {
                                                format!(
                                                    "Allow calling {} on {} without confirmation",
                                                    method_names.join(", "),
                                                    contract_id,
                                                )
                                            };

                                            view! {
                                                <div class="p-4 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 shadow-lg">
                                                    <div class="flex flex-col gap-3">
                                                        <label class="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                class="w-4 h-4"
                                                                prop:checked=add_function_call_key
                                                                on:change=move |ev| {
                                                                    let checked = event_target_checked(&ev);
                                                                    set_add_function_call_key(checked);
                                                                    let current_origin = actual_origin.get_untracked()
                                                                        .expect("No actual origin");
                                                                    set_config
                                                                        .update(|cfg| {
                                                                            cfg.autoconfirm_preference_by_origin
                                                                                .insert(current_origin, checked);
                                                                        });
                                                                }
                                                            />
                                                            <span class="text-neutral-300 text-sm wrap-anywhere">
                                                                {label}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }
                                }}
                                {move || {
                                    if network_mismatch {
                                        view! {
                                            <div class="p-4 bg-yellow-500/10 backdrop-blur-sm rounded-xl border border-yellow-500/50 shadow-lg">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 rounded-full flex items-center justify-center">
                                                        <span class="text-yellow-500 text-lg">{"⚠️"}</span>
                                                    </div>
                                                    <p class="text-yellow-500 text-sm">
                                                        "Network mismatch: The app is requesting to connect on "
                                                        <b class="text-yellow-400">{request_network.to_string()}</b>
                                                        " but your selected account is on "
                                                        <b class="text-yellow-400">
                                                            {selected_account_network.to_string()}
                                                        </b> ". Please select a different account."
                                                    </p>
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
                                    class="cursor-pointer w-full px-6 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                                    on:click=handle_connect
                                    disabled=network_mismatch
                                >
                                    "Connect"
                                </button>
                                <button
                                    class="cursor-pointer w-full px-6 py-3.5 bg-neutral-800 text-white font-medium rounded-xl hover:bg-neutral-700 transition-all duration-200 shadow-lg shadow-black/20"
                                    on:click=handle_cancel
                                >
                                    "Cancel"
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
    }.into_any()
}
