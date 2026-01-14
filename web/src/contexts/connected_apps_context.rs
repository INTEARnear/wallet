use std::collections::HashSet;

use chrono::{DateTime, Utc};
use leptos::prelude::*;
use near_min_api::types::{
    AccountId, Action, DeployGlobalContractAction, GlobalContractDeployMode, NearToken,
    TransferAction,
    near_crypto::{PublicKey, SecretKey},
};
use serde::{Deserialize, Serialize};

use crate::contexts::transaction_queue_context::TransactionType;

use super::transaction_queue_context::EnqueuedTransaction;

#[derive(Serialize, Deserialize, Debug, Clone, Copy, Default, PartialEq)]
pub enum ConnectorVersion {
    #[default]
    V1,
    V2,
    V3,
}

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq)]
pub struct ConnectedApp {
    /// The user's account that the app is connected to
    pub account_id: AccountId,
    /// The app's public key, used to differentiate between sessions and
    /// verify the app's identity
    pub public_key: PublicKey,
    /// If Some, the app's key is an actual access key on blockchain that
    /// can interact with this contract without user's confirmation
    pub requested_contract_id: Option<AccountId>,
    /// If requested_contract_id is Some, the app can call these methods
    /// without opening a wallet. If it's None, this should be empty
    pub requested_method_names: Vec<String>,
    /// If requested_contract_id is Some, the app can use this much gas
    /// without opening a wallet. If it's None, this should be zero
    pub requested_gas_allowance: NearToken,
    pub origin: String,
    pub connected_at: DateTime<Utc>,
    /// Automatically confirm transactions to these contracts that don't
    /// attach a deposit
    pub autoconfirm_contracts: HashSet<AccountId>,
    /// Automatically confirm all transactions that don't attach a deposit
    pub autoconfirm_non_financial: bool,
    /// Automatically confirm all transactions from this origin. Currently
    /// not used, as it's extremely dangerous.
    pub autoconfirm_all: bool,
    /// If this connection is no longer valid, this will be Some
    pub logged_out_at: Option<DateTime<Utc>>,
    /// Logout messages that are transported over bridge should be signed
    /// with this key. It's only used to log the user out of dapp UIs, so
    /// it's safe to leave unencrypted in localStorage.
    pub logout_key: SecretKey,
    /// The version of the connector that was used to connect to this app
    #[serde(default)]
    pub connector_version: ConnectorVersion,
}

impl ConnectedApp {
    pub fn should_autoconfirm(&self, transaction: &EnqueuedTransaction) -> bool {
        match &transaction.transaction_type {
            TransactionType::NearTransaction {
                actions,
                receiver_id,
            } => {
                if self.autoconfirm_all {
                    return true;
                }

                let attaches_deposit = actions.iter().any(action_attaches_deposit);

                if self.autoconfirm_non_financial && !attaches_deposit {
                    return true;
                }

                if self.autoconfirm_contracts.contains(receiver_id) && !attaches_deposit {
                    return true;
                }

                false
            }
            TransactionType::NearIntents { .. } | TransactionType::MetaTransaction { .. } => false,
        }
    }
}

pub fn action_attaches_deposit(action: &Action) -> bool {
    matches!(
        action,
        Action::Transfer(TransferAction { deposit, .. }) if !deposit.is_zero()
    ) || matches!(action, Action::FunctionCall(f) if !f.deposit.is_zero())
        || is_dangerous_action(action)
}

pub fn is_dangerous_action(action: &Action) -> bool {
    matches!(
        action,
        Action::AddKey(_)
            | Action::DeleteKey(_)
            | Action::DeployContract(_)
            | Action::DeleteAccount(_)
            | Action::Delegate(_)
            | Action::Stake(_)
            | Action::UseGlobalContract(_)
            | Action::DeployGlobalContract(DeployGlobalContractAction {
                deploy_mode: GlobalContractDeployMode::AccountId,
                ..
            })
    )
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct ConnectedAppsState {
    pub apps: Vec<ConnectedApp>,
}

#[derive(Clone, Copy)]
pub struct ConnectedAppsContext {
    pub apps: ReadSignal<ConnectedAppsState>,
    pub set_apps: WriteSignal<ConnectedAppsState>,
}

const CONNECTED_APPS_KEY: &str = "connected_apps";

fn get_local_storage() -> Option<web_sys::Storage> {
    window().local_storage().ok().flatten()
}

fn load_apps() -> ConnectedAppsState {
    get_local_storage()
        .and_then(|storage| storage.get_item(CONNECTED_APPS_KEY).ok())
        .flatten()
        .and_then(|json| serde_json::from_str(&json).ok())
        .unwrap_or_else(|| ConnectedAppsState { apps: vec![] })
}

fn save_apps(apps: &ConnectedAppsState) {
    if let Some(storage) = get_local_storage()
        && let Ok(json) = serde_json::to_string(apps)
    {
        let _ = storage.set_item(CONNECTED_APPS_KEY, &json);
    }
}

pub fn provide_connected_apps_context() {
    let (apps, set_apps) = signal(load_apps());

    // Save to localStorage whenever apps change
    Effect::new(move || {
        save_apps(&apps.get());
    });

    provide_context(ConnectedAppsContext { apps, set_apps });
}
