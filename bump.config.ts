import { defineConfig } from "bumpp";

export default defineConfig({
	release: "prompt",
	commit: "DOCS: Обновление {tag}",
	tag: "v{version}",
	push: false,
	files: [
		"package.json",
		"src-tauri/tauri.conf.json",
		"src-tauri/Cargo.toml"
	]
});
