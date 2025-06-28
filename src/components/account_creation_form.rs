use std::future::Future;
use std::pin::Pin;
use std::time::Duration;

use futures_channel::oneshot::Canceled;
use futures_timer::Delay;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use near_min_api::types::{
    AccessKey, AccessKeyPermission, Action, AddKeyAction, CreateAccountAction, FinalExecutionStatus,
};
use near_min_api::{
    types::{AccessKeyPermissionView, AccessKeyView, AccountId, Finality},
    QueryFinality,
};
use web_sys::KeyboardEvent;

use crate::components::account_selector::{mnemonic_to_key, ModalState};
use crate::contexts::accounts_context::{Account, AccountsContext};
use crate::contexts::network_context::Network;
use crate::contexts::security_log_context::add_security_log;
use crate::contexts::transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext};

#[derive(Clone, Debug)]
enum Parent {
    Mainnet,
    Testnet,
    SubAccount(AccountId),
}

struct AccountCreationDetails {
    subaccount_of: AccountId,
    account_to_sign_with: Option<Account>,
    network: Network,
}

impl Parent {
    fn into_details(
        self,
        accounts_context: &AccountsContext,
    ) -> Result<AccountCreationDetails, String> {
        match self {
            Parent::Mainnet => Ok(AccountCreationDetails {
                subaccount_of: "near".parse().unwrap(),
                account_to_sign_with: None,
                network: Network::Mainnet,
            }),
            Parent::Testnet => Ok(AccountCreationDetails {
                subaccount_of: "testnet".parse().unwrap(),
                account_to_sign_with: None,
                network: Network::Testnet,
            }),
            Parent::SubAccount(subaccount_of) => {
                if let Some(account) = accounts_context
                    .accounts
                    .get()
                    .accounts
                    .into_iter()
                    .find(|account| account.account_id == subaccount_of)
                {
                    Ok(AccountCreationDetails {
                        subaccount_of,
                        network: account.network,
                        account_to_sign_with: Some(account),
                    })
                } else {
                    Err(format!("Subaccount of {subaccount_of} not found"))
                }
            }
        }
    }
}

