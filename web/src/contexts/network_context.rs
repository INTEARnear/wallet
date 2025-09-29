use leptos::prelude::*;
use near_min_api::RpcClient;
use serde::{Deserialize, Serialize};

use super::accounts_context::AccountsContext;

#[derive(Clone, Copy)]
pub struct NetworkContext {
    pub network: RwSignal<Network>,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, Hash)]
pub enum Network {
    Mainnet,
    Testnet,
}

impl Network {
    pub fn default_rpc_client(&self) -> RpcClient {
        RpcClient::new(match self {
            Network::Mainnet => dotenvy_macro::dotenv!("MAINNET_RPC_URLS")
                .split(',')
                .map(String::from)
                .collect::<Vec<_>>(),
            Network::Testnet => dotenvy_macro::dotenv!("TESTNET_RPC_URLS")
                .split(',')
                .map(String::from)
                .collect::<Vec<_>>(),
        })
    }
}

pub fn provide_network_context() {
    let accounts = expect_context::<AccountsContext>().accounts;
    let network = RwSignal::new(
        if let Some(selected_account) = accounts.get_untracked().selected_account_id {
            accounts
                .get_untracked()
                .accounts
                .iter()
                .find(|a| a.account_id == selected_account)
                .expect("Selected account not found")
                .network
                .clone()
        } else {
            Network::Mainnet
        },
    );
    Effect::new(move || {
        let selected_account = accounts.get().selected_account_id;
        if let Some(selected_account_id) = selected_account {
            if let Some(account) = accounts
                .get()
                .accounts
                .iter()
                .find(|a| a.account_id == selected_account_id)
            {
                if account.network != network.get() {
                    network.set(account.network.clone());
                }
            }
        }
    });
    provide_context(NetworkContext { network });
}
