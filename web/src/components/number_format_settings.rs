use crate::components::select::{Select, SelectOption};
use crate::contexts::config_context::{
    CompactDisplay, ConfigContext, ConstrainedUsize, InsanelyCustomizableAmountFormat, Notation,
    NumberConfig, RoundingIncrement, RoundingMode, RoundingPriority, TrailingZeroDisplay,
    UseGrouping,
};
use crate::utils::{format_number_with_config, sanitize_custom_format};
use bigdecimal::{BigDecimal, FromPrimitive};
use leptos::prelude::*;

const NUMBER_PREVIEW_VALUES: [f64; 6] = [0.0, 0.004321, 0.5, 12.3456, 1234.567, -98765.4321];

const ROUNDING_PRIORITY_OPTIONS: [(&str, &str); 3] = [
    ("auto", "Auto"),
    ("morePrecision", "More precision"),
    ("lessPrecision", "Less precision"),
];
const ROUNDING_INCREMENT_OPTIONS: [(&str, &str); 15] = [
    ("1", "1"),
    ("2", "2"),
    ("5", "5"),
    ("10", "10"),
    ("20", "20"),
    ("25", "25"),
    ("50", "50"),
    ("100", "100"),
    ("200", "200"),
    ("250", "250"),
    ("500", "500"),
    ("1000", "1000"),
    ("2000", "2000"),
    ("2500", "2500"),
    ("5000", "5000"),
];
const ROUNDING_MODE_OPTIONS: [(&str, &str); 9] = [
    ("ceil", "Ceil"),
    ("floor", "Floor"),
    ("expand", "Expand"),
    ("trunc", "Truncate"),
    ("halfCeil", "Half ceiling"),
    ("halfFloor", "Half floor"),
    ("halfExpand", "Half expand"),
    ("halfTrunc", "Half truncate"),
    ("halfEven", "Half even"),
];
const TRAILING_ZERO_DISPLAY_OPTIONS: [(&str, &str); 2] =
    [("auto", "Auto"), ("stripIfInteger", "Strip if integer")];
const NOTATION_OPTIONS: [(&str, &str); 4] = [
    ("standard", "Standard"),
    ("scientific", "Scientific"),
    ("engineering", "Engineering"),
    ("compact", "Compact"),
];
const COMPACT_DISPLAY_OPTIONS: [(&str, &str); 2] = [("short", "Short"), ("long", "Long")];
const USE_GROUPING_OPTIONS: [(&str, &str); 4] = [
    ("auto", "Auto"),
    ("always", "Always"),
    ("min2", "Minimum 2 digits"),
    ("false", "Off"),
];

fn build_select_options(options: &[(&'static str, &'static str)]) -> Vec<SelectOption> {
    options
        .iter()
        .map(|(value, label)| {
            let label = *label;
            SelectOption::new((*value).to_string(), move || label.to_string().into_any())
        })
        .collect()
}

fn is_valid_usize_input(value: &str, min: usize, max: usize) -> bool {
    value
        .trim()
        .parse::<usize>()
        .ok()
        .is_some_and(|parsed| parsed >= min && parsed <= max)
}

fn format_preview_number(value: f64, number_config: &NumberConfig) -> String {
    BigDecimal::from_f64(value)
        .map(|decimal| format_number_with_config(decimal, number_config, true))
        .unwrap_or_else(|| value.to_string())
}

