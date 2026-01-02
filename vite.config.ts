import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy PDF/canvas libs - only loaded when exporting
          'pdf-export': ['jspdf', 'html2canvas'],
          // Split i18n
          'i18n': ['i18next', 'react-i18next'],
          // React core
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
