use leptos::prelude::*;
use wasm_bindgen::JsCast;

fn parse_derivation_path(path: &str) -> Option<(u32, u32, u32)> {
    let path = path.trim();
    let path = path.trim_start_matches("m/");
    let path = path.strip_prefix("44'/397'/")?;
    let parts: Vec<&str> = path.split('/').collect();
    let [account, change, address] = parts.as_slice() else {
        return None;
    };

    let account = account.strip_suffix('\'')?.parse::<u32>().ok()?;
    let change = change.strip_suffix('\'')?.parse::<u32>().ok()?;
    let address = address.strip_suffix('\'')?.parse::<u32>().ok()?;

    if account > i32::MAX as u32 {
        return None;
    }
    if change > 1 {
        return None;
    }
    if address > i32::MAX as u32 {
        return None;
    }

    Some((account, change, address))
}

#[component]
pub fn DerivationPathInput(
    ledger_account_number: ReadSignal<u32>,
    set_ledger_account_number: WriteSignal<u32>,
    ledger_change_number: ReadSignal<u32>,
    set_ledger_change_number: WriteSignal<u32>,
    ledger_address_number: ReadSignal<u32>,
    set_ledger_address_number: WriteSignal<u32>,
    on_change: Callback<()>,
) -> impl IntoView {
    let handle_paste = move |ev: web_sys::ClipboardEvent| {
        if let Some(clipboard_data) = ev.clipboard_data()
            && let Ok(pasted_text) = clipboard_data.get_data("text")
            && let Some((account, change, address)) = parse_derivation_path(&pasted_text)
        {
            ev.prevent_default();
            set_ledger_account_number.set(account);
            set_ledger_change_number.set(change);
            set_ledger_address_number.set(address);
            on_change.run(());
        }
    };

    view! {
        <div class="space-y-4 w-full">
            <div class="space-y-4">
                <label class="block text-neutral-400 text-sm font-medium">
                    "Derivation Path Parameters"
                </label>
                <div class="flex items-center gap-0 text-base text-neutral-400 select-none justify-center">
                    <span>"m/44'/397'/"</span>
                    <input
                        name="ledger_account_number"
                        type="number"
                        min="0"
                        max="2147483647"
                        step="1"
                        class="w-8 bg-neutral-900/50 text-white rounded-none border-x-0 border-t-0 border-b border-neutral-700 px-0.5 py-1 focus:outline-none text-base text-center"
                        style="border-radius: 0.375rem 0 0 0.375rem;"
                        prop:value=move || ledger_account_number.get().to_string()
                        on:focus=move |ev| {
                            if let Some(target) = ev.target()
                                && let Ok(input) = target.dyn_into::<web_sys::HtmlInputElement>() {
                                    input.select();
                                }
                        }
                        on:paste=handle_paste
                        on:input=move |ev| {
                            let val = event_target_value(&ev);
                            if let Ok(mut v) = val.parse::<i64>() {
                                if v < 0 {
                                    v = 0;
                                }
                                if v > i32::MAX as i64 {
                                    v = i32::MAX as i64;
                                }
                                set_ledger_account_number.set(v as u32);
                            } else {
                                set_ledger_account_number.set(0);
                            }
                            on_change.run(());
                        }
                    />
                    <span>"'/"</span>
                    <input
                        name="ledger_change_number"
                        type="number"
                        min="0"
                        max="1"
                        step="1"
                        class="w-6 bg-neutral-900/50 text-white rounded-none border-x-0 border-t-0 border-b border-neutral-700 px-0.5 py-1 focus:outline-none text-base text-center"
                        prop:value=move || ledger_change_number.get().to_string()
                        on:focus=move |ev| {
                            if let Some(target) = ev.target()
                                && let Ok(input) = target.dyn_into::<web_sys::HtmlInputElement>() {
                                    input.select();
                                }
                        }
                        on:paste=handle_paste
                        on:input=move |ev| {
                            let val = event_target_value(&ev);
                            let v = val.parse::<i64>().unwrap_or(0).clamp(0, 1);
                            set_ledger_change_number.set(v as u32);
                            on_change.run(());
                        }
                    />
                    <span>"'/"</span>
                    <input
                        name="ledger_address_number"
                        type="number"
                        min="0"
                        max="2147483647"
                        step="1"
                        class="w-8 bg-neutral-900/50 text-white rounded-none border-x-0 border-t-0 border-b border-neutral-700 px-0.5 py-1 focus:outline-none text-base text-center"
                        style="border-radius: 0 0.375rem 0.375rem 0;"
                        prop:value=move || ledger_address_number.get().to_string()
                        on:focus=move |ev| {
                            if let Some(target) = ev.target()
                                && let Ok(input) = target.dyn_into::<web_sys::HtmlInputElement>() {
                                    input.select();
                                }
                        }
                        on:paste=handle_paste
                        on:input=move |ev| {
                            let val = event_target_value(&ev);
                            if let Ok(mut v) = val.parse::<i64>() {
                                if v < 0 {
                                    v = 0;
                                }
                                if v > i32::MAX as i64 {
                                    v = i32::MAX as i64;
                                }
                                set_ledger_address_number.set(v as u32);
                            } else {
                                set_ledger_address_number.set(0);
                            }
                            on_change.run(());
                        }
                    />
                    <span>"'"</span>
                </div>
            </div>
        </div>
    }
}
