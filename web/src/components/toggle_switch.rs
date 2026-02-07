use leptos::prelude::*;

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
