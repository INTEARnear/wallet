use std::hash::{DefaultHasher, Hash, Hasher};

use bigdecimal::BigDecimal;
use leptos::{html::Div, prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::hooks::use_navigate;
use leptos_use::use_event_listener;
use near_min_api::types::NearToken;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Blob, ClipboardEvent, Event, FileReader, HtmlInputElement};

use crate::{
    contexts::{
        modal_context::ModalContext,
        network_context::{Network, NetworkContext},
    },
    utils::decimal_to_balance,
};

use super::create_token_modals::{
    aidols_modal::AidolsModal, intear_launch_modal::IntearLaunchModal,
    meme_cooking_modal::MemeCookingModal, without_launchpad_modal::WithoutLaunchpadModal,
};

pub fn generate_default_icon(symbol: &str) -> String {
    let first_char = symbol.chars().next().unwrap_or('?');
    let mut hasher = DefaultHasher::new();
    symbol.hash(&mut hasher);
    let hash = hasher.finish() % 360;

    let js_code = format!(
        r#"(function() {{
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        const hue = {hash};
        ctx.fillStyle = `hsl(${{hue}}, 70%, 20%)`;
        ctx.fillRect(0, 0, 128, 128);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 64px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('{first_char}', 64, 64);
        
        return canvas.toDataURL('image/webp');
    }})()"#
    );

    match web_sys::js_sys::eval(&js_code) {
        Ok(result) => {
            if let Some(data_url) = result.as_string() {
                data_url
            } else {
                panic!("Failed to generate default icon");
            }
        }
        Err(e) => {
            panic!("Failed to generate default icon: {e:?}");
        }
    }
}

pub fn get_target_size(quality: u8) -> u32 {
    if quality <= 5 {
        32
    } else if quality <= 20 {
        64
    } else if quality <= 50 {
        128
    } else if quality <= 80 {
        256
    } else if quality <= 95 {
        512
    } else {
        0 // 0 means no resize
    }
}

#[allow(clippy::float_arithmetic)] // not related to crypto operations
pub async fn process_image(image_data_url: String, quality: u8) -> Result<String, String> {
    let target_size = get_target_size(quality);
    let quality_value = if quality >= 100 {
        1.0
    } else {
        quality as f64 / 100.0
    };

    let js_code = format!(
        r#"(function() {{
            return new Promise((resolve, reject) => {{
                const img = new Image();
                img.onload = function() {{
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const targetSize = {target_size};
                    if (targetSize > 0 && (width > targetSize || height > targetSize)) {{
                        if (width > height) {{
                            height = Math.round(height * targetSize / width);
                            width = targetSize;
                        }} else {{
                            width = Math.round(width * targetSize / height);
                            height = targetSize;
                        }}
                    }}
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/webp', {quality_value});
                    resolve(JSON.stringify({{ dataUrl }}));
                }};
                img.onerror = function() {{
                    reject(new Error('Failed to load image'));
                }};
                img.src = `{image_data_url}`;
            }});
        }})()"#
    );

    let promise =
        web_sys::js_sys::eval(&js_code).map_err(|e| format!("Failed to create promise: {e:?}"))?;
    let promise: web_sys::js_sys::Promise = promise
        .dyn_into()
        .map_err(|_| "Failed to cast to Promise".to_string())?;

    let result = JsFuture::from(promise)
        .await
        .map_err(|e| format!("Promise rejected: {e:?}"))?;

    let json_str = result
        .as_string()
        .ok_or_else(|| "Result is not a string".to_string())?;

    #[derive(serde::Deserialize)]
    struct ImageResult {
        #[serde(rename = "dataUrl")]
        data_url: String,
    }

    let image_result: ImageResult =
        serde_json::from_str(&json_str).map_err(|e| format!("Failed to parse JSON: {e}"))?;

    Ok(image_result.data_url)
}

#[derive(Clone, Debug)]
struct TokenForm {
    symbol: String,
    name: String,
    supply: String,
    decimals: String,
    image: Option<String>,
    image_quality: u8,
    original_image_data_url: Option<String>,
}

impl Default for TokenForm {
    fn default() -> Self {
        Self {
            symbol: String::new(),
            name: String::new(),
            supply: String::new(),
            decimals: String::new(),
            image: None,
            image_quality: 80,
            original_image_data_url: None,
        }
    }
}

impl TokenForm {
    fn is_valid(&self) -> bool {
        !self.symbol.is_empty()
            && !self.name.is_empty()
            && !self.supply.is_empty()
            && !self.decimals.is_empty()
    }

