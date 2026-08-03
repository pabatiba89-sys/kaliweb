import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { DEFAULT_SITE_URL } from './src/site/site-config.js';

const site = process.env.SITE_URL || DEFAULT_SITE_URL;

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
