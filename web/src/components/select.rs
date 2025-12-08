use leptos::{html::Div, prelude::*};
use leptos_icons::*;
use std::{fmt, fmt::Debug, sync::Arc};

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
    #[prop(into)] on_change: Callback<String>,
) -> impl IntoView {
    let (is_open, set_is_open) = signal(false);
    let container_ref = NodeRef::<Div>::new();

    let disabled = Signal::derive_local(move || disabled.map(|d| d.get()).unwrap_or_else(|| false));

    let (value, set_value) = signal(initial_value.clone().unwrap_or_else(|| {
        options()
            .first()
            .map(|opt| opt.value.clone())
            .unwrap_or_default()
    }));

    let current_option = Memo::new(move |_| {
        options()
            .iter()
            .find(|opt| opt.value == value.get())
            .cloned()
    });

    let handle_option_click = move |option: SelectOption| {
        if !option.disabled {
            set_value.set(option.value.clone());
            on_change.run(option.value.clone());
            set_is_open.set(false);
        }
    };

    let base_classes = "relative w-full";
    let classes = class.map_or(base_classes.to_string(), |c| format!("{base_classes} {c}"));

    view! {
        <div class=classes>
            <div node_ref=container_ref class="relative">
                <button
                    type="button"
                    class="w-full flex items-center justify-between p-3 rounded-lg focus:outline-none cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed hover:text-neutral-400"
                    disabled=move || disabled.get()
                    on:click=move |_| {
                        if !disabled.get() {
                            set_is_open.update(|open| *open = !*open);
                        }
                    }
                >
                    {move || {
                        match current_option.get() { Some(current) => {
                            (current.label)()
                        } _ => {
                            view! {
                                <span class="truncate text-gray-400">
                                    {placeholder
                                        .clone()
                                        .unwrap_or_else(|| "Select an option".to_string())}
                                </span>
                            }
                                .into_any()
                        }}
                    }}
                    <Icon
                        icon=icondata::LuChevronDown
                        width="16"
                        height="16"
                        attr:class="flex-shrink-0 ml-2"
                        attr:style=move || {
                            format!("transform: rotate({}deg);", if is_open() { 180 } else { 0 })
                        }
                    />
                </button>

                <Show when=is_open>
                    <div
                        class="absolute top-full right-0 z-[50000] mt-1 max-h-60 overflow-auto rounded-lg bg-neutral-800 border border-neutral-700 shadow-lg"
                        style=format!(
                            "width: {}",
                            if let Some(width) = width.as_ref() {
                                width
                            } else {
                                "100%"
                            },
                        )
                    >
                        {move || {
                            options()
                                .into_iter()
                                .map(|option| {
                                    let option_clone = option.clone();
                                    let is_selected = move || option.value == value.get();
                                    let is_selected2 = is_selected.clone();

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
                                                {(option.label)()} <Show when=is_selected2>
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
                </Show>
            </div>
        </div>
    }
}
