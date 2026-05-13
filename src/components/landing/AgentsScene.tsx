import { motion } from "framer-motion";
import { Instagram, Linkedin, Flame, Compass, Megaphone } from "lucide-react";
import { FlowSection } from "@/components/ui/story-scroll";

const AGENTS = [
  { Icon: Instagram, name: "Instagram Growth",    desc: "Auto-publishes, comments, grows your audience.", status: "Online",   accent: "330 88% 62%" }, // pink
  { Icon: Linkedin,  name: "LinkedIn Branding",   desc: "Builds authority with daily thoughtful posts.",  status: "Online",   accent: "220 90% 60%" }, // blue
  { Icon: Flame,     name: "Viral Hook Agent",    desc: "Drafts scroll-stopping hooks every morning.",     status: "Thinking", accent: "22 95% 55%"  }, // orange
  { Icon: Compass,   name: "Trend Hunter",        desc: "Surfaces niche-specific viral patterns daily.",  status: "Online",   accent: "265 85% 62%" }, // violet
  { Icon: Megaphone, name: "Campaign Strategist", desc: "Plans 7-day campaigns aligned to your goals.",   status: "Online",   accent: "160 75% 50%" }, // emerald
];

export default function AgentsScene() {
  return (
    <FlowSection aria-label="AI Agents" style={{ backgroundColor: "#FFFFFF", color: "#0A0A0A" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative text-[clamp(2.5rem,8.5vw,8rem)] font-bold leading-[0.9] tracking-tight pt-12"
      >
        Meet Your<br />
        <span className="text-gradient-hero">AI Social Media Team</span>
      </motion.h2>
      <hr className="relative my-[1.5vw] border-none border-t border-black/10" />

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {AGENTS.map((a, i) => (
          <motion.div key={a.name}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl bg-white border border-black/10 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-400/60 transition-all"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"
              style={{ background: `radial-gradient(circle, hsl(${a.accent} / 0.55), transparent 60%)` }}
            />
            <div className="relative w-11 h-11 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow mb-4">
              <a.Icon className="w-5 h-5 text-white" />
            </div>
            <p className="relative text-sm font-semibold mb-1">{a.name}</p>
            <p className="relative text-xs text-zinc-600 leading-relaxed mb-4 min-h-[44px]">{a.desc}</p>
            <div className="relative flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: `hsl(${a.accent})`, boxShadow: `0 0 10px hsl(${a.accent} / 0.8)` }}
              />
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">{a.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </FlowSection>
  );
}