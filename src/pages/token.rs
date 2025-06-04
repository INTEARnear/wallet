use bigdecimal::{BigDecimal, FromPrimitive, ToPrimitive};
use leptos::{prelude::*, task::spawn_local};
use leptos_icons::Icon;
use leptos_router::{components::A, hooks::use_params_map};
use near_min_api::types::AccountId;

use crate::{
    components::tooltip::Tooltip,
    contexts::{
        network_context::{Network, NetworkContext},
        tokens_context::{Token, TokenContext, TokenInfo, TokenScore},
    },
    utils::{balance_to_decimal, format_token_amount, format_usd_value, format_usd_value_no_hide},
};

async fn fetch_token_info(token_id: AccountId, network: Network) -> Option<TokenInfo> {
    let api_url = match network {
        Network::Mainnet => "https://prices.intear.tech",
        Network::Testnet => "https://prices-testnet.intear.tech",
    };
    let response = reqwest::get(format!("{api_url}/token?token_id={token_id}"))
        .await
        .ok()?;
    let token_data: TokenInfo = response.json().await.ok()?;
    Some(token_data)
}

#[component]
fn TokenInfoView(token_info: TokenInfo) -> impl IntoView {
    let price_change = if token_info.price_usd_hardcoded == BigDecimal::from(1) {
        BigDecimal::from(0)
    } else if token_info.price_usd_raw_24h_ago > BigDecimal::from(0) {
        let hundred = BigDecimal::from(100);
        ((&token_info.price_usd_raw - &token_info.price_usd_raw_24h_ago)
            / &token_info.price_usd_raw_24h_ago)
            * &hundred
    } else {
        BigDecimal::from(0)
    };
    let price_change_f64 = price_change.to_f64().unwrap_or(0.0);
    let price_change_formatted = if price_change_f64 > 0.0 {
        format!("+{price_change:.2}%")
    } else {
        format!("{price_change:.2}%")
    };

    let token_account_id = token_info.account_id.clone();
    let TokenContext { tokens, .. } = expect_context::<TokenContext>();
    let user_balance = move || {
        tokens
            .get()
            .iter()
            .find(|t| t.token.account_id == token_account_id)
            .map(|t| {
                let formatted_balance = balance_to_decimal(t.balance, t.token.metadata.decimals);
                (
                    format_token_amount(
                        t.balance,
                        t.token.metadata.decimals,
                        &t.token.metadata.symbol,
                    ),
                    format_usd_value(&formatted_balance * &t.token.price_usd),
                )
            })
    };
    let user_balance2 = user_balance.clone();

    let token_account_id = token_info.account_id.clone();
    let token_account_id2 = token_info.account_id.clone();
    let token_account_id3 = token_info.account_id.clone();
    let token_account_id4 = token_info.account_id.clone();
    let network = expect_context::<NetworkContext>().network;

    view! {
        <div class="flex flex-col gap-4 wrap-anywhere">
            <div class="flex items-center gap-3">
                {match token_info.metadata.icon.clone() {
                    Some(icon) => {
                        view! { <img src=icon class="w-16 h-16 rounded-full" /> }.into_any()
                    }
                    None => {
                        view! {
                            <div class="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl">
                                {token_info.metadata.symbol.chars().next().unwrap_or('?')}
                            </div>
                        }
                            .into_any()
                    }
                }} <div class="flex-1">
                    <h1 class="text-white text-2xl font-bold">
                        {token_info.metadata.name.clone()}
                    </h1>
                    <p class="text-gray-400">{token_info.metadata.symbol.clone()}</p>
                </div> <div class="flex flex-col gap-2">
                    <A href=format!(
                        "/send/{}",
                        match &token_info.account_id {
                            Token::Near => "near".to_string(),
                            Token::Nep141(account_id) => account_id.to_string(),
                        },
                    )>
                        <button
                            class="bg-neutral-900 rounded-xl p-3 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
                            disabled=move || user_balance().is_none()
                        >
                            <Icon icon=icondata::LuSend width="20" height="20" />
                            <span>Send</span>
                        </button>
                    </A>

                    {move || {
                        if let Token::Nep141(account_id) = &token_account_id3 {
                            let acc_str = account_id.to_string();
                            if acc_str == "wrap.near" || acc_str == "wrap.testnet" {
                                view! {
                                    <A href="/wrap">
                                        <button class="bg-neutral-900 rounded-xl p-3 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer w-full">
                                            <Icon icon=icondata::LuPackage width="20" height="20" />
                                            <span>Wrap</span>
                                        </button>
                                    </A>
                                }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        } else {
                            ().into_any()
                        }
                    }}

                    {move || {
                        if let Token::Nep141(account_id) = &token_account_id4 {
                            let acc_str = account_id.to_string();
                            if acc_str == "wrap.near" || acc_str == "wrap.testnet" {
                                view! {
                                    <A href="/unwrap">
                                        <button class="bg-neutral-900 rounded-xl p-3 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer w-full">
                                            <Icon icon=icondata::LuPackageOpen width="20" height="20" />
                                            <span>Unwrap</span>
                                        </button>
                                    </A>
                                }
                                    .into_any()
                            } else {
                                ().into_any()
                            }
                        } else {
                            ().into_any()
                        }
                    }}
                </div>
                {move || {
                    if matches!(token_info.account_id, Token::Near)
                        && matches!(network.get(), Network::Testnet)
                    {
                        view! {
                            <a
                                href="https://near-faucet.io"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button class="bg-neutral-900 rounded-xl p-3 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer">
                                    <Icon icon=icondata::LuDroplet width="20" height="20" />
                                    <span>Get Test Tokens</span>
                                </button>
                            </a>
                        }
                            .into_any()
                    } else {
                        ().into_any()
                    }
                }}
            </div>
            <div class="bg-neutral-900 rounded-xl p-4">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-gray-400">Price</p>
                        <p class="text-white text-xl">
                            {move || format_usd_value(token_info.price_usd.clone())}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-400">24h Change</p>
                        <p
                            class="text-xl"
                            style=move || {
                                let color = if price_change_f64 > 0.0 {
                                    "rgb(34 197 94)"
                                } else if price_change_f64 < 0.0 {
                                    "rgb(239 68 68)"
                                } else {
                                    "rgb(156 163 175)"
                                };
                                format!("color: {color}")
                            }
                        >
                            {price_change_formatted}
                        </p>
                    </div>
                </div>
            </div>

            {match token_info.reputation {
                TokenScore::Spam => {
                    view! {
                        <div class="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                            <div class="flex items-center gap-2 text-red-400">
                                <Icon icon=icondata::LuAlertTriangle width="20" height="20" />
                                <p class="text-white font-medium">Warning: This is a spam token</p>
                            </div>
                            <p class="text-gray-400 text-sm mt-2">
                                This token has been identified as spam. Exercise extreme caution and do not trust it.
                            </p>
                        </div>
                    }
                        .into_any()
                }
                TokenScore::Unknown => {
                    view! {
                        <div class="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                            <div class="flex items-center gap-2 text-yellow-400">
                                <Icon icon=icondata::LuAlertTriangle width="20" height="20" />
                                <p class="text-white font-medium">Warning: Unverified token</p>
                            </div>
                            <p class="text-gray-400 text-sm mt-2">
                                This token has not been verified. Exercise caution when interacting with it.
                            </p>
                        </div>
                    }
                        .into_any()
                }
                _ => ().into_any(),
            }}
            <div class="grid grid-cols-2 gap-4">
                {move || {
                    if let Some((tokens, usd)) = user_balance2() {
                        view! {
                            <div class="bg-neutral-900 rounded-xl p-4">
                                <div class="flex items-center gap-2">
                                    <p class="text-gray-400">Your Balance</p>
                                </div>
                                <p class="text-white text-xl">{tokens}</p>
                                <p class="text-gray-400 text-sm text-right">{usd}</p>
                            </div>
                        }
                            .into_any()
                    } else {
                        view! {
                            <div class="bg-neutral-900 rounded-xl p-4">
                                <div class="flex items-center gap-2">
                                    <p class="text-gray-400">Your Balance</p>
                                </div>
                                <p class="text-white text-xl">None</p>
                            </div>
                        }
                            .into_any()
                    }
                }}
                <Show when=move || {
                    token_account_id != Token::Near
                        && token_account_id != Token::Nep141("wrap.near".parse().unwrap())
                        && token_account_id != Token::Nep141("wrap.testnet".parse().unwrap())
                }>
                    <div class="bg-neutral-900 rounded-xl p-4">
                        <p class="text-gray-400">Liquidity</p>
                        <p class="text-white text-xl">
                            {move || format_usd_value_no_hide(
                                BigDecimal::from_f64(token_info.liquidity_usd).unwrap(),
                            )}
                        </p>
                    </div>
                </Show> <div class="bg-neutral-900 rounded-xl p-4">
                    <p class="text-gray-400">24h Volume</p>
                    <p class="text-white text-xl">
                        {move || format_usd_value_no_hide(
                            BigDecimal::from_f64(token_info.volume_usd_24h).unwrap(),
                        )}
                    </p>
                </div> <div class="bg-neutral-900 rounded-xl p-4">
                    <div class="flex items-center gap-2">
                        <p class="text-gray-400">Market Cap</p>
                        <Tooltip text="Market cap is the total value of all tokens in circulation. It's calculated by multiplying the current price by the total number of tokens (excluding burned and locked)." />
                    </div>
                    <p class="text-white text-xl">
                        {move || {
                            let circulating_supply_decimal = BigDecimal::from(
                                token_info.circulating_supply,
                            );
                            let million = BigDecimal::from(1_000_000);
                            let market_cap = &token_info.price_usd_raw * &circulating_supply_decimal
                                / &million;
                            format_usd_value_no_hide(market_cap)
                        }}
                    </p>
                </div>
            </div>
            <iframe
                src=move || {
                    format!(
                        "https://{}/?token={}&interval=15m",
                        match network.get() {
                            Network::Mainnet => "chart.intear.tech",
                            Network::Testnet => "chart-testnet.intear.tech",
                        },
                        match &token_account_id2 {
                            Token::Near => {
                                match network.get() {
                                    Network::Mainnet => "wrap.near".to_string(),
                                    Network::Testnet => "wrap.testnet".to_string(),
                                }
                            }
                            Token::Nep141(account_id) => account_id.to_string(),
                        },
                    )
                }
                class="w-full h-96"
            />
        </div>
    }
}

#[component]
pub fn TokenDetails() -> impl IntoView {
    let params = use_params_map();
    let token_id = move || params.get().get("token_id").unwrap_or_default();
    let TokenContext {
        tokens,
        loading_tokens,
    } = expect_context::<TokenContext>();
    let (token_info, set_token_info) = signal::<Option<TokenInfo>>(None);
    let (loading_api, set_loading_api) = signal(false);
    let (api_error, set_api_error) = signal(false);

    // Fetch token info from API if not found in local context
    Effect::new(move |_| {
        let token_id = token_id();
        if !loading_tokens()
            && tokens.get().iter().all(|t| match &t.token.account_id {
                Token::Near => token_id != "near",
                Token::Nep141(account_id) => *account_id != token_id,
            })
        {
            set_loading_api(true);
            set_api_error(false);
            let network = expect_context::<NetworkContext>().network.get();
            spawn_local(async move {
                if let Ok(token_id) = token_id.parse() {
                    if let Some(info) = fetch_token_info(token_id, network).await {
                        set_token_info(Some(info));
                    } else {
                        set_api_error(true);
                    }
                    set_loading_api(false);
                } else {
                    set_api_error(true);
                    set_loading_api(false);
                }
            });
        }
    });

    view! {
        <div class="flex flex-col gap-4 p-2 md:p-4 transition-all duration-100">
            <A
                href="/"
                attr:class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 cursor-pointer"
            >
                <Icon icon=icondata::LuArrowLeft width="20" height="20" />
                <span>Back</span>
            </A>

            {move || {
                let token = tokens
                    .get()
                    .into_iter()
                    .find(|t| {
                        match &t.token.account_id {
                            Token::Near => token_id() == "near",
                            Token::Nep141(account_id) => *account_id == token_id(),
                        }
                    });
                if let Some(token) = token {
                    view! { <TokenInfoView token_info=token.token.clone() /> }.into_any()
                } else if loading_tokens() || loading_api() {
                    view! {
                        <div class="flex items-center justify-center h-32">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    }
                        .into_any()
                } else if let Some(token_info) = token_info() {
                    view! { <TokenInfoView token_info=token_info /> }.into_any()
                } else {
                    view! {
                        <div class="flex flex-col items-center justify-center h-32 gap-4">
                            <div class="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                <div class="flex items-center gap-2 text-red-400">
                                    <Icon icon=icondata::LuAlertTriangle width="20" height="20" />
                                    <p class="text-white font-medium">Token not found</p>
                                </div>
                                <p class="text-gray-400 text-sm mt-2">
                                    {if api_error() {
                                        "Failed to fetch token information from the API"
                                    } else {
                                        "The token could not be found in your wallet or the API"
                                    }}
                                </p>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            }}
        </div>
    }
}
