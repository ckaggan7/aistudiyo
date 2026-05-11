import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export type QuickAction = {
  label: string;
  icon: LucideIcon;
  to?: string;
  onClick?: () => void;
};

export function AdminQuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => {
        const inner = (
          <>
            <a.icon className="w-3.5 h-3.5" /> {a.label}
          </>
        );
        if (a.to) {
          return (
            <Button key={a.label} asChild variant="outline" size="sm" className="gap-1.5">
              <Link to={a.to}>{inner}</Link>
            </Button>
          );
        }
        return (
          <Button key={a.label} variant="outline" size="sm" className="gap-1.5" onClick={a.onClick}>
            {inner}
          </Button>
        );
      })}
    </div>
  );
}