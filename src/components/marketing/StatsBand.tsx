import { AnimatedCounter } from "@/components/brand/AnimatedCounter";
import { OrangeOrb } from "@/components/brand/OrangeOrb";

const stats = [
  { v: 12, suffix: "M+", label: "AI Tasks Generated" },
  { v: 500, suffix: "K+", label: "Active Users" },
  { v: 98, suffix: "%", label: "Automation Accuracy" },
  { v: 120, suffix: "+", label: "Integrations" },
  { v: 49, suffix: "/50", label: "User Rating" },
  { v: 2, suffix: "M+", label: "Messages Delivered" },
];

export function StatsBand() {
  return (
    <section id="usecases" className="relative py-20 md:py-28 overflow-hidden">
      <OrangeOrb className="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" size={680} />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="glass-strong rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl md:text-4xl font-bold tracking-tight text-gradient-orange">
                <AnimatedCounter to={s.v} suffix={s.suffix} />
              </p>
              <p className="text-xs text-muted-foreground mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
