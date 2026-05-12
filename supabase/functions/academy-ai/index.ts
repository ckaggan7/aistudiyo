import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCHEMAS: Record<string, Record<string, unknown>> = {
  mentor_chat: {
    type: "object",
    properties: {
      message: { type: "string" },
      examples: { type: "array", items: { type: "string" } },
      exercises: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            prompt: { type: "string" },
            difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
          },
          required: ["title", "prompt", "difficulty"],
        },
      },
      next_actions: { type: "array", items: { type: "string" } },
    },
    required: ["message", "examples", "exercises", "next_actions"],
    additionalProperties: false,
  },
  lab_score: {
    type: "object",
    properties: {
      hook_quality: { type: "integer", minimum: 0, maximum: 100 },
      ctr_potential: { type: "integer", minimum: 0, maximum: 100 },
      readability: { type: "integer", minimum: 0, maximum: 100 },
      engagement: { type: "integer", minimum: 0, maximum: 100 },
      platform_fit: { type: "integer", minimum: 0, maximum: 100 },
      overall: { type: "integer", minimum: 0, maximum: 100 },
      suggestions: { type: "array", items: { type: "string" } },
      rewrite: { type: "string" },
    },
    required: ["hook_quality", "ctr_potential", "readability", "engagement", "platform_fit", "overall", "suggestions", "rewrite"],
    additionalProperties: false,
  },
};

const SYSTEM_PROMPTS: Record<string, string> = {
  mentor_chat:
    "You are AISTUDIYO Academy Mentor — a senior creator-economy and paid-ads instructor. Be warm, confident, and concise (under 140 words for `message`). Always include 2-3 vivid `examples`, 1-2 short practice `exercises` the user can attempt right now, and 2-4 tappable `next_actions`. Speak like a sharp creator-coach, not a textbook.",
  lab_score:
    "You are AISTUDIYO Ads Lab — a brutally honest ad copy reviewer. Score the user's ad copy on hook quality, CTR potential, readability, engagement, and platform fit (each 0-100). `overall` is a weighted average. Provide 3-5 specific `suggestions` and a single improved `rewrite` (same intent, sharper). Be specific and platform-aware.",
};

// Lab variants reuse the lab_score schema but specialize the rubric.
const LAB_VARIANTS: Record<string, string> = {
  "lab_score:ad-copy":
    "You are AISTUDIYO Ad Copy Lab. Score the ad copy. Weight CTR potential and hook quality highest. Rewrite must be tighter and clearer.",
  "lab_score:hook":
    "You are AISTUDIYO Hook Lab. Score this as a SOCIAL HOOK only — first 1-2 sentences. Weight hook_quality and engagement highest. Rewrite delivers a sharper 1-line hook plus an alt.",
  "lab_score:cta":
    "You are AISTUDIYO CTA Lab. Score the call-to-action for action clarity, urgency, and conversion strength (engagement + ctr_potential). Rewrite gives 2 stronger CTA options.",
  "lab_score:gbp":
    "You are AISTUDIYO Google Business Profile Lab. Score this GBP description for local SEO clarity, keyword fit, trust, and conversion (use platform_fit for local-fit). Rewrite is a sharper GBP description under 750 chars.",
  "lab_score:reel-strategy":
    "You are AISTUDIYO Reel Strategy Lab. Score the reel script/concept for hook strength, retention shape, payoff, and platform fit (Reels). Rewrite gives a tighter 3-beat structure (Hook → Tension → Payoff).",
  "lab_score:viral-hook-challenge":
    "You are AISTUDIYO Viral Hook Challenge judge. Be brutal. Score for virality (engagement + ctr_potential), curiosity gap, and shareability. Rewrite must be 1 line that could 10x stops.",
};

async function callGateway(key: string, system: string, user: string, toolName: string, parameters: Record<string, unknown>) {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      tools: [{ type: "function", function: { name: toolName, description: "Return structured academy data", parameters } }],
      tool_choice: { type: "function", function: { name: toolName } },
    }),
  });
}

function gatewayError(status: number) {
  if (status === 429) return { status: 429, error: "Rate limit exceeded. Please try again in a moment." };
  if (status === 402) return { status: 402, error: "AI usage limit reached. Please add credits." };
  return { status: 500, error: "AI gateway error" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const action = String(body.action || "");
    const variant = body.variant ? String(body.variant) : "";
    const baseAction = action;
    const schema = SCHEMAS[baseAction];
    const variantKey = variant ? `${baseAction}:${variant}` : "";
    const system = LAB_VARIANTS[variantKey] || SYSTEM_PROMPTS[baseAction];
    if (!schema || !system) {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("LOVABLE_API_KEY is not configured");

    const ctx = body.context ? JSON.stringify(body.context).slice(0, 4000) : "";
    const userPrompt = `${body.prompt || ""}\n\nContext: ${ctx || "(none)"}`.trim();

    const response = await callGateway(key, system, userPrompt, `academy_${action}`, schema);
    if (!response.ok) {
      const err = gatewayError(response.status);
      return new Response(JSON.stringify({ error: err.error }), {
        status: err.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured response from model");
    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ action, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("academy-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});