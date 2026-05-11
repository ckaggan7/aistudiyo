## Goal
Replace the existing hero bento card on `/dashboard` with the **Premium Creator Hero** direction: a wider single-row layout with a soft warm canvas, a refined "Welcome, {name}" headline, four crisp white stat cards in a row, and a bigger ambient AI orb anchored to the right.

## Scope (UI only)
Only the hero card. Wiring (auth name, stats values, rotating subtitle) stays as-is. No layout grid changes outside the hero, no new routes, no backend.

## Files

**Edit `src/components/dashboard/WelcomeHeader.tsx`** — rewrite layout:
- Outer: `bento-hero` keeps soft warm gradient + rounded-[2.5rem] shell; increase padding (`p-8 md:p-12`).
- Inner: `flex flex-col md:flex-row items-center justify-between gap-10`. Left grows, right is fixed `w-72 md:w-80`.
- Left column:
  - Status chip: white pill, border, tiny pinging orange dot, label `AI creator playground` (uppercase, tracking-wider).
  - Headline: `text-5xl md:text-6xl font-bold tracking-tight` — "Welcome, " + `<span class="text-gradient-hero capitalize">{name}</span>`.
  - Rotating subtitle (existing `SUBTITLES` + AnimatePresence) — kept, restyled `text-base text-muted-foreground`.
  - Stats: replace pill chips with a 4-column white card row (`grid grid-cols-2 lg:grid-cols-4 gap-3`). Each card: `bg-white rounded-2xl border border-border/60 shadow-sm p-4`, eyebrow label uppercase tracking-wide, value `text-2xl font-bold` with a small accent suffix (`days`, `+18%` in emerald, etc.). Same four stats: Streak 7d, Reach +18%, Credits 142, Posts 23.
- Right column (orb):
  - Container `relative w-64 h-64 md:w-80 md:h-80`.
  - Ambient: large `bg-primary/20 blur-[100px] rounded-full` halo behind.
  - Keep existing `<AIOrb />` component (no rewrite) — pass `size={280}` and let CSS halo sit behind it.
  - Remove the faint sparkline bars behind the orb (cleaner per direction).
  - Floating "live" pill: small white rounded badge top-left of orb with pinging green dot + "Live".

**Edit `src/index.css`** — minor:
- Soften `.bento-hero` background to match the warmer stone tone (keep existing tokens, no new colors).
- No new utilities required; reuse `text-gradient-hero`, `shadow-bento`, design tokens.

## Out of scope
- Other dashboard tiles (QuickCreate, AISuggestions, Agents, etc.).
- AIOrb component internals.
- Stats data source.
- Mobile dock and sidebar.

## Acceptance
- Hero spans full grid row, taller and more premium feel.
- Headline reads clearly, "Admin" rendered in orange gradient (no broken block).
- Four white stat cards aligned in a single row at `lg`, 2×2 on mobile.
- Orb sits on the right with soft halo + floating live pill, no overlapping sparkline.
- No regression on other tiles.