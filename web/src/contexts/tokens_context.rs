use std::{
    collections::{BTreeSet, HashMap, HashSet},
    str::FromStr,
    sync::{Arc, Mutex},
};

use base64::{Engine, prelude::BASE64_STANDARD};
use bigdecimal::BigDecimal;
use futures_util::future::join5;
use leptos::{prelude::*, task::spawn_local};
use near_min_api::{
    QueryFinality, RpcClient,
    types::{AccountId, Balance, BlockReference, Finality, U128},
    utils::dec_format,
};
use reqwest::Url;
use serde::{Deserialize, Serialize, de::Error as _};
use serde_json::{Map, Value};
use web_sys::HtmlAudioElement;

use crate::utils::{TOKEN_CACHE, power_of_10};

use super::{
    accounts_context::AccountsContext,
    config_context::ConfigContext,
    network_context::Network,
    prices_context::{ApiError, PricesContext, SubscriptionMessage, Table, icon_url},
    rpc_context::RpcContext,
};

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug, Hash)]
#[serde(untagged)]
pub enum Token {
    Near,
    Nep141(AccountId),
    Rhea(AccountId),
}

impl FromStr for Token {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s == "near" {
            Ok(Token::Near)
        } else {
            Ok(Token::Nep141(s.parse().map_err(|_| "Invalid token ID")?))
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq)]
pub enum TokenScore {
    Spam,
    Unknown,
    NotFake,
    Reputable,
}

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq)]
pub struct TokenInfo {
    pub account_id: Token,
    pub metadata: TokenMetadata,
    pub price_usd: BigDecimal,
    pub price_usd_hardcoded: BigDecimal,
    pub price_usd_raw: BigDecimal,
    pub price_usd_raw_24h_ago: BigDecimal,
    pub volume_usd_24h: f64,
    pub liquidity_usd: f64,
    #[serde(with = "dec_format")]
    pub circulating_supply: Balance,
    #[serde(with = "dec_format")]
    pub total_supply: Balance,
    pub reputation: TokenScore,
}

impl TokenInfo {
    /// The token as the price API at `api_url` has it, from every one of [`TOKEN_FIELDS`]
    pub fn from_fields(
        account_id: Token,
        mut fields: Map<String, Value>,
        api_url: &Url,
    ) -> serde_json::Result<Self> {
        let mut token = unpriced_token(
            account_id,
            TokenMetadata {
                name: String::new(),
                symbol: String::new(),
                decimals: 0,
                icon: None,
            },
            0,
            TokenScore::Unknown,
        );
        for field in TOKEN_FIELDS {
            let value = fields
                .remove(field)
                .ok_or_else(|| serde_json::Error::missing_field(field))?;
            token.set(field, value, api_url)?;
        }
        Ok(token)
    }

    /// Sets `field`, one of [`TOKEN_FIELDS`], to its `value` from the price API at `api_url`.
    fn set(&mut self, field: &str, value: Value, api_url: &Url) -> serde_json::Result<()> {
        match field {
            "name" => self.metadata.name = serde_json::from_value(value)?,
            "symbol" => self.metadata.symbol = serde_json::from_value(value)?,
            "decimals" => self.metadata.decimals = serde_json::from_value(value)?,
            "icon_hash" => {
                self.metadata.icon = serde_json::from_value::<Option<String>>(value)?
                    .map(|icon_hash| icon_url(api_url, &icon_hash));
            }
            "price_usd" => self.price_usd = serde_json::from_value(value)?,
            "price_usd_hardcoded" => self.price_usd_hardcoded = serde_json::from_value(value)?,
            "price_usd_raw" => self.price_usd_raw = serde_json::from_value(value)?,
            "price_usd_raw_24h_ago" => self.price_usd_raw_24h_ago = serde_json::from_value(value)?,
            "volume_usd_24h" => self.volume_usd_24h = serde_json::from_value(value)?,
            "liquidity_usd" => self.liquidity_usd = serde_json::from_value(value)?,
            "circulating_supply" => self.circulating_supply = dec_format::deserialize(value)?,
            "total_supply" => self.total_supply = dec_format::deserialize(value)?,
            "reputation" => self.reputation = serde_json::from_value(value)?,
            _ => {
                return Err(serde_json::Error::custom(format!(
                    "unexpected field {field}"
                )));
            }
        }
        Ok(())
    }

