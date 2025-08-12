use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::{
    components::{Outlet, A},
    hooks::use_location,
};

mod account;
mod connected_apps;
mod developer;
mod preferences;
mod security;
mod security_log;

pub use account::{AccountSettings, JsWalletRequest, JsWalletResponse};
pub use connected_apps::ConnectedAppsSettings;
pub use developer::DeveloperSettings;
pub use preferences::{PreferencesSettings, SLIPPAGE_PRESETS};
pub use security::SecuritySettings;
pub use security_log::SecurityLogPage;

#[component]
pub fn Settings() -> impl IntoView {
    let location = use_location();

    let is_active = move |path: &str| location.pathname.get().starts_with(path);

    view! {
        <div class="flex flex-col h-full text-white">
            <div class="flex flex-row gap-2 p-4 pb-0 border-b scrollbar-hide border-neutral-800 overflow-x-auto whitespace-nowrap w-full flex-shrink-0">
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
                    }>Developer Settings</span>
                </A>
            </div>
            <div class="flex-1">
                <Outlet />
            </div>
            <div>
                <div class="flex flex-col items-center gap-4 p-4 border-t border-neutral-800">
                    <div class="text-sm font-semibold">Support & Resources</div>
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
