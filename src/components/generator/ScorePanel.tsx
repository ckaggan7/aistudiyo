import { motion } from "framer-motion";
import { Flame } from "lucide-react";

type Scores = { hook: number; readability: number; platform_fit: number; virality: number };

function barColor(v: number) {
  if (v >= 70) return "bg-emerald-500";
  if (v >= 40) return "bg-amber-500";
  return "bg-rose-500";
}
function ringColor(v: number) {
  if (v >= 70) return "text-emerald-500";
  if (v >= 40) return "text-amber-500";
  return "text-rose-500";
}

export default function ScorePanel({ scores }: { scores: Scores }) {
  const rows: { label: string; value: number }[] = [
    { label: "Hook", value: scores.hook },
    { label: "Readability", value: scores.readability },
    { label: "Platform fit", value: scores.platform_fit },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden bg-card rounded-2xl border border-border/40 p-5"
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-hero opacity-10 blur-3xl pointer-events-none" />
      <div className="relative flex items-center gap-5">
        <div className="shrink-0 flex flex-col items-center">
          <div className={`text-3xl md:text-4xl font-bold tracking-tight ${ringColor(scores.virality)}`}>
            {scores.virality}
          </div>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
            <Flame className="w-3 h-3" /> Viral score
          </div>
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-20 shrink-0">{r.label}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.value}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full ${barColor(r.value)}`}
                />
              </div>
              <span className="text-[11px] font-medium tabular-nums w-7 text-right">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
