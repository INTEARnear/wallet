use base64::{prelude::BASE64_STANDARD, Engine};
use codee::string::FromToStringCodec;
use futures_util::future::join;
use json_filter::{Filter, Operator};
use leptos::prelude::*;
use leptos_use::{core::ConnectionReadyState, use_websocket, UseWebSocketReturn};
use near_min_api::{
    types::{AccountId, Balance, BlockHeight, CryptoHash, Finality},
    utils::dec_format,
    QueryFinality,
};
use serde::{Deserialize, Serialize};

use super::{accounts_context::AccountsContext, rpc_context::RpcContext};

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq, Debug)]
#[serde(untagged)]
pub enum Token {
    Near,
    Nep141(AccountId),
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
    #[serde(with = "dec_format")]
    pub price_usd: f64,
    #[serde(with = "dec_format")]
    pub price_usd_hardcoded: f64,
    #[serde(with = "dec_format")]
    pub price_usd_raw: f64,
    #[serde(with = "dec_format")]
    pub price_usd_raw_24h_ago: f64,
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

/// Tokens that selected account has
#[derive(Clone)]
pub struct TokenContext {
    pub tokens: ReadSignal<Vec<TokenData>>,
    pub loading_tokens: ReadSignal<bool>,
}

pub fn provide_token_context() {
    let (tokens, set_tokens) = signal::<Vec<TokenData>>(vec![]);
    let (loading, set_loading) = signal(true);
    let accounts_context = expect_context::<AccountsContext>();
    let rpc_client = expect_context::<RpcContext>();

    // Set up WebSocket connection for token transfers
    let UseWebSocketReturn {
        message: transfer_message,
        send: transfer_send,
        ready_state: transfer_ready_state,
        ..
    } = use_websocket::<String, String, FromToStringCodec>(
        "wss://ws-events-v3.intear.tech/events/ft_transfer",
    );

    let UseWebSocketReturn {
        message: mint_message,
        send: mint_send,
        ready_state: mint_ready_state,
        ..
    } = use_websocket::<String, String, FromToStringCodec>(
        "wss://ws-events-v3.intear.tech/events/ft_mint",
    );

    let UseWebSocketReturn {
        message: burn_message,
        send: burn_send,
        ready_state: burn_ready_state,
        ..
    } = use_websocket::<String, String, FromToStringCodec>(
        "wss://ws-events-v3.intear.tech/events/ft_burn",
    );

    // Send filter message when WebSocket connects
    Effect::new(move |_| {
        if transfer_ready_state.get() == ConnectionReadyState::Open {
            if let Some(account_id) = &accounts_context.accounts.get().selected_account {
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
                transfer_send(&filter_json);
            }
        }

        if mint_ready_state.get() == ConnectionReadyState::Open {
            if let Some(account_id) = &accounts_context.accounts.get().selected_account {
                let filter = Operator::And(vec![Filter::new(
                    "owner_id",
                    Operator::Equals(serde_json::json!(account_id.to_string())),
                )]);

                let filter_json = serde_json::to_string(&filter).unwrap();
                mint_send(&filter_json);
            }
        }

        if burn_ready_state.get() == ConnectionReadyState::Open {
            if let Some(account_id) = &accounts_context.accounts.get().selected_account {
                let filter = Operator::And(vec![Filter::new(
                    "owner_id",
                    Operator::Equals(serde_json::json!(account_id.to_string())),
                )]);

                let filter_json = serde_json::to_string(&filter).unwrap();
                burn_send(&filter_json);
            }
        }
    });

    // Handle incoming transfer events
    Effect::new(move |_| {
        if let Some(msg) = transfer_message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtTransferEvent>>(&msg) {
                for event in events {
                    let current_account = accounts_context.accounts.get().selected_account.clone();
                    log::info!("Received transfer: {event:?}");

                    if let Some(account_id) = &current_account {
                        if event.old_owner_id == *account_id {
                            // Decrease balance
                            set_tokens.update(|tokens| {
                                if let Some(token) = tokens.iter_mut().find(|token| {
                                    token.token.account_id == Token::Nep141(event.token_id.clone())
                                }) {
                                    token.balance = token.balance.saturating_sub(event.amount);
                                }
                            });
                        }
                        if event.new_owner_id == *account_id {
                            // Increase balance
                            set_tokens.update(|tokens| {
                                if let Some(token) = tokens.iter_mut().find(|token| {
                                    token.token.account_id == Token::Nep141(event.token_id.clone())
                                }) {
                                    token.balance = token.balance.saturating_add(event.amount);
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
        if let Some(msg) = mint_message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtMintEvent>>(&msg) {
                for event in events {
                    let current_account = accounts_context.accounts.get().selected_account.clone();
                    log::info!("Received mint: {event:?}");

                    if let Some(account_id) = &current_account {
                        if event.owner_id == *account_id {
                            // Increase balance
                            set_tokens.update(|tokens| {
                                if let Some(token) = tokens.iter_mut().find(|token| {
                                    token.token.account_id == Token::Nep141(event.token_id.clone())
                                }) {
                                    token.balance = token.balance.saturating_add(event.amount);
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
        if let Some(msg) = burn_message.get() {
            if let Ok(events) = serde_json::from_str::<Vec<FtBurnEvent>>(&msg) {
                for event in events {
                    let current_account = accounts_context.accounts.get().selected_account.clone();
                    log::info!("Received burn: {event:?}");

                    if let Some(account_id) = &current_account {
                        if event.owner_id == *account_id {
                            // Decrease balance
                            set_tokens.update(|tokens| {
                                if let Some(token) = tokens.iter_mut().find(|token| {
                                    token.token.account_id == Token::Nep141(event.token_id.clone())
                                }) {
                                    token.balance = token.balance.saturating_sub(event.amount);
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    // Track the selected account to trigger reloads
    let selected_account = move || accounts_context.accounts.get().selected_account.clone();

    // Create an effect that runs when the selected account changes
    Effect::new(move |_| {
        let current_account = selected_account();

        leptos::task::spawn_local(async move {
            set_loading(true);
            set_tokens(vec![]);
            if let Some(account_id) = current_account {
                let (token_response, account_response) = join(
                    reqwest::get(format!(
                        "https://prices.intear.tech/get-user-tokens?account_id={}",
                        account_id
                    )),
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

                let Ok(token_data) = token_response.json::<Vec<TokenData>>().await else {
                    log::error!("Failed to parse token data");
                    set_loading(false);
                    return;
                };

                // Process and validate icons
                let mut token_data = token_data
                    .into_iter()
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
                    let a_value = a.token.price_usd_raw * a.balance as f64;
                    let b_value = b.token.price_usd_raw * b.balance as f64;
                    b_value
                        .partial_cmp(&a_value)
                        .unwrap_or(std::cmp::Ordering::Equal)
                });

                if let Ok(account) = account_response {
                    let wnear_token = token_data
                        .iter()
                        .find(|t| t.token.account_id == Token::Nep141("wrap.near".parse().unwrap()))
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
                            price_usd: wnear_token.token.price_usd,
                            price_usd_hardcoded: wnear_token.token.price_usd_hardcoded,
                            price_usd_raw: wnear_token.token.price_usd_raw,
                            price_usd_raw_24h_ago: wnear_token.token.price_usd_raw_24h_ago,
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
        loading_tokens: loading,
    });
}