    fn is_symbol_valid_for_meme_cooking(&self) -> bool {
        if self.symbol.is_empty() || self.symbol.len() > 40 {
            return false;
        }
        self.symbol.chars().all(|c| c.is_ascii_alphanumeric())
    }

    fn is_symbol_valid_for_aidols(&self) -> bool {
        if self.symbol.is_empty() || self.symbol.len() > 46 {
            return false;
        }
        self.symbol.chars().all(|c| c.is_ascii_alphanumeric())
    }
}

fn supply_or_decimals_invalid(supply_str: &str, decimals_str: &str) -> bool {
    if supply_str.is_empty() || decimals_str.is_empty() {
        return false;
    }

    let supply: BigDecimal = match supply_str.parse() {
        Ok(s) => s,
        Err(_) => return false,
    };

    let decimals: u8 = match decimals_str.parse() {
        Ok(d) => d,
        Err(_) => return false,
    };

    let result = decimal_to_balance(supply.clone(), decimals as u32);

    result == 0 || supply <= 0 || decimals == 0
}

#[component]
pub fn DeveloperCreateToken() -> impl IntoView {
    let navigate = use_navigate();
    let navigate_back = navigate.clone();
    let navigate_cancel = navigate.clone();

    let (form_data, set_form_data) = signal(TokenForm {
        supply: "1000000000".to_string(),
        decimals: "24".to_string(),
        ..Default::default()
    });

    let container_ref = NodeRef::<Div>::new();

    let read_file_as_data_url = move |blob: Blob| {
        spawn_local(async move {
            let file_reader = FileReader::new().unwrap();
            file_reader.read_as_data_url(&blob).unwrap();

            let file_reader_clone = file_reader.clone();
            let promise = web_sys::js_sys::Promise::new(&mut move |resolve, _reject| {
                let onload = wasm_bindgen::closure::Closure::wrap(Box::new(move || {
                    resolve.call0(&wasm_bindgen::JsValue::NULL).unwrap();
                })
                    as Box<dyn FnMut()>);
                file_reader_clone.set_onload(Some(onload.as_ref().unchecked_ref()));
                onload.forget();
            });

            let _ = JsFuture::from(promise).await;

            if let Ok(result) = file_reader.result()
                && let Some(original_data_url) = result.as_string()
            {
                // Crop to square using canvas
                let js_code = format!(
                    r#"(function() {{
                            return new Promise((resolve, reject) => {{
                                const img = new Image();
                                img.onload = function() {{
                                    const size = Math.min(img.width, img.height);
                                    const x = (img.width - size) / 2;
                                    const y = (img.height - size) / 2;
                                    
                                    const canvas = document.createElement('canvas');
                                    canvas.width = size;
                                    canvas.height = size;
                                    const ctx = canvas.getContext('2d');
                                    ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
                                    
                                    resolve(canvas.toDataURL('image/png'));
                                }};
                                img.onerror = () => reject(new Error('Failed to load image'));
                                img.src = `{original_data_url}`;
                            }});
                        }})()"#
                );

                if let Ok(promise_val) = web_sys::js_sys::eval(&js_code)
                    && let Ok(promise) = promise_val.dyn_into::<web_sys::js_sys::Promise>()
                    && let Ok(cropped_result) = JsFuture::from(promise).await
                    && let Some(cropped_data_url) = cropped_result.as_string()
                {
                    let current_quality = form_data.get_untracked().image_quality;

                    if let Ok(data_url) =
                        process_image(cropped_data_url.clone(), current_quality).await
                    {
                        set_form_data.update(|f| {
                            f.image = Some(data_url);
                            f.original_image_data_url = Some(cropped_data_url);
                        });
                    }
                }
            }
        });
    };

    let handle_image_upload = move |ev: Event| {
        let input: HtmlInputElement = ev.target().unwrap().unchecked_into();
        if let Some(files) = input.files()
            && let Some(file) = files.get(0)
        {
            read_file_as_data_url(file.into());
        }
    };

    let handle_paste = move |ev: ClipboardEvent| {
        if let Some(clipboard_data) = ev.clipboard_data() {
            let items = clipboard_data.items();
            for i in 0..items.length() {
                if let Some(item) = items.get(i)
                    && item.type_().starts_with("image/")
                {
                    ev.prevent_default();
                    if let Ok(Some(blob)) = item.get_as_file() {
                        read_file_as_data_url(blob.into());
                    }
                    break;
                }
            }
        }
    };

    let _ = use_event_listener(container_ref, leptos::ev::paste, handle_paste);

    let modal_context = expect_context::<ModalContext>();
    let network_context = expect_context::<NetworkContext>();

    let is_mainnet = move || network_context.network.get() == Network::Mainnet;

    let clear_form = move || {
        set_form_data(TokenForm {
            supply: "1000000000".to_string(),
            decimals: "24".to_string(),
            ..Default::default()
        });
    };

    let open_meme_cooking_modal = move || {
        let form = form_data.get();
        let token_image = form
            .image
            .clone()
            .unwrap_or_else(|| generate_default_icon(&form.symbol));
        let original_image = form.original_image_data_url.clone();
        modal_context.modal.set(Some(Box::new(move || {
            view! {
                <MemeCookingModal
                    token_symbol=form.symbol.clone()
                    token_name=form.name.clone()
                    token_supply={form.supply.parse().unwrap()}
                    token_decimals={form.decimals.parse::<u32>().unwrap()}
                    token_image=token_image.clone()
                    original_image_data_url=original_image.clone()
                    on_confirm=clear_form
                />
            }
            .into_any()
        })));
    };

    let open_intear_launch_modal = move || {
        let form = form_data.get();
        let token_image = form
            .image
            .clone()
            .unwrap_or_else(|| generate_default_icon(&form.symbol));
        modal_context.modal.set(Some(Box::new(move || {
            view! {
                <IntearLaunchModal
                    token_symbol=form.symbol.clone()
                    token_name=form.name.clone()
                    token_supply={form.supply.parse().unwrap()}
                    token_decimals={form.decimals.parse::<u8>().unwrap()}
                    token_image=token_image.clone()
                    on_confirm=clear_form
                />
            }
            .into_any()
        })));
    };

    let open_aidols_modal = move || {
        let form = form_data.get();
        let token_image = form
            .image
            .clone()
            .unwrap_or_else(|| generate_default_icon(&form.symbol));
        let original_image = form.original_image_data_url.clone();
        modal_context.modal.set(Some(Box::new(move || {
            view! {
                <AidolsModal
                    token_symbol=form.symbol.clone()
                    token_name=form.name.clone()
                    token_supply={form.supply.parse().unwrap()}
                    token_decimals={form.decimals.parse::<u32>().unwrap()}
                    token_image=token_image.clone()
                    original_image_data_url=original_image.clone()
                    on_confirm=clear_form
                />
            }
            .into_any()
        })));
    };

    let open_without_launchpad_modal = move || {
        let form = form_data.get();
        let token_image = form
            .image
            .clone()
            .unwrap_or_else(|| generate_default_icon(&form.symbol));
        modal_context.modal.set(Some(Box::new(move || {
            view! {
                <WithoutLaunchpadModal
                    token_symbol=form.symbol.clone()
                    token_name=form.name.clone()
                    token_supply={form.supply.parse().unwrap()}
                    token_decimals={form.decimals.parse::<u32>().unwrap()}
                    token_image=token_image.clone()
                    on_confirm=clear_form
                />
            }
            .into_any()
        })));
    };

    let is_form_valid = move || {
        let form = form_data.get();
        form.is_valid() && !supply_or_decimals_invalid(&form.supply, &form.decimals)
    };

    view! {
        <div node_ref=container_ref class="flex flex-col gap-4 p-4 max-w-2xl" tabindex="-1">
            <div class="flex items-center gap-3">
                <button
                    on:click=move |_| {
                        navigate_back("/settings/developer", Default::default());
                    }
                    class="p-2 hover:bg-neutral-800 rounded cursor-pointer"
                >
                    <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                </button>
                <div class="text-xl font-semibold">"Create Token"</div>
            </div>

            <div class="flex flex-col gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                // Symbol
                <div>
                    <label class="block text-sm font-medium mb-1">
                        "Token Symbol " <span class="text-red-400">"*"</span>
                    </label>
                    <input
                        type="text"
                        prop:value=move || form_data.get().symbol
                        on:input=move |ev| {
                            let value = event_target_value(&ev);
                            set_form_data.update(|f| f.symbol = value);
                        }
                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                        placeholder="MYTOKEN"
                    />
                    <div class="text-xs text-gray-500 mt-1">
                        "The ticker symbol for your token (e.g., BTC, ETH, NEAR)"
                    </div>
                </div>

                // Name
                <div>
                    <label class="block text-sm font-medium mb-1">
                        "Token Name " <span class="text-red-400">"*"</span>
                    </label>
                    <input
                        type="text"
                        prop:value=move || form_data.get().name
                        on:input=move |ev| {
                            let value = event_target_value(&ev);
                            set_form_data.update(|f| f.name = value);
                        }
                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                        placeholder="My Token"
                    />
                    <div class="text-xs text-gray-500 mt-1">
                        "The full name of your token (e.g., Bitcoin, Ethereum, NEAR)"
                    </div>
                </div>

                // Supply
                <div>
                    <label class="block text-sm font-medium mb-1">
                        "Total Supply " <span class="text-red-400">"*"</span>
                    </label>
                    <input
                        type="text"
                        prop:value=move || form_data.get().supply
                        on:input=move |ev| {
                            let value = event_target_value(&ev);
                            set_form_data.update(|f| f.supply = value.replace(",", ""));
                        }
                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                        placeholder="1000000000"
                    />
                    <div class="text-xs text-gray-500 mt-1">
                        "Total number of tokens (default: 1,000,000,000)"
                    </div>
                </div>

                // Decimals
                <div>
                    <label class="block text-sm font-medium mb-1">
                        "Decimals " <span class="text-red-400">"*"</span>
                    </label>
                    <input
                        type="text"
                        prop:value=move || form_data.get().decimals
                        on:input=move |ev| {
                            let value = event_target_value(&ev);
                            set_form_data
                                .update(|f| f.decimals = value.replace(",", "").replace(".", ""));
                        }
                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                        placeholder="24"
                    />
                    <div class="text-xs text-gray-500 mt-1">
                        "Number of decimal places (default: 24)"
                    </div>
                </div>

                // Validation errors
                {move || {
                    let form = form_data.get();
                    let show_recs = supply_or_decimals_invalid(&form.supply, &form.decimals);
                    if show_recs {
                        view! {
                            <div class="flex flex-col gap-2">
                                <div class="text-sm text-yellow-400 bg-yellow-950 p-3 rounded border border-yellow-700">
                                    "⚠️ We recommend decimals between 6 and 24"
                                </div>
                                <div class="text-sm text-yellow-400 bg-yellow-950 p-3 rounded border border-yellow-700">
                                    "⚠️ We recommend supply between 1,000,000 and 1,000,000,000,000"
                                </div>
                            </div>
                        }
                            .into_any()
                    } else {
                        ().into_any()
                    }
                }}

                // Image Upload
                <div>
                    <label class="block text-sm font-medium mb-1">
                        "Token Image " <span class="text-gray-500">"(optional)"</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        on:change=handle_image_upload
                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                    />
                    <div class="text-xs text-gray-500 mt-1">"Upload an image for your token"</div>
                    {move || {
                        let form = form_data.get();
                        if let Some(image_data_url) = form.image {
                            view! {
                                <div class="mt-3 flex flex-col gap-2">
                                    <div class="text-sm text-green-400 flex items-center gap-2">
                                        <Icon icon=icondata::LuCheck width="16" height="16" />
                                        "Image:"
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <div class="flex items-start gap-3">
                                            <img
                                                src=image_data_url.clone()
                                                alt="Token image preview"
                                                class="w-32 h-32 object-cover rounded-lg border border-neutral-600 bg-neutral-900"
                                            />
                                            <button
                                                on:click=move |_| {
                                                    set_form_data
                                                        .update(|f| {
                                                            f.image = None;
                                                            f.original_image_data_url = None;
                                                        });
                                                }
                                                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded cursor-pointer"
                                            >
                                                "Remove"
                                            </button>
                                        </div>

                                        // Quality slider
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm font-medium">
                                                "On-chain Image Quality: "
                                                {move || {
                                                    let q = form_data.get().image_quality;
                                                    format!("{q}%")
                                                }}
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                prop:value=move || form_data.get().image_quality
                                                on:input=move |ev| {
                                                    let new_quality = event_target_value(&ev)
                                                        .parse::<u8>()
                                                        .unwrap_or(80);
                                                    set_form_data.update(|f| f.image_quality = new_quality);
                                                    if let Some(original_image_data_url) = form_data
                                                        .get()
                                                        .original_image_data_url
                                                    {
                                                        spawn_local(async move {
                                                            if let Ok(data_url) = process_image(
                                                                    original_image_data_url,
                                                                    new_quality,
                                                                )
                                                                .await
                                                            {
                                                                set_form_data
                                                                    .update(|f| {
                                                                        f.image = Some(data_url);
                                                                    });
                                                            }
                                                        });
                                                    }
                                                }
                                                class="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div class="text-xs text-gray-500">
                                                "100% = lossless, below 100% = compressed"
                                            </div>
                                        </div>

                                        <div class="text-xs text-gray-400">
                                            {move || {
                                                let image_base64_bytes = form_data
                                                    .get()
                                                    .image
                                                    .as_ref()
                                                    .map(|s| s.len())
                                                    .unwrap_or(0);
                                                let estimated_size_bytes = image_base64_bytes;
                                                let size_bd = BigDecimal::from(estimated_size_bytes as u64);
                                                let divisor = BigDecimal::from(100_000u64);
                                                let size_near = size_bd / divisor;
                                                let size_yoctonear = decimal_to_balance(size_near, 24);
                                                let size_near = NearToken::from_yoctonear(size_yoctonear);
                                                format!("This image will cost ~{size_near}")
                                            }}
                                        </div>
                                    </div>
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}
                </div>

                // Launch Buttons
                <div class="flex flex-col gap-3 mt-4">
                    <div class="text-sm font-medium text-gray-300">"Choose Launch Method:"</div>

                    <button
                        on:click=move |_| open_intear_launch_modal()
                        disabled=move || !is_mainnet() || !is_form_valid()
                        class="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded cursor-pointer text-left"
                    >
                        <div class="font-semibold">"Launch on Intear Launch"</div>
                        <div class="text-xs text-amber-100 mt-1">
                            "Official Intear launchpad, bonding curve-like (immediately deployed on Intear DEX)"
                        </div>
                    </button>
                    {move || {
                        if !is_mainnet() {
                            view! {
                                <div class="text-xs text-yellow-400 bg-yellow-950 p-2 rounded border border-yellow-700 mt-1">
                                    "⚠️ Intear Launch is only available on mainnet"
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}

                    <button
                        on:click=move |_| open_meme_cooking_modal()
                        disabled=move || {
                            let form = form_data.get();
                            !is_mainnet() || !is_form_valid()
                                || !form.is_symbol_valid_for_meme_cooking()
                        }
                        class="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded cursor-pointer text-left"
                    >
                        <div class="font-semibold">"Launch on Meme Cooking"</div>
                        <div class="text-xs text-purple-200 mt-1">
                            "Fair launch platform. Best for flexible, professional launches"
                        </div>
                    </button>
                    {move || {
                        let form = form_data.get();
                        if !is_mainnet() {
                            view! {
                                <div class="text-xs text-yellow-400 bg-yellow-950 p-2 rounded border border-yellow-700 mt-1">
                                    "⚠️ Meme Cooking is only available on mainnet"
                                </div>
                            }
                                .into_any()
                        } else if !form.symbol.is_empty()
                            && !form.is_symbol_valid_for_meme_cooking()
                        {
                            view! {
                                <div class="text-xs text-yellow-400 bg-yellow-950 p-2 rounded border border-yellow-700 mt-1">
                                    "⚠️ For Meme Cooking launches, symbol must be alphanumeric and not too long"
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}

                    <button
                        on:click=move |_| open_aidols_modal()
                        disabled=move || {
                            let form = form_data.get();
                            !is_mainnet() || !is_form_valid() || !form.is_symbol_valid_for_aidols()
                        }
                        class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded cursor-pointer text-left"
                    >
                        <div class="font-semibold">"Launch on Aidols"</div>
                        <div class="text-xs text-blue-200 mt-1">
                            "Bonding curve launchpad for AI agents"
                        </div>
                    </button>
                    {move || {
                        let form = form_data.get();
                        if !is_mainnet() {
                            view! {
                                <div class="text-xs text-yellow-400 bg-yellow-950 p-2 rounded border border-yellow-700 mt-1">
                                    "⚠️ Aidols is only available on mainnet"
                                </div>
                            }
                                .into_any()
                        } else if !form.symbol.is_empty() && !form.is_symbol_valid_for_aidols() {
                            view! {
                                <div class="text-xs text-yellow-400 bg-yellow-950 p-2 rounded border border-yellow-700 mt-1">
                                    "⚠️ For Aidols launches, symbol must be alphanumeric and not too long"
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }
                    }}

                    <button
                        on:click=move |_| open_without_launchpad_modal()
                        disabled=move || !is_form_valid()
                        class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded cursor-pointer text-left"
                    >
                        <div class="font-semibold">"Create Without Launchpad"</div>
                        <div class="text-xs text-green-200 mt-1">
                            "Launch a custom token contract"
                        </div>
                    </button>

                    <button
                        on:click=move |_| {
                            navigate_cancel("/settings/developer", Default::default());
                        }
                        class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded cursor-pointer mt-2"
                    >
                        "Cancel"
                    </button>
                </div>
            </div>
        </div>
    }
}
