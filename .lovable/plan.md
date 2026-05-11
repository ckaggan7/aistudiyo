
# AI STUDIYO — Gen-Z Bento Creator Playground (Light)

Pivot the dashboard into a **light cinematic creator playground** — same Gen-Z energy as the brief, but built on a warm off-white canvas with orange edge lighting instead of matte black. Keep every existing route, component, AI workflow, and Supabase wiring; only the visual layer and a few section reorders change.

## What stays untouched

- Auth, routing, Supabase, AI gateway calls, all `/dashboard/*` pages and their logic
- Component data sources (generations table, social dates, agents, suggestions)
- Sidebar + AIDock skeleton

## 1. Design tokens (`src/index.css`)

Light cinematic palette — no dark mode switch.

- `--background: 30 30% 98%` (warm off-white, faint cream)
- `--foreground: 222 25% 10%`
- `--card: 0 0% 100%`, `--border: 222 15% 92%`
- Keep `--primary: 22 100% 55%` + `--primary-glow: 24 100% 66%`
- New variables:
  - `--shadow-bento: 0 1px 2px hsl(222 30% 15% / 0.04), 0 12px 32px -16px hsl(22 100% 50% / 0.18)`
  - `--gradient-hero-soft: radial-gradient(120% 80% at 0% 0%, hsl(22 100% 92%), transparent 60%), radial-gradient(120% 80% at 100% 100%, hsl(265 85% 95%), transparent 60%)`
  - `--gradient-edge-light: linear-gradient(135deg, hsl(22 100% 95% / 0.8), hsl(0 0% 100%))`
- Utility classes:
  - `.bento` — white card, 28px radius, hairline border, soft orange-tinted shadow
  - `.bento-hero` — large card with `--gradient-hero-soft` background + faint orange edge glow
  - `.bento-accent` — orange gradient solid (white text)
  - `.tilt` — CSS 3D tilt on hover (perspective + rotateX/Y from CSS vars)
  - `.float-y`, `.pulse-dot`, `.marquee` (infinite scroll), `.cursor-glow` (radial layer follows pointer)
  - `.magnetic-btn` (subtle translate toward cursor)

## 2. Layout shell (`src/components/DashboardLayout.tsx`)

- Warm off-white canvas, no dark class
- Sidebar: floating white island with 24px radius, hairline border, orange logo tile with glow; active nav = orange pill `bg-orange-50 text-primary` with right-edge orange highlight; hover = `bg-muted/50`
- Header: transparent over canvas, light blur when scrolled
- Ambient backdrop: 2 very soft orange + violet blobs at low opacity (already light)
- Mobile: add **floating bottom dock** at `lg:hidden` (Home, Create, Agents, Trends, Profile)

## 3. DashboardHome bento grid (`src/pages/DashboardHome.tsx`)

12-col grid, gap-5, max-w-[1440px]:

```text
┌─────── HERO BENTO (col-span 8) ─────────┬── AI ORB + PULSE (4) ──┐
│ Welcome, {name} + rotating subline      │ animated gradient orb  │
│ 3 inline stat chips                     │ live activity pings    │
├─────── QUICK CREATE (col-span 8) ───────┼── AI INSIGHTS (4) ─────┤
│ Big input "What do you want to create?" │ 3 rotating insight     │
│ chips + Generate pill                   │ pills                  │
├─────── WHAT'S NEW carousel (12) ────────────────────────────────┤
│ Horizontal snap row of gradient cards                            │
├─── AI AGENTS grid (col-span 7) ─────────┬── TRENDING NOW (5) ────┤
│ 2×2 floating agent cards, tilt + pulse  │ vertical hook feed +   │
│                                         │ hashtag marquee        │
├─── SOCIAL CALENDAR (col-span 5) ────────┼── CONTENT PACKS (7) ───┤
│ Date tiles, swipe row                   │ stacked recent packs   │
└─────────────────────────────────────────┴────────────────────────┘
```

Stats live only in HERO (kill duplicates). `CreatorMomentum` retires — its sparkline moves into HERO behind the AI orb.

## 4. Component restyling (presentation only)

| Component | Change |
|---|---|
| `WelcomeHeader.tsx` | Becomes HERO bento: 5xl headline, gradient subline, 3 chip stats inline, AI orb on right (conic-gradient, float loop), pulse pings, mini sparkline |
| `QuickCreateBar.tsx` | h-14 input with glowing orange focus ring, typing-effect placeholder, chip row, gradient Generate pill |
| New `WhatsNewCarousel.tsx` | 6 gradient snap cards (new agents/packs/templates/formats) |
| `AgentsStrip.tsx` | 2×2 floating cards: avatar bubble, online glow dot, tilt-on-hover, compact CTA |
| `TrendingSocialDates.tsx` | Reframed as Social Calendar bento with date tiles & swipe scroll |
| New `TrendingNowFeed.tsx` | TikTok-style mini hook cards + hashtag bubble marquee |
| `RecentContentPacks.tsx` | Modular stacked pack cards with hook chips & gradient thumbnails |
| `AISuggestions.tsx` | AI Insights Dock — 3 rotating insight pills |
| `AIDock.tsx` | White glass right rail; on mobile collapses into bottom dock |
| `ambient-backdrop.tsx` | 2 soft warm blobs only |

All cards: 28px radius, hairline border, soft orange-tinted shadow, optional inner top highlight, tilt + float on hover.

## 5. Theme customization

Repurpose `ThemeSwitcherDialog.tsx` for 5 brand themes that rewrite `--primary`, `--primary-glow`, `--gradient-hero-soft` on `:root` and persist to localStorage:

- Orange Blaze (default)
- Neon Purple
- Cyber Blue
- Emerald Flow
- Midnight Graphite (still light surface, graphite-tinted accents)

No new dependencies.

## 6. Microinteractions (CSS-only)

- `.tilt` via tiny shared `useTilt()` hook setting `--mx/--my` from mousemove
- `.cursor-glow` radial layer following pointer on hero & quick-create
- `.float-y` 6s infinite gentle Y translate
- `.magnetic-btn` hover translate toward cursor
- `.marquee` infinite hashtag scroll
- Framer Motion (already in deps) drives section enter animations

## 7. Out of scope

- Image Studio, Agents, Trends, Analytics, Calendar full-page redesigns (inherit new light tokens automatically; polished pass later)
- Real particle libraries or drag-and-drop canvas

## 8. Files touched

`src/index.css`, `tailwind.config.ts`, `src/components/DashboardLayout.tsx`, `src/components/ui/ambient-backdrop.tsx`, `src/components/dashboard/WelcomeHeader.tsx`, `QuickCreateBar.tsx`, `AgentsStrip.tsx`, `AISuggestions.tsx`, `TrendingSocialDates.tsx`, `RecentContentPacks.tsx`, `AIDock.tsx`, `ThemeSwitcherDialog.tsx`, `src/pages/DashboardHome.tsx`.

New: `src/components/dashboard/TrendingNowFeed.tsx`, `src/components/dashboard/WhatsNewCarousel.tsx`, `src/components/dashboard/AIOrb.tsx`, `src/components/dashboard/MobileDock.tsx`, `src/hooks/useTilt.ts`.

No backend changes.
