## Goal
Re-skin the landing page (`/`) to a clean light theme (white background, black text, brand-orange gradient accents), strip the "01 — / 02 — …" scene numbers, and rewrite the footer attribution.

## Changes

### 1. Landing scenes → light theme
Update all 8 scenes in `src/components/landing/` (`HeroScene`, `QuickCreateScene`, `AgentsScene`, `ContentEngineScene`, `TrendsScene`, `BrandVoiceScene`, `SocialProofScene`, `FinalCTAScene`) plus `LandingHeader`:

- Section `backgroundColor` → `#ffffff`, text → `#0a0a0a` (black) / muted gray for body.
- Keep ambient glow orbs but tone opacity down (~0.15–0.25) using existing brand-orange + violet so the gradients still match the existing `text-gradient-hero` brand.
- Floating particle dots → switch from `bg-white/40` to `bg-black/20` (or remove on light bg if noisy).
- Card surfaces (e.g. Hero floating preview cards, BrandVoice/Trends cards): swap `bg-white/[0.04] border-white/[0.08]` → `bg-white border-black/10 shadow-sm`; text `text-white/60` → `text-neutral-600`.
- Secondary buttons: `border-white/20 bg-white/5` → `border-black/10 bg-black/5 hover:bg-black/10`, text black.
- Primary CTAs keep `btn-premium` (orange gradient) — already on-brand.
- `text-gradient-hero` stays (orange gradient) — that's the "gradients match" anchor.

### 2. Remove scene numbers
In every scene, delete the eyebrow line + divider:
```
<p className="…">01 — AISTUDIYO</p>
<hr … />
```
Done across Hero (01), QuickCreate (02), Agents (03), ContentEngine (04), Trends (05), BrandVoice (06), SocialProof (07), FinalCTA (08).

### 3. Footer rewrite
In `src/pages/LandingPage.tsx`, replace the `<Footer …copyright>` content. Footer copy becomes two lines:

- Line 1: `Made with ♥ with Orange Economy India.`
- Line 2: `A Product by WOC — Wise Owl Communications, New Delhi.`

Map to `Footer` props: `copyright={{ text: "Made with ♥ with Orange Economy India.", license: "A Product by WOC — Wise Owl Communications, New Delhi." }}`. Footer surface itself already inherits page bg (light), so no further change needed.

## Out of scope
- Dashboard, Academy, Admin, auth pages — untouched.
- Brand token files (`index.css`, `tailwind.config.ts`) — no edits; the page already lives on white via semantic tokens, only the per-scene dark overrides are removed.
- No copy changes besides scene numbers + footer.

## Files touched
- `src/components/landing/HeroScene.tsx`
- `src/components/landing/QuickCreateScene.tsx`
- `src/components/landing/AgentsScene.tsx`
- `src/components/landing/ContentEngineScene.tsx`
- `src/components/landing/TrendsScene.tsx`
- `src/components/landing/BrandVoiceScene.tsx`
- `src/components/landing/SocialProofScene.tsx`
- `src/components/landing/FinalCTAScene.tsx`
- `src/components/landing/LandingHeader.tsx` (if it carries dark styling)
- `src/pages/LandingPage.tsx` (footer copy)
