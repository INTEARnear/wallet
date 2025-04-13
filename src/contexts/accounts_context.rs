use leptos::prelude::*;
use near_min_api::types::{near_crypto::SecretKey, AccountId};
use serde::{Deserialize, Serialize};
use web_sys::window;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Account {
    pub account_id: AccountId,
    pub secret_key: SecretKey,
    pub seed_phrase: Option<String>,
}

#[derive(Clone, Serialize, Deserialize, Debug, Default)]
pub struct AccountsState {
    pub accounts: Vec<Account>,
    pub selected_account: Option<AccountId>,
}

#[derive(Clone)]
pub struct AccountsContext {
    pub accounts: ReadSignal<AccountsState>,
    pub set_accounts: WriteSignal<AccountsState>,
}

const ACCOUNTS_KEY: &str = "wallet_accounts";

fn get_local_storage() -> Option<web_sys::Storage> {
    window().and_then(|w| w.local_storage().ok()).flatten()
}

fn load_accounts() -> AccountsState {
    get_local_storage()
        .and_then(|storage| storage.get_item(ACCOUNTS_KEY).ok())
        .flatten()
        .and_then(|json| serde_json::from_str(&json).ok())
        .unwrap_or_default()
}

fn save_accounts(accounts: &AccountsState) {
    if let Some(storage) = get_local_storage() {
        if let Ok(json) = serde_json::to_string(accounts) {
            let _ = storage.set_item(ACCOUNTS_KEY, &json);
        }
    }
}

pub fn provide_accounts_context() {
    let (accounts, set_accounts) = signal(load_accounts());

    // Save to localStorage whenever accounts change
    Effect::new(move |_| {
        save_accounts(&accounts.get());
    });

    provide_context(AccountsContext {
        accounts,
        set_accounts,
    });
}
