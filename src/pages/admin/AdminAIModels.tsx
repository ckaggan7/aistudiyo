import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlowCard } from "@/components/ui/glow-card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Cpu } from "lucide-react";

type Provider = { id: string; slug: string; name: string; enabled: boolean; status: string };
type Model = {
  id: string;
  provider_id: string;
  slug: string;
  name: string;
  context_window: number;
  input_cost_per_1k: number;
  output_cost_per_1k: number;
  enabled: boolean;
};

export default function AdminAIModels() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  const load = async () => {
    const [{ data: p }, { data: m }] = await Promise.all([
      supabase.from("ai_providers").select("*").order("name"),
      supabase.from("ai_models").select("*").order("name"),
    ]);
    setProviders((p ?? []) as Provider[]);
    setModels((m ?? []) as Model[]);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleProvider = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from("ai_providers").update({ enabled }).eq("id", id);
    if (error) toast.error(error.message);
    else load();
  };
  const toggleModel = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from("ai_models").update({ enabled }).eq("id", id);
    if (error) toast.error(error.message);
    else load();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <header>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">AI Infrastructure</p>
        <h1 className="text-3xl font-bold tracking-tight">AI Models & Providers</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {providers.map((p) => {
          const list = models.filter((m) => m.provider_id === p.id);
          return (
            <GlowCard key={p.id} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 grid place-items-center text-primary">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">{p.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {list.length} model{list.length === 1 ? "" : "s"} · {p.status}
                    </p>
                  </div>
                </div>
                <Switch checked={p.enabled} onCheckedChange={(v) => toggleProvider(p.id, v)} />
              </div>
              <ul className="space-y-1.5">
                {list.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-accent/40"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {m.context_window.toLocaleString()} ctx · ${m.input_cost_per_1k}/1k in · ${m.output_cost_per_1k}/1k out
                      </div>
                    </div>
                    <Switch
                      checked={m.enabled}
                      onCheckedChange={(v) => toggleModel(m.id, v)}
                    />
                  </li>
                ))}
              </ul>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
}