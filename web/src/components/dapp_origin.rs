use leptos::prelude::*;
use leptos_icons::*;
use serde::Deserialize;
use std::net::IpAddr;

/// Origins served from this device or the local network, shown as a "Localhost" badge
pub fn is_local_dev_origin(origin: &str) -> bool {
    let Ok(url) = reqwest::Url::parse(origin) else {
        return false;
    };
    let Some(host) = url.host_str() else {
        return false;
    };
    match host.trim_start_matches('[').trim_end_matches(']').parse() {
        Ok(IpAddr::V4(ip)) => ip.is_loopback() || ip.is_private(),
        Ok(IpAddr::V6(ip)) => ip.is_loopback() || ip.is_unique_local(),
        Err(_) => host == "localhost" || host.ends_with(".localhost") || host.ends_with(".local"),
    }
}

#[derive(Deserialize, Clone, Copy)]
enum DappSafety {
    Safe,
    Unsafe,
    Unknown,
}

async fn fetch_dapp_safety(origin: String) -> Option<DappSafety> {
    reqwest::Client::new()
        .get(format!(
            "{}/dappsafety",
            dotenvy_macro::dotenv!("SHARED_ACCOUNT_CREATION_SERVICE_ADDR")
        ))
        .query(&[("origin", origin)])
        .send()
        .await
        .ok()?
        .json()
        .await
        .ok()
}

#[component]
pub fn DappOrigin(origin: String, label: String) -> impl IntoView {
    let safety = LocalResource::new(move || {
        let origin = origin.clone();
        async move {
            if is_local_dev_origin(&origin) {
                return None;
            }
            fetch_dapp_safety(origin).await
        }
    });

    move || {
        let (colors, icon) = match safety.get().flatten() {
            Some(DappSafety::Safe) => ("bg-green-500/20 text-green-300", icondata::LuCheck),
            Some(DappSafety::Unsafe) => ("bg-red-500/20 text-red-300", icondata::LuTriangleAlert),
            Some(DappSafety::Unknown) | None => return label.clone().into_any(),
        };
        view! {
            <span class=format!(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md {colors}",
            )>
                <Icon icon=icon width="16" height="16" attr:class="shrink-0" />
                <span class="wrap-anywhere">{label.clone()}</span>
            </span>
        }
        .into_any()
    }
}
