use crate::contexts::accounts_context::AccountsContext;
use crate::contexts::config_context::ConfigContext;
use crate::contexts::network_context::{Network, NetworkContext};
use crate::contexts::tokens_context::TokensContext;
use crate::utils::{
    balance_to_decimal, format_token_amount, format_usd_value, get_ft_metadata, power_of_10,
    USDT_DECIMALS,
};
use bigdecimal::{BigDecimal, ToPrimitive};
use futures_util::future::join_all;
use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_icons::*;
use leptos_router::components::A;
use near_min_api::types::{AccountId, Balance};
use near_min_api::utils::dec_format;
use serde::{Deserialize, Serialize};

const AIRDROPS: &[(i32, &str)] = &[
    (2, "RHEA Genesis Airdrop"),
    (3, "NEAR Yappers Airdrop"),
    (4, "Rhea Yappers Airdrop"),
];

#[derive(Debug, Clone, Deserialize)]
struct AirdropClaimToken {
    token_addr: AccountId,
    #[serde(with = "dec_format")]
    reward_amount: Balance,
}

#[derive(Debug, Clone, Deserialize)]
struct AirdropData {
    claimable: bool,
    claim_tokens: Vec<AirdropClaimToken>,
}

#[derive(Debug, Clone, Deserialize)]
struct AirdropResponse {
    data: AirdropData,
}

#[derive(Serialize)]
struct AirdropClaimRequest {
    addr: AccountId,
    airdrop_id: i32,
}

#[component]
fn AirdropButton(
    airdrop_id: i32,
    tokens: Vec<AirdropClaimToken>,
    reload_trigger: WriteSignal<u32>,
) -> impl IntoView {
    let airdrop_name = AIRDROPS
        .iter()
        .find(|(id, _)| *id == airdrop_id)
        .map(|(_, name)| *name)
        .unwrap_or("Unknown Airdrop");

    let accounts_context = expect_context::<AccountsContext>();
    let (is_claiming, set_is_claiming) = signal(false);

    let tokens_for_resource = tokens.clone();
    let tokens_metadata = LocalResource::new(move || {
        let tokens = tokens_for_resource.clone();
        async move {
            let metadata_futures = tokens
                .into_iter()
                .map(|token| async { get_ft_metadata(token.token_addr).await.ok() });

            join_all(metadata_futures).await
        }
    });

    view! {
        <button
            class=move || {
                if is_claiming.get() {
                    "inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 opacity-50 cursor-not-allowed"
                } else {
                    "inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 hover:bg-green-500/20 transition-colors cursor-pointer"
                }
            }
            disabled=move || is_claiming.get()
            on:click=move |_| {
                if is_claiming.get() {
                    return;
                }
                let accounts = accounts_context.accounts.get();
                if let Some(account_id) = accounts.selected_account_id {
                    set_is_claiming.set(true);
                    spawn_local(async move {
                        let proxy_base = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");
                        let claim_url = format!("{}/airdrop/claim", proxy_base);
                        let claim_request = AirdropClaimRequest {
                            addr: account_id,
                            airdrop_id,
                        };
                        if let Ok(response) = reqwest::Client::new()
                            .post(&claim_url)
                            .json(&claim_request)
                            .send()
                            .await {
                            if response.status().is_success() {
                                if let Ok(json) = response.json::<serde_json::Value>().await {
                                    if json.get("code").and_then(|v| v.as_i64()) == Some(0) {
                                        reload_trigger.update(|n| *n += 1);
                                    }
                                }
                            }
                        }
                        set_is_claiming.set(false);
                    });
                }
            }
        >
            <Icon icon=icondata::LuGift width="16" height="16" />
            <span class="text-xs font-medium">
                {
                    let tokens_for_display = tokens.clone();
                    move || {
                        if is_claiming.get() {
                            format!("{}: Claiming...", airdrop_name)
                        } else if let Some(metadata_results) = tokens_metadata.get() {
                            let formatted_tokens: Vec<String> = tokens_for_display
                                .iter()
                                .zip(metadata_results.iter())
                                .map(|(token, metadata_opt)| {
                                    if let Some(metadata) = metadata_opt {
                                        format_token_amount(
                                            token.reward_amount,
                                            metadata.decimals,
                                            &metadata.symbol,
                                        )
                                    } else {
                                        format!("{} {}", token.reward_amount, token.token_addr)
                                    }
                                })
                                .collect();
                            format!("{}: {}", airdrop_name, formatted_tokens.join(", "))
                        } else {
                            format!("{}: Loading...", airdrop_name)
                        }
                    }
                }
            </span>
        </button>
    }
}

