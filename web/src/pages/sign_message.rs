use std::time::Duration;

use base64::{Engine, prelude::BASE64_STANDARD};
use borsh::BorshSerialize;
use chrono::{DateTime, Utc};
use leptos::{prelude::*, task::spawn_local};
use leptos_router::hooks::use_location;
use near_min_api::types::{
    AccountId, CryptoHash,
    near_crypto::{PublicKey, Signature},
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsCast;
use web_sys::{Window, js_sys::Date};

use crate::{
    contexts::{
        accounts_context::{AccountsContext, LedgerSigningState},
        connected_apps_context::ConnectedAppsContext,
        network_context::Network,
        security_log_context::add_security_log,
    },
    utils::{NEP413Payload, fetch_token_info, format_token_amount, sign_nep413},
};
use crate::{pages::connect::submit_tauri_response, utils::is_debug_enabled};
use leptos_icons::*;

#[derive(Clone, Debug)]
pub enum WarningType {
    PastDeadline,
    SignerMismatch,
    LongDeadline,
    UnauthorizedPublicKey,
}

#[derive(Clone, Debug)]
pub struct Warning {
    pub warning_type: WarningType,
    pub message: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct SignMessageRequest {
    message: String,
    account_id: AccountId,
    public_key: PublicKey,
    nonce: u64,
    signature: Signature,
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
enum ReceiveMessage {
    SignMessage {
        data: SignMessageRequest,
    },
    #[serde(rename_all = "camelCase")]
    TauriWalletSession {
        session_id: String,
    },
}

#[derive(Serialize, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
enum SendMessage {
    Ready,
    Signed { signature: SignedMessage },
    Error { message: String },
}

#[derive(Deserialize, Debug, Clone, BorshSerialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageToSign {
    pub message: String,
    pub nonce: [u8; 32],
    pub recipient: String,
    pub callback_url: Option<String>,
    #[borsh(skip)]
    pub state: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SignedMessage {
    pub account_id: AccountId,
    pub public_key: PublicKey,
    pub signature: Signature,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<String>,
}

// Only valid if:
// - recipient == "intents.near"
// - signer_id in the message == signer id of the message
// Warning is displayed if deadline is longer than 10 minutes in the future
#[derive(Deserialize, Debug, Clone)]
pub struct IntentsMessage {
    signer_id: AccountId,
    deadline: DateTime<Utc>,
    #[serde(default)]
    intents: Vec<intents::Intent>,
}

#[allow(unused)]
mod intents {
    use std::{collections::BTreeMap, fmt::Debug, str::FromStr};

    use near_min_api::{
        types::{AccountId, Balance, NearGas, NearToken, near_crypto::PublicKey},
        utils::{dec_format, dec_format_vec},
    };
    use serde::{Deserialize, Deserializer};
    use serde_with::{
        DeserializeAs, DeserializeFromStr, DisplayFromStr,
        base64::{Alphabet, Standard},
        formats::{Format, Padded},
        serde_as,
    };

    #[derive(Debug, Clone, Deserialize)]
    #[serde(tag = "intent", rename_all = "snake_case")]
    pub enum Intent {
        AddPublicKey(AddPublicKey),
        RemovePublicKey(RemovePublicKey),
        InvalidateNonces(InvalidateNonces),
        Transfer(Transfer),
        FtWithdraw(FtWithdraw),
        NftWithdraw(NftWithdraw),
        MtWithdraw(MtWithdraw),
        NativeWithdraw(NativeWithdraw),
        StorageDeposit(StorageDeposit),
        TokenDiff(TokenDiff),
        SetAuthByPredecessorId(SetAuthByPredecessorId),
        AuthCall(AuthCall),
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct AddPublicKey {
        pub public_key: PublicKey,
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct RemovePublicKey {
        pub public_key: PublicKey,
    }

    pub type U256 = [u8; 32];

    type Nonce = U256;

    pub struct Base64<ALPHABET: Alphabet = Standard, PADDING: Format = Padded>(
        ::serde_with::base64::Base64<ALPHABET, PADDING>,
    );

    impl<'de, T, ALPHABET, FORMAT> DeserializeAs<'de, T> for Base64<ALPHABET, FORMAT>
    where
        T: TryFrom<Vec<u8>>,
        ALPHABET: Alphabet,
        FORMAT: Format,
    {
        fn deserialize_as<D>(deserializer: D) -> Result<T, D::Error>
        where
            D: Deserializer<'de>,
        {
            ::serde_with::base64::Base64::<ALPHABET, FORMAT>::deserialize_as(deserializer)
        }
    }

    #[serde_as]
    #[derive(Debug, Clone, Deserialize)]
    pub struct InvalidateNonces {
        #[serde_as(as = "Vec<Base64>")]
        pub nonces: Vec<Nonce>,
    }

    #[serde_as]
    #[derive(Debug, Clone, Deserialize)]
    pub struct Transfer {
        pub receiver_id: AccountId,
        #[serde_as(as = "BTreeMap<_, DisplayFromStr>")]
        pub tokens: BTreeMap<TokenId, i128>,
        #[serde(default)]
        pub memo: Option<String>,
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct FtWithdraw {
        pub token: AccountId,
        pub receiver_id: AccountId,
        #[serde(with = "dec_format")]
        pub amount: Balance,
        #[serde(default)]
        pub memo: Option<String>,
        #[serde(default)]
        pub msg: Option<String>,
        #[serde(default)]
        pub storage_deposit: Option<NearToken>,
        #[serde(default)]
        pub min_gas: Option<NearGas>,
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct NftWithdraw {
        pub token: AccountId,
        pub receiver_id: AccountId,
        pub token_id: String,
        #[serde(default)]
        pub memo: Option<String>,
        #[serde(default)]
        pub msg: Option<String>,
        #[serde(default)]
        pub storage_deposit: Option<NearToken>,
        #[serde(default)]
        pub min_gas: Option<NearGas>,
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct MtWithdraw {
        pub token: AccountId,
        pub receiver_id: AccountId,
        pub token_ids: Vec<String>,
        #[serde(with = "dec_format_vec")]
        pub amounts: Vec<Balance>,
        #[serde(default)]
        pub memo: Option<String>,
        #[serde(default)]
        pub msg: Option<String>,
        #[serde(default)]
        pub storage_deposit: Option<NearToken>,
        #[serde(default)]
        pub min_gas: Option<NearGas>,
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct NativeWithdraw {
        pub receiver_id: AccountId,
        pub amount: NearToken,
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct StorageDeposit {
        pub contract_id: AccountId,
        #[serde(
            // There was field collision for `account_id` in `AccountEvent`,
            // but we keep it for backwards-compatibility
            alias = "account_id",
        )]
        pub deposit_for_account_id: AccountId,
        pub amount: NearToken,
    }

    #[serde_as]
    #[derive(Debug, Clone, Deserialize)]
    pub struct TokenDiff {
        #[serde_as(as = "BTreeMap<_, DisplayFromStr>")]
        pub diff: BTreeMap<TokenId, i128>,

        #[serde(default)]
        pub memo: Option<String>,

        #[serde(default)]
        pub referral: Option<AccountId>,
    }

    #[derive(Clone, PartialOrd, Ord, PartialEq, Eq, DeserializeFromStr)]
    pub enum TokenId {
        Nep141(Nep141TokenId),
        Nep171(Nep171TokenId),
        Nep245(Nep245TokenId),
    }

    #[derive(Clone, PartialOrd, Ord, PartialEq, Eq)]
    pub struct Nep141TokenId {
        pub contract_id: AccountId,
    }

    impl std::fmt::Debug for Nep141TokenId {
        #[inline]
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            write!(f, "{}", self.contract_id)
        }
    }

    impl FromStr for Nep141TokenId {
        type Err = String;

        fn from_str(data: &str) -> Result<Self, Self::Err> {
            Ok(Self {
                contract_id: data.parse().map_err(|_| "Invalid token ID".to_string())?,
            })
        }
    }

    #[derive(Clone, PartialOrd, Ord, PartialEq, Eq)]
    pub struct Nep171TokenId {
        pub contract_id: AccountId,
        pub nft_token_id: String,
    }

    impl std::fmt::Debug for Nep171TokenId {
        #[inline]
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            write!(f, "{}:{}", self.contract_id, self.nft_token_id)
        }
    }

    impl FromStr for Nep171TokenId {
        type Err = String;

        fn from_str(data: &str) -> Result<Self, Self::Err> {
            let (contract_id, token_id) =
                data.split_once(':').ok_or("Invalid token ID".to_string())?;
            Ok(Self {
                contract_id: contract_id
                    .parse()
                    .map_err(|_| "Invalid token ID".to_string())?,
                nft_token_id: token_id.to_string(),
            })
        }
    }

    #[derive(Clone, PartialOrd, Ord, PartialEq, Eq)]
    pub struct Nep245TokenId {
        pub contract_id: AccountId,
        pub mt_token_id: String,
    }

    impl std::fmt::Debug for Nep245TokenId {
        #[inline]
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            write!(f, "{}:{}", self.contract_id, self.mt_token_id)
        }
    }

    impl FromStr for Nep245TokenId {
        type Err = String;

        fn from_str(data: &str) -> Result<Self, Self::Err> {
            let (contract_id, token_id) =
                data.split_once(':').ok_or("Invalid token ID".to_string())?;
            Ok(Self {
                contract_id: contract_id
                    .parse()
                    .map_err(|_| "Invalid token ID".to_string())?,
                mt_token_id: token_id.to_string(),
            })
        }
    }

    impl Debug for TokenId {
        #[inline]
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            match self {
                Self::Nep141(token_id) => {
                    write!(f, "nep141:{:?}", token_id)
                }
                Self::Nep171(token_id) => {
                    write!(f, "nep171:{:?}", token_id)
                }
                Self::Nep245(token_id) => {
                    write!(f, "nep245:{:?}", token_id)
                }
            }
        }
    }

    impl FromStr for TokenId {
        type Err = String;

        #[inline]
        fn from_str(s: &str) -> Result<Self, Self::Err> {
            let (typ, data) = s.split_once(':').ok_or("Invalid token ID")?;
            match typ {
                "nep141" => data.parse().map(Self::Nep141),
                "nep171" => data.parse().map(Self::Nep171),
                "nep245" => data.parse().map(Self::Nep245),
                _ => Err("Invalid token ID".to_string()),
            }
        }
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct SetAuthByPredecessorId {
        pub enabled: bool,
    }

    #[derive(Debug, Clone, Deserialize)]
    pub struct AuthCall {
        pub contract_id: AccountId,
        pub msg: String,
        #[serde(default)]
        pub attached_deposit: NearToken,
        #[serde(default)]
        pub min_gas: Option<NearGas>,
    }
}

#[component]
fn NativeWithdrawView(native: intents::NativeWithdraw) -> impl IntoView {
    let formatted_amount = format_token_amount(native.amount.as_yoctonear(), 24, "NEAR");

    view! {
        <div class="space-y-2">
            <div class="text-sm text-neutral-300">
                "Withdraw to " <span class="text-white">{native.receiver_id.to_string()}</span>
            </div>
            <div class="text-neutral-200 text-sm">{formatted_amount}</div>
        </div>
    }
}

#[component]
fn StorageDepositView(storage: intents::StorageDeposit) -> impl IntoView {
    let formatted_amount = format_token_amount(storage.amount.as_yoctonear(), 24, "NEAR");

    view! {
        <div class="space-y-2">
            <div class="text-sm text-neutral-300">
                "Storage deposit for "
                <span class="text-white">{storage.deposit_for_account_id.to_string()}</span> " on "
                <span class="text-white">{storage.contract_id.to_string()}</span>
            </div>
            <div class="text-neutral-200 text-sm">{formatted_amount}</div>
        </div>
    }
}

#[component]
fn AuthCallView(call: intents::AuthCall) -> impl IntoView {
    let formatted_amount = format_token_amount(call.attached_deposit.as_yoctonear(), 24, "NEAR");

    view! {
        <div class="space-y-2">
            <div class="text-sm text-neutral-300">
                "Contract call to " <span class="text-white">{call.contract_id.to_string()}</span>
            </div>
            {if call.attached_deposit.as_yoctonear() > 0 {
                view! {
                    <div class="text-neutral-200 text-sm">
                        "Attached deposit: " {formatted_amount}
                    </div>
                }
                    .into_any()
            } else {
                view! { <div class="text-neutral-400 text-sm">"No attached deposit"</div> }
                    .into_any()
            }}
        </div>
    }
}

#[component]
fn FtWithdrawView(ft: intents::FtWithdraw) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let network = accounts_context
        .accounts
        .get()
        .accounts
        .first()
        .map(|a| a.network.clone());

    let token_symbol_resource = LocalResource::new({
        let ft_token = ft.token.clone();
        let network = network.clone();
        move || {
            let ft_token = ft_token.clone();
            let network = network.clone();
            async move {
                if let Some(network) = network {
                    if let Some(token_info) = fetch_token_info(ft_token, network).await {
                        Some(token_info.metadata.symbol)
                    } else {
                        None
                    }
                } else {
                    None
                }
            }
        }
    });

    view! {
        <div class="space-y-2">
            <div class="text-sm text-neutral-300">
                "Withdraw "
                <Suspense fallback=move || {
                    view! { <span class="text-neutral-400">"loading..."</span> }
                }>
                    {move || {
                        token_symbol_resource
                            .get()
                            .map(|symbol_opt| {
                                if let Some(symbol) = symbol_opt {
                                    view! { <span class="text-white">{symbol}</span> }.into_any()
                                } else {
                                    view! {
                                        <span class="text-white">"[error loading ticker]"</span>
                                    }
                                        .into_any()
                                }
                            })
                    }}
                </Suspense> " to " <span class="text-white">{ft.receiver_id.to_string()}</span>
            </div>
            <TokenAmount
                token_id=intents::TokenId::Nep141(intents::Nep141TokenId {
                    contract_id: ft.token,
                })
                amount=ft.amount
                network=network.clone()
            />

            {if let Some(storage_deposit) = ft.storage_deposit {
                if storage_deposit.as_yoctonear() > 0 {
                    let formatted_deposit = format_token_amount(
                        storage_deposit.as_yoctonear(),
                        24,
                        "NEAR",
                    );
                    view! {
                        <div class="text-sm text-neutral-400">
                            "Includes Storage Deposit: "
                            <span class="text-neutral-200">{formatted_deposit}</span>
                        </div>
                    }
                        .into_any()
                } else {
                    ().into_any()
                }
            } else {
                ().into_any()
            }}
        </div>
    }
}

#[component]
fn TransferTokensView(transfer: intents::Transfer) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let network = accounts_context
        .accounts
        .get()
        .accounts
        .first()
        .map(|a| a.network.clone());

    view! {
        <div class="space-y-2">
            <div class="space-y-2">
                {transfer
                    .tokens
                    .iter()
                    .map(|(token, amount)| {
                        let abs_amount = amount.unsigned_abs();
                        view! {
                            <TokenAmount
                                token_id=token.clone()
                                amount=abs_amount
                                network=network.clone()
                            />
                        }
                    })
                    .collect_view()}
            </div>
        </div>
    }
}

#[component]
fn TokenDiffView(diff: intents::TokenDiff) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let network = accounts_context
        .accounts
        .get()
        .accounts
        .first()
        .map(|a| a.network.clone());

    let simple_swap = if diff.diff.len() == 2 {
        if let Some(token_in) = diff.diff.iter().find(|&(_, &amount)| amount > 0) {
            diff.diff
                .iter()
                .find(|&(_, &amount)| amount < 0)
                .map(|token_out| {
                    (
                        (token_in.0.clone(), u128::try_from(*token_in.1).unwrap()),
                        (token_out.0.clone(), u128::try_from(-token_out.1).unwrap()),
                    )
                })
        } else {
            None
        }
    } else {
        None
    };

    if let Some((token_in, token_out)) = simple_swap {
        view! {
            <div class="flex items-center gap-3 p-2 bg-neutral-700/20 rounded border border-neutral-600/30">
                <div class="flex items-center gap-2 flex-1">
                    <div class="text-right">
                        <TokenAmount
                            token_id=(token_out.0).clone()
                            amount={token_out.1}
                            network=network.clone()
                        />
                    </div>
                    <Icon
                        icon=icondata::LuArrowRight
                        width="20"
                        height="20"
                        attr:class="text-neutral-400 mx-2"
                    />
                    <div>
                        <TokenAmount
                            token_id=(token_in.0).clone()
                            amount={token_in.1}
                            network=network.clone()
                        />
                    </div>
                </div>
            </div>
        }.into_any()
    } else {
        view! {
            <div class="space-y-2">
                {diff
                    .diff
                    .iter()
                    .map(|(token, amount)| {
                        let abs_amount = amount.unsigned_abs();
                        view! {
                            <div class="flex items-center gap-2 p-1 bg-neutral-700/20 rounded">
                                <TokenAmount
                                    token_id=token.clone()
                                    amount=abs_amount
                                    network=network.clone()
                                />
                            </div>
                        }
                    })
                    .collect_view()}
            </div>
        }
        .into_any()
    }
}

#[component]
fn TokenAmount(
    token_id: intents::TokenId,
    amount: u128,
    network: Option<Network>,
) -> impl IntoView {
    let contract_id = match &token_id {
        intents::TokenId::Nep141(nep141) => Some(nep141.contract_id.clone()),
        _ => None,
    };

    let token_info_resource = LocalResource::new({
        move || {
            let network = network.clone();
            let contract_id = contract_id.clone();
            async move {
                if let (Some(contract_id), Some(network)) = (contract_id, network) {
                    fetch_token_info(contract_id, network).await
                } else {
                    None
                }
            }
        }
    });

    view! {
        <div class="text-neutral-200">
            <Suspense fallback=move || {
                view! { <span class="text-neutral-400">"Loading..."</span> }
            }>
                {move || {
                    token_info_resource
                        .get()
                        .map(|token_info_opt| {
                            if let Some(token_info) = token_info_opt {
                                let formatted = format_token_amount(
                                    amount,
                                    token_info.metadata.decimals,
                                    &token_info.metadata.symbol,
                                );
                                view! { <span class="text-sm">{formatted}</span> }.into_any()
                            } else {
                                // Fallback for non-NEP141 tokens or when fetch fails
                                view! {
                                    <span class="text-sm">{amount} {format!("{token_id:?}")}</span>
                                }
                                    .into_any()
                            }
                        })
                }}
            </Suspense>
        </div>
    }
}

#[component]
fn IntentItem(intent: intents::Intent, index: usize) -> impl IntoView {
    let intent_clone = intent.clone();
    let (icon, color, title, details) = match &intent {
        intents::Intent::AddPublicKey(add_key) => (
            icondata::LuKey,
            "text-green-400",
            "Add Public Key".to_string(),
            add_key.public_key.to_string(),
        ),
        intents::Intent::RemovePublicKey(remove_key) => (
            icondata::LuKeyRound,
            "text-red-400",
            "Remove Public Key".to_string(),
            remove_key.public_key.to_string(),
        ),
        // Will have better formatting once apps start using this intent
        intents::Intent::InvalidateNonces(_invalidate) => (
            icondata::LuShield,
            "text-yellow-400",
            "Invalidate Nonces".to_string(),
            String::new(),
        ),
        intents::Intent::Transfer(transfer) => (
            icondata::LuSend,
            "text-blue-400",
            format!("Transfer to {}", transfer.receiver_id),
            String::new(),
        ),
        intents::Intent::FtWithdraw(_ft) => (
            icondata::LuArrowUpRight,
            "text-purple-400",
            "Withdraw Token".to_string(),
            String::new(),
        ),
        // Will have better formatting once apps start using this intent
        intents::Intent::NftWithdraw(_nft) => (
            icondata::LuImage,
            "text-pink-400",
            "Withdraw NFT".to_string(),
            String::new(),
        ),
        // Will have better formatting once apps start using this intent
        intents::Intent::MtWithdraw(_mt) => (
            icondata::LuImages,
            "text-indigo-400",
            "Withdraw MT".to_string(),
            String::new(),
        ),
        intents::Intent::NativeWithdraw(_) => (
            icondata::LuCoins,
            "text-emerald-400",
            "Withdraw NEAR".to_string(),
            String::new(),
        ),
        // Will have better formatting once apps start using this intent
        intents::Intent::StorageDeposit(storage) => (
            icondata::LuHardDrive,
            "text-cyan-400",
            format!("Storage Deposit on {}", storage.contract_id),
            String::new(),
        ),
        intents::Intent::TokenDiff(_diff) => (
            icondata::LuArrowLeftRight,
            "text-purple-400",
            "Swap".to_string(),
            String::new(),
        ),
        // Will have better formatting once apps start using this intent
        intents::Intent::SetAuthByPredecessorId(auth) => (
            icondata::LuSettings,
            "text-gray-400",
            "Set Auth by Predecessor".to_string(),
            if auth.enabled { "Enabled" } else { "Disabled" }.to_string(),
        ),
        // Will have better formatting once apps start using this intent
        intents::Intent::AuthCall(call) => (
            icondata::LuPhone,
            "text-violet-400",
            format!("Auth Call to {}", call.contract_id),
            String::new(),
        ),
    };

    view! {
        <div class="flex items-start gap-3 p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/30">
            <div class="flex items-center justify-center w-4 h-4 rounded-full bg-neutral-700/50 text-xs text-neutral-300 font-medium mt-0.5">
                {(index + 1).to_string()}
            </div>
            <Icon icon=icon width="16" height="16" attr:class=color />
            <div class="flex-1 min-w-0 space-y-3">
                <div>
                    <p class="text-white text-sm font-medium">{title}</p>
                    {if !details.is_empty() {
                        view! { <p class="text-neutral-400 text-xs mt-1 break-words">{details}</p> }
                            .into_any()
                    } else {
                        ().into_any()
                    }}
                </div>

                {match intent_clone {
                    intents::Intent::TokenDiff(diff) => {
                        view! { <TokenDiffView diff=diff /> }.into_any()
                    }
                    intents::Intent::Transfer(transfer) => {
                        view! { <TransferTokensView transfer=transfer /> }.into_any()
                    }
                    intents::Intent::FtWithdraw(ft) => view! { <FtWithdrawView ft=ft /> }.into_any(),
                    intents::Intent::NativeWithdraw(native) => {
                        view! { <NativeWithdrawView native=native /> }.into_any()
                    }
                    intents::Intent::StorageDeposit(storage) => {
                        view! { <StorageDepositView storage=storage /> }.into_any()
                    }
                    intents::Intent::AuthCall(call) => {
                        view! { <AuthCallView call=call /> }.into_any()
                    }
                    _ => ().into_any(),
                }}
            </div>
        </div>
    }
}

#[component]
pub fn MessageDisplay(message: Signal<Option<MessageToSign>>) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let (format_message, set_format_message) = signal(true);
    let (message_copied, set_message_copied) = signal(false);
    let (recipient_copied, set_recipient_copied) = signal(false);
    let (cli_copied, set_cli_copied) = signal(false);

    let is_intents_message = move || {
        let Some(deserialized) = message.get() else {
            return false;
        };

        if deserialized.recipient != "intents.near" {
            return false;
        }

        serde_json::from_str::<IntentsMessage>(&deserialized.message).is_ok()
    };

    let is_formattable_message = move || {
        let Some(deserialized) = message.get() else {
            return false;
        };
        serde_json::from_str::<serde_json::Value>(&deserialized.message).is_ok()
    };

    let get_warnings = move || -> Vec<Warning> {
        let mut warnings = Vec::new();

        if let Some(deserialized) = message.get()
            && deserialized.recipient == "intents.near"
            && let Ok(intents_msg) = serde_json::from_str::<IntentsMessage>(&deserialized.message)
        {
            let now = chrono::Utc::now();
            let deadline_diff = intents_msg.deadline.signed_duration_since(now);

            // Check for past deadline
            if deadline_diff.num_seconds() < 0 {
                let past_duration = now.signed_duration_since(intents_msg.deadline);
                let total_minutes = past_duration.num_minutes();
                let text = if total_minutes >= 24 * 60 {
                    let days = total_minutes / (24 * 60);
                    if days == 1 {
                        "1 day".to_string()
                    } else {
                        format!("{} days", days)
                    }
                } else if total_minutes >= 60 {
                    let hours = total_minutes / 60;
                    if hours == 1 {
                        "1 hour".to_string()
                    } else {
                        format!("{} hours", hours)
                    }
                } else {
                    format!("{} minutes", total_minutes)
                };
                warnings.push(Warning {
                            warning_type: WarningType::PastDeadline,
                            message: format!("This request expired {} ago and will fail. Try again and next time sign it faster", text),
                        });
            }

            // Check for signer mismatch
            let current_account = accounts_context.accounts.get().selected_account_id;
            if Some(intents_msg.signer_id.clone()) != current_account {
                warnings.push(Warning {
                            warning_type: WarningType::SignerMismatch,
                            message: format!(
                                "This intent will be executed for account '{}' but you're connected with account {}",
                                intents_msg.signer_id,
                                current_account.as_ref().map(|a| a.to_string()).unwrap_or("unknown account".to_string())
                            ),
                        });
            }

            // Check for long deadline (only if not in the past)
            if deadline_diff.num_minutes() > 10 {
                let total_minutes = deadline_diff.num_minutes();
                let text = if total_minutes >= 1440 {
                    // 24 hours * 60 minutes
                    let days = total_minutes / 1440;
                    if days == 1 {
                        "1 day".to_string()
                    } else {
                        format!("{} days", days)
                    }
                } else if total_minutes >= 60 {
                    let hours = total_minutes / 60;
                    if hours == 1 {
                        "1 hour".to_string()
                    } else {
                        format!("{} hours", hours)
                    }
                } else {
                    format!("{} minutes", total_minutes)
                };
                warnings.push(Warning {
                    warning_type: WarningType::LongDeadline,
                    message: format!(
                        "This intent might be executed up to {} later after you sign it",
                        text
                    ),
                });
            }

            // Check for unauthorized public key additions
            let accounts_state = accounts_context.accounts.get();
            let current_account = accounts_state
                .accounts
                .iter()
                .find(|acc| Some(acc.account_id.clone()) == accounts_state.selected_account_id);

            if let Some(account) = current_account {
                let wallet_public_key = account.secret_key.public_key();

                for intent in &intents_msg.intents {
                    if let intents::Intent::AddPublicKey(add_key) = intent
                        && add_key.public_key != wallet_public_key
                    {
                        warnings.push(Warning {
                                        warning_type: WarningType::UnauthorizedPublicKey,
                                        message: "This intent will add a public key that is NOT owned by your wallet. This could allow someone else to control your account!".to_string(),
                                    });
                        break; // Only show one warning even if multiple unauthorized keys
                    }
                }
            }
        }

        warnings
    };

    let get_warning_styling =
        |warning_type: &WarningType| -> (&'static str, &'static str, &'static str) {
            match warning_type {
                WarningType::PastDeadline => (
                    "bg-red-900/30 border border-red-600/50",
                    "text-red-500",
                    "text-red-100 font-medium",
                ),
                WarningType::SignerMismatch => (
                    "bg-red-900/20 border border-red-500/30",
                    "text-red-400",
                    "text-red-200",
                ),
                WarningType::LongDeadline => (
                    "bg-amber-900/20 border border-amber-500/30",
                    "text-amber-400",
                    "text-amber-200",
                ),
                WarningType::UnauthorizedPublicKey => (
                    "bg-red-900/25 border border-red-500/40",
                    "text-red-400",
                    "text-red-200",
                ),
            }
        };

    let formatted_message = move || {
        let Some(message) = message.get() else {
            return String::new();
        };

        if format_message.get() && is_formattable_message() {
            match serde_json::from_str::<serde_json::Value>(&message.message) {
                Ok(json) => serde_json::to_string_pretty(&json).unwrap_or(message.message),
                Err(_) => message.message,
            }
        } else {
            message.message
        }
    };

    let copy_message = move |_| {
        let Some(message) = message.get() else {
            return;
        };
        let navigator = window().navigator();
        let _ = navigator.clipboard().write_text(&message.message);
        set_message_copied(true);
        set_timeout(
            move || set_message_copied(false),
            Duration::from_millis(2000),
        );
    };

    let copy_recipient = move |_| {
        let Some(deserialized) = message.get() else {
            return;
        };
        let navigator = window().navigator();
        let _ = navigator.clipboard().write_text(&deserialized.recipient);
        set_recipient_copied(true);
        set_timeout(
            move || set_recipient_copied(false),
            Duration::from_millis(2000),
        );
    };

    let copy_cli = move |_| {
        let Some(message) = message.get() else {
            return;
        };

        let nonce_base64 = BASE64_STANDARD.encode(message.nonce);

        let current_account = accounts_context
            .accounts
            .get()
            .selected_account_id
            .map(|id| id.to_string())
            .expect("No selected account");

        let command_parts = vec![
            "near".to_string(),
            "message".to_string(),
            "sign-nep413".to_string(),
            "utf8".to_string(),
            message.message,
            "nonce".to_string(),
            nonce_base64,
            "recipient".to_string(),
            message.recipient,
            "sign-as".to_string(),
            current_account,
        ];

        let command = shell_words::join(&command_parts);
        let navigator = window().navigator();
        let _ = navigator.clipboard().write_text(&command);
        set_cli_copied(true);
        set_timeout(move || set_cli_copied(false), Duration::from_millis(2000));
    };
    view! {
        <div>
            <div class="flex items-center justify-between mb-2">
                <p class="text-neutral-300 text-sm font-medium">"Asks you to sign the message:"</p>
                <div class="flex gap-2">
                    <button
                        class="text-xs text-blue-400 hover:text-blue-300 transition-colors p-2 bg-neutral-800 rounded flex items-center justify-center"
                        on:click=copy_message
                        title="Copy message"
                    >
                        {move || {
                            if message_copied.get() {
                                view! {
                                    <Icon
                                        icon=icondata::LuCheck
                                        width="14"
                                        height="14"
                                        attr:class="text-green-400"
                                    />
                                }
                                    .into_any()
                            } else {
                                view! { <Icon icon=icondata::LuClipboard width="14" height="14" /> }
                                    .into_any()
                            }
                        }}
                    </button>
                    <Show when=move || is_formattable_message()>
                        <button
                            class=move || {
                                if format_message.get() {
                                    "text-xs text-blue-600 hover:text-blue-500 transition-colors p-2 bg-blue-900/30 rounded flex items-center justify-center"
                                } else {
                                    "text-xs text-blue-400 hover:text-blue-300 transition-colors p-2 bg-neutral-800 rounded flex items-center justify-center"
                                }
                            }
                            on:click=move |_| {
                                set_format_message(!format_message.get());
                            }
                            title=move || {
                                if format_message.get() {
                                    "Show raw message"
                                } else {
                                    "Format the message"
                                }
                            }
                        >
                            {move || {
                                if format_message.get() {
                                    view! {
                                        <Icon icon=icondata::LuFileText width="14" height="14" />
                                    }
                                        .into_any()
                                } else {
                                    view! { <Icon icon=icondata::LuCode width="14" height="14" /> }
                                        .into_any()
                                }
                            }}
                        </button>
                    </Show>
                </div>
            </div>
            <div class="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                {move || {
                    if format_message.get() && is_intents_message() {
                        let Some(message_data) = message.get() else {
                            return // Render rich intents UI
                            view! {
                                <p class="text-neutral-400 text-sm">"Failed to load message"</p>
                            }
                                .into_any();
                        };
                        let Ok(intents_msg) = serde_json::from_str::<
                            IntentsMessage,
                        >(&message_data.message) else {
                            return view! {
                                <p class="text-neutral-400 text-sm">"Failed to parse intents"</p>
                            }
                                .into_any();
                        };

                        view! {
                            <div class="space-y-4">
                                {if intents_msg.intents.is_empty() {
                                    view! {
                                        <div class="flex items-center gap-2 text-neutral-400">
                                            <Icon icon=icondata::LuInfo width="16" height="16" />
                                            <span class="text-sm">"No intents specified"</span>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="space-y-3">
                                            {get_warnings()
                                                .into_iter()
                                                .map(|warning| {
                                                    let (bg_class, icon_class, text_class) = get_warning_styling(
                                                        &warning.warning_type,
                                                    );
                                                    view! {
                                                        <div class=format!(
                                                            "mb-3 p-3 {} rounded-lg wrap-anywhere",
                                                            bg_class,
                                                        )>
                                                            <div class="flex items-start gap-2">
                                                                <Icon
                                                                    icon=icondata::LuTriangleAlert
                                                                    width="16"
                                                                    height="16"
                                                                    attr:class=format!("{} mt-0.5 flex-shrink-0", icon_class)
                                                                />
                                                                <span class=format!(
                                                                    "{} text-sm",
                                                                    text_class,
                                                                )>{warning.message}</span>
                                                            </div>
                                                        </div>
                                                    }
                                                })
                                                .collect_view()} <div class="flex items-center gap-2">
                                                <Icon
                                                    icon=icondata::LuList
                                                    width="16"
                                                    height="16"
                                                    attr:class="text-green-400"
                                                />
                                                <span class="text-neutral-300 text-sm font-medium">
                                                    {format!("Intents ({}):", intents_msg.intents.len())}
                                                </span>
                                            </div>
                                            <div class="space-y-2">
                                                {intents_msg
                                                    .intents
                                                    .iter()
                                                    .enumerate()
                                                    .map(|(i, intent)| {
                                                        view! { <IntentItem intent=intent.clone() index=i /> }
                                                    })
                                                    .collect_view()}
                                            </div>
                                        </div>
                                    }
                                        .into_any()
                                }}
                            </div>
                        }
                            .into_any()
                    } else {
                        // Render regular text/JSON
                        view! {
                            <p class=move || {
                                if format_message.get() && is_formattable_message() {
                                    "text-neutral-400 text-sm font-mono whitespace-pre-wrap wrap-anywhere"
                                } else {
                                    "text-neutral-400 text-sm wrap-anywhere"
                                }
                            }>{move || formatted_message()}</p>
                        }
                            .into_any()
                    }
                }}
            </div>

            <div class="flex flex-col gap-2 text-xs mt-2">
                <div class="flex justify-between items-center">
                    <span class="text-neutral-500">"Sign For:"</span>
                    <div class="flex items-center gap-2">
                        <span class="text-neutral-300 font-mono wrap-anywhere">
                            {move || { message.get().map(|msg| msg.recipient).unwrap_or_default() }}
                        </span>
                        <button
                            class="text-neutral-400 hover:text-neutral-300 transition-colors p-1 rounded"
                            on:click=copy_recipient
                            title="Copy recipient"
                        >
                            {move || {
                                if recipient_copied.get() {
                                    view! {
                                        <Icon
                                            icon=icondata::LuCheck
                                            width="12"
                                            height="12"
                                            attr:class="text-green-400"
                                        />
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <Icon icon=icondata::LuClipboard width="12" height="12" />
                                    }
                                        .into_any()
                                }
                            }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-3 flex justify-end">
                <button
                    class="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-neutral-800 rounded flex items-center gap-2"
                    on:click=copy_cli
                    title="Copy NEAR CLI command"
                >
                    {if cli_copied.get() { "Copied!" } else { "Copy CLI" }}
                </button>
            </div>
        </div>
    }
}

