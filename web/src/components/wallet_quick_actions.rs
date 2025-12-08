use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;

use crate::contexts::network_context::{Network, NetworkContext};

#[component]
pub fn WalletQuickActions() -> impl IntoView {
    let NetworkContext { network } = expect_context::<NetworkContext>();

    let show_nfts = move || match network.get() {
        Network::Mainnet => true,
        Network::Testnet => true,
        Network::Localnet(network) => network.fastnear_api_url.is_some(),
    };

    let show_stake = move || match network.get() {
        Network::Mainnet => true,
        Network::Testnet => true,
        Network::Localnet(network) => {
            network.fastnear_api_url.is_some() && !network.staking_pools.is_empty()
        }
    };

    let show_gifts = move || match network.get() {
        Network::Mainnet => true,
        Network::Testnet => false,
        Network::Localnet(_) => false,
    };

    view! {
        {move || {
            let buttons = vec![
                (show_nfts(), "/nfts", icondata::LuImage, "NFTs"),
                (show_stake(), "/stake", icondata::LuBeef, "Stake"),
                (show_gifts(), "/gifts", icondata::LuGift, "Gift"),
            ]
                .into_iter()
                .filter(|(show, _, _, _)| *show)
                .collect::<Vec<_>>();
            if buttons.is_empty() {
                return ().into_any();
            }
            let button_count = buttons.len();

            view! {
                <div
                    class="grid gap-4 mb-4"
                    style=format!("grid-template-columns: repeat({button_count}, minmax(0, 1fr))")
                >
                    {buttons
                        .into_iter()
                        .map(|(_, href, icon, label)| {
                            view! {
                                <A
                                    href=href
                                    attr:class="flex flex-col items-center justify-center gap-2 p-2 transition-colors rounded-lg hover:bg-neutral-900/50"
                                >
                                    <div class="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                                        <Icon icon=icon width="20" height="20" />
                                    </div>
                                    <span class="text-sm text-white">{label}</span>
                                </A>
                            }
                        })
                        .collect_view()}
                </div>
            }
                .into_any()
        }}
    }
}
