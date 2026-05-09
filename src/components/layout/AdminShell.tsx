import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Cpu,
  Activity,
  Coins,
  BarChart3,
  Bell,
  Shield,
  FileText,
  Database,
  HardDrive,
  LifeBuoy,
  Flag,
  Settings,
  Plug,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Building2, label: "Workspaces", path: "/admin/workspaces" },
  { icon: Cpu, label: "AI Models", path: "/admin/ai-models" },
  { icon: Activity, label: "AI Usage", path: "/admin/ai-usage" },
  { icon: Coins, label: "Credits", path: "/admin/credits" },
  { icon: CircleDollarSign, label: "Revenue", path: "/admin/revenue" },
  { icon: Plug, label: "Integrations", path: "/admin/integrations" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: ShieldCheck, label: "Permissions", path: "/admin/permissions" },
  { icon: FileText, label: "Activity Logs", path: "/admin/activity" },
  { icon: HardDrive, label: "Storage", path: "/admin/storage" },
  { icon: Shield, label: "Security", path: "/admin/security" },
  { icon: LifeBuoy, label: "Support", path: "/admin/support" },
  { icon: Flag, label: "Feature Flags", path: "/admin/flags" },
  { icon: Database, label: "Database", path: "/admin/database" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex sticky top-0 h-screen w-60 border-r border-border/60 bg-card/40 backdrop-blur-xl flex-col">
        <div className="h-16 flex items-center px-5 border-b border-border/60">
          <Link to="/dashboard" className="text-sm font-bold tracking-tight">
            AI <span className="text-gradient-hero">STUDIYO</span>
            <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-primary">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {items.map((it) => {
            const active = pathname === it.path;
            return (
              <Link
                key={it.path}
                to={it.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
                )}
                <it.icon className="w-4 h-4" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
    </div>
  );
}