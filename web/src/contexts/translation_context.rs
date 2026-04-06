use std::collections::HashMap;

use deli::{CursorDirection, Database, Model};
use leptos::prelude::*;
use leptos::task::spawn_local;
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;

use crate::translations::{CUSTOM_TRANSLATIONS, Language, TranslationKey};

const DB_NAME: &str = "intear_wallet_translations";
const BROADCAST_CHANNEL: &str = "intear-wallet-translations";

#[derive(Clone, Serialize, Deserialize, Debug, Model)]
pub struct CustomTranslation {
    #[deli(key)]
    pub composite_key: String,
    pub language_id: String,
    pub translation_key: String,
    pub value: String,
}

#[derive(Clone, Serialize, Deserialize, Debug, Model)]
pub struct CustomLanguageEntry {
    #[deli(key)]
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct BroadcastMsg {
    language_id: String,
    key: String,
}

#[derive(Clone, Copy)]
pub struct TranslationContext {
    pub translations: RwSignal<HashMap<Language, HashMap<TranslationKey, String>>>,
}

impl TranslationContext {
    pub fn set_translation(&self, language: &Language, key: TranslationKey, value: String) {
        let language = language.clone();
        let key_str = key.key().to_string();
        let lang_id = language.id();
        let composite = format!("{lang_id}:{key_str}");
        let value_clone = value.clone();

        self.translations.update(|map| {
            map.entry(language.clone())
                .or_default()
                .insert(key, value.clone());
        });

        {
            let mut map = CUSTOM_TRANSLATIONS.lock().unwrap();
            map.entry(language.clone()).or_default().insert(key, value);
        }

        let lang_id_clone = lang_id.clone();
        let key_str_clone = key_str.clone();
        spawn_local(async move {
            if let Ok(db) = setup_db().await {
                let tx = db
                    .transaction()
                    .writable()
                    .with_model::<CustomTranslation>()
                    .build()
                    .unwrap();
                let store = CustomTranslation::with_transaction(&tx).unwrap();
                let _ = store.delete(&composite).await;
                let entry = CustomTranslation {
                    composite_key: composite.clone(),
                    language_id: lang_id_clone,
                    translation_key: key_str_clone,
                    value: value_clone,
                };
                if let Err(err) = store.add(&entry).await {
                    log::error!("Failed to add translation entry {composite}: {err}");
                }
                if let Err(err) = tx.commit().await {
                    log::error!("Failed to commit transaction: {err}");
                }
                broadcast_key_updated(&lang_id, &key_str);
            }
        });
    }

    pub fn add_custom_language(&self, name: String) {
        let language = Language::Custom(name.clone());
        let id = language.id();

        self.translations.update(|map| {
            map.entry(language).or_default();
        });

        spawn_local(async move {
            if let Ok(db) = setup_db().await {
                let tx = db
                    .transaction()
                    .writable()
                    .with_model::<CustomLanguageEntry>()
                    .build()
                    .unwrap();
                let store = CustomLanguageEntry::with_transaction(&tx).unwrap();
                if let Err(err) = store.add(&CustomLanguageEntry { id: id.clone() }).await {
                    log::error!("Failed to add custom language entry {id}: {err}");
                }
                if let Err(err) = tx.commit().await {
                    log::error!("Failed to commit transaction: {err}");
                }
            }
        });
    }

