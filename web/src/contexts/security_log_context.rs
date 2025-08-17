use aes_gcm::{
    aead::{rand_core::RngCore, Aead, OsRng},
    Aes256Gcm, Key, KeyInit, Nonce,
};
use base64::prelude::BASE64_STANDARD;
use base64::{engine::general_purpose, Engine as _};
use chrono::{DateTime, Utc};
use deli::{CursorDirection, Database, Model};
use futures_channel::oneshot;
use leptos::prelude::*;
use leptos::task::spawn_local;
use near_min_api::types::AccountId;
use serde::{Deserialize, Serialize};
use wasm_bindgen_futures::JsFuture;

use crate::contexts::accounts_context::{AccountsContext, Cipher};
use crate::utils::{is_tauri, tauri_invoke_no_args};

const DB_NAME: &str = "smile_wallet_security";

#[derive(Clone, Serialize, Deserialize, Debug, Model)]
pub struct SecurityLog {
    #[deli(auto_increment)]
    pub id: u32,
    /// The message - encrypted if nonce is present, plain text if nonce is None
    pub message: String,
    /// Base64 encoded nonce used for encryption
    pub nonce: Option<String>,
    pub account: AccountId,
    pub timestamp: DateTime<Utc>,
}

impl SecurityLog {
    pub async fn get_decrypted_message(&self, cipher: Option<&Cipher>) -> String {
        let Some(nonce_str) = &self.nonce else {
            // No nonce means the message is not encrypted
            return self.message.clone();
        };

        let Some(cipher) = cipher else {
            return "[ENCRYPTED - Unlock wallet to view]".to_string();
        };

        match decrypt_message(&self.message, nonce_str, cipher).await {
            Ok(decrypted) => decrypted,
            Err(err) => format!("[ENCRYPTED - Failed to decrypt: {}]", err),
        }
    }

    pub fn is_encrypted(&self) -> bool {
        self.nonce.is_some()
    }
}

async fn encrypt_message(message: &str, cipher: &Cipher) -> Result<(String, String), String> {
    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let encrypted_data = cipher
        .cipher
        .encrypt(nonce, message.as_bytes())
        .map_err(|e| format!("Failed to encrypt message: {}", e))?;

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
                tx.send(Err("Failed to encrypt data using OS key".to_string()))
                    .unwrap();
                return;
            };
            tx.send(Ok(encrypted_data)).unwrap();
        });
        rx.await.unwrap()?
    } else {
        encrypted_data
    };

    let encrypted_base64 = general_purpose::STANDARD.encode(&encrypted_data);
    let nonce_base64 = general_purpose::STANDARD.encode(nonce_bytes);

    Ok((encrypted_base64, nonce_base64))
}

async fn decrypt_message(
    encrypted_message: &str,
    nonce_str: &str,
    cipher: &Cipher,
) -> Result<String, String> {
    let encrypted_data = general_purpose::STANDARD
        .decode(encrypted_message)
        .map_err(|e| format!("Failed to decode encrypted message: {}", e))?;

    let nonce_bytes = general_purpose::STANDARD
        .decode(nonce_str)
        .map_err(|e| format!("Failed to decode nonce: {}", e))?;

    let nonce = Nonce::from_slice(&nonce_bytes);

    let encrypted_data = if is_tauri() {
        let key_promise = tauri_invoke_no_args("get_os_encryption_key");
        let key_future = JsFuture::from(key_promise);
        let Ok(key_js) = key_future.await else {
            return Err("Failed to get OS key".to_string());
        };
        let Some(key_string) = key_js.as_string() else {
            return Err("OS key is not a string".to_string());
        };
        let Ok(key_bytes) = BASE64_STANDARD.decode(&key_string) else {
            return Err("Failed to decode OS key".to_string());
        };
        let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
        let os_cipher = Aes256Gcm::new(key);
        let Ok(decrypted_data) = os_cipher.decrypt(nonce, encrypted_data.as_ref()) else {
            return Err("Failed to decrypt data using OS key".to_string());
        };
        decrypted_data
    } else {
        encrypted_data
    };

    let decrypted_data = cipher
        .cipher
        .decrypt(nonce, encrypted_data.as_ref())
        .map_err(|e| format!("Failed to decrypt message: {}", e))?;

    String::from_utf8(decrypted_data)
        .map_err(|e| format!("Failed to convert decrypted data to string: {}", e))
}

async fn setup_db() -> Result<Database, deli::Error> {
    let db = Database::builder(DB_NAME)
        .version(2)
        .add_model::<SecurityLog>()
        .build()
        .await;

    match db {
        Ok(db) => Ok(db),

        Err(e) => {
            log::error!("Failed to open database: {e:?}");
            Err(e)
        }
    }
}

