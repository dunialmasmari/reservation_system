import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue2()],
  css: {
    preprocessorOptions: {
      scss: {
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.foodics.dev/v5',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})