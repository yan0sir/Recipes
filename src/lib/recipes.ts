import { getCollection, type CollectionEntry } from 'astro:content';

export type Recipe = CollectionEntry<'recipes'>;

export const CATEGORY_LABELS: Record<Recipe['data']['category'], string> = {
  savory: 'Savory',
  sweet: 'Sweet',
  drink: 'Drink',
};

/** Published recipes, newest first. */
export async function getRecipes(): Promise<Recipe[]> {
  const all = await getCollection('recipes', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function totalMinutes(r: Recipe): number | undefined {
  const { prepMinutes, cookMinutes } = r.data;
  if (prepMinutes == null && cookMinutes == null) return undefined;
  return (prepMinutes ?? 0) + (cookMinutes ?? 0);
}

export function formatMinutes(min: number | undefined): string {
  if (min == null) return '–';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Friendly name for a source link: "TikTok", "YouTube", or the bare domain. */
export function sourceName(url: string, label?: string): string {
  if (label) return label;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const known: Record<string, string> = {
      'tiktok.com': 'TikTok',
      'vm.tiktok.com': 'TikTok',
      'instagram.com': 'Instagram',
      'youtube.com': 'YouTube',
      'youtu.be': 'YouTube',
      'pinterest.com': 'Pinterest',
    };
    return known[host] ?? host;
  } catch {
    return 'Original';
  }
}

/** Stable colour variant for placeholders, from the slug. */
export function placeholderVariant(slug: string): 0 | 1 | 2 {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (h % 3) as 0 | 1 | 2;
}
