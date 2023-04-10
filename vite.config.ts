import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import * as path from "path";


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './public/'),
      '@': path.resolve(__dirname, './src/'),
    },
  },
  server: {
    proxy: {
      '/tiankong': {
        target: 'https://m3u8.tiankongapi.com/api.php/provide/vod/',
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '/'),
      },
      '/baidu': {
        target: 'https://api.apibdzy.com/api.php/provide/vod/',
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '/'),
      }
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/style/index.scss";',
      },
    },
  },
  build: {
    emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
  },
})
