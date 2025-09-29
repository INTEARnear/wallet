use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::hooks::use_navigate;
use near_min_api::{types::AccountId, RpcClient};
use reqwest::Url;
use std::collections::HashMap;

use crate::contexts::config_context::{ConfigContext, CustomNetwork};

#[derive(Clone, Debug, PartialEq)]
enum EditorState {
    None,
    Editing(usize), // index of network being edited
    Adding,
}

#[derive(Clone, Debug, PartialEq)]
enum NetworkStatus {
    Unknown,
    Checking,
    Online,
    Offline,
}

#[derive(Clone, Debug, Default)]
struct NetworkForm {
    id: String,
    rpc_url: String,
    history_service_url: Option<String>,
    social_contract: Option<AccountId>,
    prices_api_url: Option<String>,
    realtime_events_api_url: Option<String>,
    wrap_contract: Option<AccountId>,
    explorer_url: Option<String>,
    fastnear_api_url: Option<String>,
    staking_pools: Vec<AccountId>,
    pool_details_contract: Option<AccountId>,
    charts_api_url: Option<String>,
    tokens: Vec<AccountId>,
}

impl From<&CustomNetwork> for NetworkForm {
    fn from(network: &CustomNetwork) -> Self {
        Self {
            id: network.id.clone(),
            rpc_url: network.rpc_url.clone(),
            history_service_url: network.history_service_url.clone(),
            social_contract: network.social_contract.clone(),
            prices_api_url: network.prices_api_url.clone(),
            realtime_events_api_url: network.realtime_events_api_url.clone(),
            wrap_contract: network.wrap_contract.clone(),
            explorer_url: network.explorer_url.clone(),
            fastnear_api_url: network.fastnear_api_url.clone(),
            staking_pools: network.staking_pools.iter().cloned().collect(),
            pool_details_contract: network.pool_details_contract.clone(),
            charts_api_url: network.charts_api_url.clone(),
            tokens: network.tokens.iter().cloned().collect(),
        }
    }
}

impl From<NetworkForm> for CustomNetwork {
    fn from(form: NetworkForm) -> Self {
        Self {
            id: form.id,
            rpc_url: form.rpc_url,
            history_service_url: form.history_service_url,
            social_contract: form.social_contract,
            prices_api_url: form.prices_api_url,
            realtime_events_api_url: form.realtime_events_api_url,
            wrap_contract: form.wrap_contract,
            explorer_url: form.explorer_url,
            fastnear_api_url: form.fastnear_api_url,
            staking_pools: form.staking_pools.into_iter().collect(),
            pool_details_contract: form.pool_details_contract,
            charts_api_url: form.charts_api_url,
            tokens: form.tokens.into_iter().collect(),
        }
    }
}

