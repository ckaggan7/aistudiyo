import { Link } from "react-router-dom";
import { Lock, BadgeCheck } from "lucide-react";
import { CERTIFICATES } from "@/lib/academy/certificates";
import { useXp } from "@/lib/academy/progress";
export default function CertificationsShowcase() {
  const { xp } = useXp();
  return (
    <section className="px-6 md:px-12 pb-14">
      <div className="flex items-end justify-between mb-6"><div><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Certifications</p><h2 className="text-3xl md:text-4xl font-bold tracking-tight">Earn the badge. Show the work.</h2></div><span className="text-[12px] text-white/50">Your XP: <b className="text-white">{xp}</b></span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {CERTIFICATES.map((c) => { const unlocked = xp >= c.xpRequired; return (
          <Link key={c.id} to={`/dashboard/academy/certificate/${c.id}`} className={`group relative rounded-2xl p-5 overflow-hidden border ${unlocked ? "border-white/20" : "border-white/10"} bg-white/[0.04]`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.color} ${unlocked ? "opacity-25" : "opacity-10"} transition-opacity group-hover:opacity-40`} />
            <div className="relative">
              <div className="text-3xl">{c.emoji}</div>
              <h3 className="mt-3 text-base font-semibold text-white leading-tight">{c.name}</h3>
              <p className="mt-1 text-[12px] text-white/60 leading-snug line-clamp-2">{c.tagline}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">{unlocked ? (<span className="inline-flex items-center gap-1 text-emerald-300"><BadgeCheck className="w-3.5 h-3.5" /> Unlocked</span>) : (<span className="inline-flex items-center gap-1 text-white/50"><Lock className="w-3 h-3" /> {c.xpRequired} XP</span>)}</div>
            </div>
          </Link>
        );})}
      </div>
    </section>
  );
}
