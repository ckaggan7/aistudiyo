import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Linkedin, TrendingUp, Repeat, ArrowRight } from "lucide-react";

const AGENTS = [
  {
    icon: Instagram,
    label: "Grow Instagram",
    desc: "Daily, hands-free",
    to: "/dashboard/agents",
    accent: "hsl(var(--accent-pink))",
  },
  {
    icon: Linkedin,
    label: "Write LinkedIn Post",
    desc: "Authority voice",
    to: "/dashboard/generator?platform=linkedin&contentType=post",
    accent: "hsl(var(--accent-blue))",
  },
  {
    icon: TrendingUp,
    label: "Find Trends",
    desc: "What's hot now",
    to: "/dashboard/trends",
    accent: "hsl(var(--accent-violet))",
  },
  {
    icon: Repeat,
    label: "Repurpose Content",
    desc: "One post, many formats",
    to: "/dashboard/agents",
    accent: "hsl(var(--accent-emerald))",
  },
];

export default function AgentsStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.25 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">AI agents</h3>
        <Link
          to="/dashboard/agents"
          className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline"
        >
          All agents <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {AGENTS.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="group rounded-xl border border-border/40 bg-card p-3 hover:-translate-y-0.5 hover:border-primary/30 transition-all"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ background: `color-mix(in hsl, ${a.accent} 12%, transparent)` }}
            >
              <a.icon className="w-4 h-4" style={{ color: a.accent }} />
            </div>
            <p className="text-sm font-medium leading-tight">{a.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
            <span className="mt-2 inline-flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Run <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}