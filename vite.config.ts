import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mateus-portfolio/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/three/')) return 'three-vendor';
          if (id.includes('@react-three')) return 'r3f-vendor';
          if (id.includes('motion')) return 'motion-vendor';
          if (id.includes('lucide-react')) return 'icons-vendor';
          return 'vendor';
        },
      },
    },
  },
})
