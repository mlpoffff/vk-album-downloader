import type { Album, AlbumsState, DownloadPhoto } from "~/types/albums";
import { defineStore } from "pinia";
import { vkApi } from "~/composables/vkApi";
import { useToastStore } from "~/stores/Toast";

const getErrorMessage = (error: unknown): string => {
	return error instanceof Error ? error.message : String(error);
};

export const useAlbumsStore = defineStore("albums", {
	state: (): AlbumsState => ({
		albums: {},
		loadingAlbums: false,
		authError: false
	}),
	getters: {
		auth: () => useAuthStore(),
		toast: () => useToastStore()
	},
	actions: {
		async getOwnerId(category: string = "my", url: string = ""): Promise<number | null> {
			try {
				if (category === "my") return this.auth.id;
				if (category === "other") {
					const accessToken = this.auth.token;
					if (!accessToken) return null;
					return await vkApi.getOwnerId(extractVkId(url), accessToken);
				}
				return extractVkIdFromAlbum(url)?.id ?? null;
			} catch {
				return null;
			}
		},

		async getAlbums(category: string = "my", url: string = ""): Promise<void> {
			this.loadingAlbums = true;
			try {
				const ownerId = await this.getOwnerId(category, url);
				const accessToken = this.auth.token;
				if (ownerId === null || !accessToken) {
					throw new Error("Данного пользователя или группы не существует");
				}

				const albumsResponse = await vkApi.getAlbums({ ownerId, accessToken });
				let albumItems = albumsResponse.response.items;
				if (category === "url") {
					const id = extractVkIdFromAlbum(url)?.albumId ?? "";
					const serviceIdMapping: Record<string, number> = { 0: -6, "00": -7, "000": -15 };
					const serviceId = serviceIdMapping[id] ?? Number(id);
					albumItems = albumItems.filter((item) => item.id === serviceId);
				}

				const albums: Album[] = albumItems.map((item) => ({
					id: item.id,
					size: item.size,
					title: item.title,
					cover: item.sizes.at(-1)?.src ?? "",
					progress: 0,
					status: "none",
					forceStopped: false,
					errors: []
				}));

				const current = this.albums[category] ?? [];
				this.albums[category] = [
					...current.filter((item) => item.status === "downloading"),
					...albums
				];
			} catch (error) {
				console.error(error);
				this.toast.addError("Ошибка!", getErrorMessage(error));
			} finally {
				this.loadingAlbums = false;
			}
		},

		async getPhotos(
			albumId: number,
			albumSize: number,
			albumName: string,
			category: string,
			url: string = ""
		): Promise<void> {
			const album = this.albums[category]?.find((item) => item.id === albumId);
			if (!album) return;

			const ownerId = await this.getOwnerId(category, url);
			const accessToken = this.auth.token;
			if (ownerId === null || !accessToken) {
				this.toast.addError("Ошибка авторизации", "Сначала авторизуйтесь в ВК");
				return;
			}

			album.progress = 0;
			album.errors = [];
			album.status = "loading";
			try {
				const photosResponse = await vkApi.getPhotos({ ownerId, accessToken, albumId, albumSize });
				const photos: DownloadPhoto[] = photosResponse.items.map((item) => ({
					id: item.id,
					src: item.orig_photo?.url ?? ""
				}));

				album.status = "downloading";
				await this.downloadPhotos(photos, albumId, albumName, category);
			} catch (error) {
				console.error("VK API error:", error);
				album.status = "none";
				this.toast.addError("Ошибка API", "Не удалось получить данные об альбоме");
			}
		},

		async downloadPhotos(
			photos: DownloadPhoto[],
			albumId: number,
			albumName: string,
			category: string
		): Promise<void> {
			const album = this.albums[category]?.find((item) => item.id === albumId);
			if (!album) return;

			for (const photo of photos) {
				try {
					if (album.forceStopped) {
						album.forceStopped = false;
						return;
					}
					await vkApi.download({ id: photo.id, url: photo.src, folder: albumName });
				} catch (error) {
					console.error("Ошибка скачивания фото:", error);
					this.toast.addWarning("Ошибка скачивания", `Файл ${photo.id}.jpg не был скачан`);
				} finally {
					album.progress++;
				}
			}
			album.status = "completed";
		},

		stopDownloading(albumId: number, category: string): void {
			const album = this.albums[category]?.find((item) => item.id === albumId);
			if (!album) return;
			album.status = "none";
			album.forceStopped = true;
			this.toast.addSuccess("Успех!", `Скачивание альбома '${album.title}' отменено`);
		}
	}
});
