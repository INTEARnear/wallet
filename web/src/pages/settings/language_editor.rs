use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::hooks::{use_navigate, use_params_map};
use std::collections::{BTreeMap, HashMap};
use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::Closure;
use web_sys::js_sys::Array;
use web_sys::{Blob, BlobPropertyBag};

use crate::contexts::translation_context::Translation;
use crate::translations::{
    BuiltInLanguage, CUSTOM_TRANSLATIONS, Language, TRANSLATION_TREE, TranslationKey,
    TranslationNode,
};

fn count_keys_in_node(node: &TranslationNode) -> usize {
    match node {
        TranslationNode::Key(_) => 1,
        TranslationNode::Group(g) => g.children.iter().map(count_keys_in_node).sum(),
    }
}

fn count_translated_in_node(
    node: &TranslationNode,
    lang_map: &HashMap<TranslationKey, String>,
) -> usize {
    match node {
        TranslationNode::Key(k) => {
            if lang_map.get(k).is_some_and(|v| !v.is_empty()) {
                1
            } else {
                0
            }
        }
        TranslationNode::Group(g) => g
            .children
            .iter()
            .map(|c| count_translated_in_node(c, lang_map))
            .sum(),
    }
}

#[allow(clippy::float_arithmetic)]
fn progress_bar_color(pct: f64) -> &'static str {
    if pct >= 100.0 {
        "bg-green-500"
    } else if pct >= 50.0 {
        "bg-yellow-500"
    } else {
        "bg-red-500"
    }
}

const BASE_PATH: &str = "/settings/developer/language_editor";

