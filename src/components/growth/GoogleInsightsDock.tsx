import { useEffect, useState } from "react";
import { Sparkles, AlertTriangle, TrendingUp, Info, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { callGrowthAi, type InsightItem } from "@/lib/growth/growthApi";
import { KPIS } from "@/lib/growth/mockData";
import { cn } from "@/lib/utils";

const ICON: Record<InsightItem["severity"], React.ElementType> = {
  positive: TrendingUp,
  neutral: Info,
  warning: AlertTriangle,
  critical: AlertTriangle,
};

const TONE: Record<InsightItem["severity"], string> = {
  positive: "from-emerald-500/10 to-transparent border-emerald-500/30 text-emerald-700",
  neutral: "from-blue-500/10 to-transparent border-blue-500/30 text-blue-700",
  warning: "from-amber-500/10 to-transparent border-amber-500/30 text-amber-700",
  critical: "from-rose-500/10 to-transparent border-rose-500/30 text-rose-700",
};

export default function GoogleInsightsDock() {
  const [items, setItems] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await callGrowthAi("insights", "Generate AI insights summarizing this week's Google Business performance.", { kpis: KPIS });
      setItems(res.insights);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="bg-white border border-border rounded-2xl p-4 shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-hero shadow-glow flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold">Google AI Insights</div>
            <div className="text-[11px] text-muted-foreground">Auto-generated · live</div>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin">
        {loading && items.length === 0 && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
        ))}
        {items.map((it, i) => {
          const Icon = ICON[it.severity];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn("relative bg-gradient-to-br rounded-xl border p-3", TONE[it.severity])}
            >
              <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">{it.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{it.body}</div>
                  <div className="text-[11px] font-medium mt-1.5">→ {it.action}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}