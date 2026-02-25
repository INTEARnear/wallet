use base64::prelude::*;
use itertools::Itertools;
use std::time::Duration;

use crate::{
    components::progressive_image::ProgressiveImage,
    contexts::{
        accounts_context::AccountsContext, modal_context::ModalContext, tokens_context::TokenData,
        transaction_queue_context::TransactionQueueContext,
    },
    pages::nfts::{fetch_nft_metadata, fetch_nft_token},
    utils::{
        Resolution, format_token_amount, format_token_amount_full_precision,
        format_token_amount_no_hide, format_usd_value_no_hide, generate_qr_code, get_ft_metadata,
        proxify_url,
    },
};
use bigdecimal::{BigDecimal, Zero};
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::Icon;
use near_min_api::{
    QueryFinality, RpcClient,
    types::{
        AccountId, Action as NearAction, Balance, Finality, FunctionCallAction, NearGas, NearToken,
        near_crypto::{KeyType, PublicKey, SecretKey},
    },
};

use crate::{
    contexts::{
        rpc_context::RpcContext, tokens_context::Token,
        transaction_queue_context::EnqueuedTransaction,
    },
    pages::gifts::{Drop, gift_near_amount_after_fee},
    utils::StorageBalance,
};

const SLIMEDROP_CONTRACT_MAINNET: &str = "slimedrop.intear.near";
const WALLET_PRIMARY_URL: &str = "https://wallet.intear.tech";

#[derive(Debug, Clone)]
pub enum GiftToken {
    Near(NearToken),
    Nep141(AccountId, Balance),
    Nep171(AccountId, String),
}

impl GiftToken {
    pub fn from_drop(drop: &Drop) -> Vec<GiftToken> {
        let mut tokens = Vec::new();

        tokens.push(GiftToken::Near(drop.contents.near));

        for (account_id, amount) in &drop.contents.nep141 {
            tokens.push(GiftToken::Nep141(account_id.clone(), **amount));
        }

        for (contract_id, token_ids) in &drop.contents.nep171 {
            for token_id in token_ids {
                tokens.push(GiftToken::Nep171(contract_id.clone(), token_id.clone()));
            }
        }

        tokens
    }

    pub async fn format_for_message(&self, rpc_client: RpcClient) -> String {
        match self {
            GiftToken::Near(amount) => {
                format_token_amount_no_hide(amount.as_yoctonear(), 24, "NEAR")
            }
            GiftToken::Nep141(token_id, amount) => {
                if let Ok(metadata) = get_ft_metadata(token_id.clone(), rpc_client).await {
                    format_token_amount_no_hide(*amount, metadata.decimals, &metadata.symbol)
                } else {
                    format!("{} tokens", amount)
                }
            }
            GiftToken::Nep171(contract_id, token_id) => {
                if let Some(metadata) =
                    fetch_nft_metadata(contract_id.clone(), rpc_client, false).await
                {
                    format!("{} #{}", metadata.name, token_id)
                } else {
                    format!("NFT #{}", token_id)
                }
            }
        }
    }
}

pub async fn format_gift_tokens_for_message(tokens: &[GiftToken], rpc_client: RpcClient) -> String {
    let mut parts = Vec::new();

    for token in tokens {
        parts.push(token.format_for_message(rpc_client.clone()).await);
    }

    parts.join(" + ")
}

fn near_icon() -> String {
    format!(
        "data:image/svg+xml;base64,{}",
        BASE64_STANDARD.encode(include_bytes!("../data/near.svg"))
    )
}

#[component]
pub fn GiftTokenDisplay(token: GiftToken, class: &'static str) -> impl IntoView {
    match token {
        GiftToken::Near(amount) => view! {
            <span class=class>
                <img src=near_icon() class="w-5 h-5 rounded-full inline" />
                " "
                {move || format_token_amount_no_hide(amount.as_yoctonear(), 24, "NEAR")}
            </span>
        }
        .into_any(),
        GiftToken::Nep141(token_id, amount) => {
            view! { <ModalFtDisplay token_id=token_id amount=amount attr_class=class /> }.into_any()
        }
        GiftToken::Nep171(contract_id, token_id) => {
            view! { <ModalNftDisplay contract_id=contract_id token_id=token_id attr_class=class /> }
                .into_any()
        }
    }
}

#[component]
pub fn GiftTokensList(tokens: Vec<GiftToken>, class: &'static str) -> impl IntoView {
    view! {
        {Itertools::intersperse_with(
                tokens
                    .into_iter()
                    .map(|token| {
                        view! { <GiftTokenDisplay token=token class=class /> }.into_any()
                    }),
                || view! { <span class="text-gray-400">" + "</span> }.into_any(),
            )
            .collect::<Vec<_>>()}
    }
}

