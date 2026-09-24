import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  plugins: [react(), tailwindcss()],
  server: { host: '127.0.0.1' },
})
await server.listen()
server.printUrls()

