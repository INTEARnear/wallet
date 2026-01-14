use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::hooks::use_params_map;
use leptos_use::use_interval_fn;
use near_min_api::{
    QueryFinality, RpcClient,
    types::{
        AccessKey, AccountContract, AccountId, Action, CryptoHash, Finality, FunctionCallAction,
        NearGas, NearToken, StateRecord,
        near_crypto::{KeyType, SecretKey},
    },
};
use reqwest::Url;
use std::time::Duration;

use crate::{
    contexts::{
        accounts_context::{Account, AccountsContext, SecretKeyHolder},
        config_context::ConfigContext,
        network_context::Network,
        security_log_context::add_security_log,
        transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
    },
    utils::get_ft_metadata,
};

const WRAP_CONTRACT_ID: &str = "wrap.local";

#[component]
pub fn DeveloperSandbox() -> impl IntoView {
    let params = use_params_map();
    let network_id = move || {
        params
            .get()
            .get("network_id")
            .map(|s| s.to_string())
            .unwrap_or_default()
    };
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();

    let ConfigContext {
        config, set_config, ..
    } = expect_context::<ConfigContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let accounts = accounts_context.accounts;
    let set_accounts = accounts_context.set_accounts;

    let (is_deploying_wrap, set_is_deploying_wrap) = signal(false);
    let (is_creating_account, set_is_creating_account) = signal(false);
    let (new_account_name, set_new_account_name) = signal(String::new());

    let (fast_forward_blocks, set_fast_forward_blocks) = signal(10);
    let (is_fast_forwarding, set_is_fast_forwarding) = signal(false);
    let (is_height_copied, set_is_height_copied) = signal(false);

    let (new_token_input, set_new_token_input) = signal(String::new());

    let network = move || {
        let id = network_id();
        config
            .get()
            .custom_networks
            .into_iter()
            .find(|n| n.id == id)
    };

    let block_height_resource = LocalResource::new(move || {
        let network = network();
        async move {
            let Some(network) = network else {
                return Err("Network not found".to_string());
            };

            let Ok(url) = network.rpc_url.parse::<Url>() else {
                return Err("Invalid RPC URL".to_string());
            };

            let rpc_client = RpcClient::new(vec![url]);
            match rpc_client.status().await {
                Ok(status) => Ok(status.sync_info.latest_block_height),
                Err(e) => Err(e.to_string()),
            }
        }
    });

    use_interval_fn(
        move || {
            block_height_resource.refetch();
        },
        200,
    );

    let wrap_status_resource = LocalResource::new(move || {
        let network = network();
        async move {
            let Some(network) = network else {
                return Err("Network not found".to_string());
            };

            let Ok(url) = network.rpc_url.parse::<Url>() else {
                return Err("Invalid RPC URL".to_string());
            };

            let rpc_client = RpcClient::new(vec![url]);
            let account_id: AccountId = WRAP_CONTRACT_ID.parse().unwrap();

            match rpc_client
                .view_account(account_id, QueryFinality::Finality(Finality::None))
                .await
            {
                Ok(_) => Ok(true),
                Err(_) => Ok(false),
            }
        }
    });

    let network_accounts = move || {
        let all_accounts = accounts.get();

        if let Some(localnet) = network() {
            let localnet_network = Network::Localnet(Box::new(localnet));
            all_accounts
                .accounts
                .into_iter()
                .filter(|account| account.network == localnet_network)
                .collect::<Vec<_>>()
        } else {
            vec![]
        }
    };

    let account_existence_resource = LocalResource::new(move || {
        let network = network();
        let name = new_account_name.get().trim().to_string();

        async move {
            if name.is_empty() {
                return Ok(None);
            }

            let account_id = match name.parse::<AccountId>() {
                Ok(id) => id,
                Err(_) => return Err("Invalid account name format".to_string()),
            };

            let Some(network) = network else {
                return Err("Network not found".to_string());
            };

            let Ok(url) = network.rpc_url.parse::<Url>() else {
                return Err("Invalid RPC URL".to_string());
            };

            let rpc_client = RpcClient::new(vec![url]);
            match rpc_client
                .view_account(account_id.clone(), QueryFinality::Finality(Finality::None))
                .await
            {
                Ok(_) => Ok(Some((account_id, true))),   // Account exists
                Err(_) => Ok(Some((account_id, false))), // Account doesn't exist
            }
        }
    });

    Effect::new(move |_| {
        let _name = new_account_name.get();
        let _network = network();
        account_existence_resource.refetch();
    });

    let token_validation_resource = LocalResource::new(move || {
        let network = network();
        let token_input = new_token_input.get().trim().to_string();

        async move {
            if token_input.is_empty() {
                return Ok(None);
            }

            let account_id = match token_input.parse::<AccountId>() {
                Ok(id) => id,
                Err(_) => return Err("Invalid token contract address format".to_string()),
            };

            let Some(network) = network else {
                return Err("Network not found".to_string());
            };

            let Ok(url) = network.rpc_url.parse::<Url>() else {
                return Err("Invalid RPC URL".to_string());
            };

            let rpc_client = RpcClient::new(vec![url]);
            match get_ft_metadata(account_id.clone(), rpc_client).await {
                Ok(metadata) => Ok(Some((account_id, metadata))),
                Err(e) => Err(format!("Failed to fetch token metadata: {}", e)),
            }
        }
    });

    Effect::new(move |_| {
        let _token_input = new_token_input.get();
        let _network = network();
        token_validation_resource.refetch();
    });

    let validate_account_name = move || {
        let name = new_account_name.get().trim().to_string();
        if name.is_empty() {
            return (false, false, "Enter an account name. You can't create an account on localnet as you do on mainnet, you can only do it on this page.".to_string());
        }

        let account_id_result = name.parse::<AccountId>();

        match account_id_result {
            Ok(account_id) => {
                match account_existence_resource.get() {
                    Some(Ok(Some((checked_id, exists)))) if checked_id == account_id => {
                        if exists {
                            (true, true, format!("Account {} already exists", account_id))
                        // (can_create, is_warning, message)
                        } else {
                            (true, false, format!("Will create: {}", account_id))
                        }
                    }
                    Some(Err(err)) => (false, false, err),
                    _ => (false, false, "Checking account...".to_string()),
                }
            }
            Err(_) => (false, false, "Invalid account name format".to_string()),
        }
    };

    let validate_token_input = move || {
        let token_input = new_token_input.get().trim().to_string();
        if token_input.is_empty() {
            return (false, false, "Enter a token contract address".to_string());
        }

        let account_id_result = token_input.parse::<AccountId>();

        match account_id_result {
            Ok(account_id) => {
                // Check if token already exists in the list
                let current_tokens = network().map(|n| n.tokens.clone()).unwrap_or_default();

                if current_tokens.contains(&account_id) {
                    return (false, true, format!("Token {} already in list", account_id));
                }

                match token_validation_resource.get() {
                    Some(Ok(Some((checked_id, metadata)))) if checked_id == account_id => (
                        true,
                        false,
                        format!("{} ({})", metadata.name, metadata.symbol),
                    ),
                    Some(Err(err)) => (false, false, err),
                    _ => (false, false, "Validating token...".to_string()),
                }
            }
            Err(_) => (false, false, "Invalid contract address format".to_string()),
        }
    };

    let add_token = move || {
        let Some(network) = network() else {
            return;
        };
        let token_input = new_token_input.get().trim().to_string();
        let Ok(account_id) = token_input.parse::<AccountId>() else {
            return;
        };

        set_config.update(|config| {
            if let Some(net) = config
                .custom_networks
                .iter_mut()
                .find(|n| n.id == network.id)
            {
                net.tokens.insert(account_id);
            }
        });
        set_new_token_input.set(String::new());
    };

    let remove_token = move |token_id: AccountId| {
        let Some(network) = network() else {
            return;
        };

        set_config.update(|config| {
            if let Some(net) = config
                .custom_networks
                .iter_mut()
                .find(|n| n.id == network.id)
            {
                net.tokens.retain(|t| t != &token_id);
            }
        });
    };

    let delete_account = move |account_id: AccountId| {
        set_accounts.update(|accounts_data| {
            add_security_log(
                format!(
                    "Deleted {} from developer sandbox with key {} (public key: {})",
                    account_id,
                    accounts_data
                        .accounts
                        .iter()
                        .find(|acc| acc.account_id == account_id)
                        .map(|acc| acc.secret_key.clone())
                        .unwrap(),
                    accounts_data
                        .accounts
                        .iter()
                        .find(|acc| acc.account_id == account_id)
                        .map(|acc| acc.secret_key.public_key())
                        .unwrap(),
                ),
                account_id.clone(),
                accounts_context,
            );
            accounts_data
                .accounts
                .retain(|acc| acc.account_id != account_id);

            // If this was the selected account, select another one
            if accounts_data.selected_account_id.as_ref() == Some(&account_id) {
                accounts_data.selected_account_id = accounts_data
                    .accounts
                    .first()
                    .map(|acc| acc.account_id.clone());
            }
        });
    };

    view! {
        {move || match network() {
            Some(_) => {
                view! {
                    <div class="flex flex-col gap-6 mt-6">
                        <div class="flex items-center gap-3">
                            <div class="text-xl font-semibold">
                                {move || format!("Sandbox: {}", network_id())}
                            </div>
                        </div>

                        // Block height section
                        <div class="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                            <div class="text-lg font-semibold mb-3">"Network Status"</div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-400">"Block Height:"</span>
                                    {move || {
                                        match block_height_resource.get() {
                                            Some(Ok(height)) => {
                                                view! {
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-sm font-mono text-green-400">
                                                            {format!("{height:09}")}
                                                        </span>
                                                        <button
                                                            on:click=move |_| {
                                                                let height_str = height.to_string();
                                                                let _ = window()
                                                                    .navigator()
                                                                    .clipboard()
                                                                    .write_text(&height_str);
                                                                set_is_height_copied.set(true);
                                                                set_timeout(
                                                                    move || set_is_height_copied.set(false),
                                                                    Duration::from_millis(2000),
                                                                );
                                                            }
                                                            class="p-1 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                                                            title="Copy block height"
                                                        >
                                                            {move || {
                                                                if is_height_copied.get() {
                                                                    view! {
                                                                        <Icon
                                                                            icon=icondata::LuCheck
                                                                            style="color: #10b981"
                                                                            width="14"
                                                                            height="14"
                                                                        />
                                                                    }
                                                                } else {
                                                                    view! {
                                                                        <Icon
                                                                            icon=icondata::LuCopy
                                                                            style="color: #9ca3af"
                                                                            width="14"
                                                                            height="14"
                                                                        />
                                                                    }
                                                                }
                                                            }}
                                                        </button>
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                            Some(Err(_)) => {
                                                view! {
                                                    <span class="text-sm text-red-400">"Offline"</span>
                                                }
                                                    .into_any()
                                            }
                                            None => {
                                                view! {
                                                    <span class="text-sm text-blue-400">"Loading..."</span>
                                                }
                                                    .into_any()
                                            }
                                        }
                                    }}
                                </div>

                                // Fast-forward controls
                                <div class="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        max="100000"
                                        value="10"
                                        on:input=move |ev| {
                                            if let Ok(value) = event_target_value(&ev).parse::<u64>() {
                                                set_fast_forward_blocks.set(value.clamp(1, 100000));
                                            }
                                        }
                                        class="w-20 px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="blocks"
                                    />
                                    <button
                                        on:click=move |_| {
                                            let Some(network) = network() else {
                                                return;
                                            };
                                            let blocks_to_advance = fast_forward_blocks.get();
                                            set_is_fast_forwarding.set(true);
                                            spawn_local(async move {
                                                let rpc_client = RpcClient::new(
                                                    vec![network.rpc_url.parse::<Url>().unwrap()],
                                                );
                                                match rpc_client
                                                    .sandbox_fast_forward(blocks_to_advance)
                                                    .await
                                                {
                                                    Ok(()) => {
                                                        block_height_resource.refetch();
                                                    }
                                                    Err(e) => {
                                                        log::error!("Failed to fast-forward blocks: {e}");
                                                    }
                                                }
                                                set_is_fast_forwarding.set(false);
                                            });
                                        }
                                        disabled=move || {
                                            is_fast_forwarding.get()
                                                || block_height_resource.get().is_none()
                                        }
                                        class="px-3 py-2 text-white text-sm rounded cursor-pointer transition-colors min-w-36 text-center"
                                        class:bg-yellow-600=move || {
                                            !is_fast_forwarding.get()
                                                && block_height_resource.get().is_some()
                                        }
                                        class:bg-yellow-700=move || {
                                            !is_fast_forwarding.get()
                                                && block_height_resource.get().is_some()
                                        }
                                        class:bg-neutral-600=move || {
                                            is_fast_forwarding.get()
                                                || block_height_resource.get().is_none()
                                        }
                                        class:cursor-not-allowed=move || {
                                            is_fast_forwarding.get()
                                                || block_height_resource.get().is_none()
                                        }
                                    >
                                        {move || {
                                            if is_fast_forwarding.get() {
                                                "Fast-forwarding..."
                                            } else {
                                                "Fast-forward"
                                            }
                                        }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        // Contracts section
                        <div class="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                            <div class="text-lg font-semibold mb-3">"Smart Contracts"</div>

                            <div class="flex flex-col gap-3">
                                // Wrapped NEAR contract
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        {move || {
                                            match wrap_status_resource.get() {
                                                Some(Ok(true)) => {
                                                    view! {
                                                        <Icon
                                                            icon=icondata::LuCheck
                                                            style="color: #10b981"
                                                            width="16"
                                                            height="16"
                                                        />
                                                    }
                                                        .into_any()
                                                }
                                                Some(Ok(false)) => {
                                                    view! {
                                                        <Icon
                                                            icon=icondata::LuX
                                                            style="color: #ef4444"
                                                            width="16"
                                                            height="16"
                                                        />
                                                    }
                                                        .into_any()
                                                }
                                                Some(Err(_)) => {
                                                    view! {
                                                        <Icon
                                                            icon=icondata::LuX
                                                            style="color: #ef4444"
                                                            width="16"
                                                            height="16"
                                                        />
                                                    }
                                                        .into_any()
                                                }
                                                None => {
                                                    view! {
                                                        <div class="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                                                    }
                                                        .into_any()
                                                }
                                            }
                                        }}
                                        <span class="text-sm">
                                            {move || {
                                                match wrap_status_resource.get() {
                                                    Some(Ok(true)) => {
                                                        format!("Wrapped NEAR: {}", WRAP_CONTRACT_ID)
                                                    }
                                                    Some(Ok(false)) => "Wrapped NEAR: not deployed".to_string(),
                                                    Some(Err(_)) => "Wrapped NEAR: error checking".to_string(),
                                                    None => "Wrapped NEAR: checking...".to_string(),
                                                }
                                            }}
                                        </span>
                                    </div>
                                    <button
                                        on:click=move |_| {
                                            let Some(network) = network() else {
                                                return;
                                            };
                                            set_is_deploying_wrap.set(true);
                                            let rpc_client_mainnet = Network::Mainnet
                                                .default_rpc_client();
                                            let rpc_client = RpcClient::new(
                                                vec![network.rpc_url.parse::<Url>().unwrap()],
                                            );
                                            spawn_local(async move {
                                                let wrap_near_code = rpc_client_mainnet
                                                    .view_code(
                                                        "wrap.near".parse().unwrap(),
                                                        QueryFinality::Finality(Finality::None),
                                                    )
                                                    .await
                                                    .unwrap()
                                                    .code;
                                                let account_id: AccountId = WRAP_CONTRACT_ID
                                                    .parse()
                                                    .unwrap();
                                                let secret_key = SecretKey::from_random(KeyType::ED25519);
                                                let records = vec![
                                                    StateRecord::Account {
                                                        account_id: account_id.clone(),
                                                        account: near_min_api::types::Account::new(
                                                            NearToken::from_near(1000),
                                                            NearToken::from_near(0),
                                                            AccountContract::Local(
                                                                CryptoHash::hash_bytes(&wrap_near_code),
                                                            ),
                                                            0,
                                                        ),
                                                    },
                                                    StateRecord::Contract {
                                                        account_id: account_id.clone(),
                                                        code: wrap_near_code,
                                                    },
                                                    StateRecord::AccessKey {
                                                        account_id: account_id.clone(),
                                                        public_key: secret_key.public_key(),
                                                        access_key: AccessKey::full_access(),
                                                    },
                                                ];
                                                match rpc_client.sandbox_patch_state(records).await {
                                                    Ok(()) => {
                                                        set_accounts
                                                            .update(|accounts_data| {
                                                                accounts_data
                                                                    .accounts
                                                                    .retain(|acc| acc.account_id != account_id);
                                                                accounts_data
                                                                    .accounts
                                                                    .push(Account {
                                                                        account_id: account_id.clone(),
                                                                        secret_key: SecretKeyHolder::SecretKey(secret_key),
                                                                        seed_phrase: None,
                                                                        network: Network::Localnet(Box::new(network.clone())),
                                                                    });
                                                            });
                                                        let (details_receiver, transaction) = EnqueuedTransaction::create(
                                                            "Initialize wrapped near contract".to_string(),
                                                            account_id.clone(),
                                                            account_id.clone(),
                                                            vec![
                                                                Action::FunctionCall(
                                                                    Box::new(FunctionCallAction {
                                                                        method_name: "new".to_string(),
                                                                        args: serde_json::to_vec(&serde_json::json!({})).unwrap(),
                                                                        gas: NearGas::from_tgas(300).into(),
                                                                        deposit: NearToken::from_yoctonear(0),
                                                                    }),
                                                                ),
                                                            ],
                                                        );
                                                        add_transaction.update(|queue| queue.push(transaction));
                                                        match details_receiver.await {
                                                            Ok(_) => {
                                                                set_config
                                                                    .update(|config| {
                                                                        config
                                                                            .custom_networks
                                                                            .iter_mut()
                                                                            .find(|n| n.id == network.id)
                                                                            .unwrap()
                                                                            .wrap_contract = Some(account_id);
                                                                    });
                                                                wrap_status_resource.refetch();
                                                            }
                                                            Err(e) => {
                                                                log::error!(
                                                                    "Failed to initialize wrapped near contract: {e}"
                                                                );
                                                            }
                                                        }
                                                    }
                                                    Err(e) => {
                                                        log::error!(
                                                            "Failed to deploy {} contract: {e}", WRAP_CONTRACT_ID
                                                        );
                                                    }
                                                }
                                                set_is_deploying_wrap.set(false);
                                            });
                                        }
                                        disabled=move || is_deploying_wrap.get()
                                        class="px-3 py-1 text-white text-sm rounded cursor-pointer transition-colors min-w-30 text-center"
                                        class:bg-blue-600=move || !is_deploying_wrap.get()
                                        class:bg-blue-700=move || !is_deploying_wrap.get()
                                        class:bg-neutral-600=move || is_deploying_wrap.get()
                                        class:cursor-not-allowed=move || is_deploying_wrap.get()
                                    >
                                        {move || {
                                            if is_deploying_wrap.get() {
                                                "Deploying..."
                                            } else {
                                                match wrap_status_resource.get() {
                                                    Some(Ok(true)) => "Redeploy",
                                                    _ => "Deploy",
                                                }
                                            }
                                        }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        // Accounts section
                        <div class="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                            <div class="text-lg font-semibold mb-3">"Accounts"</div>

                            // Account creation form
                            <div class="flex flex-col gap-3 mb-4 p-3 bg-neutral-900 rounded-lg">
                                <div class="text-sm font-medium">"Create New Account"</div>
                                <div class="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="test.local"
                                        value=move || new_account_name.get()
                                        on:input=move |ev| {
                                            set_new_account_name.set(event_target_value(&ev))
                                        }
                                        class="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        on:click=move |_| {
                                            let Some(network) = network() else {
                                                return;
                                            };
                                            let account_name = new_account_name
                                                .get()
                                                .trim()
                                                .to_string();
                                            if account_name.is_empty() {
                                                return;
                                            }
                                            let Ok(account_id) = account_name.parse::<AccountId>() else {
                                                log::error!("Invalid account name: {}", account_name);
                                                return;
                                            };
                                            set_is_creating_account.set(true);
                                            let secret_key = SecretKey::from_random(KeyType::ED25519);
                                            spawn_local(async move {
                                                let rpc_client = RpcClient::new(
                                                    vec![network.rpc_url.parse::<Url>().unwrap()],
                                                );
                                                let records = vec![
                                                    StateRecord::Account {
                                                        account_id: account_id.clone(),
                                                        account: near_min_api::types::Account::new(
                                                            NearToken::from_near(1000),
                                                            NearToken::from_near(0),
                                                            AccountContract::None,
                                                            0,
                                                        ),
                                                    },
                                                    StateRecord::AccessKey {
                                                        account_id: account_id.clone(),
                                                        public_key: secret_key.public_key(),
                                                        access_key: AccessKey::full_access(),
                                                    },
                                                ];
                                                match rpc_client.sandbox_patch_state(records).await {
                                                    Ok(()) => {
                                                        let account = Account {
                                                            account_id: account_id.clone(),
                                                            secret_key: SecretKeyHolder::SecretKey(secret_key),
                                                            seed_phrase: None,
                                                            network: Network::Localnet(Box::new(network)),
                                                        };
                                                        set_accounts
                                                            .update(|accounts_data| {
                                                                accounts_data.accounts.push(account);
                                                                accounts_data.selected_account_id = Some(account_id);
                                                            });
                                                        set_new_account_name.set(String::new());
                                                    }
                                                    Err(e) => {
                                                        log::error!("Failed to create account: {e}");
                                                    }
                                                }
                                                set_is_creating_account.set(false);
                                            });
                                        }
                                        disabled=move || {
                                            is_creating_account.get() || !validate_account_name().0
                                        }
                                        class="px-4 py-2 text-sm rounded cursor-pointer transition-colors min-w-30 text-center"
                                        class:bg-green-600=move || {
                                            let (can_create, is_warning, _) = validate_account_name();
                                            can_create && !is_warning
                                        }
                                        class:bg-green-700=move || {
                                            let (can_create, is_warning, _) = validate_account_name();
                                            can_create && !is_warning
                                        }
                                        class:bg-yellow-600=move || {
                                            let (can_create, is_warning, _) = validate_account_name();
                                            can_create && is_warning
                                        }
                                        class:bg-yellow-700=move || {
                                            let (can_create, is_warning, _) = validate_account_name();
                                            can_create && is_warning
                                        }
                                        class:bg-neutral-600=move || {
                                            let (can_create, _, _) = validate_account_name();
                                            !can_create
                                        }
                                        class:cursor-not-allowed=move || {
                                            let (can_create, _, _) = validate_account_name();
                                            !can_create
                                        }
                                        class:text-white=move || true
                                    >
                                        {move || {
                                            if is_creating_account.get() {
                                                "Creating..."
                                            } else {
                                                let (can_create, is_warning, _) = validate_account_name();
                                                if can_create && is_warning {
                                                    "Create anyway"
                                                } else {
                                                    "Create"
                                                }
                                            }
                                        }}
                                    </button>
                                </div>
                                <div class="text-xs">
                                    {move || {
                                        let (can_create, is_warning, message) = validate_account_name();
                                        let color_class = if can_create && !is_warning {
                                            "text-green-400"
                                        } else if can_create && is_warning {
                                            "text-yellow-400"
                                        } else if new_account_name.get().trim().is_empty() {
                                            "text-gray-400"
                                        } else {
                                            "text-red-400"
                                        };

                                        view! { <span class=color_class>{message}</span> }
                                    }}
                                </div>
                            </div>

                            {move || {
                                let accounts = network_accounts();
                                if accounts.is_empty() {
                                    view! {
                                        <div class="text-gray-400 text-sm p-4 bg-neutral-900 rounded-lg">
                                            "No accounts on this network"
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="flex flex-col gap-2">
                                            {accounts
                                                .into_iter()
                                                .map(|account| {
                                                    let account_id = account.account_id.clone();
                                                    view! {
                                                        <div class="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                                                            <div class="flex flex-col">
                                                                <div class="font-medium text-sm">
                                                                    {account.account_id.to_string()}
                                                                </div>
                                                                <div class="text-xs text-gray-400">
                                                                    {move || format!("Network: {}", network_id())}
                                                                </div>
                                                            </div>
                                                            <button
                                                                on:click=move |_| {
                                                                    delete_account(account_id.clone());
                                                                }
                                                                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded cursor-pointer transition-colors min-w-20 text-center"
                                                            >
                                                                "Delete"
                                                            </button>
                                                        </div>
                                                    }
                                                })
                                                .collect::<Vec<_>>()}
                                        </div>
                                    }
                                        .into_any()
                                }
                            }}
                        </div>

                        // Token list editor section
                        <div class="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                            <div class="text-lg font-semibold mb-3">"Token List"</div>

                            <div class="text-sm text-gray-400 mb-3">
                                "Since there is no token detection API on localnet, you need to add each token contract address manually."
                            </div>

                            // Token addition form
                            <div class="flex flex-col gap-3 mb-4 p-3 bg-neutral-900 rounded-lg">
                                <div class="text-sm font-medium">"Add Token Contract"</div>
                                <div class="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="token.local"
                                        value=move || new_token_input.get()
                                        on:input=move |ev| {
                                            set_new_token_input.set(event_target_value(&ev))
                                        }
                                        class="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        on:click=move |_| {
                                            add_token();
                                        }
                                        disabled=move || { !validate_token_input().0 }
                                        class="px-4 py-2 text-sm rounded transition-colors min-w-30 text-center"
                                        class:bg-green-600=move || {
                                            let (can_add, is_warning, _) = validate_token_input();
                                            can_add && !is_warning
                                        }
                                        class:bg-green-700=move || {
                                            let (can_add, is_warning, _) = validate_token_input();
                                            can_add && !is_warning
                                        }
                                        class:bg-neutral-600=move || {
                                            let (can_add, _, _) = validate_token_input();
                                            !can_add
                                        }
                                        class:cursor-not-allowed=move || {
                                            let (can_add, _, _) = validate_token_input();
                                            !can_add
                                        }
                                        class:cursor-pointer=move || {
                                            let (can_add, _, _) = validate_token_input();
                                            can_add
                                        }
                                        class:text-white=move || true
                                    >
                                        "Add Token"
                                    </button>
                                </div>
                                <div class="text-xs">
                                    {move || {
                                        let (can_add, is_warning, message) = validate_token_input();
                                        let color_class = if can_add && !is_warning {
                                            "text-green-400"
                                        } else if can_add && is_warning {
                                            "text-yellow-400"
                                        } else if new_token_input.get().trim().is_empty() {
                                            "text-gray-400"
                                        } else {
                                            "text-red-400"
                                        };

                                        view! { <span class=color_class>{message}</span> }
                                    }}
                                </div>
                            </div>

                            // Token list display
                            {move || {
                                let current_tokens = network()
                                    .map(|n| n.tokens.clone())
                                    .unwrap_or_default();
                                if current_tokens.is_empty() {
                                    view! {
                                        <div class="text-gray-400 text-sm p-4 bg-neutral-900 rounded-lg">
                                            "No tokens configured for this network"
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="flex flex-col gap-2">
                                            {current_tokens
                                                .into_iter()
                                                .map(|token_id| {
                                                    view! {
                                                        <TokenListItem
                                                            token_id=token_id.clone()
                                                            network=network()
                                                            on_remove=move |id| remove_token(id)
                                                        />
                                                    }
                                                })
                                                .collect::<Vec<_>>()}
                                        </div>
                                    }
                                        .into_any()
                                }
                            }}
                        </div>
                    </div>
                }
                    .into_any()
            }
            None => {
                view! { <div class="text-red-400 text-center p-8">"Network not found"</div> }
                    .into_any()
            }
        }}
    }
}

#[component]
fn TokenListItem(
    token_id: AccountId,
    network: Option<crate::contexts::config_context::CustomNetwork>,
    on_remove: impl Fn(AccountId) + 'static + Copy,
) -> impl IntoView {
    let token_id_display = token_id.to_string();
    let token_id_for_remove = token_id.clone();

    let metadata_resource = LocalResource::new(move || {
        let token_id = token_id.clone();
        let network = network.clone();

        async move {
            let Some(network) = network else {
                return Err("Network not found".to_string());
            };

            let Ok(url) = network.rpc_url.parse::<Url>() else {
                return Err("Invalid RPC URL".to_string());
            };

            let rpc_client = RpcClient::new(vec![url]);
            get_ft_metadata(token_id, rpc_client).await
        }
    });

    view! {
        <div class="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
            <div class="flex flex-col flex-1">
                <div class="font-medium text-sm">{token_id_display}</div>
                <div class="text-xs text-gray-400">
                    {move || {
                        match metadata_resource.get() {
                            Some(Ok(metadata)) => {
                                format!(
                                    "{} ({}) - {} decimals",
                                    metadata.name,
                                    metadata.symbol,
                                    metadata.decimals,
                                )
                            }
                            Some(Err(e)) => format!("Error: {}", e),
                            None => "Loading metadata...".to_string(),
                        }
                    }}
                </div>
            </div>
            <button
                on:click=move |_| {
                    on_remove(token_id_for_remove.clone());
                }
                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded cursor-pointer transition-colors min-w-20 text-center"
            >
                "Remove"
            </button>
        </div>
    }
}
