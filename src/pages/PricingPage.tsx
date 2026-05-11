import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";

const PLANS = [
  {
    name: "Creator",
    price: "$0",
    cadence: "forever",
    tagline: "Start creating with AI — no card required.",
    cta: "Start free",
    to: "/signup",
    highlight: false,
    features: [
      "30 AI generations / mo",
      "Captions, hooks, hashtags",
      "1 brand voice",
      "Community templates",
    ],
  },
  {
    name: "Pro Creator",
    price: "$19",
    cadence: "per month",
    tagline: "For creators shipping daily content.",
    cta: "Go Pro",
    to: "/signup",
    highlight: true,
    features: [
      "Unlimited captions & posts",
      "500 AI images / mo",
      "All AI agents",
      "Content calendar + auto-publish",
      "Trend intelligence",
    ],
  },
  {
    name: "Studio",
    price: "$49",
    cadence: "per month",
    tagline: "For small studios & power creators.",
    cta: "Get Studio",
    to: "/signup",
    highlight: false,
    features: [
      "Everything in Pro",
      "3 workspaces",
      "Unlimited AI images",
      "Priority models",
      "Custom brand voices",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F5]">
      <LandingHeader />

      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[520px]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(ellipse, rgba(255,122,26,0.16), transparent 65%)" }}
        />
      </div>

      <main className="relative pt-32 pb-24 px-5 md:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[hsl(22_100%_60%)] bg-[hsl(22_100%_55%)]/10 border border-[hsl(22_100%_55%)]/20 rounded-full px-3 py-1">
            <Sparkles className="w-3 h-3" /> Pricing
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight leading-[1.05]">
            Simple pricing for creators
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#A1A1AA] leading-relaxed">
            One plan to start. Upgrade when you're ready to scale. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? "border border-[hsl(22_100%_55%)]/30 bg-gradient-to-b from-[hsl(22_100%_55%)]/[0.06] to-white/[0.02]"
                  : "border border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-2.5 left-6 text-[10px] font-bold tracking-widest uppercase text-white bg-[hsl(22_100%_55%)] px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}

              <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
              <p className="text-xs text-[#A1A1AA] mt-1">{plan.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-[40px] font-bold tracking-tight leading-none">{plan.price}</span>
                <span className="text-xs text-[#A1A1AA]">{plan.cadence}</span>
              </div>

              <Link
                to={plan.to}
                className={`mt-5 h-10 inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-b from-[hsl(22_100%_60%)] to-[hsl(22_100%_50%)] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_4px_14px_-6px_rgba(255,122,26,0.4)] hover:brightness-110"
                    : "bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.07]"
                }`}
              >
                {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-[hsl(22_100%_60%)] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-[#A1A1AA] mt-10">
          All plans include secure storage, brand voice, and AI agents. Need a custom plan?{" "}
          <Link to="/contact" className="text-[hsl(22_100%_60%)] font-medium hover:underline">
            Talk to us
          </Link>
          .
        </p>
      </main>
    </div>
  );
}