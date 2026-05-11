import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  padded?: boolean;
};

/**
 * FloatingPanel — premium glass surface used across the app for sections,
 * cards, and panels. Consistent radius, border, blur and shadow.
 */
export const FloatingPanel = React.forwardRef<HTMLDivElement, Props>(
  ({ className, interactive, padded = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl surface-floating",
        padded && "p-5",
        interactive && "hover-lift cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
FloatingPanel.displayName = "FloatingPanel";
