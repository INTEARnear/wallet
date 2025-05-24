use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use web_sys::KeyboardEvent;

use crate::contexts::accounts_context::AccountsContext;

#[component]
pub fn PasswordUnlock() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let (password_input, set_password_input) = signal(String::new());
    let (is_unlocking, set_is_unlocking) = signal(false);
    let (error, set_error) = signal::<Option<String>>(None);
    let (is_hovered, set_is_hovered) = signal(false);
    let (auto_attempt_abortable, set_auto_attempt_abortable) =
        signal::<Option<ActionAbortHandle>>(None);

    let input_ref = NodeRef::<leptos::html::Input>::new();

    Effect::new(move || {
        if let Some(input) = input_ref.get() {
            let _ = input.focus();
        }
    });

    let unlock_accounts = move || {
        let password = password_input.get();
        if password.is_empty() {
            return;
        }

        set_is_unlocking(true);
        set_error(None);

        spawn_local(async move {
            accounts_context.decrypt_accounts.dispatch(password);
        });
    };

    // Auto-unlock on typing
    Effect::new(move || {
        let password = password_input.get();
        if !password.is_empty() {
            if is_unlocking.get_untracked() {
                if let Some(abortable) = set_auto_attempt_abortable.write_untracked().take() {
                    // Abort the previous attempt if password input changed
                    // while previous attempt still in progress
                    abortable.abort();
                } else {
                    return;
                }
            }
            set_error(None);
            set_is_unlocking(true);
            set_auto_attempt_abortable(Some(accounts_context.decrypt_accounts.dispatch(password)));
        }
    });

    Effect::new(move || {
        if !is_unlocking.get() {
            set_auto_attempt_abortable(None);
        }
    });

    Effect::new(move || {
        if let Some(result) = accounts_context.decrypt_accounts.value().get() {
            match result {
                Ok(()) => {
                    set_is_unlocking(false);
                }
                Err(error_msg) => {
                    if auto_attempt_abortable.read_untracked().is_none() {
                        set_error(Some(error_msg));
                    }
                    set_is_unlocking(false);
                }
            }
        }
    });

    let handle_keydown = move |ev: KeyboardEvent| {
        if ev.key() == "Enter" && !password_input.get().is_empty() && !is_unlocking.get() {
            unlock_accounts();
        }
    };

    let handle_input = move |ev| {
        set_error(None);
        set_password_input(event_target_value(&ev));
    };

    view! {
        <div class="absolute inset-0 bg-neutral-950 lg:rounded-3xl z-50">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-full max-w-md p-6">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Icon
                                icon=icondata::LuLock
                                width="32"
                                height="32"
                                attr:class="text-blue-500"
                            />
                        </div>
                        <h2 class="text-white text-2xl font-semibold mb-2">Welcome Back!</h2>
                        <p class="text-neutral-400 text-sm">"Enter your password to log in"</p>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-neutral-400 text-sm font-medium mb-2">
                                Password
                            </label>
                            <div class="relative">
                                <input
                                    node_ref=input_ref
                                    type="password"
                                    class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 border-2 border-neutral-700 focus:border-blue-500"
                                    placeholder="Enter your password"
                                    prop:value=password_input
                                    on:input=handle_input
                                    on:keydown=handle_keydown
                                    disabled=move || {
                                        is_unlocking.get()
                                            && auto_attempt_abortable.read_untracked().is_none()
                                    }
                                />
                            </div>
                            {move || {
                                if let Some(err) = error.get() {
                                    view! {
                                        <p class="text-red-500 text-sm mt-2 font-medium">{err}</p>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>

                        <button
                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                            style=move || {
                                if !password_input.get().is_empty() && !is_unlocking.get() {
                                    "background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); cursor: pointer;"
                                } else {
                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                }
                            }
                            disabled=move || {
                                password_input.get().is_empty()
                                    || (is_unlocking.get()
                                        && auto_attempt_abortable.read_untracked().is_none())
                            }
                            on:click=move |_| unlock_accounts()
                            on:mouseenter=move |_| set_is_hovered.set(true)
                            on:mouseleave=move |_| set_is_hovered.set(false)
                        >
                            <div
                                class="absolute inset-0 transition-opacity duration-200"
                                style=move || {
                                    if !password_input.get().is_empty() && !is_unlocking.get()
                                        && is_hovered.get()
                                    {
                                        "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 1"
                                    } else {
                                        "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 0"
                                    }
                                }
                            ></div>
                            <span class="relative flex items-center justify-center gap-2">
                                {move || {
                                    if is_unlocking.get() {
                                        view! {
                                            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        }
                                            .into_any()
                                    } else {
                                        view! {
                                            <Icon icon=icondata::LuUnlock width="20" height="20" />
                                        }
                                            .into_any()
                                    }
                                }}
                                {move || {
                                    if is_unlocking.get() { "Unlocking..." } else { "Unlock" }
                                }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}
