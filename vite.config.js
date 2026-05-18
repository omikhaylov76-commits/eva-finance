import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// При деплое на GitHub Pages в подпапку /eva-finance/ нужно base
// При локальной разработке (npm run dev) base игнорируется
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/eva-finance/' : '/',
})