#[component]
pub fn DeveloperSettings() -> impl IntoView {
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let (editor_state, set_editor_state) = signal(EditorState::None);
    let (form_data, set_form_data) = signal(NetworkForm::default());
    let (is_validating, set_is_validating) = signal(false);
    let (validation_error, set_validation_error) = signal::<Option<String>>(None);
    let (network_statuses, set_network_statuses) =
        signal::<HashMap<String, NetworkStatus>>(HashMap::new());
    let navigate = use_navigate();

    // Function to validate all networks on page load or config change
    let validate_all_networks = move || {
        let networks = config.get().custom_networks;
        for network in networks {
            let network_id = network.id.clone();
            let rpc_url = network.rpc_url.clone();

            set_network_statuses.update(|statuses| {
                statuses.insert(network_id.clone(), NetworkStatus::Checking);
            });

            spawn_local(async move {
                let Ok(url) = rpc_url.parse::<Url>() else {
                    set_network_statuses.update(|statuses| {
                        statuses.insert(network_id, NetworkStatus::Offline);
                    });
                    return;
                };

                let rpc_client = RpcClient::new(vec![url]).with_max_retries(0);
                let status = match rpc_client.status().await {
                    Ok(_) => NetworkStatus::Online,
                    Err(_) => NetworkStatus::Offline,
                };

                set_network_statuses.update(|statuses| {
                    statuses.insert(network_id, status);
                });
            });
        }
    };

    // Validate networks when config changes
    Effect::new(move |_| {
        validate_all_networks();
    });

    let validate_rpc_url = move |url: &str| {
        if url.is_empty() {
            set_validation_error(Some("RPC URL is required".to_string()));
            return;
        }

        let url = url.to_string();
        spawn_local(async move {
            set_is_validating(true);
            set_validation_error(None);

            let Ok(url) = url.parse::<Url>() else {
                set_is_validating(false);
                set_validation_error(Some("Invalid URL".to_string()));
                return;
            };

            let rpc_client = RpcClient::new(vec![url]).with_max_retries(0);
            match rpc_client.status().await {
                Ok(_) => match rpc_client.sandbox_fast_forward(1).await {
                    Ok(()) => {
                        set_is_validating(false);
                        set_validation_error(None);
                    }
                    Err(_) => {
                        set_is_validating(false);
                        set_validation_error(Some("This network is not a sandbox. Try running target/release/near-sandbox instead of target/release/neard".to_string()));
                    }
                },
                Err(e) => {
                    set_is_validating(false);
                    set_validation_error(Some(format!("RPC validation failed: {}", e)));
                }
            }
        });
    };

    let start_edit = move |index: usize| {
        let networks = config.get().custom_networks;
        if let Some(network) = networks.get(index) {
            set_form_data(NetworkForm::from(network));
            set_editor_state(EditorState::Editing(index));
        }
    };

    let start_add = move || {
        set_form_data(NetworkForm::default());
        set_editor_state(EditorState::Adding);
    };

    let cancel_edit = move || {
        set_editor_state(EditorState::None);
        set_form_data(NetworkForm::default());
        set_validation_error(None);
    };

    let save_network = move || {
        let form = form_data.get();
        if form.id.is_empty() || form.rpc_url.is_empty() {
            return;
        }

        let mut config_data = config.get();
        let new_network = CustomNetwork::from(form);

        match editor_state.get() {
            EditorState::Editing(index) => {
                if let Some(network) = config_data.custom_networks.get_mut(index) {
                    *network = new_network;
                }
            }
            EditorState::Adding => {
                config_data.custom_networks.push(new_network);
            }
            EditorState::None => return,
        }

        set_config(config_data);
        set_editor_state(EditorState::None);
        set_form_data(NetworkForm::default());
        set_validation_error(None);
    };

    let delete_network = move |index: usize| {
        let mut config_data = config.get();
        config_data.custom_networks.remove(index);
        set_config(config_data);
        set_editor_state(EditorState::None);
    };

    let validate_network_id = move |id: &str| -> Option<String> {
        if id.is_empty() {
            return Some("Network ID is required".to_string());
        }

        let networks = config.get().custom_networks;
        let current_editor = editor_state.get();

        // Check for duplicates, but allow the current network being edited
        for (index, network) in networks.iter().enumerate() {
            if network.id == id {
                match current_editor {
                    EditorState::Editing(editing_index) if editing_index == index => {
                        // Allow if editing the same network
                        continue;
                    }
                    _ => {
                        return Some("Network ID must be unique".to_string());
                    }
                }
            }
        }

        None
    };

    let is_form_valid = move || {
        let form = form_data.get();
        let is_editing = matches!(editor_state.get(), EditorState::Editing(_));

        !form.id.is_empty()
            && !form.rpc_url.is_empty()
            && validation_error.get().is_none()
            && (is_editing || validate_network_id(&form.id).is_none())
    };

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">"Developer Settings"</div>

            // Testnet tip
            <div class="flex items-center gap-3 text-sm text-sky-100 bg-neutral-900 p-4 rounded-lg border border-sky-700 shadow-lg">
                <Icon icon=icondata::LuInfo attr:class="min-w-5 min-h-5 text-sky-300" />
                <span>
                    "To create an account on testnet, tap \".near\"
                    and select \".testnet\" in the dropdown on account creation page."
                </span>
            </div>

            // Localnet section
            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <div class="text-lg font-semibold">"Localnet"</div>
                    <button
                        on:click=move |_| start_add()
                        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded cursor-pointer"
                    >
                        "Add"
                    </button>
                </div>

                <div class="flex flex-col gap-2">
                    {move || {
                        let navigate = navigate.clone();
                        let networks = config.get().custom_networks;
                        if networks.is_empty() {
                            view! {
                                <div class="text-gray-400 text-sm p-4 bg-neutral-800 rounded-lg">
                                    "No local networks configured"
                                </div>
                            }
                                .into_any()
                        } else {
                            view! {
                                {networks
                                    .into_iter()
                                    .enumerate()
                                    .map(|(index, network)| {
                                        let network_id = network.id.clone();
                                        match editor_state.get() {
                                            EditorState::Editing(
                                                editing_index,
                                            ) if editing_index == index => {
                                                view! {
                                                    <div class="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                                                        <div class="flex flex-col gap-4">
                                                            <div class="text-lg font-semibold">"Edit Network"</div>

                                                            <div class="flex flex-col gap-3">
                                                                <div>
                                                                    <label class="block text-sm font-medium mb-1">
                                                                        "Network ID"
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        prop:value=move || form_data.get().id
                                                                        disabled=true
                                                                        class="w-full px-3 py-2 border rounded text-base bg-neutral-800 border-neutral-600 text-gray-400 cursor-not-allowed"
                                                                        placeholder="my-local-network"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label class="block text-sm font-medium mb-1">
                                                                        "RPC URL"
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        prop:value=move || form_data.get().rpc_url
                                                                        on:input=move |ev| {
                                                                            let value = event_target_value(&ev);
                                                                            set_form_data.update(|f| f.rpc_url = value.clone());
                                                                            validate_rpc_url(&value);
                                                                        }
                                                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                                                                        placeholder="http://localhost:3030"
                                                                    />
                                                                    <div class="text-xs text-gray-500 mt-1">
                                                                        "Note: Only http://localhost:* URLs are accepted due to Content Security Policy of Intear Wallet"
                                                                    </div>
                                                                    {move || {
                                                                        if is_validating.get() {
                                                                            view! {
                                                                                <div class="text-sm text-blue-400 mt-1">"Checking..."</div>
                                                                            }
                                                                                .into_any()
                                                                        } else if let Some(error) = validation_error.get() {
                                                                            view! {
                                                                                <div class="text-sm text-red-400 mt-1">{error}</div>
                                                                            }
                                                                                .into_any()
                                                                        } else {
                                                                            ().into_any()
                                                                        }
                                                                    }}
                                                                </div>
                                                            </div>

                                                            <div class="flex gap-2">
                                                                <button
                                                                    on:click=move |_| save_network()
                                                                    disabled=move || !is_form_valid()
                                                                    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded cursor-pointer"
                                                                >
                                                                    "Save"
                                                                </button>
                                                                <button
                                                                    on:click=move |_| cancel_edit()
                                                                    class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded cursor-pointer"
                                                                >
                                                                    "Cancel"
                                                                </button>
                                                                <button
                                                                    on:click=move |_| delete_network(index)
                                                                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded cursor-pointer"
                                                                >
                                                                    "Delete"
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                            _ => {
                                                let navigate = navigate.clone();
                                                view! {
                                                    <div class="flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                                                        <div class="flex flex-col gap-1">
                                                            <div class="flex items-center gap-2">
                                                                <div class="font-medium">{network.id}</div>
                                                                {
                                                                    let network_id_for_status_clone = network_id.clone();
                                                                    move || {
                                                                        let status = network_statuses
                                                                            .get()
                                                                            .get(&network_id_for_status_clone)
                                                                            .cloned()
                                                                            .unwrap_or(NetworkStatus::Unknown);
                                                                        match status {
                                                                            NetworkStatus::Checking | NetworkStatus::Unknown => {
                                                                                view! {
                                                                                    <div class="flex items-center gap-1">
                                                                                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                                                                        <span class="text-sm text-blue-400">"Checking"</span>
                                                                                    </div>
                                                                                }
                                                                                    .into_any()
                                                                            }
                                                                            NetworkStatus::Online => {
                                                                                view! {
                                                                                    <div class="flex items-center gap-1">
                                                                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                                                                        <span class="text-sm text-green-400">"Online"</span>
                                                                                    </div>
                                                                                }
                                                                                    .into_any()
                                                                            }
                                                                            NetworkStatus::Offline => {
                                                                                view! {
                                                                                    <div class="flex items-center gap-1">
                                                                                        <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                                                                                        <span class="text-sm text-red-400">"Offline"</span>
                                                                                    </div>
                                                                                }
                                                                                    .into_any()
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            </div>
                                                            <div class="text-sm text-gray-400">{network.rpc_url}</div>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            {move || {
                                                                let navigate = navigate.clone();
                                                                let status = network_statuses
                                                                    .get()
                                                                    .get(&network_id)
                                                                    .cloned()
                                                                    .unwrap_or(NetworkStatus::Unknown);
                                                                if matches!(status, NetworkStatus::Online) {
                                                                    let network_id = network_id.clone();
                                                                    view! {
                                                                        <button
                                                                            on:click=move |_| {
                                                                                navigate(
                                                                                    &format!("/settings/developer/sandbox/{}", network_id),
                                                                                    Default::default(),
                                                                                );
                                                                            }
                                                                            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded cursor-pointer"
                                                                        >
                                                                            "Sandbox"
                                                                        </button>
                                                                    }
                                                                        .into_any()
                                                                } else {
                                                                    ().into_any()
                                                                }
                                                            }}
                                                            <button
                                                                on:click=move |_| start_edit(index)
                                                                class="p-1 hover:bg-neutral-700 text-gray-400 rounded cursor-pointer shrink-0"
                                                            >
                                                                <Icon
                                                                    icon=icondata::LuSettings
                                                                    width="16px"
                                                                    height="16px"
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                        }
                                    })
                                    .collect::<Vec<_>>()}
                            }
                                .into_any()
                        }
                    }}
                </div>

                {move || {
                    match editor_state.get() {
                        EditorState::Adding => {
                            view! {
                                <div class="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                                    <div class="flex flex-col gap-4">
                                        <div class="text-lg font-semibold">"Add Network"</div>

                                        <div class="flex flex-col gap-3">
                                            <div>
                                                <label class="block text-sm font-medium mb-1">
                                                    "Network ID"
                                                </label>
                                                <input
                                                    type="text"
                                                    prop:value=move || form_data.get().id
                                                    on:input=move |ev| {
                                                        let value = event_target_value(&ev);
                                                        set_form_data.update(|f| f.id = value);
                                                    }
                                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                                                    placeholder="my-local-network"
                                                />
                                                {move || {
                                                    let form = form_data.get();
                                                    if !form.id.is_empty() {
                                                        if let Some(error) = validate_network_id(&form.id) {
                                                            view! {
                                                                <div class="text-sm text-red-400 mt-1">{error}</div>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    } else {
                                                        ().into_any()
                                                    }
                                                }}
                                            </div>

                                            <div>
                                                <label class="block text-sm font-medium mb-1">
                                                    "RPC URL"
                                                </label>
                                                <input
                                                    type="text"
                                                    prop:value=move || form_data.get().rpc_url
                                                    on:input=move |ev| {
                                                        let value = event_target_value(&ev);
                                                        set_form_data.update(|f| f.rpc_url = value.clone());
                                                        validate_rpc_url(&value);
                                                    }
                                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-base text-white"
                                                    placeholder="http://localhost:3030"
                                                />
                                                <div class="text-xs text-gray-500 mt-1">
                                                    "Note: Only http://localhost:* URLs are accepted due to Content Security Policy of Intear Wallet"
                                                </div>
                                                {move || {
                                                    if is_validating.get() {
                                                        view! {
                                                            <div class="text-sm text-blue-400 mt-1">"Checking..."</div>
                                                        }
                                                            .into_any()
                                                    } else if let Some(error) = validation_error.get() {
                                                        view! {
                                                            <div class="text-sm text-red-400 mt-1">{error}</div>
                                                        }
                                                            .into_any()
                                                    } else {
                                                        ().into_any()
                                                    }
                                                }}
                                            </div>
                                        </div>

                                        <div class="flex gap-2">
                                            <button
                                                on:click=move |_| save_network()
                                                disabled=move || !is_form_valid()
                                                class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded cursor-pointer"
                                            >
                                                "Save"
                                            </button>
                                            <button
                                                on:click=move |_| cancel_edit()
                                                class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded cursor-pointer"
                                            >
                                                "Cancel"
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                                .into_any()
                        }
                        _ => ().into_any(),
                    }
                }}
            </div>
        </div>
    }
}
