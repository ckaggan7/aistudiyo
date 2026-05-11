import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Settings,
  Menu,
  X,
  Bot,
  Calendar,
  FolderOpen,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WorkspaceSwitcher from "./workspace/WorkspaceSwitcher";
import ProfileMenu from "./dashboard/ProfileMenu";

type NavItem = { icon: any; label: string; path: string };

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: Sparkles, label: "Create", path: "/dashboard/generator" },
  { icon: Bot, label: "Agents", path: "/dashboard/agents" },
  { icon: FolderOpen, label: "Content Packs", path: "/dashboard/media" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  { icon: TrendingUp, label: "Trends", path: "/dashboard/trends" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
          <Link to="/" className="text-base font-semibold tracking-tight">
            AI STUDIYO
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
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
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/[0.08] text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center px-6 bg-background sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4 text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <WorkspaceSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <kbd className="hidden md:inline-flex items-center gap-1 px-2 h-7 rounded-md border border-border/60 bg-muted/40 text-[10px] font-mono text-muted-foreground">
              <span>⌘</span>K
            </kbd>
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
