import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': "https://multilevelexambackend-production.up.railway.app"
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
