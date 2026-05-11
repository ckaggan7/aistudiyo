## Creator-First Pivot — Phase 1

Shift AISTUDIYO from "dashboard-first" to "content-first". Replace the dashboard homepage, expand the AI Agents library to 8 actionable agents, and add a Quick Create bar that routes prompts to the right generator. **Admin work is paused.**

This plan is **Phase 1 only** — the high-leverage shifts that change how the product feels in the next session. Phases 2/3 are listed at the bottom for follow-ups.

### 1. Rebuild `DashboardHome.tsx` — creator cockpit

Strip every enterprise metric. New vertical flow inside `max-w-5xl mx-auto`:

```text
┌─ Greeting + announcement banner (kept) ────────────────────────────┐
│                                                                    │
│   ✦ AI Quick Create                                                │
│   [ Try: "Create Instagram carousel about AI marketing"    ↵ Create]│
│   chips: Carousel · Reel hook · LinkedIn post · Caption · Image    │
│                                                                    │
├─ 3 core action cards ──────────────────────────────────────────────┤
│  [ Create Content ]   [ Launch AI Agent ]   [ Schedule Campaign ]  │
│   icon + 1-line desc, large clickable surfaces                     │
├─ Trending ideas strip (5 chips, click → prefills Quick Create) ────┤
├─ Recent generations (existing grid, kept) ─────────────────────────┤
└─ AI suggestions + viral hooks (2-col) ─────────────────────────────┘
```

**Removed**: 4 stat cards (Images/Captions/Scheduled/Engagement), Quick Start 4-grid, ScheduledPostsPanel (moved to Calendar page only).

### 2. New component `src/components/dashboard/QuickCreateBar.tsx`

- Large input (`h-14`, rounded-2xl, glass) with pulsing primary glow.
- Submit button infers intent locally:
  - prompt contains "image|carousel|design|picture|sticker" → `/dashboard/image-studio?prompt=...`
  - prompt contains "agent|automate|publish|schedule" → `/dashboard/agents?prompt=...`
  - else → `/dashboard/generator?topic=...&contentType=post`
- Below input: 5 chip suggestions (Carousel, Reel hook, LinkedIn post, Caption, Image).
- `AIGenerator` and `ImageStudio` read query params on mount to prefill (small useEffect addition in each).

### 3. New component `src/components/dashboard/TrendingIdeasStrip.tsx`

- Horizontal scroll strip of 6 hardcoded trending ideas with hashtag + topic label.
- Each chip click → opens Quick Create prefilled.
- Refresh button (future: wire to TrendEngine).

### 4. New component `src/components/dashboard/AISuggestions.tsx`

- Two columns:
  - **Viral hooks today** (5 sample hooks; static for Phase 1, dynamic in Phase 2).
  - **Suggestions for you** (3 cards: "Repurpose your last post into Reel", "Write follow-up to top caption", "Schedule next week").
- Each clickable → routes into the relevant tool.

### 5. Expand AI Agents to 8 templates — `AgentBuilder.tsx`

Replace the 2 existing templates with 8 default templates. Keep storage shape (`type` column constrained → relax to free `type: string` if needed via existing column; current code uses `AgentType = "publisher" | "insights"` — extend to a string union).

| Agent | Icon | Goal |
|---|---|---|
| Instagram Growth | Instagram | Plan, post, hashtag-optimize for IG growth |
| LinkedIn Branding | Linkedin | Authority posts + thought-leadership |
| Viral Content | Flame | Hook hunter + scroll-stop captions |
| AI Research | Search | Topic & competitor research |
| Trend Hunter | TrendingUp | Surface emerging trends daily |
| Engagement | MessageCircle | Comment/DM ideas + reply drafts |
| Repurposing | Repeat | One post → carousel/reel/blog |
| Campaign Strategist | Target | Multi-week campaign plans |

- Each renders as a card with gradient icon, 1-line goal, cost chip, "Deploy" button.
- Grid: `md:grid-cols-2 lg:grid-cols-4`.
- Quick filter bar at top: All · Growth · Content · Strategy · Research.

### 6. Database

- `agents.type` is currently free text in the migration; just pass new slugs. No migration needed.
- If a CHECK constraint exists, add a migration to drop it (verify first with `supabase--read_query`).

### 7. Files

**New**
- `src/components/dashboard/QuickCreateBar.tsx`
- `src/components/dashboard/TrendingIdeasStrip.tsx`
- `src/components/dashboard/AISuggestions.tsx`
- `src/components/dashboard/CoreActionCards.tsx` (3 large action cards)

**Edited**
- `src/pages/DashboardHome.tsx` — full rewrite to the new flow above
- `src/pages/AgentBuilder.tsx` — replace `TEMPLATES` with 8 entries + filter chips
- `src/pages/AIGenerator.tsx` — read `?topic=` and `?contentType=` query params to prefill
- `src/pages/ImageStudio.tsx` — read `?prompt=` query param to prefill

**Untouched**: all `/superadmin/*` pages (per the user's "stop building admin" directive).

### 8. Constraints

- Use only existing semantic tokens, no new colors.
- No new dependencies.
- No backend changes (agents table + edge functions already support this).
- Keep the existing AnnouncementBanner above Quick Create.
- Mobile-first: Quick Create stacks chips, action cards become single column.

### Out of scope (Phase 2 / 3)

- Phase 2: AI Studio module hub at `/dashboard/studio` with the 10 tools (Viral Hook Generator, Carousel Script, Reel Script, YouTube Shorts, Brand Voice, Repurposer, CTA Generator, etc.) — each is a thin wrapper around `generate-content` with a tailored system prompt.
- Phase 2: Make Agents actionable (background runs already partially wired via `agent-runner` function — needs a "Run now" UX + report viewer).
- Phase 3: Live trend data via TrendEngine wired to AISuggestions + TrendingIdeasStrip.
- Phase 3: Publishing system (Buffer-style) for cross-posting.

### Acceptance

- Landing on `/dashboard` shows: greeting → Quick Create bar → 3 action cards → trending → recent → suggestions. No enterprise stats.
- Typing "Make me a LinkedIn post about AI startups" + Enter routes to `/dashboard/generator` with topic prefilled and platform set to LinkedIn.
- `/dashboard/agents` shows 8 agents in a grid; clicking "Deploy" on Instagram Growth creates that agent.
- No `/superadmin` files changed.
