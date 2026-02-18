use std::collections::HashSet;

use base64::{Engine, prelude::BASE64_STANDARD};
use chrono::Utc;
use ed25519_dalek::SECRET_KEY_LENGTH;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::hooks::{use_location, use_navigate};
use near_min_api::types::{
    AccessKey, AccessKeyPermission, AccountId, Action, AddKeyAction, CryptoHash,
    FunctionCallPermission, NearToken,
    near_crypto::{ED25519SecretKey, KeyType, PublicKey, SecretKey, Signature},
};
use serde::{Deserialize, Deserializer, Serialize};
use wasm_bindgen::JsCast;
use web_sys::{Window, js_sys::Date};

use crate::utils::{
    NEP413Payload, format_account_id, is_debug_enabled, serialize_to_js_value, sign_nep413,
};
use crate::{
    contexts::account_selector_context::AccountSelectorContext,
    pages::{
        settings::LedgerSelector,
        sign_message::{MessageDisplay, MessageToSign, SignedMessage},
    },
    utils::tauri_invoke_no_args,
};
use crate::{
    contexts::config_context::{ConfigContext, WalletConfig},
    utils::is_tauri,
};
use crate::{
    contexts::{
        accounts_context::{AccountsContext, LedgerSigningState, SecretKeyHolder},
        connected_apps_context::{ConnectedApp, ConnectedAppsContext, ConnectorVersion},
        network_context::Network,
        security_log_context::add_security_log,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    pages::sign_message::{SignedMessageV1, SignedMessageV2},
};

const GAS_ALLOWANCE: NearToken = NearToken::from_millinear(1000); // 1 NEAR

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WalletSelectorAccount {
    account_id: AccountId,
    public_key: PublicKey,
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
#[allow(clippy::large_enum_variant)]
pub enum ReceiveMessage {
    SignIn { data: SignInRequest },
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
    version: ConnectorVersion,
    #[serde(default)]
    actual_origin: Option<String>,
    // Below: added in V3
    #[serde(default)]
    relayer_id: Option<String>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ConnectMessage {
    #[serde(default)]
    origin: Option<String>,
    #[serde(default)]
    message_to_sign: Option<String>,
}

#[derive(Debug, Clone)]
pub enum NetworkLowercase {
    Mainnet,
    Testnet,
    Local(String),
}

impl<'de> Deserialize<'de> for NetworkLowercase {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Ok(match s.to_lowercase().as_str() {
            "mainnet" => NetworkLowercase::Mainnet,
            "testnet" => NetworkLowercase::Testnet,
            _ => NetworkLowercase::Local(s),
        })
    }
}

impl Network {
    fn from_lowecase(network: NetworkLowercase, config: &WalletConfig) -> Result<Self, String> {
        Ok(match network {
            NetworkLowercase::Mainnet => Network::Mainnet,
            NetworkLowercase::Testnet => Network::Testnet,
            NetworkLowercase::Local(ref id) => config
                .custom_networks
                .iter()
                .find(|n| n.id == *id)
                .map(|n| Network::Localnet(Box::new(n.clone())))
                .ok_or_else(|| {
                    format!("Network '{id}' not found. If the app is deployed on a local network, you can add the network in Settings > Developer > Localnet, and the network ID must match.")
                })?,
        })
    }
}

#[derive(Serialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
#[allow(clippy::large_enum_variant)]
pub enum SendMessage {
    Ready,
    #[serde(rename_all = "camelCase")]
    Connected {
        #[serde(flatten)]
        accounts: ResponseAccounts,
        function_call_key_added: bool,
        logout_key: PublicKey,
        use_bridge: bool,
        wallet_url: String,
        signed_message: Option<SignedMessage>,
    },
    Error {
        message: String,
    },
}

#[derive(Serialize, Debug)]
#[serde(untagged)]
pub enum ResponseAccounts {
    V2AndBelow {
        accounts: Vec<WalletSelectorAccount>,
    },
    #[serde(rename_all = "camelCase")]
    V3 { account_id: AccountId },
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
        if is_tauri() {
            let _ = tauri_invoke_no_args("close_temporary_window");
        } else {
            let _ = window().close();
        }
    }
}

#[component]
pub fn Connect() -> impl IntoView {
    let (loading, set_loading) = signal(true);
    let (request_data, set_request_data) = signal::<Option<SignInRequest>>(None);
    let (origin_for_post_message, set_origin_for_post_message) = signal::<String>("*".to_string());
    let (actual_origin, set_actual_origin) = signal::<Option<String>>(None);
    let (add_function_call_key, set_add_function_call_key) = signal(false);
    let AccountSelectorContext { set_expanded, .. } = expect_context::<AccountSelectorContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let ledger_signing_state = accounts_context.ledger_signing_state;
    let ConnectedAppsContext { apps, set_apps } = expect_context::<ConnectedAppsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let (tauri_session_id, set_tauri_session_id) = signal::<Option<String>>(None);
    let (error, set_error) = signal::<Option<String>>(None);
    let navigate = use_navigate();

    Effect::new(move |_| {
        let Some(data) = &*request_data.read() else {
            return;
        };
        if matches!(data.version, ConnectorVersion::V3)
            && let Some(relayer_id) = &data.relayer_id
        {
            navigate(format!("#{relayer_id}").as_str(), Default::default());
        }
    });

    let process_sign_in = move |data: SignInRequest, evt_origin: String| {
        if matches!(data.version, ConnectorVersion::V1) {
            // In V1 the event origin is the dapp. In V2+ it's an iframe which can't
            // possibly navigate to a different location under normal circumstances,
            // so we can use "*"
            set_origin_for_post_message(evt_origin.clone());
            set_actual_origin(Some(evt_origin.clone()));
        } else {
            let Some(origin) = data.actual_origin.clone() else {
                set_error(Some(
                    "Protocol error: sign-in request is missing required in V2+ actual_origin field".to_string(),
                ));
                set_loading(false);
                return;
            };
            set_actual_origin(Some(origin));
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
                                    set_error(Some(
                                        "Failed to receive connection details: unexpected response format".to_string(),
                                    ));
                                    set_loading(false);
                                    return;
                                };
                                let message = match serde_json::from_str::<ReceiveMessage>(message)
                                {
                                    Ok(message) => message,
                                    Err(e) => {
                                        log::error!("Bridge: Failed to parse message: {e}");
                                        set_error(Some(format!(
                                            "Failed to parse the connection request from the app: {e}\nMessage: {message}"
                                        )));
                                        set_loading(false);
                                        return;
                                    }
                                };
                                log::info!("Bridge request data: {:?}", message);
                                set_tauri_session_id(Some(session_id.clone()));
                                match message {
                                    ReceiveMessage::SignIn { data } => {
                                        let origin = if matches!(data.version, ConnectorVersion::V1)
                                        {
                                            "".to_string()
                                        } else {
                                            data.actual_origin.clone().unwrap_or_default()
                                        };
                                        process_sign_in(data, origin);
                                    }
                                }
                            } else {
                                log::warn!("Bridge: No message field in response");
                                set_error(Some("No message field in response".to_string()));
                                set_loading(false);
                            }
                        }
                        Err(e) => {
                            log::error!("Bridge: Failed to parse response JSON: {e}");
                            set_error(Some(format!("Failed to parse bridge response JSON: {e}")));
                            set_loading(false);
                        }
                    }
                }
                Ok(response) => {
                    log::error!(
                        "Bridge: Bridge service responded with status {}",
                        response.status()
                    );
                    set_error(Some(format!(
                        "Bridge service returned an error (HTTP {})",
                        response.status()
                    )));
                    set_loading(false);
                }
                Err(e) => {
                    log::error!("Bridge: Failed to connect to bridge service: {e}");
                    set_error(Some(
                        "Failed to connect to the connection bridge service".to_string(),
                    ));
                    set_loading(false);
                }
            }
        });
    };

    // Check for session_id in URL query parameters (e.g. ?session_id=abc123)
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

    let message_to_sign = move || {
        let Some(request_data) = &*request_data.read() else {
            return None;
        };
        let Ok(connect_message) = serde_json::from_str::<ConnectMessage>(&request_data.message)
        else {
            return None;
        };
        if let Some(message_to_sign_str) = &connect_message.message_to_sign {
            serde_json::from_str::<MessageToSign>(message_to_sign_str).ok()
        } else {
            None
        }
    };

    let opener = || match window().opener() {
        Ok(opener) => {
            let opener = opener.unchecked_into::<Window>();
            if opener.is_truthy() { opener } else { window() }
        }
        _ => window(),
    };

    let is_public_key_valid = Memo::new(move |_| {
        match &*request_data.read() {
            Some(request_data) => {
                let Ok(message) = serde_json::from_str::<ConnectMessage>(&request_data.message)
                else {
                    return false;
                };

                // No origin check in V2+
                if matches!(request_data.version, ConnectorVersion::V1)
                    && *message.origin.as_ref().expect("No origin sent in V1")
                        != origin_for_post_message()
                    && *message.origin.as_ref().expect("No origin sent in V1") != "*"
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
            }
            _ => false,
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

        match serde_wasm_bindgen::from_value::<ReceiveMessage>(event.data()) {
            Ok(message) => {
                if is_debug_enabled() {
                    log::info!("Successfully parsed message: {:?}", message);
                }
                match message {
                    ReceiveMessage::SignIn { data } => {
                        process_sign_in(data, event.origin());
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

    let post_to_opener = move |message: SendMessage, close_window: bool| {
        if is_debug_enabled() {
            log::info!(
                "Posting message to opener: {:?}",
                serialize_to_js_value(&message)
            );
        }
        if let Some(session_id) = tauri_session_id.get_untracked() {
            spawn_local(submit_tauri_response(session_id, message, close_window));
        } else {
            let js_value = serialize_to_js_value(&message).unwrap();
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
        let Some(selected_account) = accounts_context
            .accounts
            .get_untracked()
            .accounts
            .into_iter()
            .find(|a| a.account_id == selected_account_id)
        else {
            log::error!("Selected account not found");
            return;
        };
        let user_public_key = selected_account.secret_key.public_key();

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
            let message_to_sign = message_to_sign();
            async move {
                let signed_message = if let Some(message_to_sign) = message_to_sign {
                    let nep413_message = NEP413Payload {
                        message: message_to_sign.message.clone(),
                        nonce: message_to_sign.nonce,
                        recipient: message_to_sign.recipient.clone(),
                        callback_url: message_to_sign.callback_url.clone(),
                    };

                    match sign_nep413(
                        selected_account_secret_key.clone(),
                        &nep413_message,
                        accounts_context,
                        move || config.get_untracked().ledger_mode,
                    )
                    .await
                    {
                        Ok(signature) => Some(match request_data.version {
                            ConnectorVersion::V1 | ConnectorVersion::V2 => {
                                SignedMessage::V2AndBelow(SignedMessageV1 {
                                    account_id: selected_account.clone(),
                                    public_key: selected_account_secret_key.public_key(),
                                    signature,
                                    state: message_to_sign.state.clone(),
                                })
                            }
                            ConnectorVersion::V3 => SignedMessage::V3(SignedMessageV2 {
                                account_id: selected_account.clone(),
                                public_key: selected_account_secret_key.public_key(),
                                signature_base64: match signature {
                                    Signature::ED25519(signature) => {
                                        BASE64_STANDARD.encode(signature.to_bytes())
                                    }
                                    Signature::SECP256K1(signature) => {
                                        BASE64_STANDARD.encode(<[u8; 65]>::from(signature))
                                    }
                                },
                                state: message_to_sign.state.clone(),
                            }),
                        }),
                        Err(_) => {
                            let message = SendMessage::Error {
                                message: "Failed to sign message".to_string(),
                            };
                            post_to_opener(message, true);
                            return;
                        }
                    }
                } else {
                    None
                };
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
                let signature = secret_key.sign(message.as_bytes());

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
                    NetworkLowercase::Mainnet => "mainnet".to_string(),
                    NetworkLowercase::Testnet => "testnet".to_string(),
                    NetworkLowercase::Local(network) => network,
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
                            None | Some("") => None,
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
                        requested_gas_allowance: if request_data
                            .contract_id
                            .as_ref()
                            .is_some_and(|v| !v.is_empty())
                        {
                            GAS_ALLOWANCE
                        } else {
                            NearToken::from_yoctonear(0)
                        },
                        origin: actual_origin
                            .get_untracked()
                            .expect("No actual origin")
                            .clone(),
                        connected_at: Utc::now(),
                        autoconfirm_contracts: HashSet::new(),
                        autoconfirm_non_financial: false,
                        autoconfirm_all: false,
                        logged_out_at: None,
                        logout_key: logout_key.clone(),
                        connector_version: request_data.version,
                    };
                    add_security_log(
                        format!("Connected to {app:?} on /connect"),
                        selected_account.clone(),
                        accounts_context,
                    );
                    apps.apps.push(app);
                });

                // Continue with function call key addition if needed
                if add_function_call_key
                    && let Some(contract_id) = request_data.contract_id
                    && !contract_id.is_empty()
                {
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
                        true,
                    );

                    add_transaction.update(|queue| queue.push(transaction));

                    match details_receiver.await {
                        Ok(details) => {
                            log::info!("Transaction details: {details:?}");
                            if details.is_ok_and(|d| d.final_execution_outcome.is_some()) {
                                let message = SendMessage::Connected {
                                    accounts: match request_data.version {
                                        ConnectorVersion::V1 | ConnectorVersion::V2 => {
                                            ResponseAccounts::V2AndBelow {
                                                accounts: vec![WalletSelectorAccount {
                                                    account_id: selected_account,
                                                    public_key: user_public_key,
                                                }],
                                            }
                                        }
                                        ConnectorVersion::V3 => ResponseAccounts::V3 {
                                            account_id: selected_account,
                                        },
                                    },
                                    function_call_key_added: true,
                                    logout_key: logout_key.public_key(),
                                    use_bridge: tauri_session_id.get_untracked().is_some(),
                                    wallet_url: if is_tauri() {
                                        "intear://".to_string()
                                    } else {
                                        location().origin().expect("No origin")
                                    },
                                    signed_message: signed_message.clone(),
                                };
                                post_to_opener(message, true);
                            } else {
                                let message = SendMessage::Error {
                                    message: "Failed to add function call key. Possibly, you don't have NEAR for gas?".to_string(),
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
                    let message = SendMessage::Connected {
                        accounts: match request_data.version {
                            ConnectorVersion::V1 | ConnectorVersion::V2 => {
                                ResponseAccounts::V2AndBelow {
                                    accounts: vec![WalletSelectorAccount {
                                        account_id: selected_account,
                                        public_key: user_public_key,
                                    }],
                                }
                            }
                            ConnectorVersion::V3 => ResponseAccounts::V3 {
                                account_id: selected_account,
                            },
                        },
                        function_call_key_added: false,
                        logout_key: logout_key.public_key(),
                        use_bridge: tauri_session_id.get_untracked().is_some(),
                        wallet_url: if is_tauri() {
                            "intear://".to_string()
                        } else {
                            location().origin().expect("No origin")
                        },
                        signed_message: signed_message.clone(),
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
                    if let Some(error_msg) = error.get() {
                        view! {
                            <div class="flex flex-col items-center gap-4 text-center max-w-sm">
                                <p class="text-red-400 text-lg font-semibold">"Connection Error"</p>
                                <p class="text-neutral-300 text-sm">{error_msg}</p>
                            </div>
                        }
                            .into_any()
                    } else {
                        view! {
                            <div class="flex flex-col items-center gap-4">
                                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                                <p class="text-white text-lg">"Receiving connection details..."</p>
                            </div>
                        }
                            .into_any()
                    }
                } else if let Some(selected_account_id) = accounts_context
                    .accounts
                    .get()
                    .selected_account_id
                {
                    let Some(selected_account_network) = accounts_context
                        .accounts
                        .get()
                        .accounts
                        .iter()
                        .find(|a| a.account_id == selected_account_id)
                        .map(|a| a.network.clone()) else {
                        log::error!("Selected account not found");
                        return ().into_any();
                    };
                    let Some(rd) = request_data() else {
                        return view! {
                            <p class="text-red-400 text-sm">"Error: connection data unavailable"</p>
                        }
                            .into_any();
                    };
                    let request_network = match Network::from_lowecase(
                        rd.network_id,
                        &config.read(),
                    ) {
                        Ok(n) => n,
                        Err(e) => {
                            return view! {
                                <div class="flex flex-col items-center gap-4 text-center max-w-sm">
                                    <p class="text-red-400 text-lg font-semibold">
                                        "Connection Error"
                                    </p>
                                    <p class="text-neutral-300 text-sm">{e}</p>
                                </div>
                            }
                                .into_any();
                        }
                    };
                    let network_mismatch = selected_account_network != request_network
                        && !matches!(selected_account_network, Network::Localnet(_));

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
                                                    let Some(actual_origin) = actual_origin() else {
                                                        return "WARNING: Unknown origin".to_string();
                                                    };
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
                                                        actual_origin.to_string()
                                                    }
                                                }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="space-y-4">
                                        <div>
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
                                            if message_to_sign().is_some() {
                                                view! {
                                                    <div class="border-t border-neutral-700/50 pt-4">
                                                        <div class="flex items-center gap-3 mb-4">
                                                            <div class="w-8 h-8 rounded-full bg-neutral-700/50 flex items-center justify-center">
                                                                <span class="text-neutral-300">{"📝"}</span>
                                                            </div>
                                                            <div>
                                                                <p class="text-neutral-300 text-sm font-medium">
                                                                    "Message"
                                                                </p>
                                                                <p class="text-neutral-400 text-xs">
                                                                    "This app also asks you to sign a message"
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <MessageDisplay message=Signal::derive(message_to_sign) />
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>
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
                                                                    let current_origin = actual_origin
                                                                        .get_untracked()
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
                                                        <b class="text-yellow-400">
                                                            {match &request_network {
                                                                Network::Mainnet => "mainnet".to_string(),
                                                                Network::Testnet => "testnet".to_string(),
                                                                Network::Localnet(network) => network.id.clone(),
                                                            }}
                                                        </b> " but your selected account is on "
                                                        <b class="text-yellow-400">
                                                            {match &selected_account_network {
                                                                Network::Mainnet => "mainnet".to_string(),
                                                                Network::Testnet => "testnet".to_string(),
                                                                Network::Localnet(network) => network.id.clone(),
                                                            }}
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
                            <Show
                                when=move || {
                                    !matches!(ledger_signing_state.get(), LedgerSigningState::Idle)
                                }
                                fallback=move || {
                                    view! {
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
                                    }
                                }
                            >
                                {move || {
                                    match ledger_signing_state.get() {
                                        LedgerSigningState::Idle => unreachable!(),
                                        LedgerSigningState::WaitingForSignature { id } => {
                                            view! {
                                                <div class="text-white text-center flex flex-col items-center gap-2 mt-2 border-t border-neutral-700 pt-2">
                                                    <Icon icon=icondata::LuUsb width="24" height="24" />
                                                    <p class="text-sm font-bold">"Waiting for Ledger"</p>
                                                    <p class="text-xs">
                                                        "Please confirm the signature on your Ledger device."
                                                    </p>
                                                    <button
                                                        class="p-2 text-sm bg-neutral-700 rounded-md hover:bg-neutral-600 transition-colors cursor-pointer grow w-full"
                                                        on:click=move |_| {
                                                            ledger_signing_state
                                                                .set(LedgerSigningState::WaitingForSignature {
                                                                    id,
                                                                });
                                                        }
                                                    >
                                                        "Retry"
                                                    </button>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                        LedgerSigningState::Error { id, error } => {
                                            view! {
                                                <div class="text-white text-center flex flex-col items-center gap-2 mt-2 border-t border-neutral-700 pt-2">
                                                    <Icon
                                                        icon=icondata::LuTriangleAlert
                                                        width="24"
                                                        height="24"
                                                        attr:class="text-red-500"
                                                    />
                                                    <p class="text-sm font-bold">"Ledger Error"</p>
                                                    <p class="text-xs max-w-xs break-words text-red-400">
                                                        {error.clone()}
                                                    </p>
                                                    <LedgerSelector on_change=Callback::new(move |_| {
                                                        ledger_signing_state
                                                            .set(LedgerSigningState::WaitingForSignature {
                                                                id,
                                                            });
                                                    }) />
                                                    <div class="flex gap-2 w-full justify-center">
                                                        <button
                                                            class="p-2 text-sm bg-neutral-700 rounded-md hover:bg-neutral-600 transition-colors cursor-pointer grow w-full"
                                                            on:click=move |_| {
                                                                ledger_signing_state
                                                                    .set(LedgerSigningState::WaitingForSignature {
                                                                        id,
                                                                    })
                                                            }
                                                        >
                                                            "Retry"
                                                        </button>
                                                        <button
                                                            class="p-2 text-sm bg-red-800 rounded-md hover:bg-red-700 transition-colors cursor-pointer grow w-full"
                                                            on:click=move |_| {
                                                                ledger_signing_state.set(LedgerSigningState::Idle)
                                                            }
                                                        >
                                                            "Cancel"
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }
                                }}
                            </Show>
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
