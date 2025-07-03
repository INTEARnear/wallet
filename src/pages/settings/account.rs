use std::{str::FromStr, time::Duration};

use crate::contexts::{
    accounts_context::{AccountsContext, SecretKeyHolder},
    network_context::{Network, NetworkContext},
    rpc_context::RpcContext,
    security_log_context::add_security_log,
    transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
};
use chrono::NaiveDate;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::hooks::use_navigate;
use leptos_use::{use_event_listener, use_window};
use near_min_api::{
    types::{
        Action, CryptoHash, Finality, FunctionCallAction, GlobalContractIdentifier, NearGas,
        NearToken, UseGlobalContractAction,
    },
    QueryFinality,
};
use serde::{Deserialize, Deserializer, Serialize};
use serde_wasm_bindgen;

/// Sorted from newest to oldest
const SMART_WALLET_VERSIONS: &[(CryptoHash, NaiveDate, &[&str])] = &[
    (
        CryptoHash(
            bs58::decode::<&[u8]>(b"5VSWnrNQZ2EVGeEAmxiJY64G2KPSd2AqTQf6EFSZreCK")
                .into_array_const_unwrap::<32>(),
        ),
        NaiveDate::from_ymd_opt(2025, 5, 31).unwrap(),
        &["Enable recovery in wallet interface"],
    ),
    (
        CryptoHash(
            bs58::decode::<&[u8]>(b"7jPVdfNmttfJm3FMvGsxxYgjjKAxR4Zot9XRv1YrWxYd")
                .into_array_const_unwrap::<32>(),
        ),
        NaiveDate::from_ymd_opt(2025, 5, 30).unwrap(),
        &["Reduce storage cost for recovery methods"],
    ),
    (
        CryptoHash(
            bs58::decode::<&[u8]>(b"Cznw3ewddP9KxNshCCAcNsVkBeJYAAvkT4qcpvva3Bh2")
                .into_array_const_unwrap::<32>(),
        ),
        NaiveDate::from_ymd_opt(2025, 5, 29).unwrap(),
        &["Initial release"],
    ),
];
const CURRENT_SMART_WALLET_VERSION: CryptoHash = SMART_WALLET_VERSIONS[0].0;

const RECOVERY_ADDED_VERSION: CryptoHash = CryptoHash(
    bs58::decode::<&[u8]>(b"Cznw3ewddP9KxNshCCAcNsVkBeJYAAvkT4qcpvva3Bh2")
        .into_array_const_unwrap::<32>(),
);
const MIGRATIONS_ADDED_VERSION: CryptoHash = CryptoHash(
    bs58::decode::<&[u8]>(b"7jPVdfNmttfJm3FMvGsxxYgjjKAxR4Zot9XRv1YrWxYd")
        .into_array_const_unwrap::<32>(),
);

