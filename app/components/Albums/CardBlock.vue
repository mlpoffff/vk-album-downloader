<template>
  <div class="flex flex-col gap-4 mt-2">
    <div class="flex flex-row-reverse gap-3 w-full">
      <UButton
        class="w-fit self-end"
        icon="lucide-refresh-ccw"
        :loading="albumStore.loadingAlbums"
        :disabled="!isAuthorized"
        label="Обновить список"
        color="neutral"
        @click="getAlbums"
      />
      <UInput
        v-if="category === 'other' || category === 'url'"
        v-model="inputValue"
        :placeholder="getPlaceholder()"
        class="w-full"
        :disabled="!isAuthorized"
      />
    </div>
    <div
      v-if="albumStore?.albums[category]?.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <Card
        v-for="album in albumStore?.albums[category]"
        :key="album.id"
        :album="album"
        :category="category"
        :url="inputValue"
      />
    </div>
    <EmptyAlbums v-else />
  </div>
</template>

<script setup lang="ts">
import { useAlbumsStore } from '~/stores/albums'
import Card from '~/components/Albums/Card.vue'
import EmptyAlbums from '~/components/Albums/EmptyAlbums.vue'

const albumStore = useAlbumsStore()
const inputValue = ref('')

const props = defineProps({
  category: {
    type: String,
    required: true
  },
  isAuthorized: {
    type: Boolean,
    required: true
  }
})

const getPlaceholder = () => {
  if (props.category === 'other') {
    return 'Вставьте ссылку на группу или страницу человека'
  }
  return 'Вставьте ссылку на альбом'
}

const getAlbums = async () => {
  await albumStore.getAlbums(props.category, inputValue.value)
}

watch(
  () => inputValue.value,
  async () => {
    await getAlbums()
  }
)
</script>
