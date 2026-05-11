# Announcement Scroll Banner — Dashboard

Add a Hero, horizontally scrolling announcement banner at the top of the dashboard (above the Hero) that highlights new/active modules and links each one to its destination.

## Items & links


| Label                | Route                     |
| -------------------- | ------------------------- |
| Agents               | `/dashboard/agents`       |
| Workflow             | `/dashboard/workflow`     |
| Branding CRM         | `/dashboard/branding-crm` |
| Calendar             | `/dashboard/calendar`     |
| New Image Gen Engine | `/dashboard/studio/image` |
| ChatGPT 2.0          | `/dashboard/chat`         |


(Final routes will be matched to what's defined in `App.tsx`; missing ones default to `/dashboard`.)

## Component

New file `src/components/dashboard/AnnouncementBanner.tsx`:

- Full-width strip, ~36px tall, rounded-2xl, `border-border/40`, glass background (`bg-card/60 backdrop-blur`), subtle orange glow on left edge.
- Left side: small pulsing dot + `NEW` chip (orange).
- Right side: marquee track with the 6 items as `<Link>` chips (icon + label), separated by a thin dot divider.
- Marquee: pure CSS `@keyframes scroll-x` (translateX -50%), duplicated track for seamless loop, ~30s duration, `animation-play-state: paused` on hover.
- Respects `prefers-reduced-motion` (no animation, items wrap).
- Each chip: `hover:text-primary`, `hover:bg-primary/10`, focus ring for a11y.

## Integration

- In `src/pages/DashboardHome.tsx`, import and render `<AnnouncementBanner />` as the first child inside the `max-w-6xl` wrapper, above the Hero section, with `mb-4`.

## Styling

- Use existing semantic tokens (`primary`, `border`, `card`, `muted-foreground`). No new colors.
- Keyframes added inline via a `<style>` tag inside the component (scoped class names) to avoid touching `index.css`.

## Out of scope

- Backend-driven announcements (static list for now; trivial to swap to a `announcements` table later).
- Dismiss / per-user state.