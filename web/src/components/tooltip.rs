use leptos::prelude::*;
use leptos_icons::Icon;
use thaw::Tooltip as ThawTooltip;

#[component]
pub fn Tooltip(#[prop(into)] text: String) -> impl IntoView {
    view! {
        <ThawTooltip attr:class="hover-capable-only group relative" content=text>
            <Icon icon=icondata::LuInfo width="16" height="16" attr:class="text-white/60" />
        </ThawTooltip>
    }
}
