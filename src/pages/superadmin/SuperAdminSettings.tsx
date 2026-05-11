import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GlowCard } from "@/components/ui/glow-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Palette, Cpu, Server, Bell } from "lucide-react";
import { toast } from "sonner";

type Model = { id: string; slug: string; name: string; enabled: boolean };

export default function SuperAdminSettings() {
  const [models, setModels] = useState<Model[]>([]);
  const [defaultModel, setDefaultModel] = useState("google/gemini-3-flash-preview");
  const [signupsOpen, setSignupsOpen] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [brandName, setBrandName] = useState("AI STUDIYO");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("ai_models").select("id,slug,name,enabled").eq("enabled", true);
      setModels((data ?? []) as Model[]);
    })();
  }, []);

  const sections = [
    { id: "branding", label: "Branding" },
    { id: "platform", label: "Platform" },
    { id: "ai", label: "AI defaults" },
    { id: "environment", label: "Environment" },
  ];

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      <AdminPageHeader eyebrow="Settings" title="Platform Settings" description="Branding, platform behaviour and AI defaults." />

      <nav className="flex gap-1 border-b border-border/40 -mx-2 px-2">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-primary border-b-2 border-transparent hover:border-primary/40 transition-colors">
            {s.label}
          </a>
        ))}
      </nav>

      <GlowCard id="branding" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Branding</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Brand name</Label>
            <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
          </div>
          <div>
            <Label>Primary color</Label>
            <Input defaultValue="#F97316" />
          </div>
        </div>
        <Button className="mt-4" onClick={() => toast.success("Branding saved")}>Save branding</Button>
      </GlowCard>

      <GlowCard id="platform" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Platform</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Open sign-ups</div>
              <div className="text-xs text-muted-foreground">Allow new users to register publicly.</div>
            </div>
            <Switch checked={signupsOpen} onCheckedChange={setSignupsOpen} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Maintenance mode</div>
              <div className="text-xs text-muted-foreground">Shows a banner and disables writes.</div>
            </div>
            <Switch checked={maintenance} onCheckedChange={setMaintenance} />
          </div>
        </div>
      </GlowCard>

      <GlowCard id="ai" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">AI defaults</h3>
        </div>
        <div>
          <Label>Default text model</Label>
          <select
            value={defaultModel}
            onChange={(e) => setDefaultModel(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-border/60 bg-background/60 px-3 text-sm"
          >
            {models.map((m) => (<option key={m.id} value={m.slug}>{m.name} · {m.slug}</option>))}
          </select>
          <p className="text-xs text-muted-foreground mt-1.5">Used by new agents and the AI generator by default.</p>
        </div>
      </GlowCard>

      <GlowCard id="environment" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Environment</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="rounded-md border border-border/40 bg-card/40 p-3">
            <div className="text-muted-foreground mb-1">Supabase URL</div>
            <div className="truncate">{import.meta.env.VITE_SUPABASE_URL}</div>
          </div>
          <div className="rounded-md border border-border/40 bg-card/40 p-3">
            <div className="text-muted-foreground mb-1">Project ID</div>
            <div className="truncate">{import.meta.env.VITE_SUPABASE_PROJECT_ID}</div>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}