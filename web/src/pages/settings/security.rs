use std::time::Duration;

use crate::{
    components::{account_selector::mnemonic_to_key, DangerConfirmInput},
    contexts::{
        accounts_context::{
            AccountsContext, PasswordAction, SecretKeyHolder, ENCRYPTION_MEMORY_COST_KB,
        },
        config_context::{ConfigContext, PasswordRememberDuration},
        rpc_context::RpcContext,
        security_log_context::add_security_log,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
};
use argon2::{Argon2, ParamsBuilder};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_location;
use near_min_api::{
    types::{
        AccessKey, AccessKeyPermission, AccessKeyPermissionView, Action, AddKeyAction,
        DeleteKeyAction, Finality,
    },
    QueryFinality,
};
use rand::{rngs::OsRng, RngCore};
use wasm_bindgen_futures;
use web_sys::js_sys::{Object, Reflect};

const MIN_ROUNDS: u32 = 2;

#[allow(clippy::float_arithmetic)] // Not an important calculation
fn format_bytes(bytes: u64) -> String {
    const TB: u64 = 1024u64.pow(4);
    const GB: u64 = 1024u64.pow(3);
    const MB: u64 = 1024u64.pow(2);
    const KB: u64 = 1024u64;

    if bytes >= TB {
        format!("{:.2} TB", bytes as f64 / TB as f64)
    } else if bytes >= GB {
        format!("{:.2} GB", bytes as f64 / GB as f64)
    } else if bytes >= MB {
        format!("{:.2} MB", bytes as f64 / MB as f64)
    } else if bytes >= KB {
        format!("{:.0} KB", bytes as f64 / KB as f64)
    } else {
        format!("{} bytes", bytes)
    }
}

fn is_chrome_or_safari() -> bool {
    let user_agent = window().navigator().user_agent().unwrap_or_default();
    user_agent.contains("Chrome")
        || user_agent.contains("Chromium")
        || user_agent.contains("Edge")
        || user_agent.contains("Safari")
}

#[allow(clippy::float_arithmetic)] // Nanoseconds for benchmarking is not precision-critical
async fn benchmark_argon2() -> (u32, f64) {
    let benchmark_salt = &[69; 32];
    let mut best_rounds = 1u32;
    let mut actual_duration = 0.0;

    // Start from 1 round and increase until we exceed target time
    let mut rounds = 1u32;
    loop {
        let params = ParamsBuilder::new()
            .m_cost(ENCRYPTION_MEMORY_COST_KB)
            .t_cost(rounds)
            .p_cost(1)
            .build()
            .unwrap();

        let argon2 = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);

        let start = window().performance().unwrap().now();
        let mut key = [0u8; 32];
        if argon2
            .hash_password_into(b"Test", benchmark_salt, &mut key)
            .await
            .is_ok()
        {
            let end = window().performance().unwrap().now();
            let duration_ms = end - start;

            if actual_duration == 0.0 {
                actual_duration = duration_ms;
                best_rounds = rounds;
            }

            // 250ms on fast devices, 400ms on slow devices
            let single_round_duration = duration_ms / rounds as f64;
            let single_round_duration_confident = rounds > 4;
            let target_duration = if single_round_duration_confident {
                if single_round_duration < 30.0 {
                    250.0
                } else if single_round_duration < 50.0 {
                    325.0
                } else {
                    400.0
                }
            } else {
                400.0
            };
            if duration_ms <= target_duration || rounds < MIN_ROUNDS {
                best_rounds = rounds;
                actual_duration = duration_ms;
                if duration_ms < target_duration / 3.0 {
                    rounds *= 2;
                } else if duration_ms < target_duration / 1.5 {
                    rounds += 2;
                } else {
                    rounds += 1;
                }
            } else {
                break;
            }
        } else {
            break;
        }
    }

    (best_rounds, actual_duration)
}

