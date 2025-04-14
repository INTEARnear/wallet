use base64::{prelude::BASE64_STANDARD, Engine};
use cached::proc_macro::cached;
use leptos::prelude::expect_context;
use near_min_api::{
    types::{AccountId, AccountIdRef, Balance, NearToken},
    utils::dec_format,
};
use serde::Deserialize;
use std::{fmt::Display, ops::Deref, time::Duration};

use crate::contexts::{
    accounts_context::AccountsContext, config_context::ConfigContext, rpc_context::RpcContext,
};

const SI_PREFIXES: &[(f64, &str)] = &[(1e12, "T"), (1e9, "B"), (1e6, "M"), (1e3, "K")];

pub fn format_token_amount(balance: Balance, decimals: u32, symbol: &str) -> String {
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    if config().amounts_hidden {
        return "😭".to_string();
    }
    format_token_amount_no_hide(balance, decimals, symbol)
}

pub fn format_token_amount_no_hide(balance: Balance, decimals: u32, symbol: &str) -> String {
    let normalized_balance = balance as f64 / 10f64.powi(decimals as i32);

    for (divisor, prefix) in SI_PREFIXES {
        if normalized_balance >= *divisor {
            let value = normalized_balance / divisor;
            return format!("{value:.2}{prefix} {symbol}");
        }
    }

    let formatted_balance = match normalized_balance {
        integer if integer % 1.0 == 0.0 => format!("{normalized_balance}"),
        0.1.. => format!("{normalized_balance:.2}"),
        0.01.. => format!("{normalized_balance:.3}"),
        0.001.. => format!("{normalized_balance:.4}"),
        0.0001.. => format!("{normalized_balance:.5}"),
        _ => format!("{normalized_balance:.6}"),
    };
    format!("{formatted_balance} {symbol}")
}

pub fn format_usd_value(value: f64) -> String {
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    if config().amounts_hidden {
        return "😭".to_string();
    }
    format_usd_value_no_hide(value)
}

pub fn format_usd_value_no_hide(value: f64) -> String {
    if value.abs() < 1.00 {
        let sign = if value < 0.0 { "-" } else { "" };
        let value = value.abs();
        return match value {
            0.0 => "$0".to_string(),
            1e-1.. => format!("{sign}${value:.2}"),
            1e-2.. => format!("{sign}${value:.3}"),
            1e-3.. => format!("{sign}${value:.4}"),
            1e-4.. => format!("{sign}${value:.5}"),
            1e-5.. => format!("{sign}${value:.6}"),
            1e-6.. => format!("{sign}${value:.7}"),
            1e-7.. => format!("{sign}${value:.8}"),
            1e-8.. => format!("{sign}${value:.9}"),
            1e-9.. => format!("{sign}${value:.10}"),
            _ => format!("{sign}${value:.11}"),
        };
    }

    let is_negative = value < 0.0;
    let abs_value = value.abs();
    let formatted = format!("{abs_value:.2}");
    let parts: Vec<&str> = formatted.split('.').collect();
    let integer_part = parts[0].trim_start_matches('$');
    let decimal_part = parts[1];

    let mut result = String::new();

    for (i, c) in integer_part.chars().rev().enumerate() {
        if i > 0 && i % 3 == 0 {
            result.push(',');
        }
        result.push(c);
    }

    let sign = if is_negative { "-" } else { "" };
    format!(
        "{sign}${integer_part}.{decimal_part}",
        integer_part = result.chars().rev().collect::<String>(),
    )
}

pub fn format_duration(duration: Duration) -> String {
    let seconds = duration.as_secs();

    if seconds < 60 {
        format!("{seconds}s")
    } else if seconds < 60 * 60 {
        let minutes = seconds / 60;
        let remaining_seconds = seconds % 60;
        format!("{minutes}m {remaining_seconds}s")
    } else if seconds < 60 * 60 * 24 {
        let hours = seconds / (60 * 60);
        let remaining_minutes = (seconds % (60 * 60)) / 60;
        format!("{hours}h {remaining_minutes}m")
    } else if seconds < 60 * 60 * 24 * 30 {
        let days = seconds / (60 * 60 * 24);
        let remaining_hours = (seconds % (60 * 60 * 24)) / (60 * 60);
        format!("{days}d {remaining_hours}h")
    } else if seconds < 60 * 60 * 24 * 365 {
        let months = seconds / (60 * 60 * 24 * 30);
        let remaining_days = (seconds % (60 * 60 * 24 * 30)) / (60 * 60 * 24);
        format!("{months}mo {remaining_days}d")
    } else {
        let years = seconds / (60 * 60 * 24 * 365);
        let remaining_months = (seconds % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30);
        format!("{years}y {remaining_months}mo")
    }
}

