import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Building2, Cpu, CircleDollarSign,
  BarChart3, LifeBuoy, Server, Settings as SettingsIcon,
  ShieldCheck, LogOut, ChevronLeft, ChevronRight, Menu, Search,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AdminCommandPalette, { useAdminCommandPalette } from "@/components/admin/AdminCommandPalette";
import AIInsightsDock from "@/components/admin/AIInsightsDock";

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

const STORAGE_KEY = "sa-sidebar-collapsed";

function NavList({ collapsed, onItemClick }: { collapsed: boolean; onItemClick?: () => void }) {
  const { pathname } = useLocation();
  return (
    <TooltipProvider delayDuration={200}>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((it, idx) => {
          if ("divider" in it) {
            return <div key={`div-${idx}`} className="my-2 mx-2 border-t border-border/40" />;
          }
          const active = pathname === it.path || (it.path !== "/superadmin" && pathname.startsWith(it.path));
          const link = (
            <Link
              to={it.path}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors relative",
                collapsed && "justify-center px-0",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" />
              )}
              <it.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{it.label}</span>}
            </Link>
          );
          if (collapsed) {
            return (
              <Tooltip key={it.path}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{it.label}</TooltipContent>
              </Tooltip>
            );
          }
          return <div key={it.path}>{link}</div>;
        })}
      </nav>
    </TooltipProvider>
  );
}

function SidebarInner({
  collapsed, setCollapsed, onSignOut, email, onItemClick,
}: {
  collapsed: boolean;
  setCollapsed?: (v: boolean) => void;
  onSignOut: () => void;
  email?: string;
  onItemClick?: () => void;
}) {
  return (
    <>
      <div className={cn("h-14 flex items-center border-b border-border/40", collapsed ? "px-2 justify-center" : "px-4 justify-between")}>
        {!collapsed ? (
          <Link to="/superadmin" className="flex items-center gap-2 text-sm font-bold tracking-tight">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
            AI <span className="text-gradient-hero">STUDIYO</span>
          </Link>
        ) : (
          <ShieldCheck className="w-5 h-5 text-primary" />
        )}
        {setCollapsed && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </Button>
        )}
      </div>
      <NavList collapsed={collapsed} onItemClick={onItemClick} />
      <div className={cn("border-t border-border/40 space-y-1", collapsed ? "p-2" : "p-3")}>
        {!collapsed && email && (
          <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className={cn("w-full h-8 gap-2", collapsed ? "justify-center px-0" : "justify-start")}
        >
          <LogOut className="w-3.5 h-3.5" /> {!collapsed && "Sign out"}
        </Button>
      </div>
    </>
  );
}

export default function SuperAdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openPalette } = useAdminCommandPalette();

  useEffect(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "1") setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/superadmin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex sticky top-0 h-screen border-r border-border/40 bg-card/60 backdrop-blur-sm flex-col transition-[width] duration-200",
          collapsed ? "w-14" : "w-60",
        )}
      >
        <SidebarInner collapsed={collapsed} setCollapsed={setCollapsed} onSignOut={handleSignOut} email={user?.email ?? undefined} />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (mobile + always shows ⌘K) */}
        <header className="sticky top-0 z-30 h-12 flex items-center gap-2 px-3 lg:px-4 border-b border-border/40 bg-background/85 backdrop-blur-sm">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-card border-border/40">
              <div className="h-full flex flex-col">
                <SidebarInner
                  collapsed={false}
                  onSignOut={handleSignOut}
                  email={user?.email ?? undefined}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-destructive">Super Admin</span>
          <div className="flex-1" />
          <button
            onClick={openPalette}
            className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-border/40 bg-card/50 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search anything</span>
            <kbd className="hidden md:inline ml-2 px-1.5 py-0.5 rounded bg-muted/60 text-[10px] font-mono">⌘K</kbd>
          </button>
        </header>

        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      <AdminCommandPalette />
      <AIInsightsDock />
    </div>
  );
}
