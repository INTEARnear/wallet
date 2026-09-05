use std::convert::Infallible;
use std::fmt::{self, Display};
use std::str::FromStr;

use aes_gcm::{
    Aes256Gcm, Key, KeyInit, Nonce,
    aead::{Aead, OsRng, rand_core::RngCore},
};
use base64::prelude::BASE64_STANDARD;
use base64::{Engine as _, engine::general_purpose};
use chrono::{DateTime, Utc};
use deli::{CursorDirection, Database, Model};
use futures_channel::oneshot;
use leptos::prelude::*;
use leptos::task::spawn_local;
use near_min_api::types::{
    AccountId,
    near_crypto::{PublicKey, SecretKey},
};
use serde::{Deserialize, Serialize};
use wasm_bindgen_futures::JsFuture;

use crate::contexts::accounts_context::{AccountsContext, Cipher, SecretKeyHolder};
use crate::utils::{is_tauri, tauri_invoke_no_args};

const DB_NAME: &str = "smile_wallet_security";

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TransactionDanger {
    NotDangerous,
    Confirmed,
    NotConfirmed,
}

#[derive(Debug, Clone)]
pub enum SecurityLogEvent {
    AccountImportedWithPrivateKey {
        secret_key: SecretKey,
    },
    AccountImportedWithLedger {
        path: String,
        public_key: PublicKey,
    },
    AccountImportedOnAutoImport {
        secret_key: SecretKey,
    },
    AccountCreationStarted {
        secret_key: SecretKeyHolder,
    },
    AccountCreated {
        secret_key: SecretKeyHolder,
    },
    AccountLoggedOutRemoteKeyRemoval {
        secret_key: SecretKeyHolder,
    },
    SignedNep413Message {
        origin: String,
        message: String,
    },
    EncryptedAccountsWithPassword {
        recovery_secret_key: SecretKeyHolder,
    },
    WalletOpened,
    DeletedFromDeveloperSandbox {
        account_id: AccountId,
        secret_key: SecretKeyHolder,
        public_key: PublicKey,
    },
    SentTransactions {
        origin: String,
        transactions: String,
        danger: TransactionDanger,
    },
    ConnectedToApp {
        app: String,
    },
    AddedFullAccessKeyOnLogin {
        public_key: PublicKey,
    },
    LoggedOutOfApp {
        app: String,
    },
    LoggedOutOfAccount {
        account_id: AccountId,
        secret_key: SecretKeyHolder,
        public_key: PublicKey,
    },
    SwitchingKeyAlgorithm {
        new_secret_key: SecretKey,
        removed_keys: String,
        previous_secret_key: SecretKeyHolder,
    },
    StoragePersistenceWarningDismissed,
    ShownSecrets,
    TerminatedOtherSessionsLedger {
        account_id: AccountId,
        removed_key_count: usize,
        kept_public_key: PublicKey,
    },
    TerminatedOtherSessions {
        account_id: AccountId,
        new_secret_key: SecretKey,
        new_public_key: PublicKey,
        removed_keys: String,
        previous_secret_key: SecretKeyHolder,
    },
    DisconnectedLedger {
        new_public_key: PublicKey,
        new_secret_key: SecretKey,
    },
    ConnectedLedger {
        path: String,
        public_key: PublicKey,
    },
    UnlinkedBettearBot,
    LinkedBettearBot,
    Unknown {
        message: String,
    },
}

impl SecurityLogEvent {
    pub fn recoverable_secret_keys(&self) -> Vec<SecretKey> {
        let mut secret_keys = Vec::new();
        match self {
            Self::AccountImportedWithPrivateKey { secret_key }
            | Self::AccountImportedOnAutoImport { secret_key }
            | Self::DisconnectedLedger {
                new_secret_key: secret_key,
                ..
            } => {
                secret_keys.push(secret_key.clone());
            }
            Self::AccountCreationStarted { secret_key }
            | Self::AccountCreated { secret_key }
            | Self::AccountLoggedOutRemoteKeyRemoval { secret_key }
            | Self::DeletedFromDeveloperSandbox { secret_key, .. }
            | Self::LoggedOutOfAccount { secret_key, .. } => {
                if let SecretKeyHolder::SecretKey(secret_key) = secret_key {
                    secret_keys.push(secret_key.clone());
                }
            }
            Self::EncryptedAccountsWithPassword {
                recovery_secret_key: SecretKeyHolder::SecretKey(secret_key),
            } => {
                secret_keys.push(secret_key.clone());
            }
            Self::SwitchingKeyAlgorithm {
                new_secret_key,
                previous_secret_key,
                ..
            }
            | Self::TerminatedOtherSessions {
                new_secret_key,
                previous_secret_key,
                ..
            } => {
                secret_keys.push(new_secret_key.clone());
                if let SecretKeyHolder::SecretKey(secret_key) = previous_secret_key {
                    secret_keys.push(secret_key.clone());
                }
            }
            _ => {}
        }
        secret_keys
    }
}

