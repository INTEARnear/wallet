use crate::translations::TranslationKey;
use leptos::prelude::*;

#[component]
pub fn DangerConfirmInput(
    #[prop(into)] set_is_confirmed: WriteSignal<bool>,
    #[prop(optional)] expected_text: Option<Signal<String>>,
    #[prop(optional)] label_text: Option<Signal<String>>,
    #[prop(optional)] placeholder_text: Option<Signal<String>>,
    #[prop(into)] warning_title: Signal<String>,
    #[prop(into)] warning_message: Signal<String>,
) -> impl IntoView {
    let label_text = label_text.unwrap_or_else(|| {
        Signal::derive(move || TranslationKey::ComponentsDangerConfirmInputLabelText.format(&[]))
    });
    let placeholder_text = placeholder_text.unwrap_or_else(|| {
        Signal::derive(move || {
            TranslationKey::ComponentsDangerConfirmInputPlaceholderText.format(&[])
        })
    });

    let (confirmation_text, set_confirmation_text) = signal(String::new());

    Effect::new(move || {
        let expected = match &expected_text {
            Some(s) => s.get(),
            None => TranslationKey::ComponentsDangerConfirmInputExpectedText.format(&[]),
        };
        let _ = confirmation_text.get();
        set_is_confirmed.set(confirmation_text.get() == expected);
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
                        class="bg-neutral-900/50 border border-red-700/50 rounded-lg px-4 py-2 text-white text-base"
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
