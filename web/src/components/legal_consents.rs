use std::time::Duration;

use leptos::prelude::*;
use leptos_icons::*;

use crate::components::copy_button::CopyButton;
use crate::contexts::accounts_context::{AccountsContext, SecretKeyHolder};
use crate::contexts::legal_consents_context::{
    LegalConsents, LegalDocument, legal_document_display_title, provide_legal_consents_state,
};
use crate::contexts::modal_context::ModalContext;
use crate::translations::TranslationKey;

fn document_link_button(
    modal: RwSignal<Option<Box<dyn Fn() -> AnyView>>, LocalStorage>,
    doc: LegalDocument,
) -> AnyView {
    view! {
        <button
            type="button"
            class="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            on:click=move |ev| {
                ev.prevent_default();
                modal.set(Some(Box::new(move || {
                    view! { <DocumentViewerModal doc=doc /> }.into_any()
                })));
            }
        >
            {move || legal_document_display_title(doc)}
        </button>
    }
    .into_any()
}

#[component]
fn DocumentViewerModal(doc: LegalDocument) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    view! {
        <div
            class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-100000"
            on:click=move |_| modal.set(None)
        >
            <div
                class="bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg flex flex-col max-h-[85vh]"
                on:click=|ev| ev.stop_propagation()
            >
                <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-800 shrink-0">
                    <h3 class="text-white font-semibold text-base">
                        {move || legal_document_display_title(doc)}
                    </h3>
                    <button
                        class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        <Icon icon=icondata::LuX width="20" height="20" />
                    </button>
                </div>
                <pre class="p-5 text-xs text-neutral-300 whitespace-pre-wrap wrap-break-word overflow-y-auto flex-1">
                    {doc.text()}
                </pre>
            </div>
        </div>
    }
}

#[component]
fn StaleDocumentModal(doc: LegalDocument, remaining: Vec<LegalDocument>) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let consents = expect_context::<LegalConsents>();
    let remaining_for_accept = remaining.clone();
    view! {
        <div class="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-100000">
            <div
                class="bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg flex flex-col max-h-[85vh]"
                on:click=|ev| ev.stop_propagation()
            >
                <div class="px-5 py-4 border-b border-neutral-800 shrink-0">
                    <h3 class="text-white font-semibold text-base">
                        {move || {
                            let doc_title = legal_document_display_title(doc);
                            TranslationKey::ComponentsLegalConsentsStaleDocumentHeading.format(&[
                                ("document_title", doc_title.as_str()),
                            ])
                        }}
                    </h3>
                    <p class="text-neutral-400 text-xs mt-1">
                        {move || {
                            TranslationKey::ComponentsLegalConsentsStaleDocumentBody.format(&[])
                        }}
                    </p>
                </div>
                <pre class="p-5 text-xs text-neutral-300 whitespace-pre-wrap wrap-break-word overflow-y-auto flex-1">
                    {doc.text()}
                </pre>
                <div class="flex gap-3 px-5 py-4 border-t border-neutral-800 shrink-0">
                    <button
                        class="flex-1 rounded-xl py-3 font-medium transition-colors cursor-pointer text-white"
                        style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);"
                        on:click=move |_| {
                            consents.accept_doc(doc);
                            if let Some(&next_doc) = remaining_for_accept.first() {
                                let next_remaining = remaining_for_accept[1..].to_vec();
                                modal
                                    .set(
                                        Some(
                                            Box::new(move || {
                                                view! {
                                                    <StaleDocumentModal
                                                        doc=next_doc
                                                        remaining=next_remaining.clone()
                                                    />
                                                }
                                                    .into_any()
                                            }),
                                        ),
                                    );
                            } else {
                                modal.set(None);
                            }
                        }
                    >
                        {move || TranslationKey::ComponentsLegalConsentsButtonAccept.format(&[])}
                    </button>
                    <button
                        class="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl py-3 font-medium transition-colors cursor-pointer"
                        on:click={
                            let remaining = remaining.clone();
                            move |_| {
                                let mut all_docs = vec![doc];
                                all_docs.extend(remaining.iter().copied());
                                let all_docs_clone = all_docs.clone();
                                modal
                                    .set(
                                        Some(
                                            Box::new(move || {
                                                view! { <DenyModal stale_docs=all_docs_clone.clone() /> }
                                                    .into_any()
                                            }),
                                        ),
                                    );
                            }
                        }
                    >
                        {move || TranslationKey::ComponentsLegalConsentsButtonDeny.format(&[])}
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
fn SecretField(
    label: impl Fn() -> String + 'static + Send,
    #[prop(into)] value: String,
) -> impl IntoView {
    let shown = RwSignal::new(false);
    let value_for_copy = value.clone();
    let skeleton = "•".repeat(value.len().min(40));
    view! {
        <div class="space-y-1">
            <div class="text-neutral-400 text-xs font-medium">{label}</div>
            <div class="flex items-start gap-2">
                <div
                    class="flex-1 min-w-0 rounded-md px-2 py-1 cursor-pointer transition-colors"
                    style=move || {
                        if shown.get() {
                            "background: transparent;"
                        } else {
                            "background: rgb(38 38 38);"
                        }
                    }
                    on:click=move |_| shown.set(true)
                >
                    {
                        let skeleton = skeleton.clone();
                        move || {
                            if shown.get() {
                                view! {
                                    <code class="text-white text-xs font-mono break-all leading-relaxed">
                                        {value.clone()}
                                    </code>
                                }
                                    .into_any()
                            } else {
                                view! {
                                    <span class="text-neutral-600 text-xs font-mono select-none">
                                        {skeleton.clone()}
                                    </span>
                                }
                                    .into_any()
                            }
                        }
                    }
                </div>
                <div class="shrink-0 pt-0.5">
                    <CopyButton text=Signal::derive(move || value_for_copy.clone()) />
                </div>
            </div>
        </div>
    }
}

