import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Linkedin, TrendingUp, Repeat, ArrowRight, Bot } from "lucide-react";

const AGENTS = [
  { icon: Instagram, label: "Grow Instagram",     desc: "Daily, hands-free",      to: "/dashboard/agents",                                       accent: "hsl(var(--accent-pink))" },
  { icon: Linkedin,  label: "Write LinkedIn Post", desc: "Authority voice",        to: "/dashboard/generator?platform=linkedin&contentType=post", accent: "hsl(var(--accent-blue))" },
  { icon: TrendingUp,label: "Find Trends",        desc: "What's hot now",         to: "/dashboard/trends",                                       accent: "hsl(var(--accent-violet))" },
  { icon: Repeat,    label: "Repurpose Content",  desc: "One post, many formats", to: "/dashboard/agents",                                       accent: "hsl(var(--accent-emerald))" },
];

export default function AgentsStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="surface-floating rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Your AI team</h3>
        </div>
        <Link to="/dashboard/agents" className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline">
          All agents <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {AGENTS.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="group rounded-xl border border-border/40 bg-background/40 p-3 hover-lift relative"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 relative"
              style={{ background: `color-mix(in hsl, ${a.accent} 14%, transparent)` }}
            >
              <a.icon className="w-4 h-4" style={{ color: a.accent }} />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-sm font-medium leading-tight">{a.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
