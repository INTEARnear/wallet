use futures_util::join;
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_router::components::A;
use leptos_router::hooks::use_navigate;
use leptos_router::{hooks::use_params_map, NavigateOptions};
use near_min_api::types::{Action, FunctionCallAction, NearGas, NearToken};
use near_min_api::{
    types::{AccountId, Finality},
    QueryFinality, RpcClient,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fmt::Display;
use std::time::Duration;
use web_sys::{window, MouseEvent};

use crate::components::ProgressiveImage;
use crate::contexts::nft_cache_context::NftCacheContext;
use crate::contexts::nft_cache_context::{NftContractMetadata, NftToken, OwnedCollection};
use crate::contexts::search_context::SearchContext;
use crate::contexts::tokens_context::TokenMetadata;
use crate::contexts::{
    accounts_context::AccountsContext,
    config_context::{ConfigContext, HiddenNft, NftsViewState},
    network_context::{Network, NetworkContext},
    rpc_context::RpcContext,
    transaction_queue_context::{EnqueuedTransaction, TransactionQueueContext},
};
use crate::pages::stake::is_validator_supported;
use crate::utils::{
    format_account_id_no_hide, format_token_amount_no_hide, proxify_url, Resolution,
};

async fn fetch_spam_list() -> Vec<HiddenNft> {
    let proxy_base = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");
    let url = format!("{}/spam-list", proxy_base);
    if let Ok(res) = reqwest::get(&url).await {
        if let Ok(list) = res.json::<Vec<HiddenNft>>().await {
            return list;
        }
    }
    vec![]
}

impl Display for Resolution {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Resolution::Low => write!(f, "low"),
            Resolution::High => write!(f, "high"),
        }
    }
}

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

