import { cn } from "@/lib/utils";

type Status = "healthy" | "degraded" | "down" | "unknown";

const map: Record<Status, { color: string; label: string }> = {
  healthy: { color: "bg-emerald-500", label: "Healthy" },
  degraded: { color: "bg-amber-500", label: "Degraded" },
  down: { color: "bg-destructive", label: "Down" },
  unknown: { color: "bg-muted-foreground", label: "Unknown" },
};

export function AIHealthIndicator({ status, label }: { status: Status; label?: string }) {
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={cn("relative flex h-2 w-2")}>
        {status === "healthy" && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", s.color)} />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", s.color)} />
      </span>
      <span className="text-muted-foreground">{label ?? s.label}</span>
    </span>
  );
}