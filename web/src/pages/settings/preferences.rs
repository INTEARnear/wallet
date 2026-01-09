use std::str::FromStr;
use std::time::Duration;

use crate::contexts::config_context::{BackgroundGroup, ConfigContext, HiddenNft, LedgerMode};
use crate::pages::swap::Slippage;
use crate::utils::{is_android, is_tauri, tauri_invoke_no_args};
use bigdecimal::{BigDecimal, FromPrimitive};
use itertools::Itertools;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_use::use_window_size;
use wasm_bindgen_futures::JsFuture;

pub const SLIPPAGE_PRESETS: [f64; 4] = [0.5, 1.0, 2.0, 5.0];

#[component]
pub fn ToggleSwitch(
    label: &'static str,
    #[prop(into)] value: Signal<bool>,
    #[prop(into)] disabled: Signal<bool>,
    on_toggle: impl Fn() + 'static,
) -> impl IntoView {
    view! {
        <div class="flex items-center justify-between py-3">
            <label
                class="text-sm font-medium"
                style=move || {
                    format!("color: {};", if disabled.get() { "#374151" } else { "#9ca3af" })
                }
            >
                {label}
            </label>
            <button
                class="relative inline-flex h-6 min-w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                disabled=disabled
                style=move || {
                    format!(
                        "background-color: {};",
                        if disabled.get() {
                            "#9ca3af"
                        } else if value.get() {
                            "#0284c7"
                        } else {
                            "#e5e7eb"
                        },
                    )
                }
                on:click=move |_| on_toggle()
            >
                <span
                    class="inline-block h-4 w-4 transform rounded-full transition duration-200 ease-in-out"
                    style=move || {
                        format!(
                            "transform: translateX({}); background-color: {};",
                            if value.get() { "1.5rem" } else { "0.25rem" },
                            if disabled.get() {
                                "#d1d5db"
                            } else if value.get() {
                                "#ffffff"
                            } else {
                                "#000000"
                            },
                        )
                    }
                />
            </button>
        </div>
    }
}

#[component]
pub fn LedgerSelector(#[prop(optional, into)] on_change: Option<Callback<()>>) -> impl IntoView {
    let config_context = expect_context::<ConfigContext>();
    let current_mode = Memo::new(move |_| config_context.config.get().ledger_mode);

    let ledger_variants = LocalResource::new(LedgerMode::all_variants);
    set_interval(move || ledger_variants.refetch(), Duration::from_secs(1));
    let ledger_variants = Memo::new(move |_| {
        ledger_variants
            .get()
            .unwrap_or_default()
            .into_iter()
            .sorted()
            .collect::<Vec<_>>()
    });

    let has_ble_permissions = LocalResource::new(|| async move {
        if is_tauri() && is_android() {
            let promise = tauri_invoke_no_args("has_ble_permissions");
            let future = JsFuture::from(promise);
            let result = future.await.unwrap();
            let result: bool = serde_wasm_bindgen::from_value(result).unwrap();
            return result;
        }
        true
    });
    set_interval(
        move || has_ble_permissions.refetch(),
        Duration::from_secs(1),
    );
    let has_ble_permissions = Memo::new(move |_| has_ble_permissions.get().unwrap_or(true));

    view! {
        <div class="bg-neutral-800 rounded-xl p-4 space-y-4">
            <div class="text-sm text-gray-400 mb-3">
                "Current: "
                <span class="text-white font-medium">
                    {move || current_mode.get().display_name().to_string()}
                </span>
                <Show when=move || {
                    !ledger_variants.read().iter().any(|mode| *mode == current_mode.get())
                }>
                    <span class="text-red-400 text-xs font-medium">" (not connected)"</span>
                </Show>
            </div>

            <Suspense fallback=move || {
                view! { <div class="text-sm text-gray-400">"Loading..."</div> }
            }>
                <div class="space-y-2">
                    {move || {
                        ledger_variants
                            .get()
                            .into_iter()
                            .map(|mode| {
                                let mode_clone = mode.clone();
                                let mode_clone2 = mode.clone();
                                view! {
                                    <button
                                        class="w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors cursor-pointer"
                                        style=move || {
                                            if current_mode.get() == mode_clone {
                                                "background-color: rgb(59 130 246); color: white;"
                                            } else {
                                                "background-color: rgb(64 64 64); color: rgb(209 213 219);"
                                            }
                                        }
                                        on:click=move |_| {
                                            config_context
                                                .set_config
                                                .update(|config| {
                                                    config.ledger_mode = mode_clone2.clone();
                                                });
                                            if let Some(callback) = on_change {
                                                callback.run(());
                                            }
                                        }
                                    >
                                        <span>{mode.display_name().to_string()}</span>
                                    </button>
                                }
                            })
                            .collect_view()
                    }}
                </div>

                <div class="text-sm text-gray-400">
                    "Select the connection method for your Ledger hardware wallet"
                </div>
                <Show when=move || !has_ble_permissions.get()>
                    <button
                        class="w-full p-3 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                        on:click=move |_| {
                            let _promise_detached = tauri_invoke_no_args("request_ble_permissions");
                        }
                    >
                        "Enable Bluetooth"
                    </button>
                </Show>
            </Suspense>
        </div>
    }
}

