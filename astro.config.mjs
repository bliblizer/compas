// @ts-check
import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import rehypeFiche from './src/lib/markdown/rehype-fiche.ts';

// Site publié sur GitHub Pages : https://bliblizer.github.io/compas/
export default defineConfig({
  site: 'https://bliblizer.github.io',
  base: '/compas',
  trailingSlash: 'always',
  markdown: {
    // Processeur unified (remark/rehype) pour le plugin de mise en forme des fiches.
    processor: unified({
      rehypePlugins: [rehypeFiche],
    }),
  },
});
