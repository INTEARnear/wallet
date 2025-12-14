use leptos::prelude::*;
use leptos_icons::*;
use std::time::Duration;

#[component]
pub fn CopyButton(#[prop(into)] text: Signal<String>) -> impl IntoView {
    let (is_copied, set_is_copied) = signal(false);

    view! {
        <button
            class="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
            on:click=move |ev| {
                ev.stop_propagation();
                let clipboard = window().navigator().clipboard();
                let _ = clipboard.write_text(&text());
                set_is_copied(true);
                set_timeout(move || set_is_copied(false), Duration::from_millis(2000));
            }
            title="Copy amount"
        >
            {move || {
                if is_copied.get() {
                    view! {
                        <Icon
                            icon=icondata::LuCheck
                            width="16"
                            height="16"
                            attr:class="text-green-400"
                        />
                    }
                        .into_any()
                } else {
                    view! { <Icon icon=icondata::LuCopy width="16" height="16" /> }.into_any()
                }
            }}
        </button>
    }
}
