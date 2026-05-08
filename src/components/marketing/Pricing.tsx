import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { GlowCard } from "@/components/brand/GlowCard";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    desc: "Explore the AI ecosystem.",
    features: ["500 AI credits", "1 workspace", "Content Studio", "Basic analytics", "Community access"],
    cta: "Start free",
  },
  {
    name: "Growth",
    price: "$49",
    period: "/mo",
    desc: "For founders & creators scaling fast.",
    features: ["50,000 AI credits", "5 workspaces", "WhatsApp Engine", "AI Agents (5)", "Automation workflows", "Priority support"],
    cta: "Start Growth",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For teams operating at scale.",
    features: ["Unlimited credits", "Unlimited seats", "Dedicated AI agents", "SSO + SAML", "SLA & uptime", "Dedicated success"],
    cta: "Book a demo",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pricing</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-3">Simple plans. Cinematic value.</h2>
          <p className="text-muted-foreground mt-4">Start free, upgrade when your AI workflows demand more horsepower.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <GlowCard key={t.name} className={cn(
              "relative h-full flex flex-col !p-8",
              t.highlighted && "shadow-orange-glow"
            )}>
              {t.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-orange text-white shadow-orange-glow">
                  <Sparkles className="w-3 h-3" /> Recommended
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.name}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl md:text-5xl font-bold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{t.desc}</p>

              <ul className="space-y-3 mt-7 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="w-4 h-4 rounded-full bg-primary/15 text-primary inline-flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className={cn(
                "mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-sm transition-all hover:-translate-y-0.5",
                t.highlighted
                  ? "bg-gradient-orange text-white shadow-orange-glow"
                  : "border border-border bg-secondary/40 hover:bg-secondary/70"
              )}>
                {t.cta}
              </Link>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
