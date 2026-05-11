import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Bot, LayoutTemplate, Image as ImageIcon,
  CalendarClock, Brain, Flame, ArrowRight,
} from "lucide-react";

type Item = {
  tag: string;
  title: string;
  desc: string;
  to: string;
  gradient: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const ITEMS: Item[] = [
  { tag: "NEW AGENT",     title: "Trend Hunter Agent",    desc: "Auto-detects viral trends in your niche, daily.", to: "/dashboard/agents",    gradient: "from-violet-500 via-fuchsia-500 to-primary",  Icon: Bot },
  { tag: "TEMPLATES",     title: "Viral Hook Pack v3",    desc: "120 scroll-stopping hooks across 8 niches.",      to: "/dashboard/templates", gradient: "from-primary via-orange-500 to-rose-500",     Icon: LayoutTemplate },
  { tag: "STUDIO BETA",   title: "Carousel Studio",       desc: "Generate 10-slide carousels in one prompt.",      to: "/dashboard/design",    gradient: "from-cyan-500 via-blue-500 to-indigo-500",    Icon: ImageIcon },
  { tag: "AUTOPILOT",     title: "Instagram Auto-Publish",desc: "Schedule + publish without lifting a finger.",    to: "/dashboard/calendar",  gradient: "from-pink-500 via-rose-500 to-orange-500",    Icon: CalendarClock },
  { tag: "AI BRAIN v2",   title: "Smarter Content Pack",  desc: "Hooks, captions, CTAs, scores — in one call.",    to: "/dashboard/generator", gradient: "from-emerald-500 via-teal-500 to-cyan-500",   Icon: Brain },
  { tag: "CREATOR TIP",   title: "Best Posting Times",    desc: "Audience data says Tue 7:42pm. Don't sleep on it.",to: "/dashboard/trends",   gradient: "from-amber-400 via-orange-500 to-rose-500",   Icon: Flame },
];

export default function WhatsNewCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const t = setInterval(() => {
      if (paused) return;
      const card = el.querySelector<HTMLElement>("[data-card]");
      const step = card ? card.offsetWidth + 12 : 320;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 3500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">What's new</h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Updated daily</span>
      </div>

      <div
        ref={scrollerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {ITEMS.map((it) => (
          <Link
            key={it.title}
            data-card
            to={it.to}
            className="group relative snap-start shrink-0 w-[280px] sm:w-[340px] rounded-3xl overflow-hidden border border-border/40 bg-card edge-glow hover:-translate-y-0.5 hover:shadow-elevated transition-all"
          >
            <div className={`relative h-32 bg-gradient-to-br ${it.gradient}`}>
              <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,.6), transparent 40%)" }} />
              <div className="absolute -bottom-6 -right-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative h-full p-4 flex flex-col justify-between">
                <span className="self-start text-[10px] font-bold tracking-widest text-white/90 px-2 py-0.5 rounded-full bg-black/25 backdrop-blur">
                  {it.tag}
                </span>
                <it.Icon className="w-7 h-7 text-white drop-shadow self-end" />
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold text-sm">{it.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{it.desc}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-1.5 transition-all">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
