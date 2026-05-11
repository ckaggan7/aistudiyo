import { motion } from "framer-motion";
import { Instagram, Linkedin, Flame, Compass, Megaphone } from "lucide-react";
import { FlowSection } from "@/components/ui/story-scroll";

const AGENTS = [
  { Icon: Instagram, name: "Instagram Growth", desc: "Auto-publishes, comments, grows your audience.", status: "Online" },
  { Icon: Linkedin,  name: "LinkedIn Branding", desc: "Builds authority with daily thoughtful posts.", status: "Online" },
  { Icon: Flame,     name: "Viral Hook Agent", desc: "Drafts scroll-stopping hooks every morning.",  status: "Thinking" },
  { Icon: Compass,   name: "Trend Hunter",     desc: "Surfaces niche-specific viral patterns daily.", status: "Online" },
  { Icon: Megaphone, name: "Campaign Strategist", desc: "Plans 7-day campaigns aligned to your goals.", status: "Online" },
];

export default function AgentsScene() {
  return (
    <FlowSection aria-label="AI Agents" style={{ backgroundColor: "#050507", color: "#fff" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent" />
      </div>

      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400/90">03 — AI Team</p>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative text-[clamp(2.5rem,8.5vw,8rem)] font-bold leading-[0.9] tracking-tight"
      >
        Meet Your<br />
        <span className="text-gradient-hero">AI Social Media Team</span>
      </motion.h2>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {AGENTS.map((a, i) => (
          <motion.div key={a.name}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 edge-glow hover:-translate-y-1 hover:border-orange-400/50 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow mb-4">
              <a.Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold mb-1">{a.name}</p>
            <p className="text-xs text-white/60 leading-relaxed mb-4 min-h-[44px]">{a.desc}</p>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${a.status === "Online" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
              <span className="text-[10px] uppercase tracking-wider text-white/50">{a.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </FlowSection>
  );
}