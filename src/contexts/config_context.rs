use leptos::prelude::*;
use serde::{Deserialize, Serialize};
use web_sys::window;

use crate::pages::Slippage;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
pub enum TimestampFormat {
    #[default]
    TimeAgo,
    DateTime,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
pub enum PasswordRememberDuration {
    Never,
    Minutes5,
    #[default]
    Minutes15,
    Minutes60,
}

impl PasswordRememberDuration {
    pub fn display_name(&self) -> &'static str {
        match self {
            Self::Never => "Don't Remember",
            Self::Minutes5 => "5 minutes",
            Self::Minutes15 => "15 minutes",
            Self::Minutes60 => "60 minutes",
        }
    }

    pub fn option_value(&self) -> &'static str {
        match self {
            Self::Never => "never",
            Self::Minutes5 => "5m",
            Self::Minutes15 => "15m",
            Self::Minutes60 => "60m",
        }
    }

    pub fn from_option_value(value: &str) -> Self {
        match value {
            "never" => Self::Never,
            "5m" => Self::Minutes5,
            "15m" => Self::Minutes15,
            "60m" => Self::Minutes60,
            _ => Self::Never,
        }
    }

    pub fn all_variants() -> &'static [Self] {
        &[
            Self::Never,
            Self::Minutes5,
            Self::Minutes15,
            Self::Minutes60,
        ]
    }

    pub fn to_seconds(&self) -> Option<u64> {
        match self {
            Self::Never => None,
            Self::Minutes5 => Some(5 * 60),
            Self::Minutes15 => Some(15 * 60),
            Self::Minutes60 => Some(60 * 60),
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct WalletConfig {
    pub show_low_balance_tokens: bool,
    #[serde(skip)]
    pub amounts_hidden: bool,
    pub timestamp_format: TimestampFormat,
    pub show_transaction_details: bool,
    pub play_transfer_sound: bool,
    #[serde(default = "default_true")]
    pub realtime_balance_updates: bool,
    #[serde(default = "default_true")]
    pub realtime_price_updates: bool,
    #[serde(default)]
    pub password_remember_duration: PasswordRememberDuration,
    #[serde(default)]
    pub slippage: Slippage,
}

impl Default for WalletConfig {
    fn default() -> Self {
        Self {
            show_low_balance_tokens: false,
            amounts_hidden: false,
            timestamp_format: TimestampFormat::TimeAgo,
            show_transaction_details: false,
            play_transfer_sound: false,
            realtime_balance_updates: true,
            realtime_price_updates: true,
            password_remember_duration: PasswordRememberDuration::default(),
            slippage: Slippage::default(),
        }
    }
}

fn default_true() -> bool {
    true
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
