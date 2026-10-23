<template>
  <UCard
    :id="'album-card'+album.id"
    class="w-full"
    :ui="{ body: 'w-full' }"
  >
    <div class="flex w-full max-w-full aspect-4/3 shrink-0 overflow-hidden rounded-lg">
      <img
        v-if="hasCover"
        :src="album.cover"
        alt="Обложка альбома"
        class="size-full object-cover"
        @error="imageLoadFailed = true"
      >
      <div
        v-else
        class="flex size-full items-center justify-center bg-gray-100 text-gray-400"
        role="img"
        aria-label="Обложка альбома недоступна"
      >
        <Icon
          name="i-lucide-image-off"
          size="40"
        />
      </div>
    </div>

    <div class="flex min-w-0 flex-1 flex-col justify-between">
      <div>
        <h3 class="wrap-break-word text-base font-semibold">
          {{ album.title }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          📸 {{ album.size }} фото
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          v-if="album.status !== 'downloading'"
          :icon="album.status == 'completed'? 'i-lucide-check' : 'i-lucide-download'"
          :color="album.status == 'completed'? 'success' : 'primary'"
          class="mt-3 self-start"
          :loading="album.status === 'loading'"
          @click="albumsStore.getPhotos(album.id, album.size, album.title, category, url)"
        >
          {{ album.status == 'completed'? 'Альбом скачан' : 'Скачать альбом' }}
        </UButton>
        <div
          v-else
          class="w-full flex gap-2 mt-2"
        >
          <UProgress
            v-model="album.progress"
            color="success"
            status
            :max="album.size"
          />
          <UButton
            class="shrink-0 h-fit mt-1"
            label="Отмена"
            color="error"
            @click="albumsStore.stopDownloading(album.id, category)"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import launchConfettiOnCard from '~/composables/confetti'

const toastStore = useToastStore()

interface Album {
  id: number
  title: string
  size: number
  cover: string
  status: string
  progress: number
}

const props = defineProps<{
  album: Album
  category: string
  url: string
}>()

const albumsStore = useAlbumsStore()
const imageLoadFailed = shallowRef(false)
const hasCover = computed(() => {
  return Boolean(props.album.cover)
    && !props.album.cover.includes('x_noalbum_2x.png')
    && !imageLoadFailed.value
})

watch(
  () => props.album.cover,
  () => {
    imageLoadFailed.value = false
  }
)

watch(
  () => props.album.status,
  async (newValue, oldValue) => {
    if (newValue === 'completed') {
      await nextTick()
      launchConfettiOnCard('album-card' + props.album.id)
      toastStore.addSuccess('Успех!', `Альбом '${props.album.title}' скачан`)
    }
  }
)
</script>
