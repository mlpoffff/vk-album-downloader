<template>
  <UTooltip :text="text">
    <UButton
      class="rounded-full w-fit"
      icon="i-lucide-circle-question-mark"
      :color="color"
      variant="soft"
    />
  </UTooltip>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'info',
    required: false
  }
})
</script>
