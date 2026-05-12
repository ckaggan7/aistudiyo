import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MISSIONS } from "@/lib/academy/missions";
import XpBadge from "./XpBadge";

export default function MissionRail() {
  const items = MISSIONS.slice(0, 4);
  return (
    <section className="px-6 md:px-12 pb-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Recommended missions</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pick a mission, level up.</h2>
        </div>
        <Link to="/dashboard/academy/missions" className="text-[12px] text-white/60 hover:text-white">All missions →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((m) => (
          <Link key={m.id} to={m.to} className="group rounded-2xl p-4 border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">{m.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">{m.title}</p>
                <p className="text-[12px] text-white/55 mt-0.5 line-clamp-2">{m.blurb}</p>
              </div>
              <XpBadge xp={m.xp} />
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[12px] text-white/70 group-hover:text-white">
              {m.cta} <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