#[component]
pub fn PreferencesSettings() -> impl IntoView {
    let config_context = expect_context::<ConfigContext>();

    let realtime_updates = Memo::new(move |_| config_context.config.get().realtime_balance_updates);
    let realtime_prices = Memo::new(move |_| config_context.config.get().realtime_price_updates);
    let play_sound = Memo::new(move |_| config_context.config.get().play_transfer_sound);
    let analytics_disabled = Memo::new(move |_| config_context.config.get().analytics_disabled);
    let hide_to_tray = Memo::new(move |_| config_context.config.get().hide_to_tray);
    let autostart = Memo::new(move |_| config_context.config.get().autostart);
    let amounts_hidden = Memo::new(move |_| config_context.config.get().amounts_hidden);
    let short_amounts = Memo::new(move |_| config_context.config.get().short_amounts);
    let prevent_screenshots = Memo::new(move |_| config_context.config.get().prevent_screenshots);

    let updates_disabled = Signal::derive(|| false);
    let prices_disabled = Signal::derive(|| false);
    let sound_disabled = Signal::derive(move || !realtime_updates.get());
    let analytics_switch_disabled = Signal::derive(move || false);

    let (custom_slippage_input, set_custom_slippage_input) = signal("".to_string());

    let window_width = use_window_size().width;
    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">Preferences</div>

            <div class="space-y-1">
                <Show when=move || is_tauri() && !is_android()>
                    <ToggleSwitch
                        label="Hide to system tray instead of closing"
                        value=hide_to_tray
                        disabled=Signal::derive(|| false)
                        on_toggle=move || {
                            config_context
                                .set_config
                                .update(|config| {
                                    config.hide_to_tray = !config.hide_to_tray;
                                });
                        }
                    />
                    <ToggleSwitch
                        label="Autostart the wallet on system startup"
                        value=autostart
                        disabled=Signal::derive(|| false)
                        on_toggle=move || {
                            config_context
                                .set_config
                                .update(|config| {
                                    config.autostart = !config.autostart;
                                });
                        }
                    />
                </Show>
                <ToggleSwitch
                    label="Update balances in real-time"
                    value=realtime_updates
                    disabled=updates_disabled
                    on_toggle=move || {
                        config_context
                            .set_config
                            .update(|config| {
                                config.realtime_balance_updates = !config.realtime_balance_updates;
                                if !config.realtime_balance_updates {
                                    config.play_transfer_sound = false;
                                }
                            });
                    }
                />
                <ToggleSwitch
                    label="Play sound effect when receiving transfers"
                    value=play_sound
                    disabled=sound_disabled
                    on_toggle=move || {
                        if realtime_updates.get() {
                            config_context
                                .set_config
                                .update(|config| {
                                    config.play_transfer_sound = !config.play_transfer_sound;
                                });
                        }
                    }
                />
                <ToggleSwitch
                    label="Update token prices in real-time"
                    value=realtime_prices
                    disabled=prices_disabled
                    on_toggle=move || {
                        config_context
                            .set_config
                            .update(|config| {
                                config.realtime_price_updates = !config.realtime_price_updates;
                            });
                    }
                />
                <ToggleSwitch
                    label="Disable telemetry"
                    value=analytics_disabled
                    disabled=analytics_switch_disabled
                    on_toggle=move || {
                        config_context
                            .set_config
                            .update(|config| {
                                config.analytics_disabled = !config.analytics_disabled;
                            });
                    }
                />
                <ToggleSwitch
                    label="Hide Amounts"
                    value=amounts_hidden
                    disabled=Signal::derive(|| false)
                    on_toggle=move || {
                        config_context
                            .set_config
                            .update(|config| {
                                config.amounts_hidden = !config.amounts_hidden;
                            });
                    }
                />
                <ToggleSwitch
                    label="Short Amounts (1.00K instead of 1000.00)"
                    value=short_amounts
                    disabled=Signal::derive(|| false)
                    on_toggle=move || {
                        config_context
                            .set_config
                            .update(|config| {
                                config.short_amounts = !config.short_amounts;
                            });
                    }
                />
                <Show when=is_android>
                    <ToggleSwitch
                        label="Disable screenshots"
                        value=prevent_screenshots
                        disabled=Signal::derive(|| false)
                        on_toggle=move || {
                            config_context
                                .set_config
                                .update(|config| {
                                    config.prevent_screenshots = !config.prevent_screenshots;
                                });
                        }
                    />
                </Show>
            </div>

            // Ledger hardware wallet settings
            <div class="text-lg font-medium text-gray-300 mt-6">"Ledger Hardware Wallet"</div>
            <LedgerSelector />

            // Slippage settings section
            <div class="mt-2">
                <div class="text-lg font-medium text-gray-300 mb-4">"Slippage Tolerance"</div>
                <div class="bg-neutral-800 rounded-xl p-4 space-y-4">
                    <div class="text-sm text-gray-400 mb-3">
                        "Current: "
                        <span class="text-white font-medium">
                            {move || format!("{}", config_context.config.get().slippage)}
                        </span>
                    </div>

                    <div class="grid grid-cols-4 gap-2 mb-4">
                        {SLIPPAGE_PRESETS
                            .into_iter()
                            .map(|percentage| {
                                let is_selected = move || {
                                    if let crate::pages::swap::Slippage::Fixed { slippage } = config_context
                                        .config
                                        .get()
                                        .slippage
                                    {
                                        slippage
                                            == BigDecimal::from_f64(percentage).unwrap()
                                                / BigDecimal::from(100)
                                    } else {
                                        false
                                    }
                                };
                                view! {
                                    <button
                                        class="py-2 rounded-lg text-sm transition-colors cursor-pointer"
                                        style=move || {
                                            if is_selected() {
                                                "background-color: rgb(59 130 246); color: white;"
                                            } else {
                                                "background-color: rgb(64 64 64); color: rgb(209 213 219);"
                                            }
                                        }
                                        on:click=move |_| {
                                            config_context
                                                .set_config
                                                .update(|config| {
                                                    config.slippage = Slippage::Fixed {
                                                        slippage: BigDecimal::from_f64(percentage).unwrap()
                                                            / BigDecimal::from(100),
                                                    };
                                                });
                                            set_custom_slippage_input.set("".to_string());
                                        }
                                    >
                                        {format!("{}%", percentage)}
                                    </button>
                                }
                            })
                            .collect_view()}
                    </div>

                    <div class="space-y-2">
                        <div class="text-gray-400 text-sm">"Custom"</div>
                        <div class="flex gap-2">
                            <input
                                type="text"
                                class="bg-neutral-700 text-white rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-[calc(100%-1em)]"
                                placeholder="1.0"
                                prop:value=custom_slippage_input
                                on:input=move |ev| {
                                    let value = event_target_value(&ev);
                                    set_custom_slippage_input.set(value.clone());
                                    if let Ok(percentage) = value.parse::<BigDecimal>() {
                                        let percentage = percentage
                                            .clamp(
                                                BigDecimal::from_str("0.01").unwrap(),
                                                BigDecimal::from(100),
                                            );
                                        config_context
                                            .set_config
                                            .update(|config| {
                                                config.slippage = Slippage::Fixed {
                                                    slippage: percentage / BigDecimal::from(100),
                                                };
                                            });
                                    }
                                }
                            />
                            <span class="text-gray-400 text-sm self-center shrink-0">"%"</span>
                            <div class="h-6 w-[1px] bg-neutral-500 self-center shrink-0"></div>
                            <span class="text-gray-400 text-sm self-center shrink-0">"or"</span>
                            <button
                                class="px-3 min-w-20 shrink-0 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                                style=move || {
                                    if matches!(
                                        config_context.config.get().slippage,
                                        Slippage::Auto { .. }
                                    ) {
                                        "background-color: rgb(59 130 246); color: white;"
                                    } else {
                                        "background-color: rgb(64 64 64); color: rgb(209 213 219);"
                                    }
                                }
                                on:click=move |_| {
                                    config_context
                                        .set_config
                                        .update(|config| {
                                            config.slippage = Slippage::default();
                                        });
                                    set_custom_slippage_input.set("".to_string());
                                }
                            >
                                "Auto"
                            </button>
                        </div>
                    </div>

                    <div class="text-xs text-gray-400">
                        "If the price moves unfavorably by more than this percentage while you're clicking the button, the transaction will be cancelled."
                    </div>
                </div>
            </div>

            // Background selection section
            {move || {
                #[allow(clippy::float_arithmetic)]
                if window_width() < 960.0 {
                    ().into_any()
                } else {
                    view! {
                        <div class="mt-6">
                            <div class="text-lg font-medium text-gray-300 mb-4">
                                "Background Theme"
                            </div>
                            <div class="bg-neutral-800 rounded-xl p-4 space-y-4">
                                <div class="text-sm text-gray-400 mb-3">
                                    "Choose your preferred background style"
                                </div>

                                <div class="space-y-2">
                                    {BackgroundGroup::all_variants()
                                        .iter()
                                        .copied()
                                        .map(|group| {
                                            let is_selected = move || {
                                                config_context.config.get().background_group == group
                                            };
                                            view! {
                                                <button
                                                    class="w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors cursor-pointer"
                                                    style=move || {
                                                        if is_selected() {
                                                            "background-color: rgb(59 130 246); color: white;"
                                                        } else {
                                                            "background-color: rgb(64 64 64); color: rgb(209 213 219);"
                                                        }
                                                    }
                                                    on:click=move |_| {
                                                        config_context
                                                            .set_config
                                                            .update(|config| {
                                                                config.background_group = group;
                                                            });
                                                    }
                                                >
                                                    <span>{group.display_name()}</span>
                                                    <span class="text-xs opacity-75">
                                                        {format!("{} backgrounds", group.get_count())}
                                                    </span>
                                                </button>
                                            }
                                        })
                                        .collect_view()}
                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            }}

            // Hidden NFTs management
            <div class="mt-6">
                <div class="text-lg font-medium text-gray-300 mb-4">"Hidden NFTs"</div>
                <div class="bg-neutral-800 rounded-xl p-4 space-y-4">
                    {move || {
                        let hidden_list = config_context.config.get().hidden_nfts.clone();
                        if hidden_list.is_empty() {
                            view! {
                                <div class="text-sm text-gray-400">
                                    "You have no hidden NFTs. You can hide NFTs by clicking the eye icon in the NFT view."
                                </div>
                            }
                                .into_any()
                        } else {
                            view! {
                                <div class="space-y-3">
                                    {hidden_list
                                        .into_iter()
                                        .map(|item| {
                                            let display_text = match &item {
                                                HiddenNft::Collection(acc) => acc.to_string(),
                                                HiddenNft::Token(acc, tid) => format!("{acc} / #{tid}"),
                                            };
                                            let set_config = config_context.set_config;
                                            let item_clone = item.clone();
                                            let remove_item = move |_| {
                                                set_config
                                                    .update(|cfg| {
                                                        cfg.hidden_nfts.retain(|h| h != &item_clone);
                                                    });
                                            };
                                            view! {
                                                <div class="flex justify-between items-center bg-neutral-700 rounded-lg p-3">
                                                    <span class="text-sm text-white break-all">
                                                        {display_text}
                                                    </span>
                                                    <button
                                                        class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                                        on:click=remove_item
                                                    >
                                                        <Icon icon=icondata::LuTrash width="16" height="16" />
                                                    </button>
                                                </div>
                                            }
                                        })
                                        .collect_view()}
                                </div>
                            }
                                .into_any()
                        }
                    }}
                </div>
            </div>
        </div>
    }
}
