use leptos::prelude::*;

#[component]
pub fn DangerConfirmInput(
    #[prop(into)] set_is_confirmed: WriteSignal<bool>,
    #[prop(default = "CONFIRM")] expected_text: &'static str,
    #[prop(default = "Type 'CONFIRM' to proceed:")] label_text: &'static str,
    #[prop(default = "Type CONFIRM")] placeholder_text: &'static str,
    #[prop(into)] warning_title: String,
    #[prop(into)] warning_message: String,
) -> impl IntoView {
    let (confirmation_text, set_confirmation_text) = signal(String::new());

    Effect::new(move || {
        set_is_confirmed.set(confirmation_text.get() == expected_text);
    });

    view! {
        <div>
            <div class="p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p class="text-red-200 font-medium mb-2">{warning_title}</p>
                <p class="text-red-300 text-sm mb-4">{warning_message}</p>
                <div class="flex flex-col gap-2">
                    <label for="confirm" class="text-red-200 text-sm">
                        {label_text}
                    </label>
                    <input
                        id="confirm"
                        type="text"
                        class="bg-neutral-900/50 border border-red-700/50 rounded-lg px-4 py-2 text-white"
                        placeholder=placeholder_text
                        prop:value=confirmation_text
                        on:input=move |ev| {
                            set_confirmation_text(event_target_value(&ev));
                        }
                    />
                </div>
            </div>
        </div>
    }
}
