import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, Sparkles, Bot, Wand2, BarChart3 } from "lucide-react";
import { FlowSection } from "@/components/ui/story-scroll";

export default function HeroScene() {
  return (
    <FlowSection aria-label="Hero" style={{ backgroundColor: "#0a0a0a", color: "#fff" }}>
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full opacity-40 blur-3xl"
             style={{ background: "radial-gradient(circle, hsl(22 95% 55% / 0.55), transparent 60%)" }} />
        <div className="absolute -bottom-40 right-0 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl"
             style={{ background: "radial-gradient(circle, hsl(280 80% 58% / 0.45), transparent 60%)" }} />
        {[...Array(14)].map((_, i) => (
          <span key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 73) % 100}%`,
              top: `${(i * 47) % 100}%`,
              animation: `pulse ${4 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400/90">
        01 — AISTUDIYO
      </p>
      <hr className="relative my-[1.5vw] border-none border-t border-white/15" />

      <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-8 items-end flex-1">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-[clamp(2.8rem,9vw,9rem)] font-bold leading-[0.9] tracking-tight"
          >
            The AI <span className="text-gradient-hero">Operating System</span><br />
            for Social Media Creators
          </motion.h1>
          <p className="mt-6 max-w-[52ch] text-[clamp(1rem,1.6vw,1.4rem)] text-white/70 leading-relaxed">
            Create viral content, launch AI agents, automate workflows, and grow your audience — all from one cinematic creator OS.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="btn-premium px-6 h-12 rounded-full inline-flex items-center gap-2 text-sm font-semibold">
              Start Creating <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => document.querySelector('[aria-label="Quick Create"]')?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 h-12 rounded-full inline-flex items-center gap-2 text-sm font-semibold border border-white/20 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors"
            >
              <PlayCircle className="w-4 h-4" /> Watch Demo
            </button>
          </div>
        </div>

        {/* floating preview cards */}
        <div className="relative hidden lg:block h-full min-h-[420px]">
          {[
            { Icon: Sparkles, title: "AI Caption", body: "5 hooks generated · 92% virality", top: "8%",  left: "10%", rot: "-6deg",  delay: 0   },
            { Icon: Bot,      title: "Trend Hunter", body: "3 new opportunities · Instagram",   top: "38%", left: "32%", rot: "3deg",   delay: 0.2 },
            { Icon: Wand2,    title: "Visual Studio", body: "Carousel · 10 slides ready",        top: "16%", left: "52%", rot: "8deg",   delay: 0.4 },
            { Icon: BarChart3,title: "Analytics",     body: "Reach +28% this week",              top: "58%", left: "5%",  rot: "-3deg",  delay: 0.6 },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: parseFloat(c.rot) }}
              transition={{ duration: 0.7, delay: c.delay }}
              style={{ top: c.top, left: c.left }}
              className="absolute w-56 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/15 p-3 shadow-elevated edge-glow"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
                  <c.Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold">{c.title}</span>
              </div>
              <p className="text-[11px] text-white/60">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="relative mt-auto text-xs text-white/40 tracking-wider">SCROLL TO BEGIN ↓</p>
    </FlowSection>
  );
}
