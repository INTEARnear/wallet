use bigdecimal::BigDecimal;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use near_min_api::types::{
    AccountId, Action, Balance, CryptoHash, FinalExecutionStatus, FunctionCallAction, NearGas,
    NearToken,
};
use serde::Deserialize;

use crate::{
    contexts::{
        accounts_context::AccountsContext,
        modal_context::ModalContext,
        tokens_context::{Token, TokensContext},
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::decimal_to_balance,
};

use super::super::developer_create_token::process_image;

const AIDOLS_DEPOSIT: NearToken = NearToken::from_millinear(1800);
const AIDOLS_SUPPLY: Balance = 1000000000;
const AIDOLS_DECIMALS: u32 = 24;
const MAX_IMAGE_SIZE_BYTES: usize = 5000;

#[component]
pub fn AidolsModal<F>(
    token_symbol: String,
    token_name: String,
    token_supply: BigDecimal,
    token_decimals: u32,
    token_image: String,
    original_image_data_url: Option<String>,
    on_confirm: F,
) -> impl IntoView
where
    F: Fn() + 'static,
{
    let modal_context = expect_context::<ModalContext>();
    let tokens_context = expect_context::<TokensContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let transaction_queue_context = expect_context::<TransactionQueueContext>();

    let (initial_buy, set_initial_buy) = signal(String::new());

    let near_balance = move || {
        tokens_context
            .tokens
            .get()
            .into_iter()
            .find(|t| t.token.account_id == Token::Near)
            .map(|t| t.balance)
            .map(NearToken::from_yoctonear)
            .unwrap_or_default()
    };

    let validate_initial_buy = move |buy_str: &str| -> Option<String> {
        let initial_buy_token = if buy_str.is_empty() {
            NearToken::from_yoctonear(0)
        } else {
            match buy_str.parse::<BigDecimal>() {
                Ok(amount) => {
                    if amount <= BigDecimal::from(0) {
                        return Some("Amount must be greater than 0".to_string());
                    }
                    let yoctonear = decimal_to_balance(amount, 24);
                    NearToken::from_yoctonear(yoctonear)
                }
                Err(_) => return Some("Invalid number".to_string()),
            }
        };

        let required_balance = initial_buy_token.checked_add(AIDOLS_DEPOSIT).unwrap();
        let current_balance = near_balance();

        if current_balance < required_balance {
            if initial_buy_token.as_yoctonear() > 0 {
                return Some(format!(
                    "Insufficient balance. Need {required_balance} (initial buy + {AIDOLS_DEPOSIT} for deposit)",
                ));
            } else {
                return Some(format!(
                    "Insufficient balance. Need at least {AIDOLS_DEPOSIT} for deposit"
                ));
            }
        }

        None
    };

    let token_image_clone_for_validation = token_image.clone();
    let is_valid = move || {
        validate_initial_buy(&initial_buy.get()).is_none()
            && token_image_clone_for_validation.len() <= MAX_IMAGE_SIZE_BYTES
    };

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let token_symbol_clone = token_symbol.clone();
    let token_name_clone = token_name.clone();
    let token_image_clone = token_image.clone();
    let original_image_clone = original_image_data_url.clone();

    let handle_confirm = move || {
        let token_symbol = token_symbol_clone.clone();
        let token_name = token_name_clone.clone();
        let token_image = token_image_clone.clone();
        let initial_buy_value = initial_buy.get();
        let original_image = original_image_clone.clone();
        let add_transaction = transaction_queue_context.add_transaction;
        let signer_id = accounts_context
            .accounts
            .get_untracked()
            .selected_account_id;

        on_confirm();
        close_modal();

        spawn_local(async move {
            let Some(signer_id) = signer_id else {
                log::error!("No account selected");
                return;
            };

            let image_source = if let Some(orig) = original_image {
                orig
            } else {
                token_image.clone()
            };

            match process_image(image_source.clone(), 80).await {
                Ok(image_80_data_url) => {
                    if let Some(base64_data) = image_80_data_url.split(',').nth(1) {
                        match base64::Engine::decode(
                            &base64::engine::general_purpose::STANDARD,
                            base64_data,
                        ) {
                            Ok(image_bytes) => {
                                match upload_to_ipfs("image/webp", image_bytes).await {
                                    Ok(image_cid) => {
                                        log::info!("Image uploaded to IPFS: {image_cid}");

                                        let metadata = serde_json::json!({
                                            "image": image_cid
                                        });
                                        let reference_json =
                                            serde_json::to_string(&metadata).unwrap();

                                        match upload_to_ipfs(
                                            "application/json",
                                            reference_json.as_bytes().to_vec(),
                                        )
                                        .await
                                        {
                                            Ok(reference_cid) => {
                                                log::info!(
                                                    "Metadata JSON uploaded to IPFS: {reference_cid}"
                                                );

                                                let initial_buy_token = if initial_buy_value
                                                    .is_empty()
                                                {
                                                    NearToken::from_yoctonear(0)
                                                } else {
                                                    match initial_buy_value.parse::<BigDecimal>() {
                                                        Ok(amount) => {
                                                            let yoctonear =
                                                                decimal_to_balance(amount, 24);
                                                            NearToken::from_yoctonear(yoctonear)
                                                        }
                                                        Err(_) => NearToken::from_yoctonear(0),
                                                    }
                                                };

                                                let total_deposit = AIDOLS_DEPOSIT
                                                    .checked_add(initial_buy_token)
                                                    .unwrap();

                                                let args = serde_json::json!({
                                                    "name": token_name,
                                                    "symbol": token_symbol,
                                                    "reference": format!("/ipfs/{reference_cid}"),
                                                    "icon": token_image,
                                                    "referral": "intear.near",
                                                    "agent_id": null,
                                                });

                                                let action = Action::FunctionCall(Box::new(
                                                    FunctionCallAction {
                                                        method_name: "launch_new_token".to_string(),
                                                        args: serde_json::to_vec(&args).unwrap(),
                                                        gas: NearGas::from_tgas(300).into(),
                                                        deposit: total_deposit,
                                                    },
                                                ));

                                                let aidols_account: AccountId =
                                                    "aidols.near".parse().unwrap();

                                                let (rx, transaction) = EnqueuedTransaction::create(
                                                    format!("Launch {token_symbol} on Aidols"),
                                                    signer_id.clone(),
                                                    aidols_account,
                                                    vec![action],
                                                );

                                                add_transaction.update(|txs| txs.push(transaction));

                                                match rx.await {
                                                    Ok(Ok(tx_details)) => {
                                                        if let Some(outcome) =
                                                            tx_details.final_execution_outcome
                                                        {
                                                            let tx_hash = outcome
                                                                .final_outcome
                                                                .transaction
                                                                .hash;
                                                            match outcome.final_outcome.status {
                                                                FinalExecutionStatus::SuccessValue(_) => {
                                                                    log::info!("Aidols launch successful: {tx_hash}");
                                                                    modal_context.modal.set(Some(Box::new(move || {
                                                                        view! { <AidolsSuccessModal token_symbol=token_symbol.clone() signer_id=signer_id.clone() /> }.into_any()
                                                                    })));
                                                                }
                                                                FinalExecutionStatus::Failure(_) => {
                                                                    log::error!("Aidols launch failed: {tx_hash}");
                                                                    modal_context.modal.set(Some(Box::new(move || {
                                                                        view! { <AidolsErrorModal tx_hash=tx_hash /> }.into_any()
                                                                    })));
                                                                }
                                                                _ => {
                                                                    log::error!("Unexpected transaction status");
                                                                }
                                                            }
                                                        }
                                                    }
                                                    Ok(Err(e)) => {
                                                        log::error!("Transaction failed: {e}");
                                                    }
                                                    Err(_) => {
                                                        log::error!("Transaction cancelled");
                                                    }
                                                }
                                            }
                                            Err(e) => {
                                                log::error!(
                                                    "Failed to upload metadata to IPFS: {e}"
                                                );
                                            }
                                        }
                                    }
                                    Err(e) => {
                                        log::error!("Failed to upload image to IPFS: {e}");
                                    }
                                }
                            }
                            Err(e) => {
                                log::error!("Failed to decode base64 image: {e}");
                            }
                        }
                    }
                }
                Err(e) => {
                    log::error!("Failed to process 80% image: {e}");
                }
            }
        });
    };

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            on:click=move |_| close_modal()
        >
            <div
                class="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full m-4"
                on:click=move |e| e.stop_propagation()
            >
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold">"Launch on Aidols"</h2>
                    <button
                        on:click=move |_| close_modal()
                        class="p-1 hover:bg-neutral-800 rounded cursor-pointer"
                    >
                        <Icon icon=icondata::LuX width="20" height="20" />
                    </button>
                </div>

                <div class="text-sm text-gray-400 mb-4">"Bonding curve launch"</div>

                <div class="flex flex-col gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                    <div class="text-sm text-gray-500">
                        "This will launch your token on Aidols using a bonding curve mechanism. Confirm to proceed."
                    </div>

                    // Initial Buy Field
                    <div>
                        <label class="block text-sm font-medium mb-1">
                            "Initial Buy (NEAR) " <span class="text-gray-500">"(optional)"</span>
                        </label>
                        <input
                            type="text"
                            prop:value=move || initial_buy.get()
                            on:input=move |ev| {
                                let value = event_target_value(&ev);
                                set_initial_buy.set(value);
                            }
                            class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                            placeholder="1.0"
                        />
                        <div class="text-xs text-gray-500 mt-1">
                            "If you want to be guaranteed to buy first, enter the amount here"
                        </div>
                        {move || {
                            if let Some(error_msg) = validate_initial_buy(&initial_buy.get()) {
                                view! { <div class="text-xs text-red-400 mt-1">{error_msg}</div> }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        }}
                    </div>

                    // Review Section
                    <div class="border-t border-neutral-700 pt-4 mt-2">
                        <div class="text-sm font-medium mb-3">"Token Details"</div>
                        <div class="bg-neutral-900 p-4 rounded border border-neutral-600 space-y-3">
                            <div class="flex items-center gap-3 pb-3 border-b border-neutral-700">
                                <img
                                    src=token_image.clone()
                                    alt="Token"
                                    class="w-12 h-12 rounded-lg border border-neutral-600"
                                />
                                <div>
                                    <div class="text-white font-semibold">
                                        {token_symbol.clone()}
                                    </div>
                                    <div class="text-neutral-400 text-sm">{token_name.clone()}</div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <div class="text-xs text-neutral-400">"Supply"</div>
                                    <div class="text-sm text-white">{AIDOLS_SUPPLY}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-neutral-400">"Decimals"</div>
                                    <div class="text-sm text-white">{AIDOLS_DECIMALS}</div>
                                </div>
                            </div>
                            {move || {
                                let supply_matches = token_supply
                                    == BigDecimal::from(AIDOLS_SUPPLY);
                                let decimals_match = token_decimals == AIDOLS_DECIMALS;
                                if !supply_matches || !decimals_match {
                                    view! {
                                        <div class="flex gap-2 p-2 bg-blue-900/30 border border-blue-700/50 rounded text-xs text-blue-300">
                                            <div class="flex-shrink-0 mt-0.5">
                                                <Icon icon=icondata::LuInfo width="16" height="16" />
                                            </div>
                                            <span>
                                                "Aidols doesn't support custom supply and decimals. Your token will use the values shown above."
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                            {move || {
                                if token_image.len() > MAX_IMAGE_SIZE_BYTES {
                                    view! {
                                        <div class="flex gap-2 p-2 bg-yellow-900/30 border border-yellow-700/50 rounded text-xs text-yellow-300">
                                            <div class="flex-shrink-0 mt-0.5">
                                                <Icon
                                                    icon=icondata::LuTriangleAlert
                                                    width="16"
                                                    height="16"
                                                />
                                            </div>
                                            <span>
                                                "The on-chain image is too large. Please decrease image quality. It will not affect the image displayed on Aidols."
                                            </span>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>
                    </div>

                    // Buttons
                    <div class="flex gap-2 mt-2">
                        <button
                            on:click=move |_| handle_confirm()
                            disabled=move || !is_valid()
                            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded cursor-pointer"
                        >
                            {format!("Confirm ({AIDOLS_DEPOSIT})")}
                        </button>
                        <button
                            on:click=move |_| close_modal()
                            class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                        >
                            "Cancel"
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
fn AidolsSuccessModal(token_symbol: String, signer_id: AccountId) -> impl IntoView {
    let modal_context = expect_context::<ModalContext>();

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let aidols_url = format!("https://aidols.bot/{}", signer_id);

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            on:click=move |_| close_modal()
        >
            <div
                class="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full m-4"
                on:click=move |e| e.stop_propagation()
            >
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center text-green-400">
                        <Icon icon=icondata::LuCheck width="32" height="32" />
                    </div>
                    <h2 class="text-xl font-semibold">"Token Launched Successfully!"</h2>
                    <p class="text-center text-gray-400">
                        "Your token " <span class="font-semibold text-white">{token_symbol}</span>
                        " has been launched on Aidols."
                    </p>
                    <a
                        href=aidols_url
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center cursor-pointer"
                    >
                        "View on Aidols.bot"
                    </a>
                    <button
                        on:click=move |_| close_modal()
                        class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
fn AidolsErrorModal(tx_hash: CryptoHash) -> impl IntoView {
    let modal_context = expect_context::<ModalContext>();

    let close_modal = move || {
        modal_context.modal.set(None);
    };

    let nearblocks_url = format!("https://nearblocks.io/txns/{tx_hash}");

    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            on:click=move |_| close_modal()
        >
            <div
                class="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full m-4"
                on:click=move |e| e.stop_propagation()
            >
                <div class="flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center text-red-400">
                        <Icon icon=icondata::LuX width="32" height="32" />
                    </div>
                    <h2 class="text-xl font-semibold">"Launch Failed"</h2>
                    <p class="text-center text-gray-400">
                        "There was an error launching your token on Aidols."
                    </p>
                    <a
                        href=nearblocks_url
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center cursor-pointer"
                    >
                        "View Transaction Details"
                    </a>
                    <button
                        on:click=move |_| close_modal()
                        class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded cursor-pointer"
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

async fn upload_to_ipfs(content_type: &'static str, data: Vec<u8>) -> Result<String, String> {
    let form = reqwest::multipart::Form::new().part(
        "file",
        reqwest::multipart::Part::bytes(data)
            .file_name("file")
            .mime_str(content_type)
            .map_err(|e| e.to_string())?,
    );

    let response = reqwest::Client::new()
        .post("https://api.pinata.cloud/pinning/pinFileToIPFS")
        .header(
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0OGNlZDIxOC0zZGQ4LTRlNzUtOTc5Mi0yNmIxZTU4Zjg1NTYiLCJlbWFpbCI6IjRzbGltYW40QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhYzg1MzI3Y2FkNTI3NTg5OTJkMCIsInNjb3BlZEtleVNlY3JldCI6IjE3YzFmYjEwYjBiYmNmNTgxZTAzMzUyYzQwYWEzMDNkOTQwZjE2ZWVkZTU4ZGQ0YWMwZWUwYzdhZGU5OThiZTYiLCJleHAiOjE3Njk4ODkxMDZ9.ivnoGkNl1XgYCokuoo-AhbNCT7VhHN4kZecuHTKKo2w"
        )
        .multipart(form)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    #[derive(Debug, Deserialize)]
    struct PinataResponse {
        #[serde(rename = "IpfsHash")]
        ipfs_hash: String,
    }

    let value = response
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(serde_json::from_value::<PinataResponse>(value)
        .map_err(|e| e.to_string())?
        .ipfs_hash)
}
