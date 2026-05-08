# Plan: Calendar widget, Branding CRM, Agent Builder

Three features to ship. All UI-first; backend uses Lovable Cloud (Supabase). Meta API integration is scoped as scaffolded edge functions ready for credentials.

---

## 1. Dashboard — Scheduled Posts Calendar Widget

**Goal:** Show upcoming scheduled posts on `/dashboard` with status + quick actions.

**Schema (new table `scheduled_posts`):**
- `id`, `user_id`, `title`, `caption`, `image_url`, `platform` (instagram/facebook/x/linkedin), `scheduled_for` (timestamptz), `status` (draft/scheduled/published/failed), `created_at`, `updated_at`
- RLS: public for now (matches existing pattern in `generations`)

**UI on `DashboardHome.tsx`:**
- New section "Upcoming posts" replacing/augmenting Recent Creations
- Two view tabs: **List** (default) and **Calendar** (mini month grid)
- Each row/cell shows: date chip, platform icon, title, status badge (color-coded), thumbnail
- Quick actions per post: **Reschedule** (date picker popover), **Edit** (dialog → caption + datetime), **Publish now**, **Delete**
- "Important dates" rail above: today / next 7 days counters + next post countdown

**Files:**
- `src/pages/DashboardHome.tsx` — add ScheduledPostsPanel
- `src/components/scheduled/ScheduledPostsPanel.tsx` (new)
- `src/components/scheduled/PostQuickActions.tsx` (new)
- `src/hooks/useScheduledPosts.ts` (new) — list/update/delete via supabase

---

## 2. Branding CRM — Innovative redesign

**Concept:** Brand Workspace that connects design tokens → image gen → content calendar.

**Sections in `BrandingCRM.tsx`:**
1. **Brand Identity Card** — logo upload, name, tagline, tone of voice, target audience, color palette (HSL pickers), font pairing. Saved to `brand_profile` table.
2. **Visual DNA** — preview chips synced into Image Studio (auto-injected as style prefix when generating).
3. **Voice Presets** — 3 saved tone presets that pre-fill Caption Generator.
4. **Content Pillars** — 4–6 topic pillars with weekly cadence; feed into Calendar as recurring slots.
5. **Campaigns** — group of scheduled_posts with goal, KPI, date range; visible as colored bands on calendar.
6. **Asset Bank** — pinned media from generations table per brand.

**Data flow:** Brand profile → ImageStudio reads `brand.style_prompt` → AIGenerator reads `brand.voice` → ContentCalendar/Dashboard groups by `campaign_id`.

**New tables:** `brand_profile`, `content_pillars`, `campaigns`, `voice_presets`.

---

## 3. Agent Builder (Manus-style, Meta accounts)

**Goal:** Drag-light builder to compose autonomous agents that **Publish**, **Research**, **Analyze** for Meta (Instagram/Facebook).

**UI: `/dashboard/agents` (new page)**
- Agent gallery: 3 starter templates — Publisher, Researcher, Analyst
- Agent detail: name, goal, schedule (cron), tools enabled, system prompt, run history, last result
- Run console: streaming logs, current step, output preview
- "Connect Meta" CTA → OAuth via Meta Graph API (requires user app credentials)

**Tools per agent type:**
- **Publisher:** generate_caption, generate_image, schedule_post, publish_to_meta
- **Researcher:** web_search (Lovable AI), competitor_scan, hashtag_trends, summarize
- **Analyst:** fetch_meta_insights, compute_engagement, generate_report, post_to_calendar

**Backend:**
- Edge function `agent-runner` — orchestrator using Lovable AI Gateway (gemini-3-flash-preview) with tool-calling
- Edge function `meta-publish` — POSTs to Graph API `/{ig-user-id}/media` + `/media_publish`
- Edge function `meta-insights` — GET `/{ig-user-id}/insights`
- Cron via pg_cron triggers `agent-runner` per schedule
- Tables: `agents`, `agent_runs`, `agent_tools`, `meta_connections` (access_token, page_id, ig_user_id)

**Secrets needed (will request after approval):** `META_APP_ID`, `META_APP_SECRET`. User completes OAuth in-app to store per-user tokens.

**Sidebar:** add "Agents" entry (Bot icon) above Settings.

---

## Build Order
1. Migration: `scheduled_posts`, `brand_profile`, `campaigns`, `content_pillars`, `voice_presets`, `agents`, `agent_runs`, `meta_connections` (single migration with RLS).
2. Dashboard scheduled posts widget + list/calendar tabs + quick actions.
3. Branding CRM redesign with brand-aware hooks read by ImageStudio + AIGenerator.
4. Agent Builder UI + edge functions (`agent-runner`, `meta-publish`, `meta-insights`) scaffolded; live Meta calls gated until secrets added.

## Open questions
- Should I scaffold Meta integration with placeholder OAuth (working UI, mocked publish) and request `META_APP_ID`/`META_APP_SECRET` after, or stop and request secrets first?
- Single brand per user, or multi-brand workspace?
