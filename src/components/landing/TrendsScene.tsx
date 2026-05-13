import { FlowSection } from "@/components/ui/story-scroll";
import { motion } from "framer-motion";

type Hook = { text: string; score: number };
const HOOKS_A: Hook[] = [
  { text: "Nobody tells you this about scaling on Instagram…", score: 94 },
  { text: "I tested 50 viral hooks. Only 3 worked.",            score: 88 },
  { text: "The 1 prompt that 10x'd my engagement.",             score: 96 },
  { text: "Stop writing captions. Do this instead.",            score: 72 },
  { text: "Your LinkedIn is leaving money on the table.",       score: 81 },
  { text: "5 underrated AI tools for creators in 2026.",        score: 67 },
];
const HOOKS_B: Hook[] = [
  { text: "#AIMarketing surging +312%", score: 98 },
  { text: "#FounderStory · top niche",  score: 85 },
  { text: "#CreatorEconomy +180%",      score: 91 },
  { text: "#Productivity · steady",     score: 64 },
  { text: "#BrandBuilding +94%",        score: 78 },
  { text: "#ViralHooks · fire",         score: 95 },
];

function scoreColor(score: number) {
  if (score >= 90) return "330 88% 62%"; // hot pink
  if (score >= 70) return "22 95% 55%";  // orange
  return "45 95% 58%";                    // amber
}

function Row({ items, dir = "left" }: { items: Hook[]; dir?: "left" | "right" }) {
  const dup = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-3 whitespace-nowrap"
        animate={{ x: dir === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {dup.map((t, i) => {
          const c = scoreColor(t.score);
          return (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border text-sm text-zinc-800 shadow-sm shrink-0"
              style={{ borderColor: `hsl(${c} / 0.3)` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: `hsl(${c})`, boxShadow: `0 0 8px hsl(${c} / 0.9)` }} />
              {t.text}
              <span className="ml-1 text-[10px] font-bold tracking-wider" style={{ color: `hsl(${c})` }}>
                {t.score}
              </span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function TrendsScene() {
  return (
    <FlowSection aria-label="Trends" style={{ backgroundColor: "#FAFAFA", color: "#0A0A0A" }}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative text-[clamp(2.5rem,8.5vw,8rem)] font-bold leading-[0.9] tracking-tight pt-12"
      >
        AI-Powered<br /><span className="text-gradient-hero">Trend Intelligence</span>
      </motion.h2>
      <hr className="relative my-[1.5vw] border-none border-t border-black/10" />

      <div className="relative flex-1 flex flex-col justify-center gap-4">
        <Row items={HOOKS_A} dir="left" />
        <Row items={HOOKS_B} dir="right" />
        <Row items={HOOKS_A.slice().reverse()} dir="left" />
      </div>

      <div className="relative flex flex-wrap gap-6 text-xs text-zinc-500 mt-4">
        <span><b className="text-zinc-900">Live</b> · real-time hook radar</span>
        <span><b className="text-zinc-900">Niche-aware</b> · learns your audience</span>
        <span><b className="text-zinc-900">Predictive</b> · 24-hour virality forecast</span>
      </div>
    </FlowSection>
  );
}