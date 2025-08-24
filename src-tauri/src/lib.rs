use base64::{Engine, prelude::BASE64_STANDARD};
use keyring::Entry;
use rand::{RngCore, rngs::OsRng};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{
    AppHandle, Manager, Url, WebviewWindow, Wry,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
#[cfg(desktop)]
use tauri_plugin_deep_link::DeepLinkExt;

const WINDOW_MAIN: &str = "main";
const WINDOW_CONNECT: &str = "connect";
const WINDOW_SIGN_MESSAGE: &str = "sign-message";
const WINDOW_SEND_TRANSACTIONS: &str = "send-transactions";

const SERVICE_NAME: &str = "intearwallet";
const ENTRY_NAME: &str = "accounts";

#[tauri::command]
fn close_temporary_window(window: WebviewWindow) {
    if window.label() == WINDOW_MAIN {
        log::error!("Cannot close the main window using close_temporary_window");
        return;
    }
    window.close().expect("Failed to close a temporary window");
}

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
    pub autostart: bool,
}

struct AppState {
    config: Mutex<WalletConfig>,
}

#[tauri::command]
fn update_config(
    new_config: WalletConfig,
    state: tauri::State<AppState>,
    #[allow(unused)] handle: AppHandle,
) -> Result<(), String> {
    if let Ok(mut config_guard) = state.config.lock() {
        #[cfg(all(desktop, not(debug_assertions)))]
        {
            use tauri_plugin_autostart::ManagerExt;

            let autostart_manager = handle.autolaunch();
            if new_config.autostart {
                let _ = autostart_manager.enable();
            } else {
                let _ = autostart_manager.disable();
            }
        }

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
                autostart: false,
            }),
        })
        .invoke_handler(tauri::generate_handler![
            update_config,
            get_os_encryption_key,
            close_temporary_window,
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

            #[cfg(all(desktop, not(debug_assertions)))]
            {
                use tauri_plugin_autostart::MacosLauncher;

                app.handle().plugin(tauri_plugin_autostart::init(
                    MacosLauncher::LaunchAgent,
                    None,
                ))?;
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
    let Some(host) = url.host() else {
        return Err(anyhow::anyhow!("Invalid deep link: {}", url));
    };
    match host.to_string().as_str() {
        "connect" => {
            let session_id = url
                .query_pairs()
                .find(|(key, _)| key == "session_id")
                .map(|(_, value)| value.to_string());

            let window = tauri::WebviewWindowBuilder::new(
                app,
                WINDOW_CONNECT,
                tauri::WebviewUrl::App("connect".into()),
            )
            .minimizable(false)
            .inner_size(400.0, 700.0)
            .title("Connect Wallet")
            .build()?;

            if let Some(session_id) = session_id {
                let js_code = format!(
                    r#"
                        window.addEventListener('message', (event) => {{
                            console.log('event', event);
                            if (event.data.type === 'ready') {{
                                window.postMessage({{
                                    type: 'tauriWalletSession',
                                    sessionId: '{session_id}'
                                }}, '*');
                            }}
                        }});
                    "#
                );

                if let Err(e) = window.eval(&js_code) {
                    log::warn!("Failed to send session_id to frontend: {:?}", e);
                } else {
                    log::info!("Forwarded session_id {} to connect window", session_id);
                }
            }

            Ok(())
        }
        "sign-message" => {
            let session_id = url
                .query_pairs()
                .find(|(key, _)| key == "session_id")
                .map(|(_, value)| value.to_string());

            let window = tauri::WebviewWindowBuilder::new(
                app,
                WINDOW_SIGN_MESSAGE,
                tauri::WebviewUrl::App("sign-message".into()),
            )
            .minimizable(false)
            .inner_size(400.0, 700.0)
            .title("Sign Message")
            .build()?;

            if let Some(session_id) = session_id {
                let js_code = format!(
                    r#"
                        window.addEventListener('message', (event) => {{
                            console.log('event', event);
                            if (event.data.type === 'ready') {{
                                window.postMessage({{
                                    type: 'tauriWalletSession',
                                    sessionId: '{session_id}'
                                }}, '*');
                            }}
                        }});
                    "#
                );

                if let Err(e) = window.eval(&js_code) {
                    log::warn!("Failed to send session_id to frontend: {:?}", e);
                } else {
                    log::info!("Forwarded session_id {} to sign-message window", session_id);
                }
            }

            Ok(())
        }
        "send-transactions" => {
            let session_id = url
                .query_pairs()
                .find(|(key, _)| key == "session_id")
                .map(|(_, value)| value.to_string());

            let window = tauri::WebviewWindowBuilder::new(
                app,
                WINDOW_SEND_TRANSACTIONS,
                tauri::WebviewUrl::App("send-transactions".into()),
            )
            .minimizable(false)
            .inner_size(400.0, 700.0)
            .title("Send Transactions")
            .build()?;

            if let Some(session_id) = session_id {
                let js_code = format!(
                    r#"
                        window.addEventListener('message', (event) => {{
                            console.log('event', event);
                            if (event.data.type === 'ready') {{
                                window.postMessage({{
                                    type: 'tauriWalletSession',
                                    sessionId: '{session_id}'
                                }}, '*');
                            }}
                        }});
                    "#
                );

                if let Err(e) = window.eval(&js_code) {
                    log::warn!("Failed to send session_id to frontend: {:?}", e);
                } else {
                    log::info!(
                        "Forwarded session_id {} to send-transactions window",
                        session_id
                    );
                }
            }

            Ok(())
        }
        _ => {
            anyhow::bail!("Unknown deep link with path {:?}", url);
        }
    }
}
