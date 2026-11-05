use std::{fs, path::PathBuf};

use reqwest::{Client, Url};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

const VK_API_URL: &str = "https://api.vk.ru/method";
const VK_API_VERSION: &str = "5.199";
const USER_PHOTOS_ALBUM_ID: i64 = -9000;
const PAGE_SIZE: usize = 1000;

#[derive(Debug, Deserialize)]
struct VkResponse {
    response: Option<Value>,
    error: Option<VkError>,
}

#[derive(Debug, Deserialize)]
struct VkError {
    error_msg: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct DownloadResponse {
    success: bool,
    id: i64,
}

fn api_error(response: &VkResponse) -> String {
    response
        .error
        .as_ref()
        .and_then(|error| error.error_msg.clone())
        .unwrap_or_else(|| "VK API request failed".to_string())
}

async fn vk_get(client: &Client, method: &str, params: &[(&str, String)]) -> Result<Value, String> {
    let response = client
        .get(format!("{VK_API_URL}/{method}"))
        .query(params)
        .send()
        .await
        .map_err(|error| format!("VK request failed: {error}"))?;

    let status = response.status();
    let body: VkResponse = response
        .json()
        .await
        .map_err(|error| format!("Invalid VK response: {error}"))?;

    if !status.is_success() {
        return Err(format!("VK HTTP error {status}: {}", api_error(&body)));
    }

    body.response
        .as_ref()
        .cloned()
        .ok_or_else(|| api_error(&body))
}

fn common_params(access_token: &str) -> Vec<(&str, String)> {
    vec![
        ("v", VK_API_VERSION.to_string()),
        ("access_token", access_token.to_string()),
    ]
}

#[tauri::command]
pub async fn vk_get_albums(owner_id: i64, access_token: String) -> Result<Value, String> {
    let client = Client::new();
    let mut params = common_params(&access_token);
    params.extend([
        ("owner_id", owner_id.to_string()),
        ("need_system", "1".to_string()),
        ("photo_sizes", "1".to_string()),
        ("need_covers", "1".to_string()),
    ]);

    let response = vk_get(&client, "photos.getAlbums", &params).await?;
    Ok(json!({ "response": response }))
}

#[tauri::command]
pub async fn vk_get_owner_id(ids: String, access_token: String) -> Result<i64, String> {
    let client = Client::new();
    let mut user_params = common_params(&access_token);
    user_params.push(("user_ids", ids.clone()));

    if let Ok(response) = vk_get(&client, "users.get", &user_params).await {
        if let Some(id) = response
            .as_array()
            .and_then(|items| items.first())
            .and_then(|user| user.get("id"))
            .and_then(Value::as_i64)
        {
            return Ok(id);
        }
    }

    let mut group_params = common_params(&access_token);
    group_params.push(("group_ids", ids));
    let response = vk_get(&client, "groups.getById", &group_params).await?;
    response
        .get("groups")
        .and_then(Value::as_array)
        .and_then(|groups| groups.first())
        .and_then(|group| group.get("id"))
        .and_then(Value::as_i64)
        .map(|id| -id)
        .ok_or_else(|| "VK returned no user or group".to_string())
}

#[tauri::command]
pub async fn vk_get_photos(
    owner_id: i64,
    access_token: String,
    album_id: i64,
    album_size: usize,
) -> Result<Value, String> {
    let client = Client::new();
    let mut offset = 0;
    let mut photos = Vec::new();

    while offset < album_size {
        let count = (album_size - offset).min(PAGE_SIZE);
        let method = if album_id == USER_PHOTOS_ALBUM_ID {
            "photos.getUserPhotos"
        } else {
            "photos.get"
        };
        let mut params = common_params(&access_token);
        params.extend([
            ("photo_sizes", "1".to_string()),
            ("count", count.to_string()),
            ("offset", offset.to_string()),
        ]);

        if method == "photos.getUserPhotos" {
            params.push(("user_id", owner_id.to_string()));
        } else {
            params.extend([
                ("owner_id", owner_id.to_string()),
                ("album_id", album_id.to_string()),
            ]);
        }

        let response = vk_get(&client, method, &params).await?;
        let items = response
            .get("items")
            .and_then(Value::as_array)
            .ok_or_else(|| "VK returned an invalid photos response".to_string())?;

        if items.is_empty() {
            break;
        }
        offset += items.len();
        photos.extend(items.iter().cloned());
    }

    Ok(json!({ "items": photos }))
}

fn sanitize_path_name(name: &str) -> String {
    let sanitized: String = name
        .chars()
        .filter(|character| {
            !matches!(
                character,
                '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*'
            ) && !character.is_control()
                && !matches!(
                    *character,
                    '\u{200B}' | '\u{200C}' | '\u{200D}' | '\u{FEFF}'
                )
        })
        .collect();

    sanitized
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
        .trim_end_matches(['.', ' '])
        .to_string()
}

fn download_directory(folder: &str, base_folder: &str) -> Result<PathBuf, String> {
    let safe_folder = sanitize_path_name(folder);
    if safe_folder.is_empty() || safe_folder == "." || safe_folder == ".." {
        return Err("Folder name is empty or invalid".to_string());
    }

    let base = if base_folder.trim().is_empty() {
        let downloads = dirs::download_dir()
            .ok_or_else(|| "Downloads directory is unavailable".to_string())?;
        downloads.join("vk_albums")
    } else {
        PathBuf::from(base_folder)
    };

    Ok(base.join(safe_folder))
}

#[tauri::command]
pub async fn vk_download(
    id: i64,
    url: String,
    folder: String,
    base_folder: String,
) -> Result<DownloadResponse, String> {
    let parsed_url = Url::parse(&url).map_err(|error| format!("Invalid photo URL: {error}"))?;
    if !matches!(parsed_url.scheme(), "http" | "https") {
        return Err("Only HTTP and HTTPS photo URLs are allowed".to_string());
    }

    let destination = download_directory(&folder, &base_folder)?;
    fs::create_dir_all(&destination)
        .map_err(|error| format!("Cannot create download directory: {error}"))?;
    let file_path = destination.join(format!("{id}.jpg"));

    let bytes = Client::new()
        .get(parsed_url)
        .send()
        .await
        .map_err(|error| format!("Photo download failed: {error}"))?
        .error_for_status()
        .map_err(|error| format!("Photo download failed: {error}"))?
        .bytes()
        .await
        .map_err(|error| format!("Photo download failed: {error}"))?;

    fs::write(file_path, bytes).map_err(|error| format!("Cannot save photo: {error}"))?;
    Ok(DownloadResponse { success: true, id })
}
