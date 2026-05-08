import { motion } from "framer-motion";

type DoodleProps = { className?: string };

// Hand-drawn squiggle line
export const Squiggle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 120 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M2 10 Q 15 0, 30 10 T 60 10 T 90 10 T 118 10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    />
  </svg>
);

// Star burst sparkle
export const StarDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z"
      fill="currentColor"
      initial={{ scale: 0, rotate: 0 }}
      whileInView={{ scale: 1, rotate: 180 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring" }}
    />
  </svg>
);

// Hand-drawn circle
export const CircleDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M50 8 C 70 8, 92 25, 92 50 C 92 75, 72 92, 50 92 C 28 92, 8 72, 8 50 C 8 28, 28 10, 50 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </svg>
);

// Underline scribble
export const Underline = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 200 12" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M3 6 C 40 1, 80 11, 120 5 S 180 9, 197 6"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
    />
  </svg>
);

// Arrow doodle
export const ArrowDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 80 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M5 30 Q 25 5, 60 25"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    <motion.path
      d="M50 18 L 62 25 L 55 38"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.8 }}
    />
  </svg>
);

// Heart doodle
export const HeartDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 40 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M20 32 C 20 32, 4 22, 4 12 C 4 6, 9 3, 13 3 C 16 3, 19 5, 20 8 C 21 5, 24 3, 27 3 C 31 3, 36 6, 36 12 C 36 22, 20 32, 20 32 Z"
      fill="currentColor"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring" }}
    />
  </svg>
);

// Dotted spiral
export const SpiralDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 60 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M30 30 m -2 0 a 2 2 0 1 1 4 0 a 4 4 0 1 1 -8 0 a 6 6 0 1 1 12 0 a 8 8 0 1 1 -16 0 a 10 10 0 1 1 20 0 a 12 12 0 1 1 -24 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="2 4"
      fill="none"
      initial={{ pathLength: 0, rotate: 0 }}
      whileInView={{ pathLength: 1 }}
      animate={{ rotate: 360 }}
      viewport={{ once: true }}
      transition={{ pathLength: { duration: 2 }, rotate: { duration: 30, repeat: Infinity, ease: "linear" } }}
    />
  </svg>
);

// Triangle dots
export const DotsTriangle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 50 45" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {[
      [25, 5], [15, 22], [35, 22], [5, 40], [25, 40], [45, 40]
    ].map(([cx, cy], i) => (
      <motion.circle
        key={i}
        cx={cx}
        cy={cy}
        r="3"
        fill="currentColor"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.08, type: "spring" }}
      />
    ))}
  </svg>
);

// Wavy zigzag
export const ZigzagDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 100 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M3 17 L 17 3 L 30 17 L 44 3 L 57 17 L 71 3 L 84 17 L 97 3"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
    />
  </svg>
);

// Burst lines
export const BurstDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 60 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 30 + Math.cos(rad) * 12;
      const y1 = 30 + Math.sin(rad) * 12;
      const x2 = 30 + Math.cos(rad) * 26;
      const y2 = 30 + Math.sin(rad) * 26;
      return (
        <motion.line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
        />
      );
    })}
  </svg>
);
