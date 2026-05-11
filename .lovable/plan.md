# Lighter Mode — AISTUDIYO Simplification Pass

Strip visual weight without touching functionality. Same product, calmer surface — Notion AI / Linear / Arc territory.

## Global polish (`src/index.css`)

```text
--shadow-card        → softer, 1 layer
--shadow-elevated    → halved blur + opacity
--shadow-glow        → cut intensity ~50%
.edge-glow::before   → opacity 0.10 → 0.05
.btn-premium         → flat surface, soft 1px ring + small shadow
                       (drop heavy gradient pillow)
border tokens        → from /40 → /30 default
```

Add two new tokens:
- `--surface-1` (cards) — `bg-card` with slightly higher contrast than today so we can remove most borders
- `--ring-soft` — `hsl(var(--primary) / 0.18)` for focus + hover ring

## Sidebar (`src/components/DashboardLayout.tsx`)

Collapse the 5 groups into **8 flat items** per spec:

```text
Home          → /dashboard
Create        → /dashboard/generator     (subitems moved to in-page tabs)
Agents        → /dashboard/agents
Content Packs → /dashboard/media         (renamed from "Media Library")
Calendar      → /dashboard/calendar
Trends        → /dashboard/trends
Analytics     → /dashboard/analytics
Settings      → /dashboard/settings
```

- Remove `Automate > Workflows`, `Plan > Branding CRM`, `Create > Templates/Image Studio/Design Studio` from the sidebar (still reachable in-page from Create).
- Drop the `ChevronDown` group expansion entirely — flat list, no nested children.
- Active state: `bg-primary/8` + `text-primary` (lighter than current `/10`).
- Reduce row padding `py-2.5 → py-2`, icon size `w-4.5 → w-4`.
- Header brand text shrinks to one line, drop the gradient on the word "STUDIYO" (keep it on the welcome heading instead).

## Dashboard home (`src/pages/DashboardHome.tsx`)

Order per spec (7 sections, in this order, all else removed):

```text
1. WelcomeHeader
2. QuickCreateBar
3. WhatsNewCarousel
4. AISuggestions
5. RecentContentPacks   (new — replaces "Recent generations" image grid)
6. AgentsStrip          (new — compact 4-tile strip)
7. TrendingIdeasStrip
```

Remove:
- `CoreActionCards` (redundant with Quick Create + sidebar)
- Old "Recent generations" 6-image grid (replaced by Content Packs)

## Component-level slimming

**`WelcomeHeader`**
- Drop gradient on name; use plain `text-foreground` + `text-primary` accent only on the rotating subtitle.
- Heading: `text-2xl md:text-3xl` → `text-xl md:text-2xl`. Margin-bottom 6 → 5.

**`QuickCreateBar`**
- Remove both blurred gradient blobs (top-right + bottom-left).
- Card padding `p-6 md:p-8` → `p-4 md:p-5`.
- Input row: keep soft border + focus ring, drop `shadow-card`.
- Submit button: switch from `bg-gradient-hero + shadow-glow` to `bg-primary text-primary-foreground` with subtle hover.
- Chips become single line, horizontal scroll on mobile.
- Drop the "AI Quick Create" badge — replace with a small `Sparkles` icon inside the input.

**`WhatsNewCarousel`**
- Card width 280–340px → **240px**, height 32 → **24** for the gradient header band.
- Drop the white radial highlight overlay and bottom-right blur orb (keep just the gradient).
- Tighten gap 12 → 10, label tracking `widest` → `wider`.

**`AISuggestions`**
- Merge into a single 2-up grid card with consistent padding `p-5` (already close).
- Drop the heavy `bg-secondary` icon backplate on hover; use `bg-primary/8`.

**New `RecentContentPacks`** (`src/components/dashboard/RecentContentPacks.tsx`)
- Queries `generations` table same as before, but renders 3 horizontally-grouped "pack" rows:
  - Pack thumbnail (image), title (truncated prompt), pill row of available outputs (Caption, Hooks, CTA, Hashtags), and a quick-action menu (Copy / Edit / Regenerate / Save).
- Compact list, no large card frames. Each row `h-16` with `hover:bg-secondary/40`.

**New `AgentsStrip`** (`src/components/dashboard/AgentsStrip.tsx`)
- 4 simplified tiles using creator-friendly names per spec:
  - "Grow Instagram", "Write LinkedIn Post", "Find Trends", "Repurpose Content"
- Each tile: small icon, label, one-line outcome (e.g. "Daily, hands-free"), single `Run` button.
- Removes the AgentBuilder / workflow jargon from the dashboard surface; the full Agents page stays available at `/dashboard/agents`.

**`TrendingIdeasStrip`** — no logic change, just confirm spacing/padding aligns with new compact density (read pass only; minor `py` trims if needed).

## Animation system

Reduce framer-motion intensity across dashboard components:
- All `initial.y: 10` → `y: 4`
- Durations `0.35–0.4s` → `0.25s`
- Drop the `motion.section` wrapper on sections that don't visibly need entrance animation (e.g. the trending strip after scroll).
- Hover lifts kept at `-translate-y-0.5`; remove any `-translate-y-1`.

## What does NOT change

- Routes, auth, Supabase queries, edge functions
- Landing page (cinematic story scroll stays as-is)
- Theme switcher + theme tokens (Orange Blaze still default)
- Brand orange primary, multi-color scene accents from previous pass
- AIGenerator content-pack output blocks (already modular — separate task if user wants per-block UI changes)

## Out-of-scope notes (for a follow-up)

The user mentioned **Content Pack output blocks** (Hooks/Caption/CTA/Hashtags/Carousel/Reel Script with Regenerate/Copy/Edit/Save). Those already exist as `src/components/generator/*.tsx`. If the user wants those visually slimmed too, that's a separate pass — flag in the closing message rather than expanding this one.
