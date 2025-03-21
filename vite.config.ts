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
      jsxImportSource: 'react',
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
        passes: 2
      },
      mangle: {
        keep_classnames: false,
        keep_fnames: false,
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          
          // UI components
          if (id.includes('@radix-ui/react-')) {
            return 'ui-components';
          }
          
          // Animation
          if (id.includes('framer-motion')) {
            return 'animation';
          }
          
          // Data management
          if (id.includes('@tanstack/react-query')) {
            return 'data-management';
          }
          
          // Group app components by features
          if (id.includes('/src/components/home') ||
              id.includes('/src/components/layout/Banner') ||
              id.includes('/src/components/layout/NotificationBar')) {
            return 'landing-components';
          }
          
          if (id.includes('/src/components/mobile') ||
              id.includes('/src/components/internet') ||
              id.includes('/src/components/phones')) {
            return 'product-components';
          }
          
          if (id.includes('/src/components/blog')) {
            return 'blog-components';
          }
          
          if (id.includes('/src/utils') ||
              id.includes('/src/lib')) {
            return 'utils';
          }
          
          // Keep other modules separate
          return null;
        }
      }
    },
    assetsInlineLimit: 4096, 
    sourcemap: mode !== 'production',
    cssCodeSplit: true,
    manifest: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', '@tanstack/react-query'],
    exclude: ['@vercel/analytics']
  },
  esbuild: {
    jsxInject: "import React from 'react'",
    jsx: 'automatic',
    legalComments: 'none',
    treeShaking: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    devSourcemap: true,
  },
}));