pub fn format_account_id(account_id: &AccountIdRef) -> String {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    if let Some(selected_account) = accounts().selected_account {
        if selected_account == *account_id {
            let ConfigContext { config, .. } = expect_context::<ConfigContext>();
            if config().amounts_hidden {
                return "😭".to_string();
            }
        }
    }
    format_account_id_no_hide(account_id)
}

pub fn format_account_id_no_hide(account_id: &AccountIdRef) -> String {
    if account_id.len() > 24 {
        let first = &account_id.as_str()[..8];
        let last = &account_id.as_str()[account_id.len() - 8..];
        format!("{}...{}", first, last)
    } else {
        account_id.to_string()
    }
}

/// Log data container that is used in [NEP-297](https://nomicon.io/Standards/EventsFormat).
#[derive(Deserialize, Debug, Clone)]
pub struct EventLogData<T> {
    pub standard: String,
    pub version: String,
    pub event: String,
    pub data: T,
}

impl<T> EventLogData<T> {
    /// Deserialize NEP-297 log data from JSON log string.
    ///
    /// If deserialization succeeds, you should still check [`EventLogData`] standard,
    /// event, and version fields to ensure that the log is actually relevant and is
    /// not a similar event that just happens to have the same fields.
    pub fn deserialize(log: &str) -> Result<EventLogData<T>, Nep297DeserializationError>
    where
        T: for<'de> Deserialize<'de>,
    {
        if let Some(log) = log.strip_prefix("EVENT_JSON:") {
            serde_json::from_str(log).map_err(Nep297DeserializationError::Deserialization)
        } else {
            Err(Nep297DeserializationError::NoPrefix)
        }
    }
}

#[derive(Debug)]
pub enum Nep297DeserializationError {
    Deserialization(serde_json::Error),
    NoPrefix,
}

impl Display for Nep297DeserializationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Nep297DeserializationError::Deserialization(e) => {
                write!(f, "Deserialization error: {}", e)
            }
            Nep297DeserializationError::NoPrefix => write!(f, "No 'EVENT_JSON:' prefix"),
        }
    }
}

pub const NEP141_EVENT_STANDARD_STRING: &str = "nep141";
pub const NEP171_EVENT_STANDARD_STRING: &str = "nep171";

#[derive(Deserialize, Debug, Clone)]
#[serde(transparent, deny_unknown_fields)]
pub struct FtMintLog(pub Vec<FtMintEvent>);

