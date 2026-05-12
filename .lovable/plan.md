## Brand AI Studio — transform Create page into AI Brand CRM

Refactor `/dashboard/generator` into `/dashboard/studio` ("Brand AI Studio"). Keep the existing generator (AIGenerator.tsx) as the foundation — embed it as Section 2, wrap it with new Brand Brain (Section 1) and Brand Assets/Memory (Section 3) sections in a bento layout.

### Routing & nav
- `src/App.tsx` — add `/dashboard/studio` route → new `BrandStudio` page; keep `/dashboard/generator` as redirect to `/dashboard/studio` (back-compat with QuickCreateBar links).
- `src/components/DashboardLayout.tsx` — rename "Create" → "Brand AI Studio" (icon `Brain` from lucide), point to `/dashboard/studio`.

### New page — `src/pages/BrandStudio.tsx`
Bento dark/glass layout, three stacked sections + floating right-side AI Assistant.

```text
┌─────────── Hero: Train Your AI Brand Brain ────────────┐
│  AI scan progress · "Analyze Brand" CTA                │
├─────── Bento row: connect sources + uploads ──────────┤
│ [Website][IG][LinkedIn][X][YT]  │  Drag-drop uploads  │
│ Attached chips · sync animation │  PDF/DOC/decks      │
├──────────── Brand Identity Hub (bento) ────────────────┤
│ Logo │ Colors (AI palette) │ Fonts │ Moodboard        │
├──────────── Business Identity Card ────────────────────┤
│ Name · category · phone · email · web · socials · addr │
├──────────── Brand Memory + Score ──────────────────────┤
│ Tone · audience · CTA style · hashtags  │ Score ring  │
├──────────── Content Generator (existing) ──────────────┤
│ Embedded <AIGenerator /> + brand-aware suggestions     │
└────────────────────────────────────────────────────────┘
        ⌐ floating Brand AI Assistant (right) ¬
```

### New components (`src/components/studio/`)
- `BrandBrainHero.tsx` — title, subtext, "Analyze Brand" button, scan-progress orb.
- `BrandSourceConnectors.tsx` — connect chips (Website / IG / LinkedIn / X / YT) with input + status.
- `BrandUploadZone.tsx` — drag-drop (PDF, DOC, decks, brand guidelines, ChatGPT/Gemini exports), shows attachment chips with sync animation.
- `BrandScanResults.tsx` — AI-generated tone summary, audience profile, comm style, visual personality, content strategy, keywords (cards).
- `VisualIdentityHub.tsx` — logo upload, AI color palette (primary/secondary/accent/gradient/dark preview, editable chips), fonts, moodboard grid.
- `BusinessIdentityCard.tsx` — form fields (name, category, phone, email, website, address, socials).
- `BrandMemoryPanel.tsx` — persistent memory items (writing style, audience, hashtags, CTA, emojis, formatting), edit-in-place chips.
- `BrandScoreRing.tsx` — consistency score (tone, CTA quality, visual alignment, audience relevance) as ring + breakdown.
- `BrandAISuggestionsFeed.tsx` — recommendation cards ("Audience prefers storytelling hooks", etc.).
- `BrandAIAssistant.tsx` — floating right panel; chat with brand-aware AI; suggestions, improvements, inconsistency detection.

Reuse: `AIGenerator` embedded in a "Content Generator" section wrapper that pre-fills brand voice from new memory.

### Data / backend
Extend existing `brand_profile` table (already has name, tagline, voice, audience, palette, font_pair, style_prompt) with new columns via migration:
- `logo_url text`, `category text`, `phone text`, `email text`, `website text`, `address text`, `socials jsonb`, `memory jsonb` (tone, audience, hashtags, cta_style, emojis, formatting, keywords), `score jsonb`, `sources jsonb` (connected URLs + uploaded file metadata), `scan_summary jsonb`.

New table `brand_assets` (id, user_id, brand_id, kind enum [logo, moodboard, product, campaign, document], url, meta jsonb, created_at) with RLS owner-only.

Storage: new public bucket `brand-assets` with owner-write RLS for logos/moodboard/uploads.

### AI edge functions (`supabase/functions/`)
- `brand-scan/index.ts` — accepts URLs + uploaded file URLs, fetches/parses (text from PDFs via `pdf-parse` npm, sites via fetch + cheerio), feeds to Lovable AI Gateway (`google/gemini-3-flash-preview`) with `Output.object` schema → returns `{tone, audience, voice, style_prompt, palette, keywords, cta_style, hashtags, content_strategy}`. Persists to `brand_profile.memory` + `scan_summary`.
- `brand-assistant/index.ts` — streamed chat using AI SDK `streamText`, system prompt seeded with brand memory; serves the floating assistant.
- Update existing `generate-content` to read `memory` from `brand_profile` and inject into system prompt so generations apply brand tone automatically.

### Visual style
- Cinematic dark surface only inside Studio page (use existing tokens; add `studio-dark` wrapper class with `bg-background` deepened + glow accents). Glassmorphism cards via existing `surface-floating` + `card-bento`.
- Floating panels, asymmetric bento, soft gradients, AI glow ring on hero & assistant.
- Framer Motion: stagger reveal, hover-lift, scan-progress shimmer.

### Out of scope
- No changes to other dashboard pages, Academy, Growth, etc.
- No replacement of existing generator UI/cards — embedded as-is.
- No new auth flows, no payment changes.
- Real social-account OAuth (IG/LinkedIn/X/YT) is **not** wired — connectors show URL input + "coming soon" tag for OAuth; only website + uploads are scanned in v1.

### Files
**New:** `src/pages/BrandStudio.tsx`, `src/components/studio/*` (10 files), `supabase/functions/brand-scan/index.ts`, `supabase/functions/brand-assistant/index.ts`, 1 migration.
**Edited:** `src/App.tsx`, `src/components/DashboardLayout.tsx`, `supabase/functions/generate-content/index.ts`.
