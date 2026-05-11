import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, CalendarClock, Lightbulb, ArrowRight } from "lucide-react";

const INSIGHTS = [
  { icon: TrendingUp,    title: "Reels are trending today", desc: "+38% engagement vs. carousels.",       to: "/dashboard/trends" },
  { icon: Sparkles,      title: "Audience loves storytelling", desc: "Hook with a personal moment.",      to: "/dashboard/generator" },
  { icon: CalendarClock, title: "Peak posting in 2h",       desc: "Tue 7:42pm is your sweet spot.",        to: "/dashboard/calendar" },
  { icon: Lightbulb,     title: "Question CTAs +21% saves", desc: "End captions with a question today.",   to: "/dashboard/analytics" },
];

export default function AISuggestions() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % INSIGHTS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-bento h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-base">AI insights</h3>
        </div>
        <span className="chip chip-success">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> live
        </span>
      </div>

      {/* Featured rotating insight */}
      <div className="relative h-[130px] mb-3 rounded-2xl bg-gradient-to-br from-primary/8 to-violet-500/8 border border-primary/15 p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {INSIGHTS.map((s, i) =>
            i === idx ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-4 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.desc}</p>
                </div>
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>

      {/* Mini list of other insights */}
      <div className="flex flex-col gap-1.5 flex-1">
        {INSIGHTS.filter((_, i) => i !== idx).slice(0, 2).map((s) => (
          <Link
            key={s.title}
            to={s.to}
            className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 hover:bg-muted/50 transition-colors"
          >
            <div className="shrink-0 w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
              <s.icon className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs font-medium truncate flex-1">{s.title}</p>
            <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
