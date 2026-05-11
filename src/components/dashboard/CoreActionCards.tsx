import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wand2, Bot, CalendarClock, ArrowRight, Rocket } from "lucide-react";

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
    gradient: "from-sky-500 to-blue-600",
  },
];

export default function CoreActionCards() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="card-bento h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-base">Jump in</h3>
        </div>
        <span className="chip">Shortcuts</span>
      </div>
      <div className="flex flex-col gap-2.5 flex-1">
        {ACTIONS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group relative overflow-hidden flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 hover:bg-white hover:border-primary/30 hover:shadow-md transition-all p-3"
          >
            <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-glow`}>
              <a.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">{a.title}</p>
              <p className="text-[11px] text-muted-foreground truncate">{a.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
