use std::sync::LazyLock;
use std::{fmt::Display, str::FromStr};

use chrono::{DateTime, Utc};
use near_min_api::types::near_crypto::PublicKey;
use near_min_api::types::{AccountId, Action, Balance, CryptoHash};
use near_min_api::utils::dec_format;
use reqwest::StatusCode;
use serde::de::Error;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
#[serde(rename_all = "snake_case")]
pub enum Amount {
    AmountIn(#[serde(with = "dec_format")] Balance),
    AmountOut(#[serde(with = "dec_format")] Balance),
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum TokenId {
    Near,
    Nep141(AccountId),
    // Nep141OnRhea(AccountId),
    // Nep141OnIntents(AccountId),
}

impl Serialize for TokenId {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match self {
            TokenId::Near => "near".to_string(),
            TokenId::Nep141(account_id) => format!("{account_id}"),
            // TokenId::Nep141OnRhea(account_id) => format!("rhea-nep141:{account_id}"),
            // TokenId::Nep141OnIntents(account_id) => format!("intents-nep141:{account_id}"),
        }
        .serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for TokenId {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        s.parse().map_err(serde::de::Error::custom)
    }
}

impl FromStr for TokenId {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s == "near" {
            Ok(TokenId::Near)
        // } else if let Some(account_id) = s.strip_prefix("rhea-nep141:") {
        //     Ok(TokenId::Nep141OnRhea(
        //         account_id.parse().map_err(|_| "Invalid token ID")?,
        //     ))
        // } else if let Some(account_id) = s.strip_prefix("intents-nep141:") {
        //     Ok(TokenId::Nep141OnIntents(
        //         account_id.parse().map_err(|_| "Invalid token ID")?,
        //     ))
        } else if let Some(account_id) = s.strip_prefix("nep141:") {
            Ok(TokenId::Nep141(
                account_id.parse().map_err(|_| "Invalid token ID")?,
            ))
        } else {
            Ok(TokenId::Nep141(s.parse().map_err(|_| "Invalid token ID")?))
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SwapRequest {
    /// The token to swap from. This and token_out must be different.
    pub token_in: TokenId,
    /// The token to swap to. This and token_in must be different.
    pub token_out: TokenId,
    /// The amount to swap. If it's AmountOut, some dexes might not support this.
    #[serde(flatten)]
    pub amount: Amount,
    /// The maximum amount of time to wait for the route to be found. Some dexes
    /// like near intents might show a better quote if you wait a bit longer.
    /// Usually, 2-3 seconds is enough. Maximum is 60 seconds.
    pub max_wait_ms: u64,
    /// The slippage tolerance. `1.00` means 100%, `0.001` means 0.1%.
    #[serde(flatten)]
    pub slippage: Slippage,
    /// The dexes to use. You might want to remove Near Intents if you don't want
    /// to implement its own swap logic, which relies on signing and sending messages
    /// to a centralized RPC rather than just sending a transaction. If not provided,
    /// all dexes will be used. Must not be an empty array.
    #[serde(with = "comma_separated", default)]
    pub dexes: Option<Vec<DexId>>,
    /// The account ID of the trader. If provided, the route will include storage
    /// deposit actions.
    pub trader_account_id: Option<AccountId>,
    /// The public key to use for signing. Can be used for `add_public_key` method in
    /// NEAR Intents.
    pub signing_public_key: Option<PublicKey>,
}

mod comma_separated {
    use std::{fmt::Display, str::FromStr};

    use serde::{Deserialize, Deserializer, Serialize, Serializer};

    pub fn serialize<S, T>(value: &Option<Vec<T>>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
        T: Display,
    {
        if let Some(value) = value {
            let s = value
                .iter()
                .map(|v| v.to_string())
                .collect::<Vec<_>>()
                .join(",");
            Some(s).serialize(serializer)
        } else {
            None::<String>.serialize(serializer)
        }
    }

    pub fn deserialize<'de, D, T>(deserializer: D) -> Result<Option<Vec<T>>, D::Error>
    where
        D: Deserializer<'de>,
        T: FromStr,
        T::Err: Display,
    {
        let s = Option::<String>::deserialize(deserializer)?;
        if let Some(s) = s {
            let values = s
                .split(',')
                .map(|v| v.parse::<T>())
                .collect::<Result<Vec<_>, _>>()
                .map_err(serde::de::Error::custom)?;
            Ok(Some(values))
        } else {
            Ok(None)
        }
    }
}

fn from_str<'de, D, S>(deserializer: D) -> Result<S, D::Error>
where
    D: serde::Deserializer<'de>,
    S: std::str::FromStr,
{
    let s = <&str as serde::Deserialize>::deserialize(deserializer)?;
    S::from_str(s).map_err(|_| D::Error::custom("could not parse string"))
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
#[serde(tag = "slippage_type")]
pub enum Slippage {
    /// Automatically determine the optimal slippage based on the current market
    /// conditions (liquidity, 24h volume, etc).
    Auto {
        #[serde(deserialize_with = "from_str")]
        max_slippage: f64,
        #[serde(deserialize_with = "from_str")]
        min_slippage: f64,
    },
    /// Fixed slippage percentage. Must be between 0.00 and 1.00.
    Fixed {
        #[serde(deserialize_with = "from_str")]
        slippage: f64,
    },
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Route {
    /// The deadline for the route. If provided, you should refresh the route by
    /// calling the /route endpoint again 2-3 seconds before the deadline to account
    /// for network and block production latency.
    pub deadline: Option<DateTime<Utc>>,
    /// Whether the route has slippage. Usually it's true for AMM models like Rhea
    /// and false for OTC / guaranteed-quote models like Near Intents.
    pub has_slippage: bool,
    /// The amount of tokens this route will swap. If you provided `Amount::AmountOut`,
    /// this amount will be `Amount::AmountIn` and vice versa.
    pub estimated_amount: Amount,
    /// The amount of tokens this route will swap in the worst case scenario (with
    /// slippage). If you provided `Amount::AmountOut`, this amount will be
    /// `Amount::AmountIn` and vice versa. If you set slippage to `0.01`, this will be
    /// 1% more / less than `estimated_amount`. If it's a dex like Near Intents,
    /// this will be the same as `estimated_amount`.
    pub worst_case_amount: Amount,
    /// The id of the dex that provided this route.
    pub dex_id: DexId,
    /// How to execute the swap. Need to be executed sequentially.
    pub execution_instructions: Vec<ExecutionInstruction>,
    /// Whether the route needs to unwrap the tokens after completing the swap. Only
    /// true for dexes that don't auto-unwrap tokens, and when token_out is NEAR.
    /// A transaction is not included in `execution_instructions` because the unwrapping
    /// can't be done deterministically due to slippage. The recommended behavior is
    /// to remember the current wrap.near balance and compare it to the balance after the
    /// swap, and unwrap the difference. When choosing amount_out, it can also happen
    /// when we wrap too much NEAR into wNEAR (because we're accounting for slippage)
    /// but the resulting wNEAR amount spent is less than what we wrapped.
    pub needs_unwrap: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ExecutionInstruction {
    /// Sign a transaction with the given actions and send it to the RPC.
    NearTransaction {
        receiver_id: AccountId,
        actions: Vec<Action>,
    },
    /// A quote from Near Intents. You should sign the message and send it to
    /// POST https://solver-relay-v2.chaindefuser.com/rpc with method
    /// `publish_intent`. More details on how to publish a signed intent:
    /// https://docs.near-intents.org/near-intents/market-makers/bus/solver-relay
    IntentsQuote {
        message_to_sign: String,
        quote_hash: CryptoHash,
    },
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Hash)]
pub enum DexId {
    /// https://dex.rhea.finance/
    /// AMM DEX
    ///
    /// Supports AmountIn, doesn't support AmountOut
    Rhea,
    /// https://app.near-intents.org/
    /// guaranteed-quote DEX & Bridge
    ///
    /// Supports both AmountIn and AmountOut
    NearIntents,
    /// https://app.veax.com/
    /// AMM DEX
    ///
    /// Supports both AmountIn and AmountOut
    Veax,
    /// https://aidols.bot/
    /// bonding-curve launchpad
    ///
    /// Supports both AmountIn and AmountOut, only *.aidols.near tokens
    Aidols,
    /// https://gra.fun/
    /// bonding-curve launchpad
    ///
    /// Supports AmountIn, doesn't support AmountOut, only *.gra-fun.near tokens
    GraFun,
    /// https://app.jumpdefi.xyz/swap
    /// AMM DEX
    ///
    /// Not implemented yet
    Jumpdefi,
    /// Directly wrap NEAR to wNEAR, or unwrap wNEAR to NEAR
    ///
    /// Supports both AmountIn and AmountOut
    Wrap,
    /// https://dex.rhea.finance/
    /// AMM DEX
    ///
    /// Supports both AmountIn and AmountOut
    RheaDcl,
}

const RHEA_STR: &str = "Rhea";
const NEAR_INTENTS_STR: &str = "NearIntents";
const VEAX_STR: &str = "Veax";
const AIDOLS_STR: &str = "Aidols";
const GRA_FUN_STR: &str = "GraFun";
const JUMPDEFI_STR: &str = "Jumpdefi";
const WRAP_STR: &str = "Wrap";
const RHEA_DCL_STR: &str = "RheaDcl";

impl Display for DexId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DexId::Rhea => f.write_str(RHEA_STR),
            DexId::NearIntents => f.write_str(NEAR_INTENTS_STR),
            DexId::Veax => f.write_str(VEAX_STR),
            DexId::Aidols => f.write_str(AIDOLS_STR),
            DexId::GraFun => f.write_str(GRA_FUN_STR),
            DexId::Jumpdefi => f.write_str(JUMPDEFI_STR),
            DexId::Wrap => f.write_str(WRAP_STR),
            DexId::RheaDcl => f.write_str(RHEA_DCL_STR),
        }
    }
}

impl FromStr for DexId {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            RHEA_STR => DexId::Rhea,
            NEAR_INTENTS_STR => DexId::NearIntents,
            VEAX_STR => DexId::Veax,
            AIDOLS_STR => DexId::Aidols,
            GRA_FUN_STR => DexId::GraFun,
            JUMPDEFI_STR => DexId::Jumpdefi,
            WRAP_STR => DexId::Wrap,
            RHEA_DCL_STR => DexId::RheaDcl,
            _ => return Err(format!("Invalid dex id: {}", s)),
        })
    }
}

static REQWEST_CLIENT: LazyLock<reqwest::Client> = LazyLock::new(reqwest::Client::new);

pub async fn get_routes(swap_request: SwapRequest) -> Result<Vec<Route>, (StatusCode, String)> {
    let response = REQWEST_CLIENT
        .get(format!(
            "{}/route",
            std::env::var("ROUTER_URL")
                .unwrap_or_else(|_| "https://router.intear.tech".to_string())
        ))
        .query(&swap_request)
        .send()
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to get routes: {}", e),
            )
        })?;
    let response = response.json::<Vec<Route>>().await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to parse routes: {}", e),
        )
    })?;
    Ok(response)
}
