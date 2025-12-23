use bigdecimal::{BigDecimal, FromPrimitive, ToPrimitive};
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::A;
use rand::seq::SliceRandom;
use std::collections::HashMap;

use crate::{
    components::tooltip::Tooltip,
    contexts::{
        network_context::{Network, NetworkContext},
        tokens_context::{Token, TokenInfo, TokenScore, TokensContext},
    },
    data::learn::ARTICLES,
    utils::{balance_to_decimal, format_usd_value_no_hide},
};

#[derive(Clone)]
pub struct TrendingToken {
    pub name: String,
    pub symbol: String,
    pub price: BigDecimal,
    pub change_24h: BigDecimal,
    pub account_id: Token,
}

#[derive(Clone)]
pub struct Article {
    pub title: String,
    pub url: String,
    pub image_url: String,
}

async fn fetch_trending_tokens(network: Network) -> Vec<TrendingToken> {
    let api_url = match network {
        Network::Mainnet => "https://prices.intear.tech".to_string(),
        Network::Testnet => "https://prices-testnet.intear.tech".to_string(),
        Network::Localnet(network) => {
            if let Some(url) = &network.prices_api_url {
                url.clone()
            } else {
                return vec![];
            }
        }
    };
    let response = reqwest::get(format!("{api_url}/tokens"))
        .await
        .unwrap()
        .json::<HashMap<String, TokenInfo>>()
        .await
        .unwrap();

    #[allow(clippy::float_arithmetic)] // Ranking is not precision-critical
    let mut tokens_with_scores: Vec<(f64, TrendingToken)> = response
        .into_iter()
        .filter(|(_, data)| {
            data.account_id != Token::Nep141("wrap.near".parse().unwrap())
                && data.account_id != Token::Nep141("wrap.testnet".parse().unwrap())
                && data.account_id != Token::Near
                && data.price_usd_hardcoded != BigDecimal::from(1)
        })
        .map(|(_, data)| {
            let change_24h = if data.price_usd_raw_24h_ago > BigDecimal::from(0) {
                ((&data.price_usd_raw - &data.price_usd_raw_24h_ago) / &data.price_usd_raw_24h_ago)
                    .to_f64()
                    .expect("Could not convert to f64")
                    * 100.0
            } else {
                0.0
            };

            let trending_score = data.volume_usd_24h.sqrt() * data.liquidity_usd.log2();
            let trending_score = match change_24h {
                ..-50.0 => trending_score * 0.25,
                ..-25.0 => trending_score * 0.5,
                ..0.0 => trending_score * 0.8,
                ..25.0 => trending_score * 1.0,
                ..100.0 => trending_score * 1.25,
                _ => trending_score * 1.5,
            };
            // No rugs / illiquid tokens
            let trending_score = if data.liquidity_usd < 3000.0
                || matches!(data.reputation, TokenScore::Spam)
                || data.volume_usd_24h < 1000.0
            {
                0.0
            } else {
                trending_score
            };

            (
                trending_score,
                TrendingToken {
                    name: data.metadata.name,
                    symbol: data.metadata.symbol,
                    price: data.price_usd,
                    change_24h: BigDecimal::from_f64(change_24h)
                        .expect("Could not convert to BigDecimal"),
                    account_id: data.account_id,
                },
            )
        })
        .collect();

    // Sort by trending score in descending order
    tokens_with_scores.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));

    // Take top 10 tokens and extract just the tokens
    tokens_with_scores
        .into_iter()
        .take(10)
        .map(|(_, token)| token)
        .collect()
}

