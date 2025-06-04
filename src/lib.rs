#![deny(clippy::float_arithmetic)]

use contexts::account_selector_swipe_context::provide_account_selector_swipe_context;
use contexts::accounts_context::provide_accounts_context;
use contexts::config_context::provide_config_context;
use contexts::connected_apps_context::provide_connected_apps_context;
use contexts::network_context::provide_network_context;
use contexts::search_context::provide_search_context;
use contexts::tokens_context::provide_token_context;
use contexts::transaction_queue_context::provide_transaction_queue_context;
use leptos::prelude::*;
use leptos_meta::*;
use leptos_router::{components::*, path};
use wasm_bindgen::prelude::*;

pub mod components;
pub mod contexts;
pub mod data;
pub mod pages;
pub mod utils;

use crate::components::Layout;
use crate::contexts::rpc_context::provide_rpc_context;
use crate::pages::{
    settings::{
        AccountSettings, ConnectedAppsSettings, DeveloperSettings, PreferencesSettings,
        SecurityLogPage, SecuritySettings,
    },
    AutoImportSecretKey, Connect, Explore, History, Home, Login, SendToken, SendTransactions,
    Settings, SignMessage, Swap, TokenDetails, UnwrapToken, WrapToken,
};

#[component]
pub fn App() -> impl IntoView {
    let _ = window().navigator().storage().persist().unwrap();

    let warning_closure = Closure::wrap(Box::new(|| {
        let message = "%c⚠️ STOP! Don't paste any code here! This is dangerous and could compromise your wallet security. If someone told you to paste code here, they're trying to scam you.";
        let style = "font-size: 20px; font-weight: bold; color: #ff4444; background: #fff3cd; padding: 15px; border: 2px solid #ff4444; border-radius: 5px; line-height: 1.5; display: block;";

        let message_js = wasm_bindgen::JsValue::from_str(message);
        let style_js = wasm_bindgen::JsValue::from_str(style);

        web_sys::console::log_2(&message_js, &style_js);
    }) as Box<dyn Fn()>);
    let _ = window().set_interval_with_callback_and_timeout_and_arguments_0(
        warning_closure.as_ref().unchecked_ref(),
        5000,
    );
    // Don't drop the closure
    warning_closure.forget();

    provide_meta_context();
    provide_config_context();
    provide_accounts_context();
    provide_network_context(); // depends on accounts for selecting the network for the selected account
    provide_rpc_context(); // depends on config for rpc configuration and network for default rpc
    provide_token_context(); // depends on rpc for fetching near balance
    provide_account_selector_swipe_context(); // depends on accounts
    provide_search_context();
    provide_connected_apps_context();
    provide_transaction_queue_context(); // depends on accounts

    view! {
        <Html attr:lang="en" attr:dir="ltr" attr:data-theme="light" />

        <Title text="Intear Wallet Beta" />

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
                    <Route path=path!("/wrap") view=WrapToken />
                    <Route path=path!("/unwrap") view=UnwrapToken />
                    <Route path=path!("/connect") view=Connect />
                    <Route path=path!("/send-transactions") view=SendTransactions />
                    <Route path=path!("/sign-message") view=SignMessage />
                    <Route path=path!("/auto-import-secret-key") view=AutoImportSecretKey />
                    <Route path=path!("/login") view=Login />
                    <ParentRoute path=path!("/settings") view=Settings>
                        <Route path=path!("") view=() />
                        <Route path=path!("/security") view=SecuritySettings />
                        <Route path=path!("/security/account") view=AccountSettings />
                        <Route path=path!("/security/connected-apps") view=ConnectedAppsSettings />
                        <Route path=path!("/security/security-log") view=SecurityLogPage />
                        <Route path=path!("/preferences") view=PreferencesSettings />
                        <Route path=path!("/developer") view=DeveloperSettings />
                    </ParentRoute>
                </Routes>
            </Layout>
        </Router>
    }
}
