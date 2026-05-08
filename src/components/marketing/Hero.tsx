import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Activity, MessageSquare, TrendingUp, Bot, Zap } from "lucide-react";
import { OrangeOrb } from "@/components/brand/OrangeOrb";
import { NeuralBackground } from "@/components/brand/NeuralBackground";
import { GlowCard } from "@/components/brand/GlowCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } }),
};

const floatingCards = [
  { icon: Sparkles, label: "AI Generated", value: "1,284 today", color: "from-orange-500 to-amber-400", delay: 0.6 },
  { icon: Activity, label: "Workflow Running", value: "12 active", color: "from-amber-500 to-orange-400", delay: 0.8 },
  { icon: MessageSquare, label: "WhatsApp Live", value: "98% delivered", color: "from-orange-600 to-red-500", delay: 1.0 },
  { icon: Bot, label: "AI Agent Active", value: "Marketing AI", color: "from-orange-500 to-amber-300", delay: 1.2 },
];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid mask-fade-y opacity-60" />
      <NeuralBackground className="opacity-50 mask-fade-y" />
      <OrangeOrb className="-top-20 -left-20" size={500} />
      <OrangeOrb className="top-40 right-0" size={420} />

      <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 backdrop-blur px-3 py-1.5 text-xs font-medium mb-6">
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary">
              <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
            </span>
            <span className="text-muted-foreground">The Operating System for AI Businesses</span>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Build the Future with{" "}
            <span className="text-gradient-orange">AI Intelligence</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            AISTUDIYO helps creators, founders, startups, and enterprises automate workflows, generate content, scale communities, launch AI systems, and dominate digital growth — all from one cinematic command center.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/signup"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-orange text-white font-semibold text-sm shadow-orange-glow hover:-translate-y-0.5 transition-all">
              Launch Workspace
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#platform"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 glass border border-border/80 font-semibold text-sm hover:bg-secondary/40 transition-colors">
              Explore Ecosystem
            </a>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary" /> Powered by Gemini · GPT</span>
            <span>·</span>
            <span className="inline-flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Trusted by 500k+ creators</span>
          </motion.div>
        </div>

        {/* Right — floating dashboard mock */}
        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative">
            <GlowCard className="!p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Command Center</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Revenue", v: "$84.2k", up: "+12%" },
                  { label: "AI Usage", v: "1.2M", up: "+38%" },
                  { label: "Engagement", v: "94%", up: "+4.1%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-secondary/40 p-3 border border-border/40">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    <p className="font-display font-semibold text-lg mt-0.5">{s.v}</p>
                    <p className="text-[10px] text-emerald-500 font-medium mt-0.5">{s.up}</p>
                  </div>
                ))}
              </div>

              {/* Fake area chart */}
              <div className="rounded-xl bg-gradient-to-br from-secondary/40 to-transparent border border-border/40 p-4 h-40 relative overflow-hidden">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">AI Activity · 7d</p>
                <svg viewBox="0 0 320 100" className="w-full h-24" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 75 L40 60 L80 65 L120 40 L160 50 L200 30 L240 35 L280 18 L320 22 L320 100 L0 100 Z" fill="url(#chartFill)" />
                  <path d="M0 75 L40 60 L80 65 L120 40 L160 50 L200 30 L240 35 L280 18 L320 22" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                </svg>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/40 border border-border/40 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-primary">
                    <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                  </span>
                  <span className="text-xs font-medium">AI workflow executing…</span>
                </div>
                <span className="text-[10px] text-muted-foreground">3 / 5 steps</span>
              </div>
            </GlowCard>

            {/* Floating mini cards */}
            {floatingCards.map((c, i) => (
              <motion.div key={c.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: c.delay, duration: 0.5 }}
                className={`absolute hidden md:flex items-center gap-2 px-3 py-2 rounded-xl glass-strong shadow-elevated text-xs font-medium animate-float-y`}
                style={{
                  top: ["8%", "62%", "20%", "78%"][i],
                  left: i % 2 ? "auto" : ["-8%", "auto", "-12%", "auto"][i],
                  right: i % 2 ? ["-8%", "auto", "-10%", "-6%"][i] : "auto",
                  animationDelay: `${i * 0.4}s`,
                }}>
                <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                  <c.icon className="w-3.5 h-3.5 text-white" />
                </span>
                <div>
                  <p className="leading-tight">{c.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{c.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
