import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlowCard } from "@/components/ui/glow-card";
import { StatsCard } from "@/components/ui/stats-card";
import { Activity, Clock, Coins, Cpu } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

type Log = {
  id: string;
  model_slug: string;
  tokens_in: number;
  tokens_out: number;
  latency_ms: number;
  status: string;
  cost_usd: number;
  created_at: string;
};

export default function AdminAIUsage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const since = subDays(new Date(), 14).toISOString();
      const { data } = await supabase
        .from("ai_request_logs")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: true })
        .limit(1000);
      setLogs((data ?? []) as Log[]);
      setLoading(false);
    })();
  }, []);

  const series = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => startOfDay(subDays(new Date(), 13 - i)));
    return days.map((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const dayLogs = logs.filter((l) => {
        const t = new Date(l.created_at);
        return t >= d && t < next;
      });
      return {
        date: format(d, "MMM d"),
        requests: dayLogs.length,
        tokens: dayLogs.reduce((s, l) => s + l.tokens_in + l.tokens_out, 0),
        cost: dayLogs.reduce((s, l) => s + Number(l.cost_usd ?? 0), 0),
      };
    });
  }, [logs]);

  const byModel = useMemo(() => {
    const m = new Map<string, number>();
    logs.forEach((l) => m.set(l.model_slug, (m.get(l.model_slug) ?? 0) + 1));
    return Array.from(m, ([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [logs]);

  const totalReq = logs.length;
  const totalTokens = logs.reduce((s, l) => s + l.tokens_in + l.tokens_out, 0);
  const totalCost = logs.reduce((s, l) => s + Number(l.cost_usd ?? 0), 0);
  const avgLatency = totalReq ? Math.round(logs.reduce((s, l) => s + l.latency_ms, 0) / totalReq) : 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <header>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">AI Usage</p>
        <h1 className="text-3xl font-bold tracking-tight">Last 14 days</h1>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Requests" value={totalReq.toLocaleString()} icon={Activity} loading={loading} />
        <StatsCard label="Tokens" value={totalTokens.toLocaleString()} icon={Cpu} loading={loading} />
        <StatsCard label="Cost" value={`$${totalCost.toFixed(2)}`} icon={Coins} loading={loading} />
        <StatsCard label="Avg latency" value={`${avgLatency}ms`} icon={Clock} loading={loading} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlowCard className="p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-4">Requests over time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#area)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>

        <GlowCard className="p-5">
          <h2 className="text-sm font-semibold mb-4">Top models</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byModel} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="model" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>
      </section>
    </div>
  );
}