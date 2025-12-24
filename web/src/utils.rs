use base64::{Engine, prelude::BASE64_STANDARD};
use bigdecimal::{BigDecimal, One, RoundingMode, ToPrimitive, Zero, num_bigint::BigInt};
use borsh::BorshSerialize;
use cached::proc_macro::cached;
use futures_util::lock::Mutex;
use leptos::prelude::*;
use near_min_api::{
    RpcClient,
    types::{
        AccessKey as NearAccessKey, AccessKeyPermission, AccountId, AccountIdRef,
        Action as NearAction, AddKeyAction, Balance, CreateAccountAction, CryptoHash,
        DelegateAction, DeleteAccountAction, DeleteKeyAction, DeployContractAction,
        DeployGlobalContractAction, FunctionCallAction, FunctionCallPermission,
        GlobalContractDeployMode, GlobalContractIdentifier, NearToken, StakeAction, TransferAction,
        UseGlobalContractAction,
        near_crypto::{PublicKey, Signature},
    },
    utils::dec_format,
};
use serde::Deserialize;
use std::{fmt::Display, ops::Deref, str::FromStr, sync::Arc, time::Duration};
use wasm_bindgen::{JsValue, prelude::wasm_bindgen};
use web_sys::js_sys::{Promise, Reflect};

use crate::contexts::{
    accounts_context::{AccountsContext, SecretKeyHolder, UserCancelledSigning},
    config_context::{ConfigContext, LedgerMode},
    network_context::Network,
    rpc_context::RpcContext,
    tokens_context::{Token, TokenData, TokenInfo, TokenMetadata},
};

pub const USDT_DECIMALS: u32 = 6;

const AMOUNT_SUFFIXES: &[(u64, &str)] = &[
    (1_000_000_000_000, "T"),
    (1_000_000_000, "B"),
    (1_000_000, "M"),
    (1_000, "K"),
];

#[track_caller]
pub fn format_token_amount(balance: Balance, decimals: u32, symbol: &str) -> String {
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    if config().amounts_hidden {
        return "😭".to_string();
    }
    format_token_amount_no_hide(balance, decimals, symbol)
}

#[track_caller]
pub fn format_token_amount_no_hide(amount: Balance, decimals: u32, symbol: &str) -> String {
    let short = if let Some(config_context) = use_context::<ConfigContext>() {
        config_context.config.get().short_amounts
    } else {
        false
    };
    let normalized_decimal = balance_to_decimal(amount, decimals);
    let formatted_balance = format_number(normalized_decimal, short, true);
    format!("{formatted_balance} {symbol}")
}

pub fn format_token_amount_full_precision(amount: Balance, decimals: u32, symbol: &str) -> String {
    let normalized_decimal = balance_to_decimal(amount, decimals);
    let mut amount = normalized_decimal.to_string();
    if amount.contains('.') {
        amount = amount
            .trim_end_matches('0')
            .trim_end_matches('.')
            .to_string();
    }
    format!("{amount} {symbol}")
}