#[component]
pub fn NumberFormatSettings() -> impl IntoView {
    let config_context = expect_context::<ConfigContext>();

    let initial_number_config = config_context.config.get_untracked().number_config.clone();
    let raw_custom_format = match &initial_number_config {
        NumberConfig::Customizable { amount_format } => *amount_format,
        NumberConfig::Simple { .. } => InsanelyCustomizableAmountFormat::default(),
    };
    let initial_custom_format = sanitize_custom_format(raw_custom_format);
    // Persist sanitized format on mount if it differs from stored value
    if matches!(&initial_number_config, NumberConfig::Customizable { .. })
        && raw_custom_format != initial_custom_format
    {
        config_context.set_config.update(|config| {
            config.number_config = NumberConfig::Customizable {
                amount_format: initial_custom_format,
            };
        });
    }
    let (custom_format_state, set_custom_format_state) = signal(initial_custom_format);

    let (min_integer_input, set_min_integer_input) =
        signal(initial_custom_format.minimum_integer_digits().to_string());
    let (min_fraction_input, set_min_fraction_input) =
        signal(initial_custom_format.minimum_fraction_digits().to_string());
    let (max_fraction_input, set_max_fraction_input) =
        signal(initial_custom_format.maximum_fraction_digits().to_string());
    let (min_significant_input, set_min_significant_input) = signal(
        initial_custom_format
            .minimum_significant_digits()
            .to_string(),
    );
    let (max_significant_input, set_max_significant_input) = signal(
        initial_custom_format
            .maximum_significant_digits()
            .to_string(),
    );

    let min_integer_valid =
        Memo::new(move |_| is_valid_usize_input(&min_integer_input.get(), 1, 21));
    let min_fraction_valid =
        Memo::new(move |_| is_valid_usize_input(&min_fraction_input.get(), 0, 100));
    let max_fraction_valid =
        Memo::new(move |_| is_valid_usize_input(&max_fraction_input.get(), 0, 100));
    let min_significant_valid =
        Memo::new(move |_| is_valid_usize_input(&min_significant_input.get(), 1, 21));
    let max_significant_valid =
        Memo::new(move |_| is_valid_usize_input(&max_significant_input.get(), 1, 21));

    let sync_custom_inputs = Callback::new(move |format: InsanelyCustomizableAmountFormat| {
        set_min_integer_input.set(format.minimum_integer_digits().to_string());
        set_min_fraction_input.set(format.minimum_fraction_digits().to_string());
        set_max_fraction_input.set(format.maximum_fraction_digits().to_string());
        set_min_significant_input.set(format.minimum_significant_digits().to_string());
        set_max_significant_input.set(format.maximum_significant_digits().to_string());
    });

    let apply_custom_format_update = {
        Callback::new(move |format: InsanelyCustomizableAmountFormat| {
            let sanitized = sanitize_custom_format(format);
            config_context.set_config.update(|config| {
                config.number_config = NumberConfig::Customizable {
                    amount_format: sanitized,
                };
            });
            set_custom_format_state.set(sanitized);
            sync_custom_inputs.run(sanitized);
        })
    };

    let current_custom_format =
        Memo::new(move |_| match config_context.config.get().number_config {
            NumberConfig::Customizable { amount_format } => amount_format,
            NumberConfig::Simple { .. } => custom_format_state.get(),
        });
    let apply_custom_format_update_mode = apply_custom_format_update;
    let apply_custom_format_update_min_integer = apply_custom_format_update;
    let apply_custom_format_update_min_fraction = apply_custom_format_update;
    let apply_custom_format_update_max_fraction = apply_custom_format_update;
    let apply_custom_format_update_min_significant = apply_custom_format_update;
    let apply_custom_format_update_max_significant = apply_custom_format_update;
    let apply_custom_format_update_rounding_priority = apply_custom_format_update;
    let apply_custom_format_update_rounding_increment = apply_custom_format_update;
    let apply_custom_format_update_rounding_mode = apply_custom_format_update;
    let apply_custom_format_update_trailing_zero = apply_custom_format_update;
    let apply_custom_format_update_notation = apply_custom_format_update;
    let apply_custom_format_update_use_grouping = apply_custom_format_update;
    let apply_custom_format_update_compact_display = apply_custom_format_update;

    let is_short = Signal::derive(move || {
        matches!(
            config_context.config.get().number_config,
            NumberConfig::Simple {
                short_amounts: true
            }
        )
    });
    let is_full = Signal::derive(move || {
        matches!(
            config_context.config.get().number_config,
            NumberConfig::Simple {
                short_amounts: false
            }
        )
    });
    let is_custom = Signal::derive(move || {
        matches!(
            config_context.config.get().number_config,
            NumberConfig::Customizable { .. }
        )
    });

    let rounding_priority_options =
        Signal::derive(|| build_select_options(&ROUNDING_PRIORITY_OPTIONS));
    let rounding_increment_options =
        Signal::derive(|| build_select_options(&ROUNDING_INCREMENT_OPTIONS));
    let rounding_mode_options = Signal::derive(|| build_select_options(&ROUNDING_MODE_OPTIONS));
    let trailing_zero_display_options =
        Signal::derive(|| build_select_options(&TRAILING_ZERO_DISPLAY_OPTIONS));
    let notation_options = Signal::derive(|| build_select_options(&NOTATION_OPTIONS));
    let compact_display_options = Signal::derive(|| build_select_options(&COMPACT_DISPLAY_OPTIONS));
    let use_grouping_options = Signal::derive(|| build_select_options(&USE_GROUPING_OPTIONS));

    let select_class = "w-full border rounded-lg border-neutral-700 bg-neutral-900";

    view! {
        <div class="flex items-center justify-between py-3">
            <span class="text-sm font-medium text-gray-400">"Number format"</span>
            <div class="flex gap-2">
                <button
                    class="px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                    style=move || {
                        if is_short.get() {
                            "background-color: rgb(59 130 246); color: white;"
                        } else {
                            "background-color: rgb(64 64 64); color: rgb(209 213 219);"
                        }
                    }
                    on:click=move |_| {
                        config_context
                            .set_config
                            .update(|config| {
                                config.number_config = NumberConfig::Simple {
                                    short_amounts: true,
                                };
                            });
                    }
                >
                    "Short"
                </button>
                <button
                    class="px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                    style=move || {
                        if is_full.get() {
                            "background-color: rgb(59 130 246); color: white;"
                        } else {
                            "background-color: rgb(64 64 64); color: rgb(209 213 219);"
                        }
                    }
                    on:click=move |_| {
                        config_context
                            .set_config
                            .update(|config| {
                                config.number_config = NumberConfig::Simple {
                                    short_amounts: false,
                                };
                            });
                    }
                >
                    "Full"
                </button>
                <button
                    class="px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                    style=move || {
                        if is_custom.get() {
                            "background-color: rgb(59 130 246); color: white;"
                        } else {
                            "background-color: rgb(64 64 64); color: rgb(209 213 219);"
                        }
                    }
                    on:click=move |_| {
                        let format = custom_format_state.get();
                        apply_custom_format_update_mode.run(format);
                    }
                >
                    "Custom"
                </button>
            </div>
        </div>

        <Show when=is_custom>
            <div class="mt-6">
                <div class="text-lg font-medium text-gray-300 mb-4">"Number formatting"</div>
                <div class="bg-neutral-800 rounded-xl p-4 space-y-4">
                    <div class="text-sm text-gray-400">"Customize how numbers are displayed."</div>

                    <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">
                                    "Minimum integer digits"
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="21"
                                    step="1"
                                    class="bg-neutral-700 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                                    class:border-red-500=move || !min_integer_valid.get()
                                    class:border-transparent=move || min_integer_valid.get()
                                    prop:value=min_integer_input
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        set_min_integer_input.set(value.clone());
                                        if let Ok(parsed) = value.parse::<usize>()
                                            && let Some(constrained) = ConstrainedUsize::<
                                                1,
                                                22,
                                            >::new(parsed)
                                        {
                                            let format = custom_format_state
                                                .get()
                                                .with_minimum_integer_digits(constrained);
                                            apply_custom_format_update_min_integer.run(format);
                                        }
                                    }
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">
                                    "Minimum fraction digits"
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    class="bg-neutral-700 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                                    class:border-red-500=move || !min_fraction_valid.get()
                                    class:border-transparent=move || min_fraction_valid.get()
                                    prop:value=min_fraction_input
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        set_min_fraction_input.set(value.clone());
                                        if let Ok(parsed) = value.parse::<usize>()
                                            && let Some(constrained) = ConstrainedUsize::<
                                                0,
                                                101,
                                            >::new(parsed)
                                        {
                                            let mut format = custom_format_state
                                                .get()
                                                .with_minimum_fraction_digits(constrained);
                                            if format.maximum_fraction_digits() < parsed
                                                && let Some(max_value) = ConstrainedUsize::<
                                                    0,
                                                    101,
                                                >::new(parsed)
                                            {
                                                format = format.with_maximum_fraction_digits(max_value);
                                            }
                                            apply_custom_format_update_min_fraction.run(format);
                                        }
                                    }
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">
                                    "Maximum fraction digits"
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    class="bg-neutral-700 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                                    class:border-red-500=move || !max_fraction_valid.get()
                                    class:border-transparent=move || max_fraction_valid.get()
                                    prop:value=max_fraction_input
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        set_max_fraction_input.set(value.clone());
                                        if let Ok(parsed) = value.parse::<usize>()
                                            && let Some(constrained) = ConstrainedUsize::<
                                                0,
                                                101,
                                            >::new(parsed)
                                        {
                                            let mut format = custom_format_state
                                                .get()
                                                .with_maximum_fraction_digits(constrained);
                                            if format.minimum_fraction_digits() > parsed
                                                && let Some(min_value) = ConstrainedUsize::<
                                                    0,
                                                    101,
                                                >::new(parsed)
                                            {
                                                format = format.with_minimum_fraction_digits(min_value);
                                            }
                                            apply_custom_format_update_max_fraction.run(format);
                                        }
                                    }
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">
                                    "Minimum significant digits"
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="21"
                                    step="1"
                                    class="bg-neutral-700 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                                    class:border-red-500=move || !min_significant_valid.get()
                                    class:border-transparent=move || min_significant_valid.get()
                                    prop:value=min_significant_input
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        set_min_significant_input.set(value.clone());
                                        if let Ok(parsed) = value.parse::<usize>()
                                            && let Some(constrained) = ConstrainedUsize::<
                                                1,
                                                22,
                                            >::new(parsed)
                                        {
                                            let mut format = custom_format_state
                                                .get()
                                                .with_minimum_significant_digits(constrained);
                                            if format.maximum_significant_digits() < parsed
                                                && let Some(max_value) = ConstrainedUsize::<
                                                    1,
                                                    22,
                                                >::new(parsed)
                                            {
                                                format = format.with_maximum_significant_digits(max_value);
                                            }
                                            apply_custom_format_update_min_significant.run(format);
                                        }
                                    }
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">
                                    "Maximum significant digits"
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="21"
                                    step="1"
                                    class="bg-neutral-700 text-white rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                                    class:border-red-500=move || !max_significant_valid.get()
                                    class:border-transparent=move || max_significant_valid.get()
                                    prop:value=max_significant_input
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        set_max_significant_input.set(value.clone());
                                        if let Ok(parsed) = value.parse::<usize>()
                                            && let Some(constrained) = ConstrainedUsize::<
                                                1,
                                                22,
                                            >::new(parsed)
                                        {
                                            let mut format = custom_format_state
                                                .get()
                                                .with_maximum_significant_digits(constrained);
                                            if format.minimum_significant_digits() > parsed
                                                && let Some(min_value) = ConstrainedUsize::<
                                                    1,
                                                    22,
                                                >::new(parsed)
                                            {
                                                format = format.with_minimum_significant_digits(min_value);
                                            }
                                            apply_custom_format_update_max_significant.run(format);
                                        }
                                    }
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">"Rounding priority"</label>
                                <Select
                                    options=rounding_priority_options
                                    on_change=Callback::new(move |value: String| {
                                        if let Some(priority) = RoundingPriority::parse(&value) {
                                            let format = custom_format_state
                                                .get()
                                                .with_rounding_priority(priority);
                                            apply_custom_format_update_rounding_priority.run(format);
                                        }
                                    })
                                    class=select_class
                                    initial_value=current_custom_format
                                        .get_untracked()
                                        .rounding_priority()
                                        .as_str()
                                        .to_string()
                                />
                            </div>
                            <Show when=move || {
                                current_custom_format.get().rounding_priority()
                                    == RoundingPriority::Auto
                            }>
                                <div class="space-y-2">
                                    <label class="text-gray-400 text-sm">
                                        "Rounding increment"
                                    </label>
                                    <Select
                                        options=rounding_increment_options
                                        on_change=Callback::new(move |value: String| {
                                            if let Some(increment) = RoundingIncrement::parse(&value) {
                                                let format = custom_format_state
                                                    .get()
                                                    .with_rounding_increment(increment);
                                                apply_custom_format_update_rounding_increment.run(format);
                                            }
                                        })
                                        class=select_class
                                        initial_value=current_custom_format
                                            .get_untracked()
                                            .rounding_increment()
                                            .as_str()
                                            .to_string()
                                    />
                                </div>
                            </Show>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">"Rounding mode"</label>
                                <Select
                                    options=rounding_mode_options
                                    on_change=Callback::new(move |value: String| {
                                        if let Some(mode) = RoundingMode::parse(&value) {
                                            let format = custom_format_state
                                                .get()
                                                .with_rounding_mode(mode);
                                            apply_custom_format_update_rounding_mode.run(format);
                                        }
                                    })
                                    class=select_class
                                    initial_value=current_custom_format
                                        .get_untracked()
                                        .rounding_mode()
                                        .as_str()
                                        .to_string()
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">"Trailing zero display"</label>
                                <Select
                                    options=trailing_zero_display_options
                                    on_change=Callback::new(move |value: String| {
                                        if let Some(display) = TrailingZeroDisplay::parse(&value) {
                                            let format = custom_format_state
                                                .get()
                                                .with_trailing_zero_display(display);
                                            apply_custom_format_update_trailing_zero.run(format);
                                        }
                                    })
                                    class=select_class
                                    initial_value=current_custom_format
                                        .get_untracked()
                                        .trailing_zero_display()
                                        .as_str()
                                        .to_string()
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">"Notation"</label>
                                <Select
                                    options=notation_options
                                    on_change=Callback::new(move |value: String| {
                                        if let Some(notation) = Notation::parse(&value) {
                                            let format = custom_format_state
                                                .get()
                                                .with_notation(notation);
                                            apply_custom_format_update_notation.run(format);
                                        }
                                    })
                                    class=select_class
                                    initial_value=current_custom_format
                                        .get_untracked()
                                        .notation()
                                        .as_str()
                                        .to_string()
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">"Grouping"</label>
                                <Select
                                    options=use_grouping_options
                                    on_change=Callback::new(move |value: String| {
                                        if let Some(grouping) = UseGrouping::parse(&value) {
                                            let format = custom_format_state
                                                .get()
                                                .with_use_grouping(grouping);
                                            apply_custom_format_update_use_grouping.run(format);
                                        }
                                    })
                                    class=select_class
                                    initial_value=current_custom_format
                                        .get_untracked()
                                        .use_grouping()
                                        .as_str()
                                        .to_string()
                                />
                            </div>
                        </div>

                        <Show when=move || {
                            current_custom_format.get().notation() == Notation::Compact
                        }>
                            <div class="space-y-2">
                                <label class="text-gray-400 text-sm">"Compact display"</label>
                                <Select
                                    options=compact_display_options
                                    on_change=Callback::new(move |value: String| {
                                        if let Some(display) = CompactDisplay::parse(&value) {
                                            let format = custom_format_state
                                                .get()
                                                .with_compact_display(Some(display));
                                            apply_custom_format_update_compact_display.run(format);
                                        }
                                    })
                                    class=select_class
                                    initial_value=current_custom_format
                                        .get_untracked()
                                        .compact_display()
                                        .map(|d| d.as_str())
                                        .unwrap_or("short")
                                        .to_string()
                                />
                            </div>
                        </Show>

                        <div class="text-xs text-gray-400">
                            "Significant digits apply when rounding priority is not auto. Rounding increment requires rounding priority set to auto and matching fraction digits."
                        </div>
                    </div>
                    <div class="pt-2 border-t border-neutral-700">
                        <div class="text-sm text-gray-400 mb-3">"Preview"</div>
                        <div class="grid gap-2 sm:grid-cols-2">
                            {NUMBER_PREVIEW_VALUES
                                .iter()
                                .copied()
                                .map(|value| {
                                    let label = format!("{value}");
                                    view! {
                                        <div class="flex items-center justify-between bg-neutral-900/40 rounded-lg px-3 py-2">
                                            <span class="text-xs text-gray-400">{label}</span>
                                            <span class="text-sm text-white">
                                                {move || {
                                                    let number_config = config_context
                                                        .config
                                                        .get()
                                                        .number_config;
                                                    format_preview_number(value, &number_config)
                                                }}
                                            </span>
                                        </div>
                                    }
                                })
                                .collect_view()}
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    }
}