impl Deref for FtMintLog {
    type Target = Vec<FtMintEvent>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// An event log to capture tokens minting
#[derive(Deserialize, Debug, Clone)]
#[serde(deny_unknown_fields)]
pub struct FtMintEvent {
    /// The account that minted the tokens
    pub owner_id: AccountId,
    /// The number of tokens minted
    #[serde(with = "dec_format")]
    pub amount: Balance,
    /// Optional message
    pub memo: Option<String>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(transparent, deny_unknown_fields)]
pub struct FtBurnLog(pub Vec<FtBurnEvent>);

impl Deref for FtBurnLog {
    type Target = Vec<FtBurnEvent>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// An event log to capture tokens burning
#[derive(Deserialize, Debug, Clone)]
#[serde(deny_unknown_fields)]
pub struct FtBurnEvent {
    /// Owner of tokens to burn
    pub owner_id: AccountId,
    /// The number of tokens to burn
    #[serde(with = "dec_format")]
    pub amount: Balance,
    /// Optional message
    pub memo: Option<String>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(transparent, deny_unknown_fields)]
pub struct FtTransferLog(pub Vec<FtTransferEvent>);

impl Deref for FtTransferLog {
    type Target = Vec<FtTransferEvent>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// An event log to capture tokens transfer
///
/// Note that some older tokens (including all `.tkn.near` tokens) don't follow this standard
#[derive(Deserialize, Debug, Clone)]
#[serde(deny_unknown_fields)]
pub struct FtTransferEvent {
    /// The account ID of the old owner
    pub old_owner_id: AccountId,
    /// The account ID of the new owner
    pub new_owner_id: AccountId,
    /// The number of tokens to transfer
    #[serde(with = "dec_format")]
    pub amount: Balance,
    /// Optional message
    pub memo: Option<String>,
}

impl FtTransferLog {
    /// Deserialize this object from a string like "Transfer 250000000000000000000000 from slimedragon.near to intear.near"
    pub fn deserialize_tkn_farm_log(mut log: &str) -> Result<Self, String> {
        if !log.starts_with("Transfer ") {
            return Err("Log doesn't start with 'Transfer '".to_string());
        }
        log = log.trim_start_matches("Transfer ");
        let parts: Vec<&str> = log.split(" from ").collect();
        if parts.len() < 2 {
            return Err("Log doesn't contain ' from '".to_string());
        }
        if parts.len() > 2 {
            return Err("Log contains multiple ' from '".to_string());
        }
        let amount = parts[0]
            .parse::<Balance>()
            .map_err(|e| format!("Failed to parse transfer amount: {}", e))?;
        let parts: Vec<&str> = parts[1].split(" to ").collect();
        if parts.len() < 2 {
            return Err("Log doesn't contain ' to '".to_string());
        }
        if parts.len() > 2 {
            return Err("Log contains multiple ' to '".to_string());
        }
        let old_owner_id = parts[0]
            .parse()
            .map_err(|e| format!("Failed to parse old owner ID: {}", e))?;
        let new_owner_id = parts[1]
            .parse()
            .map_err(|e| format!("Failed to parse new owner ID: {}", e))?;
        Ok(Self(vec![FtTransferEvent {
            old_owner_id,
            new_owner_id,
            amount,
            memo: None,
        }]))
    }
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(transparent, deny_unknown_fields)]
pub struct NftMintLog(pub Vec<NftMintEvent>);

impl Deref for NftMintLog {
    type Target = Vec<NftMintEvent>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// An event log to capture token minting
#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct NftMintEvent {
    /// The account that minted the tokens
    pub owner_id: AccountId,
    /// The tokens minted
    pub token_ids: Vec<String>,
    /// Optional message
    pub memo: Option<String>,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(transparent, deny_unknown_fields)]
pub struct NftBurnLog(pub Vec<NftBurnEvent>);

impl Deref for NftBurnLog {
    type Target = Vec<NftBurnEvent>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// An event log to capture token burning
#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct NftBurnEvent {
    /// Owner of tokens to burn
    pub owner_id: AccountId,
    /// Approved account_id to burn, if applicable
    pub authorized_id: Option<AccountId>,
    /// The tokens to burn
    pub token_ids: Vec<String>,
    /// Optional message
    pub memo: Option<String>,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(transparent, deny_unknown_fields)]
pub struct NftTransferLog(pub Vec<NftTransferEvent>);

impl Deref for NftTransferLog {
    type Target = Vec<NftTransferEvent>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// An event log to capture token transfer
#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct NftTransferEvent {
    /// Approved account_id to transfer, if applicable
    pub authorized_id: Option<AccountId>,
    /// The account ID of the old owner
    pub old_owner_id: AccountId,
    /// The account ID of the new owner
    pub new_owner_id: AccountId,
    /// The tokens to transfer
    pub token_ids: Vec<String>,
    /// Optional message
    pub memo: Option<String>,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(transparent, deny_unknown_fields)]
pub struct NftContractMetadataUpdateLog(pub Vec<NftContractMetadataUpdateEvent>);

impl Deref for NftContractMetadataUpdateLog {
    type Target = Vec<NftContractMetadataUpdateEvent>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// An event log to capture contract metadata updates. Note that the updated contract metadata
/// is not included in the log, as it could easily exceed the 16KB log size limit. Listeners
/// can query `nft_metadata` to get the updated contract metadata.
#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct NftContractMetadataUpdateEvent {
    /// Optional message
    pub memo: Option<String>,
}

impl EventLogData<FtMintLog> {
    pub fn validate(&self) -> bool {
        self.standard == NEP141_EVENT_STANDARD_STRING && self.event == "ft_mint"
    }
}

impl EventLogData<FtBurnLog> {
    pub fn validate(&self) -> bool {
        self.standard == NEP141_EVENT_STANDARD_STRING && self.event == "ft_burn"
    }
}

impl EventLogData<FtTransferLog> {
    pub fn validate(&self) -> bool {
        self.standard == NEP141_EVENT_STANDARD_STRING && self.event == "ft_transfer"
    }
}

impl EventLogData<NftMintLog> {
    pub fn validate(&self) -> bool {
        self.standard == NEP171_EVENT_STANDARD_STRING && self.event == "nft_mint"
    }
}

impl EventLogData<NftBurnLog> {
    pub fn validate(&self) -> bool {
        self.standard == NEP171_EVENT_STANDARD_STRING && self.event == "nft_burn"
    }
}

impl EventLogData<NftTransferLog> {
    pub fn validate(&self) -> bool {
        self.standard == NEP171_EVENT_STANDARD_STRING && self.event == "nft_transfer"
    }
}

impl EventLogData<NftContractMetadataUpdateLog> {
    pub fn validate(&self) -> bool {
        self.standard == NEP171_EVENT_STANDARD_STRING
            && self.event == "nft_contract_metadata_update"
    }
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct FtMetadata {
    pub decimals: u32,
    pub symbol: String,
    pub name: String,
    #[serde(default)]
    pub icon: Option<String>,
}

#[cached(result = true)]
pub async fn get_ft_metadata(ft_contract_id: AccountId) -> Result<FtMetadata, String> {
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let mut metadata = client()
        .call::<FtMetadata>(
            ft_contract_id.clone(),
            "ft_metadata",
            serde_json::json!({}),
            Default::default(),
        )
        .await
        .map_err(|e| e.to_string())?;
    if !metadata
        .icon
        .as_ref()
        .is_some_and(|icon| icon.starts_with("data:"))
    {
        metadata.icon = None;
    }
    if metadata.icon.is_none() && ft_contract_id == "wrap.near" {
        metadata.icon = Some(format!(
            "data:image/svg+xml;base64,{}",
            BASE64_STANDARD.encode(include_bytes!("./data/near.svg"))
        ));
    }
    Ok(metadata)
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct NftCollectionMetadata {
    pub name: String,
    pub symbol: String,
    #[serde(default)]
    pub icon: Option<String>,
    #[serde(default)]
    pub base_uri: Option<String>,
    #[serde(default)]
    pub reference: Option<String>,
    #[serde(default)]
    pub reference_hash: Option<String>,
}

#[cached(result = true)]
pub async fn get_nft_collection_metadata(
    nft_contract_id: AccountId,
) -> Result<NftCollectionMetadata, String> {
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let mut metadata = client()
        .call::<NftCollectionMetadata>(
            nft_contract_id.clone(),
            "nft_metadata",
            serde_json::json!({}),
            Default::default(),
        )
        .await
        .map_err(|e| e.to_string())?;
    if !metadata
        .icon
        .as_ref()
        .is_some_and(|icon| icon.starts_with("data:"))
    {
        metadata.icon = None;
    }
    Ok(metadata)
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct NftToken {
    token_id: String,
    owner_id: AccountId,
    metadata: NftTokenMetadata,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct NftTokenMetadata {
    #[serde(default)]
    pub title: Option<String>,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(default)]
    pub media: Option<String>,
    #[serde(default)]
    pub media_hash: Option<String>,
    #[serde(default)]
    pub copies: Option<u64>,
    #[serde(default)]
    pub issued_at: Option<u64>,
    #[serde(default)]
    pub expires_at: Option<u64>,
    #[serde(default)]
    pub starts_at: Option<u64>,
    #[serde(default)]
    pub updated_at: Option<u64>,
    #[serde(default)]
    pub extra: Option<String>,
    #[serde(default)]
    pub reference: Option<String>,
    #[serde(default)]
    pub reference_hash: Option<String>,
}

#[cached(result = true)]
pub async fn get_nft_token(
    nft_contract_id: AccountId,
    token_id: String,
) -> Result<NftToken, String> {
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    client()
        .call::<NftToken>(
            nft_contract_id.clone(),
            "nft_token",
            serde_json::json!({ "token_id": token_id }),
            Default::default(),
        )
        .await
        .map_err(|e| e.to_string())
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(transparent, deny_unknown_fields)]
pub struct RefDclSwapLog(pub Vec<RefDclSwapEvent>);

impl Deref for RefDclSwapLog {
    type Target = Vec<RefDclSwapEvent>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(deny_unknown_fields)]
pub struct RefDclSwapEvent {
    #[serde(with = "dec_format")]
    pub amount_in: Balance,
    #[serde(with = "dec_format")]
    pub amount_out: Balance,
    pub pool_id: String,
    #[serde(with = "dec_format")]
    pub protocol_fee: Balance,
    pub swapper: AccountId,
    pub token_in: AccountId,
    pub token_out: AccountId,
    #[serde(with = "dec_format")]
    pub total_fee: Balance,
}

impl EventLogData<RefDclSwapLog> {
    pub fn validate(&self) -> bool {
        self.standard == "dcl.ref" && self.event == "swap"
    }
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(transparent, deny_unknown_fields)]
pub struct VeaxSwapLog(pub VeaxSwapEvent);

impl Deref for VeaxSwapLog {
    type Target = VeaxSwapEvent;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
#[serde(deny_unknown_fields)]
pub struct VeaxSwapEvent {
    pub user: AccountId,
    pub tokens: (AccountId, AccountId),
    pub amounts: (String, String),    // (Balance, Balance)
    pub fees: Vec<serde_json::Value>, // Not implemented
}

impl EventLogData<VeaxSwapLog> {
    pub fn validate(&self) -> bool {
        self.standard == "veax" && self.event == "swap"
    }
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct StorageBalance {
    pub available: NearToken,
    pub total: NearToken,
}
