use base64::{Engine, prelude::BASE64_STANDARD};
use keyring::Entry;
use rand::{RngCore, rngs::OsRng};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{
    AppHandle, Manager, Url, Wry,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
#[cfg(desktop)]
use tauri_plugin_deep_link::DeepLinkExt;

const WINDOW_MAIN: &str = "main";
const WINDOW_CONNECT: &str = "connect";

const SERVICE_NAME: &str = "intearwallet";
const ENTRY_NAME: &str = "accounts";

#[tauri::command]
async fn get_os_encryption_key() -> Result<String, String> {
    let entry = Entry::new(SERVICE_NAME, ENTRY_NAME)
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;

    match entry.get_password() {
        Ok(key) => {
            let key_bytes = BASE64_STANDARD
                .decode(&key)
                .map_err(|e| format!("Failed to decode key: {}", e))?;
            if key_bytes.len() == 32 {
                Ok(key)
            } else {
                panic!("Invalid key length: {}", key_bytes.len());
            }
        }
        Err(keyring::Error::NoEntry) => {
            log::info!("No entry found, generating new key");
            generate_and_store_os_key(&entry)
        }
        Err(e) => {
            log::warn!("Failed to get OS key: {e:?}");
            Err(format!("Failed to get OS key: {e:?}"))
        }
    }
}

fn generate_and_store_os_key(entry: &Entry) -> Result<String, String> {
    let mut new_key = [0u8; 32];
    OsRng.fill_bytes(&mut new_key);

    let key_string = BASE64_STANDARD.encode(new_key);
    entry
        .set_password(&key_string)
        .map_err(|e| format!("Failed to store OS key: {}", e))?;

    Ok(key_string)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalletConfig {
    pub hide_to_tray: bool,
}

struct AppState {
    config: Mutex<WalletConfig>,
}

#[tauri::command]
fn update_config(new_config: WalletConfig, state: tauri::State<AppState>) -> Result<(), String> {
    if let Ok(mut config_guard) = state.config.lock() {
        *config_guard = new_config;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    unsafe {
        // Wayland + nvidia fix
        std::env::set_var("__GL_THREADED_OPTIMIZATIONS", "0");
        std::env::set_var("__NV_DISABLE_EXPLICIT_SYNC", "1");
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .manage(AppState {
            config: Mutex::new(WalletConfig {
                hide_to_tray: false,
            }),
        })
        .invoke_handler(tauri::generate_handler![
            update_config,
            get_os_encryption_key
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            #[cfg(desktop)]
            {
                app.handle()
                    .plugin(tauri_plugin_single_instance::init(|_app, _argv, _cwd| {}))?;
            }

            app.handle().plugin(tauri_plugin_deep_link::init())?;
            #[cfg(desktop)]
            app.deep_link().register_all()?;

            let handle = app.handle().clone();
            app.deep_link().on_open_url(move |event| {
                for url in event.urls() {
                    if let Err(err) = process_deep_link(&handle, &url) {
                        log::warn!("Failed to process deep link: {err:?}");
                    }
                }
            });

            if let Ok(Some(url)) = app.deep_link().get_current() {
                for url in url {
                    if let Err(err) = process_deep_link(app.handle(), &url) {
                        log::warn!("Failed to process deep link: {err:?}");
                    }
                }
            }

            let show_item = MenuItem::with_id(app, "show", "Open", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        log::info!("Tray icon left clicked, showing main window");
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window(WINDOW_MAIN) {
                            let _ = window.unminimize();
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {
                        log::debug!("Unhandled tray event: {event:?}");
                    }
                })
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        log::info!("Show menu item clicked");
                        if let Some(window) = app.get_webview_window(WINDOW_MAIN) {
                            let _ = window.unminimize();
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        log::info!("Quit menu item clicked");
                        app.exit(0);
                    }
                    _ => {
                        log::warn!("Unknown menu item clicked: {:?}", event.id);
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == WINDOW_MAIN
                && let tauri::WindowEvent::CloseRequested { api, .. } = event
                && let Some(window) = window.get_webview_window(WINDOW_MAIN)
            {
                let app_handle = window.app_handle();
                if let Ok(config) = app_handle.state::<AppState>().config.lock()
                    && config.hide_to_tray
                {
                    // Hide the window instead of closing it
                    api.prevent_close();
                    log::info!("Window close requested, hiding to tray");
                    let _ = window.hide();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn process_deep_link(app: &AppHandle<Wry>, url: &Url) -> Result<(), anyhow::Error> {
    if url.scheme() != "intear" {
        return Err(anyhow::anyhow!("Invalid deep link: {}", url));
    }
    match url.path().trim_start_matches('/') {
        "connect" => {
            tauri::WebviewWindowBuilder::new(
                app,
                WINDOW_CONNECT,
                tauri::WebviewUrl::App("connect".into()),
            )
            .minimizable(false)
            .inner_size(200.0, 350.0)
            .title("Connect Wallet")
            .build()?;
            Ok(())
        }
        _ => {
            anyhow::bail!("Unknown deep link: {}", url);
        }
    }
}
