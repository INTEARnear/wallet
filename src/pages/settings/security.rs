use std::time::Duration;

use crate::{
    components::account_selector::mnemonic_to_key,
    contexts::{
        accounts_context::AccountsContext,
        rpc_context::RpcContext,
        security_log_context::add_security_log,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
};
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

#[component]
pub fn SecuritySettings() -> impl IntoView {
    let AccountsContext {
        accounts,
        set_accounts,
    } = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let (show_secrets, set_show_secrets) = signal(false);
    let (copied_seed, set_copied_seed) = signal(false);
    let (copied_key, set_copied_key) = signal(false);
    let (terminating_sessions, set_terminating_sessions) = signal(false);
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
                        "This will log you out of all wallets other than this one. This can be useful if you feel like you might have compromised your seed phrase and want to change it. Note that if you have saved your seed phrase, IT WILL STOP WORKING, and a NEW seed phrase will appear in 'Export Account' above, make sure to save it after pressing this button. DO NOT CLOSE THE WALLET BEFORE THIS IS DONE."
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
