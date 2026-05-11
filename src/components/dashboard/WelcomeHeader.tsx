import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <h1 className="text-display-xl">
          Welcome, <span className="capitalize">{name}</span>
        </h1>
        <div className="h-6 mt-2 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm md:text-base text-muted-foreground"
            >
              {SUBTITLES[idx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
