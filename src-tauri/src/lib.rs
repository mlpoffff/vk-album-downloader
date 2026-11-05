#[cfg(desktop)]
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
	webview::PageLoadEvent,
};
use std::time::Duration;

mod vk;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .on_page_load(|webview, payload| {
            if matches!(payload.event(), PageLoadEvent::Finished) {
                let window = webview.window();
                std::thread::spawn(move || {
                    std::thread::sleep(Duration::from_millis(250));
                    let _ = window.show();
                });
            }
        })
        .invoke_handler(tauri::generate_handler![
            vk::vk_get_albums,
            vk::vk_get_owner_id,
            vk::vk_get_photos,
            vk::vk_download
        ])
        .setup(|_app| {
            #[cfg(desktop)]
            {
                let quit = MenuItem::with_id(_app, "quit", "Выйти", true, None::<&str>)?;
                let menu = Menu::with_items(_app, &[&quit])?;

                TrayIconBuilder::new()
                    .icon(
                        _app.default_window_icon()
                            .expect("missing default window icon")
                            .clone(),
                    )
                    .menu(&menu)
                    .show_menu_on_left_click(true)
                    .on_menu_event(|app, event| {
                        if event.id.as_ref() == "quit" {
                            app.exit(0);
                        }
                    })
                    .build(_app)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
