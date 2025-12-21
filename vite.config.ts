import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
  },
  define: {
    // This bakes the environment variables into the bundle at build time
    'import.meta.env.VITE_SUPA_URL': JSON.stringify(process.env.VITE_SUPA_URL),
    'import.meta.env.VITE_SUPA_KEY': JSON.stringify(process.env.VITE_SUPA_KEY),
  }
});