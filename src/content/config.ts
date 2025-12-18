import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    external: z.boolean().default(false),
    externalUrl: z.string().optional(),
  }),
});

const talks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    eventType: z.enum(['conference', 'summit', 'webinar', 'meetup', 'workshop']),
    date: z.coerce.date(),
    location: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    slidesUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    blogUrl: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, talks };
