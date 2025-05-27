use borsh::BorshSerialize;
use leptos::prelude::*;
use near_min_api::types::{
    near_crypto::{PublicKey, Signature},
    AccountId, CryptoHash, NEP_413_SIGN_MESSAGE,
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsCast;
use web_sys::{js_sys::Date, Window};

use crate::contexts::{
    accounts_context::AccountsContext, connected_apps_context::ConnectedAppsContext,
    security_log_context::add_security_log,
};
use crate::utils::is_debug_enabled;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct SignMessageRequest {
    message: String,
    account_id: AccountId,
    public_key: PublicKey,
    nonce: u64,
    signature: Signature,
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
enum ReceiveMessage {
    SignMessage { data: SignMessageRequest },
}

#[derive(Serialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
enum SendMessage {
    Ready,
    Signed { signature: SignedMessage },
    Error { message: String },
}

#[derive(Deserialize, Debug, Clone, BorshSerialize)]
#[serde(rename_all = "camelCase")]
struct MessageToSign {
    message: String,
    nonce: [u8; 32],
    recipient: AccountId,
    callback_url: Option<String>,
    #[borsh(skip)]
    state: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct SignedMessage {
    account_id: AccountId,
    public_key: PublicKey,
    signature: Signature,
    #[serde(skip_serializing_if = "Option::is_none")]
    state: Option<String>,
}

#[component]
pub fn SignMessage() -> impl IntoView {
    let (loading, set_loading) = signal(true);
    let (request_data, set_request_data) = signal::<Option<SignMessageRequest>>(None);
    let (origin, set_origin) = signal::<String>("*".to_string());
    let ConnectedAppsContext { apps, .. } = expect_context::<ConnectedAppsContext>();
    let AccountsContext {
        set_accounts,
        accounts,
        ..
    } = expect_context::<AccountsContext>();

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
                ReceiveMessage::SignMessage { data } => {
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
            let text_to_prove = format!("{}|{}", request_data.nonce, request_data.message);
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
            set_accounts.update(|accounts| accounts.selected_account_id = Some(app.account_id));
        }
    });

    let deserialized_message = move || {
        let Some(request_data) = &*request_data.read() else {
            return None;
        };
        serde_json::from_str::<MessageToSign>(&request_data.message).ok()
    };

    let handle_verify = move |_| {
        let Some(request_data) = &*request_data.read() else {
            log::error!("No request data found");
            return;
        };
        let Some(deserialized_message) = deserialized_message() else {
            log::error!("Failed to deserialize signature request");
            return;
        };
        let mut bytes = ((1u32 << 31u32) + NEP_413_SIGN_MESSAGE)
            .to_le_bytes()
            .to_vec();
        borsh::to_writer(&mut bytes, &deserialized_message).unwrap();
        let hash = CryptoHash::hash_bytes(&bytes);
        let Some(account) = accounts
            .read()
            .accounts
            .iter()
            .find(|account| account.account_id == request_data.account_id)
            .cloned()
        else {
            log::error!("Account not found");
            return;
        };
        add_security_log(
            format!(
                "Signed NEP-413 message on /sign-message from {}: {}",
                origin.get_untracked(),
                if request_data.message.len() > 5000 {
                    format!("{}...", &request_data.message[..5000])
                } else {
                    request_data.message.clone()
                }
            ),
            account.account_id.clone(),
        );
        let signature = account.secret_key.sign(hash.as_bytes());

        let message = SendMessage::Signed {
            signature: SignedMessage {
                account_id: account.account_id.clone(),
                public_key: account.secret_key.public_key(),
                signature,
                state: deserialized_message.state,
            },
        };
        let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
        opener()
            .post_message(&js_value, &origin())
            .expect("Failed to send message");
    };

    let handle_cancel = move |_| {
        let message = SendMessage::Error {
            message: "User rejected the signature".to_string(),
        };
        let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
        opener()
            .post_message(&js_value, &origin())
            .expect("Failed to send message");
    };

    view! {
        <div class="flex flex-col items-center justify-center min-h-[calc(80vh-100px)] p-4">
            {move || {
                if loading.get() {
                    view! {
                        <div class="flex flex-col items-center gap-4">
                            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                            <p class="text-white text-lg">"Receiving message to sign..."</p>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="flex flex-col items-center gap-6 max-w-md w-full">
                            <h2 class="text-2xl font-bold text-white mb-2 wrap-anywhere">
                                "Sign Message"
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
                                                    if domain == "localhost" || domain == "127.0.0.1"
                                                        || domain.starts_with("192.168.")
                                                        || domain.ends_with(".local")
                                                    {
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
                                    <p class="text-neutral-300 text-sm font-medium mb-2">
                                        "Asks you to sign the message to verify your identity:"
                                    </p>
                                    <div class="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                                        <p class="text-neutral-400 text-sm">
                                            {move || {
                                                deserialized_message()
                                                    .map(|s| s.message)
                                                    .unwrap_or_default()
                                            }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-3 w-full mt-2">
                                <button
                                    class="w-full px-6 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer"
                                    on:click=handle_verify
                                >
                                    "Verify"
                                </button>
                                <button
                                    class="w-full px-6 py-3.5 bg-neutral-800 text-white font-medium rounded-xl hover:bg-neutral-700 transition-all duration-200 shadow-lg shadow-black/20 cursor-pointer"
                                    on:click=handle_cancel
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
