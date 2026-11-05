const DOWNLOAD_DIRECTORY_KEY = "vk-album-download-directory";

export const useDownloadDirectory = () => {
	return useState<string>("download-directory", () => "");
};

export const loadDownloadDirectory = (): string => {
	if (!import.meta.client) return "";
	return localStorage.getItem(DOWNLOAD_DIRECTORY_KEY) ?? "";
};

export const saveDownloadDirectory = (directory: string): void => {
	if (!import.meta.client) return;
	localStorage.setItem(DOWNLOAD_DIRECTORY_KEY, directory);
};
