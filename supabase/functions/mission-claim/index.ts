import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Whitelist of mission ids → reward XP + credits. Keeping these server-side prevents tampering.
const REWARDS: Record<string, { xp: number; credits: number; verify?: "content_pack" | "scheduled_post" | "agent_run" | null }> = {
  m1: { xp: 120, credits: 5,  verify: "content_pack" },
  m2: { xp: 80,  credits: 3,  verify: "content_pack" },
  m3: { xp: 100, credits: 5,  verify: "scheduled_post" },
  m4: { xp: 150, credits: 10, verify: null },
  m5: { xp: 200, credits: 15, verify: null },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json().catch(() => ({}));
    const missionId = String(body.mission_id ?? "");
    const reward = REWARDS[missionId];
    if (!reward) return new Response(JSON.stringify({ error: "Unknown mission" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Already claimed?
    const { data: existing } = await userClient.from("creator_missions").select("id").eq("user_id", user.id).eq("mission_id", missionId).maybeSingle();
    if (existing) return new Response(JSON.stringify({ already_claimed: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Verify the user actually performed the gated action
    if (reward.verify === "content_pack") {
      const { count } = await userClient.from("content_packs").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      if (!count || count < 1) return new Response(JSON.stringify({ error: "Generate at least one content pack first." }), { status: 412, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } else if (reward.verify === "scheduled_post") {
      const { count } = await userClient.from("scheduled_posts").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      if (!count || count < 1) return new Response(JSON.stringify({ error: "Schedule at least one post first." }), { status: 412, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Insert mission record
    const { error: insErr } = await userClient.from("creator_missions").insert({
      user_id: user.id, mission_id: missionId, status: "claimed", xp: reward.xp,
      rewards: { credits: reward.credits },
    });
    if (insErr) throw insErr;

    // Award credits via service role for the wallet update
    if (reward.credits > 0) {
      const service = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await service.from("wallet").upsert({ user_id: user.id, balance: 0 }, { onConflict: "user_id", ignoreDuplicates: true });
      const { data: w } = await service.from("wallet").select("balance").eq("user_id", user.id).maybeSingle();
      const newBal = (w?.balance ?? 0) + reward.credits;
      await service.from("wallet").update({ balance: newBal, updated_at: new Date().toISOString() }).eq("user_id", user.id);
      await service.from("credit_transactions").insert({ user_id: user.id, amount: reward.credits, reason: `Mission ${missionId} reward`, type: "credit" });
    }

    return new Response(JSON.stringify({ ok: true, xp: reward.xp, credits: reward.credits }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("mission-claim error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
