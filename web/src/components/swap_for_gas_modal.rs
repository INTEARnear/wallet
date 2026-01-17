use crate::contexts::accounts_context::AccountsContext;
use crate::contexts::modal_context::ModalContext;
use crate::contexts::network_context::{Network, NetworkContext};
use crate::contexts::tokens_context::{Token, TokensContext};
use crate::contexts::transaction_queue_context::{
    EnqueuedTransaction, TransactionQueueContext, TransactionType,
};
use crate::utils::{balance_to_decimal, format_token_amount, format_usd_value};
use base64::Engine;
use base64::prelude::BASE64_STANDARD;
use bigdecimal::BigDecimal;
use borsh::BorshSerialize;
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use near_min_api::types::{
    AccountId, Action, BlockHeight, FunctionCallAction, NearGas, NearToken, U64, U128,
};
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use serde_with::serde_as;
use std::collections::BTreeMap;
use std::fmt::Display;
use std::str::FromStr;

pub const SWAP_FOR_GAS_WHITELIST: &[&str] = &[
    "jambo-1679.meme-cooking.near",
    "usdt.tether-token.near",
    "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    "nbtc.bridge.near",
    "zec.omft.near",
];

pub const MIN_TOKEN_VALUE_USD: &str = "0.5";
pub const MIN_NEAR_BALANCE_FOR_GAS: &str = "0.05";

#[derive(PartialEq, Eq, Hash, Clone, PartialOrd, Ord, Debug, BorshSerialize)]
pub enum AssetId {
    Near,
    Nep141(AccountId),
    Nep245(AccountId, String),
    Nep171(AccountId, String),
}

impl Display for AssetId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AssetId::Near => write!(f, "near"),
            AssetId::Nep141(contract_id) => write!(f, "nep141:{contract_id}"),
            AssetId::Nep245(contract_id, token_id) => write!(f, "nep245:{contract_id}:{token_id}"),
            AssetId::Nep171(contract_id, token_id) => write!(f, "nep171:{contract_id}:{token_id}"),
        }
    }
}

impl FromStr for AssetId {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "near" => Ok(AssetId::Near),
            _ => match s.split_once(':') {
                Some(("nep141", contract_id)) => {
                    Ok(AssetId::Nep141(contract_id.parse().map_err(|e| {
                        format!("Invalid account id {contract_id}: {e}")
                    })?))
                }
                Some(("nep245", rest)) => {
                    if let Some((contract_id, token_id)) = rest.split_once(':') {
                        Ok(AssetId::Nep245(
                            contract_id
                                .parse()
                                .map_err(|e| format!("Invalid account id {contract_id}: {e}"))?,
                            token_id.to_string(),
                        ))
                    } else {
                        Err(format!("Invalid asset id: {s}"))
                    }
                }
                Some(("nep171", rest)) => {
                    if let Some((contract_id, token_id)) = rest.split_once(':') {
                        Ok(AssetId::Nep171(
                            contract_id
                                .parse()
                                .map_err(|e| format!("Invalid account id {contract_id}: {e}"))?,
                            token_id.to_string(),
                        ))
                    } else {
                        Err(format!("Invalid asset id: {s}"))
                    }
                }
                _ => Err(format!("Invalid asset id: {s}")),
            },
        }
    }
}

impl Serialize for AssetId {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serde::Serialize::serialize(&self.to_string(), serializer)
    }
}

impl<'de> Deserialize<'de> for AssetId {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Ok(AssetId::from_str(&s).unwrap())
    }
}

#[derive(Serialize, Deserialize, Debug, BorshSerialize)]
struct OtcTradeIntent {
    user_id: AccountId,
    asset_in: AssetId,
    asset_out: AssetId,
    amount_in: U128,
    amount_out: U128,
    validity: OtcValidity,
}

#[derive(Default, PartialEq, Serialize, Deserialize, Debug, BorshSerialize)]
struct OtcValidity {
    expiry: Option<OtcExpiryCondition>,
    nonce: Option<U128>,
    only_for_whitelisted_parties: Option<Vec<AccountId>>,
}

#[derive(PartialEq, Clone, Copy, Serialize, Deserialize, Debug, BorshSerialize)]
enum OtcExpiryCondition {
    BlockHeight(BlockHeight),
    Timestamp { milliseconds: U64 },
}

