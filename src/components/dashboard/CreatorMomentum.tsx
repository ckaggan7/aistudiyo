import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const BARS = [38, 52, 41, 65, 48, 72, 58, 81, 67, 92, 78, 88];

export default function CreatorMomentum() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="card-bento h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Creator momentum</p>
          <h3 className="text-2xl font-semibold tracking-tight mt-1">Last 30 days</h3>
        </div>
        <span className="chip chip-success">
          <TrendingUp className="w-3 h-3" /> +18.4%
        </span>
      </div>
      <div className="flex-1 flex items-end gap-1.5 mt-6 h-32">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-primary/70 to-primary/30 hover:from-primary hover:to-primary/60 transition-colors"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
        <span>30d ago</span>
        <span>Today</span>
      </div>
    </motion.section>
  );
}
