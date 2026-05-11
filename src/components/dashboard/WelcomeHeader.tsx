import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Eye, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const SUBTITLES = [
  "Your next viral post starts here.",
  "AI found new trends today.",
  "Let's create something engaging.",
  "Three hooks are warming up in your queue.",
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
    <motion.header
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-display">
          Welcome, <span className="capitalize">{name}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Good to see you, creator.</p>
        <div className="h-5 mt-1.5 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs md:text-sm bg-gradient-hero bg-clip-text text-transparent font-medium"
            >
              {SUBTITLES[idx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Chip icon={Flame}    label="Streak"  value="7d"   accent="text-orange-400" />
        <Chip icon={Eye}      label="Reach"   value="+18%" accent="text-emerald-400" />
        <Chip icon={Sparkles} label="Credits" value="142"  accent="text-primary" />
      </div>
    </motion.header>
  );
}

function Chip({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="surface-floating rounded-xl px-3 py-2 flex items-center gap-2">
      <Icon className={`w-3.5 h-3.5 ${accent}`} />
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xs font-semibold">{value}</p>
      </div>
    </div>
  );
}
