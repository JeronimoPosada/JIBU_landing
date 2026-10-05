import http from 'node:http'
import { Readable } from 'node:stream'

import serverModule from './dist/server/server.js'

const port = process.env.PORT || 3000

const handler = serverModule?.default ?? serverModule

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
