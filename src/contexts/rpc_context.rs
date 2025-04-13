use leptos::prelude::*;
use near_min_api::RpcClient;

#[derive(Clone)]
pub struct RpcContext {
    pub client: RwSignal<RpcClient>,
}

pub fn provide_rpc_context() {
    let client = RpcClient::new([
        "https://rpc.intear.tech",
        "https://rpc.shitzuapes.xyz",
        "https://rpc.near.org",
    ]);
    let client = RwSignal::new(client);
    provide_context(RpcContext { client });
}
