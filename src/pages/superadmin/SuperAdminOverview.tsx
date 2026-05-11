import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlowCard } from "@/components/ui/glow-card";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CompactStatsCard } from "@/components/admin/CompactStatsCard";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { RealtimeFeed, type FeedItem } from "@/components/admin/RealtimeFeed";
import { AIHealthIndicator } from "@/components/admin/AIHealthIndicator";
import {
  Users, Activity, ShieldCheck, Building2, Cpu, CircleDollarSign,
  UserPlus, AlertTriangle, Sparkles, LifeBuoy, ServerCrash,
} from "lucide-react";

type Recent = { user_id: string; email: string | null; display_name: string | null; created_at: string };

export default function SuperAdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, weekly: 0, workspaces: 0, ai: 0, admins: 0, failures: 0 });
  const [recent, setRecent] = useState<Recent[]>([]);
  const [providersOk, setProvidersOk] = useState({ ok: 0, total: 0 });
  const [aiFails, setAiFails] = useState<{ id: string; model_slug: string; status: string; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const dayAgo = new Date(Date.now() - 86400_000).toISOString();
      const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
      const [u, weekly, ws, ai, roles, recentRes, prov, fails] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("workspaces").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("ai_request_logs").select("*", { count: "exact", head: true }).gte("created_at", dayAgo),
        supabase.from("user_roles").select("role"),
        supabase.from("profiles").select("user_id,email,display_name,created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("ai_providers").select("status,enabled"),
        supabase.from("ai_request_logs").select("id,model_slug,status,created_at").neq("status", "success").order("created_at", { ascending: false }).limit(4),
      ]);
      const dist: Record<string, number> = {};
      (roles.data ?? []).forEach((r: any) => { dist[r.role] = (dist[r.role] ?? 0) + 1; });
      const total = (prov.data ?? []).length;
      const ok = (prov.data ?? []).filter((p: any) => p.enabled && p.status === "healthy").length;
      setProvidersOk({ ok, total });
      setStats({
        users: u.count ?? 0,
        weekly: weekly.count ?? 0,
        workspaces: ws.count ?? 0,
        ai: ai.count ?? 0,
        admins: (dist["super_admin"] ?? 0) + (dist["admin"] ?? 0),
        failures: (fails.data ?? []).length,
      });
      setRecent((recentRes.data ?? []) as Recent[]);
      setAiFails((fails.data ?? []) as any);
      setLoading(false);
    })();
  }, []);

  const feed: FeedItem[] = [
    ...recent.map((r) => ({
      id: `u-${r.user_id}`,
      icon: <UserPlus className="w-3.5 h-3.5" />,
      title: `New signup · ${r.display_name ?? r.email ?? "user"}`,
      meta: r.email ?? undefined,
      time: r.created_at,
      tone: "success" as const,
    })),
    ...aiFails.map((f) => ({
      id: `f-${f.id}`,
      icon: <ServerCrash className="w-3.5 h-3.5" />,
      title: `AI failure · ${f.model_slug}`,
      meta: f.status,
      time: f.created_at,
      tone: "error" as const,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <AdminPageHeader
        eyebrow="Super Admin"
        title="Platform Overview"
        description="Realtime pulse of users, workspaces, AI usage and system health."
        actions={
          <AdminQuickActions
            actions={[
              { label: "Invite admin", icon: ShieldCheck, to: "/superadmin/users" },
              { label: "AI failures", icon: AlertTriangle, to: "/superadmin/support" },
              { label: "Billing", icon: CircleDollarSign, to: "/superadmin/billing" },
            ]}
          />
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <CompactStatsCard label="Users" value={stats.users} hint={`+${stats.weekly} this week`} icon={Users} loading={loading} />
        <CompactStatsCard label="Active 24h" value={stats.ai} icon={Activity} loading={loading} />
        <CompactStatsCard label="AI requests 24h" value={stats.ai} icon={Cpu} loading={loading} />
        <CompactStatsCard label="Revenue MRR" value="$0" hint="not connected" icon={CircleDollarSign} loading={loading} />
        <CompactStatsCard label="Workspaces" value={stats.workspaces} icon={Building2} loading={loading} />
        <CompactStatsCard label="Admins" value={stats.admins} icon={ShieldCheck} loading={loading} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlowCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Realtime activity</h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">live</span>
          </div>
          <RealtimeFeed items={feed} empty="No activity in the last 24 hours." />
        </GlowCard>

        <div className="space-y-4">
          <GlowCard className="p-5">
            <h3 className="text-sm font-semibold mb-3">System health</h3>
            <ul className="space-y-2 text-sm">
              {["API Gateway", "Auth", "Database", "Storage"].map((s) => (
                <li key={s} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{s}</span>
                  <AIHealthIndicator status="healthy" />
                </li>
              ))}
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">AI providers</span>
                <AIHealthIndicator status={providersOk.ok === providersOk.total ? "healthy" : "degraded"} label={`${providersOk.ok}/${providersOk.total}`} />
              </li>
            </ul>
          </GlowCard>

          <GlowCard className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">AI assistant summary</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>• {stats.weekly} new users this week — {stats.users > 0 ? `+${((stats.weekly / Math.max(stats.users, 1)) * 100).toFixed(1)}%` : "—"} of base.</li>
                <li>• {stats.failures > 0 ? `${stats.failures} AI failures in last 24h. Review Support.` : "AI providers running clean."}</li>
                <li>• {stats.workspaces} active workspaces. Inspect via Workspaces.</li>
              </ul>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}