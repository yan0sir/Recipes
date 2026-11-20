# Ray's Recipes

Personal recipe site. Astro (static) + Sveltia CMS. See `website-brief.md` and `implementation-plan.md`.

## Run locally

```powershell
npm install
npm run dev
```

- Live: https://ray-recipes.vercel.app (auto-deploys from `main` on Vercel)
- Local site: http://localhost:4321
- Editor: http://localhost:4321/admin/ → **Work with Local Repository** → pick this folder (Chrome or Edge).

## Add a recipe

Use the editor, or add a Markdown file to `src/content/recipes/` (copy one of the samples). Photos go in `src/assets/recipes/`.
The three sample recipes are placeholders; delete them once your own are in.

## Other commands

```powershell
npm run build   # static site in dist/
npm run check   # type-check
npm test        # quantity/fraction tests
```
