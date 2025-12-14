use bigdecimal::BigDecimal;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use rand::Rng;
use rand::rngs::OsRng;

use crate::components::copy_button::CopyButton;
use crate::components::qrcode_display::QRCodeDisplay;
use crate::contexts::accounts_context::AccountsContext;
use crate::contexts::network_context::{Network, NetworkContext};

#[component]
pub fn Invoices() -> impl IntoView {
    let NetworkContext { network } = expect_context::<NetworkContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let (usdc_amount, set_usdc_amount) = signal(String::new());
    let (has_typed_amount, set_has_typed_amount) = signal(false);
    let (amount_error, set_amount_error) = signal(Option::<String>::None);
    let (invoice_link, set_invoice_link) = signal(Option::<String>::None);

    let check_amount = move |amount: String| {
        set_has_typed_amount.set(true);

        let amount_trim = amount.trim();
        if amount_trim.is_empty() {
            set_amount_error.set(Some("Please enter USDC amount".to_string()));
            return;
        }

        match amount_trim.parse::<BigDecimal>() {
            Ok(dec) => {
                if dec <= BigDecimal::from(0) {
                    set_amount_error.set(Some("Amount must be greater than 0".to_string()));
                } else {
                    set_amount_error.set(None);
                }
            }
            Err(_) => {
                set_amount_error.set(Some("Please enter a valid amount".to_string()));
            }
        }
    };

    let is_valid = move || {
        amount_error.get().is_none()
            && has_typed_amount.get()
            && !usdc_amount.get().trim().is_empty()
    };

    let handle_create_invoice = move |_| {
        let amount = usdc_amount.get();
        let accounts_state = accounts.get();

        if let Some(selected_account_id) = accounts_state.selected_account_id {
            if let Ok(amount_f64) = amount.trim().parse::<f64>() {
                let invoice_id: u128 = OsRng.r#gen();
                let link = format!(
                    "https://tearpay-demo.intear.tech/?amountUsd={}&invoiceId=inv-{}&recipientAddress={}",
                    amount_f64, invoice_id, selected_account_id
                );

                log::info!("Created invoice link: {}", link);
                set_invoice_link(Some(link));
            } else {
                log::error!("Failed to parse amount as f64");
            }
        } else {
            log::error!("No account selected");
        }
    };

    view! {
        <Show
            when=move || network.get() == Network::Mainnet
            fallback=move || {
                view! {
                    <div class="flex flex-col gap-6 p-2 md:p-4">
                        <A
                            href="/receive"
                            attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                            <span>"Back"</span>
                        </A>
                        <div class="flex flex-col items-center justify-center h-full p-8 text-center">
                            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                <Icon icon=icondata::LuCircleX attr:class="w-8 h-8 text-red-500" />
                            </div>
                            <h2 class="text-xl font-bold text-white mb-2">
                                "Invoices Only Available on Mainnet"
                            </h2>
                            <p class="text-gray-400 max-w-md">
                                "The invoice feature is only available on NEAR Mainnet. Please switch to a Mainnet account to create invoices."
                            </p>
                        </div>
                    </div>
                }
            }
        >
            <div class="flex flex-col gap-6 p-2 md:p-4">
                <A
                    href="/receive"
                    attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                    <span>"Back"</span>
                </A>
                <div class="text-center">
                    <div class="flex items-center justify-center gap-2 mb-2">
                        <h1 class="text-2xl font-bold text-white">"Invoices"</h1>
                        <span class="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-semibold">
                            "BETA"
                        </span>
                    </div>
                    <p class="text-gray-400">
                        "Create USDC invoices, payable from 25+ blockchains"
                    </p>
                </div>

                <div class="bg-neutral-900/30 rounded-2xl p-3 md:p-6 space-y-4 md:space-y-6 max-w-md mx-auto w-full">
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <h3 class="text-white font-medium">"Invoice Amount"</h3>
                        </div>

                        <div class="flex flex-col gap-2">
                            <div class="relative">
                                <input
                                    type="text"
                                    class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 transition-all duration-200 text-base"
                                    style=move || {
                                        if has_typed_amount.get() {
                                            if amount_error.get().is_some() {
                                                "border: 2px solid rgb(239 68 68)"
                                            } else {
                                                "border: 2px solid rgb(34 197 94)"
                                            }
                                        } else {
                                            "border: 2px solid transparent"
                                        }
                                    }
                                    placeholder="0.0"
                                    prop:value=usdc_amount
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        set_usdc_amount.set(value.clone());
                                        check_amount(value);
                                    }
                                />
                                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                    "USDC"
                                </div>
                            </div>
                            {move || {
                                if let Some(error) = amount_error.get() {
                                    view! {
                                        <p class="text-red-500 text-sm mt-2 font-medium">{error}</p>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>
                    </div>

                    <button
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer text-base"
                        disabled=move || !is_valid()
                        on:click=handle_create_invoice
                    >
                        "Create Invoice"
                    </button>
                </div>

                {move || {
                    invoice_link
                        .get()
                        .map(|link| {
                            view! {
                                <div class="flex flex-col items-center gap-4">
                                    <QRCodeDisplay text=link.clone() size_class="w-64 h-64" include_logo=true />

                                    <div class="w-full bg-neutral-900/50 rounded-lg p-3 flex items-center gap-2">
                                        <p class="text-sm text-gray-300 break-all font-mono flex-1">
                                            {link.clone()}
                                        </p>
                                        <CopyButton text=Signal::derive(move || link.clone()) />
                                    </div>
                                </div>
                            }
                                .into_any()
                        })
                }}

                <div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 max-w-md mx-auto w-full">
                    <div class="flex items-start gap-3">
                        <Icon
                            icon=icondata::LuInfo
                            attr:class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                        />
                        <div class="text-sm text-blue-300">
                            <p class="font-medium mb-1">"Beta Feature"</p>
                            <p class="text-blue-400">
                                "This feature is currently in beta. Please contact support if you encounter any issues."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    }
}
