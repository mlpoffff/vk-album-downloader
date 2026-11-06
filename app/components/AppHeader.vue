<template>
	<UHeader :toggle="false">
		<template #left>
			<NuxtLink
				to="/"
				class="flex items-center gap-2"
			>
				<h1 class="lg:text-xl">
					Скачать альбом
				</h1>
				<Icon
					size="24px"
					name="simple-icons:vk"
				/>
			</NuxtLink>
		</template>

		<template #right>
			<UButton
				:color="downloadDirectory ? 'primary' : 'neutral'"
				variant="ghost"
				icon="i-lucide-folder-open"
				:aria-label="downloadDirectory ? `Папка сохранения: ${downloadDirectory}` : 'Выбрать папку сохранения'"
				:title="downloadDirectory ? `Папка сохранения: ${downloadDirectory}` : 'Выбрать папку сохранения'"
				@click="selectDownloadDirectory"
			/>
			<ColorModeButton />
		</template>
	</UHeader>
</template>

<script setup lang="ts">
	import { open } from "@tauri-apps/plugin-dialog";
	import {
		loadDownloadDirectory,
		saveDownloadDirectory,
		useDownloadDirectory
	} from "~/composables/downloadDirectory";

	const downloadDirectory = useDownloadDirectory();

	onMounted(() => {
		downloadDirectory.value = loadDownloadDirectory();
	});

	const selectDownloadDirectory = async () => {
		const selected = await open({
			directory: true,
			multiple: false,
			title: "Выберите папку для сохранения альбомов"
		});

		if (typeof selected !== "string") return;

		downloadDirectory.value = selected;
		saveDownloadDirectory(selected);
	};
</script>
