## Goal
Add a Google Growth Suite to AISTUDIYO under `/dashboard/growth` — an AI-native local-business growth OS. All Google data is mocked; all generated content uses Lovable AI (Gemini 3 Flash). No OAuth, no real Google API calls.

## New route structure

```text
/dashboard/growth                  → Growth OS hub (Business Command Center)
/dashboard/growth/ads              → Google Ads AI (campaign builder)
/dashboard/growth/analytics        → Google Analytics AI
/dashboard/growth/profile          → Google Business Profile AI + Post Generator
/dashboard/growth/reviews          → Review & Engagement AI
/dashboard/growth/seo              → Local SEO + Discovery
/dashboard/growth/agent            → Local Business AI Agent
/dashboard/growth/connect          → Google Connect screen (mock connect flow)
```

Nav: add a "Growth" group to the sidebar with `Sparkles`/`Megaphone` icon. Calendar gets a new "Google Business Posts" track (additive — no rewrite of existing calendar).

## Modules (all mocked + AI-generated)

### 1. Growth Hub — `/dashboard/growth` (Business Command Center)
Bento layout consistent with existing DashboardHome density.
- KPI tiles: profile views, calls, website clicks, direction requests, review count, local SEO score (mock data, animated counters)
- Visibility trend sparkline (recharts) — mock weekly series
- **Google AI Insights Dock** (right side / inline): 4–6 AI-generated cards ("Profile visibility up 12%", "Weekend posts perform best", "2 negative reviews need attention", "AI recommends a local campaign"). Generated on mount via edge function with a deterministic mock context.
- "Connect Google" empty-state CTA if not "connected" (local state only).

### 2. Google Ads AI — `/dashboard/growth/ads`
- Campaign list (mock cards: name, status, CPC, CTR, conversions, AI score)
- "New AI Campaign" wizard modal: business description → AI returns `{ headlines[], descriptions[], keywords[], audience, budget, adGroups[] }` via structured output
- Per-campaign drawer: AI-suggested optimizations, CTR/CPC prediction bar

### 3. Google Analytics AI — `/dashboard/growth/analytics`
- GA4-style mocked charts: traffic, top pages, bounce, conversions, top sources
- AI summary panel: plain-English insights + 3 recommended actions, drop-off detection

### 4. Google Business Profile AI — `/dashboard/growth/profile`
- Profile card preview (name, category, hours, photos placeholder)
- **Google Post Generator** tabs: Offer / Announcement / Update / Event / Festive / Trending — AI generates post copy + suggested image prompt + hashtags
- "Schedule" button → writes to `scheduled_posts` with `platform = 'google_business'` (column already exists as text — no migration needed)
- Local SEO keyword suggestions list

### 5. Review AI — `/dashboard/growth/reviews`
- Mock review feed (positive/neutral/negative with sentiment chips)
- One-click "Generate Reply" — AI returns 3 tone variants (warm/professional/apologetic)
- Bulk auto-reply toggle (mock), multilingual selector
- Escalation flag for negative reviews

### 6. Local SEO — `/dashboard/growth/seo`
- Visibility score gauge, ranking table (mock), keyword opportunities, competitor row
- AI "Improve my ranking" → bullet recommendations

### 7. Local Business AI Agent — `/dashboard/growth/agent`
- Chat-style agent UI (reuses existing AI generator chat patterns) with quick-action chips: "Optimize profile", "Generate week of posts", "Reply to all reviews", "Suggest campaign", "Audit SEO"
- Streamed responses via edge function

### 8. Connect Google — `/dashboard/growth/connect`
- Mock connect cards: Analytics / Ads / Business Profile / YouTube / Search Console
- Toggling "Connect" sets a localStorage flag → other screens flip from empty state to populated mock data

## Backend

One new edge function: `supabase/functions/growth-ai/index.ts`
- Routes by `action`: `insights | ads_campaign | analytics_summary | post_generator | review_reply | seo_recommendations | agent_chat`
- Uses Lovable AI Gateway, model `google/gemini-3-flash-preview`, `Output.object` (Zod) for structured actions, `streamText` for `agent_chat`
- Reads `LOVABLE_API_KEY` (already configured). No new secrets.
- CORS headers; no JWT verification needed (`verify_jwt = false` default).

No DB migrations required. `scheduled_posts.platform` is free-form text so Google Business posts piggyback. If the user later wants persistence for ads/reviews, we add tables in a follow-up.

## UI / design system
- Reuse existing tokens: `bg-gradient-hero`, `shadow-elegant`, `shadow-card`, glassmorphism cards, orange primary `hsl(22 100% 55%)`.
- Bento density matches DashboardHome (already standardized).
- Compact analytics cards, AI suggestion bubbles (rounded pill with `Sparkles` icon + orange glow), campaign preview cards.
- Framer Motion entry: `initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}` per card with staggered delays.
- AmbientBackdrop already global via DashboardLayout.

## Sidebar / navigation
Add to `DashboardLayout.tsx` nav array (after Analytics):
- `{ icon: Megaphone, label: "Growth", path: "/dashboard/growth" }`

Plus a small secondary nav (chip bar) inside Growth pages for the 7 sub-routes.

## Files to add (new)

```text
src/pages/growth/
  GrowthHub.tsx
  GoogleAds.tsx
  GoogleAnalyticsAI.tsx
  BusinessProfile.tsx
  Reviews.tsx
  LocalSEO.tsx
  GrowthAgent.tsx
  ConnectGoogle.tsx

src/components/growth/
  GrowthNav.tsx                  (sub-route chip bar)
  GoogleInsightsDock.tsx
  KpiTile.tsx
  AdsCampaignCard.tsx
  AdsWizardModal.tsx
  AnalyticsChartCard.tsx
  PostGeneratorPanel.tsx
  ReviewCard.tsx
  ReviewReplyDrawer.tsx
  SeoGauge.tsx
  AgentChat.tsx
  ConnectCard.tsx

src/lib/growth/
  mockData.ts                    (mock metrics, reviews, campaigns, GA series)
  growthApi.ts                   (client wrapper around growth-ai edge function)

supabase/functions/growth-ai/index.ts
```

Files to edit:
- `src/App.tsx` — register 8 routes
- `src/components/DashboardLayout.tsx` — add Growth nav entry
- `src/components/dashboard/MobileDock.tsx` — add Growth icon if room

## Out of scope (explicit)
- No real Google OAuth, no Ads/Analytics/GBP API calls
- No new DB tables or migrations
- No changes to existing dashboard pages beyond adding the nav link
- No payments / pricing changes
- Comment & DM reply agent (item 12) — reuses GrowthAgent UI; a dedicated multi-platform inbox is deferred

## Verification
- `tsc --noEmit` clean, ESLint clean (no `any`)
- Manual click-through: visit each `/dashboard/growth/*` route, trigger one AI action per page, confirm streamed/structured output renders
- Edge function smoke test via curl for each `action`
