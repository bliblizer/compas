import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { courantSchema } from './lib/schemas';

const courants = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/courants' }),
  schema: courantSchema,
});

export const collections = { courants };
