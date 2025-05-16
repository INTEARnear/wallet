use std::hash::{DefaultHasher, Hash, Hasher};
use std::time::Duration;

use bip39::Mnemonic;
use futures_timer::Delay;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::components::A;
use near_min_api::{
    types::{
        near_crypto::{ED25519SecretKey, SecretKey},
        AccessKeyPermissionView, AccessKeyView, AccountId, Finality,
    },
    QueryFinality,
};
use slipped10::BIP32Path;
use web_sys::KeyboardEvent;

use crate::contexts::network_context::Network;
use crate::contexts::security_log_context::add_security_log;
use crate::contexts::{
    account_selector_swipe_context::AccountSelectorSwipeContext,
    accounts_context::{Account, AccountsContext},
};

#[derive(Clone, Copy, PartialEq)]
enum ModalState {
    AccountList,
    Creating,
    LoggingIn,
}

fn get_account_gradient(account_id: &str, brightness: f32) -> String {
    let mut hasher = DefaultHasher::new();
    account_id.hash(&mut hasher);
    let hash = hasher.finish();

    let base_hue = 160 + (hash % 120); // 160-280 (aqua to purple)
    let hue_variation = (25.0 * brightness) as u64; // ±12.5 degrees variation
    let saturation = 80;
    let base_lightness = 30;
    let lightness = (base_lightness as f32 * brightness) as u32;

    format!(
        "linear-gradient(135deg, hsl({}deg {}% {}%) 0%, hsl({}deg {}% {}%) 100%)",
        base_hue - hue_variation / 2,
        saturation,
        lightness,
        base_hue + hue_variation / 2,
        saturation,
        lightness
    )
}

const HD_PATH: &str = "m/44'/397'/0'";

fn seed_phrase_to_key(seed_phrase: &str) -> Option<SecretKey> {
    let path = HD_PATH.parse().unwrap();
    let password = None;
    get_secret_key_from_seed(path, seed_phrase, password)
}

fn mnemonic_to_key(mnemonic: Mnemonic) -> Option<SecretKey> {
    let path = HD_PATH.parse().unwrap();
    let password = None;
    get_secret_key_from_mnemonic(path, mnemonic, password)
}

fn get_secret_key_from_seed(
    seed_phrase_hd_path: BIP32Path,
    master_seed_phrase: &str,
    password: Option<&str>,
) -> Option<SecretKey> {
    let master_mnemonic = bip39::Mnemonic::parse(master_seed_phrase.to_lowercase()).ok()?;
    get_secret_key_from_mnemonic(seed_phrase_hd_path, master_mnemonic, password)
}

fn get_secret_key_from_mnemonic(
    seed_phrase_hd_path: BIP32Path,
    master_mnemonic: bip39::Mnemonic,
    password: Option<&str>,
) -> Option<SecretKey> {
    let master_seed = master_mnemonic.to_seed(password.unwrap_or_default());
    let derived_private_key = slipped10::derive_key_from_path(
        &master_seed,
        slipped10::Curve::Ed25519,
        &seed_phrase_hd_path,
    )
    .ok()?;

    let signing_key = ed25519_dalek::SigningKey::from_bytes(&derived_private_key.key);
    let secret_key = ED25519SecretKey(signing_key.to_keypair_bytes());

    Some(SecretKey::ED25519(secret_key))
}

