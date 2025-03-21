
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
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
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
        }
      }
    }
  },
}));
