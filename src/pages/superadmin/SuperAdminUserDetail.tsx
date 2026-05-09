import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GlowCard } from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function SuperAdminUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    const [{ data: p }, { data: r }, { data: ws }, { data: act }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("workspaces").select("id,name,plan,credits,created_at").eq("owner_id", userId),
      supabase
        .from("activity_logs")
        .select("action,target,created_at,ip")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    setProfile(p);
    setRoles(((r ?? []) as any[]).map((x) => x.role));
    setWorkspaces(ws ?? []);
    setActivity(act ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const toggleStatus = async () => {
    if (!profile) return;
    const next = profile.status === "suspended" ? "active" : "suspended";
    const { error } = await supabase.from("profiles").update({ status: next }).eq("user_id", userId);
    if (error) toast.error(error.message);
    else {
      toast.success(next === "suspended" ? "User suspended" : "User reactivated");
      load();
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  }
  if (!profile) {
    return <div className="p-8 text-sm text-muted-foreground">User not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/superadmin/users" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to users
      </Link>

      <GlowCard className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-hero text-primary-foreground grid place-items-center text-lg font-bold">
              {(profile.display_name ?? profile.email ?? "?").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{profile.display_name ?? profile.email}</h1>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant={profile.status === "suspended" ? "destructive" : "secondary"} className="text-[10px] uppercase">
                  {profile.status}
                </Badge>
                {roles.map((r) => (
                  <Badge key={r} variant={r === "super_admin" ? "default" : "secondary"} className="text-[10px] uppercase">
                    {r.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button variant={profile.status === "suspended" ? "default" : "destructive"} onClick={toggleStatus}>
            {profile.status === "suspended" ? (
              <>
                <Play className="w-4 h-4 mr-2" /> Reactivate
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" /> Suspend
              </>
            )}
          </Button>
        </div>
      </GlowCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-4">Workspaces ({workspaces.length})</h3>
          <div className="space-y-2">
            {workspaces.map((w) => (
              <div key={w.id} className="flex items-center justify-between text-sm border-b border-border/40 pb-2 last:border-0">
                <div>
                  <div className="font-medium">{w.name}</div>
                  <div className="text-xs text-muted-foreground">{w.plan} · {w.credits} credits</div>
                </div>
                <span className="text-xs text-muted-foreground">{format(new Date(w.created_at), "MMM d, yyyy")}</span>
              </div>
            ))}
            {workspaces.length === 0 && <p className="text-xs text-muted-foreground">No workspaces.</p>}
          </div>
        </GlowCard>

        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-4">Recent activity</h3>
          <div className="space-y-2">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-xs border-b border-border/40 pb-2 last:border-0">
                <div>
                  <div className="font-medium">{a.action}</div>
                  {a.target && <div className="text-muted-foreground">{a.target}</div>}
                </div>
                <span className="text-muted-foreground">{format(new Date(a.created_at), "MMM d, HH:mm")}</span>
              </div>
            ))}
            {activity.length === 0 && <p className="text-xs text-muted-foreground">No activity recorded.</p>}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}