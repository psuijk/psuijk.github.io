// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { rehypeScreenshots } from './src/plugins/screenshots.mjs';

export default defineConfig({
  site: 'https://psuijk.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [rehypeScreenshots],
  },
});
