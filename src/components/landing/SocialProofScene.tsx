import { motion } from "framer-motion";
import { FlowSection } from "@/components/ui/story-scroll";

const TESTIMONIALS = [
  { who: "Maya R.", role: "Founder · 240K IG",  q: "I replaced my 4-person content team with AISTUDIYO. Reach went up." },
  { who: "Jordan T.", role: "Creator · 1.2M",   q: "The hook agent alone is worth it. Three viral posts in one week." },
  { who: "Lina P.",   role: "Agency Owner",     q: "We onboard new clients in a day. Brand voice learning is genuinely scary good." },
];

export default function SocialProofScene() {
  return (
    <FlowSection aria-label="Social Proof" style={{ backgroundColor: "#FFFFFF", color: "#0A0A0A" }}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative text-[clamp(2.5rem,8vw,7.5rem)] font-bold leading-[0.9] tracking-tight pt-12"
      >
        Built by creators.<br /><span className="text-gradient-hero">Used by thousands.</span>
      </motion.h2>
      <hr className="relative my-[1.5vw] border-none border-t border-black/10" />

      <div className="relative grid md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.who}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="rounded-2xl bg-white border border-black/10 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">Live</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-800">"{t.q}"</p>
            <div className="mt-4 pt-3 border-t border-black/10">
              <p className="text-sm font-semibold">{t.who}</p>
              <p className="text-[11px] text-zinc-500">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </FlowSection>
  );
}