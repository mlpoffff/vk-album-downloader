//Кодовая база консольной версии
//Надо грамотно раскидать по всему приложению
import fs from 'fs';
import path from 'path';
import axios from 'axios';


let ACCESS_TOKEN: string | null = null;

let GROUP_ID: number | null = null;

const API_VERSION = '5.131';

function updateData(url: string): void {
    const hash = url.split('#')[1];
    if (!hash) return;

    const params = new URLSearchParams(hash);

    ACCESS_TOKEN = params.get('access_token');
    const uid = params.get('user_id');
    if (!uid) return;
    GROUP_ID = parseInt(uid);
}

async function getAlbums() {
    const url = 'https://api.vk.com/method/photos.getAlbums';
    const params = {
        access_token: ACCESS_TOKEN,
        v: API_VERSION,
        owner_id: GROUP_ID,
        need_system: 1,
        photo_sizes: 1
    };

    const response = await axios.get(url, { params });
    return response.data.response.items;
}


async function getAllPhotosFromAlbum(
    albumId: string,
    albumSize: number
) {
    const url = 'https://api.vk.com/method/photos.get';
    const limit = 1000;
    let offset = 0;
    let allPhotos: any[] = [];

    while (offset < albumSize) {
        const response = await axios.get(url, {
            params: {
                access_token: ACCESS_TOKEN,
                v: API_VERSION,
                owner_id: GROUP_ID,
                album_id: albumId,
                photo_sizes: 1,
                count: Math.min(limit, albumSize - offset),
                offset
            }
        });
        const items = response.data.response.items;
        allPhotos.push(...items);

        offset += items.length;
    }

    return allPhotos;
}


async function downloadPhoto(
    url: string,
    destFolder: string,
    filename: string
) {
    try {
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });

        fs.writeFileSync(path.join(destFolder, filename), response.data);

        return true;
    } catch (error: any) {
        console.error('Ошибка при скачивании фото:', {
            url,
            filename,
            message: error.message,
            status: error.response?.status,
        });

        return false;
    }
}


async function downloadAlbums() {
    updateData(
        "https://oauth.vk.com/blank.html#access_token=vk1.a.hU2ID7039AeTwRluOygPDRcUP7fz7sE7D9rxx4HNGB-NGhtdfIe1i6xYXTKICUS1TcnB4PMxfP4FGbso60sbuYq34uJ3-hn87z_WabaZBsgOygYvD3vTT1TeZUsM8rchW3C4tAMze6omO2ItOh5dQqna60cmDrSLY0yRi8tv-2zjibtfmXBTydK2UUOkFoJkBrSR37oIFClcdDeDd9uvOg&expires_in=86400&user_id=235696668&email=123letsplay93@gmail.com"
    )

    console.log(`Пользователь: ${GROUP_ID}`);

    const albums = await getAlbums();
    for (const album of albums) {
        const albumTitle = album.title.replace(/\//g, '_');
        const albumId = album.id;
        const albumSize = album.size
        if (albumId !== -15) {
            continue;
        }
        console.log(`Скачивание альбома: ${albumTitle}`);

        const albumFolder = path.join('vk_photos', albumTitle);
        let photos = await getAllPhotosFromAlbum(albumId, albumSize);
        photos = photos.reverse();
        for (const photo of photos) {
            const largestPhoto = photo.sizes.reduce((prev:any, curr:any) =>
                (curr.width * curr.height > prev.width * prev.height ? curr : prev)
            );
            const photoUrl = largestPhoto.url;
            const filename = `${photo.id}.jpg`;

            await downloadPhoto(photoUrl, albumFolder, filename);
            const ok = await downloadPhoto(photoUrl, albumFolder, filename);

            if (!ok) {
                console.log(`Не скачано: ${filename}`);
            } else {
                console.log(`Скачано: ${filename}`);
            }
        }
    }
}

downloadAlbums().catch(console.error);
