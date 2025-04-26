use leptos::prelude::*;
use serde::{Deserialize, Serialize};
use web_sys::window;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
pub enum TimestampFormat {
    #[default]
    TimeAgo,
    DateTime,
}

#[derive(Clone, Serialize, Deserialize, Debug, Default)]
pub struct WalletConfig {
    pub show_low_balance_tokens: bool,
    #[serde(skip)]
    pub amounts_hidden: bool,
    pub timestamp_format: TimestampFormat,
    pub show_transaction_details: bool,
}

#[derive(Clone)]
pub struct ConfigContext {
    pub config: ReadSignal<WalletConfig>,
    pub set_config: WriteSignal<WalletConfig>,
}

const CONFIG_KEY: &str = "wallet_config";

fn get_local_storage() -> Option<web_sys::Storage> {
    window().and_then(|w| w.local_storage().ok()).flatten()
}

fn load_config() -> WalletConfig {
    get_local_storage()
        .and_then(|storage| storage.get_item(CONFIG_KEY).ok())
        .flatten()
        .and_then(|json| serde_json::from_str(&json).ok())
        .unwrap_or_default()
}

fn save_config(config: &WalletConfig) {
    if let Some(storage) = get_local_storage() {
        if let Ok(json) = serde_json::to_string(config) {
            let _ = storage.set_item(CONFIG_KEY, &json);
        }
    }
}

pub fn provide_config_context() {
    let (config, set_config) = signal(load_config());

    // Save to localStorage whenever config changes
    Effect::new(move |_| {
        save_config(&config.get());
    });

    provide_context(ConfigContext { config, set_config });
}
