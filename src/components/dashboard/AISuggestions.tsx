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
      className="card-bento h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-base">Suggestions</h3>
        </div>
        <span className="chip">Live</span>
      </div>

      <div className="flex flex-col gap-2.5 flex-1">
        {SUGGESTIONS.map((s) => (
          <Link
            key={s.title}
            to={s.to}
            className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 hover:bg-white hover:border-primary/30 hover:shadow-md p-3.5 transition-all"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