    /// wrap.near's data as native NEAR's: its prices and market, but not what it's called
    fn into_native_near(self) -> Self {
        TokenInfo {
            account_id: Token::Near,
            metadata: TokenMetadata {
                name: "NEAR".to_string(),
                symbol: "NEAR".to_string(),
                icon: Some(near_icon()),
                ..self.metadata
            },
            reputation: TokenScore::Reputable,
            ..self
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
    pub icon: Option<String>,
}

#[derive(Clone, Deserialize, Debug, PartialEq)]
pub struct TokenData {
    #[serde(with = "dec_format")]
    pub balance: Balance,
    pub token: TokenInfo,
    pub source: TokenBalanceSource,
}

#[derive(Clone, Deserialize, Debug, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum TokenBalanceSource {
    Direct,
    Rhea,
    Native,
}

#[derive(Clone, Deserialize, Debug, PartialEq)]
pub struct LivePrice {
    pub price_usd: BigDecimal,
    pub price_usd_hardcoded: BigDecimal,
    pub price_usd_raw: BigDecimal,
}

impl LivePrice {
    /// Sets `field`, one of [`PRICE_FIELDS`], to its `value` from the price API.
    fn set(&mut self, field: &str, value: Value) -> serde_json::Result<()> {
        match field {
            "price_usd" => self.price_usd = serde_json::from_value(value)?,
            "price_usd_hardcoded" => self.price_usd_hardcoded = serde_json::from_value(value)?,
            "price_usd_raw" => self.price_usd_raw = serde_json::from_value(value)?,
            _ => {
                return Err(serde_json::Error::custom(format!(
                    "unexpected field {field}"
                )));
            }
        }
        Ok(())
    }
}

/// `balances.subscribe`'s result
#[derive(Deserialize)]
struct Balances {
    /// The `token`, `source` and `balance` of each token held
    balances: Table,
    /// The held tokens' [`TOKEN_FIELDS`], wrap.near's for native NEAR
    tokens: Table,
    /// Sources that couldn't be read, by name
    errors: HashMap<String, ApiError>,
}

#[derive(Deserialize)]
struct BalanceRow {
    token: AccountId,
    source: TokenBalanceSource,
    balance: U128,
}

/// A push of `balances.subscribe`
#[derive(Deserialize)]
struct BalancesPush {
    /// The direct balances that changed, and native NEAR's as `near`
    #[serde(default)]
    balances: HashMap<String, U128>,
    /// The fields of held tokens that changed, and every field of tokens held for the first time
    #[serde(default)]
    set: HashMap<AccountId, Map<String, Value>>,
}

/// A push of `tokens.subscribe`
#[derive(Deserialize)]
struct TokensPush {
    #[serde(default)]
    set: HashMap<AccountId, Map<String, Value>>,
}

/// What [`TokenInfo`] reads of a token, the only fields asked of the price API
pub const TOKEN_FIELDS: [&str; 13] = [
    "name",
    "symbol",
    "decimals",
    "icon_hash",
    "price_usd",
    "price_usd_hardcoded",
    "price_usd_raw",
    "price_usd_raw_24h_ago",
    "volume_usd_24h",
    "liquidity_usd",
    "circulating_supply",
    "total_supply",
    "reputation",
];
/// What [`LivePrice`] reads of a token
const PRICE_FIELDS: [&str; 3] = ["price_usd", "price_usd_hardcoded", "price_usd_raw"];
/// How far a price moves before it's sent again, less than prices, values and 24h changes are
/// shown with
const PRICE_MIN_CHANGE: &str = "0.01%";

/// How far each field of [`TOKEN_FIELDS`] that moves with trades does before it's sent again
fn token_min_change() -> Value {
    serde_json::json!({
        "price_usd": PRICE_MIN_CHANGE,
        "price_usd_hardcoded": PRICE_MIN_CHANGE,
        "price_usd_raw": PRICE_MIN_CHANGE,
        "price_usd_raw_24h_ago": PRICE_MIN_CHANGE,
        "volume_usd_24h": "1%",
        "liquidity_usd": "1%",
        "circulating_supply": "0.1%",
        "total_supply": "0.1%",
    })
}

/// Tokens that selected account has
#[derive(Clone, Copy)]
pub struct TokensContext {
    pub tokens: ReadSignal<Vec<TokenData>>,
    pub loading_tokens: ReadSignal<bool>,
    pub set_tokens: WriteSignal<Vec<TokenData>>,
    live_prices: ReadSignal<HashMap<AccountId, LivePrice>>,
    price_watchers: RwSignal<HashMap<AccountId, usize>>,
    wrap_near: Memo<Option<AccountId>>,
}

impl TokensContext {
    pub fn watch_prices(&self, tokens: impl Fn() -> Vec<Token> + 'static) {
        let price_watchers = self.price_watchers;
        let wrap_near = self.wrap_near;
        let watched = Arc::new(Mutex::new(Vec::<AccountId>::new()));
        let unwatch = move |token_ids: &[AccountId]| {
            price_watchers.update(|watchers| {
                for token_id in token_ids {
                    if let Some(count) = watchers.get_mut(token_id) {
                        *count -= 1;
                        if *count == 0 {
                            watchers.remove(token_id);
                        }
                    }
                }
            });
        };
        Effect::new({
            let watched = Arc::clone(&watched);
            move |_| {
                let wrap_near = wrap_near.get();
                let token_ids = tokens()
                    .iter()
                    .filter_map(|token| price_id(token, wrap_near.as_ref()))
                    .collect::<Vec<_>>();
                price_watchers.update(|watchers| {
                    for token_id in &token_ids {
                        *watchers.entry(token_id.clone()).or_default() += 1;
                    }
                });
                let unwatched = std::mem::replace(&mut *watched.lock().unwrap(), token_ids);
                unwatch(&unwatched);
            }
        });
        on_cleanup(move || unwatch(&watched.lock().unwrap()));
    }

