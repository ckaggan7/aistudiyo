import { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

export const GlowCard = forwardRef<HTMLDivElement, Props>(({ className, children, onMouseMove, ...rest }, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node!);
        else if (ref) (ref as any).current = node;
      }}
      className={cn(
        "relative rounded-3xl glass cursor-glow glow-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        className
      )}
      onMouseMove={(e) => {
        const el = innerRef.current;
        if (el) {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--x", `${e.clientX - r.left}px`);
          el.style.setProperty("--y", `${e.clientY - r.top}px`);
        }
        onMouseMove?.(e);
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
GlowCard.displayName = "GlowCard";
