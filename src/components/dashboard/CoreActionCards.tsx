import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wand2, Bot, CalendarClock, ArrowRight } from "lucide-react";

const ACTIONS = [
  {
    title: "Create Content",
    desc: "Captions, carousels, reels & hooks",
    icon: Wand2,
    to: "/dashboard/generator",
    gradient: "from-primary to-accent",
  },
  {
    title: "Launch AI Agent",
    desc: "Deploy a social media employee",
    icon: Bot,
    to: "/dashboard/agents",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Plan Campaign",
    desc: "Plan your week, autopilot it",
    icon: CalendarClock,
    to: "/dashboard/calendar",
    gradient: "from-orange-400 to-primary",
  },
];

export default function CoreActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
      {ACTIONS.map((a, i) => (
        <motion.div
          key={a.to}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
        >
          <Link
            to={a.to}
            className="group relative overflow-hidden block rounded-2xl border border-border/40 bg-card p-5 md:p-6 hover:border-primary/40 hover:shadow-elevated hover:-translate-y-0.5 transition-all h-full edge-glow"
          >
            <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${a.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
            <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-glow mb-4`}>
              <a.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-base mb-1">{a.title}</p>
            <p className="text-xs text-muted-foreground mb-4">{a.desc}</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-1.5 transition-all">
              Start <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
