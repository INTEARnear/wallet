use leptos::prelude::*;
use wasm_bindgen::{closure::Closure, JsCast};

#[component]
pub fn ProgressiveImage(
    #[prop(into)] low_res_src: String,
    #[prop(into)] high_res_src: String,
    #[prop(into)] alt: String,
) -> impl IntoView {
    let (current_src, set_current_src) = signal(low_res_src.clone());

    Effect::new(move |_| {
        let high_res_src_val = high_res_src.clone();
        if high_res_src_val.is_empty() || high_res_src_val.starts_with("data:") {
            set_current_src.set(high_res_src_val);
            return;
        }

        let high_res_loader = web_sys::HtmlImageElement::new().unwrap();
        let high_res_src_clone = high_res_src_val.clone();
        let onload = Closure::wrap(Box::new(move || {
            set_current_src.set(high_res_src_clone.clone());
        }) as Box<dyn FnMut()>);
        high_res_loader.set_onload(Some(onload.as_ref().unchecked_ref()));
        let high_res_src_clone = high_res_src_val.clone();
        let onerror = Closure::wrap(Box::new(move || {
            log::warn!("Failed to load high-res image: {}", high_res_src_clone);
        }) as Box<dyn FnMut()>);
        high_res_loader.set_onerror(Some(onerror.as_ref().unchecked_ref()));
        high_res_loader.set_src(&high_res_src_val);
        onload.forget();
        onerror.forget();
    });

    view! { <img src=current_src alt=alt /> }
}
