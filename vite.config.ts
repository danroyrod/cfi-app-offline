import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Base path: Use repository name for GitHub Pages
  // For GitHub Pages: '/cfi-app-offline/'
  // For custom domain: '/'
  // For Capacitor: './'
  base: '/cfi-app-offline/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'CFI Airplane ACS App',
        short_name: 'CFI ACS',
        description: 'Flight Instructor Airplane Airman Certification Standards - Complete lesson plans, ACS tasks, flashcards, and study tools',
        theme_color: '#1e40af',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/cfi-app-offline/',
        start_url: '/cfi-app-offline/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        globIgnores: ['**/enhancedFlashcards.json'], // Excluded from precache due to size (2.23 MB)
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB to accommodate large chunks
        // Note: JSON data files (acs_data.json, lessonPlansData.json) are imported as ES modules
        // and bundled into JS chunks, so they're automatically precached via globPatterns
        // enhancedFlashcards.json is handled via runtime caching (NetworkFirst strategy below)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // Cache JSON files (including enhancedFlashcards.json) with NetworkFirst strategy
            // This ensures offline access while allowing updates when online
            urlPattern: /\.(?:json)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'data-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              networkTimeoutSeconds: 3 // Fallback to cache if network takes > 3 seconds
            }
          }
        ]
      },
      devOptions: {
        enabled: false, // Disable in dev for faster development
        type: 'module'
      }
    })
  ],
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Large data files in separate chunks
          'data': ['./src/acs_data.json', './src/lessonPlansData.json'],
        },
      },
    },
    // Enable source maps for debugging (disable in production if needed)
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
