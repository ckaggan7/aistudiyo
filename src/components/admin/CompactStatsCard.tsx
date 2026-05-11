import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  loading?: boolean;
  trend?: number;
  className?: string;
};

export function CompactStatsCard({ label, value, hint, icon: Icon, loading, trend, className }: Props) {
  const positive = (trend ?? 0) >= 0;
  return (
    <div className={cn(
      "rounded-xl border border-border/40 bg-card/95 p-3 hover:border-primary/30 transition-colors",
      className,
    )}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        {Icon && <Icon className="w-3 h-3 text-muted-foreground" />}
      </div>
      {loading ? (
        <Skeleton className="h-6 w-16 mt-1.5" />
      ) : (
        <div className="mt-0.5 text-xl font-bold tabular-nums tracking-tight">{value}</div>
      )}
      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {typeof trend === "number" && (
          <span className={cn("font-medium", positive ? "text-emerald-500" : "text-destructive")}>
            {positive ? "+" : ""}{trend.toFixed(1)}%
          </span>
        )}
        {hint && <span>{hint}</span>}
      </div>
    </div>
  );
}