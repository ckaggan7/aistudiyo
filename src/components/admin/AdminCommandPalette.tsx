import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, Users, Building2, Cpu, CircleDollarSign, BarChart3,
  LifeBuoy, Server, Settings as SettingsIcon, AlertTriangle, UserSearch, Sun, Moon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/superadmin" },
  { icon: Users, label: "Users", path: "/superadmin/users" },
  { icon: Building2, label: "Workspaces", path: "/superadmin/workspaces" },
  { icon: Cpu, label: "AI Center", path: "/superadmin/ai" },
  { icon: CircleDollarSign, label: "Billing", path: "/superadmin/billing" },
  { icon: BarChart3, label: "Analytics", path: "/superadmin/analytics" },
  { icon: LifeBuoy, label: "Support", path: "/superadmin/support" },
  { icon: Server, label: "System", path: "/superadmin/system" },
  { icon: SettingsIcon, label: "Settings", path: "/superadmin/settings" },
];

// Tiny event bus so the shell button + global ⌘K can both toggle
const EVENT = "admin-palette-toggle";
export function useAdminCommandPalette() {
  return {
    open: () => window.dispatchEvent(new CustomEvent(EVENT, { detail: true })),
    close: () => window.dispatchEvent(new CustomEvent(EVENT, { detail: false })),
  };
}

type UserHit = { user_id: string; email: string | null; display_name: string | null };
type WSHit = { id: string; name: string; slug: string };

export default function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserHit[]>([]);
  const [workspaces, setWorkspaces] = useState<WSHit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onEvt = (e: Event) => setOpen((o) => (e as CustomEvent).detail ?? !o);
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENT, onEvt as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENT, onEvt as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setUsers([]);
      setWorkspaces([]);
      return;
    }
    const handle = setTimeout(async () => {
      const term = `%${query}%`;
      const [u, w] = await Promise.all([
        supabase.from("profiles").select("user_id,email,display_name").or(`email.ilike.${term},display_name.ilike.${term}`).limit(6),
        supabase.from("workspaces").select("id,name,slug").or(`name.ilike.${term},slug.ilike.${term}`).limit(6),
      ]);
      setUsers((u.data ?? []) as UserHit[]);
      setWorkspaces((w.data ?? []) as WSHit[]);
    }, 200);
    return () => clearTimeout(handle);
  }, [query]);

  const go = useCallback((path: string) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  }, [navigate]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setOpen(false);
  };

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search users, workspaces, actions…" value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        {users.length > 0 && (
          <CommandGroup heading="Users">
            {users.map((u) => (
              <CommandItem key={u.user_id} onSelect={() => go(`/superadmin/users/${u.user_id}`)}>
                <UserSearch className="mr-2 h-4 w-4" />
                <span className="truncate">{u.display_name ?? u.email ?? u.user_id}</span>
                {u.email && u.display_name && <span className="ml-2 text-[10px] text-muted-foreground truncate">{u.email}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {workspaces.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Workspaces">
              {workspaces.map((w) => (
                <CommandItem key={w.id} onSelect={() => go(`/superadmin/workspaces`)}>
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>{w.name}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground">/{w.slug}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Navigate">
          {navItems.map((n) => (
            <CommandItem key={n.path} onSelect={() => go(n.path)}>
              <n.icon className="mr-2 h-4 w-4" />
              <span>{n.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/superadmin/support")}>
            <AlertTriangle className="mr-2 h-4 w-4" /> View AI failures
          </CommandItem>
          <CommandItem onSelect={() => go("/superadmin/billing")}>
            <CircleDollarSign className="mr-2 h-4 w-4" /> Open billing
          </CommandItem>
          <CommandItem onSelect={toggleTheme}>
            {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
