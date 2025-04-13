use leptos::prelude::*;
use near_min_api::RpcClient;

#[derive(Clone)]
pub struct RpcContext {
    pub client: RwSignal<RpcClient>,
}

pub fn provide_rpc_context() {
    let client = RpcClient::new(
        dotenvy_macro::dotenv!("RPC_URLS")
            .split(',')
            .map(String::from)
            .collect::<Vec<_>>(),
    );
    let client = RwSignal::new(client);
    provide_context(RpcContext { client });
}
