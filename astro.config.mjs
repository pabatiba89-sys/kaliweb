import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const site = process.env.SITE_URL || 'https://kali.xyaip.fun';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://yixiuapi.xyaip.fun',
          changeOrigin: true,
          secure: true,
        },
        '/login': {
          target: 'https://yixiuapi.xyaip.fun',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  },
});
