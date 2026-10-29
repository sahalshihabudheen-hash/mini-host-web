import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (name: string) => fileURLToPath(new URL(name, import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: page('index.html'),
        features: page('features.html'),
        screenshots: page('screenshots.html'),
        how: page('how.html'),
        download: page('download.html'),
        faq: page('faq.html'),
      },
    },
  },
})
