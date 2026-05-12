import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { MISSIONS, LEADERBOARD } from "@/lib/academy/missions";
import { useClaimedMissions, useXp } from "@/lib/academy/progress";
import XpBadge from "./XpBadge";
import { toast } from "sonner";
export default function CreatorMissions({ compact = false }: { compact?: boolean }) {
  const { claimed, claim } = useClaimedMissions();
  const { addXp } = useXp();
  const missions = compact ? MISSIONS.slice(0, 3) : MISSIONS;
  const handleClaim = (id: string, xp: number) => { if (claimed[id]) return; claim(id); addXp(xp); toast.success(`+${xp} XP — mission claimed!`); };
  return (
    <section className="px-6 md:px-12 pb-14">
      <div className="flex items-end justify-between mb-6"><div><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Creator missions</p><h2 className="text-3xl md:text-4xl font-bold tracking-tight">Stack XP. Unlock perks.</h2></div>{compact && <Link to="/dashboard/academy/missions" className="text-[12px] text-white/60 hover:text-white">All missions →</Link>}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {missions.map((m) => { const isClaimed = claimed[m.id]; return (
            <div key={m.id} className="rounded-2xl p-4 border border-white/10 bg-white/[0.04]">
              <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">{m.emoji}</div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white leading-tight">{m.title}</p><p className="text-[12px] text-white/55 mt-0.5 line-clamp-2">{m.blurb}</p></div><XpBadge xp={m.xp} /></div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-orange-500 to-pink-500" style={{ width: `${Math.round((isClaimed ? 1 : m.progress) * 100)}%` }} /></div>
              <div className="mt-3 flex items-center justify-between"><Link to={m.to} className="text-[12px] text-white/70 hover:text-white">{m.cta} →</Link><button onClick={() => handleClaim(m.id, m.xp)} disabled={isClaimed} className="text-[11px] px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold disabled:opacity-40">{isClaimed ? "Claimed" : "Claim"}</button></div>
            </div>
          );})}
        </div>
        <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.04]">
          <div className="flex items-center gap-2 mb-4"><Trophy className="w-4 h-4 text-amber-300" /><p className="text-sm font-semibold text-white">Leaderboard</p></div>
          <div className="space-y-2">{LEADERBOARD.map((row) => (<div key={row.rank} className="flex items-center gap-3 text-sm"><span className="w-6 text-center">{row.emoji}</span><span className="flex-1 text-white/90">{row.name}</span><span className="text-[11px] text-white/50">{row.xp.toLocaleString()} XP</span></div>))}</div>
        </div>
      </div>
    </section>
  );
}
