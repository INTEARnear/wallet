use leptos::prelude::*;
use leptos_icons::*;

#[component]
pub fn DeveloperSettings() -> impl IntoView {
    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">Developer Settings</div>
            <div class="flex items-center gap-3 text-sm text-sky-100 bg-neutral-900 p-4 rounded-lg border border-sky-700 shadow-lg">
                <Icon icon=icondata::LuInfo attr:class="min-w-5 min-h-5 text-sky-300" />
                <span>
                    "To create an account on testnet, tap \".near\"
                    5 times in the account creation input field."
                </span>
            </div>
        </div>
    }
}
