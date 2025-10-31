use std::time::Duration;

use crate::{
    components::select::{Select, SelectOption},
    contexts::{
        accounts_context::{AccountsContext, PasswordAction, ENCRYPTION_MEMORY_COST_KB},
        config_context::{ConfigContext, PasswordRememberDuration},
    },
};
use argon2::{Argon2, ParamsBuilder};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_location;
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

    let check_storage_persistence = move || {
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
                                        set_config
                                            .update(|c| c.password_remember_duration = duration);
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

                <div class="flex flex-col gap-2" id="storage-section">
                    <Show when=move || storage_persisted.get().is_some()>
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
                                    <span class="text-neutral-400">
                                        "Available (for the wallet):"
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
