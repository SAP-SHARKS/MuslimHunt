import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_SUPA_URL': JSON.stringify('https://anzqsjvvguiqcenfdevh.supabase.co'),
      'import.meta.env.VITE_SUPA_KEY': JSON.stringify('sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs'),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    server: {
      port: 5173,
    },
  };
});