#[derive(Debug, Clone, Serialize, Deserialize)]
struct NftTokenResponse {
    pub metadata: NftTokenResponseMetadata,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct NftTokenResponseMetadata {
    pub reference: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct NftTokenAttribute {
    pub trait_type: String,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct NftTokenReference {
    pub attributes: Option<Vec<NftTokenAttribute>>,
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

async fn fetch_nft_token(
    contract_id: AccountId,
    token_id: String,
    rpc_client: RpcClient,
) -> Option<NftTokenResponse> {
    rpc_client
        .call::<NftTokenResponse>(
            contract_id,
            "nft_token",
            serde_json::json!({"token_id": token_id}),
            QueryFinality::Finality(Finality::DoomSlug),
        )
        .await
        .ok()
}

async fn fetch_nft_traits(base_uri: String, reference: String) -> Option<Vec<NftTokenAttribute>> {
    let metadata_url = if reference.starts_with("http") {
        reference
    } else {
        format!("{}/{}", base_uri.trim_end_matches('/'), reference)
    };

    let proxy_base = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");
    let encoded_url =
        percent_encoding::utf8_percent_encode(&metadata_url, percent_encoding::NON_ALPHANUMERIC)
            .to_string();
    let proxy_url = format!("{proxy_base}/traits/{encoded_url}");

    let response = reqwest::get(&proxy_url).await.ok()?;
    let metadata: NftTokenReference = response.json().await.ok()?;
    metadata.attributes
}

/// Fetch up to 12 000 NFT tokens for the given `contract_id` that belong to `account_id`.
/// The function fetches tokens in chunks of 100 using `from_index`/`limit` parameters.
/// It requests 10 pages (1 000 tokens) in a single batched RPC call. If the last page of the
/// previous batch still contained 100 items, it will fetch the next 10 pages, repeating until
/// either less than 100 tokens are returned on the last page or the hard cap of 12 000 items
/// is reached.
async fn fetch_nfts_for_owner(
    contract_id: AccountId,
    account_id: AccountId,
    rpc_client: RpcClient,
    cache: RwSignal<HashMap<AccountId, OwnedCollection>>,
) -> Vec<NftToken> {
    if let Some(cached) = cache.read().get(&contract_id) {
        return cached.tokens.clone();
    }

    const PAGE_LIMIT: u32 = 100;
    const PAGES_PER_BATCH: u32 = 10;
    const MAX_TOKENS: u32 = 12_000;

    let mut all_tokens: Vec<NftToken> = Vec::new();
    let mut from_index: u32 = 0;

    loop {
        let batch_requests: Vec<_> = (0..PAGES_PER_BATCH)
            .map(|i| {
                let idx = from_index + i * PAGE_LIMIT;
                (
                    contract_id.clone(),
                    "nft_tokens_for_owner",
                    serde_json::json!({
                        "account_id": account_id.to_string(),
                        "from_index": idx.to_string(),
                        "limit": PAGE_LIMIT,
                    }),
                    QueryFinality::Finality(Finality::DoomSlug),
                )
            })
            .collect();

        let Ok(batch_results) = rpc_client.batch_call::<Vec<NftToken>>(batch_requests).await else {
            break;
        };

        let mut fetched_any_full_page = false;

        for tokens in batch_results.into_iter().flatten() {
            let count = tokens.len() as u32;
            if count == PAGE_LIMIT {
                fetched_any_full_page = true;
            }
            all_tokens.extend(tokens);
        }

        if !fetched_any_full_page {
            break;
        }

        from_index += PAGES_PER_BATCH * PAGE_LIMIT;
        if from_index >= MAX_TOKENS {
            break;
        }
    }

    all_tokens
}

/// Retrieve all NFT collections for `account_id` on the specified `network`.
///
/// The function proceeds in two phases:
/// 1. It batches a metadata request and a first-page (`from_index = "0", limit = 100`) token
///    request for every collection. This minimises the number of initial RPC calls.
/// 2. If the first page for a collection is exactly 100 tokens, `fetch_nfts_for_owner` is invoked
///    to load the remaining pages (up to the 12 000-token hard cap).  Collections whose first page
///    is smaller than 100 tokens are kept as-is.
async fn fetch_nfts(
    account_id: AccountId,
    network: Network,
    cache: RwSignal<HashMap<AccountId, OwnedCollection>>,
) -> Vec<OwnedCollection> {
    if !cache.read_untracked().is_empty() {
        return cache.read_untracked().values().cloned().collect();
    }

    let api_host = match network {
        Network::Mainnet => "api.fastnear.com",
        Network::Testnet => "test.api.fastnear.com",
    };

    let Ok(response) =
        reqwest::get(format!("https://{api_host}/v1/account/{account_id}/nft")).await
    else {
        return vec![];
    };

    let Ok(nft_data) = response.json::<FastnearNftResponse>().await else {
        return vec![];
    };

    let rpc_client = expect_context::<RpcContext>().client.get().clone();

    let metadata_requests: Vec<_> = nft_data
        .tokens
        .iter()
        .map(|token| {
            (
                token.contract_id.clone(),
                "nft_metadata",
                serde_json::json!({}),
                QueryFinality::Finality(Finality::DoomSlug),
            )
        })
        .collect();

    let metadata_future = rpc_client.batch_call::<NftContractMetadata>(metadata_requests);

    let first_page_requests: Vec<_> = nft_data
        .tokens
        .iter()
        .map(|token| {
            (
                token.contract_id.clone(),
                "nft_tokens_for_owner",
                serde_json::json!({
                    "account_id": account_id.to_string(),
                    "from_index": "0",
                    "limit": 100,
                }),
                QueryFinality::Finality(Finality::DoomSlug),
            )
        })
        .collect();

    let first_page_future = rpc_client.batch_call::<Vec<NftToken>>(first_page_requests);

    let (metadata_results, first_page_results) =
        futures_util::future::join(metadata_future, first_page_future).await;

    let Ok(metadata_results) = metadata_results else {
        return vec![];
    };

    let Ok(first_page_results) = first_page_results else {
        return vec![];
    };

    let mut tokens_results: Vec<Vec<NftToken>> = Vec::with_capacity(nft_data.tokens.len());
    let mut extra_indices: Vec<usize> = Vec::new();
    let mut extra_futures = Vec::new();

    for (idx, token_data) in nft_data.tokens.iter().enumerate() {
        let first_page_tokens = first_page_results
            .get(idx)
            .and_then(|r| r.as_ref().ok())
            .cloned()
            .unwrap_or_default();

        if first_page_tokens.len() == 100 {
            extra_indices.push(idx);
            extra_futures.push(fetch_nfts_for_owner(
                token_data.contract_id.clone(),
                account_id.clone(),
                rpc_client.clone(),
                cache,
            ));
        }

        tokens_results.push(first_page_tokens);
    }

    if !extra_futures.is_empty() {
        let extra_tokens_vec = futures_util::future::join_all(extra_futures).await;
        for (idx, extra_tokens) in extra_indices.into_iter().zip(extra_tokens_vec) {
            tokens_results[idx] = extra_tokens;
        }
    }

    let mut collections = Vec::new();
    for (i, token_data) in nft_data.tokens.into_iter().enumerate() {
        let metadata = metadata_results
            .get(i)
            .and_then(|r| r.as_ref().ok())
            .cloned();

        let tokens = tokens_results.get(i).cloned().unwrap_or_default();

        let collection = OwnedCollection {
            contract_id: token_data.contract_id,
            metadata,
            tokens,
        };

        if !collection.tokens.is_empty() {
            collections.push(collection);
        }
    }

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
    let NftCacheContext { cache } = expect_context::<NftCacheContext>();

    let collection_metadata = LocalResource::new(move || {
        let rpc_client = client.get().clone();
        async move {
            let Ok(contract_id) = contract_id().parse() else {
                return None;
            };
            fetch_nft_metadata(contract_id, rpc_client).await
        }
    });

    let spam_list = LocalResource::new(fetch_spam_list);
    let (is_reported, set_is_reported) = signal(false);

    let base_uri = move || {
        let Some(Some(metadata)) = collection_metadata.get() else {
            return String::new();
        };
        metadata.base_uri.clone().unwrap_or_default()
    };

    let nfts = LocalResource::new(move || {
        let rpc_client = expect_context::<RpcContext>().client.get();
        async move {
            let Some(selected_account_id) = accounts().selected_account_id else {
                return vec![];
            };
            let Ok(contract_id) = contract_id().parse() else {
                return vec![];
            };
            fetch_nfts_for_owner(contract_id, selected_account_id, rpc_client, cache).await
        }
    });

    Effect::new(move || {
        accounts.track();
        nfts.refetch();
    });

    let navigate = use_navigate();

    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();

    let toggle_hide_collection = move |_| {
        if let Ok(cid) = contract_id().parse::<AccountId>() {
            set_config.update(move |cfg| {
                if let Some(idx) = cfg
                    .hidden_nfts
                    .iter()
                    .position(|h| matches!(h, HiddenNft::Collection(id) if id == &cid))
                {
                    cfg.hidden_nfts.remove(idx);
                } else {
                    cfg.hidden_nfts.push(HiddenNft::Collection(cid.clone()));
                }
            });
        }
    };

    let report_collection = move |_e: MouseEvent| {
        if is_reported.get_untracked() {
            return;
        }
        if let Ok(cid) = contract_id().parse::<AccountId>() {
            set_is_reported.set(true);
            spawn_local(async move {
                let item = HiddenNft::Collection(cid);
                let proxy_base = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");
                let url = format!("{}/report-spam", proxy_base);
                let client = reqwest::Client::new();
                if let Err(e) = client.post(&url).json(&item).send().await {
                    leptos::logging::error!("Failed to report spam: {e:?}");
                } else {
                    spam_list.refetch();
                }
            });
        }
    };

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
                        title=move || {
                            let cfg = config.get();
                            let hidden = if let Ok(cid) = contract_id().parse::<AccountId>() {
                                cfg.hidden_nfts
                                    .iter()
                                    .any(|h| matches!(h, HiddenNft::Collection(id) if id == &cid))
                            } else {
                                false
                            };
                            if hidden { "Unhide" } else { "Hide" }
                        }
                        class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        style=move || {
                            let cfg = config.get();
                            let hidden = if let Ok(cid) = contract_id().parse::<AccountId>() {
                                cfg.hidden_nfts
                                    .iter()
                                    .any(|h| matches!(h, HiddenNft::Collection(id) if id == &cid))
                            } else {
                                false
                            };
                            if hidden { "color: #facc15".to_string() } else { "".to_string() }
                        }
                        on:click=toggle_hide_collection
                    >
                        <Icon icon=icondata::LuEyeOff width="20" height="20" />
                    </button>
                    {move || {
                        if is_reported.get() {
                            view! {
                                <span class="text-neutral-400 text-sm select-none">
                                    "Reported!"
                                </span>
                            }
                                .into_any()
                        } else {
                            view! {
                                <button
                                    title="Report"
                                    class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    on:click=report_collection
                                >
                                    <Icon icon=icondata::LuFlag width="20" height="20" />
                                </button>
                            }
                                .into_any()
                        }
                    }}
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
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {nft_tokens
                                        .into_iter()
                                        .filter(|nft| {
                                            let cfg = expect_context::<ConfigContext>().config.get();
                                            let is_hidden_user = cfg
                                                .hidden_nfts
                                                .iter()
                                                .any(|h| {
                                                    matches!(
                                                        h,
                                                        HiddenNft::Token(cid, tid)
                                                        if *cid == contract_id() && tid == &nft.token_id
                                                    )
                                                });
                                            if is_hidden_user {
                                                return false;
                                            }
                                            if let Some(spam) = spam_list.get() {
                                                let is_spam = spam
                                                    .iter()
                                                    .any(|h| {
                                                        match h {
                                                            HiddenNft::Token(cid, tid) => {
                                                                *cid == contract_id() && tid == &nft.token_id
                                                            }
                                                            HiddenNft::Collection(cid) => *cid == contract_id(),
                                                        }
                                                    });
                                                if is_spam {
                                                    return false;
                                                }
                                            }
                                            true
                                        })
                                        .map(|nft| {
                                            let title = nft
                                                .metadata
                                                .title
                                                .unwrap_or_else(|| "Untitled".to_string());
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
                                            let token_id_for_clipboard = nft.token_id.clone();
                                            let (is_copied, set_is_copied) = signal(false);
                                            let copy_token_id = move |ev: MouseEvent| {
                                                ev.stop_propagation();
                                                if let Some(window) = window() {
                                                    let _ = window
                                                        .navigator()
                                                        .clipboard()
                                                        .write_text(&token_id_for_clipboard);
                                                    set_is_copied(true);
                                                    set_timeout(
                                                        move || set_is_copied(false),
                                                        Duration::from_millis(2000),
                                                    );
                                                }
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
                                                                    <ProgressiveImage
                                                                        low_res_src=proxify_url(&media_url, Resolution::Low)
                                                                        high_res_src=proxify_url(&media_url, Resolution::High)
                                                                        attr:class="object-cover h-full w-full"
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
                                                        <button
                                                            class="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-xs mt-2"
                                                            on:click=copy_token_id
                                                        >
                                                            <span class="select-none text-neutral-600">"#"</span>
                                                            <span class="truncate">{nft.token_id.clone()}</span>
                                                            {move || {
                                                                if is_copied.get() {
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
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let NftCacheContext { cache } = expect_context::<NftCacheContext>();
    let nfts = LocalResource::new(move || {
        let selected_account = if let Some(selected_account_id) = accounts().selected_account_id {
            accounts()
                .accounts
                .into_iter()
                .find(|a| a.account_id == selected_account_id)
        } else {
            None
        };
        async move {
            let Some(selected_account) = selected_account else {
                return vec![];
            };
            fetch_nfts(selected_account.account_id, selected_account.network, cache).await
        }
    });
    let SearchContext {
        query: search_query,
        ..
    } = expect_context::<SearchContext>();
    let navigate = use_navigate();
    let spam_list = LocalResource::new(fetch_spam_list);

    move || {
        let navigate = navigate.clone();
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
                                for collection in collections {
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
                                                                                    <ProgressiveImage
                                                                                        low_res_src=proxify_url(&media_url, Resolution::Low)
                                                                                        high_res_src=proxify_url(&media_url, Resolution::High)
                                                                                        attr:class="object-cover h-full w-full"
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
                                    let navigate = navigate.clone();
                                    if let Some(collections) = nfts.get() {
                                        let cfg = config.get();
                                        let mut visible_collections: Vec<_> = collections
                                            .into_iter()
                                            .filter(|c| {
                                                let is_hidden_user = cfg
                                                    .hidden_nfts
                                                    .iter()
                                                    .any(|h| {
                                                        matches!(
                                                            h,
                                                            HiddenNft::Collection(cid)
                                                            if cid == &c.contract_id
                                                        )
                                                    });
                                                let is_spam = spam_list
                                                    .get()
                                                    .unwrap_or_default()
                                                    .iter()
                                                    .any(|h| {
                                                        matches!(
                                                            h,
                                                            HiddenNft::Collection(cid)
                                                            if cid == &c.contract_id
                                                        )
                                                    });
                                                !is_hidden_user && !is_spam
                                            })
                                            .collect();
                                        if visible_collections.is_empty() {
                                            view! {
                                                <div class="flex flex-col items-center justify-center h-64 text-center">
                                                    <div class="text-neutral-400 text-lg mb-2">
                                                        "No NFTs found"
                                                    </div>
                                                    <div class="text-neutral-500 text-sm">
                                                        "Your NFT collections will appear here"
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
                                                                let num_tokens = collection.tokens.len();
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
                                                                let navigate = navigate.clone();
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
                                                                        <div class="relative">
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
                                                                            <div class="absolute bottom-3 right-3 opacity-85 bg-black text-white text-xs font-medium min-w-7 h-7 rounded-md pointer-events-none flex items-center justify-center">
                                                                                {num_tokens}
                                                                            </div>
                                                                        </div>
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
                                    let navigate = navigate.clone();
                                    if let Some(collections) = nfts.get() {
                                        let cfg = config.get();
                                        let has_visible_nfts = collections
                                            .iter()
                                            .any(|collection| {
                                                collection
                                                    .tokens
                                                    .iter()
                                                    .any(|token| {
                                                        let is_hidden_user = cfg
                                                            .hidden_nfts
                                                            .iter()
                                                            .any(|h| {
                                                                matches!(
                                                                    h,
                                                                    HiddenNft::Token(cid, tid)
                                                                    if cid == &collection.contract_id && tid == &token.token_id
                                                                )
                                                                    || matches!(
                                                                        h,
                                                                        HiddenNft::Collection(cid)
                                                                        if cid == &collection.contract_id
                                                                    )
                                                            });
                                                        let is_spam = spam_list
                                                            .get()
                                                            .unwrap_or_default()
                                                            .iter()
                                                            .any(|h| {
                                                                matches!(
                                                                    h,
                                                                    HiddenNft::Token(cid, tid)
                                                                    if cid == &collection.contract_id && tid == &token.token_id
                                                                )
                                                                    || matches!(
                                                                        h,
                                                                        HiddenNft::Collection(cid)
                                                                        if cid == &collection.contract_id
                                                                    )
                                                            });
                                                        !is_hidden_user && !is_spam
                                                    })
                                            });
                                        if !has_visible_nfts {
                                            return view! {
                                                <div class="flex flex-col items-center justify-center h-64 text-center">
                                                    <div class="text-neutral-400 text-lg mb-2">
                                                        "No NFTs found"
                                                    </div>
                                                    <div class="text-neutral-500 text-sm">
                                                        "Your NFTs will appear here"
                                                    </div>
                                                </div>
                                            }
                                                .into_any();
                                        }
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
                                                let global_spam_list = spam_list.get().unwrap_or_default();
                                                let mut sorted_tokens: Vec<_> = collection
                                                    .tokens
                                                    .into_iter()
                                                    .filter(|t| {
                                                        let is_hidden_user = cfg
                                                            .hidden_nfts
                                                            .iter()
                                                            .any(|h| {
                                                                matches!(
                                                                    h,
                                                                    HiddenNft::Token(cid, tid)
                                                                    if cid == &collection.contract_id && tid == &t.token_id
                                                                )
                                                                    || matches!(
                                                                        h,
                                                                        HiddenNft::Collection(cid)
                                                                        if cid == &collection.contract_id
                                                                    )
                                                            });
                                                        let is_spam = global_spam_list
                                                            .iter()
                                                            .any(|h| {
                                                                matches!(
                                                                    h,
                                                                    HiddenNft::Token(cid, tid)
                                                                    if cid == &collection.contract_id && tid == &t.token_id
                                                                )
                                                                    || matches!(
                                                                        h,
                                                                        HiddenNft::Collection(cid)
                                                                        if cid == &collection.contract_id
                                                                    )
                                                            });
                                                        !is_hidden_user && !is_spam
                                                    })
                                                    .collect();
                                                sorted_tokens.sort_by_key(|t| t.token_id.clone());
                                                let navigate = navigate.clone();
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
                                                        let media = nft.metadata.media.clone();
                                                        let token_id = nft.token_id.clone();
                                                        let contract_id_nav = contract_id_display.clone();
                                                        let token_id_nav = token_id.clone();
                                                        let navigate = navigate.clone();
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
                                                                                <ProgressiveImage
                                                                                    low_res_src=proxify_url(&media_url, Resolution::Low)
                                                                                    high_res_src=proxify_url(&media_url, Resolution::High)
                                                                                    attr:class="object-cover h-full w-full"
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
pub fn SendNft() -> impl IntoView {
    let params = use_params_map();
    let contract_id = move || params.get().get("collection_id").unwrap_or_default();
    let token_id = #[track_caller]
    move || params.get().get("token_id").unwrap_or_default();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let NetworkContext { network, .. } = expect_context::<NetworkContext>();
    let NftCacheContext { cache } = expect_context::<NftCacheContext>();
    let (recipient, set_recipient) = signal("".to_string());
    let (is_loading_recipient, set_is_loading_recipient) = signal(false);
    let (recipient_balance, set_recipient_balance) = signal(None);
    let (has_typed_recipient, set_has_typed_recipient) = signal(false);
    #[derive(Clone, Debug)]
    struct RecipientWarning {
        message: String,
        link: Option<String>,
        link_text: Option<String>,
    }

    let (recipient_warning, set_recipient_warning) = signal::<Option<RecipientWarning>>(None);

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
            let tokens = fetch_nfts_for_owner(cid, selected_account_id, rpc_client, cache).await;
            let tid = token_id();
            tokens.into_iter().find(|t| t.token_id == tid)
        }
    });

    let check_recipient = move |recipient_to_check: String| {
        set_has_typed_recipient.set(true);

        let Ok(recipient_to_check) = recipient_to_check.parse::<AccountId>() else {
            set_recipient_balance.set(None);
            set_is_loading_recipient.set(false);
            set_recipient_warning.set(None);
            return;
        };
        set_is_loading_recipient.set(true);
        let rpc_client = client.get().clone();
        spawn_local(async move {
            let recipient_is_implicit = recipient_to_check
                .as_str()
                .chars()
                .all(|c| c.is_ascii_hexdigit())
                && recipient_to_check.as_str().len() == 64;
            let recipient_is_evm_implicit = recipient_to_check.as_str().starts_with("0x")
                && recipient_to_check
                    .as_str()
                    .chars()
                    .skip(2)
                    .all(|c| c.is_ascii_hexdigit())
                && recipient_to_check.as_str().len() == 42;
            let account_exists = recipient_is_implicit
                || recipient_is_evm_implicit
                || rpc_client
                    .view_account(
                        recipient_to_check.clone(),
                        QueryFinality::Finality(Finality::DoomSlug),
                    )
                    .await
                    .is_ok();

            if recipient_to_check == recipient.get_untracked() {
                if account_exists {
                    // Clone recipient for validator check and futures
                    let recipient_for_validator_check = recipient_to_check.clone();

                    let ft_metadata_future = rpc_client.call::<TokenMetadata>(
                        recipient_to_check.clone(),
                        "ft_metadata",
                        serde_json::json!({}),
                        QueryFinality::Finality(Finality::None),
                    );

                    let nft_metadata_future = rpc_client.call::<serde_json::Value>(
                        recipient_to_check.clone(),
                        "nft_metadata",
                        serde_json::json!({}),
                        QueryFinality::Finality(Finality::None),
                    );

                    let balance_future = rpc_client.view_account(
                        recipient_to_check.clone(),
                        QueryFinality::Finality(Finality::DoomSlug),
                    );
                    let (ft_metadata_result, nft_metadata_result, balance_result) =
                        join!(ft_metadata_future, nft_metadata_future, balance_future);

                    if ft_metadata_result.is_ok() {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is a token contract address, not someone's wallet address, sending NFTs to it would likely result in asset loss".to_string(),
                            link: Some(format!("/token/{}", recipient_for_validator_check)),
                            link_text: Some("View token details".to_string()),
                        }));
                    } else if nft_metadata_result.is_ok() {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is an NFT contract address, not someone's wallet address, sending NFTs to it would likely result in asset loss".to_string(),
                            link: Some(format!("/nfts/{}", recipient_for_validator_check)),
                            link_text: Some("View NFT collection".to_string()),
                        }));
                    } else if is_validator_supported(
                        &recipient_for_validator_check,
                        network.get_untracked(),
                    ) {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is a validator address. Sending NFTs to validators will result in asset loss. Consider using the staking functionality instead".to_string(),
                            link: Some(format!("/stake/{}/stake", recipient_for_validator_check)),
                            link_text: Some("Stake instead".to_string()),
                        }));
                    } else if recipient_is_evm_implicit
                        && !balance_result.as_ref().is_ok_and(|a| !a.amount.is_zero())
                    {
                        set_recipient_warning.set(Some(RecipientWarning {
                            message: "This is an EVM-like address on NEAR blockchain. These addresses are supported, but they're incredibly rare, so you probably don't want to do this. Please use a bridge if you want to send tokens to Ethereum or other networks".to_string(),
                            link: None,
                            link_text: None,
                        }));
                    } else {
                        set_recipient_warning.set(None);
                    }

                    let balance = balance_result
                        .map(|b| b.amount)
                        .unwrap_or(NearToken::default());
                    set_recipient_balance.set(Some(balance));
                } else {
                    set_recipient_balance.set(None);
                    set_recipient_warning.set(None);
                }
                set_is_loading_recipient.set(false);
            }
        });
    };

    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let (navigate, _) = signal(use_navigate());
    let handle_send = move |_| {
        if recipient_balance.get().is_none() {
            return;
        }

        let transaction_description = format!(
            "Send {} to {}",
            nft_token
                .get()
                .and_then(|m| m?.metadata.title.clone())
                .unwrap_or_default(),
            recipient.get()
        );
        let Ok(recipient) = recipient.get().parse::<AccountId>() else {
            panic!(
                "Recipient '{}' cannot be parsed as AccountId, yet recipient_balance is Some",
                recipient()
            );
        };
        let Ok(contract_id) = contract_id().parse::<AccountId>() else {
            panic!(
                "Contract ID '{}' cannot be parsed as AccountId",
                contract_id()
            );
        };
        let token_id = token_id();
        let signer_id = accounts
            .get_untracked()
            .selected_account_id
            .expect("No account selected yet tried to send NFT");
        spawn_local(async move {
            let actions = vec![Action::FunctionCall(Box::new(FunctionCallAction {
                method_name: "nft_transfer".to_string(),
                args: serde_json::to_vec(&serde_json::json!({
                    "receiver_id": recipient,
                    "token_id": token_id,
                }))
                .unwrap(),
                gas: NearGas::from_tgas(5).as_gas(),
                deposit: NearToken::from_yoctonear(1),
            }))];
            let (rx, transaction) = EnqueuedTransaction::create(
                transaction_description,
                signer_id,
                contract_id.clone(),
                actions,
            );
            add_transaction.update(|txs| txs.push(transaction));
            if rx.await.is_ok() {
                cache.update(|cache| {
                    cache
                        .entry(contract_id.clone())
                        .and_modify(|c| c.tokens.retain(|t| t.token_id != token_id));
                });
                (navigate.get_untracked())("/nfts", NavigateOptions::default());
            }
        });

        // Clear form fields
        set_recipient.set("".to_string());
        set_has_typed_recipient.set(false);
        set_recipient_balance.set(None);
    };

    let navigate = use_navigate();

    view! {
        <div class="flex flex-col gap-4 p-2 md:p-4 transition-all duration-100">
            <button
                class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 cursor-pointer"
                on:click=move |_| {
                    navigate(
                        &format!("/nfts/{}/{}", contract_id(), token_id()),
                        NavigateOptions::default(),
                    );
                }
            >
                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                <span>Back</span>
            </button>

            {move || {
                match nft_token.get() {
                    Some(Some(token)) => {
                        let title = token
                            .metadata
                            .title
                            .clone()
                            .unwrap_or_else(|| "Untitled".to_string());
                        let media_opt = token.metadata.media.clone();
                        let base_uri = collection_metadata
                            .get()
                            .and_then(|m| m)
                            .and_then(|m| m.base_uri.clone())
                            .unwrap_or_default();
                        view! {
                            <div class="flex flex-col gap-4">
                                <div class="bg-neutral-900 rounded-xl p-4">
                                    <div class="flex items-center gap-3">
                                        {move || {
                                            if let Some(media_url) = &media_opt {
                                                let media_url = if media_url.contains(&base_uri)
                                                    || base_uri.is_empty()
                                                {
                                                    media_url.clone()
                                                } else {
                                                    format!("{}/{}", base_uri, media_url)
                                                };
                                                let low_res_url = proxify_url(&media_url, Resolution::Low);
                                                let high_res_url = proxify_url(
                                                    &media_url,
                                                    Resolution::High,
                                                );
                                                view! {
                                                    <div class="w-12 h-12 rounded-full overflow-hidden">
                                                        <ProgressiveImage
                                                            low_res_src=low_res_url
                                                            high_res_src=high_res_url
                                                            attr:class="object-cover h-full w-full"
                                                        />
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                view! {
                                                    <div class="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center">
                                                        <Icon icon=icondata::LuImage width="24" height="24" />
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                        }} <div>
                                            <h2 class="text-white text-xl font-bold">{title}</h2>
                                            <p class="text-gray-400">{token.token_id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col gap-4">
                                    <div class="flex flex-col gap-2">
                                        <label class="text-gray-400">Recipient</label>
                                        <input
                                            type="text"
                                            class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 text-base"
                                            style=move || {
                                                if has_typed_recipient.get() {
                                                    if recipient_balance.get().is_none()
                                                        && !is_loading_recipient.get()
                                                    {
                                                        "border: 2px solid rgb(239 68 68)"
                                                    } else if !is_loading_recipient.get()
                                                        && recipient_warning.get().is_none()
                                                    {
                                                        "border: 2px solid rgb(34 197 94)"
                                                    } else if !is_loading_recipient.get()
                                                        && recipient_warning.get().is_some()
                                                    {
                                                        "border: 2px solid rgb(234 179 8)"
                                                    } else {
                                                        "border: 2px solid rgb(55 65 81)"
                                                    }
                                                } else {
                                                    "border: 2px solid transparent"
                                                }
                                            }
                                            placeholder="account.near"
                                            prop:value=recipient
                                            on:input=move |ev| {
                                                let value = event_target_value(&ev).to_lowercase();
                                                set_recipient.set(value.clone());
                                                set_is_loading_recipient.set(true);
                                                set_recipient_balance.set(None);
                                                check_recipient(value);
                                            }
                                        />
                                        {move || {
                                            if let Some(warning) = recipient_warning.get() {
                                                view! {
                                                    <div class="text-yellow-500 text-sm mt-2 font-medium">
                                                        <div class="flex items-center gap-2 mb-1">
                                                            <Icon
                                                                icon=icondata::LuTriangleAlert
                                                                width="16"
                                                                height="16"
                                                                attr:class="min-w-4 min-h-4"
                                                            />
                                                            <span>{warning.message}</span>
                                                        </div>
                                                        {if let (Some(link), Some(link_text)) = (
                                                            warning.link,
                                                            warning.link_text,
                                                        ) {
                                                            view! {
                                                                <div class="ml-6">
                                                                    <A
                                                                        href=link
                                                                        attr:class="text-yellow-400 hover:text-yellow-300 underline cursor-pointer"
                                                                    >
                                                                        {link_text}
                                                                    </A>
                                                                </div>
                                                            }
                                                                .into_any()
                                                        } else {
                                                            ().into_any()
                                                        }}
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                        {move || {
                                            if let Some(recipient_balance) = recipient_balance.get() {
                                                view! {
                                                    <p class="text-green-500 text-sm mt-2 font-medium">
                                                        {move || {
                                                            if let Ok(recipient) = recipient.get().parse::<AccountId>()
                                                            {
                                                                format_account_id_no_hide(&recipient)
                                                            } else {
                                                                ().into_any()
                                                            }
                                                        }}" has "
                                                        {format_token_amount_no_hide(
                                                            recipient_balance.as_yoctonear(),
                                                            24,
                                                            "NEAR",
                                                        )}
                                                    </p>
                                                }
                                                    .into_any()
                                            } else if is_loading_recipient.get() {
                                                view! {
                                                    <p class="text-gray-400 text-sm mt-2 font-medium">
                                                        Checking...
                                                    </p>
                                                }
                                                    .into_any()
                                            } else if has_typed_recipient.get() {
                                                view! {
                                                    <p class="text-red-500 text-sm mt-2 font-medium">
                                                        "Account does not exist"
                                                    </p>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        }}
                                    </div>

                                    <button
                                        class="w-full bg-neutral-900/50 text-white rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed font-medium shadow-lg relative overflow-hidden hover:bg-neutral-900/70 enabled:bg-gradient-to-r enabled:from-blue-500 enabled:to-purple-500 enabled:hover:from-blue-600 enabled:hover:to-purple-600"
                                        disabled=move || {
                                            recipient_balance.get().is_none()
                                                || is_loading_recipient.get()
                                        }
                                        on:click=handle_send
                                    >
                                        <div class="flex items-center justify-center gap-2">
                                            {move || {
                                                if is_loading_recipient.get() {
                                                    view! {
                                                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    }
                                                        .into_any()
                                                } else {
                                                    view! {
                                                        <Icon icon=icondata::LuSend width="20" height="20" />
                                                        <span>Send</span>
                                                    }
                                                        .into_any()
                                                }
                                            }}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        }
                            .into_any()
                    }
                    Some(None) => {
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
                    None => {
                        view! {
                            <div class="flex items-center justify-center h-32">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        }
                            .into_any()
                    }
                }
            }}
        </div>
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
    let NftCacheContext { cache } = expect_context::<NftCacheContext>();
    let ConfigContext { config, set_config } = expect_context::<ConfigContext>();

    let collection_metadata = LocalResource::new(move || {
        let rpc_client = client.get().clone();
        async move {
            let Ok(cid) = contract_id().parse() else {
                return None;
            };
            fetch_nft_metadata(cid, rpc_client).await
        }
    });

    let spam_list = LocalResource::new(fetch_spam_list);
    let (is_reported, set_is_reported) = signal(false);

    let nft_token = LocalResource::new(move || {
        let rpc_client = client.get().clone();
        async move {
            let selected_account_id = accounts().selected_account_id?;
            let Ok(cid) = contract_id().parse() else {
                return None;
            };
            let tokens = fetch_nfts_for_owner(cid, selected_account_id, rpc_client, cache).await;
            let tid = token_id();
            tokens.into_iter().find(|t| t.token_id == tid)
        }
    });

    let nft_traits = LocalResource::new(move || {
        let rpc_client = client.get().clone();
        async move {
            let Ok(cid) = contract_id().parse::<AccountId>() else {
                return None;
            };
            let token_id = token_id();
            let base_uri = collection_metadata.await?.base_uri?;
            let token_data = fetch_nft_token(cid, token_id, rpc_client).await;
            let reference = token_data?.metadata.reference?;

            fetch_nft_traits(base_uri, reference).await
        }
    });

    let navigate = use_navigate();

    let toggle_hide_token =
        move |_| {
            if let (Ok(cid), tid) = (contract_id().parse::<AccountId>(), token_id()) {
                set_config.update(move |cfg| {
                    if let Some(idx) = cfg.hidden_nfts.iter().position(
                        |h| matches!(h, HiddenNft::Token(id, t) if id == &cid && t == &tid),
                    ) {
                        cfg.hidden_nfts.remove(idx);
                    } else {
                        cfg.hidden_nfts
                            .push(HiddenNft::Token(cid.clone(), tid.clone()));
                    }
                });
            }
        };

    let report_token = move |_e: MouseEvent| {
        if is_reported.get_untracked() {
            return;
        }
        if let (Ok(cid), tid) = (contract_id().parse::<AccountId>(), token_id()) {
            set_is_reported.set(true);
            spawn_local(async move {
                let item = HiddenNft::Token(cid, tid);
                let proxy_base = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");
                let url = format!("{}/report-spam", proxy_base);
                let client = reqwest::Client::new();
                if let Err(e) = client.post(&url).json(&item).send().await {
                    leptos::logging::error!("Failed to report spam: {e:?}");
                } else {
                    spam_list.refetch();
                }
            });
        }
    };

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
                        title=move || {
                            let cfg = config.get();
                            let hidden = if let (Ok(cid), tid) = (
                                contract_id().parse::<AccountId>(),
                                token_id(),
                            ) {
                                cfg.hidden_nfts
                                    .iter()
                                    .any(|h| {
                                        matches!(
                                            h,
                                            HiddenNft::Token(id, t)
                                            if id == &cid && t == &tid
                                        )
                                    })
                            } else {
                                false
                            };
                            if hidden { "Unhide" } else { "Hide" }
                        }
                        class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        style=move || {
                            let cfg = config.get();
                            let hidden = if let (Ok(cid), tid) = (
                                contract_id().parse::<AccountId>(),
                                token_id(),
                            ) {
                                cfg.hidden_nfts
                                    .iter()
                                    .any(|h| {
                                        matches!(
                                            h,
                                            HiddenNft::Token(id, t)
                                            if id == &cid && t == &tid
                                        )
                                    })
                            } else {
                                false
                            };
                            if hidden { "color: #facc15".to_string() } else { "".to_string() }
                        }
                        on:click=toggle_hide_token
                    >
                        <Icon icon=icondata::LuEyeOff width="20" height="20" />
                    </button>
                    {move || {
                        if is_reported.get() {
                            view! {
                                <span class="text-neutral-400 text-sm select-none">
                                    "Reported!"
                                </span>
                            }
                                .into_any()
                        } else {
                            view! {
                                <button
                                    title="Report"
                                    class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    on:click=report_token
                                >
                                    <Icon icon=icondata::LuFlag width="20" height="20" />
                                </button>
                            }
                                .into_any()
                        }
                    }}
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
                                        let low_res_url = proxify_url(&url, Resolution::Low);
                                        let high_res_url = proxify_url(&url, Resolution::High);
                                        view! {
                                            <div class="w-full h-[calc(min(60vh-100px,480px))] rounded-lg overflow-hidden bg-neutral-700">
                                                <ProgressiveImage
                                                    low_res_src=low_res_url
                                                    high_res_src=high_res_url
                                                    attr:class="object-cover h-full w-full"
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
                                }}
                                <A
                                    href=move || {
                                        format!("/send-nft/{}/{}", contract_id(), token_id())
                                    }
                                    attr:class="bg-neutral-900 rounded-xl p-2 py-4 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer w-full justify-center mb-4"
                                >
                                    <Icon icon=icondata::LuSend width="20" height="20" />
                                    <span>"Send"</span>
                                </A> <div class="space-y-4 px-2">
                                    <h2 class="text-2xl font-semibold text-white break-words">
                                        {title}
                                    </h2>
                                    <p class="text-neutral-400 whitespace-pre-wrap break-words mb-4">
                                        {if description.is_empty() {
                                            "No description".to_string()
                                        } else {
                                            description
                                        }}
                                    </p>

                                    {move || {
                                        match nft_traits.get() {
                                            Some(Some(traits)) if !traits.is_empty() => {
                                                view! {
                                                    <div class="mt-6">
                                                        <h3 class="text-lg font-semibold text-white mb-3">
                                                            "Traits"
                                                        </h3>
                                                        <div class="grid grid-cols-2 gap-3">
                                                            {traits
                                                                .into_iter()
                                                                .map(|trait_attr| {
                                                                    view! {
                                                                        <div class="bg-neutral-800 rounded-lg p-3">
                                                                            <div class="text-neutral-300 text-sm font-medium">
                                                                                {trait_attr.trait_type}
                                                                            </div>
                                                                            <div class="text-white text-base mt-1">
                                                                                {trait_attr.value}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                })
                                                                .collect::<Vec<_>>()}
                                                        </div>
                                                    </div>
                                                }
                                                    .into_any()
                                            }
                                            _ => view! { <div></div> }.into_any(),
                                        }
                                    }}
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
