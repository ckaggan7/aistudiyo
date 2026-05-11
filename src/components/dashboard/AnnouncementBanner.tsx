import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot, Workflow, Palette, Calendar, ImageIcon, Sparkles, ArrowRight,
} from "lucide-react";

const items = [
  { label: "Agents", to: "/dashboard/agents", icon: Bot },
  { label: "Workflow", to: "/dashboard/workflows", icon: Workflow },
  { label: "Branding CRM", to: "/dashboard/branding", icon: Palette },
  { label: "Calendar", to: "/dashboard/calendar", icon: Calendar },
  { label: "New Image Gen Engine", to: "/dashboard/image-studio", icon: ImageIcon },
  { label: "ChatGPT 2.0", to: "/dashboard/agents", icon: Sparkles },
];

export default function AnnouncementBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 md:p-8 mb-6"
    >
      {/* Ambient orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-hero opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-24 w-72 h-72 rounded-full bg-gradient-accent opacity-15 blur-3xl pointer-events-none" />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--foreground) / 0.25) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            NEW DROPS
          </span>
          <Link
            to="/dashboard/agents"
            className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline"
          >
            Explore all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          What's new in <span className="text-gradient-hero">AI STUDIYO</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 mb-5">
          Six tools to ship faster — explore the latest modules.
        </p>

        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04, duration: 0.3 }}
              >
                <Link
                  to={it.to}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border/50 bg-background/40 backdrop-blur text-sm font-medium text-foreground/85 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="whitespace-nowrap">{it.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}