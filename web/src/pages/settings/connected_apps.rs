use chrono::Utc;
use futures_channel::oneshot;
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::*;
use near_min_api::types::{
    near_crypto::{PublicKey, Signature},
    AccountId, Action, DeleteKeyAction,
};
use serde::Deserialize;
use web_sys::js_sys::Date;

use crate::contexts::{
    accounts_context::AccountsContext,
    connected_apps_context::{ConnectedApp, ConnectedAppsContext},
    network_context::Network,
    security_log_context::add_security_log,
    transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
};

#[derive(Clone, Debug)]
enum AutoconfirmSetting {
    All,
    NonFinancial,
    Receiver(AccountId),
}

#[derive(Debug, Clone, Deserialize)]
enum LogoutCause {
    User,
    App,
}

#[derive(Debug, Clone, Deserialize)]
struct LogoutInfo {
    nonce: u64,
    signature: Signature,
    caused_by: LogoutCause,
}

#[derive(Debug, Clone, Deserialize)]
enum SessionStatus {
    Active,
    LoggedOut(LogoutInfo),
}

#[component]
pub fn ConnectedAppsSettings() -> impl IntoView {
    let ConnectedAppsContext { apps, set_apps } = expect_context::<ConnectedAppsContext>();
    let accounts_context = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();

    let log_out = move |account_id: &AccountId, public_key: &PublicKey| {
        let app = apps
            .get()
            .apps
            .iter()
            .find(|app| {
                app.account_id == *account_id
                    && app.public_key == *public_key
                    && app.logged_out_at.is_none()
            })
            .cloned();

        if let Some(app) = app {
            add_security_log(
                format!("Logged out of {app:?} on /logout (NOTE: some logouts made on dapp side might not be displayed on this page)"),
                app.account_id.clone(),
                accounts_context,
            );
            let action = Action::DeleteKey(Box::new(DeleteKeyAction {
                public_key: public_key.clone(),
            }));

            // If app has a function call key, delete it. Don't accidentally delete the
            // account's own full access key (even though the app technically needs a
            // signature from this key in order to add it).
            let details_receiver = if app.requested_contract_id.is_some()
                && app.public_key
                    != accounts_context
                        .accounts
                        .get()
                        .accounts
                        .into_iter()
                        .find(|account| account.account_id == *account_id)
                        .unwrap()
                        .secret_key
                        .public_key()
            {
                let (details_receiver, transaction) = EnqueuedTransaction::create(
                    format!("Remove function call key for {}", app.origin),
                    account_id.clone(),
                    account_id.clone(),
                    vec![action],
                );

                add_transaction.update(|queue| queue.push(transaction));
                details_receiver
            } else {
                let (_tx, rx) = oneshot::channel();
                // Awaiting rx will immediately error out, as tx is dropped, but we don't handle
                // transaction errors anyway
                rx
            };

            // Wait for transaction and logout request to complete before marking app as logged out
            spawn_local({
                let account_id = account_id.clone();
                let public_key = public_key.clone();
                async move {
                    let account = accounts_context
                        .accounts
                        .get_untracked()
                        .accounts
                        .into_iter()
                        .find(|account| account.account_id == *account_id)
                        .unwrap();
                    let url = dotenvy_macro::dotenv!("SHARED_LOGOUT_BRIDGE_SERVICE_ADDR");
                    let nonce = Date::now() as u64;
                    let request = reqwest::Client::new().post(format!(
                        "{url}/api/logout_user/{network}",
                        network = match &account.network {
                            Network::Mainnet => "mainnet".to_string(),
                            Network::Testnet => "testnet".to_string(),
                            Network::Localnet(network) => network.id.clone(),
                        }
                    ))
                    .json(&serde_json::json!({
                        "account_id": account_id,
                        "user_logout_public_key": account.secret_key.public_key(),
                        "app_public_key": public_key,
                        "nonce": nonce,
                        "signature": app.logout_key.sign(format!("logout|{nonce}|{account_id}|{public_key}").as_bytes())
                    }))
                    .send();
                    let (_tx_details, _logout_response) =
                        futures_util::join!(details_receiver, request);
                    set_apps.update(|state| {
                        if let Some(app) = state.apps.iter_mut().find(|app| {
                            app.account_id == account_id && app.public_key == public_key
                        }) {
                            app.logged_out_at = Some(Utc::now());
                        } else {
                            log::error!("App not found, couldn't mark as logged out");
                        }
                    });
                }
            });
        }
    };

    // Check status of active connections on mount
    Effect::new(move || {
        let active_apps = apps
            .get_untracked()
            .apps
            .into_iter()
            .filter(|app| app.logged_out_at.is_none())
            .filter(|app| {
                app.account_id
                    == accounts_context
                        .accounts
                        .get()
                        .selected_account_id
                        .expect("No selected account")
            })
            .collect::<Vec<_>>();
        let account = accounts_context
            .accounts
            .get()
            .accounts
            .into_iter()
            .find(|a| {
                a.account_id
                    == accounts_context
                        .accounts
                        .get()
                        .selected_account_id
                        .expect("No selected account")
            })
            .expect("Account not found");

        if !active_apps.is_empty() {
            spawn_local(async move {
                for app in active_apps {
                    let url = dotenvy_macro::dotenv!("SHARED_LOGOUT_BRIDGE_SERVICE_ADDR");
                    let network = match &account.network {
                        Network::Mainnet => "mainnet".to_string(),
                        Network::Testnet => "testnet".to_string(),
                        Network::Localnet(network) => network.id.clone(),
                    };
                    let nonce = Date::now() as u64;
                    let message = format!("check|{nonce}");
                    let check_signature = app.logout_key.sign(message.as_bytes());

                    match reqwest::Client::new()
                        .post(format!(
                            "{url}/api/check_logout/{network}/{}/{}",
                            app.account_id, app.public_key
                        ))
                        .json(&serde_json::json!({
                            "nonce": nonce,
                            "signature": check_signature,
                        }))
                        .send()
                        .await
                    {
                        Ok(response) => match response.json::<SessionStatus>().await {
                            Ok(status) => {
                                log::info!(
                                    "Connection status for {} on {}: {:?}",
                                    app.origin,
                                    app.account_id,
                                    status
                                );

                                if let SessionStatus::LoggedOut(logout_info) = status {
                                    let message = format!(
                                        "logout|{}|{}|{}",
                                        logout_info.nonce, app.account_id, app.public_key
                                    );

                                    let verify_key = match logout_info.caused_by {
                                        LogoutCause::User => app.logout_key.public_key(),
                                        LogoutCause::App => app.public_key.clone(),
                                    };

                                    if !logout_info
                                        .signature
                                        .verify(message.as_bytes(), &verify_key)
                                    {
                                        log::error!("Invalid logout signature");
                                        continue;
                                    }

                                    log_out(&app.account_id, &app.public_key);
                                }
                            }
                            Err(e) => {
                                log::error!(
                                    "Failed to parse status for {} on {}: {}",
                                    app.origin,
                                    app.account_id,
                                    e
                                );
                            }
                        },
                        Err(e) => {
                            log::error!(
                                "Failed to check status for {} on {}: {}",
                                app.origin,
                                app.account_id,
                                e
                            );
                        }
                    }
                }
            });
        }
    });

    let disable_autoconfirm =
        move |account_id: &AccountId, public_key: &PublicKey, setting: AutoconfirmSetting| {
            set_apps.update(|state| {
                let mut apps = state.apps.clone();
                if let Some(app) = apps
                    .iter_mut()
                    .find(|app| app.account_id == *account_id && app.public_key == *public_key)
                {
                    match setting {
                        AutoconfirmSetting::All => app.autoconfirm_all = false,
                        AutoconfirmSetting::NonFinancial => app.autoconfirm_non_financial = false,
                        AutoconfirmSetting::Receiver(receiver) => {
                            app.autoconfirm_contracts.remove(&receiver);
                        }
                    }
                } else {
                    log::error!("App not found, couldn't disable autoconfirm for {setting:?}");
                }
                state.apps = apps;
            });
        };

    view! {
        <div class="flex flex-col gap-4 p-4">
            <div class="text-xl font-semibold">Connected Apps</div>

            <div class="flex flex-col gap-4">
                <div class="text-sm text-neutral-400">
                    "Manage your connected applications and their permissions. You can revoke access or modify auto-confirmation settings here."
                </div>

                {move || {
                    let active_apps = apps
                        .get()
                        .apps
                        .into_iter()
                        .filter(|app| app.logged_out_at.is_none())
                        .filter(|app| {
                            app.account_id
                                == accounts_context
                                    .accounts
                                    .get()
                                    .selected_account_id
                                    .expect("No selected account")
                        })
                        .collect::<Vec<_>>();
                    if active_apps.is_empty() {
                        view! {
                            <div class="text-center text-neutral-400 py-8">"No connected apps"</div>
                        }
                            .into_any()
                    } else {
                        active_apps
                            .into_iter()
                            .map(|app| {
                                let render_setting = move |
                                    setting: AutoconfirmSetting,
                                    label: &'static str,
                                    app: &ConnectedApp|
                                {
                                    let account_id = app.account_id.clone();
                                    let public_key = app.public_key.clone();
                                    view! {
                                        <div class="flex items-center justify-between p-2 rounded bg-neutral-800">
                                            <span>{label}</span>
                                            <button
                                                on:click=move |_| disable_autoconfirm(
                                                    &account_id,
                                                    &public_key,
                                                    setting.clone(),
                                                )
                                                class="px-2 py-1 text-xs rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                                            >
                                                "Revoke"
                                            </button>
                                        </div>
                                    }
                                };
                                let account_id = app.account_id.clone();
                                let public_key = app.public_key.clone();
                                let requested_contract_id = app.requested_contract_id.clone();
                                let requested_method_names = app.requested_method_names.clone();
                                let app = app.clone();

                                view! {
                                    <div class="p-4 rounded-lg bg-neutral-900">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-3">
                                                <div class="p-2 rounded-md bg-neutral-800">
                                                    <Icon icon=icondata::LuGlobe width="20" height="20" />
                                                </div>
                                                <div>
                                                    <div class="font-medium wrap-anywhere">
                                                        {app.origin.clone()}
                                                    </div>
                                                    <div class="text-sm text-neutral-400">
                                                        "Connected to "
                                                        <span class="wrap-anywhere">
                                                            {app.account_id.to_string()}
                                                        </span>
                                                    </div>
                                                    {move || {
                                                        if let Some(contract_id) = &requested_contract_id {
                                                            let methods = if requested_method_names.is_empty() {
                                                                format!(
                                                                    "Can interact with {contract_id} without confirmation",
                                                                )
                                                            } else {
                                                                format!(
                                                                    "Can call {} on {contract_id} without confirmation",
                                                                    requested_method_names.join(", "),
                                                                )
                                                            };
                                                            view! {
                                                                <div class="text-sm text-yellow-500 mt-1 flex items-center gap-1">
                                                                    <Icon icon=icondata::LuShieldAlert width="14" height="14" />
                                                                    {methods}
                                                                </div>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            ().into_any()
                                                        }
                                                    }}
                                                </div>
                                            </div>
                                            <button
                                                on:click=move |_| log_out(&account_id, &public_key)
                                                class="px-3 py-1.5 text-sm text-red-500 rounded hover:bg-neutral-800 transition-colors min-w-24 cursor-pointer"
                                            >
                                                "Log out"
                                            </button>
                                        </div>

                                        <div class="mt-4 border-t border-neutral-800 pt-4">
                                            <div class="text-sm font-medium mb-2">
                                                "Auto-confirmation settings"
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                {move || {
                                                    let app = app.clone();
                                                    let mut settings = Vec::new();
                                                    if app.autoconfirm_all {
                                                        settings
                                                            .push(
                                                                render_setting(
                                                                        AutoconfirmSetting::All,
                                                                        "Auto-confirm all transactions",
                                                                        &app,
                                                                    )
                                                                    .into_any(),
                                                            );
                                                    }
                                                    if app.autoconfirm_non_financial {
                                                        settings
                                                            .push(
                                                                render_setting(
                                                                        AutoconfirmSetting::NonFinancial,
                                                                        "Auto-confirm non-financial transactions",
                                                                        &app,
                                                                    )
                                                                    .into_any(),
                                                            );
                                                    }
                                                    for receiver in app.autoconfirm_contracts {
                                                        let receiver = receiver.clone();
                                                        let public_key = app.public_key.clone();
                                                        let account_id = app.account_id.clone();
                                                        settings
                                                            .push(
                                                                view! {
                                                                    <div class="flex items-center justify-between p-2 rounded bg-neutral-800">
                                                                        <span>
                                                                            "Auto-confirm non-financial transactions for "
                                                                            <span class="font-mono wrap-anywhere">
                                                                                {receiver.to_string()}
                                                                            </span>
                                                                        </span>
                                                                        <button
                                                                            on:click=move |_| disable_autoconfirm(
                                                                                &account_id,
                                                                                &public_key,
                                                                                AutoconfirmSetting::Receiver(receiver.clone()),
                                                                            )
                                                                            class="px-2 py-1 text-xs rounded hover:bg-neutral-700 transition-colors"
                                                                        >
                                                                            "Revoke"
                                                                        </button>
                                                                    </div>
                                                                }
                                                                    .into_any(),
                                                            );
                                                    }
                                                    if settings.is_empty() {
                                                        settings
                                                            .push(
                                                                view! {
                                                                    <div class="text-sm text-neutral-400 p-2">
                                                                        "Auto-confirmation is not enabled"
                                                                    </div>
                                                                }
                                                                    .into_any(),
                                                            );
                                                    }
                                                    settings
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                }
                            })
                            .collect_view()
                            .into_any()
                    }
                }}
            </div>
        </div>
    }
}
