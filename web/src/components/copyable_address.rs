use leptos::prelude::*;
use leptos_icons::*;
use std::time::Duration;

#[component]
pub fn CopyableAddress(
    address: String,
    #[prop(optional)] label: Option<&'static str>,
) -> impl IntoView {
    let (is_copied, set_is_copied) = signal(false);

    let address_clone = address.clone();
    view! {
        <div>
            {label
                .map(|l| {
                    view! { <p class="text-sm text-gray-400 mb-2">{l}</p> }
                })} <div class="flex items-center gap-2 w-full bg-neutral-600 rounded-lg p-3">
                <span class="text-white text-sm font-mono break-all flex-1">{address}</span>
                <button
                    class="bg-neutral-500 hover:bg-neutral-400 rounded-lg p-2 transition-colors cursor-pointer flex-shrink-0"
                    on:click=move |_| {
                        let clipboard = window().navigator().clipboard();
                        let _ = clipboard.write_text(&address_clone);
                        set_is_copied(true);
                        set_timeout(move || set_is_copied(false), Duration::from_millis(2000));
                    }
                    title="Copy address"
                >
                    {move || {
                        if is_copied.get() {
                            view! {
                                <Icon
                                    icon=icondata::LuCheck
                                    width="20"
                                    height="20"
                                    attr:class="text-green-400"
                                />
                            }
                                .into_any()
                        } else {
                            view! {
                                <Icon
                                    icon=icondata::LuCopy
                                    width="20"
                                    height="20"
                                    attr:class="text-white"
                                />
                            }
                                .into_any()
                        }
                    }}
                </button>
            </div>
        </div>
    }
}
