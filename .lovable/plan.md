## Goal

Ship **AISTUDIYO Ads Academy** — a cinematic, gamified learning experience at `/dashboard/academy` that combines MasterClass polish with Duolingo-style progression and an AI mentor powered by Lovable AI. MVP is frontend-rich with mock content + a live AI mentor edge function; persistence (XP, completions) is local-storage for now and can be migrated to the database later.

## Scope (MVP)

Single new route `/dashboard/academy` plus a small set of sub-routes for track and course detail, the AI mentor, and the practice lab. Everything else (community, video CDN, real cert PDFs) is stubbed visually but not backed by infra in this pass — clearly marked so we can grow into it.

## Routes

- `/dashboard/academy` — Academy Home (all 10 sections)
- `/dashboard/academy/track/:trackId` — Track detail with course list + progress ring
- `/dashboard/academy/course/:courseId` — Course player (lesson list, video card, quiz, AI mentor side panel)
- `/dashboard/academy/mentor` — Full-page AI Mentor chat
- `/dashboard/academy/lab` — Practice Lab (ad copy → AI score)
- `/dashboard/academy/missions` — All missions + leaderboard
- `/dashboard/academy/certificate/:certId` — Shareable certificate preview

Add `Academy` to the sidebar in `DashboardLayout.tsx` (between Growth and Settings) using a `GraduationCap` icon.

## File layout

```text
src/pages/academy/
  AcademyHome.tsx
  TrackDetail.tsx
  CourseDetail.tsx
  MentorPage.tsx
  PracticeLab.tsx
  MissionsPage.tsx
  CertificatePage.tsx

src/components/academy/
  AcademyHero.tsx              (cinematic hero, particles, orb, CTAs)
  LearningTracks.tsx           (bento of 8 tracks with progress rings)
  TrackCard.tsx                (single track tile)
  FeaturedCoursesCarousel.tsx  (horizontal scroll of course cards)
  CourseCard.tsx               (thumbnail, difficulty, duration, progress, rating, cert badge)
  AIMentorPanel.tsx            (embedded chat panel — reused on home + course pages)
  PracticeLabPreview.tsx       (home-page preview tile, links to /lab)
  CertificationsShowcase.tsx   (5 levels with locked/unlocked states)
  CertificatePreview.tsx       (premium SVG-styled certificate card)
  VideoLearningHub.tsx         (floating video cards with hover-play thumbs)
  CreatorMissions.tsx          (gamified challenges + XP rewards)
  CommunityFeed.tsx            (creator wins / discussions — mocked)
  ProgressDashboard.tsx        (XP, level, streak, recommendations — for dashboard home + academy)
  AcademyPageShell.tsx         (matte-black cinematic shell with edge gradients + particles)
  XpBadge.tsx, LevelRing.tsx, DifficultyChip.tsx  (primitives)

src/lib/academy/
  tracks.ts        (8 tracks with metadata, lessons, gradients, icons)
  courses.ts       (7+ featured courses, lessons, quizzes)
  missions.ts      (mission templates + XP rewards)
  certificates.ts  (5 cert levels + unlock criteria)
  videos.ts        (mock short-form lessons)
  progress.ts      (typed hooks: useXp, useCompletions, useLevel — localStorage-backed)
  scoring.ts       (client-side adapter that calls the academy-ai edge function for ad scoring)

supabase/functions/academy-ai/index.ts
  Actions: "mentor_chat", "lab_score", "generate_exercise"
  Mirrors the structure of growth-ai (gateway + JSON-tool-call), model: google/gemini-3-flash-preview
```

## Section-by-section build

1. **Hero** — `AcademyHero` in `AcademyPageShell`. Matte-black bg, two animated radial-gradient blobs at the corners, drifting particles (CSS keyframes, no libs), reused `AIOrb` on the right with course-card poster stack floating around it. Headline "Ads Academy — Learn. Create. Grow." Two CTAs: Start Learning (scrolls to tracks), Explore Courses (scrolls to courses). Right-side mini stats: "12,400+ creators learning · 87 courses · 5 certifications".

2. **Learning Tracks** — `LearningTracks` renders 8 `TrackCard`s in a `grid-cols-2 lg:grid-cols-4` bento. Each card: gradient icon, title, lesson count, progress ring (from `useCompletions`), level chip, glow on hover. Click → `/dashboard/academy/track/:id`.

3. **Featured Courses** — `FeaturedCoursesCarousel` is a snap-x horizontal scroll of `CourseCard`s with thumbnail (generated cinematic image asset or gradient placeholder), difficulty pill, duration, in-progress %, 5-star rating, cert badge if applicable.

4. **AI Mentor System** — `AIMentorPanel` (chat surface using AI Elements look — `Conversation`, `Message`, `MessageResponse`, `PromptInput`, `Shimmer`). Posts to `academy-ai` action `mentor_chat`. Schema returns `{ message, examples[], exercises[], next_actions[] }`. Examples and exercises render as tappable cards under the assistant message. Embedded in Academy Home as a compact panel and full-page at `/dashboard/academy/mentor`.

