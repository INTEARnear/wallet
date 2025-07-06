use leptos::prelude::*;
use near_min_api::RpcClient;

use super::network_context::NetworkContext;

#[derive(Clone, Copy)]
pub struct RpcContext {
    pub client: RwSignal<RpcClient>,
}

pub fn provide_rpc_context() {
    let network = expect_context::<NetworkContext>().network;
    let client = network.get_untracked().default_rpc_client();
    let client_signal = RwSignal::new(client);
    Effect::new(move || {
        let network = network.get();
        let client = network.default_rpc_client();
        client_signal.set(client);
    });
    provide_context(RpcContext {
        client: client_signal,
    });
}
