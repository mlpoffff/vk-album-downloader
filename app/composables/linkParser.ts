export const extractVkId = (url: string): string => {
  const cleaned = url.replace(/^https?:\/\/(www\.)?vk\.com\//, '')
  return cleaned.replace(/\/$/, '')
}
export const extractVkIdFromAlbum = (url: string) => {
  const match = url.match(/album(-?\d+)_(\d+)/)
  if (!match) return null

  return {
    id: Number(match[1]),
    albumId: String(match[2])
  }
}
