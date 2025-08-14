use std::collections::HashMap;
use std::path::PathBuf;

use axum::Router;
use axum::response::Response as AxumResponse;
use axum::routing::get;
use axum::{
    body::Body,
    extract::State,
    http::{Request, Response, StatusCode, Uri},
    response::IntoResponse,
};
use leptos::logging::log;
use leptos::prelude::*;
use tower::ServiceExt;
use tower_http::compression::CompressionLayer;
use tower_http::services::ServeDir;

pub fn shell(options: LeptosOptions) -> impl IntoView {
    let hash_file = if cfg!(debug_assertions) {
        format!("target/debug/{}", options.hash_file)
    } else {
        format!("target/release/{}", options.hash_file)
    };
    let hash_file_content = std::fs::read_to_string(hash_file).expect("could not read hash file");
    let hashes = hash_file_content
        .lines()
        .map(|s| s.split(": ").collect::<Vec<&str>>())
        .collect::<Vec<Vec<&str>>>();
    let hash_map = hashes
        .iter()
        .map(|h| (h[0], h[1]))
        .collect::<HashMap<&str, &str>>();
    let css_hash = hash_map.get("css").expect("css hash not found");
    view! {
        <!DOCTYPE html>
        <html lang="en" dir="ltr" data-theme="dark">
            <head>
                <title>Intear Wallet</title>

                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
                <meta
                    http-equiv="Content-Security-Policy"
                    content="
                    default-src 'self';
                    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://eu-assets.i.posthog.com https://app.chatwoot.com;
                    style-src 'self' 'unsafe-inline';
                    font-src 'self' data:;
                    img-src 'self' data: https://nft-proxy-service.intear.tech https://indexer.nearcatalog.org blob:;
                    connect-src 'self' ws://127.0.0.1:5678/live_reload https://rpc.near.org https://rpc.mainnet.near.org https://rpc.testnet.near.org https://beta.rpc.mainnet.near.org https://archival-rpc.mainnet.near.org https://archival-rpc.testnet.near.org https://rpc.intea.rs archival-rpc.mainnet.fastnear.com https://rpc.shitzuapes.xyz https://events-v3.intear.tech https://events-v3-testnet.intear.tech https://logout-bridge-service.intear.tech https://rpc.testnet.fastnear.com https://rpc.mainnet.fastnear.com https://password-storage-service.intear.tech https://imminent.build https://prices.intear.tech https://prices-testnet.intear.tech wss://ws-events-v3.intear.tech wss://ws-events-v3-testnet.intear.tech https://api.fastnear.com https://test.api.fastnear.com https://nft-proxy-service.intear.tech https://wallet-history-service.intear.tech https://wallet-history-service-testnet.intear.tech https://api.nearcatalog.org https://router.intear.tech https://wallet-account-creation-service.intear.tech https://wallet-account-creation-service-testnet.intear.tech https://solver-relay-v2.chaindefuser.com https://api.web3modal.org wss://relay.walletconnect.org https://eu-assets.i.posthog.com https://eu.i.posthog.com https://app.chatwoot.com http://localhost:3001 http://localhost:3002 http://localhost:3003 http://localhost:3004 http://localhost:3005 http://localhost:4444;
                    frame-src 'self' https://chart.intear.tech https://chart-testnet.intear.tech https://verify.walletconnect.org https://wallet-sandboxed-assets.intear.tech https://app.chatwoot.com;
                    "
                />

                <link rel="icon" href="favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="favicon.png" type="image/png" />
                <link rel="icon" href="favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
                <script>
                    r#"
                        setTimeout(() => {
                            document.getElementById('app-loader').style.opacity = '1';
                        }, 500);
                    
                        window.addEventListener('load', async () => {
                            if ('serviceWorker' in navigator) {
                                await navigator.serviceWorker.register('/service_worker.js');
                                console.log('Service worker registered');
                            }
                        });
                    "#
                </script>
                <script type="module" src="/js/index.js" />

                <link rel="stylesheet" href=format!("/pkg/intear-wallet.{css_hash}.css") />
                <AutoReload options=options.clone() />
                <HydrationScripts options />
            </head>
            <body style="background-color: #0a0a0a">
                <style>
                    r#"
                    @keyframes app-spin { to { transform: rotate(360deg); } }
                    "#
                </style>
                <div
                    id="app-loader"
                    style="position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: -9999; opacity: 0; transition: opacity 0.5s ease-in-out;"
                >
                    <div style="width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.12); border-top-color: rgba(255,255,255,0.7); border-radius: 50%; animation: app-spin 1s linear infinite;"></div>
                    <div
                        id="cache-clear-section"
                        style="margin-top: 24px; text-align: center; opacity: 0; transition: opacity 0.5s ease-in-out; display: none;"
                    >
                        <p style="color: rgba(255,255,255,0.7); margin-bottom: 12px; font-size: 14px;">
                            "Not loading?"
                        </p>
                        <button
                            onclick="window.caches.keys().then(cacheNames=>cacheNames.map(cacheName=>window.caches.delete(cacheName))).then(()=>window.location.reload())"
                            style="background: rgba(0, 0, 0, 0.2); color: white; border: 1px solid rgba(255,255,255,0.12); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.2s;"
                        >
                            "Click here"
                        </button>
                    </div>
                    <script>
                        r#"
                            setTimeout(() => {
                                const cacheSection = document.getElementById('cache-clear-section');
                                if (cacheSection) {
                                    cacheSection.style.display = 'block';
                                    cacheSection.style.opacity = '1';
                                }
                            }, 10000);
                        "#
                    </script>
                </div>

            </body>
        </html>
    }
}

#[tokio::main]
async fn main() {
    let conf = get_configuration(None).unwrap();
    let addr = conf.leptos_options.site_addr;
    let leptos_options = conf.leptos_options;

    let index_path = PathBuf::from(&*leptos_options.site_root).join("index.html");

    tokio::fs::write(index_path, shell(leptos_options.clone()).to_html())
        .await
        .expect("could not write index.html");
    log::info!("Wrote index.html");

    if std::env::var("ONLY_CREATE_INDEX_HTML").is_ok() {
        return;
    }

    let app = Router::new()
        .route("/", get(file_and_error_handler))
        .fallback(file_and_error_handler)
        .layer(CompressionLayer::new())
        .with_state(leptos_options);

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    log!("listening on http://{}", &addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

pub async fn file_and_error_handler(
    uri: Uri,
    State(options): State<LeptosOptions>,
) -> AxumResponse {
    let root = options.site_root.clone();
    match get_static_file(uri.clone(), &root).await {
        Ok(res) => res.into_response(),
        Err(_) => get_static_file(Uri::from_static("/index.html"), &root)
            .await
            .expect("could not find index.html")
            .into_response(),
    }
}

async fn get_static_file(uri: Uri, root: &str) -> Result<Response<Body>, (StatusCode, String)> {
    let req = Request::builder()
        .uri(uri.clone())
        .body(Body::empty())
        .unwrap();
    // `ServeDir` implements `tower::Service` so we can call it with `tower::ServiceExt::oneshot`
    // This path is relative to the cargo root
    match ServeDir::new(root).oneshot(req).await {
        Ok(res) if res.status() == StatusCode::OK => Ok(res.map(Body::new)),
        Ok(_) | Err(_) => Err((StatusCode::NOT_FOUND, "Something went wrong".to_string())),
    }
}
