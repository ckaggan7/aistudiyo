
# Phase 2 — Academy → AI Creator Growth University

Goal: Make Academy feel like a connected growth journey inside AISTUDIYO, not a standalone LMS. Reuse the existing Academy structure; add an experience layer (mentor, missions, labs, personalization) and wire it deeply into Studio, Agents, Growth, Calendar, Analytics.

## 1. Floating AI Mentor (global experience layer)

- New `src/components/academy/MentorDock.tsx` — floating bubble + slide-over panel mounted in `DashboardLayout` (visible across all `/dashboard/*` routes).
- Reuses `AIMentorPanel` + existing `academy-ai` edge function (`mentor_chat`).
- Context-aware: passes current route, current brand profile (`brand_profile.memory`), last generated content pack, and user XP/level into `context`.
- Quick prompts adapt per route: on `/dashboard/studio` → "Review my caption"; on `/dashboard/growth` → "Audit my Google profile"; on `/dashboard/analytics` → "Explain my drop in reach".
- Voice-ready scaffold: mic button using Web Speech API (recognition only, no backend needed).
- Persisted open/closed state in localStorage; hidden on landing/auth routes.

## 2. Learn → Create deep linking

Connect lessons and missions to real product workflows.

- Extend `src/lib/academy/courses.ts` lesson shape with optional `action: { label, to, prefill? }`.
- New helper `src/lib/academy/launch.ts` — builds URLs like `/dashboard/studio?prefill=<base64-json>` and `/dashboard/image-studio?prefill=...`.
- `AIGenerator` (Studio) and `ImageStudio` read `?prefill=` on mount and seed prompt/platform/objective.
- Course detail (`CourseDetail.tsx`) gains a "Try it now in Studio" CTA per lesson.
- Missions in `MISSIONS` already deep-link; add `action.prefill` to send users into Studio with the right starter prompt.

## 3. Creator Missions (retention engine, real triggers)

- New table `creator_missions` (per-user mission state; replaces localStorage-only claims so XP persists).
- Auto-completion hooks fired from product actions:
  - First content pack created → completes "Create your first AI campaign".
  - 10 hooks generated → completes "Generate 10 viral hooks".
  - First post scheduled → completes "Publish your first content pack".
  - Google profile connected (when Growth wires it) → completes that mission.
- Rewards: XP (existing), AI credits (calls `adjust_user_credits` via new `mission-claim` edge function with server-side validation), badge unlocks, template unlocks (flag in `creator_missions.rewards`).
- Leaderboard: new `creator_xp` view aggregating completions; replaces hardcoded `LEADERBOARD`.

## 4. Certification system (shareable)

- Persist certificate issuance: new `certificates` table (track_id, issued_at, score, share_slug).
- Public route `/c/:slug` — server-rendered-friendly cert page with OG tags for LinkedIn/X share.
- "Share to LinkedIn" button using LinkedIn share URL with the cert page as target.
- Profile badge strip on `SettingsPage` showing earned certs + creator level.

## 5. AI Practice Labs

- Expand `PracticeLab.tsx` from one general lab into multiple lab types via `?type=`:
  - `ad-copy`, `hook`, `cta`, `gbp`, `reel-strategy`, `viral-hook-challenge`.
- Each lab: input form → calls `academy-ai` `lab_score` (already exists) with type-specific system prompt variants.
- Extend `academy-ai` SYSTEM_PROMPTS map with the 6 lab variants, keeping the same `lab_score` schema.
- Show animated score dials (CTR / engagement / virality / readability / conversion) and the AI rewrite. "Save best version → Studio" button uses the deep-link helper.

## 6. Cinematic Academy homepage

Refine `AcademyHome.tsx` (no rebuild):

- Replace top of `AcademyHero` with a Progress Hero band: XP ring (existing `LevelRing`), streak flame, "Continue [next lesson]" CTA, mentor suggestion line ("Today: try the Hook Lab — your last carousel scored 62").
- Add "Recommended missions" rail above current `LearningTracks`.
- Subtle ambient gradient + framer-motion entrance on hero only.

## 7. Community learning layer

- Extend `CommunityFeed` to read from new `community_posts` table (kind: campaign | story | prompt | experiment).
- Authenticated users can post (text + optional image_url + optional linked content_pack_id). Public read; owner write.
- "Top students this week" sidebar driven by `creator_xp` view.

## 8. AI personalization

