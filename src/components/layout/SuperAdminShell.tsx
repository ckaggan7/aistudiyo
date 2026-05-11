import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Building2, Cpu, CircleDollarSign,
  BarChart3, LifeBuoy, Server, Settings as SettingsIcon,
  ShieldCheck, LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const items = [
  { icon: LayoutDashboard, label: "Overview", path: "/superadmin" },
  { icon: Users, label: "Users", path: "/superadmin/users" },
  { icon: Building2, label: "Workspaces", path: "/superadmin/workspaces" },
  { icon: Cpu, label: "AI Center", path: "/superadmin/ai" },
  { icon: CircleDollarSign, label: "Billing", path: "/superadmin/billing" },
  { icon: BarChart3, label: "Analytics", path: "/superadmin/analytics" },
  { divider: true as const },
  { icon: LifeBuoy, label: "Support", path: "/superadmin/support" },
  { icon: Server, label: "System", path: "/superadmin/system" },
  { icon: SettingsIcon, label: "Settings", path: "/superadmin/settings" },
];

export default function SuperAdminShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/superadmin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex sticky top-0 h-screen w-64 border-r border-border/60 bg-card/40 backdrop-blur-xl flex-col">
        <div className="h-16 flex items-center px-5 border-b border-border/60">
          <Link to="/superadmin" className="flex items-center gap-2 text-sm font-bold tracking-tight">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
            AI <span className="text-gradient-hero">STUDIYO</span>
            <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-destructive">
              Super Admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {items.map((it, idx) => {
            if ("divider" in it) {
              return <div key={`div-${idx}`} className="my-2 mx-2 border-t border-border/40" />;
            }
            const active = pathname === it.path || (it.path !== "/superadmin" && pathname.startsWith(it.path));
            return (
              <Link
                key={it.path}
                to={it.path}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all relative",
                  active
                    ? "bg-primary/10 text-primary shadow-[0_0_24px_-6px_hsl(var(--primary)/0.5)]"
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
        <div className="p-3 border-t border-border/60 space-y-2">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="truncate">{user?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start gap-2 h-8">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
    </div>
  );
}