import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig(() => {
  return {
    plugins: [
      react({
        // babel transform for better tree-shaking of motion
        babel: {
          plugins: [],
        },
      }),
      tailwindcss(),
      compression({ algorithm: 'brotliCompress', ext: '.br', threshold: 512 }),
      compression({ algorithm: 'gzip', ext: '.gz', threshold: 512 }),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
    build: {
      chunkSizeWarningLimit: 200,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // React core — load immediately
            if (id.includes('node_modules/react/') && !id.includes('react-dom')) return 'react';
            if (id.includes('node_modules/react-dom')) return 'react-dom';
            // Motion — large, split out; only executed when lazy sections mount
            if (id.includes('node_modules/motion')) return 'motion';
            // Lucide — tree-shaken; separate chunk for long-term caching
            if (id.includes('node_modules/lucide-react')) return 'lucide';
            // Keep Contact (largest component with AI chat) in its own chunk
            if (id.includes('src/components/Contact')) return 'contact';
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
      },
      minify: 'esbuild',
      cssMinify: 'esbuild',
      // Inline only tiny assets (< 1KB) to avoid HTTP round-trips
      assetsInlineLimit: 1024,
      target: 'es2020',
      sourcemap: false,
      cssCodeSplit: true,
      reportCompressedSize: false,
      // Disable modulePreload polyfill — reduces initial JS
      modulePreload: { polyfill: false },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['motion'],
    },
  };
});