impl Display for SecurityLogEvent {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::AccountImportedWithPrivateKey { secret_key } => {
                write!(f, "Account imported with private key {secret_key}")
            }
            Self::AccountImportedWithLedger { path, public_key } => {
                write!(
                    f,
                    "Account imported with Ledger path {path} and public key {public_key}"
                )
            }
            Self::AccountImportedOnAutoImport { secret_key } => {
                write!(
                    f,
                    "Account imported on /auto-import-secret-key with private key {secret_key}"
                )
            }
            Self::AccountCreationStarted { secret_key } => {
                write!(f, "Account creation started with private key {secret_key}")
            }
            Self::AccountCreated { secret_key } => {
                write!(f, "Account created with private key {secret_key}")
            }
            Self::AccountLoggedOutRemoteKeyRemoval { secret_key } => {
                write!(
                    f,
                    "Account logged out due to remote access key removal. Old access key: {secret_key}"
                )
            }
            Self::SignedNep413Message { origin, message } => {
                write!(
                    f,
                    "Signed NEP-413 message on /sign-message from {origin}: {message}"
                )
            }
            Self::EncryptedAccountsWithPassword {
                recovery_secret_key,
            } => {
                write!(
                    f,
                    "Encrypted accounts with password. Private key for recovery: {recovery_secret_key}"
                )
            }
            Self::WalletOpened => write!(f, "Wallet opened"),
            Self::DeletedFromDeveloperSandbox {
                account_id,
                secret_key,
                public_key,
            } => {
                write!(
                    f,
                    "Deleted {account_id} from developer sandbox with key {secret_key} (public key: {public_key})"
                )
            }
            Self::SentTransactions {
                origin,
                transactions,
                danger,
            } => {
                let danger_prefix = match danger {
                    TransactionDanger::NotDangerous => "",
                    TransactionDanger::Confirmed => " dangerous (typed 'CONFIRM')",
                    TransactionDanger::NotConfirmed => " dangerous (not typed 'CONFIRM')",
                };
                write!(
                    f,
                    "Sent{danger_prefix} transactions on /send-transactions from {origin}: {transactions}"
                )
            }
            Self::ConnectedToApp { app } => write!(f, "Connected to {app} on /connect"),
            Self::AddedFullAccessKeyOnLogin { public_key } => {
                write!(
                    f,
                    "Added full access key on /login with public key {public_key}, typed 'CONFIRM'"
                )
            }
            Self::LoggedOutOfApp { app } => {
                write!(
                    f,
                    "Logged out of {app} on /logout (NOTE: some logouts made on dapp side might not be displayed on this page)"
                )
            }
            Self::LoggedOutOfAccount {
                account_id,
                secret_key,
                public_key,
            } => {
                write!(
                    f,
                    "Logged out of {account_id} with key {secret_key} (public key: {public_key})"
                )
            }
            Self::SwitchingKeyAlgorithm {
                new_secret_key,
                removed_keys,
                previous_secret_key,
            } => {
                write!(
                    f,
                    "Switching key algorithm: adding {new_secret_key} and removing all full access keys {removed_keys}. Previous secret key: {previous_secret_key}"
                )
            }
            Self::StoragePersistenceWarningDismissed => {
                write!(f, "Storage persistence warning dismissed")
            }
            Self::ShownSecrets => write!(f, "Shown secrets on /settings/security/account"),
            Self::TerminatedOtherSessionsLedger {
                account_id,
                removed_key_count,
                kept_public_key,
            } => {
                write!(
                    f,
                    "Terminated all other sessions for Ledger account {account_id}: Removed {removed_key_count} other keys, kept current Ledger key {kept_public_key}"
                )
            }
            Self::TerminatedOtherSessions {
                account_id,
                new_secret_key,
                new_public_key,
                removed_keys,
                previous_secret_key,
            } => {
                write!(
                    f,
                    "Terminated all other sessions for account {account_id}: Added key {new_secret_key} (public key: {new_public_key}) and removed keys {removed_keys}. Previous key that the wallet was using was {previous_secret_key}"
                )
            }
            Self::DisconnectedLedger {
                new_public_key,
                new_secret_key,
            } => {
                write!(
                    f,
                    "Disconnected Ledger. New public key: {new_public_key}, private key: {new_secret_key}"
                )
            }
            Self::ConnectedLedger { path, public_key } => {
                write!(f, "Connected Ledger (path {path}) public key {public_key}")
            }
            Self::UnlinkedBettearBot => write!(f, "Unlinked Bettear Bot"),
            Self::LinkedBettearBot => write!(f, "Linked Bettear Bot"),
            Self::Unknown { message } => write!(f, "(unknown): {message}"),
        }
    }
}

