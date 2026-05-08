import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Palette,
  Calendar,
  FolderOpen,
  TrendingUp,
  BarChart3,
  Settings,
  Menu,
  X,
  Flame,
  Briefcase,
  Wand2,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Sparkles, label: "AI Generator", path: "/dashboard/generator" },
  { icon: Wand2, label: "Images", path: "/dashboard/image-studio" },
  { icon: Palette, label: "Design Studio", path: "/dashboard/design" },
  { icon: Flame, label: "Trending Templates", path: "/dashboard/templates" },
  { icon: Briefcase, label: "Branding CRM", path: "/dashboard/branding" },
  { icon: Bot, label: "Agents", path: "/dashboard/agents" },
  { icon: Calendar, label: "Content Calendar", path: "/dashboard/calendar" },
  { icon: FolderOpen, label: "Media Library", path: "/dashboard/media" },
  { icon: TrendingUp, label: "Trend Engine", path: "/dashboard/trends" },
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
          <Link to="/" className="text-lg font-bold tracking-tight">
            AI <span className="text-gradient-hero">STUDIYO</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-4.5 h-4.5" />
                <span className="flex-1">{item.label}</span>
                {("badge" in item) && (item as any).badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-hero text-primary-foreground">{(item as any).badge}</span>
                )}
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
          <div className="flex-1" />
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
