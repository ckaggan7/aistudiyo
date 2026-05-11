import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const langMap: Record<string, string> = {
  native: "the same language as the user's topic input (auto-detect)",
  en: "English",
  te: "Telugu (తెలుగు script)",
  hi: "Hindi (Devanagari script)",
  ta: "Tamil (தமிழ் script)",
  kn: "Kannada (ಕನ್ನಡ script)",
  ml: "Malayalam (മലയാളം script)",
  mr: "Marathi (Devanagari script)",
  bn: "Bengali (বাংলা script)",
  gu: "Gujarati (ગુજરાતી script)",
  pa: "Punjabi (ਗੁਰਮੁਖੀ script)",
  ur: "Urdu (اردو script)",
  "te-en": "Tenglish — natural mix of Telugu words written in Roman/English script with English",
  "hi-en": "Hinglish — natural mix of Hindi words written in Roman/English script with English",
};

const PACK_SCHEMA = {
  type: "object",
  properties: {
    hooks: { type: "array", items: { type: "string" }, description: "5 distinct scroll-stopping hook variations, each with one tasteful emoji" },
    caption: { type: "string", description: "Main post body, 2-4 sentences, on-brand voice, ends with light CTA" },
    cta_options: { type: "array", items: { type: "string" }, description: "3 short CTA variants" },
    hashtags: {
      type: "object",
      properties: {
        broad: { type: "array", items: { type: "string" } },
        niche: { type: "array", items: { type: "string" } },
        branded: { type: "array", items: { type: "string" } },
      },
      required: ["broad", "niche", "branded"],
    },
    carousel: {
      type: "object",
      properties: {
        title: { type: "string" },
        slides: {
          type: "array",
          items: {
            type: "object",
            properties: {
              headline: { type: "string" },
              body: { type: "string" },
            },
            required: ["headline", "body"],
          },
        },
      },
      required: ["title", "slides"],
    },
    visual_prompt: { type: "string", description: "Detailed image prompt for image-gen model (subject, style, mood, composition)" },
    repurpose: {
      type: "object",
      properties: {
        twitter_thread: { type: "array", items: { type: "string" }, description: "4-6 tweet thread" },
        reel_script: { type: "string", description: "15-30s reel script with on-screen text cues" },
      },
      required: ["twitter_thread", "reel_script"],
    },
    posting: {
      type: "object",
      properties: {
        best_time_local: { type: "string", description: "e.g. 'Tue 9:00 AM' — best time in user's likely TZ" },
        rationale: { type: "string" },
      },
      required: ["best_time_local", "rationale"],
    },
    scores: {
      type: "object",
      properties: {
        hook: { type: "integer", minimum: 0, maximum: 100 },
        readability: { type: "integer", minimum: 0, maximum: 100 },
        platform_fit: { type: "integer", minimum: 0, maximum: 100 },
      },
      required: ["hook", "readability", "platform_fit"],
    },
    notes: { type: "string", description: "1-2 line strategic note" },
  },
  required: ["hooks", "caption", "cta_options", "hashtags", "carousel", "visual_prompt", "repurpose", "posting", "scores", "notes"],
  additionalProperties: false,
};

