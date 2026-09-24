import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

await build({ configFile: false, root: process.cwd(), base: './', plugins: [react(), tailwindcss()] })

