import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReusableTable, type Column } from "@/components/ui/reusable-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format } from "date-fns";
import { Building2, Coins, HardDrive, Users } from "lucide-react";

type W = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  credits: number;
  status: string;
  storage_used_mb: number;
  owner_id: string;
  created_at: string;
};

type OwnerMap = Record<string, { email: string | null; display_name: string | null }>;

export default function SuperAdminWorkspaces() {
  const [data, setData] = useState<W[]>([]);
  const [owners, setOwners] = useState<OwnerMap>({});
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<W | null>(null);

  useEffect(() => {
    (async () => {
      const { data: ws } = await supabase.from("workspaces").select("*").order("created_at", { ascending: false });
      const list = (ws ?? []) as W[];
      setData(list);
      const ownerIds = Array.from(new Set(list.map((w) => w.owner_id)));
      if (ownerIds.length) {
        const { data: ps } = await supabase.from("profiles").select("user_id,email,display_name").in("user_id", ownerIds);
        const map: OwnerMap = {};
        (ps ?? []).forEach((p: { user_id: string; email: string | null; display_name: string | null }) => { map[p.user_id] = { email: p.email, display_name: p.display_name }; });
        setOwners(map);
      }
      const { data: members } = await supabase.from("workspace_members").select("workspace_id");
      const counts: Record<string, number> = {};
      (members ?? []).forEach((m: { workspace_id: string }) => { counts[m.workspace_id] = (counts[m.workspace_id] ?? 0) + 1; });
      setMemberCounts(counts);
      setLoading(false);
    })();
  }, []);

  const filtered = data.filter((w) =>
    w.name.toLowerCase().includes(query.toLowerCase()) ||
    w.slug.toLowerCase().includes(query.toLowerCase()) ||
    (owners[w.owner_id]?.email ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const columns: Column<W>[] = [
    { key: "name", header: "Workspace", sortValue: (r) => r.name, accessor: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{r.name}</div>
          <div className="text-[11px] text-muted-foreground truncate">{r.slug}</div>
        </div>
      </div>
    ) },
    { key: "owner", header: "Owner", accessor: (r) => (
      <span className="text-xs text-muted-foreground truncate block max-w-[180px]">{owners[r.owner_id]?.email ?? "—"}</span>
    ) },
    { key: "plan", header: "Plan", sortValue: (r) => r.plan, accessor: (r) => (
      <Badge variant="secondary" className="uppercase text-[10px]">{r.plan}</Badge>
    ) },
    { key: "credits", header: "Credits", sortValue: (r) => r.credits, accessor: (r) => (
      <span className="tabular-nums">{r.credits}</span>
    ) },
    { key: "members", header: "Members", sortValue: (r) => memberCounts[r.id] ?? 0, accessor: (r) => (
      <span className="tabular-nums">{memberCounts[r.id] ?? 0}</span>
    ) },
    { key: "status", header: "Status", sortValue: (r) => r.status, accessor: (r) => (
      <span className="inline-flex items-center gap-1.5 text-xs">
        <span className={`w-1.5 h-1.5 rounded-full ${r.status === "active" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
        {r.status}
      </span>
    ) },
    { key: "created", header: "Created", sortValue: (r) => r.created_at, accessor: (r) => (
      <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</span>
    ) },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <AdminPageHeader eyebrow="Workspaces" title="All Workspaces" description={`${data.length} total · ${filtered.length} shown`} />
      <FilterBar query={query} onQueryChange={setQuery} placeholder="Search by name, slug, owner…" />
      <ReusableTable
        data={filtered}
        columns={columns}
        rowKey={(r) => r.id}
        loading={loading}
        pageSize={15}
        exportable
        exportFilename="workspaces.csv"
        onRowClick={(r) => setActive(r)}
      />

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="sm:max-w-md">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.name}</SheetTitle>
                <SheetDescription>{active.slug}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/50 bg-card/60 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <Coins className="w-3 h-3" /> Credits
                    </div>
                    <div className="text-xl font-bold mt-1 tabular-nums">{active.credits}</div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card/60 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <Users className="w-3 h-3" /> Members
                    </div>
                    <div className="text-xl font-bold mt-1 tabular-nums">{memberCounts[active.id] ?? 0}</div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card/60 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <HardDrive className="w-3 h-3" /> Storage
                    </div>
                    <div className="text-xl font-bold mt-1 tabular-nums">{active.storage_used_mb} <span className="text-xs text-muted-foreground">MB</span></div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card/60 p-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Plan</div>
                    <div className="text-xl font-bold mt-1 uppercase">{active.plan}</div>
                  </div>
                </div>
                <div className="rounded-lg border border-border/50 bg-card/60 p-3 space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Owner</div>
                  <div className="text-sm">{owners[active.owner_id]?.display_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{owners[active.owner_id]?.email ?? ""}</div>
                </div>
                <div className="rounded-lg border border-border/50 bg-card/60 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Created</div>
                  <div className="text-sm mt-1">{format(new Date(active.created_at), "MMM d, yyyy 'at' HH:mm")}</div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}