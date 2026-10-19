import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      location: z.string(),
      year: z.number().int(),
      tagline: z.string(),
      summary: z.string(),
      category: z.string(),
      concept: z.string(),
      size: z.string(),
      order: z.number().int(),
      cover: image(),
      coverAlt: z.string(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number().int(),
      headline: z.string(),
      summary: z.string(),
      cover: image(),
      coverAlt: z.string(),
      features: z.array(
        z.object({
          title: z.string(),
          body: z.string(),
          image: image().optional(),
          imageAlt: z.string().optional(),
        }),
      ),
    }),
});

export const collections = { projects, services };