function computeVirality(scores: { hook: number; readability: number; platform_fit: number }, hooks: string[]) {
  const base = Math.round(scores.hook * 0.5 + scores.platform_fit * 0.3 + scores.readability * 0.2);
  const text = (hooks || []).join(" ").toLowerCase();
  let bonus = 0;
  if (/\b(nobody|secret|truth|wrong|stop|i tested|i tried|here's why|the real)\b/.test(text)) bonus += 5;
  if (/\d/.test(text)) bonus += 3;
  if (/\?/.test(text)) bonus += 2;
  return Math.max(0, Math.min(100, base + bonus));
}

function buildSystemPrompt(opts: {
  platform: string; tone: string; audience?: string; brand?: string;
  voice?: string; style_prompt?: string; languageInstruction: string;
}) {
  const { platform, tone, audience, brand, voice, style_prompt, languageInstruction } = opts;
  const brandLines: string[] = [];
  if (brand) brandLines.push(`Brand name: ${brand}.`);
  if (voice) brandLines.push(`Brand voice: ${voice}.`);
  if (audience) brandLines.push(`Audience: ${audience}.`);
  if (style_prompt) brandLines.push(`Style notes: ${style_prompt}.`);

  return `You are AI STUDIYO — a senior social media strategist + copywriter + growth marketer combined into one.

Generate a COMPLETE content pack for ${platform} in one shot. Be specific, useful, scroll-stopping. No clichés. No "in today's fast-paced world". No filler.

Tone: ${tone}.
${brandLines.join(" ")}

Write hook, caption, CTAs, carousel slides, repurposed thread and reel script in ${languageInstruction}. Hashtags stay in Roman/English script for discoverability.

For scores (0-100), be honest:
- hook: scroll-stopping power of the strongest hook
- readability: clarity, sentence length, flow
- platform_fit: how well the pack matches ${platform} norms

Carousel: 5 slides. Twitter thread: 4-6 tweets. Reel script: 15-30 seconds with on-screen text cues in brackets.`;
}

async function callGateway(LOVABLE_API_KEY: string, systemPrompt: string, userPrompt: string, toolName: string, parameters: any) {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [{ type: "function", function: { name: toolName, description: "Return structured content", parameters } }],
      tool_choice: { type: "function", function: { name: toolName } },
    }),
  });
}

function gatewayError(status: number) {
  if (status === 429) return { status: 429, error: "Rate limit exceeded. Please try again in a moment." };
  if (status === 402) return { status: 402, error: "AI usage limit reached. Please add credits." };
  return { status: 500, error: "AI gateway error" };
}

function legacyShape(pack: any) {
  return {
    hook: pack.hooks?.[0] ?? "",
    caption: pack.caption ?? "",
    description: pack.notes ?? "",
    hashtags: [
      ...(pack.hashtags?.broad ?? []),
      ...(pack.hashtags?.niche ?? []),
      ...(pack.hashtags?.branded ?? []),
    ].join(" "),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      platform = "instagram", contentType = "post", brand, audience, tone = "casual",
      topic, language = "native",
      // brand voice memory
      voice, style_prompt,
      // per-block regen
      regenerate_block, context: existingPack,
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const languageInstruction = langMap[language] || langMap.native;
    const systemPrompt = buildSystemPrompt({ platform, tone, audience, brand, voice, style_prompt, languageInstruction });

    // ── Per-block regeneration ───────────────────────────────
    if (regenerate_block) {
      const blockKey = String(regenerate_block);
      const blockSchema = (PACK_SCHEMA.properties as any)[blockKey];
      if (!blockSchema) {
        return new Response(JSON.stringify({ error: `Unknown block: ${blockKey}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const parameters = {
        type: "object",
        properties: { [blockKey]: blockSchema },
        required: [blockKey],
        additionalProperties: false,
      };
      const userPrompt = `Original topic: ${topic || "(see context)"}
Content type: ${contentType}
Existing pack (for context, do NOT repeat): ${JSON.stringify(existingPack ?? {}).slice(0, 4000)}

Regenerate ONLY the "${blockKey}" block. Make it different and better than what's in the existing pack.`;
      const response = await callGateway(LOVABLE_API_KEY, systemPrompt, userPrompt, "regen_block", parameters);
      if (!response.ok) {
        const err = gatewayError(response.status);
        return new Response(JSON.stringify({ error: err.error }), { status: err.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in response");
      const partial = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ block: blockKey, value: partial[blockKey] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Full pack generation ─────────────────────────────────
    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `Create a ${contentType} for ${platform} about: ${topic}`;
    const response = await callGateway(LOVABLE_API_KEY, systemPrompt, userPrompt, "generate_content_pack", PACK_SCHEMA);

    if (!response.ok) {
      const err = gatewayError(response.status);
      return new Response(JSON.stringify({ error: err.error }), { status: err.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");
    const pack = JSON.parse(toolCall.function.arguments);

    // Server-side virality score
    const virality = computeVirality(pack.scores, pack.hooks);
    pack.scores = { ...pack.scores, virality };

    // Backward-compat keys
    const legacy = legacyShape(pack);

    return new Response(JSON.stringify({ ...legacy, pack }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
