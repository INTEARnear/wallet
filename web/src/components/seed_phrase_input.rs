use bip39::Language;
use leptos::{html::Input, prelude::*};
use wasm_bindgen::JsCast;
use web_sys::Event;

const WORD_COUNT: usize = 12;
const WORD_POSITION_NUMBER_STYLE: &str =
    "absolute -top-1 -left-1 text-xs text-neutral-500 bg-neutral-950 px-1 z-10 rounded-full";
const INPUT_BASE_STYLE: &str = "w-full bg-neutral-900/50 text-white rounded-lg px-3 py-2 focus:outline-none transition-all duration-200 text-base font-mono relative";
const AUTOCOMPLETE_OVERLAY_STYLE: &str =
    "absolute inset-0 pointer-events-none z-10 flex items-center";
const AUTOCOMPLETE_TEXT_STYLE: &str = "px-3 py-2 text-base font-mono text-neutral-400";

#[derive(Clone, PartialEq)]
pub enum WordValidationState {
    Empty,
    Valid,
    Invalid,
    Focused,
}

#[component]
pub fn SeedPhraseInput(#[prop(into)] on_change: Callback<String>) -> impl IntoView {
    let (word_values, set_word_values) = signal(vec!["".to_string(); WORD_COUNT]);
    let (focused_index, set_focused_index) = signal::<Option<usize>>(None);
    let input_refs = (0..WORD_COUNT)
        .map(|_| NodeRef::<Input>::new())
        .collect::<Vec<_>>();

    let validate_word = move |word: &str| -> bool {
        if word.is_empty() {
            return false;
        }
        Language::English
            .word_list()
            .iter()
            .any(|&w| w == word.to_lowercase().as_str())
    };

    let find_auto_completion = move |prefix: &str| -> Option<String> {
        if prefix.is_empty() {
            return None;
        }

        let prefix_lower = prefix.to_lowercase();
        let matches: Vec<&str> = Language::English
            .word_list()
            .iter()
            .filter(|&word| word.starts_with(&prefix_lower))
            .copied()
            .collect();

        if let Ok([single_completion]) = <[&str; 1]>::try_from(matches) {
            if single_completion.len() > prefix.len() {
                Some(single_completion.to_string())
            } else {
                None
            }
        } else {
            None
        }
    };

    let focus_input_at_position = |input_ref: &NodeRef<Input>, position: u32| {
        if let Some(element) = input_ref.get_untracked() {
            let _ = element.focus();
            let _ = element.set_selection_range(position, position);
        }
    };

    let move_to_next_field = {
        let input_refs = input_refs.clone();
        move |current_index: usize, cursor_position: u32| {
            if current_index < WORD_COUNT - 1 {
                if let Some(next_input) = input_refs.get(current_index + 1) {
                    focus_input_at_position(next_input, cursor_position);
                }
            }
        }
    };

    let move_to_previous_field = {
        let input_refs = input_refs.clone();
        move |current_index: usize, cursor_position: u32| {
            if current_index > 0 {
                if let Some(prev_input) = input_refs.get(current_index - 1) {
                    focus_input_at_position(prev_input, cursor_position);
                }
            }
        }
    };

    let get_word_state = move |index: usize| -> WordValidationState {
        let words = word_values.get();
        if Some(index) == focused_index.get() {
            WordValidationState::Focused
        } else if words[index].is_empty() {
            WordValidationState::Empty
        } else if validate_word(&words[index]) {
            WordValidationState::Valid
        } else {
            WordValidationState::Invalid
        }
    };

    let get_border_style = move |state: WordValidationState| -> &'static str {
        match state {
            WordValidationState::Valid => "border: 2px solid rgb(34 197 94);",
            WordValidationState::Invalid => "border: 2px solid rgb(239 68 68);",
            WordValidationState::Focused => "border: 2px solid rgb(255 255 255);",
            WordValidationState::Empty => "border: 2px solid rgb(75 85 99);",
        }
    };

    let update_seed_phrase = move || {
        on_change.run(word_values.get().join(" "));
    };

    let handle_word_change = {
        let input_refs = input_refs.clone();
        move |index: usize, value: String| {
            let trimmed_value = value.trim().to_lowercase();
            set_word_values.update(|words| {
                words[index] = trimmed_value.clone();
            });
            update_seed_phrase();

            // If a valid word is entered, move to next field
            if !trimmed_value.is_empty() && validate_word(&trimmed_value) && index < 11 {
                if let Some(next_input) = input_refs.get(index + 1) {
                    if let Some(element) = next_input.get() {
                        let _ = element.focus();
                    }
                }
            }
        }
    };

    let handle_paste = move |event: Event, target_index: usize| {
        if let Ok(clipboard_event) = event.dyn_into::<web_sys::ClipboardEvent>() {
            if let Some(clipboard_data) = clipboard_event.clipboard_data() {
                if let Ok(pasted_text) = clipboard_data.get_data("text") {
                    let words: Vec<&str> = pasted_text.split_whitespace().collect();

                    if words.len() == WORD_COUNT {
                        // If we have enough words, fill all fields
                        let new_words: Vec<String> = words
                            .iter()
                            .take(WORD_COUNT)
                            .map(|&w| w.trim().to_lowercase())
                            .collect();

                        set_word_values.set(new_words);
                        update_seed_phrase();
                        clipboard_event.prevent_default();
                    } else if words.len() > 1 && words.len() < WORD_COUNT {
                        // If we have multiple words but less than required, fill from target index
                        set_word_values.update(|current_words| {
                            for (i, &word) in words.iter().enumerate() {
                                if target_index + i < WORD_COUNT {
                                    current_words[target_index + i] = word.trim().to_lowercase();
                                }
                            }
                        });
                        update_seed_phrase();
                        clipboard_event.prevent_default();
                    }
                }
            }
        }
    };

    let handle_key_down = {
        let input_refs = input_refs.clone();
        move |event: web_sys::KeyboardEvent, index: usize| {
            let key = event.key();
            match key.as_str() {
                " " | "Enter" => {
                    // Completion + move to next field
                    if let Some(completion) =
                        find_auto_completion(&word_values.get_untracked()[index])
                    {
                        set_word_values.update(|words| {
                            words[index] = completion.clone();
                        });
                        update_seed_phrase();
                    }

                    move_to_next_field(index, 0);
                    event.prevent_default();
                }
                "Backspace" => {
                    // If current field is empty, move to previous field
                    let current_word = word_values.get_untracked()[index].clone();
                    if current_word.is_empty() && index > 0 {
                        move_to_previous_field(index, u32::MAX);
                        event.prevent_default();
                    }
                }
                "ArrowRight" => {
                    if event.ctrl_key() {
                        // Completion + move to end of next word if at end of current word
                        if let Some(target) = event.target() {
                            if let Ok(input_element) =
                                target.dyn_into::<web_sys::HtmlInputElement>()
                            {
                                let cursor_pos = input_element
                                    .selection_start()
                                    .unwrap_or(Some(0))
                                    .unwrap_or(0)
                                    as usize;
                                let word_length = word_values.get_untracked()[index].len();

                                if cursor_pos >= word_length {
                                    if let Some(completion) =
                                        find_auto_completion(&word_values.get_untracked()[index])
                                    {
                                        set_word_values.update(|words| {
                                            words[index] = completion.clone();
                                        });
                                        update_seed_phrase();
                                    }

                                    if index < 11 {
                                        if let Some(next_input) = input_refs.get(index + 1) {
                                            if let Some(element) = next_input.get_untracked() {
                                                let _ = element.focus();
                                                let next_word_length =
                                                    word_values.get_untracked()[index + 1].len()
                                                        as u32;
                                                let _ = element.set_selection_range(
                                                    next_word_length,
                                                    next_word_length,
                                                );
                                                event.prevent_default();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        // Completion + navigate to next word if cursor is at the end of current word
                        if let Some(target) = event.target() {
                            if let Ok(input_element) =
                                target.dyn_into::<web_sys::HtmlInputElement>()
                            {
                                let cursor_pos = input_element
                                    .selection_start()
                                    .unwrap_or(Some(0))
                                    .unwrap_or(0)
                                    as usize;
                                let word_length = word_values.get_untracked()[index].len();

                                if cursor_pos >= word_length {
                                    if let Some(completion) =
                                        find_auto_completion(&word_values.get_untracked()[index])
                                    {
                                        set_word_values.update(|words| {
                                            words[index] = completion.clone();
                                        });
                                        update_seed_phrase();
                                    }

                                    if index < 11 {
                                        if let Some(next_input) = input_refs.get(index + 1) {
                                            if let Some(element) = next_input.get_untracked() {
                                                let _ = element.focus();
                                                let _ = element.set_selection_range(0, 0);
                                                event.prevent_default();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                "ArrowLeft" => {
                    if event.ctrl_key() {
                        // Move to start of previous word if at start of current word
                        if let Some(target) = event.target() {
                            if let Ok(input_element) =
                                target.dyn_into::<web_sys::HtmlInputElement>()
                            {
                                let cursor_pos = input_element
                                    .selection_start()
                                    .unwrap_or(Some(0))
                                    .unwrap_or(0)
                                    as usize;

                                if cursor_pos == 0 && index > 0 {
                                    if let Some(prev_input) = input_refs.get(index - 1) {
                                        if let Some(element) = prev_input.get_untracked() {
                                            let _ = element.focus();
                                            let _ = element.set_selection_range(0, 0);
                                            event.prevent_default();
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        // avigate to previous word if cursor is at the start of current word
                        if let Some(target) = event.target() {
                            if let Ok(input_element) =
                                target.dyn_into::<web_sys::HtmlInputElement>()
                            {
                                let cursor_pos = input_element
                                    .selection_start()
                                    .unwrap_or(Some(0))
                                    .unwrap_or(0)
                                    as usize;

                                if cursor_pos == 0 && index > 0 {
                                    if let Some(prev_input) = input_refs.get(index - 1) {
                                        if let Some(element) = prev_input.get_untracked() {
                                            let _ = element.focus();
                                            // Set cursor to end of previous field
                                            let _ = element.set_selection_range(u32::MAX, u32::MAX);
                                            event.prevent_default();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                "ArrowDown" => {
                    // Navigate to word in next row (4 words per row in grid)
                    let next_row_index = index + 3;
                    if next_row_index < 12 {
                        if let Some(target) = event.target() {
                            if let Ok(input_element) =
                                target.dyn_into::<web_sys::HtmlInputElement>()
                            {
                                let cursor_pos = input_element
                                    .selection_start()
                                    .unwrap_or(Some(0))
                                    .unwrap_or(0)
                                    as usize;

                                if let Some(next_input) = input_refs.get(next_row_index) {
                                    if let Some(element) = next_input.get_untracked() {
                                        let _ = element.focus();
                                        // Set cursor position to min(target word length, current cursor position)
                                        let target_word_length =
                                            word_values.get_untracked()[next_row_index].len();
                                        let new_cursor_pos =
                                            cursor_pos.min(target_word_length) as u32;
                                        let _ = element
                                            .set_selection_range(new_cursor_pos, new_cursor_pos);
                                        event.prevent_default();
                                    }
                                }
                            }
                        }
                    }
                }
                "ArrowUp" => {
                    // Navigate to word in previous row (4 words per row in grid)
                    if index >= 3 {
                        let prev_row_index = index - 3;
                        if let Some(target) = event.target() {
                            if let Ok(input_element) =
                                target.dyn_into::<web_sys::HtmlInputElement>()
                            {
                                let cursor_pos = input_element
                                    .selection_start()
                                    .unwrap_or(Some(0))
                                    .unwrap_or(0)
                                    as usize;

                                if let Some(prev_input) = input_refs.get(prev_row_index) {
                                    if let Some(element) = prev_input.get_untracked() {
                                        let _ = element.focus();
                                        // Set cursor position to min(target word length, current cursor position)
                                        let target_word_length =
                                            word_values.get_untracked()[prev_row_index].len();
                                        let new_cursor_pos =
                                            cursor_pos.min(target_word_length) as u32;
                                        let _ = element
                                            .set_selection_range(new_cursor_pos, new_cursor_pos);
                                        event.prevent_default();
                                    }
                                }
                            }
                        }
                    }
                }
                "Tab" => {
                    // Completion
                    if let Some(completion) =
                        find_auto_completion(&word_values.get_untracked()[index])
                    {
                        set_word_values.update(|words| {
                            words[index] = completion.clone();
                        });
                        update_seed_phrase();

                        // Don't prevent default - browser will move to next field
                    }
                }
                _ => {}
            }
        }
    };

    view! {
        <div class="space-y-4">
            <label class="block text-neutral-400 text-sm font-medium">"Seed Phrase"</label>

            <div class="grid grid-cols-3 gap-3">
                {(0..WORD_COUNT)
                    .map(|index| {
                        let input_ref = input_refs[index];
                        let handle_key_down_clone = handle_key_down.clone();
                        let handle_word_change_clone = handle_word_change.clone();
                        view! {
                            <div class="relative">
                                <div class={WORD_POSITION_NUMBER_STYLE}>
                                    {format!("{}", index + 1)}
                                </div>
                                <div class="relative">
                                    <input
                                        node_ref=input_ref
                                        type="text"
                                        class={INPUT_BASE_STYLE}
                                        style=move || get_border_style(get_word_state(index))
                                        prop:value=move || word_values.get()[index].clone()
                                        on:input=move |ev| {
                                            let value = event_target_value(&ev);
                                            handle_word_change_clone(index, value);
                                        }
                                        on:focus=move |_| set_focused_index.set(Some(index))
                                        on:blur=move |_| set_focused_index.set(None)
                                        on:paste=move |ev| handle_paste(ev.into(), index)
                                        on:keydown=move |ev| handle_key_down_clone(ev, index)
                                        autocomplete="off"
                                        spellcheck="false"
                                    />
                                    // Auto-completion overlay
                                    {move || {
                                        if let Some(completion) = find_auto_completion(
                                            &word_values.get()[index],
                                        ) {
                                            let current_word = word_values.get()[index].clone();
                                            let suffix = &completion[current_word.len()..];
                                            view! {
                                                <div class={AUTOCOMPLETE_OVERLAY_STYLE}>
                                                    <div class={AUTOCOMPLETE_TEXT_STYLE}>
                                                        <span class="invisible">{current_word}</span>
                                                        <span>{suffix}</span>
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            </div>
                        }
                    })
                    .collect::<Vec<_>>()}
            </div>
        </div>
    }
}
