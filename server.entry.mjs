import http from 'node:http'
import { Readable } from 'node:stream'
import fs from 'node:fs'
import { promisify } from 'node:util'
import path from 'node:path'

import serverModule from './dist/server/server.js'

const port = process.env.PORT || 3000

const handler = serverModule?.default ?? serverModule
const clientDir = path.resolve(process.cwd(), 'dist', 'client')
const stat = promisify(fs.stat)

function nodeHeadersToObject(headers) {
  const obj = {}
  for (const [k, v] of Object.entries(headers || {})) {
    if (Array.isArray(v)) obj[k] = v.join(', ')
    else if (v != null) obj[k] = String(v)
  }
  return obj
}

const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host || `localhost:${port}`
    const url = `http://${host}${req.url}`

    // Serve static files from dist/client for assets, robots.txt, sitemap.xml
    const pathname = decodeURIComponent(new URL(url).pathname)
    let filePath = path.join(clientDir, pathname)
    // If requesting root, let SSR handler handle it
    if (pathname !== '/' ) {
      // normalize to prevent escaping
      filePath = path.normalize(filePath)
      if (filePath.startsWith(clientDir)) {
        try {
          const s = await stat(filePath)
          if (s.isFile()) {
            const ext = path.extname(filePath).toLowerCase()
            const mime = {
              '.js': 'application/javascript; charset=utf-8',
              '.css': 'text/css; charset=utf-8',
              '.html': 'text/html; charset=utf-8',
              '.json': 'application/json; charset=utf-8',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.svg': 'image/svg+xml',
              '.ico': 'image/x-icon',
              '.txt': 'text/plain; charset=utf-8',
            }[ext] || 'application/octet-stream'

            res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'public, max-age=31536000, immutable' })
            const stream = fs.createReadStream(filePath)
            stream.pipe(res)
            return
          }
        } catch (e) {
          // file doesn't exist; fallthrough to SSR handler
        }
      }
    }

    // Convert Node request body to Web ReadableStream if present
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : Readable.toWeb(req)

    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body,
    })

    const response = await handler.fetch(request)
    // set status and headers
    res.writeHead(response.status, nodeHeadersToObject(Object.fromEntries(response.headers)))

    if (response.body) {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(Buffer.from(value))
      }
    }
    res.end()
  } catch (err) {
    console.error('Server entry error:', err)
    try { res.writeHead(500); res.end('Internal Server Error') } catch {}
  }
})

server.listen(port, () => console.log(`Server listening on ${port}`))
