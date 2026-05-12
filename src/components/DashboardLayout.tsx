import { useState, type ElementType } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Sparkles, BarChart3, Settings, Menu, X,
  Bot, Calendar, FolderOpen, TrendingUp, Image as ImageIcon, PanelRightOpen, Megaphone, Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WorkspaceSwitcher from "./workspace/WorkspaceSwitcher";
import ProfileMenu from "./dashboard/ProfileMenu";
import AIDock from "./dashboard/AIDock";
import MobileDock from "./dashboard/MobileDock";
import { AmbientBackdrop } from "./ui/ambient-backdrop";

type NavItem = { icon: ElementType; label: string; path: string };

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Home",          path: "/dashboard" },
  { icon: Brain,           label: "Brand AI Studio", path: "/dashboard/studio" },
  { icon: ImageIcon,       label: "Image Studio",  path: "/dashboard/image-studio" },
  { icon: Bot,             label: "Agents",        path: "/dashboard/agents" },
  { icon: Calendar,        label: "Calendar",      path: "/dashboard/calendar" },
  { icon: TrendingUp,      label: "Trends",        path: "/dashboard/trends" },
  { icon: FolderOpen,      label: "Content Packs", path: "/dashboard/media" },
  { icon: BarChart3,       label: "Analytics",     path: "/dashboard/analytics" },
  { icon: Megaphone,       label: "Growth",        path: "/dashboard/growth" },
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
          "lg:py-4 lg:pl-4",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-full lg:h-[calc(100vh-2rem)] bg-white border border-border lg:rounded-[24px] shadow-sm flex flex-col">
          <div className="h-16 flex items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-hero shadow-glow flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold tracking-tight">AI STUDIYO</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto scrollbar-thin">
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
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all",
                    isActive
                      ? "text-primary bg-orange-50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive && "text-primary")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border/60">
            <div className="text-[11px] text-muted-foreground flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AI online
              </span>
              <kbd className="px-1.5 py-0.5 rounded-md border border-border bg-muted/40 text-[10px] font-mono">⌘K</kbd>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-6 sticky top-0 z-30 bg-background/80 backdrop-blur-md">
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
                className="hidden xl:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-white text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30"
              >
                <PanelRightOpen className="w-3.5 h-3.5" /> AI Dock
              </button>
            )}
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 px-6 pb-10">{children}</main>
      </div>

      <AIDock open={dockOpen} onClose={() => setDockOpen(false)} />
      <MobileDock />
    </div>
  );
}
