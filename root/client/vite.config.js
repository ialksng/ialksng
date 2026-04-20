import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  optimizeDeps: {
    include: ['@tiptap/react', '@tiptap/core', '@tiptap/pm', '@tiptap/starter-kit']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
})