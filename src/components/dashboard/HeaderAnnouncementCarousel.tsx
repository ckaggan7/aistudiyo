import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot, Workflow, Palette, Calendar, ImageIcon, Sparkles,
  ArrowRight, X, ChevronLeft, ChevronRight,
} from "lucide-react";

const slides = [
  { label: "Agents",              tag: "NEW",     to: "/dashboard/agents",       icon: Bot,       gradient: "from-violet-500 to-fuchsia-500" },
  { label: "Workflows",           tag: "NEW",     to: "/dashboard/workflows",    icon: Workflow,  gradient: "from-cyan-500 to-blue-500" },
  { label: "Branding CRM",        tag: "NEW",     to: "/dashboard/branding",     icon: Palette,   gradient: "from-pink-500 to-rose-500" },
  { label: "Calendar",            tag: "UPDATED", to: "/dashboard/calendar",     icon: Calendar,  gradient: "from-orange-400 to-primary" },
  { label: "Image Gen Engine",    tag: "NEW",     to: "/dashboard/image-studio", icon: ImageIcon, gradient: "from-emerald-500 to-cyan-500" },
  { label: "ChatGPT 2.0",         tag: "BETA",    to: "/dashboard/agents",       icon: Sparkles,  gradient: "from-amber-400 to-orange-500" },
];

const STORAGE_KEY = "announce-dismissed-v1";

export default function HeaderAnnouncementCarousel() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) !== "1"; } catch { return true; }
  });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!visible || paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [visible, paused]);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  };

  if (!visible) {
    return (
      <button
        onClick={() => { try { localStorage.removeItem(STORAGE_KEY); } catch {}; setVisible(true); }}
        title="Show what's new"
        className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 h-7 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
      >
        <Sparkles className="w-3 h-3" /> What's new
      </button>
    );
  }

  const s = slides[idx];
  const Icon = s.icon;
  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="hidden md:flex items-center gap-1 h-9 pl-1 pr-1 rounded-full border border-border/50 bg-card/60 backdrop-blur overflow-hidden max-w-[460px]"
    >
      <button
        onClick={prev}
        aria-label="Previous"
        className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors shrink-0"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      <Link
        to={s.to}
        className="group flex-1 flex items-center gap-2 px-2 h-7 rounded-full hover:bg-secondary/60 transition-colors min-w-0"
      >
        <span className={`shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-glow`}>
          <Icon className="w-3 h-3 text-white" />
        </span>
        <span className="text-[10px] font-bold tracking-wider text-primary shrink-0">{s.tag}</span>

        <AnimatePresence mode="wait">
          <motion.span
            key={s.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-xs font-medium text-foreground/85 group-hover:text-primary truncate"
          >
            {s.label}
          </motion.span>
        </AnimatePresence>

        <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>

      <div className="flex items-center gap-0.5 shrink-0 px-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all ${i === idx ? "w-3 bg-primary" : "w-1 bg-muted-foreground/40 hover:bg-muted-foreground/70"}`}
          />
        ))}
      </div>

      <button
        onClick={next}
        aria-label="Next"
        className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors shrink-0"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={dismiss}
        aria-label="Hide announcements"
        className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-secondary/60 transition-colors shrink-0"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
