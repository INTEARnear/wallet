#![allow(clippy::float_arithmetic)] // Not important for UI

use std::collections::HashMap;
use std::hash::{DefaultHasher, Hash, Hasher};
use std::time::Duration;

use bip39::Mnemonic;
use chrono::Utc;
use leptos::ev::{mousemove, mouseup, scroll, touchcancel, touchend, touchmove};
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_location;
use leptos_use::{
    UseEventListenerOptions, UseIntervalFnOptions, use_event_listener,
    use_event_listener_with_options, use_interval_fn, use_interval_fn_with_options,
};
use near_min_api::types::Finality;
use near_min_api::types::{
    AccountId,
    near_crypto::{ED25519SecretKey, SecretKey},
};
use near_min_api::{Error, QueryFinality};
use serde::Deserialize;
use slipped10::BIP32Path;
use web_sys::TouchEvent;

use crate::components::account_creation_form::AccountCreationForm;
use crate::components::login_form::LoginForm;
use crate::contexts::accounts_context::Account;
use crate::contexts::network_context::{Network, NetworkContext};
use crate::contexts::security_log_context::add_security_log;
use crate::contexts::{
    account_selector_context::AccountSelectorContext, accounts_context::AccountsContext,
};
use crate::utils::{Resolution, is_debug_enabled, proxify_url};

