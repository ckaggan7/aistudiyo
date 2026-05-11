import { FlowSection } from "@/components/ui/story-scroll";
import { motion } from "framer-motion";

const HOOKS_A = [
  "Nobody tells you this about scaling on Instagram…",
  "I tested 50 viral hooks. Only 3 worked.",
  "The 1 prompt that 10x'd my engagement.",
  "Stop writing captions. Do this instead.",
  "Your LinkedIn is leaving money on the table.",
  "5 underrated AI tools for creators in 2026.",
];
const HOOKS_B = [
  "#AIMarketing surging +312%",
  "#FounderStory · top niche",
  "#CreatorEconomy +180%",
  "#Productivity · steady",
  "#BrandBuilding +94%",
  "#ViralHooks · fire",
];

function Row({ items, dir = "left" }: { items: string[]; dir?: "left" | "right" }) {
  const dup = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-3 whitespace-nowrap"
        animate={{ x: dir === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {dup.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 backdrop-blur shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function TrendsScene() {
  return (
    <FlowSection aria-label="Trends" style={{ backgroundColor: "#0a0a0d", color: "#fff" }}>
      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400/90">05 — Trend Intelligence</p>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative text-[clamp(2.5rem,8.5vw,8rem)] font-bold leading-[0.9] tracking-tight"
      >
        AI-Powered<br /><span className="text-gradient-hero">Trend Intelligence</span>
      </motion.h2>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <div className="relative flex-1 flex flex-col justify-center gap-4">
        <Row items={HOOKS_A} dir="left" />
        <Row items={HOOKS_B} dir="right" />
        <Row items={HOOKS_A.slice().reverse()} dir="left" />
      </div>

      <div className="relative flex flex-wrap gap-6 text-xs text-white/50 mt-4">
        <span><b className="text-white">Live</b> · real-time hook radar</span>
        <span><b className="text-white">Niche-aware</b> · learns your audience</span>
        <span><b className="text-white">Predictive</b> · 24-hour virality forecast</span>
      </div>
    </FlowSection>
  );
}