#[component]
pub fn TotalPortfolioValue() -> impl IntoView {
    let TokensContext {
        tokens,
        loading_tokens,
        ..
    } = expect_context::<TokensContext>();
    let ConfigContext { set_config, .. } = expect_context::<ConfigContext>();
    let network = expect_context::<NetworkContext>().network;
    let accounts_context = expect_context::<AccountsContext>();
    let (last_tap, set_last_tap) = signal(0u64);

    // Check storage persistence
    let storage_persisted = LocalResource::new(|| async {
        match wasm_bindgen_futures::JsFuture::from(
            window().navigator().storage().persisted().unwrap(),
        )
        .await
        {
            Ok(persisted) => persisted.as_bool().unwrap_or(false),
            Err(_) => false,
        }
    });

    // Check airdrop eligibility for all airdrops
    let (airdrop_reload_trigger, set_airdrop_reload_trigger) = signal(0u32);
    let airdrop_data = LocalResource::new(move || {
        airdrop_reload_trigger.track();
        let account_id = accounts_context.accounts.get().selected_account_id;
        async move {
            if let Some(account_id) = account_id {
                let mut all_airdrops = Vec::new();
                let proxy_base = dotenvy_macro::dotenv!("SHARED_NFT_PROXY_SERVICE_ADDR");

                for &(airdrop_id, _) in AIRDROPS {
                    let url = format!("{}/airdrop/{}/{}", proxy_base, airdrop_id, account_id);

                    if let Ok(response) = reqwest::get(&url).await {
                        if let Ok(airdrop_response) = response.json::<AirdropResponse>().await {
                            if airdrop_response.data.claimable
                                && !airdrop_response.data.claim_tokens.is_empty()
                            {
                                all_airdrops.push((airdrop_id, airdrop_response.data.claim_tokens));
                            }
                        }
                    }
                }

                if all_airdrops.is_empty() {
                    None
                } else {
                    Some(all_airdrops)
                }
            } else {
                None
            }
        }
    });

    let handle_tap = move |_| {
        let now_ms = window().performance().map(|p| p.now() as u64).unwrap_or(0);
        let last_tap_time = last_tap.get();
        let time_since_last_tap_ms = if now_ms > last_tap_time {
            now_ms - last_tap_time
        } else {
            u64::MAX
        };

        if time_since_last_tap_ms < 500 {
            // 500ms threshold for double tap
            set_config.update(|config| {
                config.amounts_hidden = !config.amounts_hidden;
            });
            set_last_tap.set(0);
        }
        set_last_tap.set(now_ms);
    };

    let has_non_zero_balance = move || {
        if loading_tokens.get() {
            false
        } else {
            let total = tokens.get().iter().fold(BigDecimal::from(0), |acc, token| {
                let normalized_balance =
                    balance_to_decimal(token.balance, token.token.metadata.decimals);
                acc + (&token.token.price_usd_hardcoded * &normalized_balance)
            });
            total > BigDecimal::from(0)
        }
    };

    let display_value = move || {
        if loading_tokens.get() {
            "$-.--".to_string()
        } else {
            let total = tokens.get().iter().fold(BigDecimal::from(0), |acc, token| {
                let normalized_balance =
                    balance_to_decimal(token.balance, token.token.metadata.decimals);
                acc + (&token.token.price_usd_hardcoded * &normalized_balance)
            });
            format_usd_value(total)
        }
    };

    let pnl_24h = move || {
        if loading_tokens.get() {
            (BigDecimal::from(0), BigDecimal::from(0))
        } else {
            let (current_total, previous_total) = tokens.get().iter().fold(
                (BigDecimal::from(0), BigDecimal::from(0)),
                |(acc_current, acc_previous), token| {
                    let usdt_decimals_decimal = power_of_10(USDT_DECIMALS);
                    let current_value =
                        (&token.token.price_usd_raw / &usdt_decimals_decimal) * token.balance;
                    let previous_value = (&token.token.price_usd_raw_24h_ago
                        / &usdt_decimals_decimal)
                        * token.balance;
                    (acc_current + current_value, acc_previous + previous_value)
                },
            );
            let pnl = &current_total - &previous_total;
            let pnl_percentage = if previous_total > BigDecimal::from(0) {
                (&pnl / &previous_total) * BigDecimal::from(100)
            } else {
                BigDecimal::from(0)
            };
            (pnl, pnl_percentage)
        }
    };

    view! {
        <div class="text-center mb-8">
            <h1
                class="text-white text-4xl min-[400px]:text-5xl sm:text-6xl font-semibold tracking-wider cursor-pointer select-none hover:text-neutral-200 py-8 transition-all duration-100 wrap-anywhere"
                on:click=handle_tap
            >
                {display_value}
            </h1>
            {move || {
                if network.get() == Network::Testnet {
                    view! {
                        <div class="text-yellow-500 text-sm font-medium mb-4">
                            This is a testnet account. Assets have no real value.
                        </div>
                    }
                        .into_any()
                } else {
                    ().into_any()
                }
            }}
            <div class="text-neutral-400 text-lg">
                {move || {
                    let (pnl, _) = pnl_24h();
                    let pnl_f64 = pnl.to_f64().unwrap_or(0.0);
                    let pnl_class = if pnl_f64 > 0.0 {
                        "text-green-500"
                    } else if pnl_f64 < 0.0 {
                        "text-red-500"
                    } else {
                        "text-neutral-400"
                    };
                    view! {
                        <span class=pnl_class>
                            {if pnl_f64 > 0.0 {
                                format!("+{}", format_usd_value(pnl))
                            } else {
                                format_usd_value(pnl)
                            }}
                        </span>
                    }
                }}
            </div>

            <div class="mt-4 mx-auto space-y-2">
                <Show when=move || {
                    has_non_zero_balance() && storage_persisted.get() == Some(false)
                }>
                    <div>
                        <A
                            href="/settings/security#storage"
                            attr:class="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 transition-colors cursor-pointer"
                        >
                            <Icon icon=icondata::LuTriangleAlert width="16" height="16" />
                            <span class="text-xs font-medium">"Enable Persistent Storage"</span>
                        </A>
                    </div>
                </Show>

                {move || {
                    if let Some(Some(all_airdrops)) = airdrop_data.get() {
                        all_airdrops
                            .iter()
                            .map(|(airdrop_id, claim_tokens)| {
                                view! {
                                    <div>
                                        <AirdropButton
                                            airdrop_id=*airdrop_id
                                            tokens=claim_tokens.clone()
                                            reload_trigger=set_airdrop_reload_trigger
                                        />
                                    </div>
                                }
                            })
                            .collect::<Vec<_>>()
                            .into_any()
                    } else {
                        ().into_any()
                    }
                }}
            </div>
        </div>
    }
}
