import type {
	VkAlbumRequest,
	VkAlbumsResponse,
	VkDownloadRequest,
	VkDownloadResponse,
	VkPhotosRequest,
	VkPhotosResponse
} from "~/types/vk";
import { invoke } from "@tauri-apps/api/core";

export const vkApi = {
	getOwnerId: (ids: string, accessToken: string) => invoke<number>("vk_get_owner_id", {
		ids,
		accessToken
	}),
	getAlbums: ({ ownerId, accessToken }: VkAlbumRequest) => invoke<VkAlbumsResponse>("vk_get_albums", {
		ownerId,
		accessToken
	}),
	getPhotos: ({ ownerId, accessToken, albumId, albumSize }: VkPhotosRequest) => invoke<VkPhotosResponse>("vk_get_photos", {
		ownerId,
		accessToken,
		albumId,
		albumSize
	}),
	download: ({ id, url, folder, baseFolder }: VkDownloadRequest) => invoke<VkDownloadResponse>("vk_download", {
		id,
		url,
		folder,
		baseFolder
	})
};
