/* import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
 */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'window.__VITE_ENV__': {
        VITE_API_URL: env.VITE_API_URL,
        VITE_IMGBB_API_KEY: env.VITE_IMGBB_API_KEY,
      },
    },
  };
});
