import { defineStore } from 'pinia'

export const useAlbumsStore = defineStore('albums', {
  state: () => ({
    albums: [],
    loadingAlbums: false
  }),
  getters: {
    auth: () => useAuthStore()
  },
  actions: {
    async getAlbums() {
      this.loadingAlbums = true
      const res = await fetch('http://localhost:3001/api/vk/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: this.auth.id,
          access_token: this.auth.token
        })
      })
      const albums = await res.json()
      this.albums = albums.response.items
      this.loadingAlbums = false
    },
    async getPhotos(albumId: number, albumSize: number) {
      const res = await fetch('http://localhost:3001/api/vk/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: this.auth.id,
          access_token: this.auth.token,
          album_id: albumId,
          album_size: albumSize
        })
      })
      const albums = await res.json()
      console.error(albums)
    }
  }
})
