import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // No need for historyApiFallback in Vite; Vite handles SPA fallback by default.
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
