import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@intelligence': path.resolve(__dirname, '../Intelligence'),
    },
  },
  server: {
    port: 5173,
    host: true,
    fs: {
      allow: ['..'],
    },
  },
});

