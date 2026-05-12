## Goal
Replace the horizontal scroll strip of style cards with a responsive grid, and show only an initial batch with a "Load more" button.

## Changes (only in `src/pages/ImageStudio.tsx`)

1. Replace the `flex gap-3 overflow-x-auto …` container around the style cards with a responsive grid:
   - `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3`
   - Drop the fixed `w-44` on cards; keep `aspect-[4/5]` so cards fill their grid cell.
2. Add a `visibleCount` state (default `10`, step `+10`). Render `styles.slice(0, visibleCount)`.
3. Reset `visibleCount` to 10 whenever `styleCategory` or `mode` changes (via `useEffect`).
4. Below the grid, show a centered "Load more" button (ghost/outline, rounded-xl) only when `visibleCount < styles.length`. Clicking it bumps `visibleCount` by 10.
5. Sticker mode keeps the same grid behavior (and since there are only 6 stickers, no Load more button appears).

## Out of scope
- No changes to category pills, prompt bar, filters strip, recent generations, or the style modal.
- No new files, no design system changes.

## Verification
- `npx tsc --noEmit` clean.
- Manual check on `/dashboard/image-studio`: grid renders, initial 10 visible, Load more reveals the next 10, switching category resets to 10.