#[component]
fn DenyModal(stale_docs: Vec<LegalDocument>) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let accounts_ctx = expect_context::<AccountsContext>();
    let stale_docs_for_button = stale_docs.clone();
    view! {
        <div class="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
            <div
                class="bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg flex flex-col max-h-[85vh]"
                on:click=|ev| ev.stop_propagation()
            >
                <div class="px-5 py-4 border-b border-neutral-800 shrink-0">
                    <h3 class="text-white font-semibold text-lg text-center">
                        {move || TranslationKey::ComponentsLegalConsentsDenyModalTitle.format(&[])}
                    </h3>
                    <p class="text-neutral-400 text-xs mt-1 text-center">
                        {move || {
                            TranslationKey::ComponentsLegalConsentsDenyModalSubtitle.format(&[])
                        }}
                    </p>
                </div>
                <div class="overflow-y-auto flex-1 px-4 py-4 space-y-4">
                    {move || {
                        accounts_ctx
                            .accounts
                            .get()
                            .accounts
                            .into_iter()
                            .map(|account| {
                                let seed_phrase = account.seed_phrase.clone();
                                let (secret_str, is_ledger) = match &account.secret_key {
                                    SecretKeyHolder::SecretKey(sk) => (sk.to_string(), false),
                                    SecretKeyHolder::Ledger { path, .. } => (path.clone(), true),
                                };
                                view! {
                                    <div class="bg-neutral-800/50 rounded-xl p-4 space-y-3 border border-neutral-700">
                                        <div class="text-white font-semibold text-sm">
                                            {account.account_id.to_string()}
                                        </div>

                                        {if let Some(phrase) = seed_phrase {
                                            view! {
                                                <SecretField
                                                    label=move || TranslationKey::ComponentsLegalConsentsLabelSeedPhrase
                                                        .format(&[])
                                                    value=phrase
                                                />
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }}

                                        {if is_ledger {
                                            let path_for_copy = secret_str.clone();
                                            view! {
                                                <div class="space-y-1">
                                                    <div class="text-neutral-400 text-xs font-medium">
                                                        {move || TranslationKey::ComponentsLegalConsentsLabelLedgerHdPath
                                                            .format(&[])}
                                                    </div>
                                                    <div class="flex items-center gap-2">
                                                        <code class="text-white text-xs font-mono flex-1 break-all">
                                                            {secret_str}
                                                        </code>
                                                        <CopyButton text=Signal::derive(move || {
                                                            path_for_copy.clone()
                                                        }) />
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            view! {
                                                <SecretField
                                                    label=move || TranslationKey::ComponentsLegalConsentsLabelPrivateKey
                                                        .format(&[])
                                                    value=secret_str
                                                />
                                            }
                                                .into_any()
                                        }}
                                    </div>
                                }
                            })
                            .collect_view()
                    }}
                </div>
                <div class="px-5 py-4 border-t border-neutral-800 shrink-0">
                    <button
                        class="w-full rounded-xl py-3 font-medium transition-colors cursor-pointer text-white"
                        style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);"
                        on:click=move |_| {
                            if let Some(&first_doc) = stale_docs_for_button.first() {
                                let remaining = stale_docs_for_button[1..].to_vec();
                                modal
                                    .set(
                                        Some(
                                            Box::new(move || {
                                                view! {
                                                    <StaleDocumentModal
                                                        doc=first_doc
                                                        remaining=remaining.clone()
                                                    />
                                                }
                                                    .into_any()
                                            }),
                                        ),
                                    );
                            }
                        }
                    >
                        {move || {
                            TranslationKey::ComponentsLegalConsentsButtonChangedMind.format(&[])
                        }}
                    </button>
                </div>
            </div>
        </div>
    }
}

