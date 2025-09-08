use base64::{prelude::BASE64_STANDARD, Engine};
use borsh::BorshSerialize;
use leptos::{prelude::*, task::spawn_local};
use near_min_api::types::{
    near_crypto::{PublicKey, Signature},
    AccountId, CryptoHash,
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsCast;
use web_sys::{js_sys::Date, Window};

use crate::{
    contexts::{
        accounts_context::{AccountsContext, LedgerSigningState},
        connected_apps_context::ConnectedAppsContext,
        security_log_context::add_security_log,
    },
    utils::{sign_nep413, NEP413Payload},
};
use crate::{pages::connect::submit_tauri_response, utils::is_debug_enabled};
use leptos_icons::*;

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
    SignMessage {
        data: SignMessageRequest,
    },
    #[serde(rename_all = "camelCase")]
    TauriWalletSession {
        session_id: String,
    },
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
    recipient: String,
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
fn MessageDisplay(message: Signal<Option<MessageToSign>>) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let (format_message, set_format_message) = signal(false);
    let (message_copied, set_message_copied) = signal(false);
    let (recipient_copied, set_recipient_copied) = signal(false);
    let (nonce_copied, set_nonce_copied) = signal(false);
    let (cli_copied, set_cli_copied) = signal(false);

    let is_formattable_message = move || {
        let Some(deserialized) = message.get() else {
            return false;
        };
        serde_json::from_str::<serde_json::Value>(&deserialized.message).is_ok()
    };

    let formatted_message = move || {
        let Some(message) = message.get() else {
            return String::new();
        };

        if format_message.get() && is_formattable_message() {
            match serde_json::from_str::<serde_json::Value>(&message.message) {
                Ok(json) => serde_json::to_string_pretty(&json).unwrap_or(message.message),
                Err(_) => message.message,
            }
        } else {
            message.message
        }
    };

    let copy_message = move |_| {
        let Some(message) = message.get() else {
            return;
        };
        let window = web_sys::window().unwrap();
        let navigator = window.navigator();
        let _ = navigator.clipboard().write_text(&message.message);
        set_message_copied(true);
        set_timeout(
            move || set_message_copied(false),
            std::time::Duration::from_millis(2000),
        );
    };

    let copy_recipient = move |_| {
        let Some(deserialized) = message.get() else {
            return;
        };
        let window = web_sys::window().unwrap();
        let navigator = window.navigator();
        let _ = navigator.clipboard().write_text(&deserialized.recipient);
        set_recipient_copied(true);
        set_timeout(
            move || set_recipient_copied(false),
            std::time::Duration::from_millis(2000),
        );
    };

    let copy_nonce = move |_| {
        let Some(deserialized) = message.get() else {
            return;
        };
        let nonce_hex = deserialized
            .nonce
            .iter()
            .map(|b| format!("{b:02x}"))
            .collect::<String>();
        let window = web_sys::window().unwrap();
        let navigator = window.navigator();
        let _ = navigator.clipboard().write_text(&nonce_hex);
        set_nonce_copied(true);
        set_timeout(
            move || set_nonce_copied(false),
            std::time::Duration::from_millis(2000),
        );
    };

    let copy_cli = move |_| {
        let Some(message) = message.get() else {
            return;
        };

        let nonce_base64 = BASE64_STANDARD.encode(&message.nonce);

        let current_account = accounts_context
            .accounts
            .get()
            .selected_account_id
            .map(|id| id.to_string())
            .expect("No selected account");

        let command_parts = vec![
            "near".to_string(),
            "message".to_string(),
            "sign-nep413".to_string(),
            "utf8".to_string(),
            message.message,
            "nonce".to_string(),
            nonce_base64,
            "recipient".to_string(),
            message.recipient,
            "sign-as".to_string(),
            current_account,
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
    view! {
        <div>
            <div class="flex items-center justify-between mb-2">
                <p class="text-neutral-300 text-sm font-medium">"Asks you to sign the message:"</p>
                <div class="flex gap-2">
                    <button
                        class="text-xs text-blue-400 hover:text-blue-300 transition-colors p-2 bg-neutral-800 rounded flex items-center justify-center"
                        on:click=copy_message
                        title="Copy message"
                    >
                        {move || {
                            if message_copied.get() {
                                view! {
                                    <Icon
                                        icon=icondata::LuCheck
                                        width="14"
                                        height="14"
                                        attr:class="text-green-400"
                                    />
                                }
                                    .into_any()
                            } else {
                                view! { <Icon icon=icondata::LuClipboard width="14" height="14" /> }
                                    .into_any()
                            }
                        }}
                    </button>
                    <Show when=move || is_formattable_message()>
                        <button
                            class=move || {
                                if format_message.get() {
                                    "text-xs text-blue-600 hover:text-blue-500 transition-colors p-2 bg-blue-900/30 rounded flex items-center justify-center"
                                } else {
                                    "text-xs text-blue-400 hover:text-blue-300 transition-colors p-2 bg-neutral-800 rounded flex items-center justify-center"
                                }
                            }
                            on:click=move |_| {
                                set_format_message(!format_message.get());
                            }
                            title=move || {
                                if format_message.get() {
                                    "Show raw message"
                                } else {
                                    "Format the message"
                                }
                            }
                        >
                            {move || {
                                if format_message.get() {
                                    view! {
                                        <Icon icon=icondata::LuFileText width="14" height="14" />
                                    }
                                        .into_any()
                                } else {
                                    view! { <Icon icon=icondata::LuCode width="14" height="14" /> }
                                        .into_any()
                                }
                            }}
                        </button>
                    </Show>
                </div>
            </div>
            <div class="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <p class=move || {
                    if format_message.get() && is_formattable_message() {
                        "text-neutral-400 text-sm font-mono whitespace-pre-wrap"
                    } else {
                        "text-neutral-400 text-sm wrap-anywhere"
                    }
                }>{move || formatted_message()}</p>
            </div>

            <div class="p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/50 mt-3">
                <div class="flex flex-col gap-2 text-xs">
                    <div class="flex justify-between items-center">
                        <span class="text-neutral-500">"Sign For:"</span>
                        <div class="flex items-center gap-2">
                            <span class="text-neutral-300 font-mono wrap-anywhere">
                                {move || {
                                    message.get().map(|msg| msg.recipient).unwrap_or_default()
                                }}
                            </span>
                            <button
                                class="text-neutral-400 hover:text-neutral-300 transition-colors p-1 rounded"
                                on:click=copy_recipient
                                title="Copy recipient"
                            >
                                {move || {
                                    if recipient_copied.get() {
                                        view! {
                                            <Icon
                                                icon=icondata::LuCheck
                                                width="12"
                                                height="12"
                                                attr:class="text-green-400"
                                            />
                                        }
                                            .into_any()
                                    } else {
                                        view! {
                                            <Icon icon=icondata::LuClipboard width="12" height="12" />
                                        }
                                            .into_any()
                                    }
                                }}
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-neutral-500">"Nonce:"</span>
                        <div class="flex items-center gap-2">
                            <span class="text-neutral-300 font-mono wrap-anywhere max-w-30">
                                {move || {
                                    message
                                        .get()
                                        .map(|msg| {
                                            msg.nonce
                                                .iter()
                                                .map(|b| format!("{b:02x}"))
                                                .collect::<String>()
                                        })
                                        .unwrap_or_default()
                                }}
                            </span>
                            <button
                                class="text-neutral-400 hover:text-neutral-300 transition-colors p-1 rounded"
                                on:click=copy_nonce
                                title="Copy nonce"
                            >
                                {move || {
                                    if nonce_copied.get() {
                                        view! {
                                            <Icon
                                                icon=icondata::LuCheck
                                                width="12"
                                                height="12"
                                                attr:class="text-green-400"
                                            />
                                        }
                                            .into_any()
                                    } else {
                                        view! {
                                            <Icon icon=icondata::LuClipboard width="12" height="12" />
                                        }
                                            .into_any()
                                    }
                                }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-3 flex justify-end">
                <button
                    class="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-neutral-800 rounded flex items-center gap-2"
                    on:click=copy_cli
                    title="Copy NEAR CLI command"
                >
                    {move || {
                        if cli_copied.get() {
                            view! {
                                <Icon
                                    icon=icondata::LuCheck
                                    width="14"
                                    height="14"
                                    attr:class="text-green-400"
                                />
                            }
                                .into_any()
                        } else {
                            view! { <Icon icon=icondata::LuTerminal width="14" height="14" /> }
                                .into_any()
                        }
                    }}
                    "Copy CLI"
                </button>
            </div>
        </div>
    }
}

#[component]
pub fn SignMessage() -> impl IntoView {
    let (loading, set_loading) = signal(true);
    let (request_data, set_request_data) = signal::<Option<SignMessageRequest>>(None);
    let (origin, set_origin) = signal::<String>("*".to_string());
    let (tauri_session_id, set_tauri_session_id) = signal::<Option<String>>(None);
    let ConnectedAppsContext { apps, .. } = expect_context::<ConnectedAppsContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let ledger_signing_state = accounts_context.ledger_signing_state;

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

    let post_to_opener = move |message: SendMessage, close_window: bool| {
        if let Some(session_id) = tauri_session_id.get_untracked() {
            spawn_local(submit_tauri_response(session_id, message, close_window));
        } else {
            let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
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

        if let Ok(message) = serde_wasm_bindgen::from_value::<ReceiveMessage>(event.data()) {
            if is_debug_enabled() {
                log::info!("Successfully parsed message: {:?}", message);
            }
            let process_sign_message = move |data: SignMessageRequest| {
                set_origin(event.origin());
                set_loading(false);
                set_request_data(Some(data));
            };
            match message {
                ReceiveMessage::SignMessage { data } => {
                    process_sign_message(data);
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
                                            log::info!("Bridge: Request data: {:?}", message);
                                            set_tauri_session_id(Some(session_id.clone()));
                                            match message {
                                                ReceiveMessage::SignMessage { data } => {
                                                    process_sign_message(data)
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
            if accounts_context.accounts.get().selected_account_id != Some(app.account_id.clone()) {
                accounts_context.set_accounts.update(|accounts| {
                    accounts.selected_account_id = Some(app.account_id);
                });
            }
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
        let Some(account) = accounts_context
            .accounts
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
            accounts_context,
        );
        let nep413_message = NEP413Payload {
            message: deserialized_message.message.clone(),
            nonce: deserialized_message.nonce,
            recipient: deserialized_message.recipient.clone(),
            callback_url: deserialized_message.callback_url.clone(),
        };
        spawn_local(async move {
            let Ok(signature) =
                sign_nep413(account.secret_key.clone(), nep413_message, accounts_context).await
            else {
                // button is still active
                return;
            };

            let message = SendMessage::Signed {
                signature: SignedMessage {
                    account_id: account.account_id.clone(),
                    public_key: account.secret_key.public_key(),
                    signature,
                    state: deserialized_message.state,
                },
            };
            post_to_opener(message, true);
        });
    };

    let handle_cancel = move |_| {
        let message = SendMessage::Error {
            message: "User rejected the signature".to_string(),
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
                                                        || domain.ends_with(".localhost")
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
                                    <MessageDisplay message=Signal::derive(deserialized_message) />
                                </div>

                                <Show when=move || {
                                    !matches!(ledger_signing_state.get(), LedgerSigningState::Idle)
                                }>
                                    {move || {
                                        match ledger_signing_state.get() {
                                            LedgerSigningState::Idle => ().into_any(),
                                            LedgerSigningState::WaitingForSignature { .. } => {
                                                view! {
                                                    <div class="text-white text-center flex flex-col items-center gap-2 mt-2 border-t border-neutral-700 pt-2">
                                                        <Icon icon=icondata::LuUsb width="24" height="24" />
                                                        <p class="text-sm font-bold">"Waiting for Ledger"</p>
                                                        <p class="text-xs">
                                                            "Please confirm the signature on your Ledger device."
                                                        </p>
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
                                                        <p class="text-xs max-w-xs break-words">{error.clone()}</p>
                                                        <div class="flex gap-4 mt-2">
                                                            <button
                                                                class="px-3 py-1 text-xs bg-neutral-700 rounded-md hover:bg-neutral-600 transition-colors cursor-pointer"
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
                                                                class="px-3 py-1 text-xs bg-red-800 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
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
