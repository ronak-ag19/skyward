import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server runs on 5173 (the default Nowik expects when reading a Vite config).
// On a production build we serve under the GitHub Pages subpath (/skyward/);
// locally the base stays '/' so dev and Nowik's localhost expectation are unaffected.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/skyward/' : '/',
  server: { port: 5173, host: true },
  preview: { port: 5173, host: true },
}));
