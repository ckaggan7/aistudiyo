# AISTUDIYO — Ultra-Premium AI OS Rebuild

Full rebrand + restructure into AISTUDIYO: a cinematic, AI-native platform with a **Matte Black + Burning Orange** identity. Marketing site and dashboard are rebuilt; current waitlist gate is replaced with real auth; new modules ship with backend.

Because the scope is large, work ships in 5 phases. Each phase is independently usable. Phase 1 + 2 ship in the first build; you approve before each subsequent phase.

---

## Visual identity

**Dark theme (primary, cinematic):**
- bg `#050505`, surface `#0D0D0D`, glass `rgba(255,255,255,0.04)`, border `rgba(255,255,255,0.08)`
- Primary `#FF6B00`, secondary `#FF8A00`, glow `#FFB347`
- Text `#FFFFFF` / `#A1A1AA`
- Gradients: orange → amber, orange → red-orange, black → graphite, radial orange glow
- Sora (headlines), Inter (body)

**Light theme (default kept per earlier answer):** existing warm Apple palette, retuned to share the same orange primary so brand feels consistent across both.

Working theme toggle (localStorage + OS preference). Dark theme is what most marketing/dashboard screenshots will showcase.

## Phase 1 — Design system & shell

- Rewrite `index.css` tokens for the orange + black system (dark) and refresh light tokens to match brand.
- Tailwind config: extend with `orange-glow`, `graphite`, gradient utilities, glow shadows, animated keyframes (pulse-ring, shimmer, marquee, gradient-shift, float).
- Add Sora via Google Fonts; keep Inter.
- Reusable primitives: `GlowCard`, `GlassContainer`, `FloatingPanel`, `GradientButton`, `NeuralBackground`, `AnimatedCounter`, `AIPulseRing`, `MarqueeRow`, `OrangeOrb`, `GridBackdrop`.
- Framer Motion presets: `fadeUp`, `hoverLift`, `cursorGlow` (mouse-reactive radial), animated borders.
- Theme toggle component + `useTheme` hook.

## Phase 2 — Marketing site rebuild

Replace current public pages with the new AISTUDIYO experience.

- `/` Landing — full sequence:
  1. Floating glass navbar (Platform · Solutions · AI Stack · Use Cases · Developers · Community · Pricing) + Login / Start Building, blur on scroll, orange edge glow.
  2. Cinematic hero: massive Sora headline "Build the Future with AI Intelligence", neural grid + particle field + radial orange glow, right-side floating dashboard mock with mini charts and live "AI Generated / Workflow Running / WhatsApp Live / Agent Active" notification cards.
  3. AI Ecosystem grid (8 cards: Automation Engine, Content Studio, WhatsApp AI OS, Campaign Builder, Community Engine, Analytics Intelligence, Agent Marketplace, Creator Monetization Stack) — gradient borders, glow hover, mini stats.
  4. Live product experience split section with interactive Recharts dashboard preview.
  5. Infinite AI Tools marquee (10 tools) with hover-pause and glow borders.
  6. Stats band (12M+ AI Tasks, 500K+ Users, 98% Accuracy, 120+ Integrations, 4.9/5, 2M+ Messages) with animated counters.
  7. Testimonials — floating glass cards, founder avatars, company logos.
  8. Pricing — Starter / Growth (highlighted) / Enterprise; orange-glow outlines, AI credits, WhatsApp limits, seats, automation access.
  9. Final CTA — "Your AI Operating System Starts Here." with orange glow sphere.
  10. Multi-column futuristic footer with orange separators.
- `/contact` reskinned.
- Retire `/signup` waitlist UX (data preserved); CTAs route to `/auth`.

## Phase 3 — Authentication

Replace waitlist gate with real auth.

- `/auth` page: email + password (sign in / sign up tabs) + Google sign-in via managed Lovable Cloud OAuth.
- `/reset-password` page.
- `profiles` table (display_name, avatar_url, workspace_name, plan), auto-created via trigger.
- `user_roles` table + `app_role` enum (`admin`, `member`) + `has_role` security-definer function.
- `ProtectedRoute` wrapper; dashboard requires auth.
- `onAuthStateChange` listener set up before `getSession`.
- `waitlist` table kept; UI removed.

## Phase 4 — Dashboard shell & restructured IA

- New floating glass sidebar (shadcn Sidebar, collapsible to icon dock):
  Dashboard · AI Workspace · AI Agents · Campaign Studio · Content Lab · WhatsApp Engine · Analytics · Community · Integrations · Automation · Billing · Settings.