pub fn format_number(number: BigDecimal, short: bool, suffixes: bool) -> String {
    if !short {
        let mut amount_str = number.to_string();
        if amount_str.contains('.') {
            amount_str = amount_str
                .trim_end_matches('0')
                .trim_end_matches('.')
                .to_string();
        }
        return amount_str;
    }

    if suffixes {
        for (divisor, suffix) in AMOUNT_SUFFIXES {
            let divisor_decimal = BigDecimal::from(*divisor);
            if number.abs() >= divisor_decimal {
                let value_decimal = &number / &divisor_decimal;
                return match &value_decimal {
                    x if x.is_integer() => {
                        format!("{value_decimal:.0}{suffix}")
                    }
                    _ => format!("{value_decimal:.2}{suffix}"),
                };
            }
        }
    }

    format!(
        "{}",
        number.with_scale_round(
            match number.abs() {
                x if x >= BigDecimal::from_str("0.1").unwrap() => 2,
                x if x >= BigDecimal::from_str("0.01").unwrap() => 3,
                x if x >= BigDecimal::from_str("0.001").unwrap() => 4,
                x if x >= BigDecimal::from_str("0.0001").unwrap() => 5,
                x if x >= BigDecimal::from_str("0.00001").unwrap() => 6,
                x if x >= BigDecimal::from_str("0.000001").unwrap() => 7,
                x if x >= BigDecimal::from_str("0.0000001").unwrap() => 8,
                x if x >= BigDecimal::from_str("0.00000001").unwrap() => 9,
                x if x >= BigDecimal::from_str("0.000000001").unwrap() => 10,
                x if x >= BigDecimal::from_str("0.0000000001").unwrap() => 11,
                x if x >= BigDecimal::from_str("0.00000000001").unwrap() => 12,
                _ => 0,
            },
            RoundingMode::Down
        )
    )
}

#[track_caller]
pub fn format_usd_value(value: BigDecimal) -> String {
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    if config().amounts_hidden {
        return "😭".to_string();
    }
    format_usd_value_no_hide(value)
}

