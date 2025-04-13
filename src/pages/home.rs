use crate::components::{TokenBalanceList, TotalPortfolioValue, WalletQuickActions};
use leptos::prelude::*;

#[component]
pub fn Home() -> impl IntoView {
    view! {
        <TotalPortfolioValue />
        <WalletQuickActions />
        <TokenBalanceList />
    }
}