#[component]
pub fn LanguageEditorPage() -> impl IntoView {
    let translation_ctx = expect_context::<Translation>();
    let params = use_params_map();
    let navigate = use_navigate();
    let (new_lang_name, set_new_lang_name) = signal(String::new());
    let (import_error, set_import_error) = signal::<Option<String>>(None);

    let path_str = move || params.get().get("path").unwrap_or_default();

    let parsed_route = move || {
        let raw = path_str();
        if raw.is_empty() {
            return (None, Vec::new());
        }
        let segments: Vec<&str> = raw.split('/').filter(|s| !s.is_empty()).collect();
        if segments.is_empty() {
            return (None, Vec::new());
        }
        let lang = Language::Custom(segments[0].to_string());
        let tree_path: Vec<String> = segments[1..].iter().map(|s| s.to_string()).collect();
        (Some(lang), tree_path)
    };

    let create_language_view = move || {
        view! {
            <div class="flex gap-2 mt-2">
                <input
                    type="text"
                    class="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                    placeholder=move || TranslationKey::PagesSettingsDeveloperLanguageEditorLanguageNamePlaceholder.format(&[])
                    prop:value=move || new_lang_name.get()
                    on:input=move |ev| set_new_lang_name(event_target_value(&ev))
                />
                <button
                    class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled=move || new_lang_name.get().trim().is_empty()
                    on:click=move |_| {
                        let name = new_lang_name.get().trim().to_string();
                        if !name.is_empty() {
                            translation_ctx.add_custom_language(name);
                            set_new_lang_name(String::new());
                        }
                    }
                >
                    {move || TranslationKey::PagesSettingsDeveloperLanguageEditorCreate.format(&[])}
                </button>
            </div>
        }
    };

    let import_language_view = move || {
        view! {
            <div class="flex flex-col gap-1 mt-1">
                <label class="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded text-sm text-gray-300 cursor-pointer text-center">
                    {move || TranslationKey::PagesSettingsDeveloperLanguageEditorImportJson.format(&[])}
                    <input
                        type="file"
                        accept=".json"
                        class="hidden"
                        on:change=move |ev| {
                            set_import_error(None);
                            let target: web_sys::HtmlInputElement = ev
                                .target()
                                .unwrap()
                                .unchecked_into();
                            let Some(files) = target.files() else { return };
                            let Some(file) = files.get(0) else { return };
                            let filename = file.name();
                            let lang_name = filename
                                .strip_suffix(".json")
                                .unwrap_or(&filename)
                                .to_string();
                            let reader = web_sys::FileReader::new().unwrap();
                            let reader_clone = reader.clone();
                            let onload = Closure::<
                                dyn Fn(),
                            >::new(move || {
                                let result = reader_clone.result().unwrap();
                                let text = result.as_string().unwrap_or_default();
                                match serde_json::from_str::<HashMap<String, String>>(&text) {
                                    Ok(data) => {
                                        let language = Language::Custom(lang_name.clone());
                                        let ctx = expect_context::<Translation>();
                                        ctx.import_language(&language, data);
                                        set_import_error(None);
                                    }
                                    Err(e) => {
                                        set_import_error(Some(format!("Invalid JSON: {e}")));
                                    }
                                }
                            });
                            reader.set_onload(Some(onload.as_ref().unchecked_ref()));
                            onload.forget();
                            let _ = reader.read_as_text(&file);
                        }
                    />
                </label>
                {move || {
                    import_error
                        .get()
                        .map(|e| view! { <div class="text-sm text-red-400">{e}</div> })
                }}
            </div>
        }
    };

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">{move || TranslationKey::PagesSettingsDeveloperLanguageEditorTitle.format(&[])}</div>
            {move || {
                let (lang, tree_path) = parsed_route();
                if let Some(lang) = lang {
                    let lang_exists = translation_ctx.translations.get().contains_key(&lang);
                    if !lang_exists {
                        let nav = navigate.clone();
                        nav(BASE_PATH, Default::default());
                        return ().into_any();
                    }
                    let mut nodes: &[TranslationNode] = TRANSLATION_TREE;
                    for segment in &tree_path {
                        let found = nodes
                            .iter()
                            .find(|n| {
                                matches!(n, TranslationNode::Group(g) if g.name == segment)
                            });
                        if let Some(TranslationNode::Group(g)) = found {
                            nodes = g.children;
                        } else {
                            break;
                        }
                    }
                    let breadcrumb = {
                        let display = lang.display_name();
                        let parts: Vec<String> = std::iter::once(display)
                            .chain(tree_path.iter().cloned())
                            .collect();
                        parts.join(" > ")
                    };
                    let lang_map = CUSTOM_TRANSLATIONS
                        .lock()
                        .unwrap()
                        .get(&lang)
                        .cloned()
                        .unwrap_or_default();
                    let current_url_prefix = {
                        let name = lang.custom_name();
                        if tree_path.is_empty() {
                            format!("{BASE_PATH}/{name}")
                        } else {
                            format!("{BASE_PATH}/{name}/{}", tree_path.join("/"))
                        }
                    };
                    let items: Vec<_> = nodes
                        .iter()
                        .map(|node| {
                            match node {
                                TranslationNode::Group(g) => {
                                    let group_name = g.name;
                                    let total = count_keys_in_node(node);
                                    let translated = count_translated_in_node(node, &lang_map);
                                    let count_label = format!("{translated}/{total}");
                                    let navigate = navigate.clone();
                                    let url = format!("{current_url_prefix}/{group_name}");

                                    view! {
                                        <button
                                            class="w-full flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700 hover:bg-neutral-700 cursor-pointer text-left"
                                            on:click=move |_| {
                                                navigate(&url, Default::default());
                                            }
                                        >
                                            <span class="font-medium">{group_name}</span>
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm text-gray-400">{count_label}</span>
                                                <Icon
                                                    icon=icondata::LuChevronRight
                                                    attr:class="min-w-4 min-h-4 text-gray-400"
                                                />
                                            </div>
                                        </button>
                                    }
                                        .into_any()
                                }
                                TranslationNode::Key(key) => {
                                    let key = *key;
                                    let en_template = BuiltInLanguage::default().template(key);
                                    let current_value = lang_map
                                        .get(&key)
                                        .cloned()
                                        .unwrap_or_default();
                                    let key_label = key
                                        .key()
                                        .rsplit('.')
                                        .next()
                                        .unwrap_or(key.key());
                                    let lang_clone = lang.clone();
                                    let (local_value, set_local_value) = signal(current_value);

                                    view! {
                                        <div class="flex flex-col gap-1 p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                                            <label class="text-xs text-gray-400 font-mono">
                                                {key_label}
                                            </label>
                                            <input
                                                type="text"
                                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                                                placeholder=en_template
                                                prop:value=move || local_value.get()
                                                on:input=move |ev| {
                                                    let value = event_target_value(&ev);
                                                    set_local_value(value.clone());
                                                    translation_ctx.set_translation(&lang_clone, key, value);
                                                }
                                            />
                                        </div>
                                    }
                                        .into_any()
                                }
                            }
                        })
                        .collect();
                    let navigate = navigate.clone();

                    view! {
                        <div class="flex flex-col gap-3">
                            <button
                                class="flex items-center gap-1 text-sm text-gray-400 hover:text-white cursor-pointer self-start"
                                on:click=move |_| {
                                    let raw = path_str();
                                    if raw.is_empty() {
                                        navigate(BASE_PATH, Default::default());
                                        return;
                                    }
                                    let segments: Vec<&str> = raw
                                        .split('/')
                                        .filter(|s| !s.is_empty())
                                        .collect();
                                    if segments.len() <= 1 {
                                        navigate(BASE_PATH, Default::default());
                                    } else {
                                        let parent = segments[..segments.len() - 1].join("/");
                                        navigate(
                                            &format!("{BASE_PATH}/{parent}"),
                                            Default::default(),
                                        );
                                    }
                                }
                            >
                                <Icon icon=icondata::LuChevronLeft attr:class="min-w-4 min-h-4" />
                                {move || TranslationKey::PagesSettingsDeveloperLanguageEditorBack.format(&[])}
                            </button>
                            <div class="text-sm font-medium text-gray-300">{breadcrumb}</div>
                            <div class="flex flex-col gap-2">{items}</div>
                        </div>
                    }
                        .into_any()
                } else {
                    let custom_langs = translation_ctx.custom_language_ids();
                    let translations = translation_ctx.translations.get();
                    let total_keys = TranslationKey::ALL.len();
                    let builtin_items = BuiltInLanguage::all()
                        .iter()
                        .map(|lang| {
                            let display = lang.display_name().to_string();

                            view! {
                                <div class="w-full flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700 text-left">
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium">{display.clone()}</span>
                                        <span class="text-xs px-1.5 py-0.5 bg-sky-900 text-sky-300 rounded">
                                            {move || TranslationKey::PagesSettingsDeveloperLanguageEditorOfficial.format(&[])}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-24 h-2 bg-neutral-700 rounded-full overflow-hidden">
                                            <div
                                                class="h-full bg-green-500 rounded-full"
                                                style="width: 100%"
                                            ></div>
                                        </div>
                                        <span class="text-sm text-gray-400 w-20 text-right">
                                            "100%"
                                        </span>
                                    </div>
                                </div>
                            }
                        })
                        .collect_view();
                    let custom_items = custom_langs
                        .into_iter()
                        .map(|lang| {
                            let display = lang.display_name();
                            let lang_for_click = lang.clone();
                            let lang_for_download = lang.clone();
                            let lang_for_delete = lang.clone();
                            let translated = translations
                                .get(&lang)
                                .map(|m| m.values().filter(|v| !v.is_empty()).count())
                                .unwrap_or_default();
                            #[allow(clippy::float_arithmetic)]
                            let percent = if total_keys > 0 {
                                (translated as f64 / total_keys as f64) * 100.0
                            } else {
                                0.0
                            };
                            let pct_str = format!("{percent:.3}%");
                            let bar_width = format!("width: {percent:.3}%");
                            let bar_color = progress_bar_color(percent);
                            let nav = navigate.clone();

                            view! {
                                <div class="flex items-center gap-2">
                                    <button
                                        class="flex-1 flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700 hover:bg-neutral-700 cursor-pointer text-left"
                                        on:click=move |_| {
                                            let name = lang_for_click.custom_name();
                                            nav(&format!("{BASE_PATH}/{name}"), Default::default());
                                        }
                                    >
                                        <span class="font-medium">{display}</span>
                                        <div class="flex items-center gap-2">
                                            <div class="w-24 h-2 bg-neutral-700 rounded-full overflow-hidden">
                                                <div
                                                    class=format!("h-full {bar_color} rounded-full")
                                                    style=bar_width
                                                ></div>
                                            </div>
                                            <span class="text-sm text-gray-400 w-20 text-right">
                                                {pct_str}
                                            </span>
                                            <Icon
                                                icon=icondata::LuChevronRight
                                                attr:class="min-w-4 min-h-4 text-gray-400"
                                            />
                                        </div>
                                    </button>
                                    <button
                                        class="p-2 text-blue-400 hover:text-blue-300 hover:bg-neutral-700 rounded cursor-pointer shrink-0"
                                        on:click=move |_| {
                                            let translations = translation_ctx.translations.get();
                                            let lang_map = translations.get(&Language::Custom(lang_for_download.custom_name().to_string()));
                                            let mut export = BTreeMap::new();
                                            if let Some(map) = lang_map {
                                                for (key, value) in map {
                                                    if !value.is_empty() {
                                                        export.insert(key.key().to_string(), value.clone());
                                                    }
                                                }
                                            }
                                            let json = serde_json::to_string_pretty(&export).unwrap();
                                            let opts = BlobPropertyBag::new();
                                            opts.set_type("application/json");
                                            let blob = Blob::new_with_str_sequence_and_options(
                                                &Array::of1(&wasm_bindgen::JsValue::from_str(&json)),
                                                &opts,
                                            ).unwrap();
                                            let url = web_sys::Url::create_object_url_with_blob(&blob).unwrap();
                                            let a: web_sys::HtmlAnchorElement = document().create_element("a").unwrap().unchecked_into();
                                            a.set_href(&url);
                                            a.set_download(&format!("{}.json", lang_for_download.custom_name()));
                                            a.click();
                                            web_sys::Url::revoke_object_url(&url).unwrap();
                                        }
                                    >
                                        <Icon icon=icondata::LuDownload width="16" height="16" />
                                    </button>
                                    <button
                                        class="p-2 text-red-400 hover:text-red-300 hover:bg-neutral-700 rounded cursor-pointer shrink-0"
                                        on:click=move |_| {
                                            translation_ctx.remove_custom_language(&lang_for_delete);
                                        }
                                    >
                                        <Icon icon=icondata::LuTrash width="16" height="16" />
                                    </button>
                                </div>
                            }
                        })
                        .collect_view();

                    view! {
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-col gap-2">{builtin_items} {custom_items}</div>
                            {create_language_view}
                            {import_language_view}
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
