import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Sparkles, Globe, Instagram, Linkedin, Twitter, Youtube, Upload, Loader2,
  Palette, Type, Image as ImageIcon, Phone, Mail, MapPin, Hash, Wand2, X, Send,
  CheckCircle2, FileText, MessageCircle, ChevronRight, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AIGenerator from "./AIGenerator";

/* ───────────────────────── Types ───────────────────────── */
type Source = { id: string; kind: "website" | "social" | "file"; value: string; name?: string; platform?: string };
type Memory = {
  tone?: string; audience?: string; voice?: string; style_prompt?: string;
  palette?: string[]; keywords?: string[]; cta_style?: string; hashtags?: string[];
  content_strategy?: string; visual_personality?: string; communication_style?: string;
};
type Score = { tone?: number; cta?: number; visual?: number; audience?: number };
type Brand = {
  id?: string; name: string; tagline?: string | null; voice?: string | null;
  audience?: string | null; palette: string[]; font_pair?: string | null; style_prompt?: string | null;
  logo_url?: string | null; category?: string | null; phone?: string | null; email?: string | null;
  website?: string | null; address?: string | null; socials?: Record<string, string>;
  memory?: Memory; score?: Score; sources?: Source[];
};

const DEFAULT: Brand = {
  name: "My Brand",
  palette: ["#FF6B35", "#7C3AED", "#06B6D4", "#0F172A"],
  socials: {},
  memory: {},
  score: {},
  sources: [],
};

