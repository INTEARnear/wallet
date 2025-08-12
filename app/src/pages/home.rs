use crate::components::{TokenBalanceList, TotalPortfolioValue, WalletQuickActions};
use leptos::prelude::*;

#[component]
pub fn Home() -> impl IntoView {
    view! {
        <div>
            <TotalPortfolioValue />
            <WalletQuickActions />
            <TokenBalanceList />
        </div>
    }
}
