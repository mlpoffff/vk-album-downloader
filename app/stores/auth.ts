import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    id: null as number | null,
    token: null as string | null
  }),

  actions: {
    setAuth(url: string): void {
      this.id = null
      this.token = null

      const hash = url.split('#')[1]
      if (!hash) return

      const params = new URLSearchParams(hash)
      const uid = params.get('user_id')
      const token = params.get('access_token')

      if (!uid || !token) return
      this.id = parseInt(uid)
      this.token = token
    }
  }
})
