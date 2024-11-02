import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    outDir: '../server/public'
  },
  resolve: {
    alias: {
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),

      '@colors': fileURLToPath(new URL('./src/utils/colors.ts', import.meta.url)),
      '@shapes': fileURLToPath(new URL('./src/shapes/index.ts', import.meta.url)),

      '@graph': fileURLToPath(new URL('./src/graphs', import.meta.url)),
      '@shape': fileURLToPath(new URL('./src/shapes', import.meta.url)),
      '@product': fileURLToPath(new URL('./src/products', import.meta.url)),
      '@playground': fileURLToPath(new URL('./src/playground', import.meta.url)),
    }
  }
})