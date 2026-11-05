# 📸 VK Album Downloader

### Приложение для скачивания альбомов фотографий из Вконтакте.


## ⚠️ Важная информация ⚠️
### **Приложение использует ваш [токен авторизации](https://id.vk.ru/about/business/go/docs/ru/vkid/latest/vk-id/connection/tokens/access-token#Kak-poluchit-token) в качестве доступа к API VK. Не передавайте его никому, в целях безопасности.**
### **Если слишком часто получать новые токены авторизации, страница может быть заморожена и придется менять пароль:**
<img src="docs/block.png" alt="Предупреждение о блокировке" width="300">

### При скачивании файлов не включайте\выключайте VPN, так как токен VK выдается под конкретный IP.


## 📲 Инструкция по установке
### 1. Скачать и установить версию для вашей ос https://github.com/mlpoffff/vk-album-downloader/releases/latest
### - .dmg - MacOS
> После установки приложения на MacOS перед первым запуском один раз выполните:
>
> ```xattr -c /Applications/VKAlbum.app```
### - .exe - Windows
### - Остальное - Linux
### 2. Открыть установленное приложение


## 📄 Как пользоваться
### 1. Нажмите кнопку "Получить ссылку"
![1 шаг.png](docs/1%20%D1%88%D0%B0%D0%B3.png)
### 2. Пройдите авторизацию в ВК
![2 шаг.png](docs/2%20%D1%88%D0%B0%D0%B3.png)
### 3. Скопируйте ссылку на страницу с ошибкой
![3 шаг.png](docs/3%20%D1%88%D0%B0%D0%B3.png)
### 4. Вставьте ссылку в поле ввода
![4 шаг.png](docs/4%20%D1%88%D0%B0%D0%B3.png)
### 5. Можете скачивать альбомы (альбомы сохраняются по пути /загрузки/vk_albums/название_альбома)
![5 шаг.png](docs/5%20%D1%88%D0%B0%D0%B3.png)


## 🛠️ Инструкция по установке и запуску из исходников
1. Скачать и распаковать архив https://github.com/mlpoffff/vk-album-downloader/archive/refs/heads/main.zip
2. Команды:
  * `pnpm install` - установка зависимостей
  * `pnpm tauri:dev` - запуск дев сервера c tauri-приложением
  * `pnpm tauri:build` - собирает tauri-приложение вместе с nuxt
  * `pnpm tauri:build:debug` - собирает tauri-приложение вместе с nuxt в дебаг режиме


## ❤️ Отдельное спасибо
* [vkhost](https://github.com/vkhost) за [механизм получения токенов авторизации](https://github.com/vkhost/vkhost.github.io)
* [MasyanyX](https://github.com/iMasyanyX) за [механизм скачивания из ВК](https://github.com/iMasyanyX/VKPhotoDownloader)
