<template>
  <UButton @click="authVkCom">
    Получить ссылку
  </UButton>
</template>

<script setup lang="ts">
const authVkCom = (): void => {
  const appId: number = 6287487
  const scope: number = 1073737727

  const url: string = 'https://oauth.vk.com/authorize'
    + '?client_id=' + appId
    + '&scope=' + scope
    + '&redirect_uri=https://oauth.vk.com/blank.html'
    + '&display=page'
    + '&response_type=token'
    + '&revoke=1'

  window.open(url)
}
</script>
