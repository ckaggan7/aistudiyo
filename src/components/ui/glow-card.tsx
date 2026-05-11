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
          "relative rounded-2xl border border-border/40 bg-card/95 backdrop-blur-sm",
          "shadow-sm transition-colors duration-200",
          interactive && "hover:border-border hover:shadow-md",
          className,
        )}
        {...props}
      >
        {glow === "primary" && (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500",
              interactive && "group-hover:opacity-100",
              "bg-gradient-to-br from-primary/15 via-transparent to-transparent",
            )}
          />
        )}
        <div className="relative">{children}</div>
      </div>
    );
  },
);
GlowCard.displayName = "GlowCard";