impl FromStr for SecurityLogEvent {
    type Err = Infallible;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(parse_security_log_event(s))
    }
}

fn parse_security_log_event(s: &str) -> SecurityLogEvent {
    if s == "Wallet opened" {
        return SecurityLogEvent::WalletOpened;
    }
    if s == "Storage persistence warning dismissed" {
        return SecurityLogEvent::StoragePersistenceWarningDismissed;
    }
    if s == "Shown secrets on /settings/security/account" {
        return SecurityLogEvent::ShownSecrets;
    }
    if s == "Unlinked Bettear Bot" {
        return SecurityLogEvent::UnlinkedBettearBot;
    }
    if s == "Linked Bettear Bot" {
        return SecurityLogEvent::LinkedBettearBot;
    }

    if let Some(event) = parse_account_imported_with_ledger(s) {
        return event;
    }
    if let Some(event) =
        parse_prefixed_secret_key(s, "Account imported with private key ", |secret_key| {
            SecurityLogEvent::AccountImportedWithPrivateKey { secret_key }
        })
    {
        return event;
    }
    if let Some(event) = parse_prefixed_secret_key(
        s,
        "Account imported on /auto-import-secret-key with private key ",
        |secret_key| SecurityLogEvent::AccountImportedOnAutoImport { secret_key },
    ) {
        return event;
    }
    if let Some(secret_key) = s
        .strip_prefix("Account creation started with private key ")
        .and_then(|rest| rest.parse().ok())
    {
        return SecurityLogEvent::AccountCreationStarted { secret_key };
    }
    if let Some(secret_key) = s
        .strip_prefix("Account created with private key ")
        .and_then(|rest| rest.parse().ok())
    {
        return SecurityLogEvent::AccountCreated { secret_key };
    }
    if let Some(secret_key) = s
        .strip_prefix("Account logged out due to remote access key removal. Old access key: ")
        .and_then(|rest| rest.parse().ok())
    {
        return SecurityLogEvent::AccountLoggedOutRemoteKeyRemoval { secret_key };
    }
    if let Some(event) = parse_signed_nep413_message(s) {
        return event;
    }
    if let Some(recovery_secret_key) = s
        .strip_prefix("Encrypted accounts with password. Private key for recovery: ")
        .and_then(|rest| rest.parse().ok())
    {
        return SecurityLogEvent::EncryptedAccountsWithPassword {
            recovery_secret_key,
        };
    }
    if let Some(event) = parse_deleted_from_developer_sandbox(s) {
        return event;
    }
    if let Some(event) = parse_sent_transactions(s) {
        return event;
    }
    if let Some(app) = s
        .strip_prefix("Connected to ")
        .and_then(|rest| rest.strip_suffix(" on /connect"))
    {
        return SecurityLogEvent::ConnectedToApp {
            app: app.to_string(),
        };
    }
    if let Some(public_key) = s
        .strip_prefix("Added full access key on /login with public key ")
        .and_then(|rest| rest.strip_suffix(", typed 'CONFIRM'"))
        .and_then(|rest| rest.parse().ok())
    {
        return SecurityLogEvent::AddedFullAccessKeyOnLogin { public_key };
    }
    if let Some(app) = s.strip_prefix("Logged out of ").and_then(|rest| {
        rest.strip_suffix(
            " on /logout (NOTE: some logouts made on dapp side might not be displayed on this page)",
        )
    }) {
        return SecurityLogEvent::LoggedOutOfApp {
            app: app.to_string(),
        };
    }
    if let Some(event) = parse_logged_out_of_account(s) {
        return event;
    }
    if let Some(event) = parse_switching_key_algorithm(s) {
        return event;
    }
    if let Some(event) = parse_terminated_other_sessions_ledger(s) {
        return event;
    }
    if let Some(event) = parse_terminated_other_sessions(s) {
        return event;
    }
    if let Some(event) = parse_disconnected_ledger(s) {
        return event;
    }
    if let Some(event) = parse_connected_ledger(s) {
        return event;
    }

    SecurityLogEvent::Unknown {
        message: s.to_string(),
    }
}

