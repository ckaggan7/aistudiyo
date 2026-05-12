import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiDelta } from "@/lib/growth/mockData";

export default function KpiTile({ kpi, index = 0 }: { kpi: KpiDelta; index?: number }) {
  const positive = kpi.delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-border rounded-2xl p-4 shadow-card hover:shadow-elegant transition-shadow"
    >
      <div className="text-xs text-muted-foreground font-medium">{kpi.label}</div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tracking-tight">{kpi.value}</div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-full",
            positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
          )}
        >
          {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(kpi.delta)}%
        </span>
      </div>
      {kpi.hint && <div className="text-[11px] text-muted-foreground mt-1">{kpi.hint}</div>}
    </motion.div>
  );
}