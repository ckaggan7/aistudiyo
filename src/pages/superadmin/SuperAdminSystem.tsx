import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GlowCard } from "@/components/ui/glow-card";
import { AIHealthIndicator } from "@/components/admin/AIHealthIndicator";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Server, Database, Activity } from "lucide-react";
import { format } from "date-fns";

type Log = { id: string; action: string; target: string | null; user_id: string | null; ip: string | null; created_at: string };

export default function SuperAdminSystem() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [storage, setStorage] = useState(0);
  const [providersHealthy, setProvidersHealthy] = useState({ ok: 0, total: 0 });

  useEffect(() => {
    (async () => {
      const [{ data: l }, { data: ws }, { data: p }] = await Promise.all([
        supabase.from("activity_logs").select("id,action,target,user_id,ip,created_at").order("created_at", { ascending: false }).limit(50),
        supabase.from("workspaces").select("storage_used_mb"),
        supabase.from("ai_providers").select("status,enabled"),
      ]);
      setLogs((l ?? []) as Log[]);
      setStorage((ws ?? []).reduce((s: number, w: { storage_used_mb?: number | null }) => s + (w.storage_used_mb ?? 0), 0));
      const total = (p ?? []).length;
      const ok = (p ?? []).filter((x: { enabled: boolean; status: string }) => x.enabled && x.status === "healthy").length;
      setProvidersHealthy({ ok, total });
    })();
  }, []);

  const services = [
    { name: "API Gateway", status: "healthy" as const },
    { name: "Auth", status: "healthy" as const },
    { name: "Database", status: "healthy" as const },
    { name: "Storage", status: "healthy" as const },
    { name: "AI Gateway", status: (providersHealthy.ok === providersHealthy.total ? "healthy" : "degraded") as "healthy" | "degraded" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <AdminPageHeader eyebrow="System" title="System & Infrastructure" description="API, integrations, storage and realtime logs — at a glance." />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" /> Services
          </h3>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.name} className="flex items-center justify-between">
                <span className="text-muted-foreground">{s.name}</span>
                <AIHealthIndicator status={s.status} />
              </li>
            ))}
          </ul>
        </GlowCard>

        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" /> Storage
          </h3>
          <div className="text-3xl font-bold tabular-nums">{storage.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">MB</span></div>
          <p className="text-xs text-muted-foreground mt-1">Across all workspaces</p>
        </GlowCard>

        <GlowCard className="p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" /> Integrations
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Supabase</span><Badge variant="secondary" className="text-[10px]">connected</Badge></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Lovable AI</span><Badge variant="secondary" className="text-[10px]">connected</Badge></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Stripe</span><Badge variant="outline" className="text-[10px]">not connected</Badge></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Meta / Instagram</span><Badge variant="outline" className="text-[10px]">optional</Badge></li>
          </ul>
        </GlowCard>
      </section>

      <GlowCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/40 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Realtime activity log</h3>
          <span className="ml-auto text-[11px] text-muted-foreground">last 50</span>
        </div>
        <div className="font-mono text-[11px] bg-black/40 max-h-[420px] overflow-auto">
          {logs.length === 0 ? (
            <div className="px-5 py-6 text-muted-foreground">No activity recorded yet.</div>
          ) : (
            logs.map((l) => (
              <div key={l.id} className="px-5 py-1.5 hover:bg-primary/5 border-b border-border/20 flex items-center gap-3">
                <span className="text-muted-foreground/70 shrink-0">{format(new Date(l.created_at), "HH:mm:ss")}</span>
                <span className="text-primary shrink-0">{l.action}</span>
                <span className="text-muted-foreground truncate">{l.target ?? ""}</span>
                <span className="ml-auto text-muted-foreground/60 shrink-0">{l.user_id?.slice(0, 8) ?? "—"}</span>
              </div>
            ))
          )}
        </div>
      </GlowCard>
    </div>
  );
}