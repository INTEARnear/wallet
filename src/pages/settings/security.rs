use std::time::Duration;

use crate::contexts::{accounts_context::AccountsContext, security_log_context::add_security_log};
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;

#[component]
pub fn SecuritySettings() -> impl IntoView {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let (show_secrets, set_show_secrets) = signal(false);
    let (copied_seed, set_copied_seed) = signal(false);
    let (copied_key, set_copied_key) = signal(false);

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
                        "Export your account to another wallet or device. Keep this information secure and never share it with anyone."
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
            </div>
        </div>
    }
}
