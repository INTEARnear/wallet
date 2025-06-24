use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_location;
use std::time::Duration;
use wasm_bindgen::JsCast;
use web_sys::{window, Clipboard, HtmlInputElement};

use crate::{
    components::account_selector::AccountSelector,
    contexts::{accounts_context::AccountsContext, search_context::SearchContext},
    utils::format_account_id,
};

#[component]
pub fn WalletHeader() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let SearchContext { query, set_query } = expect_context::<SearchContext>();
    let selected_account = move || accounts_context.accounts.get().selected_account_id.clone();
    let (is_copied, set_is_copied) = signal(false);
    let (is_expanded, set_is_expanded) = signal(false);
    let (is_search_expanded, set_is_search_expanded) = signal(false);
    let search_input_ref = NodeRef::<leptos::html::Input>::new();
    let location = use_location();

    // Focus the input when search is expanded
    Effect::new(move || {
        if is_search_expanded.get() {
            if let Some(input) = search_input_ref.get() {
                input.focus().unwrap();
            }
        }
    });

    let copy_to_clipboard = move |_| {
        if let Some(account_id) = selected_account() {
            if let Some(window) = window() {
                let clipboard: Clipboard = window.navigator().clipboard();
                let _ = clipboard.write_text(account_id.as_ref());
                set_is_copied(true);
                set_timeout(move || set_is_copied(false), Duration::from_millis(2000));
            }
        }
    };

    view! {
        <div class="relative">
            {move || {
                if is_search_expanded.get() {
                    view! {
                        <div class="flex items-center gap-2 bg-neutral-900 rounded-xl p-2">
                            <div class="flex-1 flex items-center gap-2">
                                <Icon
                                    icon=icondata::LuSearch
                                    width="20"
                                    height="20"
                                    attr:class="text-gray-400"
                                />
                                <input
                                    type="text"
                                    class="bg-transparent text-white w-full focus:outline-none text-base"
                                    placeholder="Search tokens..."
                                    prop:value=query
                                    on:input=move |ev| set_query(event_target_value(&ev))
                                    on:keydown=move |ev| {
                                        if ev.key() == "Enter" {
                                            ev.target()
                                                .unwrap()
                                                .dyn_into::<HtmlInputElement>()
                                                .unwrap()
                                                .blur()
                                                .unwrap();
                                        }
                                    }
                                    node_ref=search_input_ref
                                />
                            </div>
                            <button
                                class="text-white hover:text-neutral-400 transition-colors"
                                on:click=move |_| {
                                    set_is_search_expanded(false);
                                    set_query("".to_string());
                                }
                            >
                                <Icon icon=icondata::LuX width="20" height="20" />
                            </button>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="flex items-center justify-between">
                            {move || {
                                if location.pathname.get().starts_with("/settings") {
                                    view! {
                                        <A
                                            href="/"
                                            attr:class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-300 group cursor-default"
                                        >
                                            <Icon
                                                icon=icondata::LuArrowLeft
                                                width="20"
                                                height="20"
                                                attr:class="text-neutral-400 group-hover:text-black transition-colors"
                                            />
                                        </A>
                                    }
                                        .into_any()
                                } else if location.pathname.get() == "/send-transactions"
                                    || location.pathname.get() == "/sign-message"
                                {
                                    view! {
                                        <button
                                            class="bg-neutral-900/50 rounded-xl p-3 text-neutral-700 cursor-not-allowed"
                                            disabled=true
                                        >
                                            <Icon icon=icondata::LuUsers width="20" height="20" />
                                        </button>
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <button
                                            class="bg-neutral-900 rounded-xl p-3 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                                            on:click=move |_| set_is_expanded(true)
                                        >
                                            <Icon icon=icondata::LuUsers width="20" height="20" />
                                        </button>
                                    }
                                        .into_any()
                                }
                            }}
                            {move || {
                                if let Some(account_id) = selected_account() {
                                    view! {
                                        <div class="flex items-center gap-2">
                                            <button
                                                class="text-white text-xl font-medium hover:text-neutral-400 transition-colors wrap-anywhere no-mobile-ripple"
                                                on:click=copy_to_clipboard
                                            >
                                                {format_account_id(&account_id)}
                                            </button>
                                            <button
                                                class="bg-neutral-900 rounded-lg p-1.5 text-white hover:bg-neutral-800 transition-colors"
                                                on:click=copy_to_clipboard
                                            >
                                                {move || match is_copied.get() {
                                                    true => {
                                                        view! {
                                                            <Icon icon=icondata::LuCheck width="16" height="16" />
                                                        }
                                                    }
                                                    false => {
                                                        view! {
                                                            <Icon icon=icondata::LuCopy width="16" height="16" />
                                                        }
                                                    }
                                                }}
                                            </button>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                            <button
                                class="bg-neutral-900 rounded-xl p-3 text-white hover:bg-neutral-800 transition-all cursor-pointer transition-200"
                                on:click=move |_| set_is_search_expanded(true)
                                style=move || {
                                    let current_path = location.pathname.get();
                                    if current_path != "/" && current_path != "/nfts" {
                                        "opacity: 0; pointer-events: none"
                                    } else {
                                        ""
                                    }
                                }
                            >
                                <Icon icon=icondata::LuSearch width="20" height="20" />
                            </button>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
        <AccountSelector is_expanded=is_expanded set_is_expanded=set_is_expanded />
    }
}
