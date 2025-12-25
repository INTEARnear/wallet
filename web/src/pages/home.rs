use leptos::prelude::*;

use crate::components::{
    quick_actions::WalletQuickActions, token_balance_list::TokenBalanceList,
    total_portfolio_value::TotalPortfolioValue,
};

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
