import { Users, Activity, Coins, CircleDollarSign, Building2, Cpu, HardDrive, Bell } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { GlowCard } from "@/components/ui/glow-card";

const sample = (n: number) => Array.from({ length: 12 }, (_, i) => Math.round(n * (0.6 + Math.random() * 0.6) + i));

export default function AdminOverview() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Super Admin</p>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time pulse of users, AI usage, revenue and system health.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Users" value="—" icon={Users} spark={sample(120)} delta={12.4} />
        <StatsCard label="Active Users" value="—" icon={Activity} spark={sample(80)} delta={3.1} />
        <StatsCard label="AI Requests" value="—" icon={Cpu} spark={sample(200)} delta={18.7} />
        <StatsCard label="Revenue" value="$—" icon={CircleDollarSign} spark={sample(60)} delta={8.2} />
        <StatsCard label="Credits Consumed" value="—" icon={Coins} spark={sample(150)} delta={-4.5} />
        <StatsCard label="Workspaces" value="—" icon={Building2} spark={sample(20)} delta={2.0} />
        <StatsCard label="Storage" value="—" icon={HardDrive} spark={sample(40)} delta={1.4} />
        <StatsCard label="Notifications" value="—" icon={Bell} spark={sample(30)} delta={0} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlowCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">AI Activity</h2>
              <p className="text-xs text-muted-foreground">Requests across the platform</p>
            </div>
          </div>
          <div className="h-56 rounded-xl border border-dashed border-border/60 grid place-items-center text-xs text-muted-foreground">
            Charts coming next phase
          </div>
        </GlowCard>

        <GlowCard className="p-6">
          <h2 className="text-lg font-semibold mb-1">System Health</h2>
          <p className="text-xs text-muted-foreground mb-4">All services nominal</p>
          <ul className="space-y-2 text-sm">
            {["API Gateway", "Auth", "Database", "Storage", "AI Gateway"].map((s) => (
              <li key={s} className="flex items-center justify-between">
                <span className="text-muted-foreground">{s}</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.500)]" />
                  <span className="text-xs">Healthy</span>
                </span>
              </li>
            ))}
          </ul>
        </GlowCard>
      </section>
    </div>
  );
}