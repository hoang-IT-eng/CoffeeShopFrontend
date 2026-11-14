import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mockApiPlugin } from './scripts/mock-api-plugin.js';

export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  server: {
    port: 5173,
    proxy: process.env.VITE_MOCK_API === '1'
      ? undefined
      : {
          '/api': {
            target: 'http://localhost:5160',
            changeOrigin: true
          }
        }
  }
});
