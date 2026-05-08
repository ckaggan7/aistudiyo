import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { OrangeOrb } from "@/components/brand/OrangeOrb";

export function FinalCTA() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <OrangeOrb className="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" size={780} />
      <div className="absolute inset-0 bg-grid mask-fade-y opacity-40" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          Your AI Operating System{" "}
          <span className="text-gradient-orange">Starts Here.</span>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
          Join thousands of founders, creators, and enterprises building the future on AISTUDIYO.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/signup"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-orange text-white font-semibold text-sm shadow-orange-glow hover:-translate-y-0.5 transition-all">
            Start Building <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 glass border border-border/80 font-semibold text-sm hover:bg-secondary/40 transition-colors">
            Book AI Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
