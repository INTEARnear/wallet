use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_use::{use_event_listener, use_window};
use near_min_api::types::{AccountId, near_crypto::SecretKey};

use crate::components::account_selector::{
    AccountCreateParent, AccountCreateRecoveryMethod, LoginMethod, ModalState, seed_phrase_to_key,
};
use crate::components::derivation_path_input::DerivationPathInput;
use crate::components::legal_consents::LegalConsentsSection;
use crate::components::seed_phrase_input::SeedPhraseInput;
use crate::contexts::account_selector_context::AccountSelectorContext;
use crate::contexts::accounts_context::{
    Account, AccountsContext, SecretKeyHolder, format_ledger_error,
};
use crate::contexts::config_context::ConfigContext;
use crate::contexts::legal_consents_context::LegalConsents;
use crate::contexts::network_context::Network;
use crate::contexts::security_log_context::add_security_log;
use crate::pages::settings::LedgerSelector;
use crate::pages::settings::{JsWalletRequest, JsWalletResponse};
use crate::translations::TranslationKey;
use crate::utils::serialize_to_js_value;

async fn find_accounts_by_public_key(
    public_key: near_min_api::types::near_crypto::PublicKey,
    accounts_context: &AccountsContext,
) -> (Vec<(AccountId, Network)>, bool) {
    let mut all_accounts = vec![];

    let mut has_accounts_with_same_public_key = false;
    for (network, api_url) in [
        (Network::Mainnet, "https://api.fastnear.com"),
        (Network::Testnet, "https://test.api.fastnear.com"),
    ] {
        let url = format!("{api_url}/v0/public_key/{public_key}");
        if let Ok(response) = reqwest::get(url).await
            && let Ok(data) = response.json::<serde_json::Value>().await
            && let Some(account_ids) = data.get("account_ids").and_then(|ids| ids.as_array())
        {
            let accounts: Vec<(AccountId, Network)> = account_ids
                .iter()
                .filter_map(|id| {
                    id.as_str()
                        .and_then(|s| s.parse::<AccountId>().ok())
                        .map(|id| (id, network.clone()))
                })
                .filter(|(id, _)| {
                    if accounts_context
                        .accounts
                        .get_untracked()
                        .accounts
                        .iter()
                        .any(|a| a.account_id == *id)
                    {
                        has_accounts_with_same_public_key = true;
                        false
                    } else {
                        true
                    }
                })
                .collect();
            all_accounts.extend(accounts);
        }
    }

    (all_accounts, has_accounts_with_same_public_key)
}

