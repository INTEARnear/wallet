use leptos::prelude::*;
use leptos_icons::Icon;

#[component]
pub fn Tooltip(#[prop(into)] text: String) -> impl IntoView {
    view! {
        <div class="hover-capable-only group relative">
            <Icon icon=icondata::LuInfo width="16" height="16" attr:class="text-white/60" />
            <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-neutral-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {text}
            </div>
        </div>
    }
}
