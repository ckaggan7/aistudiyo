import { Link, useLocation } from "react-router-dom";
import { Home, Brain, Bot, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { icon: Home,       label: "Home",    path: "/dashboard" },
  { icon: Brain,      label: "Studio",  path: "/dashboard/studio" },
  { icon: Bot,        label: "Agents",  path: "/dashboard/agents" },
  { icon: GraduationCap, label: "Academy", path: "/dashboard/academy" },
  { icon: User,       label: "Profile", path: "/dashboard/settings" },
];

export default function MobileDock() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 lg:hidden">
      <div className="flex items-center gap-1 bg-white/85 backdrop-blur-xl border border-border/70 rounded-full shadow-lg px-2 py-1.5">
        {ITEMS.map((it) => {
          const active = it.path === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(it.path);
          return (
            <Link
              key={it.path}
              to={it.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <it.icon className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