#[component]
pub fn LoginForm(show_back_button: bool) -> impl IntoView {
    let AccountSelectorContext {
        set_modal_state, ..
    } = expect_context::<AccountSelectorContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let (login_method, set_login_method) = signal(LoginMethod::NotSelected);
    let (private_key, set_private_key) = signal("".to_string());
    let (is_valid, set_is_valid) = signal(None);
    let (error, set_error) = signal::<Option<String>>(None);
    let (is_hovered, set_is_hovered) = signal(false);
    let (available_accounts, set_available_accounts) = signal::<Vec<(AccountId, Network)>>(vec![]);
    let (selected_accounts, set_selected_accounts) = signal::<Vec<(AccountId, Network)>>(vec![]);
    let (_generated_mnemonic, set_generated_mnemonic) = signal::<Option<bip39::Mnemonic>>(None);
    let (import_in_progress, set_import_in_progress) = signal(false);
    let config_context = expect_context::<ConfigContext>();
    let (ledger_connection_in_progress, set_ledger_connection_in_progress) = signal(false);
    let (ledger_connected, set_ledger_connected) = signal(false);
    let (ledger_input_hd_path_input, set_ledger_hd_path_input) =
        signal("44'/397'/0'/0'/1'".to_string());
    let (ledger_getting_public_key, set_ledger_getting_public_key) = signal(false);
    let (ledger_current_key_data, set_ledger_current_key_data) =
        signal::<Option<(String, near_min_api::types::near_crypto::PublicKey)>>(None);
    let legal_consents = expect_context::<LegalConsents>();

    let (ledger_account_number, set_ledger_account_number) = signal(0u32);
    let (ledger_change_number, set_ledger_change_number) = signal(0u32);
    let (ledger_address_number, set_ledger_address_number) = signal(1u32);

    let on_path_change = move || {
        set_ledger_current_key_data.set(None);
        set_available_accounts.set(vec![]);
        set_selected_accounts.set(vec![]);
    };

    Effect::new(move || {
        let path = format!(
            "44'/397'/{}'/{}'/{}'",
            ledger_account_number.get(),
            ledger_change_number.get(),
            ledger_address_number.get()
        );
        set_ledger_hd_path_input.set(path);
    });

    // Message listener for wallet communication (from JS)
    let _ = use_event_listener(
        use_window(),
        leptos::ev::message,
        move |event: web_sys::MessageEvent| {
            if let Ok(data) = serde_wasm_bindgen::from_value::<JsWalletResponse>(event.data()) {
                match data {
                    JsWalletResponse::LedgerConnected => {
                        set_ledger_connection_in_progress(false);
                        set_ledger_connected(true);
                    }
                    JsWalletResponse::LedgerPublicKey { path, key } => {
                        set_ledger_getting_public_key(false);
                        set_error.set(None);

                        if path != ledger_input_hd_path_input.get_untracked() {
                            // User changed the path during the request, ignore the result
                            return;
                        }
                        if !legal_consents.all_accepted_untracked() {
                            set_available_accounts.set(vec![]);
                            set_selected_accounts.set(vec![]);
                            set_error.set(Some(
                                TranslationKey::ComponentsLegalConsentsBlockingMessage.format(&[]),
                            ));
                            return;
                        }

                        if key.len() == 32 {
                            let bs58_key = bs58::encode(&key).into_string();
                            let public_key_str = format!("ed25519:{}", bs58_key);
                            if let Ok(public_key) = public_key_str
                                .parse::<near_min_api::types::near_crypto::PublicKey>(
                            ) {
                                set_ledger_current_key_data(Some((
                                    path.clone(),
                                    public_key.clone(),
                                )));

                                spawn_local(async move {
                                    let (all_accounts, has_existing) =
                                        find_accounts_by_public_key(public_key, &accounts_context)
                                            .await;

                                    set_available_accounts.set(all_accounts.clone());
                                    set_selected_accounts.set(vec![]);
                                    if all_accounts.is_empty() {
                                        if has_existing {
                                            set_error.set(Some(
                                                TranslationKey::ComponentsLoginFormErrLedgerAlreadyImported
                                                    .format(&[]),
                                            ));
                                        } else {
                                            set_error.set(Some(
                                                TranslationKey::ComponentsLoginFormErrLedgerNoAccounts
                                                    .format(&[]),
                                            ));
                                        }
                                    }
                                });
                            } else {
                                set_error.set(Some(
                                    TranslationKey::ComponentsLoginFormErrParsePublicKey
                                        .format(&[]),
                                ));
                            }
                        } else {
                            set_error.set(Some(
                                TranslationKey::ComponentsLoginFormErrInvalidLedgerKeyLength
                                    .format(&[]),
                            ));
                        }
                    }
                    JsWalletResponse::LedgerConnectError { error } => {
                        set_ledger_connection_in_progress(false);
                        set_ledger_connected(false);
                        let error_message = format_ledger_error(&error);
                        set_error.set(Some(error_message));
                    }
                    JsWalletResponse::LedgerGetPublicKeyError { error } => {
                        set_ledger_getting_public_key(false);
                        let error_message = format_ledger_error(&error);
                        set_error.set(Some(error_message));
                    }
                    _ => {}
                }
            }
        },
    );

    let check_seed_phrase = move |seed_phrase: String| {
        set_error.set(None);
        if seed_phrase.is_empty() {
            set_is_valid.set(None);
            return;
        }
        if !legal_consents.all_accepted_untracked() {
            set_error.set(Some(
                TranslationKey::ComponentsLegalConsentsBlockingMessage.format(&[]),
            ));
            set_available_accounts.set(vec![]);
            set_selected_accounts.set(vec![]);
            set_is_valid.set(None);
            return;
        }

        let secret_key = if let Some(secret_key) = seed_phrase_to_key(&seed_phrase) {
            secret_key
        } else {
            set_error.set(Some(
                TranslationKey::ComponentsLoginFormErrInvalidSeedPhrase.format(&[]),
            ));
            set_is_valid.set(None);
            return;
        };
        let public_key = secret_key.public_key();

        spawn_local(async move {
            let (all_accounts, has_existing) =
                find_accounts_by_public_key(public_key, &accounts_context).await;

            set_available_accounts.set(all_accounts.clone());
            set_selected_accounts.set(vec![]);
            if all_accounts.is_empty() {
                if has_existing {
                    set_error.set(Some(
                        TranslationKey::ComponentsLoginFormErrSeedAlreadyImported.format(&[]),
                    ));
                } else {
                    set_error.set(Some(
                        TranslationKey::ComponentsLoginFormErrSeedNoAccounts.format(&[]),
                    ));
                }
                set_is_valid.set(None);
            } else {
                set_is_valid.set(Some(secret_key));
            }
        });
    };

    let check_private_key = move |private_key: String| {
        set_error.set(None);
        if private_key.is_empty() {
            set_is_valid.set(None);
            return;
        }
        if !legal_consents.all_accepted_untracked() {
            set_error.set(Some(
                TranslationKey::ComponentsLegalConsentsBlockingMessage.format(&[]),
            ));
            set_available_accounts.set(vec![]);
            set_selected_accounts.set(vec![]);
            set_is_valid.set(None);
            return;
        }

        let secret_key = if let Ok(secret_key) = private_key.parse::<SecretKey>() {
            secret_key
        } else {
            set_error.set(Some(
                TranslationKey::ComponentsLoginFormErrInvalidPrivateKey.format(&[]),
            ));
            set_is_valid.set(None);
            return;
        };
        let public_key = secret_key.public_key();

        spawn_local(async move {
            let (all_accounts, has_existing) =
                find_accounts_by_public_key(public_key, &accounts_context).await;

            set_available_accounts.set(all_accounts.clone());
            set_selected_accounts.set(vec![]);
            if all_accounts.is_empty() {
                if has_existing {
                    set_error.set(Some(
                        TranslationKey::ComponentsLoginFormErrPrivateKeyAlreadyImported.format(&[]),
                    ));
                } else {
                    set_error.set(Some(
                        TranslationKey::ComponentsLoginFormErrPrivateKeyNoAccounts.format(&[]),
                    ));
                }
                set_is_valid.set(None);
            } else {
                set_is_valid.set(Some(secret_key));
            }
        });
    };

    let import_account = move || {
        if !legal_consents.all_accepted_untracked() {
            set_error.set(Some(
                TranslationKey::ComponentsLegalConsentsBlockingMessage.format(&[]),
            ));
            return;
        }
        let selected_list = selected_accounts.get();
        if !selected_list.is_empty() {
            set_import_in_progress(true);
            set_error.set(None);

            let mut accounts = accounts_context.accounts.get();
            let user_input = private_key.get();
            let (secret_key, seed_phrase) = if let Ok(secret_key) = user_input.parse::<SecretKey>()
            {
                (secret_key, None)
            } else if let Some(secret_key) = seed_phrase_to_key(&user_input) {
                (secret_key, Some(user_input))
            } else {
                set_error.set(Some(
                    TranslationKey::ComponentsLoginFormErrInvalidSeedPhrase.format(&[]),
                ));
                set_is_valid.set(None);
                set_import_in_progress(false);
                return;
            };

            let mut last_account_id: Option<AccountId> = None;
            for (account_id, network) in selected_list.iter() {
                add_security_log(
                    format!("Account imported with private key {secret_key}"),
                    account_id.clone(),
                    accounts_context,
                );
                accounts.accounts.push(Account {
                    account_id: account_id.clone(),
                    secret_key: SecretKeyHolder::SecretKey(secret_key.clone()),
                    seed_phrase: seed_phrase.clone(),
                    network: network.clone(),
                    exported: false,
                });
                last_account_id = Some(account_id.clone());
            }

            if let Some(last) = last_account_id {
                accounts.selected_account_id = Some(last);
            }
            accounts_context.set_accounts.set(accounts);
            set_modal_state.set(ModalState::AccountList);
            set_import_in_progress(false);
        }
    };

    let request_ledger_connection = move || {
        if ledger_connection_in_progress.get_untracked() {
            return;
        }
        set_error.set(None);

        set_ledger_connection_in_progress(true);

        let ledger_mode = config_context.config.get_untracked().ledger_mode;
        let request = JsWalletRequest::LedgerConnect { mode: ledger_mode };

        match serialize_to_js_value(&request) {
            Ok(js_value) => {
                let origin = window()
                    .location()
                    .origin()
                    .unwrap_or_else(|_| "*".to_string());

                if window().post_message(&js_value, &origin).is_err() {
                    log::error!("Failed to send Ledger connection request");
                    set_ledger_connection_in_progress(false);
                }
            }
            _ => {
                log::error!("Failed to serialize Ledger connection request");
                set_ledger_connection_in_progress(false);
            }
        }
    };

    view! {
        <div class="absolute inset-0 bg-neutral-950 lg:rounded-3xl overflow-y-auto">
            {move || {
                if show_back_button {
                    view! {
                        <button
                            class="absolute left-4 top-4 w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 group hover:bg-neutral-300 z-10"
                            on:click=move |_| set_modal_state.set(ModalState::AccountList)
                        >
                            <div class="group-hover:text-black">
                                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                            </div>
                        </button>
                    }
                        .into_any()
                } else {
                    ().into_any()
                }
            }} <div class="flex items-center justify-center min-h-[calc(100%-40px)]">
                <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md">
                    <h2 class="text-white text-2xl font-semibold mb-6">
                        {move || TranslationKey::ComponentsLoginFormTitle.format(&[])}
                    </h2>

                    // Always show login method selection buttons
                    <div class="flex gap-2 mb-6">
                        <button
                            class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                            style=move || {
                                if login_method.get() == LoginMethod::SeedPhrase {
                                    "border-color: rgb(96 165 250); background-color: rgb(59 130 246 / 0.1);"
                                } else {
                                    "border-color: rgb(55 65 81); background-color: transparent;"
                                }
                            }
                            on:click=move |_| {
                                set_login_method.set(LoginMethod::SeedPhrase);
                                set_error.set(None);
                                set_is_valid.set(None);
                                set_available_accounts.set(vec![]);
                                set_selected_accounts.set(vec![]);
                                set_private_key.set("".to_string());
                            }
                        >
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Icon
                                        icon=icondata::LuKey
                                        width="16"
                                        height="16"
                                        attr:class="text-blue-400"
                                    />
                                </div>
                                <div class="text-white text-sm font-medium">
                                    {move || {
                                        TranslationKey::ComponentsLoginFormMethodSeedPhrase
                                            .format(&[])
                                    }}
                                </div>
                            </div>
                        </button>

                        <button
                            class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                            style=move || {
                                if login_method.get() == LoginMethod::PrivateKey {
                                    "border-color: rgb(22 163 74); background-color: rgb(22 163 74 / 0.1);"
                                } else {
                                    "border-color: rgb(55 65 81); background-color: transparent;"
                                }
                            }
                            on:click=move |_| {
                                set_login_method.set(LoginMethod::PrivateKey);
                                set_error.set(None);
                                set_is_valid.set(None);
                                set_available_accounts.set(vec![]);
                                set_selected_accounts.set(vec![]);
                                set_private_key.set("".to_string());
                            }
                        >
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                                    <Icon
                                        icon=icondata::LuKeyRound
                                        width="16"
                                        height="16"
                                        attr:class="text-green-500"
                                    />
                                </div>
                                <div class="text-white text-sm font-medium">
                                    {move || {
                                        TranslationKey::ComponentsLoginFormMethodPrivateKey
                                            .format(&[])
                                    }}
                                </div>
                            </div>
                        </button>
                        <button
                            class="flex-1 p-3 rounded-lg border transition-all duration-200 text-center cursor-pointer"
                            style=move || {
                                if login_method.get() == LoginMethod::Ledger {
                                    "border-color: rgb(196 181 253); background-color: rgb(147 51 234 / 0.1);"
                                } else {
                                    "border-color: rgb(55 65 81); background-color: transparent;"
                                }
                            }
                            on:click=move |_| {
                                set_login_method.set(LoginMethod::Ledger);
                                set_error.set(None);
                                set_is_valid.set(None);
                                set_available_accounts.set(vec![]);
                                set_selected_accounts.set(vec![]);
                                set_private_key.set("".to_string());
                                set_generated_mnemonic.set(None);
                                request_ledger_connection();
                            }
                        >
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Icon
                                        icon=icondata::LuWallet
                                        width="16"
                                        height="16"
                                        attr:class="text-purple-400"
                                    />
                                </div>
                                <div class="text-white text-sm font-medium">
                                    {move || TranslationKey::ComponentsLoginFormMethodLedger.format(&[])}
                                </div>
                            </div>
                        </button>
                    </div>

                    {move || match login_method.get() {
                        LoginMethod::NotSelected => {
                            view! {
                                <div class="space-y-4">
                                    <div class="text-center py-8">
                                        <p class="text-neutral-400">
                                            {move || {
                                                TranslationKey::ComponentsLoginFormHintSelectMethod
                                                    .format(&[])
                                            }}
                                        </p>
                                    </div>
                                </div>
                            }
                                .into_any()
                        }
                        LoginMethod::SeedPhrase => {
                            view! {
                                <div class="space-y-6">
                                    <SeedPhraseInput on_change=Callback::new(move |phrase: String| {
                                        set_private_key.set(phrase.clone());
                                        set_available_accounts.set(vec![]);
                                        set_selected_accounts.set(vec![]);
                                        check_seed_phrase(phrase);
                                    }) />
                                    {move || {
                                        if let Some(err) = error.get() {
                                            view! {
                                                <p class="text-red-500 text-sm mt-2 font-medium">{err}</p>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                    {move || {
                                        if !available_accounts.get().is_empty() {
                                            view! {
                                                <div class="space-y-2">
                                                    <label class="block text-neutral-400 text-sm font-medium">
                                                        {move || {
                                                            TranslationKey::ComponentsLoginFormLabelSelectAccountsImport
                                                                .format(&[])
                                                        }}
                                                    </label>
                                                    <div class="space-y-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                        {available_accounts
                                                            .get()
                                                            .into_iter()
                                                            .map(|(account_id, network)| {
                                                                let account_id_str = account_id.to_string();
                                                                let account_id2 = account_id.clone();
                                                                view! {
                                                                    <button
                                                                        class="w-full p-3 rounded-lg transition-all duration-200 text-left border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer group"
                                                                        style={
                                                                            let network = network.clone();
                                                                            move || {
                                                                                if selected_accounts
                                                                                    .get()
                                                                                    .contains(&(account_id.clone(), network.clone()))
                                                                                {
                                                                                    "background-color: rgb(38 38 38); border-color: rgb(59 130 246);"
                                                                                } else {
                                                                                    "background-color: rgb(23 23 23 / 0.5);"
                                                                                }
                                                                            }
                                                                        }
                                                                        on:click=move |_| {
                                                                            let mut list = selected_accounts.get_untracked();
                                                                            if list.contains(&(account_id2.clone(), network.clone())) {
                                                                                list.retain(|pair| {
                                                                                    pair != &(account_id2.clone(), network.clone())
                                                                                });
                                                                            } else {
                                                                                list.push((account_id2.clone(), network.clone()));
                                                                            }
                                                                            set_selected_accounts.set(list);
                                                                        }
                                                                    >
                                                                        <div class="text-white font-medium transition-colors duration-200">
                                                                            {account_id_str}
                                                                        </div>
                                                                        {
                                                                            let network = network.clone();
                                                                            move || {
                                                                                if network == Network::Testnet {
                                                                                    view! {
                                                                                        <p class="text-yellow-500 text-sm mt-1 font-medium">
                                                                                            {move || TranslationKey::ComponentsLoginFormTestnetImportDisclaimer
                                                                                                .format_view(vec![("testnet", view! {
                                                                                                    <b>
                                                                                                        {move || {
                                                                                                            TranslationKey::ComponentsLoginFormTestnetWord
                                                                                                                .format(&[])
                                                                                                        }}
                                                                                                    </b>
                                                                                                }
                                                                                                .into_any())])}
                                                                                        </p>
                                                                                    }
                                                                                        .into_any()
                                                                                } else {
                                                                                    ().into_any()
                                                                                }
                                                                            }
                                                                        }
                                                                    </button>
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                    <div class="flex gap-2">
                                        <button
                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                                            style=move || {
                                                if is_valid.get().is_some()
                                                    && !selected_accounts.get().is_empty()
                                                    && legal_consents.all_accepted()
                                                    && !import_in_progress.get()
                                                {
                                                    "background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); cursor: pointer;"
                                                } else {
                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                }
                                            }
                                            disabled=move || {
                                                is_valid.get().is_none()
                                                    || selected_accounts.get().is_empty()
                                                    || !legal_consents.all_accepted()
                                                    || import_in_progress.get()
                                            }
                                            on:click=move |_| import_account()
                                            on:mouseenter=move |_| set_is_hovered.set(true)
                                            on:mouseleave=move |_| set_is_hovered.set(false)
                                        >
                                            <div
                                                class="absolute inset-0 transition-opacity duration-200"
                                                style=move || {
                                                    if is_valid.get().is_some()
                                                        && !selected_accounts.get().is_empty() && is_hovered.get()
                                                        && legal_consents.all_accepted()
                                                        && !import_in_progress.get()
                                                    {
                                                        "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 1"
                                                    } else {
                                                        "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 0"
                                                    }
                                                }
                                            ></div>
                                            <span class="relative flex items-center justify-center gap-2">
                                                {move || {
                                                    if import_in_progress.get() {
                                                        view! {
                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }
                                                }}
                                                {move || {
                                                    if import_in_progress.get() {
                                                        TranslationKey::ComponentsLoginFormButtonImporting
                                                            .format(&[])
                                                    } else {
                                                        TranslationKey::ComponentsLoginFormButtonImportAccount
                                                            .format(&[])
                                                    }
                                                }}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            }
                                .into_any()
                        }
                        LoginMethod::PrivateKey => {
                            view! {
                                <div class="space-y-6">
                                    <div>
                                        <label class="block text-neutral-400 text-sm font-medium mb-2">
                                            {move || {
                                                TranslationKey::ComponentsLoginFormLabelPrivateKeyField
                                                    .format(&[])
                                            }}
                                        </label>
                                        <div class="relative">
                                            <input
                                                type="text"
                                                class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                                style=move || {
                                                    if is_valid.get().is_some() {
                                                        "border: 2px solid rgb(22 163 74)"
                                                    } else {
                                                        "border: 2px solid rgb(55 65 81)"
                                                    }
                                                }
                                                prop:value=private_key
                                                on:input=move |ev| {
                                                    let value = event_target_value(&ev);
                                                    set_private_key.set(value.clone());
                                                    set_available_accounts.set(vec![]);
                                                    set_selected_accounts.set(vec![]);
                                                    check_private_key(value);
                                                }
                                            />
                                        </div>
                                        {move || {
                                            if let Some(err) = error.get() {
                                                view! {
                                                    <p class="text-red-500 text-sm mt-2 font-medium">{err}</p>
                                                }
                                                    .into_any()
                                            } else {
                                                view! {
                                                    <p class="text-neutral-400 text-sm mt-2 font-medium">
                                                        {move || {
                                                            TranslationKey::ComponentsLoginFormHintEnterPrivateKey
                                                                .format(&[])
                                                        }}
                                                    </p>
                                                }
                                                    .into_any()
                                            }
                                        }}
                                    </div>
                                    {move || {
                                        if !available_accounts.get().is_empty() {
                                            view! {
                                                <div class="space-y-2">
                                                    <label class="block text-neutral-400 text-sm font-medium">
                                                        {move || {
                                                            TranslationKey::ComponentsLoginFormLabelSelectAccountsImport
                                                                .format(&[])
                                                        }}
                                                    </label>
                                                    <div class="space-y-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                        {available_accounts
                                                            .get()
                                                            .into_iter()
                                                            .map(|(account_id, network)| {
                                                                let account_id_str = account_id.to_string();
                                                                let account_id2 = account_id.clone();
                                                                view! {
                                                                    <button
                                                                        class="w-full p-3 rounded-lg transition-all duration-200 text-left border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer group"
                                                                        style={
                                                                            let network = network.clone();
                                                                            move || {
                                                                                if selected_accounts
                                                                                    .get()
                                                                                    .contains(&(account_id.clone(), network.clone()))
                                                                                {
                                                                                    "background-color: rgb(38 38 38); border-color: rgb(59 130 246);"
                                                                                } else {
                                                                                    "background-color: rgb(23 23 23 / 0.5);"
                                                                                }
                                                                            }
                                                                        }
                                                                        on:click={
                                                                            let network = network.clone();
                                                                            move |_| {
                                                                                let mut list = selected_accounts.get_untracked();
                                                                                if list.contains(&(account_id2.clone(), network.clone())) {
                                                                                    list.retain(|pair| {
                                                                                        pair != &(account_id2.clone(), network.clone())
                                                                                    });
                                                                                } else {
                                                                                    list.push((account_id2.clone(), network.clone()));
                                                                                }
                                                                                set_selected_accounts.set(list);
                                                                            }
                                                                        }
                                                                    >
                                                                        <div class="text-white font-medium transition-colors duration-200">
                                                                            {account_id_str}
                                                                        </div>
                                                                        {
                                                                            let network = network.clone();
                                                                            move || {
                                                                                if network == Network::Testnet {
                                                                                    view! {
                                                                                        <p class="text-yellow-500 text-sm mt-1 font-medium">
                                                                                            {move || TranslationKey::ComponentsLoginFormTestnetImportDisclaimer
                                                                                                .format_view(vec![("testnet",  view! {
                                                                                                    <b>
                                                                                                        {move || {
                                                                                                            TranslationKey::ComponentsLoginFormTestnetWord
                                                                                                                .format(&[])
                                                                                                        }}
                                                                                                    </b>
                                                                                                }
                                                                                                .into_any())])}
                                                                                        </p>
                                                                                    }
                                                                                        .into_any()
                                                                                } else {
                                                                                    ().into_any()
                                                                                }
                                                                            }
                                                                        }
                                                                    </button>
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                    <div class="flex gap-2">
                                        <button
                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                                            style=move || {
                                                if is_valid.get().is_some()
                                                    && !selected_accounts.get().is_empty()
                                                    && legal_consents.all_accepted()
                                                    && !import_in_progress.get()
                                                {
                                                    "background: linear-gradient(90deg, #16a34a 0%, #15803d 100%); cursor: pointer;"
                                                } else {
                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                }
                                            }
                                            disabled=move || {
                                                is_valid.get().is_none()
                                                    || selected_accounts.get().is_empty()
                                                    || !legal_consents.all_accepted()
                                                    || import_in_progress.get()
                                            }
                                            on:click=move |_| import_account()
                                            on:mouseenter=move |_| set_is_hovered.set(true)
                                            on:mouseleave=move |_| set_is_hovered.set(false)
                                        >
                                            <div
                                                class="absolute inset-0 transition-opacity duration-200"
                                                style=move || {
                                                    if is_valid.get().is_some()
                                                        && !selected_accounts.get().is_empty() && is_hovered.get()
                                                        && legal_consents.all_accepted()
                                                        && !import_in_progress.get()
                                                    {
                                                        "background: linear-gradient(90deg, #15803d 0%, #14532d 100%); opacity: 1"
                                                    } else {
                                                        "background: linear-gradient(90deg, #15803d 0%, #14532d 100%); opacity: 0"
                                                    }
                                                }
                                            ></div>
                                            <span class="relative flex items-center justify-center gap-2">
                                                {move || {
                                                    if import_in_progress.get() {
                                                        view! {
                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }
                                                }}
                                                {move || {
                                                    if import_in_progress.get() {
                                                        TranslationKey::ComponentsLoginFormButtonImporting
                                                            .format(&[])
                                                    } else {
                                                        TranslationKey::ComponentsLoginFormButtonImportAccount
                                                            .format(&[])
                                                    }
                                                }}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            }
                                .into_any()
                        }
                        LoginMethod::Ledger => {
                            view! {
                                <div class="space-y-2">
                                    <div class="text-center">
                                        <div class="mb-4">
                                            <LedgerSelector on_change=Callback::new(move |_| {
                                                request_ledger_connection();
                                            }) />
                                        </div>

                                        {move || {
                                            if ledger_connected.get() {
                                                view! {
                                                    <div class="space-y-4 w-full">
                                                        <DerivationPathInput
                                                            ledger_account_number=ledger_account_number
                                                            set_ledger_account_number=set_ledger_account_number
                                                            ledger_change_number=ledger_change_number
                                                            set_ledger_change_number=set_ledger_change_number
                                                            ledger_address_number=ledger_address_number
                                                            set_ledger_address_number=set_ledger_address_number
                                                            on_change=on_path_change.into()
                                                        />
                                                        <button
                                                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer"
                                                            style=move || {
                                                                if ledger_getting_public_key.get()
                                                                    || !legal_consents.all_accepted()
                                                                {
                                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                                } else {
                                                                    "background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);"
                                                                }
                                                            }
                                                            disabled=move || {
                                                                ledger_getting_public_key.get()
                                                                    || !legal_consents.all_accepted()
                                                            }
                                                            on:click=move |_| {
                                                                if !legal_consents.all_accepted_untracked() {
                                                                    set_error
                                                                        .set(Some(TranslationKey::ComponentsLegalConsentsBlockingMessage.format(&[])));
                                                                    return;
                                                                }
                                                                set_error.set(None);
                                                                set_ledger_getting_public_key(true);
                                                                set_available_accounts.set(vec![]);
                                                                set_selected_accounts.set(vec![]);
                                                                set_ledger_current_key_data.set(None);
                                                                let path = ledger_input_hd_path_input.get_untracked();
                                                                let ledger_mode = config_context
                                                                    .config
                                                                    .get_untracked()
                                                                    .ledger_mode;
                                                                let request = JsWalletRequest::LedgerGetPublicKey {
                                                                    path,
                                                                    mode: ledger_mode,
                                                                };
                                                                match serialize_to_js_value(&request) {
                                                                    Ok(js_value) => {
                                                                        let origin = window()
                                                                            .location()
                                                                            .origin()
                                                                            .unwrap_or_else(|_| "*".to_string());
                                                                        if window().post_message(&js_value, &origin).is_err() {
                                                                            log::error!("Failed to send Ledger public key request");
                                                                            set_ledger_getting_public_key(false);
                                                                        }
                                                                    }
                                                                    _ => {
                                                                        log::error!(
                                                                            "Failed to serialize Ledger public key request"
                                                                        );
                                                                        set_ledger_getting_public_key(false);
                                                                    }
                                                                }
                                                            }
                                                        >
                                                            <span class="relative flex items-center justify-center gap-2">
                                                                {move || {
                                                                    if ledger_getting_public_key.get() {
                                                                        view! {
                                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        }
                                                                            .into_any()
                                                                    } else {
                                                                        ().into_any()
                                                                    }
                                                                }}
                                                                {move || {
                                                                    if ledger_getting_public_key.get() {
                                                                        TranslationKey::ComponentsLoginFormLedgerConfirmOnDevice
                                                                            .format(&[])
                                                                    } else {
                                                                        TranslationKey::ComponentsLoginFormLedgerButtonFindAccounts
                                                                            .format(&[])
                                                                    }
                                                                }}
                                                            </span>
                                                        </button>
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>

                                    {move || {
                                        if let Some(err) = error.get() {
                                            view! {
                                                <p class="text-red-400 text-sm font-medium">{err}</p>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}

                                    {move || {
                                        if !available_accounts.get().is_empty() {
                                            view! {
                                                <div class="space-y-2">
                                                    <label class="block text-neutral-400 text-sm font-medium">
                                                        {move || {
                                                            TranslationKey::ComponentsLoginFormLabelSelectAccountImport
                                                                .format(&[])
                                                        }}
                                                    </label>
                                                    <div class="space-y-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                        {available_accounts
                                                            .get()
                                                            .into_iter()
                                                            .map(|(account_id, network)| {
                                                                let account_id_str = account_id.to_string();
                                                                let account_id2 = account_id.clone();
                                                                view! {
                                                                    <button
                                                                        class="w-full p-3 rounded-lg transition-all duration-200 text-left border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer group"
                                                                        style={
                                                                            let network = network.clone();
                                                                            move || {
                                                                                if selected_accounts
                                                                                    .get()
                                                                                    .contains(&(account_id.clone(), network.clone()))
                                                                                {
                                                                                    "background-color: rgb(38 38 38); border-color: rgb(59 130 246);"
                                                                                } else {
                                                                                    "background-color: rgb(23 23 23 / 0.5);"
                                                                                }
                                                                            }
                                                                        }
                                                                        on:click={
                                                                            let network = network.clone();
                                                                            move |_| {
                                                                                if selected_accounts
                                                                                    .get()
                                                                                    .contains(&(account_id2.clone(), network.clone()))
                                                                                {
                                                                                    set_selected_accounts
                                                                                        .update(|accounts| {
                                                                                            accounts
                                                                                                .retain(|pair| {
                                                                                                    pair != &(account_id2.clone(), network.clone())
                                                                                                });
                                                                                        });
                                                                                } else {
                                                                                    set_selected_accounts
                                                                                        .update(|accounts| {
                                                                                            accounts.push((account_id2.clone(), network.clone()));
                                                                                        });
                                                                                }
                                                                            }
                                                                        }
                                                                    >
                                                                        <div class="text-white font-medium transition-colors duration-200">
                                                                            {account_id_str}
                                                                        </div>
                                                                        <div class="text-purple-400 text-sm mt-1 font-medium">
                                                                            {move || {
                                                                                TranslationKey::ComponentsLoginFormLedgerBadgeConnectedVia
                                                                                    .format(&[])
                                                                            }}
                                                                        </div>
                                                                        {
                                                                            let network = network.clone();
                                                                            move || {
                                                                                if network == Network::Testnet {
                                                                                    view! {
                                                                                        <p class="text-yellow-500 text-sm mt-1 font-medium">
                                                                                            {move || TranslationKey::ComponentsLoginFormTestnetImportDisclaimer
                                                                                                .format_view(vec![("testnet",  view! {
                                                                                                    <b>
                                                                                                        {move || {
                                                                                                            TranslationKey::ComponentsLoginFormTestnetWord
                                                                                                                .format(&[])
                                                                                                        }}
                                                                                                    </b>
                                                                                                }
                                                                                                .into_any())])}
                                                                                        </p>
                                                                                    }
                                                                                        .into_any()
                                                                                } else {
                                                                                    ().into_any()
                                                                                }
                                                                            }
                                                                        }
                                                                    </button>
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>

                                                    <div class="flex gap-2 mt-4">
                                                        <button
                                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                                                            style=move || {
                                                                if !selected_accounts.get().is_empty()
                                                                    && legal_consents.all_accepted()
                                                                    && !import_in_progress.get()
                                                                {
                                                                    "background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%); cursor: pointer;"
                                                                } else {
                                                                    "background: rgb(55 65 81); cursor: not-allowed;"
                                                                }
                                                            }
                                                            disabled=move || {
                                                                selected_accounts.get().is_empty()
                                                                    || !legal_consents.all_accepted()
                                                                    || import_in_progress.get()
                                                            }
                                                            on:click=move |_| {
                                                                if !legal_consents.all_accepted_untracked() {
                                                                    set_error
                                                                        .set(Some(TranslationKey::ComponentsLegalConsentsBlockingMessage.format(&[])));
                                                                    return;
                                                                }
                                                                if let Some((path, public_key)) = ledger_current_key_data
                                                                    .get()
                                                                {
                                                                    if selected_accounts.get_untracked().is_empty() {
                                                                        return;
                                                                    }
                                                                    set_import_in_progress(true);
                                                                    set_error.set(None);
                                                                    let mut accounts = accounts_context
                                                                        .accounts
                                                                        .get_untracked();
                                                                    let mut last_account_id: Option<AccountId> = None;
                                                                    for (account_id, network) in selected_accounts
                                                                        .get_untracked()
                                                                        .iter()
                                                                    {
                                                                        add_security_log(
                                                                            format!(
                                                                                "Account imported with Ledger path {path} and public key {public_key}",
                                                                            ),
                                                                            account_id.clone(),
                                                                            accounts_context,
                                                                        );
                                                                        accounts
                                                                            .accounts
                                                                            .push(Account {
                                                                                account_id: account_id.clone(),
                                                                                secret_key: SecretKeyHolder::Ledger {
                                                                                    path: path.clone(),
                                                                                    public_key: public_key.clone(),
                                                                                },
                                                                                seed_phrase: None,
                                                                                network: network.clone(),
                                                                                exported: true,
                                                                            });
                                                                        last_account_id = Some(account_id.clone());
                                                                    }
                                                                    if let Some(last) = last_account_id {
                                                                        accounts.selected_account_id = Some(last);
                                                                    }
                                                                    accounts_context.set_accounts.set(accounts);
                                                                    set_modal_state.set(ModalState::AccountList);
                                                                    set_import_in_progress(false);
                                                                } else {
                                                                    set_error.set(Some(
                                                                        TranslationKey::ComponentsLoginFormErrLedgerImportFindAccountsFirst
                                                                            .format(&[]),
                                                                    ));
                                                                }
                                                            }
                                                        >
                                                            <span class="relative flex items-center justify-center gap-2">
                                                                {move || {
                                                                    if import_in_progress.get() {
                                                                        view! {
                                                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        }
                                                                            .into_any()
                                                                    } else {
                                                                        ().into_any()
                                                                    }
                                                                }}
                                                                {move || {
                                                                    if import_in_progress.get() {
                                                                        TranslationKey::ComponentsLoginFormButtonImporting
                                                                            .format(&[])
                                                                    } else {
                                                                        TranslationKey::ComponentsLoginFormButtonImportAccount
                                                                            .format(&[])
                                                                    }
                                                                }}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            }
                                .into_any()
                        }
                    }}
                    <LegalConsentsSection />

                    <div class="relative mt-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-neutral-800"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-neutral-950 text-neutral-400">
                                {move || TranslationKey::ComponentsLoginFormDividerOr.format(&[])}
                            </span>
                        </div>
                    </div>

                    <button
                        class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden border border-neutral-800 hover:border-neutral-700 cursor-pointer mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled=move || !legal_consents.all_accepted()
                        on:click=move |_| {
                            if !legal_consents.all_accepted_untracked() {
                                set_error.set(Some(TranslationKey::ComponentsLegalConsentsBlockingMessage.format(&[])));
                                return;
                            }
                            set_modal_state
                                .set(ModalState::Creating {
                                    parent: AccountCreateParent::Mainnet,
                                    recovery_method: AccountCreateRecoveryMethod::RecoveryPhrase,
                                })
                        }
                    >
                        <span class="relative">
                            {move || TranslationKey::ComponentsLoginFormButtonCreateNewAccount.format(&[])}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    }
}
