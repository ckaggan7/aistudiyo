import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2 group", className)}>
      <span className="relative inline-flex w-8 h-8 rounded-xl bg-gradient-orange shadow-orange-glow items-center justify-center overflow-hidden">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_60%)]" />
        <span className="relative font-display font-bold text-white text-sm tracking-tight">A</span>
      </span>
      <span className="font-display font-bold tracking-tight text-foreground text-base">
        AI<span className="text-gradient-orange">STUDIYO</span>
      </span>
    </Link>
  );
}
