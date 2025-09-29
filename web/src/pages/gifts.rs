use bigdecimal::BigDecimal;
use chrono::{DateTime, Utc};
use leptos::prelude::*;
use leptos_icons::*;
use near_min_api::{
    types::{near_crypto::PublicKey, AccountId, Finality, NearToken, U128},
    utils::dec_format,
    QueryFinality,
};
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    str::FromStr,
    time::Duration,
};

use crate::{
    components::{
        gift_modals::{
            CancelDropConfirmationData, CancelDropConfirmationModal, GiftConfirmationData,
            GiftConfirmationModal, GiftToken, GiftTokensList,
        },
        progressive_image::ProgressiveImage,
        select::{Select, SelectOption},
    },
    contexts::{
        accounts_context::AccountsContext,
        modal_context::ModalContext,
        network_context::{Network, NetworkContext},
        nft_cache_context::{NftCacheContext, OwnedCollection},
        rpc_context::RpcContext,
        tokens_context::{Token, TokensContext},
        transaction_queue_context::TransactionQueueContext,
    },
    pages::nfts::fetch_nfts,
    utils::{
        balance_to_decimal, decimal_to_balance, format_account_id_no_hide, format_duration,
        format_token_amount, proxify_url, Resolution,
    },
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DropContents {
    /// Native NEAR
    pub near: NearToken,
    /// Fungible tokens
    pub nep141: HashMap<AccountId, U128>,
    /// Non-fungible tokens
    pub nep171: HashMap<AccountId, HashSet<String>>,
    /// Multi-fungible tokens
    pub nep245: HashMap<AccountId, HashMap<String, U128>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DropClaim {
    #[serde(with = "dec_format")]
    pub claimed_at_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DropStatus {
    Active,
    Cancelled,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ActiveTab {
    Gifts,
    Claimed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Drop {
    pub contents: DropContents,
    #[serde(with = "dec_format")]
    pub created_at_ms: u64,
    pub created_by: AccountId,
    pub claims: HashMap<AccountId, DropClaim>,
    pub status: DropStatus,
}

#[component]
pub fn Gifts() -> impl IntoView {
    let (near_amount, set_near_amount) = signal(String::new());
    let (has_typed_near_amount, set_has_typed_near_amount) = signal(false);
    let (near_amount_error, set_near_amount_error) = signal(Option::<String>::None);
    let (selected_fungible_tokens, set_selected_fungible_tokens) =
        signal(Vec::<(AccountId, String, Option<String>)>::new()); // (token_account_id, amount, amount_error)
    let (selected_nfts, set_selected_nfts) = signal(Vec::<(AccountId, String)>::new()); // (contract_id, token_id)
    let (active_tab, set_active_tab) = signal(ActiveTab::Gifts);

    let TokensContext { tokens, .. } = expect_context::<TokensContext>();
    let NetworkContext { network } = expect_context::<NetworkContext>();
    let ModalContext { modal } = expect_context::<ModalContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let TransactionQueueContext { .. } = expect_context::<TransactionQueueContext>();
    let NftCacheContext { cache } = expect_context::<NftCacheContext>();

    let drops = LocalResource::new(move || {
        let rpc_client = client.get();
        let account_id = accounts.get().selected_account_id;
        async move {
            let Some(account_id) = account_id else {
                return Ok::<Vec<(PublicKey, Drop)>, String>(Vec::new());
            };

            let mut all_drops = Vec::new();
            let mut skip = 0;
            const LIMIT: u32 = 100;

            loop {
                let request_result = rpc_client
                    .call::<Vec<(PublicKey, Drop)>>(
                        "slimedrop.intear.near".parse().unwrap(),
                        "get_account_drops",
                        serde_json::json!({
                            "account_id": account_id,
                            "skip": skip.to_string(),
                            "limit": LIMIT.to_string()
                        }),
                        QueryFinality::Finality(Finality::None),
                    )
                    .await;

                match request_result {
                    Ok(batch) => {
                        let batch_len = batch.len();
                        all_drops.extend(batch);

                        if batch_len < LIMIT as usize {
                            break;
                        }
                        skip += LIMIT;
                    }
                    Err(e) => {
                        log::error!("Failed to fetch drops: {:?}", e);
                        return Err(format!("Failed to fetch drops: {:?}", e));
                    }
                }
            }

            Ok(all_drops)
        }
    });

    let claimed_drops = LocalResource::new(move || {
        let rpc_client = client.get();
        let account_id = accounts.get().selected_account_id;
        async move {
            let Some(account_id) = account_id else {
                return Ok::<Vec<(PublicKey, Drop)>, String>(Vec::new());
            };

            let mut all_drops = Vec::new();
            let mut skip = 0;
            const LIMIT: u32 = 100;

            loop {
                let request_result = rpc_client
                    .call::<Vec<(PublicKey, Drop)>>(
                        "slimedrop.intear.near".parse().unwrap(),
                        "get_account_claimed_drops",
                        serde_json::json!({
                            "account_id": account_id,
                            "skip": skip.to_string(),
                            "limit": LIMIT.to_string()
                        }),
                        QueryFinality::Finality(Finality::None),
                    )
                    .await;

                match request_result {
                    Ok(batch) => {
                        let batch_len = batch.len();
                        all_drops.extend(batch);

                        if batch_len < LIMIT as usize {
                            break;
                        }
                        skip += LIMIT;
                    }
                    Err(e) => {
                        log::error!("Failed to fetch claimed drops: {:?}", e);
                        return Err(format!("Failed to fetch claimed drops: {:?}", e));
                    }
                }
            }

            Ok(all_drops)
        }
    });

    let near_token = move || {
        tokens
            .get()
            .into_iter()
            .find(|t| t.token.account_id == Token::Near)
    };

    let nep141_tokens = Memo::new(move |_| {
        tokens
            .get()
            .into_iter()
            .filter(|t| matches!(t.token.account_id, Token::Nep141(_)))
            .collect::<Vec<_>>()
    });

    let nft_collections = LocalResource::new(move || {
        let account_id = accounts.get().selected_account_id;
        async move {
            let Some(account_id) = account_id else {
                return Ok::<Vec<OwnedCollection>, String>(Vec::new());
            };

            Ok(fetch_nfts(account_id, network.get(), cache).await)
        }
    });

    let near_balance_formatted = move || {
        if let Some(token) = near_token() {
            format_token_amount(
                token.balance,
                token.token.metadata.decimals,
                &token.token.metadata.symbol,
            )
        } else {
            "Loading".to_string()
        }
    };

    let trim_to_three_decimals = move |value: String| -> String {
        if let Some(dot_pos) = value.find('.') {
            let integer_part = &value[..dot_pos];
            let decimal_part = &value[dot_pos + 1..];
            if decimal_part.len() > 3 {
                format!("{}.{}", integer_part, &decimal_part[..3])
            } else {
                value
            }
        } else {
            value
        }
    };

    let calculate_total_fee = move || {
        let base_fee = BigDecimal::from_str("0.05").unwrap();
        let num_ft_tokens = selected_fungible_tokens.get().len() as i32;
        let num_nfts = selected_nfts.get().len() as i32;
        let ft_fee = BigDecimal::from_str("0.005").unwrap() * BigDecimal::from(num_ft_tokens);
        let nft_fee = BigDecimal::from_str("0.005").unwrap() * BigDecimal::from(num_nfts);
        base_fee + ft_fee + nft_fee
    };

    let is_nft_already_selected = move |contract_id: AccountId, token_id: String| -> bool {
        selected_nfts.get().contains(&(contract_id, token_id))
    };

    let total_tokens_count =
        move || selected_fungible_tokens.get().len() + selected_nfts.get().len();

    let can_add_more_tokens = move || total_tokens_count() < 10;

    let get_available_collections = move || -> Vec<AccountId> {
        let collections = nft_collections.get();
        if let Some(Ok(collections)) = collections {
            collections
                .iter()
                .map(|collection| collection.contract_id.clone())
                .collect()
        } else {
            Vec::new()
        }
    };

    let get_available_tokens_for_collection = move |contract_id: AccountId| -> Vec<String> {
        let collections = nft_collections.get();
        if let Some(Ok(collections)) = collections {
            if let Some(collection) = collections.iter().find(|c| c.contract_id == contract_id) {
                collection
                    .tokens
                    .iter()
                    .map(|token| token.token_id.clone())
                    .filter(|token_id| {
                        !is_nft_already_selected(contract_id.clone(), token_id.clone())
                    })
                    .collect()
            } else {
                Vec::new()
            }
        } else {
            Vec::new()
        }
    };

    let check_near_amount = move |amount: String| {
        set_has_typed_near_amount.set(true);

        let amount_trim = amount.trim();
        if amount_trim.is_empty() {
            set_near_amount_error.set(Some("Please enter NEAR amount".to_string()));
            return;
        }

        match amount_trim.parse::<BigDecimal>() {
            Ok(dec) => {
                if dec <= BigDecimal::from(0) {
                    set_near_amount_error.set(Some("Amount must be greater than 0".to_string()));
                } else {
                    let min_amount = calculate_total_fee() + BigDecimal::from_str("0.01").unwrap();
                    if dec < min_amount {
                        let mut min_amount_str = min_amount.to_string();
                        if min_amount_str.contains('.') {
                            min_amount_str = min_amount_str
                                .trim_end_matches('0')
                                .trim_end_matches('.')
                                .to_string();
                        }
                        set_near_amount_error
                            .set(Some(format!("Minimum amount is {} NEAR", min_amount_str)));
                    } else if let Some(near_token) = near_token() {
                        let max_amount_decimal = balance_to_decimal(near_token.balance, 24);
                        if dec > max_amount_decimal {
                            set_near_amount_error.set(Some("Not enough NEAR balance".to_string()));
                        } else {
                            set_near_amount_error.set(None);
                        }
                    }
                }
            }
            Err(_) => {
                set_near_amount_error.set(Some("Please enter a valid amount".to_string()));
            }
        }
    };

    let handle_near_max = move |_: leptos::ev::MouseEvent| {
        let Some(near_token) = near_token() else {
            return;
        };
        let max_amount_decimal = balance_to_decimal(near_token.balance, 24);
        let gas_cost_decimal = BigDecimal::from_str("0.01").unwrap();
        let final_amount_decimal =
            (&max_amount_decimal - &gas_cost_decimal).max(BigDecimal::from(0));

        let mut max_amount_str = final_amount_decimal.to_string();
        if max_amount_str.contains('.') {
            max_amount_str = max_amount_str
                .trim_end_matches('0')
                .trim_end_matches('.')
                .to_string();
        }

        let trimmed_max_amount = trim_to_three_decimals(max_amount_str);
        set_near_amount.set(trimmed_max_amount.clone());
        check_near_amount(trimmed_max_amount);
    };

    let check_token_amount = move |token_account_id: AccountId, amount: String| {
        let nep141_list = nep141_tokens();
        if let Some(token_data) = nep141_list.iter().find(|t| {
            if let Token::Nep141(account_id) = &t.token.account_id {
                account_id == &token_account_id
            } else {
                false
            }
        }) {
            let amount_trim = amount.trim();
            let error = if amount_trim.is_empty() {
                Some("Please enter amount".to_string())
            } else {
                match amount_trim.parse::<BigDecimal>() {
                    Ok(dec) => {
                        if dec <= BigDecimal::from(0) {
                            Some("Amount must be greater than 0".to_string())
                        } else {
                            let max_amount_decimal = balance_to_decimal(
                                token_data.balance,
                                token_data.token.metadata.decimals,
                            );
                            if dec > max_amount_decimal {
                                Some("Not enough balance".to_string())
                            } else {
                                None
                            }
                        }
                    }
                    Err(_) => Some("Please enter a valid amount".to_string()),
                }
            };

            set_selected_fungible_tokens.update(|tokens| {
                for (account_id, _, ref mut amount_error) in tokens.iter_mut() {
                    if *account_id == token_account_id {
                        *amount_error = error.clone();
                        break;
                    }
                }
            });
        }
    };

    let handle_token_max = move |token_account_id: AccountId| {
        let nep141_list = nep141_tokens();
        if let Some(token_data) = nep141_list.iter().find(|t| {
            if let Token::Nep141(account_id) = &t.token.account_id {
                account_id == &token_account_id
            } else {
                false
            }
        }) {
            let max_amount_decimal =
                balance_to_decimal(token_data.balance, token_data.token.metadata.decimals);
            let mut max_amount_str = max_amount_decimal.to_string();
            if max_amount_str.contains('.') {
                max_amount_str = max_amount_str
                    .trim_end_matches('0')
                    .trim_end_matches('.')
                    .to_string();
            }

            let trimmed_max_amount = trim_to_three_decimals(max_amount_str);

            set_selected_fungible_tokens.update(|tokens| {
                for (account_id, ref mut amount, _) in tokens.iter_mut() {
                    if *account_id == token_account_id {
                        *amount = trimmed_max_amount.clone();
                        break;
                    }
                }
            });

            check_token_amount(token_account_id, trimmed_max_amount);
        }
    };

    let handle_gift = move |_: leptos::ev::MouseEvent| {
        let near_amount_str = near_amount.get();
        let near_amount_decimal = match near_amount_str.parse::<BigDecimal>() {
            Ok(dec) => dec,
            Err(_) => return,
        };

        let Some(near_token_data) = near_token() else {
            return;
        };

        let near_deposit_amount = decimal_to_balance(near_amount_decimal.clone(), 24);

        let fungible_tokens = selected_fungible_tokens
            .get()
            .into_iter()
            .filter_map(|(token_account_id, amount_str, amount_error)| {
                if amount_error.is_some() {
                    return None;
                }
                let amount_decimal = amount_str.parse::<BigDecimal>().ok()?;
                if amount_decimal <= BigDecimal::from(0) {
                    return None;
                }
                let nep141_list = nep141_tokens();
                let token_data = nep141_list
                    .iter()
                    .find(|t| {
                        if let Token::Nep141(account_id) = &t.token.account_id {
                            account_id == &token_account_id
                        } else {
                            false
                        }
                    })?
                    .clone();
                let token_amount =
                    decimal_to_balance(amount_decimal.clone(), token_data.token.metadata.decimals);
                Some((token_data, token_amount, amount_decimal))
            })
            .collect::<Vec<_>>();

        let nfts = selected_nfts.get();

        let confirmation = GiftConfirmationData {
            near_token: near_token_data,
            near_amount: near_deposit_amount,
            near_amount_decimal,
            fts: fungible_tokens,
            nfts,
        };

        modal.set(Some(Box::new(move || {
            view! {
                <GiftConfirmationModal
                    confirmation_data=confirmation.clone()
                    clear_fields=move || {
                        set_near_amount.set(String::new());
                        set_has_typed_near_amount.set(false);
                        set_near_amount_error.set(None);
                        set_selected_fungible_tokens.set(Vec::new());
                        set_selected_nfts.set(Vec::new());
                        drops.refetch();
                        claimed_drops.refetch();
                    }
                />
            }
            .into_any()
        })));
    };

    let is_valid = move || {
        let near_valid = near_amount_error.get().is_none()
            && has_typed_near_amount.get()
            && !near_amount.get().trim().is_empty();
        let tokens_valid = selected_fungible_tokens
            .get()
            .iter()
            .all(|(_, amount, error)| {
                error.is_none()
                    && (amount.trim().is_empty() || amount.parse::<BigDecimal>().is_ok())
            });
        near_valid && tokens_valid
    };

    let near_gift_amount_after_fee = move || {
        if let Ok(amount_decimal) = near_amount.get().parse::<BigDecimal>() {
            let total_fee = calculate_total_fee();
            let gift_amount = &amount_decimal - &total_fee;
            if gift_amount >= BigDecimal::from(0) {
                Some(gift_amount)
            } else {
                None
            }
        } else {
            None
        }
    };

    let handle_cancel_drop = move |public_key: PublicKey, drop: Drop| {
        let confirmation = CancelDropConfirmationData {
            public_key: public_key.clone(),
            drop: drop.clone(),
        };

        modal.set(Some(Box::new(move || {
            view! {
                <CancelDropConfirmationModal
                    confirmation_data=confirmation.clone()
                    clear_fields=move || {
                        set_near_amount.set(String::new());
                        set_has_typed_near_amount.set(false);
                        set_near_amount_error.set(None);
                        set_selected_fungible_tokens.set(Vec::new());
                        drops.refetch();
                        claimed_drops.refetch();
                    }
                />
            }
            .into_any()
        })));
    };

    view! {
        <Show
            when=move || network.get() == Network::Mainnet
            fallback=move || {
                view! {
                    <div class="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                            <Icon icon=icondata::LuCircleX attr:class="w-8 h-8 text-red-500" />
                        </div>
                        <h2 class="text-xl font-bold text-white mb-2">
                            "Gifts Only Available on Mainnet"
                        </h2>
                        <p class="text-gray-400 max-w-md">
                            "The gift feature is only available on NEAR Mainnet. Please switch to Mainnet to send NEAR gifts."
                        </p>
                    </div>
                }
            }
        >
            <div class="flex flex-col gap-6 p-2 md:p-4">
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-white mb-2">"Gift Tokens"</h1>
                    <p class="text-gray-400">"Send tokens as a gift link to someone"</p>
                </div>

                <div class="bg-neutral-900/30 rounded-2xl p-3 md:p-6 space-y-4 md:space-y-6">
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <h3 class="text-white font-medium">"NEAR Amount"</h3>
                            <div class="text-sm text-gray-400">
                                "Balance: "
                                <span class="text-white font-medium">{near_balance_formatted}</span>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <div class="relative">
                                <input
                                    type="text"
                                    class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 transition-all duration-200 text-base"
                                    style=move || {
                                        if has_typed_near_amount.get() {
                                            if near_amount_error.get().is_some() {
                                                "border: 2px solid rgb(239 68 68)"
                                            } else {
                                                "border: 2px solid rgb(34 197 94)"
                                            }
                                        } else {
                                            "border: 2px solid transparent"
                                        }
                                    }
                                    placeholder="0.0"
                                    prop:value=near_amount
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        set_near_amount.set(value.clone());
                                        check_near_amount(value);
                                    }
                                />
                                <div class="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                    "NEAR"
                                </div>
                                <button
                                    class="absolute right-3 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200 no-mobile-ripple cursor-pointer"
                                    on:click=handle_near_max
                                >
                                    "MAX"
                                </button>
                            </div>
                            {move || {
                                if let Some(error) = near_amount_error.get() {
                                    view! {
                                        <p class="text-red-500 text-sm mt-2 font-medium">{error}</p>
                                    }
                                        .into_any()
                                } else if let Some(gift_amount) = near_gift_amount_after_fee() {
                                    let formatted_gift_amount = {
                                        let mut amount_str = gift_amount.to_string();
                                        if amount_str.contains('.') {
                                            amount_str = amount_str
                                                .trim_end_matches('0')
                                                .trim_end_matches('.')
                                                .to_string();
                                        }
                                        amount_str
                                    };
                                    view! {
                                        <p class="text-blue-400 text-sm mt-2 font-medium">
                                            {
                                                let total_fee = calculate_total_fee();
                                                let mut fee_str = total_fee.to_string();
                                                if fee_str.contains('.') {
                                                    fee_str = fee_str
                                                        .trim_end_matches('0')
                                                        .trim_end_matches('.')
                                                        .to_string();
                                                }
                                                format!(
                                                    "The gift will contain {} NEAR (after {} NEAR fee)",
                                                    formatted_gift_amount,
                                                    fee_str,
                                                )
                                            }
                                        </p>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-white font-medium">"Tokens"</h3>
                            <button
                                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                                disabled=move || !can_add_more_tokens()
                                on:click=move |_| {
                                    let nep141_list = nep141_tokens();
                                    let selected_account_ids: HashSet<_> = selected_fungible_tokens
                                        .get()
                                        .iter()
                                        .map(|(account_id, _, _)| account_id.clone())
                                        .collect();
                                    if let Some(first_available_token) = nep141_list
                                        .iter()
                                        .find(|t| {
                                            if let Token::Nep141(account_id) = &t.token.account_id {
                                                !selected_account_ids.contains(account_id)
                                            } else {
                                                false
                                            }
                                        })
                                    {
                                        if let Token::Nep141(account_id) = &first_available_token
                                            .token
                                            .account_id
                                        {
                                            let current = selected_fungible_tokens.get();
                                            let mut new_list = current;
                                            new_list.push((account_id.clone(), String::new(), None));
                                            set_selected_fungible_tokens.set(new_list);
                                            if has_typed_near_amount.get() {
                                                check_near_amount(near_amount.get());
                                            }
                                        }
                                    }
                                }
                            >
                                <div class="flex items-center gap-2">
                                    <Icon icon=icondata::LuPlus attr:class="w-4 h-4" />
                                    <span>"Add Token"</span>
                                </div>
                            </button>
                        </div>

                        <div class="space-y-4">
                            {move || {
                                selected_fungible_tokens
                                    .get()
                                    .into_iter()
                                    .map(|(token_account_id, amount, amount_error)| {
                                        let amount_clone = amount.clone();
                                        let amount_error_clone = amount_error.clone();
                                        let token_account_id_clone = token_account_id.clone();
                                        let token_account_id_clone_2 = token_account_id.clone();
                                        let token_account_id_clone_3 = token_account_id.clone();
                                        let token_account_id_clone_4 = token_account_id.clone();
                                        let token_account_id_clone_5 = token_account_id.clone();

                                        view! {
                                            <div class="bg-neutral-900/50 rounded-xl p-3 md:p-4 border border-neutral-700">
                                                <div class="flex gap-3 items-center">
                                                    <div class="flex-1 space-y-3">
                                                        <div class="flex flex-col md:flex-row gap-3">
                                                            <div class="flex-1">
                                                                <label class="text-gray-400 text-sm mb-2 block">
                                                                    "Token"
                                                                </label>
                                                                <Select
                                                                    options=Signal::derive(move || {
                                                                        let selected_account_ids: HashSet<_> = selected_fungible_tokens
                                                                            .get()
                                                                            .into_iter()
                                                                            .filter(|(account_id, _, _)| {
                                                                                account_id != &token_account_id_clone_3
                                                                            })
                                                                            .map(|(account_id, _, _)| account_id)
                                                                            .collect();
                                                                        nep141_tokens()
                                                                            .into_iter()
                                                                            .filter(|token| {
                                                                                if let Token::Nep141(account_id) = &token.token.account_id {
                                                                                    !selected_account_ids.contains(account_id)
                                                                                } else {
                                                                                    false
                                                                                }
                                                                            })
                                                                            .map(|token| {
                                                                                if let Token::Nep141(account_id) = &token.token.account_id {
                                                                                    SelectOption::new(
                                                                                        account_id.to_string(),
                                                                                        move || {
                                                                                            view! {
                                                                                                <span class="inline-flex items-start gap-2">
                                                                                                    {if let Some(icon_url) = token.token.metadata.icon.clone() {
                                                                                                        view! {
                                                                                                            <img
                                                                                                                src=icon_url
                                                                                                                class="w-6 h-6 rounded-full flex-shrink-0"
                                                                                                            />
                                                                                                        }
                                                                                                            .into_any()
                                                                                                    } else {
                                                                                                        ().into_any()
                                                                                                    }} {token.token.metadata.symbol.clone()}
                                                                                                </span>
                                                                                            }
                                                                                                .into_any()
                                                                                        },
                                                                                    )
                                                                                } else {
                                                                                    unreachable!()
                                                                                }
                                                                            })
                                                                            .collect()
                                                                    })
                                                                    initial_value=token_account_id.to_string()
                                                                    class="bg-neutral-800 border-neutral-700 text-white rounded-lg"
                                                                    on_change=Callback::new(move |value: String| {
                                                                        if let Ok(account_id) = value.parse::<AccountId>() {
                                                                            set_selected_fungible_tokens
                                                                                .update(|tokens| {
                                                                                    if let Some(entry) = tokens
                                                                                        .iter_mut()
                                                                                        .find(|(account_id, _, _)| {
                                                                                            account_id == &token_account_id_clone_2
                                                                                        })
                                                                                    {
                                                                                        entry.0 = account_id;
                                                                                        entry.1 = String::new();
                                                                                        entry.2 = None;
                                                                                    }
                                                                                });
                                                                        }
                                                                    })
                                                                />
                                                            </div>

                                                            <div class="flex-1">
                                                                <label class="text-gray-400 text-sm mb-2 block">
                                                                    "Amount"
                                                                </label>
                                                                <div class="relative">
                                                                    <input
                                                                        type="text"
                                                                        class="w-full bg-neutral-800 text-white rounded-lg px-4 py-2.5 pr-24 focus:outline-none focus:ring-2 transition-all duration-200 text-base"
                                                                        style={
                                                                            let amount_clone2 = amount_clone.clone();
                                                                            let amount_error_clone2 = amount_error_clone.clone();
                                                                            move || {
                                                                                if amount_error_clone2.is_some() {
                                                                                    "border: 2px solid rgb(239 68 68)"
                                                                                } else if !amount_clone2.is_empty() {
                                                                                    "border: 2px solid rgb(34 197 94)"
                                                                                } else {
                                                                                    "border: 2px solid transparent"
                                                                                }
                                                                            }
                                                                        }
                                                                        placeholder="0.0"
                                                                        prop:value=amount_clone.clone()
                                                                        on:input=move |ev| {
                                                                            let value = event_target_value(&ev);
                                                                            set_selected_fungible_tokens
                                                                                .update(|tokens| {
                                                                                    if let Some(entry) = tokens
                                                                                        .iter_mut()
                                                                                        .find(|(account_id, _, _)| account_id == &token_account_id)
                                                                                    {
                                                                                        entry.1 = value.clone();
                                                                                    }
                                                                                });
                                                                            check_token_amount(token_account_id_clone_5.clone(), value);
                                                                        }
                                                                    />
                                                                    <button
                                                                        class="absolute right-3 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200 no-mobile-ripple cursor-pointer"
                                                                        on:click=move |_| handle_token_max(
                                                                            token_account_id_clone_4.clone(),
                                                                        )
                                                                    >
                                                                        "MAX"
                                                                    </button>
                                                                </div>

                                                                {
                                                                    let amount_error_clone3 = amount_error_clone.clone();
                                                                    move || {
                                                                        if let Some(error) = amount_error_clone3.clone() {
                                                                            view! {
                                                                                <p class="text-red-500 text-sm mt-2 font-medium">{error}</p>
                                                                            }
                                                                                .into_any()
                                                                        } else {
                                                                            ().into_any()
                                                                        }
                                                                    }
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="flex items-center justify-center">
                                                        <button
                                                            class="text-red-400 hover:text-red-300 cursor-pointer p-2 transition-colors"
                                                            on:click=move |_| {
                                                                set_selected_fungible_tokens
                                                                    .update(|tokens| {
                                                                        tokens
                                                                            .retain(|(account_id, _, _)| {
                                                                                account_id != &token_account_id_clone
                                                                            });
                                                                    });
                                                                if has_typed_near_amount.get() {
                                                                    check_near_amount(near_amount.get());
                                                                }
                                                            }
                                                        >
                                                            <Icon icon=icondata::LuTrash2 width="20" height="20" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    })
                                    .collect::<Vec<_>>()
                            }}
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-white font-medium">"NFTs"</h3>
                            <button
                                class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                                disabled=move || {
                                    !can_add_more_tokens()
                                        || get_available_collections()
                                            .into_iter()
                                            .all(|contract_id| {
                                                get_available_tokens_for_collection(contract_id.clone())
                                                    .is_empty()
                                            })
                                }
                                on:click=move |_| {
                                    let collections = get_available_collections();
                                    for contract_id in collections {
                                        let available_tokens = get_available_tokens_for_collection(
                                            contract_id.clone(),
                                        );
                                        if let Some(token_id) = available_tokens.first() {
                                            let current = selected_nfts.get();
                                            let mut new_list = current;
                                            new_list.push((contract_id, token_id.clone()));
                                            set_selected_nfts.set(new_list);
                                            break;
                                        }
                                    }
                                }
                            >
                                <div class="flex items-center gap-2">
                                    <Icon icon=icondata::LuPlus attr:class="w-4 h-4" />
                                    <span>"Add NFT"</span>
                                </div>
                            </button>
                        </div>

                        <Suspense fallback=move || {
                            view! {
                                <div class="flex items-center justify-center py-4">
                                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            }
                        }>
                            {move || {
                                match nft_collections.get() {
                                    Some(Ok(collections)) => {
                                        if collections.is_empty() {
                                            view! {
                                                <div class="bg-neutral-900/50 rounded-xl p-4 text-center">
                                                    <Icon
                                                        icon=icondata::LuImage
                                                        attr:class="w-6 h-6 text-gray-400 mx-auto mb-2"
                                                    />
                                                    <p class="text-gray-400 text-sm">
                                                        "No NFTs found. NFTs will appear here when you own some."
                                                    </p>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            view! {
                                                <div class="space-y-4">
                                                    {selected_nfts
                                                        .get()
                                                        .into_iter()
                                                        .enumerate()
                                                        .map(|(list_index, (contract_id, token_id))| {
                                                            let contract_id_clone = contract_id.clone();
                                                            let collections_clone = collections.clone();
                                                            let collections_clone_2 = collections.clone();
                                                            let collections_clone_3 = collections.clone();

                                                            view! {
                                                                <div class="bg-neutral-900/50 rounded-xl p-3 md:p-4 border border-neutral-700">
                                                                    <div class="flex gap-3 items-center">
                                                                        <div class="flex-1 space-y-3">
                                                                            <div class="flex flex-col md:flex-row gap-3">
                                                                                <div class="flex-1">
                                                                                    <label class="text-gray-400 text-sm mb-2 block">
                                                                                        "Collection"
                                                                                    </label>
                                                                                    <Select
                                                                                        options=Signal::derive(move || {
                                                                                            collections_clone
                                                                                                .iter()
                                                                                                .map(|collection| {
                                                                                                    let collection_clone = collection.clone();
                                                                                                    SelectOption::new(
                                                                                                        collection_clone.contract_id.to_string(),
                                                                                                        move || {
                                                                                                            view! {
                                                                                                                <span class="inline-flex items-start gap-2">
                                                                                                                    {if let Some(metadata) = &collection_clone.metadata {
                                                                                                                        if let Some(icon_url) = metadata.icon.clone() {
                                                                                                                            let low_res_url = proxify_url(&icon_url, Resolution::Low);
                                                                                                                            let high_res_url = proxify_url(&icon_url, Resolution::High);
                                                                                                                            view! {
                                                                                                                                <ProgressiveImage
                                                                                                                                    low_res_src=low_res_url
                                                                                                                                    high_res_src=high_res_url
                                                                                                                                    attr:class="w-6 h-6 rounded-full flex-shrink-0"
                                                                                                                                />
                                                                                                                            }
                                                                                                                                .into_any()
                                                                                                                        } else {
                                                                                                                            view! {
                                                                                                                                <div class="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                                                                                                                                    {metadata.name.chars().next().unwrap_or('?')}
                                                                                                                                </div>
                                                                                                                            }
                                                                                                                                .into_any()
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        view! {
                                                                                                                            <div class="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                                                                                                                                "?"
                                                                                                                            </div>
                                                                                                                        }
                                                                                                                            .into_any()
                                                                                                                    }}
                                                                                                                    <span class="truncate">
                                                                                                                        {collection_clone
                                                                                                                            .metadata
                                                                                                                            .as_ref()
                                                                                                                            .map(|m| m.name.clone())
                                                                                                                            .unwrap_or_else(|| {
                                                                                                                                collection_clone.contract_id.to_string()
                                                                                                                            })}
                                                                                                                    </span>
                                                                                                                </span>
                                                                                                            }
                                                                                                                .into_any()
                                                                                                        },
                                                                                                    )
                                                                                                })
                                                                                                .collect()
                                                                                        })
                                                                                        initial_value=contract_id.to_string()
                                                                                        class="bg-neutral-800 border-neutral-700 text-white rounded-lg"
                                                                                        on_change=Callback::new(move |value: String| {
                                                                                            if let Ok(new_contract_id) = value.parse::<AccountId>() {
                                                                                                if let Some(collection) = collections_clone_2
                                                                                                    .iter()
                                                                                                    .find(|c| c.contract_id == new_contract_id)
                                                                                                {
                                                                                                    for token in collection.tokens.iter() {
                                                                                                        if !is_nft_already_selected(
                                                                                                            new_contract_id.clone(),
                                                                                                            token.token_id.clone(),
                                                                                                        ) {
                                                                                                            set_selected_nfts
                                                                                                                .update(|nfts| {
                                                                                                                    if let Some(entry) = nfts.get_mut(list_index) {
                                                                                                                        entry.0 = new_contract_id;
                                                                                                                        entry.1 = token.token_id.clone();
                                                                                                                    }
                                                                                                                });
                                                                                                            break;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    />
                                                                                </div>

                                                                                <div class="flex-1">
                                                                                    <label class="text-gray-400 text-sm mb-2 block">
                                                                                        "Token"
                                                                                    </label>
                                                                                    <Select
                                                                                        options=Signal::derive(move || {
                                                                                            if let Some(collection) = collections_clone_3
                                                                                                .iter()
                                                                                                .find(|c| c.contract_id == contract_id_clone)
                                                                                            {
                                                                                                collection
                                                                                                    .tokens
                                                                                                    .iter()
                                                                                                    .map(|token| {
                                                                                                        let token_clone = token.clone();
                                                                                                        SelectOption::new(
                                                                                                            token_clone.token_id.clone(),
                                                                                                            move || {
                                                                                                                view! {
                                                                                                                    <span class="inline-flex items-start gap-2">
                                                                                                                        {if let Some(media) = &token_clone.metadata.media {
                                                                                                                            let low_res_url = proxify_url(media, Resolution::Low);
                                                                                                                            let high_res_url = proxify_url(media, Resolution::High);
                                                                                                                            view! {
                                                                                                                                <ProgressiveImage
                                                                                                                                    low_res_src=low_res_url
                                                                                                                                    high_res_src=high_res_url
                                                                                                                                    attr:class="w-6 h-6 rounded flex-shrink-0 object-cover"
                                                                                                                                />
                                                                                                                            }
                                                                                                                                .into_any()
                                                                                                                        } else {
                                                                                                                            view! {
                                                                                                                                <div class="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-white text-xs">
                                                                                                                                    "#"
                                                                                                                                </div>
                                                                                                                            }
                                                                                                                                .into_any()
                                                                                                                        }}
                                                                                                                        <span class="truncate">
                                                                                                                            {token_clone
                                                                                                                                .metadata
                                                                                                                                .title
                                                                                                                                .as_ref()
                                                                                                                                .map(|t| format!("{} #{}", t, token_clone.token_id))
                                                                                                                                .unwrap_or_else(|| format!("#{}", token_clone.token_id))}
                                                                                                                        </span>
                                                                                                                    </span>
                                                                                                                }
                                                                                                                    .into_any()
                                                                                                            },
                                                                                                        )
                                                                                                    })
                                                                                                    .collect()
                                                                                            } else {
                                                                                                Vec::new()
                                                                                            }
                                                                                        })
                                                                                        initial_value=token_id.to_string()
                                                                                        class="bg-neutral-800 border-neutral-700 text-white rounded-lg"
                                                                                        on_change=Callback::new(move |value: String| {
                                                                                            set_selected_nfts
                                                                                                .update(|nfts| {
                                                                                                    if let Some(entry) = nfts.get_mut(list_index) {
                                                                                                        entry.1 = value;
                                                                                                    }
                                                                                                });
                                                                                        })
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div class="flex items-center justify-center">
                                                                            <button
                                                                                class="text-red-400 hover:text-red-300 cursor-pointer p-2 transition-colors"
                                                                                on:click=move |_| {
                                                                                    set_selected_nfts
                                                                                        .update(|nfts| {
                                                                                            nfts.remove(list_index);
                                                                                        });
                                                                                }
                                                                            >
                                                                                <Icon icon=icondata::LuTrash2 width="20" height="20" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        })
                                                        .collect::<Vec<_>>()}
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }
                                    Some(Err(_)) => {
                                        view! {
                                            <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
                                                <Icon
                                                    icon=icondata::LuCircleX
                                                    attr:class="w-6 h-6 text-red-400 mx-auto mb-2"
                                                />
                                                <p class="text-red-400 text-sm">
                                                    "Failed to load NFTs. Please try again."
                                                </p>
                                            </div>
                                        }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="flex items-center justify-center py-4">
                                                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }
                            }}
                        </Suspense>
                    </div>

                    {move || {
                        if total_tokens_count() >= 10 {
                            view! {
                                <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 text-center mb-4">
                                    <div class="flex items-center justify-center gap-2">
                                        <Icon
                                            icon=icondata::LuInfo
                                            attr:class="w-4 h-4 text-yellow-400"
                                        />
                                        <p class="text-yellow-400 text-sm font-medium">
                                            "Maximum of 10 tokens (FT + NFT) allowed per gift"
                                        </p>
                                    </div>
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}

                    <button
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer text-base"
                        disabled=move || !is_valid()
                        on:click=handle_gift
                    >
                        "Create Gift"
                    </button>
                </div>

                <div class="space-y-4 mt-8">
                    <div class="flex items-center gap-8 border-b border-neutral-700">
                        <button
                            class="py-3 px-1 text-sm font-medium transition-colors cursor-pointer border-b-2"
                            class:text-blue-400=move || active_tab.get() == ActiveTab::Gifts
                            class:border-blue-400=move || active_tab.get() == ActiveTab::Gifts
                            class:text-gray-400=move || active_tab.get() != ActiveTab::Gifts
                            class:border-transparent=move || active_tab.get() != ActiveTab::Gifts
                            class:hover:text-white=move || active_tab.get() != ActiveTab::Gifts
                            on:click=move |_| set_active_tab.set(ActiveTab::Gifts)
                        >
                            "Your Gifts"
                        </button>
                        <button
                            class="py-3 px-1 text-sm font-medium transition-colors cursor-pointer border-b-2"
                            class:text-blue-400=move || active_tab.get() == ActiveTab::Claimed
                            class:border-blue-400=move || active_tab.get() == ActiveTab::Claimed
                            class:text-gray-400=move || active_tab.get() != ActiveTab::Claimed
                            class:border-transparent=move || active_tab.get() != ActiveTab::Claimed
                            class:hover:text-white=move || active_tab.get() != ActiveTab::Claimed
                            on:click=move |_| set_active_tab.set(ActiveTab::Claimed)
                        >
                            "Claimed"
                        </button>
                    </div>

                    <Suspense fallback=move || {
                        view! {
                            <div class="flex items-center justify-center py-8">
                                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                        }
                    }>
                        {move || {
                            match active_tab.get() {
                                ActiveTab::Gifts => {
                                    match drops.get() {
                                        Some(Ok(drops_list)) => {
                                            if drops_list.is_empty() {
                                                view! {
                                                    <div class="bg-neutral-900/50 rounded-xl p-6 text-center">
                                                        <Icon
                                                            icon=icondata::LuGift
                                                            attr:class="w-8 h-8 text-gray-400 mx-auto mb-2"
                                                        />
                                                        <p class="text-gray-400 text-sm">
                                                            "No gifts created yet. Create your first gift above!"
                                                        </p>
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                view! {
                                                    <div class="space-y-3">
                                                        {drops_list
                                                            .into_iter()
                                                            .rev()
                                                            .map(|(public_key, drop)| {
                                                                let created_datetime = DateTime::from_timestamp_millis(
                                                                        drop.created_at_ms as i64,
                                                                    )
                                                                    .expect(
                                                                        "Failed to create datetime from on-chain timestamp",
                                                                    );
                                                                let now = Utc::now();
                                                                let duration = now
                                                                    .signed_duration_since(created_datetime)
                                                                    .to_std()
                                                                    .unwrap_or(Duration::from_secs(0));
                                                                let created_ago = format_duration(duration);
                                                                {
                                                                    let public_key_clone = public_key.clone();
                                                                    let drop_clone = drop.clone();
                                                                    view! {
                                                                        <div class="bg-neutral-900/50 border border-neutral-700 rounded-xl p-4">
                                                                            <div class="flex items-center justify-between">
                                                                                <div class="flex items-center gap-3">
                                                                                    <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                                                        <Icon
                                                                                            icon=icondata::LuGift
                                                                                            attr:class="w-5 h-5 text-blue-400"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <div class="text-white font-medium flex items-center gap-2 flex-wrap">
                                                                                            <GiftTokensList
                                                                                                tokens={GiftToken::from_drop(&drop)}
                                                                                                class="inline-flex items-center gap-1"
                                                                                            />
                                                                                        </div>
                                                                                        <div class="text-gray-400 text-sm">
                                                                                            "Created "{created_ago}" ago"
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div class="flex items-center gap-2">
                                                                                    {match (
                                                                                        &drop_clone.status,
                                                                                        drop_clone.claims.iter().next(),
                                                                                    ) {
                                                                                        (DropStatus::Active, None) => {
                                                                                            view! {
                                                                                                <button
                                                                                                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                                                                                    on:click=move |_| handle_cancel_drop(
                                                                                                        public_key_clone.clone(),
                                                                                                        drop_clone.clone(),
                                                                                                    )
                                                                                                >
                                                                                                    "Cancel"
                                                                                                </button>
                                                                                            }
                                                                                                .into_any()
                                                                                        }
                                                                                        (DropStatus::Active, Some(claim)) => {
                                                                                            let claimed_timestamp = claim.1.claimed_at_ms / 1000;
                                                                                            let claimed_datetime = DateTime::from_timestamp(
                                                                                                    claimed_timestamp as i64,
                                                                                                    0,
                                                                                                )
                                                                                                .unwrap_or_else(Utc::now);
                                                                                            let claim_duration = now
                                                                                                .signed_duration_since(claimed_datetime)
                                                                                                .to_std()
                                                                                                .unwrap_or(Duration::from_secs(0));
                                                                                            let claimed_ago = format_duration(claim_duration);
                                                                                            view! {
                                                                                                <div class="text-right">
                                                                                                    <div class="text-green-400 text-sm font-medium">
                                                                                                        "Claimed by " {format_account_id_no_hide(claim.0)}
                                                                                                    </div>
                                                                                                    <div class="text-gray-400 text-xs">
                                                                                                        "Claimed "{claimed_ago}" ago"
                                                                                                    </div>
                                                                                                </div>
                                                                                            }
                                                                                                .into_any()
                                                                                        }
                                                                                        (DropStatus::Cancelled, _) => {
                                                                                            view! {
                                                                                                <div class="text-red-400 text-sm font-medium">
                                                                                                    "Cancelled"
                                                                                                </div>
                                                                                            }
                                                                                                .into_any()
                                                                                        }
                                                                                    }}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                        }
                                        Some(Err(_)) => {
                                            view! {
                                                <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
                                                    <Icon
                                                        icon=icondata::LuCircleX
                                                        attr:class="w-6 h-6 text-red-400 mx-auto mb-2"
                                                    />
                                                    <p class="text-red-400 text-sm">
                                                        "Failed to load gifts. Please try again."
                                                    </p>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                        None => {
                                            view! {
                                                <div class="flex items-center justify-center py-8">
                                                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }
                                }
                                ActiveTab::Claimed => {
                                    match claimed_drops.get() {
                                        Some(Ok(claimed_list)) => {
                                            if claimed_list.is_empty() {
                                                view! {
                                                    <div class="bg-neutral-900/50 rounded-xl p-6 text-center">
                                                        <Icon
                                                            icon=icondata::LuCheck
                                                            attr:class="w-8 h-8 text-gray-400 mx-auto mb-2"
                                                        />
                                                        <p class="text-gray-400 text-sm">
                                                            "No claimed gifts yet. Claim a gift to see it here!"
                                                        </p>
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                view! {
                                                    <div class="space-y-3">
                                                        {claimed_list
                                                            .into_iter()
                                                            .rev()
                                                            .map(|(_, drop)| {
                                                                let created_datetime = DateTime::from_timestamp_millis(
                                                                        drop.created_at_ms as i64,
                                                                    )
                                                                    .expect(
                                                                        "Failed to create datetime from on-chain timestamp",
                                                                    );
                                                                let now = Utc::now();
                                                                let duration = now
                                                                    .signed_duration_since(created_datetime)
                                                                    .to_std()
                                                                    .unwrap_or(Duration::from_secs(0));
                                                                let created_ago = format_duration(duration);
                                                                let claim_info = drop.claims.iter().next();

                                                                view! {
                                                                    <div class="bg-neutral-900/50 border border-green-500/30 rounded-xl p-4">
                                                                        <div class="flex items-center justify-between">
                                                                            <div class="flex items-center gap-3">
                                                                                <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                                                                                    <Icon
                                                                                        icon=icondata::LuCheck
                                                                                        attr:class="w-5 h-5 text-green-400"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <div class="text-white font-medium flex items-center gap-2 flex-wrap">
                                                                                        <GiftTokensList
                                                                                            tokens={GiftToken::from_drop(&drop)}
                                                                                            class="inline-flex items-center gap-1"
                                                                                        />
                                                                                    </div>
                                                                                    <div class="text-gray-400 text-sm">
                                                                                        "Created by " {drop.created_by.to_string()} " "{created_ago}
                                                                                        " ago"
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div class="flex items-center gap-2">
                                                                                {if let Some((claimer, claim)) = claim_info {
                                                                                    let claimed_timestamp = claim.claimed_at_ms / 1000;
                                                                                    let claimed_datetime = DateTime::from_timestamp(
                                                                                            claimed_timestamp as i64,
                                                                                            0,
                                                                                        )
                                                                                        .unwrap_or_else(Utc::now);
                                                                                    let claim_duration = now
                                                                                        .signed_duration_since(claimed_datetime)
                                                                                        .to_std()
                                                                                        .unwrap_or(Duration::from_secs(0));
                                                                                    let claimed_ago = format_duration(claim_duration);
                                                                                    view! {
                                                                                        <div class="text-right">
                                                                                            <div class="text-green-400 text-sm font-medium">
                                                                                                "Claimed "{claimed_ago}" ago"
                                                                                            </div>
                                                                                            <div class="text-gray-400 text-xs">
                                                                                                "From " {format_account_id_no_hide(claimer)}
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                        .into_any()
                                                                                } else {
                                                                                    ().into_any()
                                                                                }}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                        }
                                        Some(Err(_)) => {
                                            view! {
                                                <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
                                                    <Icon
                                                        icon=icondata::LuCircleX
                                                        attr:class="w-6 h-6 text-red-400 mx-auto mb-2"
                                                    />
                                                    <p class="text-red-400 text-sm">
                                                        "Failed to load claimed gifts. Please try again."
                                                    </p>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                        None => {
                                            view! {
                                                <div class="flex items-center justify-center py-8">
                                                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }
                                }
                            }
                        }}
                    </Suspense>
                </div>
            </div>
        </Show>
    }
}
