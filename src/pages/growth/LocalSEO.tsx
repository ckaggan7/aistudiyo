import { useState } from "react";
import { Sparkles, Loader2, ArrowUp, ArrowDown, Minus, Search } from "lucide-react";
import { motion } from "framer-motion";
import GrowthPageShell from "@/components/growth/GrowthPageShell";
import { SEO_KEYWORDS } from "@/lib/growth/mockData";
import { callGrowthAi, type SeoRecommendationsResult } from "@/lib/growth/growthApi";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const OPP_TONE = {
  high: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-muted text-muted-foreground",
} as const;

export default function LocalSEO() {
  const [data, setData] = useState<SeoRecommendationsResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const r = await callGrowthAi("seo_recommendations", "Audit local SEO and surface 6-8 keyword opportunities, 4-6 actions, 3 competitor gaps.");
      setData(r);
    } catch (e) {
      toast({ title: "Audit failed", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }

  const score = data?.visibility_score ?? 72;

  return (
    <GrowthPageShell
      title="Local SEO Engine"
      subtitle="Visibility score, ranking opportunities, AI-driven recommendations."
      actions={
        <button onClick={run} disabled={loading} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-hero text-primary-foreground text-sm font-medium shadow-glow disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Improve my ranking
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
        {/* Score gauge */}
        <div className="lg:col-span-4 bg-white border border-border rounded-2xl p-4 shadow-card flex flex-col items-center justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
              <motion.circle
                cx="50" cy="50" r="42" stroke="hsl(22 100% 55%)" strokeWidth="10" fill="none" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - score / 100) }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-semibold">{score}</div>
              <div className="text-[11px] text-muted-foreground">Visibility</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-center">Out of 100 · benchmarked vs local competitors.</div>
        </div>

        {/* Keyword rankings (static mock) */}
        <div className="lg:col-span-8 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="text-sm font-semibold mb-2 flex items-center gap-2"><Search className="w-4 h-4" />Current rankings</div>
          <div className="divide-y divide-border">
            {SEO_KEYWORDS.map((k) => (
              <div key={k.keyword} className="py-2 flex items-center gap-3 text-sm">
                <div className="flex-1 truncate">{k.keyword}</div>
                <div className="text-xs text-muted-foreground w-16 text-right">{k.volume}/mo</div>
                <div className="w-16 text-center">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted">#{k.rank}</span>
                </div>
                <div className="w-6">
                  {k.trend === "up" && <ArrowUp className="w-4 h-4 text-emerald-600" />}
                  {k.trend === "down" && <ArrowDown className="w-4 h-4 text-rose-600" />}
                  {k.trend === "flat" && <Minus className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI recommendations */}
        <div className="lg:col-span-12 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <div className="text-sm font-semibold">AI recommendations</div>
          </div>
          {!data && !loading && <div className="text-xs text-muted-foreground">Click <span className="font-medium text-foreground">Improve my ranking</span> to get keyword opportunities and action items.</div>}
          {loading && <div className="text-xs text-muted-foreground">Auditing local SEO…</div>}
          {data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-2">
              <div>
                <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground mb-1.5">Keyword opportunities</div>
                <div className="space-y-1.5">
                  {data.keywords.map((k, i) => (
                    <div key={i} className="p-2 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{k.keyword}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize", OPP_TONE[k.opportunity])}>{k.opportunity}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{k.rationale}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground mb-1.5">Actions</div>
                <ul className="space-y-1.5 text-xs">
                  {data.actions.map((a, i) => <li key={i} className="p-2 rounded-xl bg-orange-50/60 border border-orange-200/60">→ {a}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground mb-1.5">Competitor gaps</div>
                <ul className="space-y-1.5 text-xs">
                  {data.competitor_gaps.map((a, i) => <li key={i} className="p-2 rounded-xl bg-muted/40 border border-border">· {a}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </GrowthPageShell>
  );
}