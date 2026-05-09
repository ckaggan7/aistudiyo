import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReusableTable, type Column } from "@/components/ui/reusable-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type Log = {
  id: string;
  user_id: string | null;
  action: string;
  target: string | null;
  ip: string | null;
  created_at: string;
};

export default function AdminActivity() {
  const [data, setData] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      setData((data ?? []) as Log[]);
      setLoading(false);
    })();
  }, []);

  const columns: Column<Log>[] = [
    {
      key: "time",
      header: "Time",
      sortValue: (r) => r.created_at,
      accessor: (r) => (
        <span className="text-xs text-muted-foreground font-mono">
          {format(new Date(r.created_at), "MMM d, HH:mm:ss")}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortValue: (r) => r.action,
      accessor: (r) => <Badge variant="secondary" className="uppercase text-[10px]">{r.action}</Badge>,
    },
    { key: "target", header: "Target", accessor: (r) => <span className="text-sm">{r.target ?? "—"}</span> },
    { key: "user", header: "User", accessor: (r) => <span className="text-xs font-mono text-muted-foreground">{r.user_id?.slice(0, 8) ?? "—"}</span> },
    { key: "ip", header: "IP", accessor: (r) => <span className="text-xs font-mono">{r.ip ?? "—"}</span> },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <header>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Audit</p>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
      </header>
      <ReusableTable data={data} columns={columns} rowKey={(r) => r.id} loading={loading} pageSize={20} exportable exportFilename="activity.csv" />
    </div>
  );
}