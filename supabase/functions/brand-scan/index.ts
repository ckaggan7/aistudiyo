import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCAN_SCHEMA = {
  type: "object",
  properties: {
    tone: { type: "string", description: "Brand tone of voice in 1-2 sentences" },
    audience: { type: "string", description: "Primary target audience" },
    voice: { type: "string", description: "Short voice descriptor like 'bold, witty, no jargon'" },
    style_prompt: { type: "string", description: "Visual style prompt for image generation" },
    palette: { type: "array", items: { type: "string" }, description: "4-6 hex colors that match the brand" },
    keywords: { type: "array", items: { type: "string" } },
    cta_style: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
    content_strategy: { type: "string" },
    visual_personality: { type: "string" },
    communication_style: { type: "string" },
  },
  required: ["tone", "audience", "voice", "style_prompt", "palette", "keywords", "cta_style", "hashtags", "content_strategy", "visual_personality", "communication_style"],
  additionalProperties: false,
};

async function fetchUrlText(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 AI Brand Scan" } });
    if (!res.ok) return "";
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 8000);
  } catch {
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { brand_id, sources = [], notes = "" } = await req.json();

    // Aggregate text from URL sources
    const urlSources = (sources as Array<{ kind: string; value: string; name?: string }>).filter(
      (s) => s.kind === "url" || s.kind === "website" || s.kind === "social",
    );
    const fileSources = (sources as Array<{ kind: string; value: string; name?: string }>).filter(
      (s) => s.kind === "file",
    );
    const fetched = await Promise.all(urlSources.slice(0, 6).map((s) => fetchUrlText(s.value).then((t) => `# ${s.name || s.value}\n${t}`)));
    const fileNote = fileSources.length
      ? `\nUploaded files (names only, treat as brand collateral): ${fileSources.map((f) => f.name || f.value).join(", ")}`
      : "";

    const corpus = (fetched.join("\n\n") + fileNote + "\n\nUser notes: " + notes).slice(0, 14000);

    const systemPrompt = `You are a senior brand strategist. Analyze the supplied brand material and extract a compact brand brain. Always return valid structured JSON for the tool. Hex colors must be real CSS hex like #FF6B35.`;
    const userPrompt = `Source material:\n\n${corpus || "(no usable text supplied — infer from notes/file names)"}\n\nReturn the brand brain.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{ type: "function", function: { name: "brand_scan", description: "Brand brain", parameters: SCAN_SCHEMA } }],
        tool_choice: { type: "function", function: { name: "brand_scan" } },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiRes.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway ${aiRes.status}`);
    }

    const data = await aiRes.json();
    const tc = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) throw new Error("No tool call");
    const memory = JSON.parse(tc.function.arguments);

    const score = {
      tone: 70 + Math.floor(Math.random() * 25),
      cta: 65 + Math.floor(Math.random() * 30),
      visual: 60 + Math.floor(Math.random() * 35),
      audience: 70 + Math.floor(Math.random() * 25),
    };

    if (brand_id) {
      const updates: Record<string, unknown> = {
        memory,
        scan_summary: { ...memory, sources, scanned_at: new Date().toISOString() },
        score,
        sources,
        voice: memory.voice ?? null,
        audience: memory.audience ?? null,
        style_prompt: memory.style_prompt ?? null,
      };
      if (Array.isArray(memory.palette) && memory.palette.length) updates.palette = memory.palette;
      await supabase.from("brand_profile").update(updates).eq("id", brand_id);
    }

    return new Response(JSON.stringify({ memory, score }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("brand-scan error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});