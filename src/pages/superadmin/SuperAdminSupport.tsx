import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CompactStatsCard } from "@/components/admin/CompactStatsCard";
import { GlowCard } from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, AlertTriangle, Inbox, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

type Fail = { id: string; model_slug: string; status: string; latency_ms: number; created_at: string };

export default function SuperAdminSupport() {
  const [failures, setFailures] = useState<Fail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("ai_request_logs")
        .select("id,model_slug,status,latency_ms,created_at")
        .neq("status", "success")
        .order("created_at", { ascending: false })
        .limit(50);
      setFailures((data ?? []) as Fail[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <AdminPageHeader eyebrow="Support" title="Support & Moderation" description="Tickets, reports and AI failures in one queue." />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CompactStatsCard label="Open tickets" value={0} icon={Inbox} />
        <CompactStatsCard label="Reports" value={0} icon={LifeBuoy} />
        <CompactStatsCard label="AI failures" value={failures.length} icon={AlertTriangle} />
        <CompactStatsCard label="Resolved 7d" value={0} icon={CheckCircle2} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlowCard className="p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Recent AI failures
          </h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : failures.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No AI failures recorded 🎉</p>
          ) : (
            <ul className="divide-y divide-border/40">
              {failures.map((f) => (
                <li key={f.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-mono truncate">{f.model_slug}</div>
                    <div className="text-[11px] text-muted-foreground">{format(new Date(f.created_at), "MMM d, HH:mm:ss")} · {f.latency_ms}ms</div>
                  </div>
                  <Badge variant="destructive" className="text-[10px] uppercase">{f.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </GlowCard>

        <GlowCard className="p-6">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Inbox className="w-4 h-4 text-primary" /> Ticket queue
          </h2>
          <p className="text-sm text-muted-foreground py-6 text-center">
            No support tickets. Ticketing backend coming soon.
          </p>
        </GlowCard>
      </div>
    </div>
  );
}