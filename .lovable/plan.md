# Plan: Hero redesign + Image Studio consolidation

## 1. Redesign the Landing Hero (`src/pages/LandingPage.tsx`)

The current hero is busy: a 3-card stack illustration, multiple floating doodles, animated blobs, badge, two CTAs, and a social-proof row competing for attention. We'll move to a focused, modern single-column hero in line with our Apple-minimalist memory rule.

New hero composition:
- **Centered layout** (no left/right split), max-width ~960px.
- **Single ambient gradient backdrop** — one large breathing orb instead of two, plus a subtle noise/grid for depth. Fewer doodles (1–2 max).
- **Refined eyebrow chip**: "AI Social Studio · Built with Claude" — simpler, no "NEW" pill.
- **Headline**: bigger, tighter — "Create content that stops the scroll." with the gradient underline only on the last 3 words.
- **Subhead**: one tight line — "Captions, visuals, and scheduling — one studio, powered by AI."
- **Primary CTA**: "Join the Waitlist →". Secondary ghost link: "See it in action" (scrolls to How it works).
- **Trust row** below: avatars + "Join 2,000+ creators" — kept, but smaller and centered.
- **Hero preview**: a single floating product card (mock studio screen) gently breathing below the CTAs — replaces the 3-card stack. Uses real-looking UI chrome (prompt bar + generated image thumb + caption snippet) so the value prop is visible at a glance.

Doodles/decorations: keep just one Squiggle and one Star at low opacity. Remove the rest from the hero.

The rest of the landing page (How it works, Features, Pricing, etc.) stays untouched.

## 2. Remove duplicates in the Dashboard

There are overlaps between `DashboardHome` "Featured Tools" cards, "Quick Actions", and the sidebar:
- Sidebar already has all 13 tools — duplicating them as Quick Actions adds noise.
- "Featured Tools" highlights Trending Templates / Sticker Generator / Branding CRM, which are also in the sidebar.
- "Generate Caption" + "Create Image" + "Schedule Post" + "View Analytics" in Quick Actions are all sidebar items.

Changes in `src/pages/DashboardHome.tsx`:
- **Keep stats row** (Posts, Scheduled, Engagement, Hashtags) — useful at-a-glance.
- **Replace "Featured Tools" + "Quick Actions" with a single "Start creating" panel** containing 3 contextual entry points only:
  1. **New image** → `/dashboard/image-studio` (the unified module, see §3)
  2. **New caption** → `/dashboard/generator`
  3. **Schedule a post** → `/dashboard/calendar`
- **Keep "Recent Posts"** as the activity panel beside it.
- Remove `Sticker`, `Briefcase`, `Flame`, `Image as ImageIcon` etc. imports that become unused.

Result: one "what next?" panel + recent activity, no duplication of the sidebar.

## 3. Combine image modules into one powerful Image Studio

Today there are three image-related entries in the sidebar:
- **Image Generator** (`/dashboard/images`) — mock multi-engine selector (Nano Banana / Flux / Ideogram / SDXL / Veo / Kling…). Not wired to backend.
- **Image Studio** (`/dashboard/image-studio`) — the real one. Calls the `generate-image` edge function, supports text→image and image→image with curated styles, saves to Media Library.
- **Sticker Generator** (`/dashboard/stickers`) — mock sticker styles, no backend.

Plan: make **Image Studio** the single, powerful module, and merge the best ideas from the other two into it.

### New Image Studio structure (`src/pages/ImageStudio.tsx`)

Top-level mode switcher (segmented control): **Image · Sticker · Video**

- **Image mode** (default, real)
  - Quick prompt bar (existing) — text → image via `generate-image` edge fn.
  - Style strip (existing 15 styles) — opens the existing modal with Text-to-Image / Modify-My-Image tabs.
  - Engine row (visual chips, optional, defaults to Nano Banana): "Nano Banana · Fast", "Nano Banana Pro · Highest quality", "Ideogram · Text in image". Sent as a `model` field to the edge function (the function can fall back to default if unknown — no business-logic change required, just plumbing the field).
  - Aspect ratio chips: 1:1, 9:16, 4:5, 16:9.

- **Sticker mode**
  - Same prompt bar.
  - Style strip swaps to sticker styles (Cartoon Pop, Kawaii, Retro, Minimal Line, Holographic, Doodle) — uses the same modal + edge function with a sticker-tuned `stylePrompt` (e.g. "as a die-cut sticker on transparent background, bold outline, vivid colors").
  - "Recent stickers" reuses the existing recent-generations grid filtered by style.

- **Video mode**
  - Visible but marked **Coming soon** — disabled engine cards (Veo 3, Kling 2.0, Runway, Pika) with a waitlist CTA. Keeps the surface area without shipping a non-working flow.

### Routing & sidebar (`src/App.tsx`, `src/components/DashboardLayout.tsx`)

- Keep route `/dashboard/image-studio` as the canonical one.
- Redirect `/dashboard/images` and `/dashboard/stickers` to `/dashboard/image-studio` (with a `?mode=sticker` query param for the sticker route so users land in the right tab).
- Sidebar: remove "Image Generator" and "Sticker Generator" entries; rename "Image Studio" to **"Images"** (drop the NEW badge). Net: 13 → 11 sidebar items.
- Delete `src/pages/ImageGenerator.tsx` and `src/pages/StickerGenerator.tsx` once routes are redirected and imports cleaned up in `App.tsx`.

### Dashboard "Start creating" link

The "New image" entry on `DashboardHome` points to `/dashboard/image-studio` (image mode). We can add a secondary "New sticker" link to `/dashboard/image-studio?mode=sticker` if helpful.

## Technical notes

- Hero changes are pure presentation in `LandingPage.tsx` — no token changes, reuse existing `bg-gradient-hero`, `text-gradient-hero`, `shadow-glow`, `shadow-elevated` tokens.
- Image Studio mode switching: a single `mode` state ("image" | "sticker" | "video"), read initial value from `useSearchParams()`. Style strips are two arrays in the same component; the modal stays unchanged.
- Edge function (`supabase/functions/generate-image`) doesn't need changes for the consolidation; if we wire engine selection, we'll forward an optional `model` field but keep the existing default behavior so nothing breaks.
- Remove unused imports/icons after each file edit to keep TypeScript clean.

## Out of scope

- No changes to `generate-content` edge function, auth, waitlist DB, or pricing logic.
- No new design tokens; we reuse the existing palette.
- Video generation backend — surfaced as "Coming soon" only.

## Files touched

- `src/pages/LandingPage.tsx` — hero section rewrite (rest of page untouched).
- `src/pages/DashboardHome.tsx` — replace Featured Tools + Quick Actions with one Start panel.
- `src/pages/ImageStudio.tsx` — add mode switcher, sticker style set, video coming-soon state.
- `src/App.tsx` — drop ImageGenerator/StickerGenerator imports, add redirects.
- `src/components/DashboardLayout.tsx` — slim sidebar, rename to "Images".
- Delete: `src/pages/ImageGenerator.tsx`, `src/pages/StickerGenerator.tsx`.