fn parse_prefixed_secret_key(
    s: &str,
    prefix: &str,
    into_event: impl FnOnce(SecretKey) -> SecurityLogEvent,
) -> Option<SecurityLogEvent> {
    let secret_key = s.strip_prefix(prefix)?.parse().ok()?;
    Some(into_event(secret_key))
}

fn parse_account_imported_with_ledger(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Account imported with Ledger path ")?;
    let (path, public_key) = rest.rsplit_once(" and public key ")?;
    let public_key = public_key.parse().ok()?;
    Some(SecurityLogEvent::AccountImportedWithLedger {
        path: path.to_string(),
        public_key,
    })
}

fn parse_signed_nep413_message(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Signed NEP-413 message on /sign-message from ")?;
    let (origin, message) = rest.split_once(": ")?;
    Some(SecurityLogEvent::SignedNep413Message {
        origin: origin.to_string(),
        message: message.to_string(),
    })
}

fn parse_deleted_from_developer_sandbox(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Deleted ")?;
    let (account_id, rest) = rest.split_once(" from developer sandbox with key ")?;
    let (secret_key, rest) = rest.rsplit_once(" (public key: ")?;
    let public_key = rest.strip_suffix(')')?;
    Some(SecurityLogEvent::DeletedFromDeveloperSandbox {
        account_id: account_id.parse().ok()?,
        secret_key: secret_key.parse().ok()?,
        public_key: public_key.parse().ok()?,
    })
}

fn parse_sent_transactions(s: &str) -> Option<SecurityLogEvent> {
    let (rest, danger) = if let Some(rest) =
        s.strip_prefix("Sent dangerous (typed 'CONFIRM') transactions on /send-transactions from ")
    {
        (rest, TransactionDanger::Confirmed)
    } else if let Some(rest) = s.strip_prefix(
        "Sent dangerous (not typed 'CONFIRM') transactions on /send-transactions from ",
    ) {
        (rest, TransactionDanger::NotConfirmed)
    } else if let Some(rest) = s.strip_prefix("Sent transactions on /send-transactions from ") {
        (rest, TransactionDanger::NotDangerous)
    } else {
        return None;
    };
    let (origin, transactions) = rest.split_once(": ")?;
    Some(SecurityLogEvent::SentTransactions {
        origin: origin.to_string(),
        transactions: transactions.to_string(),
        danger,
    })
}

fn parse_logged_out_of_account(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Logged out of ")?;
    let (account_id, rest) = rest.split_once(" with key ")?;
    let (secret_key, rest) = rest.rsplit_once(" (public key: ")?;
    let public_key = rest.strip_suffix(')')?;
    Some(SecurityLogEvent::LoggedOutOfAccount {
        account_id: account_id.parse().ok()?,
        secret_key: secret_key.parse().ok()?,
        public_key: public_key.parse().ok()?,
    })
}

fn parse_switching_key_algorithm(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Switching key algorithm: adding ")?;
    let (new_secret_key, rest) = rest.split_once(" and removing all full access keys ")?;
    let (removed_keys, previous_secret_key) = rest.rsplit_once(". Previous secret key: ")?;
    Some(SecurityLogEvent::SwitchingKeyAlgorithm {
        new_secret_key: new_secret_key.parse().ok()?,
        removed_keys: removed_keys.to_string(),
        previous_secret_key: previous_secret_key.parse().ok()?,
    })
}

fn parse_terminated_other_sessions_ledger(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Terminated all other sessions for Ledger account ")?;
    let (account_id, rest) = rest.split_once(": Removed ")?;
    let (removed_key_count, kept_public_key) =
        rest.split_once(" other keys, kept current Ledger key ")?;
    Some(SecurityLogEvent::TerminatedOtherSessionsLedger {
        account_id: account_id.parse().ok()?,
        removed_key_count: removed_key_count.parse().ok()?,
        kept_public_key: kept_public_key.parse().ok()?,
    })
}

fn parse_terminated_other_sessions(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Terminated all other sessions for account ")?;
    let (account_id, rest) = rest.split_once(": Added key ")?;
    let (new_secret_key, rest) = rest.split_once(" (public key: ")?;
    let (new_public_key, rest) = rest.split_once(") and removed keys ")?;
    let (removed_keys, previous_secret_key) =
        rest.rsplit_once(". Previous key that the wallet was using was ")?;
    Some(SecurityLogEvent::TerminatedOtherSessions {
        account_id: account_id.parse().ok()?,
        new_secret_key: new_secret_key.parse().ok()?,
        new_public_key: new_public_key.parse().ok()?,
        removed_keys: removed_keys.to_string(),
        previous_secret_key: previous_secret_key.parse().ok()?,
    })
}

