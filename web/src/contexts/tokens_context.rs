use std::{
    collections::{BTreeSet, HashMap, HashSet},
    str::FromStr,
    sync::{Arc, Mutex},
};

use base64::{Engine, prelude::BASE64_STANDARD};
use bigdecimal::BigDecimal;
use codee::string::FromToStringCodec;
use futures_util::future::join5;
use leptos::{prelude::*, task::spawn_local};
use leptos_use::{
    ReconnectLimit, UseWebSocketOptions, core::ConnectionReadyState, use_websocket_with_options,
};
use near_min_api::{
    QueryFinality, RpcClient,
    types::{AccountId, Balance, BlockReference, Finality, U128},
    utils::dec_format,
};
use serde::{Deserialize, Serialize};
use web_sys::HtmlAudioElement;

use crate::utils::{TOKEN_CACHE, power_of_10};

use super::{
    accounts_context::AccountsContext, config_context::ConfigContext, network_context::Network,
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
    fn apply_to(&self, token: &mut TokenInfo) {
        token.price_usd = self.price_usd.clone();
        token.price_usd_hardcoded = self.price_usd_hardcoded.clone();
        token.price_usd_raw = self.price_usd_raw.clone();
    }
}

enum TokensWsMessage {
    UserTokens(UserTokens),
    BalanceChanged(BalanceChanged),
    Prices(Prices),
    PriceChanged(PriceChanged),
    Tokens(Tokens),
    Other,
}

#[derive(Deserialize)]
struct UserTokens {
    account_id: AccountId,
    tokens: Vec<TokenData>,
}

#[derive(Deserialize)]
struct BalanceChanged {
    account_id: AccountId,
    token_id: AccountId,
    #[serde(with = "dec_format")]
    balance: Balance,
}

#[derive(Deserialize)]
struct Prices {
    prices: HashMap<AccountId, LivePrice>,
}

#[derive(Deserialize)]
struct PriceChanged {
    account_id: AccountId,
    price_usd: BigDecimal,
    price_usd_hardcoded: BigDecimal,
    price_usd_raw: BigDecimal,
}

#[derive(Deserialize)]
struct Tokens {
    tokens: HashMap<AccountId, TokenInfo>,
}

impl TokensWsMessage {
    // https://github.com/serde-rs/serde/issues/1183 workaround
    fn parse(message: &str) -> serde_json::Result<Self> {
        #[derive(Deserialize)]
        struct Type {
            r#type: String,
        }
        Ok(
            match serde_json::from_str::<Type>(message)?.r#type.as_str() {
                "user_tokens" => Self::UserTokens(serde_json::from_str(message)?),
                "balance_changed" => Self::BalanceChanged(serde_json::from_str(message)?),
                "prices" => Self::Prices(serde_json::from_str(message)?),
                "price_changed" => Self::PriceChanged(serde_json::from_str(message)?),
                "tokens" => Self::Tokens(serde_json::from_str(message)?),
                _ => Self::Other,
            },
        )
    }
}

/// The most tokens `/tokens/ws` takes in one request.
const MAX_ACCOUNT_IDS: usize = 1_000;

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

