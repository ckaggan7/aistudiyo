import { motion } from "framer-motion";
import { Workflow, PenLine, MessageSquare, Megaphone, Users, BarChart3, Bot, Coins } from "lucide-react";
import { GlowCard } from "@/components/brand/GlowCard";

const cards = [
  { icon: Workflow, title: "AI Automation Engine", desc: "Build workflows that think, route, and act across your entire stack.", stat: "120+ triggers" },
  { icon: PenLine, title: "AI Content Studio", desc: "Captions, scripts, hooks, ads — generated in your brand voice.", stat: "50+ formats" },
  { icon: MessageSquare, title: "WhatsApp AI OS", desc: "Broadcast, automate, and respond on WhatsApp with native AI.", stat: "98% delivery" },
  { icon: Megaphone, title: "AI Campaign Builder", desc: "Multi-channel campaigns with AI targeting and creative.", stat: "10x ROAS" },
  { icon: Users, title: "AI Community Engine", desc: "Grow loyal communities with AI-driven moderation and insights.", stat: "Realtime" },
  { icon: BarChart3, title: "AI Analytics Intelligence", desc: "Predictive metrics, anomaly detection, and revenue forecasts.", stat: "Live signals" },
  { icon: Bot, title: "AI Agent Marketplace", desc: "Hire specialized AI agents trained for your business domain.", stat: "200+ agents" },
  { icon: Coins, title: "Creator Monetization Stack", desc: "Subscriptions, payments, drops — built for AI-native creators.", stat: "Stripe-ready" },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }) };

export function EcosystemGrid() {
  return (
    <section id="platform" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The Ecosystem</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-3">One platform. Every AI capability.</h2>
          <p className="text-muted-foreground mt-4">A unified surface for the eight pillars of AI growth — automation, content, conversations, campaigns, community, analytics, agents, and money.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <motion.div key={c.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} custom={i}>
              <GlowCard className="h-full">
                <div className="flex items-start justify-between mb-5">
                  <span className="w-11 h-11 rounded-2xl bg-gradient-orange shadow-orange-glow inline-flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-white" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">{c.stat}</span>
                </div>
                <h3 className="font-display text-base font-semibold mb-1.5">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
