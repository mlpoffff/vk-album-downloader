import { defineStore } from 'pinia'
import { useToastStore } from '~/stores/Toast'

export const useAlbumsStore = defineStore('albums', {
  state: () => ({
    albums: {},
    loadingAlbums: false,
    authError: false
  }),
  getters: {
    auth: () => useAuthStore(),
    toast: () => useToastStore()
  },
  actions: {
    async getOwnerId(category: string = 'my', url: string = '') {
      try {
        if (category === 'my') {
          return this.auth.id
        } else if (category === 'other') {
          const username = extractVkId(url)
          return await $fetch('/api/vk/id', {
            method: 'POST',
            body: {
              ids: username,
              access_token: this.auth.token
            }
          })
        } else {
          return extractVkIdFromAlbum(url)?.id
        }
      } catch (e) {
        return null
      }
    },
    async getAlbums(category: string = 'my', url: string = '') {
      this.loadingAlbums = true
      let ownerId
      try {
        ownerId = await this.getOwnerId(category, url)
        if (!ownerId) {
          throw new Error('Данного пользователя или группы не существует')
        }
      } catch (err) {
        console.error(err)
        this.toast.addError(
          'Ошибка!',
          err.message
        )
        this.loadingAlbums = false
        return
      }
      try {
        let albums = await $fetch('/api/vk/albums', {
          method: 'POST',
          body: {
            owner_id: ownerId,
            access_token: this.auth.token
          }
        })

        if (category === 'url') {
          const id = extractVkIdFromAlbum(url)?.albumId

          const serviceIdMapping = {
            '0': -6,
            '00': -7,
            '000': -15
          }

          const serviceId = serviceIdMapping[id] ?? id
          albums.response.items = albums.response.items.filter(
            item => item.id == serviceId
          )
        }

        albums = albums.response.items.map(item => ({
          id: item.id,
          size: item.size,
          title: item.title,
          cover: item.sizes[item.sizes.length - 1].src,
          progress: 0,
          status: 'none',
          forceStopped: false
        }))

        const current = this.albums[category] ?? []

        this.albums[category] = [
          ...current.filter(item => item.status === 'downloading'),
          ...albums
        ]
      } catch (err) {
        console.error(err)
        this.toast.addError(
          'Ошибка',
          'Ваш токен просрочен или отсутствуют альбомы'
        )
        this.loadingAlbums = false
      }
      this.loadingAlbums = false
    },
    async getPhotos(albumId: number, albumSize: number, albumName: string, category: string, url: string = '') {
      const album = this.albums[category][this.albums[category].findIndex(album => album.id === albumId)]
      const ownerId = await this.getOwnerId(category, url)
      album.progress = 0
      album.errors = []
      album.status = 'loading'
      try {
        const photosResponse = await $fetch('/api/vk/photos', {
          method: 'POST',
          body: {
            owner_id: ownerId,
            access_token: this.auth.token,
            album_id: albumId,
            album_size: albumSize
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const photos = (photosResponse.items || []).map((item: any) => ({
          id: item.id,
          src: item?.orig_photo?.url || ''
        }))

        album.status = 'downloading'
        await this.downloadPhotos(photos, albumId, albumName, category)
      } catch (err: any) {
        console.error('VK API error:', err)
        album.status = 'none'
        this.toast.addError('Ошибка API', 'Не удалось получить данные об альбоме')
      }
    },
    async downloadPhotos(photos, albumId: number, albumName: string, category: string) {
      const album = this.albums[category][this.albums[category].findIndex(album => album.id === albumId)]
      for (const photo of photos) {
        try {
          if (album.forceStopped) {
            album.forceStopped = false
            return
          }
          const res = await $fetch('/api/vk/download', {
            method: 'POST',
            body: {
              id: photo.id,
              url: photo.src,
              folder: albumName
            },
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if ((res as any).ok === false) {
            throw new Error(`Ошибка сервера: ${(res as any).message || 'Неизвестная ошибка'}`)
          }
        } catch (err: any) {
          console.error('Ошибка скачивания фото:', err)
          this.toast.addWarning(
            'Ошибка скачивания',
            `Файл ${photo.id}.jpg не был скачан`
          )
        } finally {
          album.progress++
        }
      }
      album.status = 'completed'
    },
    stopDownloading(albumId: number, category: string) {
      const album = this.albums[category][this.albums[category].findIndex(album => album.id === albumId)]
      album.status = 'none'
      album.forceStopped = true
      this.toast.addSuccess('Успех!', `Скачивание альбома '${album.title}' отменено`)
    }
  }
})
