import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    status: z.string(),
    tier: z.enum(['featured', 'client', 'other']),
    order: z.number(),
    oneLiner: z.string(),
    stack: z.array(z.string()),
    links: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })).default([]),
  }),
});

export const collections = { projects };