#[component]
fn ModalFtDisplay(token_id: AccountId, amount: u128, attr_class: &'static str) -> impl IntoView {
    let rpc_client = expect_context::<RpcContext>().client;

    let metadata_resource = LocalResource::new(move || {
        let token_id = token_id.clone();
        async move {
            get_ft_metadata(token_id, rpc_client.get_untracked())
                .await
                .ok()
        }
    });

    view! {
        <span class=attr_class>
            <Suspense fallback=move || {
                view! { <span class="text-gray-400">"Loading..."</span> }
            }>
                {move || {
                    metadata_resource
                        .get()
                        .map(|metadata_opt| {
                            if let Some(metadata) = metadata_opt {
                                let formatted_amount = format_token_amount(
                                    amount,
                                    metadata.decimals,
                                    &metadata.symbol,
                                );

                                view! {
                                    {if let Some(icon_url) = metadata.icon.clone() {
                                        view! {
                                            <img src=icon_url class="w-5 h-5 rounded-full inline" />
                                        }
                                            .into_any()
                                    } else {
                                        view! {
                                            <div class="w-5 h-5 rounded-full bg-orange-500 inline-flex items-center justify-center text-white text-xs">
                                                {metadata.symbol.chars().next().unwrap_or('?')}
                                            </div>
                                        }
                                            .into_any()
                                    }}
                                    " "
                                    {formatted_amount}
                                }
                                    .into_any()
                            } else {
                                view! { <span class="text-gray-400">"Unknown token"</span> }
                                    .into_any()
                            }
                        })
                        .unwrap_or_else(|| {
                            view! { <span class="text-gray-400">"Loading..."</span> }.into_any()
                        })
                }}
            </Suspense>
        </span>
    }
}

