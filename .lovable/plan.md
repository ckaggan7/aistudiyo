## Goal

Replace the marketing homepage at `/` with a cinematic GSAP **story-scroll** experience (8 fullscreen pinned sections) adapted for AI creators, and bring the same cinematic visual language into the dashboard so they feel like one product.

## Scope

**In**
- Install `gsap` + `@gsap/react`
- New reusable `src/components/ui/story-scroll.tsx` (FlowArt + FlowSection, exactly the uploaded structure)
- New `/` page: 8 cinematic fullscreen sections (hero → final CTA), creator-themed
- Dashboard visual polish to match (edge lighting, typography scale, gradient buttons) — no structural changes
- Performance: respect `prefers-reduced-motion`, lazy section content, GPU-friendly transforms

**Out**
- New backend tables or auth flow changes
- Replacing the dashboard layout/cards (only visual polish)
- Theme system rewrite (already built; reused)
- AI agent / generator logic

## Section content (creator-adapted, no art references)

```text
01 — HERO        bg: matte black + orange radial glow + floating particles
                 H1: AISTUDIYO — The AI Operating System for Social Media Creators
                 sub: Create viral content, launch AI agents, automate growth.
                 CTAs: Start Creating (→/signup), Watch Demo (scroll to §2)
                 right: floating glass dashboard preview card stack

02 — QUICK CREATE  bg: dark graphite + orange ambient
                   H2: Create Faster. Grow Smarter.
                   Animated typing prompt cycler + glowing cursor + chips
                   ("Create Instagram carousel", "Viral hooks", "LinkedIn post"...)

03 — AI AGENTS   bg: pure black + neon edge gradients
                 H2: Meet Your AI Social Media Team
                 5 floating glass cards: Instagram Growth, LinkedIn Branding,
                 Viral Hook, Trend Hunter, Campaign Strategist (status pulse)

04 — CONTENT ENGINE  bg: warm orange cinematic
                     H2: One Prompt. Infinite Content.
                     Animated flow chain: Prompt → Post → Carousel → Thread
                     → Reel → Caption → CTA → Hashtags (SVG flow lines, framer)

05 — TRENDS      bg: dark premium UI
                 H2: AI-Powered Trend Intelligence
                 Two opposing marquees of trending hooks/hashtags
                 + virality score chips with pulse dots

06 — BRAND VOICE bg: deep black + orange ambient
                 H2: AI That Understands Your Brand
                 Neural-network style SVG with 5 orbiting "memory" nodes
                 (Tone, CTA, Audience, Visual, Personality)

07 — SOCIAL PROOF  bg: graphite black
                   Stats grid: 1M+ generations · 100K+ creators ·
                   10M+ reach · 500K+ hooks
                   3 creator testimonial cards (glass)

08 — FINAL CTA   bg: orange→black cinematic blend, massive glow sphere
                 H2: Your AI Social Media Team Starts Here.
                 CTAs: Launch Workspace (→/dashboard), Explore AI Agents
                 (→/dashboard/agents)
```

## Files

**New**
- `src/components/ui/story-scroll.tsx` — copy of the uploaded `FlowArt` + `FlowSection`, unmodified API
- `src/components/landing/HeroScene.tsx` — Section 1 (with right-side floating preview)
- `src/components/landing/QuickCreateScene.tsx` — Section 2 (typewriter prompt)
- `src/components/landing/AgentsScene.tsx` — Section 3 (5 agent cards)
- `src/components/landing/ContentEngineScene.tsx` — Section 4 (flow chain)
- `src/components/landing/TrendsScene.tsx` — Section 5 (marquees)
- `src/components/landing/BrandVoiceScene.tsx` — Section 6 (memory nodes)
- `src/components/landing/SocialProofScene.tsx` — Section 7 (stats + testimonials)
- `src/components/landing/FinalCTAScene.tsx` — Section 8

**Edited**
- `src/pages/LandingPage.tsx` — replace entire body with `<FlowArt>` wrapping the 8 scene sections; keep top-level helmet/title if any; preserve route at `/`
- `src/index.css` — add small utilities only if needed (`.cinematic-bg`, particle keyframes). Existing `.edge-glow`, `.btn-premium`, gradients, theme tokens already cover most of it.
- `package.json` — add `gsap`, `@gsap/react` via `bun add`

**Untouched**
- `/dashboard/*` route structure
- Existing `WhatsNewCarousel`, `ProfileMenu`, theme system, `useTheme`
- Edge functions, Supabase schema

## Technical details

### Story-scroll integration
- Paste `story-scroll.tsx` verbatim (`'use client'` removed — Vite/React).
- Each scene renders inside `<FlowSection style={{ backgroundColor: ... }}>` so the existing rotation/pin logic works untouched.
- Section content uses `clamp()` typography to match the uploaded scale: `text-[clamp(3rem,10vw,11rem)]` for H1/H2.

### Animations
- GSAP ScrollTrigger handles the cinematic rotate-from-30° + pin behavior (provided by `FlowArt`).
- Framer Motion handles in-section micro-interactions (typewriter, marquee, card hover lift).
- Particles: lightweight pure-CSS animated `radial-gradient` blobs (no canvas) for perf.
- Reduced motion: the existing hook in `FlowArt` already disables transitions; scenes also gate framer animations behind a `prefers-reduced-motion` check.

### Performance
- Each scene component is a default export and code-split with `React.lazy` + `Suspense` (loader = blank section) inside `LandingPage.tsx`.
- `will-change-transform` only on rotating inner (already in FlowArt).
- No backend calls on landing.

### Routing
- `/` stays `<LandingPage />` (already declared in `App.tsx`).
- "Start Creating" → `/signup` (waitlist), "Launch Workspace" → `/dashboard`.

### Dashboard visual match (light touches only)
- Reuse existing `edge-glow` + `btn-premium`. No layout changes.
- Confirm the Quick Create bar uses the same gradient/edge as Hero scene (it already does via theme tokens).
- Upgrade primary CTA in dashboard to `variant="premium"` where it currently uses the inline `bg-gradient-hero` (already done previously).

## Acceptance

- `/` shows 8 fullscreen sections with cinematic pin + rotate transitions
- All copy is creator/AI-focused (no "art world" residue from demo)
- Buttons everywhere use gradient + glow + lift treatment
- Theme switch on `/dashboard` still recolors all gradients (themes already use semantic vars, scenes will too)
- `prefers-reduced-motion` users see a clean static stacked version
- No regressions on `/dashboard`, `/signup`, `/login`, super-admin routes
- Lighthouse: keep performance ≥ 85 on landing (no canvas, lazy scenes)

## Out of scope / deferred

- Real video for "Watch Demo" → button scrolls to §2 for now
- 3D / WebGL particles
- Animated stat counters wired to real data (use static numbers)
- Mobile-specific story-scroll choreography beyond what `FlowArt` already provides
