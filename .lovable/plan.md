## Phase 2 — Content Operating System

Turn one prompt into a full creator-ready content package. Highest-leverage: rebuild the generator output into modular AI result cards, ground every generation in a stored brand voice, and add a lightweight viral score. Other items from the brief (Repurposer, Visual Canvas, Trend Engine, Calendar AI, live Agents) are scoped as Phase 3.

### What you'll see after Phase 2

Type *"Create a viral LinkedIn post about AI startups"* → AI returns one structured pack:

```text
┌─────────────────────────────────────────────────┐
│  Viral score  87 / 100   Hook 92 · Read 80 · Fit │
├─────────────────────────────────────────────────┤
│ ▸ Hook variations (5)        [copy][regen][save]│
│ ▸ Main caption / post        [copy][regen][save]│
│ ▸ CTA options (3)            [copy][regen]      │
│ ▸ Hashtag sets (3 tiers)     [copy]             │
│ ▸ Carousel outline (5 slides)[expand][to canvas]│
│ ▸ Visual prompt              [send to studio]   │
│ ▸ Repurposed thread / reel   [open]             │
│ ▸ Posting suggestion         [schedule]         │
└─────────────────────────────────────────────────┘
```

Every card: **Copy · Regenerate · Improve · Save · Publish**.

### 1. Upgrade `generate-content` edge function

Replace the current 4-key tool schema with a single richer tool that returns the full content pack in one call (cheaper than chained calls, one round-trip). New tool schema:

```text
hooks:          string[5]        // 5 hook variants
caption:        string           // main body
cta_options:    string[3]
hashtags:       { broad: string[6], niche: string[6], branded: string[3] }
carousel:       { title: string, slides: { headline, body }[] }   // 5 slides
visual_prompt:  string                                            // for image-studio
repurpose:      { twitter_thread: string[], reel_script: string }
posting:        { best_time_local: string, rationale: string }
scores:         { hook: int, readability: int, platform_fit: int, virality: int }   // 0-100
notes:          string           // 1-2 line strategic note
```

