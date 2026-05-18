import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // 仅代理 API 子路径；勿代理 GET /boss-crawl（Vue 前端路由，刷新需返回 index.html）
      '/boss-crawl/configs': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/boss-crawl/tasks': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/boss-crawl/jobs': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/boss-crawl/login': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