/* ───────────────────────── Page ───────────────────────── */
export default function BrandStudio() {
  const [brand, setBrand] = useState<Brand>(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    supabase.from("brand_profile").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setBrand({
            ...DEFAULT, ...data,
            palette: Array.isArray(data.palette) ? (data.palette as string[]) : DEFAULT.palette,
            socials: (data as { socials?: Record<string, string> }).socials ?? {},
            memory: (data as { memory?: Memory }).memory ?? {},
            score: (data as { score?: Score }).score ?? {},
            sources: ((data as { sources?: Source[] }).sources) ?? [],
          });
        }
        setLoaded(true);
      });
  }, []);

  const persist = async (next: Partial<Brand>) => {
    const merged = { ...brand, ...next };
    setBrand(merged);
    const payload = {
      name: merged.name, tagline: merged.tagline, voice: merged.voice, audience: merged.audience,
      palette: merged.palette, font_pair: merged.font_pair, style_prompt: merged.style_prompt,
      logo_url: merged.logo_url, category: merged.category, phone: merged.phone, email: merged.email,
      website: merged.website, address: merged.address, socials: merged.socials ?? {},
      memory: merged.memory ?? {}, score: merged.score ?? {}, sources: merged.sources ?? [],
    };
    if (merged.id) {
      await supabase.from("brand_profile").update(payload).eq("id", merged.id);
    } else {
      const { data } = await supabase.from("brand_profile").insert(payload).select().single();
      if (data) setBrand((b) => ({ ...b, id: data.id }));
    }
  };

  const runScan = async () => {
    if (!brand.sources?.length && !brand.website) {
      toast.error("Add a website, social link, or file first");
      return;
    }
    setScanning(true);
    try {
      // Save to ensure we have an ID
      if (!brand.id) await persist({});
      const { data, error } = await supabase.functions.invoke("brand-scan", {
        body: { brand_id: brand.id, sources: brand.sources ?? [], notes: brand.tagline ?? "" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const memory: Memory = data.memory ?? {};
      const score: Score = data.score ?? {};
      await persist({
        memory, score,
        voice: memory.voice ?? brand.voice,
        audience: memory.audience ?? brand.audience,
        style_prompt: memory.style_prompt ?? brand.style_prompt,
        palette: (memory.palette && memory.palette.length ? memory.palette : brand.palette),
      });
      toast.success("Brand brain trained");
    } catch (e: unknown) {
      toast.error((e as Error).message || "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  if (!loaded) return <div className="p-8 text-muted-foreground text-sm animate-pulse">Loading Brand AI Studio…</div>;

  return (
    <div className="relative max-w-7xl mx-auto pb-24">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-40 right-0 w-[380px] h-[380px] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative space-y-5">
        <BrandBrainHero brand={brand} scanning={scanning} onScan={runScan} />
        <SourcesAndUploads brand={brand} onChange={persist} />

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><VisualIdentityHub brand={brand} onChange={persist} /></div>
          <BrandScoreRing score={brand.score ?? {}} />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><BusinessIdentityCard brand={brand} onChange={persist} /></div>
          <BrandMemoryPanel memory={brand.memory ?? {}} />
        </div>

        <BrandAISuggestionsFeed memory={brand.memory ?? {}} />

        {/* Embedded generator */}
        <section className="card-bento">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Section 3</p>
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Wand2 className="w-5 h-5 text-primary" /> Content Generator</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Brand-aware. Trained on your AI brand brain.</p>
            </div>
          </div>
          <div className="rounded-2xl bg-background/40 p-2 md:p-3">
            <AIGenerator />
          </div>
        </section>
      </div>

      {/* Floating assistant trigger */}
      <button
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-hero shadow-glow flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform"
        aria-label="Open Brand AI Assistant"
      >
        <Brain className="w-6 h-6" />
      </button>
      <BrandAIAssistant open={showAssistant} onClose={() => setShowAssistant(false)} brand={brand} />
    </div>
  );
}

/* ───────────────────────── Hero ───────────────────────── */
function BrandBrainHero({ brand, scanning, onScan }: { brand: Brand; scanning: boolean; onScan: () => void }) {
  const trained = !!(brand.memory?.tone || brand.memory?.audience);
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card via-card to-secondary/30 p-6 md:p-8"
    >
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(80%_60%_at_20%_0%,hsl(var(--primary)/0.18),transparent_60%),radial-gradient(60%_50%_at_100%_100%,hsl(var(--accent)/0.18),transparent_60%)]" />
      <div className="relative flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-primary font-semibold mb-3">
            <Sparkles className="w-3 h-3" /> Brand AI Studio
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Train Your <span className="bg-clip-text text-transparent bg-gradient-hero">AI Brand Brain</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
            Help AI understand your brand, tone, audience, visual identity, and business — so every generation stays on-brand.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <BrainOrb scanning={scanning} trained={trained} />
          <Button onClick={onScan} disabled={scanning} className="bg-gradient-hero text-primary-foreground shadow-glow">
            {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Brain className="w-4 h-4" /> Analyze Brand</>}
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

function BrainOrb({ scanning, trained }: { scanning: boolean; trained: boolean }) {
  return (
    <div className="relative w-24 h-24">
      <div className={`absolute inset-0 rounded-full bg-gradient-hero blur-xl ${scanning ? "opacity-80 animate-pulse" : trained ? "opacity-60" : "opacity-30"}`} />
      <div className="relative w-full h-full rounded-full bg-card border border-border/60 flex items-center justify-center shadow-elevated">
        <Brain className={`w-10 h-10 ${trained ? "text-primary" : "text-muted-foreground"}`} />
        {scanning && <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />}
      </div>
    </div>
  );
}

/* ───────────────── Sources + Uploads ───────────────── */
const SOCIALS = [
  { id: "instagram", icon: Instagram, label: "Instagram", placeholder: "instagram.com/handle" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn", placeholder: "linkedin.com/in/you" },
  { id: "twitter", icon: Twitter, label: "X / Twitter", placeholder: "x.com/handle" },
  { id: "youtube", icon: Youtube, label: "YouTube", placeholder: "youtube.com/@channel" },
] as const;

function SourcesAndUploads({ brand, onChange }: { brand: Brand; onChange: (n: Partial<Brand>) => void }) {
  const [website, setWebsite] = useState(brand.website ?? "");
  const [socialDraft, setSocialDraft] = useState<Record<string, string>>({ ...(brand.socials ?? {}) });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sources = brand.sources ?? [];

  const addSource = (s: Source) => {
    const next = [...sources.filter((x) => x.value !== s.value), s];
    onChange({ sources: next });
  };
  const removeSource = (id: string) => onChange({ sources: sources.filter((s) => s.id !== id) });

  const saveWebsite = () => {
    if (!website.trim()) return;
    onChange({ website });
    addSource({ id: `web-${Date.now()}`, kind: "website", value: website, name: website });
  };
  const saveSocial = (platform: string) => {
    const value = socialDraft[platform];
    if (!value?.trim()) return;
    onChange({ socials: { ...(brand.socials ?? {}), [platform]: value } });
    addSource({ id: `${platform}-${Date.now()}`, kind: "social", value, name: value, platform });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes?.user?.id;
    if (!uid) { toast.error("Sign in to upload"); return; }
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        const path = `${uid}/${Date.now()}-${f.name.replace(/[^\w.-]+/g, "_")}`;
        const { error } = await supabase.storage.from("brand-assets").upload(path, f);
        if (error) throw error;
        const { data } = supabase.storage.from("brand-assets").getPublicUrl(path);
        addSource({ id: `file-${Date.now()}-${f.name}`, kind: "file", value: data.publicUrl, name: f.name });
        if (brand.id) {
          await supabase.from("brand_assets").insert({ user_id: uid, brand_id: brand.id, kind: "document", name: f.name, url: data.publicUrl });
        }
      }
      toast.success("Files attached");
    } catch (e: unknown) {
      toast.error((e as Error).message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="grid lg:grid-cols-2 gap-5">
      {/* Connect sources */}
      <div className="card-bento">
        <div className="mb-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Connect</p>
          <h3 className="text-lg font-semibold tracking-tight">Brand sources</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-stretch gap-2">
            <div className="flex items-center gap-2 px-3 rounded-xl border border-border/60 bg-secondary/40 text-muted-foreground text-xs font-medium">
              <Globe className="w-4 h-4 text-primary" /> Website
            </div>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourbrand.com" className="flex-1" />
            <Button onClick={saveWebsite} variant="outline" size="sm">Add</Button>
          </div>
          {SOCIALS.map((s) => (
            <div key={s.id} className="flex items-stretch gap-2">
              <div className="flex items-center gap-2 px-3 rounded-xl border border-border/60 bg-secondary/40 text-muted-foreground text-xs font-medium min-w-[120px]">
                <s.icon className="w-4 h-4 text-primary" /> {s.label}
              </div>
              <Input value={socialDraft[s.id] ?? ""} onChange={(e) => setSocialDraft({ ...socialDraft, [s.id]: e.target.value })} placeholder={s.placeholder} className="flex-1" />
              <Button onClick={() => saveSocial(s.id)} variant="outline" size="sm">Add</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div className="card-bento">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Upload</p>
            <h3 className="text-lg font-semibold tracking-tight">Brand documents</h3>
          </div>
          {uploading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>
        <label
          htmlFor="brand-files"
          className="block border-2 border-dashed border-border/60 rounded-2xl p-6 text-center hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <Upload className="w-7 h-7 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium">Drop PDFs, decks, brand guidelines</p>
          <p className="text-xs text-muted-foreground mt-0.5">PDF, DOC, DOCX, PPT, ChatGPT/Gemini exports</p>
          <input
            id="brand-files"
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.json"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>

        {sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-secondary/60 text-foreground border border-border/60">
                {s.kind === "file" ? <FileText className="w-3 h-3" /> : s.kind === "social" ? <Hash className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                <span className="max-w-[160px] truncate">{s.name || s.value}</span>
                <button onClick={() => removeSource(s.id)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────── Visual Identity ───────────────── */
function VisualIdentityHub({ brand, onChange }: { brand: Brand; onChange: (n: Partial<Brand>) => void }) {
  const [logoUploading, setLogoUploading] = useState(false);

  const setColor = (i: number, color: string) => {
    const p = [...(brand.palette ?? [])];
    p[i] = color;
    onChange({ palette: p });
  };
  const addColor = () => onChange({ palette: [...(brand.palette ?? []), "#888888"] });

  const uploadLogo = async (file: File) => {
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes?.user?.id;
    if (!uid) { toast.error("Sign in to upload"); return; }
    setLogoUploading(true);
    try {
      const path = `${uid}/logo-${Date.now()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
      const { error } = await supabase.storage.from("brand-assets").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("brand-assets").getPublicUrl(path);
      onChange({ logo_url: data.publicUrl });
      toast.success("Logo updated");
    } catch (e) {
      toast.error((e as Error).message || "Logo upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

  return (
    <section className="card-bento">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Visual identity</p>
        <h3 className="text-lg font-semibold tracking-tight">Identity hub</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Logo */}
        <div>
          <label className="text-xs font-medium mb-2 inline-flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Logo</label>
          <label className="block aspect-square max-w-[160px] rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/60 cursor-pointer overflow-hidden bg-secondary/30 flex items-center justify-center transition-all">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt="Brand logo" className="w-full h-full object-contain" />
            ) : logoUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <div className="text-center text-muted-foreground text-xs p-4"><Upload className="w-5 h-5 mx-auto mb-1" />Upload logo</div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
          </label>
        </div>

        {/* Palette + Fonts */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-2 inline-flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> AI brand palette</label>
            <div className="flex items-center gap-2 flex-wrap">
              {(brand.palette ?? []).map((c, i) => (
                <label key={i} className="relative cursor-pointer group">
                  <input type="color" value={c} onChange={(e) => setColor(i, e.target.value)} className="sr-only" />
                  <div className="w-10 h-10 rounded-xl ring-2 ring-background shadow-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: c }} />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{c}</span>
                </label>
              ))}
              <button onClick={addColor} className="w-10 h-10 rounded-xl border-2 border-dashed border-border/60 text-muted-foreground hover:border-primary hover:text-primary text-lg">+</button>
            </div>
            <div className="mt-4 h-12 rounded-xl" style={{ background: `linear-gradient(135deg, ${(brand.palette ?? []).join(", ")})` }} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 inline-flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Fonts</label>
            <Input value={brand.font_pair ?? ""} onChange={(e) => onChange({ font_pair: e.target.value })} placeholder="Inter / Space Grotesk" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 inline-flex items-center gap-1.5"><Wand2 className="w-3.5 h-3.5" /> Visual style prompt</label>
            <Textarea rows={2} value={brand.style_prompt ?? ""} onChange={(e) => onChange({ style_prompt: e.target.value })} placeholder="minimal editorial, soft gradients, glassmorphism" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Score Ring ───────────────── */
function BrandScoreRing({ score }: { score: Score }) {
  const total = useMemo(() => {
    const v = [score.tone, score.cta, score.visual, score.audience].filter((x): x is number => typeof x === "number");
    return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0;
  }, [score]);
  const r = 56;
  const circ = 2 * Math.PI * r;
  const dash = (total / 100) * circ;

  return (
    <section className="card-bento h-full flex flex-col">
      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Brand score</p>
        <h3 className="text-lg font-semibold tracking-tight">Consistency</h3>
      </div>
      <div className="flex items-center justify-center my-3">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            <circle cx="70" cy="70" r={r} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
            <circle cx="70" cy="70" r={r} stroke="hsl(var(--primary))" strokeWidth="10" fill="none"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{total}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>
      <div className="space-y-1.5 mt-auto">
        {[
          { k: "Tone", v: score.tone },
          { k: "CTA quality", v: score.cta },
          { k: "Visual", v: score.visual },
          { k: "Audience", v: score.audience },
        ].map((r) => (
          <div key={r.k} className="flex items-center gap-2 text-xs">
            <span className="w-20 text-muted-foreground">{r.k}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-hero" style={{ width: `${r.v ?? 0}%` }} />
            </div>
            <span className="w-8 text-right font-medium">{r.v ?? 0}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────── Business Card ───────────────── */
function BusinessIdentityCard({ brand, onChange }: { brand: Brand; onChange: (n: Partial<Brand>) => void }) {
  return (
    <section className="card-bento">
      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Business</p>
        <h3 className="text-lg font-semibold tracking-tight">Identity card</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Brand name"><Input value={brand.name} onChange={(e) => onChange({ name: e.target.value })} /></Field>
        <Field label="Category"><Input value={brand.category ?? ""} onChange={(e) => onChange({ category: e.target.value })} placeholder="SaaS · Cafe · Coach…" /></Field>
        <Field label="Tagline"><Input value={brand.tagline ?? ""} onChange={(e) => onChange({ tagline: e.target.value })} /></Field>
        <Field label={<span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" /> Website</span>}><Input value={brand.website ?? ""} onChange={(e) => onChange({ website: e.target.value })} /></Field>
        <Field label={<span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span>}><Input value={brand.email ?? ""} onChange={(e) => onChange({ email: e.target.value })} /></Field>
        <Field label={<span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</span>}><Input value={brand.phone ?? ""} onChange={(e) => onChange({ phone: e.target.value })} /></Field>
        <Field label={<span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</span>}><Input value={brand.address ?? ""} onChange={(e) => onChange({ address: e.target.value })} /></Field>
        <Field label="Audience"><Input value={brand.audience ?? ""} onChange={(e) => onChange({ audience: e.target.value })} placeholder="Founders 25-35" /></Field>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return <div><label className="text-[11px] font-medium text-muted-foreground mb-1 block">{label}</label>{children}</div>;
}

/* ───────────────── Brand Memory ───────────────── */
function BrandMemoryPanel({ memory }: { memory: Memory }) {
  const items: { k: string; v?: string | string[] }[] = [
    { k: "Tone", v: memory.tone },
    { k: "Voice", v: memory.voice },
    { k: "Audience", v: memory.audience },
    { k: "CTA style", v: memory.cta_style },
    { k: "Visual personality", v: memory.visual_personality },
    { k: "Communication", v: memory.communication_style },
    { k: "Hashtags", v: memory.hashtags },
    { k: "Keywords", v: memory.keywords },
  ];
  return (
    <section className="card-bento h-full">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Persistent</p>
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-1.5"><Brain className="w-4 h-4 text-primary" /> Brand memory</h3>
        </div>
        <span className="text-[10px] text-primary font-medium">Auto-applied</span>
      </div>
      {items.every((i) => !i.v || (Array.isArray(i.v) && !i.v.length)) ? (
        <p className="text-xs text-muted-foreground italic">Run "Analyze Brand" to populate AI memory.</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((i) => i.v && (Array.isArray(i.v) ? i.v.length : true) ? (
            <div key={i.k}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">{i.k}</p>
              {Array.isArray(i.v) ? (
                <div className="flex flex-wrap gap-1">
                  {i.v.slice(0, 12).map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 border border-border/40">{t}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-foreground/80 leading-relaxed">{i.v}</p>
              )}
            </div>
          ) : null)}
        </div>
      )}
    </section>
  );
}

/* ───────────────── Suggestions Feed ───────────────── */
function BrandAISuggestionsFeed({ memory }: { memory: Memory }) {
  const suggestions = [
    memory.audience ? `Your audience (${memory.audience.split(" ").slice(0, 6).join(" ")}…) responds well to storytelling hooks.` : "Add brand audience for sharper recommendations.",
    memory.cta_style ? `Lean on your "${memory.cta_style.slice(0, 40)}…" CTA style for higher conversion.` : "Define a CTA style — short, action-driven CTAs convert 2x.",
    memory.visual_personality ? `Educational reels in your "${memory.visual_personality.split(" ").slice(0, 4).join(" ")}…" style are trending.` : "Try educational reels — they're trending in your niche.",
    "Carousels with 5-7 slides outperform single posts by ~28% this month.",
  ];
  return (
    <section className="card-bento">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">AI</p>
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-primary" /> Recommendations</h3>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {suggestions.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border/40 bg-secondary/40 p-3 flex items-start gap-2 hover:bg-secondary/70 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-foreground/80 leading-relaxed">{s}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────── Floating Assistant ───────────────── */
function BrandAIAssistant({ open, onClose, brand }: { open: boolean; onClose: () => void; brand: Brand }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi — I'm your Brand AI Assistant. Ask me about tone, campaigns, copy, or inconsistencies." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("brand-assistant", {
        body: { messages: next, brand },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages([...next, { role: "assistant", content: data.reply || "(no reply)" }]);
    } catch (e) {
      setMessages([...next, { role: "assistant", content: `⚠️ ${(e as Error).message || "Failed"}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 z-40" onClick={onClose} />
          <motion.aside
            initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-card border-l border-border z-50 flex flex-col shadow-elevated"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Brand AI Assistant</p>
                  <p className="text-[10px] text-muted-foreground">Trained on your brand brain</p>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-gradient-hero text-primary-foreground" : "bg-secondary/60"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Thinking…</div>}
            </div>

            <div className="p-3 border-t border-border flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about tone, campaigns, copy…"
                className="flex-1"
              />
              <Button onClick={send} disabled={loading || !input.trim()} size="sm" className="bg-gradient-hero text-primary-foreground">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}