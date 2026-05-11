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
      className="relative"
    >
      <div className="card-bento">
        <div className="mb-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Quick create</p>
          <h3 className="text-xl font-semibold tracking-tight">What do you want to create?</h3>
        </div>
        <div className={`relative flex items-stretch gap-2 bg-white rounded-2xl border-2 px-3 py-2.5 transition-all ${focused ? "border-primary/60 shadow-[0_0_0_4px_hsl(22_100%_55%/0.12)]" : "border-border/60"}`}>
          <div className="self-center shrink-0 w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <input
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={PLACEHOLDERS[phIdx]}
            className="flex-1 min-w-0 bg-transparent outline-none px-2 text-sm md:text-base placeholder:text-muted-foreground/60"
          />
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="magnetic-btn inline-flex items-center gap-1.5 h-11 px-5 rounded-xl btn-premium text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate <ArrowUp className="w-4 h-4 rotate-45" />
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-0.5 scrollbar-thin">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => setValue(c.prompt)}
              className="shrink-0 text-xs px-3.5 py-2 rounded-full border border-border/60 bg-white text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