#[component]
fn LoginForm(set_modal_state: WriteSignal<ModalState>, show_back_button: bool) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let (private_key, set_private_key) = signal("".to_string());
    let (is_valid, set_is_valid) = signal(None);
    let (error, set_error) = signal::<Option<String>>(None);
    let (is_hovered, set_is_hovered) = signal(false);
    let (available_accounts, set_available_accounts) = signal::<Vec<(AccountId, Network)>>(vec![]);
    let (selected_account, set_selected_account) = signal::<Option<(AccountId, Network)>>(None);

    let check_private_key = move |key: String| {
        set_error.set(None);
        if key.is_empty() {
            set_is_valid.set(None);
            return;
        }

        let secret_key = if let (Ok(secret_key), _) | (_, Some(secret_key)) =
            (key.parse::<SecretKey>(), seed_phrase_to_key(&key))
        {
            secret_key
        } else {
            set_error.set(Some("Invalid seed phrase".to_string()));
            set_is_valid.set(None);
            return;
        };
        let public_key = secret_key.public_key();

        spawn_local(async move {
            let mut all_accounts = vec![];

            // First, try mainnet. If no accounts are found, try testnet.
            // So if someone creates a testnet account with someone's mainnet public key,
            // only the mainnet account will be found, avoiding potential scams or confusion.
            for (network, api_url) in [
                (Network::Mainnet, "https://api.fastnear.com"),
                (Network::Testnet, "https://test.api.fastnear.com"),
            ] {
                if let Ok(response) =
                    reqwest::get(format!("{api_url}/v0/public_key/{public_key}")).await
                {
                    if let Ok(data) = response.json::<serde_json::Value>().await {
                        if let Some(account_ids) =
                            data.get("account_ids").and_then(|ids| ids.as_array())
                        {
                            let accounts: Vec<(AccountId, Network)> = account_ids
                                .iter()
                                .filter_map(|id| {
                                    id.as_str()
                                        .and_then(|s| s.parse::<AccountId>().ok())
                                        .map(|id| (id, network))
                                })
                                .filter(|(id, _)| {
                                    !accounts_context
                                        .accounts
                                        .get_untracked()
                                        .accounts
                                        .iter()
                                        .any(|a| a.account_id == *id)
                                })
                                .collect();
                            all_accounts.extend(accounts);
                        }
                    }
                }
                if !all_accounts.is_empty() {
                    // Don't try other networks if we found an account.
                    break;
                }
            }

            if all_accounts.is_empty() {
                set_available_accounts.set(all_accounts);
                set_error.set(Some("No accounts found for this key".to_string()));
                set_is_valid.set(None);
            } else {
                set_available_accounts.set(all_accounts);
                set_is_valid.set(Some(secret_key));
            }
        });
    };

    let import_account = move || {
        if let Some((account_id, network)) = selected_account.get() {
            let mut accounts = accounts_context.accounts.get();
            let user_input = private_key.get();
            let (secret_key, seed_phrase) = if let Ok(secret_key) = user_input.parse::<SecretKey>()
            {
                (secret_key, None)
            } else if let Some(secret_key) = seed_phrase_to_key(&user_input) {
                (secret_key, Some(user_input))
            } else {
                set_error.set(Some("Invalid seed phrase".to_string()));
                set_is_valid.set(None);
                return;
            };
            add_security_log(
                format!("Account imported with private key {secret_key}"),
                account_id.clone(),
            );
            accounts.accounts.push(Account {
                account_id: account_id.clone(),
                secret_key,
                seed_phrase,
                network,
            });
            accounts.selected_account_id = Some(account_id);
            accounts_context.set_accounts.set(accounts);
            set_modal_state.set(ModalState::AccountList);
        }
    };

    view! {
        <div class="absolute inset-0 bg-neutral-950 lg:rounded-3xl">
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
                    view! { <div class="hidden"></div> }.into_any()
                }
            }} <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md shadow-2xl">
                    <h2 class="text-white text-2xl font-semibold mb-6">
                        Log in with Existing Account
                    </h2>
                    <div class="space-y-6">
                        <div>
                            <label class="block text-neutral-400 text-sm font-medium mb-2">
                                Seed Phrase
                            </label>
                            <div class="relative">
                                <input
                                    type="text"
                                    class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200"
                                    style=move || {
                                        if is_valid.get().is_some() {
                                            "border: 2px solid rgb(34 197 94)"
                                        } else {
                                            "border: 2px solid rgb(55 65 81)"
                                        }
                                    }
                                    prop:value=private_key
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev);
                                        set_private_key.set(value.clone());
                                        set_available_accounts.set(vec![]);
                                        set_selected_account.set(None);
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
                                            Enter your seed phrase or private key
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
                                            Select Account to Import
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
                                                            style=move || {
                                                                if selected_account.get()
                                                                    == Some((account_id.clone(), network))
                                                                {
                                                                    "background-color: rgb(38 38 38); border-color: rgb(59 130 246);"
                                                                } else {
                                                                    "background-color: rgb(23 23 23 / 0.5);"
                                                                }
                                                            }
                                                            on:click=move |_| {
                                                                set_selected_account
                                                                    .set(Some((account_id2.clone(), network)))
                                                            }
                                                        >
                                                            <div class="text-white font-medium transition-colors duration-200">
                                                                {account_id_str}
                                                            </div>
                                                            {move || {
                                                                if network == Network::Testnet {
                                                                    view! {
                                                                        <p class="text-yellow-500 text-sm mt-1 font-medium">
                                                                            This is a <b>testnet</b>
                                                                            account. Tokens sent to this account are not real and hold no value
                                                                        </p>
                                                                    }
                                                                        .into_any()
                                                                } else {
                                                                    ().into_any()
                                                                }
                                                            }}
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
                                    if is_valid.get().is_some() && selected_account.get().is_some()
                                    {
                                        "background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); cursor: pointer;"
                                    } else {
                                        "background: rgb(55 65 81); cursor: not-allowed;"
                                    }
                                }
                                disabled=move || {
                                    is_valid.get().is_none() || selected_account.get().is_none()
                                }
                                on:click=move |_| import_account()
                                on:mouseenter=move |_| set_is_hovered.set(true)
                                on:mouseleave=move |_| set_is_hovered.set(false)
                            >
                                <div
                                    class="absolute inset-0 transition-opacity duration-200"
                                    style=move || {
                                        if is_valid.get().is_some()
                                            && selected_account.get().is_some() && is_hovered.get()
                                        {
                                            "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 1"
                                        } else {
                                            "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 0"
                                        }
                                    }
                                ></div>
                                <span class="relative">Import Account</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