    pub fn live_price(&self, token: &Token) -> Option<LivePrice> {
        let token_id = price_id(token, self.wrap_near.get().as_ref())?;
        self.live_prices.get().get(&token_id).cloned()
    }
}

/// The token id `token` is referred to as. NEAR is stored as wNEAR
fn price_id(token: &Token, wrap_near: Option<&AccountId>) -> Option<AccountId> {
    match token {
        Token::Near => wrap_near.cloned(),
        Token::Nep141(account_id) | Token::Rhea(account_id) => Some(account_id.clone()),
    }
}

fn wrap_near_of(network: &Network) -> Option<AccountId> {
    match network {
        Network::Mainnet => Some("wrap.near".parse().unwrap()),
        Network::Testnet => Some("wrap.testnet".parse().unwrap()),
        Network::Localnet(network) => network.wrap_contract.clone(),
    }
}

fn near_icon() -> String {
    format!(
        "data:image/svg+xml;base64,{}",
        BASE64_STANDARD.encode(include_bytes!("../data/near.svg"))
    )
}

fn worth_a_sound(amount: Balance, token: &TokenInfo) -> bool {
    BigDecimal::from(amount) * &token.price_usd_hardcoded / power_of_10(token.metadata.decimals)
        >= 1
}

fn play_transfer_sound() {
    if let Ok(audio) = HtmlAudioElement::new() {
        audio.set_src("/cash-register-sound.mp3");
        let _ = audio.play();
    }
}

fn unpriced_token(
    account_id: Token,
    metadata: TokenMetadata,
    supply: Balance,
    reputation: TokenScore,
) -> TokenInfo {
    TokenInfo {
        account_id,
        metadata,
        price_usd: Default::default(),
        price_usd_hardcoded: Default::default(),
        price_usd_raw: Default::default(),
        price_usd_raw_24h_ago: Default::default(),
        volume_usd_24h: Default::default(),
        liquidity_usd: Default::default(),
        circulating_supply: supply,
        total_supply: supply,
        reputation,
    }
}

/// What `account_id` holds of NEAR and `tokens`, read from RPC, for a network without a prices
/// API: no prices, and not kept live.
async fn fetch_tokens_over_rpc(
    rpc_client: RpcClient,
    account_id: AccountId,
    tokens: Vec<AccountId>,
) -> Vec<TokenData> {
    let calls = |method: &'static str, args: serde_json::Value| {
        tokens
            .iter()
            .map(|token| {
                (
                    token.clone(),
                    method,
                    args.clone(),
                    QueryFinality::Finality(Finality::None),
                )
            })
            .collect::<Vec<_>>()
    };
    let (account, block, balances, metadata, supplies) = join5(
        rpc_client.view_account(account_id.clone(), QueryFinality::Finality(Finality::None)),
        rpc_client.block(BlockReference::Finality(Finality::None)),
        rpc_client.batch_call::<U128>(calls(
            "ft_balance_of",
            serde_json::json!({ "account_id": account_id }),
        )),
        rpc_client.batch_call::<TokenMetadata>(calls("ft_metadata", serde_json::json!({}))),
        rpc_client.batch_call::<U128>(calls("ft_total_supply", serde_json::json!({}))),
    )
    .await;

