import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUp } from "lucide-react";
import { FlowSection } from "@/components/ui/story-scroll";

const PROMPTS = [
  "Create an Instagram carousel about AI marketing",
  "Generate 5 viral reel hooks for founders",
  "Write a LinkedIn authority post on growth",
  "Create a YouTube Shorts script that hooks in 3s",
];
const CHIPS = ["Carousel", "Reel hook", "LinkedIn post", "Twitter thread", "YouTube short", "Caption"];

export default function QuickCreateScene() {
  const [pIdx, setPIdx] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const full = PROMPTS[pIdx];
    if (typed.length < full.length) {
      const t = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 35);
      return () => clearTimeout(t);
    }
    const hold = setTimeout(() => {
      setTyped("");
      setPIdx((i) => (i + 1) % PROMPTS.length);
    }, 1800);
    return () => clearTimeout(hold);
  }, [typed, pIdx]);

  return (
    <FlowSection aria-label="Quick Create" style={{ backgroundColor: "#111114", color: "#fff" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full opacity-25 blur-3xl"
             style={{ background: "radial-gradient(circle, hsl(22 95% 55% / 0.6), transparent 60%)" }} />
      </div>

      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400/90">02 — Quick Create</p>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <div className="relative flex-1 flex flex-col justify-center items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-[clamp(2.8rem,10vw,10rem)] font-bold leading-[0.9] tracking-tight"
        >
          Create Faster.<br />
          <span className="text-gradient-hero">Grow Smarter.</span>
        </motion.h2>

        <div className="mt-10 w-full max-w-3xl">
          <div className="relative flex items-stretch gap-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/15 p-2 shadow-elevated edge-glow">
            <div className="flex-1 flex items-center px-4 text-left min-h-[3rem]">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mr-3" />
              <span className="text-base md:text-lg">{typed}</span>
              <span className="ml-0.5 inline-block w-[2px] h-5 bg-orange-400 animate-pulse" />
            </div>
            <button className="btn-premium px-5 rounded-xl inline-flex items-center gap-1.5 text-sm font-semibold">
              Create <ArrowUp className="w-4 h-4 rotate-45" />
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {CHIPS.map((c) => (
              <span key={c} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 backdrop-blur">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FlowSection>
  );
}