use base64::{Engine, prelude::BASE64_STANDARD};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_params_map;
use near_min_api::{
    QueryFinality,
    types::{
        AccountId, Action as NearAction, Finality, FunctionCallAction, NearGas, NearToken,
        near_crypto::Signature,
    },
};
use serde::{Deserialize, Serialize};
use web_sys::js_sys::Date;

use crate::{
    components::{
        gift_amount_display::{GiftAmountDisplay, parse_gift_private_key_to_secret},
        gift_modals::{GiftToken, format_gift_tokens_for_message},
    },
    contexts::{
        accounts_context::{AccountsContext, SecretKeyHolder},
        config_context::ConfigContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    pages::gifts::{Drop, DropStatus},
    utils::{NEP413Payload, format_token_amount, sign_nep413},
};

const SLIMEDROP_CONTRACT_MAINNET: &str = "slimedrop.intear.near";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClaimResult {
    pub amount: NearToken,
    pub claimed_by: AccountId,
}

#[derive(Debug, Clone)]
enum ClaimState {
    Idle,
    Claiming,
    Success(ClaimResult),
    Error(String),
}

#[component]
pub fn GiftClaim() -> impl IntoView {
    let params = use_params_map();
    let NetworkContext { network } = expect_context::<NetworkContext>();
    let accounts = expect_context::<AccountsContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();

    let (claim_state, set_claim_state) = signal(ClaimState::Idle);

    let private_key_param = move || {
        params
            .get_untracked()
            .get("private_key")
            .map(|s| s.to_string())
    };

    let public_key = move || {
        private_key_param()
            .and_then(|private_key_b58| parse_gift_private_key_to_secret(&private_key_b58))
            .map(|secret_key| secret_key.public_key())
    };

    let is_already_claimed = LocalResource::new(move || async move {
        let Some(public_key) = public_key() else {
            return false;
        };

        let rpc_client = client.get();
        let request_result = rpc_client
            .call::<Drop>(
                SLIMEDROP_CONTRACT_MAINNET.parse().unwrap(),
                "get_key_info",
                serde_json::json!({
                    "key": public_key
                }),
                QueryFinality::Finality(Finality::None),
            )
            .await;

        match request_result {
            Ok(drop) => {
                matches!(drop.status, DropStatus::Active) && drop.claims.iter().next().is_some()
            }
            Err(_) => false,
        }
    });

    let handle_claim = move |_: leptos::ev::MouseEvent| {
        let Some(selected_account_id) = accounts.accounts.get().selected_account_id else {
            return;
        };

        let Some(private_key_b58) = private_key_param() else {
            set_claim_state.set(ClaimState::Error("Invalid private key".to_string()));
            return;
        };

        let Some(public_key) = public_key() else {
            set_claim_state.set(ClaimState::Error("Invalid private key format".to_string()));
            return;
        };

        set_claim_state.set(ClaimState::Claiming);

        let rpc_client = client.get();
        spawn_local(async move {
            let drop_result = rpc_client
                .call::<Drop>(
                    SLIMEDROP_CONTRACT_MAINNET.parse().unwrap(),
                    "get_key_info",
                    serde_json::json!({
                        "key": public_key
                    }),
                    QueryFinality::Finality(Finality::None),
                )
                .await;

            let drop = match drop_result {
                Ok(drop) => drop,
                Err(e) => {
                    log::error!("Failed to fetch gift info: {:?}", e);
                    set_claim_state.set(ClaimState::Error(
                        "Failed to fetch gift information".to_string(),
                    ));
                    return;
                }
            };

            if !drop.claims.is_empty() {
                set_claim_state.set(ClaimState::Error(
                    "Gift already claimed while you were on this page".to_string(),
                ));
                return;
            }

            let Some(secret_key) = parse_gift_private_key_to_secret(&private_key_b58) else {
                set_claim_state.set(ClaimState::Error("Invalid private key format".to_string()));
                return;
            };

            let message =
                format!("I want to claim this Slimedrop and send it to {selected_account_id}");

            let now_millis = Date::now() as u64;

            let signature = sign_nep413(
                SecretKeyHolder::SecretKey(secret_key),
                &NEP413Payload {
                    message,
                    nonce: [
                        vec![0; 32 - now_millis.to_be_bytes().len()],
                        now_millis.to_be_bytes().to_vec(),
                    ]
                    .concat()
                    .try_into()
                    .unwrap(),
                    recipient: SLIMEDROP_CONTRACT_MAINNET.to_string(),
                    callback_url: None,
                },
                accounts,
                move || config.get_untracked().ledger_mode,
            )
            .await
            .unwrap_or_else(|_| unreachable!());

            let signature_base64 = BASE64_STANDARD.encode(match signature {
                Signature::ED25519(signature) => signature.to_bytes(),
                _ => unreachable!(),
            });

            let action = NearAction::FunctionCall(Box::new(FunctionCallAction {
                method_name: "claim".to_string(),
                args: serde_json::to_vec(&serde_json::json!({
                    "account_id": selected_account_id,
                    "signature": signature_base64,
                    "public_key": public_key,
                    "nonce": now_millis.to_string()
                }))
                .unwrap(),
                gas: NearGas::from_tgas(300).into(),
                deposit: NearToken::from_yoctonear(0),
            }));

            let (details_rx, transaction) = EnqueuedTransaction::create(
                format!(
                    "Claim gift of {}",
                    format_gift_tokens_for_message(&GiftToken::from_drop(&drop), rpc_client).await
                ),
                selected_account_id.clone(),
                SLIMEDROP_CONTRACT_MAINNET.parse().unwrap(),
                vec![action],
                true,
            );

            add_transaction.update(|queue| queue.push(transaction));

            match details_rx.await {
                Ok(_) => {
                    let result = ClaimResult {
                        amount: drop.contents.near,
                        claimed_by: selected_account_id,
                    };
                    set_claim_state.set(ClaimState::Success(result));
                }
                Err(e) => {
                    log::error!("Claim failed: {:?}", e);
                    set_claim_state.set(ClaimState::Error("Transaction failed".to_string()));
                }
            }
        });
    };

    view! {
        <div class="flex flex-col gap-6 p-4 max-w-md mx-auto w-full">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-white mb-2">"Claim Your Gift"</h1>
                <p class="text-gray-400">"You've received a gift!"</p>
            </div>

            <GiftAmountDisplay />
            <Show
                when=move || network.get() == Network::Mainnet && private_key_param().is_some()
                fallback=move || ().into_any()
            >
                {move || {
                    match claim_state.get() {
                        ClaimState::Idle => {
                            view! {
                                <Show when=move || {
                                    accounts.accounts.get().selected_account_id.is_some()
                                }>
                                    {move || {
                                        if public_key().is_none() {
                                            return ().into_any();
                                        }
                                        match is_already_claimed.get() {
                                            Some(true) => {
                                                view! {
                                                    <A
                                                        attr:class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 cursor-pointer text-lg shadow-lg transform hover:scale-105 flex items-center justify-center gap-3"
                                                        href="/"
                                                    >
                                                        <Icon icon=icondata::LuWallet attr:class="w-5 h-5" />
                                                        "Go to Wallet"
                                                    </A>
                                                }
                                                    .into_any()
                                            }
                                            Some(false) => {
                                                view! {
                                                    <button
                                                        class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 cursor-pointer text-lg shadow-lg transform hover:scale-105"
                                                        on:click=handle_claim
                                                    >
                                                        <div class="flex items-center justify-center gap-3">
                                                            <Icon icon=icondata::LuGift attr:class="w-5 h-5" />
                                                            "Claim Gift"
                                                        </div>
                                                    </button>
                                                }
                                                    .into_any()
                                            }
                                            None => ().into_any(),
                                        }
                                    }}
                                </Show>
                            }
                                .into_any()
                        }
                        ClaimState::Claiming => {
                            view! {
                                <div class="bg-neutral-900/50 rounded-2xl p-8 text-center">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                                    <h3 class="text-white font-bold text-lg mb-2">
                                        "Claiming Gift..."
                                    </h3>
                                    <p class="text-gray-400 text-sm">
                                        "Please wait while we process your claim transaction."
                                    </p>
                                </div>
                            }
                                .into_any()
                        }
                        ClaimState::Success(result) => {
                            let amount_formatted = format_token_amount(
                                result.amount.as_yoctonear(),
                                24,
                                "NEAR",
                            );
                            view! {
                                <div class="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 text-center">
                                    <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon
                                            icon=icondata::LuCheck
                                            attr:class="w-10 h-10 text-white"
                                        />
                                    </div>
                                    <h3 class="text-white font-bold text-xl mb-2">
                                        "Gift Claimed Successfully!"
                                    </h3>
                                    <p class="text-gray-400 text-sm mb-4">
                                        "You've successfully claimed "
                                        <span class="text-green-400 font-semibold">
                                            {amount_formatted}
                                        </span>
                                    </p>
                                    <A
                                        attr:class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer text-base"
                                        href="/"
                                    >
                                        "Go to Wallet"
                                    </A>
                                </div>
                            }
                                .into_any()
                        }
                        ClaimState::Error(error_msg) => {
                            view! {
                                <div class="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 text-center">
                                    <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon
                                            icon=icondata::LuCircleX
                                            attr:class="w-8 h-8 text-red-500"
                                        />
                                    </div>
                                    <h3 class="text-white font-bold text-lg mb-2">
                                        "Claim Failed"
                                    </h3>
                                    <p class="text-gray-400 text-sm mb-4">{error_msg}</p>
                                    <button
                                        class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer text-base"
                                        on:click=move |_| {
                                            set_claim_state.set(ClaimState::Idle);
                                        }
                                    >
                                        "Try Again"
                                    </button>
                                </div>
                            }
                                .into_any()
                        }
                    }
                }}
            </Show>
        </div>
    }
}
