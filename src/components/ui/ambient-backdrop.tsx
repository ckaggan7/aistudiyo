import { cn } from "@/lib/utils";

/**
 * Cinematic ambient gradient backdrop — soft blurred orbs.
 * Sits fixed behind app chrome; pointer-events-none.
 */
export function AmbientBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute -top-32 -left-32 h-[42rem] w-[42rem] rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary)), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[38rem] w-[38rem] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--accent)), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 left-1/3 h-[34rem] w-[34rem] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary-glow)), transparent 70%)" }}
      />
    </div>
  );
}
