use leptos::prelude::*;
use near_min_api::types::AccountId;
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    hash::{Hash, Hasher},
};
use wasm_bindgen_futures::JsFuture;

use crate::{
    pages::swap::Slippage,
    utils::{is_tauri, serialize_to_js_value, tauri_invoke, tauri_invoke_no_args},
};

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

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
pub enum NftsViewState {
    Collections,
    #[default]
    AllNfts,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
pub enum BackgroundGroup {
    #[default]
    Group0,
    Group1,
    Group2,
}

impl BackgroundGroup {
    pub fn display_name(&self) -> &'static str {
        match self {
            Self::Group0 => "Teardrops",
            Self::Group1 => "Betty",
            Self::Group2 => "Triangles",
        }
    }

    pub fn get_count(&self) -> u32 {
        match self {
            Self::Group0 => 5,
            Self::Group1 => 17,
            Self::Group2 => 5,
        }
    }

    pub fn get_prefix(&self) -> &'static str {
        match self {
            Self::Group0 => "bg0",
            Self::Group1 => "bg1",
            Self::Group2 => "bg2",
        }
    }

    pub fn all_variants() -> &'static [Self] {
        &[Self::Group0, Self::Group1, Self::Group2]
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Default, Ord, PartialOrd, Eq)]
pub enum LedgerMode {
    #[default]
    Disabled,
    WebUSB,
    WebBLE,
    TauriDevice(String),
}

impl LedgerMode {
    pub fn display_name(&self) -> &str {
        match &self {
            Self::Disabled => "None",
            Self::WebUSB => "USB",
            Self::WebBLE => "Bluetooth",
            Self::TauriDevice(device_name) => device_name.as_str(),
        }
    }

    pub async fn all_variants() -> Vec<Self> {
        if is_tauri() {
            get_tauri_ledger_devices()
                .await
                .unwrap()
                .into_iter()
                .map(Self::TauriDevice)
                .collect()
        } else {
            vec![Self::WebUSB, Self::WebBLE]
        }
    }
}

