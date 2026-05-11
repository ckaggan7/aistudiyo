
# Gen-Z × Apple Bento Dashboard Redesign

Restyle the `/dashboard` route into a light, Apple-grade bento grid. Frontend/presentation only — no backend, no data changes.

## Design tokens (src/index.css)

- Canvas: `--background: 0 0% 98.5%`, `--foreground: 222 20% 12%`
- Surface: pure white cards with subtle border `222 15% 92%` and soft shadow `0 1px 2px rgba(15,23,42,.04), 0 8px 24px -12px rgba(15,23,42,.08)`
- Keep orange `--primary: 22 100% 55%` as the single accent
- Add utility classes:
  - `.card-bento` — `bg-white rounded-[28px] border border-border/60 shadow-[var(--shadow-bento)] p-6 transition-all hover:shadow-lg hover:-translate-y-0.5`
  - `.card-bento-accent` — orange-filled variant, white text
  - `.card-bento-dark` — slate-900 variant for the AI hero tile
  - `.text-display` — `text-4xl md:text-5xl font-semibold tracking-tight`
  - `.chip` — small pill for labels/metrics

## Layout shell (src/components/DashboardLayout.tsx)

- Off-white page background, remove heavy ambient orbs (keep one faint gradient blob top-right)
- Sidebar: solid white, rounded-[24px] island with 16px gap from edges, orange logo tile, nav items as `rounded-2xl`, active = `bg-orange-50 text-primary`
- AI Dock: white pill on right rail

## DashboardHome bento grid (src/pages/DashboardHome.tsx)

12-col grid, `gap-6`, max-w-[1400px]:

```text
┌───────────────────────── Welcome (12) ─────────────────────────┐
├──── Streak (3) ──┬── Posts (3) ──┬── Reach accent (3) ──┬ Credits (3) ┤
├──────── Quick Create (8) ────────┬──── AI Suggestions stack (4) ──────┤
├──────── Creator Momentum chart (8) ──────┬──── AI Team tiles (4) ─────┤
├──────────────── Upcoming moments horizontal scroll (12) ──────────────┤
└──────────────────── Recent content packs (12) ────────────────────────┘
```

Remove duplicates: drop the standalone stat row inside `CreatorMomentum` (stats now live in top bento), keep only the chart.

## Component restyling (presentation only)

- `WelcomeHeader.tsx` — large display headline + subtle subline, no card wrapper
- `QuickCreateBar.tsx` — `.card-bento`, chips become rounded-2xl tappable tiles
- `CreatorMomentum.tsx` — `.card-bento`, chart only, soft gridlines
- `AgentsStrip.tsx` — 2×2 mini-tiles inside a single `.card-bento`, each agent is a rounded-2xl inner tile with icon + 2-line label
- `AISuggestions.tsx` — 3 stacked rounded-2xl rows inside one `.card-bento`, primary CTA on hover
- `TrendingSocialDates.tsx` — `.card-bento`, horizontal snap-scroll row of date pills
- `RecentContentPacks.tsx` — `.card-bento`, 4-column grid of pack cards
- `AIDock.tsx` — white floating pill, orange send button
- `ambient-backdrop.tsx` — reduce opacity to ~0.06, single blob

## Stat cards (new inline in DashboardHome)

Four equal cards: Streak (white), Posts shipped (white), **Reach +18% (`.card-bento-accent` orange)**, Credits (white). Each: tiny label, big number, delta chip.

## Out of scope

Calendar, Image Studio, Agents, Trends, Analytics, Auth, marketing pages. They inherit the new light tokens automatically; no further edits.

## Files touched

`src/index.css`, `src/components/DashboardLayout.tsx`, `src/components/ambient-backdrop.tsx`, `src/components/dashboard/WelcomeHeader.tsx`, `QuickCreateBar.tsx`, `CreatorMomentum.tsx`, `AgentsStrip.tsx`, `AISuggestions.tsx`, `TrendingSocialDates.tsx`, `RecentContentPacks.tsx`, `AIDock.tsx`, `src/pages/DashboardHome.tsx`.