fn parse_disconnected_ledger(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Disconnected Ledger. New public key: ")?;
    let (new_public_key, new_secret_key) = rest.split_once(", private key: ")?;
    Some(SecurityLogEvent::DisconnectedLedger {
        new_public_key: new_public_key.parse().ok()?,
        new_secret_key: new_secret_key.parse().ok()?,
    })
}

fn parse_connected_ledger(s: &str) -> Option<SecurityLogEvent> {
    let rest = s.strip_prefix("Connected Ledger (path ")?;
    let (path, public_key) = rest.split_once(") public key ")?;
    Some(SecurityLogEvent::ConnectedLedger {
        path: path.to_string(),
        public_key: public_key.parse().ok()?,
    })
}

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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SecurityLogDecryptError {
    Locked,
    Failed,
}

impl std::fmt::Display for SecurityLogDecryptError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Locked => write!(f, "[ENCRYPTED - Unlock wallet to view]"),
            Self::Failed => write!(f, "[ENCRYPTED - Failed to decrypt]"),
        }
    }
}

#[derive(Clone, Debug)]
pub struct SecurityLogEntry {
    pub id: u32,
    pub event: Result<SecurityLogEvent, SecurityLogDecryptError>,
    pub account: AccountId,
    pub timestamp: DateTime<Utc>,
}

impl SecurityLog {
    async fn decrypt_message(
        &self,
        cipher: Option<&Cipher>,
    ) -> Result<String, SecurityLogDecryptError> {
        let Some(nonce_str) = &self.nonce else {
            return Ok(self.message.clone());
        };

        let Some(cipher) = cipher else {
            return Err(SecurityLogDecryptError::Locked);
        };

        match decrypt_message(&self.message, nonce_str, cipher).await {
            Ok(decrypted) => Ok(decrypted),
            Err(err) => {
                log::error!("Failed to decrypt security log: {err}");
                Err(SecurityLogDecryptError::Failed)
            }
        }
    }

    pub fn is_encrypted(&self) -> bool {
        self.nonce.is_some()
    }

    async fn into_entry(self, cipher: Option<&Cipher>) -> SecurityLogEntry {
        let event = match self.decrypt_message(cipher).await {
            Ok(plaintext) => Ok(plaintext.parse().unwrap()),
            Err(error) => Err(error),
        };
        SecurityLogEntry {
            id: self.id,
            event,
            account: self.account,
            timestamp: self.timestamp,
        }
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

pub async fn load_security_logs(
    start_index: u32,
    limit: u32,
    cipher: Option<Cipher>,
) -> Result<Vec<SecurityLogEntry>, String> {
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
                let mut entries = Vec::with_capacity(values.len());
                for value in values {
                    entries.push(value.into_entry(cipher.as_ref()).await);
                }
                Ok(entries)
            }
            Err(e) => Err(e.to_string()),
        };

        let _ = tx.send(result);
    });

    rx.await.unwrap_or(Err("Failed to receive result".into()))
}

pub async fn load_all_security_logs(
    cipher: Option<Cipher>,
) -> Result<Vec<SecurityLogEntry>, String> {
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
                let mut values = Vec::new();
                if let Ok(Some(mut cursor)) = store.cursor(.., Some(CursorDirection::Prev)).await {
                    while let Ok(Some(value)) = cursor.value() {
                        values.push(value);
                        if let Err(e) = cursor.advance(1).await {
                            log::error!("Failed to advance cursor: {e:?}");
                            break;
                        }
                    }
                }
                let mut entries = Vec::with_capacity(values.len());
                for value in values {
                    entries.push(value.into_entry(cipher.as_ref()).await);
                }
                Ok(entries)
            }
            Err(e) => Err(e.to_string()),
        };

        let _ = tx.send(result);
    });

    rx.await.unwrap_or(Err("Failed to receive result".into()))
}

pub fn add_security_log(
    event: SecurityLogEvent,
    account: AccountId,
    accounts_context: AccountsContext,
) {
    spawn_local(async move {
        let cipher = accounts_context.cipher.get_untracked();
        let message = event.to_string();

        match add_log_entry(message, account, cipher).await {
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

            if let Some(plaintext) = plaintext_opt
                && let Ok((enc_msg, new_nonce)) = encrypt_message(&plaintext, &new_cipher).await
            {
                log_entry.message = enc_msg;
                log_entry.nonce = Some(new_nonce);
                if let Err(e) = store.update(&log_entry).await {
                    log::error!(
                        "Failed to update security log id {} during re-encryption: {e:?}",
                        log_entry.id
                    );
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