#[component]
pub fn AccountCreationForm(
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
    let (parent, set_parent) = signal(Parent::Mainnet);
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();

    let check_account = move |name: String| {
        set_error.set(None);
        if name.is_empty() {
            set_is_valid.set(None);
            return;
        }
        set_is_loading.set(true);

        let AccountCreationDetails {
            subaccount_of,
            network,
            ..
        } = match parent.get_untracked().into_details(&accounts_context) {
            Ok(details) => details,
            Err(e) => {
                set_error.set(Some(e));
                set_is_valid.set(None);
                set_is_loading.set(false);
                return;
            }
        };

        let full_name = format!("{name}.{subaccount_of}");
        let Some(account_id) = full_name.parse::<AccountId>().ok() else {
            set_error.set(Some("Invalid account name format".to_string()));
            set_is_valid.set(None);
            set_is_loading.set(false);
            return;
        };

        let rpc_client = network.default_rpc_client();
        spawn_local(async move {
            let account_exists = rpc_client
                .view_account(
                    account_id.clone(),
                    QueryFinality::Finality(Finality::DoomSlug),
                )
                .await
                .is_ok();

            if account_id == format!("{}.{subaccount_of}", account_name.get_untracked()) {
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

    let do_create_account = move || {
        let Some(account_id) = is_valid.get() else {
            return;
        };

        let mnemonic = bip39::Mnemonic::generate(12).unwrap();
        let secret_key = mnemonic_to_key(mnemonic.clone()).unwrap();
        let public_key = secret_key.public_key();

        let AccountCreationDetails {
            account_to_sign_with,
            network,
            ..
        } = match parent.get_untracked().into_details(&accounts_context) {
            Ok(details) => details,
            Err(e) => {
                log::error!("Couldn't extract data from parent: {e}");
                return;
            }
        };
        let rpc_client = network.default_rpc_client();

        spawn_local(async move {
            set_is_creating.set(true);
            set_error.set(None);

            let creation_future: Pin<Box<dyn Future<Output = Result<(), String>>>> =
                if let Some(account_to_sign_with) = account_to_sign_with {
                    let actions = vec![
                        Action::CreateAccount(CreateAccountAction {}),
                        Action::AddKey(Box::new(AddKeyAction {
                            public_key: public_key.clone(),
                            access_key: AccessKey {
                                nonce: 0,
                                permission: AccessKeyPermission::FullAccess,
                            },
                        })),
                    ];

                    let transaction_description = format!("Create account {account_id}");
                    let (tx_details_rx, tx) = EnqueuedTransaction::create(
                        transaction_description,
                        account_to_sign_with.account_id.clone(),
                        account_id.clone(),
                        actions,
                    );
                    add_transaction.update(|txs| {
                        txs.push(tx);
                    });
                    Box::pin(async move {
                        let tx_details = match tx_details_rx.await {
                            Ok(tx_details) => tx_details,
                            Err(Canceled) => {
                                return Err("Cancelled".to_string());
                            }
                        };
                        let tx_details = match tx_details {
                            Ok(tx_details) => tx_details,
                            Err(e) => {
                                return Err(format!("Failed to create account: {e}"));
                            }
                        };
                        let Some(outcome) = tx_details.final_execution_outcome else {
                            return Err("Transaction outcome not found".to_string());
                        };
                        match outcome.final_outcome.status {
                            FinalExecutionStatus::SuccessValue(_) => Ok(()),
                            _ => Err("Transaction failed".to_string()),
                        }
                    })
                } else {
                    let payload = serde_json::json!({
                        "account_id": account_id.to_string(),
                        "public_key": public_key.to_string(),
                    });
                    Box::pin(async move {
                        let client = reqwest::Client::new();
                        let account_creation_service_addr = match network {
                            Network::Mainnet => {
                                dotenvy_macro::dotenv!("MAINNET_ACCOUNT_CREATION_SERVICE_ADDR")
                            }
                            Network::Testnet => {
                                dotenvy_macro::dotenv!("TESTNET_ACCOUNT_CREATION_SERVICE_ADDR")
                            }
                        };
                        let response = client
                            .post(format!("{account_creation_service_addr}/create"))
                            .json(&payload)
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
                                        Ok(())
                                    } else {
                                        Err(format!(
                                            "Failed to create account: Server returned error: {}",
                                            data.get("message")
                                                .and_then(|s| s.as_str())
                                                .unwrap_or("Unknown error")
                                        ))
                                    }
                                } else {
                                    Err("Failed to create account: Couldn't parse response"
                                        .to_string())
                                }
                            }
                            Err(e) => Err(format!("Failed to create account: {e}")),
                        }
                    })
                };

            match creation_future.await {
                Ok(()) => {
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
                                let mut accounts = accounts_context.accounts.get_untracked();
                                add_security_log(
                                    format!("Account created with private key {secret_key}"),
                                    account_id.clone(),
                                );
                                accounts.accounts.push(Account {
                                    account_id: account_id.clone(),
                                    seed_phrase: Some(mnemonic.to_string()),
                                    secret_key: secret_key.clone(),
                                    network,
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
                                    set_error.set(Some("Failed to create account".to_string()));
                                }
                            }
                        }
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
                <div class="bg-neutral-950 p-8 rounded-xl w-full max-w-md">
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
                                    class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
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
                                                    || *c == '-'
                                            })
                                            .collect::<String>();
                                        set_account_name.set(value.clone());
                                        check_account(value);
                                    }
                                    on:keydown=handle_keydown
                                    disabled=move || is_creating.get()
                                />
                                <select
                                    class="absolute top-1/2 right-0 -translate-y-1/2 bg-transparent text-neutral-500 font-medium cursor-pointer focus:outline-none text-base max-w-40 text-right truncate border-r-8 border-transparent"
                                    on:change=move |ev| {
                                        let value = event_target_value(&ev);
                                        let parent_val = match value.as_str() {
                                            "near" => Parent::Mainnet,
                                            "testnet" => Parent::Testnet,
                                            other => Parent::SubAccount(other.parse().unwrap()),
                                        };
                                        set_parent.set(parent_val);
                                        check_account(account_name.get_untracked().clone());
                                    }
                                >
                                    <option
                                        value="near"
                                        selected=move || matches!(parent.get(), Parent::Mainnet)
                                    >
                                        ".near"
                                    </option>
                                    <option
                                        value="testnet"
                                        selected=move || matches!(parent.get(), Parent::Testnet)
                                    >
                                        ".testnet"
                                    </option>
                                    {accounts_context
                                        .accounts
                                        .get()
                                        .accounts
                                        .iter()
                                        .map(|account| {
                                            let id = account.account_id.to_string();
                                            view! {
                                                <option
                                                    value=id.clone()
                                                    selected=move || {
                                                        matches!(
                                                            parent.get(),
                                                            Parent::SubAccount(ref x)
                                                            if x == &id
                                                        )
                                                    }
                                                    class="truncate"
                                                >
                                                    {format!(".{id}")}
                                                </option>
                                            }
                                        })
                                        .collect::<Vec<_>>()}
                                </select>
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
                                let is_testnet = if let Ok(
                                    AccountCreationDetails { network, .. },
                                ) = parent.get().into_details(&accounts_context)
                                {
                                    network == Network::Testnet
                                } else {
                                    false
                                };
                                if is_testnet {
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