    pub fn import_language(&self, language: &Language, data: HashMap<String, String>) {
        let lang_id = language.id();
        let mut resolved = HashMap::new();
        for (k, v) in &data {
            if let Some(tk) = TranslationKey::from_key(k) {
                resolved.insert(tk, v.clone());
            }
        }

        self.translations.update(|map| {
            map.insert(language.clone(), resolved.clone());
        });

        {
            let mut map = CUSTOM_TRANSLATIONS.lock().unwrap();
            map.insert(language.clone(), resolved);
        }

        let data_owned = data;
        spawn_local(async move {
            if let Ok(db) = setup_db().await {
                let tx = db
                    .transaction()
                    .writable()
                    .with_model::<CustomTranslation>()
                    .with_model::<CustomLanguageEntry>()
                    .build()
                    .unwrap();

                let lang_store = CustomLanguageEntry::with_transaction(&tx).unwrap();
                if let Err(err) = lang_store
                    .add(&CustomLanguageEntry {
                        id: lang_id.clone(),
                    })
                    .await
                {
                    log::error!("Failed to add custom language entry {lang_id}: {err}");
                }

                let tr_store = CustomTranslation::with_transaction(&tx).unwrap();
                for (k, v) in data_owned {
                    let composite = format!("{lang_id}:{k}");
                    if let Err(err) = tr_store
                        .add(&CustomTranslation {
                            composite_key: composite.clone(),
                            language_id: lang_id.clone(),
                            translation_key: k,
                            value: v,
                        })
                        .await
                    {
                        log::error!("Failed to add translation entry {composite}: {err}");
                    }
                }
                if let Err(err) = tx.commit().await {
                    log::error!("Failed to commit transaction: {err}");
                }
            }
        });
    }

    pub fn remove_custom_language(&self, language: &Language) {
        let lang_id = language.id();

        self.translations.update(|map| {
            map.remove(language);
        });

        {
            let mut map = CUSTOM_TRANSLATIONS.lock().unwrap();
            map.remove(language);
        }

        spawn_local(async move {
            if let Ok(db) = setup_db().await {
                let tx = db
                    .transaction()
                    .writable()
                    .with_model::<CustomTranslation>()
                    .with_model::<CustomLanguageEntry>()
                    .build()
                    .unwrap();

                let lang_store = CustomLanguageEntry::with_transaction(&tx).unwrap();
                if let Err(err) = lang_store.delete(&lang_id).await {
                    log::error!("Failed to delete custom language entry {lang_id}: {err}");
                }

                let tr_store = CustomTranslation::with_transaction(&tx).unwrap();
                if let Ok(Some(mut cursor)) = tr_store
                    .cursor::<String>(.., Some(CursorDirection::Next))
                    .await
                {
                    loop {
                        let Ok(Some(entry)) = cursor.value() else {
                            break;
                        };
                        if entry.language_id == lang_id
                            && let Err(err) = tr_store.delete(&entry.composite_key).await
                        {
                            log::error!(
                                "Failed to delete translation entry {}: {err}",
                                entry.composite_key
                            );
                        }
                        if cursor.advance(1).await.is_err() {
                            break;
                        }
                    }
                }

                if let Err(err) = tx.commit().await {
                    log::error!("Failed to commit transaction: {err}");
                }
            }
        });
    }

