// build: 2026-08-19
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': { target: 'http://127.0.0.1:3001', changeOrigin: true },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Vite docs: WSL2 misses Windows-side edits unless usePolling is on.
      watch: process.env.DISABLE_HMR === 'true'
        ? null
        : process.env.WSL_DISTRO_NAME
          ? { usePolling: true, interval: 300 }
          : {},
    },
    preview: {
      proxy: {
        '/api': { target: 'http://127.0.0.1:3001', changeOrigin: true },
      },
    },
  };
});
