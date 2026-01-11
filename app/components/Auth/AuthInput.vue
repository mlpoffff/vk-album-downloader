<template>
  <UInput
    v-model="value"
    placeholder="Вставьте ссылку"
    type="password"
    @update:model-value="authStore.setAuth(value)"
  />
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const value = ref('')
const authStore = useAuthStore()
</script>
