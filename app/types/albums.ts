export type AlbumStatus = "none" | "loading" | "downloading" | "completed";

export interface Album {
	id: number
	title: string
	size: number
	cover: string
	status: AlbumStatus
	progress: number
	forceStopped: boolean
	errors: string[]
}

export interface DownloadPhoto {
	id: number
	src: string
}

export interface AlbumsState {
	albums: Record<string, Album[]>
	loadingAlbums: boolean
	authError: boolean
}
