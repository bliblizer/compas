// @ts-check
import { defineConfig } from 'astro/config';

// Site publié sur GitHub Pages : https://bliblizer.github.io/compas/
export default defineConfig({
  site: 'https://bliblizer.github.io',
  base: '/compas',
  trailingSlash: 'always',
});
