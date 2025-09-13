#![feature(
    closure_track_caller,
    stmt_expr_attributes,
    mpmc_channel,
    iter_intersperse
)]
#![deny(clippy::float_arithmetic)]

use contexts::account_selector_context::provide_account_selector_context;
use contexts::accounts_context::provide_accounts_context;
use contexts::config_context::provide_config_context;
use contexts::connected_apps_context::provide_connected_apps_context;
use contexts::network_context::provide_network_context;
use contexts::nft_cache_context::provide_nft_cache_context;
use contexts::search_context::provide_search_context;
use contexts::tokens_context::provide_token_context;
use contexts::transaction_queue_context::provide_transaction_queue_context;
use leptos::prelude::*;
use leptos_router::{components::*, path};
use thaw::{ConfigProvider, Theme};
use wasm_bindgen::prelude::*;

pub mod components;
pub mod contexts;
pub mod data;
pub mod pages;
pub mod utils;

#[wasm_bindgen::prelude::wasm_bindgen]
pub fn hydrate() {
    _ = console_log::init_with_level(log::Level::Debug);
    console_error_panic_hook::set_once();

    mount_to_body(|| {
        view! { <App /> }
    })
}

use crate::components::layout::Layout;
use crate::contexts::modal_context::provide_modal_context;
use crate::contexts::rpc_context::provide_rpc_context;
use crate::pages::auto_import_secret_key::AutoImportSecretKey;
use crate::pages::connect::Connect;
use crate::pages::explore::Explore;
use crate::pages::history::History;
use crate::pages::home::Home;
use crate::pages::login::Login;
use crate::pages::nfts::{NftCollection, NftTokenDetails, Nfts, SendNft};
use crate::pages::send::SendMultiToken;
use crate::pages::send::SendToken;
use crate::pages::send_transactions::SendTransactions;
use crate::pages::settings::Settings;
use crate::pages::settings::{
    AccountSettings, ConnectedAppsSettings, DeveloperSettings, PreferencesSettings,
    SecurityLogPage, SecuritySettings,
};
use crate::pages::sign_message::SignMessage;
use crate::pages::stake::{Stake, StakeValidator, UnstakeValidator};
use crate::pages::swap::Swap;
use crate::pages::token::TokenDetails;

// macro_rules! bad_waterfall_lazy_route {
//     ($name:ident) => {
//         pub struct $name;

//         #[leptos_router::lazy_route]
//         impl leptos_router::LazyRoute for $name {
//             fn data() -> Self {
//                 Self
//             }

//             fn view(_this: Self) -> ::leptos::prelude::AnyView {
//                 use leptos::prelude::*;
//                 super::$name().into_any()
//             }
//         }
//     };
// }

// These will be migrated to a real lazy route at some point.
// Though the wasm is cached by service worker and preloaded
// (at least, supposed to. but apparently it's not), so it's
// not really a big problem. Code splitting is useful enough by
// making it faster to load the app initially, before the
// service worker caches it.
// pub mod bad_waterfall_lazy_routes {
//     bad_waterfall_lazy_route!(Nfts);
//     bad_waterfall_lazy_route!(NftCollection);
//     bad_waterfall_lazy_route!(NftTokenDetails);
//     bad_waterfall_lazy_route!(SendNft);
//     bad_waterfall_lazy_route!(Swap);
//     bad_waterfall_lazy_route!(Stake);
//     bad_waterfall_lazy_route!(StakeValidator);
//     bad_waterfall_lazy_route!(UnstakeValidator);
//     bad_waterfall_lazy_route!(History);
//     bad_waterfall_lazy_route!(Explore);
//     bad_waterfall_lazy_route!(TokenDetails);
//     bad_waterfall_lazy_route!(SendToken);
//     bad_waterfall_lazy_route!(Connect);
//     bad_waterfall_lazy_route!(SendTransactions);
//     bad_waterfall_lazy_route!(SignMessage);
//     bad_waterfall_lazy_route!(AutoImportSecretKey);
//     bad_waterfall_lazy_route!(Login);
//     bad_waterfall_lazy_route!(AccountSettings);
//     bad_waterfall_lazy_route!(ConnectedAppsSettings);
//     // lazy_route!(SecurityLogPage);
//     bad_waterfall_lazy_route!(PreferencesSettings);
//     bad_waterfall_lazy_route!(DeveloperSettings);
// }

#[component]
pub fn App() -> impl IntoView {
    let _ = window().navigator().storage().persist();

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

    provide_modal_context();
    provide_config_context();
    provide_accounts_context();
    provide_network_context(); // depends on accounts for selecting the network for the selected account
    provide_rpc_context(); // depends on config for rpc configuration and network for default rpc
    provide_token_context(); // depends on rpc for fetching near balance
    provide_nft_cache_context(); // depends on accounts for resetting the cache when account changes
    provide_account_selector_context(); // depends on accounts
    provide_search_context();
    provide_connected_apps_context();
    provide_transaction_queue_context(); // depends on accounts

    view! {
        <ConfigProvider theme=RwSignal::new(Theme::dark())>
            <Router>
                <Layout>
                    <Routes fallback=|| view! { "404 Not Found" }>
                        <Route path=path!("/") view=Home />
                        <Route path=path!("/nfts") view=Nfts />
                        <Route path=path!("/nfts/:collection_id") view=NftCollection />
                        <Route path=path!("/nfts/:collection_id/*token_id") view=NftTokenDetails />
                        <Route path=path!("/send-nft/:collection_id/*token_id") view=SendNft />
                        <Route path=path!("/swap") view=Swap />
                        <Route path=path!("/stake") view=Stake />
                        <Route path=path!("/stake/:validator_pool/stake") view=StakeValidator />
                        <Route path=path!("/stake/:validator_pool/unstake") view=UnstakeValidator />
                        <Route path=path!("/history") view=History />
                        <Route path=path!("/explore") view=Explore />
                        <Route path=path!("/token/:token_id") view=TokenDetails />
                        <Route path=path!("/send/:token_id") view=SendToken />
                        <Route path=path!("/multi-send/:token_id") view=SendMultiToken />
                        <Route path=path!("/connect") view=Connect />
                        <Route path=path!("/send-transactions") view=SendTransactions />
                        <Route path=path!("/sign-message") view=SignMessage />
                        <Route path=path!("/auto-import-secret-key") view=AutoImportSecretKey />
                        <Route path=path!("/login") view=Login />
                        <ParentRoute path=path!("/settings") view=Settings>
                            <Route path=path!("") view=() />
                            <ParentRoute path=path!("/security") view=Outlet>
                                <Route path=path!("") view=SecuritySettings />
                                <Route path=path!("/account") view=AccountSettings />
                                <Route path=path!("/connected-apps") view=ConnectedAppsSettings />
                                <Route path=path!("/security-log") view=SecurityLogPage />
                            </ParentRoute>
                            <Route path=path!("/preferences") view=PreferencesSettings />
                            <Route path=path!("/developer") view=DeveloperSettings />
                        </ParentRoute>
                    </Routes>
                </Layout>
            </Router>
        </ConfigProvider>
    }
}
