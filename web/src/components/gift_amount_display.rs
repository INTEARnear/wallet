use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::hooks::use_location;
use near_min_api::{
    QueryFinality,
    types::{
        AccountId, Finality,
        near_crypto::{ED25519SecretKey, SecretKey},
    },
};

use crate::{
    components::{
        gift_modals::{GiftToken, GiftTokensList},
        progressive_image::ProgressiveImage,
    },
    contexts::{
        accounts_context::AccountsContext,
        network_context::{Network, NetworkContext},
        rpc_context::RpcContext,
    },
    pages::{
        gifts::{Drop, DropStatus},
        nfts::{fetch_nft_metadata, fetch_nft_token},
    },
    utils::{Resolution, format_account_id, proxify_url},
};

const SLIMEDROP_CONTRACT_MAINNET: &str = "slimedrop.intear.near";

#[component]
fn GiftNftImageDisplay(
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
                    <div class="w-[200px] h-[200px] bg-neutral-700 rounded-lg flex items-center justify-center">
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
                                format!(
                                    "{}/{}",
                                    metadata.base_uri.as_ref().unwrap_or(&"".to_string()),
                                    media,
                                )
                            } else {
                                "".to_string()
                            };

                            view! {
                                <div class="space-y-3">
                                    <div class="w-[200px] h-[200px] rounded-lg overflow-hidden bg-neutral-700">
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
                                            ().into_any()
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
                                    <div class="w-[200px] h-[200px] rounded-lg overflow-hidden bg-neutral-700">
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
                                    <div class="w-[200px] h-[200px] rounded-lg overflow-hidden bg-neutral-700 flex items-center justify-center">
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

#[derive(Debug, Clone)]
enum GiftState {
    InvalidKey,
    NotFound,
    NotMainnet,
    Available { drop: Box<Drop> },
    AlreadyClaimed { claimed_by: AccountId },
    Cancelled,
}

#[component]
pub fn GiftAmountDisplay() -> impl IntoView {
    let location = use_location();
    let NetworkContext { network } = expect_context::<NetworkContext>();
    let RpcContext { client, .. } = expect_context::<RpcContext>();
    let AccountsContext { accounts, .. } = expect_context::<AccountsContext>();

    let private_key_param = move || {
        location
            .pathname
            .get_untracked()
            .split("/")
            .nth(2) // the path is /gifts/<private_key>
            .map(|s| s.to_string())
    };

    let gift_state_resource = LocalResource::new(move || {
        let network = network.get();
        let private_key_b58 = private_key_param();
        let rpc_client = client.get();

        async move {
            if network != Network::Mainnet {
                return GiftState::NotMainnet;
            }

            let Some(private_key_b58) = private_key_b58 else {
                return GiftState::InvalidKey;
            };

            let Some(public_key) = parse_gift_private_key_to_secret(&private_key_b58)
                .map(|secret_key| secret_key.public_key())
            else {
                return GiftState::InvalidKey;
            };

            let request_result = rpc_client
                .call::<Drop>(
                    SLIMEDROP_CONTRACT_MAINNET.parse().unwrap(),
                    "get_key_info",
                    serde_json::json!({
                        "key": public_key
                    }),
                    QueryFinality::Finality(Finality::None),
                )
                .await;

            match request_result {
                Ok(drop) => match &drop.status {
                    DropStatus::Cancelled => GiftState::Cancelled,
                    DropStatus::Active => {
                        if let Some(claim) = drop.claims.iter().next() {
                            GiftState::AlreadyClaimed {
                                claimed_by: claim.0.clone(),
                            }
                        } else {
                            GiftState::Available {
                                drop: Box::new(drop),
                            }
                        }
                    }
                },
                Err(e) => {
                    log::error!("Failed to fetch gift info: {:?}", e);
                    GiftState::NotFound
                }
            }
        }
    });

    view! {
        <Suspense fallback=move || {
            view! {
                <div class="bg-neutral-900/50 rounded-2xl p-6 text-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-3"></div>
                    <p class="text-gray-400 text-sm">"Loading gift..."</p>
                </div>
            }
        }>
            {move || {
                gift_state_resource
                    .get()
                    .map(|gift_state| {
                        match gift_state {
                            GiftState::NotMainnet => {
                                view! {
                                    <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-4 text-center">
                                        <div class="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icon
                                                icon=icondata::LuInfo
                                                attr:class="w-6 h-6 text-yellow-500"
                                            />
                                        </div>
                                        <p class="text-yellow-400 text-sm font-medium">
                                            "Switch to Mainnet"
                                        </p>
                                        <p class="text-gray-400 text-xs mt-1">
                                            "Gifts only work on NEAR Mainnet"
                                        </p>
                                    </div>
                                }
                                    .into_any()
                            }
                            GiftState::InvalidKey => {
                                view! {
                                    <div class="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-center">
                                        <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icon
                                                icon=icondata::LuCircleX
                                                attr:class="w-6 h-6 text-red-500"
                                            />
                                        </div>
                                        <p class="text-red-400 text-sm font-medium">
                                            "Invalid Gift Link"
                                        </p>
                                        <p class="text-gray-400 text-xs mt-1">
                                            "This link is corrupted or invalid"
                                        </p>
                                    </div>
                                }
                                    .into_any()
                            }
                            GiftState::NotFound => {
                                view! {
                                    <div class="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-center">
                                        <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icon
                                                icon=icondata::LuGift
                                                attr:class="w-6 h-6 text-red-500"
                                            />
                                        </div>
                                        <p class="text-red-400 text-sm font-medium">
                                            "Gift Not Found"
                                        </p>
                                        <p class="text-gray-400 text-xs mt-1">
                                            "This gift doesn't exist"
                                        </p>
                                    </div>
                                }
                                    .into_any()
                            }
                            GiftState::AlreadyClaimed { claimed_by } => {
                                view! {
                                    <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-4 text-center">
                                        <div class="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icon
                                                icon=icondata::LuCheck
                                                attr:class="w-6 h-6 text-yellow-500"
                                            />
                                        </div>
                                        <p class="text-yellow-400 text-sm font-medium">
                                            "Already Claimed"
                                        </p>
                                        <p class="text-gray-400 text-xs mt-1">
                                            "This gift has already been claimed by "
                                            {if accounts().selected_account_id.as_ref()
                                                == Some(&claimed_by)
                                            {
                                                view! { "you" }.into_any()
                                            } else {
                                                format_account_id(&claimed_by)
                                            }}
                                        </p>
                                    </div>
                                }
                                    .into_any()
                            }
                            GiftState::Cancelled => {
                                view! {
                                    <div class="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-center">
                                        <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icon
                                                icon=icondata::LuBan
                                                attr:class="w-6 h-6 text-red-500"
                                            />
                                        </div>
                                        <p class="text-red-400 text-sm font-medium">
                                            "Gift Cancelled"
                                        </p>
                                        <p class="text-gray-400 text-xs mt-1">
                                            "This gift was cancelled"
                                        </p>
                                    </div>
                                }
                                    .into_any()
                            }
                            GiftState::Available { drop } => {
                                let tokens = GiftToken::from_drop(&drop);
                                let nfts: Vec<_> = tokens
                                    .iter()
                                    .filter_map(|token| {
                                        if let GiftToken::Nep171(contract_id, token_id) = token {
                                            Some((contract_id.clone(), token_id.clone()))
                                        } else {
                                            None
                                        }
                                    })
                                    .collect();

                                view! {
                                    <div class="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-4 text-center">
                                        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icon
                                                icon=icondata::LuGift
                                                attr:class="w-8 h-8 text-white"
                                            />
                                        </div>
                                        <div class="space-y-4">
                                            {if !nfts.is_empty() {
                                                view! {
                                                    <div class="grid grid-cols-1 gap-4 justify-items-center">
                                                        {nfts
                                                            .into_iter()
                                                            .map(|(contract_id, token_id)| {
                                                                view! {
                                                                    <GiftNftImageDisplay
                                                                        contract_id=contract_id
                                                                        token_id=token_id
                                                                        attr_class="flex flex-col items-center"
                                                                    />
                                                                }
                                                            })
                                                            .collect::<Vec<_>>()}
                                                    </div>
                                                }
                                                    .into_any()
                                            } else {
                                                ().into_any()
                                            }}
                                            <div class="flex items-center justify-center gap-2 flex-wrap">
                                                <GiftTokensList
                                                    tokens=tokens
                                                    class="flex items-center gap-2"
                                                />
                                            </div>
                                        </div>
                                        <p class="text-gray-400 text-sm mt-2">
                                            "Gift from " {format_account_id(&drop.created_by)}
                                        </p>
                                    </div>
                                }
                                    .into_any()
                            }
                        }
                    })
            }}
        </Suspense>
    }
}

pub fn parse_gift_private_key_to_secret(private_key_b58: &str) -> Option<SecretKey> {
    let bytes = bs58::decode(private_key_b58).into_vec().ok()?;

    if bytes.len() != 32 {
        return None;
    }

    let signing_key = ed25519_dalek::SigningKey::from_bytes(&bytes.try_into().ok()?);
    let keypair_bytes = signing_key.to_keypair_bytes();
    Some(SecretKey::ED25519(ED25519SecretKey(keypair_bytes)))
}
