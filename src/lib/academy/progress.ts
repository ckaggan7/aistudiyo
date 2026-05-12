import { useCallback, useEffect, useState } from "react";

const KEYS = { xp: "academy.xp.v1", completions: "academy.completions.v1", claimed: "academy.missions.claimed.v1" };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = window.localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

export function useXp() {
  const [xp, setXp] = useState<number>(() => read<number>(KEYS.xp, 320));
  useEffect(() => { write(KEYS.xp, xp); }, [xp]);
  const addXp = useCallback((delta: number) => setXp((v) => Math.max(0, v + delta)), []);
  return { xp, addXp, setXp };
}

export function useCompletions() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() =>
    read<Record<string, boolean>>(KEYS.completions, { "ai-ads-fundamentals:l1": true, "ai-ads-fundamentals:l2": true, "viral-hook-psychology:l1": true }));
  useEffect(() => { write(KEYS.completions, completed); }, [completed]);
  const toggle = useCallback((key: string, value?: boolean) => {
    setCompleted((c) => ({ ...c, [key]: value ?? !c[key] }));
  }, []);
  return { completed, toggle };
}

export function useClaimedMissions() {
  const [claimed, setClaimed] = useState<Record<string, boolean>>(() => read(KEYS.claimed, {}));
  useEffect(() => { write(KEYS.claimed, claimed); }, [claimed]);
  const claim = useCallback((id: string) => setClaimed((c) => ({ ...c, [id]: true })), []);
  return { claimed, claim };
}

export function levelForXp(xp: number) {
  const level = Math.floor(xp / 500) + 1;
  const into = xp % 500;
  return { level, into, nextAt: 500, pct: into / 500 };
}

export function trackProgress(courseIds: string[], completed: Record<string, boolean>, courses: { id: string; lessons: { id: string }[] }[]) {
  let total = 0, done = 0;
  for (const cid of courseIds) {
    const c = courses.find((x) => x.id === cid);
    if (!c) continue;
    total += c.lessons.length;
    done += c.lessons.filter((l) => completed[`${cid}:${l.id}`]).length;
  }
  return total ? done / total : 0;
}
