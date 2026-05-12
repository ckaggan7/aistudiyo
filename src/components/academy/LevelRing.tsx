export default function LevelRing({ value, size = 56, stroke = 5, color = "hsl(22 100% 60%)", trackColor = "rgba(255,255,255,0.12)", label }: { value: number; size?: number; stroke?: number; color?: string; trackColor?: string; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <span className="absolute text-[11px] font-semibold text-white/90">{label ?? `${Math.round(value * 100)}%`}</span>
    </div>
  );
}
