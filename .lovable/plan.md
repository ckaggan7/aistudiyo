# Full Bento Dashboard Plan

Goal: take the existing creator dashboard and restructure it as a **true bento mosaic** — every section becomes a self-contained tile of varying sizes inside one unified 12-column grid, instead of stacked row blocks.

No backend/data changes. Visual + layout only. All existing components and routes preserved.

## What changes

### 1. `src/pages/DashboardHome.tsx` — single bento grid
Replace stacked rows with one `grid-cols-12 auto-rows-[minmax(140px,auto)] gap-4` mosaic. Each child gets a `col-span-*` + `row-span-*` so tiles feel asymmetric like a real bento.

```text
Row 1 (hero band):
[ WelcomeHero  col-8 row-2 ] [ AIOrbCard col-4 row-2 ]

Row 2 (creation band):
[ QuickCreate col-7 row-2 ] [ AISuggestions col-5 row-2 ]

Row 3 (agents mosaic):
[ AgentsStrip col-8 row-2 ] [ TrendingNowFeed col-4 row-3 ]
[ WhatsNewCarousel col-8 row-1 ]

Row 4 (calendar + library):
[ TrendingSocialDates col-5 row-2 ] [ RecentContentPacks col-7 row-2 ]

Row 5 (footer tiles):
[ CreatorMomentum col-4 ] [ CalendarPreview col-4 ] [ CoreActionCards col-4 ]
```

Mobile: stack to 1 col with same order, `row-span` resets.

### 2. Each component → bento tile
Every dashboard component wrapper gets normalized to:
- Full-height `h-full` so tiles fill their grid cell
- `.bento` base utility (already in `index.css`) for rounded-3xl, white bg, soft shadow, hover lift
- Consistent inner padding `p-5 lg:p-6`
- Tile header pattern: small eyebrow chip + title + optional action link in top-right
- Remove their own outer `space-y` margins (grid `gap-4` handles spacing)

Components touched (wrapper-only edits, content untouched):
`WelcomeHeader`, `QuickCreateBar`, `AISuggestions`, `AgentsStrip`, `TrendingNowFeed`, `WhatsNewCarousel`, `TrendingSocialDates`, `RecentContentPacks`, `CreatorMomentum`, `CalendarPreview`, `CoreActionCards`.

### 3. New tile variants in `src/index.css`
Add 3 size-flavored variants on top of existing `.bento`:
- `.bento-tall` — taller min-height + vertical content alignment
- `.bento-wide` — landscape ratio, stat-style emphasis
- `.bento-feature` — soft gradient surface for hero/standout tiles (reuses `--gradient-hero-soft`)
- `.bento-accent` already exists; keep for the orange standout.

Also add a subtle hover: `hover:-translate-y-0.5 hover:shadow-bento-lg transition`.

### 4. Reintroduce `CreatorMomentum` + `CoreActionCards`
They were retired from the page but still exist. Bring them back as small footer bento tiles so the mosaic feels rich without adding new code.

### 5. Mobile
- Grid collapses to `grid-cols-1`
- Each tile keeps its own internal layout (already responsive)
- Mobile bottom dock stays

## Out of scope
- No new components
- No content/data changes
- No new routes
- No backend
- No theme/token changes beyond the 3 new bento variants

## Files to edit
- `src/pages/DashboardHome.tsx` (rewrite layout)
- `src/index.css` (add 3 bento variants + hover)
- Light wrapper tweaks (`h-full`, header pattern) in the 11 dashboard components listed above
