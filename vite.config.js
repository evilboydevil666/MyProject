// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => {
  const isElectron = process.env.ELECTRON === 'true'
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: command === 'build' && isElectron ? './' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Ensure compatibility with Electron
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    },
    server: {
      port: 5173,
      strictPort: true,
      // Allow Electron to connect during development
      cors: true
    }
  }
})