#[derive(Serialize, Deserialize, Debug, BorshSerialize)]
#[serde_as]
enum OtcAuthorizationMethod {
    Signature(#[serde_as(as = "Base64")] Vec<u8>),
    Predecessor,
}

#[derive(Serialize, Deserialize, Debug, BorshSerialize)]
struct OtcAuthorizedTradeIntent {
    trade_intent: OtcTradeIntent,
    authorization_method: OtcAuthorizationMethod,
}

#[derive(Clone, PartialEq, Serialize, Deserialize, Debug)]
pub enum AccountOrDexId {
    Account(AccountId),
    Dex(String),
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum Operation {
    /// Call a method on a dex.
    DexCall {
        dex_id: String,
        method: String,
        args: String,
        attached_assets: BTreeMap<AssetId, U128>,
    },
    /// Transfer assets to a different account or dex.
    TransferAsset {
        to: AccountOrDexId,
        asset_id: AssetId,
        amount: U128,
    },
}

#[derive(Debug, BorshSerialize)]
struct OtcMatchArgs {
    authorized_trade_intents: Vec<OtcAuthorizedTradeIntent>,
    output_destination: OtcOutputDestination,
}

#[derive(Debug, BorshSerialize)]
#[allow(unused)]
enum OtcOutputDestination {
    InternalOtcBalance,
    IntearDexBalance,
    WithdrawToUser,
}

#[derive(Serialize)]
struct SwapForGasRequest {
    user_id: AccountId,
    token_contract_id: AccountId,
}

#[derive(Deserialize, Debug)]
struct SwapForGasResponse {
    authorized_trade_intent: OtcAuthorizedTradeIntent,
}

#[component]
pub fn SwapForGasModal() -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let TokensContext { tokens, .. } = expect_context::<TokensContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let NetworkContext { network } = expect_context::<NetworkContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();

    let handle_unwrap_wnear = move |token_contract_id: AccountId| {
        let selected_account = accounts.get_untracked().selected_account_id;
        let token_data = tokens
            .get_untracked()
            .iter()
            .find(|token_data| {
                token_data.token.account_id == Token::Nep141(token_contract_id.clone())
            })
            .cloned()
            .expect("Token not found");

        if let Some(selected_account_id) = selected_account {
            let (rx, transaction) = EnqueuedTransaction::create_with_type(
                format!(
                    "Unwrap {} wNEAR",
                    balance_to_decimal(token_data.balance, token_data.token.metadata.decimals)
                ),
                selected_account_id.clone(),
                TransactionType::MetaTransaction {
                    actions: vec![Action::FunctionCall(Box::new(FunctionCallAction {
                        method_name: "near_withdraw".to_string(),
                        args: serde_json::to_vec(&serde_json::json!({
                            "amount": NearToken::from_yoctonear(token_data.balance),
                        }))
                        .unwrap(),
                        gas: NearGas::from_tgas(30).into(),
                        deposit: NearToken::from_yoctonear(1),
                    }))],
                    receiver_id: token_contract_id.clone(),
                },
            );
            add_transaction.update(|queue| queue.push(transaction));
            spawn_local(async move {
                match rx.await {
                    Ok(_) => {
                        modal.set(None);
                    }
                    Err(e) => {
                        log::error!("Failed to send unwrap transaction: {}", e);
                    }
                }
            });
        }
    };

