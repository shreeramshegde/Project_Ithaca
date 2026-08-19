import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
<<<<<<< HEAD
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3005',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:3005',
        changeOrigin: true,
      },
    },
=======
>>>>>>> b300d09cf164acd71c835e813985b4e7fdc08f74
  },
});
