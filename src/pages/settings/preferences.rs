use crate::contexts::config_context::ConfigContext;
use bigdecimal::{BigDecimal, FromPrimitive};
use leptos::prelude::*;

pub const SLIPPAGE_PRESETS: [f64; 4] = [0.5, 1.0, 2.0, 5.0];

#[component]
fn ToggleSwitch(
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
pub fn PreferencesSettings() -> impl IntoView {
    let config_context = expect_context::<ConfigContext>();

    let realtime_updates = Memo::new(move |_| config_context.config.get().realtime_balance_updates);
    let realtime_prices = Memo::new(move |_| config_context.config.get().realtime_price_updates);
    let play_sound = Memo::new(move |_| config_context.config.get().play_transfer_sound);

    let updates_disabled = Signal::derive(|| false);
    let prices_disabled = Signal::derive(|| false);
    let sound_disabled = Signal::derive(move || !realtime_updates.get());

    let (custom_slippage_input, set_custom_slippage_input) = signal("".to_string());

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">Preferences</div>

            <div class="space-y-1">
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
            </div>

            // Slippage settings section
            <div class="mt-6">
                <div class="text-lg font-medium text-gray-300 mb-4">"Slippage Tolerance"</div>
                <div class="bg-neutral-800 rounded-xl p-4 space-y-4">
                    <div class="text-sm text-gray-400 mb-3">
                        "Current: "
                        <span class="text-white font-medium">
                            {move || format!("{}%", config_context.config.get().slippage)}
                        </span>
                    </div>

                    <div class="grid grid-cols-4 gap-2 mb-4">
                        {SLIPPAGE_PRESETS
                            .into_iter()
                            .map(|percentage| {
                                let is_selected = move || {
                                    let current_slippage = BigDecimal::from_f64(
                                            config_context.config.get().slippage,
                                        )
                                        .unwrap_or_default();
                                    let preset_slippage = BigDecimal::from_f64(percentage)
                                        .unwrap_or_default();
                                    current_slippage == preset_slippage
                                };
                                view! {
                                    <button
                                        class=move || {
                                            format!(
                                                "px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer {}",
                                                if is_selected() {
                                                    "bg-blue-500 text-white"
                                                } else {
                                                    "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
                                                },
                                            )
                                        }
                                        on:click=move |_| {
                                            config_context
                                                .set_config
                                                .update(|config| {
                                                    config.slippage = percentage;
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
                                class="flex-1 bg-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1.0"
                                prop:value=custom_slippage_input
                                on:input=move |ev| {
                                    let value = event_target_value(&ev);
                                    set_custom_slippage_input.set(value.clone());
                                    if let Ok(percentage) = value.parse::<f64>() {
                                        let percentage = percentage.clamp(0.01, 100.0);
                                        config_context
                                            .set_config
                                            .update(|config| {
                                                config.slippage = percentage;
                                            });
                                    }
                                }
                            />
                            <span class="text-gray-400 text-sm self-center">"%"</span>
                        </div>
                    </div>

                    <div class="text-xs text-gray-400">
                        "If the price moves unfavorably by more than this percentage while you're clicking the button, the transaction will be cancelled."
                    </div>
                </div>
            </div>
        </div>
    }
}
