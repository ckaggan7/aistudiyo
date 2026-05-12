## Goal
Replace the existing style list in the Image Studio with the user's curated `stylePrompts` map (42 styles across 7 categories), and add a clean category-grouped style picker.

## Changes

**New file: `src/lib/imageStyles.ts`**
- Export typed `IMAGE_STYLES` array built from the user's `stylePrompts` map.
- Each entry: `{ name, category, prompt, thumb }`.
- Categories: Art & Illustration, Anime & Cartoon, Photography, Cinematic, 3D & Render, Print & Graphic, Vibe & Aesthetic.
- Thumbnails: reuse the existing curated Unsplash URLs already in `ImageStudio.tsx` where the style name matches; for new styles, assign a thematically appropriate Unsplash photo (consistent 600x600 crop).

**Edit `src/pages/ImageStudio.tsx`**
- Remove the inline `styles` array.
- Import `IMAGE_STYLES` from `@/lib/imageStyles`.
- Add a category tab/pill row above the style grid; default tab = "All".
- Filter the rendered grid by the active category.
- Keep existing selection state, prompt-append behavior, and generate flow untouched.
- Keep the separate `filters` (quick-apply) section untouched — these are different from style cards.

## Out of scope
- No changes to the `filters` quick-apply presets, the generate pipeline, edge function, or any other page.
- No new DB/migrations/secrets.

## Verification
- `npx tsc --noEmit` clean.
- Manual click-through on `/dashboard/image-studio`: each category filters correctly, selecting a style appends its prompt and generation still works.