5. **Practice Lab** — `PracticeLab` page. User picks platform + objective, pastes ad copy / hook. We POST `lab_score` action. AI returns structured `{ hook_quality, ctr_potential, readability, engagement, platform_fit, overall, suggestions[] }` (0-100 each). UI shows animated score rings and a rewritten variant. Home gets `PracticeLabPreview` linking in.

6. **Certifications** — `CertificationsShowcase` shows 5 cards (Beginner Creator → AI Ads Specialist) with locked overlay until XP threshold. Each opens `/dashboard/academy/certificate/:id` with a premium SVG certificate using the user's display name, share buttons (copy link, LinkedIn intent URL, download as PNG via `html-to-image` — already plausible without new deps; if not present, use a print stylesheet instead. **No new deps without confirming.** Fallback: copy link + LinkedIn share only).

7. **Video Learning Hub** — `VideoLearningHub` floating cards with 9:16 cinematic thumbs, hover plays a muted preview (mp4 fallback to gradient if no asset). Mock metadata only; no real CDN.

8. **Creator Missions** — `CreatorMissions` lists active missions with progress bars, XP reward chips, and a "Claim" CTA that adds XP via `useXp`. Includes a small leaderboard (mocked top 5 creators).

9. **Community** — `CommunityFeed` mock cards: avatar, creator name, win/strategy snippet, kudos count. Marked "Coming soon — preview" badge.

10. **Academy Dashboard widget** — `ProgressDashboard` summarises XP, level, streak, completed courses, active missions, next recommended course. Rendered inside the Academy page top and exported so it can also drop into `DashboardHome` later (optional this pass: add a small `AcademySnapshot` tile to `DashboardHome` Band 5 next to `CoreActionCards` — **out of scope of this MVP** unless trivially small).

## AI mentor edge function (`academy-ai`)

New Supabase Edge Function modelled on `growth-ai`. Two actions for MVP:

- `mentor_chat` — schema: `{ message, examples[], exercises[{ title, prompt, difficulty }], next_actions[] }`. System prompt: senior creator-economy + paid-ads instructor; warm, confident, brief; always end with one practice exercise the user can attempt.
- `lab_score` — schema: 5 sub-scores + overall (0-100) + `suggestions[]` + `rewrite`.

Model: `google/gemini-3-flash-preview`. Uses existing tool-calling JSON pattern. CORS as in `growth-ai`. `verify_jwt` left at platform default.

## Visual system

Reuse existing tokens (`bg-gradient-hero`, `text-gradient-hero`, `card-bento`, `chip`, `shadow-glow`, `pulse-dot`, `marquee-track`). Academy pages use a darker cinematic surface only inside `AcademyPageShell` (matte black + edge gradients) while sidebar/header stay app-default. Typography: oversized cinematic headings via existing `font-bold tracking-tight` + `text-5xl/6xl`. Progress rings: pure SVG `circle` with stroke-dasharray, no new dep. Particles: 16 absolute-positioned divs with `animate-float` keyframe added to `tailwind.config.ts` (keyframe-only addition — no new utilities).

## Progress / XP persistence

- `useXp` and `useCompletions` hooks read/write namespaced localStorage keys (`academy.xp.v1`, `academy.completions.v1`, `academy.streak.v1`). Pure client. Hydrate-safe.
- Note in code that this can be moved to Supabase later (table sketch: `academy_progress(user_id, xp int, completed_courses jsonb, completed_lessons jsonb, streak_days int, last_active_at)`). **Not creating that table in this MVP.**

## Mobile

- Tracks become 2 cols.
- Featured courses keep snap-x scroll.
- AI mentor and Practice Lab are single-column with sticky bottom composer.
- Hero collapses orb under the headline.
- Mission cards stack with progress bars full width.

## Out of scope (explicit)

- Real video hosting / playback (mock thumbs only).
- Real community backend (mocked feed only).
- DB-backed XP/completions (localStorage for MVP).
- Certificate PDF generation (PNG export only if a tool is already available; otherwise share + copy link).
- Course authoring tools, admin CMS for courses.
- Adding `AcademySnapshot` into `DashboardHome` (can be a follow-up).
- Auth changes, role changes, billing.

## Verification

- `tsc --noEmit` clean.
- All routes load at 1188px viewport and at mobile width without overflow.
- AI mentor returns a structured response (manual smoke test) and renders examples/exercises.
- Practice Lab returns score rings + rewrite for a sample ad.
- Sidebar shows new Academy entry with `GraduationCap`.

## Technical notes

- Edge function deploys automatically; we'll call it via `supabase.functions.invoke("academy-ai", { body: { action, prompt, context } })`.
- No new npm packages required for MVP. If a thumbnail-export is desired we'll defer or ask before adding `html-to-image`.
- All colors via semantic tokens; cinematic black uses existing `--background`/`--foreground` inverted via a local CSS class scoped to `AcademyPageShell` (no global theme change).
