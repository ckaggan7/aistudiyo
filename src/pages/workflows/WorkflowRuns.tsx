import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Run = {
  id: string;
  workflow_id: string;
  status: string;
  trigger_source: string;
  duration_ms: number | null;
  error: string | null;
  created_at: string;
  workflows?: { name: string } | null;
};

type Step = {
  id: string;
  node_label: string | null;
  node_type: string;
  status: string;
  duration_ms: number | null;
  step_index: number;
  output: any;
  error: string | null;
};

const statusStyles: Record<string, string> = {
  success: "text-emerald-500",
  failed: "text-destructive",
  running: "text-amber-500",
  queued: "text-muted-foreground",
};

export default function WorkflowRuns() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("workflow_runs")
        .select("id,workflow_id,status,trigger_source,duration_ms,error,created_at,workflows(name)")
        .order("created_at", { ascending: false })
        .limit(50);
      setRuns((data ?? []) as any);
      setLoading(false);
    })();

    const channel = supabase
      .channel("runs")
      .on("postgres_changes", { event: "*", schema: "public", table: "workflow_runs" }, () => {
        supabase
          .from("workflow_runs")
          .select("id,workflow_id,status,trigger_source,duration_ms,error,created_at,workflows(name)")
          .order("created_at", { ascending: false })
          .limit(50)
          .then(({ data }) => setRuns((data ?? []) as any));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openRun = async (id: string) => {
    setOpenId(openId === id ? null : id);
    if (openId === id) return;
    setLoadingSteps(true);
    const { data } = await supabase
      .from("workflow_run_steps")
      .select("*")
      .eq("run_id", id)
      .order("step_index");
    setSteps((data ?? []) as Step[]);
    setLoadingSteps(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Execution</p>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Run history
          </h1>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard/workflows">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
        </Button>
      </header>

      {loading ? (
        <div className="h-40 grid place-items-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : runs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
          No runs yet. Execute a workflow to see history here.
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl divide-y divide-border/60">
          {runs.map((r) => (
            <div key={r.id}>
              <button
                onClick={() => openRun(r.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-accent/30 transition-colors text-left"
              >
                {r.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : r.status === "failed" ? (
                  <XCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{r.workflows?.name ?? "Workflow"}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()} · {r.trigger_source}
                  </p>
                </div>
                <span className={cn("text-[11px] font-mono uppercase", statusStyles[r.status] ?? "text-muted-foreground")}>
                  {r.status}
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 w-16 justify-end">
                  <Clock className="w-3 h-3" />
                  {r.duration_ms ? `${r.duration_ms}ms` : "—"}
                </span>
              </button>
              {openId === r.id && (
                <div className="px-4 pb-4 bg-background/30">
                  {loadingSteps ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground my-3" />
                  ) : (
                    <ol className="space-y-2 my-3">
                      {steps.map((s) => (
                        <li
                          key={s.id}
                          className="rounded-xl border border-border/40 p-3 bg-card/40"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-muted-foreground">#{s.step_index + 1}</span>
                            <p className="text-xs font-semibold">{s.node_label ?? s.node_type}</p>
                            <span className={cn("text-[10px] font-mono uppercase ml-auto", statusStyles[s.status] ?? "text-muted-foreground")}>
                              {s.status} · {s.duration_ms ?? 0}ms
                            </span>
                          </div>
                          {s.error && <p className="text-[11px] text-destructive">{s.error}</p>}
                          {s.output && (
                            <pre className="text-[10px] font-mono mt-1 p-2 bg-background/60 rounded-lg max-h-32 overflow-auto whitespace-pre-wrap break-words">
                              {JSON.stringify(s.output, null, 2)}
                            </pre>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                  {r.error && (
                    <p className="text-[11px] text-destructive bg-destructive/10 rounded-lg p-2">{r.error}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}