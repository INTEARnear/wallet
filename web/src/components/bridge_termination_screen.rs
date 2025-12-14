use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use serde_json::json;
use std::collections::HashMap;

use crate::components::bridge_history::{
    BridgeToken, DepositAddress, DepositStatus, StatusResponse, SupportedTokensResponse,
    fetch_deposit_status,
};
use crate::contexts::accounts_context::AccountsContext;
use crate::pages::settings::open_live_chat;

async fn fetch_supported_tokens() -> Result<HashMap<String, BridgeToken>, String> {
    let request_body = json!({
        "id": 1,
        "jsonrpc": "2.0",
        "method": "supported_tokens",
        "params": [{"chains": []}]
    });

    let response = reqwest::Client::new()
        .post("https://bridge.chaindefuser.com/rpc")
        .header("content-type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch supported tokens: {e}"))?;

    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {e}"))?;

    let tokens_response: SupportedTokensResponse = serde_json::from_value(
        json.get("result")
            .ok_or("No result field in response")?
            .clone(),
    )
    .map_err(|e| format!("Failed to deserialize tokens: {e}"))?;

    let token_map: HashMap<String, BridgeToken> = tokens_response
        .tokens
        .into_iter()
        .map(|t| (t.intents_token_id.clone(), t))
        .collect();

    Ok(token_map)
}

#[component]
pub fn BridgeTerminationScreen(deposit_address: DepositAddress, is_send: bool) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let recipient = move || accounts_context.accounts.get().selected_account_id.unwrap();

    let status_data = LocalResource::new({
        let deposit_address = deposit_address.clone();
        move || {
            let deposit_address = deposit_address.clone();
            async move { fetch_deposit_status(&deposit_address).await }
        }
    });

    let supported_tokens = LocalResource::new(|| async move { fetch_supported_tokens().await });

    view! {
        <Suspense fallback=move || {
            view! {
                <div class="flex flex-col items-center gap-6 py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            }
        }>
            {move || {
                status_data
                    .get()
                    .map(|result| match result {
                        Ok(status_response) => {
                            match status_response.status {
                                DepositStatus::Success => {
                                    view! {
                                        <SuccessScreen
                                            status_response=status_response
                                            supported_tokens=supported_tokens
                                            is_send=is_send
                                        />
                                    }
                                        .into_any()
                                }
                                DepositStatus::Failed | DepositStatus::Refunded => {
                                    let recipient_id = recipient();
                                    let deposit_addr = deposit_address.clone();
                                    view! {
                                        <FailureScreen
                                            recipient_id=recipient_id
                                            deposit_address=deposit_addr
                                        />
                                    }
                                        .into_any()
                                }
                                _ => {
                                    view! {
                                        <div class="flex flex-col items-center gap-6 py-8">
                                            <p class="text-gray-400">"Unexpected status"</p>
                                        </div>
                                    }
                                        .into_any()
                                }
                            }
                        }
                        Err(e) => {
                            view! {
                                <div class="flex flex-col items-center gap-6 py-8">
                                    <div class="w-16 h-16 rounded-full bg-red-400/20 flex items-center justify-center">
                                        <Icon
                                            icon=icondata::LuX
                                            width="48"
                                            height="48"
                                            attr:class="text-red-400"
                                        />
                                    </div>
                                    <h2 class="text-2xl font-bold text-white">"Error"</h2>
                                    <p class="text-gray-400 text-center max-w-md">{e}</p>
                                </div>
                            }
                                .into_any()
                        }
                    })
                    .unwrap_or_else(|| {
                        view! {
                            <div class="flex flex-col items-center gap-6 py-8">
                                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        }
                            .into_any()
                    })
            }}

        </Suspense>
    }
}

#[component]
fn SuccessScreen(
    status_response: StatusResponse,
    supported_tokens: LocalResource<Result<HashMap<String, BridgeToken>, String>>,
    is_send: bool,
) -> impl IntoView {
    let amount_formatted = status_response
        .quote_response
        .quote
        .amount_out_formatted
        .trim_end_matches('0')
        .trim_end_matches('.')
        .to_string();
    let dest_asset = status_response
        .quote_response
        .quote_request
        .destination_asset
        .clone();

    let token_symbol = move || {
        let tokens = supported_tokens.get();
        let mut symbol = tokens
            .as_ref()
            .and_then(|r| r.as_ref().ok())
            .and_then(|t| t.get(&dest_asset).cloned())
            .map(|t| t.asset_name.clone())
            .unwrap_or_else(|| "tokens".to_string());

        if symbol == "wNEAR" {
            symbol = "NEAR".to_string();
        }

        symbol
    };

    let message_text = if is_send {
        "Your tokens have been successfully bridged."
    } else {
        "Your tokens have been successfully bridged to NEAR."
    };

    let label_text = if is_send {
        "The recipient received"
    } else {
        "You received"
    };

    view! {
        <div class="flex flex-col items-center gap-6 py-8">
            <div class="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center">
                <Icon icon=icondata::LuCheck width="48" height="48" attr:class="text-green-400" />
            </div>
            <h2 class="text-2xl font-bold text-white">"Bridge Complete!"</h2>
            <div class="bg-neutral-800 rounded-lg p-6 max-w-md w-full">
                <div class="text-center">
                    <p class="text-gray-400 text-sm mb-2">{label_text}</p>
                    <p class="text-3xl font-bold text-white break-all">
                        {amount_formatted.trim_end_matches('0').trim_end_matches('.')} " "
                        {token_symbol}
                    </p>
                </div>
            </div>
            <p class="text-gray-400 text-center max-w-md">{message_text}</p>
            <A
                href="/"
                attr:class="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer text-center text-base"
            >
                "Done"
            </A>
        </div>
    }
}

#[component]
fn FailureScreen(
    recipient_id: near_min_api::types::AccountId,
    deposit_address: DepositAddress,
) -> impl IntoView {
    view! {
        <div class="flex flex-col items-center gap-6 py-8">
            <div class="w-16 h-16 rounded-full bg-red-400/20 flex items-center justify-center">
                <Icon icon=icondata::LuX width="48" height="48" attr:class="text-red-400" />
            </div>
            <h2 class="text-2xl font-bold text-white">"Bridge Failed"</h2>
            <p class="text-gray-400 text-center max-w-md">
                "Your bridge transaction has failed. Please contact support for assistance."
            </p>
            <button
                class="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer text-base"
                on:click=move |_| {
                    open_live_chat(recipient_id.clone(), Some(deposit_address.clone()))
                }
            >
                "Contact Support"
            </button>
        </div>
    }
}
