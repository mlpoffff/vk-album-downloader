import express from 'express'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'

export function createExpressApp() {
  const app = express()

  app.use(express.json())

  app.post('/vk/albums', async (req, res) => {
    const { owner_id, access_token } = req.body
    if (!owner_id || !access_token) {
      return res.status(400).json({ error: 'owner_id and access_token required' })
    }

    try {
      const response = await axios.get(
        'https://api.vk.com/method/photos.getAlbums',
        {
          params: {
            owner_id,
            need_system: 1,
            photo_sizes: 1,
            need_covers: 1,
            v: '5.199',
            access_token
          }
        }
      )

      res.json(response.data)
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      res.status(500).json({ error: 'VK API request failed' })
    }
  })

  app.post('/vk/id', async (req, res) => {
    const { ids, access_token } = req.body

    if (!ids || !access_token) {
      return res.status(400).json({ error: 'id and access_token required' })
    }

    let result = null

    try {
      try {
        const { data } = await axios.get('https://api.vk.com/method/users.get', {
          params: { user_ids: ids, v: '5.199', access_token }
        })

        if (data.response && data.response.length) {
          result = data.response[0].id
        } else {
          throw new Error('Empty users')
        }
      } catch (e) {
        const { data } = await axios.get('https://api.vk.com/method/groups.getById', {
          params: { group_ids: ids, v: '5.199', access_token }
        })

        result = '-' + data.response.groups[0].id
      }

      res.json(result)
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      res.status(500).json({ error: 'VK API request failed' })
    }
  })

  app.post('/vk/photos', async (req, res) => {
    const { owner_id, access_token, album_id, album_size } = req.body

    if (!owner_id || !access_token || !album_id || album_size == null) {
      return res.status(400).json({
        error: 'owner_id, access_token, album_id, album_size required'
      })
    }

    const limit = 1000
    let offset = 0
    const allPhotos: any[] = []

    try {
      while (offset < album_size) {
        let response
        if (album_id !== -9000){
          response = await axios.get(
            'https://api.vk.com/method/photos.get',
            {
              params: {
                owner_id,
                album_id,
                photo_sizes: 1,
                count: Math.min(limit, album_size - offset),
                offset,
                access_token,
                v: '5.199'
              }
            }
          )
        } else {
          response = await axios.get(
            'https://api.vk.com/method/photos.getUserPhotos',
            {
              params: {
                user_id: owner_id,
                photo_sizes: 1,
                count: Math.min(limit, album_size - offset),
                offset,
                access_token,
                v: '5.199'
              }
            }
          )
        }

        const items = response.data.response.items
        allPhotos.push(...items)
        offset += items.length
      }

      res.json({ items: allPhotos })
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      res.status(500).json({ error: 'VK API request failed' })
    }
  })

  app.post('/vk/download', async (req, res) => {
    const { id, url, folder } = req.body

    if (!id || !url || !folder) {
      return res.status(400).json({
        success: false,
        id,
        message: 'id, url, folder required'
      })
    }

    function sanitizePathName(name: string) {
      return name
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim()
        .replace(/[. ]+$/, '')
        .replace(/\s+/g, ' ')
    }

    try {
      const downloadsDir = path.join(os.homedir(), 'Downloads')

      const safeFolder = sanitizePathName(folder)
      const destFolder = path.join(downloadsDir, 'vk_albums', safeFolder)

      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true })
      }

      const safeFileName = sanitizePathName(`${id}.jpg`)
      const filePath = path.join(destFolder, safeFileName)

      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      })

      fs.writeFileSync(filePath, response.data)

      res.json({ success: true, id })
    } catch (err: any) {
      console.error(err)
      res.status(500).json({
        success: false,
        id,
        message: err.message
      })
    }
  })

  return app
}
