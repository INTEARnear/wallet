use std::collections::HashMap;
use std::hash::{DefaultHasher, Hash, Hasher};
use std::time::Duration;

use bip39::Mnemonic;
use chrono::Utc;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::components::A;
use leptos_use::{use_interval_fn_with_options, UseIntervalFnOptions};
use near_min_api::types::Finality;
use near_min_api::types::{
    near_crypto::{ED25519SecretKey, SecretKey},
    AccountId,
};
use near_min_api::{Error, QueryFinality};
use slipped10::BIP32Path;

use crate::components::account_creation_form::AccountCreationForm;
use crate::components::login_form::LoginForm;
use crate::contexts::accounts_context::Account;
use crate::contexts::network_context::Network;
use crate::contexts::security_log_context::add_security_log;
use crate::contexts::{
    account_selector_swipe_context::AccountSelectorSwipeContext, accounts_context::AccountsContext,
};
use crate::utils::is_debug_enabled;

#[derive(Clone, PartialEq)]
pub enum ModalState {
    AccountList,
    Creating,
    LoggingIn,
    LoggedOut(Vec<AccountId>),
}

#[derive(Clone, Copy, PartialEq)]
pub enum LoginMethod {
    Selection,
    SeedPhrase,
    EthereumWallet,
    SolanaWallet,
    Ledger,
}

pub const HD_PATH: &str = "m/44'/397'/0'";

pub fn seed_phrase_to_key(seed_phrase: &str) -> Option<SecretKey> {
    let path = HD_PATH.parse().unwrap();
    let password = None;
    get_secret_key_from_seed(path, seed_phrase, password)
}

