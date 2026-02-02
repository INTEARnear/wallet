use core::fmt;
use std::fmt::Display;
use std::future::Future;
use std::pin::Pin;
use std::sync::mpmc;
use std::time::Duration;

use aes_gcm::aead::{Aead, OsRng, rand_core::RngCore};
use aes_gcm::{Aes256Gcm, Key, KeyInit, Nonce};
use argon2::{Argon2, ParamsBuilder};
use base64::prelude::BASE64_STANDARD;
use base64::{Engine as _, engine::general_purpose};
use chrono::{DateTime, Utc};
use futures_timer::Delay;
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_use::{use_document, use_event_listener, use_window};
use near_min_api::types::CryptoHash;
use near_min_api::types::near_crypto::{KeyType, PublicKey, Signature};
use near_min_api::types::{
    AccountId,
    near_crypto::{ED25519SecretKey, SecretKey},
};
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen;
use wasm_bindgen::JsValue;
use wasm_bindgen::{JsCast, closure::Closure};
use wasm_bindgen_futures::JsFuture;
use web_sys::js_sys::Reflect;

use crate::contexts::config_context::LedgerMode;
use crate::contexts::security_log_context::reencrypt_security_logs;
use crate::pages::settings::{JsWalletRequest, JsWalletResponse};
use crate::utils::{is_debug_enabled, is_tauri, serialize_to_js_value, tauri_invoke_no_args};

use super::{
    config_context::ConfigContext, network_context::Network, security_log_context::add_security_log,
};

pub const ENCRYPTION_MEMORY_COST_KB: u32 = 65536; // 64MB
const ACCOUNTS_KEY: &str = "wallet_accounts";
const ENCRYPTED_ACCOUNTS_KEY: &str = "wallet_encrypted_accounts";
const PASSWORD_SERVICE_KEY: &str = "password_storage_service_data";

