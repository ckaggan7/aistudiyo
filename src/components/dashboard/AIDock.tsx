import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, CalendarClock, Lightbulb, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Item = {
  icon: any;
  title: string;
  desc: string;
  to: string;
  accent: string;
};

const ITEMS: Item[] = [
  { icon: Sparkles,      title: "AI suggestion",    desc: "Turn yesterday's reel into a LinkedIn post.", to: "/dashboard/generator", accent: "text-primary" },
  { icon: TrendingUp,    title: "Trend alert",      desc: "'POV creator desk' is up 38% this week.",     to: "/dashboard/trends",    accent: "text-emerald-400" },
  { icon: CalendarClock, title: "Posting reminder", desc: "Tue 7:42pm is your audience peak.",          to: "/dashboard/calendar",  accent: "text-amber-400" },
  { icon: Lightbulb,     title: "Creator insight",  desc: "Captions ending in a question +21% saves.",   to: "/dashboard/analytics", accent: "text-violet-400" },
];

export default function AIDock({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 320 : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      className={cn(
        "hidden xl:flex sticky top-0 h-screen shrink-0 overflow-hidden",
        "border-l border-border/40",
      )}
    >
      <div className="w-[320px] h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">AI Dock</span>
            <span className="text-[10px] text-emerald-400 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" /> live
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">For you, now</p>
        <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin -mr-2 pr-2">
          {ITEMS.map((it) => (
            <Link
              key={it.title}
              to={it.to}
              className="group block rounded-xl p-3 surface-floating hover-lift"
            >
              <div className="flex items-center gap-2 mb-1">
                <it.icon className={cn("w-3.5 h-3.5", it.accent)} />
                <span className="text-xs font-semibold">{it.title}</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">{it.desc}</p>
            </Link>
          ))}
        </div>

        <Link
          to="/dashboard/agents"
          className="mt-3 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl btn-premium text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" /> Ask your AI team
        </Link>
      </div>
    </motion.aside>
  );
}
