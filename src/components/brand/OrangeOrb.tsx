import { cn } from "@/lib/utils";

export function OrangeOrb({ className, size = 480 }: { className?: string; size?: number }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl opacity-50 animate-glow-pulse", className)}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle, rgba(255,107,0,0.55) 0%, rgba(255,138,0,0.25) 35%, transparent 70%)",
      }}
    />
  );
}
