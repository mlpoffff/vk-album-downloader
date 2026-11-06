<template>
	<div class="flex flex-col gap-3">
		<div class="flex items-center justify-between">
			<p class="text-lg">
				{{ !isAuthorized ? 'Вы не авторизованы ❌' : 'Вы авторизованы ✅' }}
			</p>
			<div class="flex items-center gap-2">
				<UButton
					v-if="isAuthorized"
					color="error"
					variant="soft"
					@click="logout"
				>
					Выйти
				</UButton>
				<Info v-else text="1. Пройдите авторизацию в ВК 2. Скопируйте ссылку на странице с ошибкой" />
			</div>
		</div>
		<div
			v-if="!isAuthorized"
			class="flex gap-2"
		>
			<AuthButton class="shrink-0" />
			<AuthInput class="grow" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { listen } from "@tauri-apps/api/event";
	import AuthButton from "~/components/Auth/AuthButton.vue";
	import AuthInput from "~/components/Auth/AuthInput.vue";
	import Info from "~/components/Info.vue";
	import { useAuthStore } from "~/stores/auth";

	const authStore = useAuthStore();
	const albumsStore = useAlbumsStore();

	const logout = () => {
		authStore.logout();
		albumsStore.clearAlbums();
	};

	const isAuthorized = computed(() => {
		return authStore.id !== null && authStore.token !== null;
	});

	const applyAuth = (value?: string) => {
		if (!value) return;

		authStore.setAuth(value);
		if (authStore.id !== null && authStore.token !== null) {
			void albumsStore.getAlbums();
		}
	};

	let unlistenAuthCallback: (() => void) | undefined;
	onMounted(async () => {
		unlistenAuthCallback = await listen<string>("vk-auth-callback", (event) => {
			applyAuth(event.payload);
		});
	});

	onBeforeUnmount(() => {
		unlistenAuthCallback?.();
	});

	const route = useRoute();

	const queryParameters = computed(() =>
		Object.entries(route.query).map(([name, value]) => ({
			name,
			value: Array.isArray(value) ? value.join(", ") : value ?? ""
		}))
	);

	watch(
		() => queryParameters.value[0]?.value,
		applyAuth,
		{ immediate: true }
	);
</script>
