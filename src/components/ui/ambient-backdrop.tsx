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
        className="absolute -top-40 -right-32 h-[36rem] w-[36rem] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary)), transparent 70%)" }}
      />
    </div>
  );
}
