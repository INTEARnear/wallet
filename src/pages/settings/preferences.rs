use crate::contexts::config_context::ConfigContext;
use leptos::prelude::*;

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
        </div>
    }
}
