import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Sparkles, Repeat, CalendarClock } from "lucide-react";

const HOOKS = [
  "Nobody tells you this about scaling on Instagram…",
  "I tested 50 viral hooks. Only 3 worked.",
  "The 1 prompt that 10x'd my engagement.",
  "Stop writing captions. Do this instead.",
  "Your LinkedIn is leaving money on the table.",
];

const SUGGESTIONS = [
  {
    icon: Repeat,
    title: "Repurpose your last post",
    desc: "Turn it into a Reel script in one click",
    to: "/dashboard/generator?contentType=reel",
  },
  {
    icon: Sparkles,
    title: "Write a follow-up",
    desc: "Continue your top-performing thread",
    to: "/dashboard/generator?contentType=post",
  },
  {
    icon: CalendarClock,
    title: "Plan next week",
    desc: "Auto-fill 7 days of posts",
    to: "/dashboard/calendar",
  },
];

export default function AISuggestions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.25 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
    >
      <div className="bg-card rounded-2xl p-5 border border-border/40">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Viral hooks today</h3>
        </div>
        <ul className="space-y-2">
          {HOOKS.map((h) => (
            <li key={h}>
              <Link
                to={`/dashboard/generator?topic=${encodeURIComponent(h)}&contentType=reel`}
                className="block text-sm text-foreground/85 hover:text-primary leading-snug px-3 py-2 rounded-lg hover:bg-secondary/60 transition-colors"
              >
                "{h}"
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border/40">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Suggestions for you</h3>
        </div>
        <div className="space-y-2">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="group flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/[0.08] flex items-center justify-center transition-colors shrink-0">
                <s.icon className="w-4 h-4 text-foreground/70 group-hover:text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate">{s.title}</p>
                <p className="text-xs text-muted-foreground truncate">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
