import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Sparkles,
  Wand2,
  Palette,
  Calendar,
  FolderOpen,
  TrendingUp,
  BarChart3,
  Settings,
  Bot,
  Briefcase,
  Flame,
  ShieldCheck,
  Building2,
  LogOut,
} from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Sparkles, label: "AI Generator", path: "/dashboard/generator" },
  { icon: Wand2, label: "Image Studio", path: "/dashboard/image-studio" },
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

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { workspaces, current, switchTo } = useWorkspace();
  const { hasRole, signOut } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command, search anything…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {nav.map((n) => (
            <CommandItem key={n.path} onSelect={() => go(n.path)}>
              <n.icon className="mr-2 h-4 w-4" />
              <span>{n.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {hasRole("super_admin") && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Admin">
              <CommandItem onSelect={() => go("/admin")}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Super Admin Overview</span>
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/users")}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Manage Users</span>
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/ai-usage")}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>AI Usage Analytics</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
        {workspaces.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Switch workspace">
              {workspaces.map((w) => (
                <CommandItem
                  key={w.id}
                  onSelect={() => {
                    switchTo(w.id);
                    setOpen(false);
                  }}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>{w.name}</span>
                  {current?.id === w.id && (
                    <span className="ml-auto text-[10px] uppercase text-primary">Current</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem
            onSelect={async () => {
              await signOut();
              setOpen(false);
              navigate("/");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}