    let near_supply = block.map(|block| block.header.total_supply).unwrap_or(0);
    let mut token_data = vec![TokenData {
        balance: account
            .map(|account| account.amount.as_yoctonear())
            .unwrap_or(0),
        token: unpriced_token(
            Token::Near,
            TokenMetadata {
                name: "NEAR".to_string(),
                symbol: "NEAR".to_string(),
                decimals: 24,
                icon: Some(near_icon()),
            },
            near_supply,
            TokenScore::Reputable,
        ),
        source: TokenBalanceSource::Direct,
    }];
    if let (Ok(balances), Ok(metadata), Ok(supplies)) = (balances, metadata, supplies) {
        token_data.extend(
            balances
                .into_iter()
                .zip(&tokens)
                .zip(metadata)
                .zip(supplies)
                .filter_map(|(((balance, token), metadata), supply)| {
                    Some(TokenData {
                        balance: *balance.ok()?,
                        token: unpriced_token(
                            Token::Nep141(token.clone()),
                            metadata.ok()?,
                            *supply.ok()?,
                            TokenScore::NotFake,
                        ),
                        source: TokenBalanceSource::Direct,
                    })
                }),
        );
    }
    token_data
}

/// `token`'s data, as the price API has it for the token `token` is priced as: native NEAR is
/// itself, and a Rhea deposit [`Token::Rhea`]
fn held_as(token: Token, data: &TokenInfo) -> TokenInfo {
    match token {
        Token::Near => data.clone().into_native_near(),
        token => TokenInfo {
            account_id: token,
            ..data.clone()
        },
    }
}

/// The data of the tokens `balances` has, by id, and the tokens as `tokens` lists them, but spam
#[allow(clippy::type_complexity)]
fn held_tokens(
    balances: Balances,
    wrap_near: Option<&AccountId>,
    api_url: &Url,
) -> serde_json::Result<(HashMap<AccountId, TokenInfo>, Vec<TokenData>)> {
    for (source, error) in balances.errors {
        log::error!("Reading {source} balances failed: {error}");
    }
    let mut data = HashMap::new();
    for mut fields in balances.tokens.into_records() {
        let account_id: AccountId =
            serde_json::from_value(fields.remove("account_id").unwrap_or_default())?;
        let info = TokenInfo::from_fields(Token::Nep141(account_id.clone()), fields, api_url)?;
        data.insert(account_id, info);
    }
    let mut held = Vec::new();
    for BalanceRow {
        token,
        source,
        balance,
    } in balances.balances.deserialize()?
    {
        let (token, source) = match source {
            TokenBalanceSource::Native => (Token::Near, TokenBalanceSource::Direct),
            TokenBalanceSource::Direct => (Token::Nep141(token), source),
            TokenBalanceSource::Rhea => (Token::Rhea(token), source),
        };
        let Some(info) = price_id(&token, wrap_near).and_then(|id| data.get(&id)) else {
            log::error!("No data came with the balance of {token:?}");
            continue;
        };
        let info = held_as(token, info);
        if matches!(info.reputation, TokenScore::Spam) {
            continue;
        }
        held.push(TokenData {
            balance: balance.0,
            token: info,
            source,
        });
    }
    Ok((data, held))
}

