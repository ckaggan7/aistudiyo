import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowUp } from "lucide-react";

const PLACEHOLDERS = [
  "Create viral reel hooks for fitness creators…",
  "Generate a 10-slide LinkedIn carousel about AI…",
  "Design a launch-day Instagram poster…",
  "Plan a 7-day campaign for my SaaS…",
];

const CHIPS = [
  { label: "🎬 Reel hook",      prompt: "Write 10 viral reel hooks about " },
  { label: "📚 Carousel",       prompt: "Create a 10-slide Instagram carousel about " },
  { label: "💼 LinkedIn post",  prompt: "Write an authority LinkedIn post about " },
  { label: "🏷️ Caption",        prompt: "Write a scroll-stopping Instagram caption about " },
  { label: "🎨 Image",          prompt: "Generate an image of " },
  { label: "📅 Campaign",       prompt: "Plan a 7-day content campaign for " },
];

function routeFor(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/\b(image|picture|photo|sticker|design|visual|illustration|render|poster|thumbnail)\b/.test(p)) {
    return `/dashboard/image-studio?prompt=${encodeURIComponent(prompt)}`;
  }
  if (/\b(agent|automate|automation|workflow|publish daily|schedule for me)\b/.test(p)) {
    return `/dashboard/agents`;
  }
  if (/\bcampaign\b/.test(p)) return `/dashboard/calendar`;
  const platform = /linkedin/.test(p) ? "linkedin" : /twitter|x\.com/.test(p) ? "twitter" : "instagram";
  const contentType = /carousel/.test(p) ? "carousel" : /reel|short/.test(p) ? "reel" : /ad\b/.test(p) ? "ad" : "post";
  const params = new URLSearchParams({ topic: prompt, platform, contentType });
  return `/dashboard/generator?${params.toString()}`;
}

export default function QuickCreateBar({ initial = "" }: { initial?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initial);
  const [phIdx, setPhIdx] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    navigate(routeFor(v));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="relative mb-6"
    >
      {/* glow halo when focused */}
      <div
        aria-hidden
        className={`absolute -inset-px rounded-3xl transition-opacity duration-500 ${focused ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.35), hsl(var(--accent) / 0.25))", filter: "blur(18px)" }}
      />
      <div className="relative surface-floating rounded-2xl p-3 md:p-4">
        <div className="flex items-stretch gap-2 bg-background/60 rounded-xl border border-border/50 px-2.5 py-2 focus-within:border-primary/50 transition-colors">
          <div className="self-center shrink-0 w-7 h-7 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <input
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={PLACEHOLDERS[phIdx]}
            className="flex-1 bg-transparent outline-none px-1 text-sm md:text-base placeholder:text-muted-foreground/60"
          />
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg btn-premium text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create <ArrowUp className="w-4 h-4 rotate-45" />
          </button>
        </div>

        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-0.5 scrollbar-thin">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => setValue(c.prompt)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border/40 bg-background/40 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
