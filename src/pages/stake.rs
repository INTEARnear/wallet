use bigdecimal::BigDecimal;
use borsh::BorshDeserialize;
use cached::proc_macro::cached;
use chrono::{DateTime, Utc};
use futures_util::future::join;
use gloo_net::http::Request;
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::{use_navigate, use_params_map};
use leptos_use::{use_interval, use_interval_fn};
use near_min_api::types::{Balance, EpochHeight, ViewStateResult};
use near_min_api::{
    types::{
        AccountId, AccountIdRef, Action, BlockHeightDelta, BlockId, BlockReference, BlockView,
        CurrentEpochValidatorInfo, EpochReference, Finality, FunctionCallAction, NearGas,
        NearToken,
    },
    CallError, Error, QueryFinality, RpcClient,
};
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use rand::rngs::OsRng;
use rand::seq::SliceRandom;
use serde::Deserialize;
use std::collections::{HashMap, HashSet};
use std::io::Cursor;
use std::time::Duration;
use std::{future::Future, pin::Pin, str::FromStr};

const ESTIMATED_BLOCK_TIME: Duration = Duration::from_millis(600);
const EPOCH_LENGTH: BlockHeightDelta = 43200;
const EPOCH_DURATION: Duration =
    Duration::from_millis(ESTIMATED_BLOCK_TIME.as_millis() as u64 * EPOCH_LENGTH);

