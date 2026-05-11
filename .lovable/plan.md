# Home Page — Orange Primary + Cinematic Multi-Color Accents

Keep AISTUDIYO's signature orange + black system as the anchor. Layer in violet, electric blue, pink, and emerald as **scene-specific accents** so each section of the home page feels distinct without losing brand identity.

## Color rules

```text
PRIMARY (unchanged)
  --primary           hsl(22 95% 55%)     // signature orange
  --primary-glow      hsl(35 100% 65%)    // warm amber
  Base canvas         #050505 / #070707   // matte black

ACCENT PALETTE (new — used sparingly per scene)
  Violet              hsl(265 85% 62%)
  Electric blue       hsl(220 90% 60%)
  Hot pink            hsl(330 88% 62%)
  Emerald             hsl(160 75% 50%)    // status / "live"
  Amber               hsl(45 95% 58%)     // trending / hot
```

**Rule:** Every scene keeps orange as its dominant tone. Accents appear only as a **secondary glow, chip color, or data viz hue** — never on the headline or primary CTA.

## Per-scene accent mapping

```text
HeroScene          orange primary    + violet secondary glow (bottom-right blob)
QuickCreateScene   orange primary    + electric blue typing cursor pulse
AgentsScene        orange primary    + per-agent accent dots:
                                       Instagram=pink, LinkedIn=blue,
                                       Viral Hook=orange, Trend Hunter=violet,
                                       Campaign=emerald
ContentEngineScene orange chain core + multi-color chip stops along the flow
                                       (Post=blue, Reel=pink, Caption=orange,
                                        Thread=violet, CTA=emerald)
TrendsScene        orange marquee    + virality chips colored by score
                                       (90+=hot pink, 70-89=orange, <70=amber)
BrandVoiceScene    orange center node + violet/blue/pink/emerald orbiting nodes
SocialProofScene   orange stat #'s   + emerald "live" status pulse on testimonials
FinalCTAScene      orange core sphere + violet outer halo (depth effect)
Footer             orange edge beam  + violet ambient blob (already-implemented
                                       structure stays, just tints adjust)
```

## What changes in code

**1. `src/index.css`** — add accent CSS variables (`--accent-violet`, `--accent-blue`, `--accent-pink`, `--accent-emerald`, `--accent-amber`) alongside existing tokens. No orange values change.

**2. Landing scene components** — replace the few existing pure-orange secondary glows with accent tokens per the mapping above. Headline gradient, primary CTA, and main edge lighting **stay orange**.

**3. `WhatsNewCarousel`** — already uses multi-color gradient backplates (violet/cyan/emerald/pink). Confirm hues align with the new accent tokens so the carousel reads as the "color showcase" moment of the home.

**4. `CoreActionCards`** (dashboard) — tint each card's hover glow with its category accent (Generate=orange, Schedule=blue, Trends=pink, Agents=violet, Brand=emerald) so the dashboard mirrors the multi-color rhythm.

**5. Status indicators** — footer "All systems operational" + agent live pulses standardize on emerald (already correct).

## What does NOT change

- AISTUDIYO orange (`hsl(22 95% 55%)`) stays the default `--primary`
- All headlines, primary CTAs, brand logo, edge-glow utility, btn-premium gradient → unchanged
- Layout, animations, routes, copy, Supabase, edge functions
- Theme switcher behavior — Orange Blaze remains the default preset
- Previous home visuals (cinematic story scroll, 8 scenes, footer) are preserved

## Visual outcome

```text
Home still reads as "AISTUDIYO orange" at first glance.
As you scroll, each section reveals a distinct supporting hue —
giving the page a cinematic, multi-act rhythm without diluting the brand.
```
