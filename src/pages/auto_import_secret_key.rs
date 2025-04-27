use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::hooks::{use_location, use_navigate};
use near_min_api::types::{near_crypto::SecretKey, AccountId};

use crate::contexts::{
    accounts_context::{Account, AccountsContext},
    network_context::Network,
};

#[component]
pub fn AutoImportSecretKey() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let navigate = use_navigate();

    // Get account_id and secret_key from URL hash
    let navigate_clone = navigate.clone();
    let import_info = Memo::new(move |_| {
        let hash = use_location().hash.get();
        let hash = hash.trim_start_matches('#');
        let parts: Vec<&str> = hash.split('/').collect();
        if parts.len() != 2 {
            log::error!("Invalid URL format: parts.len() != 2");
            navigate_clone("/", Default::default());
            return None;
        }

        let account_id = match parts[0].parse::<AccountId>() {
            Ok(id) => id,
            Err(_) => {
                log::error!("Invalid account ID: {}", parts[0]);
                navigate_clone("/", Default::default());
                return None;
            }
        };

        let secret_key = match parts[1].parse::<SecretKey>() {
            Ok(key) => key,
            Err(_) => {
                log::error!("Invalid secret key: {}", parts[1]);
                navigate_clone("/", Default::default());
                return None;
            }
        };

        Some((account_id, secret_key))
    });

    // Check if account already exists
    let account_exists = Memo::new(move |_| {
        let Some((account_id, _)) = import_info.get() else {
            return false;
        };
        accounts_context
            .accounts
            .get()
            .accounts
            .iter()
            .any(|a| a.account_id == *account_id)
    });

    view! {
        <div class="flex flex-col items-center justify-center min-h-[calc(80vh-100px)] p-4">
            {move || {
                let navigate = navigate.clone();
                if account_exists.get() {
                    let account_id = import_info
                        .get()
                        .map(|(id, _)| id.to_string())
                        .unwrap_or_default();
                    view! {
                        <div class="flex flex-col items-center gap-6 max-w-md w-full">
                            <div class="bg-red-500/10 p-6 rounded-xl border border-red-500/20 w-full">
                                <div class="flex items-center gap-2 text-red-400">
                                    <Icon icon=icondata::LuAlertTriangle width="20" height="20" />
                                    <p class="text-white font-medium">Account Already Imported</p>
                                </div>
                                <p class="text-gray-400 text-sm mt-2">
                                    The account {account_id}is already in your wallet.
                                </p>
                                <button
                                    class="mt-4 w-full text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer"
                                    on:click=move |_| navigate("/", Default::default())
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    }
                        .into_any()
                } else {
                    let navigate_clone = navigate.clone();
                    view! {
                        <div class="flex flex-col items-center gap-6 max-w-md w-full">
                            <h2 class="text-2xl font-bold text-white mb-2 wrap-anywhere">
                                Import Account
                            </h2>
                            <div class="flex flex-col gap-4 w-full">
                                <div class="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 shadow-lg">
                                    <div class="flex items-center gap-3 pb-4 mb-4 border-b border-neutral-700/50">
                                        <div class="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center">
                                            <span class="text-neutral-300 text-lg">{"🔑"}</span>
                                        </div>
                                        <div>
                                            <p class="text-neutral-400 text-sm">Account Name</p>
                                            <p class="text-white font-medium wrap-anywhere">
                                                {move || {
                                                    if let Some((account_id, _)) = import_info() {
                                                        account_id.to_string()
                                                    } else {
                                                        "<unknown>".to_string()
                                                    }
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button
                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden cursor-pointer group"
                                            style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)"
                                            on:click=move |_| {
                                                let mut accounts = accounts_context.accounts.get();
                                                let Some((account_id, secret_key)) = import_info.get() else {
                                                    return;
                                                };

                                                accounts.accounts.push(Account {
                                                    account_id: account_id.clone(),
                                                    secret_key: secret_key.clone(),
                                                    seed_phrase: None,
                                                    // Need to do some changes in CLI to pass network in location.hash
                                                    network: if account_id.as_str().ends_with(".testnet") {
                                                        Network::Testnet
                                                    } else {
                                                        Network::Mainnet
                                                    },
                                                });
                                                accounts.selected_account_id = Some(account_id.clone());
                                                accounts_context.set_accounts.set(accounts);
                                                navigate("/", Default::default());
                                            }
                                        >
                                            <div
                                                class="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                                style="background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)"
                                            ></div>
                                            <span class="relative">Import</span>
                                        </button>
                                        <button
                                            class="flex-1 text-white rounded-xl px-4 py-3 transition-all duration-200 font-medium shadow-lg relative overflow-hidden border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 cursor-pointer"
                                            on:click=move |_| navigate_clone("/", Default::default())
                                        >
                                            Cancel
                                        </button>
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
