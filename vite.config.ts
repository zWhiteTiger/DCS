import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2430,
  },
  optimizeDeps: {
    exclude: [
      'chunk-UCE6Z6MK.js', // exclude problematic files
      'chunk-EUBIMDDS.js'
    ]
  }
})
