import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    tech: z.array(z.string()),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    cover: z.string().optional(),
    role: z.string().optional(),
    period: z.string().optional(),
    location: z.string().optional(),
    status: z.string().optional(),
    nodes: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
