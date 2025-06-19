use futures_util::future::join_all;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::hooks::use_navigate;
use leptos_router::{hooks::use_params_map, NavigateOptions};
use near_min_api::{
    types::{AccountId, Finality},
    QueryFinality, RpcClient,
};
use serde::{Deserialize, Serialize};
use std::time::Duration;
use web_sys::{window, MouseEvent};

use crate::contexts::nft_cache_context::NftCacheContext;
use crate::contexts::nft_cache_context::{NftContractMetadata, NftToken, OwnedCollection};
use crate::contexts::search_context::SearchContext;
use crate::contexts::{
    accounts_context::AccountsContext,
    config_context::{ConfigContext, HiddenNft, NftsViewState},
    network_context::Network,
    rpc_context::RpcContext,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct FastnearNftResponse {
    account_id: AccountId,
    tokens: Vec<FastnearNftResponseToken>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct FastnearNftResponseToken {
    contract_id: AccountId,
    last_update_block_height: Option<u64>,
}

async fn fetch_nft_metadata(
    contract_id: AccountId,
    rpc_client: RpcClient,
) -> Option<NftContractMetadata> {
    let nfts_context = expect_context::<NftCacheContext>();
    if let Some(cached) = nfts_context.cache.read().get(&contract_id) {
        return cached.metadata.clone();
    }
    (rpc_client
        .call::<NftContractMetadata>(
            contract_id,
            "nft_metadata",
            serde_json::json!({}),
            QueryFinality::Finality(Finality::DoomSlug),
        )
        .await)
        .ok()
}

async fn fetch_nfts_for_owner(
    contract_id: AccountId,
    account_id: AccountId,
    rpc_client: RpcClient,
) -> Vec<NftToken> {
    let nfts_context = expect_context::<NftCacheContext>();
    if let Some(cached) = nfts_context.cache.read().get(&contract_id) {
        return cached.tokens.clone();
    }
    rpc_client
        .call::<Vec<NftToken>>(
            contract_id,
            "nft_tokens_for_owner",
            serde_json::json!({
                "account_id": account_id.to_string()
            }),
            QueryFinality::Finality(Finality::DoomSlug),
        )
        .await
        .unwrap_or_default()
}

async fn fetch_nfts() -> Vec<OwnedCollection> {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let NftCacheContext { cache } = expect_context::<NftCacheContext>();

    let Some(selected_account_id) = accounts().selected_account_id else {
        return vec![];
    };

    if !cache.read().is_empty() {
        return cache.read().values().cloned().collect();
    }

    let Some(selected_account) = accounts()
        .accounts
        .into_iter()
        .find(|account| account.account_id == selected_account_id)
    else {
        return vec![];
    };

    let api_host = match selected_account.network {
        Network::Mainnet => "api.fastnear.com",
        Network::Testnet => "test.api.fastnear.com",
    };

    let Ok(response) = reqwest::get(format!(
        "https://{api_host}/v1/account/{selected_account_id}/nft"
    ))
    .await
    else {
        return vec![];
    };

    let Ok(nft_data) = response.json::<FastnearNftResponse>().await else {
        return vec![];
    };

    let rpc_client = expect_context::<RpcContext>().client.get().clone();

    let fetches = nft_data.tokens.into_iter().map(|token| {
        let contract_id = token.contract_id.clone();
        let rpc_client = rpc_client.clone();
        let selected_account_id = selected_account_id.clone();
        async move {
            let metadata_fut = fetch_nft_metadata(contract_id.clone(), rpc_client.clone());
            let tokens_fut =
                fetch_nfts_for_owner(contract_id.clone(), selected_account_id.clone(), rpc_client);
            let (metadata_opt, owned_tokens) =
                futures_util::future::join(metadata_fut, tokens_fut).await;
            OwnedCollection {
                contract_id,
                metadata: metadata_opt,
                tokens: owned_tokens,
            }
        }
    });

    let mut collections: Vec<OwnedCollection> = join_all(fetches).await;
    collections.retain(|c| !c.tokens.is_empty());
    cache.update(|map| {
        for collection in collections.iter() {
            map.insert(collection.contract_id.clone(), collection.clone());
        }
    });
    collections
}

fn compute_match_score(query: &str, text: &str) -> i32 {
    let query = query.to_lowercase();
    let text = text.to_lowercase();
    if query.is_empty() || text.is_empty() {
        return 0;
    }
    if query == text {
        100
    } else if text.starts_with(&query) {
        75
    } else if text.contains(&query) {
        50
    } else {
        0
    }
}

#[component]
pub fn NftCollection() -> impl IntoView {
    let params = use_params_map();
    let contract_id = move || params.get().get("collection_id").unwrap_or_default();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();

    let collection_metadata = LocalResource::new(move || {
        let rpc_client = client.get().clone();
        async move {
            let Ok(contract_id) = contract_id().parse() else {
                return None;
            };
            fetch_nft_metadata(contract_id, rpc_client).await
        }
    });

    let base_uri = move || {
        let Some(Some(metadata)) = collection_metadata.get() else {
            return String::new();
        };
        metadata.base_uri.clone().unwrap_or_default()
    };

    let nfts = LocalResource::new(move || {
        let rpc_client = expect_context::<RpcContext>().client.get().clone();
        async move {
            let Some(selected_account_id) = accounts().selected_account_id else {
                return vec![];
            };
            let Ok(contract_id) = contract_id().parse() else {
                return vec![];
            };
            fetch_nfts_for_owner(contract_id, selected_account_id, rpc_client).await
        }
    });

    Effect::new(move || {
        accounts.track();
        nfts.refetch();
    });

    let navigate = use_navigate();

    let ConfigContext { set_config, .. } = expect_context::<ConfigContext>();

    let hide_collection = {
        let navigate = use_navigate();
        move |_| {
            if let Ok(cid) = contract_id().parse::<AccountId>() {
                set_config.update(move |cfg| {
                    if !cfg
                        .hidden_nfts
                        .iter()
                        .any(|h| matches!(h, HiddenNft::Collection(id) if id == &cid))
                    {
                        cfg.hidden_nfts.push(HiddenNft::Collection(cid.clone()));
                    }
                });
                navigate("/nfts", NavigateOptions::default());
            }
        }
    };

    // TODO
    let report_collection = |_e: MouseEvent| {};

    view! {
        <div class="md:p-4 transition-all duration-100">
            <div class="flex justify-between items-center mb-6 px-4">
                <button
                    class="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    on:click=move |_| {
                        navigate("/nfts", NavigateOptions::default());
                    }
                >
                    <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                    <h1 class="text-white text-2xl font-bold">
                        {move || {
                            let Some(Some(metadata)) = collection_metadata.get() else {
                                return String::new();
                            };
                            metadata.name.clone()
                        }}
                    </h1>
                </button>
                <div class="flex items-center gap-3">
                    <button
                        class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        on:click=hide_collection
                    >
                        <Icon icon=icondata::LuEyeOff width="20" height="20" />
                    </button>
                    <button
                        class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        on:click=report_collection
                    >
                        <Icon icon=icondata::LuFlag width="20" height="20" />
                    </button>
                </div>
            </div>
            <Suspense fallback=move || {
                view! {
                    <div class="flex items-center justify-center h-32">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            }>
                {move || {
                    if let Some(nft_tokens) = nfts.get() {
                        if nft_tokens.is_empty() {
                            view! {
                                <div class="flex flex-col items-center justify-center h-64 text-center">
                                    <div class="text-neutral-400 text-lg mb-2">"No NFTs found"</div>
                                    <div class="text-neutral-500 text-sm">
                                        "No NFTs found in this collection"
                                    </div>
                                </div>
                            }
                                .into_any()
                        } else {
                            view! {
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {nft_tokens
                                        .into_iter()
                                        .filter(|nft| {
                                            let cfg = expect_context::<ConfigContext>().config.get();
                                            !cfg
                                                .hidden_nfts
                                                .iter()
                                                .any(|h| match h {
                                                    HiddenNft::Token(cid, tid) => {
                                                        *cid == contract_id() && tid == &nft.token_id
                                                    }
                                                    _ => false,
                                                })
                                        })
                                        .map(|nft| {
                                            let title = nft
                                                .metadata
                                                .title
                                                .unwrap_or_else(|| "Untitled".to_string());
                                            let title_for_alt = title.clone();
                                            let media = nft.metadata.media.clone();
                                            let base_uri = base_uri();
                                            let navigate = use_navigate();
                                            let contract_id_nav = contract_id().to_string();
                                            let token_id_nav = nft.token_id.clone();
                                            let on_card_click = move |_| {
                                                navigate(
                                                    &format!("/nfts/{}/{}", contract_id_nav, token_id_nav),
                                                    NavigateOptions::default(),
                                                );
                                            };
                                            view! {
                                                <div
                                                    class="bg-neutral-800 rounded-lg overflow-hidden hover:bg-neutral-700 transition-colors cursor-pointer"
                                                    on:click=on_card_click
                                                >
                                                    {move || {
                                                        if let Some(media_url) = &media {
                                                            let media_url = if media_url.contains(&base_uri) {
                                                                media_url.clone()
                                                            } else {
                                                                format!("{base_uri}/{media_url}")
                                                            };
                                                            view! {
                                                                <div class="aspect-square overflow-hidden">
                                                                    <img
                                                                        src=media_url.clone()
                                                                        alt=title_for_alt.clone()
                                                                        class="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            view! {
                                                                <div class="aspect-square bg-neutral-700 flex items-center justify-center">
                                                                    <Icon icon=icondata::LuImage width="48" height="48" />
                                                                </div>
                                                            }
                                                                .into_any()
                                                        }
                                                    }}
                                                    <div class="p-4">
                                                        <h3 class="text-white font-medium text-lg mb-2 line-clamp-2">
                                                            {title}
                                                        </h3>
                                                        <div class="text-neutral-500 text-xs mt-2">
                                                            {nft.token_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        })
                                        .collect_view()}
                                </div>
                            }
                                .into_any()
                        }
                    } else {
                        ().into_any()
                    }
                }}
            </Suspense>
        </div>
    }
}

#[component]
pub fn Nfts() -> impl IntoView {
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();
    let nfts = LocalResource::new(fetch_nfts);
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let SearchContext {
        query: search_query,
        ..
    } = expect_context::<SearchContext>();

    Effect::new(move || {
        accounts.track();
        nfts.refetch();
    });

    move || {
        let q = search_query.get();
        if !q.trim().is_empty() {
            view! {
                <div class="md:p-4 transition-all duration-100">
                    <div class="flex justify-between items-center mb-6 px-4">
                        <h1 class="text-white text-2xl font-bold">"Search Results"</h1>
                    </div>
                    <Suspense fallback=move || {
                        view! {
                            <div class="flex items-center justify-center h-32">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        }
                    }>
                        {move || {
                            let query = q.clone();
                            if let Some(collections) = nfts.get() {
                                type Score = i32;
                                type TokenWithScore = (NftToken, Score);
                                type CollectionWithScore = (
                                    OwnedCollection,
                                    Score,
                                    Vec<TokenWithScore>,
                                );
                                let mut scored: Vec<CollectionWithScore> = Vec::new();
                                for collection in collections.into_iter() {
                                    let collection_name = collection
                                        .metadata
                                        .as_ref()
                                        .map(|m| m.name.clone())
                                        .unwrap_or_else(|| "Unknown Collection".to_string());
                                    let collection_name_score = compute_match_score(
                                        &query,
                                        &collection_name,
                                    );
                                    let collection_contract_score = compute_match_score(
                                        &query,
                                        collection.contract_id.as_ref(),
                                    );
                                    let mut token_scores: Vec<(NftToken, i32)> = Vec::new();
                                    for token in collection.tokens.clone().into_iter() {
                                        let mut score = 0;
                                        if let Some(title) = &token.metadata.title {
                                            score = score.max(compute_match_score(&query, title));
                                        }
                                        if let Some(desc) = &token.metadata.description {
                                            score = score.max(compute_match_score(&query, desc)) / 2;
                                        }
                                        score = score
                                            .max(compute_match_score(&query, &collection_name) / 3);
                                        score = score
                                            .max(
                                                compute_match_score(&query, collection.contract_id.as_ref())
                                                    / 3,
                                            );
                                        if score > 0 {
                                            token_scores.push((token, score));
                                        }
                                    }
                                    if collection_name_score > 0 || collection_contract_score > 0
                                    {} else if token_scores.is_empty() {
                                        continue;
                                    }
                                    token_scores
                                        .sort_by(|a, b| {
                                            let score_cmp = b.1.cmp(&a.1);
                                            if score_cmp == std::cmp::Ordering::Equal {
                                                return a.0.token_id.cmp(&b.0.token_id);
                                            }
                                            score_cmp
                                        });
                                    let max_token_score = token_scores
                                        .first()
                                        .map(|t| t.1)
                                        .unwrap_or(0);
                                    let collection_score = *[
                                        collection_name_score,
                                        collection_contract_score,
                                        max_token_score,
                                    ]
                                        .iter()
                                        .max()
                                        .unwrap_or(&0);
                                    scored.push((collection, collection_score, token_scores));
                                }
                                scored
                                    .sort_by(|a, b| {
                                        let score_cmp = b.1.cmp(&a.1);
                                        if score_cmp == std::cmp::Ordering::Equal {
                                            let a_id = a.0.contract_id.to_string().to_lowercase();
                                            let b_id = b.0.contract_id.to_string().to_lowercase();
                                            return a_id.cmp(&b_id);
                                        }
                                        score_cmp
                                    });
                                if scored.is_empty() {
                                    view! {
                                        <div class="flex flex-col items-center justify-center h-64 text-center">
                                            <div class="text-neutral-400 text-lg mb-2">
                                                "Nothing matched your search"
                                            </div>
                                            <div class="text-neutral-500 text-sm">
                                                "Try another query"
                                            </div>
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="space-y-8">
                                            {scored
                                                .into_iter()
                                                .map(|(collection, _score, tokens)| {
                                                    let base_uri = collection
                                                        .metadata
                                                        .as_ref()
                                                        .and_then(|m| m.base_uri.clone())
                                                        .unwrap_or_default();
                                                    let collection_name = collection
                                                        .metadata
                                                        .as_ref()
                                                        .map(|m| m.name.clone())
                                                        .unwrap_or_else(|| "Unknown Collection".to_string());
                                                    let collection_name_clone = collection_name.clone();
                                                    let contract_id_display = collection.contract_id.clone();
                                                    let tokens_view = tokens
                                                        .into_iter()
                                                        .map(move |(nft, _token_score)| {
                                                            let base_uri_clone = base_uri.clone();
                                                            let contract_id_for_clipboard = contract_id_display.clone();
                                                            let token_id_for_clipboard = nft.token_id.clone();
                                                            let (is_contract_copied, set_is_contract_copied) = signal(
                                                                false,
                                                            );
                                                            let (is_token_copied, set_is_token_copied) = signal(false);
                                                            let copy_contract = move |event: MouseEvent| {
                                                                event.stop_propagation();
                                                                if let Some(win) = window() {
                                                                    let _ = win
                                                                        .navigator()
                                                                        .clipboard()
                                                                        .write_text(contract_id_for_clipboard.as_ref());
                                                                    set_is_contract_copied(true);
                                                                    set_timeout(
                                                                        move || set_is_contract_copied(false),
                                                                        Duration::from_millis(2000),
                                                                    );
                                                                }
                                                            };
                                                            let copy_token = move |event: MouseEvent| {
                                                                event.stop_propagation();
                                                                if let Some(win) = window() {
                                                                    let _ = win
                                                                        .navigator()
                                                                        .clipboard()
                                                                        .write_text(&token_id_for_clipboard);
                                                                    set_is_token_copied(true);
                                                                    set_timeout(
                                                                        move || set_is_token_copied(false),
                                                                        Duration::from_millis(2000),
                                                                    );
                                                                }
                                                            };
                                                            let title = nft
                                                                .metadata
                                                                .title
                                                                .clone()
                                                                .unwrap_or_else(|| "Untitled".to_string());
                                                            let title_for_alt = title.clone();
                                                            let media = nft.metadata.media.clone();
                                                            let token_id = nft.token_id.clone();
                                                            let navigate = use_navigate();
                                                            let contract_id_nav = contract_id_display.clone();
                                                            let token_id_nav = token_id.clone();
                                                            let on_card_click = move |_| {
                                                                navigate(
                                                                    &format!("/nfts/{}/{}", contract_id_nav, token_id_nav),
                                                                    NavigateOptions::default(),
                                                                );
                                                            };
                                                            view! {
                                                                <div
                                                                    class="bg-neutral-800 rounded-lg overflow-hidden hover:bg-neutral-700 transition-colors cursor-pointer"
                                                                    on:click=on_card_click
                                                                >
                                                                    {move || {
                                                                        if let Some(media_url) = &media {
                                                                            let media_url = if media_url.contains(&base_uri_clone) {
                                                                                media_url.clone()
                                                                            } else {
                                                                                format!("{}/{}", base_uri_clone, media_url)
                                                                            };
                                                                            view! {
                                                                                <div class="aspect-square overflow-hidden">
                                                                                    <img
                                                                                        src=media_url.clone()
                                                                                        alt=title_for_alt.clone()
                                                                                        class="w-full h-full object-cover"
                                                                                    />
                                                                                </div>
                                                                            }
                                                                                .into_any()
                                                                        } else {
                                                                            view! {
                                                                                <div class="aspect-square bg-neutral-700 flex items-center justify-center">
                                                                                    <Icon icon=icondata::LuImage width="48" height="48" />
                                                                                </div>
                                                                            }
                                                                                .into_any()
                                                                        }
                                                                    }}
                                                                    <div class="p-4">
                                                                        <h3 class="text-white font-medium text-lg mb-1 line-clamp-1">
                                                                            {title}
                                                                        </h3>
                                                                        <div class="text-neutral-400 text-xs mb-1 line-clamp-1">
                                                                            {collection_name_clone.clone()}
                                                                        </div>
                                                                        <div class="text-neutral-500 text-xs mt-2 space-y-1">
                                                                            <button
                                                                                class="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer w-full"
                                                                                on:click=copy_contract
                                                                            >
                                                                                <span class="truncate">
                                                                                    {contract_id_display.to_string()}
                                                                                </span>
                                                                                {move || {
                                                                                    if is_contract_copied.get() {
                                                                                        view! {
                                                                                            <Icon icon=icondata::LuCheck width="12" height="12" />
                                                                                        }
                                                                                            .into_any()
                                                                                    } else {
                                                                                        ().into_any()
                                                                                    }
                                                                                }}
                                                                            </button>
                                                                            <button
                                                                                class="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer w-full"
                                                                                on:click=copy_token
                                                                            >
                                                                                <span class="select-none text-neutral-600">"#"</span>
                                                                                <span class="truncate">{token_id.clone()}</span>
                                                                                {move || {
                                                                                    if is_token_copied.get() {
                                                                                        view! {
                                                                                            <Icon icon=icondata::LuCheck width="12" height="12" />
                                                                                        }
                                                                                            .into_any()
                                                                                    } else {
                                                                                        ().into_any()
                                                                                    }
                                                                                }}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        })
                                                        .collect_view();

                                                    view! {
                                                        <div>
                                                            <h2 class="text-white text-xl font-semibold mb-4">
                                                                {collection_name.clone()}
                                                            </h2>
                                                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                {tokens_view}
                                                            </div>
                                                        </div>
                                                    }
                                                })
                                                .collect_view()}
                                        </div>
                                    }
                                        .into_any()
                                }
                            } else {
                                ().into_any()
                            }
                        }}
                    </Suspense>
                </div>
            }.into_any()
        } else {
            match config.get().nfts_view_state {
                NftsViewState::Collections => {
                    view! {
                        <div class="md:p-4 transition-all duration-100">
                            <div class="flex justify-between items-center mb-6 px-4">
                                <h1 class="text-white text-2xl font-bold">"NFT Collections"</h1>
                                <button
                                    class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    on:click=move |_| {
                                        set_config
                                            .update(|c| c.nfts_view_state = NftsViewState::AllNfts);
                                    }
                                >
                                    <Icon icon=icondata::LuImage width="20" height="20" />
                                </button>
                            </div>
                            <Suspense fallback=move || {
                                view! {
                                    <div class="flex items-center justify-center h-32">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                }
                            }>
                                {move || {
                                    if let Some(collections) = nfts.get() {
                                        let cfg = config.get();
                                        let mut visible_collections: Vec<_> = collections
                                            .into_iter()
                                            .filter(|c| {
                                                !cfg
                                                    .hidden_nfts
                                                    .iter()
                                                    .any(|h| match h {
                                                        HiddenNft::Collection(cid) => cid == &c.contract_id,
                                                        _ => false,
                                                    })
                                            })
                                            .collect();
                                        if visible_collections.is_empty() {
                                            view! {
                                                <div class="flex flex-col items-center justify-center h-64 text-center">
                                                    <div class="text-neutral-400 text-lg mb-2">
                                                        "No NFTs found"
                                                    </div>
                                                    <div class="text-neutral-500 text-sm">
                                                        "Your NFT collection will appear here"
                                                    </div>
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            view! {
                                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {
                                                        let mut sorted_collections = visible_collections;
                                                        sorted_collections
                                                            .sort_by_key(|c| c.contract_id.to_string().to_lowercase());
                                                        sorted_collections
                                                            .into_iter()
                                                            .map(|collection| {
                                                                let (is_copied, set_is_copied) = signal(false);
                                                                let contract_id_display = collection.contract_id.clone();
                                                                let contract_id_for_clipboard = contract_id_display.clone();
                                                                let contract_id_for_click = contract_id_display.clone();
                                                                let metadata_for_icon = collection.metadata.clone();
                                                                let metadata_for_name = collection.metadata.clone();
                                                                let copy_to_clipboard = move |event: MouseEvent| {
                                                                    event.stop_propagation();
                                                                    if let Some(window) = window() {
                                                                        let _ = window
                                                                            .navigator()
                                                                            .clipboard()
                                                                            .write_text(contract_id_for_clipboard.as_ref());
                                                                        set_is_copied(true);
                                                                        set_timeout(
                                                                            move || set_is_copied(false),
                                                                            Duration::from_millis(2000),
                                                                        );
                                                                    }
                                                                };
                                                                let navigate = use_navigate();
                                                                let on_collection_click = move |_| {
                                                                    navigate(
                                                                        &format!("/nfts/{contract_id_for_click}"),
                                                                        NavigateOptions::default(),
                                                                    );
                                                                };
                                                                view! {
                                                                    <div
                                                                        class="bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
                                                                        on:click=on_collection_click
                                                                    >
                                                                        {move || {
                                                                            if let Some(metadata) = &metadata_for_icon {
                                                                                if let Some(icon) = &metadata.icon {
                                                                                    if icon.starts_with("data:image/") {
                                                                                        view! {
                                                                                            <div class="aspect-square rounded-t-lg overflow-hidden">
                                                                                                <img
                                                                                                    src=icon.clone()
                                                                                                    alt=metadata.name.clone()
                                                                                                    class="w-full h-full object-cover"
                                                                                                />
                                                                                            </div>
                                                                                        }
                                                                                            .into_any()
                                                                                    } else {
                                                                                        view! {
                                                                                            <div class="aspect-square bg-neutral-700 rounded-t-lg flex items-center justify-center">
                                                                                                <Icon icon=icondata::LuImage width="32" height="32" />
                                                                                            </div>
                                                                                        }
                                                                                            .into_any()
                                                                                    }
                                                                                } else {
                                                                                    view! {
                                                                                        <div class="aspect-square bg-neutral-700 rounded-t-lg flex items-center justify-center">
                                                                                            <Icon icon=icondata::LuImage width="32" height="32" />
                                                                                        </div>
                                                                                    }
                                                                                        .into_any()
                                                                                }
                                                                            } else {
                                                                                view! {
                                                                                    <div class="aspect-square bg-neutral-700 rounded-t-lg flex items-center justify-center">
                                                                                        <Icon icon=icondata::LuImage width="32" height="32" />
                                                                                    </div>
                                                                                }
                                                                                    .into_any()
                                                                            }
                                                                        }}
                                                                        <div class="p-3 pt-2">
                                                                            <div class="text-white font-medium text-base truncate">
                                                                                {move || {
                                                                                    if let Some(metadata) = &metadata_for_name {
                                                                                        metadata.name.clone()
                                                                                    } else {
                                                                                        "Unknown Collection".to_string()
                                                                                    }
                                                                                }}
                                                                            </div>
                                                                            <div class="text-neutral-400 text-xs mt-1 flex items-center gap-2 group">
                                                                                <button
                                                                                    class="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                                                                                    on:click=copy_to_clipboard
                                                                                >
                                                                                    <span class="truncate">
                                                                                        {contract_id_display.to_string()}
                                                                                    </span>
                                                                                    {move || {
                                                                                        if is_copied.get() {
                                                                                            view! {
                                                                                                <Icon icon=icondata::LuCheck width="14" height="14" />
                                                                                            }
                                                                                                .into_any()
                                                                                        } else {
                                                                                            ().into_any()
                                                                                        }
                                                                                    }}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            })
                                                            .collect_view()
                                                    }
                                                </div>
                                            }
                                                .into_any()
                                        }
                                    } else {
                                        ().into_any()
                                    }
                                }}
                            </Suspense>
                        </div>
                    }
                        .into_any()
                }
                NftsViewState::AllNfts => {
                    view! {
                        <div class="md:p-4 transition-all duration-100">
                            <div class="flex justify-between items-center mb-6 px-4">
                                <h1 class="text-white text-2xl font-bold">"Your NFTs"</h1>
                                <button
                                    class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    on:click=move |_| {
                                        set_config
                                            .update(|c| c.nfts_view_state = NftsViewState::Collections);
                                    }
                                >
                                    <Icon icon=icondata::LuLayers width="20" height="20" />
                                </button>
                            </div>
                            <Suspense fallback=move || {
                                view! {
                                    <div class="flex items-center justify-center h-32">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                }
                            }>
                                {move || {
                                    if let Some(collections) = nfts.get() {
                                        let mut sorted_collections = collections;
                                        sorted_collections
                                            .sort_by_key(|c| c.contract_id.to_string().to_lowercase());
                                        let tokens_view = sorted_collections
                                            .into_iter()
                                            .flat_map(|collection| {
                                                let base_uri = collection
                                                    .metadata
                                                    .as_ref()
                                                    .and_then(|m| m.base_uri.clone())
                                                    .unwrap_or_default();
                                                let collection_name = collection
                                                    .metadata
                                                    .as_ref()
                                                    .map(|m| m.name.clone())
                                                    .unwrap_or_else(|| "Unknown Collection".to_string());
                                                let contract_id_display = collection.contract_id.clone();
                                                let cfg = config.get();
                                                let mut sorted_tokens: Vec<_> = collection
                                                    .tokens
                                                    .into_iter()
                                                    .filter(|t| {
                                                        !cfg
                                                            .hidden_nfts
                                                            .iter()
                                                            .any(|h| match h {
                                                                HiddenNft::Token(cid, tid) => {
                                                                    cid == &collection.contract_id && tid == &t.token_id
                                                                }
                                                                HiddenNft::Collection(cid) => cid == &collection.contract_id,
                                                            })
                                                    })
                                                    .collect();
                                                sorted_tokens.sort_by_key(|t| t.token_id.clone());
                                                sorted_tokens
                                                    .into_iter()
                                                    .map(move |nft| {
                                                        let base_uri_clone = base_uri.clone();
                                                        let contract_id_for_clipboard = contract_id_display.clone();
                                                        let token_id_for_clipboard = nft.token_id.clone();
                                                        let (is_contract_copied, set_is_contract_copied) = signal(
                                                            false,
                                                        );
                                                        let (is_token_copied, set_is_token_copied) = signal(false);
                                                        let copy_contract = move |event: MouseEvent| {
                                                            event.stop_propagation();
                                                            if let Some(win) = window() {
                                                                let _ = win
                                                                    .navigator()
                                                                    .clipboard()
                                                                    .write_text(contract_id_for_clipboard.as_ref());
                                                                set_is_contract_copied(true);
                                                                set_timeout(
                                                                    move || set_is_contract_copied(false),
                                                                    Duration::from_millis(2000),
                                                                );
                                                            }
                                                        };
                                                        let copy_token = move |event: MouseEvent| {
                                                            event.stop_propagation();
                                                            if let Some(win) = window() {
                                                                let _ = win
                                                                    .navigator()
                                                                    .clipboard()
                                                                    .write_text(&token_id_for_clipboard);
                                                                set_is_token_copied(true);
                                                                set_timeout(
                                                                    move || set_is_token_copied(false),
                                                                    Duration::from_millis(2000),
                                                                );
                                                            }
                                                        };
                                                        let title = nft
                                                            .metadata
                                                            .title
                                                            .clone()
                                                            .unwrap_or_else(|| "Untitled".to_string());
                                                        let title_for_alt = title.clone();
                                                        let media = nft.metadata.media.clone();
                                                        let token_id = nft.token_id.clone();
                                                        let navigate = use_navigate();
                                                        let contract_id_nav = contract_id_display.clone();
                                                        let token_id_nav = token_id.clone();
                                                        let on_card_click = move |_| {
                                                            navigate(
                                                                &format!("/nfts/{}/{}", contract_id_nav, token_id_nav),
                                                                NavigateOptions::default(),
                                                            );
                                                        };
                                                        view! {
                                                            <div
                                                                class="bg-neutral-800 rounded-lg overflow-hidden hover:bg-neutral-700 transition-colors cursor-pointer"
                                                                on:click=on_card_click
                                                            >
                                                                {move || {
                                                                    if let Some(media_url) = &media {
                                                                        let media_url = if media_url.contains(&base_uri_clone) {
                                                                            media_url.clone()
                                                                        } else {
                                                                            format!("{}/{}", base_uri_clone, media_url)
                                                                        };
                                                                        view! {
                                                                            <div class="aspect-square overflow-hidden">
                                                                                <img
                                                                                    src=media_url.clone()
                                                                                    alt=title_for_alt.clone()
                                                                                    class="w-full h-full object-cover"
                                                                                />
                                                                            </div>
                                                                        }
                                                                            .into_any()
                                                                    } else {
                                                                        view! {
                                                                            <div class="aspect-square bg-neutral-700 flex items-center justify-center">
                                                                                <Icon icon=icondata::LuImage width="48" height="48" />
                                                                            </div>
                                                                        }
                                                                            .into_any()
                                                                    }
                                                                }}
                                                                <div class="p-4">
                                                                    <h3 class="text-white font-medium text-lg mb-1 line-clamp-1">
                                                                        {title}
                                                                    </h3>
                                                                    <div class="text-neutral-400 text-xs mb-1 line-clamp-1">
                                                                        {collection_name.clone()}
                                                                    </div>
                                                                    <div class="text-neutral-500 text-xs mt-2 space-y-1">
                                                                        <button
                                                                            class="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer w-full"
                                                                            on:click=copy_contract
                                                                        >
                                                                            <span class="truncate">
                                                                                {contract_id_display.to_string()}
                                                                            </span>
                                                                            {move || {
                                                                                if is_contract_copied.get() {
                                                                                    view! {
                                                                                        <Icon icon=icondata::LuCheck width="12" height="12" />
                                                                                    }
                                                                                        .into_any()
                                                                                } else {
                                                                                    ().into_any()
                                                                                }
                                                                            }}
                                                                        </button>
                                                                        <button
                                                                            class="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer w-full"
                                                                            on:click=copy_token
                                                                        >
                                                                            <span class="select-none text-neutral-600">"#"</span>
                                                                            <span class="truncate">{token_id.clone()}</span>
                                                                            {move || {
                                                                                if is_token_copied.get() {
                                                                                    view! {
                                                                                        <Icon icon=icondata::LuCheck width="12" height="12" />
                                                                                    }
                                                                                        .into_any()
                                                                                } else {
                                                                                    ().into_any()
                                                                                }
                                                                            }}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    })
                                            })
                                            .collect_view();
                                        view! {
                                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {tokens_view}
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        ().into_any()
                                    }
                                }}
                            </Suspense>
                        </div>
                    }.into_any()
                }
            }
        }
    }
}

#[component]
pub fn NftTokenDetails() -> impl IntoView {
    use leptos_router::hooks::{use_navigate, use_params_map};

    let params = use_params_map();
    let contract_id = move || params.get().get("collection_id").unwrap_or_default();
    let token_id = move || params.get().get("token_id").unwrap_or_default();

    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();

    let ConfigContext { set_config, .. } = expect_context::<ConfigContext>();

    let collection_metadata = LocalResource::new(move || {
        let rpc_client = client.get().clone();
        async move {
            let Ok(cid) = contract_id().parse() else {
                return None;
            };
            fetch_nft_metadata(cid, rpc_client).await
        }
    });

    let nft_token = LocalResource::new(move || {
        let rpc_client = client.get().clone();
        async move {
            let selected_account_id = accounts().selected_account_id?;
            let Ok(cid) = contract_id().parse() else {
                return None;
            };
            let tokens = fetch_nfts_for_owner(cid, selected_account_id, rpc_client).await;
            let tid = token_id();
            tokens.into_iter().find(|t| t.token_id == tid)
        }
    });

    // Refetch when account changes
    Effect::new(move || {
        accounts.track();
        nft_token.refetch();
    });

    let navigate = use_navigate();

    let hide_token =
        {
            let navigate = navigate.clone();
            move |_| {
                if let (Ok(cid), tid) = (contract_id().parse::<AccountId>(), token_id()) {
                    set_config.update(move |cfg| {
                        if !cfg.hidden_nfts.iter().any(
                            |h| matches!(h, HiddenNft::Token(id, t) if id == &cid && t == &tid),
                        ) {
                            cfg.hidden_nfts
                                .push(HiddenNft::Token(cid.clone(), tid.clone()));
                        }
                    });
                    navigate("/nfts", NavigateOptions::default());
                }
            }
        };

    let report_token = |_e: MouseEvent| {};

    view! {
        <div class="md:p-4 transition-all duration-100">
            <div class="flex justify-between items-center mb-6 px-4">
                <button
                    class="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    on:click=move |_| {
                        navigate(&format!("/nfts/{}", contract_id()), NavigateOptions::default());
                    }
                >
                    <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                    <h1 class="text-white text-2xl font-bold">"NFT Details"</h1>
                </button>
                <div class="flex items-center gap-3">
                    <button
                        class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        on:click=hide_token
                    >
                        <Icon icon=icondata::LuEyeOff width="20" height="20" />
                    </button>
                    <button
                        class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        on:click=report_token
                    >
                        <Icon icon=icondata::LuFlag width="20" height="20" />
                    </button>
                </div>
            </div>
            <Suspense fallback=move || {
                view! {
                    <div class="flex items-center justify-center h-32">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            }>
                {move || {
                    if let Some(Some(token)) = nft_token.get() {
                        let title = token
                            .metadata
                            .title
                            .clone()
                            .unwrap_or_else(|| "Untitled".to_string());
                        let title_clone = title.clone();
                        let description = token.metadata.description.clone().unwrap_or_default();
                        let media_opt = token.metadata.media.clone();
                        let base_uri = collection_metadata
                            .get()
                            .and_then(|m| m)
                            .and_then(|m| m.base_uri.clone())
                            .unwrap_or_default();
                        view! {
                            <div class="max-w-xl mx-auto space-y-6">
                                {move || {
                                    if let Some(media_url) = &media_opt {
                                        let url = if media_url.contains(&base_uri)
                                            || base_uri.is_empty()
                                        {
                                            media_url.clone()
                                        } else {
                                            format!("{}/{}", base_uri, media_url)
                                        };
                                        view! {
                                            <div class="w-full h-[calc(min(60vh,480px))] rounded-lg overflow-hidden bg-neutral-700">
                                                <img
                                                    src=url.clone()
                                                    alt=title_clone.clone()
                                                    class="object-cover h-full w-full"
                                                />
                                            </div>
                                        }
                                            .into_any()
                                    } else {
                                        view! {
                                            <div class="w-full aspect-square flex items-center justify-center bg-neutral-700 rounded-lg">
                                                <Icon icon=icondata::LuImage width="64" height="64" />
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }} <div class="space-y-4 px-2">
                                    <h2 class="text-2xl font-semibold text-white break-words">
                                        {title}
                                    </h2>
                                    <p class="text-neutral-400 whitespace-pre-wrap break-words">
                                        {if description.is_empty() {
                                            "No description provided".to_string()
                                        } else {
                                            description
                                        }}
                                    </p>
                                    <button
                                        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer w-full md:w-auto"
                                        disabled
                                    >
                                        "Send"
                                    </button>
                                </div>
                            </div>
                        }
                            .into_any()
                    } else {
                        view! {
                            <div class="flex flex-col items-center justify-center h-64 text-center">
                                <div class="text-neutral-400 text-lg mb-2">"NFT not found"</div>
                                <div class="text-neutral-500 text-sm">
                                    "Unable to locate the requested NFT token"
                                </div>
                            </div>
                        }
                            .into_any()
                    }
                }}
            </Suspense>
        </div>
    }
}
