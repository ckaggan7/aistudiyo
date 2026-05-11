import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Sparkles, BarChart3, Settings, Menu, X,
  Bot, Calendar, FolderOpen, TrendingUp, Image as ImageIcon, PanelRightOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WorkspaceSwitcher from "./workspace/WorkspaceSwitcher";
import ProfileMenu from "./dashboard/ProfileMenu";
import AIDock from "./dashboard/AIDock";
import { AmbientBackdrop } from "./ui/ambient-backdrop";

type NavItem = { icon: any; label: string; path: string };

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Home",          path: "/dashboard" },
  { icon: Sparkles,        label: "Create",        path: "/dashboard/generator" },
  { icon: ImageIcon,       label: "Image Studio",  path: "/dashboard/image-studio" },
  { icon: Bot,             label: "Agents",        path: "/dashboard/agents" },
  { icon: Calendar,        label: "Calendar",      path: "/dashboard/calendar" },
  { icon: TrendingUp,      label: "Trends",        path: "/dashboard/trends" },
  { icon: FolderOpen,      label: "Content Packs", path: "/dashboard/media" },
  { icon: BarChart3,       label: "Analytics",     path: "/dashboard/analytics" },
  { icon: Settings,        label: "Settings",      path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex relative">
      <AmbientBackdrop />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Floating sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 transition-transform duration-200",
          "lg:py-3 lg:pl-3",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-full lg:h-[calc(100vh-1.5rem)] surface-floating lg:rounded-2xl flex flex-col">
          <div className="h-14 flex items-center justify-between px-5 border-b border-border/40">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-hero shadow-glow" />
              <span className="text-sm font-semibold tracking-tight text-display">AI STUDIYO</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => {
              const isActive =
                item.path === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "text-primary bg-primary/[0.10]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-primary" />
                  )}
                  <item.icon className={cn("w-4 h-4", isActive && "text-primary")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border/40">
            <div className="text-[11px] text-muted-foreground flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AI online
              </span>
              <kbd className="px-1.5 py-0.5 rounded-md border border-border/60 bg-muted/40 text-[10px] font-mono">⌘K</kbd>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center px-6 sticky top-0 z-30 bg-background/70 backdrop-blur-md border-b border-border/40">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <WorkspaceSwitcher />
          </div>
          <div className="flex items-center gap-2">
            {!dockOpen && (
              <button
                onClick={() => setDockOpen(true)}
                className="hidden xl:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border/60 bg-muted/40 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30"
              >
                <PanelRightOpen className="w-3.5 h-3.5" /> AI Dock
              </button>
            )}
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>

      <AIDock open={dockOpen} onClose={() => setDockOpen(false)} />
    </div>
  );
}