/// Each row of `table`, a table of tokens, as its fields by token id
fn by_id(table: Table) -> HashMap<AccountId, Map<String, Value>> {
    table
        .into_records()
        .filter_map(|mut fields| {
            let account_id = serde_json::from_value(fields.remove("account_id")?)
                .inspect_err(|error| log::error!("Unexpected token id: {error}"))
                .ok()?;
            Some((account_id, fields))
        })
        .collect()
}

pub fn provide_token_context() {
    let (tokens, set_tokens) = signal::<Vec<TokenData>>(vec![]);
    let (loading, set_loading) = signal(true);
    let (live_prices, set_live_prices) = signal(HashMap::<AccountId, LivePrice>::new());
    let price_watchers = RwSignal::new(HashMap::<AccountId, usize>::new());
    let accounts_context = expect_context::<AccountsContext>();
    let rpc_client = expect_context::<RpcContext>();
    let config_context = expect_context::<ConfigContext>();
    let prices = expect_context::<PricesContext>();

    // The selected account with its network, once accounts are unlocked
    let selected = Memo::new(move |_| {
        let accounts = accounts_context.accounts.get();
        let account_id = accounts.selected_account_id?;
        let network = accounts
            .accounts
            .into_iter()
            .find(|account| account.account_id == account_id)?
            .network;
        Some((account_id, network))
    });
    let network = Memo::new(move |_| selected.get().map(|(_, network)| network));
    let wrap_near = Memo::new(move |_| network.get().as_ref().and_then(wrap_near_of));

    // The account whose balances `tokens` holds
    let loaded = RwSignal::new(None::<AccountId>);
    // The data the balances subscription follows, as the price API has it, by token id
    let followed_data = StoredValue::new(HashMap::<AccountId, TokenInfo>::new());
    // The connection's subscriptions: to an account's balances, and to prices of the tokens that
    // are watched or in `tokens` without being followed with the balances
    let balances_sub = StoredValue::new(None::<(u64, AccountId)>);
    let prices_sub = StoredValue::new(None::<(u64, BTreeSet<AccountId>)>);
    // Notified when the server ends one, for it to be made again
    let balances_ended = Trigger::new();
    let prices_ended = Trigger::new();

    let selected_account_is = move |account_id: &AccountId| {
        selected
            .get_untracked()
            .is_some_and(|(selected, _)| selected == *account_id)
    };

    let play_sound_for = move |amount: Balance, token: &TokenInfo| {
        if selected
            .get_untracked()
            .is_some_and(|(_, network)| network == Network::Mainnet)
            && config_context.config.get_untracked().play_transfer_sound
            && worth_a_sound(amount, token)
        {
            play_transfer_sound();
        }
    };

    let apply_held = move |account_id: AccountId,
                           data: HashMap<AccountId, TokenInfo>,
                           mut held: Vec<TokenData>| {
        if loaded.get_untracked().as_ref() == Some(&account_id) {
            for token in tokens.get_untracked() {
                if !held
                    .iter()
                    .any(|held| held.token.account_id == token.token.account_id)
                {
                    // keep metadata
                    held.push(TokenData {
                        balance: 0,
                        ..token
                    });
                }
            }
        }
        followed_data.set_value(data);
        set_tokens(held);
        loaded.set(Some(account_id));
        set_loading(false);
    };

    let apply_balances_push = move |account_id: &AccountId, api_url: &Url, push: BalancesPush| {
        if loaded.get_untracked().as_ref() != Some(account_id) {
            return;
        }
        let wrap_near = wrap_near.get_untracked();
        let data_of = |token: &Token| {
            let data_id = price_id(token, wrap_near.as_ref())?;
            followed_data.with_value(|data| data.get(&data_id).cloned())
        };
        // Changed fields, and every field of the data of tokens held for the first time
        let mut changed_data = HashSet::new();
        followed_data.update_value(|data| {
            for (data_id, fields) in push.set {
                match data.get_mut(&data_id) {
                    Some(info) => {
                        for (field, value) in fields {
                            if let Err(error) = info.set(&field, value, api_url) {
                                log::error!("Unexpected {field} of {data_id}: {error}");
                            }
                        }
                    }
                    None => match TokenInfo::from_fields(
                        Token::Nep141(data_id.clone()),
                        fields,
                        api_url,
                    ) {
                        Ok(info) => {
                            data.insert(data_id.clone(), info);
                        }
                        Err(error) => {
                            log::error!("Unexpected data of {data_id}: {error}");
                            continue;
                        }
                    },
                }
                changed_data.insert(data_id);
            }
        });
        set_tokens.maybe_update(|tokens| {
            let mut changed = false;
            for token in tokens.iter_mut() {
                if price_id(&token.token.account_id, wrap_near.as_ref())
                    .is_none_or(|data_id| !changed_data.contains(&data_id))
                {
                    continue;
                }
                if let Some(data) = data_of(&token.token.account_id) {
                    token.token = held_as(token.token.account_id.clone(), &data);
                    changed = true;
                }
            }
            for (token_id, U128(balance)) in push.balances {
                let token = if token_id == "near" {
                    Token::Near
                } else {
                    match token_id.parse() {
                        Ok(token_id) => Token::Nep141(token_id),
                        Err(error) => {
                            log::error!("Unexpected balance of {token_id}: {error}");
                            continue;
                        }
                    }
                };
                if let Some(held) = tokens
                    .iter_mut()
                    .find(|held| held.token.account_id == token)
                {
                    if balance > held.balance {
                        play_sound_for(balance - held.balance, &held.token);
                    }
                    held.balance = balance;
                    changed = true;
                    continue;
                }
                // Held for the first time, if it's still held and a token the price API knows
                if balance == 0 {
                    continue;
                }
                let Some(data) = data_of(&token) else {
                    continue;
                };
                let info = held_as(token, &data);
                if matches!(info.reputation, TokenScore::Spam) {
                    continue;
                }
                play_sound_for(balance, &info);
                tokens.push(TokenData {
                    balance,
                    token: info,
                    source: TokenBalanceSource::Direct,
                });
                changed = true;
            }
            changed
        });
    };

    // Follow the selected account's balances, with the data of the tokens it holds
    Effect::new(move |_| {
        balances_ended.track();
        let open_network = prices.open_network();
        let selected = selected.get();
        let Some(open_network) = open_network else {
            // Its subscriptions closed with it
            balances_sub.set_value(None);
            return;
        };
        let wanted = selected.filter(|(_, network)| *network == open_network);
        let followed = balances_sub.get_value();
        if followed.as_ref().map(|(_, account_id)| account_id)
            == wanted.as_ref().map(|(account_id, _)| account_id)
        {
            return;
        }
        if let Some((sub, _)) = followed {
            prices.unsubscribe(sub);
            balances_sub.set_value(None);
        }
        let Some((account_id, network)) = wanted else {
            return;
        };
        let Some(api_url) = network.prices_api_url() else {
            return;
        };
        let sub = prices.subscribe(
            "balances.subscribe",
            serde_json::json!({
                "account": account_id,
                "sources": ["direct", "native", "rhea"],
                "token_fields": TOKEN_FIELDS,
                "token_min_change": token_min_change(),
            }),
            {
                let account_id = account_id.clone();
                move |message| {
                    if !selected_account_is(&account_id) {
                        return;
                    }
                    match message {
                        SubscriptionMessage::Reply(Ok(result)) => {
                            match serde_json::from_value(result).and_then(|balances| {
                                held_tokens(balances, wrap_near.get_untracked().as_ref(), &api_url)
                            }) {
                                Ok((data, held)) => apply_held(account_id.clone(), data, held),
                                Err(error) => {
                                    log::error!("Unexpected balances of {account_id}: {error}")
                                }
                            }
                        }
                        SubscriptionMessage::Reply(Err(error)) => {
                            log::error!("Following the balances of {account_id} failed: {error}")
                        }
                        SubscriptionMessage::Push(push) => match serde_json::from_value(push) {
                            Ok(push) => apply_balances_push(&account_id, &api_url, push),
                            Err(error) => {
                                log::error!("Unexpected balance changes of {account_id}: {error}")
                            }
                        },
                        SubscriptionMessage::End(error) => {
                            log::warn!("The balances of {account_id} stopped: {error}");
                            balances_sub.set_value(None);
                            balances_ended.notify();
                        }
                    }
                }
            },
        );
        balances_sub.set_value(sub.map(|sub| (sub, account_id)));
    });

    // Tokens in `tokens` whose data the balances aren't followed with, like ones picked to swap to
    let unfollowed_ids = Memo::new(move |_| {
        let wrap_near = wrap_near.get();
        tokens.with(|tokens| {
            tokens
                .iter()
                .filter_map(|token| price_id(&token.token.account_id, wrap_near.as_ref()))
                .filter(|id| !followed_data.with_value(|data| data.contains_key(id)))
                .collect::<BTreeSet<_>>()
        })
    });

    let apply_prices = move |api_url: &Url, changed: HashMap<AccountId, Map<String, Value>>| {
        let watched = price_watchers.with_untracked(|watchers| {
            changed
                .keys()
                .filter(|id| watchers.contains_key(*id))
                .cloned()
                .collect::<HashSet<_>>()
        });
        set_live_prices.maybe_update(|live_prices| {
            let mut updated = false;
            for (account_id, fields) in &changed {
                if !watched.contains(account_id) {
                    continue;
                }
                match live_prices.get_mut(account_id) {
                    Some(price) => {
                        for (field, value) in fields {
                            if let Err(error) = price.set(field, value.clone()) {
                                log::error!("Unexpected {field} of {account_id}: {error}");
                            }
                        }
                    }
                    // A token's first prices come with every field
                    None => match serde_json::from_value(Value::Object(fields.clone())) {
                        Ok(price) => {
                            live_prices.insert(account_id.clone(), price);
                        }
                        Err(_) => continue,
                    },
                }
                updated = true;
            }
            updated
        });
        let wrap_near = wrap_near.get_untracked();
        set_tokens.maybe_update(|tokens| {
            let mut updated = false;
            for token in tokens.iter_mut() {
                let Some(fields) = price_id(&token.token.account_id, wrap_near.as_ref())
                    .and_then(|id| changed.get(&id))
                else {
                    continue;
                };
                for (field, value) in fields {
                    if let Err(error) = token.token.set(field, value.clone(), api_url) {
                        log::error!(
                            "Unexpected {field} of {:?}: {error}",
                            token.token.account_id
                        );
                    }
                }
                updated = true;
            }
            updated
        });
    };

    // Live track the prices of watched tokens, and of the tokens in `tokens` whose data the
    // balances aren't followed with
    Effect::new(move |_| {
        prices_ended.track();
        let Some(network) = prices.open_network() else {
            // Its subscriptions closed with it
            prices_sub.set_value(None);
            return;
        };
        let Some(api_url) = network.prices_api_url() else {
            return;
        };
        let mut ids = unfollowed_ids.get();
        price_watchers.with(|watchers| ids.extend(watchers.keys().cloned()));
        let Some((sub, followed)) = prices_sub.get_value() else {
            if ids.is_empty() {
                return;
            }
            let sub = prices.subscribe(
                "tokens.subscribe",
                serde_json::json!({
                    "fields": PRICE_FIELDS,
                    "ids": ids,
                    "min_change": {
                        "price_usd": PRICE_MIN_CHANGE,
                        "price_usd_hardcoded": PRICE_MIN_CHANGE,
                        "price_usd_raw": PRICE_MIN_CHANGE,
                    },
                    "min_interval_ms": 1000,
                }),
                move |message| match message {
                    SubscriptionMessage::Reply(Ok(result)) => {
                        match serde_json::from_value::<Table>(result) {
                            Ok(table) => apply_prices(&api_url, by_id(table)),
                            Err(error) => log::error!("Unexpected prices: {error}"),
                        }
                    }
                    SubscriptionMessage::Reply(Err(error)) => {
                        log::error!("Following prices failed: {error}")
                    }
                    SubscriptionMessage::Push(push) => match serde_json::from_value(push) {
                        Ok(TokensPush { set }) => apply_prices(&api_url, set),
                        Err(error) => log::error!("Unexpected price changes: {error}"),
                    },
                    SubscriptionMessage::End(error) => {
                        log::warn!("Prices stopped: {error}");
                        prices_sub.set_value(None);
                        prices_ended.notify();
                    }
                },
            );
            prices_sub.set_value(sub.map(|sub| (sub, ids)));
            return;
        };
        let add = ids.difference(&followed).cloned().collect::<Vec<_>>();
        let remove = followed.difference(&ids).cloned().collect::<Vec<_>>();
        if add.is_empty() && remove.is_empty() {
            return;
        }
        prices_sub.set_value(Some((sub, ids)));
        spawn_local(async move {
            match prices
                .request::<Table>(
                    &network,
                    "tokens.update",
                    serde_json::json!({ "sub": sub, "add": add, "remove": remove }),
                )
                .await
            {
                Ok(added) => apply_prices(&api_url, by_id(added)),
                Err(error) => {
                    log::error!("Changing the tokens whose prices are followed failed: {error}")
                }
            }
        });
    });

    Effect::new(move |_| {
        let selected = selected.get();
        set_tokens(vec![]);
        loaded.set(None);
        followed_data.set_value(HashMap::new());
        let Some((account_id, network)) = selected else {
            set_loading(
                accounts_context
                    .accounts
                    .get()
                    .selected_account_id
                    .is_some(),
            );
            return;
        };
        set_loading(true);
        if network.prices_api_url().is_some() {
            // The websocket loads tokens
            return;
        }
        let Network::Localnet(localnet) = network else {
            unreachable!("Mainnet and testnet have a prices API");
        };
        let mut token_ids = localnet.tokens.clone();
        token_ids.extend(localnet.wrap_contract.clone());
        let rpc_client = rpc_client.client.get_untracked();
        spawn_local(async move {
            let token_data = fetch_tokens_over_rpc(
                rpc_client,
                account_id.clone(),
                token_ids.into_iter().collect(),
            )
            .await;
            if selected_account_is(&account_id) {
                set_tokens(token_data);
                set_loading(false);
            }
        });
    });

    Effect::new(move |_| {
        tokens.track();
        set_tokens.maybe_update(|tokens| {
            let mut new_tokens = tokens.clone();
            new_tokens.sort_by(|t1, t2| {
                let t1_hardcoded_order = match &t1.token.account_id {
                    Token::Near => 0,
                    Token::Nep141(_) => 1,
                    Token::Rhea(_) => 2,
                };
                let t2_hardcoded_order = match &t2.token.account_id {
                    Token::Near => 0,
                    Token::Nep141(_) => 1,
                    Token::Rhea(_) => 2,
                };
                let t1_value = BigDecimal::from(t1.balance) * &t1.token.price_usd_raw;
                let t2_value = BigDecimal::from(t2.balance) * &t2.token.price_usd_raw;
                let t1_name_comparable = match &t1.token.account_id {
                    Token::Near => "NEAR".to_string(),
                    Token::Nep141(id) => id.to_string(),
                    Token::Rhea(id) => id.to_string(),
                };
                let t2_name_comparable = match &t2.token.account_id {
                    Token::Near => "NEAR".to_string(),
                    Token::Nep141(id) => id.to_string(),
                    Token::Rhea(id) => id.to_string(),
                };
                t1_hardcoded_order
                    .cmp(&t2_hardcoded_order)
                    .then_with(|| t1_value.cmp(&t2_value).reverse())
                    .then_with(|| t1_name_comparable.cmp(&t2_name_comparable))
            });
            let has_changed = new_tokens
                .iter()
                .map(|token| token.token.account_id.clone())
                .collect::<Vec<_>>()
                != tokens
                    .iter()
                    .map(|token| token.token.account_id.clone())
                    .collect::<Vec<_>>();
            if has_changed {
                *tokens = new_tokens;
            }
            has_changed
        });
    });

    // Provide updates to token cache
    Effect::new(move |_| {
        let tokens = tokens.get();
        spawn_local(async move {
            *TOKEN_CACHE.lock().await = tokens.clone();
        });
    });

    provide_context(TokensContext {
        tokens,
        set_tokens,
        loading_tokens: loading,
        live_prices,
        price_watchers,
        wrap_near,
    });
}
