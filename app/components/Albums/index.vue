<template>
  <UTabs
    :items="items"
    :unmount-on-hide="false"
  >
    <template #my>
      <CardBlock
        category="my"
        :is-authorized="isAuthorized"
      />
    </template>

    <template #other>
      <CardBlock
        category="other"
        :is-authorized="isAuthorized"
      />
    </template>

    <template #url>
      <CardBlock
        category="url"
        :is-authorized="isAuthorized"
      />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
import CardBlock from '~/components/Albums/CardBlock.vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const isAuthorized = computed(() => {
  return authStore.id !== null && authStore.token !== null
})

const items = [
  {
    label: 'Мои альбомы',
    icon: 'i-lucide-user-circle',
    slot: 'my'
  },
  {
    label: 'Чужие альбомы',
    icon: 'i-lucide-users',
    slot: 'other'
  },
  {
    label: 'Альбом по ссылке',
    icon: 'i-lucide-link-2',
    slot: 'url'
  }
]
</script>
