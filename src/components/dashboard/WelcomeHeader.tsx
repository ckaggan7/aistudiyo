import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import AIOrb from "./AIOrb";

const SUBTITLES = [
  "Your next viral post starts here.",
  "3 trends are rising today.",
  "AI found new creator opportunities.",
  "Three hooks are warming up in your queue.",
];

type Stat = { label: string; value: string; suffix?: string; suffixTone?: string };
const STATS: Stat[] = [
  { label: "Streak",  value: "7",   suffix: "days",  suffixTone: "text-primary" },
  { label: "Reach",   value: "45.2k", suffix: "+18%", suffixTone: "text-emerald-500" },
  { label: "Credits", value: "142" },
  { label: "Posts",   value: "23" },
];

export default function WelcomeHeader() {
  const { user } = useAuth();
  const name =
    (user?.user_metadata?.full_name as string)?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "creator";

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SUBTITLES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bento-hero !p-6 md:!p-10"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10 relative">
        {/* Left: copy + stat cards */}
        <div className="flex-1 w-full space-y-8 z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-border rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                AI creator playground
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.02]">
              Welcome,{" "}
              <span className="capitalize text-gradient-hero">{name}</span>
            </h1>

            <div className="h-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={idx}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-base text-muted-foreground"
                >
                  {SUBTITLES[idx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="min-w-0 bg-white p-4 rounded-2xl border border-border/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                  {s.label}
                </p>
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-bold text-foreground leading-none">{s.value}</span>
                  {s.suffix && (
                    <span className={`text-xs font-semibold mb-0.5 ${s.suffixTone ?? "text-muted-foreground"}`}>
                      {s.suffix}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI orb */}
        <div className="relative flex items-center justify-center w-52 h-52 lg:w-64 lg:h-64 shrink-0">
          <div className="absolute inset-0 bg-primary/25 blur-[90px] rounded-full pointer-events-none" />
          <AIOrb size={220} />
        </div>
      </div>
    </motion.section>
  );
}
