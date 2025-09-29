use std::{collections::HashSet, future::Future, str::FromStr};

use base64::{prelude::BASE64_STANDARD, Engine};
use bigdecimal::BigDecimal;
use codee::string::FromToStringCodec;
use futures_util::{future::join, TryFutureExt};
use itertools::Either;
use json_filter::{Filter, Operator};
use leptos::{prelude::*, task::spawn_local};
use leptos_use::{core::ConnectionReadyState, use_websocket};
use near_min_api::{
    types::{AccountId, Balance, BlockHeight, BlockReference, CryptoHash, Finality, U128},
    utils::dec_format,
    QueryFinality,
};
use serde::{Deserialize, Serialize};
use web_sys::HtmlAudioElement;

use crate::utils::{power_of_10, TOKEN_CACHE, USDT_DECIMALS};

use super::{
    accounts_context::AccountsContext,
    config_context::ConfigContext,
    network_context::{Network, NetworkContext},
    rpc_context::RpcContext,
};

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
#[serde(untagged)]
pub enum Token {
    Near,
    Nep141(AccountId),
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

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq)]
pub struct TokenData {
    #[serde(with = "dec_format")]
    pub balance: Balance,
    pub token: TokenInfo,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FtTransferEvent {
    pub old_owner_id: AccountId,
    pub new_owner_id: AccountId,
    #[serde(with = "dec_format")]
    pub amount: Balance,
    pub memo: Option<String>,
    pub token_id: AccountId,
    pub transaction_id: CryptoHash,
    pub receipt_id: CryptoHash,
    pub block_height: BlockHeight,
    #[serde(with = "dec_format")]
    pub block_timestamp_nanosec: u128,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FtMintEvent {
    pub owner_id: AccountId,
    #[serde(with = "dec_format")]
    pub amount: Balance,
    pub memo: Option<String>,
    pub token_id: AccountId,
    pub transaction_id: CryptoHash,
    pub receipt_id: CryptoHash,
    pub block_height: BlockHeight,
    #[serde(with = "dec_format")]
    pub block_timestamp_nanosec: u128,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FtBurnEvent {
    pub owner_id: AccountId,
    #[serde(with = "dec_format")]
    pub amount: Balance,
    pub memo: Option<String>,
    pub token_id: AccountId,
    pub transaction_id: CryptoHash,
    pub receipt_id: CryptoHash,
    pub block_height: BlockHeight,
    #[serde(with = "dec_format")]
    pub block_timestamp_nanosec: u128,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenPriceUpdate {
    pub price_usd: String,
    #[serde(with = "dec_format")]
    pub timestamp_nanosec: u128,
    pub token: AccountId,
}

/// Tokens that selected account has
#[derive(Clone, Copy)]
pub struct TokensContext {
    pub tokens: ReadSignal<Vec<TokenData>>,
    pub loading_tokens: ReadSignal<bool>,
    pub set_tokens: WriteSignal<Vec<TokenData>>,
}

pub fn provide_token_context() {
    let (tokens, set_tokens) = signal::<Vec<TokenData>>(vec![]);
    let (loading, set_loading) = signal(true);
    let accounts_context = expect_context::<AccountsContext>();
    let rpc_client = expect_context::<RpcContext>();
    let config_context = expect_context::<ConfigContext>();

    // Set up WebSocket connection for token transfers
    let (transfer_ws, set_transfer_ws) = signal(None);
    let (mint_ws, set_mint_ws) = signal(None);
    let (burn_ws, set_burn_ws) = signal(None);
    let (price_ws, set_price_ws) = signal(None);

    // Connect / disconnect from WebSocket when realtime balance updates are toggled or account changed
    let realtime_balance_updates =
        Memo::new(move |_| config_context.config.get().realtime_balance_updates);
    Effect::new(move |_| {
        if accounts_context.accounts.get().accounts.is_empty() {
            // Not unlocked or loaded yet
            return;
        }
        let network = accounts_context
            .accounts
            .get()
            .selected_account_id
            .map(|acc| {
                accounts_context
                    .accounts
                    .get()
                    .accounts
                    .into_iter()
                    .find(|a| a.account_id == acc)
                    .unwrap()
                    .network
            });
        let ws_url = match network {
            Some(Network::Mainnet) => "ws-events-v3.intear.tech".to_string(),
            Some(Network::Testnet) => "ws-events-v3-testnet.intear.tech".to_string(),
            Some(Network::Localnet(network)) => {
                if let Some(url) = &network.realtime_events_api_url {
                    url.clone()
                } else {
                    return;
                }
            }
            None => return,
        };
        set_transfer_ws(if realtime_balance_updates() {
            Some(use_websocket::<String, String, FromToStringCodec>(
                &format!("wss://{ws_url}/events/ft_transfer"),
            ))
        } else {
            None
        });
        set_mint_ws(if realtime_balance_updates() {
            Some(use_websocket::<String, String, FromToStringCodec>(
                &format!("wss://{ws_url}/events/ft_mint"),
            ))
        } else {
            None
        });
        set_burn_ws(if realtime_balance_updates() {
            Some(use_websocket::<String, String, FromToStringCodec>(
                &format!("wss://{ws_url}/events/ft_burn"),
            ))
        } else {
            None
        });
    });

    // Connect / disconnect from WebSocket when realtime price updates are toggled or account changed
    let realtime_price_updates =
        Memo::new(move |_| config_context.config.get().realtime_price_updates);
    Effect::new(move |_| {
        if accounts_context.accounts.get().accounts.is_empty() {
            // Not unlocked or loaded yet
            return;
        }
        let network = accounts_context
            .accounts
            .get()
            .selected_account_id
            .map(|acc| {
                accounts_context
                    .accounts
                    .get()
                    .accounts
                    .into_iter()
                    .find(|a| a.account_id == acc)
                    .unwrap()
                    .network
            });
        let ws_url = match network {
            Some(Network::Mainnet) => "ws-events-v3.intear.tech".to_string(),
            Some(Network::Testnet) => "ws-events-v3-testnet.intear.tech".to_string(),
            Some(Network::Localnet(network)) => {
                if let Some(url) = &network.realtime_events_api_url {
                    url.clone()
                } else {
                    return;
                }
            }
            None => return,
        };
        set_price_ws(if realtime_price_updates() {
            Some(use_websocket::<String, String, FromToStringCodec>(
                &format!("wss://{ws_url}/events/price_token"),
            ))
        } else {
            None
        });
    });

    // Send filter message when WebSocket connects
    Effect::new(move |_| {
        let Some(ws) = transfer_ws() else {
            return;
        };
        if ws.ready_state.try_get() == Some(ConnectionReadyState::Open) {
            if let Some(account_id) = &accounts_context.accounts.get().selected_account_id {
                let filter = Operator::Or(vec![
                    Filter::new(
                        "old_owner_id",
                        Operator::Equals(serde_json::json!(account_id.to_string())),
                    ),
                    Filter::new(
                        "new_owner_id",
                        Operator::Equals(serde_json::json!(account_id.to_string())),
                    ),
                ]);

                let filter_json = serde_json::to_string(&filter).unwrap();
                (ws.send)(&filter_json);
            }
        }
    });

    Effect::new(move |_| {
        let Some(ws) = mint_ws() else {
            return;
        };
        if ws.ready_state.try_get() == Some(ConnectionReadyState::Open) {
            if let Some(account_id) = &accounts_context.accounts.get().selected_account_id {
                let filter = Operator::And(vec![Filter::new(
                    "owner_id",
                    Operator::Equals(serde_json::json!(account_id.to_string())),
                )]);

                let filter_json = serde_json::to_string(&filter).unwrap();
                (ws.send)(&filter_json);
            }
        }
    });

    Effect::new(move |_| {
        let Some(ws) = burn_ws() else {
            return;
        };
        if ws.ready_state.try_get() == Some(ConnectionReadyState::Open) {
            if let Some(account_id) = &accounts_context.accounts.get().selected_account_id {
                let filter = Operator::And(vec![Filter::new(
                    "owner_id",
                    Operator::Equals(serde_json::json!(account_id.to_string())),
                )]);

                let filter_json = serde_json::to_string(&filter).unwrap();
                (ws.send)(&filter_json);
            }
        }
    });

    Effect::new(move |_| {
        let Some(ws) = price_ws() else {
            return;
        };
        if ws.ready_state.try_get() == Some(ConnectionReadyState::Open) {
            let filter = Operator::And(vec![]);
            let filter_json = serde_json::to_string(&filter).unwrap();
            (ws.send)(&filter_json);
        }
    });

    let mut transfer_events_processed = HashSet::new();
    // Handle incoming transfer events
    Effect::new(move |_| {
        let Some(ws) = transfer_ws() else {
            return;
        };
        if let Some(msg) = ws.message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtTransferEvent>>(&msg) {
                for (i, event) in events.into_iter().enumerate() {
                    if !transfer_events_processed.insert((event.receipt_id, i)) {
                        continue;
                    }
                    let current_account = accounts_context.accounts.get().selected_account_id;
                    log::info!("Received transfer: {event:?}");

                    let event_token_id = if event.token_id == "near" {
                        Token::Near
                    } else {
                        Token::Nep141(event.token_id.clone())
                    };

                    if let Some(account_id) = &current_account {
                        if event.old_owner_id == *account_id {
                            log::info!("Decreasing balance for {event_token_id:?}");
                            // Decrease balance
                            set_tokens.update(|tokens| {
                                if let Some(token) = tokens
                                    .iter_mut()
                                    .find(|token| token.token.account_id == event_token_id)
                                {
                                    token.balance = token.balance.saturating_sub(event.amount);
                                }
                            });
                        }
                        if event.new_owner_id == *account_id {
                            // Don't play sound for unwrapping wNEAR
                            if event.old_owner_id != "wrap.near"
                                && config_context.config.get().play_transfer_sound
                            {
                                if let Ok(audio) = HtmlAudioElement::new() {
                                    audio.set_src("/cash-register-sound.mp3");
                                    let _ = audio.play();
                                }
                            }

                            // Increase balance
                            set_tokens.update(|tokens| {
                                if let Some(token) = tokens
                                    .iter_mut()
                                    .find(|token| token.token.account_id == event_token_id)
                                {
                                    token.balance = token.balance.saturating_add(event.amount);
                                } else {
                                    log::info!(
                                        "Token not found in tokens list: {event_token_id:?}"
                                    );
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    let mut mint_events_processed = HashSet::new();
    // Handle incoming mint events
    Effect::new(move |_| {
        let Some(ws) = mint_ws() else {
            return;
        };
        if let Some(msg) = ws.message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtMintEvent>>(&msg) {
                for (i, event) in events.into_iter().enumerate() {
                    if !mint_events_processed.insert((event.receipt_id, i)) {
                        continue;
                    }
                    let current_account =
                        accounts_context.accounts.get().selected_account_id.clone();
                    log::info!("Received mint: {event:?}");

                    if let Some(account_id) = &current_account {
                        if event.owner_id == *account_id {
                            set_tokens.update(|tokens| {
                                if let Some(token) = tokens.iter_mut().find(|token| {
                                    token.token.account_id == Token::Nep141(event.token_id.clone())
                                }) {
                                    token.balance = token.balance.saturating_add(event.amount);
                                } else {
                                    log::info!(
                                        "Token not found in tokens list: {:?}",
                                        event.token_id
                                    );
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    let mut burn_events_processed = HashSet::new();
    // Handle incoming burn events
    Effect::new(move |_| {
        let Some(ws) = burn_ws() else {
            return;
        };
        if let Some(msg) = ws.message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtBurnEvent>>(&msg) {
                for (i, event) in events.into_iter().enumerate() {
                    if !burn_events_processed.insert((event.receipt_id, i)) {
                        continue;
                    }
                    let current_account =
                        accounts_context.accounts.get().selected_account_id.clone();
                    log::info!("Received burn: {event:?}");

                    if let Some(account_id) = &current_account {
                        if event.owner_id == *account_id {
                            // Decrease balance
                            set_tokens.update(|tokens| {
                                if let Some(token) = tokens.iter_mut().find(|token| {
                                    token.token.account_id == Token::Nep141(event.token_id.clone())
                                }) {
                                    token.balance = token.balance.saturating_sub(event.amount);
                                } else {
                                    log::info!(
                                        "Token not found in tokens list: {:?}",
                                        event.token_id
                                    );
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    // Handle incoming price updates
    Effect::new(move |_| {
        let Some(ws) = price_ws() else {
            return;
        };
        if let Some(msg) = ws.message.get() {
            if let Ok(updates) = serde_json::from_str::<Vec<TokenPriceUpdate>>(&msg) {
                for update in updates {
                    set_tokens.update(|tokens| {
                        if let Some(token) = tokens.iter_mut().find(|t| {
                            matches!(&t.token.account_id, Token::Nep141(id) if *id == update.token)
                        }) {
                            if let Ok(raw_price) = update.price_usd.parse::<BigDecimal>() {
                                let decimals = token.token.metadata.decimals;
                                let multiplier = power_of_10(decimals) / power_of_10(USDT_DECIMALS);
                                let normalized_price = &raw_price * &multiplier;
                                token.token.price_usd_raw = raw_price.clone();
                                token.token.price_usd = normalized_price.clone();
                                if token.token.price_usd_hardcoded != BigDecimal::from(1) {
                                    // Don't update stablecoin prices in realtime. They're unlikely
                                    // to change in real time, but UX is shit when USDC costs $0.99
                                    // or $1.01.
                                    token.token.price_usd_hardcoded = normalized_price;
                                }
                            }
                        }
                    });
                }
            }
        }
    });

    // When the selected account changes
    Effect::new(move |_| {
        let current_account = accounts_context.accounts.get().selected_account_id;
        let network = expect_context::<NetworkContext>().network.get();

        spawn_local(async move {
            set_loading(true);
            set_tokens(vec![]);
            let api_url: Either<String, Vec<AccountId>> = match &network {
                Network::Mainnet => Either::Left("https://prices.intear.tech".to_string()),
                Network::Testnet => Either::Left("https://prices-testnet.intear.tech".to_string()),
                Network::Localnet(network) => {
                    if let Some(url) = &network.prices_api_url {
                        Either::Left(url.clone())
                    } else {
                        let mut tokens = network.tokens.clone();
                        if let Some(wrapped_near) = &network.wrap_contract {
                            tokens.insert(wrapped_near.clone());
                        }
                        Either::Right(tokens.into_iter().collect())
                    }
                }
            };
            let wrapped_near: AccountId = match &network {
                Network::Mainnet => "wrap.near".parse().unwrap(),
                Network::Testnet => "wrap.testnet".parse().unwrap(),
                Network::Localnet(network) => {
                    if let Some(contract) = &network.wrap_contract {
                        contract.clone()
                    } else {
                        set_loading(false);
                        return;
                    }
                }
            };
            if let Some(account_id) = current_account {
                let account_id_clone = account_id.clone();
                let (token_response, account_response) = join(
                    match api_url {
                        Either::Left(url) => Box::pin(
                            reqwest::get(format!("{url}/get-user-tokens?account_id={account_id}"))
                                .and_then(|r| r.json::<Vec<TokenData>>())
                                .map_err(|e| e.to_string()),
                        )
                            as std::pin::Pin<
                                Box<dyn Future<Output = Result<Vec<TokenData>, String>>>,
                            >,
                        Either::Right(tokens) => Box::pin(async move {
                            let near_supply = rpc_client
                                .client
                                .get_untracked()
                                .block(BlockReference::Finality(Finality::None))
                                .await
                                .map(|a| a.header.total_supply)
                                .unwrap_or(0);
                            let near = TokenData {
                                balance: rpc_client
                                    .client
                                    .get_untracked()
                                    .view_account(account_id_clone.clone(), QueryFinality::Finality(Finality::None))
                                    .await
                                    .map(|a| a.amount.as_yoctonear())
                                    .unwrap_or(0),
                                token: TokenInfo {
                                    account_id: Token::Near,
                                    metadata: TokenMetadata {
                                        name: "NEAR".to_string(),
                                        symbol: "NEAR".to_string(),
                                        decimals: 24,
                                        icon: Some(format!(
                                            "data:image/svg+xml;base64,{}",
                                            BASE64_STANDARD.encode(include_bytes!("../data/near.svg"))
                                        )),
                                    },
                                    price_usd: Default::default(),
                                    price_usd_hardcoded: Default::default(),
                                    price_usd_raw: Default::default(),
                                    price_usd_raw_24h_ago: Default::default(),
                                    volume_usd_24h: Default::default(),
                                    liquidity_usd: Default::default(),
                                    circulating_supply: near_supply,
                                    total_supply: near_supply,
                                    reputation: TokenScore::Reputable,
                                },
                            };

                            let balance_queries = tokens
                                .iter()
                                .map(|token| {
                                    (
                                        token.clone(),
                                        "ft_balance_of",
                                        serde_json::json!({
                                            "account_id": account_id_clone,
                                        }),
                                        QueryFinality::Finality(Finality::None),
                                    )
                                })
                                .collect::<Vec<_>>();
                            let metadata_queries = tokens
                                .iter()
                                .map(|token| {
                                    (
                                        token.clone(),
                                        "ft_metadata",
                                        serde_json::json!({}),
                                        QueryFinality::Finality(Finality::None),
                                    )
                                })
                                .collect::<Vec<_>>();
                            let total_supply_queries = tokens
                                .iter()
                                .map(|token| {
                                    (
                                        token.clone(),
                                        "ft_total_supply",
                                        serde_json::json!({}),
                                        QueryFinality::Finality(Finality::None),
                                    )
                                })
                                .collect::<Vec<_>>();
                            if let Ok(response) = rpc_client
                                .client
                                .get_untracked()
                                .batch_call::<U128>(balance_queries)
                                .await
                            {
                                if let Ok(metadata_response) = rpc_client
                                    .client
                                    .get_untracked()
                                    .batch_call::<TokenMetadata>(metadata_queries)
                                    .await
                                {
                                    if let Ok(total_supply_response) = rpc_client
                                        .client
                                        .get_untracked()
                                        .batch_call::<U128>(total_supply_queries)
                                        .await
                                    {
                                        let token_data = response
                                            .into_iter()
                                            .zip(tokens.iter())
                                            .zip(metadata_response.into_iter())
                                            .zip(total_supply_response.into_iter())
                                            .filter_map(
                                                |(((balance_result, token), metadata_result), supply_result)| {
                                                    if let (Ok(balance), Ok(metadata), Ok(supply)) =
                                                        (balance_result, metadata_result, supply_result)
                                                    {
                                                        Some((balance, token, metadata, supply))
                                                    } else {
                                                        None
                                                    }
                                                },
                                            )
                                            .map(|(balance, token, metadata, supply)| TokenData {
                                                balance: *balance,
                                                token: TokenInfo {
                                                    account_id: Token::Nep141(token.clone()),
                                                    metadata,
                                                    price_usd: Default::default(),
                                                    price_usd_hardcoded: Default::default(),
                                                    price_usd_raw: Default::default(),
                                                    price_usd_raw_24h_ago: Default::default(),
                                                    volume_usd_24h: Default::default(),
                                                    liquidity_usd: Default::default(),
                                                    circulating_supply: *supply,
                                                    total_supply: *supply,
                                                    reputation: TokenScore::NotFake,
                                                },
                                            })
                                            .collect::<Vec<_>>();
                                        Ok(token_data)
                                    } else {
                                        Ok(vec![near])
                                    }
                                } else {
                                    Ok(vec![near])
                                }
                            } else {
                                Ok(vec![near])
                            }
                        }),
                    },
                    rpc_client.client.get_untracked().view_account(
                        account_id.clone(),
                        QueryFinality::Finality(Finality::DoomSlug),
                    ),
                )
                .await;

                let Ok(token_data) = token_response else {
                    log::error!("Failed to fetch token data");
                    set_loading(false);
                    return;
                };

                // Process and validate icons
                let mut token_data = token_data
                    .into_iter()
                    .filter(|token| !matches!(token.token.reputation, TokenScore::Spam))
                    .map(|mut token| {
                        // Validate icon is a data URL
                        if let Some(icon) = &token.token.metadata.icon {
                            if !icon.starts_with("data:") {
                                token.token.metadata.icon = None;
                            }
                        }
                        token
                    })
                    .collect::<Vec<_>>();

                if let Ok(account) = account_response {
                    let wnear_token = token_data
                        .iter()
                        .find(|t| t.token.account_id == Token::Nep141(wrapped_near.clone()))
                        .expect("wNEAR should be guaranteed to be present in prices.intear.tech response");
                    let near = TokenData {
                        balance: account.amount.saturating_sub(account.locked).as_yoctonear(),
                        token: TokenInfo {
                            account_id: Token::Near,
                            metadata: TokenMetadata {
                                name: "NEAR".to_string(),
                                symbol: "NEAR".to_string(),
                                decimals: 24,
                                icon: Some(format!(
                                    "data:image/svg+xml;base64,{}",
                                    BASE64_STANDARD.encode(include_bytes!("../data/near.svg"))
                                )),
                            },
                            price_usd: wnear_token.token.price_usd.clone(),
                            price_usd_hardcoded: wnear_token.token.price_usd_hardcoded.clone(),
                            price_usd_raw: wnear_token.token.price_usd_raw.clone(),
                            price_usd_raw_24h_ago: wnear_token.token.price_usd_raw_24h_ago.clone(),
                            volume_usd_24h: wnear_token.token.volume_usd_24h,
                            liquidity_usd: wnear_token.token.liquidity_usd,
                            circulating_supply: wnear_token.token.circulating_supply,
                            total_supply: wnear_token.token.total_supply,
                            reputation: TokenScore::Reputable,
                        },
                    };
                    // NEAR always first
                    token_data.insert(0, near);
                }

                // Set tokens immediately with API data
                set_tokens(token_data.clone());

                // Update balances in background using batch RPC calls
                let nep141_tokens: Vec<_> = token_data
                    .iter()
                    .filter_map(|token| {
                        if let Token::Nep141(contract_id) = &token.token.account_id {
                            Some(contract_id.clone())
                        } else {
                            None
                        }
                    })
                    .collect();

                let rpc_client = rpc_client.client.get_untracked();

                leptos::task::spawn_local(async move {
                    let near_balance_future = rpc_client.view_account(
                        account_id.clone(),
                        QueryFinality::Finality(Finality::DoomSlug),
                    );

                    let token_balances_future = async {
                        if nep141_tokens.is_empty() {
                            return Ok(vec![]);
                        }

                        let balance_requests: Vec<_> = nep141_tokens
                            .iter()
                            .map(|contract_id| {
                                (
                                    contract_id.clone(),
                                    "ft_balance_of",
                                    serde_json::json!({
                                        "account_id": account_id,
                                    }),
                                    QueryFinality::Finality(Finality::DoomSlug),
                                )
                            })
                            .collect();

                        rpc_client.batch_call::<U128>(balance_requests).await
                    };

                    let (near_account_result, token_balance_results) =
                        futures_util::future::join(near_balance_future, token_balances_future)
                            .await;

                    if let Ok(account) = near_account_result {
                        let near_balance =
                            account.amount.saturating_sub(account.locked).as_yoctonear();
                        set_tokens.update(|tokens| {
                            if let Some(near_token) = tokens
                                .iter_mut()
                                .find(|t| t.token.account_id == Token::Near)
                            {
                                near_token.balance = near_balance;
                            }
                        });
                    }

                    if let Ok(balance_results) = token_balance_results {
                        for (contract_id, balance_result) in
                            nep141_tokens.iter().zip(balance_results.into_iter())
                        {
                            if let Ok(balance) = balance_result {
                                set_tokens.update(|tokens| {
                                    if let Some(token) = tokens.iter_mut().find(|t| {
                                        matches!(&t.token.account_id, Token::Nep141(id) if id == contract_id)
                                    }) {
                                        token.balance = balance.into();
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                set_tokens(vec![]);
            }
            set_loading(false);
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
                };
                let t2_hardcoded_order = match &t2.token.account_id {
                    Token::Near => 0,
                    Token::Nep141(_) => 1,
                };
                let t1_value = BigDecimal::from(t1.balance) * &t1.token.price_usd_raw;
                let t2_value = BigDecimal::from(t2.balance) * &t2.token.price_usd_raw;
                let t1_name_comparable = match &t1.token.account_id {
                    Token::Near => "NEAR".to_string(),
                    Token::Nep141(id) => id.to_string(),
                };
                let t2_name_comparable = match &t2.token.account_id {
                    Token::Near => "NEAR".to_string(),
                    Token::Nep141(id) => id.to_string(),
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
    });
}
