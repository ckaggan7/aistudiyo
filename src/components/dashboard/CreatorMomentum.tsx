import { motion } from "framer-motion";
import { Flame, Send, TrendingUp } from "lucide-react";

const STATS = [
  { icon: Flame,      label: "Posting streak", value: "7 days",  delta: "+2d this week",      accent: "text-orange-400" },
  { icon: Send,       label: "Posts shipped",  value: "23",      delta: "8 scheduled",        accent: "text-primary" },
  { icon: TrendingUp, label: "Reach delta",    value: "+18.4%",  delta: "vs. last 30 days",   accent: "text-emerald-400" },
];

export default function CreatorMomentum() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="surface-floating rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Creator momentum</h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Last 30 days</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/40 bg-background/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`w-4 h-4 ${s.accent}`} />
              <span className="text-[10px] text-muted-foreground">{s.delta}</span>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-display">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