    pub fn custom_language_ids(&self) -> Vec<Language> {
        self.translations
            .get()
            .keys()
            .filter(|l| matches!(l, Language::Custom(_)))
            .cloned()
            .collect()
    }
}

async fn setup_db() -> Result<Database, deli::Error> {
    Database::builder(DB_NAME)
        .version(1)
        .add_model::<CustomTranslation>()
        .add_model::<CustomLanguageEntry>()
        .build()
        .await
}

fn broadcast_key_updated(language_id: &str, key: &str) {
    if let Ok(channel) = web_sys::BroadcastChannel::new(BROADCAST_CHANNEL) {
        let msg = BroadcastMsg {
            language_id: language_id.to_string(),
            key: key.to_string(),
        };
        if let Ok(js_val) = serde_wasm_bindgen::to_value(&msg)
            && let Err(err) = channel.post_message(&js_val)
        {
            log::error!("Failed to post message to broadcast channel: {err:?}");
        }
        channel.close();
    }
}

fn language_from_stored_id(stored_id: &str) -> Language {
    let name = stored_id.strip_prefix("custom-").unwrap_or(stored_id);
    Language::Custom(name.to_string())
}

async fn load_custom_translations() -> HashMap<Language, HashMap<TranslationKey, String>> {
    let mut result: HashMap<Language, HashMap<TranslationKey, String>> = HashMap::new();

    let Ok(db) = setup_db().await else {
        return result;
    };

    {
        let tx = db
            .transaction()
            .with_model::<CustomLanguageEntry>()
            .build()
            .unwrap();
        let store = CustomLanguageEntry::with_transaction(&tx).unwrap();
        if let Ok(Some(mut cursor)) = store
            .cursor::<String>(.., Some(CursorDirection::Next))
            .await
        {
            loop {
                let Ok(Some(entry)) = cursor.value() else {
                    break;
                };
                result
                    .entry(language_from_stored_id(&entry.id))
                    .or_default();
                if cursor.advance(1).await.is_err() {
                    break;
                }
            }
        }
    }

    {
        let tx = db
            .transaction()
            .with_model::<CustomTranslation>()
            .build()
            .unwrap();
        let store = CustomTranslation::with_transaction(&tx).unwrap();
        if let Ok(Some(mut cursor)) = store
            .cursor::<String>(.., Some(CursorDirection::Next))
            .await
        {
            loop {
                let Ok(Some(entry)) = cursor.value() else {
                    break;
                };
                if let Some(tk) = TranslationKey::from_key(&entry.translation_key) {
                    let lang = language_from_stored_id(&entry.language_id);
                    result.entry(lang).or_default().insert(tk, entry.value);
                }
                if cursor.advance(1).await.is_err() {
                    break;
                }
            }
        }
    }

    result
}

pub fn provide_translation_context() {
    let translations = RwSignal::new(HashMap::new());

    spawn_local({
        async move {
            let loaded = load_custom_translations().await;
            {
                let mut map = CUSTOM_TRANSLATIONS.lock().unwrap();
                *map = loaded.clone();
            }
            translations.set(loaded);
        }
    });

    if let Ok(channel) = web_sys::BroadcastChannel::new(BROADCAST_CHANNEL) {
        let onmessage =
            Closure::<dyn Fn(web_sys::MessageEvent)>::new(move |ev: web_sys::MessageEvent| {
                let Ok(msg) = serde_wasm_bindgen::from_value::<BroadcastMsg>(ev.data()) else {
                    return;
                };
                let Some(tk) = TranslationKey::from_key(&msg.key) else {
                    return;
                };
                let language = language_from_stored_id(&msg.language_id);
                let lang_id = msg.language_id;
                let key_str = msg.key;

                spawn_local(async move {
                    let Ok(db) = setup_db().await else {
                        return;
                    };
                    let composite = format!("{lang_id}:{key_str}");
                    let tx = db
                        .transaction()
                        .with_model::<CustomTranslation>()
                        .build()
                        .unwrap();
                    let store = CustomTranslation::with_transaction(&tx).unwrap();
                    if let Ok(Some(mut cursor)) = store
                        .cursor::<String>(.., Some(CursorDirection::Next))
                        .await
                    {
                        loop {
                            let Ok(Some(entry)) = cursor.value() else {
                                break;
                            };
                            if entry.composite_key == composite {
                                translations.update(|map| {
                                    map.entry(language.clone())
                                        .or_default()
                                        .insert(tk, entry.value.clone());
                                });
                                {
                                    let mut map = CUSTOM_TRANSLATIONS.lock().unwrap();
                                    map.entry(language.clone())
                                        .or_default()
                                        .insert(tk, entry.value);
                                }
                                break;
                            }
                            if cursor.advance(1).await.is_err() {
                                break;
                            }
                        }
                    }
                });
            });
        channel.set_onmessage(Some(onmessage.as_ref().unchecked_ref()));
        onmessage.forget();
    }

    provide_context(TranslationContext { translations });
}
