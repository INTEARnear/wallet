use crate::contexts::config_context::{AddressBookEntry, ConfigContext};
use crate::translations::TranslationKey;
use leptos::prelude::*;
use leptos_icons::*;
use near_min_api::types::AccountId;

#[component]
pub fn AddressBookSettings() -> impl IntoView {
    let ConfigContext { config, .. } = expect_context::<ConfigContext>();
    let (name, set_name) = signal(String::new());
    let (address, set_address) = signal(String::new());
    let (error, set_error) = signal::<Option<String>>(None);

    let address_book = Memo::new(move |_| {
        let mut entries = config.get().address_book;
        entries.sort_by(|a, b| a.account_id.as_str().cmp(b.account_id.as_str()));
        entries
    });

    let add_entry = move |_| {
        let trimmed_address = address.get_untracked().trim().to_lowercase();
        let trimmed_name = name.get_untracked().trim().to_string();
        let Ok(account_id) = trimmed_address.parse::<AccountId>() else {
            set_error.set(Some(
                TranslationKey::PagesSettingsAddressBookInvalidAddress.format(&[]),
            ));
            return;
        };

        if config
            .get_untracked()
            .address_book
            .iter()
            .any(|entry| entry.account_id == account_id)
        {
            set_error.set(Some(
                TranslationKey::PagesSettingsAddressBookDuplicateAddress.format(&[]),
            ));
            return;
        }

        config.update(|config| {
            config.address_book.push(AddressBookEntry {
                account_id,
                name: trimmed_name,
            });
        });
        set_name.set(String::new());
        set_address.set(String::new());
        set_error.set(None);
    };

    let remove_entry = move |account_id: AccountId| {
        config.update(|config| {
            config
                .address_book
                .retain(|entry| entry.account_id != account_id);
        });
    };

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div>
                <div class="text-xl font-semibold">
                    {move || TranslationKey::PagesSettingsAddressBookTitle.format(&[])}
                </div>
                <p class="text-gray-400 text-sm mt-2">
                    {move || TranslationKey::PagesSettingsAddressBookDescription.format(&[])}
                </p>
            </div>

            <div class="bg-neutral-800 rounded-xl p-4 space-y-3">
                <div class="text-lg font-medium text-gray-300">
                    {move || TranslationKey::PagesSettingsAddressBookAddTitle.format(&[])}
                </div>
                <input
                    type="text"
                    class="w-full bg-neutral-700 text-white rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=move || {
                        TranslationKey::PagesSettingsAddressBookNamePlaceholder.format(&[])
                    }
                    prop:value=name
                    on:input=move |ev| set_name.set(event_target_value(&ev))
                />
                <input
                    type="text"
                    class="w-full bg-neutral-700 text-white rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=move || {
                        TranslationKey::PagesSettingsAddressBookAddressPlaceholder.format(&[])
                    }
                    prop:value=address
                    on:input=move |ev| set_address.set(event_target_value(&ev).to_lowercase())
                />
                <Show when=move || error.get().is_some()>
                    <p class="text-red-500 text-sm font-medium">
                        {move || error.get().unwrap_or_default()}
                    </p>
                </Show>
                <button
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled=move || address.get().trim().is_empty()
                    on:click=add_entry
                >
                    <span>{move || TranslationKey::PagesSettingsAddressBookAddButton.format(&[])}</span>
                </button>
            </div>

            <div class="space-y-2">
                <div class="text-lg font-medium text-gray-300">
                    {move || TranslationKey::PagesSettingsAddressBookSavedTitle.format(&[])}
                </div>
                <Show
                    when=move || !address_book.get().is_empty()
                    fallback=move || {
                        view! {
                            <div class="bg-neutral-800 rounded-xl p-4 text-gray-400 text-sm">
                                {move || TranslationKey::PagesSettingsAddressBookEmpty.format(&[])}
                            </div>
                        }
                    }
                >
                    <div class="space-y-2">
                        {move || {
                            address_book
                                .get()
                                .into_iter()
                                .map(|entry| {
                                    let remove_account_id = entry.account_id.clone();
                                    view! {
                                        <div class="bg-neutral-800 rounded-xl p-4 flex items-center justify-between gap-3">
                                            <div class="min-w-0">
                                                <div class="text-white font-medium truncate">
                                                    {if entry.name.is_empty() {
                                                        entry.account_id.to_string()
                                                    } else {
                                                        entry.name
                                                    }}
                                                </div>
                                                <div class="text-gray-400 text-sm break-all">
                                                    {entry.account_id.to_string()}
                                                </div>
                                            </div>
                                            <button
                                                class="text-red-400 hover:text-red-300 shrink-0 cursor-pointer"
                                                on:click=move |_| remove_entry(remove_account_id.clone())
                                            >
                                                <Icon icon=icondata::LuTrash2 width="20" height="20" />
                                            </button>
                                        </div>
                                    }
                                })
                                .collect_view()
                        }}
                    </div>
                </Show>
            </div>
        </div>
    }
}