fn supports_feature(
    current_version: CryptoHash,
    feature_introduced_in_version: CryptoHash,
) -> bool {
    let current_idx = SMART_WALLET_VERSIONS
        .iter()
        .position(|(hash, _, _)| *hash == current_version);
    let feature_idx = SMART_WALLET_VERSIONS
        .iter()
        .position(|(hash, _, _)| *hash == feature_introduced_in_version);

    match (current_idx, feature_idx) {
        (Some(current), Some(feature)) => current <= feature,
        _ => false,
    }
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum RecoveryMethod {
    /// Recover with an EIP-712 signature. The `message` format is JSON string of [`EvmSignature`]
    Evm(EvmRecoveryMethod),
    /// Recover with a Solana signature. The `message` format is JSON string of [`SolanaSignature`]
    Solana(SolanaRecoveryMethod),
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct EvmRecoveryMethod {
    pub recovery_wallet_address: alloy_primitives::Address,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct EvmSignature {
    pub signature: alloy_primitives::Signature,
    /// Example message: 'I want to sign in to alice.near with key ed25519:HbRkc1dTdSLwA1wFTDVNxJE4PCQVmpwwXwTzTGrqdhaP. The current date is 2025-01-01T00:00:00Z UTC'
    /// The date should be within 5 minutes of the current date, but not in the future.
    pub message: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct SolanaSignature {
    pub signature: solana_signature::Signature,
    /// Example message: 'I want to sign in to alice.near with key ed25519:HbRkc1dTdSLwA1wFTDVNxJE4PCQVmpwwXwTzTGrqdhaP. The current date is 2025-01-01T00:00:00Z UTC'
    /// The date should be within 5 minutes of the current date, but not in the future.
    pub message: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct SolanaRecoveryMethod {
    #[serde(with = "pubkey_serde")]
    pub recovery_wallet_address: solana_pubkey::Pubkey,
}

mod pubkey_serde {
    use serde::{Deserialize, Deserializer, Serialize, Serializer};
    use solana_pubkey::Pubkey;

    pub fn serialize<S>(pubkey: &Pubkey, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        bs58::encode(pubkey.to_bytes())
            .into_string()
            .serialize(serializer)
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Pubkey, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        let pubkey = bs58::decode(s)
            .into_vec()
            .map_err(serde::de::Error::custom)?;
        Ok(Pubkey::new_from_array(
            <[u8; 32]>::try_from(pubkey)
                .map_err(|_| serde::de::Error::custom("Invalid pubkey length"))?,
        ))
    }
}

#[derive(Clone, Debug, Default)]
struct UserRecoveryMethods {
    ethereum: Option<EvmRecoveryMethod>,
    solana: Option<SolanaRecoveryMethod>,
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type", rename_all = "kebab-case")]
pub enum JsWalletResponse {
    EthereumWalletSignature {
        signature: Option<String>,
        message: String,
    },
    SolanaWalletSignature {
        signature: Option<solana_signature::Signature>,
        message: String,
        #[serde(deserialize_with = "solana_pubkey_from_string", default)]
        address: Option<solana_pubkey::Pubkey>,
    },
    EthereumWalletConnection {
        address: Option<alloy_primitives::Address>,
    },
    SolanaWalletConnection {
        #[serde(deserialize_with = "solana_pubkey_from_string", default)]
        address: Option<solana_pubkey::Pubkey>,
    },
    LedgerConnected,
    LedgerPublicKey {
        path: String,
        key: Vec<u8>,
    },
    LedgerConnectError {
        error: serde_json::Value,
    },
    LedgerGetPublicKeyError {
        error: serde_json::Value,
    },
    LedgerSignature {
        path: String,
        signature: Vec<u8>,
        id: u32,
    },
    LedgerSignError {
        error: serde_json::Value,
    },
}

#[derive(Serialize, Debug)]
#[serde(tag = "type", rename_all = "kebab-case")]
pub enum JsWalletRequest {
    RequestEthereumWalletConnection,
    RequestSolanaWalletConnection,
    #[serde(rename_all = "camelCase")]
    RequestEthereumWalletSignature {
        message_to_sign: String,
    },
    #[serde(rename_all = "camelCase")]
    RequestSolanaWalletSignature {
        message_to_sign: String,
    },
    LedgerConnect,
    LedgerGetPublicKey {
        path: String,
    },
    #[serde(rename_all = "camelCase")]
    LedgerSign {
        path: String,
        message_to_sign: Vec<u8>,
        id: u32,
    },
}

fn solana_pubkey_from_string<'de, D>(
    deserializer: D,
) -> Result<Option<solana_pubkey::Pubkey>, D::Error>
where
    D: Deserializer<'de>,
{
    let s = Option::<String>::deserialize(deserializer)?;
    match s {
        Some(s) => Ok(Some(
            solana_pubkey::Pubkey::from_str(&s).map_err(serde::de::Error::custom)?,
        )),
        None => Ok(None),
    }
}

#[derive(Serialize)]
struct AddRecoveryMethodArgs {
    recovery_method: RecoveryMethod,
    message: String,
}

#[derive(Serialize)]
struct SetRecoveryMethodsArgs {
    recovery_methods: Vec<RecoveryMethod>,
}

#[component]
pub fn AccountSettings() -> impl IntoView {
    let AccountsContext {
        accounts,
        set_accounts,
        ..
    } = expect_context::<AccountsContext>();
    let (show_secrets, set_show_secrets) = signal(false);
    let rpc_context = expect_context::<RpcContext>();
    let NetworkContext { network } = expect_context::<NetworkContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let navigate = use_navigate();

    let (recovery_change_in_progress, set_recovery_change_in_progress) = signal(false);

    let format_ethereum_address =
        |address: &alloy_primitives::Address| -> String { format!("{address:#}") };

    let format_solana_address = |pubkey: &solana_pubkey::Pubkey| -> String {
        let addr_str = format!("{pubkey}");
        format!("{}…{}", &addr_str[0..4], &addr_str[addr_str.len() - 4..])
    };

    let show_secrets_memo = Memo::new(move |_| show_secrets.get());
    Effect::new(move || {
        if show_secrets_memo.get() {
            add_security_log(
                "Shown secrets on /settings/security/account".to_string(),
                accounts.get_untracked().selected_account_id.unwrap(),
            );
        }
    });

    let (copied_seed, set_copied_seed) = signal(false);
    let (copied_key, set_copied_key) = signal(false);
    let copy_seed = move |_| {
        if let Some(account) = accounts
            .get()
            .accounts
            .iter()
            .find(|acc| acc.account_id == accounts.get().selected_account_id.unwrap())
        {
            if let Some(seed_phrase) = &account.seed_phrase {
                let _ = window().navigator().clipboard().write_text(seed_phrase);
                set_copied_seed(true);
                set_timeout(move || set_copied_seed(false), Duration::from_millis(2000));
            }
        }
    };
    let copy_key = move |_| {
        if let Some(account) = accounts
            .get()
            .accounts
            .iter()
            .find(|acc| acc.account_id == accounts.get().selected_account_id.unwrap())
        {
            let _ = window()
                .navigator()
                .clipboard()
                .write_text(&account.secret_key.to_string());
            set_copied_key(true);
            set_timeout(move || set_copied_key(false), Duration::from_millis(2000));
        }
    };

    let smart_wallet_version = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let selected_account_id = accounts.get().selected_account_id;
        async move {
            let Some(selected_account_id) = selected_account_id else {
                // Don't display an error, this error can happen while the page is just loading,
                // and will be fixed once the accounts are loaded
                return Err("".to_string());
            };
            if let Ok(account) = rpc_client
                .view_account(selected_account_id, QueryFinality::Finality(Finality::None))
                .await
            {
                if account.code_hash != Default::default() {
                    return Err(
                        "Your wallet is a smart contract, no additional features are available"
                            .to_string(),
                    );
                }
                if let Some(global_contract_hash) = account.global_contract_hash {
                    if let Some(version) = SMART_WALLET_VERSIONS
                        .iter()
                        .find(|(hash, _, _)| *hash == global_contract_hash)
                    {
                        Ok(Some(version))
                    } else {
                        Err("Your wallet is a global smart contract, no additional features are available".to_string())
                    }
                } else {
                    Ok(None)
                }
            } else {
                log::error!("Failed to fetch account");
                Err("Failed to fetch account".to_string())
            }
        }
    });

    let recovery_methods = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let selected_account_id = accounts.get().selected_account_id;
        let smart_wallet_version_result = smart_wallet_version.get();
        async move {
            let Some(selected_account_id) = selected_account_id else {
                return Ok::<UserRecoveryMethods, String>(UserRecoveryMethods::default());
            };

            let Some(Ok(Some(current_version))) = smart_wallet_version_result else {
                return Ok::<UserRecoveryMethods, String>(UserRecoveryMethods::default());
            };

            let recovery_supported = supports_feature(current_version.0, RECOVERY_ADDED_VERSION);

            if !recovery_supported {
                return Ok(UserRecoveryMethods::default());
            }

            match rpc_client
                .call::<Vec<RecoveryMethod>>(
                    selected_account_id.clone(),
                    "ext1_get_recovery_methods",
                    serde_json::json!({}),
                    QueryFinality::Finality(Finality::None),
                )
                .await
            {
                Ok(methods) => {
                    let ethereum = methods.iter().find_map(|method| match method {
                        RecoveryMethod::Evm(evm_method) => Some(evm_method.clone()),
                        _ => None,
                    });

                    let solana = methods.iter().find_map(|method| match method {
                        RecoveryMethod::Solana(solana_method) => Some(solana_method.clone()),
                        _ => None,
                    });

                    Ok(UserRecoveryMethods { ethereum, solana })
                }
                Err(err) => {
                    log::error!("Failed to fetch recovery methods: {}", err);
                    Err(err.to_string())
                }
            }
        }
    });

    // Message listener for wallet communication (from JS)
    let _ = use_event_listener(
        use_window(),
        leptos::ev::message,
        move |event: web_sys::MessageEvent| {
            log::info!(
                "Message: {:?}",
                serde_json::to_string(
                    &serde_wasm_bindgen::from_value::<serde_json::Value>(event.data()).unwrap()
                )
                .unwrap()
            );
            log::info!(
                "Deserialization: {:?}",
                serde_wasm_bindgen::from_value::<JsWalletResponse>(event.data())
            );

            if let Ok(data) = serde_wasm_bindgen::from_value::<JsWalletResponse>(event.data()) {
                match data {
                    JsWalletResponse::EthereumWalletSignature { signature, message } => {
                        let Some(signature) = signature else {
                            set_recovery_change_in_progress(false);
                            return;
                        };
                        let Ok(parsed_signature) = signature.parse::<alloy_primitives::Signature>()
                        else {
                            set_recovery_change_in_progress(false);
                            return;
                        };
                        let evm_signature = EvmSignature {
                            signature: parsed_signature,
                            message: message.clone(),
                        };

                        let Some(selected_account_id) =
                            accounts.get_untracked().selected_account_id
                        else {
                            set_recovery_change_in_progress(false);
                            return;
                        };
                        let Ok(recovery_wallet_address) =
                            parsed_signature.recover_address_from_msg(message.as_bytes())
                        else {
                            log::error!("Failed to recover wallet address from signature");
                            set_recovery_change_in_progress(false);
                            return;
                        };
                        let recovery_method = RecoveryMethod::Evm(EvmRecoveryMethod {
                            recovery_wallet_address,
                        });

                        let signature_json = serde_json::to_string(&evm_signature).unwrap();

                        let action = Action::FunctionCall(Box::new(FunctionCallAction {
                            method_name: "ext1_add_recovery_method".to_string(),
                            args: serde_json::to_vec(&AddRecoveryMethodArgs {
                                recovery_method: recovery_method.clone(),
                                message: signature_json,
                            })
                            .unwrap(),
                            gas: NearGas::from_tgas(30).as_gas(),
                            deposit: NearToken::from_yoctonear(0),
                        }));

                        let (receiver, transaction) = EnqueuedTransaction::create(
                            "Add Ethereum recovery method".to_string(),
                            selected_account_id.clone(),
                            selected_account_id.clone(),
                            vec![action],
                        );

                        add_transaction.update(|queue| queue.push(transaction));

                        spawn_local(async move {
                            match receiver.await {
                                Ok(Ok(_details)) => {
                                    log::info!("Successfully added Ethereum recovery method");
                                    recovery_methods.refetch();
                                    set_recovery_change_in_progress(false);
                                    add_security_log(
                                        format!(
                                            "Added Ethereum recovery method: {:?}",
                                            recovery_method
                                        ),
                                        selected_account_id.clone(),
                                    );
                                }
                                Ok(Err(err)) => {
                                    log::error!("Failed to add Ethereum recovery method: {}", err);
                                    set_recovery_change_in_progress(false);
                                }
                                Err(_) => {
                                    log::error!("Failed to receive transaction result");
                                    set_recovery_change_in_progress(false);
                                }
                            }
                        });
                    }
                    JsWalletResponse::SolanaWalletSignature {
                        signature,
                        message,
                        address,
                    } => {
                        let Some(signature) = signature else {
                            set_recovery_change_in_progress(false);
                            return;
                        };

                        let solana_sig_struct = SolanaSignature {
                            signature,
                            message: message.clone(),
                        };

                        let Some(selected_account_id) =
                            accounts.get_untracked().selected_account_id
                        else {
                            set_recovery_change_in_progress(false);
                            return;
                        };

                        let Some(recovery_wallet_address) = address else {
                            log::error!("No Solana address provided in signature message");
                            set_recovery_change_in_progress(false);
                            return;
                        };

                        let recovery_method = RecoveryMethod::Solana(SolanaRecoveryMethod {
                            recovery_wallet_address,
                        });

                        let signature_json = serde_json::to_string(&solana_sig_struct).unwrap();

                        let action = Action::FunctionCall(Box::new(FunctionCallAction {
                            method_name: "ext1_add_recovery_method".to_string(),
                            args: serde_json::to_vec(&AddRecoveryMethodArgs {
                                recovery_method: recovery_method.clone(),
                                message: signature_json,
                            })
                            .unwrap(),
                            gas: NearGas::from_tgas(30).as_gas(),
                            deposit: NearToken::from_yoctonear(0),
                        }));

                        let (receiver, transaction) = EnqueuedTransaction::create(
                            "Add Solana recovery method".to_string(),
                            selected_account_id.clone(),
                            selected_account_id.clone(),
                            vec![action],
                        );

                        add_transaction.update(|queue| queue.push(transaction));

                        spawn_local(async move {
                            match receiver.await {
                                Ok(Ok(_details)) => {
                                    log::info!("Successfully added Solana recovery method");
                                    recovery_methods.refetch();
                                    set_recovery_change_in_progress(false);
                                    add_security_log(
                                        format!(
                                            "Added Solana recovery method: {:?}",
                                            recovery_method
                                        ),
                                        selected_account_id.clone(),
                                    );
                                }
                                Ok(Err(err)) => {
                                    log::error!("Failed to add Solana recovery method: {}", err);
                                    set_recovery_change_in_progress(false);
                                }
                                Err(_) => {
                                    log::error!("Failed to receive transaction result");
                                    set_recovery_change_in_progress(false);
                                }
                            }
                        });
                    }
                    _ => {}
                }
            }
        },
    );

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">Account</div>

            // Export to Other Wallets section
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <div class="text-lg font-medium">Export to Other Wallets</div>
                    <div class="text-sm text-neutral-400">
                        "Export your account to another wallet or device. "
                        <span class="text-red-400">
                            "Keep this information secure and never share it with anyone."
                        </span>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <button
                        on:click=move |_| set_show_secrets.update(|v| *v = !*v)
                        class="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
                    >
                        <div class="flex items-center gap-3">
                            <Icon icon=icondata::LuKeyRound width="20" height="20" />
                            <span>Export to Other Wallets</span>
                        </div>
                        <Show when=move || show_secrets.get()>
                            <Icon icon=icondata::LuEyeOff width="20" height="20" />
                        </Show>
                        <Show when=move || !show_secrets.get()>
                            <Icon icon=icondata::LuEye width="20" height="20" />
                        </Show>
                    </button>

                    <Show when=move || show_secrets.get()>
                        <div class="p-4 rounded-lg bg-neutral-900">
                            <div class="flex items-center justify-between">
                                <div class="text-sm text-neutral-400">Your seed phrase:</div>
                                <Show when=move || {
                                    accounts
                                        .get()
                                        .accounts
                                        .iter()
                                        .find(|acc| {
                                            acc.account_id
                                                == accounts.get().selected_account_id.unwrap()
                                        })
                                        .map(|acc| acc.seed_phrase.is_some())
                                        .unwrap_or(false)
                                }>
                                    <button
                                        on:click=copy_seed
                                        class="flex items-center gap-2 px-3 py-1 text-sm rounded-t bg-neutral-800 hover:bg-neutral-700 transition-colors"
                                    >
                                        <Icon icon=icondata::LuCopy width="16" height="16" />
                                        <span>
                                            {move || {
                                                if copied_seed.get() {
                                                    view! { <span class="text-green-500">"Copied!"</span> }
                                                        .into_any()
                                                } else {
                                                    view! { <span>"Copy"</span> }.into_any()
                                                }
                                            }}
                                        </span>
                                    </button>
                                </Show>
                            </div>
                            <div class="font-mono text-sm p-3 rounded bg-neutral-800">
                                {move || {
                                    accounts
                                        .get()
                                        .accounts
                                        .iter()
                                        .find(|acc| {
                                            acc.account_id
                                                == accounts.get().selected_account_id.unwrap()
                                        })
                                        .and_then(|acc| acc.seed_phrase.clone())
                                        .map_or_else(
                                            || {
                                                view! {
                                                    <div class="text-neutral-400">
                                                        "Seed phrase for this account is unknown"
                                                    </div>
                                                }
                                                    .into_any()
                                            },
                                            |seed| view! { <div>{seed}</div> }.into_any(),
                                        )
                                }}
                            </div>
                        </div>

                        <div class="p-4 rounded-lg bg-neutral-900">
                            <div class="flex items-center justify-between">
                                <div class="text-sm text-neutral-400">Your private key:</div>
                                <button
                                    on:click=copy_key
                                    class="flex items-center gap-2 px-3 py-1 text-sm rounded-t bg-neutral-800 hover:bg-neutral-700 transition-colors"
                                >
                                    <Icon icon=icondata::LuCopy width="16" height="16" />
                                    <span>
                                        {move || {
                                            if copied_key.get() {
                                                view! { <span class="text-green-500">"Copied!"</span> }
                                                    .into_any()
                                            } else {
                                                view! { <span>"Copy"</span> }.into_any()
                                            }
                                        }}
                                    </span>
                                </button>
                            </div>
                            <div class="font-mono text-sm p-3 rounded bg-neutral-800 break-all">
                                {move || {
                                    accounts
                                        .get()
                                        .accounts
                                        .iter()
                                        .find(|acc| {
                                            acc.account_id
                                                == accounts.get().selected_account_id.unwrap()
                                        })
                                        .map(|acc| acc.secret_key.to_string())
                                        .unwrap_or_default()
                                }}
                            </div>
                        </div>
                    </Show>
                </div>
            </div>

            // Smart Wallet Version section
            <Show when=move || {
                let is_ledger = accounts
                    .get()
                    .selected_account_id
                    .as_ref()
                    .and_then(|id| {
                        accounts.get().accounts.into_iter().find(|acc| &acc.account_id == id)
                    })
                    .map(|acc| matches!(acc.secret_key, SecretKeyHolder::Ledger { .. }))
                    .unwrap_or(false);
                network.get() == Network::Testnet && !is_ledger
            }>
                <Suspense fallback=move || {
                    view! { <div class="text-sm text-neutral-400">"Loading..."</div> }
                }>
                    {move || {
                        smart_wallet_version
                            .get()
                            .map(|result| {
                                match result {
                                    Ok(None) => {
                                        view! {
                                            <div class="flex flex-col gap-4">
                                                <div class="flex flex-col gap-2">
                                                    <button
                                                        on:click=move |_| {
                                                            if let Some(selected_account_id) = accounts
                                                                .get()
                                                                .selected_account_id
                                                            {
                                                                let action = Action::UseGlobalContract(
                                                                    Box::new(UseGlobalContractAction {
                                                                        contract_identifier: GlobalContractIdentifier::CodeHash(
                                                                            CURRENT_SMART_WALLET_VERSION,
                                                                        ),
                                                                    }),
                                                                );
                                                                let (receiver, transaction) = EnqueuedTransaction::create(
                                                                    "Deploy Smart Wallet".to_string(),
                                                                    selected_account_id.clone(),
                                                                    selected_account_id,
                                                                    vec![action],
                                                                );
                                                                add_transaction.update(|queue| queue.push(transaction));
                                                                spawn_local(async move {
                                                                    match receiver.await {
                                                                        Ok(Ok(_details)) => {
                                                                            smart_wallet_version.refetch();
                                                                        }
                                                                        Ok(Err(err)) => {
                                                                            log::error!("Smart wallet transaction failed: {}", err);
                                                                        }
                                                                        Err(_) => {
                                                                            log::error!("Failed to receive transaction result");
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                        class="relative flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-[1.02] overflow-hidden group"
                                                    >
                                                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                        <span class="relative z-10 font-semibold text-white flex items-center gap-2">
                                                            <Icon icon=icondata::LuSparkles width="20" height="20" />
                                                            "Enable Smart Wallet"
                                                            <Icon icon=icondata::LuSparkles width="20" height="20" />
                                                        </span>
                                                    </button>
                                                    <div class="text-xs text-amber-400 bg-amber-950/30 border border-amber-700/30 rounded-lg p-3 flex items-center gap-2">
                                                        <Icon
                                                            icon=icondata::LuAlertTriangle
                                                            width="16"
                                                            height="16"
                                                        />
                                                        <span>
                                                            "This feature is experimental and has not been audited. Use with caution."
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    }
                                    Ok(Some(current_version)) => {
                                        let is_latest = current_version.0
                                            == CURRENT_SMART_WALLET_VERSION;
                                        let latest_version_info = &SMART_WALLET_VERSIONS[0];
                                        let cumulative_changes: Vec<&str> = if let Some(
                                            current_idx,
                                        ) = SMART_WALLET_VERSIONS
                                            .iter()
                                            .position(|(hash, _, _)| *hash == current_version.0)
                                        {
                                            SMART_WALLET_VERSIONS[0..current_idx]
                                                .iter()
                                                .flat_map(|(_, _, changes)| changes.iter().copied())
                                                .collect()
                                        } else {
                                            log::error!("Failed to find current version index");
                                            vec![]
                                        };

                                        view! {
                                            <div class="flex flex-col gap-4">
                                                <div class="flex flex-col gap-2">
                                                    <div class="text-lg font-medium">Smart Wallet</div>
                                                    <Show when=move || !is_latest>
                                                        <div class="p-4 rounded-lg bg-blue-950/30 border border-blue-700/30">
                                                            <div class="text-sm font-medium text-blue-300 mb-2">
                                                                "New Version Available - "
                                                                {latest_version_info.1.format("%B %d, %Y").to_string()}
                                                            </div>
                                                            <div class="text-sm text-blue-200 mb-3">"What's new:"</div>
                                                            <ul class="text-sm text-blue-100 space-y-1 mb-4">
                                                                {cumulative_changes
                                                                    .iter()
                                                                    .map(|change| {
                                                                        view! {
                                                                            <li class="flex items-start gap-2">
                                                                                <span class="text-blue-400">-</span>
                                                                                <span>{change.to_string()}</span>
                                                                            </li>
                                                                        }
                                                                    })
                                                                    .collect_view()}
                                                            </ul>
                                                            <button
                                                                on:click=move |_| {
                                                                    if let Some(selected_account_id) = accounts
                                                                        .get()
                                                                        .selected_account_id
                                                                    {
                                                                        let before_upgrade = Action::FunctionCall(
                                                                            Box::new(FunctionCallAction {
                                                                                method_name: "before_upgrade".to_string(),
                                                                                args: serde_json::to_vec(&serde_json::json!({})).unwrap(),
                                                                                gas: NearGas::from_tgas(5).as_gas(),
                                                                                deposit: NearToken::from_yoctonear(0),
                                                                            }),
                                                                        );
                                                                        let use_global_contract = Action::UseGlobalContract(
                                                                            Box::new(UseGlobalContractAction {
                                                                                contract_identifier: GlobalContractIdentifier::CodeHash(
                                                                                    CURRENT_SMART_WALLET_VERSION,
                                                                                ),
                                                                            }),
                                                                        );
                                                                        let after_upgrade = Action::FunctionCall(
                                                                            Box::new(FunctionCallAction {
                                                                                method_name: "after_upgrade".to_string(),
                                                                                args: serde_json::to_vec(&serde_json::json!({})).unwrap(),
                                                                                gas: NearGas::from_tgas(30).as_gas(),
                                                                                deposit: NearToken::from_yoctonear(0),
                                                                            }),
                                                                        );
                                                                        let (receiver, transaction) = EnqueuedTransaction::create(
                                                                            "Update Smart Wallet".to_string(),
                                                                            selected_account_id.clone(),
                                                                            selected_account_id,
                                                                            if supports_feature(
                                                                                current_version.0,
                                                                                MIGRATIONS_ADDED_VERSION,
                                                                            ) {
                                                                                vec![before_upgrade, use_global_contract, after_upgrade]
                                                                            } else {
                                                                                vec![use_global_contract, after_upgrade]
                                                                            },
                                                                        );
                                                                        add_transaction.update(|queue| queue.push(transaction));
                                                                        spawn_local(async move {
                                                                            match receiver.await {
                                                                                Ok(Ok(_details)) => {
                                                                                    smart_wallet_version.refetch();
                                                                                }
                                                                                Ok(Err(err)) => {
                                                                                    log::error!("Smart wallet update failed: {}", err);
                                                                                }
                                                                                Err(_) => {
                                                                                    log::error!("Failed to receive update result");
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                                class="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium text-white cursor-pointer"
                                                            >
                                                                <Icon icon=icondata::LuDownload width="16" height="16" />
                                                                "Update Smart Wallet"
                                                            </button>
                                                        </div>
                                                    </Show>
                                                </div>
                                            </div>
                                        }
                                            .into_any()
                                    }
                                    Err(err) => {
                                        view! { <div class="text-sm text-red-400">{err}</div> }
                                            .into_any()
                                    }
                                }
                            })
                            .unwrap_or_else(|| ().into_any())
                    }}
                </Suspense>
            </Show>

            <Show when=move || {
                accounts
                    .get()
                    .selected_account_id
                    .as_ref()
                    .and_then(|id| {
                        accounts.get().accounts.into_iter().find(|acc| &acc.account_id == id)
                    })
                    .map(|acc| matches!(acc.secret_key, SecretKeyHolder::Ledger { .. }))
                    .unwrap_or(false)
            }>
                <div class="text-sm text-neutral-400 p-4 bg-neutral-900 rounded-lg">
                    "Smart Wallet feature is not available for Ledger accounts yet."
                </div>
            </Show>

            // Recovery section
            {move || {
                smart_wallet_version
                    .get()
                    .map(|result| {
                        match result {
                            Ok(Some(current_version)) => {
                                let recovery_supported = supports_feature(
                                    current_version.0,
                                    RECOVERY_ADDED_VERSION,
                                );
                                if recovery_supported {
                                    view! {
                                        <div class="flex flex-col gap-4">
                                            <div class="flex flex-col gap-2">
                                                <div class="text-lg font-medium">Recovery</div>
                                                <div class="text-sm text-neutral-400">
                                                    "You can log in with these methods"
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-2 gap-4">
                                                // Ethereum connection
                                                <button
                                                    on:click=move |_| {
                                                        if recovery_change_in_progress.get_untracked() {
                                                            return;
                                                        }
                                                        if let Some(selected_account_id) = accounts
                                                            .get_untracked()
                                                            .selected_account_id
                                                        {
                                                            let current_methods_result = recovery_methods
                                                                .get_untracked();
                                                            let has_ethereum = current_methods_result
                                                                .as_ref()
                                                                .and_then(|result| result.as_ref().ok())
                                                                .map(|methods| methods.ethereum.is_some())
                                                                .unwrap_or(false);
                                                            if has_ethereum {
                                                                set_recovery_change_in_progress(true);
                                                                let rpc_client = rpc_context.client.get_untracked();
                                                                spawn_local(async move {
                                                                    match rpc_client
                                                                        .call::<
                                                                            Vec<RecoveryMethod>,
                                                                        >(
                                                                            selected_account_id.clone(),
                                                                            "ext1_get_recovery_methods",
                                                                            serde_json::json!({}),
                                                                            QueryFinality::Finality(Finality::DoomSlug),
                                                                        )
                                                                        .await
                                                                    {
                                                                        Ok(mut all_methods) => {
                                                                            all_methods
                                                                                .retain(|method| !matches!(method, RecoveryMethod::Evm(_)));
                                                                            let action = Action::FunctionCall(
                                                                                Box::new(FunctionCallAction {
                                                                                    method_name: "ext1_set_recovery_methods".to_string(),
                                                                                    args: serde_json::to_vec(
                                                                                            &SetRecoveryMethodsArgs {
                                                                                                recovery_methods: all_methods,
                                                                                            },
                                                                                        )
                                                                                        .unwrap(),
                                                                                    gas: NearGas::from_tgas(30).as_gas(),
                                                                                    deposit: NearToken::from_yoctonear(0),
                                                                                }),
                                                                            );
                                                                            let (receiver, transaction) = EnqueuedTransaction::create(
                                                                                "Remove Ethereum recovery method".to_string(),
                                                                                selected_account_id.clone(),
                                                                                selected_account_id.clone(),
                                                                                vec![action],
                                                                            );
                                                                            add_transaction.update(|queue| queue.push(transaction));
                                                                            match receiver.await {
                                                                                Ok(Ok(_details)) => {
                                                                                    add_security_log(
                                                                                        "Removed Ethereum recovery method".to_string(),
                                                                                        selected_account_id.clone(),
                                                                                    );
                                                                                    log::info!("Successfully removed Ethereum recovery method");
                                                                                    recovery_methods.refetch();
                                                                                    set_recovery_change_in_progress(false);
                                                                                }
                                                                                Ok(Err(err)) => {
                                                                                    log::error!(
                                                                                        "Failed to remove Ethereum recovery method: {}", err
                                                                                    );
                                                                                    set_recovery_change_in_progress(false);
                                                                                }
                                                                                Err(_) => {
                                                                                    log::error!("Failed to receive transaction result");
                                                                                    set_recovery_change_in_progress(false);
                                                                                }
                                                                            }
                                                                        }
                                                                        Err(err) => {
                                                                            log::error!("Failed to fetch recovery methods: {}", err);
                                                                            set_recovery_change_in_progress(false);
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                set_recovery_change_in_progress(true);
                                                                if let Some(account) = accounts
                                                                    .get_untracked()
                                                                    .accounts
                                                                    .iter()
                                                                    .find(|acc| acc.account_id == selected_account_id)
                                                                {
                                                                    let message = format!(
                                                                        "I want to sign in to {} with key {}. The current date is {} UTC",
                                                                        selected_account_id,
                                                                        account.secret_key.public_key(),
                                                                        chrono::Utc::now().to_rfc3339(),
                                                                    );
                                                                    let request = JsWalletRequest::RequestEthereumWalletSignature {
                                                                        message_to_sign: message,
                                                                    };
                                                                    if let Ok(js_value) = serde_wasm_bindgen::to_value(
                                                                        &request,
                                                                    ) {
                                                                        let origin = window()
                                                                            .location()
                                                                            .origin()
                                                                            .unwrap_or_else(|_| "*".to_string());
                                                                        if window().post_message(&js_value, &origin).is_err() {
                                                                            log::error!("Failed to send signature request");
                                                                            set_recovery_change_in_progress(false);
                                                                        }
                                                                    } else {
                                                                        log::error!("Failed to serialize signature request");
                                                                        set_recovery_change_in_progress(false);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    class=move || {
                                                        let in_progress = recovery_change_in_progress.get();
                                                        format!(
                                                            "flex flex-col items-center gap-3 p-4 rounded-lg bg-neutral-900 transition-colors {}",
                                                            if in_progress {
                                                                "opacity-50 cursor-not-allowed"
                                                            } else {
                                                                "hover:bg-neutral-800 cursor-pointer"
                                                            },
                                                        )
                                                    }
                                                >
                                                    <div class=move || {
                                                        let recovery_methods_result = recovery_methods.get();
                                                        let has_ethereum = recovery_methods_result
                                                            .as_ref()
                                                            .and_then(|result| result.as_ref().ok())
                                                            .map(|methods| methods.ethereum.is_some())
                                                            .unwrap_or(false);
                                                        format!(
                                                            "w-12 h-12 rounded-full flex items-center justify-center {}",
                                                            if has_ethereum {
                                                                "bg-green-500/20 text-green-400"
                                                            } else {
                                                                "bg-neutral-700 text-neutral-400"
                                                            },
                                                        )
                                                    }>
                                                        <Icon icon=icondata::SiEthereum width="24" height="24" />
                                                    </div>
                                                    <div class="text-center">
                                                        <div class="font-medium">Ethereum</div>
                                                        <div class=move || {
                                                            let recovery_methods_result = recovery_methods.get();
                                                            let has_ethereum = recovery_methods_result
                                                                .as_ref()
                                                                .and_then(|result| result.as_ref().ok())
                                                                .map(|methods| methods.ethereum.is_some())
                                                                .unwrap_or(false);
                                                            let in_progress = recovery_change_in_progress.get();
                                                            format!(
                                                                "text-xs {}",
                                                                if in_progress {
                                                                    "text-blue-400"
                                                                } else if has_ethereum {
                                                                    "text-green-400"
                                                                } else {
                                                                    "text-neutral-500"
                                                                },
                                                            )
                                                        }>
                                                            {move || {
                                                                let recovery_methods_result = recovery_methods.get();
                                                                let has_ethereum = recovery_methods_result
                                                                    .as_ref()
                                                                    .and_then(|result| result.as_ref().ok())
                                                                    .map(|methods| methods.ethereum.is_some())
                                                                    .unwrap_or(false);
                                                                let in_progress = recovery_change_in_progress.get();
                                                                if in_progress {
                                                                    "Loading...".to_string()
                                                                } else if has_ethereum {
                                                                    if let Some(Ok(methods)) = recovery_methods_result.as_ref()
                                                                    {
                                                                        if let Some(ethereum_method) = &methods.ethereum {
                                                                            format_ethereum_address(
                                                                                &ethereum_method.recovery_wallet_address,
                                                                            )
                                                                        } else {
                                                                            "Connected".to_string()
                                                                        }
                                                                    } else {
                                                                        "Connected".to_string()
                                                                    }
                                                                } else {
                                                                    "Not connected".to_string()
                                                                }
                                                            }}
                                                        </div>
                                                    </div>
                                                </button>

                                                // Solana connection
                                                <button
                                                    on:click=move |_| {
                                                        if recovery_change_in_progress.get_untracked() {
                                                            return;
                                                        }
                                                        if let Some(selected_account_id) = accounts
                                                            .get_untracked()
                                                            .selected_account_id
                                                        {
                                                            let current_methods_result = recovery_methods
                                                                .get_untracked();
                                                            let has_solana = current_methods_result
                                                                .as_ref()
                                                                .and_then(|result| result.as_ref().ok())
                                                                .map(|methods| methods.solana.is_some())
                                                                .unwrap_or(false);
                                                            if has_solana {
                                                                set_recovery_change_in_progress(true);
                                                                let rpc_client = rpc_context.client.get_untracked();
                                                                spawn_local(async move {
                                                                    match rpc_client
                                                                        .call::<
                                                                            Vec<RecoveryMethod>,
                                                                        >(
                                                                            selected_account_id.clone(),
                                                                            "ext1_get_recovery_methods",
                                                                            serde_json::json!({}),
                                                                            QueryFinality::Finality(Finality::DoomSlug),
                                                                        )
                                                                        .await
                                                                    {
                                                                        Ok(mut all_methods) => {
                                                                            all_methods
                                                                                .retain(|method| {
                                                                                    !matches!(method, RecoveryMethod::Solana(_))
                                                                                });
                                                                            let action = Action::FunctionCall(
                                                                                Box::new(FunctionCallAction {
                                                                                    method_name: "ext1_set_recovery_methods".to_string(),
                                                                                    args: serde_json::to_vec(
                                                                                            &SetRecoveryMethodsArgs {
                                                                                                recovery_methods: all_methods,
                                                                                            },
                                                                                        )
                                                                                        .unwrap(),
                                                                                    gas: NearGas::from_tgas(30).as_gas(),
                                                                                    deposit: NearToken::from_yoctonear(0),
                                                                                }),
                                                                            );
                                                                            let (receiver, transaction) = EnqueuedTransaction::create(
                                                                                "Remove Solana recovery method".to_string(),
                                                                                selected_account_id.clone(),
                                                                                selected_account_id.clone(),
                                                                                vec![action],
                                                                            );
                                                                            add_transaction.update(|queue| queue.push(transaction));
                                                                            match receiver.await {
                                                                                Ok(Ok(_details)) => {
                                                                                    add_security_log(
                                                                                        "Removed Solana recovery method".to_string(),
                                                                                        selected_account_id.clone(),
                                                                                    );
                                                                                    log::info!("Successfully removed Solana recovery method");
                                                                                    recovery_methods.refetch();
                                                                                    set_recovery_change_in_progress(false);
                                                                                }
                                                                                Ok(Err(err)) => {
                                                                                    log::error!(
                                                                                        "Failed to remove Solana recovery method: {}", err
                                                                                    );
                                                                                    set_recovery_change_in_progress(false);
                                                                                }
                                                                                Err(_) => {
                                                                                    log::error!("Failed to receive transaction result");
                                                                                    set_recovery_change_in_progress(false);
                                                                                }
                                                                            }
                                                                        }
                                                                        Err(err) => {
                                                                            log::error!("Failed to fetch recovery methods: {}", err);
                                                                            set_recovery_change_in_progress(false);
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                set_recovery_change_in_progress(true);
                                                                if let Some(account) = accounts
                                                                    .get_untracked()
                                                                    .accounts
                                                                    .iter()
                                                                    .find(|acc| acc.account_id == selected_account_id)
                                                                {
                                                                    let message = format!(
                                                                        "I want to sign in to {} with key {}. The current date is {} UTC",
                                                                        selected_account_id,
                                                                        account.secret_key.public_key(),
                                                                        chrono::Utc::now().to_rfc3339(),
                                                                    );
                                                                    let request = JsWalletRequest::RequestSolanaWalletSignature {
                                                                        message_to_sign: message,
                                                                    };
                                                                    if let Ok(js_value) = serde_wasm_bindgen::to_value(
                                                                        &request,
                                                                    ) {
                                                                        let origin = window()
                                                                            .location()
                                                                            .origin()
                                                                            .unwrap_or_else(|_| "*".to_string());
                                                                        if window().post_message(&js_value, &origin).is_err() {
                                                                            log::error!("Failed to send Solana signature request");
                                                                            set_recovery_change_in_progress(false);
                                                                        }
                                                                    } else {
                                                                        log::error!("Failed to serialize Solana signature request");
                                                                        set_recovery_change_in_progress(false);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    class=move || {
                                                        let in_progress = recovery_change_in_progress.get();
                                                        format!(
                                                            "flex flex-col items-center gap-3 p-4 rounded-lg bg-neutral-900 transition-colors {}",
                                                            if in_progress {
                                                                "opacity-50 cursor-not-allowed"
                                                            } else {
                                                                "hover:bg-neutral-800 cursor-pointer"
                                                            },
                                                        )
                                                    }
                                                >
                                                    <div class=move || {
                                                        let recovery_methods_result = recovery_methods.get();
                                                        let has_solana = recovery_methods_result
                                                            .as_ref()
                                                            .and_then(|result| result.as_ref().ok())
                                                            .map(|methods| methods.solana.is_some())
                                                            .unwrap_or(false);
                                                        format!(
                                                            "w-12 h-12 rounded-full flex items-center justify-center {}",
                                                            if has_solana {
                                                                "bg-green-500/20 text-green-400"
                                                            } else {
                                                                "bg-neutral-700 text-neutral-400"
                                                            },
                                                        )
                                                    }>
                                                        <Icon icon=icondata::SiSolana width="24" height="24" />
                                                    </div>
                                                    <div class="text-center">
                                                        <div class="font-medium">Solana</div>
                                                        <div class=move || {
                                                            let recovery_methods_result = recovery_methods.get();
                                                            let has_solana = recovery_methods_result
                                                                .as_ref()
                                                                .and_then(|result| result.as_ref().ok())
                                                                .map(|methods| methods.solana.is_some())
                                                                .unwrap_or(false);
                                                            let in_progress = recovery_change_in_progress.get();
                                                            format!(
                                                                "text-xs {}",
                                                                if in_progress {
                                                                    "text-blue-400"
                                                                } else if has_solana {
                                                                    "text-green-400"
                                                                } else {
                                                                    "text-neutral-500"
                                                                },
                                                            )
                                                        }>
                                                            {move || {
                                                                let recovery_methods_result = recovery_methods.get();
                                                                let has_solana = recovery_methods_result
                                                                    .as_ref()
                                                                    .and_then(|result| result.as_ref().ok())
                                                                    .map(|methods| methods.solana.is_some())
                                                                    .unwrap_or(false);
                                                                let in_progress = recovery_change_in_progress.get();
                                                                if in_progress {
                                                                    "Loading...".to_string()
                                                                } else if has_solana {
                                                                    if let Some(Ok(methods)) = recovery_methods_result.as_ref()
                                                                    {
                                                                        if let Some(solana_method) = &methods.solana {
                                                                            format_solana_address(
                                                                                &solana_method.recovery_wallet_address,
                                                                            )
                                                                        } else {
                                                                            "Connected".to_string()
                                                                        }
                                                                    } else {
                                                                        "Connected".to_string()
                                                                    }
                                                                } else {
                                                                    "Not connected".to_string()
                                                                }
                                                            }}
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }
                            _ => ().into_any(),
                        }
                    })
                    .unwrap_or_else(|| ().into_any())
            }}
        </div>

        // Log Out section
        <div class="flex flex-col gap-4 p-4">
            <button
                on:click=move |_| {
                    set_accounts
                        .maybe_update(|accounts_data| {
                            if let Some(selected_account_id) = accounts_data
                                .selected_account_id
                                .as_ref()
                            {
                                add_security_log(
                                    format!(
                                        "Logged out of {selected_account_id} with key {} (public key: {})",
                                        accounts_data
                                            .accounts
                                            .iter()
                                            .find(|acc| acc.account_id == *selected_account_id)
                                            .map(|acc| acc.secret_key.clone())
                                            .unwrap(),
                                        accounts_data
                                            .accounts
                                            .iter()
                                            .find(|acc| acc.account_id == *selected_account_id)
                                            .map(|acc| acc.secret_key.public_key())
                                            .unwrap(),
                                    ),
                                    selected_account_id.clone(),
                                );
                                accounts_data
                                    .accounts
                                    .retain(|acc| acc.account_id != *selected_account_id);
                                accounts_data.selected_account_id = accounts_data
                                    .accounts
                                    .first()
                                    .map(|acc| acc.account_id.clone());
                                true
                            } else {
                                false
                            }
                        });
                    navigate("/", Default::default());
                }
                class="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors font-medium cursor-pointer"
            >
                <Icon icon=icondata::LuLogOut width="16" height="16" />
                "Log Out"
            </button>
        </div>
    }
}
