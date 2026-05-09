// Agent runner — Publisher (creates posts pending approval) + Insights (research/analyze/blend).
// Deducts wallet credits and saves output to agent_reports.

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
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!r.ok) throw new Error(`AI gateway ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function getOrCreateWallet() {
  const r = await db(`wallet?select=*&limit=1`);
  const rows = await r.json();
  if (rows[0]) return rows[0];
  const c = await db("wallet", { method: "POST", body: JSON.stringify({ balance: 50 }) });
  const [w] = await c.json();
  return w;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { agent_id, params = {} } = await req.json();
    if (!agent_id) throw new Error("agent_id required");

    const aRes = await db(`agents?id=eq.${agent_id}&select=*`);
    const [agent] = await aRes.json();
    if (!agent) throw new Error("agent not found");

    const cost = agent.type === "publisher" ? 5 : 3;

    // Wallet check
    const wallet = await getOrCreateWallet();
    if ((wallet.balance ?? 0) < cost) {
      return new Response(JSON.stringify({ error: `Insufficient credits (need ${cost}, have ${wallet.balance})` }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Brand context
    const bRes = await db(`brand_profile?select=*&order=created_at.desc&limit=1`);
    const [brand] = await bRes.json();
    const brandLine = brand
      ? `Brand: ${brand.name}. Voice: ${brand.voice ?? "n/a"}. Audience: ${brand.audience ?? "n/a"}. Style: ${brand.style_prompt ?? "n/a"}.`
      : "No brand profile yet.";

    // IG context (test-mode metadata)
    const igRes = await db(`meta_connections?provider=eq.instagram&select=*&limit=1`);
    const [ig] = await igRes.json();
    const igLine = ig ? `Instagram connected: @${ig.ig_user_id}.` : "No Instagram connected (using simulated data).";

    // Create run
    const runRes = await db("agent_runs", {
      method: "POST",
      body: JSON.stringify({ agent_id, status: "running", logs: [{ t: new Date().toISOString(), msg: "Agent started" }] }),
    });
    const [run] = await runRes.json();

    const logs: any[] = [
      { t: new Date().toISOString(), msg: "Loaded agent + brand + IG context" },
      { t: new Date().toISOString(), msg: `Reserved ${cost} credits` },
    ];

    let output = "";
    let reportType = "plan";
    let reportTitle = "";

    if (agent.type === "publisher") {
      const posts = Math.max(1, Math.min(14, Number(params.posts ?? 3)));
      const days = Math.max(1, Math.min(30, Number(params.days ?? 7)));
      logs.push({ t: new Date().toISOString(), msg: `Drafting ${posts} posts across ${days} days` });

      output = await callAI(
        [{ role: "user", content: `Draft ${posts} Instagram posts spread across ${days} days. For each, output: ### Day N — Title, then **Hook**, **Caption** (<=80 words), **Image prompt**, **Hashtags**. Goal: ${agent.goal ?? "growth"}.` }],
        `${agent.system_prompt ?? "You are a senior social media strategist."}\n${brandLine}\n${igLine}`,
      );

      // Generate scheduled_posts pending approval
      const today = new Date();
      const interval = Math.max(1, Math.floor(days / posts));
      const draft: any[] = [];
      for (let i = 0; i < posts; i++) {
        const d = new Date(today); d.setDate(today.getDate() + i * interval); d.setHours(10, 0, 0, 0);
        draft.push({
          title: `${brand?.name ?? "Brand"} · Post ${i + 1}`,
          caption: output.split("###")[i + 1]?.slice(0, 280) ?? output.slice(0, 200),
          platform: "instagram",
          scheduled_for: d.toISOString(),
          status: "draft",
          approval_status: "pending_approval",
        });
      }
      await db("scheduled_posts", { method: "POST", body: JSON.stringify(draft) });
      logs.push({ t: new Date().toISOString(), msg: `${posts} posts queued for your approval` });
      reportType = "plan";
      reportTitle = `Content plan · ${posts} posts · ${new Date().toLocaleDateString()}`;
    } else {
      // insights
      const mode = (params.mode as string) ?? "blend";
      logs.push({ t: new Date().toISOString(), msg: `Insights mode: ${mode}` });
      const prompt =
        mode === "research"
          ? `Surface 5 emerging trends this week relevant to: ${agent.goal ?? "the brand"}. For each: trend, why it matters, content angle, hashtags.`
          : mode === "analyze"
          ? `Generate a 1-page engagement audit (markdown) for ${ig ? "@" + ig.ig_user_id : "the brand"}: top metrics, 3 wins, 3 issues, next-week recommendations.`
          : `Combine trend research + a performance audit for ${ig ? "@" + ig.ig_user_id : "the brand"}. Sections: ## Trends (5 items), ## Performance (wins/issues), ## Plays for next week.`;
      output = await callAI(
        [{ role: "user", content: prompt }],
        `${agent.system_prompt ?? "You are an analytics-driven growth marketer and culture analyst."}\n${brandLine}\n${igLine}`,
      );
      reportType = mode === "analyze" ? "analysis" : "research";
      reportTitle = `${mode === "research" ? "Trends" : mode === "analyze" ? "Performance audit" : "Insights"} · ${new Date().toLocaleDateString()}`;
    }

    // Save report
    await db("agent_reports", {
      method: "POST",
      body: JSON.stringify({
        agent_id, run_id: run.id, title: reportTitle, type: reportType,
        content_md: output, metadata: { params },
      }),
    });
    logs.push({ t: new Date().toISOString(), msg: "Report saved" });

    // Debit wallet
    await db(`wallet?id=eq.${wallet.id}`, {
      method: "PATCH",
      body: JSON.stringify({ balance: wallet.balance - cost }),
    });
    await db("credit_transactions", {
      method: "POST",
      body: JSON.stringify({ agent_id, run_id: run.id, amount: -cost, reason: `${agent.type} run` }),
    });
    logs.push({ t: new Date().toISOString(), msg: `Charged ${cost} credits` });

    await db(`agent_runs?id=eq.${run.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "succeeded", output, logs, finished_at: new Date().toISOString() }),
    });

    return new Response(JSON.stringify({ run_id: run.id, output, logs, charged: cost }), {
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
