use std::time::Duration;

use crate::{
    components::account_selector::mnemonic_to_key,
    contexts::{
        accounts_context::{AccountsContext, PasswordAction, ENCRYPTION_MEMORY_COST_KB},
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
use near_min_api::{
    types::{
        AccessKey, AccessKeyPermission, AccessKeyPermissionView, Action, AddKeyAction,
        DeleteKeyAction, Finality,
    },
    QueryFinality,
};
use rand::{rngs::OsRng, RngCore};
use zxcvbn::zxcvbn;

const MIN_ROUNDS: u32 = 2;

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
    let AccountsContext {
        accounts,
        set_accounts,
        set_password,
        is_encrypted,
        ..
    } = expect_context::<AccountsContext>();
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let (show_secrets, set_show_secrets) = signal(false);
    let (copied_seed, set_copied_seed) = signal(false);
    let (copied_key, set_copied_key) = signal(false);
    let (terminating_sessions, set_terminating_sessions) = signal(false);
    let (benchmarking_password, set_benchmarking_password) = signal(false);
    let (password_input, set_password_input) = signal(String::new());
    let (benchmark_result, set_benchmark_result) = signal::<Option<(u32, f64)>>(None);
    let (encrypting_accounts, set_encrypting_accounts) = signal(false);
    let (encryption_result, set_encryption_result) = signal::<Option<Result<(), String>>>(None);
    let (password_strength, set_password_strength) = signal::<Option<zxcvbn::Entropy>>(None);
    let (removing_password, set_removing_password) = signal(false);
    let (remove_password_result, set_remove_password_result) =
        signal::<Option<Result<(), String>>>(None);
    let rpc_context = expect_context::<RpcContext>();

    let show_secrets_memo = Memo::new(move |_| show_secrets.get());

    Effect::new(move || {
        if show_secrets_memo.get() {
            add_security_log(
                "Shown secrets on /settings/security".to_string(),
                accounts.get_untracked().selected_account_id.unwrap(),
            );
        }
    });

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

    let terminate_sessions = move |_| {
        let Some(account_id) = accounts.get().selected_account_id else {
            log::error!("No account selected");
            return;
        };

        set_terminating_sessions(true);

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
            for key in keys.keys {
                if matches!(
                    key.access_key.permission,
                    AccessKeyPermissionView::FullAccess
                ) {
                    delete_actions.push(Action::DeleteKey(Box::new(DeleteKeyAction {
                        public_key: key.public_key,
                    })));
                }
            }

            let mnemonic = bip39::Mnemonic::generate(12).unwrap();
            let secret_key = mnemonic_to_key(mnemonic.clone()).unwrap();
            let public_key = secret_key.public_key();

            let add_action = Action::AddKey(Box::new(AddKeyAction {
                access_key: AccessKey {
                    nonce: 0,
                    permission: AccessKeyPermission::FullAccess,
                },
                public_key,
            }));
            let account = accounts
                .get_untracked()
                .accounts
                .into_iter()
                .find(|acc| acc.account_id == account_id)
                .expect("Account not found");
            add_security_log(format!("Terminated all other sessions for account {account_id}: Added key {secret_key} and removed keys {}. Previous key that the wallet was using was {}", serde_json::to_string(&delete_actions).unwrap(), account.secret_key), account_id.clone());

            let (details_receiver, transaction) = EnqueuedTransaction::create(
                "Terminate other sessions".to_string(),
                account_id.clone(),
                account_id.clone(),
                delete_actions
                    .into_iter()
                    .chain(std::iter::once(add_action))
                    .collect(),
            );
            add_transaction.update(|queue| queue.push(transaction));
            let res = details_receiver.await;
            if matches!(res, Ok(Ok(_))) {
                set_accounts.update(|accounts| {
                    for acc in accounts.accounts.iter_mut() {
                        if acc.account_id == account_id {
                            acc.secret_key = secret_key.clone();
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

    // Watch for encryption completion
    Effect::new(move || {
        if let Some(result) = set_password.value().get() {
            if encrypting_accounts.get_untracked() {
                set_encryption_result(Some(result));
                set_encrypting_accounts(false);
                set_timeout(move || set_encryption_result(None), Duration::from_secs(2));
            }
        }
    });

    // Watch for password removal completion
    Effect::new(move || {
        if let Some(result) = set_password.value().get() {
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
                                if !password.is_empty() {
                                    let mut words = vec!["near"];
                                    let accounts = accounts.read();
                                    for account in accounts.accounts.iter() {
                                        words
                                            .extend(
                                                account.account_id.as_str().split(&['.', '-', '_']),
                                            );
                                        if let Some((name, _ext)) = account
                                            .account_id
                                            .as_str()
                                            .rsplit_once('.')
                                        {
                                            words.push(name);
                                        }
                                        words.push(account.account_id.as_str());
                                    }
                                    let strength = zxcvbn(
                                        &password[..(password.len().min(100))],
                                        &words,
                                    );
                                    set_password_strength(Some(strength));
                                } else {
                                    set_password_strength(None);
                                }
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
                            class="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-blue-500 focus:outline-none"
                        />

                        <Show when=move || {
                            password_strength.get().is_some() && !password_input.get().is_empty()
                        }>
                            <div class="p-3 rounded-lg bg-neutral-900 border border-neutral-700">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-medium">Password Strength</span>
                                    <span class="text-sm">
                                        {move || {
                                            if let Some(strength) = password_strength.get() {
                                                match strength.score() {
                                                    zxcvbn::Score::Zero => "Very Weak",
                                                    zxcvbn::Score::One => "Weak",
                                                    zxcvbn::Score::Two => "Good",
                                                    zxcvbn::Score::Three | zxcvbn::Score::Four => "Strong",
                                                    _ => "Unknown",
                                                }
                                            } else {
                                                ""
                                            }
                                        }}
                                    </span>
                                </div>

                                <div class="w-full bg-neutral-700 rounded-full h-2 mb-3">
                                    <div
                                        class="h-2 rounded-full transition-all duration-300"
                                        style:width=move || {
                                            if let Some(strength) = password_strength.get() {
                                                format!("{}%", (strength.score() as u8 + 1) * 20)
                                            } else {
                                                "0%".to_string()
                                            }
                                        }
                                        style:background-color=move || {
                                            if let Some(strength) = password_strength.get() {
                                                match strength.score() {
                                                    zxcvbn::Score::Zero => "#ef4444",
                                                    zxcvbn::Score::One => "#f97316",
                                                    zxcvbn::Score::Two => "#eab308",
                                                    zxcvbn::Score::Three => "#22c55e",
                                                    zxcvbn::Score::Four => "#16a34a",
                                                    _ => "#6b7280",
                                                }
                                            } else {
                                                "#6b7280"
                                            }
                                        }
                                    ></div>
                                </div>

                                <Show when=move || {
                                    password_input.get().len() >= 4
                                        && if let Some(strength) = password_strength.get() {
                                            if let Some(feedback) = strength.feedback() {
                                                feedback.warning().is_some()
                                            } else {
                                                false
                                            }
                                        } else {
                                            false
                                        }
                                }>
                                    <div class="mb-3">
                                        <Show when=move || {
                                            if let Some(strength) = password_strength.get() {
                                                if let Some(feedback) = strength.feedback() {
                                                    feedback.warning().is_some()
                                                } else {
                                                    false
                                                }
                                            } else {
                                                false
                                            }
                                        }>
                                            <div class="mb-2">
                                                <div class="text-xs font-medium text-yellow-400 mb-1">
                                                    "Warning:"
                                                </div>
                                                <div class="text-xs text-yellow-300">
                                                    {move || {
                                                        if let Some(strength) = password_strength.get() {
                                                            if let Some(feedback) = strength.feedback() {
                                                                if let Some(warning) = feedback.warning() {
                                                                    format!("• {}", warning)
                                                                } else {
                                                                    String::new()
                                                                }
                                                            } else {
                                                                String::new()
                                                            }
                                                        } else {
                                                            String::new()
                                                        }
                                                    }}
                                                </div>
                                            </div>
                                        </Show>
                                    </div>
                                </Show>
                            </div>
                        </Show>

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
                                    set_password
                                        .dispatch(PasswordAction::SetCipher {
                                            password,
                                            rounds,
                                            salt: salt.to_vec(),
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
                                        if is_encrypted.get() {
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
                                        if is_encrypted.get() {
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

                        <Show when=move || is_encrypted.get()>
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

                        <Show when=move || is_encrypted.get()>
                            <button
                                class="flex items-center justify-center gap-2 p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                disabled=move || removing_password.get()
                                on:click=move |_| {
                                    set_removing_password(true);
                                    set_remove_password_result(None);
                                    set_password_input(String::new());
                                    set_password.dispatch(PasswordAction::ClearCipher);
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
                    <div class="text-lg font-medium">Export Account</div>
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
                            <span>Export Account</span>
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

                <div class="flex flex-col gap-2">
                    <div class="text-lg font-medium">Terminate All Other Sessions</div>
                    <div class="text-sm text-neutral-400">
                        "This will log you out of all wallets other than this one. This can be useful if you feel like you might have compromised your seed phrase and want to change it. Note that if you have saved your seed phrase, "
                        <span class="text-yellow-400 font-bold">"IT WILL STOP WORKING"</span>
                        ", and a " <span class="text-yellow-400 font-bold">"NEW"</span>
                        " phrase will appear in 'Export Account' above, make sure to save it after pressing this button. "
                        <span class="text-yellow-400 font-bold">
                            "DO NOT CLOSE THE WALLET BEFORE THIS IS DONE."
                        </span>
                    </div>
                    <button
                        class="flex items-center justify-center gap-2 p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        disabled=move || terminating_sessions.get()
                        on:click=terminate_sessions
                    >
                        <Show when=move || !terminating_sessions.get()>
                            <Icon icon=icondata::LuLogOut width="20" height="20" />
                            <span>"Terminate All Other Sessions"</span>
                        </Show>
                        <Show when=move || terminating_sessions.get()>
                            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                            <span>"Terminating..."</span>
                        </Show>
                    </button>
                </div>
            </div>
        </div>
    }
}