pub fn mnemonic_to_key(mnemonic: Mnemonic) -> Option<SecretKey> {
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

#[allow(clippy::float_arithmetic)] // Not important for UI colors
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
    let (show_security_alert, set_show_security_alert) = signal(false);

    let check_access_keys = move || {
        if is_debug_enabled() {
            return;
        }
        let accounts = accounts_context.accounts.get_untracked();

        spawn_local(async move {
            let mut logged_out_accounts = Vec::new();

            // Group accounts by network to leverage Intear RPC batching
            let mut grouped: HashMap<Network, Vec<&Account>> = HashMap::new();

            for account in accounts.accounts.iter() {
                grouped.entry(account.network).or_default().push(account);
            }

            for (network, accs) in grouped {
                // Don't remove accounts if RPC has problems
                let rpc_client = network.default_rpc_client();
                let Ok(network_info) = rpc_client.status().await else {
                    continue;
                };
                if network_info.sync_info.syncing
                    || network_info.sync_info.latest_block_time
                        < Utc::now() - Duration::from_secs(5)
                {
                    continue;
                }

                let requests: Vec<_> = accs
                    .iter()
                    .map(|account| {
                        (
                            account.account_id.clone(),
                            account.secret_key.public_key(),
                            QueryFinality::Finality(Finality::None),
                        )
                    })
                    .collect();

                let Ok(results) = rpc_client.batch_get_access_key(requests).await else {
                    continue;
                };

                for (account, result) in accs.into_iter().zip(results.into_iter()) {
                    let public_key = account.secret_key.public_key();
                    if let Err(Error::OtherQueryError(err)) = result {
                        if err == format!("access key {public_key} does not exist while viewing") {
                            logged_out_accounts.push(account.clone());
                        }
                    }
                }
            }

            if !logged_out_accounts.is_empty() {
                let logged_out_account_ids = logged_out_accounts
                    .iter()
                    .map(|a| a.account_id.clone())
                    .collect::<Vec<_>>();
                accounts_context.set_accounts.update(|accounts| {
                    accounts
                        .accounts
                        .retain(|a| !logged_out_account_ids.contains(&a.account_id));
                    if let Some(selected_id) = accounts.selected_account_id.as_ref() {
                        if logged_out_account_ids.contains(selected_id) {
                            accounts.selected_account_id = None;
                        }
                    }
                });

                for account in logged_out_accounts.iter() {
                    add_security_log(
                        format!(
                            "Account logged out due to remote access key removal. Old access key: {}",
                            account.secret_key
                        ),
                        account.account_id.clone(),
                        accounts_context,
                    );
                }

                set_modal_state.set(ModalState::LoggedOut(logged_out_account_ids));
                set_is_expanded(true);
            }
        });
    };

    let _ = use_interval_fn_with_options(
        check_access_keys,
        60000,
        UseIntervalFnOptions {
            immediate: true,
            immediate_callback: true,
        },
    );

    // Check acccess key when accounts change
    Effect::new(move |_| {
        if accounts_context
            .accounts
            .get()
            .selected_account_id
            .is_some()
        {
            check_access_keys();
        }
    });

    // Show creation form immediately if there are no accounts
    Effect::new(move |_| {
        if accounts_context.accounts.get().accounts.is_empty()
            && !accounts_context.is_encrypted.get()
        {
            set_is_expanded(true);
            set_modal_state.set(ModalState::Creating);
        }
    });
    // Open selector when swipe is complete
    Effect::new(move |_| {
        if state() {
            set_state(false);
            set_is_expanded(true);
            set_modal_state.set(ModalState::AccountList);
        }
    });
    // Close selector when accounts change
    Effect::new(move |_| {
        if accounts_context
            .accounts
            .get()
            .selected_account_id
            .is_some()
        {
            set_is_expanded(false);
        }
    });

    let switch_account = move |account_id: AccountId| {
        accounts_context.set_accounts.update(|accounts| {
            accounts.selected_account_id = Some(account_id);
        });
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
                            show_back_button=!accounts_context
                                .accounts
                                .get_untracked()
                                .accounts
                                .is_empty()
                        />
                    }
                        .into_any()
                }
                ModalState::Creating => {
                    view! {
                        <AccountCreationForm
                            set_modal_state
                            show_back_button=!accounts_context
                                .accounts
                                .get_untracked()
                                .accounts
                                .is_empty()
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
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-neutral-300 mr-7 mb-1">
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
                                                            class="w-full h-28 aspect-square rounded-lg transition-colors flex flex-col items-center justify-center gap-1 p-1 group"
                                                            style=move || {
                                                                if accounts_context.accounts.get().selected_account_id
                                                                    == Some(account_id_for_class.clone())
                                                                {
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
                                                                        format!("{first}…{last}")
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
                                            attr:class="w-full aspect-square rounded-lg lg:rounded-bl-3xl transition-colors flex flex-col items-center justify-center gap-1 p-1 text-neutral-400 group hover:bg-neutral-500/10"
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
                ModalState::LoggedOut(accounts) => {
                    view! {
                        <div>
                            <div
                                class="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] lg:rounded-3xl"
                                on:click=move |_| set_is_expanded(false)
                            />
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md">
                                    <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Icon
                                            icon=icondata::LuShieldOff
                                            width="32"
                                            height="32"
                                            attr:class="text-red-400"
                                        />
                                    </div>
                                    <h2 class="text-white text-2xl font-semibold mb-4 text-center">
                                        "Logged Out from Different Device"
                                    </h2>
                                    <p class="text-neutral-400 mb-6 text-center">
                                        "Your access to the following accounts was terminated using \"Terminate all other sessions\" button on another device:"
                                    </p>
                                    <div class="mb-6 space-y-2">
                                        {accounts
                                            .iter()
                                            .map(|account_id| {
                                                view! {
                                                    <div class="text-white text-center font-medium wrap-anywhere">
                                                        {account_id.to_string()}
                                                    </div>
                                                }
                                            })
                                            .collect::<Vec<_>>()}
                                    </div>
                                    <div class="space-y-3">
                                        <button
                                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden bg-red-500/20 hover:bg-red-500/30 cursor-pointer"
                                            on:click=move |_| set_show_security_alert.set(true)
                                        >
                                            "I didn't do this"
                                        </button>
                                        <button
                                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer"
                                            style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);"
                                            on:click=move |_| set_modal_state.set(ModalState::LoggingIn)
                                        >
                                            "Import Account"
                                        </button>
                                        <button
                                            class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                                            on:click=move |_| set_is_expanded(false)
                                        >
                                            "OK"
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Show when=move || show_security_alert.get()>
                                <div class="absolute inset-0 bg-neutral-950/60 backdrop-blur-[2px] lg:rounded-3xl z-10">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md border border-red-500/20">
                                            <h3 class="text-xl font-semibold mb-4 text-white">
                                                "Account Security Alert"
                                            </h3>
                                            <p class="text-neutral-400 mb-6">
                                                "If it wasn't you, your account most likely was compromised. Here's what you can do:"
                                            </p>
                                            <ul class="list-disc list-inside text-neutral-400 mb-6 space-y-2">
                                                <li>
                                                    "Move on and create a new account with a fresh seed phrase (if your old account didn't have a lot of money)"
                                                </li>
                                                <li>
                                                    "Try to recover it with your Google / Ethereum / Solana wallet if you connected it to your account"
                                                </li>
                                                <li>
                                                    <a
                                                        href="https://t.me/intearchat"
                                                        target="_blank"
                                                        class="text-blue-500 hover:text-blue-600"
                                                    >
                                                        "Contact support for assistance"
                                                    </a>
                                                    ". We are not able to recover your account, but we can give you the exact time when it happened, so you can try to remember what you did"
                                                </li>
                                            </ul>
                                            <button
                                                class="w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden bg-neutral-800 hover:bg-neutral-700"
                                                on:click=move |_| set_show_security_alert.set(false)
                                            >
                                                "Close"
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Show>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
