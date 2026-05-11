import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Bot, Zap, Palette, Film, ArrowRight } from "lucide-react";

const ITEMS = [
  { icon: Bot,      tag: "New agent",   title: "Viral Hook AI",      desc: "Ship 10 hooks in 30s",    to: "/dashboard/agents",                  bg: "from-orange-500/15 to-pink-500/15",    fg: "text-orange-700" },
  { icon: Film,     tag: "Trend pack",  title: "POV Creator Desk",   desc: "Reels +38% this week",    to: "/dashboard/trends",                  bg: "from-violet-500/15 to-blue-500/15",    fg: "text-violet-700" },
  { icon: Palette,  tag: "Template",    title: "Pastel Carousel",    desc: "10-slide LinkedIn pack",  to: "/dashboard/generator?contentType=carousel", bg: "from-sky-500/15 to-cyan-400/15", fg: "text-sky-700" },
  { icon: Zap,      tag: "AI release",  title: "Gemini 3 Flash",     desc: "2× faster, sharper hooks", to: "/dashboard/generator",              bg: "from-emerald-500/15 to-teal-500/15",   fg: "text-emerald-700" },
  { icon: Sparkles, tag: "Format",      title: "9:16 Story Reels",   desc: "Auto-format for shorts",  to: "/dashboard/image-studio",            bg: "from-pink-500/15 to-rose-500/15",      fg: "text-pink-700" },
  { icon: Bot,      tag: "New agent",   title: "Campaign Strategist", desc: "7-day plans, hands-free", to: "/dashboard/agents",                 bg: "from-amber-500/15 to-orange-500/15",   fg: "text-amber-700" },
];

export default function WhatsNewCarousel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="card-bento h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-base">What's new</h3>
        </div>
        <span className="chip">Fresh today</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x scrollbar-thin">
        {ITEMS.map((it) => (
          <Link
            key={it.title}
            to={it.to}
            className={`group snap-start shrink-0 w-[240px] rounded-2xl border border-border/60 p-4 bg-gradient-to-br ${it.bg} hover:shadow-md transition-all relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
                <it.icon className={`w-5 h-5 ${it.fg}`} />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${it.fg}`}>
                {it.tag}
              </span>
            </div>
            <p className="text-base font-semibold tracking-tight">{it.title}</p>
            <p className="text-xs text-foreground/60 mt-1">{it.desc}</p>
            <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-foreground/40 group-hover:translate-x-0.5 group-hover:text-foreground transition-all" />
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
