import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, BarChart, Bar } from "recharts";
import { Sparkles, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import GrowthPageShell from "@/components/growth/GrowthPageShell";
import { GA_TRAFFIC, GA_TOP_PAGES, GA_SOURCES } from "@/lib/growth/mockData";
import { callGrowthAi, type AnalyticsSummaryResult } from "@/lib/growth/growthApi";
import { toast } from "@/hooks/use-toast";

export default function GoogleAnalyticsAI() {
  const [summary, setSummary] = useState<AnalyticsSummaryResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function summarize() {
    setLoading(true);
    try {
      const r = await callGrowthAi("analytics_summary", "Summarize the last 7 days of GA4 traffic and recommend 3 actions.", { traffic: GA_TRAFFIC, top_pages: GA_TOP_PAGES, sources: GA_SOURCES });
      setSummary(r);
    } catch (e) {
      toast({ title: "Analysis failed", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }

  return (
    <GrowthPageShell
      title="Google Analytics AI"
      subtitle="GA4 data, explained in plain English. Drop-offs, wins, next steps."
      actions={
        <button onClick={summarize} disabled={loading} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-hero text-primary-foreground text-sm font-medium shadow-glow disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          AI summary
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
        <div className="lg:col-span-8 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="text-sm font-semibold mb-2">Traffic · Users vs Sessions</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GA_TRAFFIC}>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Line type="monotone" dataKey="users" stroke="hsl(22 100% 55%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sessions" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} strokeOpacity={0.4} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="text-sm font-semibold mb-2">Top sources</div>
          <div className="space-y-2">
            {GA_SOURCES.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs">
                  <span>{s.name}</span><span className="font-medium">{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-gradient-hero rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="text-sm font-semibold mb-2">Top pages</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GA_TOP_PAGES} layout="vertical">
                <XAxis type="number" hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="views" fill="hsl(22 100% 55%)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-2 text-xs">
            {GA_TOP_PAGES.map((p) => (
              <div key={p.path} className="flex items-center justify-between text-muted-foreground">
                <span className="font-mono">{p.path}</span>
                <span>{p.views.toLocaleString()} · bounce {p.bounce}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <div className="text-sm font-semibold">AI summary</div>
          </div>
          {!summary && !loading && <div className="text-xs text-muted-foreground">Click <span className="font-medium text-foreground">AI summary</span> to interpret your analytics.</div>}
          {loading && <div className="text-xs text-muted-foreground">Analyzing…</div>}
          {summary && (
            <div className="space-y-3 text-xs">
              <p className="text-sm">{summary.summary}</p>
              <div>
                <div className="font-semibold flex items-center gap-1 text-emerald-700"><TrendingUp className="w-3 h-3" />Wins</div>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">{summary.wins.map((w, i) => <li key={i}>· {w}</li>)}</ul>
              </div>
              <div>
                <div className="font-semibold flex items-center gap-1 text-rose-700"><TrendingDown className="w-3 h-3" />Drop-offs</div>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">{summary.drop_offs.map((w, i) => <li key={i}>· {w}</li>)}</ul>
              </div>
              <div>
                <div className="font-semibold text-primary">Recommended actions</div>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">{summary.actions.map((w, i) => <li key={i}>→ {w}</li>)}</ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </GrowthPageShell>
  );
}