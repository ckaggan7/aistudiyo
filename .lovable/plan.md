## Goal

Make `/dashboard` (already the default post-login route) feel like an "AI Creator Command Center": dynamic welcome, profile + theme switcher, What's New carousel, premium buttons, and dark cinematic edge gradients. Preserve current sidebar, orange+black ecosystem, glassmorphism, and all other pages.

## Scope (in)

- New welcome header with animated rotating subtitle
- Profile dropdown in header (avatar, workspace, settings, logout, **Change Theme**)
- Dynamic theme system (8 presets) persisted to `localStorage`, applied via CSS variables on `<html>`
- New What's New horizontal carousel module (auto-scroll, drag, hover-pause, snap)
- Replace existing `CoreActionCards` "Schedule Campaign" → "Plan Campaign" wording; keep layout
- Add a Viral Hooks Feed strip (lightweight, links to `/dashboard/generator`)
- Cinematic dark edge gradients via a reusable wrapper utility
- Button polish (premium variant: gradient + soft glow + hover lift + active press)
- Visual refinement: reduce excess glow/padding, increase density
- Mobile: theme drawer, swipeable carousel

## Scope (out)

- Super Admin, AgentBuilder, AIGenerator, ImageStudio internals
- Backend/data model changes (theme is purely client-side)
- Sidebar redesign / navigation changes
- Auth flow changes

## Section order on `/dashboard`

1. Welcome Header (left: greeting + rotating subtitle; right: profile menu)
2. Quick Create Bar (existing, kept as hero)
3. What's New carousel (new)
4. Core Actions (3 cards, updated copy)
5. AI Agent Suggestions (reuse existing `AISuggestions`)
6. Trending Topics (existing `TrendingIdeasStrip`)
7. Recent Generations (existing grid)
8. Viral Hooks Feed (new compact strip)

## Technical details

### Theme system

- `src/lib/themes.ts` — array of 8 presets, each containing HSL values for: `--primary`, `--primary-glow`, `--accent`, `--ring`, `--gradient-hero`, `--gradient-accent`, `--shadow-glow`, `--sidebar-primary`, `--sidebar-ring`.
- `src/hooks/useTheme.tsx` — `ThemeProvider` + `useTheme()`. Reads `localStorage["aistudiyo.theme"]` (default `orange-blaze`), writes CSS vars onto `document.documentElement.style.setProperty(...)` on mount/change. Wrap inside `AuthProvider` in `App.tsx`.
- All existing components keep using semantic tokens (`bg-primary`, `text-gradient-hero`, `shadow-glow`), so themes propagate automatically without touching consumer code.
- Themes affect only chroma tokens — base background, foreground, text never change → readability preserved.

Presets:
1. Orange Blaze (default, current values)
2. Neon Purple
3. Cyber Blue
4. Emerald Flow
5. Crimson Red
6. Sunset Gold
7. Frost White (light primary on neutral)
8. Midnight Graphite (low-chroma slate)

### Files

**New**
- `src/hooks/useTheme.tsx`
- `src/lib/themes.ts`
- `src/components/dashboard/WelcomeHeader.tsx` — greeting + framer-motion AnimatePresence cycling subtitles every ~4s
- `src/components/dashboard/ProfileMenu.tsx` — dropdown-menu with avatar (from `useAuth`), workspace shortcut, settings link, logout, "Change theme" submenu opening `ThemeSwitcherDialog`
- `src/components/dashboard/ThemeSwitcherDialog.tsx` — modal/drawer (responsive) showing 8 preset swatches with live preview-on-hover
- `src/components/dashboard/WhatsNewCarousel.tsx` — replaces page-level "What's new"; uses existing `embla` (shadcn `carousel`) with `autoplay` via interval, drag, snap; 28px rounded cards with gradient art and CTA links
- `src/components/dashboard/ViralHooksFeed.tsx` — 4–6 hook cards linking to generator with prefilled topic
- `src/components/ui/edge-glow.tsx` — wrapper applying radial corner gradients + soft border (cinematic dark edges)

**Edited**
- `src/index.css` — add `--edge-gradient` token + `.edge-glow` utility; add `.btn-premium` utility (gradient bg, soft inner highlight, drop-shadow, `:hover` translate-y-px, `:active` scale-[0.98])
- `src/App.tsx` — wrap with `<ThemeProvider>`
- `src/components/DashboardLayout.tsx` — remove `HeaderAnnouncementCarousel` from header (moves into page); place `<ProfileMenu />` on the right side of header
- `src/pages/DashboardHome.tsx` — new section order; mount `WelcomeHeader`, `WhatsNewCarousel`, `ViralHooksFeed`; remove standalone header from page (now in `WelcomeHeader`)
- `src/components/ui/button.tsx` — add `premium` variant via cva
- `src/components/dashboard/CoreActionCards.tsx` — rename "Schedule Campaign" → "Plan Campaign", apply edge-glow wrapper

**Deleted/retired**
- `HeaderAnnouncementCarousel` no longer mounted in layout (kept as file in case of reuse), since What's New takes over.

### What's New carousel content (initial seed)

Hardcoded array in `WhatsNewCarousel.tsx` (no backend):
- New AI Agent: "Trend Hunter" → `/dashboard/agents`
- Viral Hook Templates Pack → `/dashboard/templates`
- Carousel Studio Beta → `/dashboard/design`
- Instagram Auto-Publish → `/dashboard/calendar`
- ChatGPT-style Brain v2 → `/dashboard/generator`
- Creator Tip: Best posting time → `/dashboard/trends`

Each card: gradient art, eyebrow tag, title, 1-line desc, CTA arrow, hover lift + glow.

### Animations

All via existing framer-motion + tailwind keyframes:
- Subtitle: `AnimatePresence` fade/slide
- Cards: stagger `fade-in`
- Carousel: embla autoplay (3.5s), pause on hover/drag
- Buttons: tailwind transitions + active scale
- Edge glow: pure CSS radial gradients in pseudo-elements

### Mobile

- Welcome header collapses; profile menu becomes icon-only avatar trigger
- Theme picker uses `Sheet` (drawer) instead of `Dialog` on `<md`
- Carousel snaps single-card width, swipe enabled
- Core Actions stack to 1 column

## Acceptance

- Switching a theme instantly recolors buttons, gradients, active nav highlight, shadows across all pages
- Theme persists across reload
- `/dashboard` shows new welcome + profile menu + What's New carousel + reordered sections
- No regressions on other dashboard pages (semantic tokens drive theming)
- No backend or schema changes