#[component]
pub fn SecuritySettings() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let (terminating_sessions, set_terminating_sessions) = signal(false);
    let (show_terminate_dialog, set_show_terminate_dialog) = signal(false);
    let (benchmarking_password, set_benchmarking_password) = signal(false);
    let (password_input, set_password_input) = signal(String::new());
    let (benchmark_result, set_benchmark_result) = signal::<Option<(u32, f64)>>(None);
    let (encrypting_accounts, set_encrypting_accounts) = signal(false);
    let (encryption_result, set_encryption_result) = signal::<Option<Result<(), String>>>(None);
    let (removing_password, set_removing_password) = signal(false);
    let (remove_password_result, set_remove_password_result) =
        signal::<Option<Result<(), String>>>(None);
    let rpc_context = expect_context::<RpcContext>();
    let (is_confirmed, set_is_confirmed) = signal(false);
    let (new_mnemonic, set_new_mnemonic) = signal::<Option<bip39::Mnemonic>>(None);
    let (copied_to_clipboard, set_copied_to_clipboard) = signal(false);
    let (ledger_is_only_key, set_ledger_is_only_key) = signal(false);
    let (checking_keys, set_checking_keys) = signal(false);
    let (storage_persisted, set_storage_persisted) = signal::<Option<bool>>(None);
    let (requesting_persistence, set_requesting_persistence) = signal(false);
    let (storage_usage, set_storage_usage) = signal::<Option<u64>>(None);
    let (storage_quota, set_storage_quota) = signal::<Option<u64>>(None);
    let (persistence_denied, set_persistence_denied) = signal(false);
    let (clearing_cache, set_clearing_cache) = signal(false);
    let (cache_clear_result, set_cache_clear_result) = signal::<Option<Result<(), String>>>(None);

    let is_ledger_account = move || {
        let accs = accounts_context.accounts.get();
        if let Some(selected_id) = &accs.selected_account_id {
            if let Some(account) = accs.accounts.iter().find(|a| &a.account_id == selected_id) {
                return matches!(account.secret_key, SecretKeyHolder::Ledger { .. });
            }
        }
        false
    };

    let generate_new_mnemonic = move || {
        let mnemonic = bip39::Mnemonic::generate(12).unwrap();
        set_new_mnemonic(Some(mnemonic));
        set_copied_to_clipboard(false);
    };

    let check_storage_persistence = move || {
        spawn_local(async move {
            // Check if storage is persisted
            match wasm_bindgen_futures::JsFuture::from(
                window().navigator().storage().persisted().unwrap(),
            )
            .await
            {
                Ok(persisted) => {
                    set_storage_persisted(Some(persisted.as_bool().unwrap_or(false)));
                }
                Err(_) => {
                    set_storage_persisted(Some(false));
                }
            }

            // Get storage usage and quota
            match wasm_bindgen_futures::JsFuture::from(
                window().navigator().storage().estimate().unwrap(),
            )
            .await
            {
                Ok(estimate) => {
                    if let Some(estimate_obj) = Object::try_from(&estimate) {
                        if let Ok(usage_prop) = Reflect::get(estimate_obj, &"usage".into()) {
                            if let Some(usage) = usage_prop.as_f64() {
                                set_storage_usage(Some(usage as u64));
                            }
                        }
                        if let Ok(quota_prop) = Reflect::get(estimate_obj, &"quota".into()) {
                            if let Some(quota) = quota_prop.as_f64() {
                                set_storage_quota(Some(quota as u64));
                            }
                        }
                    }
                }
                Err(err) => {
                    log::warn!("Failed to get storage estimate: {:?}", err);
                }
            }
        });
    };

    let request_storage_persistence = move || {
        set_requesting_persistence(true);
        set_persistence_denied(false);
        spawn_local(async move {
            match wasm_bindgen_futures::JsFuture::from(
                window().navigator().storage().persist().unwrap(),
            )
            .await
            {
                Ok(granted) => {
                    let is_persistent = granted.as_bool().unwrap_or(false);
                    set_storage_persisted(Some(is_persistent));
                    if is_persistent {
                        log::info!("Storage persistence granted");
                        set_persistence_denied(false);
                    } else {
                        log::warn!("Storage persistence denied");
                        set_persistence_denied(true);
                    }
                }
                Err(err) => {
                    log::error!("Failed to request storage persistence: {:?}", err);
                    set_persistence_denied(true);
                }
            }
            set_requesting_persistence(false);
        });
    };

    let clear_cache = move || {
        set_clearing_cache(true);
        set_cache_clear_result(None);

        let js_code = "window.caches.keys().then(cacheNames=>cacheNames.map(cacheName=>window.caches.delete(cacheName)))";

        spawn_local(async move {
            match web_sys::js_sys::eval(js_code) {
                Ok(_) => {
                    log::info!("Cache cleared");
                    set_cache_clear_result(Some(Ok(())));
                }
                Err(err) => {
                    log::error!("Failed to clear cache: {:?}", err);
                    set_cache_clear_result(Some(Err("Failed to clear cache".to_string())));
                }
            }
            set_clearing_cache(false);
        });
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

            let (details_receiver, transaction) = EnqueuedTransaction::create(
                "Terminate other sessions".to_string(),
                account_id.clone(),
                account_id.clone(),
                actions,
            );
            add_transaction.update(|queue| queue.push(transaction));
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

    // Check ledger keys when account changes
    Effect::new(move || {
        accounts_context.accounts.track();
        check_ledger_keys();
    });

    Effect::new(move || {
        check_storage_persistence();
    });

    let location = use_location();
    Effect::new(move || {
        let hash = location.hash.get();
        if hash == "#storage" {
            set_timeout(
                move || {
                    if let Some(element) = window()
                        .document()
                        .and_then(|doc| doc.get_element_by_id("storage-section"))
                    {
                        let options = web_sys::ScrollIntoViewOptions::new();
                        options.set_behavior(web_sys::ScrollBehavior::Smooth);
                        element.scroll_into_view_with_scroll_into_view_options(&options);
                    }
                },
                Duration::from_millis(100),
            );
        }
    });

    // Watch for encryption completion
    Effect::new(move || {
        if let Some(result) = accounts_context.set_password.value().get() {
            if encrypting_accounts.get_untracked() {
                set_encryption_result(Some(result));
                set_encrypting_accounts(false);
                set_timeout(move || set_encryption_result(None), Duration::from_secs(2));
            }
        }
    });

    // Watch for password removal completion
    Effect::new(move || {
        if let Some(result) = accounts_context.set_password.value().get() {
            if removing_password.get_untracked() {
                set_remove_password_result(Some(result));
                set_removing_password(false);
                set_timeout(
                    move || set_remove_password_result(None),
                    Duration::from_secs(2),
                );
            }
        }
    });

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">Security</div>

            <div class="flex flex-col gap-4">
                <A
                    href="/settings/security/account"
                    attr:class="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
                >
                    <div class="flex items-center gap-3">
                        <Icon icon=icondata::LuUser width="20" height="20" />
                        <span>Account</span>
                    </div>
                    <Icon icon=icondata::LuChevronRight width="20" height="20" />
                </A>

                <A
                    href="/settings/security/connected-apps"
                    attr:class="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
                >
                    <div class="flex items-center gap-3">
                        <Icon icon=icondata::LuAppWindow width="20" height="20" />
                        <span>Connected Apps</span>
                    </div>
                    <Icon icon=icondata::LuChevronRight width="20" height="20" />
                </A>

                <A
                    href="/settings/security/security-log"
                    attr:class="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
                >
                    <div class="flex items-center gap-3">
                        <Icon icon=icondata::LuShieldCheck width="20" height="20" />
                        <span>Security Log</span>
                    </div>
                    <Icon icon=icondata::LuChevronRight width="20" height="20" />
                </A>

                <div class="flex flex-col gap-2">
                    <div class="text-lg font-medium">Password</div>
                    <div class="text-sm text-neutral-400">
                        "Encrypt your wallet credentials, so that even if your device is compromised (for example, if you get malware, or someone steals your device), it will be much harder for the attacker to access your accounts."
                    </div>

                    <div class="flex flex-col gap-3">
                        <input
                            type="password"
                            placeholder="Enter password"
                            prop:value=move || password_input.get()
                            on:input=move |ev| {
                                let password = event_target_value(&ev);
                                set_password_input(password.clone());
                            }
                            on:focus=move |_| {
                                if benchmark_result.get().is_none() && !benchmarking_password.get()
                                {
                                    set_benchmarking_password(true);
                                    set_benchmark_result(None);
                                    spawn_local(async move {
                                        let result = benchmark_argon2().await;
                                        set_benchmark_result(Some(result));
                                        set_benchmarking_password(false);
                                    });
                                }
                            }
                            class="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-blue-500 focus:outline-none text-base"
                        />

                        <button
                            class="flex items-center justify-center gap-2 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            disabled=move || {
                                benchmarking_password.get() || password_input.get().is_empty()
                                    || encrypting_accounts.get()
                            }
                            on:click=move |_: web_sys::MouseEvent| {
                                let password = password_input.get_untracked();
                                if password.is_empty() {
                                    return;
                                }
                                if benchmark_result.get_untracked().is_none()
                                    && !benchmarking_password.get_untracked()
                                {
                                    set_benchmarking_password(true);
                                    set_benchmark_result(None);
                                    spawn_local(async move {
                                        let result = benchmark_argon2().await;
                                        set_benchmark_result(Some(result));
                                        set_benchmarking_password(false);
                                    });
                                }
                                if let Some((rounds, _)) = benchmark_result.get_untracked() {
                                    set_encrypting_accounts(true);
                                    set_encryption_result(None);
                                    let mut salt = [0u8; 32];
                                    OsRng.fill_bytes(&mut salt);
                                    set_password_input(String::new());
                                    accounts_context
                                        .set_password
                                        .dispatch(PasswordAction::SetCipher {
                                            password,
                                            rounds,
                                            salt: salt.to_vec(),
                                            accounts_context,
                                        });
                                }
                            }
                        >
                            <Show when=move || {
                                !benchmarking_password.get() && !encrypting_accounts.get()
                                    && encryption_result.get().is_none()
                            }>
                                <Icon icon=icondata::LuShield width="20" height="20" />
                                <span>
                                    {move || {
                                        if accounts_context.is_encrypted.get() {
                                            "Change Password"
                                        } else {
                                            "Set Password"
                                        }
                                    }}
                                </span>
                            </Show>
                            <Show when=move || benchmarking_password.get()>
                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <span>"Benchmarking your device..."</span>
                            </Show>
                            <Show when=move || {
                                encrypting_accounts.get() && encryption_result.get().is_none()
                            }>
                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <span>
                                    {move || {
                                        if accounts_context.is_encrypted.get() {
                                            "Changing password..."
                                        } else {
                                            "Setting password..."
                                        }
                                    }}
                                </span>
                            </Show>
                            <Show when=move || encryption_result.get().is_some()>
                                <Icon icon=icondata::LuCheck width="20" height="20" />
                                <span>"Done"</span>
                            </Show>
                        </button>

                        <Show when=move || accounts_context.is_encrypted.get()>
                            <div class="flex flex-col gap-3">
                                <div class="text-lg font-medium">Remember Password</div>
                                <select
                                    class="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-blue-500 focus:outline-none"
                                    on:change=move |ev| {
                                        let value = event_target_value(&ev);
                                        let duration = PasswordRememberDuration::from_option_value(
                                            &value,
                                        );
                                        set_config
                                            .update(|c| c.password_remember_duration = duration);
                                    }
                                >
                                    {PasswordRememberDuration::all_variants()
                                        .iter()
                                        .map(|variant| {
                                            let option_value = variant.option_value();
                                            let display_name = variant.display_name();
                                            let is_selected = *variant;
                                            view! {
                                                <option
                                                    value=option_value
                                                    selected=move || {
                                                        config.get().password_remember_duration == is_selected
                                                    }
                                                >
                                                    {display_name}
                                                </option>
                                            }
                                        })
                                        .collect::<Vec<_>>()}
                                </select>
                            </div>
                        </Show>

                        <Show when=move || accounts_context.is_encrypted.get()>
                            <button
                                class="flex items-center justify-center gap-2 p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                disabled=move || removing_password.get()
                                on:click=move |_| {
                                    set_removing_password(true);
                                    set_remove_password_result(None);
                                    set_password_input(String::new());
                                    accounts_context
                                        .set_password
                                        .dispatch(PasswordAction::ClearCipher);
                                }
                            >
                                <Show when=move || {
                                    !removing_password.get()
                                        && remove_password_result.get().is_none()
                                }>
                                    <Icon icon=icondata::LuShieldOff width="20" height="20" />
                                    <span>"Remove Password"</span>
                                </Show>
                                <Show when=move || removing_password.get()>
                                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                                    <span>"Removing password..."</span>
                                </Show>
                                <Show when=move || remove_password_result.get().is_some()>
                                    <Icon icon=icondata::LuCheck width="20" height="20" />
                                    <span>"Password Removed"</span>
                                </Show>
                            </button>
                        </Show>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
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
                            set_show_terminate_dialog.set(true);
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

                    <Show when=move || show_terminate_dialog.get()>
                        <div class="fixed inset-0 bg-neutral-950/60 backdrop-blur-[2px] lg:rounded-3xl z-10">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md border border-red-500/20">
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

                                    <Show when=move || {
                                        new_mnemonic.get().is_some() && !is_ledger_account()
                                    }>
                                        <div class="bg-neutral-900 rounded-lg p-4 mb-6 border border-neutral-700">
                                            <div class="flex items-center justify-between mb-3">
                                                <h4 class="text-lg font-medium text-white">
                                                    "New Seed Phrase"
                                                </h4>
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
                                            on:click=move |_| {
                                                set_show_terminate_dialog.set(false);
                                                set_is_confirmed(false);
                                                set_new_mnemonic(None);
                                                set_copied_to_clipboard(false);
                                            }
                                        >
                                            "Cancel"
                                        </button>
                                        <button
                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed cursor-pointer"
                                            disabled=move || {
                                                terminating_sessions.get() || !is_confirmed.get()
                                            }
                                            on:click=move |_| {
                                                terminate_sessions(());
                                                set_show_terminate_dialog.set(false);
                                                set_is_confirmed(false);
                                                set_new_mnemonic(None);
                                                set_copied_to_clipboard(false);
                                            }
                                        >
                                            "Confirm"
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>

                <div class="flex flex-col gap-2" id="storage-section">
                    <div class="text-lg font-medium">Storage Persistence</div>
                    <div class="text-sm text-neutral-400">
                        "Protect your wallet data from being automatically cleared by your browser when storage space is low."
                    </div>

                    <div class="p-3 rounded-lg bg-neutral-900 border border-neutral-700">
                        <div class="flex flex-col gap-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-neutral-400">
                                    "Usage (by entire browser, not just this wallet):"
                                </span>
                                <span class="text-white">
                                    {move || {
                                        if let Some(usage) = storage_usage.get() {
                                            format_bytes(usage)
                                        } else {
                                            "Loading...".to_string()
                                        }
                                    }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-neutral-400">"Available (for the wallet):"</span>
                                <span class="text-white">
                                    {move || {
                                        if let Some(quota) = storage_quota.get() {
                                            format_bytes(quota)
                                        } else {
                                            "Loading...".to_string()
                                        }
                                    }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-neutral-400">
                                    "Safe from browser auto-clearing when running low on disk:"
                                </span>
                                <div class="flex items-center gap-2">
                                    <Show when=move || storage_persisted.get() == Some(true)>
                                        <Icon
                                            icon=icondata::LuCheck
                                            width="16"
                                            height="16"
                                            attr:class="text-green-400"
                                        />
                                        <span class="text-green-400 text-sm">"yes"</span>
                                    </Show>
                                    <Show when=move || storage_persisted.get() == Some(false)>
                                        <Icon
                                            icon=icondata::LuX
                                            width="16"
                                            height="16"
                                            attr:class="text-red-400"
                                        />
                                        <span class="text-red-400 text-sm">"no"</span>
                                        {move || {
                                            if requesting_persistence.get() {
                                                view! {
                                                    <button
                                                        class="ml-2 px-3 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs w-25"
                                                        disabled
                                                    >
                                                        <div class="flex items-center justify-center gap-1 p-1">
                                                            <Icon icon=icondata::LuDatabase width="12" height="12" />
                                                            <span>"Approve"</span>
                                                        </div>
                                                    </button>
                                                }
                                                    .into_any()
                                            } else {
                                                view! {
                                                    <button
                                                        class="ml-2 px-3 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs w-25
                                                        "
                                                        on:click=move |_| request_storage_persistence()
                                                    >
                                                        <div class="flex items-center justify-center gap-1 p-1">
                                                            <Icon icon=icondata::LuDatabase width="12" height="12" />
                                                            <span>"Enable"</span>
                                                        </div>
                                                    </button>
                                                }
                                                    .into_any()
                                            }
                                        }}
                                    </Show>
                                    <Show when=move || storage_persisted.get().is_none()>
                                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-500"></div>
                                        <span class="text-neutral-400 text-sm">"checking..."</span>
                                    </Show>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Show when=move || {
                        persistence_denied.get() && storage_persisted.get() == Some(false)
                            && is_chrome_or_safari()
                    }>
                        <div class="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
                            <div class="flex items-start gap-3">
                                <Icon
                                    icon=icondata::LuInfo
                                    width="20"
                                    height="20"
                                    attr:class="text-yellow-400 mt-0.5 flex-shrink-0"
                                />
                                <div class="flex-1">
                                    <h4 class="font-medium text-yellow-200 mb-2">
                                        "Storage Persistence Request Denied"
                                    </h4>
                                    <div class="text-sm space-y-3">
                                        <p>
                                            "Your browser denied the storage persistence request. This means your wallet data could be cleared when storage space is low."
                                        </p>

                                        <div class="space-y-2">
                                            <p class="font-medium text-yellow-200">
                                                "To enable storage persistence:"
                                            </p>
                                            <ul class="list-disc list-inside space-y-1 text-xs">
                                                <li>
                                                    "Add this site to your bookmarks (you can remove it later after clicking the button)"
                                                </li>
                                                <li>
                                                    "Install this wallet as a PWA (Progressive Web App) by clicking the install button in the address bar on PC, or by adding it to your home screen on mobile"
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Show>

                    <div class="space-y-3 flex flex-col items-center text-center">
                        <div class="text-sm text-neutral-400">"Pages not loading?"</div>
                        <div class="flex items-center gap-3">
                            <button
                                class="px-4 py-2 rounded-md bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                                disabled=move || clearing_cache.get()
                                on:click=move |_| clear_cache()
                            >
                                <div class="flex items-center gap-2">
                                    {move || {
                                        if clearing_cache.get() {
                                            view! {
                                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                                                <span>"Clearing..."</span>
                                            }
                                                .into_any()
                                        } else {
                                            view! {
                                                <Icon icon=icondata::LuRotateCcw width="16" height="16" />
                                                <span>"Reset cache"</span>
                                            }
                                                .into_any()
                                        }
                                    }}
                                </div>
                            </button>

                            {move || {
                                if let Some(result) = cache_clear_result.get() {
                                    match result {
                                        Ok(()) => {
                                            view! {
                                                <div class="flex items-center gap-1 text-green-400 text-sm">
                                                    <Icon icon=icondata::LuCheck width="16" height="16" />
                                                    <span>"Cache cleared successfully"</span>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                        Err(err) => {
                                            view! {
                                                <div class="flex items-center gap-1 text-red-400 text-sm">
                                                    <Icon icon=icondata::LuX width="16" height="16" />
                                                    <span>{err.clone()}</span>
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    }
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
