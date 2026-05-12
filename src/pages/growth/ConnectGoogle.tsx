import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plug } from "lucide-react";
import GrowthPageShell from "@/components/growth/GrowthPageShell";
import { CONNECT_SERVICES, isGrowthConnected, setGrowthConnected } from "@/lib/growth/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ConnectGoogle() {
  const [connected, setConnected] = useState<Record<string, boolean>>(() => {
    const all = isGrowthConnected();
    return Object.fromEntries(CONNECT_SERVICES.map((s) => [s.id, all]));
  });

  function toggle(id: string) {
    setConnected((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const anyOn = Object.values(next).some(Boolean);
      setGrowthConnected(anyOn);
      return next;
    });
    toast({ title: connected[id] ? "Disconnected" : "Connected", description: id });
  }

  return (
    <GrowthPageShell title="Connect your Google Account" subtitle="Plug in once — AI handles the rest. (Mock connect in this demo build.)">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CONNECT_SERVICES.map((s, i) => {
          const on = connected[s.id];
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", on ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-primary")}>
                  {on ? <Check className="w-4 h-4" /> : <Plug className="w-4 h-4" />}
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", on ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground")}>
                  {on ? "Connected" : "Not connected"}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
              </div>
              <button
                onClick={() => toggle(s.id)}
                className={cn(
                  "mt-3 w-full px-3 py-2 rounded-xl text-sm font-medium",
                  on ? "bg-white border border-border text-foreground hover:bg-muted/50" : "bg-gradient-hero text-primary-foreground shadow-glow",
                )}
              >
                {on ? "Disconnect" : "Connect"}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-4 rounded-2xl border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
        This is a mock connect flow for the demo. Real Google OAuth (Analytics, Ads, Business Profile, YouTube, Search Console) can be wired up in a follow-up — let us know when you're ready.
      </div>
    </GrowthPageShell>
  );
}