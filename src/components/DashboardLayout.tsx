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
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WorkspaceSwitcher from "./workspace/WorkspaceSwitcher";

type NavLeaf = { label: string; path: string };
type NavItem =
  | { icon: any; label: string; path: string; children?: undefined }
  | { icon: any; label: string; children: NavLeaf[]; path?: undefined };

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  {
    icon: Sparkles,
    label: "Create",
    children: [
      { label: "AI Generator", path: "/dashboard/generator" },
      { label: "Images", path: "/dashboard/image-studio" },
      { label: "Design Studio", path: "/dashboard/design" },
      { label: "Templates", path: "/dashboard/templates" },
    ],
  },
  {
    icon: Bot,
    label: "Automate",
    children: [
      { label: "Agents", path: "/dashboard/agents" },
      { label: "Workflows", path: "/dashboard/workflows" },
    ],
  },
  {
    icon: Calendar,
    label: "Plan",
    children: [
      { label: "Calendar", path: "/dashboard/calendar" },
      { label: "Media Library", path: "/dashboard/media" },
      { label: "Branding CRM", path: "/dashboard/branding" },
    ],
  },
  {
    icon: BarChart3,
    label: "Insights",
    children: [
      { label: "Trend Engine", path: "/dashboard/trends" },
      { label: "Analytics", path: "/dashboard/analytics" },
    ],
  },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isChildActive = (children?: NavLeaf[]) =>
    !!children?.some((c) => location.pathname === c.path || location.pathname.startsWith(c.path + "/"));
  const initialOpen = navItems.find((i) => i.children && isChildActive(i.children))?.label ?? null;
  const [openGroup, setOpenGroup] = useState<string | null>(initialOpen);

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
            if (!item.children) {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path!}
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
                </Link>
              );
            }
            const isOpen = openGroup === item.label;
            const hasActive = isChildActive(item.children);
            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpenGroup(isOpen ? null : item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    hasActive
                      ? "text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <div className="mt-1 ml-4 pl-3 border-l border-sidebar-border space-y-1">
                    {item.children.map((c) => {
                      const active = location.pathname === c.path || location.pathname.startsWith(c.path + "/");
                      return (
                        <Link
                          key={c.path}
                          to={c.path}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm transition-colors",
                            active
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          )}
                        >
                          {c.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 h-7 rounded-md border border-border/60 bg-muted/40 text-[10px] font-mono text-muted-foreground">
            <span>⌘</span>K
          </kbd>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