async fn get_tauri_ledger_devices() -> Result<Vec<String>, String> {
    let promise = tauri_invoke_no_args("get_ledger_devices");
    let future = JsFuture::from(promise);
    let devices = future
        .await
        .map_err(|e| format!("Failed to get ledger devices: {e:?}"))?;
    let devices: String = serde_wasm_bindgen::from_value(devices)
        .map_err(|e| format!("Failed to deserialize ledger devices: {}", e))?;
    let devices: Vec<String> = serde_json::from_str(&devices)
        .map_err(|e| format!("Failed to deserialize ledger devices: {}", e))?;
    Ok(devices)
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
    #[serde(default)]
    pub analytics_disabled: bool,
    #[serde(default)]
    pub nfts_view_state: NftsViewState,
    #[serde(default)]
    pub hidden_nfts: Vec<HiddenNft>,
    #[serde(default)]
    pub background_group: BackgroundGroup,
    #[serde(default)]
    pub autoconfirm_preference_by_origin: HashMap<String, bool>,
    #[serde(default = "default_true")]
    pub hide_to_tray: bool,
    #[serde(default)]
    pub autostart: bool,
    #[serde(default = "default_true")]
    pub swap_confirmation_enabled: bool,
    #[serde(default)]
    pub custom_networks: Vec<CustomNetwork>,
    #[serde(default)]
    pub biometric_enabled: bool,
    #[serde(default = "default_true")]
    pub prevent_screenshots: bool,
    #[serde(default)]
    pub storage_persistence_warning_dismissed: bool,
    #[serde(default)]
    pub ledger_mode: LedgerMode,
    #[serde(default)]
    pub number_config: NumberConfig,
    #[serde(default)]
    pub custom_router_url: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum NumberConfig {
    Simple {
        short_amounts: bool,
    },
    Customizable {
        amount_format: InsanelyCustomizableAmountFormat,
    },
}

impl Default for NumberConfig {
    fn default() -> Self {
        Self::Simple {
            short_amounts: true,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConstrainedUsize<const MIN_INCLUSIVE: usize, const MAX_EXCLUSIVE: usize> {
    value: usize,
}

impl<const MIN_INCLUSIVE: usize, const MAX_EXCLUSIVE: usize>
    ConstrainedUsize<MIN_INCLUSIVE, MAX_EXCLUSIVE>
{
    const _ASSERT: () = assert!(
        MIN_INCLUSIVE <= MAX_EXCLUSIVE,
        "MIN_INCLUSIVE must be less than or equal to MAX_EXCLUSIVE"
    );
    pub fn new(value: usize) -> Option<Self> {
        if !(MIN_INCLUSIVE..MAX_EXCLUSIVE).contains(&value) {
            None
        } else {
            Some(Self { value })
        }
    }

    pub fn value(self) -> usize {
        self.value
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct InsanelyCustomizableAmountFormat {
    minimum_integer_digits: ConstrainedUsize<1, 22>,
    minimum_fraction_digits: ConstrainedUsize<0, 101>,
    maximum_fraction_digits: ConstrainedUsize<0, 101>,
    minimum_significant_digits: ConstrainedUsize<1, 22>,
    maximum_significant_digits: ConstrainedUsize<1, 22>,
    rounding_priority: RoundingPriority,
    rounding_increment: RoundingIncrement,
    rounding_mode: RoundingMode,
    trailing_zero_display: TrailingZeroDisplay,
    notation: Notation,
    /// Only when notation is Compact
    compact_display: Option<CompactDisplay>,
    use_grouping: UseGrouping,
}

impl Default for InsanelyCustomizableAmountFormat {
    fn default() -> Self {
        Self {
            minimum_integer_digits: ConstrainedUsize::new(1).unwrap(),
            minimum_fraction_digits: ConstrainedUsize::new(0).unwrap(),
            maximum_fraction_digits: ConstrainedUsize::new(3).unwrap(),
            minimum_significant_digits: ConstrainedUsize::new(1).unwrap(),
            maximum_significant_digits: ConstrainedUsize::new(21).unwrap(),
            rounding_priority: RoundingPriority::Auto,
            rounding_increment: RoundingIncrement::One,
            rounding_mode: RoundingMode::HalfExpand,
            trailing_zero_display: TrailingZeroDisplay::Auto,
            notation: Notation::Standard,
            compact_display: None,
            use_grouping: UseGrouping::Auto,
        }
    }
}

impl InsanelyCustomizableAmountFormat {
    pub fn minimum_integer_digits(self) -> usize {
        self.minimum_integer_digits.value()
    }

    pub fn minimum_fraction_digits(self) -> usize {
        self.minimum_fraction_digits.value()
    }

    pub fn maximum_fraction_digits(self) -> usize {
        self.maximum_fraction_digits.value()
    }

    pub fn minimum_significant_digits(self) -> usize {
        self.minimum_significant_digits.value()
    }

    pub fn maximum_significant_digits(self) -> usize {
        self.maximum_significant_digits.value()
    }

    pub fn rounding_priority(self) -> RoundingPriority {
        self.rounding_priority
    }

    pub fn rounding_increment(self) -> RoundingIncrement {
        self.rounding_increment
    }

    pub fn rounding_mode(self) -> RoundingMode {
        self.rounding_mode
    }

    pub fn trailing_zero_display(self) -> TrailingZeroDisplay {
        self.trailing_zero_display
    }

    pub fn notation(self) -> Notation {
        self.notation
    }

    pub fn compact_display(self) -> Option<CompactDisplay> {
        self.compact_display
    }

    pub fn use_grouping(self) -> UseGrouping {
        self.use_grouping
    }

    pub fn with_minimum_integer_digits(mut self, value: ConstrainedUsize<1, 22>) -> Self {
        self.minimum_integer_digits = value;
        self
    }

    pub fn with_minimum_fraction_digits(mut self, value: ConstrainedUsize<0, 101>) -> Self {
        self.minimum_fraction_digits = value;
        self
    }

    pub fn with_maximum_fraction_digits(mut self, value: ConstrainedUsize<0, 101>) -> Self {
        self.maximum_fraction_digits = value;
        self
    }

    pub fn with_minimum_significant_digits(mut self, value: ConstrainedUsize<1, 22>) -> Self {
        self.minimum_significant_digits = value;
        self
    }

    pub fn with_maximum_significant_digits(mut self, value: ConstrainedUsize<1, 22>) -> Self {
        self.maximum_significant_digits = value;
        self
    }

    pub fn with_rounding_priority(mut self, value: RoundingPriority) -> Self {
        self.rounding_priority = value;
        self
    }

    pub fn with_rounding_increment(mut self, value: RoundingIncrement) -> Self {
        self.rounding_increment = value;
        self
    }

    pub fn with_rounding_mode(mut self, value: RoundingMode) -> Self {
        self.rounding_mode = value;
        self
    }

    pub fn with_trailing_zero_display(mut self, value: TrailingZeroDisplay) -> Self {
        self.trailing_zero_display = value;
        self
    }

    pub fn with_notation(mut self, value: Notation) -> Self {
        self.notation = value;
        self
    }

    pub fn with_compact_display(mut self, value: Option<CompactDisplay>) -> Self {
        self.compact_display = value;
        self
    }

    pub fn with_use_grouping(mut self, value: UseGrouping) -> Self {
        self.use_grouping = value;
        self
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum UseGrouping {
    Always,
    Auto,
    Min2,
    False,
}

impl UseGrouping {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Auto => "auto",
            Self::Always => "always",
            Self::Min2 => "min2",
            Self::False => "false",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "auto" => Some(Self::Auto),
            "always" => Some(Self::Always),
            "min2" => Some(Self::Min2),
            "false" => Some(Self::False),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
pub enum CompactDisplay {
    #[default]
    Short,
    Long,
}

impl CompactDisplay {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Short => "short",
            Self::Long => "long",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "short" => Some(Self::Short),
            "long" => Some(Self::Long),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum RoundingPriority {
    Auto,
    MorePrecision,
    LessPrecision,
}

impl RoundingPriority {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Auto => "auto",
            Self::MorePrecision => "morePrecision",
            Self::LessPrecision => "lessPrecision",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "auto" => Some(Self::Auto),
            "morePrecision" => Some(Self::MorePrecision),
            "lessPrecision" => Some(Self::LessPrecision),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum RoundingIncrement {
    One,
    Two,
    Five,
    Ten,
    Twenty,
    TwentyFive,
    Fifty,
    OneHundred,
    TwoHundred,
    TwoHundredFifty,
    FiveHundred,
    OneThousand,
    TwoThousand,
    TwoThousandFiveHundred,
    FiveThousand,
}

impl From<RoundingIncrement> for usize {
    fn from(value: RoundingIncrement) -> usize {
        match value {
            RoundingIncrement::One => 1,
            RoundingIncrement::Two => 2,
            RoundingIncrement::Five => 5,
            RoundingIncrement::Ten => 10,
            RoundingIncrement::Twenty => 20,
            RoundingIncrement::TwentyFive => 25,
            RoundingIncrement::Fifty => 50,
            RoundingIncrement::OneHundred => 100,
            RoundingIncrement::TwoHundred => 200,
            RoundingIncrement::TwoHundredFifty => 250,
            RoundingIncrement::FiveHundred => 500,
            RoundingIncrement::OneThousand => 1000,
            RoundingIncrement::TwoThousand => 2000,
            RoundingIncrement::TwoThousandFiveHundred => 2500,
            RoundingIncrement::FiveThousand => 5000,
        }
    }
}

impl RoundingIncrement {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::One => "1",
            Self::Two => "2",
            Self::Five => "5",
            Self::Ten => "10",
            Self::Twenty => "20",
            Self::TwentyFive => "25",
            Self::Fifty => "50",
            Self::OneHundred => "100",
            Self::TwoHundred => "200",
            Self::TwoHundredFifty => "250",
            Self::FiveHundred => "500",
            Self::OneThousand => "1000",
            Self::TwoThousand => "2000",
            Self::TwoThousandFiveHundred => "2500",
            Self::FiveThousand => "5000",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "1" => Some(Self::One),
            "2" => Some(Self::Two),
            "5" => Some(Self::Five),
            "10" => Some(Self::Ten),
            "20" => Some(Self::Twenty),
            "25" => Some(Self::TwentyFive),
            "50" => Some(Self::Fifty),
            "100" => Some(Self::OneHundred),
            "200" => Some(Self::TwoHundred),
            "250" => Some(Self::TwoHundredFifty),
            "500" => Some(Self::FiveHundred),
            "1000" => Some(Self::OneThousand),
            "2000" => Some(Self::TwoThousand),
            "2500" => Some(Self::TwoThousandFiveHundred),
            "5000" => Some(Self::FiveThousand),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum TrailingZeroDisplay {
    Auto,
    StripIfInteger,
}

impl TrailingZeroDisplay {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Auto => "auto",
            Self::StripIfInteger => "stripIfInteger",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "auto" => Some(Self::Auto),
            "stripIfInteger" => Some(Self::StripIfInteger),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum RoundingMode {
    Ceil,
    Floor,
    Expand,
    Trunc,
    HalfCeil,
    HalfFloor,
    HalfExpand,
    HalfTrunc,
    HalfEven,
}

impl RoundingMode {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Ceil => "ceil",
            Self::Floor => "floor",
            Self::Expand => "expand",
            Self::Trunc => "trunc",
            Self::HalfCeil => "halfCeil",
            Self::HalfFloor => "halfFloor",
            Self::HalfExpand => "halfExpand",
            Self::HalfTrunc => "halfTrunc",
            Self::HalfEven => "halfEven",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "ceil" => Some(Self::Ceil),
            "floor" => Some(Self::Floor),
            "expand" => Some(Self::Expand),
            "trunc" => Some(Self::Trunc),
            "halfCeil" => Some(Self::HalfCeil),
            "halfFloor" => Some(Self::HalfFloor),
            "halfExpand" => Some(Self::HalfExpand),
            "halfTrunc" => Some(Self::HalfTrunc),
            "halfEven" => Some(Self::HalfEven),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
pub enum Notation {
    #[default]
    Standard,
    Scientific,
    Engineering,
    Compact,
}

impl Notation {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Standard => "standard",
            Self::Scientific => "scientific",
            Self::Engineering => "engineering",
            Self::Compact => "compact",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "standard" => Some(Self::Standard),
            "scientific" => Some(Self::Scientific),
            "engineering" => Some(Self::Engineering),
            "compact" => Some(Self::Compact),
            _ => None,
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct CustomNetwork {
    pub id: String,
    pub rpc_url: String,
    pub history_service_url: Option<String>,
    pub social_contract: Option<AccountId>,
    pub prices_api_url: Option<String>,
    pub realtime_events_api_url: Option<String>,
    pub wrap_contract: Option<AccountId>,
    pub explorer_url: Option<String>,
    pub fastnear_api_url: Option<String>,
    pub staking_pools: HashSet<AccountId>,
    pub pool_details_contract: Option<AccountId>,
    pub charts_api_url: Option<String>,
    pub tokens: HashSet<AccountId>,
}

impl PartialEq for CustomNetwork {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for CustomNetwork {}

impl Hash for CustomNetwork {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.id.hash(state);
    }
}

fn default_true() -> bool {
    true
}

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, Eq)]
pub enum HiddenNft {
    Collection(AccountId),
    Token(AccountId, String),
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
            analytics_disabled: false,
            nfts_view_state: NftsViewState::default(),
            hidden_nfts: vec![],
            background_group: BackgroundGroup::default(),
            autoconfirm_preference_by_origin: HashMap::new(),
            hide_to_tray: true,
            autostart: false,
            swap_confirmation_enabled: true,
            custom_networks: vec![],
            custom_router_url: None,
            biometric_enabled: false,
            prevent_screenshots: true,
            storage_persistence_warning_dismissed: false,
            ledger_mode: LedgerMode::default(),
            number_config: NumberConfig::default(),
        }
    }
}

#[derive(Clone, Copy)]
pub struct ConfigContext {
    pub config: ReadSignal<WalletConfig>,
    pub set_config: WriteSignal<WalletConfig>,
}

const CONFIG_KEY: &str = "wallet_config";

fn get_local_storage() -> Option<web_sys::Storage> {
    window().local_storage().ok().flatten()
}

fn load_config() -> WalletConfig {
    get_local_storage()
        .and_then(|storage| storage.get_item(CONFIG_KEY).ok())
        .flatten()
        .and_then(|json| serde_json::from_str(&json).ok())
        .unwrap_or_default()
}

fn save_config(config: &WalletConfig) {
    if let Some(storage) = get_local_storage()
        && let Ok(json) = serde_json::to_string(config)
    {
        let _ = storage.set_item(CONFIG_KEY, &json);
    }
}

fn emit_config_change_event(config: &WalletConfig) {
    if let Ok(js_value) = serialize_to_js_value(config) {
        let wrapped_js_value = web_sys::js_sys::Object::new();
        let _ = web_sys::js_sys::Reflect::set(&wrapped_js_value, &"newConfig".into(), &js_value);
        let _ = tauri_invoke("update_config", &wrapped_js_value);
    }
}

pub fn provide_config_context() {
    let (config, set_config) = signal(load_config());

    // Save to localStorage whenever config changes
    Effect::new(move |_| {
        let current_config = config.get();
        save_config(&current_config);
        if is_tauri() {
            emit_config_change_event(&current_config);
        }
    });

    provide_context(ConfigContext { config, set_config });
}
