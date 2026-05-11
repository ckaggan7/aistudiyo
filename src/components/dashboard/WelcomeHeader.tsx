import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Eye, Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AIOrb from "./AIOrb";

const SUBTITLES = [
  "Your next viral post starts here.",
  "3 trends are rising today.",
  "AI found new creator opportunities.",
  "Three hooks are warming up in your queue.",
];

const SPARK = [38, 52, 41, 65, 48, 72, 58, 81, 67, 92, 78, 88];

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
      className="bento-hero"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
        {/* Left: copy + chips */}
        <div className="md:col-span-3">
          <span className="chip mb-4 bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3 h-3" /> AI creator playground
          </span>
          <h1 className="text-display-xl">
            Welcome, <span className="capitalize text-gradient-hero">{name}</span>
          </h1>
          <div className="h-6 mt-3 relative overflow-hidden">
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

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <StatChip icon={Flame} label="Streak" value="7d" tone="orange" />
            <StatChip icon={Eye} label="Reach" value="+18%" tone="emerald" />
            <StatChip icon={Sparkles} label="Credits" value="142" tone="violet" />
            <StatChip icon={TrendingUp} label="Posts" value="23" tone="blue" />
          </div>
        </div>

        {/* Right: AI orb + sparkline */}
        <div className="md:col-span-2 relative flex items-center justify-center min-h-[200px]">
          <div className="absolute inset-0 flex items-end gap-1 opacity-30 px-2 pb-2 pointer-events-none">
            {SPARK.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/60 to-primary/10"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="relative">
            <AIOrb size={180} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

const TONES: Record<string, string> = {
  orange:  "bg-orange-50 text-orange-700 border-orange-200/60",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  violet:  "bg-violet-50 text-violet-700 border-violet-200/60",
  blue:    "bg-sky-50 text-sky-700 border-sky-200/60",
};

function StatChip({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: keyof typeof TONES }) {
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-full border ${TONES[tone]}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-medium opacity-80">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