#[derive(Debug, Clone, Serialize, Deserialize)]
struct PasswordServiceData {
    id: String,
    encryption_key: Vec<u8>,
    invalidates_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct StoreRequest {
    data: String,
    expires_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct StoreResponse {
    id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct RetrieveResponse {
    data: String,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Account {
    pub account_id: AccountId,
    pub secret_key: SecretKeyHolder,
    pub seed_phrase: Option<String>,
    #[serde(default = "default_account_network")]
    pub network: Network,
    #[serde(default = "default_true")]
    pub exported: bool,
}

fn default_true() -> bool {
    true
}

#[derive(Clone, Debug, PartialEq)]
pub enum LedgerSigningState {
    Idle,
    WaitingForSignature { id: u32 },
    Error { id: u32, error: String },
}

pub fn format_ledger_error(error: &serde_json::Value) -> String {
    match error {
        serde_json::Value::String(s) if s == "TransportOpenUserCancelled" => {
            "You cancelled the connection".to_string()
        }
        serde_json::Value::Number(n) if n.as_u64() == Some(0x6e01) => {
            "Are you in the NEAR app on your Ledger?".to_string()
        }
        serde_json::Value::Number(n) if n.as_u64() == Some(0x6985) => {
            "You denied the action in your Ledger".to_string()
        }
        serde_json::Value::Number(n) if n.as_u64() == Some(0x5515) => {
            "Your Ledger is locked".to_string()
        }
        serde_json::Value::String(s) if s == "DisconnectedDeviceDuringOperation" => {
            "Your Ledger was disconnected during the operation".to_string()
        }
        serde_json::Value::String(s) if s == "InvalidStateError" => {
            "Please refresh the or reconnect the Ledger device.".to_string()
        }
        serde_json::Value::String(s) if s == "LedgerDisabled" => {
            "Please choose the Ledger device.".to_string()
        }
        serde_json::Value::String(s) if s == "WebBLENotSupported" => {
            "Bluetooth is not supported in this browser.".to_string()
        }
        serde_json::Value::String(s) if s == "WebBLENotSupportedIOS" => {
            "Bluetooth is not supported on iOS devices. Please wait for our iOS app to be released in February 2026. Hint: You can always connect or disconnect Ledger from your account later, without having to create a new account.".to_string()
        }
        serde_json::Value::String(s) if s == "WebBLENotSupportedFirefox" => {
            "Bluetooth is not supported in Firefox. Please switch to a Chrome-based browser to use Bluetooth with your Ledger, or wait for our app to be released in February 2026. Hint: You can always connect or disconnect Ledger from your account later, without having to create a new account.".to_string()
        }
        serde_json::Value::String(s) if s == "WebBLENotSupportedSafari" => {
            "Bluetooth is not supported in Safari. Please switch to a Chrome-based browser to use Bluetooth with your Ledger, or wait for our app to be released in February 2026. Hint: You can always connect or disconnect Ledger from your account later, without having to create a new account.".to_string()
        }
        serde_json::Value::String(s) if s == "WebUSBNotSupported" => {
            "USB is not supported in this browser.".to_string()
        }
        serde_json::Value::String(s) if s == "WebUSBNotSupportedIOS" => {
            "USB is not supported on iOS devices. Please wait for our iOS app to be released in February 2026. Hint: You can always connect or disconnect Ledger from your account later, without having to create a new account.".to_string()
        }
        serde_json::Value::String(s) if s == "WebUSBNotSupportedFirefox" => {
            "USB is not supported in Firefox. Please switch to a Chrome-based browser to use USB with your Ledger, or wait for our app to be released in February 2026. Hint: You can always connect or disconnect Ledger from your account later, without having to create a new account.".to_string()
        }
        serde_json::Value::String(s) if s == "WebUSBNotSupportedSafari" => {
            "USB is not supported in Safari. Please switch to a Chrome-based browser to use USB with your Ledger, or wait for our app to be released in February 2026. Hint: You can always connect or disconnect Ledger from your account later, without having to create a new account.".to_string()
        }
        serde_json::Value::String(s) if s == "TransportRaceCondition" => {
            "Please make sure your Ledger is currently not already signing another request. It should be saying 'Near app is ready'".to_string()
        }
        serde_json::Value::String(s) if s == "NotSupportedError" => {
            "Something went wrong. Please try again, or refresh the page.".to_string()
        }
        _ => format!("Error: {}", error),
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum SecretKeyHolder {
    SecretKey(SecretKey),
    Ledger { path: String, public_key: PublicKey },
}

pub struct UserCancelledSigning;

impl SecretKeyHolder {
    pub fn public_key(&self) -> PublicKey {
        match self {
            SecretKeyHolder::SecretKey(secret_key) => secret_key.public_key(),
            SecretKeyHolder::Ledger { public_key, .. } => public_key.clone(),
        }
    }

    pub async fn hash_and_sign(
        &self,
        message: &[u8],
        context: AccountsContext,
        ledger_mode: impl Fn() -> LedgerMode,
    ) -> Result<Signature, UserCancelledSigning> {
        match self {
            SecretKeyHolder::SecretKey(secret_key) => {
                Ok(secret_key.sign(CryptoHash::hash_bytes(message).as_bytes()))
            }
            SecretKeyHolder::Ledger {
                path,
                public_key: _,
            } => {
                let id = OsRng.next_u32();
                'retry_loop: loop {
                    let request = JsWalletRequest::LedgerSign {
                        path: path.clone(),
                        message_to_sign: message.to_vec(),
                        id,
                        mode: ledger_mode(),
                    };
                    let js_value = serialize_to_js_value(&request).unwrap();
                    let origin = window()
                        .location()
                        .origin()
                        .unwrap_or_else(|_| "*".to_string());
                    let _ = window().post_message(&js_value, &origin);
                    context
                        .ledger_signing_state
                        .set(LedgerSigningState::WaitingForSignature { id });
                    let rx = context.ledger_sign_rx.get_untracked();
                    'receive_loop: loop {
                        match rx.try_recv() {
                            Ok(response) => match response {
                                JsWalletResponse::LedgerSignature {
                                    id: resp_id,
                                    signature,
                                    ..
                                } if resp_id == id => {
                                    context.ledger_signing_state.set(LedgerSigningState::Idle);
                                    let sig = Signature::from_parts(KeyType::ED25519, &signature)
                                        .map_err(|_| UserCancelledSigning)?;
                                    return Ok(sig);
                                }
                                JsWalletResponse::LedgerSignError { error } => {
                                    context.ledger_signing_state.set(LedgerSigningState::Error {
                                        id,
                                        error: format_ledger_error(&error),
                                    });
                                    break 'receive_loop;
                                }
                                _ => {}
                            },
                            Err(mpmc::TryRecvError::Disconnected) => {
                                context.ledger_signing_state.set(LedgerSigningState::Idle);
                                return Err(UserCancelledSigning);
                            }
                            Err(mpmc::TryRecvError::Empty) => {
                                Delay::new(Duration::from_millis(100)).await;
                            }
                        }
                    }

                    // After an error, wait for user action (retry or cancel)
                    loop {
                        match context.ledger_signing_state.get_untracked() {
                            LedgerSigningState::Idle => {
                                return Err(UserCancelledSigning);
                            }
                            LedgerSigningState::WaitingForSignature { id: state_id }
                                if state_id == id =>
                            {
                                continue 'retry_loop;
                            }
                            _ => {
                                Delay::new(Duration::from_millis(100)).await;
                            }
                        }
                    }
                }
            }
        }
    }
}

impl Display for SecretKeyHolder {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SecretKeyHolder::SecretKey(secret_key) => write!(f, "SecretKey({secret_key})"),
            SecretKeyHolder::Ledger { path, public_key } => {
                write!(f, "Ledger(path: {path}, public_key: {public_key})")
            }
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AccountsState {
    pub accounts: Vec<Account>,
    pub selected_account_id: Option<AccountId>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct EncryptedAccountsData {
    /// Base64 encoded encrypted JSON
    pub encrypted_data: String,
    /// Base64 encoded salt
    pub salt: String,
    /// Argon2 rounds used
    pub rounds: u32,
    /// Base64 encoded AES-GCM nonce
    pub nonce: String,
}

fn default_account_network() -> Network {
    Network::Mainnet
}

pub enum PasswordAction {
    SetCipher {
        password: String,
        rounds: u32,
        salt: Vec<u8>,
        // for logging only
        accounts_context: AccountsContext,
    },
    ClearCipher,
}

#[derive(Clone, Copy)]
pub struct AccountsContext {
    pub accounts: ReadSignal<AccountsState>,
    pub set_accounts: WriteSignal<AccountsState>,
    pub set_password: Action<PasswordAction, Result<(), String>>,
    pub decrypt_accounts: Action<String, Result<(), String>>,
    pub is_encrypted: ReadSignal<bool>,
    pub ledger_sign_rx: RwSignal<mpmc::Receiver<JsWalletResponse>>,
    pub ledger_signing_state: RwSignal<LedgerSigningState>,
    pub cipher: ReadSignal<Option<Cipher>>,
    pub is_loading_cipher: ReadSignal<bool>,
}

fn get_local_storage() -> Option<web_sys::Storage> {
    window().local_storage().ok().flatten()
}

fn load_accounts() -> AccountsState {
    if has_encrypted_data() {
        return AccountsState {
            accounts: vec![],
            selected_account_id: None,
        };
    }

    get_local_storage()
        .and_then(|storage| storage.get_item(ACCOUNTS_KEY).ok())
        .flatten()
        .and_then(|json| serde_json::from_str(&json).ok())
        .unwrap_or_else(|| AccountsState {
            accounts: vec![],
            selected_account_id: None,
        })
}

async fn save_accounts(accounts: &AccountsState, cipher: Option<Cipher>) -> Result<(), String> {
    if has_encrypted_data() {
        if let Some(cipher) = cipher {
            save_encrypted_accounts(cipher, accounts.clone()).await?;
            return Ok(());
        } else {
            // Probably just not unlocked yet
            return Ok(());
        }
    }

    match get_local_storage() {
        Some(storage) => {
            if let Ok(json) = serde_json::to_string(accounts) {
                let _ = storage.set_item(ACCOUNTS_KEY, &json);
                Ok(())
            } else {
                Err("Failed to serialize accounts".to_string())
            }
        }
        _ => Err("localStorage not available".to_string()),
    }
}

async fn derive_cipher(password: String, rounds: u32, salt: &[u8]) -> Result<Cipher, String> {
    let params = ParamsBuilder::new()
        .m_cost(ENCRYPTION_MEMORY_COST_KB)
        .t_cost(rounds)
        .p_cost(1)
        .build()
        .map_err(|e| format!("Failed to build Argon2 params: {}", e))?;

    let argon2 = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);

    let mut key_bytes = [0u8; 32];
    argon2
        .hash_password_into(password.as_bytes(), salt, &mut key_bytes)
        .await
        .map_err(|e| format!("Failed to derive key: {}", e))?;
    let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);
    Ok(Cipher {
        cipher,
        salt: salt.to_vec(),
        rounds,
    })
}

#[derive(Clone)]
pub struct Cipher {
    /// The cipher used to encrypt the accounts
    pub cipher: Aes256Gcm,
    /// The salt used to derive the key
    pub salt: Vec<u8>,
    /// The number of rounds used to derive the key
    pub rounds: u32,
}

async fn save_encrypted_accounts(cipher: Cipher, accounts: AccountsState) -> Result<(), String> {
    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let accounts_json = serde_json::to_string(&accounts)
        .map_err(|e| format!("Failed to serialize accounts: {}", e))?;

    let encrypted_data = cipher
        .cipher
        .encrypt(nonce, accounts_json.as_bytes())
        .map_err(|e| format!("Failed to encrypt data: {}", e))?;

    let encrypted_data = if is_tauri() {
        let (tx, rx) = futures_channel::oneshot::channel();
        let nonce = *nonce;
        spawn_local(async move {
            let key_promise = tauri_invoke_no_args("get_os_encryption_key");
            let key_future = JsFuture::from(key_promise);
            let Ok(key_js) = key_future.await else {
                tx.send(Err("Failed to get key".to_string())).unwrap();
                return;
            };
            let Some(key_string) = key_js.as_string() else {
                tx.send(Err("Key is not a string".to_string())).unwrap();
                return;
            };
            let Ok(key_bytes) = BASE64_STANDARD.decode(&key_string) else {
                tx.send(Err("Failed to decode key".to_string())).unwrap();
                return;
            };
            let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
            let cipher = Aes256Gcm::new(key);
            let Ok(encrypted_data) = cipher.encrypt(&nonce, encrypted_data.as_ref()) else {
                tx.send(Err(
                    "Failed to encrypt data using OS key on client".to_string()
                ))
                .unwrap();
                return;
            };
            tx.send(Ok(encrypted_data)).unwrap();
        });
        rx.await.unwrap()?
    } else {
        encrypted_data
    };

    let encrypted_accounts = EncryptedAccountsData {
        encrypted_data: general_purpose::STANDARD.encode(&encrypted_data),
        salt: general_purpose::STANDARD.encode(cipher.salt),
        rounds: cipher.rounds,
        nonce: general_purpose::STANDARD.encode(nonce_bytes),
    };

    match get_local_storage() {
        Some(storage) => {
            let encrypted_json = serde_json::to_string(&encrypted_accounts)
                .map_err(|e| format!("Failed to serialize encrypted data: {}", e))?;
            storage
                .set_item(ENCRYPTED_ACCOUNTS_KEY, &encrypted_json)
                .map_err(|e| format!("Failed to save to localStorage: {:?}", e))?;
        }
        _ => {
            return Err("localStorage not available".to_string());
        }
    }

    Ok(())
}

fn has_encrypted_data() -> bool {
    get_local_storage()
        .and_then(|storage| storage.get_item(ENCRYPTED_ACCOUNTS_KEY).ok())
        .flatten()
        .and_then(|json| serde_json::from_str::<EncryptedAccountsData>(&json).ok())
        .is_some()
}

fn get_encrypted_accounts() -> Result<EncryptedAccountsData, String> {
    let encrypted_json = get_local_storage()
        .ok_or("localStorage not available".to_string())?
        .get_item(ENCRYPTED_ACCOUNTS_KEY)
        .map_err(|e| format!("Failed to read from localStorage: {:?}", e))?
        .ok_or("No encrypted data found".to_string())?;
    let encrypted_accounts: EncryptedAccountsData = serde_json::from_str(&encrypted_json)
        .map_err(|e| format!("Failed to parse encrypted data: {}", e))?;
    Ok(encrypted_accounts)
}

async fn try_decrypt_accounts(
    password: String,
) -> Result<(AccountsState, Cipher, [u8; 32]), String> {
    let encrypted_accounts = get_encrypted_accounts()?;
    let salt = general_purpose::STANDARD
        .decode(&encrypted_accounts.salt)
        .map_err(|e| format!("Failed to decode salt: {}", e))?;
    let nonce_bytes = general_purpose::STANDARD
        .decode(&encrypted_accounts.nonce)
        .map_err(|e| format!("Failed to decode nonce: {}", e))?;
    let encrypted_data = general_purpose::STANDARD
        .decode(&encrypted_accounts.encrypted_data)
        .map_err(|e| format!("Failed to decode encrypted data: {}", e))?;

    let nonce = Nonce::from_slice(&nonce_bytes);
    let encrypted_data = if is_tauri() {
        let (tx, rx) = futures_channel::oneshot::channel();
        let nonce = *nonce;
        spawn_local(async move {
            let key_promise = tauri_invoke_no_args("get_os_encryption_key");
            let key_future = JsFuture::from(key_promise);
            let Ok(key_js) = key_future.await else {
                tx.send(Err("Failed to get key".to_string())).unwrap();
                return;
            };
            let Some(key_string) = key_js.as_string() else {
                tx.send(Err("Key is not a string".to_string())).unwrap();
                return;
            };
            let Ok(key_bytes) = BASE64_STANDARD.decode(&key_string) else {
                tx.send(Err("Failed to decode key".to_string())).unwrap();
                return;
            };
            let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
            let cipher = Aes256Gcm::new(key);
            let decrypted_data = match cipher.decrypt(&nonce, encrypted_data.as_ref()) {
                Ok(decrypted_data) => decrypted_data,
                Err(e) => {
                    tx.send(Err(format!(
                        "Failed to decrypt data using OS key on client: {e:?}"
                    )))
                    .unwrap();
                    return;
                }
            };
            tx.send(Ok(decrypted_data)).unwrap();
        });
        rx.await.unwrap()?
    } else {
        encrypted_data
    };

    let params = ParamsBuilder::new()
        .m_cost(ENCRYPTION_MEMORY_COST_KB)
        .t_cost(encrypted_accounts.rounds)
        .p_cost(1)
        .build()
        .map_err(|e| format!("Failed to build Argon2 params: {}", e))?;
    let argon2 = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);
    let mut key_bytes = [0u8; 32];
    argon2
        .hash_password_into(password.as_bytes(), &salt, &mut key_bytes)
        .await
        .map_err(|e| format!("Failed to derive key: {}", e))?;

    let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);

    let decrypted_data = cipher
        .decrypt(nonce, encrypted_data.as_ref())
        .map_err(|_| "Incorrect password".to_string())?;
    let accounts_json = String::from_utf8(decrypted_data)
        .map_err(|e| format!("Failed to convert decrypted data to string: {}", e))?;
    let accounts: AccountsState = serde_json::from_str(&accounts_json)
        .map_err(|e| format!("Failed to parse decrypted accounts: {}", e))?;

    Ok((
        accounts,
        Cipher {
            cipher,
            salt,
            rounds: encrypted_accounts.rounds,
        },
        key_bytes,
    ))
}

async fn store_cipher_to_service(key_bytes: [u8; 32], duration_seconds: u64) -> Result<(), String> {
    // Generate random encryption key for this cipher
    let mut encryption_key = [0u8; 32];
    OsRng.fill_bytes(&mut encryption_key);

    let aes_key = Key::<Aes256Gcm>::from_slice(&encryption_key);
    let aes_cipher = Aes256Gcm::new(aes_key);

    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    // Encrypt the key bytes directly
    let encrypted_data = aes_cipher
        .encrypt(nonce, key_bytes.as_ref())
        .map_err(|e| format!("Failed to encrypt cipher: {}", e))?;

    // Combine nonce + encrypted data and encode as base64
    let mut combined_data = nonce_bytes.to_vec();
    combined_data.extend_from_slice(&encrypted_data);
    let encoded_data = general_purpose::STANDARD.encode(combined_data);

    // Calculate expiration time
    let expires_at = Utc::now() + chrono::Duration::seconds(duration_seconds as i64);

    let request = StoreRequest {
        data: encoded_data,
        expires_at,
    };

    // Make HTTP request to store
    let response = reqwest::Client::new()
        .post(format!(
            "{}/store",
            dotenvy_macro::dotenv!("SHARED_PASSWORD_STORAGE_SERVICE_ADDR")
        ))
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Server returned error: {}", response.status()));
    }

    let store_response: StoreResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    // Store service data in localStorage
    let service_data = PasswordServiceData {
        id: store_response.id,
        encryption_key: encryption_key.to_vec(),
        invalidates_at: expires_at,
    };

    if let Some(storage) = get_local_storage()
        && let Ok(json) = serde_json::to_string(&service_data)
    {
        let _ = storage.set_item(PASSWORD_SERVICE_KEY, &json);
    }

    Ok(())
}

async fn retrieve_cipher_from_service() -> Result<Option<Cipher>, String> {
    let password_storage_service_data = match get_local_storage() {
        Some(storage) => storage
            .get_item(PASSWORD_SERVICE_KEY)
            .ok()
            .flatten()
            .and_then(|json| serde_json::from_str::<PasswordServiceData>(&json).ok()),
        _ => None,
    };
    let Some(service_data) = password_storage_service_data else {
        return Ok(None);
    };

    // If locally we know it should be invalidated, bail out early instead
    // of waiting for a pointless request
    if service_data.invalidates_at <= Utc::now() {
        if let Some(storage) = get_local_storage() {
            let _ = storage.remove_item(PASSWORD_SERVICE_KEY);
        }
        return Ok(None);
    }

    let response = reqwest::Client::new()
        .get(format!(
            "{}/retrieve/{}",
            dotenvy_macro::dotenv!("SHARED_PASSWORD_STORAGE_SERVICE_ADDR"),
            service_data.id
        ))
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;
    if response.status().as_u16() == 404 {
        // Data expired or not found, remove the reference to the key
        if let Some(storage) = get_local_storage() {
            let _ = storage.remove_item(PASSWORD_SERVICE_KEY);
        }
        return Ok(None);
    }
    if !response.status().is_success() {
        return Err(format!("Server returned error: {}", response.status()));
    }
    let retrieve_response: RetrieveResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let stored_payload = general_purpose::STANDARD
        .decode(&retrieve_response.data)
        .map_err(|e| format!("Failed to decode data: {}", e))?;
    if stored_payload.len() < 12 {
        return Err("Invalid encrypted data".to_string());
    }
    let nonce_bytes = &stored_payload[0..12];
    let encrypted_data = &stored_payload[12..];

    let aes_key = Key::<Aes256Gcm>::from_slice(&service_data.encryption_key);
    let aes_cipher = Aes256Gcm::new(aes_key);
    let nonce = Nonce::from_slice(nonce_bytes);

    let decrypted_data = aes_cipher
        .decrypt(nonce, encrypted_data.as_ref())
        .map_err(|e| format!("Failed to decrypt cipher: {}", e))?;

    let encrypted_accounts =
        get_encrypted_accounts().map_err(|e| format!("Failed to get encrypted accounts: {}", e))?;
    let salt_for_derivation = general_purpose::STANDARD
        .decode(&encrypted_accounts.salt)
        .map_err(|e| format!("Failed to decode salt: {}", e))?;
    let rounds_for_derivation = encrypted_accounts.rounds;

    let key = Key::<Aes256Gcm>::from_slice(&decrypted_data);
    let cipher_obj = Aes256Gcm::new(key);

    let cipher = Cipher {
        cipher: cipher_obj,
        salt: salt_for_derivation,
        rounds: rounds_for_derivation,
    };

    Ok(Some(cipher))
}

pub fn provide_accounts_context() {
    let (accounts, set_accounts) = signal(load_accounts());
    let (cipher, set_cipher) = signal::<Option<Cipher>>(None);
    let config_context = expect_context::<ConfigContext>();
    let (password_timeout_handle, set_password_timeout_handle) = signal::<Option<i32>>(None);
    let (is_loading_cipher, set_is_loading_cipher) = signal(false);

    // Try to retrieve cipher from password storage service on page load if we have encrypted data but no cipher
    if has_encrypted_data() && cipher.get_untracked().is_none() {
        spawn_local(async move {
            set_is_loading_cipher(true);
            if let Ok(Some(retrieved_cipher)) = retrieve_cipher_from_service().await
                && let Ok(encrypted_accounts) = get_encrypted_accounts()
            {
                let encrypted_data =
                    match general_purpose::STANDARD.decode(&encrypted_accounts.encrypted_data) {
                        Ok(data) => data,
                        Err(_) => {
                            set_is_loading_cipher(false);
                            return;
                        }
                    };
                let nonce_bytes = match general_purpose::STANDARD.decode(&encrypted_accounts.nonce)
                {
                    Ok(data) => data,
                    Err(_) => {
                        set_is_loading_cipher(false);
                        return;
                    }
                };

                let nonce = Nonce::from_slice(&nonce_bytes);
                let encrypted_data = if is_tauri() {
                    let (tx, rx) = futures_channel::oneshot::channel();
                    let nonce = *nonce;
                    spawn_local(async move {
                        let key_promise = tauri_invoke_no_args("get_os_encryption_key");
                        let key_future = JsFuture::from(key_promise);
                        let Ok(key_js) = key_future.await else {
                            tx.send(Err("Failed to get key".to_string())).unwrap();
                            return;
                        };
                        let Some(key_string) = key_js.as_string() else {
                            tx.send(Err("Key is not a string".to_string())).unwrap();
                            return;
                        };
                        let Ok(key_bytes) = BASE64_STANDARD.decode(&key_string) else {
                            tx.send(Err("Failed to decode key".to_string())).unwrap();
                            return;
                        };
                        let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
                        let cipher = Aes256Gcm::new(key);
                        let Ok(decrypted_data) = cipher.decrypt(&nonce, encrypted_data.as_ref())
                        else {
                            tx.send(Err(
                                "Failed to decrypt data using OS key on client".to_string()
                            ))
                            .unwrap();
                            return;
                        };
                        tx.send(Ok(decrypted_data)).unwrap();
                    });
                    match rx.await.unwrap() {
                        Ok(decrypted_data) => decrypted_data,
                        Err(e) => {
                            log::error!("Failed to decrypt data using OS key on client: {}", e);
                            return;
                        }
                    }
                } else {
                    encrypted_data
                };

                if let Ok(decrypted_data) = retrieved_cipher
                    .cipher
                    .decrypt(nonce, encrypted_data.as_ref())
                    && let Ok(accounts_json) = String::from_utf8(decrypted_data)
                    && let Ok(decrypted_accounts) =
                        serde_json::from_str::<AccountsState>(&accounts_json)
                {
                    set_cipher(Some(retrieved_cipher));
                    set_accounts(decrypted_accounts);
                    web_sys::console::log_1(&"Loaded accounts from stored cipher".into());
                }
            }
            set_is_loading_cipher(false);
        });
    }

    let clear_password = move || {
        set_cipher(None);
        set_accounts(AccountsState {
            accounts: vec![],
            selected_account_id: None,
        });
        set_password_timeout_handle(None);
        if let Some(storage) = get_local_storage() {
            let _ = storage.remove_item(PASSWORD_SERVICE_KEY);
        }
    };

    let reset_password_timeout = move || {
        if let Some(handle) = password_timeout_handle.get_untracked() {
            window().clear_timeout_with_handle(handle);
        }

        // Only set timeout if we have encrypted data and a cipher (wallet is unlocked)
        if has_encrypted_data() && cipher.get_untracked().is_some() {
            let duration = config_context
                .config
                .get_untracked()
                .password_remember_duration;
            if let Some(seconds) = duration.to_seconds() {
                let callback = Closure::wrap(Box::new(clear_password) as Box<dyn FnMut()>);

                let handle = window()
                    .set_timeout_with_callback_and_timeout_and_arguments_0(
                        callback.as_ref().unchecked_ref(),
                        (seconds * 1000) as i32,
                    )
                    .unwrap_or(-1);

                // Prevent drop until timeout fires
                callback.forget();
                set_password_timeout_handle(Some(handle));
            }
        }
    };

    Effect::new(move || {
        if has_encrypted_data() && cipher.get().is_some() {
            reset_password_timeout();

            on_cleanup(move || {
                if let Some(handle) = password_timeout_handle.get_untracked() {
                    window().clear_timeout_with_handle(handle);
                }
            });
        }
    });

    macro_rules! setup_event_listeners {
        ($($event:ident),*) => {
            $(
                let _ = use_event_listener(use_document(), leptos::ev::$event, move |_| {
                    if has_encrypted_data() && cipher.get_untracked().is_some() {
                        reset_password_timeout();
                    }
                });
            )*
        };
    }

    setup_event_listeners!(mousedown, mousemove, keypress, scroll, touchstart, click);

    // Reset timeout when cipher changes (wallet gets unlocked)
    Effect::new(move || {
        cipher.track();
        reset_password_timeout();
    });

    let save_accounts = Action::new(move |args: &(Option<Cipher>, AccountsState)| {
        let cipher = args.0.clone();
        let accounts = args.1.clone();
        async move { save_accounts(&accounts, cipher).await }
    });

    // Save to localStorage whenever accounts change or cipher changes
    Effect::new(move || {
        if has_encrypted_data() && cipher.get().is_none() {
            // Not unlocked the wallet yet, don't save anything
            return;
        }
        save_accounts.dispatch_local((cipher.get(), accounts.get()));
    });

    let selected_account_id_memo = Memo::new(move |_| accounts.get().selected_account_id.clone());

    let (is_encrypted, set_is_encrypted) = signal(has_encrypted_data());
    let config_context = expect_context::<ConfigContext>();

    let decrypt_accounts = Action::new(move |password: &String| {
        let password = password.clone();
        async move {
            let decrypted_accounts = try_decrypt_accounts(password).await;
            match decrypted_accounts {
                Ok((accounts, cipher, key_bytes)) => {
                    // Store cipher to password service if remember duration is set
                    let duration = config_context
                        .config
                        .get_untracked()
                        .password_remember_duration;
                    if let Some(seconds) = duration.to_seconds() {
                        spawn_local(async move {
                            if let Err(e) = store_cipher_to_service(key_bytes, seconds).await {
                                log::error!("Failed to store cipher to service: {}", e);
                            } else {
                                log::info!("Stored cipher to password storage service");
                            }
                        });
                    }

                    set_cipher(Some(cipher));
                    set_accounts(accounts);
                    Ok(())
                }
                Err(e) => Err(e),
            }
        }
    });

    let set_password = Action::new(move |args: &PasswordAction| {
        let current_accounts = accounts.get_untracked();
        match args {
            PasswordAction::SetCipher {
                password,
                rounds,
                salt,
                accounts_context,
            } => {
                if current_accounts.accounts.is_empty() {
                    // Protect from weird edge cases or when the user tries to use
                    // development tools to access the raw UI without decrypting accounts
                    // first, which could lead to losing data
                    return Box::pin(async move { Err("No accounts to encrypt".to_string()) })
                        as Pin<Box<dyn Future<Output = Result<(), String>> + Send>>;
                }
                let password = password.clone();
                let rounds = *rounds;
                let salt = salt.clone();
                let accounts_context = *accounts_context;
                // Capture the current (old) cipher before generating the new one. This is needed
                // so we can attempt to decrypt existing security logs that were encrypted with
                // the old password.
                let old_cipher_opt = cipher.get_untracked();
                Box::pin(async move {
                    let new_cipher = derive_cipher(password, rounds, &salt).await?;
                    for account in current_accounts.accounts.iter() {
                        add_security_log(
                            format!(
                                "Encrypted accounts with password. Private key for recovery: {}",
                                account.secret_key
                            ),
                            account.account_id.clone(),
                            accounts_context,
                        );
                    }
                    save_encrypted_accounts(new_cipher.clone(), current_accounts).await?;

                    let new_cipher_for_task = new_cipher.clone();
                    spawn_local(async move {
                        if let Err(e) =
                            reencrypt_security_logs(old_cipher_opt, new_cipher_for_task).await
                        {
                            log::error!(
                                "Failed to re-encrypt security logs after password change: {e}"
                            );
                        }
                    });

                    set_is_encrypted(true);
                    set_cipher(Some(new_cipher));
                    let _ = get_local_storage()
                        .and_then(|storage| storage.remove_item(ACCOUNTS_KEY).ok());
                    Ok(())
                }) as Pin<Box<dyn Future<Output = Result<(), String>> + Send>>
            }
            PasswordAction::ClearCipher => Box::pin(async move {
                set_is_encrypted(false);
                set_cipher(None);
                let _ = get_local_storage()
                    .and_then(|storage| storage.remove_item(ENCRYPTED_ACCOUNTS_KEY).ok());
                Ok(())
            }),
        }
    });

    if is_debug_enabled() {
        let view_as_closure = Closure::wrap(Box::new(move |id_val: JsValue| {
            let Some(id_str) = id_val.as_string() else {
                web_sys::console::error_1(&"view_as expects a string".into());
                return;
            };

            let Ok(account_id) = id_str.parse::<AccountId>() else {
                web_sys::console::error_1(&"Invalid account id".into());
                return;
            };

            let current_state = accounts.get_untracked();
            if current_state
                .accounts
                .iter()
                .any(|acc| acc.account_id == account_id)
            {
                return;
            }

            let zero_secret_key = SecretKey::ED25519(ED25519SecretKey([0u8; 64]));

            let mut new_state = current_state.clone();
            new_state.accounts.push(Account {
                account_id: account_id.clone(),
                secret_key: SecretKeyHolder::SecretKey(zero_secret_key),
                seed_phrase: None,
                network: Network::Mainnet,
                exported: false,
            });
            new_state.selected_account_id = Some(account_id);

            set_accounts(new_state);
        }) as Box<dyn FnMut(JsValue)>);

        let _ = Reflect::set(
            window().as_ref(),
            &wasm_bindgen::JsValue::from_str("view_as"),
            view_as_closure.as_ref().unchecked_ref(),
        );

        view_as_closure.forget();
    }

    let (ledger_sign_tx, ledger_sign_rx) = mpmc::channel();

    {
        let tx = ledger_sign_tx.clone();
        let origin = window().location().origin().unwrap_or_default();

        let _ = use_event_listener(
            use_window(),
            leptos::ev::message,
            move |msg_event: web_sys::MessageEvent| {
                if msg_event.origin() != origin {
                    return;
                }

                let data = msg_event.data();
                if let Ok(resp) = serde_wasm_bindgen::from_value::<JsWalletResponse>(data) {
                    tx.send(resp).expect("Expected to have at least one receiver not dropped, stored in AccountsContext");
                }
            },
        );
    }

    let accounts_context = AccountsContext {
        accounts,
        set_accounts,
        set_password,
        decrypt_accounts,
        is_encrypted,
        ledger_sign_rx: RwSignal::new(ledger_sign_rx),
        ledger_signing_state: RwSignal::new(LedgerSigningState::Idle),
        cipher,
        is_loading_cipher,
    };

    Effect::new(move || {
        if let Some(account_id) = selected_account_id_memo.get() {
            add_security_log(
                "Wallet opened".to_string(),
                account_id.clone(),
                accounts_context,
            );
        }
    });

    Effect::new(move || {
        accounts.track();
        set_accounts.maybe_update(|accounts| {
            if let Some(selected_account_id) = accounts.selected_account_id.as_ref()
                && accounts
                    .accounts
                    .iter()
                    .find(|a| a.account_id == *selected_account_id)
                    .is_none()
            {
                log::info!("Selected account not found, setting to first account");
                accounts.selected_account_id =
                    accounts.accounts.first().map(|a| a.account_id.clone());
                true
            } else {
                false
            }
        });
    });

    provide_context(accounts_context);
}
