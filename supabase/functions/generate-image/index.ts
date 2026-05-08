import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, style, stylePrompt, mode, imageBase64 } = await req.json();
    if (!prompt && mode !== "image") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let finalPrompt = `${prompt || "Recreate this image"} ${stylePrompt || ""}`.trim();
    let analyzedPrompt: string | null = null;

    // If user uploaded an image, ask the model to analyze it and craft a richer prompt first
    if (mode === "image" && imageBase64) {
      const visionRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are an expert image-prompt engineer. Look at the user's image and write ONE rich, detailed text-to-image prompt (max 120 words) that recreates it transformed into the requested style. Keep subject, composition, mood; reinterpret in the style. Output only the prompt.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Style: ${style}. Style description: ${stylePrompt}. Extra notes: ${prompt || "none"}.`,
                },
                { type: "image_url", image_url: { url: imageBase64 } },
              ],
            },
          ],
        }),
      });
      if (visionRes.ok) {
        const v = await visionRes.json();
        analyzedPrompt = v.choices?.[0]?.message?.content?.trim() || null;
        if (analyzedPrompt) finalPrompt = analyzedPrompt;
      }
    }

    // Generate image via Lovable AI Gateway (Nano Banana)
    const imgRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: finalPrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!imgRes.ok) {
      if (imgRes.status === 429)
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again soon." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (imgRes.status === 402)
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await imgRes.text();
      console.error("Image gen error:", imgRes.status, t);
      throw new Error("Image generation failed");
    }

    const data = await imgRes.json();
    const dataUrl: string | undefined =
      data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!dataUrl) throw new Error("No image returned from model");

    // Upload base64 to storage so the client gets a permanent URL
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const base64 = dataUrl.split(",")[1];
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const fileName = `${crypto.randomUUID()}.png`;

    const { error: upErr } = await supabase.storage
      .from("generations")
      .upload(fileName, bytes, { contentType: "image/png", upsert: false });
    if (upErr) {
      console.error("upload error", upErr);
      throw upErr;
    }

    const { data: pub } = supabase.storage.from("generations").getPublicUrl(fileName);
    const publicUrl = pub.publicUrl;

    // Persist to generations table
    await supabase.from("generations").insert({
      prompt: prompt || "(image upload)",
      style,
      mode: mode || "text",
      image_url: publicUrl,
      generated_prompt: analyzedPrompt,
    });

    return new Response(
      JSON.stringify({ image_url: publicUrl, generated_prompt: analyzedPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
