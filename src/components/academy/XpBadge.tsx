import { Zap } from "lucide-react";
export default function XpBadge({ xp, className = "" }: { xp: number; className?: string }) {
  return <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-200 ${className}`}><Zap className="w-3 h-3" /> {xp} XP</span>;
}