#[component]
pub fn SignMessage() -> impl IntoView {
    let (loading, set_loading) = signal(true);
    let (request_data, set_request_data) = signal::<Option<SignMessageRequest>>(None);
    let (origin, set_origin) = signal::<String>("*".to_string());
    let (tauri_session_id, set_tauri_session_id) = signal::<Option<String>>(None);
    let ConnectedAppsContext { apps, .. } = expect_context::<ConnectedAppsContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let ledger_signing_state = accounts_context.ledger_signing_state;

    let process_sign_message = move |data: SignMessageRequest, evt_origin: String| {
        set_origin(evt_origin);
        set_loading(false);
        set_request_data(Some(data));
    };

    let retrieve_bridge_session = move |session_id: String| {
        spawn_local(async move {
            let url = dotenvy_macro::dotenv!("SHARED_LOGOUT_BRIDGE_SERVICE_ADDR");
            let retrieve_url = format!("{url}/api/session/{session_id}/retrieve-request");

            match reqwest::Client::new().get(&retrieve_url).send().await {
                Ok(response) if response.status().is_success() => {
                    match response.json::<serde_json::Value>().await {
                        Ok(json) => {
                            if let Some(message) = json.get("message") {
                                let Some(message) = message.as_str() else {
                                    log::error!("Bridge: Message is not a string");
                                    return;
                                };
                                let Ok(message) = serde_json::from_str::<ReceiveMessage>(message)
                                else {
                                    log::error!("Bridge: Failed to parse message: {message}");
                                    return;
                                };
                                log::info!("Bridge: Request data: {:?}", message);
                                set_tauri_session_id(Some(session_id.clone()));
                                match message {
                                    ReceiveMessage::SignMessage { data } => {
                                        process_sign_message(data, "".to_string());
                                    }
                                    other => {
                                        log::error!("Bridge: Unexpected message: {other:?}");
                                    }
                                }
                            } else {
                                log::warn!("Bridge: No message field in response");
                            }
                        }
                        Err(e) => {
                            log::error!("Bridge: Failed to parse response JSON: {e}");
                        }
                    }
                }
                Ok(response) => {
                    log::error!(
                        "Bridge: Bridge service responded with status {}",
                        response.status()
                    );
                }
                Err(e) => {
                    log::error!("Bridge: Failed to connect to bridge service: {e}");
                }
            }
        });
    };

    Effect::new(move |_| {
        let location = use_location();
        let params = location.query.get();
        if let Some(session_id) = params.get("session_id")
            && !session_id.is_empty()
        {
            log::info!("Found session_id in URL: {session_id}");
            retrieve_bridge_session(session_id.clone());
        }
    });

    let opener = || match window().opener() {
        Ok(opener) => {
            let opener = opener.unchecked_into::<Window>();
            if opener.is_truthy() { opener } else { window() }
        }
        _ => window(),
    };

    let post_to_opener = move |message: SendMessage, close_window: bool| {
        if let Some(session_id) = tauri_session_id.get_untracked() {
            spawn_local(submit_tauri_response(session_id, message, close_window));
        } else {
            let js_value = serde_wasm_bindgen::to_value(&message).unwrap();
            opener()
                .post_message(&js_value, &origin.read_untracked())
                .expect("Failed to send message");
        }
    };

    window_event_listener(leptos::ev::message, move |event| {
        if is_debug_enabled() {
            log::info!(
                "Received message event from origin: {}, data: {:?}",
                event.origin(),
                event.data()
            );
        }

        match serde_wasm_bindgen::from_value::<ReceiveMessage>(event.data()) {
            Ok(message) => {
                if is_debug_enabled() {
                    log::info!("Successfully parsed message: {:?}", message);
                }
                match message {
                    ReceiveMessage::SignMessage { data } => {
                        process_sign_message(data, event.origin());
                    }
                    ReceiveMessage::TauriWalletSession { session_id } => {
                        retrieve_bridge_session(session_id);
                    }
                }
            }
            _ => {
                if is_debug_enabled() {
                    log::info!("Failed to parse message as ReceiveMessage");
                }
            }
        }
    });

    Effect::new(move || {
        let ready_message = SendMessage::Ready;
        let js_value = serde_wasm_bindgen::to_value(&ready_message).unwrap();
        opener()
            .post_message(&js_value, "*")
            .expect("Failed to send message");
    });

    let connected_app = Memo::new(move |_| {
        match &*request_data.read() {
            Some(request_data) => {
                let text_to_prove = format!("{}|{}", request_data.nonce, request_data.message);
                let to_prove = text_to_prove.as_bytes();
                let to_prove = CryptoHash::hash_bytes(to_prove); // sha256
                let is_valid = request_data
                    .signature
                    .verify(to_prove.as_bytes(), &request_data.public_key)
                    && request_data.nonce > Date::now() as u64 - 1000 * 60 * 5
                    && request_data.nonce <= Date::now() as u64;
                is_valid
                    .then(|| {
                        apps.get()
                            .apps
                            .iter()
                            .find(|app| {
                                app.public_key == request_data.public_key
                                    && app.account_id == request_data.account_id
                                    && app.logged_out_at.is_none()
                            })
                            .cloned()
                    })
                    .flatten()
            }
            _ => None,
        }
    });
    Effect::new(move || {
        if let Some(app) = connected_app()
            && accounts_context.accounts.get().selected_account_id != Some(app.account_id.clone())
        {
            accounts_context.set_accounts.update(|accounts| {
                accounts.selected_account_id = Some(app.account_id);
            });
        }
    });

    let deserialized_message = move || {
        let Some(request_data) = &*request_data.read() else {
            return None;
        };
        serde_json::from_str::<MessageToSign>(&request_data.message).ok()
    };

    let handle_verify = move |_| {
        let Some(request_data) = &*request_data.read() else {
            log::error!("No request data found");
            return;
        };
        let Some(deserialized_message) = deserialized_message() else {
            log::error!("Failed to deserialize signature request");
            return;
        };
        let Some(account) = accounts_context
            .accounts
            .read()
            .accounts
            .iter()
            .find(|account| account.account_id == request_data.account_id)
            .cloned()
        else {
            log::error!("Account not found");
            return;
        };
        add_security_log(
            format!(
                "Signed NEP-413 message on /sign-message from {}: {}",
                origin.get_untracked(),
                if request_data.message.len() > 5000 {
                    format!("{}...", &request_data.message[..5000])
                } else {
                    request_data.message.clone()
                }
            ),
            account.account_id.clone(),
            accounts_context,
        );
        let nep413_message = NEP413Payload {
            message: deserialized_message.message.clone(),
            nonce: deserialized_message.nonce,
            recipient: deserialized_message.recipient.clone(),
            callback_url: deserialized_message.callback_url.clone(),
        };
        spawn_local(async move {
            let Ok(signature) = sign_nep413(
                account.secret_key.clone(),
                &nep413_message,
                accounts_context,
            )
            .await
            else {
                // button is still active
                return;
            };

            let message = SendMessage::Signed {
                signature: SignedMessage {
                    account_id: account.account_id.clone(),
                    public_key: account.secret_key.public_key(),
                    signature,
                    state: deserialized_message.state,
                },
            };
            post_to_opener(message, true);
        });
    };

    let handle_cancel = move |_| {
        let message = SendMessage::Error {
            message: "User rejected the signature".to_string(),
        };
        post_to_opener(message, true);
    };

    view! {
        <div class="flex flex-col items-center justify-center min-h-[calc(80vh-100px)] p-4">
            {move || {
                if loading.get() {
                    view! {
                        <div class="flex flex-col items-center gap-4">
                            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                            <p class="text-white text-lg">"Receiving message to sign..."</p>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="flex flex-col items-center gap-6 max-w-md w-full">
                            <h2 class="text-2xl font-bold text-white mb-2 wrap-anywhere">
                                "Sign Message"
                            </h2>
                            <div class="flex flex-col gap-4 w-full">
                                <div class="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 shadow-lg">
                                    <div class="flex items-center gap-3 pb-4 mb-4 border-b border-neutral-700/50">
                                        <div class="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center">
                                            <span class="text-neutral-300 text-lg">{"📝"}</span>
                                        </div>
                                        <div>
                                            <p class="text-neutral-400 text-sm">"Request from"</p>
                                            <p class="text-white font-medium wrap-anywhere">
                                                {if let Some(app) = connected_app() {
                                                    let domain = app
                                                        .origin
                                                        .trim_start_matches("http://")
                                                        .trim_start_matches("https://")
                                                        .split("/")
                                                        .next()
                                                        .unwrap()
                                                        .split(":")
                                                        .next()
                                                        .unwrap();
                                                    if domain == "localhost" || domain == "127.0.0.1"
                                                        || domain.starts_with("192.168.")
                                                        || domain.ends_with(".local")
                                                        || domain.ends_with(".localhost")
                                                    {
                                                        "🛠 Localhost".to_string()
                                                    } else {
                                                        format!("🔒 {}", app.origin)
                                                    }
                                                } else {
                                                    "⚠️ Unknown".to_string()
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                    <MessageDisplay message=Signal::derive(deserialized_message) />
                                </div>

                                <Show when=move || {
                                    !matches!(ledger_signing_state.get(), LedgerSigningState::Idle)
                                }>
                                    {move || {
                                        match ledger_signing_state.get() {
                                            LedgerSigningState::Idle => ().into_any(),
                                            LedgerSigningState::WaitingForSignature { .. } => {
                                                view! {
                                                    <div class="text-white text-center flex flex-col items-center gap-2 mt-2 border-t border-neutral-700 pt-2">
                                                        <Icon icon=icondata::LuUsb width="24" height="24" />
                                                        <p class="text-sm font-bold">"Waiting for Ledger"</p>
                                                        <p class="text-xs">
                                                            "Please confirm the signature on your Ledger device."
                                                        </p>
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                            LedgerSigningState::Error { id, error } => {
                                                view! {
                                                    <div class="text-white text-center flex flex-col items-center gap-2 mt-2 border-t border-neutral-700 pt-2">
                                                        <Icon
                                                            icon=icondata::LuTriangleAlert
                                                            width="24"
                                                            height="24"
                                                            attr:class="text-red-500"
                                                        />
                                                        <p class="text-sm font-bold">"Ledger Error"</p>
                                                        <p class="text-xs max-w-xs break-words">{error.clone()}</p>
                                                        <div class="flex gap-4 mt-2">
                                                            <button
                                                                class="px-3 py-1 text-xs bg-neutral-700 rounded-md hover:bg-neutral-600 transition-colors cursor-pointer"
                                                                on:click=move |_| {
                                                                    ledger_signing_state
                                                                        .set(LedgerSigningState::WaitingForSignature {
                                                                            id,
                                                                        })
                                                                }
                                                            >
                                                                "Retry"
                                                            </button>
                                                            <button
                                                                class="px-3 py-1 text-xs bg-red-800 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                                                                on:click=move |_| {
                                                                    ledger_signing_state.set(LedgerSigningState::Idle)
                                                                }
                                                            >
                                                                "Cancel"
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                        }
                                    }}
                                </Show>

                            </div>
                            <div class="flex flex-col gap-3 w-full mt-2">
                                <button
                                    class="w-full px-6 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer"
                                    on:click=handle_verify
                                >
                                    "Confirm"
                                </button>
                                <button
                                    class="w-full px-6 py-3.5 bg-neutral-800 text-white font-medium rounded-xl hover:bg-neutral-700 transition-all duration-200 shadow-lg shadow-black/20 cursor-pointer"
                                    on:click=handle_cancel
                                >
                                    "Cancel"
                                </button>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
