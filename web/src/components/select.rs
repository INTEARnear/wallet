use leptos::{
    html::{Div, Input},
    prelude::*,
};
use leptos_icons::*;
use leptos_use::{use_document, use_event_listener};
use std::{
    fmt::{self, Debug},
    sync::Arc,
    time::Duration,
};
use wasm_bindgen::JsCast;

pub trait AnyViewCopy: Fn() -> AnyView + Send + Sync + 'static {}

impl<F> AnyViewCopy for F where F: Fn() -> AnyView + Send + Sync + 'static {}

#[derive(Clone)]
pub struct SelectOption {
    value: String,
    label: Arc<dyn AnyViewCopy>,
    disabled: bool,
}

impl Debug for SelectOption {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("SelectOption")
            .field("value", &self.value)
            .field("disabled", &self.disabled)
            .finish()
    }
}

impl PartialEq for SelectOption {
    fn eq(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

impl SelectOption {
    pub fn new(value: String, label: impl AnyViewCopy) -> Self {
        Self {
            value,
            label: Arc::new(label),
            disabled: false,
        }
    }

    pub fn disabled(mut self, disabled: bool) -> Self {
        self.disabled = disabled;
        self
    }
}

#[component]
pub fn Select(
    options: Signal<Vec<SelectOption>>,
    #[prop(optional, into)] placeholder: Option<String>,
    #[prop(optional)] disabled: Option<Signal<bool>>,
    #[prop(optional, into)] class: Option<&'static str>,
    #[prop(optional, into)] initial_value: Option<String>,
    #[prop(optional, into)] width: Option<String>,
    #[prop(optional, default = false)] filter_enabled: bool,
    #[prop(into)] on_change: Callback<String>,
) -> impl IntoView {
    let (is_open, set_is_open) = signal(false);
    let container_ref = NodeRef::<Div>::new();
    let filter_input_ref = NodeRef::<Input>::new();
    let (filter_text, set_filter_text) = signal(String::new());

    let disabled = Signal::derive_local(move || disabled.map(|d| d.get()).unwrap_or_else(|| false));

    let (value, set_value) = signal(initial_value);

    let filtered_options = Memo::new(move |_| {
        let filter = filter_text.get().to_lowercase();
        if filter.is_empty() {
            options()
        } else {
            options()
                .into_iter()
                .filter(|opt| opt.value.to_lowercase().starts_with(&filter))
                .collect()
        }
    });

    let current_option = Memo::new(move |_| {
        options()
            .iter()
            .find(|opt| value.get().is_some_and(|v| v == opt.value))
            .cloned()
    });

    let handle_option_click = move |option: SelectOption| {
        if !option.disabled {
            set_value.set(Some(option.value.clone()));
            on_change.run(option.value.clone());
            set_filter_text.set(String::new());
            set_is_open.set(false);
        }
    };

    let base_classes = "relative w-full";
    let classes = class.map_or(base_classes.to_string(), |c| format!("{base_classes} {c}"));
    let placeholder_text = placeholder
        .clone()
        .unwrap_or_else(|| "Select an option".to_string());

    // Close dropdown when clicking outside
    let _ = use_event_listener(use_document(), leptos::ev::mousedown, move |ev| {
        if is_open.get_untracked()
            && let Some(container) = container_ref.get()
            && let Some(target) = ev.target()
        {
            let target_element: Option<web_sys::Element> = target.dyn_ref().cloned();
            if let Some(target_elem) = target_element
                && !container.contains(Some(&target_elem))
            {
                set_is_open.set(false);
                set_filter_text.set(String::new());
            }
        }
    });

    view! {
        <div class=classes>
            <div node_ref=container_ref class="relative">
                {move || {
                    let placeholder_text = placeholder_text.clone();
                    if filter_enabled {
                        view! {
                            <div class="relative w-full flex items-center">
                                <input
                                    node_ref=filter_input_ref
                                    type="text"
                                    class="w-full flex items-center justify-between p-3 rounded-lg focus:outline-none cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed bg-neutral-700 pr-10"
                                    class:text-white=move || value.read().is_some() || is_open()
                                    class:text-neutral-400=move || {
                                        value.read().is_none() && !is_open()
                                    }
                                    placeholder=placeholder_text.clone()
                                    prop:value=move || {
                                        if is_open() {
                                            filter_text.get()
                                        } else {
                                            current_option
                                                .get()
                                                .map(|opt| opt.value.clone())
                                                .unwrap_or_else(|| placeholder_text.clone())
                                        }
                                    }
                                    disabled=disabled
                                    on:mousedown=move |ev| {
                                        if !disabled.get_untracked() && is_open.get_untracked() {
                                            ev.stop_propagation();
                                            set_is_open.set(false);
                                            set_timeout(
                                                move || {
                                                    filter_input_ref.get_untracked().map(|input| input.blur());
                                                },
                                                Duration::ZERO,
                                            );
                                        }
                                    }
                                    on:focus=move |_| {
                                        if !disabled.get_untracked() && !is_open.get_untracked() {
                                            set_is_open.set(true);
                                        }
                                    }
                                    on:input=move |ev| {
                                        let text = event_target_value(&ev);
                                        set_filter_text.set(text.clone());
                                        if !is_open.get() {
                                            set_is_open.set(true);
                                        }
                                    }
                                />
                                <Icon
                                    icon=icondata::LuChevronDown
                                    width="16"
                                    height="16"
                                    attr:class="absolute right-3 flex-shrink-0 pointer-events-none"
                                    attr:style=move || {
                                        format!(
                                            "transform: rotate({}deg);",
                                            if is_open() { 180 } else { 0 },
                                        )
                                    }
                                />
                            </div>
                        }
                            .into_any()
                    } else {
                        view! {
                            <button
                                type="button"
                                class="w-full flex items-center justify-between p-3 rounded-lg focus:outline-none cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed hover:text-neutral-400"
                                disabled=disabled
                                on:click=move |_| {
                                    if !disabled.get() {
                                        set_is_open
                                            .update(|open| {
                                                if *open {
                                                    set_filter_text.set(String::new());
                                                }
                                                *open = !*open;
                                            });
                                    }
                                }
                            >
                                {move || {
                                    match current_option.get() {
                                        Some(current) => (current.label)(),
                                        _ => {
                                            view! {
                                                <span class="truncate text-gray-400">
                                                    {placeholder_text.clone()}
                                                </span>
                                            }
                                                .into_any()
                                        }
                                    }
                                }}
                                <Icon
                                    icon=icondata::LuChevronDown
                                    width="16"
                                    height="16"
                                    attr:class="flex-shrink-0 ml-2"
                                    attr:style=move || {
                                        format!(
                                            "transform: rotate({}deg);",
                                            if is_open() { 180 } else { 0 },
                                        )
                                    }
                                />
                            </button>
                        }
                            .into_any()
                    }
                }}

                <Show when=is_open>
                    <div
                        class="absolute top-full right-0 z-[50000] mt-1 max-h-60 overflow-auto rounded-lg bg-neutral-800 border border-neutral-700 shadow-lg flex flex-col"
                        style=format!(
                            "width: {}",
                            if let Some(width) = width.as_ref() { width } else { "100%" },
                        )
                    >
                        <div class="overflow-auto">
                            {move || {
                                filtered_options
                                    .get()
                                    .into_iter()
                                    .map(|option| {
                                        let option_clone = option.clone();
                                        let is_selected = move || {
                                            value.get().is_some_and(|v| v == option.value)
                                        };
                                        let is_selected_clone = is_selected.clone();

                                        view! {
                                            <button
                                                type="button"
                                                class="w-full text-left px-3 py-2 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                                style=move || {
                                                    if is_selected() {
                                                        "background-color: rgb(3 105 161);"
                                                    } else {
                                                        ""
                                                    }
                                                }
                                                disabled=option.disabled
                                                on:click=move |_| handle_option_click(option_clone.clone())
                                            >
                                                <div class="flex items-center justify-between">
                                                    {(option.label)()} <Show when=is_selected_clone>
                                                        <Icon
                                                            icon=icondata::LuCheck
                                                            width="16"
                                                            height="16"
                                                            attr:class="flex-shrink-0 ml-2 text-blue-400"
                                                        />
                                                    </Show>
                                                </div>
                                            </button>
                                        }
                                    })
                                    .collect::<Vec<_>>()
                            }}
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    }
}
