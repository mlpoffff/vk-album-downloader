<template>
	<Html class="overflow-x-hidden">
		<Body class="font-sans antialiased">
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

					<UMain class="flex min-h-0 flex-1 flex-col">
						<div class="flex min-h-0 flex-1 justify-center py-4">
							<UContainer>
								<NuxtPage />
							</UContainer>
						</div>
					</UMain>

					<USeparator
						class="shrink-0"
					/>

					<UFooter class="shrink-0">
						<template #left>
							<p class="text-sm text-muted">
								Сделано спустя рукава
							</p>
						</template>

						<template #right>
							<UButton
								to="https://github.com/mlpoffff/vk-album-downloader"
								target="_blank"
								icon="i-simple-icons-github"
								aria-label="GitHub"
								color="neutral"
								variant="ghost"
								class="rounded-full"
							/>
						</template>
					</UFooter>
				</div>
			</UApp>
		</Body>
	</Html>
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