use crate::components::{
    ProjectedRevenue, ProjectedRevenueMode, TransactionErrorModal, TransactionSuccessModal,
};
use crate::{
    contexts::{
        accounts_context::AccountsContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        search_context::SearchContext,
        tokens_context::{Token, TokensContext},
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::{
        balance_to_decimal, decimal_to_balance, format_token_amount, format_token_amount_no_hide,
    },
};

fn get_supported_staking_farms(network: Network) -> Vec<AccountId> {
    match network {
        Network::Mainnet => vec!["poolv1.near".parse().unwrap(), "pool.near".parse().unwrap()],
        Network::Testnet => vec!["pool.f863973.m0".parse().unwrap()],
    }
}

fn is_validator_supported(validator_id: &AccountIdRef, network: Network) -> bool {
    let supported_farms = get_supported_staking_farms(network);
    supported_farms
        .iter()
        .any(|farm| validator_id.is_sub_account_of(farm))
}

fn country_code_to_emoji(code: &str) -> Option<String> {
    if code.trim().len() != 2 {
        return None;
    }
    let mut emoji = String::new();
    for c in code.trim().to_uppercase().chars() {
        if !c.is_ascii_alphabetic() {
            return None;
        }
        emoji.push(std::char::from_u32(c as u32 + 0x1F1E6 - 'A' as u32)?);
    }
    Some(emoji)
}

fn normalize_twitter_url(input: &str) -> Option<String> {
    let input = input.trim();
    if input.starts_with("https://twitter.com/") || input.starts_with("https://x.com/") {
        Some(input.to_string())
    } else if let Some(username) = input.strip_prefix("@") {
        if !username.is_empty() {
            Some(format!("https://x.com/{}", username))
        } else {
            None
        }
    } else {
        None
    }
}

fn normalize_telegram_url(input: &str) -> Option<String> {
    let input = input.trim();
    if input.starts_with("https://t.me/") {
        Some(input.to_string())
    } else if input.starts_with("t.me/") {
        Some(format!("https://{}", input))
    } else if let Some(username) = input.strip_prefix("@") {
        if !username.is_empty() {
            Some(format!("https://t.me/{}", username))
        } else {
            None
        }
    } else {
        None
    }
}

fn normalize_discord_url(input: &str) -> Option<String> {
    let input = input.trim();
    if input.contains("discord.gg/") {
        Some(input.to_string())
    } else {
        None
    }
}

fn proxify_url(url: &str) -> String {
    if url.starts_with("data:") {
        return url.to_string();
    }
    let proxy_base = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");
    let encoded_url = utf8_percent_encode(url, NON_ALPHANUMERIC).to_string();
    format!("{proxy_base}/media/low/{encoded_url}")
}

fn compute_match_score(query: &str, text: &str) -> i32 {
    let query = query.to_lowercase();
    let text = text.to_lowercase();
    if query.is_empty() || text.is_empty() {
        return 0;
    }
    if query == text {
        100
    } else if text.starts_with(&query) {
        75
    } else if text.contains(&query) {
        50
    } else {
        0
    }
}

#[derive(Clone, PartialEq, Debug, Deserialize)]
struct Fraction {
    numerator: u32,
    denominator: u32,
}

#[derive(Clone, PartialEq, Debug, Deserialize)]
struct PoolDetails {
    country_code: Option<String>,
    logo: Option<String>,
    name: Option<String>,
    email: Option<String>,
    telegram: Option<String>,
    discord: Option<String>,
    url: Option<String>,
    twitter: Option<String>,
}

#[derive(Clone, PartialEq, Debug, Deserialize)]
struct StakingAccount {
    can_withdraw: bool,
    staked_balance: NearToken,
    unstaked_balance: NearToken,
}

#[derive(Clone, PartialEq)]
struct ValidatorInfo {
    info: CurrentEpochValidatorInfo,
    fee_fraction: Fraction,
    details: Option<PoolDetails>,
    user_staked: NearToken,
    user_unstaked: NearToken,
    user_can_withdraw: bool,
    estimated_unlock_time: Option<DateTime<Utc>>,
    is_active: bool,
}

#[component]
fn SocialLink(href: String, icon: icondata::Icon) -> impl IntoView {
    view! {
        <a
            href=href
            target="_blank"
            rel="noopener noreferrer"
            class="text-neutral-400 hover:text-white"
            on:click=|ev| ev.stop_propagation()
        >
            <Icon icon=icon width="18" height="18" />
        </a>
    }
}

#[component]
fn ValidatorCard(
    validator: ValidatorInfo,
    base_apy: BigDecimal,
    total_supply: Option<u128>,
    network: Network,
    refresh: impl Fn() + 'static + Copy + Send + Sync,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let rpc_context = expect_context::<RpcContext>();
    let transaction_queue_context = expect_context::<TransactionQueueContext>();
    let pool_account_id = validator.info.account_id.clone();

    let uptime_ok = if validator.info.num_expected_chunks > 0 {
        validator.info.num_produced_chunks * 100 >= validator.info.num_expected_chunks * 90
    } else {
        true
    };

    let fee = if validator.fee_fraction.denominator == 0 {
        BigDecimal::from(0)
    } else {
        BigDecimal::from(validator.fee_fraction.numerator)
            / BigDecimal::from(validator.fee_fraction.denominator)
    };

    let one = BigDecimal::from(1);

    let apy = (&one - &fee) * &base_apy * BigDecimal::from(100);
    let apy_str = format!("{:.2}%", apy);

    let fee_str = format!("(fee: {:.2}%)", &fee * BigDecimal::from(100));

    let apy_color = if fee > BigDecimal::from_str("0.2").unwrap() {
        "#ef4444" // red-500
    } else if fee > BigDecimal::from_str("0.05").unwrap() {
        "#eab308" // yellow-500
    } else {
        "#ffffff" // white
    };

    let stake_color = if let Some(total_supply) = total_supply {
        let stake_percentage =
            BigDecimal::from(validator.info.stake) / BigDecimal::from(total_supply);
        let one_percent = BigDecimal::from_str("0.01").unwrap();
        if stake_percentage > one_percent {
            "#eab308" // yellow-500
        } else {
            "#ffffff" // white
        }
    } else {
        "#ffffff" // white
    };

    let details = validator.details.clone();
    let is_supported = is_validator_supported(&validator.info.account_id, network);

    let initial_time = validator.estimated_unlock_time.unwrap_or(Utc::now());
    let estimated_unlock_time = RwSignal::new(initial_time);
    let interval = use_interval(100).counter;

    if !validator.user_can_withdraw {
        let pool_account_id = pool_account_id.clone();
        let _ = use_interval_fn(
            move || {
                let rpc_client = rpc_context.client.get();
                let pool_account_id = pool_account_id.clone();
                spawn_local(async move {
                    if let Some(user_account_id) = accounts_context
                        .accounts
                        .get_untracked()
                        .selected_account_id
                    {
                        if let Ok(epoch_info) = rpc_client.validators(EpochReference::Latest).await
                        {
                            let current_epoch_height = epoch_info.epoch_height;
                            let epoch_start_block_height = epoch_info.epoch_start_height;

                            if let Ok(new_time) = calculate_estimated_unlock_time(
                                rpc_client,
                                pool_account_id.clone(),
                                user_account_id.clone(),
                                current_epoch_height,
                                epoch_start_block_height,
                            )
                            .await
                            {
                                estimated_unlock_time.set(new_time);
                            }
                        }
                    }
                });
            },
            60_000,
        );
    }

    view! {
        <div class="bg-neutral-800 p-2 sm:p-4 rounded-lg flex items-start justify-between gap-2 sm:gap-4">
            <div class="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                <div class="flex flex-col items-center gap-2 min-w-22 sm:min-w-24">
                    {if let Some(logo_url) = details.as_ref().and_then(|d| d.logo.as_ref()) {
                        view! {
                            <img
                                src=proxify_url(logo_url)
                                class="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                            />
                        }
                            .into_any()
                    } else {
                        view! {
                            <div class="w-10 h-10 rounded-full bg-neutral-700 flex-shrink-0 flex items-center justify-center">
                                <Icon icon=icondata::LuCircleUser width="24" height="24" />
                            </div>
                        }
                            .into_any()
                    }}
                    <div class="text-xs text-gray-400 text-center">
                        "Total Stake" <div style:color=stake_color class="text-center w-full">
                            {format_token_amount_no_hide(validator.info.stake, 24, "NEAR")}
                        </div>
                    </div>
                    {
                        let threshold = NearToken::from_millinear(1);
                        let staked = validator.user_staked;
                        let unstaked = validator.user_unstaked;
                        if staked >= threshold || unstaked >= threshold {
                            view! {
                                <div class="mt-1 space-y-1">
                                    {if staked >= threshold {
                                        view! {
                                            <div class="text-xs text-gray-400 text-center">
                                                "Staked"
                                                <div class="text-green-400 w-full">
                                                    {move || format_token_amount(
                                                        staked.as_yoctonear(),
                                                        24,
                                                        "NEAR",
                                                    )}
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }}
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center">
                        {if !uptime_ok {
                            view! {
                                <Icon
                                    icon=icondata::LuWifiOff
                                    width="16"
                                    height="16"
                                    attr:class="text-red-500 mr-2"
                                />
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }}
                        <span class="font-mono text-white break-all">
                            {format!(
                                "{}{}",
                                validator.info.account_id,
                                if let Some(country_code) = details
                                    .as_ref()
                                    .and_then(|d| d.country_code.as_ref())
                                {
                                    if let Some(emoji) = country_code_to_emoji(country_code) {
                                        format!(" {emoji}")
                                    } else {
                                        "".to_string()
                                    }
                                } else {
                                    "".to_string()
                                },
                            )}
                        </span>
                    </div>
                    <div class="flex items-center gap-3 mt-2">
                        {if let Some(url) = details.as_ref().and_then(|d| d.url.as_ref()) {
                            if url.starts_with("https://") {
                                view! { <SocialLink href=url.clone() icon=icondata::LuGlobe /> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        } else {
                            ().into_any()
                        }}
                        {if let Some(email) = details.as_ref().and_then(|d| d.email.as_ref()) {
                            view! {
                                <SocialLink
                                    href=format!("mailto:{}", email)
                                    icon=icondata::LuMail
                                />
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }}
                        {if let Some(twitter) = details.as_ref().and_then(|d| d.twitter.as_ref()) {
                            if let Some(normalized_url) = normalize_twitter_url(twitter) {
                                view! { <SocialLink href=normalized_url icon=icondata::SiX /> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        } else {
                            ().into_any()
                        }}
                        {if let Some(telegram) = details.as_ref().and_then(|d| d.telegram.as_ref())
                        {
                            if let Some(normalized_url) = normalize_telegram_url(telegram) {
                                view! {
                                    <SocialLink href=normalized_url icon=icondata::SiTelegram />
                                }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        } else {
                            ().into_any()
                        }}
                        {if let Some(discord) = details.as_ref().and_then(|d| d.discord.as_ref()) {
                            if let Some(normalized_url) = normalize_discord_url(discord) {
                                view! {
                                    <SocialLink href=normalized_url icon=icondata::SiDiscord />
                                }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        } else {
                            ().into_any()
                        }}
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-end flex-shrink-0 gap-2">
                {if is_supported {
                    let threshold = NearToken::from_millinear(1);
                    let staked = validator.user_staked;
                    let unstaked = validator.user_unstaked;
                    view! {
                        <A
                            href=format!("/stake/{}/stake", validator.info.account_id)
                            attr:class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        >
                            "Stake"
                        </A>
                        {if is_supported && (staked >= threshold || unstaked >= threshold) {
                            view! {
                                {if staked >= threshold {
                                    view! {
                                        <A
                                            href=format!("/stake/{}/unstake", validator.info.account_id)
                                            attr:class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                                        >
                                            "Unstake"
                                        </A>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }}
                                {if unstaked >= threshold {
                                    view! {
                                        <button
                                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center"
                                            disabled=move || !validator.user_can_withdraw
                                            on:click=move |_| {
                                                if !validator.user_can_withdraw {
                                                    return;
                                                }
                                                if let Some(signer_id) = accounts_context
                                                    .accounts
                                                    .get_untracked()
                                                    .selected_account_id
                                                {
                                                    let actions = vec![
                                                        Action::FunctionCall(
                                                            Box::new(FunctionCallAction {
                                                                method_name: "withdraw_all".to_string(),
                                                                args: serde_json::to_vec(&serde_json::json!({})).unwrap(),
                                                                gas: NearGas::from_tgas(150).as_gas(),
                                                                deposit: NearToken::from_yoctonear(0),
                                                            }),
                                                        ),
                                                    ];
                                                    let description = format!(
                                                        "Withdrawing all from {}",
                                                        pool_account_id,
                                                    );
                                                    let (rx, tx) = EnqueuedTransaction::create(
                                                        description,
                                                        signer_id,
                                                        pool_account_id.clone(),
                                                        actions,
                                                    );
                                                    transaction_queue_context
                                                        .add_transaction
                                                        .update(|txs| txs.push(tx));
                                                    spawn_local(async move {
                                                        match rx.await {
                                                            Ok(_) => {
                                                                refresh();
                                                            }
                                                            Err(err) => {
                                                                log::error!("Error withdrawing stake: {}", err);
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        >
                                            "Withdraw"
                                            <span>
                                                {move || format_token_amount(
                                                    unstaked.as_yoctonear(),
                                                    24,
                                                    "NEAR",
                                                )}
                                            </span>
                                            {if !validator.user_can_withdraw {
                                                view! {
                                                    <span class="text-xs mt-1">
                                                        {move || {
                                                            interval.track();
                                                            let seconds_left = estimated_unlock_time.get().timestamp()
                                                                - Utc::now().timestamp();
                                                            let hours = seconds_left / 3600;
                                                            let minutes = (seconds_left % 3600) / 60;
                                                            let seconds = seconds_left % 60;
                                                            format!("{hours:02}:{minutes:02}:{seconds:02}")
                                                        }}
                                                    </span>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }}
                                        </button>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }}
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }}
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded cursor-not-allowed">
                            "Not Supported"
                        </div>
                    }
                        .into_any()
                }} <div class="mt-1 text-right">
                    <div class="text-sm" style:color=apy_color>
                        {apy_str}
                    </div>
                    <div class="text-gray-400 text-xs">"APY"</div>
                    <div class="text-gray-500 text-xs">{fee_str}</div>
                </div>
            </div>
        </div>
    }
}

#[derive(Deserialize)]
struct LinearSummary {
    ft_price: NearToken,
}

#[derive(Deserialize)]
struct MetaPoolState {
    st_near_price: NearToken,
}

async fn fetch_blocks_for_lst_comparison(
    rpc_client: &RpcClient,
) -> Result<(BlockView, BlockView), String> {
    const TARGET_DELTA: Duration = Duration::from_millis(1000 * 60 * 60 * 24 * 7);
    const BLOCK_DELTA: BlockHeightDelta =
        (TARGET_DELTA.as_millis() as f64 / EPOCH_DURATION.as_millis() as f64) as BlockHeightDelta;
    const MAX_ATTEMPTS: u64 = 20;

    let latest_block = fetch_latest_block(rpc_client).await?;

    if let Ok(prev_block) = fetch_block_by_id(
        rpc_client,
        BlockReference::BlockId(BlockId::Height(latest_block.header.height - BLOCK_DELTA)),
    )
    .await
    {
        return Ok((latest_block, prev_block));
    }

    for offset in 0..=MAX_ATTEMPTS {
        let height_now = latest_block.header.height - offset;
        let height_prev = height_now - BLOCK_DELTA;
        let (res_now, res_prev) = futures_util::join!(
            fetch_block_by_id(
                rpc_client,
                BlockReference::BlockId(BlockId::Height(height_now))
            ),
            fetch_block_by_id(
                rpc_client,
                BlockReference::BlockId(BlockId::Height(height_prev))
            )
        );
        match (res_now, res_prev) {
            (Ok(b_now), Ok(b_prev)) => return Ok((b_now, b_prev)),
            _ => continue,
        }
    }
    Err("Failed to fetch blocks for APY calculation".to_string())
}

async fn fetch_metapool_rate(rpc_client: &RpcClient, height: u64) -> Result<BigDecimal, String> {
    let state: MetaPoolState = rpc_client
        .call::<MetaPoolState>(
            "meta-pool.near".parse().unwrap(),
            "get_contract_state",
            serde_json::json!({}),
            QueryFinality::BlockId(BlockId::Height(height)),
        )
        .await
        .map_err(|e| e.to_string())?;
    Ok(BigDecimal::from(state.st_near_price.as_yoctonear()))
}

async fn fetch_linear_rate(rpc_client: &RpcClient, height: u64) -> Result<BigDecimal, String> {
    let summary: LinearSummary = rpc_client
        .call::<LinearSummary>(
            "linear-protocol.near".parse().unwrap(),
            "get_summary",
            serde_json::json!({}),
            QueryFinality::BlockId(BlockId::Height(height)),
        )
        .await
        .map_err(|e| e.to_string())?;
    Ok(BigDecimal::from(summary.ft_price.as_yoctonear()))
}

async fn compute_liquid_staking_apys(
    rpc_client: &RpcClient,
) -> Result<(Option<BigDecimal>, Option<BigDecimal>), String> {
    const SECONDS_IN_YEAR: u64 = 60 * 60 * 24 * 365;

    let (block_now, block_prev) = fetch_blocks_for_lst_comparison(rpc_client).await?;
    let height_now = block_now.header.height;
    let height_prev = block_prev.header.height;
    let timestamp_now = block_now.header.timestamp_nanosec / 1_000_000_000;
    let timestamp_prev = block_prev.header.timestamp_nanosec / 1_000_000_000;

    let (metapool_now_res, metapool_prev_res, linear_now_res, linear_prev_res) = futures_util::join!(
        fetch_metapool_rate(rpc_client, height_now),
        fetch_metapool_rate(rpc_client, height_prev),
        fetch_linear_rate(rpc_client, height_now),
        fetch_linear_rate(rpc_client, height_prev)
    );

    let metapool =
        if let (Ok(metapool_now), Ok(metapool_prev)) = (metapool_now_res, metapool_prev_res) {
            if metapool_prev != BigDecimal::from(0u8) {
                let growth = (&metapool_now - &metapool_prev) / &metapool_prev;
                Some(
                    growth * BigDecimal::from(SECONDS_IN_YEAR)
                        / BigDecimal::from(timestamp_now - timestamp_prev)
                        * BigDecimal::from(100u8),
                )
            } else {
                None
            }
        } else {
            None
        };

    let linear = if let (Ok(l_now), Ok(l_prev)) = (linear_now_res, linear_prev_res) {
        if l_prev != BigDecimal::from(0u8) {
            let growth = (&l_now - &l_prev) / &l_prev;
            Some(
                growth * BigDecimal::from(SECONDS_IN_YEAR)
                    / BigDecimal::from(timestamp_now - timestamp_prev)
                    * BigDecimal::from(100u8),
            )
        } else {
            None
        }
    } else {
        None
    };

    if metapool.is_none() && linear.is_none() {
        return Err("Failed to compute any liquid staking APY".to_string());
    }

    Ok((metapool, linear))
}

#[derive(Debug, Clone)]
pub enum StakeModalState {
    None,
    Success(String),
    Error(String),
}

#[component]
pub fn Stake() -> impl IntoView {
    let rpc_context = expect_context::<RpcContext>();
    let tokens_context = expect_context::<TokensContext>();
    let network_context = expect_context::<NetworkContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let SearchContext {
        query: search_query,
        ..
    } = expect_context::<SearchContext>();

    let validators_resource = LocalResource::new(move || async move {
        let rpc_client = rpc_context.client.get();
        match rpc_client.validators(EpochReference::Latest).await {
            Ok(data) => {
                let active_validators_info = data.current_validators;

                let fee_requests: Vec<_> = active_validators_info
                    .iter()
                    .map(|v| {
                        (
                            v.account_id.clone(),
                            "get_reward_fee_fraction",
                            serde_json::json!({}),
                            QueryFinality::Finality(Finality::Final),
                        )
                    })
                    .collect();
                let fee_batch_future = rpc_client.batch_call::<Fraction>(fee_requests);

                let pool_details_contract = match network_context.network.get() {
                    Network::Mainnet => Some("pool-details.near".parse::<AccountId>().unwrap()),
                    Network::Testnet => None,
                };

                let details_batch_future =
                    if let Some(pool_details_contract) = pool_details_contract {
                        let details_requests: Vec<_> = active_validators_info
                            .iter()
                            .map(|v| {
                                (
                                    pool_details_contract.clone(),
                                    "get_fields_by_pool",
                                    serde_json::json!({ "pool_id": v.account_id.clone() }),
                                    QueryFinality::Finality(Finality::Final),
                                )
                            })
                            .collect();
                        Box::pin(rpc_client.batch_call::<PoolDetails>(details_requests))
                            as Pin<Box<dyn Future<Output = _>>>
                    } else {
                        Box::pin(async {
                            Ok((0..active_validators_info.len())
                                .map(|_| {
                                    Err(CallError::Rpc(Error::OtherQueryError(
                                        "Pool details not available on this network".to_string(),
                                    )))
                                })
                                .collect::<Vec<_>>())
                        })
                    };

                let (fees_results, details_results) =
                    join(fee_batch_future, details_batch_future).await;

                let fees = fees_results.map_err(|e| e.to_string())?;
                let details = details_results.map_err(|e: Error| e.to_string())?;

                let mut validators: Vec<ValidatorInfo> = active_validators_info
                    .into_iter()
                    .zip(fees)
                    .zip(details)
                    .filter_map(|((info, fee_fraction_res), details_res)| {
                        fee_fraction_res.ok().map(|fee_fraction| ValidatorInfo {
                            info,
                            fee_fraction,
                            details: details_res.ok(),
                            user_staked: NearToken::from_yoctonear(0),
                            user_unstaked: NearToken::from_yoctonear(0),
                            user_can_withdraw: true,
                            estimated_unlock_time: None,
                            is_active: true,
                        })
                    })
                    .collect();

                validators.shuffle(&mut OsRng);

                let user_account_id = accounts_context
                    .accounts
                    .get_untracked()
                    .selected_account_id;

                #[derive(Deserialize)]
                struct FastNearPoolRaw {
                    pool_id: String,
                }

                #[derive(Deserialize)]
                struct FastNearResponseRaw {
                    pools: Vec<FastNearPoolRaw>,
                }

                const BAL_THRESHOLD: NearToken = NearToken::from_millinear(1);

                if let Some(user_account_id) = user_account_id {
                    let mut pools_set: HashSet<AccountId> = validators
                        .iter()
                        .map(|v| v.info.account_id.clone())
                        .collect();

                    let network = network_context.network.get();
                    let api_host = match network {
                        Network::Mainnet => "api.fastnear.com",
                        Network::Testnet => "test.api.fastnear.com",
                    };
                    let fastnear_url = format!(
                        "https://{}/v1/account/{}/staking",
                        api_host, user_account_id
                    );
                    if let Ok(resp) = Request::get(&fastnear_url).send().await {
                        if let Ok(json_raw) = resp.json::<FastNearResponseRaw>().await {
                            for p in json_raw.pools {
                                if let Ok(acc) = p.pool_id.parse::<AccountId>() {
                                    pools_set.insert(acc);
                                }
                            }
                        }
                    }

                    let all_pools: Vec<AccountId> = pools_set.into_iter().collect();

                    let account_calls: Vec<_> = all_pools
                        .iter()
                        .map(|pool| {
                            (
                                pool.clone(),
                                "get_account",
                                serde_json::json!({ "account_id": user_account_id }),
                                QueryFinality::Finality(Finality::Final),
                            )
                        })
                        .collect();

                    if let Ok(account_vec) =
                        rpc_client.batch_call::<StakingAccount>(account_calls).await
                    {
                        for (pool_id, account_result) in all_pools.into_iter().zip(account_vec) {
                            if let Ok(account_info) = account_result {
                                let staked_amt = account_info.staked_balance;
                                let unstaked_amt = account_info.unstaked_balance;
                                let can_withdraw = account_info.can_withdraw;

                                if let Some(v) =
                                    validators.iter_mut().find(|v| v.info.account_id == pool_id)
                                {
                                    v.user_staked = staked_amt;
                                    v.user_unstaked = unstaked_amt;
                                    v.user_can_withdraw = can_withdraw;
                                    let estimated_unlock_time =
                                        if !can_withdraw && unstaked_amt >= BAL_THRESHOLD {
                                            calculate_estimated_unlock_time(
                                                rpc_client.clone(),
                                                pool_id.clone(),
                                                user_account_id.clone(),
                                                data.epoch_height,
                                                data.epoch_start_height,
                                            )
                                            .await
                                            .ok()
                                        } else {
                                            None
                                        };
                                    v.estimated_unlock_time = estimated_unlock_time;
                                } else {
                                    // Create placeholder validator info for pools absent from current set
                                    let placeholder_info = CurrentEpochValidatorInfo {
                                        account_id: pool_id.clone(),
                                        public_key: "ed25519:11111111111111111111111111111111"
                                            .parse()
                                            .unwrap(),
                                        is_slashed: false,
                                        stake: 0,
                                        shards_produced: vec![],
                                        num_produced_blocks: 0,
                                        num_expected_blocks: 0,
                                        num_produced_chunks: 0,
                                        num_expected_chunks: 0,
                                        num_produced_chunks_per_shard: vec![],
                                        num_expected_chunks_per_shard: vec![],
                                        num_produced_endorsements: 0,
                                        num_expected_endorsements: 0,
                                        num_produced_endorsements_per_shard: vec![],
                                        num_expected_endorsements_per_shard: vec![],
                                        shards_endorsed: vec![],
                                    };

                                    validators.push(ValidatorInfo {
                                        info: placeholder_info,
                                        fee_fraction: Fraction {
                                            numerator: 0,
                                            denominator: 1,
                                        },
                                        details: None,
                                        user_staked: staked_amt,
                                        user_unstaked: unstaked_amt,
                                        user_can_withdraw: can_withdraw,
                                        estimated_unlock_time: if !can_withdraw
                                            && unstaked_amt >= BAL_THRESHOLD
                                        {
                                            calculate_estimated_unlock_time(
                                                rpc_client.clone(),
                                                pool_id.clone(),
                                                user_account_id.clone(),
                                                data.epoch_height,
                                                data.epoch_start_height,
                                            )
                                            .await
                                            .ok()
                                        } else {
                                            None
                                        },
                                        // otherwise would've been matched by the condition above
                                        is_active: false,
                                    });
                                }
                            }
                        }

                        // Reorder: pools with user balance first
                        validators.sort_by(|a, b| {
                            let a_has =
                                a.user_staked >= BAL_THRESHOLD || a.user_unstaked >= BAL_THRESHOLD;
                            let b_has =
                                b.user_staked >= BAL_THRESHOLD || b.user_unstaked >= BAL_THRESHOLD;
                            b_has.cmp(&a_has)
                        });
                    }
                }

                Ok(validators)
            }
            Err(e) => Err(e.to_string()),
        }
    });

    let liquid_apys = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        async move { compute_liquid_staking_apys(&rpc_client).await }
    });

    view! {
        <div class="flex flex-col gap-4 text-white sm:p-1">
            {move || {
                let query = search_query.get();
                if !query.trim().is_empty() {
                    view! {
                        <div>
                            <h1 class="text-2xl font-bold">"Search Results"</h1>
                            <p class="text-gray-400">"Validators matching your search query"</p>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <div>
                            <h1 class="text-2xl font-bold">"Stake with a Validator"</h1>
                            <p class="text-gray-400">
                                "Earn rewards by staking your NEAR with a validator. Validators help secure the network and you get a share of the rewards."
                            </p>
                        </div>
                    }
                        .into_any()
                }
            }}
            {move || {
                let query = search_query.get();
                if !query.trim().is_empty() {
                    ().into_any()
                } else if network_context.network.get() == Network::Mainnet {
                    // Hide liquid staking when search is active
                    view! {
                        <div class="mb-2">
                            <h2 class="text-xl font-semibold mb-4">"Liquid Staking"</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <A
                                    href="/swap?from=near&to=meta-pool.near"
                                    attr:class="rounded-lg flex items-center hover:opacity-90 transition-opacity cursor-pointer overflow-hidden h-25"
                                >
                                    <div
                                        class="p-4 flex items-center justify-center flex-1 h-full"
                                        style="background-color: #ceff19"
                                    >
                                        <img
                                            src="/lst-metapool.svg"
                                            alt="Metapool"
                                            class="h-full flex-shrink-0 object-contain rounded-l-lg"
                                        />
                                    </div>
                                    <div class="bg-neutral-800 px-4 flex flex-col items-center justify-center h-full min-w-25">
                                        {move || {
                                            liquid_apys
                                                .get()
                                                .map(|res| match res {
                                                    Ok((metapool_apy, _)) => {
                                                        let apy_str = format!(
                                                            "{:.02}%",
                                                            metapool_apy.unwrap_or_default(),
                                                        );
                                                        view! {
                                                            <div class="text-white font-semibold text-lg">
                                                                {apy_str}
                                                            </div>
                                                        }
                                                            .into_any()
                                                    }
                                                    Err(_) => {
                                                        view! {
                                                            <div class="text-gray-400 font-semibold text-lg">"-"</div>
                                                        }
                                                            .into_any()
                                                    }
                                                })
                                                .unwrap_or_else(|| {
                                                    view! {
                                                        <div class="text-gray-400 font-semibold text-lg">
                                                            "Loading"
                                                        </div>
                                                    }
                                                        .into_any()
                                                })
                                        }} <div class="text-gray-400 text-xs">"APY"</div>
                                        <div class="text-gray-500 text-[10px] mt-1">
                                            "7-day average"
                                        </div>
                                    </div>
                                </A>
                                <A
                                    href="/swap?from=near&to=linear-protocol.near"
                                    attr:class="rounded-lg flex items-center hover:opacity-90 transition-opacity cursor-pointer overflow-hidden h-25"
                                >
                                    <div
                                        class="p-4 flex items-center justify-center flex-1 h-full"
                                        style="background-color: #090811"
                                    >
                                        <img
                                            src="/lst-linear.svg"
                                            alt="LiNEAR Protocol"
                                            class="h-full flex-shrink-0 object-contain rounded-l-lg"
                                        />
                                    </div>
                                    <div class="bg-neutral-800 px-4 py-4 flex flex-col items-center justify-center h-full min-w-25">
                                        {move || {
                                            liquid_apys
                                                .get()
                                                .map(|res| match res {
                                                    Ok((_, linear_apy)) => {
                                                        let apy_str = format!(
                                                            "{:.02}%",
                                                            linear_apy.unwrap_or_default(),
                                                        );
                                                        view! {
                                                            <div class="text-white font-semibold text-lg">
                                                                {apy_str}
                                                            </div>
                                                        }
                                                            .into_any()
                                                    }
                                                    Err(_) => {
                                                        view! {
                                                            <div class="text-gray-400 font-semibold text-lg">"-"</div>
                                                        }
                                                            .into_any()
                                                    }
                                                })
                                                .unwrap_or_else(|| {
                                                    view! {
                                                        <div class="text-gray-400 font-semibold text-lg">
                                                            "Loading"
                                                        </div>
                                                    }
                                                        .into_any()
                                                })
                                        }} <div class="text-gray-400 text-xs">"APY"</div>
                                        <div class="text-gray-500 text-[10px] mt-1">
                                            "7-day average"
                                        </div>
                                    </div>
                                </A>
                            </div>
                        </div>
                    }
                        .into_any()
                } else {
                    ().into_any()
                }
            }}
            <Suspense fallback=move || {
                view! {
                    <div class="flex items-center justify-center h-32">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            }>
                {move || {
                    let query = search_query.get();
                    validators_resource
                        .get()
                        .map(|result| {
                            match result {
                                Ok(validators) => {
                                    let filtered_validators = if query.trim().is_empty() {
                                        validators.clone()
                                    } else {
                                        let mut scored_validators: Vec<
                                            (ValidatorInfo, i32),
                                        > = validators
                                            .iter()
                                            .filter_map(|validator| {
                                                let mut score = 0;
                                                score = score
                                                    .max(
                                                        compute_match_score(
                                                            &query,
                                                            validator.info.account_id.as_ref(),
                                                        ),
                                                    );
                                                if let Some(details) = &validator.details {
                                                    if let Some(name) = &details.name {
                                                        score = score.max(compute_match_score(&query, name));
                                                    }
                                                }
                                                if score > 0 {
                                                    Some((validator.clone(), score))
                                                } else {
                                                    None
                                                }
                                            })
                                            .collect();
                                        scored_validators
                                            .sort_by(|a, b| {
                                                let score_cmp = b.1.cmp(&a.1);
                                                if score_cmp == std::cmp::Ordering::Equal {
                                                    a.0.info.account_id.cmp(&b.0.info.account_id)
                                                } else {
                                                    score_cmp
                                                }
                                            });
                                        scored_validators
                                            .into_iter()
                                            .map(|(validator, _)| validator)
                                            .collect()
                                    };
                                    if filtered_validators.is_empty() {
                                        let message = if query.trim().is_empty() {
                                            "No validators found."
                                        } else {
                                            "No validators match your search query."
                                        };
                                        view! { <p class="text-gray-400">{message}</p> }.into_any()
                                    } else {
                                        let total_staked: u128 = validators
                                            .iter()
                                            .filter(|v| v.is_active)
                                            .map(|v| v.info.stake)
                                            .sum();
                                        let near_total_supply = tokens_context
                                            .tokens
                                            .get()
                                            .into_iter()
                                            .find(|t| t.token.account_id == Token::Near)
                                            .map(|t| t.token.total_supply);
                                        let base_apy = near_total_supply
                                            .map(|supply| {
                                                if total_staked == 0 {
                                                    return BigDecimal::from(0);
                                                }
                                                let base_inflation = BigDecimal::from_str("0.05").unwrap();
                                                let treasury_rate = BigDecimal::from_str("0.1").unwrap();
                                                let validator_rate = BigDecimal::from(1) - &treasury_rate;
                                                let validator_inflation = &base_inflation * &validator_rate;
                                                let near_total_supply = BigDecimal::from(supply);
                                                let total_staked = BigDecimal::from(total_staked);
                                                &validator_inflation / (&total_staked / &near_total_supply)
                                            })
                                            .unwrap_or_default();
                                        let current_network = network_context.network.get();
                                        let show_shuffle_explanation = RwSignal::new(false);

                                        view! {
                                            <div class="flex flex-col gap-2">
                                                {move || {
                                                    if query.trim().is_empty() {
                                                        view! {
                                                            <div class="flex items-center justify-between mb-4">
                                                                <h2 class="text-xl font-semibold">"Native Staking"</h2>
                                                                <button
                                                                    class="text-gray-400 hover:text-white cursor-pointer no-mobile-ripple"
                                                                    on:click=move |_| {
                                                                        show_shuffle_explanation.update(|show| *show = !*show);
                                                                    }
                                                                >
                                                                    <Icon icon=icondata::LuDices width="20" height="20" />
                                                                </button>
                                                            </div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }
                                                }} <Show when=move || show_shuffle_explanation.get()>
                                                    <div class="relative bg-neutral-800 p-4 rounded-lg mb-4">
                                                        <div class="absolute -top-2 right-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-neutral-800"></div>
                                                        <p class="text-gray-300 text-sm">
                                                            "Validators are randomly shuffled to promote decentralization. This helps prevent bias toward larger validators, ensuring fairer distribution of stake across the network. Of course, you're free to choose any validator you want, but having few validators with large concentration of stake makes the network less secure."
                                                        </p>
                                                    </div>
                                                </Show>
                                                {filtered_validators
                                                    .into_iter()
                                                    .map(|v| {
                                                        view! {
                                                            <ValidatorCard
                                                                validator=v
                                                                base_apy=base_apy.clone()
                                                                total_supply=near_total_supply
                                                                network=current_network
                                                                refresh=move || {
                                                                    validators_resource.refetch();
                                                                }
                                                            />
                                                        }
                                                    })
                                                    .collect_view()}
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }
                                Err(e) => {
                                    view! {
                                        <p class="text-red-500">
                                            {format!("Error loading validators: {}", e)}
                                        </p>
                                    }
                                        .into_any()
                                }
                            }
                        })
                }}
            </Suspense>
        </div>
    }
}

#[derive(Clone)]
struct ValidatorPageData {
    validator: ValidatorInfo,
    base_apy: BigDecimal,
}

#[component]
pub fn StakeValidator() -> impl IntoView {
    let params = use_params_map();
    let validator_pool = move || {
        params
            .get()
            .get("validator_pool")
            .and_then(|v| v.parse::<AccountId>().ok())
    };

    let rpc_context = expect_context::<RpcContext>();
    let tokens_context = expect_context::<TokensContext>();
    let network_context = expect_context::<NetworkContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let transaction_queue_context = expect_context::<TransactionQueueContext>();
    let navigate = use_navigate();

    let (amount, set_amount) = signal("".to_string());
    let (amount_error, set_amount_error) = signal::<Option<String>>(None);
    let (has_typed_amount, set_has_typed_amount) = signal(false);
    let (modal_state, set_modal_state) = signal(StakeModalState::None);

    let validator_data = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let validator_account_id = validator_pool();
        let network = network_context.network.get();
        let tokens = tokens_context.tokens.get();
        async move {
            let Some(validator_account_id) = validator_account_id else {
                return Err("Invalid validator account ID".to_string());
            };

            let data = rpc_client
                .validators(EpochReference::Latest)
                .await
                .map_err(|e| e.to_string())?;
            let active_validators_info = data.current_validators;

            let Some(validator_info) = active_validators_info
                .iter()
                .find(|v| v.account_id == validator_account_id)
                .cloned()
            else {
                return Err("Validator not found in current epoch".to_string());
            };

            let (fee_res, details_res) = join(
                rpc_client.call::<Fraction>(
                    validator_account_id.clone(),
                    "get_reward_fee_fraction",
                    serde_json::json!({}),
                    QueryFinality::Finality(Finality::Final),
                ),
                async {
                    if let Some(pool_details_contract) = match network {
                        Network::Mainnet => Some("pool-details.near".parse::<AccountId>().unwrap()),
                        Network::Testnet => None,
                    } {
                        rpc_client
                            .call::<PoolDetails>(
                                pool_details_contract,
                                "get_fields_by_pool",
                                serde_json::json!({ "pool_id": validator_account_id }),
                                QueryFinality::Finality(Finality::Final),
                            )
                            .await
                    } else {
                        Err(CallError::Rpc(Error::OtherQueryError(
                            "Pool details not available on this network".to_string(),
                        )))
                    }
                },
            )
            .await;

            let fee_fraction = fee_res.map_err(|e| e.to_string())?;
            let details = details_res.ok();

            let validator = ValidatorInfo {
                info: validator_info,
                fee_fraction,
                details,
                user_staked: NearToken::from_yoctonear(0),
                user_unstaked: NearToken::from_yoctonear(0),
                user_can_withdraw: true,
                estimated_unlock_time: None,
                is_active: true,
            };

            let total_staked: u128 = active_validators_info.iter().map(|v| v.stake).sum();
            let near_total_supply = tokens
                .into_iter()
                .find(|t| t.token.account_id == Token::Near)
                .map(|t| t.token.total_supply);

            let base_apy = near_total_supply
                .map(|supply| {
                    if total_staked == 0 {
                        return BigDecimal::from(0);
                    }
                    let base_inflation = BigDecimal::from_str("0.05").unwrap();
                    let treasury_rate = BigDecimal::from_str("0.1").unwrap();
                    let validator_rate = BigDecimal::from(1) - &treasury_rate;
                    let validator_inflation = &base_inflation * &validator_rate;
                    let near_total_supply = BigDecimal::from(supply);
                    let total_staked = BigDecimal::from(total_staked);
                    &validator_inflation / (&total_staked / &near_total_supply)
                })
                .unwrap_or_default();

            Ok(ValidatorPageData {
                validator,
                base_apy,
            })
        }
    });

    let current_staked_balance = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let validator_account_id = validator_pool();
        let user_account_id = accounts_context.accounts.get().selected_account_id;
        async move {
            let validator_account_id = validator_account_id?;
            let user_account_id = user_account_id?;

            rpc_client
                .call::<NearToken>(
                    validator_account_id,
                    "get_account_staked_balance",
                    serde_json::json!({ "account_id": user_account_id }),
                    QueryFinality::Finality(Finality::Final),
                )
                .await
                .ok()
        }
    });

    let near_balance = move || {
        tokens_context
            .tokens
            .get()
            .into_iter()
            .find(|t| t.token.account_id == Token::Near)
            .map(|t| t.balance)
            .unwrap_or_default()
    };

    let near_price = move || {
        tokens_context
            .tokens
            .get()
            .into_iter()
            .find(|t| t.token.account_id == Token::Near)
            .map(|t| t.token.price_usd)
            .unwrap_or_default()
    };

    let check_amount = move |amount_str: String| {
        set_has_typed_amount.set(true);
        if let Ok(amount_decimal) = amount_str.parse::<BigDecimal>() {
            if amount_decimal <= BigDecimal::from(0) {
                set_amount_error.set(Some("Amount must be greater than 0".to_string()));
                return;
            }
            let max_amount = balance_to_decimal(near_balance(), 24);
            if amount_decimal > max_amount {
                set_amount_error.set(Some("Not enough balance".to_string()));
                return;
            }
            set_amount_error.set(None);
        } else {
            set_amount_error.set(Some("Please enter a valid amount".to_string()));
        }
    };

    let handle_stake = move |_| {
        if amount_error.with(|e| e.is_some()) || amount.with(|a| a.is_empty()) {
            return;
        }

        let Some(validator_pool) = validator_pool() else {
            return;
        };
        let Ok(amount) = amount.get().parse::<BigDecimal>() else {
            return;
        };
        let amount = decimal_to_balance(amount, 24);
        let amount = NearToken::from_yoctonear(amount);
        let transaction_description = format!("Staking {} with {}", amount, validator_pool);
        let Some(signer_id) = accounts_context
            .accounts
            .get_untracked()
            .selected_account_id
        else {
            return;
        };

        spawn_local(async move {
            let actions = vec![Action::FunctionCall(Box::new(FunctionCallAction {
                method_name: "deposit_and_stake".to_string(),
                args: serde_json::to_vec(&serde_json::json!({})).unwrap(),
                gas: NearGas::from_tgas(50).as_gas(),
                deposit: amount,
            }))];

            let (rx, tx) = EnqueuedTransaction::create(
                transaction_description,
                signer_id,
                validator_pool.clone(),
                actions,
            );
            transaction_queue_context
                .add_transaction
                .update(|txs| txs.push(tx));

            match rx.await {
                Ok(_) => {
                    set_modal_state.set(StakeModalState::Success(format!(
                        "Successfully staked {} with {}",
                        amount, validator_pool,
                    )));
                }
                Err(err) => {
                    let error = format!("{err}");
                    set_modal_state.set(StakeModalState::Error(error));
                }
            }
        });

        set_amount.set("".to_string());
        set_has_typed_amount.set(false);
        set_amount_error.set(None);
    };

    view! {
        <div class="flex flex-col gap-4 p-2 md:p-4 transition-all duration-100">
            <A
                href="/stake"
                attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 cursor-pointer no-mobile-ripple"
            >
                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                <span>"Back to Validators"</span>
            </A>
            {move || {
                match validator_data.get() {
                    None => {
                        view! {
                            <div class="flex items-center justify-center h-32">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        }
                            .into_any()
                    }
                    Some(res) => {
                        match res {
                            Ok(data) => {
                                let fee = if data.validator.fee_fraction.denominator == 0 {
                                    BigDecimal::from(0)
                                } else {
                                    BigDecimal::from(data.validator.fee_fraction.numerator)
                                        / BigDecimal::from(data.validator.fee_fraction.denominator)
                                };
                                let one = BigDecimal::from(1);
                                let apy_bigdecimal = (&one - &fee) * &data.base_apy;
                                let apy_percent = &apy_bigdecimal * BigDecimal::from(100);
                                let apy_str = format!("{:.2}%", apy_percent);
                                let fee_str = format!(
                                    "(fee: {:.2}%)",
                                    &fee * BigDecimal::from(100),
                                );
                                let current_stake = current_staked_balance.get().flatten();

                                view! {
                                    <div class="flex flex-col gap-4">
                                        <div class="bg-neutral-900 rounded-xl p-4">
                                            <div class="flex items-center justify-between gap-2">
                                                <div class="flex items-center gap-3">
                                                    {if let Some(logo_url) = data
                                                        .validator
                                                        .details
                                                        .as_ref()
                                                        .and_then(|d| d.logo.as_ref())
                                                    {
                                                        view! {
                                                            <img
                                                                src=proxify_url(logo_url)
                                                                class="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                                                            />
                                                        }
                                                            .into_any()
                                                    } else {
                                                        view! {
                                                            <div class="w-12 h-12 rounded-full bg-neutral-700 flex-shrink-0 flex items-center justify-center">
                                                                <Icon icon=icondata::LuCircleUser width="24" height="24" />
                                                            </div>
                                                        }
                                                            .into_any()
                                                    }} <div>
                                                        <h2 class="text-white text-xl font-bold wrap-anywhere">
                                                            {data.validator.info.account_id.to_string()}
                                                        </h2>
                                                        <p class="text-gray-400 font-bold">"Stake NEAR"</p>
                                                    </div>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-green-400 text-lg font-bold">
                                                        {apy_str}
                                                    </div>
                                                    <div class="text-gray-400 text-xs">"APY"</div>
                                                    <div class="text-gray-500 text-xs">{fee_str}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-4">
                                            <div class="flex flex-col gap-2">
                                                <label for="amount" class="text-gray-400">
                                                    "Amount to Stake"
                                                </label>
                                                <div class="relative">
                                                    <input
                                                        id="amount"
                                                        type="text"
                                                        class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                                        style=move || {
                                                            if has_typed_amount.get() {
                                                                if amount_error.get().is_some() {
                                                                    "border: 2px solid rgb(239 68 68)"
                                                                } else {
                                                                    "border: 2px solid rgb(34 197 94)"
                                                                }
                                                            } else {
                                                                "border: 2px solid transparent"
                                                            }
                                                        }
                                                        placeholder="0.0"
                                                        prop:value=amount
                                                        on:input=move |ev| {
                                                            let value = event_target_value(&ev);
                                                            set_amount.set(value.clone());
                                                            check_amount(value);
                                                        }
                                                    />
                                                    <button
                                                        class="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200 no-mobile-ripple"
                                                        on:click=move |_| {
                                                            let max_amount = balance_to_decimal(near_balance(), 24);
                                                            let gas_cost = BigDecimal::from_str("0.01").unwrap();
                                                            let final_amount = (max_amount - gas_cost)
                                                                .max(BigDecimal::from(0));
                                                            let final_amount_str = final_amount.to_string();
                                                            set_amount.set(final_amount_str.clone());
                                                            check_amount(final_amount_str);
                                                        }
                                                    >
                                                        "MAX"
                                                    </button>
                                                </div>
                                                <div class="flex justify-between items-center mt-1">
                                                    <p class="text-red-500 text-sm font-medium h-5">
                                                        {move || amount_error.get().unwrap_or_default()}
                                                    </p>
                                                    <p class="text-gray-400 text-sm">
                                                        "Balance: "
                                                        {move || format_token_amount(near_balance(), 24, "NEAR")}
                                                    </p>
                                                </div>
                                            </div>
                                            <ProjectedRevenue
                                                amount=amount.get()
                                                apy_bigdecimal=apy_bigdecimal.clone()
                                                near_price=near_price()
                                                current_stake=current_stake
                                                mode=ProjectedRevenueMode::Increase
                                            />
                                            <button
                                                class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden hover:bg-neutral-900/70 enabled:bg-gradient-to-r enabled:from-blue-500 enabled:to-purple-500 enabled:hover:from-blue-600 enabled:hover:to-purple-600"
                                                disabled=move || {
                                                    amount_error.with(|e| e.is_some())
                                                        || amount.with(|a| a.is_empty())
                                                }
                                                on:click=handle_stake
                                            >
                                                "Stake"
                                            </button>
                                        </div>
                                    </div>
                                }
                                    .into_any()
                            }
                            Err(e) => {
                                view! {
                                    <div class="flex flex-col items-center justify-center h-32 gap-4">
                                        <div class="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                            <div class="flex items-center gap-2 text-red-400">
                                                <Icon
                                                    icon=icondata::LuTriangleAlert
                                                    width="20"
                                                    height="20"
                                                />
                                                <p class="text-white font-medium">{e}</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                                    .into_any()
                            }
                        }
                    }
                }
            }}
            {move || {
                let navigate = navigate.clone();
                let navigate2 = navigate.clone();
                match modal_state.get() {
                    StakeModalState::Success(message) => {
                        view! {
                            <TransactionSuccessModal
                                on_close=move || {
                                    set_modal_state.set(StakeModalState::None);
                                    navigate("/stake", Default::default());
                                }
                                message=message
                            />
                        }
                            .into_any()
                    }
                    StakeModalState::Error(error) => {
                        view! {
                            <TransactionErrorModal
                                on_close=move || {
                                    set_modal_state.set(StakeModalState::None);
                                    navigate2("/stake", Default::default());
                                }
                                error=error
                            />
                        }
                            .into_any()
                    }
                    StakeModalState::None => ().into_any(),
                }
            }}
        </div>
    }
}

#[derive(Debug, Clone)]
pub enum UnstakeModalState {
    None,
    Success(String),
    Error(String),
}

#[component]
pub fn UnstakeValidator() -> impl IntoView {
    let params = use_params_map();
    let validator_pool = move || {
        params
            .get()
            .get("validator_pool")
            .and_then(|v| v.parse::<AccountId>().ok())
    };

    let rpc_context = expect_context::<RpcContext>();
    let tokens_context = expect_context::<TokensContext>();
    let network_context = expect_context::<NetworkContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let transaction_queue_context = expect_context::<TransactionQueueContext>();
    let navigate = use_navigate();

    let (amount, set_amount) = signal("".to_string());
    let (amount_error, set_amount_error) = signal::<Option<String>>(None);
    let (has_typed_amount, set_has_typed_amount) = signal(false);
    let (modal_state, set_modal_state) = signal(UnstakeModalState::None);

    let validator_data = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let validator_account_id = validator_pool();
        let network = network_context.network.get();
        let tokens = tokens_context.tokens.get();
        async move {
            let Some(validator_account_id) = validator_account_id else {
                return Err("Invalid validator account ID".to_string());
            };

            let data = rpc_client
                .validators(EpochReference::Latest)
                .await
                .map_err(|e| e.to_string())?;
            let active_validators_info = data.current_validators;

            let Some(validator_info) = active_validators_info
                .iter()
                .find(|v| v.account_id == validator_account_id)
                .cloned()
            else {
                return Err("Validator not found in current epoch".to_string());
            };

            let (fee_res, details_res) = join(
                rpc_client.call::<Fraction>(
                    validator_account_id.clone(),
                    "get_reward_fee_fraction",
                    serde_json::json!({}),
                    QueryFinality::Finality(Finality::Final),
                ),
                async {
                    if let Some(pool_details_contract) = match network {
                        Network::Mainnet => Some("pool-details.near".parse::<AccountId>().unwrap()),
                        Network::Testnet => None,
                    } {
                        rpc_client
                            .call::<PoolDetails>(
                                pool_details_contract,
                                "get_fields_by_pool",
                                serde_json::json!({ "pool_id": validator_account_id }),
                                QueryFinality::Finality(Finality::Final),
                            )
                            .await
                    } else {
                        Err(CallError::Rpc(Error::OtherQueryError(
                            "Pool details not available on this network".to_string(),
                        )))
                    }
                },
            )
            .await;
            let fee_fraction = fee_res.map_err(|e| e.to_string())?;
            let details = details_res.ok();

            let validator = ValidatorInfo {
                info: validator_info,
                fee_fraction,
                details,
                user_staked: NearToken::from_yoctonear(0),
                user_unstaked: NearToken::from_yoctonear(0),
                user_can_withdraw: true,
                estimated_unlock_time: None,
                is_active: true,
            };

            let total_staked: u128 = active_validators_info.iter().map(|v| v.stake).sum();
            let near_total_supply = tokens
                .into_iter()
                .find(|t| t.token.account_id == Token::Near)
                .map(|t| t.token.total_supply);

            let base_apy = near_total_supply
                .map(|supply| {
                    if total_staked == 0 {
                        return BigDecimal::from(0);
                    }
                    let base_inflation = BigDecimal::from_str("0.05").unwrap();
                    let treasury_rate = BigDecimal::from_str("0.1").unwrap();
                    let validator_rate = BigDecimal::from(1) - &treasury_rate;
                    let validator_inflation = &base_inflation * &validator_rate;
                    let near_total_supply = BigDecimal::from(supply);
                    let total_staked = BigDecimal::from(total_staked);
                    &validator_inflation / (&total_staked / &near_total_supply)
                })
                .unwrap_or_default();

            Ok(ValidatorPageData {
                validator,
                base_apy,
            })
        }
    });

    let staked_balance = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let validator_account_id = validator_pool();
        let user_account_id = accounts_context.accounts.get().selected_account_id;
        async move {
            let validator_account_id = validator_account_id?;
            let user_account_id = user_account_id?;

            rpc_client
                .call::<NearToken>(
                    validator_account_id,
                    "get_account_staked_balance",
                    serde_json::json!({ "account_id": user_account_id }),
                    QueryFinality::Finality(Finality::Final),
                )
                .await
                .ok()
        }
    });

    let near_price = move || {
        tokens_context
            .tokens
            .get()
            .into_iter()
            .find(|t| t.token.account_id == Token::Near)
            .map(|t| t.token.price_usd)
            .unwrap_or_default()
    };

    let check_amount = move |val: String| {
        set_has_typed_amount.set(true);
        if let Ok(decimal) = val.parse::<BigDecimal>() {
            if decimal <= BigDecimal::from(0) {
                set_amount_error.set(Some("Amount must be greater than 0".to_string()));
            } else {
                if let Some(Some(staked_token)) = staked_balance.get() {
                    let max_decimal = balance_to_decimal(staked_token.as_yoctonear(), 24);
                    if decimal > max_decimal {
                        set_amount_error.set(Some("Amount exceeds staked balance".to_string()));
                        return;
                    }
                }
                set_amount_error.set(None);
            }
        } else {
            set_amount_error.set(Some("Invalid number".to_string()));
        }
    };

    let handle_unstake = move |_| {
        if amount_error.with(|e| e.is_some()) || amount.with(|a| a.is_empty()) {
            return;
        }

        let Some(validator_pool) = validator_pool() else {
            return;
        };
        let Ok(amount) = amount.get().parse::<BigDecimal>() else {
            return;
        };
        let amount = decimal_to_balance(amount, 24);
        let amount = NearToken::from_yoctonear(amount);

        let actions = vec![Action::FunctionCall(Box::new(FunctionCallAction {
            method_name: "unstake".to_string(),
            args: serde_json::to_vec(&serde_json::json!({ "amount": amount })).unwrap(),
            gas: NearGas::from_tgas(50).as_gas(),
            deposit: NearToken::from_yoctonear(0),
        }))];

        let Some(signer_id) = accounts_context
            .accounts
            .get_untracked()
            .selected_account_id
        else {
            return;
        };

        let description = format!("Unstaking {} from {}", amount, validator_pool);

        spawn_local(async move {
            let (rx, tx) = EnqueuedTransaction::create(
                description,
                signer_id,
                validator_pool.clone(),
                actions,
            );
            transaction_queue_context
                .add_transaction
                .update(|t| t.push(tx));

            match rx.await {
                Ok(_) => {
                    set_modal_state.set(UnstakeModalState::Success(format!(
                        "Successfully initiated unstake of {} from {}. Come back tomorrow to withdraw your NEAR.",
                        amount, validator_pool
                    )));
                }
                Err(err) => {
                    set_modal_state.set(UnstakeModalState::Error(err.to_string()));
                }
            }
        });

        set_amount.set("".to_string());
        set_has_typed_amount.set(false);
        set_amount_error.set(None);
    };

    view! {
        <div class="flex flex-col gap-4 p-2 md:p-4 transition-all duration-100">
            <A
                href="/stake"
                attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 cursor-pointer no-mobile-ripple"
            >
                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                <span>"Back to Validators"</span>
            </A>

            {move || {
                match validator_data.get() {
                    None => {
                        view! {
                            <div class="flex items-center justify-center h-32">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        }
                            .into_any()
                    }
                    Some(res) => {
                        match res {
                            Ok(data) => {
                                let fee = if data.validator.fee_fraction.denominator == 0 {
                                    BigDecimal::from(0)
                                } else {
                                    BigDecimal::from(data.validator.fee_fraction.numerator)
                                        / BigDecimal::from(data.validator.fee_fraction.denominator)
                                };
                                let one = BigDecimal::from(1);
                                let apy_bigdecimal = (&one - &fee) * &data.base_apy;
                                let apy_percent = &apy_bigdecimal * BigDecimal::from(100);
                                let apy_str = format!("{:.2}%", apy_percent);
                                let fee_str = format!(
                                    "(fee: {:.2}%)",
                                    &fee * BigDecimal::from(100),
                                );
                                let current_stake = staked_balance.get().flatten();

                                view! {
                                    <div class="bg-neutral-900 rounded-xl p-4">
                                        <div class="flex items-center justify-between gap-2">
                                            <div class="flex items-center gap-3">
                                                {if let Some(logo_url) = data
                                                    .validator
                                                    .details
                                                    .as_ref()
                                                    .and_then(|d| d.logo.as_ref())
                                                {
                                                    view! {
                                                        <img
                                                            src=proxify_url(logo_url)
                                                            class="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                                                        />
                                                    }
                                                        .into_any()
                                                } else {
                                                    view! {
                                                        <div class="w-12 h-12 rounded-full bg-neutral-700 flex-shrink-0 flex items-center justify-center">
                                                            <Icon icon=icondata::LuCircleUser width="24" height="24" />
                                                        </div>
                                                    }
                                                        .into_any()
                                                }} <div>
                                                    <h2 class="text-white text-xl font-bold wrap-anywhere">
                                                        {data.validator.info.account_id.to_string()}
                                                    </h2>
                                                    <p class="text-gray-400 font-bold">"Unstake NEAR"</p>
                                                    {if let Some(s) = current_stake {
                                                        view! {
                                                            <p class="text-gray-400 text-sm">
                                                                {format!("Currently staked: {s}")}
                                                            </p>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }}
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-green-400 text-lg font-bold">
                                                    {apy_str}
                                                </div>
                                                <div class="text-gray-400 text-xs">"APY"</div>
                                                <div class="text-gray-500 text-xs">{fee_str}</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                    .into_any()
                            }
                            Err(e) => {
                                view! {
                                    <div class="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                        <div class="flex items-center gap-2 text-red-400">
                                            <Icon
                                                icon=icondata::LuTriangleAlert
                                                width="20"
                                                height="20"
                                            />
                                            <p class="text-white font-medium">{e}</p>
                                        </div>
                                    </div>
                                }
                                    .into_any()
                            }
                        }
                    }
                }
            }}

            <div class="flex flex-col gap-2">
                <label class="text-gray-400" for="amount">
                    "Amount to Unstake"
                </label>
                <div class="relative">
                    <input
                        id="amount"
                        type="text"
                        class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                        style=move || {
                            if has_typed_amount.get() {
                                if amount_error.get().is_some() {
                                    "border: 2px solid rgb(239 68 68)"
                                } else {
                                    "border: 2px solid rgb(34 197 94)"
                                }
                            } else {
                                "border: 2px solid transparent"
                            }
                        }
                        placeholder="0.0"
                        prop:value=amount
                        on:input=move |ev| {
                            let val = event_target_value(&ev);
                            set_amount.set(val.clone());
                            check_amount(val);
                        }
                    />
                    <button
                        class="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200 no-mobile-ripple"
                        on:click=move |_| {
                            if let Some(Some(staked)) = staked_balance.get() {
                                let dec = balance_to_decimal(staked.as_yoctonear(), 24);
                                set_amount.set(dec.to_string());
                                check_amount(dec.to_string());
                            }
                        }
                    >
                        "MAX"
                    </button>
                </div>
                <div class="flex justify-between items-center mt-1">
                    <p class="text-red-500 text-sm font-medium h-5">
                        {move || amount_error.get().unwrap_or_default()}
                    </p>
                    <p class="text-gray-400 text-sm">
                        {move || {
                            staked_balance
                                .get()
                                .flatten()
                                .map(|s| { format!("Staked: {s}") })
                                .unwrap_or_default()
                        }}
                    </p>
                </div>
            </div>

            {move || {
                validator_data
                    .get()
                    .map(|res| {
                        match res {
                            Ok(data) => {
                                let fee = if data.validator.fee_fraction.denominator == 0 {
                                    BigDecimal::from(0)
                                } else {
                                    BigDecimal::from(data.validator.fee_fraction.numerator)
                                        / BigDecimal::from(data.validator.fee_fraction.denominator)
                                };
                                let one = BigDecimal::from(1);
                                let apy_bigdecimal = (&one - &fee) * &data.base_apy;
                                let current_stake = staked_balance.get().flatten();

                                view! {
                                    <ProjectedRevenue
                                        amount=amount.get()
                                        apy_bigdecimal=apy_bigdecimal
                                        near_price=near_price()
                                        current_stake=current_stake
                                        mode=ProjectedRevenueMode::Decrease
                                    />
                                }
                                    .into_any()
                            }
                            Err(_) => ().into_any(),
                        }
                    })
            }}

            <button
                class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden hover:bg-neutral-900/70 enabled:bg-gradient-to-r enabled:from-blue-500 enabled:to-purple-500 enabled:hover:from-blue-600 enabled:hover:to-purple-600"
                disabled=move || amount_error.with(|e| e.is_some()) || amount.with(|a| a.is_empty())
                on:click=handle_unstake
            >
                "Unstake"
            </button>

            {move || {
                let navigate = navigate.clone();
                let navigate2 = navigate.clone();
                match modal_state.get() {
                    UnstakeModalState::Success(message) => {
                        view! {
                            <TransactionSuccessModal
                                on_close=move || {
                                    set_modal_state.set(UnstakeModalState::None);
                                    navigate("/stake", Default::default());
                                }
                                message=message
                            />
                        }
                            .into_any()
                    }
                    UnstakeModalState::Error(error) => {
                        view! {
                            <TransactionErrorModal
                                on_close=move || {
                                    set_modal_state.set(UnstakeModalState::None);
                                    navigate2("/stake", Default::default());
                                }
                                error=error
                            />
                        }
                            .into_any()
                    }
                    UnstakeModalState::None => ().into_any(),
                }
            }}
        </div>
    }
}

fn find_exact_match(result: ViewStateResult, key: &[u8]) -> Option<Vec<u8>> {
    for value in result.values {
        if key == *value.key {
            return Some(value.value.to_vec());
        }
    }
    None
}

#[cached(
    convert = r##"{ format!("{validator_account_id}:{user_account_id}") }"##,
    key = "String",
    time = 10,
    result = true
)]
pub async fn get_unstake_available_epoch(
    rpc_client: RpcClient,
    validator_account_id: AccountId,
    user_account_id: AccountId,
) -> Result<EpochHeight, String> {
    if validator_account_id.as_str().ends_with(".pool.near") {
        get_unstake_available_epoch_pool_near(rpc_client, validator_account_id, user_account_id)
            .await
    } else if validator_account_id.as_str().ends_with(".poolv1.near")
        || validator_account_id.as_str().ends_with("pool.f863973.m0")
    {
        get_unstake_available_epoch_poolv1_near(rpc_client, validator_account_id, user_account_id)
            .await
    } else {
        Err("Unsupported validator pool".to_string())
    }
}

pub async fn get_unstake_available_epoch_pool_near(
    rpc_client: RpcClient,
    validator_account_id: AccountId,
    user_account_id: AccountId,
) -> Result<EpochHeight, String> {
    const ACCOUNTS_PREFIX: &[u8] = &[0];
    const UNORDERED_MAP_KEY_PREFIX: &[u8] = b"i";
    let user_account_id_serialized = borsh::to_vec(&user_account_id).unwrap();
    let key = [
        ACCOUNTS_PREFIX,
        UNORDERED_MAP_KEY_PREFIX,
        &user_account_id_serialized,
    ]
    .concat();
    let result = match rpc_client
        .view_state(
            validator_account_id.clone(),
            &key,
            QueryFinality::Finality(Finality::Final),
        )
        .await
    {
        Ok(result) => result,
        Err(e) => return Err(e.to_string()),
    };
    let Some(vector_key) = find_exact_match(result, &key) else {
        return Err("Key 1 not found".to_string());
    };
    const UNORDERED_MAP_VALUE_PREFIX: &[u8] = b"v";
    let unordered_map_value_key =
        [ACCOUNTS_PREFIX, UNORDERED_MAP_VALUE_PREFIX, &vector_key].concat();
    let result = match rpc_client
        .view_state(
            validator_account_id.clone(),
            &unordered_map_value_key,
            QueryFinality::Finality(Finality::Final),
        )
        .await
    {
        Ok(result) => result,
        Err(e) => return Err(e.to_string()),
    };
    let Some(mut value) = find_exact_match(result, &unordered_map_value_key) else {
        return Err("Key 2 not found".to_string());
    };

    // Copied from https://github.com/referencedev/staking-farm/blob/c37009b45abaef8455974cea6d5d60b726908fbe/staking-farm/src/account.rs#L13-L33
    type NumStakeShares = Balance;
    #[derive(BorshDeserialize, Debug, PartialEq)]
    pub struct Account {
        pub unstaked: Balance,
        pub stake_shares: NumStakeShares,
        pub unstaked_available_epoch_height: EpochHeight,
        pub last_farm_reward_per_share: HashMap<u64, (u128, u128)>, // U256
        pub amounts: HashMap<AccountId, Balance>,
    }
    if let Ok(account) = borsh::from_reader::<_, Account>(&mut Cursor::new(&mut value)) {
        Ok(account.unstaked_available_epoch_height)
    } else {
        Err("Failed to deserialize account".to_string())
    }
}

pub async fn get_unstake_available_epoch_poolv1_near(
    rpc_client: RpcClient,
    validator_account_id: AccountId,
    user_account_id: AccountId,
) -> Result<EpochHeight, String> {
    const ACCOUNTS_PREFIX: &[u8] = b"u";
    const UNORDERED_MAP_KEY_PREFIX: &[u8] = b"i";
    let user_account_id_serialized = borsh::to_vec(&user_account_id).unwrap();
    let key = [
        ACCOUNTS_PREFIX,
        UNORDERED_MAP_KEY_PREFIX,
        &user_account_id_serialized,
    ]
    .concat();
    let result = match rpc_client
        .view_state(
            validator_account_id.clone(),
            &key,
            QueryFinality::Finality(Finality::Final),
        )
        .await
    {
        Ok(result) => result,
        Err(e) => return Err(e.to_string()),
    };
    let Some(vector_key) = find_exact_match(result, &key) else {
        return Err("Key 1 not found".to_string());
    };
    const UNORDERED_MAP_VALUE_PREFIX: &[u8] = b"v";
    let unordered_map_value_key =
        [ACCOUNTS_PREFIX, UNORDERED_MAP_VALUE_PREFIX, &vector_key].concat();
    let result = match rpc_client
        .view_state(
            validator_account_id.clone(),
            &unordered_map_value_key,
            QueryFinality::Finality(Finality::Final),
        )
        .await
    {
        Ok(result) => result,
        Err(e) => return Err(e.to_string()),
    };
    let Some(mut value) = find_exact_match(result, &unordered_map_value_key) else {
        return Err("Key 2 not found".to_string());
    };

    // Copied from https://github.com/near/core-contracts/blob/a4c0bf31ac4a5468c1e1839c661b26678ed8b62a/staking-pool/src/lib.rs#L44-L56
    type NumStakeShares = Balance;
    #[derive(BorshDeserialize, Debug, PartialEq)]
    pub struct Account {
        pub unstaked: Balance,
        pub stake_shares: NumStakeShares,
        pub unstaked_available_epoch_height: EpochHeight,
    }
    if let Ok(account) = borsh::from_reader::<_, Account>(&mut Cursor::new(&mut value)) {
        Ok(account.unstaked_available_epoch_height)
    } else {
        Err("Failed to deserialize account".to_string())
    }
}

#[cached(convert = "{}", key = "()", time = 10, result = true)]
async fn fetch_latest_block(rpc_client: &RpcClient) -> Result<BlockView, String> {
    rpc_client
        .block(BlockReference::Finality(Finality::Final))
        .await
        .map_err(|e| e.to_string())
}

#[cached(
    convert = r##"{ format!("{block_ref:?}") }"##,
    key = "String",
    result = true
)]
async fn fetch_block_by_id(
    rpc_client: &RpcClient,
    block_ref: BlockReference,
) -> Result<BlockView, String> {
    if matches!(block_ref, BlockReference::SyncCheckpoint(_)) {
        return Err("Sync checkpoints are not supported in fetch_block_by_id".to_string());
    }
    rpc_client.block(block_ref).await.map_err(|e| e.to_string())
}

#[allow(clippy::float_arithmetic)] // The countdown is not precise
async fn calculate_estimated_unlock_time(
    rpc_client: RpcClient,
    validator_account_id: AccountId,
    user_account_id: AccountId,
    current_epoch_height: EpochHeight,
    epoch_start_block_height: u64,
) -> Result<DateTime<Utc>, String> {
    let available_epoch =
        get_unstake_available_epoch(rpc_client.clone(), validator_account_id, user_account_id)
            .await?;

    if available_epoch <= current_epoch_height {
        return Ok(Utc::now());
    }

    let latest_block = fetch_latest_block(&rpc_client).await?;
    let current_block_height = latest_block.header.height;

    let progress_blocks =
        current_block_height.saturating_sub(epoch_start_block_height) % EPOCH_LENGTH;

    let epoch_duration_secs = EPOCH_DURATION.as_secs_f64();
    let progress_secs = (progress_blocks as f64 / EPOCH_LENGTH as f64) * epoch_duration_secs;

    let epochs_left = available_epoch - current_epoch_height;

    let total_remaining_secs_f = (epochs_left as f64 * epoch_duration_secs) - progress_secs;

    let total_remaining_secs = if total_remaining_secs_f <= 0.0 {
        0u32
    } else {
        total_remaining_secs_f.ceil().min(u32::MAX as f64) as u32
    };

    Ok(Utc::now() + Duration::from_secs(total_remaining_secs as u64))
}
