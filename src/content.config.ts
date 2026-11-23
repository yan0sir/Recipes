import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const CATEGORIES = ['savory', 'sweet', 'drink'] as const;

// The editor saves empty optional fields as '' or null. Treat both as "not set".
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const optText = z.preprocess(blank, z.string().optional().default(''));
const optMinutes = z.preprocess(blank, z.number().int().nonnegative().optional());

const quantity = z
  .union([z.string(), z.number()])
  .nullable()
  .optional()
  .transform((v) => (v === undefined || v === null ? '' : String(v).trim()));

const ingredient = z.object({
  quantity,
  unit: optText,
  name: z.string().min(1),
  note: optText,
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      tagline: z.string().max(70),
      category: z.enum(CATEGORIES),
      photo: z.preprocess(blank, image().optional()),
      photoAlt: optText,
      sourceUrl: z.preprocess(blank, z.url().optional()),
      sourceLabel: optText,
      prepMinutes: optMinutes,
      restMinutes: optMinutes,
      cookMinutes: optMinutes,
      servings: z.number().int().positive(),
      ingredientGroups: z
        .array(
          z.object({
            heading: optText,
            items: z.array(ingredient).min(1),
          }),
        )
        .min(1),
      steps: z.preprocess(
        (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()) : blank(v)),
        z.array(z.string()).optional().default([]),
      ),
      restNotes: optText,
      cookNotes: optText,
      notes: optText,
      date: z.coerce.date(),
      draft: z.preprocess(blank, z.boolean().optional().default(false)),
    }),
});

export const collections = { recipes };
