<template>
  <UButton @click="authVkCom">
    Получить ссылку
  </UButton>
</template>

<script setup lang="ts">
const authVkCom = (): void => {
  const appId: number = 6287487
  const scope: number = 1073737727
  const baseURL: string = 'https://oauth.vk.ru'

  const url: string = `${baseURL}/authorize`
    + '?client_id=' + appId
    + '&scope=' + scope
    + `&redirect_uri=${baseURL}/blank.html`
    + '&display=page'
    + '&response_type=token'
    + '&revoke=1'

  window.open(url)
}
</script>
