# Implementation Plan — Personal Recipe Site

_Companion to [website-brief.md](website-brief.md). Each phase ends in something you can open and check._

> **Status (2026-11-20):** Phases 0–5 built locally, plus the local half of Phase 6 (`/admin` works with "Work with Local Repository"). Not done: GitHub repo + auth Worker (Phase 6), deploy (Phase 7), real recipes and photos (Phase 8). The site uses Astro 7. The admin page is an Astro route (`src/pages/admin/index.astro`) because the dev server doesn't serve `public/admin/index.html`.

## Stack (decided)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro** (static output) + TypeScript | Content-first, ships almost no JS, built-in content collections for Markdown recipes |
| Styling | Plain CSS with custom properties (tokens from the brief) | Small site, tokens map directly; no Tailwind needed |
| Interactivity | Small vanilla TS scripts / Astro islands | Scaler, checklists, cook mode, search are each < 100 lines |
| Content | One Markdown file per recipe in `src/content/recipes/`, photos in `src/assets/recipes/` | Plain files, versioned in git |
| CMS | **Sveltia CMS** at `/admin` (Decap-compatible config), GitHub backend | Browser editing, free, no database; saves commits to the repo |
| Hosting | **Cloudflare Pages** (auto-deploy on push) + Sveltia's auth Worker for GitHub login | Free, fast; alternative: Netlify with the same CMS |
| Fonts | Holtwood One SC + Google Sans via Google Fonts (or self-hosted with `@fontsource` if available) | |
| Icons | Lucide (only the ~6 icons needed, inlined SVG) | |

Prerequisites: Node LTS, a GitHub account/repo, a Cloudflare account.

---

## Phase 0: Scaffolding

1. `npm create astro@latest` (minimal template, TypeScript strict) in this folder; `git init`; push to a new private GitHub repo.
2. Folder structure:
   ```
   src/
     content/recipes/        # *.md, one per recipe
     content.config.ts       # recipe schema (zod)
     assets/recipes/         # photos
     styles/tokens.css       # colours, type, spacing
     styles/global.css
     layouts/Base.astro      # html shell, fonts, header/footer
     components/             # Header, Footer, RecipeTile, Placeholder, Chips, Search, MetaStrip, Scaler, IngredientList, StepList, CookMode, Notes
     scripts/                # scaler.ts, checklist.ts, cookmode.ts, filter.ts, fractions.ts
     pages/index.astro
     pages/recipes/[slug].astro
     pages/404.astro
   public/admin/             # Sveltia CMS index.html + config.yml
   public/robots.txt
   ```
3. Add `noindex` meta in `Base.astro`, `robots.txt` disallow all.
4. Prettier + `astro check` scripts.

**Done when:** `npm run dev` serves a blank page with the shell; repo on GitHub.

## Phase 1: Design tokens and base layout

1. `tokens.css`: colour tokens, fluid type scale (`clamp()`), spacing scale, breakpoints (600 / 1024).
2. Load Holtwood One SC and Google Sans; set `font-display: swap`; check Holtwood's wide glyphs at 40px on a 375px screen (adjust `display` min size if "RECIPES" or long titles overflow; allow titles to wrap).
3. `Base.astro` with **Header band** (aubergine, site name in Holtwood lime, search icon) and **Footer band**; page background set per page (`lime` / `paper`).
4. Focus ring, reduced-motion rule, base typography.
5. A temporary `/styleguide` page showing colours, type scale, chips, buttons for visual review (delete or `noindex` later).

**Done when:** styleguide page matches the brief on phone and desktop.

## Phase 2: Content model and sample data

1. Define the recipe collection schema in `content.config.ts` exactly as brief §5 (zod: `quantity` as string, validated as number/fraction/mixed fraction or empty; `tagline` max 70; `category` enum `savory | sweet | drink`).
2. Write 2–3 **dummy recipes** (one with ingredient groups, one with no photo, one with notes) to build against. Replace with the real 6 later.
3. Utility `fractions.ts`: parse `"1 1/2"` → 1.5, format 0.333 → "⅓", round to sensible kitchen fractions (⅛ steps), leave unparseable quantities untouched.
4. Unit tests (Vitest) for `fractions.ts` and the scaling rule.

**Done when:** `astro check` passes and tests are green.

## Phase 3: Home: grid, search, filters

1. **Title block**: "RECIPES" display + count.
2. **RecipeTile** component: 1:1 image via `astro:assets` `<Image>` (responsive `srcset`, AVIF/WebP, lazy below the fold), title, tagline, meta row (total time · category).
3. **Placeholder** component: coloured field cycling aubergine / lime-soft / aubergine-80 with oversized cropped Holtwood initial; used when `photo` is empty (tile and hero variants).
4. Grid CSS: edge-to-edge, 1/2/3 columns, 1px hairline dividers (use `gap: 1px` over a `--line` background, or borders).
5. **Category chips** + **search field**: render all tiles at build time with `data-category` and `data-search` (title + tagline + ingredient names, lower-cased); `filter.ts` toggles visibility; sync to URL (`?c=&q=`) and restore on load; empty state.
6. Sort newest first by `date`; exclude `draft: true`.

