import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // SWC options for better performance
      swcOptions: {
        jsc: {
          transform: {
            react: {
              // Optimize React runtime
              runtime: 'automatic',
              // Avoid creating unnecessary closures
              refresh: mode === 'development',
              // Avoid development-only code in production
              development: mode === 'development',
            }
          },
          // Enable minification even in development for truer preview
          minify: {
            compress: mode === 'production',
            mangle: mode === 'production'
          }
        }
      }
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Reduce bundle size warning threshold
    chunkSizeWarningLimit: 600,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Use terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
        passes: 2 // Extra optimization pass
      },
      mangle: {
        // Keep classnames in error stacks
        keep_classnames: false,
        // Keep function names in error stacks
        keep_fnames: false,
      },
      format: {
        // Remove comments
        comments: false
      }
    },
    rollupOptions: {
      output: {
        // Ensure assets are hashed for better caching
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Split chunks more aggressively
        manualChunks: {
          // Separate React libraries into their own chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separate UI components into their own chunk
          'ui-components': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-separator',
            '@radix-ui/react-toast',
          ],
          // Separate animation dependencies
          'animation': ['framer-motion'],
          // Separate search and state management features
          'data-management': ['@tanstack/react-query'],
          // Split components by feature area
          'landing-components': [
            '/src/components/home',
            '/src/components/layout/Banner.tsx',
            '/src/components/layout/NotificationBar.tsx',
          ],
          'product-components': [
            '/src/components/mobile',
            '/src/components/internet',
            '/src/components/phones',
          ],
          // Additional chunk for blog components
          'blog-components': [
            '/src/components/blog',
          ],
          // Additional chunk for utility functions
          'utils': [
            '/src/utils',
            '/src/lib',
          ],
        }
      }
    },
    // Inline small assets to reduce requests
    assetsInlineLimit: 4096, 
    // Only generate sourcemaps in development
    sourcemap: mode !== 'production',
    // Improve CSS handling
    cssCodeSplit: true,
    // Generate a manifest for asset management
    manifest: true,
  },
  optimizeDeps: {
    // Include common dependencies for faster dev startup
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', '@tanstack/react-query'],
    // Exclude packages that don't need optimization
    exclude: ['@vercel/analytics']
  },
  // Properly handle .jsx and .tsx files
  esbuild: {
    jsxInject: "import React from 'react'",
    // Use latest JSX transform for better performance
    jsx: 'automatic',
  },
  // Improve CSS handling
  css: {
    // Use PostCSS modules
    modules: {
      localsConvention: 'camelCase',
    },
    // Fix sourcemaps for CSS
    devSourcemap: true,
  },
}));
