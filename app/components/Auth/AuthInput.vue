<template>
  <UInput
    v-model="value"
    placeholder="Вставьте ссылку"
    type="password"
    @update:model-value="updateData"
  />
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const value = ref('')

const authStore = useAuthStore()
const albumStore = useAlbumsStore()

const updateData = () => {
  authStore.setAuth(value.value)
  if (authStore.id !== null && authStore.token !== null){
    albumStore.getAlbums()
  }
}
</script>
