use std::collections::HashMap;

use leptos::prelude::*;
use near_min_api::types::AccountId;
use serde::{Deserialize, Serialize};

use crate::contexts::accounts_context::AccountsContext;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NftContractMetadata {
    pub name: String,
    pub symbol: String,
    pub icon: Option<String>,
    pub base_uri: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NftTokenMetadata {
    pub title: Option<String>,
    pub description: Option<String>,
    pub media: Option<String>,
    pub reference: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NftToken {
    pub token_id: String,
    pub owner_id: AccountId,
    pub metadata: NftTokenMetadata,
}

#[derive(Debug, Clone)]
pub struct OwnedCollection {
    pub contract_id: AccountId,
    pub metadata: Option<NftContractMetadata>,
    pub tokens: Vec<NftToken>,
}

/// A context that keeps NFT data already fetched for the selected account.
/// Should only be updated on /nfts page, so it's safe to assume that if
/// an NFT is not here, and the cache is not empty, it's not owned by the
/// selected account.
#[derive(Clone, Copy)]
pub struct NftCacheContext {
    pub cache: RwSignal<HashMap<AccountId, OwnedCollection>>,
}

pub fn provide_nft_cache_context() {
    let accounts_context = expect_context::<AccountsContext>();

    let selected_account_memo =
        Memo::new(move |_| accounts_context.accounts.get().selected_account_id);

    let cache = RwSignal::new(HashMap::new());

    Effect::new(move || {
        let _ = selected_account_memo.get(); // .track() doesn't work here for some reason
        cache.update(|map| map.clear());
    });

    provide_context(NftCacheContext { cache });
}
