use leptos::prelude::*;

use crate::utils::generate_qr_code;

#[component]
pub fn QRCodeDisplay(
    text: String,
    #[prop(optional)] size_class: Option<&'static str>,
    #[prop(optional)] include_logo: bool,
) -> impl IntoView {
    let size = size_class.unwrap_or("w-48 h-48");
    let qr_code_resource = LocalResource::new(move || {
        let text = text.clone();
        async move { generate_qr_code(&text, include_logo).await }
    });

    view! {
        <div class="flex flex-col items-center gap-2">
            <Suspense fallback=move || {
                view! {
                    <div class=format!(
                        "{} bg-neutral-800 rounded-lg flex items-center justify-center",
                        size,
                    )>
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            }>
                {move || {
                    qr_code_resource
                        .get()
                        .map(|qr_result| {
                            if let Ok(qr_code_data_url) = qr_result {
                                view! {
                                    <img
                                        src=qr_code_data_url
                                        alt="QR Code for deposit address"
                                        class=format!("{} rounded-lg", size)
                                    />
                                }
                                    .into_any()
                            } else {
                                view! {
                                    <div class=format!(
                                        "{} bg-neutral-800 rounded-lg flex items-center justify-center text-red-400",
                                        size,
                                    )>"Failed to generate QR code"</div>
                                }
                                    .into_any()
                            }
                        })
                }}
            </Suspense>
        </div>
    }
}