#[component]
pub fn TrendingTokensSection() -> impl IntoView {
    let (show_all, set_show_all) = signal(false);
    let network = expect_context::<NetworkContext>().network;
    let tokens =
        LocalResource::new(move || async move { fetch_trending_tokens(network.get()).await });
    Effect::new(move || {
        network.track();
        tokens.refetch();
    });

    view! {
        <div class="bg-neutral-900 rounded-xl p-4 mb-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-white text-xl font-semibold">Trending Tokens</h2>
                <div class="text-neutral-400 text-sm">24h</div>
            </div>
            <Suspense fallback=move || {
                view! {
                    <div class="flex items-center justify-center h-32">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            }>
                {move || {
                    tokens
                        .get()
                        .map(|tokens| {
                            let displayed_tokens = tokens
                                .iter()
                                .take(if show_all.get() { 10 } else { 3 })
                                .cloned()
                                .collect::<Vec<_>>();

                            view! {
                                <div class="space-y-0 rounded-lg overflow-hidden">
                                    {displayed_tokens
                                        .iter()
                                        .cloned()
                                        .enumerate()
                                        .map(|(index, token)| {
                                            let token_id = match &token.account_id {
                                                Token::Near => "near".to_string(),
                                                Token::Nep141(account_id) => account_id.to_string(),
                                                Token::Rhea(account_id) => account_id.to_string(),
                                            };
                                            view! {
                                                <A
                                                    href=format!("/token/{}", token_id)
                                                    attr:class="flex justify-between items-center p-2 even:bg-neutral-800 odd:bg-neutral-700 hover:bg-neutral-600 transition-colors duration-100"
                                                >
                                                    <div class="flex items-center gap-3">
                                                        <div class="text-neutral-400 text-sm w-4 ml-2">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div class="text-white font-medium">
                                                                {token.name.clone()}
                                                            </div>
                                                            <div class="text-neutral-400 text-sm">
                                                                {token.symbol.clone()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="text-right">
                                                        <div class="text-white">
                                                            {format_usd_value_no_hide(token.price)}
                                                        </div>
                                                        <div style=format!(
                                                            "color: {}",
                                                            if token.change_24h >= BigDecimal::from(0) {
                                                                "rgb(34 197 94)"
                                                            } else {
                                                                "rgb(239 68 68)"
                                                            },
                                                        )>
                                                            {format!(
                                                                "{}{:.1}%",
                                                                if token.change_24h >= BigDecimal::from(0) {
                                                                    "+"
                                                                } else {
                                                                    ""
                                                                },
                                                                token.change_24h,
                                                            )}
                                                        </div>
                                                    </div>
                                                </A>
                                            }
                                        })
                                        .collect::<Vec<_>>()}
                                </div>
                            }
                        })
                }}
            </Suspense>
            <div class="flex justify-end mt-3">
                <button
                    on:click=move |_| set_show_all.update(|v| *v = !*v)
                    class="flex items-center gap-1 text-neutral-300 hover:text-white text-sm px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 cursor-pointer transition-colors"
                >
                    {move || if show_all.get() { "Show Less" } else { "Show More" }}
                    {move || {
                        if show_all.get() {
                            view! { <Icon icon=icondata::LuChevronUp width="16" height="16" /> }
                        } else {
                            view! { <Icon icon=icondata::LuChevronDown width="16" height="16" /> }
                        }
                    }}
                </button>
            </div>
        </div>
    }
}

#[component]
pub fn LearnSection() -> impl IntoView {
    let (displayed_count, set_displayed_count) = signal(1);

    // Create a signal to store the shuffled articles order
    let shuffled_articles = signal({
        let mut rng = rand::thread_rng();
        let mut articles: Vec<_> = ARTICLES.iter().collect();
        articles.shuffle(&mut rng);
        articles
    });

    let displayed_articles = move || {
        shuffled_articles
            .0
            .get()
            .iter()
            .take(displayed_count.get())
            .map(|(title, url, image_url)| Article {
                title: title.to_string(),
                url: url.to_string(),
                image_url: image_url.to_string(),
            })
            .collect::<Vec<_>>()
    };

    let show_more_visible = move || displayed_count.get() < ARTICLES.len();

    view! {
        <div class="bg-neutral-900 rounded-xl p-4 mb-4">
            <h2 class="text-white text-xl font-semibold mb-4">Learn</h2>
            <div class="space-y-0 rounded-lg overflow-hidden">
                {move || {
                    displayed_articles()
                        .iter()
                        .enumerate()
                        .map(|(index, article)| {
                            view! {
                                <a
                                    href=article.url.clone()
                                    target="_blank"
                                    class="block hover:opacity-90 transition-opacity p-4 group"
                                    style=format!(
                                        "background-color: {}",
                                        if index % 2 == 0 {
                                            "rgba(38, 38, 38, 0.5)"
                                        } else {
                                            "rgba(55, 55, 55, 0.5)"
                                        },
                                    )
                                >
                                    <div class="flex flex-col gap-2">
                                        <div class="w-full rounded-lg overflow-hidden">
                                            <img
                                                src=article.image_url.clone()
                                                alt=""
                                                class="w-full group-hover:scale-105 group-hover:saturate-[120%] transition-all duration-500"
                                            />
                                        </div>
                                        <div class="text-white font-medium">
                                            {article.title.clone()}
                                        </div>
                                    </div>
                                </a>
                            }
                        })
                        .collect::<Vec<_>>()
                }}
            </div>
            {move || {
                if show_more_visible() {
                    view! {
                        <div class="flex justify-end mt-3">
                            <button
                                on:click=move |_| {
                                    set_displayed_count
                                        .update(|count| *count = (*count + 5).min(ARTICLES.len()));
                                }
                                class="flex items-center gap-1 text-neutral-300 hover:text-white text-sm px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 cursor-pointer transition-colors"
                            >
                                "Show More"
                                <Icon icon=icondata::LuChevronDown width="16" height="16" />
                            </button>
                        </div>
                    }
                        .into_any()
                } else {
                    ().into_any()
                }
            }}
        </div>
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum RecommendationType {
    Ref,
    Stables,
    Staking,
    Shitzu,
    Firedrops,
}

#[component]
pub fn ForYouSection() -> impl IntoView {
    let TokensContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokensContext>();

    let recommendations = move || {
        let mut recs = Vec::new();
        let tokens_data = tokens.get();

        // Calculate total portfolio value
        let total_value: BigDecimal = tokens_data
            .iter()
            .map(|token| {
                let normalized_balance =
                    balance_to_decimal(token.balance, token.token.metadata.decimals);
                &normalized_balance * &token.token.price_usd
            })
            .sum();

        // Add Shitzu Boost recommendation if total value is less than $100
        if total_value < BigDecimal::from(100) {
            recs.push((
                "Earn with Shitzu Boost",
                "https://t.me/ShitzuTasks",
                "Complete simple tasks to earn rewards in $SHITZU",
                vec![],
                RecommendationType::Shitzu,
            ));
            recs.push((
                "Collect Firedrops",
                "https://t.me/firedrops_board",
                "Get $0.04+ for a few clicks",
                vec![],
                RecommendationType::Firedrops,
            ));
        }

        // Check for stables holdings
        let stable_tokens = tokens_data
            .iter()
            .filter_map(|token| {
                const DAI: &str = "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near";
                const USDC: &str =
                    "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1";
                const FRAX: &str = "853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near";
                const USDT: &str = "usdt.tether-token.near";
                const USDCE: &str = "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near";
                const USDTE: &str = "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near";
                const STABLES: &[&str] = &[DAI, USDC, FRAX, USDT, USDCE, USDTE];

                if STABLES.contains(&match &token.token.account_id {
                    Token::Nep141(account_id) => account_id.as_str(),
                    Token::Near => return None,
                    Token::Rhea(_) => return None,
                }) {
                    let normalized_balance =
                        balance_to_decimal(token.balance, token.token.metadata.decimals);
                    if normalized_balance >= BigDecimal::from(100) {
                        Some((
                            token.token.metadata.icon.clone(),
                            token.token.metadata.symbol.clone(),
                        ))
                    } else {
                        None
                    }
                } else {
                    None
                }
            })
            .collect::<Vec<_>>();

        if !stable_tokens.is_empty() {
            recs.push((
                "Deposit stables on Rhea Lending with 9%+ APY",
                "https://lending.rhea.finance/",
                "Earn high yields on your stablecoins",
                stable_tokens,
                RecommendationType::Stables,
            ));
        }

        // Check for NEAR holdings
        let near_tokens = tokens_data
            .iter()
            .filter_map(|token| {
                if token.token.account_id == Token::Nep141("wrap.near".parse().unwrap())
                    || token.token.account_id == Token::Nep141("wrap.testnet".parse().unwrap())
                    || token.token.account_id == Token::Near
                {
                    let normalized_balance =
                        balance_to_decimal(token.balance, token.token.metadata.decimals);
                    if normalized_balance >= BigDecimal::from(100) {
                        Some((
                            token.token.metadata.icon.clone(),
                            token.token.metadata.symbol.clone(),
                        ))
                    } else {
                        None
                    }
                } else {
                    None
                }
            })
            .collect::<Vec<_>>();

        if !near_tokens.is_empty() {
            recs.push((
                "Stake NEAR with our validator for 9% APY",
                "",
                "Earn staking rewards on your NEAR + bonus in $pTEAR",
                near_tokens,
                RecommendationType::Staking,
            ));
        }

        // Check for REF holdings
        let ref_tokens = tokens_data
            .iter()
            .filter_map(|token| {
                if token.token.account_id
                    == Token::Nep141("token.v2.ref-finance.near".parse().unwrap())
                {
                    let normalized_balance =
                        balance_to_decimal(token.balance, token.token.metadata.decimals);
                    let usd_value = &normalized_balance * &token.token.price_usd;
                    if usd_value >= BigDecimal::from(50) {
                        Some((
                            token.token.metadata.icon.clone(),
                            token.token.metadata.symbol.clone(),
                        ))
                    } else {
                        None
                    }
                } else {
                    None
                }
            })
            .collect::<Vec<_>>();

        if !ref_tokens.is_empty() {
            recs.push((
                "Stake $REF for 6.01% APY",
                "https://dex.rhea.finance/xref",
                "No unstaking delay, revenue comes from Rhea fees",
                ref_tokens,
                RecommendationType::Ref,
            ));
        }

        recs
    };

    view! {
        <div class="mb-8">
            <h2 class="text-white text-xl font-semibold mb-4">Opportunities For You</h2>
            {move || {
                if loading_tokens.get() {
                    view! {
                        <div class="flex items-center justify-center h-32">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    }
                        .into_any()
                } else {
                    let recs = recommendations();
                    if recs.is_empty() {
                        view! {
                            <div class="bg-neutral-900 rounded-xl p-6 text-center">
                                <p class="text-white/60">
                                    No personalized recommendations available yet.
                                </p>
                            </div>
                        }
                            .into_any()
                    } else {
                        view! {
                            <div class="flex flex-col gap-3">
                                {recs
                                    .into_iter()
                                    .map(|(title, url, description, tokens, card_type)| {
                                        let (background_style, border_color, badge) = match card_type {
                                            RecommendationType::Ref => {
                                                (
                                                    "background-color: rgba(10, 41, 22, 0.9)",
                                                    "rgb(34, 197, 94)",
                                                    None,
                                                )
                                            }
                                            RecommendationType::Stables => {
                                                (
                                                    "background-color: rgba(15, 29, 69, 0.9)",
                                                    "rgb(34, 197, 94)",
                                                    None,
                                                )
                                            }
                                            RecommendationType::Staking => {
                                                (
                                                    "background-color: rgb(23, 23, 23)",
                                                    "rgb(234, 179, 8)",
                                                    Some(
                                                        view! {
                                                            <div class="text-yellow-500 font-medium flex items-center gap-1 text-xs mt-4">
                                                                <Icon icon=icondata::LuStar width="12" height="12" />
                                                                "By Wallet Creators"
                                                            </div>
                                                        },
                                                    ),
                                                )
                                            }
                                            RecommendationType::Shitzu => {
                                                (
                                                    "background: #304030 url(\"/opportunity-shitzu-boost.png\") right/auto 300% no-repeat; background-position-x: calc(100% + 110px); background-blend-mode: multiply;",
                                                    "rgb(34, 197, 94)",
                                                    None,
                                                )
                                            }
                                            RecommendationType::Firedrops => {
                                                (
                                                    "background: #404030 url(\"/opportunity-hot-firedrops.svg\") right/auto 90% no-repeat; background-position-x: right; background-blend-mode: multiply;",
                                                    "rgb(34, 197, 94)",
                                                    None,
                                                )
                                            }
                                        };
                                        if card_type == RecommendationType::Staking {
                                            view! {
                                                <div
                                                    class="block rounded-xl p-[2px]"
                                                    style=format!("background-color: {}", border_color)
                                                >
                                                    <div class="rounded-xl p-6" style=background_style>
                                                        <div class="flex items-center gap-2 mb-2">
                                                            {tokens
                                                                .into_iter()
                                                                .map(|(icon, symbol)| {
                                                                    view! {
                                                                        <div class="flex items-center gap-1">
                                                                            {match icon {
                                                                                Some(icon) => {
                                                                                    view! {
                                                                                        <img
                                                                                            src=icon
                                                                                            alt=symbol.clone()
                                                                                            class="w-6 h-6 rounded-full"
                                                                                        />
                                                                                    }
                                                                                        .into_any()
                                                                                }
                                                                                None => {
                                                                                    view! {
                                                                                        <div class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                                                                                            {symbol.chars().next().unwrap_or('?')}
                                                                                        </div>
                                                                                    }
                                                                                        .into_any()
                                                                                }
                                                                            }}
                                                                        </div>
                                                                    }
                                                                })
                                                                .collect::<Vec<_>>()}
                                                        </div>
                                                        <div>
                                                            <div class="flex items-center gap-2">
                                                                <h3 class="text-white text-lg font-medium">{title}</h3>
                                                                <div class="hover-capable-only group relative">
                                                                    <Tooltip text="Airdrop points for an upcoming $TEAR token by wallet developers" />
                                                                </div>
                                                            </div>
                                                            <p class="text-white/60 mt-2">{description}</p>
                                                            <A
                                                                href="/stake"
                                                                attr:class="inline-flex items-center gap-1 text-white text-sm px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors mt-4"
                                                            >
                                                                "Stake"
                                                                <Icon icon=icondata::LuArrowRight width="16" height="16" />
                                                            </A>
                                                            {badge}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            view! {
                                                <a
                                                    href=url
                                                    target="_blank"
                                                    class="block rounded-xl hover:opacity-90 transition-opacity p-[2px]"
                                                    style=format!("background-color: {}", border_color)
                                                >
                                                    <div class="rounded-xl p-6" style=background_style>
                                                        <div class="flex items-center gap-2 mb-2">
                                                            {tokens
                                                                .into_iter()
                                                                .map(|(icon, symbol)| {
                                                                    view! {
                                                                        <div class="flex items-center gap-1">
                                                                            {match icon {
                                                                                Some(icon) => {
                                                                                    view! {
                                                                                        <img
                                                                                            src=icon
                                                                                            alt=symbol.clone()
                                                                                            class="w-6 h-6 rounded-full"
                                                                                        />
                                                                                    }
                                                                                        .into_any()
                                                                                }
                                                                                None => {
                                                                                    view! {
                                                                                        <div class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                                                                                            {symbol.chars().next().unwrap_or('?')}
                                                                                        </div>
                                                                                    }
                                                                                        .into_any()
                                                                                }
                                                                            }}
                                                                        </div>
                                                                    }
                                                                })
                                                                .collect::<Vec<_>>()}
                                                        </div>
                                                        <div>
                                                            <div class="flex items-center gap-2">
                                                                <h3 class="text-white text-lg font-medium">{title}</h3>
                                                            </div>
                                                            <p class="text-white/60 mt-2">{description}</p>
                                                            {badge}
                                                        </div>
                                                    </div>
                                                </a>
                                            }
                                                .into_any()
                                        }
                                    })
                                    .collect::<Vec<_>>()}
                            </div>
                        }
                            .into_any()
                    }
                }
            }}
        </div>
    }
}
