import { GlowCard } from "./glow-card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Skeleton } from "./skeleton";

type Props = {
  label: string;
  value: string | number;
  delta?: number;
  icon?: LucideIcon;
  loading?: boolean;
  spark?: number[];
  className?: string;
};

function Sparkline({ data }: { data: number[] }) {
  if (!data?.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-10 w-full opacity-70">
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function StatsCard({ label, value, delta, icon: Icon, loading, spark, className }: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <GlowCard interactive className={cn("group p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          {loading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {typeof delta === "number" && !loading && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
              positive ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}

      {spark && spark.length > 1 && (
        <div className="mt-3">
          <Sparkline data={spark} />
        </div>
      )}
    </GlowCard>
  );
}