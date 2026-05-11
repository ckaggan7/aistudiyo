import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CompactStatsCard } from "@/components/admin/CompactStatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlowCard } from "@/components/ui/glow-card";
import { CircleDollarSign, Coins, FileText, Users } from "lucide-react";
import SuperAdminCredits from "./SuperAdminCredits";

export default function SuperAdminBilling() {
  const [planCounts, setPlanCounts] = useState<Record<string, number>>({});
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: ws } = await supabase.from("workspaces").select("plan,credits");
      const counts: Record<string, number> = {};
      let credits = 0;
      (ws ?? []).forEach((w: any) => {
        counts[w.plan] = (counts[w.plan] ?? 0) + 1;
        credits += w.credits ?? 0;
      });
      setPlanCounts(counts);
      setTotalCredits(credits);
    })();
  }, []);

  const plans = Object.entries(planCounts);
  const paidWorkspaces = (planCounts["pro"] ?? 0) + (planCounts["business"] ?? 0) + (planCounts["enterprise"] ?? 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <AdminPageHeader eyebrow="Billing" title="Revenue & Plans" description="Subscriptions, invoices and credit consumption." />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CompactStatsCard label="MRR" value="$0" hint="connect billing provider" icon={CircleDollarSign} />
        <CompactStatsCard label="Paid workspaces" value={paidWorkspaces} icon={Users} />
        <CompactStatsCard label="Total credits" value={totalCredits.toLocaleString()} icon={Coins} />
        <CompactStatsCard label="Invoices 30d" value={0} icon={FileText} />
      </section>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <GlowCard className="p-8 grid place-items-center text-center">
            <CircleDollarSign className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold">Connect a billing provider</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              MRR, payment trends and workspace revenue will appear here once Stripe or Paddle is enabled.
            </p>
          </GlowCard>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-4">
          <GlowCard className="p-6">
            <h3 className="text-sm font-semibold mb-4">Plan distribution</h3>
            {plans.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workspaces yet.</p>
            ) : (
              <div className="space-y-3">
                {plans.map(([plan, n]) => {
                  const total = plans.reduce((s, [, v]) => s + v, 0);
                  const pct = total ? (n / total) * 100 : 0;
                  return (
                    <div key={plan}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="uppercase tracking-wider font-medium">{plan}</span>
                        <span className="text-muted-foreground tabular-nums">{n} · {pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full bg-gradient-hero" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlowCard>
        </TabsContent>

        <TabsContent value="credits" className="mt-4">
          <SuperAdminCredits />
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <GlowCard className="p-8 grid place-items-center text-center">
            <FileText className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold">No invoices yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Invoices will appear once a billing provider is connected.</p>
          </GlowCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}