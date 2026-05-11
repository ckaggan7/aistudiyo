## Hero Banner Ad Style — Announcement

Transform the thin marquee strip at the top of `/dashboard` into a **hero-style banner ad** that promotes the 6 new modules with visual punch — while keeping the orange + black futuristic system intact.

### Visual target

```
┌──────────────────────────────────────────────────────────────┐
│  ✦ NEW DROPS                                  [Explore all →]│
│                                                              │
│   What's new in AI STUDIYO                                   │
│   Six tools to ship faster.                                  │
│                                                              │
│   [🤖 Agents] [⚡ Workflow] [🎨 Branding CRM]                │
│   [📅 Calendar] [🖼 Image Engine] [✨ ChatGPT 2.0]           │
└──────────────────────────────────────────────────────────────┘
```

Ambient orange/purple gradient orbs behind, glass card, subtle grid pattern overlay — same language as the existing Hero section below it (so they feel like a pair, not duplicates).

### Changes — `src/components/dashboard/AnnouncementBanner.tsx` (rewrite)

- Container: `rounded-3xl border border-border/40 bg-card relative overflow-hidden p-6 md:p-8 mb-6` (≈160–180px tall vs current 40px).
- Background:
  - Two blurred gradient orbs (`bg-gradient-hero opacity-20 blur-3xl` top-right, `bg-gradient-accent opacity-15 blur-3xl` bottom-left) matching the Hero card pattern.
  - Faint radial dot grid via inline SVG/CSS for "ad" texture.
- Header row: pulsing dot + `NEW DROPS` chip on left (orange `bg-primary/10 text-primary`), `Explore all →` link on right.
- Headline: `text-2xl md:text-3xl font-bold tracking-tight` — "What's new in AI STUDIYO" with `text-gradient-hero` on key word.
- Subline: `text-sm text-muted-foreground` one-liner.
- Module pills row: 6 `<Link>` chips on one row (wrap on small screens), each:
  - `inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border/50 bg-background/40 backdrop-blur hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all`
  - Icon (lucide, `w-4 h-4 text-primary`) + label
- Framer-motion entrance: container fade-up, pills stagger in (0.04s delay each).
- Keep existing route mapping (Agents, Workflows, Branding, Calendar, Image Studio, Agents-as-ChatGPT-2.0).
- Drop the CSS marquee — it's now a static hero ad, not a ticker.

### Integration

No change to `DashboardHome.tsx` — banner already renders above the Hero. Bump its `mb-` so it breathes with the Hero card below.

### Tokens & constraints

- Only semantic tokens (`primary`, `card`, `border`, `muted-foreground`, `gradient-hero`, `gradient-accent`).
- No new colors, no new deps.
- Responsive: stacks gracefully <640px; pills wrap.
- Respects `prefers-reduced-motion` (motion props become identity).
