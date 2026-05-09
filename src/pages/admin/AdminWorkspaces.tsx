import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReusableTable, type Column } from "@/components/ui/reusable-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type W = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  credits: number;
  status: string;
  created_at: string;
};

export default function AdminWorkspaces() {
  const [data, setData] = useState<W[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("workspaces").select("*").order("created_at", { ascending: false });
      setData((data ?? []) as W[]);
      setLoading(false);
    })();
  }, []);

  const filtered = data.filter((w) => w.name.toLowerCase().includes(query.toLowerCase()) || w.slug.includes(query.toLowerCase()));

  const columns: Column<W>[] = [
    { key: "name", header: "Workspace", sortValue: (r) => r.name, accessor: (r) => (
      <div>
        <div className="text-sm font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">{r.slug}</div>
      </div>
    ) },
    { key: "plan", header: "Plan", sortValue: (r) => r.plan, accessor: (r) => (
      <Badge variant="secondary" className="uppercase text-[10px]">{r.plan}</Badge>
    ) },
    { key: "credits", header: "Credits", sortValue: (r) => r.credits, accessor: (r) => r.credits },
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
      <header>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Workspaces</p>
        <h1 className="text-3xl font-bold tracking-tight">All Workspaces</h1>
      </header>
      <FilterBar query={query} onQueryChange={setQuery} placeholder="Search workspaces…" />
      <ReusableTable data={filtered} columns={columns} rowKey={(r) => r.id} loading={loading} exportable exportFilename="workspaces.csv" />
    </div>
  );
}