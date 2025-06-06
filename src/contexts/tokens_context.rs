use std::str::FromStr;

use base64::{prelude::BASE64_STANDARD, Engine};
use bigdecimal::{BigDecimal, FromPrimitive};
use codee::string::FromToStringCodec;
use futures_util::future::join;
use json_filter::{Filter, Operator};
use leptos::prelude::*;
use leptos_use::{core::ConnectionReadyState, use_websocket};
use near_min_api::{
    types::{AccountId, Balance, BlockHeight, CryptoHash, Finality},
    utils::dec_format,
    QueryFinality,
};
use serde::{Deserialize, Serialize};
use web_sys::HtmlAudioElement;

use crate::utils::{power_of_10, USDT_DECIMALS};

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

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum TokenScore {
    Spam,
    Unknown,
    NotFake,
    Reputable,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
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
    pub reputation: TokenScore,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
    pub icon: Option<String>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
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
#[derive(Clone)]
pub struct TokenContext {
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
            Some(Network::Mainnet) => "ws-events-v3.intear.tech",
            Some(Network::Testnet) => "ws-events-v3-testnet.intear.tech",
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
            Some(Network::Mainnet) => "ws-events-v3.intear.tech",
            Some(Network::Testnet) => "ws-events-v3-testnet.intear.tech",
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

    // Handle incoming transfer events
    Effect::new(move |_| {
        let Some(ws) = transfer_ws() else {
            return;
        };
        if let Some(msg) = ws.message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtTransferEvent>>(&msg) {
                for event in events {
                    let current_account = accounts_context.accounts.get().selected_account_id;
                    log::info!("Received transfer: {event:?}");

                    let event_token_id = if event.token_id == "near" {
                        Token::Near
                    } else {
                        Token::Nep141(event.token_id.clone())
                    };

                    if let Some(account_id) = &current_account {
                        if event.old_owner_id == *account_id {
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

    // Handle incoming mint events
    Effect::new(move |_| {
        let Some(ws) = mint_ws() else {
            return;
        };
        if let Some(msg) = ws.message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtMintEvent>>(&msg) {
                for event in events {
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

    // Handle incoming burn events
    Effect::new(move |_| {
        let Some(ws) = mint_ws() else {
            return;
        };
        if let Some(msg) = ws.message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtBurnEvent>>(&msg) {
                for event in events {
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
                            if let Ok(raw_price) = update.price_usd.parse::<f64>() {
                                let decimals = token.token.metadata.decimals;
                                let raw_price_decimal = BigDecimal::from_f64(raw_price).unwrap_or_default();
                                let multiplier = power_of_10(decimals) / power_of_10(USDT_DECIMALS);
                                let normalized_price = &raw_price_decimal * &multiplier;
                                token.token.price_usd_raw = raw_price_decimal.clone();
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

        leptos::task::spawn_local(async move {
            let api_url = match network {
                Network::Mainnet => "https://prices.intear.tech",
                Network::Testnet => "https://prices-testnet.intear.tech",
            };
            let wrapped_near: AccountId = match network {
                Network::Mainnet => "wrap.near".parse().unwrap(),
                Network::Testnet => "wrap.testnet".parse().unwrap(),
            };
            set_loading(true);
            set_tokens(vec![]);
            if let Some(account_id) = current_account {
                let (token_response, account_response) = join(
                    reqwest::get(format!("{api_url}/get-user-tokens?account_id={account_id}")),
                    rpc_client
                        .client
                        .get_untracked()
                        .view_account(account_id, QueryFinality::Finality(Finality::DoomSlug)),
                )
                .await;

                let Ok(token_response) = token_response else {
                    log::error!("Failed to fetch token data");
                    set_loading(false);
                    return;
                };

                let token_data = match token_response.json::<Vec<TokenData>>().await {
                    Ok(token_data) => token_data,
                    Err(err) => {
                        log::error!("Failed to parse token data: {err:?}");
                        set_loading(false);
                        return;
                    }
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

                // Sort by USD value
                token_data.sort_by(|a, b| {
                    let a_balance_decimal = BigDecimal::from(a.balance);
                    let b_balance_decimal = BigDecimal::from(b.balance);
                    let a_value = &a.token.price_usd_raw * &a_balance_decimal;
                    let b_value = &b.token.price_usd_raw * &b_balance_decimal;
                    b_value
                        .partial_cmp(&a_value)
                        .unwrap_or(std::cmp::Ordering::Equal)
                });

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
                            reputation: TokenScore::Reputable,
                        },
                    };
                    // NEAR always first
                    token_data.insert(0, near);
                }

                set_tokens(token_data);
            } else {
                set_tokens(vec![]);
            }
            set_loading(false);
        });
    });

    provide_context(TokenContext {
        tokens,
        set_tokens,
        loading_tokens: loading,
    });
}
