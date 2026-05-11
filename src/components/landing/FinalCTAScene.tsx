import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import { FlowSection } from "@/components/ui/story-scroll";

export default function FinalCTAScene() {
  return (
    <FlowSection aria-label="Final CTA" style={{ backgroundColor: "#0a0a0a", color: "#fff" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[55rem] rounded-full opacity-50 blur-3xl"
             style={{ background: "radial-gradient(circle, hsl(22 95% 55% / 0.7), transparent 60%)" }} />
        <div className="absolute -bottom-40 right-0 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl"
             style={{ background: "radial-gradient(circle, hsl(280 80% 58% / 0.6), transparent 60%)" }} />
        {[...Array(20)].map((_, i) => (
          <span key={i} className="absolute rounded-full bg-white/40"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 53) % 100}%`,
              top: `${(i * 41) % 100}%`,
              animation: `pulse ${3 + (i % 4)}s ease-in-out ${i * 0.15}s infinite`,
            }} />
        ))}
      </div>

      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400/90">08 — Start now</p>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.9] tracking-tight"
        >
          Your AI Social<br />Media Team<br /><span className="text-gradient-hero">Starts Here.</span>
        </motion.h2>
        <p className="mt-6 max-w-[55ch] text-[clamp(1rem,1.6vw,1.3rem)] text-white/70">
          Join thousands of creators using AISTUDIYO to ship content that actually moves the needle.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/dashboard" className="btn-premium px-7 h-12 rounded-full inline-flex items-center gap-2 text-sm font-semibold">
            Launch Workspace <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/dashboard/agents" className="px-7 h-12 rounded-full inline-flex items-center gap-2 text-sm font-semibold border border-white/20 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
            <Bot className="w-4 h-4" /> Explore AI Agents
          </Link>
        </div>
      </div>

      <p className="relative text-center text-xs text-white/40 tracking-wider">AISTUDIYO · The AI Operating System for Social Media Creators</p>
    </FlowSection>
  );
}