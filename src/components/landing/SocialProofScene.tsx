import { motion } from "framer-motion";
import { FlowSection } from "@/components/ui/story-scroll";

const STATS = [
  { k: "1M+",   v: "AI generations" },
  { k: "100K+", v: "creators onboard" },
  { k: "10M+",  v: "social reach" },
  { k: "500K+", v: "viral hooks generated" },
];
const TESTIMONIALS = [
  { who: "Maya R.", role: "Founder · 240K IG",  q: "I replaced my 4-person content team with AISTUDIYO. Reach went up." },
  { who: "Jordan T.", role: "Creator · 1.2M",   q: "The hook agent alone is worth it. Three viral posts in one week." },
  { who: "Lina P.",   role: "Agency Owner",     q: "We onboard new clients in a day. Brand voice learning is genuinely scary good." },
];

export default function SocialProofScene() {
  return (
    <FlowSection aria-label="Social Proof" style={{ backgroundColor: "#0d0d10", color: "#fff" }}>
      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400/90">07 — Loved by creators</p>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative text-[clamp(2.5rem,8vw,7.5rem)] font-bold leading-[0.9] tracking-tight"
      >
        Built by creators.<br /><span className="text-gradient-hero">Used by thousands.</span>
      </motion.h2>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.k}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur edge-glow"
          >
            <p className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-gradient-hero">{s.k}</p>
            <p className="text-xs text-white/60 uppercase tracking-wider mt-1">{s.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative grid md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.who}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300/90 font-bold">Live</span>
            </div>
            <p className="text-sm leading-relaxed text-white/85">"{t.q}"</p>
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-sm font-semibold">{t.who}</p>
              <p className="text-[11px] text-white/50">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </FlowSection>
  );
}