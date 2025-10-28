import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - only in build mode
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'icons-vendor': ['lucide-react'],
          'http-vendor': ['axios'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    // Enable source maps for debugging (optional)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Remove console logs in production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      'src/tests/accessibility.test.js',
      'src/tests/responsive.test.js',
      'src/tests/responsive-manual.test.js'
    ],
  },
})
