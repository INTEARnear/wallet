use leptos::prelude::*;
use leptos_icons::*;

/// A small utility component that renders an external link icon (Twitter, Telegram, etc.).
/// The caller is responsible for passing the correct `href` and icon.
#[component]
pub fn SocialLink(href: String, icon: icondata::Icon) -> impl IntoView {
    view! {
        <a
            href=href
            target="_blank"
            rel="noopener noreferrer"
            class="text-neutral-400 hover:text-white"
            on:click=|ev| ev.stop_propagation()
        >
            <Icon icon=icon width="18" height="18" />
        </a>
    }
}
