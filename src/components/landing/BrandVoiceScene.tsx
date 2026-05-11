import { motion } from "framer-motion";
import { Mic, Target, Users, Image as ImageIcon, Heart } from "lucide-react";
import { FlowSection } from "@/components/ui/story-scroll";

const NODES = [
  { Icon: Mic,        label: "Tone",      x: 18, y: 28 },
  { Icon: Target,     label: "CTA",       x: 82, y: 22 },
  { Icon: Users,      label: "Audience",  x: 14, y: 70 },
  { Icon: ImageIcon,  label: "Visual",    x: 86, y: 72 },
  { Icon: Heart,      label: "Personality", x: 50, y: 88 },
];

export default function BrandVoiceScene() {
  return (
    <FlowSection aria-label="Brand Voice" style={{ backgroundColor: "#06060a", color: "#fff" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full opacity-30 blur-3xl"
             style={{ background: "radial-gradient(circle, hsl(22 95% 55% / 0.6), transparent 60%)" }} />
      </div>

      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400/90">06 — Brand Memory</p>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 flex-1 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[clamp(2.5rem,8vw,7.5rem)] font-bold leading-[0.9] tracking-tight"
          >
            AI That<br />Understands<br /><span className="text-gradient-hero">Your Brand</span>
          </motion.h2>
          <p className="mt-6 max-w-[50ch] text-[clamp(1rem,1.6vw,1.3rem)] text-white/70 leading-relaxed">
            AISTUDIYO learns your tone, audience, CTAs, visual identity and creator personality — so every output sounds like you, not a robot.
          </p>
        </div>

        <div className="relative h-[420px] w-full hidden lg:block">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {NODES.map((n, i) => (
              <line key={i} x1="50" y1="50" x2={n.x} y2={n.y}
                    stroke="hsl(22 95% 55% / 0.4)" strokeWidth="0.2" strokeDasharray="0.6 0.6" />
            ))}
            <circle cx="50" cy="50" r="2.5" fill="hsl(22 95% 55%)" />
          </svg>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-hero shadow-glow flex items-center justify-center text-xs font-bold tracking-wider"
          >
            BRAIN
          </motion.div>
          {NODES.map((n, i) => (
            <motion.div key={n.label}
              initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/20 flex items-center justify-center edge-glow">
                <n.Icon className="w-5 h-5 text-orange-300" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/60">{n.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </FlowSection>
  );
}