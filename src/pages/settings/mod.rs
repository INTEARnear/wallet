use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::{
    components::{Outlet, A},
    hooks::use_location,
};

mod developer;
mod preferences;
mod security;

pub use developer::DeveloperSettings;
pub use preferences::PreferencesSettings;
pub use security::SecuritySettings;

#[component]
pub fn Settings() -> impl IntoView {
    let location = use_location();
    let current_path = move || location.pathname.get();

    view! {
        <div class="flex flex-col h-full text-white">
            <div class="flex flex-row gap-2 p-4 pb-0 border-b border-neutral-800 overflow-x-auto scrollbar-hide whitespace-nowrap">
                <A
                    href="/settings/security"
                    attr:class="flex items-center gap-3 p-3 transition-colors relative"
                    attr:style=move || {
                        if current_path() == "/settings/security" {
                            "border-bottom: 2px solid white;"
                        } else {
                            ""
                        }
                    }
                    class:hover:bg-neutral-900=move || current_path() != "/settings/security"
                >
                    <Icon icon=icondata::LuShield width="20" height="20" />
                    <span style=move || {
                        if current_path() == "/settings/security" {
                            "font-weight: bold;"
                        } else {
                            ""
                        }
                    }>Security</span>
                </A>
                <A
                    href="/settings/preferences"
                    attr:class="flex items-center gap-3 p-3 transition-colors relative"
                    attr:style=move || {
                        if current_path() == "/settings/preferences" {
                            "border-bottom: 2px solid white;"
                        } else {
                            ""
                        }
                    }
                    class:hover:bg-neutral-900=move || current_path() != "/settings/preferences"
                >
                    <Icon icon=icondata::LuSettings width="20" height="20" />
                    <span style=move || {
                        if current_path() == "/settings/preferences" {
                            "font-weight: bold;"
                        } else {
                            ""
                        }
                    }>Preferences</span>
                </A>
                <A
                    href="/settings/developer"
                    attr:class="flex items-center gap-3 p-3 transition-colors relative"
                    attr:style=move || {
                        if current_path() == "/settings/developer" {
                            "border-bottom: 2px solid white;"
                        } else {
                            ""
                        }
                    }
                    class:hover:bg-neutral-900=move || current_path() != "/settings/developer"
                >
                    <Icon icon=icondata::LuCode2 width="20" height="20" />
                    <span style=move || {
                        if current_path() == "/settings/developer" {
                            "font-weight: bold;"
                        } else {
                            ""
                        }
                    }>Developer Settings</span>
                </A>
            </div>
            <div class="flex-1">
                <Outlet />
            </div>
        </div>
    }
}
