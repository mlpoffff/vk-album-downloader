import { app, BrowserWindow, shell, utilityProcess } from 'electron'
import path from 'node:path'
import http from 'node:http'
import getPort from 'get-port'

let nuxtProcess
let nuxtServerPath

function waitForServer(
  url,
  {
    timeout = 15000,
    interval = 200
  } = {}
) {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const check = () => {
      const req = http.get(url, res => {
        res.resume()
        resolve(true)
      })

      req.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error('Timeout waiting for Nuxt server'))
        } else {
          setTimeout(check, interval)
        }
      })
    }

    check()
  })
}

function createWindow(port) {
  if (app.isPackaged) {
    nuxtServerPath = path.join(process.resourcesPath, 'app', '.output', 'server', 'index.mjs')
  } else {
    nuxtServerPath = path.join(process.cwd(), '.output', 'server', 'index.mjs')
  }

  nuxtProcess = utilityProcess.fork(nuxtServerPath, [], {
    env: {
      PORT: `${port}`
    }
  })

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  win.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('http')) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  waitForServer(`http://localhost:${port}`)
    .then(() => {
      win.loadURL(`http://localhost:${port}`)
    })
    .catch(err => {
      console.error(err)
    })

  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' })
  }

  win.on('closed', () => {
    if (nuxtProcess) nuxtProcess.kill()
    nuxtProcess = null
  })
}

app.commandLine.appendSwitch('lang', 'ru')

app.on('ready', async () => {
  const port = await getPort()
  createWindow(port)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  nuxtProcess?.kill()
})
