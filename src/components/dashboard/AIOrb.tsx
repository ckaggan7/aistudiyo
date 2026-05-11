import { motion } from "framer-motion";

/** Floating gradient AI orb with live activity pings. */
export default function AIOrb({ size = 160 }: { size?: number }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* outer pulse rings */}
      <span
        className="absolute inset-0 rounded-full border border-primary/30 pulse-ring"
        aria-hidden
      />
      <span
        className="absolute inset-0 rounded-full border border-primary/20 pulse-ring"
        style={{ animationDelay: "1.2s" }}
        aria-hidden
      />

      {/* spinning conic backdrop */}
      <motion.div
        className="absolute inset-2 rounded-full opacity-70 blur-2xl"
        style={{ background: "conic-gradient(from 0deg, hsl(22 100% 60%), hsl(330 85% 70%), hsl(265 85% 70%), hsl(22 100% 60%))" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* main orb */}
      <motion.div
        className="ai-orb float-y shadow-glow"
        style={{ width: size * 0.7, height: size * 0.7 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />

      {/* live dot */}
      <span className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full border border-emerald-200/60">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        live
      </span>
    </div>
  );
}