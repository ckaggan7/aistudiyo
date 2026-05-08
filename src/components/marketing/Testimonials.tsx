import { Star } from "lucide-react";
import { GlowCard } from "@/components/brand/GlowCard";

const reviews = [
  {
    quote: "AISTUDIYO replaced 6 tools in our stack. Our team ships 4x faster, and the AI agents do work that used to take a whole pod.",
    name: "Maya Chen",
    role: "Founder, Northwave",
    avatar: "MC",
  },
  {
    quote: "The WhatsApp engine alone is a game changer. We launched a campaign on Friday and closed $42k in 48 hours.",
    name: "Aarav Kapoor",
    role: "Growth Lead, Studio11",
    avatar: "AK",
  },
  {
    quote: "It feels like a real operating system, not a SaaS. Cinematic, fast, and the agents actually understand my brand voice.",
    name: "Léa Dubois",
    role: "Creator · 1.2M",
    avatar: "LD",
  },
];

const logos = ["Northwave", "Studio11", "Aurora", "Heliox", "Vertex", "Quanta"];

export function Testimonials() {
  return (
    <section id="community" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Community</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-3">Loved by founders, creators, and AI-native teams.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {reviews.map((r) => (
            <GlowCard key={r.name} className="h-full flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />)}
              </div>
              <p className="text-sm leading-relaxed flex-1">"{r.quote}"</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/40">
                <span className="w-9 h-9 rounded-full bg-gradient-orange text-white text-xs font-bold flex items-center justify-center">{r.avatar}</span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
          {logos.map((l) => (
            <span key={l} className="font-display font-semibold tracking-tight text-lg text-muted-foreground">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
