use base64::{Engine, prelude::BASE64_STANDARD};
use keyring_core::Entry;
use rand::{RngCore, rngs::OsRng};
use serde::Deserialize;
use std::sync::Mutex;
use std::time::Duration;
#[cfg(mobile)]
use std::time::Instant;
#[cfg(mobile)]
use tauri::Emitter;
use tauri::{AppHandle, Manager, Url, WebviewWindow};
#[cfg(desktop)]
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use tauri_plugin_deep_link::DeepLinkExt;

const WINDOW_MAIN: &str = "main";

const SERVICE_NAME: &str = "intearwallet";
const ENTRY_NAME: &str = "accounts";

#[tauri::command]
fn close_temporary_window(window: WebviewWindow) {
    let mut url = window.url().unwrap();
    url.set_path("/");
    let _ = window.navigate(url);
    #[cfg(desktop)]
    let _ = window.minimize();
    #[cfg(target_os = "android")]
    {
        let _ = window.with_webview(move |webview| {
            webview.jni_handle().exec(move |env, activity, _webview| {
                let _ = env.call_method(&activity, "closeWindow", "()V", &[]);
            });
        });
    }
}

#[tauri::command]
fn get_os_encryption_key(
    #[allow(unused)] handle: AppHandle,
    #[allow(unused)] state: tauri::State<AppState>,
) -> Result<String, String> {
    #[cfg(mobile)]
    match ensure_biometric_authentication(&handle, &state) {
        Ok(()) => (),
        Err(e) => {
            if let Some(window) = handle.get_webview_window(WINDOW_MAIN) {
                if let Err(e) = window.emit("hide", ()) {
                    log::warn!("Failed to emit hide event: {:?}", e);
                }
            }
            log::error!("Failed to ensure biometric authentication: {}", e);
            return Err(format!("Failed to ensure biometric authentication: {}", e));
        }
    };

    let entry = match Entry::new(SERVICE_NAME, ENTRY_NAME) {
        Ok(entry) => entry,
        Err(e) => {
            log::error!("Failed to create keyring entry: {}", e);
            return Err(format!("Failed to create keyring entry: {}", e));
        }
    };

    match entry.get_password() {
        Ok(key) => {
            let key_bytes = match BASE64_STANDARD.decode(&key) {
                Ok(key_bytes) => key_bytes,
                Err(e) => {
                    log::error!("Failed to decode key: {}", e);
                    return Err(format!("Failed to decode key: {}", e));
                }
            };
            if key_bytes.len() != 32 {
                log::error!("Invalid key length: {}", key_bytes.len());
                return Err(format!("Invalid key length: {}", key_bytes.len()));
            }
            Ok(key)
        }
        Err(keyring_core::Error::NoEntry) => {
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

#[cfg(mobile)]
fn ensure_biometric_authentication(
    handle: &AppHandle,
    state: &tauri::State<AppState>,
) -> Result<(), String> {
    use tauri_plugin_biometric::BiometricExt;

    let require_biometric = {
        if let Ok(config_guard) = state.config.lock() {
            config_guard.biometric_enabled
        } else {
            false
        }
    };

    if !require_biometric
        || !handle
            .biometric()
            .status()
            .map_err(|e| format!("Failed to get biometric status: {}", e))?
            .is_available
    {
        if let Some(window) = handle.get_webview_window(WINDOW_MAIN) {
            if let Err(e) = window.emit("show", ()) {
                log::warn!("Failed to emit show event: {:?}", e);
            }
        }
        return Ok(());
    }

    // Check if declined recently
    const DECLINED_AT_THRESHOLD: Duration = Duration::from_secs(1);
    if let Ok(declined_at) = state.biometric_declined_at.lock() {
        if let Some(declined_at) = *declined_at {
            if declined_at.elapsed() < DECLINED_AT_THRESHOLD {
                return Ok(());
            }
        }
    }

    // Check if already authenticated in this session
    let is_authenticated = {
        if let Ok(auth_guard) = state.biometric_authenticated.lock() {
            *auth_guard
        } else {
            false
        }
    };

    if is_authenticated {
        if let Some(window) = handle.get_webview_window(WINDOW_MAIN) {
            if let Err(e) = window.emit("show", ()) {
                log::warn!("Failed to emit show event: {:?}", e);
            }
        }
        return Ok(());
    }

    let auth_options = tauri_plugin_biometric::AuthOptions {
        allow_device_credential: true,
        cancel_title: Some("Authentication required".to_string()),
        fallback_title: Some("Authentication failed".to_string()),
        title: Some("Unlock Wallet".to_string()),
        subtitle: None,
        confirmation_required: Some(true),
    };

    handle
        .biometric()
        .authenticate(
            "Authenticate to access your wallet".to_string(),
            auth_options,
        )
        .map_err(|e| {
            *state.biometric_declined_at.lock().unwrap() = Some(Instant::now());
            format!("Biometric authentication failed: {}", e)
        })?;

    if let Ok(mut auth_guard) = state.biometric_authenticated.lock() {
        *auth_guard = true;
        log::info!("Biometric authentication cached for session");
    }

    if let Some(window) = handle.get_webview_window(WINDOW_MAIN) {
        if let Err(e) = window.emit("show", ()) {
            log::warn!("Failed to emit show event: {:?}", e);
        }
    }

    Ok(())
}

#[derive(Debug, Clone, Deserialize)]
pub struct WalletConfig {
    pub hide_to_tray: bool,
    pub autostart: bool,
    pub biometric_enabled: bool,
    pub prevent_screenshots: bool,
}

struct AppState {
    config: Mutex<WalletConfig>,
    #[cfg(mobile)]
    biometric_authenticated: Mutex<bool>,
    #[cfg(mobile)]
    biometric_declined_at: Mutex<Option<Instant>>,
}

#[cfg(desktop)]
mod ledger {
    use super::Duration;
    use ledger_lib::{
        Exchange, Filters, LedgerInfo, LedgerProvider, Transport,
        info::{ConnInfo, Model},
    };

    fn device_name(device: &LedgerInfo) -> String {
        format!(
            "Ledger {} ({})",
            match device.model {
                Model::NanoS => "Nano S",
                Model::NanoSPlus => "Nano S Plus",
                Model::NanoX => "Nano X",
                Model::Stax => "Stax",
                Model::Unknown(_) => "Unknown",
            },
            match &device.conn {
                ConnInfo::Usb(usb) => format!("USB {usb} {}", usb.path.clone().unwrap_or_default()),
                ConnInfo::Tcp(tcp) => format!("Speculos at {tcp}"),
                ConnInfo::Ble(ble) => format!("Bluetooth {ble}"),
            }
        )
    }

    #[tauri::command]
    pub async fn get_ledger_devices() -> Result<String, String> {
        let mut provider = LedgerProvider::init().await;
        let devices = provider
            .list(Filters::Any)
            .await
            .map_err(|e| format!("Failed to get ledger devices: {}", e))?;
        let devices: Vec<_> = devices
            .into_iter()
            .map(|device| device_name(&device))
            .collect();
        log::info!("Ledger devices: {devices:?}");
        Ok(serde_json::to_string(&devices).unwrap())
    }

    #[tauri::command]
    pub async fn send_ledger_command(
        ledger_device_name: String,
        command: Vec<u8>,
    ) -> Result<Vec<u8>, String> {
        log::info!("Sending ledger command to device: {ledger_device_name}");
        let mut provider = LedgerProvider::init().await;
        let devices = provider
            .list(Filters::Any)
            .await
            .map_err(|e| format!("Failed to get ledger devices: {}", e))?;
        let device = devices
            .into_iter()
            .find(|device| ledger_device_name == device_name(device));
        let Some(device) = device else {
            return Err(format!("Ledger device {ledger_device_name} not found"));
        };
        log::info!("Connected to device: {device:?}");
        let mut handle = provider
            .connect(device)
            .await
            .map_err(|e| format!("Failed to connect to ledger device: {}", e))?;
        log::info!("Exchanging command with device");
        let response = handle
            .exchange(&command, Duration::from_secs(60 * 10))
            .await
            .map_err(|e| format!("Failed to send command: {}", e))?;
        log::info!("Response: {response:?}");
        Ok(response)
    }
}

#[cfg(target_os = "android")]
mod ledger {
    use super::{AppHandle, Duration, Instant, Manager};
    use std::sync::mpsc;

    #[tauri::command]
    pub async fn get_ledger_devices(handle: AppHandle) -> Result<String, String> {
        let (tx, rx) = mpsc::channel();
        let window = handle
            .get_webview_window("main")
            .ok_or("Main window not found")?;

        let _ = window.with_webview(move |webview| {
            webview.jni_handle().exec(move |env, activity, _webview| {
                let result_jvalue = env
                    .call_method(&activity, "listLedgerDevices", "()Ljava/lang/String;", &[])
                    .unwrap();

                let result_string_obj = result_jvalue.l().unwrap();

                let jstring = jni::objects::JString::from(result_string_obj);
                let string = env.get_string(&jstring).unwrap();

                let json_str = string.to_string_lossy().to_string();

                tx.send(json_str).unwrap();
            });
        });

        let json_str = rx
            .recv()
            .map_err(|e| format!("Failed to receive result: {}", e))?;

        Ok(json_str)
    }

    #[tauri::command]
    pub async fn send_ledger_command(
        handle: AppHandle,
        ledger_device_name: String,
        command: Vec<u8>,
    ) -> Result<Vec<u8>, String> {
        let window = handle
            .get_webview_window("main")
            .ok_or("Main window not found")?;

        let command_json = serde_json::to_string(&command)
            .map_err(|e| format!("Failed to serialize command to JSON: {}", e))?;

        let request_started = Instant::now();

        loop {
            let (tx, rx) = mpsc::channel::<JniResult>();
            enum JniResult {
                RetryLater,
                Result(Vec<u8>),
                Timeout,
            }
            let ledger_device_name = ledger_device_name.clone();
            let command_json = command_json.clone();
            let _ = window.with_webview(move |webview| {
                webview.jni_handle().exec(move |env, activity, _webview| {
                    let device_name_jstring = env.new_string(&ledger_device_name).unwrap();
                    let apdu_json_jstring = env.new_string(&command_json).unwrap();
                    let result_jvalue = env
                        .call_method(
                            &activity,
                            "exchangeApdu",
                            "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;",
                            &[
                                jni::objects::JValue::Object(&device_name_jstring.into()),
                                jni::objects::JValue::Object(&apdu_json_jstring.into()),
                            ],
                        )
                        .unwrap();

                    let result_string_obj = result_jvalue.l().unwrap();

                    let jstring = jni::objects::JString::from(result_string_obj);
                    let string = env.get_string(&jstring).unwrap();

                    let json_str = string.to_string_lossy();

                    if json_str.is_empty() {
                        if request_started.elapsed().as_secs() > 10 * 60 {
                            tx.send(JniResult::Timeout).unwrap();
                        } else {
                            tx.send(JniResult::RetryLater).unwrap();
                        }
                        return;
                    }

                    let json_array: Vec<u8> = serde_json::from_str(&json_str).unwrap();

                    tx.send(JniResult::Result(json_array)).unwrap();
                });
            });
            return match rx
                .recv()
                .map_err(|e| format!("Failed to receive result: {}", e))?
            {
                JniResult::Result(result) => Ok(result),
                JniResult::RetryLater => {
                    tokio::time::sleep(Duration::from_millis(100)).await;
                    continue;
                }
                JniResult::Timeout => Err("Ledger request timed out".to_string()),
            };
        }
    }

    #[tauri::command]
    pub async fn has_ble_permissions(handle: AppHandle) -> Result<bool, String> {
        let (tx, rx) = mpsc::channel();
        let window = handle
            .get_webview_window("main")
            .ok_or("Main window not found")?;

        let _ = window.with_webview(move |webview| {
            webview.jni_handle().exec(move |env, activity, _webview| {
                let result_jvalue = env
                    .call_method(&activity, "hasBlePermissions", "()Z", &[])
                    .unwrap();

                let result: bool = result_jvalue.z().unwrap();

                tx.send(result).unwrap()
            });
        });

        rx.recv()
            .map_err(|e| format!("Failed to receive result: {}", e))
    }

    #[tauri::command]
    pub async fn request_ble_permissions(handle: AppHandle) -> Result<(), String> {
        let window = handle
            .get_webview_window("main")
            .ok_or("Main window not found")?;

        let _ = window.with_webview(move |webview| {
            webview.jni_handle().exec(move |env, activity, _webview| {
                env.call_method(&activity, "requestBlePermissions", "()V", &[])
                    .unwrap();
            })
        });

        Ok(())
    }
}

#[tauri::command]
fn update_config(
    new_config: WalletConfig,
    state: tauri::State<AppState>,
    #[cfg_attr(not(mobile), allow(unused))] handle: AppHandle,
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

        #[cfg(target_os = "android")]
        {
            let prevent: jni::sys::jboolean = new_config.prevent_screenshots.into();
            let _ = handle
                .get_webview_window(WINDOW_MAIN)
                .unwrap()
                .with_webview(move |webview| {
                    webview.jni_handle().exec(move |env, activity, _webview| {
                        let _ = env.call_method(
                            &activity,
                            "setPreventScreenshots",
                            "(Z)V",
                            &[prevent.into()],
                        );
                    })
                });
        }

        *config_guard = new_config;
        drop(config_guard);

        #[cfg(mobile)]
        if ensure_biometric_authentication(&handle, &state).is_err() {
            if let Some(window) = handle.get_webview_window(WINDOW_MAIN) {
                if let Err(e) = window.emit("hide", ()) {
                    log::warn!("Failed to emit hide event: {:?}", e);
                }
            }
        }
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

    #[cfg(target_os = "linux")]
    keyring_core::set_default_store(dbus_secret_service_keyring_store::Store::new().unwrap());
    #[cfg(target_os = "macos")]
    keyring_core::set_default_store(apple_native_keyring_store::keychain::Store::new().unwrap());
    #[cfg(target_os = "windows")]
    keyring_core::set_default_store(windows_native_keyring_store::Store::new().unwrap());
    #[cfg(target_os = "android")]
    keyring_core::set_default_store(
        android_native_keyring_store::AndroidStore::from_ndk_context().unwrap(),
    );
    #[cfg(target_os = "ios")]
    keyring_core::set_default_store(apple_native_keyring_store::protected::Store::new().unwrap());

    let app = tauri::Builder::default();
    #[cfg(mobile)]
    let app = app.plugin(tauri_plugin_biometric::init());
    let app =
        app.plugin(tauri_plugin_os::init())
            .plugin(tauri_plugin_opener::init())
            .plugin(tauri_plugin_deep_link::init())
            .manage(AppState {
                config: Mutex::new(WalletConfig {
                    hide_to_tray: false,
                    autostart: false,
                    biometric_enabled: true,
                    prevent_screenshots: true,
                }),
                #[cfg(mobile)]
                biometric_authenticated: Mutex::new(false),
                #[cfg(mobile)]
                biometric_declined_at: Mutex::new(None),
            })
            .invoke_handler(tauri::generate_handler![
                update_config,
                get_os_encryption_key,
                close_temporary_window,
                ledger::get_ledger_devices,
                ledger::send_ledger_command,
                #[cfg(target_os = "android")]
                ledger::has_ble_permissions,
                #[cfg(target_os = "android")]
                ledger::request_ble_permissions,
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

                let base_url = app
                    .handle()
                    .get_webview_window(WINDOW_MAIN)
                    .unwrap()
                    .url()
                    .unwrap();
                let base_url_clone = base_url.clone();

                app.handle().plugin(tauri_plugin_deep_link::init())?;
                #[cfg(any(target_os = "windows", target_os = "linux"))]
                app.deep_link().register_all()?;

                let handle = app.handle().clone();
                app.deep_link().on_open_url(move |event| {
                    for url in event.urls() {
                        match process_deep_link(&base_url, &url) {
                            Ok(url) => {
                                let window = handle.get_webview_window(WINDOW_MAIN).unwrap();

                                #[cfg(desktop)]
                                {
                                    let _ = window.unminimize();
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }

                                let _ = window.navigate(url);
                            }
                            Err(err) => {
                                log::warn!("Failed to process deep link: {err:?}");
                            }
                        }
                    }
                });

                #[cfg(all(desktop, not(debug_assertions)))]
                {
                    use tauri_plugin_autostart::MacosLauncher;

                    app.handle().plugin(tauri_plugin_autostart::init(
                        MacosLauncher::LaunchAgent,
                        None,
                    ))?;
                }

                #[cfg(desktop)]
                {
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
                }

                #[cfg(mobile)]
                {
                    use tauri_plugin_app_events::AppEventsExt;

                    app.handle().plugin(tauri_plugin_app_events::init())?;

                    if let Some(window) = app.handle().get_webview_window(WINDOW_MAIN) {
                        if let Err(e) = window.emit("hide", ()) {
                            log::warn!("Failed to emit hide event: {:?}", e);
                        }
                    }

                    let app_handle = app.handle().clone();
                    let is_first_resume = std::sync::atomic::AtomicBool::new(true);
                    let deep_link_current = app.deep_link().get_current();
                    let app_handle_clone = app_handle.clone();
                    std::thread::spawn(move || {
                        std::thread::sleep(Duration::from_millis(100));
                        if let Ok(Some(url)) = deep_link_current.as_ref() {
                            for url in url {
                                match process_deep_link(&base_url_clone, &url) {
                                    Ok(url) => {
                                        let window = app_handle_clone
                                            .get_webview_window(WINDOW_MAIN)
                                            .unwrap();
                                        let _ = window.navigate(url);
                                    }
                                    Err(err) => {
                                        log::warn!("Failed to process deep link: {err:?}");
                                    }
                                }
                            }
                        }
                    });
                    let _ = app_handle.clone().app_events().set_resume_handler(
                        tauri::ipc::Channel::new(move |_| {
                            if is_first_resume.swap(false, std::sync::atomic::Ordering::Relaxed) {
                                log::info!("App resumed for the first time");
                            } else {
                                log::info!("App resumed");
                                let app_handle_clone = app_handle.clone();
                                let _ = app_handle.run_on_main_thread(move || {
                                    if ensure_biometric_authentication(
                                        &app_handle_clone,
                                        &app_handle_clone.state::<AppState>(),
                                    )
                                    .is_err()
                                    {
                                        if let Some(window) =
                                            app_handle_clone.get_webview_window(WINDOW_MAIN)
                                        {
                                            if let Err(e) = window.emit("hide", ()) {
                                                log::warn!("Failed to emit hide event: {:?}", e);
                                            }
                                        }
                                    }
                                });
                            }
                            Ok(())
                        }),
                    );
                }

                #[cfg(desktop)]
                if let Ok(Some(url)) = app.deep_link().get_current() {
                    let handle = app.handle().clone();
                    for url in url {
                        match process_deep_link(&base_url_clone, &url) {
                            Ok(url) => {
                                let window = handle.get_webview_window(WINDOW_MAIN).unwrap();

                                let _ = window.unminimize();
                                let _ = window.show();
                                let _ = window.set_focus();

                                let _ = window.navigate(url);
                            }
                            Err(err) => {
                                log::warn!("Failed to process deep link: {err:?}");
                            }
                        }
                    }
                }

                Ok(())
            });

    #[cfg(desktop)]
    let app = app.on_window_event(|window, event| {
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
    });

    app.run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn process_deep_link(base_url: &Url, opened_deep_link_url: &Url) -> Result<Url, anyhow::Error> {
    if opened_deep_link_url.scheme() != "intear" {
        return Err(anyhow::anyhow!(
            "Invalid deep link: {}",
            opened_deep_link_url
        ));
    }
    let Some(host) = opened_deep_link_url.host() else {
        return Err(anyhow::anyhow!(
            "Invalid deep link: {}",
            opened_deep_link_url
        ));
    };
    match host.to_string().as_str() {
        "connect" => {
            let session_id = opened_deep_link_url
                .query_pairs()
                .find(|(key, _)| key == "session_id")
                .map(|(_, value)| value.to_string());

            let Some(session_id) = session_id else {
                return Err(anyhow::anyhow!("No session_id found in deep link"));
            };

            let mut url = base_url.clone();
            url.set_path("connect");
            url.set_query(Some(&format!("session_id={session_id}")));

            Ok(url)
        }
        "sign-message" => {
            let session_id = opened_deep_link_url
                .query_pairs()
                .find(|(key, _)| key == "session_id")
                .map(|(_, value)| value.to_string());

            let Some(session_id) = session_id else {
                return Err(anyhow::anyhow!("No session_id found in deep link"));
            };

            let mut url = base_url.clone();
            url.set_path("sign-message");
            url.set_query(Some(&format!("session_id={session_id}")));

            Ok(url)
        }
        "send-transactions" => {
            let session_id = opened_deep_link_url
                .query_pairs()
                .find(|(key, _)| key == "session_id")
                .map(|(_, value)| value.to_string());

            let Some(session_id) = session_id else {
                return Err(anyhow::anyhow!("No session_id found in deep link"));
            };

            let mut url = base_url.clone();
            url.set_path("send-transactions");
            url.set_query(Some(&format!("session_id={session_id}")));

            Ok(url)
        }
        _ => {
            anyhow::bail!("Unknown deep link with path {:?}", opened_deep_link_url);
        }
    }
}
