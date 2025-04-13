use contexts::account_selector_swipe_context::provide_account_selector_swipe_context;
use contexts::accounts_context::provide_accounts_context;
use contexts::config_context::provide_config_context;
use contexts::search_context::provide_search_context;
use contexts::tokens_context::provide_token_context;
use contexts::transaction_queue_context::provide_transaction_queue_context;
use leptos::prelude::*;
use leptos_meta::*;
use leptos_router::{components::*, path};

pub mod components;
pub mod contexts;
pub mod data;
pub mod pages;
pub mod utils;

use crate::components::Layout;
use crate::contexts::rpc_context::provide_rpc_context;
use crate::pages::{
    settings::{DeveloperSettings, PreferencesSettings, SecuritySettings},
    Explore, History, Home, SendToken, Settings, Swap, TokenDetails,
};

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();
    provide_config_context();
    provide_rpc_context(); // depends on config for rpc configuration
    provide_accounts_context();
    provide_token_context(); // depends on rpc for fetching near balance
    provide_account_selector_swipe_context(); // depends on accounts
    provide_search_context();
    provide_transaction_queue_context();

    view! {
        <Html attr:lang="en" attr:dir="ltr" attr:data-theme="light" />

        <Title text="Intear Wallet" />

        <Meta charset="UTF-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <Router>
            <Layout>
                <Routes fallback=|| view! { NotFound }>
                    <Route path=path!("/") view=Home />
                    <Route path=path!("/swap") view=Swap />
                    <Route path=path!("/history") view=History />
                    <Route path=path!("/explore") view=Explore />
                    <Route path=path!("/token/:token_id") view=TokenDetails />
                    <Route path=path!("/send/:token_id") view=SendToken />
                    <ParentRoute path=path!("/settings") view=Settings>
                        <Route path=path!("") view=() />
                        <Route path=path!("/security") view=SecuritySettings />
                        <Route path=path!("/preferences") view=PreferencesSettings />
                        <Route path=path!("/developer") view=DeveloperSettings />
                    </ParentRoute>
                </Routes>
            </Layout>
        </Router>
    }
}
