export type LevelTier = {
  level: number;
  name: string;
  min: number;
  next: number | null;
  color: string;
};

const TIERS: { level: number; name: string; min: number; color: string }[] = [
  { level: 1, name: "Beginner Creator", min: 0,    color: "hsl(38 95% 60%)" },
  { level: 2, name: "Growth Creator",   min: 500,  color: "hsl(20 90% 60%)" },
  { level: 3, name: "AI Strategist",    min: 1500, color: "hsl(330 85% 65%)" },
  { level: 4, name: "Viral Creator",    min: 3500, color: "hsl(280 85% 65%)" },
  { level: 5, name: "AI Growth Master", min: 7500, color: "hsl(200 95% 60%)" },
];

export function tierForXp(xp: number): LevelTier {
  let current = TIERS[0];
  for (const t of TIERS) if (xp >= t.min) current = t;
  const next = TIERS.find((t) => t.min > xp);
  return { level: current.level, name: current.name, min: current.min, next: next?.min ?? null, color: current.color };
}

export function tierProgress(xp: number) {
  const t = tierForXp(xp);
  if (t.next == null) return { pct: 1, into: xp - t.min, total: 0 };
  const total = t.next - t.min;
  const into = Math.max(0, xp - t.min);
  return { pct: Math.min(1, into / total), into, total };
}