pub fn provide_legal_consents_context() {
    let docs_to_show = provide_legal_consents_state();

    if !docs_to_show.is_empty() {
        let ModalContext { modal } = expect_context::<ModalContext>();
        let first_doc = docs_to_show[0];
        let remaining = docs_to_show[1..].to_vec();
        set_timeout(
            move || {
                modal.set(Some(Box::new(move || {
                    view! { <StaleDocumentModal doc=first_doc remaining=remaining.clone() /> }
                        .into_any()
                })));
            },
            Duration::from_millis(100),
        );
    }
}

#[component]
pub fn LegalConsentsSection(#[prop(default = false)] short: bool) -> impl IntoView {
    let consents = expect_context::<LegalConsents>();
    let accounts_ctx = expect_context::<AccountsContext>();
    let ModalContext { modal } = expect_context::<ModalContext>();

    let has_accounts = move || !accounts_ctx.accounts.get().accounts.is_empty();
    let should_hide = move || consents.all_accepted() && has_accounts();

    if short {
        view! {
            <Show when=move || !should_hide()>
                <div class="mt-4 rounded-xl border border-neutral-800 bg-neutral-900/30 p-4">
                    <label class="flex items-start gap-3 text-sm text-neutral-200 cursor-pointer">
                        <input
                            type="checkbox"
                            class="mt-1 h-4 w-4 cursor-pointer accent-blue-500 shrink-0"
                            prop:checked=move || consents.all_accepted()
                            on:change=move |ev| {
                                if event_target_checked(&ev) {
                                    consents.accept_all();
                                } else {
                                    consents.clear_all();
                                }
                            }
                        />
                        <span>
                            {move || {
                                TranslationKey::ComponentsLegalConsentsCheckboxAcceptCombined
                                    .format_view(vec![
                                        (
                                            "terms",
                                            document_link_button(modal, LegalDocument::Terms),
                                        ),
                                        (
                                            "privacy",
                                            document_link_button(modal, LegalDocument::Privacy),
                                        ),
                                        (
                                            "license",
                                            document_link_button(modal, LegalDocument::License),
                                        ),
                                    ])
                            }}
                        </span>
                    </label>
                </div>
            </Show>
        }
        .into_any()
    } else {
        view! {
            <Show when=move || !should_hide()>
                <div class="mt-4 space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/30 p-4">
                    <label class="flex items-start gap-3 text-sm text-neutral-200 cursor-pointer">
                        <input
                            type="checkbox"
                            class="mt-0.5 h-4 w-4 cursor-pointer accent-blue-500 shrink-0"
                            prop:checked=move || consents.tos_accepted()
                            on:change=move |ev| {
                                consents
                                    .set_doc_accepted(
                                        LegalDocument::Terms,
                                        event_target_checked(&ev),
                                    )
                            }
                        />
                        <span>
                            {move || {
                                TranslationKey::ComponentsLegalConsentsCheckboxAcceptLine.format_view(
                                    vec![(
                                        "doc",
                                        document_link_button(modal, LegalDocument::Terms),
                                    )],
                                )
                            }}
                        </span>
                    </label>
                    <label class="flex items-start gap-3 text-sm text-neutral-200 cursor-pointer">
                        <input
                            type="checkbox"
                            class="mt-0.5 h-4 w-4 cursor-pointer accent-blue-500 shrink-0"
                            prop:checked=move || consents.privacy_accepted()
                            on:change=move |ev| {
                                consents
                                    .set_doc_accepted(
                                        LegalDocument::Privacy,
                                        event_target_checked(&ev),
                                    )
                            }
                        />
                        <span>
                            {move || {
                                TranslationKey::ComponentsLegalConsentsCheckboxAcceptLine.format_view(
                                    vec![(
                                        "doc",
                                        document_link_button(modal, LegalDocument::Privacy),
                                    )],
                                )
                            }}
                        </span>
                    </label>
                    <label class="flex items-start gap-3 text-sm text-neutral-200 cursor-pointer">
                        <input
                            type="checkbox"
                            class="mt-0.5 h-4 w-4 cursor-pointer accent-blue-500 shrink-0"
                            prop:checked=move || consents.license_accepted.get()
                            on:change=move |ev| {
                                consents
                                    .set_doc_accepted(
                                        LegalDocument::License,
                                        event_target_checked(&ev),
                                    )
                            }
                        />
                        <span>
                            {move || {
                                TranslationKey::ComponentsLegalConsentsCheckboxAcceptLine.format_view(
                                    vec![(
                                        "doc",
                                        document_link_button(modal, LegalDocument::License),
                                    )],
                                )
                            }}
                        </span>
                    </label>
                </div>
            </Show>
        }
        .into_any()
    }
}
