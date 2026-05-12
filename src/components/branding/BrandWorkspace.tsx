import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Palette, Mic, Target, Calendar, Wand2, Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Brand = {
  id?: string;
  name: string;
  tagline: string | null;
  voice: string | null;
  audience: string | null;
  palette: string[];
  font_pair: string | null;
  style_prompt: string | null;
};

const DEFAULT: Brand = {
  name: "My Brand",
  tagline: "",
  voice: "Confident, modern, slightly playful",
  audience: "Founders, creators, culture-curious 25-35",
  palette: ["#8b5cf6", "#06b6d4", "#f59e0b", "#0f172a"],
  font_pair: "Inter / Space Grotesk",
  style_prompt: "minimal editorial, soft gradients, glassmorphism",
};

export default function BrandWorkspace() {
  const [brand, setBrand] = useState<Brand>(DEFAULT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("brand_profile").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (data) setBrand({
          id: data.id, name: data.name, tagline: data.tagline, voice: data.voice,
          audience: data.audience, font_pair: data.font_pair, style_prompt: data.style_prompt,
          palette: Array.isArray(data.palette) ? (data.palette as string[]) : DEFAULT.palette,
        });
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = { name: brand.name, tagline: brand.tagline, voice: brand.voice, audience: brand.audience, palette: brand.palette, font_pair: brand.font_pair, style_prompt: brand.style_prompt };
    if (brand.id) await supabase.from("brand_profile").update(payload).eq("id", brand.id);
    else {
      const { data } = await supabase.from("brand_profile").insert(payload).select().single();
      if (data) setBrand((b) => ({ ...b, id: data.id }));
    }
    setSaving(false);
    toast.success("Brand workspace saved");
  };

  const setColor = (i: number, color: string) => setBrand((b) => { const p = [...b.palette]; p[i] = color; return { ...b, palette: p }; });
  const stylePromptForStudio = encodeURIComponent(`${brand.style_prompt ?? ""}, palette ${brand.palette.join(", ")}`);

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 border border-border/40 mb-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: `linear-gradient(135deg, ${brand.palette[0]}, ${brand.palette[1] ?? brand.palette[0]})` }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold tracking-tight">Brand Workspace</h2>
              <p className="text-xs text-muted-foreground">Connects identity to Image Studio and Calendar</p>
            </div>
          </div>
          <Button onClick={save} disabled={saving} size="sm" className="bg-gradient-hero text-primary-foreground">
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving" : "Save brand"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="space-y-3">
            <Field label="Brand name"><Input value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} /></Field>
            <Field label="Tagline"><Input value={brand.tagline ?? ""} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} placeholder="One line that says it all" /></Field>
            <Field label="Font pairing"><Input value={brand.font_pair ?? ""} onChange={(e) => setBrand({ ...brand, font_pair: e.target.value })} /></Field>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 inline-flex items-center gap-1.5"><Mic className="w-3 h-3" /> Voice</label>
              <Textarea rows={3} value={brand.voice ?? ""} onChange={(e) => setBrand({ ...brand, voice: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 inline-flex items-center gap-1.5"><Target className="w-3 h-3" /> Audience</label>
              <Textarea rows={2} value={brand.audience ?? ""} onChange={(e) => setBrand({ ...brand, audience: e.target.value })} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1.5 inline-flex items-center gap-1.5"><Palette className="w-3 h-3" /> Palette</label>
              <div className="flex items-center gap-2">
                {brand.palette.map((c, i) => (
                  <label key={i} className="relative cursor-pointer">
                    <input type="color" value={c} onChange={(e) => setColor(i, e.target.value)} className="sr-only" />
                    <div className="w-9 h-9 rounded-xl ring-2 ring-background shadow-sm" style={{ backgroundColor: c }} />
                  </label>
                ))}
              </div>
            </div>
            <Field label="Visual style prompt">
              <Textarea rows={2} value={brand.style_prompt ?? ""} onChange={(e) => setBrand({ ...brand, style_prompt: e.target.value })} placeholder="minimal editorial, soft gradients" />
            </Field>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <BridgeCard icon={Wand2} title="Generate on-brand image" desc="Open Image Studio pre-filled with your style." to={`/dashboard/image-studio?style=${stylePromptForStudio}`} />
          <BridgeCard icon={Calendar} title="Schedule branded post" desc="Drop a post into your calendar with brand context." to="/dashboard" />
          <BridgeCard icon={Sparkles} title="Run Publisher Agent" desc="Let an AI agent plan a week of posts." to="/dashboard/agents" />
        </div>
      </div>
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-medium mb-1 block">{label}</label>{children}</div>;
}
function BridgeCard({ icon: Icon, title, desc, to }: { icon: React.ElementType; title: string; desc: string; to: string }) {
  return (
    <Link to={to} className="group rounded-xl border border-border/40 bg-secondary/40 hover:bg-secondary/70 hover:border-primary/30 p-4 transition-all flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="w-4 h-4" /></div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </div>
      <p className="text-sm font-medium leading-tight">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </Link>
  );
}
