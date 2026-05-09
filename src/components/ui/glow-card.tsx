import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  glow?: "primary" | "subtle" | "none";
  interactive?: boolean;
};

/**
 * GlowCard — reusable surface with optional ambient glow + hover lift.
 * Uses semantic tokens only.
 */
export const GlowCard = React.forwardRef<HTMLDivElement, Props>(
  ({ className, glow = "subtle", interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl",
          "shadow-sm transition-all duration-300",
          interactive && "hover:-translate-y-0.5 hover:shadow-elevated hover:border-border",
          className,
        )}
        {...props}
      >
        {glow !== "none" && (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500",
              interactive && "group-hover:opacity-100",
              glow === "primary"
                ? "bg-gradient-to-br from-primary/20 via-transparent to-transparent"
                : "bg-gradient-to-br from-primary/5 via-transparent to-transparent",
            )}
          />
        )}
        <div className="relative">{children}</div>
      </div>
    );
  },
);
GlowCard.displayName = "GlowCard";