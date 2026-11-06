<template>
	<div class="flex min-h-dvh flex-col">
		<AppHeader class="shrink-0" />

		<UMain class="flex min-h-0 flex-1 flex-col">
			<div class="flex min-h-0 flex-1 justify-center py-4">
				<UContainer>
					<slot />
				</UContainer>
			</div>
		</UMain>

		<USeparator class="shrink-0" />
		<AppFooter class="shrink-0" />
	</div>
</template>