Compute `virality` server-side from a blended formula of the other three plus hook keyword heuristics (no extra AI call). Reuse the existing `langMap` and add brand-voice context (see #2) into the system prompt when present.

Keep backward compat: respond with both old keys (`hook`, `caption`, `description`, `hashtags`) derived from the new pack so other call sites don't break.

### 2. Brand voice memory

Existing `brand_profile` table already has `name, tagline, voice, audience, style_prompt, palette, font_pair`. No DB migration needed.

- Add a compact "Brand voice" editor card at the top of `AIGenerator` (collapsed by default) showing the active brand profile + an **Edit** link to `/dashboard/branding`.
- `AIGenerator` loads the most recent `brand_profile` row on mount and includes `{ voice, audience, style_prompt }` in the request body.
- `generate-content` appends `Brand voice: ... Audience: ... Style notes: ...` into the system prompt when present.
- First-run onboarding: if no `brand_profile` exists when user opens `AIGenerator`, show a 3-question inline drawer ("How does your brand sound?" tone / audience / 1-emoji style) → saves a `brand_profile` row, then runs the generation.

### 3. Result panel rewrite — `AIGenerator.tsx`

Replace the right-hand single column with a **vertical stack of modular `ResultCard`s**:

- `<ScorePanel scores={...} />` — slim header: 4 bars + total. No big charts.
- `<HookCard hooks={[]} />` — list with regenerate-just-this-block button.
- `<TextCard label="Caption" value=... />` — copy/regenerate/improve/save.
- `<CtaCard options={[]} />`
- `<HashtagCard sets={...} />` — three pills tiers.
- `<CarouselCard slides={...} />` — collapsible slide preview, "Open in Canvas" (stub button → toast for now, fully wired in Phase 3 Visual Canvas).
- `<VisualPromptCard prompt=... />` — "Send to Image Studio" → routes `/dashboard/image-studio?prompt=...` (already supported).
- `<RepurposeCard thread reel />` — two tabs (Twitter / Reel).
- `<PostingCard time rationale />` — "Schedule" button → routes `/dashboard/calendar?caption=...&time=...`.

Each card extends a small `<ResultCard>` shell with title, content slot, and the standard action row.

### 4. Per-block regenerate

Single endpoint addition in `generate-content`: accept `{ regenerate_block: "hook" | "caption" | ... , context: <existing pack> }` and return just that block, reusing the same system/brand prompt. Avoids re-rolling the whole pack. The `ResultCard` regen button calls this with the block key.

### 5. Light viral score widget

Pure presentation — no model. Card shows 4 horizontal bars (0–100, color: red <40, amber <70, green ≥70) and an overall number. Server-computed from `scores`. No charts library; CSS bars.

### 6. Save / publish glue

- **Save**: insert a row into `generations` (already exists, `mode='text'` allowed) with `prompt` + `image_url='—'` is not great → add a tiny `content_packs` table for text packs:
  ```text
  content_packs: id, user_id, prompt, platform, content_type, pack_json, scores_json, created_at
  ```
  RLS: owner-only read/write, super_admin read.
- **Publish**: routes to `/dashboard/calendar` prefilled (existing schedule_posts insert path). No new publishing primitive in Phase 2.

### 7. Files

**New**
- `src/components/generator/ResultCard.tsx` — shared shell (title + actions + slot)
- `src/components/generator/ScorePanel.tsx`
- `src/components/generator/HookCard.tsx`
- `src/components/generator/TextCard.tsx` (used for caption + visual prompt)
- `src/components/generator/CtaCard.tsx`
- `src/components/generator/HashtagCard.tsx`
- `src/components/generator/CarouselCard.tsx`
- `src/components/generator/RepurposeCard.tsx`
- `src/components/generator/PostingCard.tsx`
- `src/components/generator/BrandVoiceBar.tsx` — collapsed strip + first-run drawer
- `supabase/migrations/<ts>_content_packs.sql` — table + RLS

**Edited**
- `supabase/functions/generate-content/index.ts` — richer tool schema, brand voice in prompt, `regenerate_block` mode, scores
- `src/pages/AIGenerator.tsx` — state shape now `pack`, loads brand profile, renders new stack
- `src/integrations/supabase/types.ts` — auto-regenerated after migration

**Untouched**: all `/superadmin/*`, AgentBuilder, dashboard home, header carousel.

### 8. Constraints

- One AI call per full generation (no chained calls).
- No new dependencies. Use existing Tailwind tokens + Framer Motion.
- Backward-compatible response shape so the existing simple result UI never breaks during rollout.
- Mobile: cards stack full-width, action row wraps.

### 9. Acceptance

1. Generate a post → page shows score panel + 8 modular cards.
2. "Regenerate" on just the Hook card returns 5 new hooks within ~3s without changing other cards.
3. With a brand_profile saved, the caption noticeably matches the saved tone (smoke test: change tone, regenerate, voice shifts).
4. "Send to Image Studio" from Visual Prompt card opens `/dashboard/image-studio` with prompt prefilled.
5. "Schedule" from Posting card opens `/dashboard/calendar` prefilled.
6. Save persists the pack to `content_packs` and shows a toast.

### Out of scope — Phase 3 (next ask)

- Full **Content Repurposer** page (LinkedIn → Twitter / Blog → Carousel / YT → Reels) as a standalone tool.
- **Visual Content Canvas** (Canva-style carousel builder, slide drag-drop).
- **Live Trend Engine** wiring (currently static seeded ideas).
- **AI-suggested calendar** ("what to post next") with drag-drop creator-friendly week view.
- **Proactive Agents** — agents that surface suggestions in a notification dock.
- **Brand voice fine-tune** — learn voice from pasted samples instead of explicit fields.

These are deliberately deferred. Phase 2 ships the magic moment (one prompt → full content pack with score + actions) which is the highest-leverage shift toward "AI creator workspace."
