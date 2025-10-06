import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@react-pdf/renderer',
      'pako/lib/zlib/zstream.js',
      'pako/lib/zlib/deflate.js',
      'pako/lib/zlib/inflate.js',
      'pako/lib/zlib/constants.js'
    ],
  },
})