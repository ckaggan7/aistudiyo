import { useMemo } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingDown, TrendingUp, Plus, Wallet, History } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReusableTable, type Column } from "@/components/ui/reusable-table";
import { useWallet, type CreditTxn } from "@/hooks/useWallet";
import { format, formatDistanceToNow, subDays, startOfDay } from "date-fns";
import { toast } from "sonner";

function UsageChart({ txns }: { txns: CreditTxn[] }) {
  const days = 30;
  const data = useMemo(() => {
    const today = startOfDay(new Date());
    const buckets: number[] = Array.from({ length: days }, () => 0);
    txns.forEach((t) => {
      if (t.amount >= 0) return;
      const d = startOfDay(new Date(t.created_at));
      const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
      if (diff >= 0 && diff < days) buckets[days - 1 - diff] += Math.abs(t.amount);
    });
    return buckets;
  }, [txns]);

  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end group relative">
          <div
            className="w-full rounded-t bg-gradient-to-t from-primary/80 to-primary/30 transition-all hover:from-primary hover:to-primary/60"
            style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? 2 : 0 }}
          />
          {v > 0 && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-[10px] bg-card border border-border/60 px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
              {v} credits
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CreditsPage() {
  const { balance, transactions, loading, spent, earned } = useWallet();

  const last30 = useMemo(() => {
    const cutoff = subDays(new Date(), 30);
    return transactions
      .filter((t) => new Date(t.created_at) >= cutoff && t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);
  }, [transactions]);

  const columns: Column<CreditTxn>[] = [
    {
      key: "date", header: "Date", sortValue: (r) => r.created_at,
      accessor: (r) => (
        <div className="text-xs">
          <div>{format(new Date(r.created_at), "MMM d, HH:mm")}</div>
          <div className="text-muted-foreground">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</div>
        </div>
      ),
    },
    {
      key: "reason", header: "Reason", sortValue: (r) => r.reason,
      accessor: (r) => <span className="text-sm">{r.reason}</span>,
    },
    {
      key: "type", header: "Type", sortValue: (r) => r.type,
      accessor: (r) => (
        <Badge variant="secondary" className="uppercase text-[10px]">{r.type}</Badge>
      ),
    },
    {
      key: "amount", header: "Amount", sortValue: (r) => r.amount,
      accessor: (r) => (
        <span className={`font-semibold tabular-nums ${r.amount < 0 ? "text-destructive" : "text-emerald-500"}`}>
          {r.amount > 0 ? "+" : ""}{r.amount}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Wallet</p>
        <h1 className="text-3xl font-bold tracking-tight">Credits & Usage</h1>
        <p className="text-sm text-muted-foreground">Track every credit spent across AI tools, agents and workflows.</p>
      </motion.header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlowCard className="p-5 md:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Wallet className="w-3.5 h-3.5" /> Current balance
              </div>
              <Coins className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold tabular-nums">{loading ? "—" : balance}</span>
              <span className="text-sm text-muted-foreground">credits</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => toast.info("Top-up coming soon")} className="gap-1.5">
                <Plus className="w-4 h-4" /> Top up
              </Button>
              <Button variant="outline" onClick={() => toast.info("Auto-refill coming soon")}>
                Auto-refill
              </Button>
            </div>
          </div>
        </GlowCard>

        <GlowCard className="p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5" /> Spent (30d)
          </div>
          <div className="mt-2 text-3xl font-bold tabular-nums">{last30}</div>
          <div className="mt-1 text-xs text-muted-foreground">Lifetime: {spent}</div>
        </GlowCard>

        <GlowCard className="p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5" /> Earned
          </div>
          <div className="mt-2 text-3xl font-bold tabular-nums">{earned}</div>
          <div className="mt-1 text-xs text-muted-foreground">Bonuses & top-ups</div>
        </GlowCard>
      </section>

      <GlowCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Usage · last 30 days</h2>
            <p className="text-xs text-muted-foreground">Daily credit consumption</p>
          </div>
        </div>
        <UsageChart txns={transactions} />
      </GlowCard>

      <GlowCard className="p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-semibold">Transaction history</h2>
        </div>
        <div className="px-6 pb-6">
          <ReusableTable
            data={transactions}
            columns={columns}
            rowKey={(r) => r.id}
            loading={loading}
            pageSize={15}
            empty={<div className="py-12 text-center text-sm text-muted-foreground">No transactions yet.</div>}
          />
        </div>
      </GlowCard>
    </div>
  );
}