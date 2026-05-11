## Goal
Collapse the two parallel admin systems (`/admin/*` 18-item shell + `/superadmin/*` 3-item shell) into a single, clean Super Admin with exactly 9 sidebar items. Merge over-engineered pages, keep the orange/black UI, reuse existing components.

## Current state
- `AdminShell` lists 18 items but most routes don't exist (Database, Storage, Permissions, Security, Notifications, Revenue, Integrations, etc. are dead links).
- Real pages: `AdminOverview`, `AdminUsers`, `AdminWorkspaces`, `AdminAIModels`, `AdminAIUsage`, `AdminActivity`, `AdminFlags`.
- `SuperAdminShell` has its own sidebar with: Overview, Users, Credits. Pages: `SuperAdminOverview`, `SuperAdminUsers`, `SuperAdminUserDetail`, `SuperAdminCredits`.
- Two routes guard differently: `/admin/*` via `ProtectedRoute requireRole=super_admin`, `/superadmin/*` via `SuperAdminRoute`.

## Target structure — one shell, 9 items
All under `/superadmin/*` (drop `/admin/*` entirely, redirect to `/superadmin`):

1. **Overview** `/superadmin` → KPI grid + realtime feed + smart alerts + AI summary widget
2. **Users** `/superadmin/users` → existing table, simplified to 4 roles
3. **Workspaces** `/superadmin/workspaces` → table + quick-view drawer with usage/billing/AI
4. **AI Center** `/superadmin/ai` → tabs: Providers · Models · Usage · Logs · Flags
5. **Billing** `/superadmin/billing` → tabs: MRR/Revenue · Subscriptions · Credits · Invoices
6. **Analytics** `/superadmin/analytics` → user growth, AI growth, retention, top creators/workspaces
7. **Support** `/superadmin/support` → tickets · reports · moderation queue · AI failures
8. **System** `/superadmin/system` → API status · integrations · storage · realtime logs · alerts · deployments
9. **Settings** `/superadmin/settings` → branding · platform · AI defaults · env · preferences

## Plan

### 1. Sidebar consolidation
- Replace `SuperAdminShell` items array with the 9 entries above.
- Keep current floating glass styling + orange glow active state; tighten spacing slightly (`py-1.5 px-2.5`).
- Add subtle section divider between item 6 and 7 (operational vs platform).
- Keep `SidebarTrigger` collapse behavior already in place.

### 2. Routes (`src/App.tsx`)
- Drop the entire `/admin/*` block; replace with `<Route path="/admin/*" element={<Navigate to="/superadmin" replace />} />`.
- Add new routes under `/superadmin/*`: `workspaces`, `ai`, `billing`, `analytics`, `support`, `system`, `settings`.
- Remove imports for now-unused admin pages.

### 3. Page consolidation (move + merge, do not redesign)
- **Workspaces**: move `AdminWorkspaces.tsx` → `SuperAdminWorkspaces.tsx`. Add a side drawer (existing `Sheet`) showing owner, plan, credits, AI usage, members, status from joined queries.
- **AI Center**: new `SuperAdminAI.tsx` using the `Tabs` primitive. Tab bodies reuse current `AdminAIModels` (Providers + Models merged into one tab), `AdminAIUsage` (Usage + Logs), `AdminFlags` (Rollout). Add a top KPI strip: providers healthy, tokens 24h, avg latency, failures.
- **Billing**: new `SuperAdminBilling.tsx` with tabs (Revenue / Subscriptions / Credits / Invoices). Credits tab reuses existing `SuperAdminCredits` table inline. Others as compact placeholders until billing provider lands (per earlier scope decision to skip billing).
- **Analytics**: new `SuperAdminAnalytics.tsx`. Pull from `activity_logs`, `ai_request_logs`, `profiles`, `workspaces`. Show 4 KPIs + 2 charts + Top creators / Top workspaces lists.
- **Support**: new `SuperAdminSupport.tsx`. Single page with ticket queue placeholder, AI failure feed (from `ai_request_logs` where status != success), reports list. No new tables this round — render empty states cleanly.
- **System**: new `SuperAdminSystem.tsx`. Compact cards: API status, AI gateway health, storage usage (sum of `workspaces.storage_used_mb`), realtime activity log (last 50 rows from `activity_logs`), system alerts strip. Terminal-style mono log block.
- **Settings**: new `SuperAdminSettings.tsx`. Sections: branding (logo/colors), platform defaults (sign-ups on/off via flag), AI defaults (default model select from `ai_models`), env display, admin preferences. No deep nesting — single scrolling page with anchor nav.

### 4. Reusable components (new, lightweight)
Add under `src/components/admin/`:
- `AdminPageHeader.tsx` — eyebrow + title + description + right-slot actions
- `CompactStatsCard.tsx` — denser version of `StatsCard` (smaller padding, optional sparkline)
- `RealtimeFeed.tsx` — vertical list of recent events with relative time
- `AIHealthIndicator.tsx` — colored dot + label, used in AI tab and System
- `AdminQuickActions.tsx` — row of buttons for top quick actions on Overview
- `CompactAnalyticsChart.tsx` — small bar/line wrapper using existing `chart` primitives

All other admin pages migrate to use `AdminPageHeader` for consistent typography hierarchy.

### 5. Overview redesign (light, not a rebuild)
- Keep `StatsCard` grid but trim to 6 KPIs (Users, Active Users, AI Requests, Revenue, Active Workspaces, System Health).
- Add `AdminQuickActions` row (Invite admin, View AI failures, Open billing, Run audit).
- Add `RealtimeFeed` (recent signups, top AI errors, new workspaces) — reads from `activity_logs` + `ai_request_logs`.
- Add small `AIAdminAssistant` widget (bottom-right floating) — collapsed by default, opens a panel that calls Lovable AI Gateway with platform health snapshot and returns 3-bullet summary. Non-intrusive, dismissible.

### 6. Cleanup
- Delete legacy `AdminShell.tsx` and the seven `src/pages/admin/Admin*.tsx` files **after** their content is migrated into the new pages. (Keeps repo tidy and prevents stale routes.)
- Keep `SuperAdminLogin` and `SuperAdminUserDetail` unchanged.

### 7. AI Admin Assistant (optional small widget)
- Floating button bottom-right of admin shell, opens a `Sheet` with a single chat thread.
- Backend: reuse existing edge function pattern (call `https://ai.gateway.lovable.dev/v1/chat/completions` with system prompt that includes current platform counters fetched server-side).
- Skip if it expands scope — can be a follow-up.

### Technical notes
- All queries use existing Supabase client and RLS (super_admin bypasses).
- No new tables. No design system changes. Same orange + black tokens.
- Tabs use existing shadcn `Tabs` primitive. Drawers use existing `Sheet`.
- Sidebar collapse already works via current shell; not touching `useSidebar` plumbing.
- Roles: trim UI dropdown options to `super_admin | admin | creator | user` (DB enum stays as-is; `manager` quietly hidden from picker).

## Deliverables
- 1 updated shell (`SuperAdminShell`)
- 7 new/renamed pages (Workspaces, AI, Billing, Analytics, Support, System, Settings)
- 6 small reusable admin components
- Updated routes + `/admin/*` redirect
- Removed: `AdminShell`, 7 legacy `admin/Admin*.tsx` files
- No DB migration, no new dependencies

## Out of scope (next round)
- Real billing provider, ticketing backend, deployment integrations.
- The floating AI Admin Assistant if it pushes the round long — gated behind "if time."