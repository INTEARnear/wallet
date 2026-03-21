use leptos::prelude::*;
use serde::{Deserialize, Serialize};

use crate::contexts::accounts_context::AccountsContext;

const LEGAL_CONSENTS_STORAGE_KEY: &str = "legal_consents";

const TERMS_TEXT: &str = include_str!("../../../TERMS");
const PRIVACY_TEXT: &str = include_str!("../../../PRIVACY");
const LICENSE_TEXT: &str = include_str!("../../../LICENSE");

const fn extract_last_updated(document: &'static str) -> &'static str {
    let start_index = "Last updated:".len();
    let mut i = start_index;
    while i < document.len() {
        if document.as_bytes()[i] == b'\n' {
            return &document[start_index..i];
        }
        i += 1;
    }
    panic!("'Last updated' section not found");
}

pub const TERMS_LAST_UPDATED: &str = extract_last_updated(TERMS_TEXT);
pub const PRIVACY_LAST_UPDATED: &str = extract_last_updated(PRIVACY_TEXT);

pub const LEGAL_CONSENTS_BLOCKING_MESSAGE: &str =
    "Please accept Terms of Service, Privacy Policy, and License to continue.";

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum LegalDocument {
    Terms,
    Privacy,
    License,
}

impl LegalDocument {
    pub const fn title(self) -> &'static str {
        match self {
            Self::Terms => "Terms of Service",
            Self::Privacy => "Privacy Policy",
            Self::License => "License",
        }
    }

    pub const fn text(self) -> &'static str {
        match self {
            Self::Terms => TERMS_TEXT,
            Self::Privacy => PRIVACY_TEXT,
            Self::License => LICENSE_TEXT,
        }
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
struct StoredLegalConsents {
    tos_last_accepted: Option<String>,
    privacy_last_accepted: Option<String>,
    license_accepted: bool,
}

#[derive(Clone, Copy)]
pub struct LegalConsents {
    pub tos_last_accepted: RwSignal<Option<String>>,
    pub privacy_last_accepted: RwSignal<Option<String>>,
    pub license_accepted: RwSignal<bool>,
}

impl LegalConsents {
    pub fn all_accepted(self) -> bool {
        self.tos_accepted() && self.privacy_accepted() && self.license_accepted.get()
    }

    pub fn all_accepted_untracked(self) -> bool {
        self.tos_last_accepted.get_untracked() == Some(TERMS_LAST_UPDATED.to_string())
            && self.privacy_last_accepted.get_untracked() == Some(PRIVACY_LAST_UPDATED.to_string())
            && self.license_accepted.get_untracked()
    }

    pub fn tos_accepted(self) -> bool {
        self.tos_last_accepted.get() == Some(TERMS_LAST_UPDATED.to_string())
    }

    pub fn privacy_accepted(self) -> bool {
        self.privacy_last_accepted.get() == Some(PRIVACY_LAST_UPDATED.to_string())
    }

    pub fn accept_doc(self, doc: LegalDocument) {
        match doc {
            LegalDocument::Terms => self
                .tos_last_accepted
                .set(Some(TERMS_LAST_UPDATED.to_string())),
            LegalDocument::Privacy => self
                .privacy_last_accepted
                .set(Some(PRIVACY_LAST_UPDATED.to_string())),
            LegalDocument::License => self.license_accepted.set(true),
        }
    }

    pub fn set_doc_accepted(self, doc: LegalDocument, accepted: bool) {
        match doc {
            LegalDocument::Terms => self.tos_last_accepted.set(if accepted {
                Some(TERMS_LAST_UPDATED.to_string())
            } else {
                None
            }),
            LegalDocument::Privacy => self.privacy_last_accepted.set(if accepted {
                Some(PRIVACY_LAST_UPDATED.to_string())
            } else {
                None
            }),
            LegalDocument::License => self.license_accepted.set(accepted),
        }
    }

    pub fn accept_all(self) {
        self.accept_doc(LegalDocument::Terms);
        self.accept_doc(LegalDocument::Privacy);
        self.license_accepted.set(true);
    }

    pub fn clear_all(self) {
        self.tos_last_accepted.set(None);
        self.privacy_last_accepted.set(None);
        self.license_accepted.set(false);
    }
}

pub fn provide_legal_consents_state() -> Vec<LegalDocument> {
    let stored = window()
        .local_storage()
        .ok()
        .flatten()
        .and_then(|storage| storage.get_item(LEGAL_CONSENTS_STORAGE_KEY).ok())
        .flatten()
        .and_then(|json| serde_json::from_str::<StoredLegalConsents>(&json).ok())
        .unwrap_or_default();

    let tos_stale = stored.tos_last_accepted.is_some()
        && stored.tos_last_accepted.as_deref() != Some(TERMS_LAST_UPDATED);
    let privacy_stale = stored.privacy_last_accepted.is_some()
        && stored.privacy_last_accepted.as_deref() != Some(PRIVACY_LAST_UPDATED);

    let accounts_context = expect_context::<AccountsContext>();

    let has_accounts = !accounts_context
        .accounts
        .get_untracked()
        .accounts
        .is_empty()
        || accounts_context.is_encrypted.get_untracked();

    let mut docs_to_show: Vec<LegalDocument> = Vec::new();

    if tos_stale {
        docs_to_show.push(LegalDocument::Terms);
    }
    if privacy_stale {
        docs_to_show.push(LegalDocument::Privacy);
    }

    if has_accounts {
        if stored.tos_last_accepted.is_none() {
            docs_to_show.push(LegalDocument::Terms);
        }
        if stored.privacy_last_accepted.is_none() {
            docs_to_show.push(LegalDocument::Privacy);
        }
        if !stored.license_accepted {
            docs_to_show.push(LegalDocument::License);
        }
    }

    let tos_last_accepted = RwSignal::new(if tos_stale {
        None
    } else {
        stored.tos_last_accepted
    });
    let privacy_last_accepted = RwSignal::new(if privacy_stale {
        None
    } else {
        stored.privacy_last_accepted
    });
    let license_accepted = RwSignal::new(stored.license_accepted);

    Effect::new(move || {
        if let Some(storage) = window().local_storage().ok().flatten()
            && let Ok(json) = serde_json::to_string(&StoredLegalConsents {
                tos_last_accepted: tos_last_accepted.get(),
                privacy_last_accepted: privacy_last_accepted.get(),
                license_accepted: license_accepted.get(),
            })
        {
            let _ = storage.set_item(LEGAL_CONSENTS_STORAGE_KEY, &json);
        }
    });

    provide_context(LegalConsents {
        tos_last_accepted,
        privacy_last_accepted,
        license_accepted,
    });

    docs_to_show
}
