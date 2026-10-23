<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>

<template>
  <UApp>
    <div class="flex min-h-dvh flex-col">
      <UHeader
        class="shrink-0"
        :toggle="false"
      >
        <template #left>
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
          >
            <h1 class="lg:text-xl">Скачать альбом</h1>
            <Icon
              size="24px"
              name="simple-icons:vk"
            />
          </NuxtLink>
        </template>

        <template #right>
          <UButton
            to="https://github.com/mlpoffff/vk-album-downloader"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UHeader>

      <UMain class="flex min-h-0 flex-1 flex-col">
        <div class="flex min-h-0 flex-1 justify-center py-4">
          <UContainer>
            <NuxtPage />
          </UContainer>
        </div>
      </UMain>

      <USeparator
        class="shrink-0"
        icon="i-simple-icons-nuxtdotjs"
      />

      <UFooter class="shrink-0">
        <template #left>
          <p class="text-sm text-muted">
            Сделано спустя рукава
          </p>
        </template>

        <template #right>
          <UButton
            to="https://github.com/maxletsplay1/vk-album-downloader"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UFooter>
    </div>
  </UApp>
</template>
