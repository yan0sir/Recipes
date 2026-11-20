# Website Brief — Personal Recipe Site

_Ideation output, 2026-11-20. Reference: [potluckmarket.com/blogs/recipes](https://potluckmarket.com/blogs/recipes)._

---

## 1. Purpose

A personal recipe book on the web. Its single job is to make **finding a recipe and cooking it** fast and pleasant, on a phone propped up in the kitchen as much as on a laptop.

**What it is**
- A private-use collection (publicly reachable link, but made for one cook: me).
- Recipe-first: open a page → see what you need → cook.
- Easy to grow: new recipes and photos added from the browser, no code.

**What it is not**
- Not a food blog. No backstory, no life story, no history of the dish.
- No marketing: no contact page, no newsletter, no email capture, no social links, no ads, no shop, no comments.

**Success looks like**
1. From the homepage to the ingredient list of any recipe in ≤ 2 taps.
2. Every recipe is cookable on a phone without zooming or the screen going dark.
3. Adding a new recipe (text + photo) takes < 5 minutes through `/admin`.
4. Looks like a confident, graphic, colour-blocked site, not a template.

**Starting content:** 6 recipes (added later), photos added later. The site must look intentional with **no photos yet**.

---

## 2. What we take from the reference (and what we drop)

| Potluck element | Our version |
|---|---|
| Flat solid colour bands (acid-yellow header/footer, green listing background, white recipe page) | Same structure, own palette: **aubergine** band, **lime** listing, **off-white** recipe page |
| Edge-to-edge 3-column grid of **square** photos with thin divider lines | Kept. Square tiles, hairline dividers, title + one-liner beneath |
| Huge single-weight headline (~76px, tight tracking) | Kept, set in **Inter Tight** |
| One-line playful tagline per recipe ("A little dark, a little stormy.") | Kept. One line, max ~70 characters. Replaces any intro story |
| Full-bleed hero photo on recipe page, then narrow centred text column | Kept |
| Simple ingredient bullets + numbered directions | Kept, upgraded with checklists, scaler, cook mode |
| Nav: Shop / Find us / About, cart, login, search icon | Dropped. Only the site name + search |
| Byline, first-person intro paragraph | Dropped. Optional short "Notes" box at the end instead |
| Newsletter band, footer link columns, socials, comments form | Dropped |
| Numbered pagination | Dropped for now; one grid with filters (pagination only past ~60 recipes) |

---

## 3. Design system

### 3.1 Colour

Flat colours only: no gradients, no shadows. Colour marks *where you are*: the aubergine band is the chrome, lime means "browsing", off-white means "cooking".

| Token | Hex | Use |
|---|---|---|
| `--aubergine` | `#3B1F3A` | Header/footer band, primary text on lime, buttons |
| `--aubergine-80` | `#5A3A58` | Hover/pressed on aubergine surfaces |
| `--lime` | `#C8E64A` | Listing page background, active filter chip, accents on recipe page |
| `--lime-soft` | `#E4F3A6` | Checked-off row tint, placeholder tile fill (alt) |
| `--paper` | `#FBF9F3` | Recipe page background, card text area |
| `--ink` | `#1C1220` | Body text on paper |
| `--ink-muted` | `#6B5E6A` | Meta labels, secondary text |
| `--line` | `rgba(59,31,58,0.25)` | Hairline grid dividers, rules |

Contrast pairs to use: aubergine on lime, lime on aubergine, ink on paper, paper on aubergine (all well above WCAG AA). **Never** lime text on paper.

### 3.2 Typography

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Inter Tight** (variable, self-hosted via Fontsource) | Neutral grotesk, SemiBold 600, tight tracking (−0.04em on the display size, −0.02em on smaller headings). Page title, recipe title, section labels, step numbers |
| Body / UI | **Google Sans** (Google Fonts) | Ingredients, steps, meta, chips, buttons. Regular 400 + Medium 500 |

Type scale (fluid with `clamp()`):

| Token | Mobile → Desktop | Use |
|---|---|---|
| `display` | 40 → 76px, line-height 1.0 | "Recipes" page title, recipe title |
| `h2` | 22 → 28px | "Ingredients", "Method", "Notes" |
| `card-title` | 18 → 22px (Inter Tight) | Tile title |
| `body` | 17 → 18px, line-height 1.55 | Steps, ingredients |
| `cook` | 22 → 26px | Step text in cook mode |
| `small` | 14px | Meta labels, taglines, chips |

Headings use Inter Tight; everything you read while cooking (ingredients, steps) uses Google Sans.

### 3.3 Spacing, layout, shape

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 px.
- Max reading column on recipe page: **680px**, centred.
- Grid: edge-to-edge, 1 col (< 600px), 2 cols (600–1023px), 3 cols (≥ 1024px). 1px `--line` dividers between tiles, no gaps.
- Corners: **square** everywhere (0 radius), matching the reference. Exception: chips and buttons get full pill radius.
- Borders: hairlines only (1px). No shadows.
- Photos: tiles are 1:1; recipe hero is full-bleed, 16:9 on desktop, 4:3 on mobile, `object-fit: cover`.

### 3.4 Photo placeholders (until photos exist)

Each recipe without a photo gets a generated tile: solid colour field (alternating aubergine / lime-soft / aubergine-80) with the recipe's **initial or a short word in Inter Tight**, large and cropped off the edge. Looks deliberate, not "missing image". Same treatment for the recipe hero (shorter height, 30vh).

### 3.5 Motion

Minimal: 150ms colour/opacity transitions on hover and check-off; tile image subtle scale (1.03) on hover on desktop only. Respect `prefers-reduced-motion`.

### 3.6 Iconography

Line icons, 1.5px stroke, ink/aubergine (e.g. Lucide): search, clock, users, minus/plus, flame (cook mode), x (clear). No decorative illustrations.

### 3.7 Components

| Component | Description |
|---|---|
| **Header band** | Aubergine, ~56px. Left: site name in Inter Tight (lime). Right: search icon (opens search). Sticky on recipe page. |
| **Footer band** | Aubergine, thin. Site name + year only. |
| **Filter chips** | Pills, aubergine outline on lime; active = solid aubergine with lime text. "All" first. Horizontally scrollable on mobile. |
| **Search field** | Full-width in the lime area under the title; filters the grid instantly as you type (titles, taglines, ingredients). Clear (x) button. |
| **Recipe tile** | Square photo/placeholder → title (Inter Tight) → one-line tagline (Google Sans, small) → tiny meta row (total time · category). Whole tile is a link. |
| **Meta strip** | Row of 3–4 items: Prep · Cook · Total · Serves. Label small/muted, value medium. Separated by hairlines. |
| **Servings scaler** | `–  4 servings  +` stepper. Recomputes numeric ingredient quantities live; shows fractions (½, ⅓, ¼, ¾). "Reset" when changed. |
| **Ingredient row** | Checkbox + quantity (bold) + unit + item + note in muted ("diced"). Tap row to check; checked = struck through, `--lime-soft` tint. Optional group headings ("For the sauce"). |
| **Step row** | Big step number (Inter Tight, lime-on-aubergine square) + text. Tap to mark done (dims). |
| **Cook-mode toggle** | Pill button "Cook mode". On: keeps screen awake, enlarges step text, hides hero and header. Off restores. |
| **Notes box** | Optional, paper with lime left rule. Short tips/substitutions only. |
| **Empty state** | When search/filter returns nothing: "Nothing here. Try another word." + clear button. |

---

## 4. Site map and pages

```
/                    Home = recipe grid (search + category filters)
/recipes/[slug]      Recipe page
/admin               CMS (login-protected, not linked from the site)
/404                 Not found
```

No About, no Contact, no tag pages.

### 4.1 Home: the recipe grid (lime)

1. **Header band** (aubergine).
2. **Title block** (lime): "RECIPES" in display size, left-aligned, with a recipe count beside it in small text ("6 recipes").
3. **Search field** + **category chips** row: All · Savory · Sweet · Drink. More categories can be added later (keep ≤ 7).
4. **Grid** of square tiles, newest first. Filter + search combine (AND). URL reflects state (`?c=savory&q=tofu`) so a filtered view can be bookmarked.
5. **Footer band**.

### 4.2 Recipe page (paper)

Order, top to bottom:
1. Header band (sticky).
2. **Hero**: full-bleed photo or placeholder.
3. **Title** (display, Inter Tight) + **tagline** (one line).
4. **Meta strip**: Prep · Cook · Total · Serves (Serves is the scaler). Category chip linking back to the filtered grid.
5. **Cook-mode** toggle.
6. **Ingredients**: grouped list with checkboxes; scaler acts on these.
7. **Method**: numbered steps with tap-to-complete.
8. **Notes** (optional).
9. **Back to all recipes** link, with prev/next recipe tiles (2 small tiles).
10. Footer band.

On desktop ≥ 1024px: ingredients sit in a sticky left column (≈ 1/3) beside the method (≈ 2/3), so both are visible while cooking. On mobile they stack, with a small "Jump to method" link under the ingredients heading.

Checklist state persists per recipe in the browser (survives a reload mid-cook), with a "Clear ticks" link.

### 4.3 404

Lime page, display text "NOT ON THE MENU", link back to grid.

### 4.4 Admin (`/admin`)

Browser-based editor (git-based CMS). Form fields map 1:1 to the content model below. Photo upload goes straight into the repo. Saving publishes automatically (site rebuilds in ~1 minute).

---

## 5. Content model (one recipe)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text | yes | |
| `slug` | text | auto | From title |
| `tagline` | text, ≤ 70 chars | yes | The one-liner; replaces any intro story |
| `category` | single select | yes | `savory` · `sweet` · `drink` |
| `photo` | image | no | Placeholder used if empty |
| `prepMinutes` | number | no | |
| `cookMinutes` | number | no | Total = prep + cook |
| `servings` | number | yes | Base for the scaler |
| `ingredientGroups` | list of `{ heading?, items[] }` | yes | One unnamed group is fine |
| ↳ `item.quantity` | text | no | Number or fraction: `2`, `1/2`, `1 1/2`. Blank = not scaled ("salt to taste") |
| ↳ `item.unit` | text | no | Free text, **mixed units as written** (g, cup, tbsp, packet, can…). No conversion |
| ↳ `item.name` | text | yes | "potato" |
| ↳ `item.note` | text | no | "diced", "optional" |
| `steps` | list of text | yes | One step per entry, short |
| `notes` | long text | no | Tips, substitutions, storage |
| `date` | date | auto | Sort order on the grid |
| `draft` | boolean | no | Hide from site while drafting |

---

## 6. Non-functional requirements

- **Mobile-first.** Kitchen use on a phone is the primary scenario.
- **Fast:** static pages, no client framework required beyond small interactive islands; images served responsive (WebP/AVIF, `srcset`), lazy-loaded below the fold.
- **Accessible:** WCAG AA contrast, keyboard-usable chips/checkboxes/stepper, real `<input type="checkbox">`s, visible focus ring (lime on aubergine / aubergine on paper), semantic headings, `alt` text field on photos.
- **Printable:** print stylesheet: hide header, hero, chips, toggles; ingredients + method on one page in black on white.
- **Not indexed:** `noindex` meta + `robots.txt` disallow (personal site, public link only).
- **Free to run:** static hosting free tier, no database.

---

## 7. Out of scope (for now)

Contact, newsletter, About, comments, ratings, social sharing, user accounts, unit conversion, nutrition info, shopping lists, multi-language, pagination.

## 8. Open items

- None. Site name: **Ray's Recipes**. Lime `#C8E64A` approved.