fn AccountCreationForm(
    set_modal_state: WriteSignal<ModalState>,
    show_back_button: bool,
    set_is_expanded: WriteSignal<bool>,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let (account_name, set_account_name) = signal("".to_string());
    let (is_valid, set_is_valid) = signal(None);
    let (is_loading, set_is_loading) = signal(false);
    let (is_creating, set_is_creating) = signal(false);
    let (error, set_error) = signal::<Option<String>>(None);
    let (is_hovered, set_is_hovered) = signal(false);
    let (network, set_network) = signal(Network::Mainnet);
    let (suffix_clicks, set_suffix_clicks) = signal(0);

    let check_account = move |name: String| {
        set_error.set(None);
        if name.is_empty() {
            set_is_valid.set(None);
            return;
        }
        set_is_loading.set(true);

        if name.contains('.') {
            set_error.set(Some("Subaccounts are not supported".to_string()));
            set_is_valid.set(None);
            set_is_loading.set(false);
            return;
        }

        let full_name = match network.get() {
            Network::Mainnet => format!("{name}.near"),
            Network::Testnet => format!("{name}.testnet"),
        };
        let Some(account_id) = full_name.parse::<AccountId>().ok() else {
            set_error.set(Some("Invalid account name format".to_string()));
            set_is_valid.set(None);
            set_is_loading.set(false);
            return;
        };

        let rpc_client = network.get().default_rpc_client();
        spawn_local(async move {
            let account_exists = rpc_client
                .view_account(
                    account_id.clone(),
                    QueryFinality::Finality(Finality::DoomSlug),
                )
                .await
                .is_ok();

            if name == account_name.get_untracked() {
                if account_exists {
                    set_error.set(Some("Account already exists".to_string()));
                    set_is_valid.set(None);
                } else {
                    set_is_valid.set(Some(account_id));
                }
                set_is_loading.set(false);
            }
        });
    };

    let handle_suffix_click = move |_| {
        let new_clicks = suffix_clicks.get() + 1;
        set_suffix_clicks.set(new_clicks);

        const CLICKS_TO_SWITCH_NETWORK: usize = 5;
        if new_clicks == CLICKS_TO_SWITCH_NETWORK {
            set_network.set(match network.get() {
                Network::Mainnet => Network::Testnet,
                Network::Testnet => Network::Mainnet,
            });
            set_suffix_clicks.set(0);
            // Reset validation since we're switching networks
            check_account(account_name.get_untracked());
        }
    };

    let do_create_account = move || {
        let Some(account_id) = is_valid.get() else {
            return;
        };

        let mnemonic = bip39::Mnemonic::generate(12).unwrap();
        let secret_key = mnemonic_to_key(mnemonic.clone()).unwrap();
        let public_key = secret_key.public_key();

        let rpc_client = network.get_untracked().default_rpc_client();
        let current_network = network.get_untracked();
        let account_creation_service_addr = match current_network {
            Network::Mainnet => dotenvy_macro::dotenv!("MAINNET_ACCOUNT_CREATION_SERVICE_ADDR"),
            Network::Testnet => dotenvy_macro::dotenv!("TESTNET_ACCOUNT_CREATION_SERVICE_ADDR"),
        };

        spawn_local(async move {
            set_is_creating.set(true);
            set_error.set(None);

            let client = reqwest::Client::new();
            let response = client
                .post(format!("{account_creation_service_addr}/create"))
                .json(&serde_json::json!({
                    "account_id": account_id.to_string(),
                    "public_key": public_key.to_string(),
                }))
                .send()
                .await;

            match response {
                Ok(resp) => {
                    if let Ok(data) = resp.json::<serde_json::Value>().await {
                        let success = data
                            .get("success")
                            .and_then(|s| s.as_bool())
                            .unwrap_or(false);
                        if success {
                            // Verify account creation by checking access key with retries
                            let mut attempts = 0;

                            const MAX_ATTEMPTS: usize = 30;
                            while attempts < MAX_ATTEMPTS {
                                if attempts > 0 {
                                    Delay::new(Duration::from_secs(1)).await;
                                }

                                match rpc_client
                                    .get_access_key(
                                        account_id.clone(),
                                        public_key.clone(),
                                        QueryFinality::Finality(Finality::Final),
                                    )
                                    .await
                                {
                                    Ok(AccessKeyView {
                                        permission: AccessKeyPermissionView::FullAccess,
                                        ..
                                    }) => {
                                        let mut accounts =
                                            accounts_context.accounts.get_untracked();
                                        add_security_log(
                                            format!(
                                                "Account created with private key {secret_key}"
                                            ),
                                            account_id.clone(),
                                        );
                                        accounts.accounts.push(Account {
                                            account_id: account_id.clone(),
                                            seed_phrase: Some(mnemonic.to_string()),
                                            secret_key: secret_key.clone(),
                                            network: current_network,
                                        });
                                        accounts.selected_account_id = Some(account_id);
                                        accounts_context.set_accounts.set(accounts);
                                        set_modal_state.set(ModalState::AccountList);
                                        set_is_expanded(false);
                                        break;
                                    }
                                    _ => {
                                        attempts += 1;
                                        if attempts >= MAX_ATTEMPTS {
                                            log::error!("Failed to create account: Couldn't verify by getting access key after 3 attempts");
                                            set_error
                                                .set(Some("Failed to create account".to_string()));
                                        }
                                    }
                                }
                            }
                        } else {
                            log::error!("Failed to create account: Server returned error");
                            set_error.set(Some("Failed to create account".to_string()));
                        }
                    } else {
                        log::error!("Failed to create account: Couldn't parse response");
                        set_error.set(Some("Failed to create account".to_string()));
                    }
                }
                Err(e) => {
                    log::error!("Failed to create account: {e}");
                    set_error.set(Some(format!("Failed to create account: {e}")));
                }
            }
            set_is_creating.set(false);
        });
    };

    let handle_keydown = move |ev: KeyboardEvent| {
        if ev.key() == "Enter"
            && is_valid.get().is_some()
            && !is_creating.get()
            && !is_loading.get()
        {
            do_create_account();
        }
    };

    let input_ref = NodeRef::<leptos::html::Input>::new();

    Effect::new(move || {
        if let Some(input) = input_ref.get() {
            let _ = input.focus();
        }
    });

    view! {
        <div class="absolute inset-0 bg-neutral-950 lg:rounded-3xl">
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
                    view! { <div class="hidden"></div> }.into_any()
                }
            }} <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md shadow-2xl">
                    <h2 class="text-white text-2xl font-semibold mb-6">Create New Account</h2>
                    <div class="space-y-6">
                        <div>
                            <label class="block text-neutral-400 text-sm font-medium mb-2">
                                Account Name
                            </label>
                            <div class="relative">
                                <input
                                    node_ref=input_ref
                                    type="text"
                                    class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200"
                                    style=move || {
                                        if is_valid.get().is_some() {
                                            "border: 2px solid rgb(34 197 94)"
                                        } else {
                                            "border: 2px solid rgb(55 65 81)"
                                        }
                                    }
                                    prop:value=account_name
                                    on:input=move |ev| {
                                        let value = event_target_value(&ev)
                                            .to_lowercase()
                                            .chars()
                                            .filter(|c| {
                                                c.is_ascii_lowercase() || c.is_ascii_digit() || *c == '_'
                                                    || *c == '-' || *c == '.'
                                            })
                                            .collect::<String>();
                                        if value.ends_with(".near") {
                                            set_network.set(Network::Mainnet);
                                            let trimmed = value
                                                .strip_suffix(".near")
                                                .unwrap()
                                                .to_string();
                                            set_account_name.set(trimmed.clone());
                                            check_account(trimmed);
                                        } else if value.ends_with(".testnet") {
                                            set_network.set(Network::Testnet);
                                            let trimmed = value
                                                .strip_suffix(".testnet")
                                                .unwrap()
                                                .to_string();
                                            set_account_name.set(trimmed.clone());
                                            check_account(trimmed);
                                        } else {
                                            set_account_name.set(value.clone());
                                            check_account(value);
                                        }
                                    }
                                    on:keydown=handle_keydown
                                    disabled=move || is_creating.get()
                                />
                                <button
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium cursor-pointer"
                                    on:click=handle_suffix_click
                                >
                                    {move || match network.get() {
                                        Network::Mainnet => ".near",
                                        Network::Testnet => ".testnet",
                                    }}
                                </button>
                            </div>
                            {move || {
                                if let Some(err) = error.get() {
                                    view! {
                                        <p class="text-red-500 text-sm mt-2 font-medium">{err}</p>
                                    }
                                        .into_any()
                                } else if is_loading.get() {
                                    view! {
                                        <p class="text-neutral-400 text-sm mt-2 font-medium">
                                            Checking availability...
                                        </p>
                                    }
                                        .into_any()
                                } else if is_valid.get().is_some() {
                                    view! {
                                        <p class="text-green-500 text-sm mt-2 font-medium">
                                            Account name is available!
                                        </p>
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <p class="text-neutral-400 text-sm mt-2 font-medium">
                                            Enter a valid account name
                                        </p>
                                    }
                                        .into_any()
                                }
                            }}
                            {move || {
                                if network.get() == Network::Testnet {
                                    view! {
                                        <p class="text-yellow-500 text-sm mt-2 font-medium">
                                            This is a <b>testnet</b>
                                            account. Tokens sent to this account are not real and hold no value
                                        </p>
                                    }
                                        .into_any()
                                } else {
                                    ().into_any()
                                }
                            }}
                        </div>
                        <div class="flex gap-2">
                            <button
                                class="flex-1 text-white rounded-xl px-4 py-3 transition-all cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden"
                                style=move || {
                                    if is_valid.get().is_some() {
                                        "background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);"
                                    } else {
                                        "background: rgb(55 65 81); cursor: not-allowed;"
                                    }
                                }
                                disabled=move || {
                                    is_valid.get().is_none() || is_creating.get()
                                        || is_loading.get()
                                }
                                on:click=move |_| do_create_account()
                                on:mouseenter=move |_| set_is_hovered.set(true)
                                on:mouseleave=move |_| set_is_hovered.set(false)
                            >
                                <div
                                    class="absolute inset-0 transition-opacity duration-200"
                                    style=move || {
                                        if is_valid.get().is_some() && !is_loading.get()
                                            && is_hovered.get()
                                        {
                                            "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 1"
                                        } else {
                                            "background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); opacity: 0"
                                        }
                                    }
                                ></div>
                                <span class="relative flex items-center justify-center gap-2">
                                    {move || {
                                        if is_creating.get() || is_loading.get() {
                                            view! {
                                                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}Create Account
                                </span>
                            </button>
                        </div>
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-neutral-800"></div>
                            </div>
                            <div class="relative flex justify-center text-sm">
                                <span class="px-2 bg-neutral-950 text-neutral-400">or</span>
                            </div>
                        </div>
                        <button
                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden border border-neutral-800 hover:border-neutral-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            on:click=move |_| set_modal_state.set(ModalState::LoggingIn)
                            disabled=move || is_creating.get()
                        >
                            <span class="relative">Log in with Existing Account</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn AccountSelector(
    is_expanded: ReadSignal<bool>,
    set_is_expanded: WriteSignal<bool>,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let AccountSelectorSwipeContext {
        progress,
        state,
        set_state,
        ..
    } = expect_context::<AccountSelectorSwipeContext>();
    let (modal_state, set_modal_state) = signal(ModalState::AccountList);
    let selected_account = move || {
        accounts_context
            .accounts
            .get()
            .selected_account_id
            .map(|account_id| account_id.to_string())
            .unwrap_or_else(|| "No account selected".to_string())
    };

    // Show creation form immediately if there are no accounts
    Effect::new(move |_| {
        if accounts_context.accounts.get().accounts.is_empty() {
            set_is_expanded(true);
            set_modal_state.set(ModalState::Creating);
        }
    });
    Effect::new(move |_| {
        if state() {
            set_state(false);
            set_is_expanded(true);
            set_modal_state.set(ModalState::AccountList);
        }
    });

    let switch_account = move |account_id: AccountId| {
        let mut accounts = accounts_context.accounts.get();
        accounts.selected_account_id = Some(account_id);
        accounts_context.set_accounts.set(accounts);
        set_is_expanded(false);
    };

    view! {
        <div
            class="absolute inset-0 z-50 transition-opacity duration-150"
            style=move || {
                if is_expanded.get() {
                    "opacity: 1; pointer-events: auto".to_string()
                } else {
                    format!("opacity: {}; pointer-events: none", progress.get())
                }
            }
        >
            {move || match modal_state.get() {
                ModalState::LoggingIn => {
                    view! {
                        <LoginForm
                            set_modal_state
                            show_back_button=!accounts_context.accounts.get().accounts.is_empty()
                        />
                    }
                        .into_any()
                }
                ModalState::Creating => {
                    view! {
                        <AccountCreationForm
                            set_modal_state
                            show_back_button=!accounts_context.accounts.get().accounts.is_empty()
                            set_is_expanded=set_is_expanded
                        />
                    }
                        .into_any()
                }
                ModalState::AccountList => {
                    view! {
                        <div>
                            <div
                                class="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] lg:rounded-3xl"
                                on:click=move |_| set_is_expanded(false)
                            />
                            <div class="absolute left-0 top-0 bottom-0 w-[100px] bg-neutral-950 lg:rounded-l-3xl">
                                <div class="p-2 h-full bg-neutral-950 flex flex-col lg:rounded-l-3xl">
                                    <div class="flex-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        <button
                                            class="w-full h-16 aspect-square rounded-lg transition-colors flex flex-col items-center justify-center gap-1 text-neutral-400 group"
                                            on:click=move |_| set_is_expanded(false)
                                        >
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-neutral-300">
                                                <div class="group-hover:text-black">
                                                    <Icon icon=icondata::LuArrowLeft width="20px" height="20" />
                                                </div>
                                            </div>
                                        </button>
                                        {move || {
                                            accounts_context
                                                .accounts
                                                .get()
                                                .accounts
                                                .iter()
                                                .map(|account| {
                                                    let account_network = account.network;
                                                    let account_id = account.account_id.clone();
                                                    let first_char = account_id
                                                        .as_str()
                                                        .chars()
                                                        .next()
                                                        .unwrap()
                                                        .to_uppercase()
                                                        .collect::<String>();
                                                    let account_id_for_class = account_id.clone();
                                                    let account_id_for_color = account_id.clone();
                                                    let (is_hovered, set_is_hovered) = signal(false);
                                                    let account_id_str = account_id.to_string();
                                                    view! {
                                                        <button
                                                            class="w-full h-24 aspect-square rounded-lg transition-colors flex flex-col items-center justify-center gap-1 p-1 group"
                                                            style=move || {
                                                                if selected_account() == account_id_for_class {
                                                                    "background-color: rgb(38 38 38)"
                                                                } else {
                                                                    ""
                                                                }
                                                            }
                                                            on:click=move |_| switch_account(account_id.clone())
                                                            on:mouseenter=move |_| set_is_hovered.set(true)
                                                            on:mouseleave=move |_| set_is_hovered.set(false)
                                                        >
                                                            <div class="relative">
                                                                <div
                                                                    class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium transition-all duration-200 group-hover:text-black overflow-hidden"
                                                                    style=move || {
                                                                        let brightness = if is_hovered.get() { 2.5 } else { 1.0 };
                                                                        let background = get_account_gradient(
                                                                            account_id_for_color.as_ref(),
                                                                            brightness,
                                                                        );
                                                                        format!("background: {background}")
                                                                    }
                                                                >
                                                                    <div class="relative h-full w-full flex items-center justify-center">
                                                                        {first_char}
                                                                        {move || {
                                                                            if matches!(account_network, Network::Testnet) {
                                                                                view! {
                                                                                    <div class="absolute bottom-0 left-0 right-0 h-[25%] bg-yellow-500 text-black text-[8px] font-bold flex items-center justify-center">
                                                                                        TEST
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
                                                            <div class="text-xs text-neutral-400 text-center wrap-anywhere max-w-[80px]">
                                                                {move || {
                                                                    if account_id_str.len() > 24 {
                                                                        let first = &account_id_str[..8];
                                                                        let last = &account_id_str[account_id_str.len() - 8..];
                                                                        format!("{first}...{last}")
                                                                    } else {
                                                                        account_id_str.clone()
                                                                    }
                                                                }}
                                                            </div>
                                                        </button>
                                                    }
                                                })
                                                .collect::<Vec<_>>()
                                        }}
                                    </div>

                                    <div class="flex gap-2 flex-col bg-neutral-900 mt-2 lg:rounded-bl-3xl transition-all duration-200">
                                        <button
                                            class="w-full aspect-square rounded-lg transition-colors flex flex-col items-center justify-center gap-1 p-1 text-green-500 group hover:bg-green-500/10"
                                            on:click=move |_| set_modal_state.set(ModalState::Creating)
                                        >
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20 group-hover:bg-neutral-300">
                                                <div class="group-hover:text-black">
                                                    <Icon icon=icondata::LuPlus width="16" height="16" />
                                                </div>
                                            </div>
                                            <div class="text-xs text-center">Add</div>
                                        </button>

                                        <A
                                            href="/settings/security"
                                            attr:class="w-full aspect-square rounded-lg transition-colors flex flex-col items-center justify-center gap-1 p-1 text-neutral-400 group hover:bg-neutral-500/10"
                                            on:click=move |_| set_is_expanded(false)
                                        >
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-500/20 group-hover:bg-neutral-300">
                                                <div class="group-hover:text-black">
                                                    <Icon icon=icondata::LuSettings width="16" height="16" />
                                                </div>
                                            </div>
                                            <div class="text-xs text-center">Settings</div>
                                        </A>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
