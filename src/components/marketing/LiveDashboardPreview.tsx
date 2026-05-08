import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Cpu, Bell, Sparkles } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Line, LineChart } from "recharts";
import { GlowCard } from "@/components/brand/GlowCard";
import { OrangeOrb } from "@/components/brand/OrangeOrb";

const revenue = Array.from({ length: 12 }, (_, i) => ({ x: `M${i+1}`, v: 1200 + Math.round(Math.sin(i/2) * 400 + i * 180) }));
const ai = Array.from({ length: 12 }, (_, i) => ({ x: i, a: 30 + Math.round(Math.cos(i/3) * 20 + i * 4), b: 20 + Math.round(Math.sin(i/2) * 15 + i * 3) }));

const benefits = [
  "Realtime AI activity across every workflow",
  "Predictive revenue and engagement forecasts",
  "Notification stack that surfaces what matters",
  "Smart assistant trained on your workspace",
];

export function LiveDashboardPreview() {
  return (
    <section id="solutions" className="relative py-24 md:py-32 overflow-hidden">
      <OrangeOrb className="-left-40 top-20" size={500} />

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live Experience</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-3">A cinematic AI control center.</h2>
          <p className="text-muted-foreground mt-4 max-w-lg">
            See every signal, agent, and workflow in one floating cockpit. AISTUDIYO turns scattered tools into one calm, intelligent surface.
          </p>
          <ul className="mt-7 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
          <Link to="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-orange text-white font-semibold text-sm shadow-orange-glow hover:-translate-y-0.5 transition-all">
            See it in motion <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative">
          <GlowCard className="!p-5">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-2xl bg-secondary/40 border border-border/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Revenue</span>
                  <span className="text-[10px] text-emerald-500 font-medium">+24.8%</span>
                </div>
                <p className="font-display font-bold text-2xl">$184.2k</p>
                <div className="h-12 -mx-1 mt-1">
                  <ResponsiveContainer><AreaChart data={revenue}>
                    <defs>
                      <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <Area dataKey="v" stroke="hsl(var(--primary))" fill="url(#rev)" strokeWidth={2} />
                  </AreaChart></ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl bg-secondary/40 border border-border/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Engagement</span>
                  <span className="text-[10px] text-emerald-500 font-medium">+12%</span>
                </div>
                <p className="font-display font-bold text-2xl">94.1%</p>
                <div className="h-12 -mx-1 mt-1">
                  <ResponsiveContainer><LineChart data={ai}>
                    <Line dataKey="a" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    <Line dataKey="b" stroke="hsl(var(--primary-glow))" strokeWidth={2} dot={false} strokeOpacity={0.6} />
                  </LineChart></ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-secondary/40 border border-border/40 p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Activity Timeline</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-primary font-medium">
                  <span className="relative w-1.5 h-1.5 rounded-full bg-primary"><span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" /></span>
                  Live
                </span>
              </div>
              <div className="h-28">
                <ResponsiveContainer><AreaChart data={ai}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="x" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 11 }} />
                  <defs>
                    <linearGradient id="actA" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <Area dataKey="a" stroke="hsl(var(--primary))" fill="url(#actA)" strokeWidth={2} />
                </AreaChart></ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { icon: Sparkles, t: "Generated 24 captions for Summer Drop", time: "2m" },
                { icon: Cpu, t: "Marketing AI agent completed run #482", time: "5m" },
                { icon: Bell, t: "Campaign 'Black Friday' launched", time: "9m" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/30 border border-border/30 px-3 py-2">
                  <span className="w-7 h-7 rounded-lg bg-gradient-orange flex items-center justify-center"><r.icon className="w-3.5 h-3.5 text-white" /></span>
                  <p className="text-xs flex-1">{r.t}</p>
                  <span className="text-[10px] text-muted-foreground">{r.time}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </section>
  );
}
