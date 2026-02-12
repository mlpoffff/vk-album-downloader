export const extractVkId = (url: string): string => {
  const cleaned = url.replace(/^https?:\/\/(www\.)?vk\.com\//, '')
  return cleaned.replace(/\/$/, '')
}
export const extractVkIdFromAlbum = (url: string) => {
  const albumMatch = url.match(/album(-?\d+)_(\d+)/)
  if (albumMatch) {
    return {
      id: Number(albumMatch[1]),
      albumId: String(albumMatch[2])
    }
  }

  const tagMatch = url.match(/tag(\d+)/)
  if (tagMatch) {
    return {
      id: Number(tagMatch[1]),
      albumId: '-9000'
    }
  }

  return null
}
