import { NavLink } from "react-router-dom";
import { LayoutDashboard, Megaphone, BarChart3, Building2, MessageSquare, Search, Bot, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/dashboard/growth", label: "Hub", icon: LayoutDashboard, end: true },
  { to: "/dashboard/growth/ads", label: "Ads AI", icon: Megaphone },
  { to: "/dashboard/growth/analytics", label: "Analytics AI", icon: BarChart3 },
  { to: "/dashboard/growth/profile", label: "Business Profile", icon: Building2 },
  { to: "/dashboard/growth/reviews", label: "Reviews AI", icon: MessageSquare },
  { to: "/dashboard/growth/seo", label: "Local SEO", icon: Search },
  { to: "/dashboard/growth/agent", label: "Growth Agent", icon: Bot },
  { to: "/dashboard/growth/connect", label: "Connect", icon: Plug },
];

export default function GrowthNav() {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                : "bg-white/70 text-muted-foreground border-border hover:text-foreground hover:bg-white",
            )
          }
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </NavLink>
      ))}
    </div>
  );
}