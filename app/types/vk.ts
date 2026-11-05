export interface VkAlbumRequest {
	ownerId: number
	accessToken: string
}

export interface VkPhotosRequest {
	ownerId: number
	accessToken: string
	albumId: number
	albumSize: number
}

export interface VkDownloadRequest {
	id: number
	url: string
	folder: string
	baseFolder: string
}

export interface VkAlbum {
	id: number
	size: number
	title: string
	sizes: Array<{ src: string }>
}

export interface VkPhoto {
	id: number
	orig_photo?: { url: string }
}

export interface VkAlbumsResponse {
	response: {
		items: VkAlbum[]
	}
}

export interface VkPhotosResponse {
	items: VkPhoto[]
}

export interface VkDownloadResponse {
	success: boolean
	id: number
}
