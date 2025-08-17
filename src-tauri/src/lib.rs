use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{
    Manager,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};

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
    }
    tauri::Builder::default()
        .manage(AppState {
            config: Mutex::new(WalletConfig {
                hide_to_tray: false,
            }),
        })
        .invoke_handler(tauri::generate_handler![update_config,])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
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
                        if let Some(window) = app.get_webview_window("main") {
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
                        if let Some(window) = app.get_webview_window("main") {
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
            if let tauri::WindowEvent::CloseRequested { api, .. } = event
                && let Some(window) = window.get_webview_window("main")
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