#[track_caller]
pub fn format_usd_value_no_hide(value: BigDecimal) -> String {
    let one = BigDecimal::from(1);
    if value.abs() < one {
        let is_negative = value < BigDecimal::from(0);
        let sign = if is_negative { "-" } else { "" };
        let abs_value = value.abs();
        return match &abs_value {
            x if x.is_zero() => "$0".to_string(),
            x if x.gt(&BigDecimal::from_str("0.1").unwrap()) => format!("{sign}${abs_value:.2}"),
            x if x.gt(&BigDecimal::from_str("0.01").unwrap()) => format!("{sign}${abs_value:.3}"),
            x if x.gt(&BigDecimal::from_str("0.001").unwrap()) => format!("{sign}${abs_value:.4}"),
            _ => format!("{sign}$0"),
        };
    }

    let is_negative = value < BigDecimal::from(0);
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

#[track_caller]
pub fn format_account_id(account_id: &AccountIdRef) -> AnyView {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    if let Some(selected_account) = accounts().selected_account_id
        && selected_account == *account_id
    {
        let ConfigContext { config, .. } = expect_context::<ConfigContext>();
        if config().amounts_hidden {
            return "😭".into_any();
        }
    }
    format_account_id_no_hide(account_id)
}

#[track_caller]
pub fn format_account_id_no_hide(account_id: &AccountIdRef) -> AnyView {
    view! {
        <span class="items-center gap-1 inline-flex max-w-full">
            <span class="truncate max-w-48">{account_id.to_string()}</span>
        </span>
    }
    .into_any()
}

#[track_caller]
pub fn format_account_id_full(account_id: &AccountIdRef) -> AnyView {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    if let Some(selected_account) = accounts().selected_account_id
        && selected_account == *account_id
    {
        let ConfigContext { config, .. } = expect_context::<ConfigContext>();
        if config().amounts_hidden {
            return "😭".into_any();
        }
    }
    format_account_id_full_no_hide(account_id)
}

pub fn format_account_id_full_no_hide(account_id: &AccountIdRef) -> AnyView {
    view! {
        <span class="items-center gap-1 inline-flex max-w-full">
            <span>{account_id.to_string()}</span>
        </span>
    }
    .into_any()
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
                write!(f, "Deserialization error: {e}")
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
            .map_err(|e| format!("Failed to parse transfer amount: {e}"))?;
        let parts: Vec<&str> = parts[1].split(" to ").collect();
        if parts.len() < 2 {
            return Err("Log doesn't contain ' to '".to_string());
        }
        if parts.len() > 2 {
            return Err("Log contains multiple ' to '".to_string());
        }
        let old_owner_id = parts[0]
            .parse()
            .map_err(|e| format!("Failed to parse old owner ID: {e}"))?;
        let new_owner_id = parts[1]
            .parse()
            .map_err(|e| format!("Failed to parse new owner ID: {e}"))?;
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

lazy_static::lazy_static! {
    pub static ref TOKEN_CACHE: Mutex<Vec<TokenData>> = Mutex::new(Vec::new());
}

#[cached(
    result = true,
    key = "AccountId",
    convert = "{ ft_contract_id.clone() }"
)]
pub async fn get_ft_metadata(
    ft_contract_id: AccountId,
    rpc_client: RpcClient,
) -> Result<TokenMetadata, String> {
    if let Some(token) = TOKEN_CACHE
        .lock()
        .await
        .iter()
        .find(|t| t.token.account_id == Token::Nep141(ft_contract_id.clone()))
    {
        return Ok(token.token.metadata.clone());
    }
    let mut metadata = rpc_client
        .call::<TokenMetadata>(
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
    if metadata.icon.is_none()
        && (ft_contract_id == "wrap.near" || ft_contract_id == "wrap.testnet")
    {
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
pub struct StorageBalance {
    pub available: NearToken,
    pub total: NearToken,
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct WalletSelectorTransaction {
    pub signer_id: AccountId,
    pub receiver_id: AccountId,
    pub actions: Vec<WalletSelectorAction>,
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum WalletSelectorContractIdentifier {
    AccountId(AccountId),
    CodeHash(CryptoHash),
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
pub enum WalletSelectorDeployMode {
    CodeHash,
    AccountId,
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(tag = "type", content = "params")]
pub enum WalletSelectorAction {
    CreateAccount,
    DeployContract {
        code: Vec<u8>,
    },
    #[serde(rename_all = "camelCase")]
    FunctionCall {
        method_name: String,
        args: serde_json::Value,
        #[serde(with = "dec_format")]
        gas: u64,
        #[serde(with = "dec_format")]
        deposit: Balance,
    },
    Transfer {
        #[serde(with = "dec_format")]
        deposit: Balance,
    },
    #[serde(rename_all = "camelCase")]
    Stake {
        #[serde(with = "dec_format")]
        stake: Balance,
        public_key: PublicKey,
    },
    #[serde(rename_all = "camelCase")]
    AddKey {
        public_key: PublicKey,
        access_key: WalletSelectorAccessKey,
    },
    #[serde(rename_all = "camelCase")]
    DeleteKey {
        public_key: PublicKey,
    },
    #[serde(rename_all = "camelCase")]
    DeleteAccount {
        beneficiary_id: AccountId,
    },
    #[serde(rename_all = "camelCase")]
    UseGlobalContract {
        contract_identifier: WalletSelectorContractIdentifier,
    },
    #[serde(rename_all = "camelCase")]
    DeployGlobalContract {
        code: Vec<u8>,
        deploy_mode: WalletSelectorDeployMode,
    },
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct WalletSelectorAccessKey {
    pub nonce: Option<u64>,
    pub permission: WalletSelectorAccessKeyPermission,
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(untagged)]
pub enum WalletSelectorAccessKeyPermission {
    FullAccess,
    FunctionCall {
        receiver_id: AccountId,
        allowance: Option<NearToken>,
        method_names: Option<Vec<String>>,
    },
}

impl From<WalletSelectorAction> for NearAction {
    fn from(action: WalletSelectorAction) -> Self {
        match action {
            WalletSelectorAction::CreateAccount => {
                NearAction::CreateAccount(CreateAccountAction {})
            }
            WalletSelectorAction::DeployContract { code } => {
                NearAction::DeployContract(DeployContractAction { code })
            }
            WalletSelectorAction::FunctionCall {
                method_name,
                args,
                gas,
                deposit,
            } => NearAction::FunctionCall(Box::new(FunctionCallAction {
                method_name,
                args: serde_json::to_vec(&args).unwrap_or_default(),
                gas,
                deposit: NearToken::from_yoctonear(deposit),
            })),
            WalletSelectorAction::Transfer { deposit } => NearAction::Transfer(TransferAction {
                deposit: NearToken::from_yoctonear(deposit),
            }),
            WalletSelectorAction::Stake { stake, public_key } => {
                NearAction::Stake(Box::new(StakeAction {
                    stake: NearToken::from_yoctonear(stake),
                    public_key,
                }))
            }
            WalletSelectorAction::AddKey {
                public_key,
                access_key,
            } => NearAction::AddKey(Box::new(AddKeyAction {
                public_key,
                access_key: NearAccessKey {
                    nonce: access_key.nonce.unwrap_or_default(),
                    permission: match access_key.permission {
                        WalletSelectorAccessKeyPermission::FullAccess => {
                            AccessKeyPermission::FullAccess
                        }
                        WalletSelectorAccessKeyPermission::FunctionCall {
                            receiver_id,
                            allowance,
                            method_names,
                        } => AccessKeyPermission::FunctionCall(FunctionCallPermission {
                            receiver_id: receiver_id.to_string(),
                            allowance,
                            method_names: method_names.unwrap_or_default(),
                        }),
                    },
                },
            })),
            WalletSelectorAction::DeleteKey { public_key } => {
                NearAction::DeleteKey(Box::new(DeleteKeyAction { public_key }))
            }
            WalletSelectorAction::DeleteAccount { beneficiary_id } => {
                NearAction::DeleteAccount(DeleteAccountAction { beneficiary_id })
            }
            WalletSelectorAction::UseGlobalContract {
                contract_identifier,
            } => NearAction::UseGlobalContract(Box::new(UseGlobalContractAction {
                contract_identifier: match contract_identifier {
                    WalletSelectorContractIdentifier::AccountId(account_id) => {
                        GlobalContractIdentifier::AccountId(account_id)
                    }
                    WalletSelectorContractIdentifier::CodeHash(code_hash) => {
                        GlobalContractIdentifier::CodeHash(code_hash)
                    }
                },
            })),
            WalletSelectorAction::DeployGlobalContract { code, deploy_mode } => {
                NearAction::DeployGlobalContract(DeployGlobalContractAction {
                    code: Arc::from(code),
                    deploy_mode: match deploy_mode {
                        WalletSelectorDeployMode::CodeHash => GlobalContractDeployMode::CodeHash,
                        WalletSelectorDeployMode::AccountId => GlobalContractDeployMode::AccountId,
                    },
                })
            }
        }
    }
}

/// Returns 10 raised to the power of `decimals`
pub fn power_of_10(decimals: u32) -> BigDecimal {
    BigDecimal::from_bigint(BigInt::one(), -(decimals as i64))
}

pub fn balance_to_decimal(balance: Balance, decimals: u32) -> BigDecimal {
    let balance_decimal = BigDecimal::from(balance);
    let decimals_decimal = power_of_10(decimals);
    balance_decimal / decimals_decimal
}

pub fn decimal_to_balance(decimal: BigDecimal, decimals: u32) -> Balance {
    let decimals_decimal = power_of_10(decimals);
    (decimal * decimals_decimal).to_u128().unwrap_or_default()
}

pub fn is_debug_enabled() -> bool {
    if let Ok(debug_value) = Reflect::get(&window(), &"DEBUG".into())
        && debug_value.as_bool().unwrap_or(false)
    {
        return true;
    }

    if let Ok(Some(local_storage)) = window().local_storage()
        && let Ok(Some(debug_value)) = local_storage.get_item("DEBUG")
    {
        let debug_str = debug_value.trim().to_lowercase();
        if !debug_str.is_empty() {
            return true;
        }
    }
    false
}

#[cached(time = 5, option = true)]
pub async fn fetch_token_info(token_id: AccountId, network: Network) -> Option<TokenInfo> {
    let api_url = match network {
        Network::Mainnet => "https://prices.intear.tech".to_string(),
        Network::Testnet => "https://prices-testnet.intear.tech".to_string(),
        Network::Localnet(network) => {
            if let Some(url) = &network.prices_api_url {
                url.clone()
            } else {
                return None;
            }
        }
    };
    let response = reqwest::get(format!("{api_url}/token?token_id={token_id}"))
        .await
        .ok()?;
    let token_data: TokenInfo = response.json().await.ok()?;
    Some(token_data)
}

#[derive(Debug, BorshSerialize)]
pub struct NEP413Payload {
    pub message: String,
    pub nonce: [u8; 32],
    pub recipient: String,
    pub callback_url: Option<String>,
}

pub async fn sign_nep413(
    secret_key: SecretKeyHolder,
    payload: &NEP413Payload,
    context: AccountsContext,
    ledger_mode: impl Fn() -> LedgerMode,
) -> Result<Signature, UserCancelledSigning> {
    const NEP413_413_SIGN_MESSAGE_PREFIX: u32 = (1u32 << 31u32) + 413u32;
    let mut bytes = NEP413_413_SIGN_MESSAGE_PREFIX.to_le_bytes().to_vec();
    borsh::to_writer(&mut bytes, payload).unwrap();
    log::info!("Signing NEP-413 payload: {:?}", bytes);
    secret_key.hash_and_sign(&bytes, context, ledger_mode).await
}

pub async fn sign_nep366(
    secret_key: SecretKeyHolder,
    payload: &DelegateAction,
    context: AccountsContext,
    ledger_mode: impl Fn() -> LedgerMode,
) -> Result<Signature, UserCancelledSigning> {
    if payload.public_key != secret_key.public_key() {
        // This should never happen in correct implementations
        return Err(UserCancelledSigning);
    }
    const NEP366_366_SIGN_MESSAGE_PREFIX: u32 = (1u32 << 30u32) + 366u32;
    let mut bytes = NEP366_366_SIGN_MESSAGE_PREFIX.to_le_bytes().to_vec();
    borsh::to_writer(&mut bytes, payload).unwrap();
    log::info!("Signing NEP-366 payload: {:?}", bytes);
    secret_key.hash_and_sign(&bytes, context, ledger_mode).await
}

pub fn is_tauri() -> bool {
    if let Ok(tauri_value) = Reflect::get(&window(), &"__TAURI__".into()) {
        return !tauri_value.is_undefined();
    }
    false
}

pub fn is_android() -> bool {
    if !is_tauri() {
        return false;
    }
    platform() == "android"
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["__TAURI__", "core"], js_name = "invoke")]
    pub fn tauri_invoke(cmd: &str, args: &JsValue) -> Promise;
    #[wasm_bindgen(js_namespace = ["__TAURI__", "core"], js_name = "invoke")]
    pub fn tauri_invoke_no_args(cmd: &str) -> Promise;
    #[wasm_bindgen(js_namespace = ["__TAURI_PLUGIN_OS__"])]
    pub fn platform() -> String;
}

pub enum Resolution {
    Low,
    High,
}

pub fn proxify_url(url: &str, resolution: Resolution) -> String {
    if url.starts_with("data:") {
        return url.to_string();
    }
    let proxy_base = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");
    let encoded_url =
        percent_encoding::utf8_percent_encode(url, percent_encoding::NON_ALPHANUMERIC).to_string();
    format!("{proxy_base}/media/{resolution}/{encoded_url}")
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = generateQRCode)]
    async fn generate_qr_code_js(data: &str, include_logo: bool) -> JsValue;
}

pub async fn generate_qr_code(data: &str, include_logo: bool) -> Result<String, JsValue> {
    let result = generate_qr_code_js(data, include_logo).await;
    if result.is_string() {
        Ok(result.as_string().unwrap())
    } else {
        Err(result)
    }
}
