import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlowCard } from "@/components/ui/glow-card";
import { FileText, Users, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import SuperAdminCredits from "./SuperAdminCredits";

type WS = { id: string; name: string; plan: string; credits: number };

function HeroMetric({ label, value, hint, spark }: { label: string; value: string; hint?: string; spark?: number[] }) {
  const data = (spark ?? []).map((v, i) => ({ i, v }));
  return (
    <GlowCard className="p-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="mt-1 text-3xl md:text-4xl font-bold tabular-nums tracking-tight">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      {data.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-10 opacity-60 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`b-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={1.5} fill={`url(#b-${label})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlowCard>
  );
}

export default function SuperAdminBilling() {
  const [ws, setWs] = useState<WS[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("workspaces").select("id,name,plan,credits");
      setWs((data ?? []) as WS[]);
    })();
  }, []);

  const planCounts = useMemo(() => {
    const m: Record<string, number> = {};
    ws.forEach((w) => { m[w.plan] = (m[w.plan] ?? 0) + 1; });
    return m;
  }, [ws]);
  const totalCredits = ws.reduce((s, w) => s + (w.credits ?? 0), 0);
  const paidWorkspaces = (planCounts["pro"] ?? 0) + (planCounts["business"] ?? 0) + (planCounts["enterprise"] ?? 0);

  // Sample sparklines (deterministic placeholders)
  const spark = (seed: number, n = 30) =>
    Array.from({ length: n }, (_, i) => Math.abs(Math.sin(seed + i / 3)) * 100 + i * 2);

  const sampleSeries = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => startOfDay(subDays(new Date(), 29 - i)));
    return days.map((d, i) => ({
      date: format(d, "MMM d"),
      revenue: Math.round(800 + Math.sin(i / 2) * 120 + i * 18),
    }));
  }, []);

  const topWorkspaces = [...ws].sort((a, b) => (b.credits ?? 0) - (a.credits ?? 0)).slice(0, 10);

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      <AdminPageHeader eyebrow="Billing" title="Revenue & Plans" description="Subscriptions, invoices and credit consumption." />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <HeroMetric label="MRR" value="$0" hint="connect billing provider" spark={spark(1)} />
        <HeroMetric label="ARR" value="$0" hint="projected" spark={spark(2)} />
        <HeroMetric label="Paid workspaces" value={String(paidWorkspaces)} hint={`${ws.length} total`} spark={spark(3)} />
        <HeroMetric label="Credits in circulation" value={totalCredits.toLocaleString()} hint="across all workspaces" spark={spark(4)} />
      </section>

      <Tabs defaultValue="revenue">
        <TabsList className="sticky top-12 z-10 bg-background/85 backdrop-blur-sm">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <GlowCard className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Revenue · 30 days</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Sample data — connect Stripe or Paddle to see live MRR.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">Preview</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleSeries}>
                  <defs>
                    <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={36} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => `$${v}`} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={1.5} fill="url(#rev-area)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-4">
          <GlowCard className="p-5">
            <h3 className="text-sm font-semibold mb-4">Plan distribution</h3>
            {Object.keys(planCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">No workspaces yet.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(planCounts).map(([plan, n]) => {
                  const total = Object.values(planCounts).reduce((s, v) => s + v, 0);
                  const pct = total ? (n / total) * 100 : 0;
                  return (
                    <div key={plan}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="uppercase tracking-wider font-medium">{plan}</span>
                        <span className="text-muted-foreground tabular-nums">{n} · {pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full bg-gradient-hero" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlowCard>
        </TabsContent>

        <TabsContent value="workspaces" className="mt-4">
          <GlowCard className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Top workspaces by credits</h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Top 10</span>
            </div>
            {topWorkspaces.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No workspaces yet.</div>
            ) : (
              <ul className="divide-y divide-border/40">
                {topWorkspaces.map((w) => (
                  <li key={w.id} className="px-5 py-2.5 flex items-center justify-between text-sm">
                    <div className="min-w-0 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{w.name}</span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground">{w.plan}</span>
                    </div>
                    <span className="tabular-nums font-medium">{(w.credits ?? 0).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </GlowCard>
        </TabsContent>

        <TabsContent value="credits" className="mt-4">
          <SuperAdminCredits />
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <GlowCard className="p-8 grid place-items-center text-center">
            <FileText className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold">No invoices yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Invoices will appear once a billing provider is connected.</p>
          </GlowCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
