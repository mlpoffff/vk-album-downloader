<template>
	<div class="flex gap-2 items-center">
		<UButton icon="simple-icons:vk" class="cursor-pointer" @click="openAuthWindow">
			ID
		</UButton>
		<UButton :to="url" target="_blank" color="neutral" variant="soft">
			Ссылка авторизации
		</UButton>
	</div>
</template>

<script setup lang="ts">
	import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

	const appId: number = 6287487;
	const scope: number = 1073737727;
	const baseURL: string = "https://oauth.vk.ru";
	const userAgent: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
		+ "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

	const url: string = `${baseURL}/authorize`
		+ `?client_id=${appId}&scope=${scope}&redirect_uri=${baseURL}/blank.html`
		+ `&display=page`
		+ `&response_type=token`
		+ `&revoke=1`;

	const openAuthWindow = async () => {
		const existingWindow = await WebviewWindow.getByLabel("secondary");

		if (existingWindow) {
			await existingWindow.setFocus();
			return;
		}

		const authWindow = new WebviewWindow("secondary", {
			height: 720,
			resizable: true,
			title: "Авторизация VK",
			url,
			userAgent,
			width: 480
		});

		await authWindow.once("tauri://error", (event) => {
			console.error("Не удалось открыть окно авторизации", event);
		});
	};
</script>
