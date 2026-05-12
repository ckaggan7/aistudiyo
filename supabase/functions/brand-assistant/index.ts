import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const { messages = [], brand = {} } = await req.json();

    const memory = brand?.memory ?? {};
    const systemPrompt = `You are the AI Brand Assistant for AI STUDIYO. You help the creator stay on-brand.
Brand: ${brand.name ?? "(unnamed)"} | Category: ${brand.category ?? "—"}
Voice: ${memory.voice ?? brand.voice ?? "—"}
Audience: ${memory.audience ?? brand.audience ?? "—"}
CTA style: ${memory.cta_style ?? "—"}
Visual personality: ${memory.visual_personality ?? brand.style_prompt ?? "—"}
Hashtags: ${(memory.hashtags ?? []).slice(0, 8).join(" ")}
Keywords: ${(memory.keywords ?? []).slice(0, 8).join(", ")}

Be brief, actionable, and creator-first. When suggesting copy, give 1-3 short options. Detect inconsistencies. Recommend campaigns when relevant.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiRes.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway ${aiRes.status}`);
    }

    const data = await aiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});