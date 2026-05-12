import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CompactStatsCard } from "@/components/admin/CompactStatsCard";
import { GlowCard } from "@/components/ui/glow-card";
import { Users, Activity, Building2, TrendingUp } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

export default function SuperAdminAnalytics() {
  const [profiles, setProfiles] = useState<{ user_id: string; email: string | null; display_name: string | null; created_at: string }[]>([]);
  const [workspaces, setWorkspaces] = useState<{ id: string; name: string; created_at: string; credits: number }[]>([]);
  const [aiLogs, setAiLogs] = useState<{ user_id: string | null; created_at: string }[]>([]);
  const [activity, setActivity] = useState<{ user_id: string | null; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const since = subDays(new Date(), 30).toISOString();
      const [p, w, ai, a] = await Promise.all([
        supabase.from("profiles").select("user_id,email,display_name,created_at"),
        supabase.from("workspaces").select("id,name,created_at,credits"),
        supabase.from("ai_request_logs").select("user_id,created_at").gte("created_at", since),
        supabase.from("activity_logs").select("user_id,created_at").gte("created_at", since),
      ]);
      setProfiles((p.data ?? []) as { user_id: string; email: string | null; display_name: string | null; created_at: string }[]);
      setWorkspaces((w.data ?? []) as { id: string; name: string; created_at: string; credits: number }[]);
      setAiLogs((ai.data ?? []) as { user_id: string | null; created_at: string }[]);
      setActivity((a.data ?? []) as { user_id: string | null; created_at: string }[]);
    })();
  }, []);

  const growth = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => startOfDay(subDays(new Date(), 29 - i)));
    return days.map((d) => {
      const next = new Date(d); next.setDate(next.getDate() + 1);
      return {
        date: format(d, "MMM d"),
        users: profiles.filter((p) => { const t = new Date(p.created_at); return t < next; }).length,
        ai: aiLogs.filter((l) => { const t = new Date(l.created_at); return t >= d && t < next; }).length,
      };
    });
  }, [profiles, aiLogs]);

  const activeUsers = new Set(activity.filter((a) => a.user_id).map((a) => a.user_id)).size;
  const topCreators = useMemo(() => {
    const m = new Map<string, number>();
    aiLogs.forEach((l) => { if (l.user_id) m.set(l.user_id, (m.get(l.user_id) ?? 0) + 1); });
    return Array.from(m, ([uid, n]) => ({ uid, n, profile: profiles.find((p) => p.user_id === uid) }))
      .sort((a, b) => b.n - a.n).slice(0, 6);
  }, [aiLogs, profiles]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <AdminPageHeader eyebrow="Analytics" title="Platform Insights" description="Growth, engagement and top creators across the platform." />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CompactStatsCard label="Total users" value={profiles.length} icon={Users} />
        <CompactStatsCard label="Active (30d)" value={activeUsers} icon={Activity} />
        <CompactStatsCard label="Workspaces" value={workspaces.length} icon={Building2} />
        <CompactStatsCard label="AI requests 30d" value={aiLogs.length} icon={TrendingUp} />
      </section>

      <GlowCard className="p-5">
        <h2 className="text-sm font-semibold mb-4">Growth · 30 days</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growth}>
              <defs>
                <linearGradient id="users-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#users-area)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlowCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-3">Top creators · AI requests (30d)</h3>
          {topCreators.length === 0 ? (
            <p className="text-xs text-muted-foreground">No usage yet.</p>
          ) : (
            <ul className="space-y-2">
              {topCreators.map((c, i) => (
                <li key={c.uid} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-xs text-muted-foreground tabular-nums">#{i + 1}</span>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{c.profile?.display_name ?? c.profile?.email ?? c.uid.slice(0, 8)}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{c.profile?.email}</div>
                    </div>
                  </div>
                  <span className="text-xs tabular-nums">{c.n}</span>
                </li>
              ))}
            </ul>
          )}
        </GlowCard>

        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-3">Top workspaces · credits</h3>
          {workspaces.length === 0 ? (
            <p className="text-xs text-muted-foreground">No workspaces yet.</p>
          ) : (
            <ul className="space-y-2">
              {[...workspaces].sort((a, b) => b.credits - a.credits).slice(0, 6).map((w, i) => (
                <li key={w.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-xs text-muted-foreground tabular-nums">#{i + 1}</span>
                    <div className="truncate font-medium">{w.name}</div>
                  </div>
                  <span className="text-xs tabular-nums">{w.credits}</span>
                </li>
              ))}
            </ul>
          )}
        </GlowCard>
      </div>
    </div>
  );
}