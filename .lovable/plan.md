# Ads Academy — Final Wiring & Integration

Scope: connect what exists. Reuse the 17 components and 7 pages already in `src/components/academy/` and `src/pages/academy/`. No rebuilds.

## 1. Route wiring (`src/App.tsx`)

Add Academy routes under `/dashboard/academy/*`, wrapped in `DashboardPage` (sidebar + auth + workspace shell), using `React.lazy` + `Suspense` so the Academy bundle only loads on entry.

```text
/dashboard/academy                 -> AcademyHome (existing)
/dashboard/academy/tracks          -> AcademyTracks (new thin wrapper)
/dashboard/academy/track/:id       -> TrackDetail (existing)
/dashboard/academy/courses         -> AcademyCourses (new thin wrapper)
/dashboard/academy/course/:id      -> CourseDetail (existing)
/dashboard/academy/practice-lab    -> PracticeLab (existing)
/dashboard/academy/mentor          -> MentorPage (existing)
/dashboard/academy/missions        -> MissionsPage (existing)
/dashboard/academy/certificates    -> AcademyCertificates (new thin wrapper)
/dashboard/academy/certificate/:id -> CertificatePage (existing)
/dashboard/academy/videos          -> AcademyVideos (new thin wrapper)
/dashboard/academy/community       -> AcademyCommunity (new thin wrapper)
/dashboard/academy/progress        -> AcademyProgress (new thin wrapper)
```

Each new wrapper page is ~20 lines: `<AcademyPageShell>` + section header + existing component (`LearningTracks`, `FeaturedCoursesCarousel`, `CertificationsShowcase`, `VideoLearningHub`, `CommunityFeed`, `ProgressDashboard`).

## 2. Sidebar entry (`src/components/DashboardLayout.tsx`)

Insert one item between Trends and Analytics:

```ts
{ icon: GraduationCap, label: "Academy", path: "/dashboard/academy" }
```

Update the active-state check so any `/dashboard/academy/*` route keeps the entry highlighted (`pathname.startsWith(path)` for this entry).

## 3. Dashboard Home bento card

New compact component `src/components/dashboard/AcademyProgressCard.tsx` in the existing `card-bento` style:

- `LevelRing` for XP / next level (reuses existing SVG component)
- Active track name + one-line mentor tip (read from `lib/academy/tracks.ts`)
- Certificates earned count (from `useCompletions`)
- "Continue learning" button → `/dashboard/academy`
- Reads progress from existing `useXp` / `useCompletions` hooks

Slot it into `src/pages/DashboardHome.tsx` as a new compact row between the Discover band and the Plan band — keeps current layout untouched.

## 4. Visual consistency sweep (light, not a redesign)

Pass over existing Academy components only to:
- Replace any stray hardcoded colors (`bg-black`, hex values) with semantic tokens (`bg-background`, `card-bento`, `primary`, `muted`, `accent`).
- Tone down oversized headings if any exceed the dashboard's `text-3xl` baseline.
- Soften glow intensity where it visually breaks from the dashboard look.

No new gradients, no new animations, no structural changes.

## 5. Out of scope (deliberately not doing)

- Rebuilding AI Mentor, Practice Lab, Certificates, Course player, Video Hub, or Community UIs — they already exist and are good per the brief.
- New animation systems, shaders, or motion frameworks.
- Backend / DB / migrations — XP and progress remain in `localStorage` per existing `progress.ts`.
- Mobile redesign — existing responsive grids handle it; we only verify.

## Technical details

New files (7):
- `src/pages/academy/AcademyTracks.tsx`
- `src/pages/academy/AcademyCourses.tsx`
- `src/pages/academy/AcademyCertificates.tsx`
- `src/pages/academy/AcademyVideos.tsx`
- `src/pages/academy/AcademyCommunity.tsx`
- `src/pages/academy/AcademyProgress.tsx`
- `src/components/dashboard/AcademyProgressCard.tsx`

Edited files (3):
- `src/App.tsx` — lazy imports + 12 Academy routes
- `src/components/DashboardLayout.tsx` — sidebar entry + active-state tweak
- `src/pages/DashboardHome.tsx` — slot the new bento card

Lazy pattern:
```tsx
const AcademyHome = lazy(() => import("./pages/academy/AcademyHome"));
// wrap Academy routes in <Suspense fallback={<div className="p-8 animate-pulse" />}>
```

## Acceptance

- Sidebar shows "Academy" between Trends and Analytics; click lands on `/dashboard/academy`.
- All 12 Academy routes resolve (no 404).
- Academy pages render inside the dashboard shell with sidebar visible.
- Dashboard Home shows a compact Academy bento with XP ring + "Continue learning".
- Academy code is split out of the main dashboard bundle.
