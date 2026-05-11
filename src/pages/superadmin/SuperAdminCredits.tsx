import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReusableTable, type Column } from "@/components/ui/reusable-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Plus, Minus } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

type Row = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  balance: number;
  spent30: number;
  last_activity: string | null;
};

export default function SuperAdminCredits() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<Row | null>(null);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: wallets }, { data: txns }] = await Promise.all([
      supabase.from("profiles").select("user_id, email, display_name"),
      supabase.from("wallet").select("user_id, balance"),
      supabase.from("credit_transactions").select("user_id, amount, created_at"),
    ]);

    const wMap = new Map((wallets ?? []).map((w: any) => [w.user_id, w.balance]));
    const spentMap = new Map<string, number>();
    const lastMap = new Map<string, string>();
    const cutoff = Date.now() - 30 * 86400000;
    (txns ?? []).forEach((t: any) => {
      if (!t.user_id) return;
      const ts = new Date(t.created_at).getTime();
      if (t.amount < 0 && ts >= cutoff) {
        spentMap.set(t.user_id, (spentMap.get(t.user_id) ?? 0) + Math.abs(t.amount));
      }
      const prev = lastMap.get(t.user_id);
      if (!prev || new Date(prev).getTime() < ts) lastMap.set(t.user_id, t.created_at);
    });

    const merged: Row[] = (profiles ?? []).map((p: any) => ({
      user_id: p.user_id,
      email: p.email,
      display_name: p.display_name,
      balance: (wMap.get(p.user_id) as number) ?? 0,
      spent30: spentMap.get(p.user_id) ?? 0,
      last_activity: lastMap.get(p.user_id) ?? null,
    }));
    setRows(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) =>
    (r.email ?? "").toLowerCase().includes(query.toLowerCase()) ||
    (r.display_name ?? "").toLowerCase().includes(query.toLowerCase()),
  );

  const submitAdjust = async () => {
    if (!target) return;
    const n = parseInt(delta, 10);
    if (!Number.isFinite(n) || n === 0) return toast.error("Enter a non-zero integer");
    setBusy(true);
    const { error } = await supabase.rpc("adjust_user_credits", {
      _user_id: target.user_id,
      _delta: n,
      _reason: reason || "Admin adjustment",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${n > 0 ? "Added" : "Removed"} ${Math.abs(n)} credits`);
    setTarget(null); setDelta(""); setReason("");
    load();
  };

  const columns: Column<Row>[] = [
    {
      key: "user", header: "User", sortValue: (r) => r.email ?? "",
      accessor: (r) => (
        <div>
          <div className="text-sm font-medium">{r.display_name ?? "—"}</div>
          <div className="text-xs text-muted-foreground">{r.email}</div>
        </div>
      ),
    },
    {
      key: "balance", header: "Balance", sortValue: (r) => r.balance,
      accessor: (r) => (
        <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
          <Coins className="w-3.5 h-3.5 text-amber-500" /> {r.balance}
        </span>
      ),
    },
    {
      key: "spent30", header: "Spent (30d)", sortValue: (r) => r.spent30,
      accessor: (r) => <span className="tabular-nums">{r.spent30}</span>,
    },
    {
      key: "last", header: "Last activity", sortValue: (r) => r.last_activity ?? "",
      accessor: (r) => (
        <span className="text-xs text-muted-foreground">
          {r.last_activity ? format(new Date(r.last_activity), "MMM d, yyyy HH:mm") : "—"}
        </span>
      ),
    },
    {
      key: "actions", header: "", accessor: (r) => (
        <div className="flex gap-1.5 justify-end">
          <Button size="sm" variant="outline" onClick={() => { setTarget(r); setDelta("50"); setReason("Top-up"); }}>
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setTarget(r); setDelta("-10"); setReason("Adjustment"); }}>
            <Minus className="w-3.5 h-3.5" /> Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <header>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Credits</p>
        <h1 className="text-3xl font-bold tracking-tight">Credit Management</h1>
        <p className="text-sm text-muted-foreground">Inspect, top-up and adjust credits across all users.</p>
      </header>

      <FilterBar query={query} onQueryChange={setQuery} placeholder="Search users…" />
      <ReusableTable
        data={filtered}
        columns={columns}
        rowKey={(r) => r.user_id}
        loading={loading}
        pageSize={20}
        exportable
        exportFilename="credits.csv"
      />

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust credits</DialogTitle>
            <DialogDescription>
              {target?.email} · current balance: <span className="font-semibold">{target?.balance}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount (use negative to remove)</Label>
              <Input type="number" value={delta} onChange={(e) => setDelta(e.target.value)} placeholder="50 or -10" />
            </div>
            <div>
              <Label>Reason</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Goodwill top-up" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button>
            <Button onClick={submitAdjust} disabled={busy}>{busy ? "Saving…" : "Apply"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}