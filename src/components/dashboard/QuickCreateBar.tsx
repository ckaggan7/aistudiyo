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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-2xl border border-border/40 bg-card p-4 md:p-5 mb-6"
    >
      <div className="relative">
        <div className="flex items-stretch gap-2 bg-background/60 rounded-xl border border-border/50 p-2 focus-within:border-primary/40 transition-colors">
          <Sparkles className="w-4 h-4 text-primary self-center ml-2 shrink-0" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder='What do you want to create?'
            className="flex-1 bg-transparent outline-none px-2 text-sm md:text-base placeholder:text-muted-foreground/60"
            autoFocus
          />
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:brightness-105 transition-all"
          >
            Create <ArrowUp className="w-4 h-4 rotate-45" />
          </button>
        </div>

        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-thin">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => setValue(c.prompt)}
              className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
