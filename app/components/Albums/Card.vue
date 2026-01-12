<template>
  <UCard class="flex gap-4">
    <img
      :src="cover"
      alt="Обложка альбома"
      class="w-full aspect-[4/3] flex-shrink-0 rounded-lg object-cover"
    />

    <div class="flex flex-1 flex-col justify-between">
      <div>
        <h3 class="text-base font-semibold">
          {{ album.title }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          📸 {{ album.size }} фото
        </p>
      </div>

      <UButton
        icon="i-lucide-download"
        class="mt-3 self-start"
      >
        Скачать альбом
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Album {
  id: number
  title: string
  size: number
  cover?: string
}

const props = defineProps<{
  album: Album
}>()

const cover = computed(() => {
  const lastSize = props.album.sizes?.[props.album.sizes.length - 1]
  console.error(lastSize)
  return lastSize?.src ?? ''
})
</script>
