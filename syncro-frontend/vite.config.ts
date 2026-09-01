import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true,
  },
  server: {
    host: '0.0.0.0', // Exposes frontend to LAN / Mobile devices for QR scanning
    port: 5173,
    strictPort: false,
  },
})