- Top control bar: global search, AI command input (⌘K), notifications, workspace switcher, team avatars, profile, theme toggle.
- Retire current routes (Sticker Generator, Trending Templates, Branding CRM, Image Studio, Design Studio, Content Calendar, Media Library, Trend Engine). Their AI capabilities fold into Content Lab + AI Workspace.
- Dashboard home:
  - 6 premium KPI cards (Revenue, AI Usage, Active Campaigns, WhatsApp Reach, Automation Score, User Engagement) with sparklines, trend deltas, animated counters.
  - **AI Command Center** centerpiece: prompt box, workflow launcher, AI recommendations, automation toggles, execution logs ("Jarvis meets Mission Control").
  - AI Agent panels (Marketing/Sales/Community/Content/WhatsApp) with online indicators, live task progress, neural pulse animation.
  - Quick action grid (Create Campaign, Generate Content, Launch Broadcast, Create Agent, Schedule Workflow, Analyze Audience).
  - Realtime activity timeline.
  - Mobile: bottom nav + floating action button; tablet adaptive grids.

## Phase 5 — Modules + backend

Each module ships pages, schema, RLS, and edge functions where needed.

1. **AI Workspace** — prompt playground (Lovable AI: Gemini 3 Flash for text, Nano Banana for images). Table: `workspace_runs`.
2. **Content Lab** — captions, scripts, hashtags, image generation. Reuses existing `generate-content` + `generate-image` edge functions; adds `content_assets`.
3. **AI Agents** — create/configure agents (name, system prompt, model, tools). Tables: `agents`, `agent_runs`. Edge function: `run-agent`.
4. **Campaign Studio** — name, channel, audience, schedule, status. Table: `campaigns`.
5. **WhatsApp Engine** — broadcast composer, contacts, templates. Tables: `whatsapp_contacts`, `whatsapp_broadcasts`, `whatsapp_messages`. Edge function: `send-whatsapp` stubbed until provider key (Meta Cloud API or Twilio) is added later.
6. **Automation** — linear workflow builder (trigger → steps → action). Tables: `workflows`, `workflow_runs`. Edge function: `execute-workflow`.
7. **Analytics** — Recharts dashboards (line, area, funnel, heatmap) over the above tables.
8. **Community** — public posts/announcements feed. Table: `community_posts`.
9. **Integrations** — connect cards (WhatsApp provider, Slack, Google, Stripe). Table: `integrations`.
10. **Billing** — read-only plan view; Stripe wiring deferred until requested.
11. **Settings** — profile, workspace, theme, danger zone.

All tables: RLS scoped to `user_id = auth.uid()`; admin overrides via `has_role`.

---

## Technical details

- **Stack:** existing React 18 + Vite + Tailwind + Framer Motion + shadcn/ui + Lucide + Recharts. No new heavy deps; small additions: `embla-carousel-autoplay` (already in shadcn ecosystem) for marquee if needed.
- **Cursor-reactive cards:** lightweight pointermove → CSS variable for radial gradient (no extra lib).
- **Particle/neural background:** custom canvas component, throttled, paused off-screen.
- **AI:** text → `google/gemini-3-flash-preview`; images → `google/gemini-3.1-flash-image-preview`. Lovable AI Gateway, no extra keys.
- **WhatsApp:** schema + UI built; send call stubbed behind provider key.
- **Folder structure:**
  ```text
  src/
    components/
      brand/        Logo, GradientMesh, NeuralBackground, OrangeOrb
      marketing/    Navbar, Hero, EcosystemGrid, LiveDashboardPreview,
                    ToolsMarquee, StatsBand, Testimonials, Pricing,
                    FinalCTA, Footer
      dashboard/    Sidebar, Topbar, KPICard, AICommandCenter,
                    AgentPanel, ActivityTimeline, QuickActions
      ui/           (existing shadcn)
    pages/
      Landing.tsx, Pricing.tsx, Contact.tsx, Auth.tsx, ResetPassword.tsx
      dashboard/    Home, Workspace, Agents, ContentLab, WhatsApp,
                    Campaigns, Analytics, Automation, Community,
                    Integrations, Billing, Settings
    hooks/          useAuth, useTheme, useWorkspace, useCursorGlow
    lib/            ai.ts, supabase helpers
  supabase/functions/
    generate-content/ (kept), generate-image/ (kept),
    run-agent/, send-whatsapp/, execute-workflow/
  ```
- **Migrations:** Phase 3 (profiles + roles + trigger), Phase 5.x per module.
- **Memory:** update `mem://` index — new positioning ("AI operating system"), new design tokens (orange + black), new IA, retired modules.

---

## Out of scope for this plan

- Stripe billing integration (UI placeholders only).
- Real WhatsApp provider credentials.
- Native mobile app shell (responsive web only).
- Visual node-graph workflow editor (linear builder first).

---

## What ships first

Approve to start with **Phase 1 (orange + black design system, theme toggle, primitives)** and **Phase 2 (full new landing + Pricing + Contact pages)**. Phases 3–5 follow in order, each with its own confirmation point.