**Done when:** filtering + searching work together, URLs are bookmarkable, no-photo recipes look intentional.

## Phase 4: Recipe page

1. `[slug].astro` with `getStaticPaths` from the collection.
2. **Hero** (full-bleed, 4:3 mobile / 16:9 desktop, or placeholder at 30vh).
3. **Title + tagline**, **Meta strip** (Prep · Cook · Total · Serves), category chip linking to `/?c=<category>`.
4. **IngredientList** (groups, quantity bold, unit, name, muted note) and **StepList** (Holtwood numbers in aubergine squares).
5. Two-column layout ≥ 1024px with sticky ingredients column; stacked on mobile with "Jump to method".
6. **Notes** box (only if present).
7. Prev/next recipe tiles + "All recipes" link.

**Done when:** every dummy recipe renders correctly at 375px, 768px, 1280px.

## Phase 5: Cooking features

1. **Servings scaler** (`scaler.ts`): stepper − / + (min 1), multiplies each parseable quantity by `new / base`, re-renders with `fractions.ts`; unscaled items unchanged; "Reset" when changed. Quantities rendered with `data-qty` so the script only touches numbers.
2. **Checklists** (`checklist.ts`): real checkboxes on ingredients and steps; checked styling (strike-through + lime-soft); persist in `localStorage` keyed by slug (wrapped in try/catch); "Clear ticks".
3. **Cook mode** (`cookmode.ts`): toggle adds `.cook-mode` to `<body>` (hide hero/header, larger `cook` step text, more spacing); request **Screen Wake Lock** (`navigator.wakeLock.request('screen')`), re-acquire on `visibilitychange`, release on toggle off. If unsupported, mode still works and a small note says the screen may still sleep.
4. Keyboard and screen-reader pass on all three (labels, `aria-pressed` on toggle, `aria-live` on servings count).

**Done when:** on a real phone, you can scale, tick, and cook a recipe start to finish with the screen staying on.

## Phase 6: CMS (`/admin`)

1. Add `public/admin/index.html` loading Sveltia CMS and `public/admin/config.yml`:
   - backend: `github`, repo, branch `main`, `base_url` → the auth Worker.
   - `media_folder: src/assets/recipes`, `public_folder` matching Astro's relative image imports.
   - Collection `recipes` → folder `src/content/recipes`, slug `{{slug}}`, fields mirroring the schema (list widget for ingredient groups → items with quantity/unit/name/note; list of strings for steps; select for category; boolean draft; image with alt text).
2. Deploy the Sveltia CMS auth Worker on Cloudflare; create a GitHub OAuth app pointing to it.
3. Test: create, edit, upload photo, toggle draft, delete. Confirm commits land in the repo and the schema validates (a bad entry should fail the build, not the live site).

**Done when:** a recipe added from a phone browser appears on the live site after the rebuild.

## Phase 7: Deploy

1. Connect the GitHub repo to Cloudflare Pages (build `npm run build`, output `dist`).
2. Optional custom domain.
3. Verify `noindex`, `robots.txt`, 404 page, and that `/admin` requires GitHub login.

## Phase 8: Real content and polish

1. Enter the **6 real recipes** through `/admin`; write the one-line taglines.
2. Check every recipe fits Savory / Sweet / Drink; extend the enum + chips only if one clearly doesn't.
3. Add photos as they come; check crops on tiles (1:1) and hero.
4. Print stylesheet (brief §6).
5. Final QA checklist:
   - Lighthouse ≥ 95 performance/accessibility on mobile.
   - Contrast check of every colour pair in use.
   - Long title + long ingredient name + no-photo + no-times edge cases.
   - Tested on iOS Safari and Android Chrome (Wake Lock, sticky header, chips scroll).
6. Remove dummy recipes and the `/styleguide` page.

---

## Suggested build order for sessions

| Session | Phases | Output |
|---|---|---|
| 1 | 0 + 1 | Repo, tokens, shell, styleguide |
| 2 | 2 + 3 | Schema, dummy data, working home grid |
| 3 | 4 + 5 | Full recipe page with scaler, checklists, cook mode |
| 4 | 6 + 7 | CMS live, site deployed |
| 5 | 8 | Real recipes, photos, polish |

## Risks and notes

- **Holtwood One SC is very wide and heavy.** Long recipe titles on mobile will wrap to 3–4 lines; plan for it (smaller `display` min, `text-wrap: balance`).
- **Google Sans on Google Fonts:** confirm the family name/availability when scaffolding; fallback is a close grotesk (e.g. Inter) if it isn't loadable.
- **Mixed units:** the scaler only multiplies the number; "1 packet" → "2 packet" reads oddly. Accept for now, or write units in a form that scales ("packets" handled by simple plural rule later).
- **CMS auth** is the only part with external setup (GitHub OAuth app + Worker). If it becomes a hassle, Sveltia can also edit a local clone directly in the browser as a stop-gap.
