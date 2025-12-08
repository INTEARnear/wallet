use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use std::time::Duration;

use crate::contexts::accounts_context::AccountsContext;
use crate::utils::{format_account_id_full, generate_qr_code};

#[component]
pub fn Receive() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let selected_account = move || accounts_context.accounts.get().selected_account_id.clone();
    let (is_copied, set_is_copied) = signal(false);

    let qr_code_resource = LocalResource::new({
        move || {
            let account_id = selected_account();
            async move {
                if let Some(account_id) = account_id {
                    generate_qr_code(account_id.as_ref(), false).await
                } else {
                    Err(wasm_bindgen::JsValue::from_str("No account selected"))
                }
            }
        }
    });

    let copy_to_clipboard = move |_| {
        if let Some(account_id) = selected_account() {
            let clipboard = window().navigator().clipboard();
            let _ = clipboard.write_text(account_id.as_ref());
            set_is_copied(true);
            set_timeout(move || set_is_copied(false), Duration::from_millis(2000));
        }
    };

    view! {
        <div class="flex flex-col gap-6 p-2 md:p-4">
            <A
                href="/"
                attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                <span>Back</span>
            </A>
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <h1 class="text-2xl font-bold text-white mb-4">"Receive"</h1>

                <Suspense fallback=move || {
                    view! {
                        <div class="w-64 h-64 bg-neutral-800 rounded-lg flex items-center justify-center">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    }
                }>
                    {move || {
                        qr_code_resource
                            .get()
                            .map(|qr_result| {
                                if let Ok(qr_code_data_url) = qr_result {
                                    view! {
                                        <img
                                            src=qr_code_data_url
                                            alt="QR Code for wallet address"
                                            class="w-64 h-64 rounded-lg mb-4"
                                        />
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="w-64 h-64 bg-neutral-800 rounded-lg flex items-center justify-center text-red-400">
                                            "Failed to generate QR code"
                                        </div>
                                    }
                                        .into_any()
                                }
                            })
                            .unwrap_or_else(|| {
                                view! {
                                    <div class="w-64 h-64 bg-neutral-800 rounded-lg flex items-center justify-center">
                                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                    </div>
                                }
                                    .into_any()
                            })
                    }}
                </Suspense>

                {move || {
                    if let Some(account_id) = selected_account() {
                        view! {
                            <div class="flex flex-col items-center gap-3 w-full max-w-md">
                                <div class="flex items-center gap-2 w-full bg-neutral-800 rounded-lg p-3">
                                    <span class="text-white text-base font-mono break-all flex-1">
                                        {move || format_account_id_full(&account_id)}
                                    </span>
                                    <button
                                        class="bg-neutral-700 hover:bg-neutral-600 rounded-lg p-2 transition-colors cursor-pointer flex-shrink-0"
                                        on:click=copy_to_clipboard
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
                            .into_any()
                    } else {
                        view! { <div class="text-red-400">"No account selected"</div> }.into_any()
                    }
                }}

                <div class="flex flex-col gap-3 w-full max-w-md mt-4">
                    <A
                        href="/receive/bridge"
                        attr:class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer text-center text-base"
                    >
                        "Bridge"
                    </A>
                    <A
                        href="/invoices"
                        attr:class="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer text-center text-base relative"
                    >
                        <span>"Invoices"</span>
                        <span class="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded">
                            "BETA"
                        </span>
                    </A>
                </div>
            </div>
        </div>
    }
}
