import { useEffect, useMemo, useState } from "react";
import { Sparkles, X, TrendingUp, TrendingDown, AlertCircle, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Insight = {
  id: string;
  icon: typeof TrendingUp;
  tone: "positive" | "negative" | "info";
  text: string;
};

const SESSION_KEY = "sa-insights-dismissed";

export default function AIInsightsDock() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setDismissed(true);
  }, []);

  const compute = useMemo(() => async () => {
    const now = Date.now();
    const dayAgo = new Date(now - 86400_000).toISOString();
    const prevDay = new Date(now - 2 * 86400_000).toISOString();
    const weekAgo = new Date(now - 7 * 86400_000).toISOString();

    const [todayCost, yesterdayCost, modelCounts, inactiveWs, providers] = await Promise.all([
      supabase.from("ai_request_logs").select("cost_usd").gte("created_at", dayAgo),
      supabase.from("ai_request_logs").select("cost_usd").gte("created_at", prevDay).lt("created_at", dayAgo),
      supabase.from("ai_request_logs").select("model_slug").gte("created_at", weekAgo),
      supabase.from("workspaces").select("id,updated_at").lt("updated_at", new Date(now - 30 * 86400_000).toISOString()),
      supabase.from("ai_providers").select("name,status,enabled"),
    ]);

    const sum = (rows: { cost_usd?: string | number | null }[] | null) =>
      (rows ?? []).reduce((s, r) => s + Number(r.cost_usd ?? 0), 0);
    const tCost = sum(todayCost.data);
    const yCost = sum(yesterdayCost.data);
    const delta = yCost > 0 ? ((tCost - yCost) / yCost) * 100 : 0;

    const modelMap = new Map<string, number>();
    (modelCounts.data ?? []).forEach((r: { model_slug: string }) =>
      modelMap.set(r.model_slug, (modelMap.get(r.model_slug) ?? 0) + 1),
    );
    const topModel = Array.from(modelMap.entries()).sort((a, b) => b[1] - a[1])[0];

    const degraded = (providers.data ?? []).filter(
      (p: { enabled: boolean; status: string }) => p.enabled && p.status !== "healthy",
    );

    const out: Insight[] = [];
    if (tCost > 0 || yCost > 0) {
      out.push({
        id: "cost",
        icon: delta >= 0 ? TrendingUp : TrendingDown,
        tone: delta >= 10 ? "negative" : delta <= -10 ? "positive" : "info",
        text: `AI cost ${delta >= 0 ? "up" : "down"} ${Math.abs(delta).toFixed(1)}% today ($${tCost.toFixed(2)})`,
      });
    }
    if (topModel) {
      out.push({ id: "top", icon: Cpu, tone: "info", text: `${topModel[0]} trending — ${topModel[1]} req/7d` });
    }
    if ((inactiveWs.data ?? []).length > 0) {
      out.push({
        id: "ws",
        icon: AlertCircle,
        tone: "info",
        text: `${inactiveWs.data!.length} inactive workspace${inactiveWs.data!.length === 1 ? "" : "s"} (30d+)`,
      });
    }
    if (degraded.length > 0) {
      out.push({
        id: "prov",
        icon: AlertCircle,
        tone: "negative",
        text: `${degraded.length} provider${degraded.length === 1 ? "" : "s"} degraded`,
      });
    }
    if (out.length === 0) {
      out.push({ id: "ok", icon: TrendingUp, tone: "positive", text: "All systems nominal." });
    }
    setInsights(out);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    compute();
    const t = setInterval(compute, 60_000);
    return () => clearInterval(t);
  }, [compute, dismissed]);

  if (dismissed) return null;

  const toneClass = {
    positive: "text-emerald-500",
    negative: "text-destructive",
    info: "text-primary",
  } as const;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-border/40 bg-card/95 backdrop-blur shadow-sm text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI Insights
          {insights.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-primary/15 text-primary text-[10px] font-mono">
              {insights.length}
            </span>
          )}
        </button>
      ) : (
        <div className="w-80 rounded-xl border border-border/40 bg-card/95 backdrop-blur-sm shadow-md p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Smart Insights
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen(false)} className="h-6 w-6 grid place-items-center rounded hover:bg-accent/50 text-muted-foreground">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <ul className="space-y-1.5">
            {insights.map((i) => {
              const Icon = i.icon;
              return (
                <li key={i.id} className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-accent/40">
                  <Icon className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", toneClass[i.tone])} />
                  <span className="text-xs text-foreground/85 leading-snug">{i.text}</span>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => { sessionStorage.setItem(SESSION_KEY, "1"); setDismissed(true); }}
            className="mt-2 w-full text-[10px] text-muted-foreground hover:text-foreground py-1"
          >
            Dismiss until next session
          </button>
        </div>
      )}
    </div>
  );
}
