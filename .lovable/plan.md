
## Goal

Transform the landing page from dark-cinematic to a clean light theme that matches the AISTUDIYO brand (white BG, black text, orange accents/gradients), remove "01 —", "02 —" … section counters, and rewrite the footer with the requested attribution lines.

## Scope

Only the public landing page (`/`) and its scenes + footer. Dashboard, auth, and other routes stay as-is.

## Changes

### 1. Theme repaint — every landing scene → light

Touch each `FlowSection` background and text colors in:
- `HeroScene.tsx` — bg `#FFFFFF`, headline black, body `#52525B`. Keep the orange gradient on "Operating System" via existing `text-gradient-hero`. Soften ambient orange glows (lower opacity), keep floating preview cards on a subtle white/neutral surface (`bg-black/[0.03]`, border `black/10`).
- `QuickCreateScene.tsx` — white bg, black text. Pills become `bg-black/[0.04]` with `border-black/10`.
- `AgentsScene.tsx` — white bg, black text; agent cards on `bg-black/[0.03]`.
- `ContentEngineScene.tsx` — keep the orange (#ff6a17) brand band as a deliberate accent section (matches logo). Counter removed.
- `TrendsScene.tsx` — white bg, black text; pills inverted.
- `BrandVoiceScene.tsx` — white bg, black text.
- `SocialProofScene.tsx` — white bg, black text; stat cards `bg-black/[0.03]`.
- `FinalCTAScene.tsx` — soft white→cream gradient bg, black text, orange CTA gradient.
- `LandingHeader.tsx` — switch to translucent white (`bg-white/70 backdrop-blur` with `border-black/[0.06]`); links black; primary CTA keeps orange gradient.

All `text-white/XX` → `text-black/XX` (or zinc equivalents). All `border-white/XX` → `border-black/XX`. All `bg-white/XX` glass → `bg-black/[0.03–0.06]` for subtle cards on white.

Brand gradients (`text-gradient-hero`, `bg-gradient-hero`, `btn-premium`) stay — they are the orange brand and look great on white.

### 2. Remove "unwanted numbers"

Delete the section counter line in every scene:
- `01 — AISTUDIYO` (Hero)
- `02 — Quick Create`
- `03 — AI Team`
- `04 — Content Engine`
- `05 — Trend Intelligence`
- `06 — Brand Memory`
- `07 — Loved by creators`
- `08 — Start now`

The thin `<hr>` separators that follow them are removed too.

The vanity stats block in `SocialProofScene` (`1M+ AI generations`, `100K+ creators`, `10M+ social reach`, `500K+ viral hooks`) is also removed since AISTUDIYO is pre-launch / waitlist-first and these inflated numbers are misleading. The testimonials block stays.

### 3. Footer rewrite

Replace the current `Footer` usage in `LandingPage.tsx` with a new lightweight footer (light theme) that contains:

```
[ AISTUDIYO logo ]   AI Studio · AI Agents · Calendar · Trends · Contact

Made with ♥ by Orange Economy India
A Product by WOC @ Wise Owl Communications · New Delhi

© 2026 AISTUDIYO          Privacy · Terms
```

- White background, black text, orange heart icon, hover-orange links.
- Implement inline in `LandingPage.tsx` (or as a small `LightFooter` component) so the existing dark `Footer` UI primitive remains untouched for other pages.

### 4. Memory update

Update `mem://style/visual-identity` to record: "Landing page is light-theme (white BG, black text, orange brand gradient). Dashboard remains dark."

## Out of scope

- Dashboard, login, signup, contact, academy, growth, admin pages — untouched.
- No new images. Logo continues to be the existing `Sparkles` mark + AISTUDIYO wordmark (the uploaded logo can be wired in later as a separate task if you want the actual artwork in place of the Sparkles icon).

## Files touched

- `src/pages/LandingPage.tsx`
- `src/components/landing/LandingHeader.tsx`
- `src/components/landing/HeroScene.tsx`
- `src/components/landing/QuickCreateScene.tsx`
- `src/components/landing/AgentsScene.tsx`
- `src/components/landing/ContentEngineScene.tsx`
- `src/components/landing/TrendsScene.tsx`
- `src/components/landing/BrandVoiceScene.tsx`
- `src/components/landing/SocialProofScene.tsx`
- `src/components/landing/FinalCTAScene.tsx`
- `mem://style/visual-identity`
