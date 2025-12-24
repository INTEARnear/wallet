use crate::{
    components::bridge_history::DepositAddress, contexts::accounts_context::AccountsContext,
};
use leptos::{html::Div, prelude::*};
use leptos_icons::*;
use leptos_router::{
    components::{A, Outlet},
    hooks::use_location,
};
use leptos_use::use_event_listener;

mod account;
mod connected_apps;
mod create_token_modals;
mod developer;
mod developer_create_token;
mod developer_sandbox;
mod preferences;
mod security;
mod security_log;

pub use account::{AccountSettings, JsWalletRequest, JsWalletResponse};
pub use connected_apps::ConnectedAppsSettings;
pub use developer::DeveloperSettings;
pub use developer_create_token::DeveloperCreateToken;
pub use developer_sandbox::DeveloperSandbox;
use near_min_api::types::AccountId;
pub use preferences::{LedgerSelector, PreferencesSettings, SLIPPAGE_PRESETS, ToggleSwitch};
pub use security::SecuritySettings;
pub use security_log::SecurityLogPage;
use web_sys::{ScrollBehavior, ScrollToOptions};

pub fn open_live_chat(
    selected_account_id: AccountId,
    bridge_deposit_address: Option<DepositAddress>,
) {
    let message = JsWalletRequest::ChatwootOpen {
        account_id: selected_account_id,
        bridge_deposit_address,
    };

    if let Ok(location_origin) = window().location().origin() {
        let _ = window().post_message(
            &serde_wasm_bindgen::to_value(&message).unwrap(),
            &location_origin,
        );
    }
}

#[component]
pub fn Settings() -> impl IntoView {
    let location = use_location();
    let accounts_context = expect_context::<AccountsContext>();
    let scroll_div_ref = NodeRef::<Div>::new();

    let is_active = move |path: &str| location.pathname.get().starts_with(path);

    let _ = use_event_listener(scroll_div_ref, leptos::ev::wheel, move |e| {
        e.prevent_default();
        if let Some(scroll_div) = scroll_div_ref.get() {
            let delta_y = e.delta_y();
            let scroll_amount = if delta_y < 0.0 { -50.0 } else { 50.0 };
            scroll_div.scroll_by_with_scroll_to_options(&{
                let options = ScrollToOptions::default();
                options.set_left(scroll_amount);
                options.set_behavior(ScrollBehavior::Smooth);
                options
            });
        }
    });

    view! {
        <div class="flex flex-col h-full text-white">
            <div
                node_ref=scroll_div_ref
                class="flex flex-row gap-2 p-4 pb-0 border-b scrollbar-hide border-neutral-800 overflow-x-auto whitespace-nowrap w-full flex-shrink-0"
            >
                <A
                    href="/settings/security"
                    attr:class="flex items-center gap-3 p-3 transition-colors relative flex-shrink-0"
                    attr:style=move || {
                        if is_active("/settings/security") {
                            "border-bottom: 2px solid white;"
                        } else {
                            ""
                        }
                    }
                    class:hover:bg-neutral-900=move || !is_active("/settings/security")
                >
                    <Icon
                        icon=icondata::LuShield
                        width="20"
                        height="20"
                        attr:class="min-w-5 min-h-5"
                    />
                    <span style=move || {
                        if is_active("/settings/security") { "font-weight: bold;" } else { "" }
                    }>Security</span>
                </A>
                <A
                    href="/settings/preferences"
                    attr:class="flex items-center gap-3 p-3 transition-colors relative flex-shrink-0"
                    attr:style=move || {
                        if is_active("/settings/preferences") {
                            "border-bottom: 2px solid white;"
                        } else {
                            ""
                        }
                    }
                    class:hover:bg-neutral-900=move || !is_active("/settings/preferences")
                >
                    <Icon
                        icon=icondata::LuSettings
                        width="20"
                        height="20"
                        attr:class="min-w-5 min-h-5"
                    />
                    <span style=move || {
                        if is_active("/settings/preferences") { "font-weight: bold;" } else { "" }
                    }>Preferences</span>
                </A>
                <A
                    href="/settings/developer"
                    attr:class="flex items-center gap-3 p-3 transition-colors relative flex-shrink-0"
                    attr:style=move || {
                        if is_active("/settings/developer") {
                            "border-bottom: 2px solid white;"
                        } else {
                            ""
                        }
                    }
                    class:hover:bg-neutral-900=move || !is_active("/settings/developer")
                >
                    <Icon
                        icon=icondata::LuCode
                        width="20"
                        height="20"
                        attr:class="min-w-5 min-h-5"
                    />
                    <span style=move || {
                        if is_active("/settings/developer") { "font-weight: bold;" } else { "" }
                    }>Developer</span>
                </A>
            </div>
            <div class="flex-1">
                <Outlet />
            </div>
            <div>
                <div class="flex flex-col items-center gap-4 p-4 border-t border-neutral-800">
                    <div class="text-sm font-semibold">Support & Resources</div>
                    <button
                        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors cursor-pointer text-sm font-medium"
                        on:click=move |_| open_live_chat(
                            accounts_context.accounts.get_untracked().selected_account_id.unwrap(),
                            None,
                        )
                    >
                        <Icon icon=icondata::LuMessageCircle width="16" height="16" />
                        <span>"Live Chat"</span>
                    </button>
                    <div class="flex flex-row justify-center gap-6">
                        <a
                            href="https://t.me/intearchat"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <img src="/telegram.svg" alt="Telegram" class="w-6 h-6" />
                        </a>
                        <a
                            href="https://github.com/INTEARnear/wallet"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <img src="/github.svg" alt="GitHub" class="w-6 h-6" />
                        </a>
                        <a
                            href="https://x.com/intea_rs"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <img src="/x.svg" alt="X" class="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    }
}
