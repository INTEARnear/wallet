use std::hash::{DefaultHasher, Hash, Hasher};

use bip39::Mnemonic;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use near_min_api::types::{
    near_crypto::{ED25519SecretKey, SecretKey},
    AccountId,
};
use slipped10::BIP32Path;

use crate::components::account_creation_form::AccountCreationForm;
use crate::components::login_form::LoginForm;
use crate::contexts::network_context::Network;
use crate::contexts::{
    account_selector_swipe_context::AccountSelectorSwipeContext, accounts_context::AccountsContext,
};

#[derive(Clone, Copy, PartialEq)]
pub enum ModalState {
    AccountList,
    Creating,
    LoggingIn,
}

#[derive(Clone, Copy, PartialEq)]
pub enum LoginMethod {
    Selection,
    SeedPhrase,
    EthereumWallet,
    SolanaWallet,
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
        if accounts_context.accounts.get().accounts.is_empty()
            && !accounts_context.is_encrypted.get()
        {
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
            }}
        </div>
    }
}
