// Agent runner — orchestrates a publisher / researcher / analyst agent using Lovable AI Gateway.
// Tools available are mocked for now; meta-publish / meta-insights become real once META secrets are set.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

async function db(path: string, init: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
  });
}

async function callAI(messages: any[], system: string) {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!r.ok) throw new Error(`AI gateway ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.choices?.[0]?.message?.content ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { agent_id } = await req.json();
    if (!agent_id) throw new Error("agent_id required");

    // Load agent
    const aRes = await db(`agents?id=eq.${agent_id}&select=*`);
    const [agent] = await aRes.json();
    if (!agent) throw new Error("agent not found");

    // Load brand context
    const bRes = await db(`brand_profile?select=*&order=created_at.desc&limit=1`);
    const [brand] = await bRes.json();

    // Create run
    const runRes = await db("agent_runs", {
      method: "POST",
      body: JSON.stringify({ agent_id, status: "running", logs: [{ t: new Date().toISOString(), msg: "Agent started" }] }),
    });
    const [run] = await runRes.json();

    const logs: any[] = [{ t: new Date().toISOString(), msg: "Loaded agent and brand context" }];
    const brandLine = brand
      ? `Brand: ${brand.name}. Voice: ${brand.voice ?? "n/a"}. Audience: ${brand.audience ?? "n/a"}. Style: ${brand.style_prompt ?? "n/a"}.`
      : "No brand profile yet.";

    let output = "";

    if (agent.type === "publisher") {
      logs.push({ t: new Date().toISOString(), msg: "Drafting weekly content plan" });
      const plan = await callAI(
        [{ role: "user", content: `Draft a 7-day Instagram content plan in markdown with: day, hook, caption (<= 80 words), suggested image prompt. Goal: ${agent.goal ?? "growth"}.` }],
        `${agent.system_prompt ?? "You are a senior social media strategist."}\n${brandLine}`,
      );
      output = plan;

      // Auto-create 3 scheduled_posts from the AI output
      const today = new Date();
      const samples = [0, 2, 4].map((d) => {
        const date = new Date(today); date.setDate(today.getDate() + d); date.setHours(10, 0, 0, 0);
        return {
          title: `${brand?.name ?? "Brand"} · Day ${d + 1}`,
          caption: plan.slice(0, 200),
          platform: "instagram",
          scheduled_for: date.toISOString(),
          status: "scheduled",
        };
      });
      await db("scheduled_posts", { method: "POST", body: JSON.stringify(samples) });
      logs.push({ t: new Date().toISOString(), msg: `Scheduled ${samples.length} posts to calendar` });
    } else if (agent.type === "researcher") {
      logs.push({ t: new Date().toISOString(), msg: "Scanning trends" });
      output = await callAI(
        [{ role: "user", content: `Surface 5 emerging social media trends this week relevant to: ${agent.goal ?? "the brand"}. For each: trend name, why it matters, content angle, hashtags.` }],
        `${agent.system_prompt ?? "You are a culture and trend analyst."}\n${brandLine}`,
      );
    } else if (agent.type === "analyst") {
      logs.push({ t: new Date().toISOString(), msg: "Computing engagement insights" });
      output = await callAI(
        [{ role: "user", content: `Generate a 1-page engagement report (markdown) with: top metrics, 3 wins, 3 issues, next-week recommendations. Brand goal: ${agent.goal ?? "n/a"}.` }],
        `${agent.system_prompt ?? "You are an analytics-driven growth marketer."}\n${brandLine}`,
      );
    } else {
      output = "Unknown agent type.";
    }

    logs.push({ t: new Date().toISOString(), msg: "Run complete" });
    await db(`agent_runs?id=eq.${run.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "succeeded", output, logs, finished_at: new Date().toISOString() }),
    });

    return new Response(JSON.stringify({ run_id: run.id, output, logs }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("agent-runner error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