#[derive(Debug, Clone, Deserialize)]
pub struct SocialProfileData {
    #[serde(flatten)]
    pub accounts: HashMap<AccountId, SocialAccountProfile>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SocialAccountProfile {
    pub profile: Option<SocialProfile>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SocialProfile {
    pub image: Option<SocialImage>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SocialImage {
    pub ipfs_cid: Option<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ModalState {
    AccountList,
    Creating {
        parent: AccountCreateParent,
        recovery_method: AccountCreateRecoveryMethod,
    },
    LoggingIn,
    LoggedOut(Vec<AccountId>),
}

#[derive(Debug, Clone, PartialEq)]
pub enum AccountCreateParent {
    Mainnet,
    Testnet,
    SubAccount(Network, AccountId),
    CustomRelayer(String, Network, AccountId),
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AccountCreateRecoveryMethod {
    RecoveryPhrase,
    EthereumWallet,
    SolanaWallet,
    Ledger,
}

#[derive(Clone, Copy, PartialEq)]
pub enum LoginMethod {
    NotSelected,
    SeedPhrase,
    PrivateKey,
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
pub fn AccountEntry(
    account_id: AccountId,
    profile_images: ReadSignal<HashMap<AccountId, Option<String>>>,
    account_network: Network,
    drag_state: Signal<Option<DragState>>,
    account_index: Signal<usize>,
) -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let (is_hovered, set_is_hovered) = signal(false);

    let account_id_str = account_id.to_string();

    let account_id_for_switch = account_id.clone();
    let account_id_for_style = account_id.clone();
    let account_id_for_gradient = account_id.clone();
    let account_id_for_profile = account_id.clone();
    let account_id_for_display = account_id.clone();

    let is_dragging_this_element = Signal::derive(move || {
        drag_state
            .get()
            .filter(|d| d.is_active && d.start_index == account_index.get())
            .is_some()
    });

    let transform_offset_y = move || {
        let Some(drag) = drag_state.get() else {
            return 0.0;
        };

        if !drag.is_active {
            return 0.0;
        }

        let current_index = account_index.get();
        let drag_index = drag.start_index;

        // If this is the element being dragged, return just the drag offset
        if current_index == drag_index {
            return drag.y_delta;
        }

        // Calculate the target position of the dragged element
        let moved_elements = (drag.y_delta / ACCOUNT_ENTRY_TOTAL_HEIGHT_PX).round() as isize;
        let target_index = if moved_elements > 0 {
            drag_index
                .saturating_add(moved_elements.unsigned_abs())
                .min(accounts_context.accounts.get_untracked().accounts.len() - 1)
        } else {
            drag_index.saturating_sub(moved_elements.unsigned_abs())
        };

        // Determine if this element should shift and by how much
        if drag_index < target_index {
            if current_index > drag_index && current_index <= target_index {
                return -ACCOUNT_ENTRY_TOTAL_HEIGHT_PX;
            }
        } else if drag_index > target_index
            && current_index < drag_index
            && current_index >= target_index
        {
            return ACCOUNT_ENTRY_TOTAL_HEIGHT_PX;
        }

        0.0
    };

    let switch_account = move |_| {
        if !is_dragging_this_element() {
            accounts_context.set_accounts.update(|accounts| {
                accounts.selected_account_id = Some(account_id_for_switch.clone());
            });
        }
    };

    let first_char = move || {
        account_id_for_display
            .as_str()
            .chars()
            .next()
            .unwrap()
            .to_uppercase()
            .collect::<String>()
    };

    view! {
        <button
            class=move || {
                if is_dragging_this_element.get() {
                    "w-full h-28 aspect-square rounded-lg transition-colors flex flex-col items-center justify-center gap-1 p-1 group cursor-grabbing z-10000"
                } else {
                    "w-full h-28 aspect-square rounded-lg transition-colors flex flex-col items-center justify-center gap-1 p-1 group"
                }
            }
            style=move || {
                let mut styles = Vec::new();
                if accounts_context.accounts.get().selected_account_id
                    == Some(account_id_for_style.clone())
                {
                    styles.push("background-color: rgb(38 38 38)".to_string());
                } else {
                    styles.push("background-color: rgb(10 10 10)".to_string());
                }
                let offset = transform_offset_y();
                if is_dragging_this_element() {
                    styles.push(format!("transform: translateY({offset}px)"));
                    styles.push("transition: background-color 200ms".to_string());
                } else {
                    styles.push(format!("transform: translateY({offset}px)"));
                    styles
                        .push(
                            "transition: background-color 200ms, transform 300ms cubic-bezier(0.4, 0, 0.2, 1)"
                                .to_string(),
                        );
                }
                styles.join(";")
            }
            on:click=switch_account
            on:mouseenter=move |_| set_is_hovered.set(true)
            on:mouseleave=move |_| set_is_hovered.set(false)
        >
            <div class="relative">
                <div
                    class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium transition-all duration-200 group-hover:text-black overflow-hidden"
                    style=move || {
                        let brightness = if is_hovered.get() { 2.5 } else { 1.0 };
                        let background = get_account_gradient(
                            account_id_for_gradient.as_str(),
                            brightness,
                        );
                        format!("background: {background}")
                    }
                >
                    <div class="relative h-full w-full flex items-center justify-center">
                        {move || {
                            let profile_image = profile_images
                                .get()
                                .get(&account_id_for_profile)
                                .cloned()
                                .flatten();
                            if let Some(image_url) = profile_image {
                                view! {
                                    <img
                                        src=proxify_url(&image_url, Resolution::Low)
                                        alt="Profile"
                                        class="w-full h-full object-cover rounded-full"
                                    />
                                }
                                    .into_any()
                            } else {
                                view! { {first_char()} }.into_any()
                            }
                        }}
                        {move || {
                            if matches!(account_network, Network::Testnet) {
                                view! {
                                    <div class="absolute bottom-0 left-0 right-0 h-[25%] bg-yellow-500 text-black text-[8px] font-bold flex items-center justify-center">
                                        "TEST"
                                    </div>
                                }
                                    .into_any()
                            } else if matches!(account_network, Network::Localnet(_)) {
                                view! {
                                    <div class="absolute bottom-0 left-0 right-0 h-[30%] bg-green-500 text-black text-[8px] font-bold flex items-center justify-center pb-0.5">
                                        "LOCAL"
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
}

const ACCOUNT_ENTRY_HEIGHT_PX: f64 = 112.0;
const ACCOUNT_ENTRY_SPACING_PX: f64 = 8.0;
const ACCOUNT_ENTRY_TOTAL_HEIGHT_PX: f64 = ACCOUNT_ENTRY_HEIGHT_PX + ACCOUNT_ENTRY_SPACING_PX;
const DRAG_ACTIVATION_DELAY_MS: u64 = 200;
const AUTO_SCROLL_INTERVAL_MS: u64 = 16;
const AUTO_SCROLL_EDGE_ZONE_PX: f64 = 50.0;
const AUTO_SCROLL_SPEED_PX: f64 = 7.0;

#[derive(Debug, Clone)]
pub struct DragState {
    start_index: usize,
    y_delta: f64,
    is_active: bool,
    mouse_y: f64,
}

fn handle_drag_reorder(drag: &DragState, accounts_context: &AccountsContext) {
    let moved_elements = (drag.y_delta / ACCOUNT_ENTRY_TOTAL_HEIGHT_PX).round() as isize;
    let drag_index = drag.start_index;
    let accounts_len = accounts_context.accounts.get_untracked().accounts.len();

    let target_index = if moved_elements > 0 {
        drag_index
            .saturating_add(moved_elements.unsigned_abs())
            .min(accounts_len - 1)
    } else {
        drag_index.saturating_sub(moved_elements.unsigned_abs())
    };

    if drag_index != target_index {
        accounts_context.set_accounts.update(|accounts| {
            let account = accounts.accounts.remove(drag_index);
            accounts.accounts.insert(target_index, account);
        });
    }
}

#[component]
pub fn AccountSelector() -> impl IntoView {
    let accounts_context = expect_context::<AccountsContext>();
    let AccountSelectorContext {
        swipe_progress,
        is_expanded,
        set_expanded,
        set_swipe_progress,
        modal_state,
        set_modal_state,
    } = expect_context::<AccountSelectorContext>();
    let (show_security_alert, set_show_security_alert) = signal(false);
    let (profile_images, set_profile_images) =
        signal::<HashMap<AccountId, Option<String>>>(HashMap::new());
    let network = expect_context::<NetworkContext>();
    let location = use_location();

    let (drag_state, set_drag_state) = signal::<Option<DragState>>(None);
    let scroll_container_ref = NodeRef::<leptos::html::Div>::new();
    let (last_touch_y, set_last_touch_y) = signal::<Option<f64>>(None);
    let (last_scroll_pos, set_last_scroll_pos) = signal::<Option<i32>>(None);
    // The contianer grows if we keep increasing translateY, so store the original height for the scroll limit
    let (original_container_height, set_original_container_height) = signal::<Option<i32>>(None);

    let _ = use_event_listener(window(), mousemove, move |event| {
        if let Some(drag) = drag_state.get()
            && drag.is_active
        {
            set_drag_state.update(|d| {
                if let Some(drag) = d {
                    drag.y_delta += event.movement_y() as f64;
                    drag.mouse_y = event.client_y() as f64;
                }
            });
        }
    });

    let _ = use_event_listener(window(), mouseup, move |_| {
        if let Some(drag) = drag_state.get() {
            if drag.is_active {
                handle_drag_reorder(&drag, &accounts_context);
            }
            set_drag_state.set(None);
        }
        set_original_container_height.set(None);
    });

    let _ = use_event_listener_with_options(
        window(),
        touchmove,
        move |event: TouchEvent| {
            if let Some(drag) = drag_state.get()
                && drag.is_active
            {
                event.prevent_default();
                if let Some(touch) = event.touches().get(0) {
                    let current_y = touch.client_y() as f64;
                    if let Some(last_y) = last_touch_y.get() {
                        let movement_y = current_y - last_y;
                        set_drag_state.update(|d| {
                            if let Some(drag) = d {
                                drag.y_delta += movement_y;
                                drag.mouse_y = current_y;
                            }
                        });
                    }
                    set_last_touch_y.set(Some(current_y));
                }
            }
        },
        UseEventListenerOptions::default().passive(false),
    );

    let _ = use_event_listener(window(), touchend, move |_: TouchEvent| {
        set_last_touch_y.set(None);
        if let Some(drag) = drag_state.get() {
            if drag.is_active {
                handle_drag_reorder(&drag, &accounts_context);
            }
            set_drag_state.set(None);
        }
        set_original_container_height.set(None);
    });

    let _ = use_event_listener(window(), touchcancel, move |_: TouchEvent| {
        set_last_touch_y.set(None);
        set_drag_state.set(None);
        set_original_container_height.set(None);
    });

    let _ = use_event_listener(scroll_container_ref, scroll, move |_| {
        if let Some(drag) = drag_state.get() {
            if drag.is_active
                && let Some(container) = scroll_container_ref.get()
            {
                let current_scroll = container.scroll_top();
                if let Some(last_scroll) = last_scroll_pos.get() {
                    let scroll_delta = current_scroll - last_scroll;
                    set_drag_state.update(|d| {
                        if let Some(d) = d {
                            d.y_delta += scroll_delta as f64;
                        }
                    });
                }
                set_last_scroll_pos.set(Some(current_scroll));
            }
        } else {
            set_last_scroll_pos.set(None);
        }
    });

    let _ = use_interval_fn(
        move || {
            let Some(drag) = drag_state.get() else {
                return;
            };

            if !drag.is_active {
                return;
            }

            let Some(container) = scroll_container_ref.get() else {
                return;
            };

            let rect = container.get_bounding_client_rect();
            let mouse_y = drag.mouse_y;
            let container_top = rect.top();
            let container_bottom = rect.bottom();

            // Check if near top edge
            if mouse_y < container_top + AUTO_SCROLL_EDGE_ZONE_PX {
                let current_scroll = container.scroll_top();

                // Only scroll if we haven't reached the top
                if current_scroll > 0 {
                    let new_scroll =
                        ((current_scroll as f64 - AUTO_SCROLL_SPEED_PX).max(0.0)) as i32;

                    container.set_scroll_top(new_scroll);
                }
            }
            // Check if near bottom edge
            else if mouse_y > container_bottom - AUTO_SCROLL_EDGE_ZONE_PX {
                let Some(max_scroll) = original_container_height.get() else {
                    return;
                };
                let current_scroll = container.scroll_top();

                // Only scroll if we haven't reached the original bottom
                if current_scroll < max_scroll {
                    let new_scroll = ((current_scroll as f64 + AUTO_SCROLL_SPEED_PX)
                        .min(max_scroll as f64)) as i32;

                    container.set_scroll_top(new_scroll);
                }
            }
        },
        AUTO_SCROLL_INTERVAL_MS,
    );

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
                grouped
                    .entry(account.network.clone())
                    .or_default()
                    .push(account);
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
                    if let Err(Error::OtherQueryError(err)) = result
                        && err == format!("access key {public_key} does not exist while viewing")
                    {
                        logged_out_accounts.push(account.clone());
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
                    if let Some(selected_id) = accounts.selected_account_id.as_ref()
                        && logged_out_account_ids.contains(selected_id)
                    {
                        accounts.selected_account_id = None;
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
                set_expanded(true);
            }
        });
    };

    let fetch_profile_images = move || {
        let accounts = accounts_context.accounts.get_untracked();
        let current_network = network.network.get_untracked();

        if accounts.accounts.is_empty() || !profile_images.get_untracked().is_empty() {
            return;
        }

        let account_ids: Vec<AccountId> = accounts
            .accounts
            .iter()
            .filter(|account| account.network == current_network)
            .map(|account| account.account_id.clone())
            .collect();

        spawn_local(async move {
            let keys: Vec<String> = account_ids
                .iter()
                .map(|id| format!("{id}/profile/image/ipfs_cid"))
                .collect();

            let social_contract = match &current_network {
                Network::Mainnet => "social.near".parse::<AccountId>().unwrap(),
                Network::Testnet => "v1.social08.testnet".parse::<AccountId>().unwrap(),
                Network::Localnet(network) => {
                    if let Some(social_contract) = &network.social_contract {
                        social_contract.clone()
                    } else {
                        return;
                    }
                }
            };

            let rpc_client = current_network.default_rpc_client();

            let args = serde_json::json!({
                "keys": keys
            });

            if let Ok(response) = rpc_client
                .call::<SocialProfileData>(
                    social_contract,
                    "get",
                    args,
                    QueryFinality::Finality(Finality::DoomSlug),
                )
                .await
            {
                set_profile_images.update(|images| {
                    for account_id in account_ids {
                        if let Some(account_data) = response.accounts.get(&account_id)
                            && let Some(profile) = &account_data.profile
                                && let Some(image) = &profile.image
                                    && let Some(_ipfs_cid) = &image.ipfs_cid {
                                        images.insert(
                                            account_id.clone(),
                                            Some(format!(
                                                "https://i.near.social/magic/large/https://near.social/magic/img/account/{}",
                                                account_id
                                            )),
                                        );
                                    }
                        images.entry(account_id).or_insert(None);
                    }
                });
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

    // Fetch profile images when accounts change
    Effect::new(move |_| {
        accounts_context.accounts.track();
        fetch_profile_images();
    });

    // Show creation form immediately if there are no accounts
    Effect::new(move |_| {
        if accounts_context.accounts.get().accounts.is_empty()
            && !accounts_context.is_encrypted.get()
            && location.pathname.get_untracked() != "/auto-import-secret-key"
        {
            set_expanded(true);
            set_modal_state.set(ModalState::Creating {
                parent: match network.network.get() {
                    Network::Mainnet => AccountCreateParent::Mainnet,
                    Network::Testnet => AccountCreateParent::Testnet,
                    Network::Localnet { .. } => AccountCreateParent::Mainnet,
                },
                recovery_method: AccountCreateRecoveryMethod::RecoveryPhrase,
            });
        }
    });
    // Close selector when accounts change
    let selected_account_id_memo =
        Memo::new(move |_| accounts_context.accounts.get().selected_account_id.clone());
    Effect::new(move |_| {
        if selected_account_id_memo.get().is_some() {
            set_expanded(false);
        }
    });

    #[derive(Clone, PartialEq)]
    enum ModalStateType {
        LoggingIn,
        Creating,
        AccountList,
        LoggedOut(Vec<AccountId>),
    }
    let modal_state_type = Memo::new(move |_| match modal_state.get() {
        ModalState::LoggingIn => ModalStateType::LoggingIn,
        ModalState::Creating { .. } => ModalStateType::Creating,
        ModalState::AccountList => ModalStateType::AccountList,
        ModalState::LoggedOut(accounts) => ModalStateType::LoggedOut(accounts),
    });

    view! {
        <div
            class="absolute inset-0 z-50 transition-opacity duration-150"
            style=move || {
                if is_expanded.get() {
                    "opacity: 1; pointer-events: auto".to_string()
                } else {
                    format!("opacity: {}; pointer-events: none", swipe_progress.get())
                }
            }
        >
            {move || match modal_state_type.get() {
                ModalStateType::LoggingIn => {
                    view! {
                        <LoginForm show_back_button=!accounts_context
                            .accounts
                            .get_untracked()
                            .accounts
                            .is_empty() />
                    }
                        .into_any()
                }
                ModalStateType::Creating => {
                    view! {
                        <AccountCreationForm show_back_button=!accounts_context
                            .accounts
                            .get_untracked()
                            .accounts
                            .is_empty() />
                    }
                        .into_any()
                }
                ModalStateType::AccountList => {
                    view! {
                        <div>
                            <div
                                class="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] lg:rounded-3xl"
                                on:click=move |_| {
                                    set_expanded(false);
                                    set_swipe_progress(0.0);
                                }
                            />
                            <div class="absolute left-0 top-0 bottom-0 w-[100px] bg-neutral-950 lg:rounded-l-3xl">
                                <div class="p-2 h-full bg-neutral-950 flex flex-col lg:rounded-l-3xl">
                                    <div
                                        node_ref=scroll_container_ref
                                        class="flex-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                    >
                                        <button
                                            class="w-full h-16 aspect-square rounded-lg transition-colors flex flex-col items-center justify-center gap-1 text-neutral-400 group"
                                            on:click=move |_| set_expanded(false)
                                        >
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-neutral-300 mr-7 mb-1">
                                                <div class="group-hover:text-black">
                                                    <Icon icon=icondata::LuArrowLeft width="20px" height="20" />
                                                </div>
                                            </div>
                                        </button>
                                        <For
                                            each=move || {
                                                accounts_context
                                                    .accounts
                                                    .get()
                                                    .accounts
                                                    .into_iter()
                                                    .enumerate()
                                            }
                                            key=|(i, account)| (*i, account.account_id.clone())
                                            let((index, account))
                                        >
                                            <div
                                                on:mousedown=move |event| {
                                                    if let Some(container) = scroll_container_ref.get() {
                                                        set_last_scroll_pos.set(Some(container.scroll_top()));
                                                        let max_scroll = (container.scroll_height()
                                                            - container.client_height())
                                                            .max(0);
                                                        set_original_container_height.set(Some(max_scroll));
                                                    }
                                                    set_drag_state
                                                        .set(
                                                            Some(DragState {
                                                                start_index: index,
                                                                y_delta: 0.0,
                                                                is_active: false,
                                                                mouse_y: event.client_y() as f64,
                                                            }),
                                                        );
                                                    set_timeout(
                                                        move || {
                                                            if let Some(drag_state) = drag_state.get()
                                                                && drag_state.start_index == index {
                                                                    set_drag_state
                                                                        .update(|d| {
                                                                            if let Some(d) = d {
                                                                                d.is_active = true;
                                                                            }
                                                                        });
                                                                }
                                                        },
                                                        Duration::from_millis(DRAG_ACTIVATION_DELAY_MS),
                                                    );
                                                }
                                                on:touchstart=move |event: TouchEvent| {
                                                    if let Some(touch) = event.touches().get(0) {
                                                        let touch_y = touch.client_y() as f64;
                                                        set_last_touch_y.set(Some(touch_y));
                                                        if let Some(container) = scroll_container_ref.get() {
                                                            set_last_scroll_pos.set(Some(container.scroll_top()));
                                                            let max_scroll = (container.scroll_height()
                                                                - container.client_height())
                                                                .max(0);
                                                            set_original_container_height.set(Some(max_scroll));
                                                        }
                                                        set_drag_state
                                                            .set(
                                                                Some(DragState {
                                                                    start_index: index,
                                                                    y_delta: 0.0,
                                                                    is_active: false,
                                                                    mouse_y: touch_y,
                                                                }),
                                                            );
                                                        set_timeout(
                                                            move || {
                                                                if let Some(drag_state) = drag_state.get()
                                                                    && drag_state.start_index == index {
                                                                        set_drag_state
                                                                            .update(|d| {
                                                                                if let Some(d) = d {
                                                                                    d.is_active = true;
                                                                                }
                                                                            });
                                                                    }
                                                            },
                                                            Duration::from_millis(DRAG_ACTIVATION_DELAY_MS),
                                                        );
                                                    }
                                                }
                                            >
                                                <AccountEntry
                                                    account_id=account.account_id.clone()
                                                    profile_images=profile_images
                                                    account_network=account.network.clone()
                                                    drag_state=drag_state.into()
                                                    account_index=Signal::derive(move || index)
                                                />
                                            </div>
                                        </For>
                                    </div>

                                    <div class="flex gap-2 flex-col bg-neutral-900 mt-2 lg:rounded-bl-3xl transition-all duration-200">
                                        <button
                                            class="w-full aspect-square transition-colors flex flex-col items-center justify-center gap-1 p-1 text-green-500 group hover:bg-green-500/10"
                                            on:click=move |_| {
                                                set_modal_state
                                                    .set(ModalState::Creating {
                                                        parent: match network.network.get() {
                                                            Network::Mainnet => AccountCreateParent::Mainnet,
                                                            Network::Testnet => AccountCreateParent::Testnet,
                                                            Network::Localnet { .. } => AccountCreateParent::Mainnet,
                                                        },
                                                        recovery_method: AccountCreateRecoveryMethod::RecoveryPhrase,
                                                    })
                                            }
                                        >
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20 group-hover:bg-neutral-300">
                                                <div class="group-hover:text-black">
                                                    <Icon icon=icondata::LuPlus width="16" height="16" />
                                                </div>
                                            </div>
                                            <div class="text-xs text-center">"Add"</div>
                                        </button>

                                        <A
                                            href="/settings/security"
                                            attr:class="w-full aspect-square lg:rounded-bl-3xl transition-colors flex flex-col items-center justify-center gap-1 p-1 text-neutral-400 group hover:bg-neutral-500/10"
                                            on:click=move |_| set_expanded(false)
                                        >
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-500/20 group-hover:bg-neutral-300">
                                                <div class="group-hover:text-black">
                                                    <Icon icon=icondata::LuSettings width="16" height="16" />
                                                </div>
                                            </div>
                                            <div class="text-xs text-center">"Settings"</div>
                                        </A>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                }
                ModalStateType::LoggedOut(accounts) => {
                    view! {
                        <div>
                            <div
                                class="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] lg:rounded-3xl"
                                on:click=move |_| set_expanded(false)
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
                                            on:click=move |_| set_expanded(false)
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
