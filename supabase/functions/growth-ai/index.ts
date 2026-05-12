import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCHEMAS: Record<string, Record<string, unknown>> = {
  insights: {
    type: "object",
    properties: {
      insights: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            body: { type: "string" },
            severity: { type: "string", enum: ["positive", "neutral", "warning", "critical"] },
            action: { type: "string" },
          },
          required: ["title", "body", "severity", "action"],
        },
      },
    },
    required: ["insights"],
    additionalProperties: false,
  },
  ads_campaign: {
    type: "object",
    properties: {
      campaign_name: { type: "string" },
      objective: { type: "string" },
      audience: { type: "string" },
      daily_budget_usd: { type: "number" },
      headlines: { type: "array", items: { type: "string" } },
      descriptions: { type: "array", items: { type: "string" } },
      ctas: { type: "array", items: { type: "string" } },
      keywords: { type: "array", items: { type: "string" } },
      ad_groups: { type: "array", items: { type: "string" } },
      predicted_ctr: { type: "number" },
      predicted_cpc_usd: { type: "number" },
      ai_score: { type: "integer", minimum: 0, maximum: 100 },
      rationale: { type: "string" },
    },
    required: ["campaign_name", "objective", "audience", "daily_budget_usd", "headlines", "descriptions", "ctas", "keywords", "ad_groups", "predicted_ctr", "predicted_cpc_usd", "ai_score", "rationale"],
    additionalProperties: false,
  },
  analytics_summary: {
    type: "object",
    properties: {
      summary: { type: "string" },
      wins: { type: "array", items: { type: "string" } },
      drop_offs: { type: "array", items: { type: "string" } },
      actions: { type: "array", items: { type: "string" } },
    },
    required: ["summary", "wins", "drop_offs", "actions"],
    additionalProperties: false,
  },
  post_generator: {
    type: "object",
    properties: {
      title: { type: "string" },
      body: { type: "string" },
      cta_label: { type: "string" },
      hashtags: { type: "array", items: { type: "string" } },
      image_prompt: { type: "string" },
      keywords: { type: "array", items: { type: "string" } },
    },
    required: ["title", "body", "cta_label", "hashtags", "image_prompt", "keywords"],
    additionalProperties: false,
  },
  review_reply: {
    type: "object",
    properties: {
      sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
      replies: {
        type: "array",
        items: {
          type: "object",
          properties: {
            tone: { type: "string", enum: ["warm", "professional", "apologetic"] },
            text: { type: "string" },
          },
          required: ["tone", "text"],
        },
      },
      escalate: { type: "boolean" },
      improvement_note: { type: "string" },
    },
    required: ["sentiment", "replies", "escalate", "improvement_note"],
    additionalProperties: false,
  },
  seo_recommendations: {
    type: "object",
    properties: {
      visibility_score: { type: "integer", minimum: 0, maximum: 100 },
      keywords: {
        type: "array",
        items: {
          type: "object",
          properties: {
            keyword: { type: "string" },
            opportunity: { type: "string", enum: ["low", "medium", "high"] },
            rationale: { type: "string" },
          },
          required: ["keyword", "opportunity", "rationale"],
        },
      },
      actions: { type: "array", items: { type: "string" } },
      competitor_gaps: { type: "array", items: { type: "string" } },
    },
    required: ["visibility_score", "keywords", "actions", "competitor_gaps"],
    additionalProperties: false,
  },
  agent_chat: {
    type: "object",
    properties: {
      message: { type: "string" },
      next_actions: { type: "array", items: { type: "string" } },
    },
    required: ["message", "next_actions"],
    additionalProperties: false,
  },
};

const SYSTEM_PROMPTS: Record<string, string> = {
  insights:
    "You are AISTUDIYO Growth AI — a local-business growth strategist. Generate 4-6 concise, specific insights about a Google Business presence. Each insight must have an actionable next step. Use real numbers when given context. Plain English. No fluff.",
  ads_campaign:
    "You are a senior Google Ads strategist. Produce one complete AI-optimized campaign for the user's business. Headlines max 30 chars. Descriptions max 90 chars. 8-12 keywords. 3-5 ad groups. Predicted CTR realistic (1-8%). Predicted CPC realistic ($0.4-$3.5). Be specific to the business.",
  analytics_summary:
    "You are a GA4 analyst. Summarize the user's website analytics in plain English. Call out wins, drop-offs, and 3 concrete actions. No jargon.",
  post_generator:
    "You are a Google Business Profile content strategist. Generate one post optimized for local SEO and engagement. Body 2-3 sentences. 5-8 hashtags. Include a vivid image prompt for an image-gen model.",
  review_reply:
    "You are a local business owner's review reply assistant. Detect sentiment, generate 3 reply variants (warm, professional, apologetic) — each under 60 words, never generic. Flag escalation for negative reviews. Add a one-line internal improvement note.",
  seo_recommendations:
    "You are a local SEO expert. Score visibility 0-100. Surface 6-8 keyword opportunities with realistic difficulty. Give 4-6 concrete actions and 3 competitor gaps. Specific to the business and city.",
  agent_chat:
    "You are AISTUDIYO Growth Agent — an autonomous AI manager for a local business's Google presence. Respond conversationally and concisely (under 120 words). Always end with 2-4 short next-action suggestions the user can tap.",
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
      tools: [{ type: "function", function: { name: toolName, description: "Return structured growth data", parameters } }],
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
    const schema = SCHEMAS[action];
    const system = SYSTEM_PROMPTS[action];
    if (!schema || !system) {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("LOVABLE_API_KEY is not configured");

    const ctx = body.context ? JSON.stringify(body.context).slice(0, 4000) : "";
    const userPrompt = `${body.prompt || ""}\n\nBusiness context: ${ctx || "(local business, mock data)"}`.trim();

    const response = await callGateway(key, system, userPrompt, `growth_${action}`, schema);
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
    console.error("growth-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});