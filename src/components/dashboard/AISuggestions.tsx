import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Repeat, CalendarClock, ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  { icon: Repeat,        title: "Repurpose your last post",  desc: "Turn it into a Reel script in one click",     to: "/dashboard/generator?contentType=reel" },
  { icon: Sparkles,      title: "Write a follow-up",         desc: "Continue your top-performing thread",         to: "/dashboard/generator?contentType=post" },
  { icon: CalendarClock, title: "Plan next week",            desc: "Auto-fill 7 days of posts",                   to: "/dashboard/calendar" },
];

export default function AISuggestions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="surface-floating rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Suggestions for you</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Updated live</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-2">
        {SUGGESTIONS.map((s) => (
          <Link
            key={s.title}
            to={s.to}
            className="group rounded-xl border border-border/40 bg-background/40 p-3 hover-lift"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/[0.10] flex items-center justify-center mb-2">
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm font-medium leading-tight">{s.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.desc}</p>
            <span className="mt-2 inline-flex items-center text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Start <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
