use bigdecimal::BigDecimal;
use leptos::prelude::*;
use leptos_icons::*;
use near_min_api::types::NearToken;

use crate::utils::balance_to_decimal;

#[derive(Clone, Copy, PartialEq)]
pub enum ProjectedRevenueMode {
    Increase, // For staking - shows green for new amounts
    Decrease, // For unstaking - shows red for new amounts
}

#[component]
pub fn ProjectedRevenue(
    amount: String,
    #[prop(into)] apy_bigdecimal: Signal<BigDecimal>,
    #[prop(into)] near_price: Signal<BigDecimal>,
    current_stake: Option<NearToken>,
    mode: ProjectedRevenueMode,
) -> impl IntoView {
    let (show_usd, set_show_usd) = signal(false);

    let projected_revenue = Memo::new(move |_| {
        if let Ok(amount_decimal) = amount.parse::<BigDecimal>() {
            if amount_decimal > 0 {
                let yearly = &amount_decimal * &apy_bigdecimal();
                let monthly = &yearly / BigDecimal::from(12);
                let daily = &yearly / BigDecimal::from(365);
                Some((daily, monthly, yearly))
            } else {
                None
            }
        } else {
            None
        }
    });

    let has_existing_stake = current_stake.map(|stake| !stake.is_zero()).unwrap_or(false);

    let color_class = match mode {
        ProjectedRevenueMode::Increase => "text-green-400",
        ProjectedRevenueMode::Decrease => "text-red-400",
    };

    move || {
        projected_revenue.get().map(|(daily, monthly, yearly)| {
            if has_existing_stake {
                if let Some(current_stake) = current_stake {
                    let current_stake_decimal = balance_to_decimal(
                        current_stake.as_yoctonear(),
                        24,
                    );
                    let (total_yearly, total_monthly, total_daily) = match mode {
                        ProjectedRevenueMode::Increase => {
                            let total_yearly = &current_stake_decimal * &apy_bigdecimal() + yearly;
                            let total_monthly = &total_yearly / BigDecimal::from(12);
                            let total_daily = &total_yearly / BigDecimal::from(365);
                            (total_yearly, total_monthly, total_daily)
                        }
                        ProjectedRevenueMode::Decrease => {
                            let total_yearly = &current_stake_decimal * &apy_bigdecimal() - yearly;
                            let total_monthly = &total_yearly / BigDecimal::from(12);
                            let total_daily = &total_yearly / BigDecimal::from(365);
                            (total_yearly, total_monthly, total_daily)
                        }
                    };

                    let current_daily = &current_stake_decimal * &apy_bigdecimal() / BigDecimal::from(365);
                    let current_monthly = &current_stake_decimal * &apy_bigdecimal() / BigDecimal::from(12);
                    let current_yearly = &current_stake_decimal * &apy_bigdecimal();

                    view! {
                        <div class="bg-neutral-900/50 rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <h3 class="text-white font-semibold">"Projected Revenue"</h3>
                                <button
                                    class="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded transition-colors cursor-pointer"
                                    on:click=move |_| set_show_usd.update(|show| *show = !*show)
                                >
                                    {move || if show_usd.get() { "USD" } else { "NEAR" }}
                                </button>
                            </div>
                            <div class="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p class="text-gray-400 text-xs">
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.4}", &current_daily * &near_price())
                                            } else {
                                                format!("{:.6} NEAR", current_daily)
                                            }
                                        }}
                                    </p>
                                    <div class="flex justify-center my-1">
                                        <Icon
                                            icon=icondata::LuArrowDown
                                            width="12"
                                            height="12"
                                            attr:class="text-gray-500"
                                        />
                                    </div>
                                    <p class=format!(
                                        "{} text-xs",
                                        color_class,
                                    )>
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.4}", &total_daily * &near_price())
                                            } else {
                                                format!("{:.6} NEAR", total_daily)
                                            }
                                        }}
                                    </p>
                                    <p class="text-gray-400 text-xs">"Daily"</p>
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs">
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.2}", &current_monthly * &near_price())
                                            } else {
                                                format!("{:.4} NEAR", current_monthly)
                                            }
                                        }}
                                    </p>
                                    <div class="flex justify-center my-1">
                                        <Icon
                                            icon=icondata::LuArrowDown
                                            width="12"
                                            height="12"
                                            attr:class="text-gray-500"
                                        />
                                    </div>
                                    <p class=format!(
                                        "{} text-xs",
                                        color_class,
                                    )>
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.2}", &total_monthly * &near_price())
                                            } else {
                                                format!("{:.4} NEAR", total_monthly)
                                            }
                                        }}
                                    </p>
                                    <p class="text-gray-400 text-xs">"Monthly"</p>
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs">
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.2}", &current_yearly * &near_price())
                                            } else {
                                                format!("{:.2} NEAR", current_yearly)
                                            }
                                        }}
                                    </p>
                                    <div class="flex justify-center my-1">
                                        <Icon
                                            icon=icondata::LuArrowDown
                                            width="12"
                                            height="12"
                                            attr:class="text-gray-500"
                                        />
                                    </div>
                                    <p class=format!(
                                        "{} text-xs",
                                        color_class,
                                    )>
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.2}", &total_yearly * &near_price())
                                            } else {
                                                format!("{:.2} NEAR", total_yearly)
                                            }
                                        }}
                                    </p>
                                    <p class="text-gray-400 text-xs">"Yearly"</p>
                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                } else {
                    view! {
                        <div class="bg-neutral-900/50 rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <h3 class="text-white font-semibold">"Projected Revenue"</h3>
                                <button
                                    class="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded transition-colors cursor-pointer"
                                    on:click=move |_| set_show_usd.update(|show| *show = !*show)
                                >
                                    {move || if show_usd.get() { "USD" } else { "NEAR" }}
                                </button>
                            </div>
                            <div class="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p class="text-white font-medium">
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.4}", &daily * &near_price())
                                            } else {
                                                format!("{:.6} NEAR", daily)
                                            }
                                        }}
                                    </p>
                                    <p class="text-gray-400 text-xs">"Daily"</p>
                                </div>
                                <div>
                                    <p class="text-white font-medium">
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.2}", &monthly * &near_price())
                                            } else {
                                                format!("{:.4} NEAR", monthly)
                                            }
                                        }}
                                    </p>
                                    <p class="text-gray-400 text-xs">"Monthly"</p>
                                </div>
                                <div>
                                    <p class="text-white font-medium">
                                        {move || {
                                            if show_usd.get() {
                                                format!("${:.2}", &yearly * &near_price())
                                            } else {
                                                format!("{:.2} NEAR", yearly)
                                            }
                                        }}
                                    </p>
                                    <p class="text-gray-400 text-xs">"Yearly"</p>
                                </div>
                            </div>
                        </div>
                    }
                        .into_any()
                }
            } else {
                view! {
                    <div class="bg-neutral-900/50 rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <h3 class="text-white font-semibold">"Projected Revenue"</h3>
                            <button
                                class="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded transition-colors cursor-pointer"
                                on:click=move |_| set_show_usd.update(|show| *show = !*show)
                            >
                                {move || if show_usd.get() { "USD" } else { "NEAR" }}
                            </button>
                        </div>
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p class="text-white font-medium">
                                    {move || {
                                        if show_usd.get() {
                                            format!("${:.4}", &daily * &near_price())
                                        } else {
                                            format!("{:.6} NEAR", daily)
                                        }
                                    }}
                                </p>
                                <p class="text-gray-400 text-xs">"Daily"</p>
                            </div>
                            <div>
                                <p class="text-white font-medium">
                                    {move || {
                                        if show_usd.get() {
                                            format!("${:.2}", &monthly * &near_price())
                                        } else {
                                            format!("{:.4} NEAR", monthly)
                                        }
                                    }}
                                </p>
                                <p class="text-gray-400 text-xs">"Monthly"</p>
                            </div>
                            <div>
                                <p class="text-white font-medium">
                                    {move || {
                                        if show_usd.get() {
                                            format!("${:.2}", &yearly * &near_price())
                                        } else {
                                            format!("{:.2} NEAR", yearly)
                                        }
                                    }}
                                </p>
                                <p class="text-gray-400 text-xs">"Yearly"</p>
                            </div>
                        </div>
                    </div>
                }
                    .into_any()
            }
        })
    }
}
