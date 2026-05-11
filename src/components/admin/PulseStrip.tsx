import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";

type Point = { t: number; v: number };

export default function PulseStrip() {
  const [points, setPoints] = useState<Point[]>([]);
  const [reqMin, setReqMin] = useState(0);

  const load = async () => {
    const since = new Date(Date.now() - 60 * 60_000).toISOString();
    const { data } = await supabase
      .from("ai_request_logs")
      .select("created_at")
      .gte("created_at", since);

    const buckets = new Map<number, number>();
    const now = Date.now();
    for (let i = 59; i >= 0; i--) {
      buckets.set(Math.floor((now - i * 60_000) / 60_000), 0);
    }
    (data ?? []).forEach((r: any) => {
      const m = Math.floor(new Date(r.created_at).getTime() / 60_000);
      if (buckets.has(m)) buckets.set(m, (buckets.get(m) ?? 0) + 1);
    });
    const arr = Array.from(buckets, ([t, v]) => ({ t, v }));
    setPoints(arr);
    setReqMin(arr[arr.length - 1]?.v ?? 0);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, []);

  const total = points.reduce((s, p) => s + p.v, 0);

  return (
    <div className="rounded-xl border border-border/40 bg-card/95 px-4 py-2.5 flex items-center gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <Activity className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Live pulse</span>
      </div>
      <div className="flex-1 h-9 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
            <defs>
              <linearGradient id="pulse-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={1.5} fill="url(#pulse-grad)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-bold tabular-nums leading-tight">{reqMin}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">req/min</div>
      </div>
      <div className="text-right shrink-0 hidden md:block">
        <div className="text-sm font-bold tabular-nums leading-tight">{total.toLocaleString()}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">last hour</div>
      </div>
    </div>
  );
}
