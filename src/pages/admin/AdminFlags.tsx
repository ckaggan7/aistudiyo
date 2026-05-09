import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlowCard } from "@/components/ui/glow-card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Flag } from "lucide-react";
import { toast } from "sonner";

type Flag = { id: string; key: string; description: string | null; enabled: boolean; rollout_pct: number };

export default function AdminFlags() {
  const [flags, setFlags] = useState<Flag[]>([]);

  const load = async () => {
    const { data } = await supabase.from("feature_flags").select("*").order("key");
    setFlags((data ?? []) as Flag[]);
  };
  useEffect(() => {
    load();
  }, []);

  const update = async (id: string, patch: Partial<Flag>) => {
    const { error } = await supabase.from("feature_flags").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else load();
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <header>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Feature Flags</p>
        <h1 className="text-3xl font-bold tracking-tight">Rollout Controls</h1>
      </header>
      <div className="space-y-3">
        {flags.map((f) => (
          <GlowCard key={f.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary/10 grid place-items-center text-primary shrink-0">
                  <Flag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-sm font-medium">{f.key}</div>
                  <div className="text-xs text-muted-foreground">{f.description ?? "—"}</div>
                </div>
              </div>
              <Switch checked={f.enabled} onCheckedChange={(v) => update(f.id, { enabled: v })} />
            </div>
            <div className="mt-4 pl-12">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Rollout</span>
                <span className="font-mono">{f.rollout_pct}%</span>
              </div>
              <Slider
                value={[f.rollout_pct]}
                onValueChange={([v]) => setFlags((arr) => arr.map((x) => (x.id === f.id ? { ...x, rollout_pct: v } : x)))}
                onValueCommit={([v]) => update(f.id, { rollout_pct: v })}
                max={100}
                step={5}
                disabled={!f.enabled}
              />
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}