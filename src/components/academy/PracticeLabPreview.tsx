import { Link } from "react-router-dom";
import { FlaskConical, ArrowRight } from "lucide-react";
export default function PracticeLabPreview() {
  return (
    <Link to="/dashboard/academy/practice-lab" className="block rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-fuchsia-500/15 via-violet-500/15 to-indigo-500/15 hover:border-white/30 transition-all">
      <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center"><FlaskConical className="w-5 h-5 text-white" /></div><div className="flex-1"><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Practice Lab</p><p className="text-base font-semibold text-white">Score your ad copy in seconds</p></div><ArrowRight className="w-4 h-4 text-white/60" /></div>
      <p className="mt-3 text-sm text-white/70">Paste a hook or caption. AI scores hook quality, CTR, readability, engagement, and platform fit — and gives you a sharper rewrite.</p>
    </Link>
  );
}
