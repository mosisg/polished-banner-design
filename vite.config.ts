
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
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
          'animation': ['framer-motion'],
          'data-management': ['@tanstack/react-query'],
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
          'blog-components': [
            '/src/components/blog',
          ],
          'utils': [
            '/src/utils',
            '/src/lib',
          ],
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
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    devSourcemap: true,
  },
}));
