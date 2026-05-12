import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlowCard } from "@/components/ui/glow-card";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CompactStatsCard } from "@/components/admin/CompactStatsCard";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { RealtimeFeed, type FeedItem } from "@/components/admin/RealtimeFeed";
import { AIHealthIndicator } from "@/components/admin/AIHealthIndicator";
import PulseStrip from "@/components/admin/PulseStrip";
import {
  Users, Activity, ShieldCheck, Building2, Cpu, CircleDollarSign,
  UserPlus, AlertTriangle, Sparkles, ServerCrash, TrendingUp,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

type Recent = { user_id: string; email: string | null; display_name: string | null; created_at: string };

export default function SuperAdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, weekly: 0, prevWeekly: 0, workspaces: 0, ai: 0, admins: 0, failures: 0, cost: 0 });
  const [recent, setRecent] = useState<Recent[]>([]);
  const [providersOk, setProvidersOk] = useState({ ok: 0, total: 0 });
  const [aiFails, setAiFails] = useState<{ id: string; model_slug: string; status: string; created_at: string }[]>([]);
  const [signups, setSignups] = useState<{ user_id: string; created_at: string }[]>([]);
  const [topModel, setTopModel] = useState<{ slug: string; count: number } | null>(null);

  useEffect(() => {
    (async () => {
      const dayAgo = new Date(Date.now() - 86400_000).toISOString();
      const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
      const twoWeeksAgo = new Date(Date.now() - 14 * 86400_000).toISOString();
      const [u, weekly, prevWeekly, ws, ai, aiCost, roles, recentRes, prov, fails, sig] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", twoWeeksAgo).lt("created_at", weekAgo),
        supabase.from("workspaces").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("ai_request_logs").select("model_slug").gte("created_at", dayAgo),
        supabase.from("ai_request_logs").select("cost_usd").gte("created_at", weekAgo),
        supabase.from("user_roles").select("role"),
        supabase.from("profiles").select("user_id,email,display_name,created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("ai_providers").select("status,enabled"),
        supabase.from("ai_request_logs").select("id,model_slug,status,created_at").neq("status", "success").order("created_at", { ascending: false }).limit(4),
        supabase.from("profiles").select("user_id,created_at").gte("created_at", twoWeeksAgo),
      ]);
      const dist: Record<string, number> = {};
      (roles.data ?? []).forEach((r: { role: string }) => { dist[r.role] = (dist[r.role] ?? 0) + 1; });
      const total = (prov.data ?? []).length;
      const ok = (prov.data ?? []).filter((p: { enabled: boolean; status: string }) => p.enabled && p.status === "healthy").length;
      const cost = (aiCost.data ?? []).reduce(
        (s: number, r: { cost_usd?: string | number | null }) => s + Number(r.cost_usd ?? 0),
        0,
      );

      // Top model in last 24h
      const counts = new Map<string, number>();
      (ai.data ?? []).forEach((r: { model_slug: string }) =>
        counts.set(r.model_slug, (counts.get(r.model_slug) ?? 0) + 1),
      );
      const top = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];

      setProvidersOk({ ok, total });
      setStats({
        users: u.count ?? 0,
        weekly: weekly.count ?? 0,
        prevWeekly: prevWeekly.count ?? 0,
        workspaces: ws.count ?? 0,
        ai: (ai.data ?? []).length,
        admins: (dist["super_admin"] ?? 0) + (dist["admin"] ?? 0),
        failures: (fails.data ?? []).length,
        cost,
      });
      setTopModel(top ? { slug: top[0], count: top[1] } : null);
      setRecent((recentRes.data ?? []) as Recent[]);
      setAiFails((fails.data ?? []) as { id: string; model_slug: string; status: string; created_at: string }[]);
      setSignups((sig.data ?? []) as { user_id: string; created_at: string }[]);
      setLoading(false);
    })();
  }, []);

  const growthSeries = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => startOfDay(subDays(new Date(), 13 - i)));
    return days.map((d) => {
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const n = signups.filter((s) => { const t = new Date(s.created_at); return t >= d && t < next; }).length;
      return { date: format(d, "MMM d"), signups: n };
    });
  }, [signups]);

  const weeklyDelta = stats.prevWeekly > 0 ? ((stats.weekly - stats.prevWeekly) / stats.prevWeekly) * 100 : 0;

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
    <div className="space-y-4 max-w-[1600px] mx-auto">
      <AdminPageHeader
        eyebrow="Command Center"
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

      <PulseStrip />

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <CompactStatsCard label="Users" value={stats.users} hint={`+${stats.weekly} this week`} trend={weeklyDelta} icon={Users} loading={loading} />
        <CompactStatsCard label="AI 24h" value={stats.ai} icon={Cpu} loading={loading} />
        <CompactStatsCard label="Cost 7d" value={`$${stats.cost.toFixed(2)}`} icon={CircleDollarSign} loading={loading} />
        <CompactStatsCard label="Workspaces" value={stats.workspaces} icon={Building2} loading={loading} />
        <CompactStatsCard label="Admins" value={stats.admins} icon={ShieldCheck} loading={loading} />
        <CompactStatsCard label="Failures" value={stats.failures} hint="last 24h" icon={AlertTriangle} loading={loading} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <GlowCard className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Signups · 14 days</h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{signups.length} total</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthSeries} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ov-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.25} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={24} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="signups" stroke="hsl(var(--primary))" strokeWidth={1.5} fill="url(#ov-area)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>

        <GlowCard className="p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">AI assistant summary</h3>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>• {stats.weekly} new users this week ({weeklyDelta >= 0 ? "+" : ""}{weeklyDelta.toFixed(1)}% vs last week).</li>
            <li>• {stats.failures > 0 ? `${stats.failures} AI failures in last 24h — review Support.` : "AI providers running clean."}</li>
            {topModel && <li>• Top model 24h: <span className="font-mono text-foreground/80">{topModel.slug}</span> ({topModel.count} req).</li>}
            <li>• Spent <span className="text-foreground/80">${stats.cost.toFixed(2)}</span> on AI in last 7 days.</li>
            <li>• {stats.workspaces} active workspaces.</li>
          </ul>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <GlowCard className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Realtime activity</h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">live</span>
          </div>
          <RealtimeFeed items={feed} empty="No activity in the last 24 hours." />
        </GlowCard>

        <GlowCard className="p-4">
          <h3 className="text-sm font-semibold mb-3">System health</h3>
          <ul className="space-y-2 text-sm">
            {["API Gateway", "Auth", "Database", "Storage"].map((s) => (
              <li key={s} className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">{s}</span>
                <AIHealthIndicator status="healthy" />
              </li>
            ))}
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">AI providers</span>
              <AIHealthIndicator status={providersOk.ok === providersOk.total ? "healthy" : "degraded"} label={`${providersOk.ok}/${providersOk.total}`} />
            </li>
          </ul>
        </GlowCard>
      </div>
    </div>
  );
}