#[component]
fn ModalNftImageDisplay(
    contract_id: AccountId,
    token_id: String,
    attr_class: &'static str,
) -> impl IntoView {
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let contract_id_clone = contract_id.clone();
    let token_id_clone = token_id.clone();
    let token_id_for_display = token_id.clone();

    let metadata_resource = LocalResource::new(move || {
        let contract_id = contract_id.clone();
        async move { fetch_nft_metadata(contract_id, client.get_untracked(), false).await }
    });

    let nft_token_resource = LocalResource::new(move || {
        let contract_id = contract_id_clone.clone();
        let token_id = token_id_clone.clone();
        async move { fetch_nft_token(contract_id, token_id, client.get_untracked()).await }
    });

    view! {
        <div class=attr_class>
            <Suspense fallback=move || {
                view! {
                    <div class="w-[150px] h-[150px] bg-neutral-700 rounded-lg flex items-center justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                }
            }>
                {move || {
                    let metadata = metadata_resource.get();
                    let nft_token = nft_token_resource.get();
                    match (metadata, nft_token) {
                        (Some(Some(metadata)), Some(Some(nft_response))) => {
                            let display_name = format!(
                                "{} #{}",
                                metadata.name,
                                token_id_for_display.clone(),
                            );
                            let image_url = if let Some(media) = &nft_response.metadata.media {
                                if media.starts_with("http") {
                                    media.clone()
                                } else {
                                    format!(
                                        "{}/{}",
                                        metadata.base_uri.as_ref().unwrap_or(&"".to_string()),
                                        media,
                                    )
                                }
                            } else if let Some(base_uri) = &metadata.base_uri {
                                format!("{}/{}", base_uri, token_id_for_display.clone())
                            } else {
                                "".to_string()
                            };

                            view! {
                                <div class="space-y-3">
                                    <div class="w-[150px] h-[150px] rounded-lg overflow-hidden bg-neutral-700">
                                        {if !image_url.is_empty() {
                                            let low_res_url = proxify_url(&image_url, Resolution::Low);
                                            let high_res_url = proxify_url(
                                                &image_url,
                                                Resolution::High,
                                            );
                                            view! {
                                                <ProgressiveImage
                                                    low_res_src=low_res_url
                                                    high_res_src=high_res_url
                                                    attr:class="object-cover h-full w-full"
                                                />
                                            }
                                                .into_any()
                                        } else {
                                            view! {
                                                <div class="w-full h-full flex items-center justify-center">
                                                    <Icon
                                                        icon=icondata::LuImage
                                                        attr:class="w-12 h-12 text-gray-400"
                                                    />
                                                </div>
                                            }
                                                .into_any()
                                        }}
                                    </div>
                                    <div class="text-center">
                                        <div class="text-white text-sm font-medium truncate">
                                            {display_name}
                                        </div>
                                    </div>
                                </div>
                            }
                                .into_any()
                        }
                        (Some(Some(metadata)), _) => {
                            let display_name = format!(
                                "{} #{}",
                                metadata.name,
                                token_id_for_display.clone(),
                            );

                            view! {
                                <div class="space-y-3">
                                    <div class="w-[150px] h-[150px] rounded-lg overflow-hidden bg-neutral-700">

                                        <div class="w-full h-full flex items-center justify-center">
                                            <Icon
                                                icon=icondata::LuImage
                                                attr:class="w-12 h-12 text-gray-400"
                                            />
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-white text-sm font-medium truncate">
                                            {display_name}
                                        </div>
                                    </div>
                                </div>
                            }
                                .into_any()
                        }
                        _ => {
                            view! {
                                <div class="space-y-3">
                                    <div class="w-[150px] h-[150px] rounded-lg overflow-hidden bg-neutral-700 flex items-center justify-center">
                                        <Icon
                                            icon=icondata::LuImage
                                            attr:class="w-12 h-12 text-gray-400"
                                        />
                                    </div>
                                    <div class="text-center">
                                        <div class="text-gray-400 text-sm font-medium">
                                            "NFT #{}"
                                        </div>
                                    </div>
                                </div>
                            }
                                .into_any()
                        }
                    }
                }}
            </Suspense>
        </div>
    }
}

#[component]
fn ModalNftDisplay(
    contract_id: AccountId,
    token_id: String,
    attr_class: &'static str,
) -> impl IntoView {
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let contract_id_clone = contract_id.clone();
    let token_id_clone = token_id.clone();
    let token_id_for_display = token_id.clone();

    let metadata_resource = LocalResource::new(move || {
        let contract_id = contract_id.clone();
        async move { fetch_nft_metadata(contract_id, client.get_untracked(), false).await }
    });

    let nft_token_resource = LocalResource::new(move || {
        let contract_id = contract_id_clone.clone();
        let token_id = token_id_clone.clone();
        async move { fetch_nft_token(contract_id, token_id, client.get_untracked()).await }
    });

    view! {
        <span class=attr_class>
            <Suspense fallback=move || {
                view! { <span class="text-gray-400">"Loading..."</span> }
            }>
                {move || {
                    let metadata = metadata_resource.get();
                    let nft_token = nft_token_resource.get();
                    match (metadata, nft_token) {
                        (Some(Some(metadata)), Some(Some(_nft_response))) => {
                            let display_name = format!(
                                "{} #{}",
                                metadata.name,
                                token_id_for_display.clone(),
                            );

                            view! {
                                {if let Some(icon_url) = metadata.icon.clone() {
                                    let low_res_url = proxify_url(&icon_url, Resolution::Low);
                                    let high_res_url = proxify_url(&icon_url, Resolution::High);
                                    view! {
                                        <ProgressiveImage
                                            low_res_src=low_res_url
                                            high_res_src=high_res_url
                                            attr:class="w-5 h-5 rounded-full inline"
                                        />
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="w-5 h-5 rounded-full bg-purple-500 inline-flex items-center justify-center text-white text-xs">
                                            {metadata.name.chars().next().unwrap_or('?')}
                                        </div>
                                    }
                                        .into_any()
                                }}
                                " "
                                {display_name}
                            }
                                .into_any()
                        }
                        (Some(Some(metadata)), _) => {
                            let display_name = format!(
                                "{} #{}",
                                metadata.name,
                                token_id_for_display.clone(),
                            );
                            view! {
                                {if let Some(icon_url) = metadata.icon.clone() {
                                    let low_res_url = proxify_url(&icon_url, Resolution::Low);
                                    let high_res_url = proxify_url(&icon_url, Resolution::High);
                                    view! {
                                        <ProgressiveImage
                                            low_res_src=low_res_url
                                            high_res_src=high_res_url
                                            attr:class="w-5 h-5 rounded-full inline"
                                        />
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="w-5 h-5 rounded-full bg-purple-500 inline-flex items-center justify-center text-white text-xs">
                                            {metadata.name.chars().next().unwrap_or('?')}
                                        </div>
                                    }
                                        .into_any()
                                }}
                                " "
                                {display_name}
                            }
                                .into_any()
                        }
                        _ => view! { <span class="text-gray-400">"NFT #{}"</span> }.into_any(),
                    }
                }}
            </Suspense>
        </span>
    }
}

#[derive(Debug, Clone)]
pub struct GiftConfirmationData {
    pub near_token: TokenData,
    pub near_amount: Balance,
    pub near_amount_decimal: BigDecimal,
    pub fts: Vec<(TokenData, Balance, BigDecimal)>,
    pub nfts: Vec<(AccountId, String)>,
}

#[derive(Debug, Clone)]
pub struct GiftResult {
    pub gift_link: String,
    pub tokens: Vec<GiftToken>,
}

#[derive(Debug, Clone)]
pub struct CancelDropConfirmationData {
    pub public_key: PublicKey,
    pub drop: Drop,
}

#[derive(Debug, Clone)]
pub struct CancelDropResult {
    pub drop: Drop,
}

#[component]
pub fn GiftConfirmationModal(
    confirmation_data: GiftConfirmationData,
    clear_fields: impl Fn() + Copy + 'static,
) -> impl IntoView {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let ModalContext { modal } = expect_context::<ModalContext>();
    let rpc_client = expect_context::<RpcContext>().client;

    let confirmation_for_button = confirmation_data.clone();

    let near_amount_formatted = format_token_amount_full_precision(
        confirmation_data.near_amount,
        confirmation_data.near_token.token.metadata.decimals,
        &confirmation_data.near_token.token.metadata.symbol,
    );

    let near_amount_usd = if !confirmation_data
        .near_token
        .token
        .price_usd_hardcoded
        .is_zero()
    {
        Some(
            &confirmation_data.near_amount_decimal
                * &confirmation_data.near_token.token.price_usd_hardcoded,
        )
    } else {
        None
    };

    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <h3 class="text-white font-bold text-xl mb-2">"Confirm Gift"</h3>
                        <p class="text-gray-400 text-sm">
                            "Review the details below and confirm to create your NEAR gift."
                        </p>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">"NEAR Amount"</div>
                            <div class="flex items-center gap-3">
                                {match confirmation_data.near_token.token.metadata.icon.clone() {
                                    Some(icon) => {
                                        view! { <img src=icon class="w-8 h-8 rounded-full" /> }
                                            .into_any()
                                    }
                                    None => {
                                        view! {
                                            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                                                {confirmation_data
                                                    .near_token
                                                    .token
                                                    .metadata
                                                    .symbol
                                                    .chars()
                                                    .next()
                                                    .unwrap_or('?')}
                                            </div>
                                        }
                                            .into_any()
                                    }
                                }} <div class="text-left">
                                    <div class="text-white font-medium">
                                        {near_amount_formatted}
                                    </div>
                                    {move || {
                                        if let Some(usd) = &near_amount_usd {
                                            view! {
                                                <div class="text-gray-400 text-sm">
                                                    {format_usd_value_no_hide(usd.clone())}
                                                </div>
                                            }
                                                .into_any()
                                        } else {
                                            ().into_any()
                                        }
                                    }}
                                </div>
                            </div>
                        </div>

                        {if !confirmation_data.fts.is_empty() {
                            view! {
                                <div class="space-y-3">
                                    <div class="text-gray-400 text-sm">"Fungible Tokens"</div>
                                    {confirmation_data
                                        .fts
                                        .iter()
                                        .map(|(token_data, amount, amount_decimal)| {
                                            let token_amount_formatted = format_token_amount_full_precision(
                                                *amount,
                                                token_data.token.metadata.decimals,
                                                &token_data.token.metadata.symbol,
                                            );
                                            let token_amount_usd = if !token_data
                                                .token
                                                .price_usd_hardcoded
                                                .is_zero()
                                            {
                                                Some(amount_decimal * &token_data.token.price_usd_hardcoded)
                                            } else {
                                                None
                                            };

                                            view! {
                                                <div class="bg-neutral-800 rounded-lg p-3">
                                                    <div class="flex items-center gap-3">
                                                        {match token_data.token.metadata.icon.clone() {
                                                            Some(icon) => {
                                                                view! { <img src=icon class="w-6 h-6 rounded-full" /> }
                                                                    .into_any()
                                                            }
                                                            None => {
                                                                view! {
                                                                    <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                                                        {token_data
                                                                            .token
                                                                            .metadata
                                                                            .symbol
                                                                            .chars()
                                                                            .next()
                                                                            .unwrap_or('?')}
                                                                    </div>
                                                                }
                                                                    .into_any()
                                                            }
                                                        }} <div class="text-left">
                                                            <div class="text-white font-medium text-sm">
                                                                {token_amount_formatted}
                                                            </div>
                                                            {move || {
                                                                if let Some(usd) = &token_amount_usd {
                                                                    view! {
                                                                        <div class="text-gray-400 text-xs">
                                                                            {format_usd_value_no_hide(usd.clone())}
                                                                        </div>
                                                                    }
                                                                        .into_any()
                                                                } else {
                                                                    ().into_any()
                                                                }
                                                            }}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        })
                                        .collect::<Vec<_>>()}
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }}

                        {if !confirmation_data.nfts.is_empty() {
                            view! {
                                <div class="space-y-3">
                                    <div class="text-gray-400 text-sm">"NFTs"</div>
                                    <div class="grid grid-cols-2 gap-4">
                                        {confirmation_data
                                            .nfts
                                            .iter()
                                            .map(|(contract_id, token_id)| {
                                                let contract_id_clone = contract_id.clone();
                                                let token_id_clone = token_id.clone();
                                                view! {
                                                    <div class="bg-neutral-800 rounded-lg p-4">
                                                        <ModalNftImageDisplay
                                                            contract_id=contract_id_clone
                                                            token_id=token_id_clone
                                                            attr_class="flex flex-col items-center"
                                                        />
                                                    </div>
                                                }
                                            })
                                            .collect::<Vec<_>>()}
                                    </div>
                                </div>
                            }
                                .into_any()
                        } else {
                            ().into_any()
                        }}

                        <div class="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                            <div class="flex items-center gap-2">
                                <Icon
                                    icon=icondata::LuTriangleAlert
                                    attr:class="w-4 h-4 text-yellow-400 shrink-0"
                                />
                                <p class="text-yellow-200 text-xs">
                                    "Gifts functionality has not been audited. It's ok to use for small gifts, but we don't recommend transferring large amounts through Gifts."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button
                            class="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                            on:click=move |_| modal.set(None)
                        >
                            "Cancel"
                        </button>
                        <button
                            class="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-4 py-3 font-medium transition-all cursor-pointer"
                            on:click={
                                let confirmation_clone = confirmation_for_button.clone();
                                move |_| {
                                    let Some(selected_account_id) = accounts
                                        .get_untracked()
                                        .selected_account_id else {
                                        return;
                                    };
                                    modal.set(None);
                                    create_gift(
                                        confirmation_clone.clone().into(),
                                        selected_account_id,
                                        add_transaction,
                                        modal,
                                        clear_fields,
                                        rpc_client.get_untracked(),
                                    );
                                }
                            }
                        >
                            "Create Gift"
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn GiftSuccessModal(result: GiftResult) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let (is_copied, set_is_copied) = signal(false);

    let qr_code_resource = LocalResource::new({
        let gift_link = result.gift_link.clone();
        move || {
            let link = gift_link.clone();
            async move { generate_qr_code(&link, true).await }
        }
    });

    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuGift
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">
                            "Gift Created Successfully!"
                        </h3>
                        <p class="text-gray-400 text-sm">"Your gift has been created."</p>
                    </div>

                    <div class="bg-neutral-800 rounded-lg p-4 mb-4">
                        <div class="text-gray-400 text-sm mb-3">"Gift Contents:"</div>
                        <div class="flex items-center justify-center gap-2 flex-wrap mb-4">
                            <Icon icon=icondata::LuGift attr:class="w-5 h-5 text-blue-400" />
                            <span class="text-white font-medium flex items-center gap-2 flex-wrap">
                                <GiftTokensList
                                    tokens={result.tokens.clone()}
                                    class="inline-flex items-center gap-1"
                                />
                            </span>
                        </div>
                    </div>

                    <div class="bg-neutral-900 rounded-lg p-4 mb-4">
                        <div class="text-gray-400 text-sm mb-4">
                            "Share this link with the recipient:"
                        </div>

                        <div class="flex flex-col items-center mb-4">
                            <Suspense fallback=move || {
                                view! {
                                    <div class="w-32 h-32 bg-neutral-700 rounded-lg flex items-center justify-center mb-2">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                }
                            }>
                                {move || {
                                    qr_code_resource
                                        .get()
                                        .map(|qr_result| {
                                            if let Ok(qr_code_data_url) = qr_result {
                                                view! {
                                                    <img
                                                        src=qr_code_data_url
                                                        alt="QR Code for gift link"
                                                        class="w-64 h-64 rounded-lg mb-2"
                                                    />
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }
                                        })
                                        .unwrap_or_else(|| {
                                            view! {
                                                <div class="w-32 h-32 bg-neutral-700 rounded-lg flex items-center justify-center mb-2">
                                                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                </div>
                                            }
                                                .into_any()
                                        })
                                }}
                            </Suspense>
                        </div>

                        <div class="bg-neutral-700 rounded-lg p-3 break-all text-xs text-gray-200 font-mono">
                            {result.gift_link.clone()}
                        </div>
                        <button
                            class="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer text-sm"
                            on:click=move |_| {
                                let link = result.gift_link.clone();
                                let navigator = window().navigator();
                                let clipboard = navigator.clipboard();
                                let _ = clipboard.write_text(&link);
                                set_is_copied.set(true);
                                set_timeout(
                                    move || set_is_copied.set(false),
                                    Duration::from_secs(2),
                                );
                            }
                        >
                            {move || {
                                if is_copied.get() {
                                    view! {
                                        <div class="flex items-center justify-center gap-2">
                                            <Icon icon=icondata::LuCheck attr:class="w-4 h-4" />
                                            "Copied!"
                                        </div>
                                    }
                                        .into_any()
                                } else {
                                    view! {
                                        <div class="flex items-center justify-center gap-2">
                                            <Icon icon=icondata::LuCopy attr:class="w-4 h-4" />
                                            "Copy Link"
                                        </div>
                                    }
                                        .into_any()
                                }
                            }}
                        </button>
                    </div>

                    <button
                        class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn GiftErrorModal() -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuX
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">"Gift Creation Failed"</h3>
                        <p class="text-gray-400 text-sm">
                            "The gift creation transaction failed. Please check the transaction details and try again."
                        </p>
                    </div>

                    <button
                        class="w-full mt-6 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

#[derive(Debug, Clone)]
pub struct GiftCreationData {
    pub near_amount: Balance,
    pub fts: Vec<(AccountId, Balance)>,
    pub nfts: Vec<(AccountId, String)>,
}

impl From<GiftConfirmationData> for GiftCreationData {
    fn from(confirmation: GiftConfirmationData) -> Self {
        let fts = confirmation
            .fts
            .into_iter()
            .filter_map(|(token_data, amount, _)| {
                if let Token::Nep141(token_contract) = token_data.token.account_id {
                    Some((token_contract, amount))
                } else {
                    None
                }
            })
            .collect();

        Self {
            near_amount: confirmation.near_amount,
            fts,
            nfts: confirmation.nfts,
        }
    }
}

impl From<Drop> for GiftCreationData {
    fn from(drop: Drop) -> Self {
        Self {
            near_amount: drop.contents.near.as_yoctonear(),
            fts: drop
                .contents
                .nep141
                .into_iter()
                .map(|(contract_id, amount)| (contract_id, amount.into()))
                .collect(),
            nfts: drop
                .contents
                .nep171
                .into_iter()
                .flat_map(|(contract_id, token_ids)| {
                    token_ids
                        .into_iter()
                        .map(move |token_id| (contract_id.clone(), token_id))
                })
                .collect(),
        }
    }
}

fn create_gift(
    gift_data: GiftCreationData,
    selected_account_id: AccountId,
    add_transaction: WriteSignal<Vec<EnqueuedTransaction>>,
    modal: RwSignal<Option<Box<dyn Fn() -> AnyView>>, LocalStorage>,
    clear_fields: impl Fn() + 'static,
    rpc_client: RpcClient,
) {
    spawn_local(async move {
        let secret_key = SecretKey::from_random(KeyType::ED25519);
        let public_key = secret_key.public_key();

        let mut transactions = Vec::new();

        let near_action = NearAction::FunctionCall(Box::new(FunctionCallAction {
            method_name: "add_near".to_string(),
            args: serde_json::to_vec(&serde_json::json!({
                "public_key": public_key
            }))
            .unwrap(),
            gas: NearGas::from_tgas(30).into(),
            deposit: NearToken::from_yoctonear(gift_data.near_amount),
        }));
        transactions.push(EnqueuedTransaction::create(
            "Create gift".to_string(),
            selected_account_id.clone(),
            SLIMEDROP_CONTRACT_MAINNET.parse().unwrap(),
            vec![near_action],
            false,
        ));

        // let mut storage_requests = Vec::new();
        // for (token_contract, _) in &gift_data.fts {
        //     storage_requests.push((
        //         token_contract.clone(),
        //         "storage_balance_of",
        //         serde_json::json!({
        //             "account_id": SLIMEDROP_CONTRACT_MAINNET
        //         }),
        //         QueryFinality::Finality(Finality::DoomSlug),
        //     ));
        // }
        let storage_requests = gift_data
            .fts
            .iter()
            .map(|(token_contract, _)| {
                (
                    token_contract.clone(),
                    "storage_balance_of",
                    serde_json::json!({
                        "account_id": SLIMEDROP_CONTRACT_MAINNET
                    }),
                    QueryFinality::Finality(Finality::DoomSlug),
                )
            })
            .collect::<Vec<_>>();
        let storage_results = if !storage_requests.is_empty() {
            rpc_client
                .batch_call::<Option<StorageBalance>>(storage_requests)
                .await
                .unwrap_or_default()
        } else {
            Vec::new()
        };

        for ((token_contract, token_amount), storage_result) in
            gift_data.fts.iter().zip(storage_results.iter())
        {
            let needs_storage_deposit = match storage_result {
                Ok(storage_balance) => match storage_balance {
                    Some(storage_balance) => storage_balance.total.is_zero(),
                    None => true,
                },
                Err(_) => false,
            };

            let token_symbol =
                match get_ft_metadata(token_contract.clone(), rpc_client.clone()).await {
                    Ok(metadata) => metadata.symbol,
                    Err(_) => "<Unknown>".to_string(),
                };

            let mut actions = Vec::new();
            if needs_storage_deposit {
                let storage_action = NearAction::FunctionCall(Box::new(FunctionCallAction {
                    method_name: "storage_deposit".to_string(),
                    args: serde_json::to_vec(&serde_json::json!({
                        "account_id": SLIMEDROP_CONTRACT_MAINNET,
                        "registration_only": true,
                    }))
                    .unwrap(),
                    gas: NearGas::from_tgas(5).into(),
                    deposit: "0.00125 NEAR".parse().unwrap(),
                }));
                actions.push(storage_action);
            }

            let token_action = NearAction::FunctionCall(Box::new(FunctionCallAction {
                method_name: "ft_transfer_call".to_string(),
                args: serde_json::to_vec(&serde_json::json!({
                    "receiver_id": SLIMEDROP_CONTRACT_MAINNET,
                    "amount": token_amount.to_string(),
                    "msg": serde_json::json!({"public_key": public_key}).to_string()
                }))
                .unwrap(),
                gas: NearGas::from_tgas(100).into(),
                deposit: NearToken::from_yoctonear(1),
            }));
            actions.push(token_action);

            let (details_tx, transaction) = EnqueuedTransaction::create(
                format!("Add {} to gift", token_symbol),
                selected_account_id.clone(),
                token_contract.clone(),
                actions,
                false,
            );
            transactions.push((details_tx, transaction.in_same_queue_as(&transactions[0].1)));
        }

        let nft_storage_requests = gift_data
            .nfts
            .iter()
            .map(|(contract_id, _)| contract_id.clone())
            .unique()
            .map(|contract_id| {
                (
                    contract_id.clone(),
                    "storage_balance_of",
                    serde_json::json!({
                        "account_id": SLIMEDROP_CONTRACT_MAINNET
                    }),
                    QueryFinality::Finality(Finality::DoomSlug),
                )
            })
            .collect::<Vec<_>>();

        let nft_storage_results = if !nft_storage_requests.is_empty() {
            rpc_client
                .batch_call::<Option<StorageBalance>>(nft_storage_requests.clone())
                .await
                .unwrap_or_default()
        } else {
            Vec::new()
        };

        for (contract_id, token_id) in &gift_data.nfts {
            let nft_name =
                match fetch_nft_metadata(contract_id.clone(), rpc_client.clone(), false).await {
                    Some(metadata) => metadata.name,
                    None => "NFT".to_string(),
                };

            let request_index = nft_storage_requests
                .iter()
                .position(|(token_contract_id, _, _, _)| token_contract_id == contract_id)
                .unwrap();
            let needs_storage_deposit =
                if let Some(storage_result) = nft_storage_results.get(request_index) {
                    match storage_result {
                        Ok(storage_balance) => match storage_balance {
                            Some(storage_balance) => {
                                storage_balance.available <= "0.01".parse().unwrap()
                            }
                            None => true,
                        },
                        Err(_) => false,
                    }
                } else {
                    false
                };

            let mut actions = Vec::new();
            if needs_storage_deposit {
                let storage_action = NearAction::FunctionCall(Box::new(FunctionCallAction {
                    method_name: "storage_deposit".to_string(),
                    args: serde_json::to_vec(&serde_json::json!({
                        "account_id": SLIMEDROP_CONTRACT_MAINNET,
                        "registration_only": true,
                    }))
                    .unwrap(),
                    gas: NearGas::from_tgas(5).into(),
                    deposit: "0.01 NEAR".parse().unwrap(),
                }));
                actions.push(storage_action);
            }

            let nft_action = NearAction::FunctionCall(Box::new(FunctionCallAction {
                method_name: "nft_transfer_call".to_string(),
                args: serde_json::to_vec(&serde_json::json!({
                    "receiver_id": SLIMEDROP_CONTRACT_MAINNET,
                    "token_id": token_id,
                    "msg": serde_json::json!({"public_key": public_key}).to_string()
                }))
                .unwrap(),
                gas: NearGas::from_tgas(100).into(),
                deposit: NearToken::from_yoctonear(1),
            }));
            actions.push(nft_action);

            let (details_tx, transaction) = EnqueuedTransaction::create(
                format!("Add {} #{} to gift", nft_name, token_id),
                selected_account_id.clone(),
                contract_id.clone(),
                actions,
                false,
            );
            transactions.push((details_tx, transaction.in_same_queue_as(&transactions[0].1)));
        }

        let (details_receivers, transactions): (Vec<_>, Vec<_>) = transactions.into_iter().unzip();
        add_transaction.update(|queue| queue.extend(transactions));

        let private_key_base58 =
            bs58::encode(&secret_key.unwrap_as_ed25519().0[..ed25519_dalek::SECRET_KEY_LENGTH])
                .into_string();
        let gift_url = format!("{WALLET_PRIMARY_URL}/gifts/{}", private_key_base58);

        let mut all_successful = true;
        for details_receiver in details_receivers {
            if details_receiver.await.is_err() {
                all_successful = false;
                break;
            }
        }

        if all_successful {
            log::info!("Gift created successfully");
            let mut tokens = Vec::new();
            let near_amount_after_fee = gift_near_amount_after_fee(
                NearToken::from_yoctonear(gift_data.near_amount),
                gift_data.fts.len(),
                gift_data.nfts.len(),
            );
            tokens.push(GiftToken::Near(near_amount_after_fee));
            for (contract_id, amount) in &gift_data.fts {
                tokens.push(GiftToken::Nep141(contract_id.clone(), *amount));
            }
            for (contract_id, token_id) in &gift_data.nfts {
                tokens.push(GiftToken::Nep171(contract_id.clone(), token_id.clone()));
            }
            let result = GiftResult {
                gift_link: gift_url,
                tokens,
            };
            modal.set(Some(Box::new(move || {
                view! { <GiftSuccessModal result=result.clone() /> }.into_any()
            })));
        } else {
            modal.set(Some(Box::new(move || {
                view! { <GiftErrorModal /> }.into_any()
            })));
        }
        clear_fields();
    });
}

#[component]
pub fn CancelDropConfirmationModal(
    confirmation_data: CancelDropConfirmationData,
    clear_fields: impl Fn() + Copy + 'static,
) -> impl IntoView {
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let ModalContext { modal } = expect_context::<ModalContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();

    let confirmation_for_button = confirmation_data.clone();

    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <h3 class="text-white font-bold text-xl mb-2">"Cancel Gift"</h3>
                        <p class="text-gray-400 text-sm">
                            "Are you sure you want to cancel this gift? The tokens will be returned to you."
                        </p>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-neutral-800 rounded-lg p-4">
                            <div class="text-gray-400 text-sm mb-2">"Gift contents"</div>
                            <div class="flex items-center justify-center gap-2 flex-wrap">
                                <Icon icon=icondata::LuGift attr:class="w-5 h-5 text-blue-400" />
                                <span class="text-white font-medium flex items-center gap-2 flex-wrap">
                                    <GiftTokensList
                                        tokens={GiftToken::from_drop(&confirmation_data.drop)}
                                        class="inline-flex items-center gap-1"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button
                            class="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                            on:click=move |_| modal.set(None)
                        >
                            "Keep Gift"
                        </button>
                        <button
                            class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-4 py-3 font-medium transition-all cursor-pointer"
                            on:click={
                                let confirmation_clone = confirmation_for_button.clone();
                                move |_| {
                                    let Some(selected_account_id) = accounts
                                        .get_untracked()
                                        .selected_account_id else {
                                        return;
                                    };
                                    modal.set(None);
                                    execute_cancel_drop(
                                        confirmation_clone.clone(),
                                        selected_account_id,
                                        add_transaction,
                                        modal,
                                        client.get_untracked(),
                                        clear_fields,
                                    );
                                }
                            }
                        >
                            "Cancel Gift"
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn CancelDropSuccessModal(
    result: CancelDropResult,
    clear_fields: impl Fn() + 'static + Copy,
) -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();
    let TransactionQueueContext {
        add_transaction, ..
    } = expect_context::<TransactionQueueContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();

    let gift_message = LocalResource::new({
        let drop_clone = result.drop.clone();
        move || {
            let tokens = GiftToken::from_drop(&drop_clone);
            async move { format_gift_tokens_for_message(&tokens, client.get_untracked()).await }
        }
    });

    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuCheck
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">
                            "Gift Cancelled Successfully!"
                        </h3>
                        <p class="text-gray-400 text-sm">
                            <Suspense fallback=move || {
                                view! {
                                    <div class="flex items-center justify-center gap-2">
                                        <div class="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                                        "Loading gift details..."
                                    </div>
                                }
                            }>
                                {move || {
                                    gift_message
                                        .get()
                                        .map(|message| {
                                            format!(
                                                "Your {} gift has been cancelled and the tokens have been returned to your account.",
                                                message,
                                            )
                                        })
                                }}
                            </Suspense>
                        </p>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button
                            class="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                            on:click=move |_| modal.set(None)
                        >
                            "Close"
                        </button>
                        <button
                            class="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-4 py-3 font-medium transition-all cursor-pointer"
                            on:click={
                                let drop_clone = result.drop.clone();
                                move |_| {
                                    modal.set(None);
                                    create_gift(
                                        drop_clone.clone().into(),
                                        accounts.get_untracked().selected_account_id.unwrap(),
                                        add_transaction,
                                        modal,
                                        clear_fields,
                                        client.get_untracked(),
                                    );
                                }
                            }
                        >
                            "Re-create Gift"
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn CancelDropErrorModal() -> impl IntoView {
    let ModalContext { modal } = expect_context::<ModalContext>();
    view! {
        <div
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            on:click=move |_| modal.set(None)
        >
            <div
                on:click=|ev| ev.stop_propagation()
                class="bg-neutral-900 rounded-2xl p-6 max-w-md w-full"
            >
                <div class="text-center">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon
                                icon=icondata::LuX
                                width="32"
                                height="32"
                                attr:class="text-white"
                            />
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">"Cancel Failed"</h3>
                        <p class="text-gray-400 text-sm">
                            "The gift cancellation failed. Please try again."
                        </p>
                    </div>

                    <button
                        class="w-full mt-6 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer"
                        on:click=move |_| modal.set(None)
                    >
                        "Close"
                    </button>
                </div>
            </div>
        </div>
    }
}

fn execute_cancel_drop(
    confirmation: CancelDropConfirmationData,
    selected_account_id: AccountId,
    add_transaction: WriteSignal<Vec<EnqueuedTransaction>>,
    modal: RwSignal<Option<Box<dyn Fn() -> AnyView>>, LocalStorage>,
    rpc_client: RpcClient,
    clear_fields: impl Fn() + 'static + Copy,
) {
    spawn_local(async move {
        let action = NearAction::FunctionCall(Box::new(FunctionCallAction {
            method_name: "cancel_drop".to_string(),
            args: serde_json::to_vec(&serde_json::json!({
                "public_key": confirmation.public_key
            }))
            .unwrap(),
            gas: NearGas::from_tgas(300).into(),
            deposit: NearToken::from_yoctonear(0),
        }));

        let gift_contents =
            format_gift_tokens_for_message(&GiftToken::from_drop(&confirmation.drop), rpc_client)
                .await;
        let (details_receiver, transaction) = EnqueuedTransaction::create(
            format!("Cancel gift of {}", gift_contents),
            selected_account_id.clone(),
            SLIMEDROP_CONTRACT_MAINNET.parse().unwrap(),
            vec![action],
            false,
        );

        add_transaction.update(|queue| queue.push(transaction));

        match details_receiver.await {
            Ok(_) => {
                let result = CancelDropResult {
                    drop: confirmation.drop.clone(),
                };

                modal.set(Some(Box::new(move || {
                    view! { <CancelDropSuccessModal result=result.clone() clear_fields=clear_fields /> }.into_any()
                })));
                clear_fields();
            }
            Err(_) => {
                modal.set(Some(Box::new(move || {
                    view! { <CancelDropErrorModal /> }.into_any()
                })));
            }
        }
    });
}
