use leptos::prelude::{guards::ReadGuard, *};
use leptos_icons::*;
use wasm_bindgen::{prelude::Closure, JsCast, JsValue};
use web_sys::{js_sys::Date, HtmlDivElement, IntersectionObserver};

use crate::{
    contexts::security_log_context::{load_security_logs, SecurityLog},
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

    let observer_target = NodeRef::new();

    Effect::new(move || {
        let target: ReadGuard<Option<HtmlDivElement>, _> = observer_target.read();
        if let Some(target) = target.as_ref() {
            let callback = Closure::new(move |entries: Vec<web_sys::IntersectionObserverEntry>| {
                if !entries.is_empty()
                    && entries[0].is_intersecting()
                    && has_more.get_untracked()
                    && !is_loading.get_untracked()
                {
                    load_more.dispatch(());
                }
            })
                as Closure<dyn Fn(Vec<web_sys::IntersectionObserverEntry>)>;
            let observer =
                IntersectionObserver::new(&callback.into_js_value().unchecked_into()).unwrap();
            observer.observe(target);
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
    view! {
        <div class="p-4 rounded-lg bg-neutral-900">
            <div class="flex items-center justify-between mb-2">
                <div class="text-sm text-neutral-400">{formatted_date}</div>
                <div class="text-sm font-mono bg-neutral-800 px-2 py-1 rounded">
                    {move || format_account_id(&log.account)}
                </div>
            </div>
            <div class="text-white wrap-anywhere">{log.message}</div>
        </div>
    }
}
