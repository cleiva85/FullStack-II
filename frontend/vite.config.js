import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// npm run dev → http://localhost:5173
// Las llamadas a /api se reenvían al backend Node (carpeta ../backend, npm start, puerto 3000)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000' },
  },
});
