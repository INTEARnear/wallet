use crate::{
    components::{
        bridge_history::{
            AddBridgeHistoryEntry, DepositAddress, DepositMode, DepositStatus, DepositType,
            HistoryTab, QuoteData, QuoteRequest, QuoteResponse, RecipientType, RefundType,
            SwapType, add_to_bridge_history, build_explorer_url,
        },
        bridge_termination_screen::BridgeTerminationScreen,
        select::{Select, SelectOption},
    },
    contexts::{
        accounts_context::AccountsContext,
        rpc_context::RpcContext,
        tokens_context::{Token, TokensContext},
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    data::bridge_networks::{BRIDGEABLE_TOKENS, ChainInfo, USDC_ON_NEAR, USDT_ON_NEAR},
    pages::settings::open_live_chat,
    utils::{
        StorageBalance, balance_to_decimal, decimal_to_balance, format_token_amount,
        format_token_amount_full_precision,
    },
};
use bigdecimal::{BigDecimal, FromPrimitive};
use chrono::Utc;
use itertools::Itertools;
use leptos::prelude::*;
use leptos_icons::Icon;
use leptos_router::{components::A, hooks::use_params_map};
use leptos_use::{UseIntervalReturn, use_interval};
use near_min_api::{
    QueryFinality,
    types::{AccountId, Action, Finality, FunctionCallAction, NearGas, NearToken},
};
use std::{str::FromStr, time::Duration};

#[derive(Debug, Clone, PartialEq)]
enum Tab {
    Bridge,
    History,
}

#[derive(Debug, Clone, Copy, PartialEq)]
enum BridgeMode {
    Send,
    Receive,
}

#[derive(Debug, Clone)]
struct TerminalScreenData {
    deposit_address: DepositAddress,
}

#[component]
pub fn SendBridge() -> impl IntoView {
    let params = use_params_map();
    let token_id = move || params.get().get("token_id").unwrap_or_default();
    let TokensContext { tokens, .. } = expect_context::<TokensContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let RpcContext {
        client: rpc_client, ..
    } = expect_context::<RpcContext>();

    let (active_tab, set_active_tab) = signal(Tab::Bridge);

    let token_data = move || {
        tokens
            .get()
            .into_iter()
            .find(|t| match &t.token.account_id {
                Token::Nep141(account_id) => *account_id == token_id(),
                Token::Rhea(_) | Token::Near => false,
            })
    };

    let token_meta = Memo::new(move |_| token_data().map(|t| t.token.metadata.clone()));
    let token_balance = Memo::new(move |_| token_data().map(|t| t.balance));

    let (selected_network, set_selected_network) = signal::<Option<&'static ChainInfo>>(None);
    let (recipient_address, set_recipient_address) = signal(String::new());
    let (amount, set_amount) = signal(String::new());
    let (bridge_mode, set_bridge_mode) = signal(BridgeMode::Send);
    let (is_sending, set_is_sending) = signal(false);
    let (terminal_screen, set_terminal_screen) = signal::<Option<TerminalScreenData>>(None);
    let (quote_for_polling, set_quote_for_polling) = signal::<Option<QuoteData>>(None);

    // Reset recipient address when chain type changes
    let chain_type = Memo::new(move |_| selected_network.get().map(|n| n.chain_type));
    Effect::new(move || {
        chain_type.track();
        set_recipient_address.set(String::new());
    });

    let UseIntervalReturn {
        counter: status_counter,
        ..
    } = use_interval(5000);

    Effect::new(move || {
        status_counter.track();
        if let Some(current_quote) = quote_for_polling.get() {
            leptos::task::spawn_local(async move {
                if terminal_screen.read().is_some() {
                    return;
                }
                if let Some(deposit_address) = current_quote.deposit_address.as_ref() {
                    let status_url = format!(
                        "https://1click.chaindefuser.com/v0/status?depositAddress={}",
                        deposit_address
                    );

                    if let Ok(response) = reqwest::Client::new().get(status_url).send().await
                        && let Ok(status_response) = response
                            .json::<crate::components::bridge_history::StatusResponse>()
                            .await
                    {
                        let status = status_response.status;

                        if matches!(
                            status,
                            DepositStatus::Success
                                | DepositStatus::Failed
                                | DepositStatus::Refunded
                        ) {
                            set_terminal_screen.set(Some(TerminalScreenData {
                                deposit_address: DepositAddress::Simple(deposit_address.clone()),
                            }));
                        }
                    }
                }
            });
        }
    });

    let network_options = Signal::derive(move || {
        BRIDGEABLE_TOKENS
            .iter()
            .find(|(bridgeable_token_id, _)| *bridgeable_token_id == token_id())
            .map(|(_, bridgeable_tokens)| {
                bridgeable_tokens
                    .tokens
                    .iter()
                    .map(|token| token.chain)
                    .collect::<Vec<_>>()
            })
            .unwrap_or_default()
            .into_iter()
            .sorted_unstable_by_key(|c| c.display_name)
            .dedup_by(|c1, c2| c1.display_name == c2.display_name)
            .map(|chain_info| {
                let display_name = chain_info.display_name.to_string();
                SelectOption::new(display_name.clone(), move || {
                    view! { {display_name.clone()} }.into_any()
                })
            })
            .collect::<Vec<_>>()
    });

    let is_amount_valid = move || {
        let amt = amount.get();
        !amt.trim().is_empty() && BigDecimal::from_str(&amt).is_ok()
    };

    let has_all_inputs = move || {
        is_amount_valid()
            && selected_network.get().is_some()
            && !recipient_address.get().trim().is_empty()
    };

    let dry_quote = LocalResource::new(move || {
        let current_amount = amount.get();
        let current_network = selected_network.get();
        let current_mode = bridge_mode.get();
        let current_recipient_address = recipient_address.get();
        let current_metadata = token_meta.get();
        let current_token_id = token_id();
        let selected_account_id = accounts_context.accounts.get().selected_account_id.unwrap();

        async move {
            if current_amount.trim().is_empty() {
                return Err("Empty amount".to_string());
            }

            let Some(metadata) = current_metadata else {
                return Err("Token metadata not available".to_string());
            };

            let Some(network) = current_network else {
                return Err("Network not selected".to_string());
            };

            if current_recipient_address.trim().is_empty() {
                return Err("Recipient address not provided".to_string());
            }

            let parsed_amount = match BigDecimal::from_str(&current_amount) {
                Ok(amt) => amt,
                Err(_) => return Err("Invalid amount".to_string()),
            };

            let Some((_, bridgeable_tokens)) = BRIDGEABLE_TOKENS
                .iter()
                .find(|(id, _)| *id == current_token_id)
            else {
                return Err("Token not found in bridge tokens".to_string());
            };

            let Some(bridgeable_token) = bridgeable_tokens
                .tokens
                .iter()
                .find(|t| t.chain.display_name == network.display_name)
            else {
                return Err("Network not supported for this token".to_string());
            };

            let decimals = match current_mode {
                BridgeMode::Send => metadata.decimals,
                BridgeMode::Receive => bridgeable_token.decimals,
            };
            let amount = decimal_to_balance(parsed_amount, decimals);

            let destination_asset = bridgeable_token.standard.to_string();
            let origin_asset = format!("nep141:{}", current_token_id);

            let now = Utc::now();
            let deadline = now + Duration::from_secs(60 * 60 * 24);

            let request = QuoteRequest {
                dry: true,
                deposit_mode: DepositMode::Simple,
                swap_type: match current_mode {
                    BridgeMode::Send => SwapType::ExactInput,
                    BridgeMode::Receive => SwapType::ExactOutput,
                },
                slippage_tolerance: match token_id() {
                    stable if stable == USDC_ON_NEAR || stable == USDT_ON_NEAR => 0,
                    _ => 100,
                },
                origin_asset,
                deposit_type: DepositType::OriginChain,
                destination_asset,
                amount,
                refund_to: selected_account_id.to_string(),
                refund_type: RefundType::OriginChain,
                recipient: current_recipient_address,
                recipient_type: RecipientType::DestinationChain,
                deadline,
                app_fees: vec![],
                virtual_chain_recipient: None,
                virtual_chain_refund_recipient: None,
                referral: "wallet.intear.near".parse().unwrap(),
                quote_waiting_time_ms: 0,
            };

            match reqwest::Client::new()
                .post("https://1click.chaindefuser.com/v0/quote")
                .bearer_auth("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjUtMDQtMjMtdjEifQ.eyJ2IjoxLCJrZXlfdHlwZSI6ImRpc3RyaWJ1dGlvbl9jaGFubmVsIiwicGFydG5lcl9pZCI6InNsaW1lIiwiaWF0IjoxNzQ5NTU3MDk4LCJleHAiOjE3ODEwOTMwOTh9.Dd6TweB3c1nDHILMfApFfcvVd4XDXu015hR6122j6fLRMzZvPXJNb1JkPkXXy9RN9ToIWITaDMSCBRsQv2it-lgP0lxCO7AFWxcNrZ8f9GkhTXfXBaeaeYDh_7YVRADMwIaw6_Ayt3NTeYI8poab3TdV2ubWT2_0MVQRYfHJqSGrBdBs_iqT0t9Henjn36UQjg6SU0sFA0N31fKKcFp2MbuwioUnyywvYOA4zVrTfAVmyPFS7_DowPYTC_ZkTKZBy0bLB_GYf6NoV3i_lCkT4_8JOkhQXKCfk2TRw_DIWZRl7x4jVG3q-l1fodXDLUgZZC7_1o6Z3No6amjYamQO6A")
                .json(&request)
                .send()
                .await
            {
                Ok(response) => {
                    let response_text = response.text().await
                        .map_err(|e| format!("Failed to read response: {e}"))?;

                    match serde_json::from_str::<QuoteResponse>(&response_text) {
                        Ok(quote_response) => Ok(quote_response.quote),
                        Err(e) => {
                            if let Ok(error_json) = serde_json::from_str::<serde_json::Value>(&response_text)
                                && let Some(message) = error_json.get("message").and_then(|m| m.as_str()) {
                                    if message == "recipient is not valid" {
                                        return Err("Invalid recipient address".to_string());
                                    }
                                    if message == "Failed to get quote" {
                                        return Err(format!("{} on {} is temporarily out of liquidity", metadata.symbol, network.display_name));
                                    }
                                    if let Some(min_amount_str) = message.strip_prefix("Amount is too low for bridge, try at least ")
                                        && let Ok(min_amount_raw) = min_amount_str.parse::<u128>() {
                                            let min_amount_decimal = balance_to_decimal(min_amount_raw, metadata.decimals);
                                            let mut min_amount_formatted = min_amount_decimal.to_string();
                                            if min_amount_formatted.contains('.') {
                                                min_amount_formatted = min_amount_formatted
                                                    .trim_end_matches('0')
                                                    .trim_end_matches('.')
                                                    .to_string();
                                            }
                                            return Err(format!("Amount is too low for bridge, try at least {} {}", min_amount_formatted, metadata.symbol));
                                        }
                                }
                            let error_msg = format!("{e}");
                            if error_msg.contains("error decoding response body") {
                                Err("".to_string())
                            } else {
                                log::error!("Failed to parse quote: {error_msg}");
                                Err(format!("Token temporarily not available to bridge"))
                            }
                        }
                    }
                },
                Err(e) => Err(format!("Failed to get quote: {e}")),
            }
        }
    });

    let can_send = move || {
        if !has_all_inputs() {
            return false;
        }

        let Some(Ok(quote)) = dry_quote.get() else {
            return false;
        };

        let Some(balance) = token_balance.get() else {
            return false;
        };

        balance >= quote.amount_in
    };

    let handle_send = move |_| {
        if !can_send() {
            return;
        }

        if dry_quote.get().is_none_or(|q| q.is_err()) {
            return;
        };

        let current_network = selected_network.get().unwrap();
        let current_recipient_address = recipient_address.get();
        let current_token_id = token_id();
        let current_mode = bridge_mode.get();
        let current_metadata = token_meta.get().unwrap();

        set_is_sending.set(true);

        leptos::task::spawn_local(async move {
            let Some((_, bridgeable_tokens)) = BRIDGEABLE_TOKENS
                .iter()
                .find(|(id, _)| *id == current_token_id)
            else {
                log::error!("Token not found in bridge tokens");
                set_is_sending.set(false);
                return;
            };

            let Some(bridgeable_token) = bridgeable_tokens
                .tokens
                .iter()
                .find(|t| t.chain.display_name == current_network.display_name)
            else {
                log::error!("Network not supported for this token");
                set_is_sending.set(false);
                return;
            };

            let destination_asset = bridgeable_token.standard.to_string();
            let origin_asset = format!("nep141:{}", current_token_id);

            let parsed_amount = match BigDecimal::from_str(&amount.get_untracked()) {
                Ok(amt) => amt,
                Err(_) => {
                    log::error!("Invalid amount");
                    set_is_sending.set(false);
                    return;
                }
            };

            let Some((_, bridgeable_tokens)) = BRIDGEABLE_TOKENS
                .iter()
                .find(|(id, _)| *id == current_token_id)
            else {
                log::error!("Token not found in bridge tokens");
                set_is_sending.set(false);
                return;
            };

            let Some(bridgeable_token) = bridgeable_tokens
                .tokens
                .iter()
                .find(|t| t.chain.display_name == current_network.display_name)
            else {
                log::error!("Network not supported for this token");
                set_is_sending.set(false);
                return;
            };

            let decimals = match current_mode {
                BridgeMode::Send => current_metadata.decimals,
                BridgeMode::Receive => bridgeable_token.decimals,
            };
            let amount = decimal_to_balance(parsed_amount, decimals);

            let now = Utc::now();
            let deadline = now + Duration::from_secs(60 * 60 * 24);

            let request = QuoteRequest {
                dry: false,
                deposit_mode: DepositMode::Simple,
                swap_type: match current_mode {
                    BridgeMode::Send => SwapType::ExactInput,
                    BridgeMode::Receive => SwapType::ExactOutput,
                },
                slippage_tolerance: match token_id() {
                    stable if stable == USDC_ON_NEAR || stable == USDT_ON_NEAR => 0,
                    _ => 100,
                },
                origin_asset,
                deposit_type: DepositType::OriginChain,
                destination_asset,
                amount,
                refund_to: accounts_context
                    .accounts
                    .get_untracked()
                    .selected_account_id
                    .unwrap()
                    .to_string(),
                refund_type: RefundType::OriginChain,
                recipient: current_recipient_address.clone(),
                recipient_type: RecipientType::DestinationChain,
                deadline,
                app_fees: vec![],
                virtual_chain_recipient: None,
                virtual_chain_refund_recipient: None,
                referral: "wallet.intear.near".parse().unwrap(),
                quote_waiting_time_ms: 2500,
            };

            let quote_response_result = reqwest::Client::new()
                .post("https://1click.chaindefuser.com/v0/quote")
                .bearer_auth("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjUtMDQtMjMtdjEifQ.eyJ2IjoxLCJrZXlfdHlwZSI6ImRpc3RyaWJ1dGlvbl9jaGFubmVsIiwicGFydG5lcl9pZCI6InNsaW1lIiwiaWF0IjoxNzQ5NTU3MDk4LCJleHAiOjE3ODEwOTMwOTh9.Dd6TweB3c1nDHILMfApFfcvVd4XDXu015hR6122j6fLRMzZvPXJNb1JkPkXXy9RN9ToIWITaDMSCBRsQv2it-lgP0lxCO7AFWxcNrZ8f9GkhTXfXBaeaeYDh_7YVRADMwIaw6_Ayt3NTeYI8poab3TdV2ubWT2_0MVQRYfHJqSGrBdBs_iqT0t9Henjn36UQjg6SU0sFA0N31fKKcFp2MbuwioUnyywvYOA4zVrTfAVmyPFS7_DowPYTC_ZkTKZBy0bLB_GYf6NoV3i_lCkT4_8JOkhQXKCfk2TRw_DIWZRl7x4jVG3q-l1fodXDLUgZZC7_1o6Z3No6amjYamQO6A")
                .json(&request)
                .send()
                .await;

            match quote_response_result {
                Ok(response) => match response.json::<QuoteResponse>().await {
                    Ok(quote_response) => {
                        let quote = quote_response.quote;
                        let Some(deposit_address) = quote.deposit_address.clone() else {
                            log::error!("No deposit address in quote response");
                            set_is_sending.set(false);
                            return;
                        };

                        let signer_id = accounts_context
                            .accounts
                            .get_untracked()
                            .selected_account_id
                            .unwrap();
                        let receiver_id: AccountId = current_token_id.parse().unwrap();

                        let storage_balance_result = rpc_client
                            .get_untracked()
                            .call::<Option<StorageBalance>>(
                                receiver_id.clone(),
                                "storage_balance_of",
                                serde_json::json!({
                                    "account_id": deposit_address,
                                }),
                                QueryFinality::Finality(Finality::DoomSlug),
                            )
                            .await;

                        let needs_storage_deposit = match storage_balance_result {
                            Ok(storage_balance) => match storage_balance {
                                Some(storage_balance) => storage_balance.total.is_zero(),
                                None => true,
                            },
                            Err(_) => false, // If we can't check, assume no deposit needed
                        };

                        let mut actions = Vec::new();

                        if needs_storage_deposit {
                            actions.push(Action::FunctionCall(Box::new(FunctionCallAction {
                                method_name: "storage_deposit".to_string(),
                                args: serde_json::to_vec(&serde_json::json!({
                                    "account_id": deposit_address,
                                    "registration_only": true,
                                }))
                                .unwrap(),
                                gas: NearGas::from_tgas(5).as_gas(),
                                deposit: "0.00125 NEAR".parse().unwrap(),
                            })));
                        }

                        actions.push(Action::FunctionCall(Box::new(FunctionCallAction {
                            method_name: "ft_transfer".to_string(),
                            args: serde_json::to_vec(&serde_json::json!({
                                "receiver_id": deposit_address,
                                "amount": quote.amount_in.to_string(),
                            }))
                            .unwrap(),
                            gas: NearGas::from_tgas(10).as_gas(),
                            deposit: NearToken::from_yoctonear(1),
                        })));

                        let description = format!(
                            "Bridge {} to {} on {}",
                            format_token_amount_full_precision(
                                amount,
                                current_metadata.decimals,
                                &current_metadata.symbol
                            ),
                            current_recipient_address,
                            current_network.display_name,
                        );

                        let (rx, pending_tx) = EnqueuedTransaction::create(
                            description,
                            signer_id,
                            receiver_id,
                            actions,
                        );

                        add_transaction.update(|txs| {
                            txs.push(pending_tx);
                        });

                        match rx.await {
                            Ok(Ok(tx)) => {
                                if let Some(outcome) = tx.final_execution_outcome
                                    && matches!(
                                        outcome.final_outcome.status,
                                        near_min_api::types::FinalExecutionStatus::Failure(_)
                                    )
                                {
                                    log::error!("Transaction failed");
                                    set_is_sending.set(false);
                                    return;
                                }

                                let history_entry = AddBridgeHistoryEntry {
                                    deposit_address: DepositAddress::Simple(
                                        deposit_address.clone(),
                                    ),
                                    created_at: Utc::now(),
                                    is_send: true,
                                };

                                leptos::task::spawn_local(async move {
                                    if let Err(e) = add_to_bridge_history(history_entry).await {
                                        log::error!("Failed to add bridge history entry: {e}");
                                    }
                                });

                                set_quote_for_polling.set(Some(quote));
                                set_is_sending.set(false);
                            }
                            Ok(Err(e)) => {
                                log::error!("Transaction error: {:?}", e);
                                set_is_sending.set(false);
                            }
                            Err(_) => {
                                log::error!("Failed to receive transaction result");
                                set_is_sending.set(false);
                            }
                        }
                    }
                    Err(e) => {
                        log::error!("Failed to parse quote response: {e}");
                        set_is_sending.set(false);
                    }
                },
                Err(e) => {
                    log::error!("Failed to send bridge request: {e}");
                    set_is_sending.set(false);
                }
            }
        });
    };

    view! {
        <div class="flex flex-col gap-4 p-3 md:p-4">
            <div class="flex items-center justify-between mb-2">
                <A
                    href=move || format!("/send/{}", token_id())
                    attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                    <span>"Back"</span>
                </A>
            </div>

            <div class="flex gap-2 w-full max-w-md mx-auto">
                <button
                    class=move || {
                        format!(
                            "flex-1 py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base {}",
                            match active_tab.get() {
                                Tab::Bridge => "bg-blue-600 text-white",
                                _ => "bg-neutral-800 text-gray-400 hover:bg-neutral-700",
                            },
                        )
                    }

                    on:click=move |_| set_active_tab(Tab::Bridge)
                >
                    "Send"
                </button>
                <button
                    class=move || {
                        format!(
                            "flex-1 py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base {}",
                            match active_tab.get() {
                                Tab::History => "bg-blue-600 text-white",
                                _ => "bg-neutral-800 text-gray-400 hover:bg-neutral-700",
                            },
                        )
                    }

                    on:click=move |_| set_active_tab(Tab::History)
                >
                    "History"
                </button>
            </div>

            {move || match active_tab.get() {
                Tab::Bridge => {
                    view! {
                        <div>
                            {move || match terminal_screen.get() {
                                Some(data) => {
                                    view! {
                                        <BridgeTerminationScreen
                                            deposit_address=data.deposit_address.clone()
                                            is_send=true
                                        />
                                    }
                                        .into_any()
                                }
                                None => {
                                    if quote_for_polling.get().is_some() {
                                        let current_quote = quote_for_polling.get().unwrap();
                                        let current_recipient = recipient_address.get();
                                        let current_metadata = token_meta.get().unwrap();
                                        let deposit_address_for_explorer = current_quote
                                            .deposit_address
                                            .clone();
                                        let deposit_address_for_support = current_quote
                                            .deposit_address
                                            .clone();

                                        view! {
                                            <div class="flex flex-col items-center gap-6 py-8">
                                                <div class="w-16 h-16 rounded-full bg-blue-400/20 flex items-center justify-center">
                                                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
                                                </div>
                                                <h2 class="text-2xl font-bold text-white">
                                                    "Bridging in Progress"
                                                </h2>
                                                <div class="bg-neutral-800 rounded-lg p-6 max-w-md w-full">
                                                    <div class="text-center">
                                                        <p class="text-gray-400 text-sm mb-2">"Sending"</p>
                                                        <p class="text-xl font-bold text-white">
                                                            {current_quote
                                                                .amount_in_formatted
                                                                .trim_end_matches('0')
                                                                .trim_end_matches('.')} " "
                                                            {current_metadata.symbol.clone()}
                                                        </p>
                                                        <p class="text-gray-400 text-sm mt-4 mb-2">
                                                            "To recipient"
                                                        </p>
                                                        <p class="text-white break-all">{current_recipient}</p>
                                                    </div>
                                                </div>
                                                <p class="text-gray-400 text-center max-w-md text-sm">
                                                    "Your transaction has been sent. Waiting for the bridge to complete..."
                                                </p>
                                                <div class="w-full">
                                                    <a
                                                        href=move || {
                                                            deposit_address_for_explorer
                                                                .as_ref()
                                                                .map(|addr| {
                                                                    build_explorer_url(&DepositAddress::Simple(addr.clone()))
                                                                })
                                                                .unwrap_or_default()
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="text-blue-400 hover:text-blue-300 transition-colors text-sm break-all block text-center"
                                                    >
                                                        "View on Intents Explorer"
                                                    </a>
                                                </div>
                                                <button
                                                    class="w-full max-w-md bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer text-base"
                                                    on:click=move |_| {
                                                        open_live_chat(
                                                            accounts_context
                                                                .accounts
                                                                .get()
                                                                .selected_account_id
                                                                .unwrap(),
                                                            deposit_address_for_support
                                                                .as_ref()
                                                                .map(|addr| DepositAddress::Simple(addr.clone())),
                                                        )
                                                    }
                                                >
                                                    "Contact Support"
                                                </button>
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        view! {
                                            {move || {
                                                if let Some(metadata) = token_meta() {
                                                    view! {
                                                        <div class="flex flex-col gap-4">
                                                            <div class="bg-neutral-900 rounded-xl p-4">
                                                                <div class="flex items-center gap-3">
                                                                    {match metadata.icon.clone() {
                                                                        Some(icon) => {
                                                                            view! { <img src=icon class="w-12 h-12 rounded-full" /> }
                                                                                .into_any()
                                                                        }
                                                                        None => {
                                                                            view! {
                                                                                <div class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
                                                                                    {metadata.symbol.chars().next().unwrap_or('?')}
                                                                                </div>
                                                                            }
                                                                                .into_any()
                                                                        }
                                                                    }} <div>
                                                                        <h2 class="text-white text-xl font-bold">
                                                                            {metadata.name.clone()}
                                                                        </h2>
                                                                        <p class="text-gray-400">
                                                                            {format!(
                                                                                "Bridge {} and send to another network",
                                                                                metadata.symbol,
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="flex flex-col gap-4">
                                                                <div class="flex flex-col gap-2">
                                                                    <label class="text-gray-400">"Destination Network"</label>
                                                                    <div class="bg-neutral-800 rounded-lg p-4">
                                                                        <Select
                                                                            options=network_options
                                                                            placeholder="Choose a network...".to_string()
                                                                            class="bg-neutral-700 text-white rounded-lg"
                                                                            filter_enabled=true
                                                                            on_change=Callback::new(move |value: String| {
                                                                                let previously_selected_network = selected_network
                                                                                    .get_untracked();
                                                                                if previously_selected_network
                                                                                    .is_some_and(|n| n.display_name == value)
                                                                                {
                                                                                    return;
                                                                                }
                                                                                let current_token_id = token_id();
                                                                                if let Some((_, bridgeable_tokens)) = BRIDGEABLE_TOKENS
                                                                                    .iter()
                                                                                    .find(|(bridgeable_token_id, _)| {
                                                                                        *bridgeable_token_id == current_token_id
                                                                                    })
                                                                                    && let Some(chain_info) = bridgeable_tokens
                                                                                        .tokens
                                                                                        .iter()
                                                                                        .map(|token| token.chain)
                                                                                        .find(|ci| ci.display_name == value)
                                                                                {
                                                                                    set_selected_network(Some(chain_info));
                                                                                }
                                                                            })
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <Show when=move || selected_network.get().is_some()>
                                                                    <div class="flex flex-col gap-2">
                                                                        <label class="text-gray-400">
                                                                            "Recipient Address on "
                                                                            {selected_network().unwrap().display_name}" Network"
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            class="w-full focus:ring-2 bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                                                            placeholder=move || {
                                                                                format!(
                                                                                    "example: {}",
                                                                                    selected_network().unwrap().example_address,
                                                                                )
                                                                            }
                                                                            prop:value=recipient_address
                                                                            on:input=move |ev| {
                                                                                set_recipient_address.set(event_target_value(&ev));
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div class="flex flex-col gap-2">
                                                                        <label class="text-gray-400">"Amount"</label>
                                                                        <div class="relative">
                                                                            <input
                                                                                type="text"
                                                                                class="w-full focus:ring-2 bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                                                                placeholder="0.00"
                                                                                prop:value=amount
                                                                                on:input=move |ev| {
                                                                                    set_amount.set(event_target_value(&ev));
                                                                                }
                                                                            />
                                                                            <button
                                                                                class="absolute right-3 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-200 no-mobile-ripple"
                                                                                on:click=move |_| {
                                                                                    if let Some(token_data) = token_data() {
                                                                                        let max_amount_decimal = balance_to_decimal(
                                                                                            token_data.balance,
                                                                                            token_data.token.metadata.decimals,
                                                                                        );
                                                                                        let gas_cost_decimal = if token_data.token.account_id
                                                                                            == Token::Near
                                                                                        {
                                                                                            BigDecimal::from_f64(0.0001).unwrap_or_default()
                                                                                        } else {
                                                                                            BigDecimal::from(0)
                                                                                        };
                                                                                        let final_amount_decimal = (&max_amount_decimal
                                                                                            - &gas_cost_decimal)
                                                                                            .max(BigDecimal::from(0));
                                                                                        let mut max_amount_str = final_amount_decimal.to_string();
                                                                                        if max_amount_str.contains('.') {
                                                                                            max_amount_str = max_amount_str
                                                                                                .trim_end_matches('0')
                                                                                                .trim_end_matches('.')
                                                                                                .to_string();
                                                                                        }
                                                                                        set_amount.set(max_amount_str);
                                                                                    }
                                                                                }
                                                                            >
                                                                                MAX
                                                                            </button>
                                                                        </div>
                                                                        <div class="mt-1 text-sm text-gray-400">
                                                                            {move || {
                                                                                let metadata = token_meta().unwrap();
                                                                                if let Some(balance) = token_balance.get() {
                                                                                    format!(
                                                                                        "Available: {}",
                                                                                        format_token_amount(
                                                                                            balance,
                                                                                            metadata.decimals,
                                                                                            &metadata.symbol,
                                                                                        ),
                                                                                    )
                                                                                } else {
                                                                                    String::new()
                                                                                }
                                                                            }}
                                                                        </div>
                                                                    </div>

                                                                    <div class="flex flex-col gap-2">
                                                                        <label class="text-gray-400">"Mode"</label>
                                                                        <div class="flex gap-2">
                                                                            <button
                                                                                class=move || {
                                                                                    format!(
                                                                                        "flex-1 py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base {}",
                                                                                        if bridge_mode.get() == BridgeMode::Send {
                                                                                            "bg-blue-600 text-white"
                                                                                        } else {
                                                                                            "bg-neutral-700 text-gray-400 hover:bg-neutral-600"
                                                                                        },
                                                                                    )
                                                                                }

                                                                                on:click=move |_| set_bridge_mode(BridgeMode::Send)
                                                                            >
                                                                                "Send Exactly"
                                                                            </button>
                                                                            <button
                                                                                class=move || {
                                                                                    format!(
                                                                                        "flex-1 py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer text-base {}",
                                                                                        if bridge_mode.get() == BridgeMode::Receive {
                                                                                            "bg-blue-600 text-white"
                                                                                        } else {
                                                                                            "bg-neutral-700 text-gray-400 hover:bg-neutral-600"
                                                                                        },
                                                                                    )
                                                                                }

                                                                                on:click=move |_| set_bridge_mode(BridgeMode::Receive)
                                                                            >
                                                                                "Receive Exactly"
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    <Show when=has_all_inputs>
                                                                        <div class="bg-neutral-800 rounded-lg p-4">
                                                                            <Suspense fallback=move || {
                                                                                view! {
                                                                                    <div class="text-center text-gray-400">
                                                                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                                                                        <p class="text-sm">"Getting a quote..."</p>
                                                                                    </div>
                                                                                }
                                                                            }>
                                                                                {move || {
                                                                                    let symbol = token_meta().unwrap().symbol;
                                                                                    match dry_quote.get() {
                                                                                        Some(Ok(quote)) => {
                                                                                            let mode = bridge_mode.get();
                                                                                            let recipient = recipient_address.get();
                                                                                            let text = match mode {
                                                                                                BridgeMode::Send => {
                                                                                                    format!(
                                                                                                        "You send exactly {} {} and {} will receive ≈{} {}",
                                                                                                        quote
                                                                                                            .amount_in_formatted
                                                                                                            .trim_end_matches('0')
                                                                                                            .trim_end_matches('.'),
                                                                                                        symbol,
                                                                                                        recipient,
                                                                                                        quote
                                                                                                            .amount_out_formatted
                                                                                                            .trim_end_matches('0')
                                                                                                            .trim_end_matches('.'),
                                                                                                        symbol,
                                                                                                    )
                                                                                                }
                                                                                                BridgeMode::Receive => {
                                                                                                    format!(
                                                                                                        "You send ≈{} {} and {} will receive exactly {} {}",
                                                                                                        quote
                                                                                                            .amount_in_formatted
                                                                                                            .trim_end_matches('0')
                                                                                                            .trim_end_matches('.'),
                                                                                                        symbol.clone(),
                                                                                                        recipient,
                                                                                                        quote
                                                                                                            .amount_out_formatted
                                                                                                            .trim_end_matches('0')
                                                                                                            .trim_end_matches('.'),
                                                                                                        symbol,
                                                                                                    )
                                                                                                }
                                                                                            };
                                                                                            view! { <p class="text-sm text-gray-300">{text}</p> }
                                                                                                .into_any()
                                                                                        }
                                                                                        Some(Err(e)) => {
                                                                                            if !e.is_empty() {
                                                                                                view! {
                                                                                                    <div class="bg-red-900/20 border border-red-500 text-red-400 rounded-lg p-3 text-sm">
                                                                                                        {e}
                                                                                                    </div>
                                                                                                }
                                                                                                    .into_any()
                                                                                            } else {
                                                                                                ().into_any()
                                                                                            }
                                                                                        }
                                                                                        None => ().into_any(),
                                                                                    }
                                                                                }}
                                                                            </Suspense>
                                                                        </div>
                                                                    </Show>

                                                                    <div class="text-[10px] text-gray-400 text-center px-2 leading-2.5">
                                                                        "Bridge service is provided by Near Intents, HOT Bridge, and Omnibridge. While they have good reputation in the ecosystem and uptime, these bridges are not affiliated with Intear, so we can provide limited customer support. "
                                                                        <a
                                                                            href="https://docs.near-intents.org/near-intents/integration/distribution-channels/1click-terms-of-service"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            class="text-blue-400 hover:text-blue-300 underline"
                                                                        >
                                                                            "Terms of Service"
                                                                        </a>
                                                                    </div>

                                                                    <button
                                                                        class=move || {
                                                                            format!(
                                                                                "w-full rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg {}",
                                                                                if can_send() && !is_sending.get() {
                                                                                    "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer"
                                                                                } else if is_sending.get() {
                                                                                    "bg-neutral-700 text-gray-400 cursor-wait"
                                                                                } else {
                                                                                    "bg-neutral-700 text-gray-500 cursor-not-allowed"
                                                                                },
                                                                            )
                                                                        }

                                                                        disabled=move || !can_send() || is_sending.get()
                                                                        on:click=handle_send
                                                                    >
                                                                        <div class="flex items-center justify-center gap-2">
                                                                            <Icon icon=icondata::LuSend width="20" height="20" />
                                                                            <span>
                                                                                {move || {
                                                                                    if is_sending.get() { "Sending..." } else { "Send" }
                                                                                }}
                                                                            </span>
                                                                        </div>
                                                                    </button>
                                                                </Show>
                                                            </div>
                                                        </div>
                                                    }
                                                        .into_any()
                                                } else if !tokens.get().is_empty() {
                                                    view! {
                                                        <div class="flex flex-col items-center justify-center h-32 gap-4">
                                                            <div class="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                                                <div class="flex items-center gap-2 text-red-400">
                                                                    <Icon
                                                                        icon=icondata::LuTriangleAlert
                                                                        width="20"
                                                                        height="20"
                                                                    />
                                                                    <p class="text-white font-medium">"Token not found"</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                        .into_any()
                                                } else {
                                                    ().into_any()
                                                }
                                            }}
                                        }
                                            .into_any()
                                    }
                                }
                            }}
                        </div>
                    }
                        .into_any()
                }
                Tab::History => view! { <HistoryTab /> }.into_any(),
            }}
        </div>
    }
}
