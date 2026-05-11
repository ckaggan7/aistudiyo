import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowUp } from "lucide-react";

const CHIPS = [
  { label: "Carousel", prompt: "Create an Instagram carousel about " },
  { label: "Reel hook", prompt: "Write a viral reel hook about " },
  { label: "LinkedIn post", prompt: "Write an authority LinkedIn post about " },
  { label: "Caption", prompt: "Write an Instagram caption about " },
  { label: "Image", prompt: "Generate an image of " },
];

function routeFor(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/\b(image|picture|photo|sticker|design|visual|illustration|render)\b/.test(p)) {
    return `/dashboard/image-studio?prompt=${encodeURIComponent(prompt)}`;
  }
  if (/\b(agent|automate|automation|workflow|publish daily|schedule for me)\b/.test(p)) {
    return `/dashboard/agents`;
  }
  // infer platform + contentType for generator
  const platform = /linkedin/.test(p) ? "linkedin" : /twitter|x\.com/.test(p) ? "twitter" : "instagram";
  const contentType = /carousel/.test(p) ? "carousel" : /reel|short/.test(p) ? "reel" : /ad\b/.test(p) ? "ad" : "post";
  const params = new URLSearchParams({ topic: prompt, platform, contentType });
  return `/dashboard/generator?${params.toString()}`;
}

export default function QuickCreateBar({ initial = "" }: { initial?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initial);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    navigate(routeFor(v));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 md:p-8 mb-6"
    >
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-hero opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-accent opacity-15 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <Sparkles className="w-3 h-3" /> AI Quick Create
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Describe it — we'll route you to the right tool
          </span>
        </div>

        <div className="flex items-stretch gap-2 bg-background/60 backdrop-blur rounded-2xl border border-border/50 p-2 shadow-card focus-within:border-primary/40 transition-colors">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder='Try: "Create Instagram carousel about AI marketing"'
            className="flex-1 bg-transparent outline-none px-3 text-sm md:text-base placeholder:text-muted-foreground/60"
            autoFocus
          />
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="inline-flex items-center gap-1.5 px-4 rounded-xl bg-gradient-hero text-primary-foreground text-sm font-medium shadow-glow disabled:opacity-40 disabled:shadow-none hover:opacity-90 transition-opacity"
          >
            Create <ArrowUp className="w-4 h-4 rotate-45" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => setValue(c.prompt)}
              className="text-xs px-2.5 py-1 rounded-full bg-background/40 backdrop-blur border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
