# Fix Errors, Bugs & Missing Links — Navigation Audit

After a full sweep of the route table, sidebar, mobile dock, command palette, and outbound links, the app's routes themselves all resolve. The real bugs are **dead links** and **missing navigation entries**. No console errors and no 404s in network logs.

## Issues found

1. **Stale link `/dashboard/academy/lab`** (route is `/dashboard/academy/practice-lab`)
   - `src/components/academy/PracticeLabPreview.tsx`
   - `src/lib/academy/missions.ts` (mission `m5`)

2. **Sidebar missing core sections** (`src/components/DashboardLayout.tsx`)
   - No **Academy** entry (huge feature, only reachable via deep links)
   - No **Workflows** entry
   - No **Credits** entry

3. **Mobile dock outdated** (`src/components/dashboard/MobileDock.tsx`)
   - "Create" still points to `/dashboard/generator` (legacy redirect) instead of `/dashboard/studio`
   - No Academy access on mobile

4. **Command palette stale** (`src/components/CommandPalette.tsx`)
   - Lists "AI Generator" → `/dashboard/generator` (legacy); should be "Brand AI Studio" → `/dashboard/studio`
   - Missing: Academy, Academy Mentor, Practice Lab, Missions, Workflows, Growth, Credits

5. **Safety net**: catch-all `*` → `NotFound` already present (good).

## Fixes

### Link corrections
- `PracticeLabPreview.tsx`: `/dashboard/academy/lab` → `/dashboard/academy/practice-lab`
- `missions.ts` mission `m5.to`: `/dashboard/academy/lab` → `/dashboard/academy/practice-lab`

### Sidebar (`DashboardLayout.tsx`)
Add 3 entries (with appropriate lucide icons), keeping order coherent:
- `GraduationCap` · **Academy** · `/dashboard/academy` (place after Growth)
- `Workflow` · **Workflows** · `/dashboard/workflows` (place after Agents)
- `Coins` · **Credits** · `/dashboard/credits` (place above Settings)

### Mobile dock (`MobileDock.tsx`)
- Replace "Create" target `/dashboard/generator` → `/dashboard/studio` (icon `Brain`, label "Studio")
- Replace "Trends" slot with `GraduationCap` · **Academy** · `/dashboard/academy` (Trends remains accessible from sidebar / palette)

### Command palette (`CommandPalette.tsx`)
- Replace "AI Generator" entry with "Brand AI Studio" → `/dashboard/studio` (icon `Brain`)
- Append entries: Academy, Academy Mentor (`/dashboard/academy/mentor`), Practice Lab (`/dashboard/academy/practice-lab`), Missions (`/dashboard/academy/missions`), Workflows, Growth Hub (`/dashboard/growth`), Credits

## Out of scope
- No redesign, no new pages, no backend/schema changes.
- Routes themselves untouched — only link targets and navigation surfaces.

## Verification
After edits: visit each updated nav target via the preview and confirm it renders without 404 or console errors.