    let handle_swap = move |token_contract_id: AccountId| {
        let selected_account = accounts.get_untracked().selected_account_id;
        let symbol = tokens
            .get_untracked()
            .iter()
            .find(|token_data| {
                token_data.token.account_id == Token::Nep141(token_contract_id.clone())
            })
            .map(|token_data| token_data.token.metadata.symbol.clone())
            .expect("Token not found");
        if let Some(selected_account_id) = selected_account {
            spawn_local(async move {
                let client = reqwest::Client::new();
                let account_creation_service_addr =
                    dotenvy_macro::dotenv!("SHARED_ACCOUNT_CREATION_SERVICE_ADDR");
                let relayer_id = match network.get_untracked() {
                    Network::Mainnet => "mainnet",
                    Network::Testnet => "testnet",
                    Network::Localnet { .. } => {
                        log::error!("Swap for gas not supported on localnet");
                        return;
                    }
                };

                let payload = SwapForGasRequest {
                    user_id: selected_account_id.clone(),
                    token_contract_id: token_contract_id.clone(),
                };

                match client
                    .post(format!("{account_creation_service_addr}/swap-for-gas"))
                    .header("x-relayer-id", relayer_id)
                    .json(&payload)
                    .send()
                    .await
                {
                    Ok(resp) => match resp.json::<SwapForGasResponse>().await {
                        Ok(response) => {
                            // Guardrails against hostile server
                            let token_amount_out: u128 = response
                                .authorized_trade_intent
                                .trade_intent
                                .amount_out
                                .into();
                            let token_data = tokens
                                .get_untracked()
                                .iter()
                                .find(|t| {
                                    if let Token::Nep141(id) = &t.token.account_id {
                                        id == &token_contract_id
                                    } else {
                                        false
                                    }
                                })
                                .cloned();

                            if let Some(token_data) = token_data {
                                let token_amount_decimal = balance_to_decimal(
                                    token_amount_out,
                                    token_data.token.metadata.decimals,
                                );
                                let token_usd_value =
                                    &token_data.token.price_usd_hardcoded * &token_amount_decimal;

                                let near_price_usd = tokens
                                    .get_untracked()
                                    .iter()
                                    .find(|t| t.token.account_id == Token::Near)
                                    .map(|t| &t.token.price_usd_hardcoded)
                                    .cloned()
                                    .unwrap_or_else(|| BigDecimal::from_str("0").unwrap());

                                let max_acceptable_usd =
                                    &near_price_usd * &BigDecimal::from_str("0.3").unwrap() * 2;

                                if token_usd_value > max_acceptable_usd {
                                    log::error!(
                                        "Swap rate validation failed: token value ${} exceeds max acceptable ${}",
                                        token_usd_value,
                                        max_acceptable_usd
                                    );
                                    return;
                                }
                            } else {
                                log::error!("Token data not found for validation");
                                return;
                            }

                            let counter_trade_intent = OtcAuthorizedTradeIntent {
                                trade_intent: OtcTradeIntent {
                                    user_id: selected_account_id.clone(),
                                    asset_in: AssetId::Nep141(token_contract_id.clone()),
                                    asset_out: AssetId::Near,
                                    amount_in: response
                                        .authorized_trade_intent
                                        .trade_intent
                                        .amount_out,
                                    amount_out: U128::from(
                                        "0.3 NEAR".parse::<NearToken>().unwrap().as_yoctonear(),
                                    ),
                                    validity: OtcValidity::default(),
                                },
                                authorization_method: OtcAuthorizationMethod::Predecessor,
                            };
                            log::info!(
                                "intents: {:?} {:?}",
                                response.authorized_trade_intent,
                                counter_trade_intent
                            );
                            let (rx, transaction) = EnqueuedTransaction::create_with_type(
                                format!("Swap {symbol} for 0.3 NEAR"),
                                selected_account_id.clone(),
                                TransactionType::MetaTransaction {
                                    actions: vec![Action::FunctionCall(Box::new(FunctionCallAction {
                                        method_name: "ft_transfer_call".to_string(),
                                        args: serde_json::to_vec(&serde_json::json!({
                                            "receiver_id": "dex.intear.near",
                                            "amount": response.authorized_trade_intent.trade_intent.amount_out,
                                            "msg": serde_json::to_string(&serde_json::json!([Operation::DexCall {
                                                dex_id: "slimedragon.near/otc".to_string(),
                                                method: "match".to_string(),
                                                attached_assets: BTreeMap::from_iter([
                                                    (AssetId::Nep141(token_contract_id.clone()), response.authorized_trade_intent.trade_intent.amount_out)
                                                ]),
                                                args: BASE64_STANDARD.encode(borsh::to_vec(&OtcMatchArgs {
                                                    authorized_trade_intents: vec![
                                                        response.authorized_trade_intent,
                                                        counter_trade_intent,
                                                    ],
                                                    output_destination: OtcOutputDestination::WithdrawToUser,
                                                }).unwrap()),
                                            }])).unwrap(),
                                        })).unwrap(),
                                        gas: NearGas::from_tgas(300).into(),
                                        deposit: NearToken::from_yoctonear(1),
                                    }))],
                                    receiver_id: token_contract_id.clone(),
                                },
                            );
                            add_transaction.update(|queue| queue.push(transaction));
                            match rx.await {
                                Ok(_) => {
                                    modal.set(None);
                                }
                                Err(e) => {
                                    log::error!("Failed to send swap transaction: {}", e);
                                }
                            }
                        }
                        Err(e) => {
                            log::error!("Failed to parse swap response: {}", e);
                        }
                    },
                    Err(e) => {
                        log::error!("Failed to request swap: {}", e);
                    }
                }
            });
        }
    };

