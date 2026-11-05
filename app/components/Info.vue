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
	import type { ButtonColor } from "~/types/ui";

	withDefaults(defineProps<{
		text: string
		color?: ButtonColor
	}>(), {
		color: "info"
	});
</script>
