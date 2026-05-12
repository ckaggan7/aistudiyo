export default function DifficultyChip({ level }: { level: string }) {
  const tone = level === "Beginner" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : level === "Intermediate" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tone}`}>{level}</span>;
}