async fn add_log_entry(
    message: String,
    account: AccountId,
    cipher: Option<Cipher>,
) -> Result<u32, deli::Error> {
    let (final_message, nonce) = if let Some(cipher) = &cipher {
        match encrypt_message(&message, cipher).await {
            Ok((encrypted_message, nonce)) => (encrypted_message, Some(nonce)),
            Err(e) => {
                log::error!("Failed to encrypt log message: {}", e);
                // Fall back to unencrypted storage
                (message, None)
            }
        }
    } else {
        (message, None)
    };

    let log = AddSecurityLog {
        message: final_message,
        nonce,
        account,
        timestamp: Utc::now(),
    };

    match setup_db().await {
        Ok(db) => {
            let tx = db
                .transaction()
                .writable()
                .with_model::<SecurityLog>()
                .build()
                .unwrap();

            match SecurityLog::with_transaction(&tx).unwrap().add(&log).await {
                Ok(id) => match tx.commit().await {
                    Ok(_) => Ok(id),
                    Err(e) => {
                        log::error!("Failed to commit transaction: {e:?}");
                        Err(e)
                    }
                },
                Err(e) => {
                    log::error!("Failed to add log: {e:?}");
                    Err(e)
                }
            }
        }
        Err(e) => Err(e),
    }
}

pub async fn load_security_logs(start_index: u32, limit: u32) -> Result<Vec<SecurityLog>, String> {
    // Need to make this Send to use it in Action
    let (tx, rx) = oneshot::channel();
    spawn_local(async move {
        let result = match setup_db().await {
            Ok(db) => {
                let tx = db
                    .transaction()
                    .with_model::<SecurityLog>()
                    .build()
                    .expect("Failed to create transaction");

                let store =
                    SecurityLog::with_transaction(&tx).expect("Failed to instantiate store");
                let Ok(Some(mut cursor)) = store.cursor(.., Some(CursorDirection::Prev)).await
                else {
                    panic!("Failed to create cursor");
                };
                let mut values = Vec::new();
                cursor.advance(start_index).await.ok();
                while let Ok(Some(value)) = cursor.value() {
                    values.push(value);
                    if values.len() >= limit as usize {
                        break;
                    }
                    if let Err(e) = cursor.advance(1).await {
                        log::error!("Failed to advance cursor: {e:?}");
                        break;
                    }
                }
                Ok(values)
            }
            Err(e) => Err(e.to_string()),
        };

        let _ = tx.send(result);
    });

    rx.await.unwrap_or(Err("Failed to receive result".into()))
}

pub fn add_security_log(message: String, account: AccountId, accounts_context: AccountsContext) {
    spawn_local(async move {
        let cipher = accounts_context.cipher.get_untracked();

        match add_log_entry(message.clone(), account.clone(), cipher).await {
            Ok(_) => {
                // Log added successfully
            }
            Err(e) => log::error!("Failed to add security log: {e}"),
        }
    });
}

pub async fn reencrypt_security_logs(
    old_cipher: Option<Cipher>,
    new_cipher: Cipher,
) -> Result<(), String> {
    let db = setup_db()
        .await
        .map_err(|e| format!("Failed to open DB: {e:?}"))?;

    let tx = db
        .transaction()
        .writable()
        .with_model::<SecurityLog>()
        .build()
        .map_err(|e| format!("Failed to create transaction: {e:?}"))?;

    let store = SecurityLog::with_transaction(&tx)
        .map_err(|e| format!("Failed to instantiate store: {e:?}"))?;

    if let Ok(Some(mut cursor)) = store.cursor(.., Some(CursorDirection::Next)).await {
        loop {
            let Ok(Some(mut log_entry)) = cursor.value() else {
                break;
            };

            let plaintext_opt: Option<String> = if log_entry.is_encrypted() {
                match (&old_cipher, log_entry.nonce.as_ref()) {
                    (Some(cipher), Some(nonce_str)) => {
                        decrypt_message(&log_entry.message, nonce_str, cipher)
                            .await
                            .ok()
                    }
                    _ => None, // Cannot decrypt, leave as is and continue
                }
            } else {
                Some(log_entry.message.clone())
            };

            if let Some(plaintext) = plaintext_opt {
                if let Ok((enc_msg, new_nonce)) = encrypt_message(&plaintext, &new_cipher).await {
                    log_entry.message = enc_msg;
                    log_entry.nonce = Some(new_nonce);
                    if let Err(e) = store.update(&log_entry).await {
                        log::error!(
                            "Failed to update security log id {} during re-encryption: {e:?}",
                            log_entry.id
                        );
                    }
                }
            }

            if cursor.advance(1).await.is_err() {
                break;
            }
        }
    }

    tx.commit()
        .await
        .map_err(|e| format!("Failed to commit transaction: {e:?}"))?;

    Ok(())
}
