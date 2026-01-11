<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <p class="text-lg">
        Авторизация {{ isAuthorized ? '✅' : '❌' }}
      </p>
      <Info :text="'1. Пройдите авторизацию в ВК 2. Скопируйте ссылку на странице с ошибкой'" />
    </div>
    <div class="flex gap-2">
      <AuthButton class="flex-shrink-0" />
      <AuthInput class="grow" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthInput from '~/components/Auth/AuthInput.vue'
import AuthButton from '~/components/Auth/AuthButton.vue'
import Info from '~/components/Info.vue';
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const isAuthorized = computed(() => {
  return authStore.id !== null && authStore.token !== null
})
</script>
