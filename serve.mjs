import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const root = join(process.cwd(), 'dist')
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.png': 'image/png' }
const port = Number(process.env.PORT || 4173)
createServer(async (req, res) => {
  try {
    let file = join(root, (req.url || '/').split('?')[0])
    let details = await stat(file)
    if (details.isDirectory()) { file = join(file, 'index.html'); details = await stat(file) }
    res.setHeader('content-type', mime[extname(file)] || 'application/octet-stream')
    const range = req.headers.range
    if (range && extname(file) === '.mp4') {
      const [startText, endText] = range.replace('bytes=', '').split('-')
      const start = Number(startText)
      const end = endText ? Number(endText) : Math.min(start + 1024 * 1024 - 1, details.size - 1)
      res.writeHead(206, {
        'accept-ranges': 'bytes',
        'content-range': `bytes ${start}-${end}/${details.size}`,
        'content-length': end - start + 1,
        'content-type': 'video/mp4',
      })
      createReadStream(file, { start, end }).pipe(res)
      return
    }
    res.setHeader('content-length', details.size)
    res.end(await readFile(file))
  } catch { res.statusCode = 404; res.end('Not found') }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/`))

