import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const SUBTITLES = [
  "Your next viral post starts here.",
  "Let's build something engaging today.",
  "AI is ready to create with you.",
  "Trending opportunities detected today.",
];

export default function WelcomeHeader() {
  const { user } = useAuth();
  const name =
    (user?.user_metadata?.full_name as string) ||
    user?.email?.split("@")[0] ||
    "creator";

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SUBTITLES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-5"
    >
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
        Welcome, <span className="capitalize">{name}</span>
      </h1>
      <p className="text-sm text-muted-foreground mt-0.5">Good to see you, creator.</p>
      <div className="h-5 mt-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ y: 4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -4, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs md:text-sm text-primary/90 font-medium"
          >
            {SUBTITLES[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
