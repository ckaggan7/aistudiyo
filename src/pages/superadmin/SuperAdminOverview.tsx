import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/ui/stats-card";
import { GlowCard } from "@/components/ui/glow-card";
import { Users, UserPlus, ShieldCheck, Pause, Activity } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type Recent = { user_id: string; email: string | null; display_name: string | null; created_at: string };

export default function SuperAdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, weekly: 0, suspended: 0, admins: 0, activity: 0 });
  const [recent, setRecent] = useState<Recent[]>([]);
  const [byRole, setByRole] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
      const [{ count: total }, { count: weekly }, { count: suspended }, rolesRes, activityRes, recentRes] =
        await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
          supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "suspended"),
          supabase.from("user_roles").select("role"),
          supabase
            .from("activity_logs")
            .select("*", { count: "exact", head: true })
            .gte("created_at", new Date(Date.now() - 86400_000).toISOString()),
          supabase
            .from("profiles")
            .select("user_id,email,display_name,created_at")
            .order("created_at", { ascending: false })
            .limit(8),
        ]);

      const dist: Record<string, number> = {};
      (rolesRes.data ?? []).forEach((r: any) => {
        dist[r.role] = (dist[r.role] ?? 0) + 1;
      });
      setByRole(dist);
      setStats({
        total: total ?? 0,
        weekly: weekly ?? 0,
        suspended: suspended ?? 0,
        admins: (dist["super_admin"] ?? 0) + (dist["admin"] ?? 0),
        activity: activityRes.count ?? 0,
      });
      setRecent((recentRes.data ?? []) as Recent[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <header>
        <p className="text-xs uppercase tracking-widest text-destructive font-semibold">Super Admin</p>
        <h1 className="text-3xl font-bold tracking-tight">User Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time overview of all platform users.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard label="Total users" value={stats.total} icon={Users} loading={loading} />
        <StatsCard label="New (7d)" value={stats.weekly} icon={UserPlus} loading={loading} />
        <StatsCard label="Admins" value={stats.admins} icon={ShieldCheck} loading={loading} />
        <StatsCard label="Suspended" value={stats.suspended} icon={Pause} loading={loading} />
        <StatsCard label="24h activity" value={stats.activity} icon={Activity} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-4">Role distribution</h3>
          <div className="space-y-2">
            {Object.entries(byRole).length === 0 && (
              <p className="text-xs text-muted-foreground">No role data yet.</p>
            )}
            {Object.entries(byRole).map(([role, n]) => {
              const pct = stats.total ? Math.min(100, (n / stats.total) * 100) : 0;
              return (
                <div key={role}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="capitalize">{role.replace("_", " ")}</span>
                    <span className="text-muted-foreground">{n}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <div className="h-full bg-gradient-hero" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlowCard>

        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-4">Recent signups</h3>
          <div className="space-y-2">
            {recent.map((r) => (
              <div key={r.user_id} className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground grid place-items-center text-xs font-semibold shrink-0">
                    {(r.display_name ?? r.email ?? "?").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{r.display_name ?? r.email}</div>
                    <div className="text-xs text-muted-foreground truncate">{r.email}</div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {format(new Date(r.created_at), "MMM d")}
                </Badge>
              </div>
            ))}
            {recent.length === 0 && !loading && (
              <p className="text-xs text-muted-foreground">No users yet.</p>
            )}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}