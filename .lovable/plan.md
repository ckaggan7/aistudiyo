## Goal

Reorganise `DashboardHome` into a clean, gap‑free bento that groups tiles by purpose and aligns row heights, so there are no awkward vertical gaps between tiles at the current viewport (1188px) and on smaller/larger screens.

## Problems in the current layout

`src/pages/DashboardHome.tsx` uses a 12‑col grid with `auto-rows-min` and mixes `row-span-2` (`TrendingNowFeed`) with neighbours that have very different intrinsic heights. This causes:

1. **Gap under `AISuggestions`** — `QuickCreateBar` (7 cols) is shorter than `AISuggestions` (5 cols) because the chips row is compact; on 1188px the row floats with empty space.
2. **Gap beside `TrendingNowFeed`** — it spans 2 rows (Agents + What's New), but `AgentsStrip` (2x2 agent grid) + `WhatsNewCarousel` together are taller than the trending feed, leaving whitespace at the bottom of the trending column.
3. **Bottom row misalignment** — `CreatorMomentum`, `CalendarPreview`, `CoreActionCards` each pick their own intrinsic height, so the row is jagged.
4. **Mixed information density** — "Jump in" shortcuts duplicate `QuickCreateBar` chips and `AgentsStrip`; placing them at the bottom buries the most useful actions.

## New layout

Reorganise into 4 clear bands. Each band uses its own grid so rows inside a band align via `h-full` on tiles; bands stack with consistent `gap-4`.

```text
Band 1 — Hero (full width)
  WelcomeHeader

Band 2 — Act now (2 cols on lg, equal height)
  QuickCreateBar (7)            | AISuggestions (5)

Band 3 — Discover (3 cols on lg, equal height)
  AgentsStrip (5)               | TrendingNowFeed (4) | TrendingSocialDates (3)

Band 4 — Plan & momentum (3 cols on lg, equal height)
  WhatsNewCarousel (5)          | RecentContentPacks (4) | CalendarPreview (3)

Band 5 — Pulse (2 cols on lg, equal height)
  CreatorMomentum (8)           | CoreActionCards (4)
```

Notes:
- Drops `row-span-2` entirely — every band is a single row, so no L‑shaped gaps can form.
- "Jump in" (`CoreActionCards`) moves next to `CreatorMomentum` as a compact shortcut column, not buried at the bottom alone.
- `TrendingSocialDates` joins the Discover band (it's a discovery surface, not a planning one), freeing space in band 4 for planning tiles.

## Tile changes (presentation only)

To make `h-full` actually align tiles in each band, a few tiles need to fill available height instead of hugging content:

- `QuickCreateBar`: add `h-full flex flex-col` on the inner `.card-bento`, push chips row to `mt-auto`.
- `TrendingNowFeed`: already `h-full flex flex-col`; ensure hashtag marquee stays pinned at bottom (it is, via `mt-4`).
- `AgentsStrip`: already `h-full flex flex-col`; make the 2x2 agent grid `flex-1` so cards stretch.
- `TrendingSocialDates`, `WhatsNewCarousel`, `RecentContentPacks`, `CalendarPreview`, `CreatorMomentum`, `CoreActionCards`, `AISuggestions`: verify each has `h-full flex flex-col` on its root `card-bento` and that the main content area is `flex-1`. Most already do (`AISuggestions`, `AgentsStrip`, `CreatorMomentum`, `CalendarPreview`, `CoreActionCards`). Only add `h-full` where missing.

No copy, color, icon, or behaviour changes. No new files. No business logic.

## Responsive

- Mobile (`<lg`): single column stack in the order shown above. Each band collapses naturally because each tile is already mobile‑friendly.
- `lg` (≥1024px): the column counts above kick in. Tested mentally against the user's 1188px viewport — all 3 Discover/Plan tiles fit comfortably (≈ 350px each minus gaps).

## Files touched

- `src/pages/DashboardHome.tsx` — restructure grid into 5 bands.
- `src/components/dashboard/QuickCreateBar.tsx` — add `h-full flex flex-col`, push chips to bottom.
- `src/components/dashboard/AgentsStrip.tsx` — make agent grid `flex-1`.
- Any of the listed tiles missing `h-full` on the root — add it. (Quick audit during implementation.)

## Out of scope

- No new tiles, no removed tiles, no copy edits, no token/color changes.
- No changes to `WelcomeHeader` internal layout.
- No backend, no routing, no data changes.

## Verification

- `tsc --noEmit` clean.
- Visual check at 1188px (current viewport), 1440px, and mobile — each band's tiles share a baseline at top and bottom; no vertical gaps inside a band.
