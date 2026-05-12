import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, TrendingUp, Clock, Target, Lightbulb } from "lucide-react";

const INSIGHTS = [
  {
    icon: TrendingUp,
    tint: "text-emerald-600 bg-emerald-50",
    title: "Reels outperform carousels 2.3×",
    detail: "Shift 3 carousels → reels this week.",
  },
  {
    icon: Clock,
    tint: "text-blue-600 bg-blue-50",
    title: "Best window: Tue 7–9pm",
    detail: "Schedule your next hook drop here.",
  },
  {
    icon: Target,
    tint: "text-purple-600 bg-purple-50",
    title: "CTR up on POV hooks",
    detail: "Try 3 more first-person openings.",
  },
  {
    icon: Lightbulb,
    tint: "text-amber-600 bg-amber-50",
    title: "New idea: 'Studio teardown'",
    detail: "BTS of your AI stack — high save rate.",
  },
];

export default function AIInsights() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="card-bento h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-base">AI Insights</h3>
        </div>
        <Link
          to="/dashboard/insights"
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {INSIGHTS.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 * i }}
              className="group flex items-start gap-2.5 p-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-white hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${ins.tint}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium leading-tight">{ins.title}</p>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{ins.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
