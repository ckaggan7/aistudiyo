import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CompactStatsCard } from "@/components/admin/CompactStatsCard";
import { AIHealthIndicator } from "@/components/admin/AIHealthIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlowCard } from "@/components/ui/glow-card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ReusableTable, type Column } from "@/components/ui/reusable-table";
import { Activity, Clock, Coins, Cpu, Flag } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { toast } from "sonner";

type Provider = { id: string; slug: string; name: string; enabled: boolean; status: string };
type Model = { id: string; provider_id: string; slug: string; name: string; context_window: number; input_cost_per_1k: number; output_cost_per_1k: number; enabled: boolean };
type Log = { id: string; model_slug: string; provider_slug: string | null; tokens_in: number; tokens_out: number; latency_ms: number; status: string; cost_usd: number; created_at: string };
type FeatureFlag = { id: string; key: string; description: string | null; enabled: boolean; rollout_pct: number };

export default function SuperAdminAI() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);

  const loadAll = async () => {
    const since = subDays(new Date(), 14).toISOString();
    const [p, m, l, f] = await Promise.all([
      supabase.from("ai_providers").select("*").order("name"),
      supabase.from("ai_models").select("*").order("name"),
      supabase.from("ai_request_logs").select("*").gte("created_at", since).order("created_at", { ascending: true }).limit(2000),
      supabase.from("feature_flags").select("*").order("key"),
    ]);
    setProviders((p.data ?? []) as Provider[]);
    setModels((m.data ?? []) as Model[]);
    setLogs((l.data ?? []) as Log[]);
    setFlags((f.data ?? []) as FeatureFlag[]);
  };
  useEffect(() => { loadAll(); }, []);

  const totalReq = logs.length;
  const totalTokens = logs.reduce((s, x) => s + x.tokens_in + x.tokens_out, 0);
  const totalCost = logs.reduce((s, x) => s + Number(x.cost_usd ?? 0), 0);
  const avgLatency = totalReq ? Math.round(logs.reduce((s, x) => s + x.latency_ms, 0) / totalReq) : 0;
  const failures = logs.filter((x) => x.status !== "success").length;
  const healthyProviders = providers.filter((p) => p.enabled && p.status === "healthy").length;

  const series = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => startOfDay(subDays(new Date(), 13 - i)));
    return days.map((d) => {
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const dayLogs = logs.filter((l) => { const t = new Date(l.created_at); return t >= d && t < next; });
      return {
        date: format(d, "MMM d"),
        requests: dayLogs.length,
        tokens: dayLogs.reduce((s, l) => s + l.tokens_in + l.tokens_out, 0),
      };
    });
  }, [logs]);

  const byModel = useMemo(() => {
    const m = new Map<string, number>();
    logs.forEach((l) => m.set(l.model_slug, (m.get(l.model_slug) ?? 0) + 1));
    return Array.from(m, ([model, count]) => ({ model, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [logs]);

  const costSeries = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => startOfDay(subDays(new Date(), 13 - i)));
    return days.map((d) => {
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const dayLogs = logs.filter((l) => { const t = new Date(l.created_at); return t >= d && t < next; });
      return { date: format(d, "MMM d"), cost: dayLogs.reduce((s, l) => s + Number(l.cost_usd ?? 0), 0) };
    });
  }, [logs]);

  const costByModel = useMemo(() => {
    const m = new Map<string, number>();
    logs.forEach((l) => m.set(l.model_slug, (m.get(l.model_slug) ?? 0) + Number(l.cost_usd ?? 0)));
    return Array.from(m, ([model, cost]) => ({ model, cost })).sort((a, b) => b.cost - a.cost);
  }, [logs]);

  const providerHealth = useMemo(() => {
    const groups = new Map<string, Log[]>();
    logs.forEach((l) => {
      const key = l.provider_slug ?? "unknown";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(l);
    });
    return Array.from(groups.entries()).map(([slug, arr]) => {
      const lat = arr.map((l) => l.latency_ms).sort((a, b) => a - b);
      const pct = (p: number) => lat.length ? lat[Math.min(lat.length - 1, Math.floor(lat.length * p))] : 0;
      const fails = arr.filter((l) => l.status !== "success").length;
      const prov = providers.find((p) => p.slug === slug);
      return {
        slug,
        name: prov?.name ?? slug,
        reqs: arr.length,
        p50: pct(0.5),
        p95: pct(0.95),
        failRate: arr.length ? fails / arr.length : 0,
      };
    }).sort((a, b) => b.reqs - a.reqs);
  }, [logs, providers]);

  const toggleProvider = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from("ai_providers").update({ enabled }).eq("id", id);
    if (error) toast.error(error.message); else loadAll();
  };
  const toggleModel = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from("ai_models").update({ enabled }).eq("id", id);
    if (error) toast.error(error.message); else loadAll();
  };
  const updateFlag = async (id: string, patch: Partial<FeatureFlag>) => {
    const { error } = await supabase.from("feature_flags").update(patch).eq("id", id);
    if (error) toast.error(error.message); else loadAll();
  };

  const logColumns: Column<Log>[] = [
    { key: "time", header: "Time", sortValue: (r) => r.created_at,
      accessor: (r) => <span className="text-xs font-mono text-muted-foreground">{format(new Date(r.created_at), "MMM d HH:mm:ss")}</span> },
    { key: "model", header: "Model", accessor: (r) => <span className="text-xs font-mono">{r.model_slug}</span> },
    { key: "tokens", header: "Tokens", sortValue: (r) => r.tokens_in + r.tokens_out,
      accessor: (r) => <span className="text-xs tabular-nums">{(r.tokens_in + r.tokens_out).toLocaleString()}</span> },
    { key: "latency", header: "Latency", sortValue: (r) => r.latency_ms,
      accessor: (r) => <span className="text-xs tabular-nums">{r.latency_ms}ms</span> },
    { key: "cost", header: "Cost", sortValue: (r) => Number(r.cost_usd),
      accessor: (r) => <span className="text-xs tabular-nums">${Number(r.cost_usd ?? 0).toFixed(4)}</span> },
    { key: "status", header: "Status",
      accessor: (r) => <Badge variant={r.status === "success" ? "secondary" : "destructive"} className="text-[10px] uppercase">{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <AdminPageHeader eyebrow="AI Center" title="Mission Control" description="Providers, models, usage, logs and rollout — one place." />

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <CompactStatsCard label="Providers" value={`${healthyProviders}/${providers.length}`} hint="healthy" icon={Cpu} />
        <CompactStatsCard label="Requests 14d" value={totalReq.toLocaleString()} icon={Activity} />
        <CompactStatsCard label="Tokens" value={totalTokens.toLocaleString()} icon={Cpu} />
        <CompactStatsCard label="Avg latency" value={`${avgLatency}ms`} icon={Clock} />
        <CompactStatsCard label="Failures" value={failures.toLocaleString()} hint={`$${totalCost.toFixed(2)} spent`} icon={Coins} />
      </section>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="sticky top-12 z-10 bg-background/85 backdrop-blur-sm">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="flags">Rollout</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {providers.map((p) => {
              const list = models.filter((m) => m.provider_id === p.id);
              return (
                <GlowCard key={p.id} className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 grid place-items-center text-primary">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold">{p.name}</h2>
                        <div className="flex items-center gap-2">
                          <AIHealthIndicator status={(p.status as "healthy" | "degraded" | "down" | "unknown") || "unknown"} />
                          <span className="text-[11px] text-muted-foreground">· {list.length} model{list.length === 1 ? "" : "s"}</span>
                        </div>
                      </div>
                    </div>
                    <Switch checked={p.enabled} onCheckedChange={(v) => toggleProvider(p.id, v)} />
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Manage models in the <span className="font-medium text-foreground/80">Models</span> tab.
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {models.map((m) => {
              const prov = providers.find((p) => p.id === m.provider_id);
              return (
                <GlowCard key={m.id} className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {prov?.name ?? "—"} · {m.context_window.toLocaleString()} ctx · ${m.input_cost_per_1k}/1k in · ${m.output_cost_per_1k}/1k out
                      </div>
                    </div>
                    <Switch checked={m.enabled} onCheckedChange={(v) => toggleModel(m.id, v)} />
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <GlowCard className="p-5 lg:col-span-2">
              <h2 className="text-sm font-semibold mb-4">Requests · 14 days</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <defs>
                      <linearGradient id="ai-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#ai-area)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlowCard>
            <GlowCard className="p-5">
              <h2 className="text-sm font-semibold mb-4">Top models</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byModel} layout="vertical">
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis type="category" dataKey="model" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlowCard>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <GlowCard className="p-5 lg:col-span-2">
              <h2 className="text-sm font-semibold mb-4">Daily cost · 14 days</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costSeries}>
                    <defs>
                      <linearGradient id="ai-cost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.25} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => `$${v.toFixed(4)}`} />
                    <Area type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={1.5} fill="url(#ai-cost)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlowCard>
            <GlowCard className="p-5">
              <h2 className="text-sm font-semibold mb-3">Top spend by model</h2>
              <ul className="space-y-1.5">
                {costByModel.slice(0, 8).map((c) => (
                  <li key={c.model} className="flex items-center justify-between text-xs">
                    <span className="font-mono truncate text-foreground/80">{c.model}</span>
                    <span className="tabular-nums font-medium ml-2">${c.cost.toFixed(2)}</span>
                  </li>
                ))}
                {costByModel.length === 0 && <li className="text-xs text-muted-foreground">No cost data.</li>}
              </ul>
            </GlowCard>
          </div>
        </TabsContent>

        <TabsContent value="health" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {providerHealth.map((h) => (
              <GlowCard key={h.slug} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold truncate">{h.name}</div>
                  <AIHealthIndicator status={h.failRate > 0.1 ? "degraded" : h.failRate > 0 ? "degraded" : "healthy"} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-base font-bold tabular-nums">{h.p50}ms</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">p50</div>
                  </div>
                  <div>
                    <div className="text-base font-bold tabular-nums">{h.p95}ms</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">p95</div>
                  </div>
                  <div>
                    <div className="text-base font-bold tabular-nums">{(h.failRate * 100).toFixed(1)}%</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">fail</div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground text-center">{h.reqs.toLocaleString()} req · 14d</div>
              </GlowCard>
            ))}
            {providerHealth.length === 0 && (
              <div className="text-sm text-muted-foreground col-span-full text-center py-6">No traffic in the last 14 days.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <ReusableTable data={logs.slice().reverse()} columns={logColumns} rowKey={(r) => r.id} pageSize={20} exportable exportFilename="ai-logs.csv" />
        </TabsContent>

        <TabsContent value="flags" className="mt-4">
          <div className="space-y-3">
            {flags.length === 0 && <p className="text-sm text-muted-foreground">No feature flags configured.</p>}
            {flags.map((f) => (
              <GlowCard key={f.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 grid place-items-center text-primary shrink-0">
                      <Flag className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-sm font-medium">{f.key}</div>
                      <div className="text-xs text-muted-foreground">{f.description ?? "—"}</div>
                    </div>
                  </div>
                  <Switch checked={f.enabled} onCheckedChange={(v) => updateFlag(f.id, { enabled: v })} />
                </div>
                <div className="mt-4 pl-12">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Rollout</span><span className="font-mono">{f.rollout_pct}%</span>
                  </div>
                  <Slider
                    value={[f.rollout_pct]}
                    onValueChange={([v]) => setFlags((arr) => arr.map((x) => (x.id === f.id ? { ...x, rollout_pct: v } : x)))}
                    onValueCommit={([v]) => updateFlag(f.id, { rollout_pct: v })}
                    max={100} step={5} disabled={!f.enabled}
                  />
                </div>
              </GlowCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}