- New `creator_profile` table: niche, business_type, skill_level (beginner|growth|advanced), goals[].
- One-time "Creator setup" modal on first Academy visit (3 quick taps).
- Personalization helper `src/lib/academy/personalize.ts` filters/orders `COURSES`, `TRACKS`, missions by skill level + niche.
- Mentor system prompt receives this profile in `context` for tailored coaching.

## 9. Video experience polish

- `VideoLearningHub` gets cinematic 16:9 thumbnails, hover autoplay (muted preview via `<video preload="metadata">` with poster), playlist groups (`AI Foundations`, `Hook Mastery`, `Growth Ops`), and an "AI picks for you" rail driven by personalization.

## 10. Creator XP / Levels

- Levels rendered from XP using existing `levelForXp` but mapped to named tiers:
  - Beginner Creator (0-499) → Growth Creator (500-1499) → AI Strategist (1500-3499) → Viral Creator (3500-7499) → AI Growth Master (7500+).
- Level badge shown in: sidebar profile, mentor dock header, certificate page, community posts.

## 11. Product integration touchpoints

- `DashboardHome` `AcademyProgressCard` already exists — add "Today's mission" + mentor tip line.
- Studio: small "Mentor review" button under generated caption → opens MentorDock with the caption pre-filled for `lab_score`.
- Growth: each KPI tile gets an "Explain this" link → MentorDock with KPI snapshot in context.
- Analytics: anomaly rows get "Coach me" → MentorDock.
- Calendar: empty days show "Plan with mentor" CTA.

## 12. Out of scope (this phase)

- No redesign of Studio, Growth, Agents, Analytics layouts beyond the small CTA hooks above.
- No real OAuth for LinkedIn share (URL share only).
- No video hosting changes — reuse existing video sources.
- No payments changes.

---

## Technical details

**New files**
- `src/components/academy/MentorDock.tsx`
- `src/lib/academy/launch.ts`, `src/lib/academy/personalize.ts`, `src/lib/academy/levels.ts`
- `src/components/academy/CreatorSetupModal.tsx`
- `src/components/academy/MissionRail.tsx`, `src/components/academy/ProgressHero.tsx`
- `src/pages/academy/labs/AdCopyLab.tsx`, `HookLab.tsx`, `CtaLab.tsx`, `GbpLab.tsx`, `ReelStrategyLab.tsx`, `ViralHookChallenge.tsx` (thin wrappers around a shared `LabRunner`)
- `src/pages/c/CertificatePublic.tsx` (public route `/c/:slug`)
- `supabase/functions/mission-claim/index.ts`

**Edited files**
- `src/components/DashboardLayout.tsx` — mount `MentorDock`.
- `src/App.tsx` — add `/c/:slug` and lab subroutes; route `creator setup` modal trigger.
- `src/pages/academy/AcademyHome.tsx` — swap hero for `ProgressHero`, add `MissionRail`.
- `src/pages/academy/PracticeLab.tsx` → become shared `LabRunner` consumed by lab pages.
- `src/components/academy/CreatorMissions.tsx` — drive from DB + reward badges.
- `src/components/academy/CommunityFeed.tsx` — DB-backed.
- `src/components/academy/VideoLearningHub.tsx` — autoplay-on-hover thumbnails + playlists.
- `src/pages/AIGenerator.tsx`, `src/pages/ImageStudio.tsx` — read `?prefill=`.
- `supabase/functions/academy-ai/index.ts` — add lab variants + accept richer `context` (route, brand memory, creator profile).

**Database (one migration)**
- `creator_profile(user_id pk, niche, business_type, skill_level, goals jsonb, ...)`.
- `creator_missions(user_id, mission_id, status, claimed_at, rewards jsonb, unique(user_id, mission_id))`.
- `certificates(id, user_id, track_id, issued_at, score, share_slug unique)`.
- `community_posts(id, user_id, kind, body, image_url, content_pack_id, created_at)`.
- View `creator_xp(user_id, xp, level)` aggregating from `creator_missions`.
- RLS: owner read/write on `creator_profile`, `creator_missions`, `certificates` (public select on `certificates` by `share_slug` only via security-definer function `get_public_certificate(slug)`); `community_posts` public select, owner write.

**Edge function**
- `mission-claim`: validates the action that completed the mission server-side (checks `content_packs`, `scheduled_posts`, etc. with the user's JWT), upserts `creator_missions`, awards XP + credits via `adjust_user_credits` only for whitelisted mission ids and amounts.

**Reuses (no changes)**
- `academy-ai` schemas, `LevelRing`, `XpBadge`, `AcademyPageShell`, existing course/track data files.
