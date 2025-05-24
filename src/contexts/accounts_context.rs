use std::future::Future;
use std::pin::Pin;

use aes_gcm::aead::{rand_core::RngCore, Aead, OsRng};
use aes_gcm::{Aes256Gcm, Key, KeyInit, Nonce};
use argon2::{Argon2, ParamsBuilder};
use base64::{engine::general_purpose, Engine as _};
use leptos::prelude::*;
use near_min_api::types::{near_crypto::SecretKey, AccountId};
use serde::{Deserialize, Serialize};
use web_sys::window;

use super::{network_context::Network, security_log_context::add_security_log};

pub const ENCRYPTION_MEMORY_COST_KB: u32 = 65536; // 64MB
const ACCOUNTS_KEY: &str = "wallet_accounts";
const ENCRYPTED_ACCOUNTS_KEY: &str = "wallet_encrypted_accounts";

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Account {
    pub account_id: AccountId,
    pub secret_key: SecretKey,
    pub seed_phrase: Option<String>,
    #[serde(
        skip_serializing_if = "is_mainnet",
        default = "default_account_network"
    )]
    pub network: Network,
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

fn is_mainnet(network: &Network) -> bool {
    matches!(network, Network::Mainnet)
}

fn default_account_network() -> Network {
    Network::Mainnet
}

pub enum PasswordAction {
    SetCipher {
        password: String,
        rounds: u32,
        salt: Vec<u8>,
    },
    ClearCipher,
}

#[derive(Clone)]
pub struct AccountsContext {
    pub accounts: ReadSignal<AccountsState>,
    pub set_accounts: WriteSignal<AccountsState>,
    pub set_password: Action<PasswordAction, Result<(), String>>,
    pub decrypt_accounts: Action<String, Result<(), String>>,
    pub is_encrypted: ReadSignal<bool>,
}

fn get_local_storage() -> Option<web_sys::Storage> {
    window().and_then(|w| w.local_storage().ok()).flatten()
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

    if let Some(storage) = get_local_storage() {
        if let Ok(json) = serde_json::to_string(accounts) {
            let _ = storage.set_item(ACCOUNTS_KEY, &json);
            Ok(())
        } else {
            Err("Failed to serialize accounts".to_string())
        }
    } else {
        Err("localStorage not available".to_string())
    }
}

async fn get_cipher(password: String, rounds: u32, salt: &[u8]) -> Result<Cipher, String> {
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
    pub cipher: Aes256Gcm,
    pub salt: Vec<u8>,
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

    let encrypted_accounts = EncryptedAccountsData {
        encrypted_data: general_purpose::STANDARD.encode(&encrypted_data),
        salt: general_purpose::STANDARD.encode(cipher.salt),
        rounds: cipher.rounds,
        nonce: general_purpose::STANDARD.encode(nonce_bytes),
    };

    if let Some(storage) = get_local_storage() {
        let encrypted_json = serde_json::to_string(&encrypted_accounts)
            .map_err(|e| format!("Failed to serialize encrypted data: {}", e))?;
        storage
            .set_item(ENCRYPTED_ACCOUNTS_KEY, &encrypted_json)
            .map_err(|e| format!("Failed to save to localStorage: {:?}", e))?;
    } else {
        return Err("localStorage not available".to_string());
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

async fn try_decrypt_accounts(password: String) -> Result<(AccountsState, Cipher), String> {
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
    let nonce = Nonce::from_slice(&nonce_bytes);

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
    ))
}

pub fn provide_accounts_context() {
    let (accounts, set_accounts) = signal(load_accounts());
    let (cipher, set_cipher) = signal::<Option<Cipher>>(None);

    let save_accounts = Action::new(move |args: &(Option<Cipher>, AccountsState)| {
        let cipher = args.0.clone();
        let accounts = args.1.clone();
        async move { save_accounts(&accounts, cipher).await }
    });

    // Save to localStorage whenever accounts change or cipher changes
    Effect::new(move || {
        save_accounts.dispatch_local((cipher.get(), accounts.get()));
    });

    let selected_account_id_memo = Memo::new(move |_| accounts.get().selected_account_id.clone());

    Effect::new(move || {
        if let Some(account_id) = selected_account_id_memo.get() {
            add_security_log("Wallet opened".to_string(), account_id.clone());
        }
    });

    let (is_encrypted, set_is_encrypted) = signal(has_encrypted_data());

    let decrypt_accounts = Action::new(move |password: &String| {
        let password = password.clone();
        async move {
            let decrypted_accounts = try_decrypt_accounts(password).await;
            match decrypted_accounts {
                Ok((accounts, cipher)) => {
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
            } => {
                let password = password.clone();
                let rounds = *rounds;
                let salt = salt.clone();
                Box::pin(async move {
                    let cipher = get_cipher(password, rounds, &salt).await?;
                    for account in current_accounts.accounts.iter() {
                        add_security_log(
                            format!(
                                "Encrypted accounts with password. Private key for recovery: {}",
                                account.secret_key
                            ),
                            account.account_id.clone(),
                        );
                    }
                    save_encrypted_accounts(cipher.clone(), current_accounts).await?;
                    set_is_encrypted(true);
                    set_cipher(Some(cipher));
                    let _ = get_local_storage()
                        .and_then(|storage| storage.remove_item(ACCOUNTS_KEY).ok());
                    Ok(())
                })
            }
            PasswordAction::ClearCipher => Box::pin(async move {
                set_is_encrypted(false);
                set_cipher(None);
                let _ = get_local_storage()
                    .and_then(|storage| storage.remove_item(ENCRYPTED_ACCOUNTS_KEY).ok());
                Ok(())
            })
                as Pin<Box<dyn Future<Output = Result<(), String>> + Send>>,
        }
    });

    provide_context(AccountsContext {
        accounts,
        set_accounts,
        set_password,
        decrypt_accounts,
        is_encrypted,
    });
}
