use std::{str::FromStr, time::Duration};

use crate::components::account_selector::{
    AccountCreateParent, AccountCreateRecoveryMethod, ModalState, mnemonic_to_key,
};
use crate::components::bridge_history::DepositAddress;
use crate::components::danger_confirm_input::DangerConfirmInput;
use crate::components::derivation_path_input::DerivationPathInput;
use crate::contexts::accounts_context::format_ledger_error;
use crate::contexts::{
    account_selector_context::AccountSelectorContext,
    accounts_context::{AccountsContext, SecretKeyHolder},
    config_context::{ConfigContext, LedgerMode},
    modal_context::ModalContext,
    network_context::{Network, NetworkContext},
    rpc_context::RpcContext,
    security_log_context::add_security_log,
    transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
};
use bip39::Mnemonic;
use chrono::NaiveDate;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::hooks::use_navigate;
use leptos_use::{use_event_listener, use_window};
use near_min_api::types::AccountId;
use near_min_api::types::near_crypto::PublicKey;
use near_min_api::{
    QueryFinality,
    types::{
        AccessKey, AccessKeyPermission, AccessKeyPermissionView, Action, AddKeyAction, CryptoHash,
        DeleteKeyAction, Finality, FunctionCallAction, GlobalContractIdentifier, NearGas,
        NearToken, UseGlobalContractAction,
    },
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

const BETTEAR_BOT_ACCOUNT_SUFFIX: &str = ".user.intear.near";
const BETTEAR_BOT_PUBLIC_KEY: &str = "ed25519:3NhAUPmuSHbXoqzsvbsNzLiyWwm3LSWkCTpNB1RkxN7X";

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
    LedgerConnect {
        mode: LedgerMode,
    },
    LedgerGetPublicKey {
        path: String,
        mode: LedgerMode,
    },
    #[serde(rename_all = "camelCase")]
    LedgerSign {
        path: String,
        message_to_sign: Vec<u8>,
        id: u32,
        mode: LedgerMode,
    },
    ChatwootOpen {
        account_id: AccountId,
        bridge_deposit_address: Option<DepositAddress>,
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
fn TerminateSessionsModal(
    is_ledger_account: impl Fn() -> bool + Copy + Send + Sync + 'static,
    terminate_sessions: impl Fn(()) + Copy + Send + Sync + 'static,
    new_mnemonic: ReadSignal<Option<bip39::Mnemonic>>,
    set_new_mnemonic: WriteSignal<Option<bip39::Mnemonic>>,
    copied_to_clipboard: ReadSignal<bool>,
    set_copied_to_clipboard: WriteSignal<bool>,
    is_confirmed: ReadSignal<bool>,
    set_is_confirmed: WriteSignal<bool>,
    terminating_sessions: ReadSignal<bool>,
    generate_new_mnemonic: impl Fn() + Copy + Send + Sync + 'static,
) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();

    let close_modal = move || {
        modal.set(None);
        set_is_confirmed(false);
        set_new_mnemonic(None);
        set_copied_to_clipboard(false);
    };

    view! {
        <div
            class="fixed inset-0 bg-neutral-950/60 backdrop-blur-[2px] lg:rounded-3xl z-10"
            on:click=move |_| close_modal()
        >
            <div class="absolute inset-0 flex items-center justify-center">
                <div
                    class="bg-neutral-950 p-8 rounded-xl w-full max-w-md border border-red-500/20"
                    on:click=|ev| ev.stop_propagation()
                >
                    <h3 class="text-xl font-semibold mb-4 text-white">
                        "Terminate All Other Sessions"
                    </h3>
                    <div class="text-neutral-400 mb-6 space-y-4">
                        {move || {
                            if is_ledger_account() {
                                view! {
                                    <div class="space-y-4">
                                        <p>
                                            "This will remove all other access keys from your account, keeping only the current Ledger key. This will make the currently connected Ledger the only way to access this account."
                                        </p>
                                    </div>
                                }
                                    .into_any()
                            } else {
                                view! {
                                    <div class="space-y-4">
                                        <p>
                                            "This will log you out of all wallets other than this one. This can be useful if you feel like you might have compromised your seed phrase and want to change it."
                                        </p>
                                        <p>
                                            "Note that if you have saved your seed phrase, "
                                            <span class="text-yellow-400 font-bold">
                                                "IT WILL STOP WORKING"
                                            </span> ", and a "
                                            <span class="text-yellow-400 font-bold">"NEW"</span>
                                            " phrase will appear in the Account page."
                                        </p>
                                    </div>
                                }
                                    .into_any()
                            }
                        }}
                    </div>

                    <Show when=move || { new_mnemonic.get().is_some() && !is_ledger_account() }>
                        <div class="bg-neutral-900 rounded-lg p-4 mb-6 border border-neutral-700">
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="text-lg font-medium text-white">"New Seed Phrase"</h4>
                                <div class="flex gap-2">
                                    <button
                                        class="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                        style:color=move || {
                                            if copied_to_clipboard.get() { "#22c55e" } else { "" }
                                        }
                                        on:click=move |_| {
                                            if let Some(mnemonic) = new_mnemonic.get() {
                                                let _ = window()
                                                    .navigator()
                                                    .clipboard()
                                                    .write_text(&mnemonic.to_string());
                                                set_copied_to_clipboard(true);
                                                set_timeout(
                                                    move || set_copied_to_clipboard(false),
                                                    Duration::from_secs(2),
                                                );
                                            }
                                        }
                                        title=move || {
                                            if copied_to_clipboard.get() {
                                                "Copied!"
                                            } else {
                                                "Copy seed phrase"
                                            }
                                        }
                                    >
                                        <Show when=move || !copied_to_clipboard.get()>
                                            <Icon icon=icondata::LuCopy width="16" height="16" />
                                        </Show>
                                        <Show when=move || copied_to_clipboard.get()>
                                            <Icon icon=icondata::LuCheck width="16" height="16" />
                                        </Show>
                                    </button>
                                    <button
                                        class="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                        on:click=move |_| generate_new_mnemonic()
                                        title="Generate new seed phrase"
                                    >
                                        <Icon icon=icondata::LuRefreshCw width="16" height="16" />
                                    </button>
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-2 text-sm">
                                {move || {
                                    if let Some(mnemonic) = new_mnemonic.get() {
                                        mnemonic
                                            .words()
                                            .enumerate()
                                            .map(|(i, word)| {
                                                view! {
                                                    <div class="flex items-center gap-2 p-2 bg-neutral-800 rounded">
                                                        <span class="text-neutral-500 text-xs w-4">
                                                            {format!("{}.", i + 1)}
                                                        </span>
                                                        <span class="text-white font-mono">{word}</span>
                                                    </div>
                                                }
                                            })
                                            .collect::<Vec<_>>()
                                    } else {
                                        vec![]
                                    }
                                }}
                            </div>
                            <div class="mt-3 text-xs text-yellow-400">
                                <Icon
                                    icon=icondata::LuTriangleAlert
                                    width="14"
                                    height="14"
                                    attr:class="inline mr-1"
                                />
                                "Save this new seed phrase - it will replace your current one!"
                            </div>
                        </div>
                    </Show>

                    <DangerConfirmInput
                        set_is_confirmed=set_is_confirmed
                        warning_title="Please read the above"
                        warning_message=if is_ledger_account() {
                            "This action cannot be undone. Your Ledger device will be the ONLY way to access this account."
                                .to_string()
                        } else {
                            "This action cannot be undone. This device will be the ONLY one that can access this account."
                                .to_string()
                        }
                        attr:class="mb-4"
                    />

                    <div class="flex gap-3">
                        <button
                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                            on:click=move |_| close_modal()
                        >
                            "Cancel"
                        </button>
                        <button
                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed cursor-pointer"
                            disabled=move || { terminating_sessions.get() || !is_confirmed.get() }
                            on:click=move |_| {
                                terminate_sessions(());
                                close_modal();
                            }
                        >
                            "Confirm"
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn AccountSettings() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let (show_secrets, set_show_secrets) = signal(false);
    let rpc_context = expect_context::<RpcContext>();
    let NetworkContext { network } = expect_context::<NetworkContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let account_selector_context = expect_context::<AccountSelectorContext>();
    let navigate = use_navigate();

    let (recovery_change_in_progress, set_recovery_change_in_progress) = signal(false);

    let (bettear_bot_change_in_progress, set_bettear_bot_change_in_progress) = signal(false);

    let (ledger_connection_in_progress, set_ledger_connection_in_progress) = signal(false);
    let (ledger_connected, set_ledger_connected) = signal(false);
    let (ledger_getting_public_key, set_ledger_getting_public_key) = signal(false);
    let (ledger_error, set_ledger_error) = signal::<Option<String>>(None);

    let (ledger_input_hd_path_input, set_ledger_hd_path_input) =
        signal("44'/397'/0'/0'/1'".to_string());
    let (ledger_current_key_data, set_ledger_current_key_data) =
        signal::<Option<(String, near_min_api::types::near_crypto::PublicKey)>>(None);

    let (ledger_account_number, set_ledger_account_number) = signal(0u32);
    let (ledger_change_number, set_ledger_change_number) = signal(0u32);
    let (ledger_address_number, set_ledger_address_number) = signal(1u32);

    let (is_confirmed, set_is_confirmed) = signal(false);
    let (new_mnemonic, set_new_mnemonic) = signal::<Option<bip39::Mnemonic>>(None);
    let (copied_to_clipboard, set_copied_to_clipboard) = signal(false);
    let (ledger_is_only_key, set_ledger_is_only_key) = signal(false);
    let (checking_keys, set_checking_keys) = signal(false);
    let (terminating_sessions, set_terminating_sessions) = signal(false);
    let ModalContext { modal } = expect_context::<ModalContext>();
    let config_context = expect_context::<ConfigContext>();

    let on_path_change = move || {
        set_ledger_current_key_data.set(None);
        set_ledger_error.set(None);
    };

    Effect::new(move || {
        let path = format!(
            "44'/397'/{}'/{}'/{}'",
            ledger_account_number.get(),
            ledger_change_number.get(),
            ledger_address_number.get()
        );
        set_ledger_hd_path_input.set(path);
    });

    let request_ledger_connection = move || {
        if ledger_connection_in_progress.get_untracked() || ledger_connected.get_untracked() {
            return;
        }
        set_ledger_connection_in_progress(true);
        set_ledger_error.set(None);
        let ledger_mode = config_context.config.get_untracked().ledger_mode;
        let request = JsWalletRequest::LedgerConnect { mode: ledger_mode };
        match serde_wasm_bindgen::to_value(&request) {
            Ok(js_value) => {
                let origin = window()
                    .location()
                    .origin()
                    .unwrap_or_else(|_| "*".to_string());
                if window().post_message(&js_value, &origin).is_err() {
                    set_ledger_error
                        .set(Some("Failed to send Ledger connection request".to_string()));
                    set_ledger_connection_in_progress(false);
                }
            }
            _ => {
                set_ledger_error.set(Some(
                    "Failed to serialize Ledger connection request".to_string(),
                ));
                set_ledger_connection_in_progress(false);
            }
        }
    };

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
                accounts_context
                    .accounts
                    .get_untracked()
                    .selected_account_id
                    .unwrap(),
                accounts_context,
            );
        }
    });

    let (copied_seed, set_copied_seed) = signal(false);
    let (copied_key, set_copied_key) = signal(false);
    let copy_seed = move |_| {
        if let Some(account) = accounts_context.accounts.get().accounts.iter().find(|acc| {
            acc.account_id == accounts_context.accounts.get().selected_account_id.unwrap()
        }) && let Some(seed_phrase) = &account.seed_phrase
        {
            let _ = window().navigator().clipboard().write_text(seed_phrase);
            set_copied_seed(true);
            set_timeout(move || set_copied_seed(false), Duration::from_millis(2000));
        }
    };
    let copy_key = move |_| {
        if let Some(account) = accounts_context.accounts.get().accounts.iter().find(|acc| {
            acc.account_id == accounts_context.accounts.get().selected_account_id.unwrap()
        }) {
            match &account.secret_key {
                SecretKeyHolder::SecretKey(secret_key) => {
                    let _ = window()
                        .navigator()
                        .clipboard()
                        .write_text(&secret_key.to_string());
                    set_copied_key(true);
                    set_timeout(move || set_copied_key(false), Duration::from_millis(2000));
                }
                SecretKeyHolder::Ledger { .. } => {
                    // Don't copy anything for Ledger accounts
                }
            }
        }
    };

    let smart_wallet_version = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let selected_account_id = accounts_context.accounts.get().selected_account_id;
        async move {
            let Some(selected_account_id) = selected_account_id else {
                // Don't display an error, this error can happen while the page is just loading,
                // and will be fixed once the accounts are loaded
                return Err("".to_string());
            };
            match rpc_client
                .view_account(selected_account_id, QueryFinality::Finality(Finality::None))
                .await
            {
                Ok(account) => {
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
                }
                _ => {
                    log::error!("Failed to fetch account");
                    Err("Failed to fetch account".to_string())
                }
            }
        }
    });

    let recovery_methods = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let selected_account_id = accounts_context.accounts.get().selected_account_id;
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

    let bettear_bot_key_status = LocalResource::new(move || {
        let rpc_client = rpc_context.client.get();
        let selected_account_id = accounts_context.accounts.get().selected_account_id;
        async move {
            let Some(selected_account_id) = selected_account_id else {
                return false;
            };

            if !selected_account_id
                .as_str()
                .ends_with(BETTEAR_BOT_ACCOUNT_SUFFIX)
            {
                return false;
            }

            rpc_client
                .get_access_key(
                    selected_account_id.clone(),
                    BETTEAR_BOT_PUBLIC_KEY.parse().unwrap(),
                    QueryFinality::Finality(Finality::None),
                )
                .await
                .is_ok()
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

                        let Some(selected_account_id) = accounts_context
                            .accounts
                            .get_untracked()
                            .selected_account_id
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
                                        accounts_context,
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

                        let Some(selected_account_id) = accounts_context
                            .accounts
                            .get_untracked()
                            .selected_account_id
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
                                        accounts_context,
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
                    JsWalletResponse::LedgerConnected => {
                        set_ledger_connection_in_progress(false);
                        set_ledger_connected(true);
                        set_ledger_error.set(None);
                    }
                    JsWalletResponse::LedgerPublicKey { path, key } => {
                        set_ledger_getting_public_key(false);

                        if path != ledger_input_hd_path_input.get_untracked() {
                            return;
                        }

                        if key.len() == 32 {
                            let bs58_key = bs58::encode(&key).into_string();
                            let public_key_str = format!("ed25519:{}", bs58_key);
                            if let Ok(public_key) = public_key_str
                                .parse::<near_min_api::types::near_crypto::PublicKey>(
                            ) {
                                set_ledger_current_key_data(Some((
                                    path.clone(),
                                    public_key.clone(),
                                )));
                                set_ledger_error.set(None);
                            } else {
                                set_ledger_error.set(Some(
                                    "Failed to parse public key from Ledger".to_string(),
                                ));
                            }
                        } else {
                            set_ledger_error
                                .set(Some("Invalid public key length from Ledger".to_string()));
                        }
                    }
                    JsWalletResponse::LedgerConnectError { error } => {
                        set_ledger_connection_in_progress(false);
                        set_ledger_connected(false);
                        set_ledger_error.set(Some(format_ledger_error(&error)));
                    }
                    JsWalletResponse::LedgerGetPublicKeyError { error } => {
                        set_ledger_getting_public_key(false);
                        set_ledger_error.set(Some(format_ledger_error(&error)));
                    }
                    _ => {}
                }
            }
        },
    );

    let terminate_sessions = move |_| {
        let Some(account_id) = accounts_context.accounts.get().selected_account_id else {
            log::error!("No account selected");
            return;
        };

        set_terminating_sessions(true);

        let account = accounts_context
            .accounts
            .get_untracked()
            .accounts
            .into_iter()
            .find(|acc| acc.account_id == account_id)
            .expect("Account not found");
        let is_ledger = matches!(account.secret_key, SecretKeyHolder::Ledger { .. });

        let Some(mnemonic) = new_mnemonic.get_untracked() else {
            set_terminating_sessions(false);
            return;
        };

        let rpc_client = rpc_context.client.get();
        spawn_local(async move {
            let mut delete_actions = Vec::new();
            let keys = match rpc_client
                .view_access_key_list(account_id.clone(), QueryFinality::Finality(Finality::Final))
                .await
            {
                Ok(keys) => keys,
                Err(e) => {
                    log::error!("Error fetching access key list: {e:?}");
                    set_terminating_sessions(false);
                    return;
                }
            };

            let current_public_key = account.secret_key.public_key();

            for key in keys.keys {
                if matches!(
                    key.access_key.permission,
                    AccessKeyPermissionView::FullAccess
                ) {
                    // For Ledger accounts, keep the current key, delete all others
                    // For non-Ledger accounts, delete all keys (will add new one later)
                    if !is_ledger || key.public_key != current_public_key {
                        delete_actions.push(Action::DeleteKey(Box::new(DeleteKeyAction {
                            public_key: key.public_key,
                        })));
                    }
                }
            }

            let mut actions = delete_actions;

            let intents_transactions = match network.get() {
                Network::Mainnet => {
                    match rpc_client
                        .call::<Vec<PublicKey>>(
                            "intents.near".parse().unwrap(),
                            "public_keys_of",
                            serde_json::json!({
                                "account_id": account_id,
                            }),
                            QueryFinality::Finality(Finality::Final),
                        )
                        .await
                    {
                        Ok(keys) => {
                            // If the user has more than 30 keys, we need to split the actions into
                            // chunks of 30 because of 300 TGas per-transaction limit
                            if !keys.is_empty() {
                                let actions: Vec<Vec<Action>> = keys
                                    .into_iter()
                                    .map(|key| {
                                        Action::FunctionCall(Box::new(FunctionCallAction {
                                            method_name: "remove_public_key".to_string(),
                                            args: serde_json::json!({
                                                "public_key": key,
                                            })
                                            .to_string()
                                            .into_bytes(),
                                            gas: NearGas::from_tgas(10).as_gas(),
                                            deposit: NearToken::from_yoctonear(1),
                                        }))
                                    })
                                    .collect::<Vec<_>>()
                                    .chunks(30)
                                    .map(|chunk| chunk.to_vec())
                                    .collect();
                                Some(actions)
                            } else {
                                None
                            }
                        }
                        _ => None,
                    }
                }
                Network::Testnet => None,
                Network::Localnet { .. } => None,
            };

            if is_ledger {
                // For Ledger accounts, just remove other keys, keep current one
                add_security_log(
                    format!(
                        "Terminated all other sessions for Ledger account {account_id}: Removed {} other keys, kept current Ledger key {}",
                        actions.len(),
                        current_public_key
                    ),
                    account_id.clone(),
                    accounts_context,
                );
            } else {
                let secret_key = mnemonic_to_key(mnemonic.clone()).unwrap();
                let public_key = secret_key.public_key();

                let add_action = Action::AddKey(Box::new(AddKeyAction {
                    access_key: AccessKey {
                        nonce: 0,
                        permission: AccessKeyPermission::FullAccess,
                    },
                    public_key: public_key.clone(),
                }));

                actions.push(add_action);

                add_security_log(
                    format!(
                        "Terminated all other sessions for account {account_id}: Added key {secret_key} (public key: {public_key}) and removed keys {}. Previous key that the wallet was using was {}",
                        serde_json::to_string(&actions).unwrap(),
                        account.secret_key
                    ),
                    account_id.clone(),
                    accounts_context,
                );
            }

            let (details_receiver, replace_key_transaction) = EnqueuedTransaction::create(
                "Terminate other sessions".to_string(),
                account_id.clone(),
                account_id.clone(),
                actions,
            );
            if let Some(intents_transactions) = intents_transactions {
                let intents_transactions = intents_transactions
                    .into_iter()
                    .map(|intents_actions| {
                        let (_intents_details_receiver, intents_transaction) =
                            EnqueuedTransaction::create(
                                "Remove Near Intents keys".to_string(),
                                account_id.clone(),
                                "intents.near".parse().unwrap(),
                                intents_actions,
                            );

                        intents_transaction.in_same_queue_as(&replace_key_transaction)
                    })
                    .collect::<Vec<_>>();
                add_transaction.update(|queue| {
                    queue.extend(
                        intents_transactions
                            .into_iter()
                            .chain(std::iter::once(replace_key_transaction)),
                    )
                });
            } else {
                add_transaction.update(|queue| queue.push(replace_key_transaction));
            }

            let res = details_receiver.await;
            if matches!(res, Ok(Ok(_))) && !is_ledger {
                let secret_key = mnemonic_to_key(mnemonic.clone()).unwrap();
                accounts_context.set_accounts.update(|accounts| {
                    for acc in accounts.accounts.iter_mut() {
                        if acc.account_id == account_id {
                            acc.secret_key = SecretKeyHolder::SecretKey(secret_key.clone());
                            acc.seed_phrase = Some(mnemonic.to_string());
                        }
                    }
                });
            }
            set_timeout(
                move || set_terminating_sessions(false),
                Duration::from_secs(2),
            );
        });
    };

    let generate_new_mnemonic = move || {
        let mnemonic = bip39::Mnemonic::generate(12).unwrap();
        set_new_mnemonic(Some(mnemonic));
        set_copied_to_clipboard(false);
    };

    let is_ledger_account = move || {
        let accs = accounts_context.accounts.get();
        if let Some(selected_id) = &accs.selected_account_id
            && let Some(account) = accs.accounts.iter().find(|a| &a.account_id == selected_id)
        {
            return matches!(account.secret_key, SecretKeyHolder::Ledger { .. });
        }
        false
    };

    let check_ledger_keys = move || {
        if !is_ledger_account() {
            set_ledger_is_only_key(false);
            return;
        }

        let Some(account_id) = accounts_context.accounts.get().selected_account_id else {
            return;
        };

        let account = accounts_context
            .accounts
            .get()
            .accounts
            .into_iter()
            .find(|acc| acc.account_id == account_id)
            .expect("Account not found");

        let current_public_key = account.secret_key.public_key();
        let rpc_client = rpc_context.client.get();

        set_checking_keys(true);
        spawn_local(async move {
            match rpc_client
                .view_access_key_list(account_id, QueryFinality::Finality(Finality::Final))
                .await
            {
                Ok(keys) => {
                    let full_access_keys: Vec<_> = keys
                        .keys
                        .into_iter()
                        .filter(|key| {
                            matches!(
                                key.access_key.permission,
                                AccessKeyPermissionView::FullAccess
                            )
                        })
                        .collect();

                    // Check if there's only one full access key and it's the current Ledger key
                    let is_only_key = full_access_keys.len() == 1
                        && full_access_keys[0].public_key == current_public_key;

                    set_ledger_is_only_key(is_only_key);
                }
                Err(err) => {
                    log::error!("Failed to fetch access key list: {}", err);
                    set_ledger_is_only_key(false);
                }
            }
            set_checking_keys(false);
        });
    };

    // Check ledger keys when account changes
    Effect::new(move || {
        accounts_context.accounts.track();
        check_ledger_keys();
    });

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

                    <Show when=move || {
                        show_secrets.get()
                    }>
                        {move || {
                            match accounts_context
                                .accounts
                                .get()
                                .selected_account_id
                                .as_ref()
                                .and_then(|id| {
                                    accounts_context
                                        .accounts
                                        .get()
                                        .accounts
                                        .into_iter()
                                        .find(|acc| &acc.account_id == id)
                                })
                            {
                                Some(account) => {
                                    match &account.secret_key {
                                        SecretKeyHolder::Ledger { path, public_key: _ } => {
                                            view! {
                                                <div class="p-4 rounded-lg bg-amber-950/30 border border-amber-700/30">
                                                    <div class="flex items-center gap-2 mb-2">
                                                        <Icon
                                                            icon=icondata::LuInfo
                                                            width="16"
                                                            height="16"
                                                            attr:class="text-amber-400"
                                                        />
                                                        <span class="text-amber-400 font-medium">
                                                            Ledger Account
                                                        </span>
                                                    </div>
                                                    <div class="text-sm text-amber-200 mb-3">
                                                        "This account is managed by a Ledger hardware wallet. To export the account to a different wallet, connect the other wallet to the same Ledger device and enter the same derivation path."
                                                    </div>
                                                    <div class="text-sm text-amber-300">
                                                        "Derivation path: "
                                                        <span class="font-mono">{path.clone()}</span>
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                        SecretKeyHolder::SecretKey(secret_key) => {
                                            let seed_phrase_exists = account.seed_phrase.is_some();
                                            view! {
                                                <div class="p-4 rounded-lg bg-neutral-900">
                                                    <div class="flex items-center justify-between">
                                                        <div class="text-sm text-neutral-400">
                                                            Your seed phrase:
                                                        </div>
                                                        <Show when=move || seed_phrase_exists>
                                                            <button
                                                                on:click=copy_seed
                                                                class="flex items-center gap-2 px-3 py-1 text-sm rounded-t bg-neutral-800 hover:bg-neutral-700 transition-colors"
                                                            >
                                                                <Icon icon=icondata::LuCopy width="16" height="16" />
                                                                <span>
                                                                    {move || {
                                                                        if copied_seed.get() { "Copied!" } else { "Copy" }
                                                                    }}
                                                                </span>
                                                            </button>
                                                        </Show>
                                                    </div>
                                                    <div class="font-mono text-sm p-3 rounded bg-neutral-800">
                                                        {match &account.seed_phrase {
                                                            Some(seed) => view! { <div>{seed.clone()}</div> }.into_any(),
                                                            None => {
                                                                view! {
                                                                    <div class="text-neutral-400">
                                                                        "Seed phrase for this account is unknown. Most likely, because you imported this account using a private key."
                                                                    </div>
                                                                }
                                                                    .into_any()
                                                            }
                                                        }}
                                                    </div>
                                                </div>

                                                <div class="p-4 rounded-lg bg-neutral-900">
                                                    <div class="flex items-center justify-between">
                                                        <div class="text-sm text-neutral-400">
                                                            Your private key:
                                                        </div>
                                                        <button
                                                            on:click=copy_key
                                                            class="flex items-center gap-2 px-3 py-1 text-sm rounded-t bg-neutral-800 hover:bg-neutral-700 transition-colors"
                                                        >
                                                            <Icon icon=icondata::LuCopy width="16" height="16" />
                                                            <span>
                                                                {move || {
                                                                    if copied_key.get() { "Copied!" } else { "Copy" }
                                                                }}
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <div class="font-mono text-sm p-3 rounded bg-neutral-800 break-all">
                                                        {secret_key.to_string()}
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }
                                }
                                None => {
                                    view! {
                                        <div class="p-4 rounded-lg bg-red-950/30 border border-red-700/30">
                                            <div class="text-red-400">"No account selected"</div>
                                        </div>
                                    }
                                        .into_any()
                                }
                            }
                        }}
                    </Show>
                </div>
            </div>

            // Ledger section
            {move || {
                let is_ledger_account = accounts_context
                    .accounts
                    .get()
                    .selected_account_id
                    .as_ref()
                    .and_then(|id| {
                        accounts_context
                            .accounts
                            .get()
                            .accounts
                            .into_iter()
                            .find(|acc| &acc.account_id == id)
                    })
                    .map(|acc| matches!(acc.secret_key, SecretKeyHolder::Ledger { .. }))
                    .unwrap_or(false);
                if is_ledger_account {
                    view! {
                        <button
                            on:click=move |_| {
                                let Some(selected_account_id) = accounts_context
                                    .accounts
                                    .get_untracked()
                                    .selected_account_id else {
                                    return;
                                };
                                let new_mnemonic = Mnemonic::generate(12).unwrap();
                                let Some(new_secret_key) = mnemonic_to_key(new_mnemonic.clone())
                                else {
                                    log::error!("Failed to derive key from new mnemonic");
                                    return;
                                };
                                let new_public_key = new_secret_key.public_key();
                                let rpc_client = rpc_context.client.get_untracked();
                                let new_mnemonic_string = new_mnemonic.to_string();
                                spawn_local(async move {
                                    match rpc_client
                                        .view_access_key_list(
                                            selected_account_id.clone(),
                                            QueryFinality::Finality(Finality::Final),
                                        )
                                        .await
                                    {
                                        Ok(keys) => {
                                            let mut actions: Vec<Action> = Vec::new();
                                            for key_info in keys.keys {
                                                if matches!(
                                                    key_info.access_key.permission,
                                                    AccessKeyPermissionView::FullAccess
                                                ) {
                                                    actions
                                                        .push(
                                                            Action::DeleteKey(
                                                                Box::new(DeleteKeyAction {
                                                                    public_key: key_info.public_key,
                                                                }),
                                                            ),
                                                        );
                                                }
                                            }
                                            actions
                                                .push(
                                                    Action::AddKey(
                                                        Box::new(AddKeyAction {
                                                            public_key: new_public_key.clone(),
                                                            access_key: AccessKey {
                                                                nonce: 0,
                                                                permission: AccessKeyPermission::FullAccess,
                                                            },
                                                        }),
                                                    ),
                                                );
                                            let (receiver, transaction) = EnqueuedTransaction::create(
                                                "Disconnect Ledger".to_string(),
                                                selected_account_id.clone(),
                                                selected_account_id.clone(),
                                                actions,
                                            );
                                            add_transaction.update(|q| q.push(transaction));
                                            match receiver.await {
                                                Ok(Ok(_details)) => {
                                                    accounts_context
                                                        .set_accounts
                                                        .update(|accts| {
                                                            for acc in accts.accounts.iter_mut() {
                                                                if acc.account_id == selected_account_id {
                                                                    acc.secret_key = SecretKeyHolder::SecretKey(
                                                                        new_secret_key.clone(),
                                                                    );
                                                                    acc.seed_phrase = Some(new_mnemonic_string.clone());
                                                                }
                                                            }
                                                        });
                                                    add_security_log(
                                                        format!(
                                                            "Disconnected Ledger. New public key: {}, private key: {}",
                                                            new_public_key,
                                                            new_secret_key,
                                                        ),
                                                        selected_account_id.clone(),
                                                        accounts_context,
                                                    );
                                                }
                                                Ok(Err(err)) => {
                                                    log::error!("Failed to disconnect Ledger: {}", err);
                                                }
                                                Err(_) => {
                                                    log::error!("Failed to receive transaction result");
                                                }
                                            }
                                        }
                                        Err(err) => {
                                            log::error!(
                                                "Failed to fetch access key list for Ledger disconnect: {}",
                                                    err
                                            );
                                        }
                                    }
                                });
                            }
                            class="flex items-center justify-center gap-2 p-4 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 transition-colors font-medium cursor-pointer"
                        >
                            <Icon icon=icondata::LuUnlink width="20" height="20" />
                            <span>"Disconnect Ledger"</span>
                        </button>
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="space-y-4">
                            <Show when=move || !ledger_connected.get()>
                                <button
                                    on:click=move |_| request_ledger_connection()
                                    class="flex items-center justify-center gap-2 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
                                    disabled=move || ledger_connection_in_progress.get()
                                >
                                    <Show when=move || ledger_connection_in_progress.get()>
                                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                                        <span>"Connecting Ledger..."</span>
                                    </Show>
                                    <Show when=move || !ledger_connection_in_progress.get()>
                                        <Icon icon=icondata::LuWallet width="20" height="20" />
                                        <span>"Connect Ledger"</span>
                                    </Show>
                                </button>
                            </Show>

                            <Show when=move || ledger_connected.get()>
                                <div class="space-y-4">
                                    <DerivationPathInput
                                        ledger_account_number=ledger_account_number
                                        set_ledger_account_number=set_ledger_account_number
                                        ledger_change_number=ledger_change_number
                                        set_ledger_change_number=set_ledger_change_number
                                        ledger_address_number=ledger_address_number
                                        set_ledger_address_number=set_ledger_address_number
                                        on_change=on_path_change.into()
                                    />

                                    <Show when=move || ledger_error.get().is_some()>
                                        <div class="p-4 bg-red-950/30 border border-red-700/30 rounded-lg">
                                            <div class="flex items-center gap-2 text-red-400">
                                                <Icon
                                                    icon=icondata::LuTriangleAlert
                                                    width="20"
                                                    height="20"
                                                />
                                                <span class="font-medium">"Error"</span>
                                            </div>
                                            <p class="text-red-300 text-sm mt-2">
                                                {move || ledger_error.get().unwrap_or_default()}
                                            </p>
                                        </div>
                                    </Show>

                                    <Show when=move || ledger_current_key_data.get().is_none()>
                                        <button
                                            on:click=move |_| {
                                                set_ledger_getting_public_key(true);
                                                set_ledger_current_key_data.set(None);
                                                set_ledger_error.set(None);
                                                let path = ledger_input_hd_path_input.get_untracked();
                                                let ledger_mode = config_context
                                                    .config
                                                    .get_untracked()
                                                    .ledger_mode;
                                                let request = JsWalletRequest::LedgerGetPublicKey {
                                                    path,
                                                    mode: ledger_mode,
                                                };
                                                match serde_wasm_bindgen::to_value(&request) {
                                                    Ok(js_value) => {
                                                        let origin = window()
                                                            .location()
                                                            .origin()
                                                            .unwrap_or_else(|_| "*".to_string());
                                                        if window().post_message(&js_value, &origin).is_err() {
                                                            set_ledger_error
                                                                .set(
                                                                    Some("Failed to send Ledger public key request".to_string()),
                                                                );
                                                            set_ledger_getting_public_key(false);
                                                        }
                                                    }
                                                    _ => {
                                                        set_ledger_error
                                                            .set(
                                                                Some(
                                                                    "Failed to serialize Ledger public key request".to_string(),
                                                                ),
                                                            );
                                                        set_ledger_getting_public_key(false);
                                                    }
                                                }
                                            }
                                            class="w-full flex items-center justify-center gap-2 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled=move || ledger_getting_public_key.get()
                                        >
                                            <Show when=move || ledger_getting_public_key.get()>
                                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                                                <span>"Confirm in Ledger..."</span>
                                            </Show>
                                            <Show when=move || !ledger_getting_public_key.get()>
                                                <Icon icon=icondata::LuKey width="20" height="20" />
                                                <span>"Get Public Key"</span>
                                            </Show>
                                        </button>
                                    </Show>

                                    <Show when=move || ledger_current_key_data.get().is_some()>
                                        <button
                                            on:click=move |_| {
                                                let Some((path, public_key)) = ledger_current_key_data.get()
                                                else {
                                                    return;
                                                };
                                                let rpc_client = rpc_context.client.get_untracked();
                                                let selected_account_id_opt = accounts_context
                                                    .accounts
                                                    .get_untracked()
                                                    .selected_account_id
                                                    .clone();
                                                spawn_local(async move {
                                                    let Some(selected_account_id) = selected_account_id_opt
                                                    else {
                                                        return;
                                                    };
                                                    match rpc_client
                                                        .view_access_key_list(
                                                            selected_account_id.clone(),
                                                            QueryFinality::Finality(Finality::Final),
                                                        )
                                                        .await
                                                    {
                                                        Ok(keys) => {
                                                            let mut actions: Vec<Action> = Vec::new();
                                                            for key_info in keys.keys {
                                                                if matches!(
                                                                    key_info.access_key.permission,
                                                                    AccessKeyPermissionView::FullAccess
                                                                ) {
                                                                    actions
                                                                        .push(
                                                                            Action::DeleteKey(
                                                                                Box::new(DeleteKeyAction {
                                                                                    public_key: key_info.public_key,
                                                                                }),
                                                                            ),
                                                                        );
                                                                }
                                                            }
                                                            actions
                                                                .push(
                                                                    Action::AddKey(
                                                                        Box::new(AddKeyAction {
                                                                            public_key: public_key.clone(),
                                                                            access_key: AccessKey {
                                                                                nonce: 0,
                                                                                permission: AccessKeyPermission::FullAccess,
                                                                            },
                                                                        }),
                                                                    ),
                                                                );
                                                            let (receiver, transaction) = EnqueuedTransaction::create(
                                                                "Connect Ledger".to_string(),
                                                                selected_account_id.clone(),
                                                                selected_account_id.clone(),
                                                                actions,
                                                            );
                                                            add_transaction.update(|q| q.push(transaction));
                                                            match receiver.await {
                                                                Ok(Ok(_details)) => {
                                                                    accounts_context
                                                                        .set_accounts
                                                                        .update(|accts| {
                                                                            for acc in accts.accounts.iter_mut() {
                                                                                if acc.account_id == selected_account_id {
                                                                                    acc.secret_key = SecretKeyHolder::Ledger {
                                                                                        path: path.clone(),
                                                                                        public_key: public_key.clone(),
                                                                                    };
                                                                                    acc.seed_phrase = None;
                                                                                }
                                                                            }
                                                                        });
                                                                    add_security_log(
                                                                        format!(
                                                                            "Connected Ledger (path {}) public key {}",
                                                                            path,
                                                                            public_key,
                                                                        ),
                                                                        selected_account_id.clone(),
                                                                        accounts_context,
                                                                    );
                                                                }
                                                                Ok(Err(err)) => {
                                                                    log::error!(
                                                                        "Failed to connect Ledger: {}",
                                                                        err
                                                                    );
                                                                }
                                                                Err(_) => {
                                                                    log::error!("Failed to receive transaction result");
                                                                }
                                                            }
                                                        }
                                                        Err(err) => {
                                                            log::error!(
                                                                "Failed to fetch access key list for Ledger connect: {}",
                                                                err
                                                            );
                                                        }
                                                    }
                                                });
                                            }
                                            class="w-full flex items-center justify-center gap-2 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors font-medium cursor-pointer"
                                        >
                                            <Icon icon=icondata::LuCheck width="20" height="20" />
                                            <span>"Complete Ledger Connection"</span>
                                        </button>
                                    </Show>
                                </div>
                            </Show>
                        </div>
                    }
                        .into_any()
                }
            }}

            // Smart Wallet Version section
            <Show when=move || {
                let is_ledger = accounts_context
                    .accounts
                    .get()
                    .selected_account_id
                    .as_ref()
                    .and_then(|id| {
                        accounts_context
                            .accounts
                            .get()
                            .accounts
                            .into_iter()
                            .find(|acc| &acc.account_id == id)
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
                                                            if let Some(selected_account_id) = accounts_context
                                                                .accounts
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
                                                            icon=icondata::LuTriangleAlert
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
                                                                    if let Some(selected_account_id) = accounts_context
                                                                        .accounts
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
                accounts_context
                    .accounts
                    .get()
                    .selected_account_id
                    .as_ref()
                    .and_then(|id| {
                        accounts_context
                            .accounts
                            .get()
                            .accounts
                            .into_iter()
                            .find(|acc| &acc.account_id == id)
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
                                                        if let Some(selected_account_id) = accounts_context
                                                            .accounts
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
                                                                                        accounts_context,
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
                                                                if let Some(account) = accounts_context
                                                                    .accounts
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
                                                                    match serde_wasm_bindgen::to_value(&request) {
                                                                        Ok(js_value) => {
                                                                            let origin = window()
                                                                                .location()
                                                                                .origin()
                                                                                .unwrap_or_else(|_| "*".to_string());
                                                                            if window().post_message(&js_value, &origin).is_err() {
                                                                                log::error!("Failed to send signature request");
                                                                                set_recovery_change_in_progress(false);
                                                                            }
                                                                        }
                                                                        _ => {
                                                                            log::error!("Failed to serialize signature request");
                                                                            set_recovery_change_in_progress(false);
                                                                        }
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
                                                        if let Some(selected_account_id) = accounts_context
                                                            .accounts
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
                                                                                        accounts_context,
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
                                                                if let Some(account) = accounts_context
                                                                    .accounts
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
                                                                    match serde_wasm_bindgen::to_value(&request) {
                                                                        Ok(js_value) => {
                                                                            let origin = window()
                                                                                .location()
                                                                                .origin()
                                                                                .unwrap_or_else(|_| "*".to_string());
                                                                            if window().post_message(&js_value, &origin).is_err() {
                                                                                log::error!("Failed to send Solana signature request");
                                                                                set_recovery_change_in_progress(false);
                                                                            }
                                                                        }
                                                                        _ => {
                                                                            log::error!("Failed to serialize Solana signature request");
                                                                            set_recovery_change_in_progress(false);
                                                                        }
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

            // Bettear Bot section
            <Show when=move || {
                network.get() == Network::Mainnet
                    && accounts_context
                        .accounts
                        .get()
                        .selected_account_id
                        .as_ref()
                        .map(|id| id.as_str().ends_with(BETTEAR_BOT_ACCOUNT_SUFFIX))
                        .unwrap_or(false)
            }>
                <Suspense fallback=move || {
                    view! {
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center justify-between">
                                    <div class="text-lg font-medium">"Bettear Bot"</div>
                                    <img
                                        src="/bettearbot-small.webp"
                                        alt="BettearBot"
                                        class="w-16 h-16 shrink-0"
                                    />
                                </div>
                                <div class="text-sm text-neutral-400">
                                    "Control whether your account is accessible to BettearBot, or take full custody of it to use as a normal wallet"
                                </div>
                            </div>

                            <button
                                class="flex items-center justify-center gap-2 p-4 rounded-lg transition-colors font-medium opacity-50 cursor-not-allowed bg-neutral-800"
                                disabled=move || bettear_bot_change_in_progress.get()
                            >
                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                <span>"Loading..."</span>
                            </button>
                        </div>
                    }
                }>
                    {move || {
                        bettear_bot_key_status
                            .get()
                            .map(|has_key| {
                                view! {
                                    <div class="flex flex-col gap-4">
                                        <div class="flex flex-col gap-2">
                                            <div class="flex items-center justify-between">
                                                <div class="text-lg font-medium">"Bettear Bot"</div>
                                                <img
                                                    src="/bettearbot-small.webp"
                                                    alt="BettearBot"
                                                    class="w-16 h-16 shrink-0"
                                                />
                                            </div>
                                            <div class="text-sm text-neutral-400">
                                                "Control whether your account is accessible to BettearBot, or take full custody of it to use as a normal wallet"
                                            </div>
                                        </div>

                                        <button
                                            on:click=move |_| {
                                                if bettear_bot_change_in_progress.get_untracked() {
                                                    return;
                                                }
                                                let Some(selected_account_id) = accounts_context
                                                    .accounts
                                                    .get_untracked()
                                                    .selected_account_id else {
                                                    return;
                                                };
                                                set_bettear_bot_change_in_progress(true);
                                                spawn_local(async move {
                                                    let actions = if has_key {
                                                        vec![
                                                            Action::DeleteKey(
                                                                Box::new(DeleteKeyAction {
                                                                    public_key: BETTEAR_BOT_PUBLIC_KEY.parse().unwrap(),
                                                                }),
                                                            ),
                                                        ]
                                                    } else {
                                                        vec![
                                                            Action::AddKey(
                                                                Box::new(AddKeyAction {
                                                                    public_key: BETTEAR_BOT_PUBLIC_KEY.parse().unwrap(),
                                                                    access_key: AccessKey {
                                                                        nonce: 0,
                                                                        permission: AccessKeyPermission::FullAccess,
                                                                    },
                                                                }),
                                                            ),
                                                        ]
                                                    };
                                                    let (receiver, transaction) = EnqueuedTransaction::create(
                                                        if has_key {
                                                            "Unlink Bettear Bot".to_string()
                                                        } else {
                                                            "Link Bettear Bot".to_string()
                                                        },
                                                        selected_account_id.clone(),
                                                        selected_account_id.clone(),
                                                        actions,
                                                    );
                                                    add_transaction.update(|queue| queue.push(transaction));
                                                    match receiver.await {
                                                        Ok(Ok(_details)) => {
                                                            add_security_log(
                                                                if has_key {
                                                                    "Unlinked Bettear Bot".to_string()
                                                                } else {
                                                                    "Linked Bettear Bot".to_string()
                                                                },
                                                                selected_account_id.clone(),
                                                                accounts_context,
                                                            );
                                                            log::info!(
                                                                "Successfully {} Bettear Bot", if has_key { "unlinked" } else { "linked" }
                                                            );
                                                            bettear_bot_key_status.refetch();
                                                            set_bettear_bot_change_in_progress(false);
                                                        }
                                                        Ok(Err(err)) => {
                                                            log::error!(
                                                                "Failed to {} Bettear Bot: {}", if has_key { "unlink" } else { "link" }, err
                                                            );
                                                            set_bettear_bot_change_in_progress(false);
                                                        }
                                                        Err(_) => {
                                                            log::error!("Failed to receive transaction result");
                                                            set_bettear_bot_change_in_progress(false);
                                                        }
                                                    }
                                                });
                                            }
                                            class=move || {
                                                let in_progress = bettear_bot_change_in_progress.get();
                                                format!(
                                                    "flex items-center justify-center gap-2 p-4 rounded-lg transition-colors font-medium cursor-pointer {}",
                                                    if in_progress {
                                                        "opacity-50 cursor-not-allowed bg-neutral-800"
                                                    } else if has_key {
                                                        "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                                    } else {
                                                        "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                                                    },
                                                )
                                            }
                                            disabled=move || bettear_bot_change_in_progress.get()
                                        >
                                            <Show when=move || bettear_bot_change_in_progress.get()>
                                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                                <span>"Processing..."</span>
                                            </Show>
                                            <Show when=move || !bettear_bot_change_in_progress.get()>
                                                <Show when=move || has_key>
                                                    <Icon icon=icondata::LuUnlink width="20" height="20" />
                                                    <span>"Unlink"</span>
                                                </Show>
                                                <Show when=move || !has_key>
                                                    <Icon icon=icondata::LuLink width="20" height="20" />
                                                    <span>"Link"</span>
                                                </Show>
                                            </Show>
                                        </button>
                                    </div>
                                }
                                    .into_any()
                            })
                    }}
                </Suspense>
            </Show>
        </div>

        // Create Subaccount section
        <div class="flex flex-col gap-4 p-4">
            <button
                on:click=move |_| {
                    let current_account_id = accounts_context
                        .accounts
                        .get()
                        .selected_account_id
                        .unwrap();
                    let current_account = accounts_context
                        .accounts
                        .get()
                        .accounts
                        .into_iter()
                        .find(|acc| acc.account_id == current_account_id)
                        .unwrap();
                    account_selector_context
                        .set_modal_state
                        .set(ModalState::Creating {
                            parent: AccountCreateParent::SubAccount(
                                current_account.network,
                                current_account.account_id,
                            ),
                            recovery_method: AccountCreateRecoveryMethod::RecoveryPhrase,
                        });
                    log::info!("Creating subaccount");
                    account_selector_context.set_expanded.set(true);
                }
                class="flex items-center justify-center gap-2 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors font-medium cursor-pointer"
            >
                <Icon icon=icondata::LuPlus width="20" height="20" />
                <span>"Create Subaccount"</span>
            </button>
        </div>

        <div class="flex flex-col gap-4 p-4">
            <div class="text-lg font-medium">
                {move || {
                    if is_ledger_account() {
                        "Access Key Management"
                    } else {
                        "Terminate All Other Sessions"
                    }
                }}
            </div>
            <div class="text-sm text-neutral-400">
                {move || {
                    if is_ledger_account() {
                        "This will remove all other access keys from your account, keeping only the current Ledger key. This will make your Ledger the only way to access this account."
                    } else {
                        "This will log you out of all devices / wallets other than this one."
                    }
                }}
            </div>

            <Show when=move || is_ledger_account() && ledger_is_only_key.get()>
                <div class="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                    <Icon icon=icondata::LuCircleCheck width="16" height="16" />
                    <span class="text-sm">
                        "Your Ledger is already the only access key for this account"
                    </span>
                </div>
            </Show>
            <button
                class=move || {
                    let is_disabled = terminating_sessions.get() || checking_keys.get()
                        || (is_ledger_account() && ledger_is_only_key.get());
                    if is_disabled {
                        "flex items-center justify-center gap-2 p-4 rounded-lg bg-neutral-500/10 text-neutral-500 transition-colors opacity-50 cursor-not-allowed"
                    } else {
                        "flex items-center justify-center gap-2 p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                    }
                }
                disabled=move || {
                    terminating_sessions.get() || checking_keys.get()
                        || (is_ledger_account() && ledger_is_only_key.get())
                }
                on:click=move |_| {
                    set_is_confirmed(false);
                    generate_new_mnemonic();
                    modal
                        .set(
                            Some(
                                Box::new(move || {
                                    view! {
                                        <TerminateSessionsModal
                                            is_ledger_account=is_ledger_account
                                            terminate_sessions=terminate_sessions
                                            new_mnemonic=new_mnemonic
                                            set_new_mnemonic=set_new_mnemonic
                                            copied_to_clipboard=copied_to_clipboard
                                            set_copied_to_clipboard=set_copied_to_clipboard
                                            is_confirmed=is_confirmed
                                            set_is_confirmed=set_is_confirmed
                                            terminating_sessions=terminating_sessions
                                            generate_new_mnemonic=generate_new_mnemonic
                                        />
                                    }
                                        .into_any()
                                }),
                            ),
                        );
                }
            >
                <Show when=move || !terminating_sessions.get()>
                    <Icon icon=icondata::LuLogOut width="20" height="20" />
                    <span>
                        {move || {
                            if is_ledger_account() {
                                "Remove Other Access Keys"
                            } else {
                                "Terminate All Other Sessions"
                            }
                        }}
                    </span>
                </Show>
                <Show when=move || terminating_sessions.get()>
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                    <span>"Terminating..."</span>
                </Show>
                <Show when=move || checking_keys.get()>
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-500"></div>
                    <span>"Checking keys..."</span>
                </Show>
            </button>
        </div>

        // Log Out section
        <div class="flex flex-col gap-4 p-4">
            <div class="text-lg font-medium">"Log Out"</div>
            <div class="text-sm text-neutral-400">
                "This will log you out of your account on this device. Make sure to export your seed phrase or private key somewhere safe."
            </div>
            <button
                on:click=move |_| {
                    accounts_context
                        .set_accounts
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
                                    accounts_context,
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
