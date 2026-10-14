use std::{
    collections::{BTreeMap, BTreeSet, HashMap, HashSet},
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
use serde::{Deserialize, Serialize};
use web_sys::HtmlAudioElement;

use crate::utils::{TOKEN_CACHE, power_of_10};

use super::{
    accounts_context::AccountsContext,
    api_context::{
        ApiContext, BalanceRow, BalanceSource, Balances, BalancesPush, BalancesSubscribe,
        HeldToken, Rows, Subscription, SubscriptionEvent, Threshold, TokenField, TokenFields,
        TokenRow, TokensPush, TokensSubscribe, TokensUpdate, icon_url,
    },
    config_context::ConfigContext,
    network_context::{Network, NetworkContext},
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
    /// The token as `network`'s Intear API has it, from every one of [`TOKEN_FIELDS`]
    pub fn new(account_id: Token, fields: TokenFields, network: &Network) -> Result<Self, String> {
        let missing = |field: &str| format!("{account_id:?} came without {field}");
        Ok(TokenInfo {
            metadata: TokenMetadata {
                name: fields.name.ok_or_else(|| missing("name"))?,
                symbol: fields.symbol.ok_or_else(|| missing("symbol"))?,
                decimals: fields.decimals.ok_or_else(|| missing("decimals"))?,
                icon: fields
                    .icon_hash
                    .ok_or_else(|| missing("icon_hash"))?
                    .and_then(|icon_hash| icon_url(network, &icon_hash)),
            },
            price_usd: fields.price_usd.ok_or_else(|| missing("price_usd"))?,
            price_usd_hardcoded: fields
                .price_usd_hardcoded
                .ok_or_else(|| missing("price_usd_hardcoded"))?,
            price_usd_raw: fields
                .price_usd_raw
                .ok_or_else(|| missing("price_usd_raw"))?,
            price_usd_raw_24h_ago: fields
                .price_usd_raw_24h_ago
                .ok_or_else(|| missing("price_usd_raw_24h_ago"))?,
            volume_usd_24h: fields
                .volume_usd_24h
                .ok_or_else(|| missing("volume_usd_24h"))?,
            liquidity_usd: fields
                .liquidity_usd
                .ok_or_else(|| missing("liquidity_usd"))?,
            circulating_supply: fields
                .circulating_supply
                .ok_or_else(|| missing("circulating_supply"))?
                .0,
            total_supply: fields
                .total_supply
                .ok_or_else(|| missing("total_supply"))?
                .0,
            reputation: fields.reputation.ok_or_else(|| missing("reputation"))?,
            account_id,
        })
    }

    /// Takes the fields `fields` has, as `network`'s Intear API sent them
    pub fn apply(&mut self, fields: TokenFields, network: &Network) {
        let TokenFields {
            name,
            symbol,
            decimals,
            icon_hash,
            price_usd,
            price_usd_hardcoded,
            price_usd_raw,
            price_usd_raw_24h_ago,
            volume_usd_24h,
            liquidity_usd,
            circulating_supply,
            total_supply,
            reputation,
            price_change_24h: _,
            deleted: _,
        } = fields;
        if let Some(name) = name {
            self.metadata.name = name;
        }
        if let Some(symbol) = symbol {
            self.metadata.symbol = symbol;
        }
        if let Some(decimals) = decimals {
            self.metadata.decimals = decimals;
        }
        if let Some(icon_hash) = icon_hash {
            self.metadata.icon = icon_hash.and_then(|icon_hash| icon_url(network, &icon_hash));
        }
        if let Some(price_usd) = price_usd {
            self.price_usd = price_usd;
        }
        if let Some(price_usd_hardcoded) = price_usd_hardcoded {
            self.price_usd_hardcoded = price_usd_hardcoded;
        }
        if let Some(price_usd_raw) = price_usd_raw {
            self.price_usd_raw = price_usd_raw;
        }
        if let Some(price_usd_raw_24h_ago) = price_usd_raw_24h_ago {
            self.price_usd_raw_24h_ago = price_usd_raw_24h_ago;
        }
        if let Some(volume_usd_24h) = volume_usd_24h {
            self.volume_usd_24h = volume_usd_24h;
        }
        if let Some(liquidity_usd) = liquidity_usd {
            self.liquidity_usd = liquidity_usd;
        }
        if let Some(U128(circulating_supply)) = circulating_supply {
            self.circulating_supply = circulating_supply;
        }
        if let Some(U128(total_supply)) = total_supply {
            self.total_supply = total_supply;
        }
        if let Some(reputation) = reputation {
            self.reputation = reputation;
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
    /// A token's first prices, which come with every one of [`PRICE_FIELDS`]
    fn new(fields: &TokenFields) -> Option<Self> {
        Some(LivePrice {
            price_usd: fields.price_usd.clone()?,
            price_usd_hardcoded: fields.price_usd_hardcoded.clone()?,
            price_usd_raw: fields.price_usd_raw.clone()?,
        })
    }

    fn apply(&mut self, fields: &TokenFields) {
        if let Some(price_usd) = &fields.price_usd {
            self.price_usd = price_usd.clone();
        }
        if let Some(price_usd_hardcoded) = &fields.price_usd_hardcoded {
            self.price_usd_hardcoded = price_usd_hardcoded.clone();
        }
        if let Some(price_usd_raw) = &fields.price_usd_raw {
            self.price_usd_raw = price_usd_raw.clone();
        }
    }
}

/// What [`TokenInfo`] reads of a token, the only fields asked of the Intear API
pub const TOKEN_FIELDS: [TokenField; 13] = [
    TokenField::Name,
    TokenField::Symbol,
    TokenField::Decimals,
    TokenField::IconHash,
    TokenField::PriceUsd,
    TokenField::PriceUsdHardcoded,
    TokenField::PriceUsdRaw,
    TokenField::PriceUsdRaw24hAgo,
    TokenField::VolumeUsd24h,
    TokenField::LiquidityUsd,
    TokenField::CirculatingSupply,
    TokenField::TotalSupply,
    TokenField::Reputation,
];
/// What [`LivePrice`] reads of a token
const PRICE_FIELDS: [TokenField; 3] = [
    TokenField::PriceUsd,
    TokenField::PriceUsdHardcoded,
    TokenField::PriceUsdRaw,
];
/// How far a price moves before it's sent again, less than prices, values and 24h changes are
/// shown with
const PRICE_MIN_CHANGE: Threshold = Threshold::Bp1;

/// How far each field of [`TOKEN_FIELDS`] that moves with trades does before it's sent again
fn token_min_change() -> BTreeMap<TokenField, Threshold> {
    BTreeMap::from([
        (TokenField::PriceUsd, PRICE_MIN_CHANGE),
        (TokenField::PriceUsdHardcoded, PRICE_MIN_CHANGE),
        (TokenField::PriceUsdRaw, PRICE_MIN_CHANGE),
        (TokenField::PriceUsdRaw24hAgo, PRICE_MIN_CHANGE),
        (TokenField::VolumeUsd24h, Threshold::Bp100),
        (TokenField::LiquidityUsd, Threshold::Bp100),
        (TokenField::CirculatingSupply, Threshold::Bp10),
        (TokenField::TotalSupply, Threshold::Bp10),
    ])
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

fn near_metadata() -> TokenMetadata {
    TokenMetadata {
        name: "NEAR".to_string(),
        symbol: "NEAR".to_string(),
        decimals: 24,
        icon: Some(format!(
            "data:image/svg+xml;base64,{}",
            BASE64_STANDARD.encode(include_bytes!("../data/near.svg"))
        )),
    }
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
            near_metadata(),
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

/// `token`'s data, from `data`, the Intear API's by id: a token's own, a Rhea deposit's token's,
/// and for native NEAR, its own name and icon with wrap.near's prices and market
fn held_data(
    token: &Token,
    data: &HashMap<AccountId, TokenInfo>,
    wrap_near: Option<&AccountId>,
) -> Option<TokenInfo> {
    match token {
        Token::Near => {
            let wrap_near = data.get(wrap_near?)?;
            Some(TokenInfo {
                account_id: Token::Near,
                metadata: near_metadata(),
                reputation: TokenScore::Reputable,
                ..wrap_near.clone()
            })
        }
        Token::Nep141(account_id) => data.get(account_id).cloned(),
        Token::Rhea(account_id) => data.get(account_id).map(|info| TokenInfo {
            account_id: token.clone(),
            ..info.clone()
        }),
    }
}

/// The data of the tokens `balances` has, by id, and the tokens as `balances` lists them, but spam
#[allow(clippy::type_complexity)]
fn held_tokens(
    balances: Balances,
    wrap_near: Option<&AccountId>,
    network: &Network,
) -> Result<(HashMap<AccountId, TokenInfo>, Vec<TokenData>), String> {
    for (source, error) in balances.errors {
        log::error!("Reading {source:?} balances failed: {error}");
    }
    let mut data = HashMap::new();
    for TokenRow { account_id, fields } in balances.tokens.0 {
        let info = TokenInfo::new(Token::Nep141(account_id.clone()), fields, network)?;
        data.insert(account_id, info);
    }
    let mut held = Vec::new();
    for BalanceRow {
        token,
        source,
        balance,
    } in balances.balances.0
    {
        let (token, source) = match (token, source) {
            (HeldToken::Near, _) => (Token::Near, TokenBalanceSource::Direct),
            (HeldToken::Token(token), BalanceSource::Rhea) => {
                (Token::Rhea(token), TokenBalanceSource::Rhea)
            }
            (HeldToken::Token(token), _) => (Token::Nep141(token), TokenBalanceSource::Direct),
        };
        let Some(info) = held_data(&token, &data, wrap_near) else {
            log::error!("No data came with the balance of {token:?}");
            continue;
        };
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

/// Each row of a table of tokens, as its fields by token id
fn by_id(rows: Rows<TokenRow>) -> HashMap<AccountId, TokenFields> {
    rows.0
        .into_iter()
        .map(|TokenRow { account_id, fields }| (account_id, fields))
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
    let api = expect_context::<ApiContext>();
    let api_network = expect_context::<NetworkContext>().network;

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
    // The data the balances subscription follows, as the Intear API has it, by token id
    let followed_data = StoredValue::new(HashMap::<AccountId, TokenInfo>::new());
    // The connection's subscriptions: to an account's balances, and to prices of the tokens that
    // are watched or in `tokens` without being followed with the balances
    let balances_sub = StoredValue::new(None::<(Subscription, AccountId)>);
    let prices_sub = StoredValue::new(None::<(Subscription, BTreeSet<AccountId>)>);
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

    let apply_balances_push = move |account_id: &AccountId,
                                    network: &Network,
                                    push: BalancesPush| {
        if loaded.get_untracked().as_ref() != Some(account_id) {
            return;
        }
        let wrap_near = wrap_near.get_untracked();
        let data_of = |token: &Token| {
            followed_data.with_value(|data| held_data(token, data, wrap_near.as_ref()))
        };
        // Changed fields, and every field of the data of tokens held for the first time
        let mut changed_data = HashSet::new();
        followed_data.update_value(|data| {
            for (data_id, fields) in push.set {
                match data.get_mut(&data_id) {
                    Some(info) => info.apply(fields, network),
                    None => match TokenInfo::new(Token::Nep141(data_id.clone()), fields, network) {
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
                    token.token = data;
                    changed = true;
                }
            }
            for (held, U128(balance)) in push.balances {
                let token = match held {
                    HeldToken::Near => Token::Near,
                    HeldToken::Token(token_id) => Token::Nep141(token_id),
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
                // Held for the first time, if it's still held and a token the Intear API knows
                if balance == 0 {
                    continue;
                }
                let Some(info) = data_of(&token) else {
                    continue;
                };
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
        let session = api.session();
        let selected = selected.get();
        let api_network = api_network.get();
        let Some(session) = session else {
            // Its subscriptions closed with it
            balances_sub.set_value(None);
            return;
        };
        let wanted = selected.filter(|(_, network)| *network == api_network);
        let followed = balances_sub.get_value();
        if followed.as_ref().is_some_and(|(sub, account_id)| {
            sub.session() == session
                && wanted.as_ref().map(|(wanted, _)| wanted) == Some(account_id)
        }) || (followed.is_none() && wanted.is_none())
        {
            return;
        }
        if let Some((sub, _)) = followed {
            api.unsubscribe(sub);
            balances_sub.set_value(None);
        }
        let Some((account_id, network)) = wanted else {
            return;
        };
        let sub = api.subscribe(
            BalancesSubscribe {
                account: account_id.clone(),
                sources: vec![
                    BalanceSource::Direct,
                    BalanceSource::Native,
                    BalanceSource::Rhea,
                ],
                token_fields: TOKEN_FIELDS.to_vec(),
                token_min_change: token_min_change(),
            },
            {
                let account_id = account_id.clone();
                move |event| {
                    if !selected_account_is(&account_id) {
                        return;
                    }
                    match event {
                        SubscriptionEvent::Reply(Ok(balances)) => {
                            match held_tokens(
                                balances,
                                wrap_near.get_untracked().as_ref(),
                                &network,
                            ) {
                                Ok((data, held)) => apply_held(account_id.clone(), data, held),
                                Err(error) => {
                                    log::error!("Unexpected balances of {account_id}: {error}")
                                }
                            }
                        }
                        SubscriptionEvent::Reply(Err(error)) => {
                            log::error!("Following the balances of {account_id} failed: {error}")
                        }
                        SubscriptionEvent::Push(push) => {
                            apply_balances_push(&account_id, &network, push)
                        }
                        SubscriptionEvent::End(error) => {
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

    let apply_prices = move |network: &Network, changed: HashMap<AccountId, TokenFields>| {
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
                    Some(price) => price.apply(fields),
                    None => match LivePrice::new(fields) {
                        Some(price) => {
                            live_prices.insert(account_id.clone(), price);
                        }
                        None => continue,
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
                // Only prices, so native NEAR keeps what it's called
                token.token.apply(fields.clone(), network);
                updated = true;
            }
            updated
        });
    };

    // Live track the prices of watched tokens, and of the tokens in `tokens` whose data the
    // balances aren't followed with
    Effect::new(move |_| {
        prices_ended.track();
        let Some(session) = api.session() else {
            // Its subscriptions closed with it
            prices_sub.set_value(None);
            return;
        };
        let network = api_network.get_untracked();
        let mut ids = unfollowed_ids.get();
        price_watchers.with(|watchers| ids.extend(watchers.keys().cloned()));
        let followed = prices_sub
            .get_value()
            .filter(|(sub, _)| sub.session() == session);
        let Some((sub, followed)) = followed else {
            if ids.is_empty() {
                prices_sub.set_value(None);
                return;
            }
            let sub = api.subscribe(
                TokensSubscribe {
                    ids: ids.iter().cloned().collect(),
                    fields: PRICE_FIELDS.to_vec(),
                    min_change: PRICE_FIELDS.map(|field| (field, PRICE_MIN_CHANGE)).into(),
                    min_interval_ms: 1000,
                },
                move |event| match event {
                    SubscriptionEvent::Reply(Ok(rows)) => apply_prices(&network, by_id(rows)),
                    SubscriptionEvent::Reply(Err(error)) => {
                        log::error!("Following prices failed: {error}")
                    }
                    SubscriptionEvent::Push(TokensPush { set }) => apply_prices(&network, set),
                    SubscriptionEvent::End(error) => {
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
            match api.request(TokensUpdate { sub, add, remove }).await {
                Ok(added) => apply_prices(&network, by_id(added)),
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
        if network.api_url().is_some() {
            // The websocket loads tokens
            return;
        }
        let Network::Localnet(localnet) = network else {
            unreachable!("Mainnet and testnet have an Intear API");
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
