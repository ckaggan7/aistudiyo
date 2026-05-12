import { Link } from "react-router-dom";
import LevelRing from "./LevelRing";
import DifficultyChip from "./DifficultyChip";
import type { Track } from "@/lib/academy/tracks";
export default function TrackCard({ track, progress }: { track: Track; progress: number }) {
  const Icon = track.icon;
  return (
    <Link to={`/dashboard/academy/track/${track.id}`} className="group relative block rounded-2xl p-5 bg-white/[0.04] border border-white/10 hover:border-white/30 transition-all overflow-hidden">
      <div className={`absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br ${track.gradient} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity`} />
      <div className="relative flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center shadow-lg`}><Icon className="w-5 h-5 text-white" /></div>
        <LevelRing value={progress} size={48} color={track.accent} />
      </div>
      <div className="relative mt-4">
        <DifficultyChip level={track.level} />
        <h3 className="mt-2 text-lg font-semibold text-white leading-tight">{track.title}</h3>
        <p className="mt-1 text-[13px] text-white/60 leading-snug line-clamp-2">{track.blurb}</p>
        <p className="mt-3 text-[11px] text-white/40">{track.lessons} lessons</p>
      </div>
    </Link>
  );
}
