## Super Admin Enhancement Pass — Linear/Vercel polish

Refines the existing `/superadmin` shell. **No new routes, no new tables.** Visual + UX layer only, plus a global admin ⌘K palette.

### 1. Reduce glow by ~30% — calmer, Linear-like

- `GlowCard`: drop `bg-card/80 backdrop-blur-xl` → `bg-card/95 backdrop-blur-sm`; border `border-border/60` → `border-border/40`; remove default inner glow gradient (keep `glow="primary"` opt-in only).
- `SuperAdminShell` active item: replace `shadow-[0_0_24px_-6px_hsl(var(--primary)/0.5)]` with `bg-primary/8 text-primary border-l-2 border-primary` (no halo). Drop the `shadow-[0_0_12px_...]` on the active indicator bar.
- Sidebar surface: `bg-card/40 backdrop-blur-xl` → `bg-card/60 backdrop-blur-sm`.
- `CompactStatsCard`: tighter `p-3` (was `p-4`), value `text-xl` (was `2xl`), border `border-border/40`. Result: ~15% denser cards.

### 2. Sidebar — icon-collapse + workspace badge

- Add collapsed state via `useState` (persisted to `localStorage:sa-sidebar`).
- Two widths: `w-60` expanded / `w-14` collapsed; labels hidden when collapsed; hover-tooltip on icons.
- Toggle button (Chevron) at bottom-left of sidebar header.
- Active indicator: left primary bar + soft `bg-primary/8` fill (replaces glow).
- Footer: small workspace chip (uses `useWorkspace`) + signed-in email truncated.
- Mobile (<lg): turn into Sheet drawer; trigger button in a slim top bar so admin works on tablets.

### 3. Overview → "AI Command Center" cockpit

Restructure `SuperAdminOverview.tsx` into a denser 12-col grid:

```text
┌─ Realtime pulse strip (sparkline of req/min, live dot) ────────────┐
├─ 6 compact KPIs (Users, Active 24h, AI req 24h, MRR, WS, Admins) ──┤
├─ Growth area chart (14d signups) │ AI assistant summary (insights) ┤
├─ Realtime activity feed          │ System alerts + provider health ┤
└─ Quick actions row (invite admin, view failures, open billing) ────┘
```

- **Realtime pulse**: 60s sparkline of `ai_request_logs` count per minute, polled every 10s. Single-row card, ~48px tall.
- **AI assistant summary**: keep current bullet generator but enrich (delta vs prev week, top model, cost trend) — derived client-side from existing queries, no new endpoints.
- **System alerts**: surface failures + degraded providers as compact warning rows.
- Remove redundant duplicate "Active 24h"/"AI requests 24h" stat (current code has both).

### 4. AI Center — keep tabs, add Costs + Health, sticky controls

`SuperAdminAI.tsx` already has tabs. Refine:

- Tabs order: **Providers · Models · Usage · Costs · Health** (split current "Providers & Models" into two tabs; new Costs tab; new Health tab; "Rollout" → moved to Settings page).
- Sticky tab bar: wrap `TabsList` in `sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border/40 py-2`.
- **Costs tab**: stacked area of cost by provider (14d) + table of top 10 most-expensive models. All from existing `ai_request_logs.cost_usd` + `ai_models`.
- **Health tab**: per-provider latency p50/p95 mini-cards + failure rate trend.
- Chart heights: 256 → 192 for density.

### 5. Billing — Stripe-style premium

- Hero metric row: large MRR (text-4xl), ARR, paid workspaces, churn placeholder — 4 cards with thin sparkline behind each value.
- Revenue tab: when provider not connected, show **mocked-looking but clearly-labeled "Sample data"** area chart (last 30d) so the page feels alive; banner explains connecting Stripe replaces it.
- Subscriptions tab: keep plan distribution bars but compact (`h-1.5`).
- Add "Workspace billing snapshot" table: top 10 workspaces by credits consumed.

### 6. Global Admin Search (⌘K)

New `src/components/admin/AdminCommandPalette.tsx` mounted inside `SuperAdminShell`:

- ⌘K toggles. Groups:
  - **Navigate** → 9 sections
  - **Find users** → live search `profiles` by email/display_name (debounced 200ms), opens `/superadmin/users/:id`
  - **Find workspace** → live search `workspaces` by name/slug
  - **Quick actions** → "View AI failures", "Open billing", "Invite admin", "Toggle dark mode"
  - **Recent** → last 5 visited admin routes (localStorage)
- Excludes the existing user-facing `CommandPalette` to avoid collisions (mount admin one only inside SuperAdminShell).

### 7. Smart AI Insights widget (floating)

`src/components/admin/AIInsightsDock.tsx` — fixed bottom-right, 320px, collapsible:

- Pill button with `Sparkles` icon when collapsed.
- Expanded card lists 3–5 derived insights (cost delta, inactive workspaces count, top trending model, pending upgrade hints).
- Insights are derived client-side from data already loaded; no AI call. Refresh every 60s.
- Dismissible per-session (sessionStorage).
- Mounted only in `SuperAdminShell`.

### 8. Mobile / tablet

- Shell: sidebar becomes Sheet under `lg`. Top bar (h-12) with hamburger + breadcrumb + ⌘K shortcut.
- KPI grids: `grid-cols-2 md:grid-cols-3 lg:grid-cols-6` (already there); reduce padding on `<md`.
- Tables: wrap in `overflow-x-auto`, ensure `min-w-` on `ReusableTable`.
- Charts: `h-40 md:h-48` instead of fixed 256.

### 9. Files touched

- Edit: `SuperAdminShell.tsx`, `SuperAdminOverview.tsx`, `SuperAdminAI.tsx`, `SuperAdminBilling.tsx`, `CompactStatsCard.tsx`, `glow-card.tsx`.
- New: `src/components/admin/AdminCommandPalette.tsx`, `src/components/admin/AIInsightsDock.tsx`, `src/components/admin/PulseStrip.tsx`.
- No DB migrations. No new dependencies.

### 10. Out of scope

- Real Stripe wiring (the user explicitly hasn't asked).
- Server-driven insights / LLM calls for the dock.
- Refactoring user-side `CommandPalette`.
- New admin sections beyond the existing 9.

### Acceptance

- Overview feels like a cockpit at a glance: pulse + KPIs + insights + feed visible in one viewport on a 1440×900 screen.
- No card has a visible neon glow at rest; primary glow only on hover/active.
- ⌘K from any `/superadmin/*` page opens the admin palette and can jump to a user by email.
- Sidebar collapses to 56px; works in a Sheet on `<lg`.
- AI Center has 5 tabs, sticky on scroll, charts ≤192px tall.
