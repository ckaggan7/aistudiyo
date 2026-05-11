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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Welcome, <span className="text-gradient-hero capitalize">{name}</span>
      </h1>
      <p className="text-sm text-muted-foreground mt-1">Good to see you, creator.</p>
      <div className="h-5 mt-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="text-xs md:text-sm text-primary/90 font-medium"
          >
            {SUBTITLES[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
