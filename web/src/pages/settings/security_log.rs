use leptos::html::Div;
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_use::use_intersection_observer;
use wasm_bindgen::JsValue;
use web_sys::js_sys::Date;

use crate::{
    contexts::{
        accounts_context::AccountsContext,
        security_log_context::{load_security_logs, SecurityLog},
    },
    utils::format_account_id,
};

const PER_PAGE: u32 = 10;

#[component]
pub fn SecurityLogPage() -> impl IntoView {
    let (logs, set_logs) = signal(vec![]);
    let (has_more, set_has_more) = signal(true);

    let load_more = Action::new(move |_input: &()| async move {
        let result = load_security_logs(logs.get_untracked().len() as u32, PER_PAGE).await;
        match result {
            Ok(new_logs) => {
                set_has_more.set(new_logs.len() == PER_PAGE as usize);
                set_logs.update(|logs| logs.extend(new_logs));
            }
            Err(e) => log::error!("Failed to load logs: {e}"),
        }
    });
    let is_loading = load_more.pending();

    Effect::new(move || {
        load_more.dispatch(());
    });

    let observer_target: NodeRef<Div> = NodeRef::new();

    use_intersection_observer(observer_target, move |entries, _observer| {
        if !entries.is_empty()
            && entries[0].is_intersecting()
            && has_more.get_untracked()
            && !is_loading.get_untracked()
        {
            load_more.dispatch(());
        }
    });

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="flex items-center justify-between">
                <div class="text-xl font-semibold">Security Log</div>
            </div>

            <div class="flex flex-col gap-4">
                {move || {
                    let current_logs = logs.get();
                    if current_logs.is_empty() && !is_loading.get() {
                        view! {
                            <div class="flex flex-col items-center justify-center p-8 text-neutral-400">
                                <Icon icon=icondata::LuShieldCheck width="32" height="32" />
                                <div class="mt-4 text-center">No security logs found</div>
                            </div>
                        }
                            .into_any()
                    } else {
                        current_logs
                            .into_iter()
                            .map(|log| {
                                view! { <LogEntry log=log /> }
                            })
                            .collect_view()
                            .into_any()
                    }
                }} // Intersection observer target
                <div node_ref=observer_target>
                    {move || {
                        if is_loading.get() {
                            view! {
                                <div class="flex justify-center p-4">
                                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-400"></div>
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}
                </div>
            </div>
        </div>
    }
}

#[component]
fn LogEntry(log: SecurityLog) -> impl IntoView {
    let local_date = Date::new(&JsValue::from_f64(log.timestamp.timestamp_millis() as f64));
    let formatted_date = local_date.to_locale_string("default", &JsValue::UNDEFINED);
    let formatted_date = formatted_date.as_string().unwrap_or_default();

    let accounts_context = expect_context::<AccountsContext>();

    let log_for_message = log.clone();
    let account_id = log.account.clone();

    let (message, set_message) = signal("[Loading...]".to_string());

    spawn_local(async move {
        let cipher = accounts_context.cipher.get_untracked();
        let decrypted = log_for_message.get_decrypted_message(cipher.as_ref()).await;
        set_message(decrypted);
    });

    view! {
        <div class="p-4 rounded-lg bg-neutral-900">
            <div class="flex items-center justify-between mb-2">
                <div class="text-sm text-neutral-400">{formatted_date}</div>
                <div class="text-sm font-mono bg-neutral-800 px-2 py-1 rounded">
                    {move || format_account_id(&account_id)}
                </div>
            </div>
            <div class="text-white wrap-anywhere">{message}</div>
        </div>
    }
}
