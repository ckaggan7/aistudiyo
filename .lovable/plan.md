
# AISTUDIYO — Pro Max Creator OS Plan

A focused, phased redesign that keeps the existing architecture (routes, Supabase, auth, theme presets) and upgrades the visual + interaction layer into a cinematic, creator-first AI OS.

## Phase 1 — Global Design Intelligence System

Goal: one connected look across every page.

- `src/index.css`
  - Refine dark tokens to spec: bg `#0A0A0B` matte, text `#F5F5F5`, secondary `#A1A1AA`, border `rgba(255,255,255,0.06)`, primary `#FF7A1A`, soft `#FFB06A`.
  - Add utilities: `.surface-glass`, `.surface-floating`, `.ambient-bg`, `.edge-light`, `.ring-soft`, `.text-display`, `.hover-lift`, `.motion-rise`.
  - Reduce shadow weight; replace heavy glows with subtle edge lighting + 1px inner highlight.
  - Add ambient gradient blobs as a reusable `<AmbientBackdrop />` component (3 soft orange/violet orbs, blurred, fixed behind app).
- `src/lib/themes.ts` — keep 6 presets (Orange Blaze, Cyber Blue, Neon Purple, Emerald Flow, Crimson Red, Midnight Graphite). Already mostly there; tune values to new neutral baseline.
- New `src/components/ui/ambient-backdrop.tsx` and `src/components/ui/floating-panel.tsx` (glass card with consistent radius/border/shadow) used everywhere instead of ad-hoc styling.
- Motion: add `src/lib/motion.ts` with shared Framer variants (`rise`, `fadeUp`, `stagger`, `pressable`).

## Phase 2 — Dashboard Shell (3-column OS layout)

`src/components/DashboardLayout.tsx` becomes:

```text
┌─────────────────────────────────────────────────────────┐
│  Floating Sidebar │     Workspace      │   AI Dock      │
│  (icons + labels) │   (page content)   │  (collapsible) │
└─────────────────────────────────────────────────────────┘
```

- Sidebar: floating glass panel (`m-3 rounded-2xl`), icon-first, soft orange active pill, collapsible to icon-only on `<lg`.
- Top header: slimmer (h-14), workspace switcher left, ⌘K + profile right, no border — separated by ambient backdrop.
- New `src/components/dashboard/AIDock.tsx` (right rail, 320px, collapsible): sections for AI suggestions, trend alerts, posting reminders, creator insights. Hidden on `<xl`, toggle button in header.
- Mobile: sidebar becomes drawer; AI Dock becomes bottom sheet trigger.

## Phase 3 — Home ("Mission Control")

`src/pages/DashboardHome.tsx` reordered + restyled:

1. `WelcomeHero` (rebuilt) — left greeting + dynamic subtitle rotation; right floating mini-analytics + last content snapshot.
2. `QuickCreateBar` (upgraded) — large floating input with animated placeholder rotation, glow focus ring, typing shimmer, suggestion chips below.
3. `WhatsNewCarousel` — cinematic horizontal scroller with snap + glow hover.
4. `TrendingIdeasStrip`
5. `AISuggestions`
6. `AgentsStrip`
7. `RecentContentPacks`
8. New `CalendarPreview` (next 7 days mini-strip linking to /calendar)
9. New `TrendingSocialDates` (compact strip)
10. New `CreatorMomentum` (3 KPI tiles: streak, posts, reach delta)

All sections wrapped in `<FloatingPanel>` for visual consistency; spacing rhythm 24/32/48.

## Phase 4 — Image Studio Pro Max

`src/pages/ImageStudio.tsx` restructured to 3-pane:

```text
[Prompt Tools] [ Canvas ] [Generation Controls]
```

- Left: prompt input, style preset chips (existing FILTERS system kept), aspect-ratio presets (1:1, 9:16, 4:5, 16:9), brand color picker.
- Center: large dark canvas, floating toolbar (download, regenerate, variations, edit), drag-zoom.
- Right: model, quality, seed, count, history thumbnails.
- New tabs at top: Image / Carousel / Thumbnail / Reel Cover / Ad Creative (each preloads prompt scaffolds + ratio).

## Phase 5 — AI Agents Pro Max

`src/pages/AgentBuilder.tsx` (or agents route) gets a grid of "team" cards:

- 8 agent personas (Instagram Growth, Viral Hook, LinkedIn Branding, Repurposing, Trend Hunter, Engagement, Campaign Strategist, Research).
- Each card: avatar orb (themed gradient), pulse "online" dot, one-line personality, current task, quick actions (Run, Configure, Pause).
- Detail drawer on click: recent outputs, suggestions, schedule.

## Phase 6 — Calendar Sync + Social Dates Engine

`src/pages/ContentCalendar.tsx`:

- Dark month/week view, orange highlight for today, glow ring for AI-suggested slots, event chips with platform icon.
- Drag-drop scheduled posts (dnd-kit already in deps or add `@dnd-kit/core`).
- Right side panel: AI suggestions for empty slots ("Post a reel at 7pm — peak audience").
- New `socialDates.ts` dataset (holidays, IPL, AI Day, Friendship Day, awareness days) shown as marker pills under date cells with "Generate post" CTA → routes to generator prefilled.

## Phase 7 — Content Packs Pro Max

Pack viewer (used after generation) restructured into modular swipeable cards:

1. Viral Hooks · 2. Caption · 3. CTAs · 4. Hashtags · 5. Carousel Slides · 6. Reel Script · 7. Image Prompts · 8. Posting Strategy.

Each card: regenerate button, copy, edit-in-place, status pill. Mobile uses horizontal snap; desktop shows 2-col masonry.

## Phase 8 — Animation + Mobile Polish

- Framer Motion page transitions (fade+rise 200ms).
- Hover lift on all interactive cards (-2px translate, border brighten).
- Mobile: sidebar drawer, AI dock bottom sheet, QuickCreate sticky bottom on dashboard home, swipe between pack cards.

## Technical Details

- Files created (new):
  - `src/components/ui/ambient-backdrop.tsx`
  - `src/components/ui/floating-panel.tsx`
  - `src/components/dashboard/AIDock.tsx`
  - `src/components/dashboard/CalendarPreview.tsx`
  - `src/components/dashboard/TrendingSocialDates.tsx`
  - `src/components/dashboard/CreatorMomentum.tsx`
  - `src/lib/motion.ts`
  - `src/lib/socialDates.ts`
- Files edited (major): `index.css`, `DashboardLayout.tsx`, `DashboardHome.tsx`, `WelcomeHeader.tsx`, `QuickCreateBar.tsx`, `WhatsNewCarousel.tsx`, `ImageStudio.tsx`, `ContentCalendar.tsx`, `AgentBuilder.tsx`, pack viewer components.
- No backend / schema changes. No new dependencies required (framer-motion + dnd already in tree; add `@dnd-kit/core` only if calendar drag is in scope this round).
- Theme switching stays in ProfileMenu via existing `ThemeSwitcherDialog`.

## Suggested execution order (per turn)

1. Tokens + AmbientBackdrop + FloatingPanel + motion lib.
2. DashboardLayout shell (sidebar + AI dock).
3. Home redesign (Hero + QuickCreate + new strips).
4. Image Studio 3-pane.
5. Agents grid.
6. Calendar + Social Dates.
7. Content Pack viewer.
8. Mobile + animation polish pass.

This keeps each step shippable and lets you preview progress without breaking other routes.