/// `/tokens/ws` of the network's prices API, if it has one.
fn tokens_ws_url(network: &Network) -> Option<String> {
    let prices_api_url = match network {
        Network::Mainnet => "https://prices.intear.tech",
        Network::Testnet => "https://prices-testnet.intear.tech",
        Network::Localnet(network) => network.prices_api_url.as_deref()?,
    };
    let ws_url = if let Some(host) = prices_api_url.strip_prefix("https://") {
        format!("wss://{host}")
    } else if let Some(host) = prices_api_url.strip_prefix("http://") {
        format!("ws://{host}")
    } else {
        log::error!("Prices API URL {prices_api_url} is neither http:// nor https://");
        return None;
    };
    Some(format!("{ws_url}/tokens/ws?thumbnails=false"))
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

pub fn provide_token_context() {
    let (tokens, set_tokens) = signal::<Vec<TokenData>>(vec![]);
    let (loading, set_loading) = signal(true);
    let (live_prices, set_live_prices) = signal(HashMap::<AccountId, LivePrice>::new());
    let price_watchers = RwSignal::new(HashMap::<AccountId, usize>::new());
    let accounts_context = expect_context::<AccountsContext>();
    let rpc_client = expect_context::<RpcContext>();
    let config_context = expect_context::<ConfigContext>();

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

    // The account whose `user_tokens` reply `tokens` holds
    let loaded = RwSignal::new(None::<AccountId>);
    // Balances of tokens that aren't in `tokens` yet, until their `tokens` reply comes
    let missing_tokens = RwSignal::new(HashMap::<AccountId, Balance>::new());
    // What this connection has been asked for, forgotten on every reconnect
    let followed = StoredValue::new(None::<AccountId>);
    let sent_price_changes = StoredValue::new(None::<Vec<AccountId>>);
    let requested_tokens = StoredValue::new(HashSet::<AccountId>::new());

    let apply_price = move |account_id: AccountId, price: LivePrice| {
        let is_wrap_near = wrap_near.get_untracked().as_ref() == Some(&account_id);
        set_tokens.maybe_update(|tokens| {
            let mut changed = false;
            for token in tokens.iter_mut() {
                let has_this_price = match &token.token.account_id {
                    Token::Near => is_wrap_near,
                    Token::Nep141(token_id) | Token::Rhea(token_id) => *token_id == account_id,
                };
                if has_this_price {
                    price.apply_to(&mut token.token);
                    changed = true;
                }
            }
            changed
        });
        if price_watchers.read_untracked().contains_key(&account_id) {
            set_live_prices.update(|live_prices| {
                live_prices.insert(account_id, price);
            });
        }
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

    let handle_message = move |message: &String| {
        let message = match TokensWsMessage::parse(message) {
            Ok(message) => message,
            Err(err) => {
                log::error!("Unexpected message from /tokens/ws: {err}");
                return;
            }
        };
        match message {
            TokensWsMessage::UserTokens(UserTokens {
                account_id,
                tokens: held,
            }) => {
                if selected.get_untracked().map(|(account_id, _)| account_id)
                    != Some(account_id.clone())
                {
                    return;
                }
                let mut held = held
                    .into_iter()
                    .filter(|token| !matches!(token.token.reputation, TokenScore::Spam))
                    .map(|mut token| {
                        match token.source {
                            TokenBalanceSource::Native => {
                                token.token.account_id = Token::Near;
                                token.token.metadata.icon = Some(near_icon());
                                token.token.reputation = TokenScore::Reputable;
                                token.source = TokenBalanceSource::Direct;
                            }
                            TokenBalanceSource::Rhea => {
                                if let Token::Nep141(account_id) = &token.token.account_id {
                                    token.token.account_id = Token::Rhea(account_id.clone());
                                }
                            }
                            TokenBalanceSource::Direct => {}
                        }
                        token
                    })
                    .collect::<Vec<_>>();
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
                set_tokens(held);
                missing_tokens.set(HashMap::new());
                loaded.set(Some(account_id));
                set_loading(false);
            }
            TokensWsMessage::BalanceChanged(BalanceChanged {
                account_id,
                token_id,
                balance,
            }) => {
                if loaded.get_untracked().as_ref() != Some(&account_id) {
                    return;
                }
                let token = if token_id == "near" {
                    Token::Near
                } else {
                    Token::Nep141(token_id.clone())
                };
                let mut found = false;
                set_tokens.maybe_update(|tokens| {
                    let Some(held) = tokens
                        .iter_mut()
                        .find(|held| held.token.account_id == token)
                    else {
                        return false;
                    };
                    found = true;
                    if balance > held.balance {
                        play_sound_for(balance - held.balance, &held.token);
                    }
                    held.balance = balance;
                    true
                });
                if !found {
                    missing_tokens.update(|missing| {
                        if balance > 0 {
                            missing.insert(token_id, balance);
                        } else {
                            missing.remove(&token_id);
                        }
                    });
                }
            }
            TokensWsMessage::Prices(Prices { prices }) => {
                for (account_id, price) in prices {
                    apply_price(account_id, price);
                }
            }
            TokensWsMessage::PriceChanged(PriceChanged {
                account_id,
                price_usd,
                price_usd_hardcoded,
                price_usd_raw,
            }) => apply_price(
                account_id,
                LivePrice {
                    price_usd,
                    price_usd_hardcoded,
                    price_usd_raw,
                },
            ),
            TokensWsMessage::Tokens(Tokens { tokens: infos }) => {
                let mut added = vec![];
                missing_tokens.update(|missing| {
                    for (account_id, info) in infos {
                        let Some(balance) = missing.remove(&account_id) else {
                            continue;
                        };
                        if matches!(info.reputation, TokenScore::Spam) {
                            continue;
                        }
                        play_sound_for(balance, &info);
                        added.push(TokenData {
                            balance,
                            token: info,
                            source: TokenBalanceSource::Direct,
                        });
                    }
                });
                if !added.is_empty() {
                    set_tokens.update(|tokens| tokens.extend(added));
                }
            }
            TokensWsMessage::Other => {}
        }
    };

    let (socket, set_socket) = signal(None);
    Effect::new(move |_| {
        set_socket(network.get().as_ref().and_then(tokens_ws_url).map(|url| {
            use_websocket_with_options::<String, String, FromToStringCodec, _, _>(
                &url,
                UseWebSocketOptions::default()
                    .reconnect_limit(ReconnectLimit::Infinite)
                    .reconnect_interval(1000)
                    .on_message(handle_message),
            )
        }));
    });

    Effect::new(move |_| {
        let Some(ws) = socket.get() else {
            return;
        };
        if ws.ready_state.get() != ConnectionReadyState::Open {
            followed.set_value(None);
            sent_price_changes.set_value(None);
            requested_tokens.set_value(HashSet::new());
            return;
        }
        let Some((account_id, _)) = selected.get() else {
            return;
        };
        if followed.get_value().as_ref() == Some(&account_id) {
            return;
        }
        if let Some(previous) = followed.get_value() {
            (ws.send)(
                &serde_json::json!({ "type": "stop_user_tokens", "account_id": previous })
                    .to_string(),
            );
        }
        (ws.send)(
            &serde_json::json!({
                "type": "user_tokens",
                "account_id": account_id,
                "direct": true,
                "rhea": true,
                "native": true,
            })
            .to_string(),
        );
        followed.set_value(Some(account_id));
    });

    // Live track the prices of NEAR, the tokens in `tokens` and watched tokens
    let token_price_ids = Memo::new(move |_| {
        tokens()
            .iter()
            .filter_map(|token| match &token.token.account_id {
                Token::Near => None,
                Token::Nep141(account_id) | Token::Rhea(account_id) => Some(account_id.clone()),
            })
            .collect::<BTreeSet<_>>()
    });
    Effect::new(move |_| {
        let Some(ws) = socket.get() else {
            return;
        };
        if ws.ready_state.get() != ConnectionReadyState::Open {
            return;
        }
        let mut token_ids = token_price_ids.get();
        token_ids.extend(price_watchers.read().keys().cloned().collect::<Vec<_>>());
        token_ids.extend(wrap_near.get());
        let mut token_ids = token_ids.into_iter().collect::<Vec<_>>();
        if token_ids.len() > MAX_ACCOUNT_IDS {
            log::error!(
                "Keeping only {MAX_ACCOUNT_IDS} of {} token prices live",
                token_ids.len()
            );
            token_ids.truncate(MAX_ACCOUNT_IDS);
        }
        if sent_price_changes.get_value().as_ref() == Some(&token_ids) {
            return;
        }
        (ws.send)(
            &serde_json::json!({ "type": "price_changes", "account_ids": token_ids }).to_string(),
        );
        sent_price_changes.set_value(Some(token_ids));
    });

    // Fetch the tokens the account got balances of but doesn't have in `tokens` yet
    Effect::new(move |_| {
        let Some(ws) = socket.get() else {
            return;
        };
        if ws.ready_state.get() != ConnectionReadyState::Open {
            return;
        }
        let requested = requested_tokens.read_value();
        let token_ids = missing_tokens
            .read()
            .keys()
            .filter(|token_id| !requested.contains(*token_id))
            .take(MAX_ACCOUNT_IDS)
            .cloned()
            .collect::<Vec<_>>();
        if token_ids.is_empty() {
            return;
        }
        requested_tokens.update_value(|requested| requested.extend(token_ids.iter().cloned()));
        (ws.send)(&serde_json::json!({ "type": "tokens", "account_ids": token_ids }).to_string());
    });

    let selected_account_is = move |account_id: AccountId| {
        selected
            .get_untracked()
            .is_some_and(|(selected, _)| selected == account_id)
    };

    Effect::new(move |_| {
        let selected = selected.get();
        set_tokens(vec![]);
        loaded.set(None);
        missing_tokens.set(HashMap::new());
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
        if tokens_ws_url(&network).is_some() {
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
            if selected_account_is(account_id) {
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
