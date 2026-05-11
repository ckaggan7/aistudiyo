## Goal
Tighten dashboard density and visual consistency by standardizing **padding, gaps, header rhythm, and inner item padding** across every bento tile. No layout/grid restructure, no copy or color changes.

## Spacing system (single source of truth)

| Token              | Old (mixed)            | New (standard) |
|--------------------|------------------------|----------------|
| Grid gap           | `gap-4` (16)           | `gap-3 lg:gap-4` (12 / 16) |
| Card padding       | 24 (`p-6` / 1.5rem)    | `p-5` (20px) — `p-6` only at `lg` for hero |
| Hero padding       | `p-6 md:p-10`          | `p-6 md:p-8`   |
| Header→content     | `mb-5` (mixed)         | `mb-4` (16px)  |
| Inner item padding | `p-3` / `p-3.5` / `p-4`/ `p-5` | `p-3` (12px) for list rows, `p-4` (16px) for feature tiles |
| Inner gap (lists)  | `gap-2 / 2.5 / 3`      | `gap-2`        |
| Inner gap (grids)  | `gap-3`                | `gap-3` (kept) |

## Files

**`src/index.css`** — tighten the bento shell:
- `.card-bento { padding: 1.25rem; }` (was 1.5rem). Keeps 28px radius and shadow.
- `.card-bento-accent`, `.card-bento-dark` → `padding: 1.25rem`.
- `.bento-hero` → `padding: 1.5rem` default; override on hero stays `!p-6 md:!p-8`.

**`src/pages/DashboardHome.tsx`** — grid gap only:
- `gap-4` → `gap-3 lg:gap-4`.

**Each tile (`src/components/dashboard/*.tsx`)** — apply the rhythm:
- `WelcomeHeader.tsx` — outer `!p-6 md:!p-8`; stat-card inner `p-4` → `p-3`; section gap `gap-6 lg:gap-10` → `gap-6 lg:gap-8`.
- `QuickCreateBar.tsx` — header block `mb-3` → keep; chip row `mt-4` → `mt-3`; input row `py-2.5` → `py-2`.
- `AISuggestions.tsx` — header `mb-5` → `mb-4`; primary insight panel `h-[130px]` → `h-[120px]`, inner `p-4` → `p-3.5`; list item `px-2.5 py-2` → `px-2 py-1.5`.
- `AgentsStrip.tsx` — header `mb-5` → `mb-4`; tile `p-4` → `p-3.5`; icon box `w-10 h-10` → `w-9 h-9`.
- `TrendingNowFeed.tsx` — header `mb-5` → `mb-4`; row `p-3.5` → `p-3`; inner gap `gap-2.5` → `gap-2`.
- `WhatsNewCarousel.tsx` — header `mb-5` → `mb-4`; tile `p-5` → `p-4`; carousel `gap-4` → `gap-3`.
- `TrendingSocialDates.tsx` — header `mb-5` → `mb-4`; row tile `p-4` → `p-3.5`, width `w-[220px]` → `w-[200px]`.
- `RecentContentPacks.tsx` — header `mb-5` → `mb-4`; row `p-3` → keep; list `space-y-2` → keep.
- `CreatorMomentum.tsx` — match header `mb-4`; tighten any inner `p-4` → `p-3.5`.
- `CalendarPreview.tsx` — header `mb-5` → `mb-4`; day cell `p-2` → keep; grid `gap-1.5` → keep.
- `CoreActionCards.tsx` — header `mb-5` → `mb-4`; row item `p-3` → keep; list `gap-2.5` → `gap-2`.

## Rules
- No new tokens, components, files, routes, or backend work.
- No copy / icon / color changes.
- Preserve all existing data wiring, motion, hover, and grid spans.
- Headers keep their existing icon + title + right-action pattern, only the bottom margin standardizes to `mb-4`.

## Acceptance
- All bento tiles share the same outer padding (`p-5`), same `mb-4` header rhythm, and same inner item padding bands (12 / 16px).
- Dashboard grid feels visibly tighter (less air, same hierarchy).
- Adjacent cards in the same row remain visually equal-height (already handled by `h-full`).
- Hero card still reads as the largest tile, only proportionally smaller padding.