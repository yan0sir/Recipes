import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const CATEGORIES = ['savory', 'sweet', 'drink'] as const;

const quantity = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === undefined || v === null ? '' : String(v).trim()));

const ingredient = z.object({
  quantity,
  unit: z.string().optional().default(''),
  name: z.string().min(1),
  note: z.string().optional().default(''),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      tagline: z.string().max(70),
      category: z.enum(CATEGORIES),
      photo: image().optional(),
      photoAlt: z.string().optional().default(''),
      prepMinutes: z.number().int().nonnegative().optional(),
      cookMinutes: z.number().int().nonnegative().optional(),
      servings: z.number().int().positive(),
      ingredientGroups: z
        .array(
          z.object({
            heading: z.string().optional().default(''),
            items: z.array(ingredient).min(1),
          }),
        )
        .min(1),
      steps: z.array(z.string().min(1)).min(1),
      notes: z.string().optional().default(''),
      date: z.coerce.date(),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = { recipes };
