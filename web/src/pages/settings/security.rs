use std::time::Duration;

use crate::{
    components::select::{Select, SelectOption},
    contexts::{
        accounts_context::{
            AccountsContext, ENCRYPTION_MEMORY_COST_KB, PasswordAction, SecretKeyHolder,
        },
        config_context::{ConfigContext, PasswordRememberDuration},
        rpc_context::RpcContext,
        security_log_context::add_security_log,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    pages::settings::ToggleSwitch,
    translations::TranslationKey,
    utils::{intents_remove_public_key_batches, is_tauri, tauri_invoke_no_args},
};
use argon2::{Argon2, ParamsBuilder};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_location;
use near_min_api::QueryFinality;
use near_min_api::types::near_crypto::{KeyType, PublicKeyHandle};
use near_min_api::types::{
    AccessKey, AccessKeyPermission, AccessKeyPermissionView, Action, AddKeyAction, DeleteKeyAction,
    Finality,
};
use rand::{RngCore, rngs::OsRng};
use serde::Deserialize;
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

fn is_same_key_type(left: KeyType, right: KeyType) -> bool {
    std::mem::discriminant(&left) == std::mem::discriminant(&right)
}

#[derive(Clone, Copy, PartialEq)]
enum PostQuantumStatus {
    SwitchToPostQuantum,
    SwitchToPreQuantum,
    Protected,
    ManualMigration,
}
#[component]
pub fn SecuritySettings() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let rpc_context = expect_context::<RpcContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    let (benchmarking_password, set_benchmarking_password) = signal(false);
    let (password_input, set_password_input) = signal(String::new());
    let (benchmark_result, set_benchmark_result) = signal::<Option<(u32, f64)>>(None);
    let (encrypting_accounts, set_encrypting_accounts) = signal(false);
    let (encryption_result, set_encryption_result) = signal::<Option<Result<(), String>>>(None);
    let (removing_password, set_removing_password) = signal(false);
    let (remove_password_result, set_remove_password_result) =
        signal::<Option<Result<(), String>>>(None);
    let (storage_persisted, set_storage_persisted) = signal::<Option<bool>>(None);
    let (requesting_persistence, set_requesting_persistence) = signal(false);
    let (storage_usage, set_storage_usage) = signal::<Option<u64>>(None);
    let (storage_quota, set_storage_quota) = signal::<Option<u64>>(None);
    let (persistence_denied, set_persistence_denied) = signal(false);
    let (clearing_cache, set_clearing_cache) = signal(false);
    let (cache_clear_result, set_cache_clear_result) = signal::<Option<Result<(), String>>>(None);
    let (supports_biometry, set_supports_biometry) = signal(false);
    let (switching_key_type, set_switching_key_type) = signal(false);

    let selected_account = move || {
        let accounts = accounts_context.accounts.get();
        let selected_account_id = accounts.selected_account_id.clone()?;
        accounts
            .accounts
            .into_iter()
            .find(|account| account.account_id == selected_account_id)
    };

    let post_quantum_status = LocalResource::new(move || {
        let account = selected_account();
        let rpc_client = rpc_context.client.get();
        async move {
            let account = account?;
            let current_public_key = account.secret_key.public_key();
            let key_type = current_public_key.key_type();
            let current_public_key_handle = PublicKeyHandle::from(&current_public_key);
            let keys = rpc_client
                .view_access_key_list(
                    account.account_id.clone(),
                    QueryFinality::Finality(Finality::None),
                )
                .await
                .ok()?;
            let full_access_keys = keys
                .keys
                .iter()
                .filter(|key| {
                    matches!(
                        key.access_key.permission,
                        AccessKeyPermissionView::FullAccess
                    )
                })
                .collect::<Vec<_>>();
            let has_mixed_key_types = full_access_keys
                .iter()
                .any(|key| !is_same_key_type(key.public_key.key_type(), key_type));
            // ML-DSA-65 keys are stored on-chain as a hash, so someone else's key can't
            // be turned back into a public key to delete it
            let has_undeletable_key = full_access_keys.iter().any(|key| {
                key.public_key.full_pubkey().is_none()
                    && key.public_key != current_public_key_handle
            });
            Some(if has_mixed_key_types || has_undeletable_key {
                PostQuantumStatus::ManualMigration
            } else {
                match (key_type, account.seed_phrase.is_some()) {
                    (KeyType::ED25519, true) => PostQuantumStatus::SwitchToPostQuantum,
                    (KeyType::MLDSA65, true) => PostQuantumStatus::SwitchToPreQuantum,
                    (KeyType::MLDSA65, false) => PostQuantumStatus::Protected,
                    _ => PostQuantumStatus::ManualMigration,
                }
            })
        }
    });

    let switch_key_type = move |target_key_type: KeyType| {
        let Some(account) = selected_account() else {
            return;
        };
        let Some(seed_phrase) = account.seed_phrase.clone() else {
            return;
        };
        let Some(new_secret_key) = intear_seed_phrase::secret_keys_from_phrase(&seed_phrase)
            .ok()
            .and_then(|keys| {
                keys.into_iter()
                    .find(|key| is_same_key_type(key.key_type(), target_key_type))
            })
        else {
            log::error!("Failed to derive a {target_key_type} key from the seed phrase");
            return;
        };

        set_switching_key_type(true);

        let account_id = account.account_id.clone();
        let current_public_key = account.secret_key.public_key();
        let new_public_key = new_secret_key.public_key();
        let network = account.network.clone();
        let rpc_client = rpc_context.client.get();

        spawn_local(async move {
            let keys = match rpc_client
                .view_access_key_list(account_id.clone(), QueryFinality::Finality(Finality::None))
                .await
            {
                Ok(keys) => keys,
                Err(err) => {
                    log::error!("Error fetching access key list: {err:?}");
                    set_switching_key_type(false);
                    return;
                }
            };

            let current_public_key_handle = PublicKeyHandle::from(&current_public_key);
            let mut actions = vec![Action::AddKey(Box::new(AddKeyAction {
                access_key: AccessKey {
                    nonce: 0,
                    permission: AccessKeyPermission::FullAccess,
                },
                public_key: new_public_key.clone(),
            }))];
            for key in keys.keys {
                if !matches!(
                    key.access_key.permission,
                    AccessKeyPermissionView::FullAccess
                ) {
                    continue;
                }
                let public_key = match key.public_key.full_pubkey() {
                    Some(public_key) => public_key,
                    None if key.public_key == current_public_key_handle => {
                        current_public_key.clone()
                    }
                    None => {
                        log::error!("Can't delete access key {} of {account_id}", key.public_key);
                        set_switching_key_type(false);
                        return;
                    }
                };
                actions.insert(
                    0,
                    Action::DeleteKey(Box::new(DeleteKeyAction { public_key })),
                );
            }

            let intents_action_batches =
                intents_remove_public_key_batches(&rpc_client, &account_id, &network).await;

            add_security_log(
                format!(
                    "Switching key algorithm: adding {new_secret_key} and removing all full access keys {}. Previous secret key: {}",
                    serde_json::to_string(&actions).unwrap(),
                    account.secret_key,
                ),
                account_id.clone(),
                accounts_context,
            );

            let (details_receiver, transaction) = EnqueuedTransaction::create(
                TranslationKey::MiscTransactionSwitchKeyAlgorithm.format(&[]),
                account_id.clone(),
                account_id.clone(),
                actions,
                true,
            );
            if let Some(intents_action_batches) = intents_action_batches {
                let intents_transactions = intents_action_batches
                    .into_iter()
                    .map(|intents_actions| {
                        let (_intents_details_receiver, intents_transaction) =
                            EnqueuedTransaction::create(
                                TranslationKey::MiscTransactionRemoveIntentsKeys.format(&[]),
                                account_id.clone(),
                                "intents.near".parse().unwrap(),
                                intents_actions,
                                true,
                            );

                        intents_transaction.in_same_queue_as(&transaction)
                    })
                    .collect::<Vec<_>>();
                add_transaction.update(|queue| {
                    queue.extend(
                        intents_transactions
                            .into_iter()
                            .chain(std::iter::once(transaction)),
                    )
                });
            } else {
                add_transaction.update(|queue| queue.push(transaction));
            }

            if matches!(details_receiver.await, Ok(Ok(_))) {
                accounts_context.set_accounts.update(|accounts| {
                    for stored_account in accounts.accounts.iter_mut() {
                        if stored_account.account_id == account_id {
                            stored_account.secret_key =
                                SecretKeyHolder::SecretKey(new_secret_key.clone());
                            stored_account.protect_key_rotation();
                        }
                    }
                });
            }
            post_quantum_status.refetch();
            set_switching_key_type(false);
        });
    };

    let check_storage_persistence = move || {
        if is_tauri() {
            set_storage_persisted(Some(true));
            return;
        }
        spawn_local(async move {
            // Check if storage is persisted
            match window()
                .navigator()
                .storage()
                .persisted()
                .map(wasm_bindgen_futures::JsFuture::from)
            {
                Ok(persisted) => {
                    let Some(persisted) = persisted.await.ok().and_then(|v| v.as_bool()) else {
                        set_storage_persisted(None);
                        return;
                    };
                    set_storage_persisted(Some(persisted));
                }
                Err(_) => {
                    set_storage_persisted(None);
                    return;
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
                        if let Ok(usage_prop) = Reflect::get(estimate_obj, &"usage".into())
                            && let Some(usage) = usage_prop.as_f64()
                        {
                            set_storage_usage(Some(usage as u64));
                        }
                        if let Ok(quota_prop) = Reflect::get(estimate_obj, &"quota".into())
                            && let Some(quota) = quota_prop.as_f64()
                        {
                            set_storage_quota(Some(quota as u64));
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
                    set_cache_clear_result(Some(Err(
                        TranslationKey::PagesSettingsSecurityErrClearCache.format(&[]),
                    )));
                }
            }
            set_clearing_cache(false);
        });
    };

    let dismiss_storage_warning = move || {
        config.update(|c| c.storage_persistence_warning_dismissed = true);

        if let Some(account) = accounts_context
            .accounts
            .get_untracked()
            .selected_account_id
        {
            add_security_log(
                "Storage persistence warning dismissed".to_string(),
                account.clone(),
                accounts_context,
            );
        }
    };

    Effect::new(move || {
        check_storage_persistence();
    });

    Effect::new(move || {
        spawn_local(async move {
            #[derive(Deserialize)]
            #[serde(rename_all = "camelCase")]
            struct BiometricStatus {
                is_available: bool,
            }
            let status_promise = tauri_invoke_no_args("plugin:biometric|status");
            let status = wasm_bindgen_futures::JsFuture::from(status_promise)
                .await
                .map_err(|e| format!("Failed to get biometric status: {:?}", e))
                .and_then(|val| {
                    serde_wasm_bindgen::from_value(val)
                        .map_err(|e| format!("Failed to parse biometric status: {:?}", e))
                })
                .unwrap_or_else(|err| {
                    log::error!("{}", err);
                    BiometricStatus {
                        is_available: false,
                    }
                });
            set_supports_biometry(status.is_available);
        });
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
        if let Some(result) = accounts_context.set_password.value().get()
            && encrypting_accounts.get_untracked()
        {
            if let Err(e) = result.as_ref() {
                log::error!("Failed to encrypt accounts: {}", e);
            }
            set_encryption_result(Some(result));
            set_encrypting_accounts(false);
            set_timeout(move || set_encryption_result(None), Duration::from_secs(2));
        }
    });

    // Watch for password removal completion
    Effect::new(move || {
        if let Some(result) = accounts_context.set_password.value().get()
            && removing_password.get_untracked()
        {
            set_remove_password_result(Some(result));
            set_removing_password(false);
            set_timeout(
                move || set_remove_password_result(None),
                Duration::from_secs(2),
            );
        }
    });

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">{move || TranslationKey::PagesSettingsSecurityTitle.format(&[])}</div>

            <div class="flex flex-col gap-4">
                <A
                    href="/settings/security/account"
                    attr:class="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
                >
                    <div class="flex items-center gap-3">
                        <Icon icon=icondata::LuUser width="20" height="20" />
                        <span>{move || TranslationKey::PagesSettingsSecurityTabAccount.format(&[])}</span>
                    </div>
                    <Icon icon=icondata::LuChevronRight width="20" height="20" />
                </A>

                <A
                    href="/settings/security/connected-apps"
                    attr:class="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
                >
                    <div class="flex items-center gap-3">
                        <Icon icon=icondata::LuAppWindow width="20" height="20" />
                        <span>{move || TranslationKey::PagesSettingsSecurityTabConnectedApps.format(&[])}</span>
                    </div>
                    <Icon icon=icondata::LuChevronRight width="20" height="20" />
                </A>

                <A
                    href="/settings/security/security-log"
                    attr:class="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors"
                >
                    <div class="flex items-center gap-3">
                        <Icon icon=icondata::LuShieldCheck width="20" height="20" />
                        <span>{move || TranslationKey::PagesSettingsSecurityTabSecurityLog.format(&[])}</span>
                    </div>
                    <Icon icon=icondata::LuChevronRight width="20" height="20" />
                </A>

                {move || {
                    let Some(status) = post_quantum_status.get().flatten() else {
                        return ().into_any();
                    };
                    let switch_target = match status {
                        PostQuantumStatus::SwitchToPostQuantum => {
                            Some((
                                KeyType::MLDSA65,
                                TranslationKey::PagesSettingsSecurityPostQuantumSwitchToPostQuantumButton,
                                icondata::LuShieldCheck,
                                "bg-green-500/10 hover:bg-green-500/20 text-green-400",
                            ))
                        }
                        PostQuantumStatus::SwitchToPreQuantum => {
                            Some((
                                KeyType::ED25519,
                                TranslationKey::PagesSettingsSecurityPostQuantumSwitchToPreQuantumButton,
                                icondata::LuShieldOff,
                                "bg-neutral-800 hover:bg-neutral-700 text-neutral-300",
                            ))
                        }
                        PostQuantumStatus::Protected | PostQuantumStatus::ManualMigration => None,
                    };
                    let emphasis = match status {
                        PostQuantumStatus::SwitchToPostQuantum => {
                            Some((
                                TranslationKey::PagesSettingsSecurityPostQuantumEmphasisNotSafe,
                                "text-red-400 font-semibold",
                            ))
                        }
                        PostQuantumStatus::SwitchToPreQuantum | PostQuantumStatus::Protected => {
                            Some((
                                TranslationKey::PagesSettingsSecurityPostQuantumEmphasisProtected,
                                "text-green-400 font-semibold",
                            ))
                        }
                        PostQuantumStatus::ManualMigration => None,
                    };
                    let description = match status {
                        PostQuantumStatus::SwitchToPostQuantum => {
                            Some(TranslationKey::PagesSettingsSecurityPostQuantumDescriptionPreQuantum)
                        }
                        PostQuantumStatus::SwitchToPreQuantum => {
                            Some(TranslationKey::PagesSettingsSecurityPostQuantumDescriptionPostQuantum)
                        }
                        PostQuantumStatus::Protected => None,
                        PostQuantumStatus::ManualMigration => {
                            Some(TranslationKey::PagesSettingsSecurityPostQuantumDescriptionManualMigration)
                        }
                    };
                    view! {
                        <div class="flex flex-col gap-2">
                            <div class="text-lg font-medium">
                                {move || TranslationKey::PagesSettingsSecurityHeaderPostQuantum.format(&[])}
                            </div>
                            {switch_target
                                .map(|(target_key_type, button_label, button_icon, button_class)| {
                                    view! {
                                        <button
                                            class=format!(
                                                "flex items-center justify-center gap-2 p-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer {button_class}",
                                            )
                                            disabled=move || switching_key_type.get()
                                            on:click=move |_| switch_key_type(target_key_type)
                                        >
                                            <Show when=move || !switching_key_type.get()>
                                                <Icon icon=button_icon width="20" height="20" />
                                                <span>{move || button_label.format(&[])}</span>
                                            </Show>
                                            <Show when=move || switching_key_type.get()>
                                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                                <span>{move || TranslationKey::PagesSettingsSecurityPostQuantumSwitching.format(&[])}</span>
                                            </Show>
                                        </button>
                                    }
                                })}
                            <div class="text-sm text-neutral-400">
                                {emphasis
                                    .map(|(emphasis_key, emphasis_class)| {
                                        view! {
                                            <span class=emphasis_class>
                                                {move || emphasis_key.format(&[])}
                                            </span>
                                            " "
                                        }
                                    })}
                                {description.map(|description| move || description.format(&[]))}
                            </div>
                        </div>
                    }
                        .into_any()
                }}

                <Show when=move || supports_biometry.get()>
                    <div class="flex flex-col gap-2">
                        <div class="text-lg font-medium">{move || TranslationKey::PagesSettingsSecurityHeaderBiometric.format(&[])}</div>
                        <div class="text-sm text-neutral-400">
                            {move || TranslationKey::PagesSettingsSecurityBiometricDescription.format(&[])}
                        </div>
                        <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
                            <ToggleSwitch
                                label=Signal::derive(move || TranslationKey::PagesSettingsSecurityToggleBiometric.format(&[]))
                                value=Signal::derive(move || config.get().biometric_enabled)
                                disabled=Signal::derive(|| false)
                                on_toggle=move || {
                                    config.update(|c| c.biometric_enabled = !c.biometric_enabled);
                                }
                            />
                        </div>
                    </div>
                </Show>

                <div class="flex flex-col gap-2">
                    <div class="text-lg font-medium">{move || TranslationKey::PagesSettingsSecurityHeaderPassword.format(&[])}</div>
                    <div class="text-sm text-neutral-400">
                        {move || TranslationKey::PagesSettingsSecurityPasswordDescription.format(&[])}
                    </div>

                    <div class="flex flex-col gap-3">
                        <input
                            type="password"
                            placeholder=move || TranslationKey::PagesSettingsSecurityPasswordPlaceholder.format(&[])
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
                                            TranslationKey::PagesSettingsSecurityPasswordChangeButton.format(&[])
                                        } else {
                                            TranslationKey::PagesSettingsSecurityPasswordSetButton.format(&[])
                                        }
                                    }}
                                </span>
                            </Show>
                            <Show when=move || benchmarking_password.get()>
                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <span>{move || TranslationKey::PagesSettingsSecurityPasswordBenchmarking.format(&[])}</span>
                            </Show>
                            <Show when=move || {
                                encrypting_accounts.get() && encryption_result.get().is_none()
                            }>
                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <span>
                                    {move || {
                                        if accounts_context.is_encrypted.get() {
                                            TranslationKey::PagesSettingsSecurityPasswordChanging.format(&[])
                                        } else {
                                            TranslationKey::PagesSettingsSecurityPasswordSetting.format(&[])
                                        }
                                    }}
                                </span>
                            </Show>
                            <Show when=move || encryption_result.get().is_some()>
                                <Icon icon=icondata::LuCheck width="20" height="20" />
                                <span>{move || TranslationKey::PagesSettingsSecurityPasswordDone.format(&[])}</span>
                            </Show>
                        </button>

                        <Show when=move || accounts_context.is_encrypted.get()>
                            <div class="flex flex-col gap-3">
                                <div class="text-lg font-medium">{move || TranslationKey::PagesSettingsSecurityHeaderRememberPassword.format(&[])}</div>
                                <Select
                                    options=Signal::derive(move || {
                                        PasswordRememberDuration::all_variants()
                                            .iter()
                                            .map(|variant| {
                                                SelectOption::new(
                                                    variant.option_value().to_string(),
                                                    move || variant.display_name().to_string().into_any(),
                                                )
                                            })
                                            .collect()
                                    })
                                    on_change=Callback::new(move |value: String| {
                                        let duration = PasswordRememberDuration::from_option_value(
                                            &value,
                                        );
                                        config.update(|c| c.password_remember_duration = duration);
                                    })
                                    class="w-full border rounded-lg border-neutral-700 bg-neutral-900"
                                    initial_value=config
                                        .get_untracked()
                                        .password_remember_duration
                                        .option_value()
                                        .to_string()
                                />
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
                                    <span>{move || TranslationKey::PagesSettingsSecurityPasswordRemoveButton.format(&[])}</span>
                                </Show>
                                <Show when=move || removing_password.get()>
                                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                                    <span>{move || TranslationKey::PagesSettingsSecurityPasswordRemoving.format(&[])}</span>
                                </Show>
                                <Show when=move || remove_password_result.get().is_some()>
                                    <Icon icon=icondata::LuCheck width="20" height="20" />
                                    <span>{move || TranslationKey::PagesSettingsSecurityPasswordRemoved.format(&[])}</span>
                                </Show>
                            </button>
                        </Show>
                    </div>
                </div>

                <div
                    class="flex flex-col gap-2"
                    id="storage-section"
                    class:hidden=move || is_tauri()
                >
                    <Show when=move || storage_persisted.get().is_some()>
                        <div class="text-lg font-medium">{move || TranslationKey::PagesSettingsSecurityHeaderStoragePersistence.format(&[])}</div>
                        <div class="text-sm text-neutral-400">
                            {move || TranslationKey::PagesSettingsSecurityPersistenceDescription.format(&[])}
                        </div>

                        <div class="p-3 rounded-lg bg-neutral-900 border border-neutral-700">
                            <div class="flex flex-col gap-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-neutral-400">
                                        {move || TranslationKey::PagesSettingsSecurityPersistenceUsageLabel.format(&[])}
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
                                    <span class="text-neutral-400">
                                        {move || TranslationKey::PagesSettingsSecurityPersistenceAvailableLabel.format(&[])}
                                    </span>
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
                                        {move || TranslationKey::PagesSettingsSecurityPersistenceSafeFromClearing.format(&[])}
                                    </span>
                                    <div class="flex items-center gap-2">
                                        <Show when=move || storage_persisted.get() == Some(true)>
                                            <Icon
                                                icon=icondata::LuCheck
                                                width="16"
                                                height="16"
                                                attr:class="text-green-400"
                                            />
                                            <span class="text-green-400 text-sm">{move || TranslationKey::PagesSettingsSecurityPersistenceYes.format(&[])}</span>
                                        </Show>
                                        <Show when=move || storage_persisted.get() == Some(false)>
                                            <Icon
                                                icon=icondata::LuX
                                                width="16"
                                                height="16"
                                                attr:class="text-red-400"
                                            />
                                            <span class="text-red-400 text-sm">{move || TranslationKey::PagesSettingsSecurityPersistenceNo.format(&[])}</span>
                                            {move || {
                                                if requesting_persistence.get() {
                                                    view! {
                                                        <button
                                                            class="ml-2 px-3 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs w-25"
                                                            disabled
                                                        >
                                                            <div class="flex items-center justify-center gap-1 p-1">
                                                                <Icon icon=icondata::LuDatabase width="12" height="12" />
                                                                <span>{move || TranslationKey::PagesSettingsSecurityPersistenceApproveButton.format(&[])}</span>
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
                                                                <span>{move || TranslationKey::PagesSettingsSecurityPersistenceEnableButton.format(&[])}</span>
                                                            </div>
                                                        </button>
                                                    }
                                                        .into_any()
                                                }
                                            }}
                                        </Show>
                                        <Show when=move || storage_persisted.get().is_none()>
                                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-500"></div>
                                            <span class="text-neutral-400 text-sm">{move || TranslationKey::PagesSettingsSecurityPersistenceChecking.format(&[])}</span>
                                        </Show>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Show when=move || {
                            storage_persisted.get() == Some(false)
                                && !config.get().storage_persistence_warning_dismissed
                        }>
                            <div class="flex justify-center">
                                <button
                                    class="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                                    on:click=move |_| dismiss_storage_warning()
                                >
                                    {move || TranslationKey::PagesSettingsSecurityPersistenceDontShowWarning.format(&[])}
                                </button>
                            </div>
                        </Show>

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
                                        attr:class="text-yellow-400 mt-0.5 shrink-0"
                                    />
                                    <div class="flex-1">
                                        <h4 class="font-medium text-yellow-200 mb-2">
                                            {move || TranslationKey::PagesSettingsSecurityPersistenceDeniedTitle.format(&[])}
                                        </h4>
                                        <div class="text-sm space-y-3">
                                            <p>
                                                {move || TranslationKey::PagesSettingsSecurityPersistenceDeniedDescription.format(&[])}
                                            </p>

                                            <div class="space-y-2">
                                                <p class="font-medium text-yellow-200">
                                                    {move || TranslationKey::PagesSettingsSecurityPersistenceToEnable.format(&[])}
                                                </p>
                                                <ul class="list-disc list-inside space-y-1 text-xs">
                                                    <li>
                                                        {move || TranslationKey::PagesSettingsSecurityPersistenceAddBookmarks.format(&[])}
                                                    </li>
                                                    <li>
                                                        {move || TranslationKey::PagesSettingsSecurityPersistenceInstallPwa.format(&[])}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Show>
                    </Show>

                    <div class="space-y-3 flex flex-col items-center text-center">
                        <div class="text-sm text-neutral-400">{move || TranslationKey::PagesSettingsSecurityHeaderPagesNotLoading.format(&[])}</div>
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
                                                <span>{move || TranslationKey::PagesSettingsSecurityCacheClearing.format(&[])}</span>
                                            }
                                                .into_any()
                                        } else {
                                            view! {
                                                <Icon icon=icondata::LuRotateCcw width="16" height="16" />
                                                <span>{move || TranslationKey::PagesSettingsSecurityCacheResetButton.format(&[])}</span>
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
                                                    <span>{move || TranslationKey::PagesSettingsSecurityCacheCleared.format(&[])}</span>
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
