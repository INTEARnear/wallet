use leptos::prelude::*;
use leptos_icons::*;

use crate::components::explore_components::{ForYouSection, LearnSection, TrendingTokensSection};
use crate::data::protocols::{get_protocols, Protocol, ProtocolCategory, ProtocolSize};

#[component]
pub fn Explore() -> impl IntoView {
    let protocols = LocalResource::new(get_protocols);

    let get_category_protocols = move |category: ProtocolCategory| {
        protocols
            .get()
            .map(|p| {
                p.iter()
                    .filter(|p| p.category == category)
                    .cloned()
                    .collect::<Vec<_>>()
            })
            .unwrap_or_default()
    };

    let render_protocol = move |protocol: &Protocol| {
        let size_style = match protocol.size {
            ProtocolSize::Small => "grid-column: span 1; grid-row: span 1",
            ProtocolSize::Large => "grid-column: span 2; grid-row: span 2",
        };

        let border_style = if protocol.is_sponsored {
            "border: 2px solid rgb(234 179 8)"
        } else {
            ""
        };

        view! {
            <a
                href=protocol.url.to_string()
                target="_blank"
                class="bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors relative overflow-hidden group"
                style=format!("{}; {}", size_style, border_style)
            >
                <div class="flex flex-col h-full">
                    <div class="aspect-square w-full overflow-hidden">
                        <img
                            src=protocol.image_url.to_string()
                            alt=protocol.name.clone()
                            class="w-full h-full object-cover  group-hover:scale-110 group-hover:saturate-[120%] transition-all duration-1000"
                        />
                    </div>
                    <div class="flex-1 flex flex-col p-3 pt-2 transition-all duration-100">
                        <h3
                            class="text-white mb-1 wrap-anywhere"
                            style=match protocol.size {
                                ProtocolSize::Large => "font-size: 20px; font-weight: 600;",
                                ProtocolSize::Small => "font-size: 16px; font-weight: 500;",
                            }
                        >
                            {protocol.name.clone()}
                        </h3>
                        <p class="text-white/60 text-xs mb-2 wrap-anywhere">
                            {protocol.description.clone()}
                        </p>
                        {if protocol.is_sponsored {
                            view! {
                                <div class="text-yellow-500 font-medium flex items-center gap-1 text-xs">
                                    <Icon icon=icondata::LuStar width="12" height="12" />
                                    "By Wallet Creators"
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }}
                    </div>
                </div>
            </a>
        }
    };

    let render_category = move |title: String, category: ProtocolCategory| {
        let protocols = get_category_protocols(category);
        view! {
            <div class="mb-8">
                <h2 class="text-white text-xl font-semibold mb-4">{title}</h2>
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 grid-flow-row-dense">
                    {protocols.iter().map(&render_protocol).collect::<Vec<_>>()}
                </div>
            </div>
        }
    };

    view! {
        <div class="pt-4 lg:p-2">
            <h1 class="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Explore NEAR Ecosystem
            </h1>
            {move || {
                if protocols.with(|p| p.is_none()) {
                    view! {
                        <div class="flex items-center justify-center h-32">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <>
                            <TrendingTokensSection />
                            {move || render_category("DeFi".to_string(), ProtocolCategory::DeFi)}
                            {move || render_category("AI".to_string(), ProtocolCategory::Ai)}
                            <ForYouSection />
                            {move || render_category(
                                "Featured Memecoins".to_string(),
                                ProtocolCategory::Memecoin,
                            )}
                            {move || render_category(
                                "Chain Abstraction".to_string(),
                                ProtocolCategory::ChainAbstraction,
                            )}
                            <LearnSection />
                            {move || render_category(
                                "Launchpad".to_string(),
                                ProtocolCategory::Launchpad,
                            )}
                            {move || render_category(
                                "Explorer".to_string(),
                                ProtocolCategory::Explorer,
                            )}
                            <div class="mb-8">
                                <a
                                    href="https://app.nearcatalog.org/"
                                    target="_blank"
                                    class="block bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:opacity-90 transition-opacity p-12"
                                >
                                    <h2 class="text-white text-3xl font-semibold mb-1">
                                        "📒NEARCatalog"
                                    </h2>
                                    <p class="text-white text-lg pt-4 font-medium">
                                        "Discover more projects"
                                    </p>
                                </a>
                            </div>
                            {move || render_category("NFTs".to_string(), ProtocolCategory::Nft)}
                            {move || render_category("Bots".to_string(), ProtocolCategory::Bot)}
                            {move || render_category("Games".to_string(), ProtocolCategory::Game)}
                            {move || render_category(
                                "Social".to_string(),
                                ProtocolCategory::Social,
                            )}
                            <div class="bg-neutral-900 rounded-xl p-6 text-center">
                                <h2 class="text-white text-xl font-semibold mb-2">
                                    Building on NEAR?
                                </h2>
                                <a
                                    href="https://github.com/INTEARnear/wallet"
                                    target="_blank"
                                    class="inline-flex items-center gap-2 text-white text-sm px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
                                >
                                    "Add your app"
                                    <Icon icon=icondata::LuArrowRight width="16" height="16" />
                                </a>
                            </div>
                        </>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