    let available_whitelisted_tokens = move || {
        tokens
            .get()
            .into_iter()
            .filter(|token_data| {
                if let Token::Nep141(account_id) = &token_data.token.account_id {
                    if account_id.as_str() == "wrap.near" {
                        return token_data.balance > 0;
                    }

                    if !SWAP_FOR_GAS_WHITELIST.contains(&account_id.as_str()) {
                        return false;
                    }

                    let normalized_balance =
                        balance_to_decimal(token_data.balance, token_data.token.metadata.decimals);
                    let usd_value = &token_data.token.price_usd_hardcoded * &normalized_balance;
                    usd_value > BigDecimal::from_str(MIN_TOKEN_VALUE_USD).unwrap()
                } else {
                    false
                }
            })
            .collect::<Vec<_>>()
    };

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                class="bg-neutral-900 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto overflow-x-hidden"
                on:click=|ev| ev.stop_propagation()
            >
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white">"Swap For Gas"</h2>
                    <button
                        class="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        <Icon icon=icondata::LuX width="18" height="18" />
                    </button>
                </div>
                <p class="text-gray-400 text-sm mb-6">
                    "Select a token to swap for NEAR to pay for transaction fees."
                </p>
                <div class="flex flex-col gap-3">
                    {move || {
                        let tokens_list = available_whitelisted_tokens();
                        if tokens_list.is_empty() {
                            view! {
                                <div class="text-center text-gray-400 py-8">
                                    "No eligible tokens available for swap"
                                </div>
                            }
                                .into_any()
                        } else {
                            tokens_list
                                .into_iter()
                                .map(|token_data| {
                                    let token_clone = token_data.clone();
                                    let token_clone_2 = token_data.clone();
                                    let normalized_balance = balance_to_decimal(
                                        token_data.balance,
                                        token_data.token.metadata.decimals,
                                    );
                                    let usd_value = &token_data.token.price_usd_hardcoded
                                        * &normalized_balance;
                                    let token_contract_id = match &token_clone_2.token.account_id {
                                        Token::Nep141(account_id) => account_id.clone(),
                                        _ => return ().into_any(),
                                    };
                                    let is_wrap_near = token_contract_id.as_str() == "wrap.near";

                                    view! {
                                        <button
                                            class="flex items-center justify-between p-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer border border-neutral-700 hover:border-neutral-600"
                                            on:click=move |_| {
                                                if is_wrap_near {
                                                    handle_unwrap_wnear(token_contract_id.clone());
                                                } else {
                                                    handle_swap(token_contract_id.clone());
                                                }
                                            }
                                        >
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {move || {
                                                        if let Some(icon) = &token_clone.token.metadata.icon {
                                                            view! {
                                                                <img
                                                                    src=icon.clone()
                                                                    alt=token_clone.token.metadata.symbol.clone()
                                                                    class="w-full h-full object-cover"
                                                                />
                                                            }
                                                                .into_any()
                                                        } else {
                                                            view! {
                                                                <span class="text-neutral-400 text-xs">
                                                                    {token_clone
                                                                        .token
                                                                        .metadata
                                                                        .symbol
                                                                        .chars()
                                                                        .next()
                                                                        .unwrap_or('?')}
                                                                </span>
                                                            }
                                                                .into_any()
                                                        }
                                                    }}
                                                </div>
                                                <div class="flex flex-col items-start">
                                                    <span class="text-white font-medium">
                                                        {token_data.token.metadata.symbol.clone()}
                                                    </span>
                                                    <span class="text-gray-400 text-sm">
                                                        {move || format_token_amount(
                                                            token_data.balance,
                                                            token_data.token.metadata.decimals,
                                                            &token_data.token.metadata.symbol,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="flex flex-col items-end gap-1">
                                                <span class="text-white font-medium">
                                                    {move || format_usd_value(usd_value.clone())}
                                                </span>
                                                <span class="text-blue-400 text-sm font-medium">
                                                    {if is_wrap_near { "Unwrap" } else { "Swap" }}
                                                </span>
                                            </div>
                                        </button>
                                    }
                                        .into_any()
                                })
                                .collect_view()
                                .into_any()
                        }
                    }}
                </div>
                <div class="mt-6 pt-4 border-t border-neutral-700">
                    <p class="text-gray-400 text-sm text-center">
                        {move || {
                            let has_wrap_near = available_whitelisted_tokens()
                                .iter()
                                .any(|t| {
                                    if let Token::Nep141(id) = &t.token.account_id {
                                        id.as_str() == "wrap.near"
                                    } else {
                                        false
                                    }
                                });
                            let has_other_tokens = available_whitelisted_tokens()
                                .iter()
                                .any(|t| {
                                    if let Token::Nep141(id) = &t.token.account_id {
                                        id.as_str() != "wrap.near"
                                    } else {
                                        false
                                    }
                                });
                            match (has_wrap_near, has_other_tokens) {
                                (true, true) => {
                                    "wNEAR will be unwrapped to NEAR for free. 0.03 NEAR after-swap fee applies to other tokens."
                                }
                                (true, false) => "wNEAR will be unwrapped to NEAR for free.",
                                (false, true) => "0.03 NEAR will be taken after the swap as a fee.",
                                (false, false) => "",
                            }
                        }}
                    </p>
                </div>
            </div>
        </div>
    }
}
