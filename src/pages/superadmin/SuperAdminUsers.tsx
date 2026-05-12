import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ReusableTable, type Column } from "@/components/ui/reusable-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pause, Play, Shield, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { AppRole } from "@/hooks/useAuth";

type Profile = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  status: string;
  created_at: string;
};
type RoleRow = { user_id: string; role: string };

const ROLES = ["super_admin", "admin", "creator", "user"] as const;

export default function SuperAdminUsers() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("user_id,email,display_name,status,created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setProfiles((p ?? []) as Profile[]);
    setRoles((r ?? []) as RoleRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("super-admin-users")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const rolesByUser = useMemo(() => {
    const m = new Map<string, string[]>();
    roles.forEach((r) => {
      const arr = m.get(r.user_id) ?? [];
      arr.push(r.role);
      m.set(r.user_id, arr);
    });
    return m;
  }, [roles]);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        (p.email?.toLowerCase() ?? "").includes(q) ||
        (p.display_name?.toLowerCase() ?? "").includes(q);
      const userRoles = rolesByUser.get(p.user_id) ?? [];
      const matchR = roleFilter === "all" || userRoles.includes(roleFilter);
      const matchS = statusFilter === "all" || p.status === statusFilter;
      return matchQ && matchR && matchS;
    });
  }, [profiles, query, roleFilter, statusFilter, rolesByUser]);

  const grantRole = async (uid: string, role: (typeof ROLES)[number]) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: role as AppRole });
    if (error) toast.error(error.message);
    else toast.success(`Granted ${role.replace("_", " ")}`);
  };
  const revokeRole = async (uid: string, role: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", uid)
      .eq("role", role as AppRole);
    if (error) toast.error(error.message);
    else toast.success(`Revoked ${role.replace("_", " ")}`);
  };
  const toggleStatus = async (p: Profile) => {
    const next = p.status === "suspended" ? "active" : "suspended";
    const { error } = await supabase.from("profiles").update({ status: next }).eq("user_id", p.user_id);
    if (error) toast.error(error.message);
    else toast.success(next === "suspended" ? "User suspended" : "User reactivated");
  };

  const columns: Column<Profile>[] = [
    {
      key: "user",
      header: "User",
      sortValue: (r) => r.display_name ?? r.email ?? "",
      accessor: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground grid place-items-center text-xs font-semibold shrink-0">
            {(r.display_name ?? r.email ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{r.display_name ?? "—"}</div>
            <div className="text-xs text-muted-foreground truncate">{r.email ?? ""}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (r) => r.status,
      accessor: (r) => (
        <Badge
          variant={r.status === "suspended" ? "destructive" : "secondary"}
          className="text-[10px] uppercase tracking-wider"
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: "roles",
      header: "Roles",
      accessor: (r) => {
        const rs = rolesByUser.get(r.user_id) ?? ["user"];
        return (
          <div className="flex gap-1 flex-wrap">
            {rs.map((role) => (
              <Badge
                key={role}
                variant={role === "super_admin" ? "default" : "secondary"}
                className="text-[10px] uppercase tracking-wider"
              >
                {role.replace("_", " ")}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: "created_at",
      header: "Joined",
      sortValue: (r) => r.created_at,
      accessor: (r) => (
        <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      accessor: (r) => {
        const userRoles = rolesByUser.get(r.user_id) ?? [];
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => navigate(`/superadmin/users/${r.user_id}`)}>
                <ExternalLink className="w-3.5 h-3.5 mr-2" /> View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleStatus(r)}>
                {r.status === "suspended" ? (
                  <>
                    <Play className="w-3.5 h-3.5 mr-2" /> Reactivate
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 mr-2" /> Suspend
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">Grant role</DropdownMenuLabel>
              {ROLES.filter((role) => !userRoles.includes(role)).map((role) => (
                <DropdownMenuItem key={role} onClick={() => grantRole(r.user_id, role)}>
                  <Shield className="w-3.5 h-3.5 mr-2" /> {role.replace("_", " ")}
                </DropdownMenuItem>
              ))}
              {userRoles.length > 0 && <DropdownMenuSeparator />}
              {userRoles.length > 0 && (
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">Revoke role</DropdownMenuLabel>
              )}
              {userRoles.map((role) => (
                <DropdownMenuItem
                  key={`r-${role}`}
                  onClick={() => revokeRole(r.user_id, role)}
                  className="text-destructive focus:text-destructive"
                >
                  Revoke {role.replace("_", " ")}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <header>
        <p className="text-xs uppercase tracking-widest text-destructive font-semibold">Super Admin · Users</p>
        <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {profiles.length} total · {filtered.length} shown
        </p>
      </header>

      <FilterBar query={query} onQueryChange={setQuery} placeholder="Search by email or name…">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 rounded-md border border-border/60 bg-background/60 px-3 text-sm"
        >
          <option value="all">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-border/60 bg-background/60 px-3 text-sm"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </FilterBar>

      <ReusableTable<Profile>
        data={filtered}
        columns={columns}
        rowKey={(r) => r.user_id}
        loading={loading}
        pageSize={15}
        onRowClick={(r) => navigate(`/superadmin/users/${r.user_id}`)}
        exportable
        exportFilename="users.csv"
      />
    </div>
  );
}