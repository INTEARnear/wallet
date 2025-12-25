use leptos::prelude::*;

use crate::components::{
    token_balance_list::TokenBalanceList, total_portfolio_value::TotalPortfolioValue,
    quick_actions::WalletQuickActions,
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
