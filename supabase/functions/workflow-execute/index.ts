// Workflow executor — runs a workflow graph node-by-node and persists each step.
// Node types: trigger, ai-text, ai-image, logic-condition, transform, output
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Node = {
  id: string;
  type: string;
  data: { label?: string; nodeType: string; config?: Record<string, any> };
};
type Edge = { id: string; source: string; target: string };
type Graph = { nodes: Node[]; edges: Edge[] };

const LOVABLE_AI_KEY = Deno.env.get("LOVABLE_API_KEY");

function topoSort(graph: Graph): Node[] {
  const inDeg = new Map<string, number>();
  graph.nodes.forEach((n) => inDeg.set(n.id, 0));
  graph.edges.forEach((e) => inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1));
  const queue: string[] = [];
  inDeg.forEach((d, id) => d === 0 && queue.push(id));
  const out: Node[] = [];
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  while (queue.length) {
    const id = queue.shift()!;
    const n = byId.get(id);
    if (n) out.push(n);
    graph.edges
      .filter((e) => e.source === id)
      .forEach((e) => {
        inDeg.set(e.target, (inDeg.get(e.target) ?? 0) - 1);
        if ((inDeg.get(e.target) ?? 0) === 0) queue.push(e.target);
      });
  }
  return out;
}

function interpolate(template: string, ctx: Record<string, any>): string {
  return (template ?? "").replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const parts = key.split(".");
    let v: any = ctx;
    for (const p of parts) v = v?.[p];
    return v == null ? "" : String(v);
  });
}

async function callAIText(prompt: string, model = "google/gemini-3-flash-preview", system?: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_AI_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI gateway ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function executeNode(node: Node, ctx: Record<string, any>): Promise<any> {
  const cfg = node.data?.config ?? {};
  const type = node.data?.nodeType ?? node.type;
  switch (type) {
    case "trigger":
      return { triggered: true, source: cfg.source ?? "manual", at: new Date().toISOString() };
    case "ai-text": {
      const prompt = interpolate(cfg.prompt ?? "", ctx);
      const text = await callAIText(prompt, cfg.model, cfg.system);
      return { text };
    }
    case "ai-image": {
      const prompt = interpolate(cfg.prompt ?? "", ctx);
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${LOVABLE_AI_KEY}` },
        body: JSON.stringify({
          model: cfg.model ?? "google/gemini-2.5-flash-image-preview",
          messages: [{ role: "user", content: prompt }],
          modalities: ["image", "text"],
        }),
      });
      if (!res.ok) throw new Error(`Image gen ${res.status}`);
      const data = await res.json();
      const img = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      return { image_url: img, prompt };
    }
    case "logic-condition": {
      const left = interpolate(cfg.left ?? "", ctx);
      const right = interpolate(cfg.right ?? "", ctx);
      const op = cfg.op ?? "equals";
      let result = false;
      if (op === "equals") result = left === right;
      else if (op === "contains") result = left.includes(right);
      else if (op === "not_empty") result = left.trim().length > 0;
      return { passed: result, left, right };
    }
    case "transform": {
      const template = cfg.template ?? "";
      return { value: interpolate(template, ctx) };
    }
    case "output":
      return { final: interpolate(cfg.template ?? "{{prev.text}}", ctx) };
    default:
      return { skipped: true, reason: `unknown node type ${type}` };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const { workflowId, input } = await req.json();
    if (!workflowId) return new Response("workflowId required", { status: 400, headers: corsHeaders });

    const { data: wf, error: wfErr } = await supabase
      .from("workflows")
      .select("id, graph, user_id")
      .eq("id", workflowId)
      .maybeSingle();
    if (wfErr || !wf) return new Response("Workflow not found", { status: 404, headers: corsHeaders });

    const { data: run, error: runErr } = await supabase
      .from("workflow_runs")
      .insert({
        workflow_id: workflowId,
        user_id: user.id,
        status: "running",
        trigger_source: "manual",
        input: input ?? {},
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (runErr || !run) throw runErr;

    const startedTotal = Date.now();
    const graph = wf.graph as Graph;
    const sorted = topoSort(graph);
    const ctx: Record<string, any> = { input: input ?? {}, prev: {}, nodes: {} };
    let finalOutput: any = null;
    let runError: string | null = null;

    for (let i = 0; i < sorted.length; i++) {
      const node = sorted[i];
      const stepStart = Date.now();
      const stepInput = { ...ctx };

      const { data: step } = await supabase
        .from("workflow_run_steps")
        .insert({
          run_id: run.id,
          node_id: node.id,
          node_type: node.data?.nodeType ?? node.type,
          node_label: node.data?.label ?? null,
          status: "running",
          input: stepInput,
          step_index: i,
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      try {
        const out = await executeNode(node, ctx);
        ctx.prev = out;
        ctx.nodes[node.id] = out;
        finalOutput = out;
        await supabase.from("workflow_run_steps").update({
          status: "success",
          output: out,
          duration_ms: Date.now() - stepStart,
          finished_at: new Date().toISOString(),
        }).eq("id", step!.id);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        runError = msg;
        await supabase.from("workflow_run_steps").update({
          status: "failed",
          error: msg,
          duration_ms: Date.now() - stepStart,
          finished_at: new Date().toISOString(),
        }).eq("id", step!.id);
        break;
      }
    }

    await supabase.from("workflow_runs").update({
      status: runError ? "failed" : "success",
      output: finalOutput,
      error: runError,
      duration_ms: Date.now() - startedTotal,
      finished_at: new Date().toISOString(),
    }).eq("id", run.id);

    await supabase.from("workflows").update({
      last_run_at: new Date().toISOString(),
      run_count: ((wf as any).run_count ?? 0) + 1,
    }).eq("id", workflowId);

    return new Response(JSON.stringify({ runId: run.id, status: runError ? "failed" : "success", output: finalOutput, error: runError }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});