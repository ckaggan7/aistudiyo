import { motion } from "framer-motion";
import { ArrowRight, FileText, LayoutGrid, MessageSquare, Film, Hash, Megaphone, Sparkles } from "lucide-react";
import { FlowSection } from "@/components/ui/story-scroll";

const STEPS = [
  { Icon: Sparkles,     label: "Prompt",   accent: "22 95% 55%"  },
  { Icon: FileText,     label: "Post",     accent: "220 90% 60%" },
  { Icon: LayoutGrid,   label: "Carousel", accent: "265 85% 62%" },
  { Icon: MessageSquare,label: "Thread",   accent: "265 85% 62%" },
  { Icon: Film,         label: "Reel",     accent: "330 88% 62%" },
  { Icon: Megaphone,    label: "CTA",      accent: "160 75% 50%" },
  { Icon: Hash,         label: "Hashtags", accent: "45 95% 58%"  },
];

export default function ContentEngineScene() {
  return (
    <FlowSection aria-label="Content Engine" style={{ backgroundColor: "#ff6a17", color: "#0a0a0a" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full opacity-50 blur-3xl"
             style={{ background: "radial-gradient(circle, #ffb37a, transparent 60%)" }} />
      </div>

      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-black/70">04 — Content Engine</p>
      <hr className="relative my-[1.5vw] border-none border-t border-black/30" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative text-[clamp(2.8rem,10vw,10rem)] font-bold leading-[0.9] tracking-tight"
      >
        One Prompt.<br />Infinite Content.
      </motion.h2>
      <hr className="relative my-[1.5vw] border-none border-t border-black/30" />

      <p className="relative max-w-[55ch] text-[clamp(1rem,1.8vw,1.5rem)] leading-relaxed">
        Type once. Watch one idea morph into a full content engine — across every platform, in your brand voice.
      </p>

      <div className="relative mt-auto flex flex-wrap items-center gap-3">
        {STEPS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className="flex items-center gap-2 px-4 h-12 rounded-full bg-black/90 text-white shadow-elevated"
              style={{ boxShadow: `0 0 0 1px hsl(${s.accent} / 0.5), 0 0 22px -4px hsl(${s.accent} / 0.55)` }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: `hsl(${s.accent})`, boxShadow: `0 0 8px hsl(${s.accent})` }}
              />
              <s.Icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ArrowRight className="w-5 h-5 text-black/50" />}
          </motion.div>
        ))}
      </div>
    </FlowSection>
  );
}