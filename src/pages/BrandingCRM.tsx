import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Plus, Palette, Type, Image as ImageIcon, FileText, Users,
  MoreHorizontal, ArrowLeft, Download, Copy, Edit3, Calendar, TrendingUp,
  Instagram, Linkedin, Twitter, Globe, Mail, Phone, MapPin, Sparkles, Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Squiggle, StarDoodle, SpiralDoodle } from "@/components/Doodles";
import { toast } from "sonner";
import BrandWorkspace from "@/components/branding/BrandWorkspace";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

type Brand = {
  id: string;
  name: string;
  industry: string;
  logo: string;
  colors: string[];
  fonts: { heading: string; body: string };
  voice: string;
  tagline: string;
  posts: number;
  status: "Active" | "Draft";
  socials: { platform: string; handle: string; followers: string }[];
  contact: { email: string; phone: string; location: string };
  guidelines: string;
  hashtags: string[];
  recentPosts: { title: string; platform: string; date: string; engagement: string }[];
};

const initialBrands: Brand[] = [
  {
    id: "b1",
    name: "Nimbus Coffee",
    industry: "F&B · Cafe",
    logo: "☕",
    colors: ["#D97706", "#92400E", "#FEF3C7", "#1F2937"],
    fonts: { heading: "Playfair Display", body: "Inter" },
    voice: "Warm, inviting, slightly poetic. Speaks to slow mornings and meaningful pauses.",
    tagline: "Brewed for the in-between moments.",
    posts: 24,
    status: "Active",
    socials: [
      { platform: "Instagram", handle: "@nimbus.coffee", followers: "12.4K" },
      { platform: "Twitter", handle: "@nimbusbrews", followers: "3.1K" },
    ],
    contact: { email: "hello@nimbuscoffee.com", phone: "+91 98765 43210", location: "Tirupati, AP" },
    guidelines: "Always use the cream backdrop. Never combine more than 2 brand colors. Logo clear-space = logo height.",
    hashtags: ["#NimbusBrews", "#SlowSips", "#CoffeeRitual", "#TirupatiCafe"],
    recentPosts: [
      { title: "Morning ritual reel", platform: "Instagram", date: "2d ago", engagement: "+18%" },
      { title: "New seasonal menu", platform: "Instagram", date: "5d ago", engagement: "+24%" },
      { title: "Barista spotlight", platform: "Twitter", date: "1w ago", engagement: "+9%" },
    ],
  },
  {
    id: "b2",
    name: "Lumen Studio",
    industry: "Design · Agency",
    logo: "✨",
    colors: ["#8B5CF6", "#EC4899", "#FFFFFF", "#0F172A"],
    fonts: { heading: "Space Grotesk", body: "Inter" },
    voice: "Confident, modern, occasionally cheeky. Speaks the language of founders and creatives.",
    tagline: "Design that moves the needle.",
    posts: 56,
    status: "Active",
    socials: [
      { platform: "Instagram", handle: "@lumen.studio", followers: "28.7K" },
      { platform: "LinkedIn", handle: "/lumen-studio", followers: "9.2K" },
    ],
    contact: { email: "studio@lumen.co", phone: "+91 99887 76655", location: "Bengaluru, KA" },
    guidelines: "Gradient is hero. Typography is loud. Whitespace is non-negotiable.",
    hashtags: ["#LumenWorks", "#DesignThatShips", "#BrandStudio", "#CreativeAgency"],
    recentPosts: [
      { title: "Case study: Fintech rebrand", platform: "LinkedIn", date: "1d ago", engagement: "+42%" },
      { title: "Behind the scenes carousel", platform: "Instagram", date: "4d ago", engagement: "+31%" },
    ],
  },
  {
    id: "b3",
    name: "Verde Wellness",
    industry: "Health · Lifestyle",
    logo: "🌿",
    colors: ["#10B981", "#065F46", "#ECFDF5", "#1F2937"],
    fonts: { heading: "DM Serif Display", body: "Inter" },
    voice: "Calm, grounded, knowledgeable. Educates without lecturing.",
    tagline: "Small habits. Big shifts.",
    posts: 12,
    status: "Draft",
    socials: [{ platform: "Instagram", handle: "@verde.wellness", followers: "4.8K" }],
    contact: { email: "team@verdewellness.in", phone: "+91 90909 80808", location: "Hyderabad, TS" },
    guidelines: "Earth tones only. Photography over illustration. Never use stock smiles.",
    hashtags: ["#VerdeLife", "#MindfulLiving", "#WellnessDaily"],
    recentPosts: [{ title: "Morning mobility flow", platform: "Instagram", date: "3d ago", engagement: "+12%" }],
  },
];

export default function BrandingCRM() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", industry: "", logo: "🎯", tagline: "" });

  const selected = brands.find((b) => b.id === selectedId) ?? null;

  const handleCreate = () => {
    if (!newBrand.name.trim()) return toast.error("Brand name is required");
    const b: Brand = {
      id: `b${Date.now()}`,
      name: newBrand.name,
      industry: newBrand.industry || "Uncategorized",
      logo: newBrand.logo || "🎯",
      colors: ["#F97316", "#7C3AED", "#FFFFFF", "#0F172A"],
      fonts: { heading: "Inter", body: "Inter" },
      voice: "Define your brand voice…",
      tagline: newBrand.tagline,
      posts: 0,
      status: "Draft",
      socials: [],
      contact: { email: "", phone: "", location: "" },
      guidelines: "",
      hashtags: [],
      recentPosts: [],
    };
    setBrands((p) => [b, ...p]);
    setShowNew(false);
    setNewBrand({ name: "", industry: "", logo: "🎯", tagline: "" });
    toast.success(`${b.name} added to portfolio`);
    setSelectedId(b.id);
  };

  const updateSelected = (patch: Partial<Brand>) => {
    if (!selected) return;
    setBrands((p) => p.map((b) => (b.id === selected.id ? { ...b, ...patch } : b)));
  };

  if (selected) return <BrandDetail brand={selected} onBack={() => setSelectedId(null)} onUpdate={updateSelected} />;

  return (
    <div className="relative">
      <div className="absolute -top-2 right-20 hidden md:block opacity-60">
        <StarDoodle className="w-10 h-10 text-primary" />
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-purple-glow">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Branding CRM</h1>
            <p className="text-sm text-muted-foreground">Manage every brand, asset, and client in one place</p>
          </div>
        </div>
        <Button onClick={() => setShowNew(true)} className="bg-gradient-hero text-primary-foreground hover:opacity-90 rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> New Brand
        </Button>
      </motion.div>

      <BrandWorkspace />

      {/* Asset summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Palette, label: "Color Palettes", count: brands.reduce((s, b) => s + b.colors.length, 0) },
          { icon: Type, label: "Typography", count: brands.length * 2 },
          { icon: ImageIcon, label: "Logo Files", count: brands.length },
          { icon: FileText, label: "Brand Guidelines", count: brands.filter((b) => b.guidelines).length },
        ].map((asset, i) => (
          <motion.div
            key={asset.label}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 1}
            className="bg-card rounded-2xl p-5 shadow-card border border-border/40 hover:shadow-elevated transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-soft flex items-center justify-center mb-3">
              <asset.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{asset.count}</p>
            <p className="text-sm text-muted-foreground">{asset.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Brand cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Brand Portfolio</h2>
        <span className="text-xs text-muted-foreground">{brands.length} brands</span>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {brands.map((brand, i) => (
          <motion.button
            key={brand.id}
            onClick={() => setSelectedId(brand.id)}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 5}
            className="text-left bg-card rounded-2xl p-5 shadow-card border border-border/40 hover:shadow-elevated hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-soft flex items-center justify-center text-3xl">{brand.logo}</div>
              <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-5 h-5" />
              </span>
            </div>
            <h3 className="font-semibold text-base mb-1">{brand.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{brand.industry}</p>

            <div className="flex items-center gap-1.5 mb-4">
              {brand.colors.slice(0, 4).map((color, idx) => (
                <div key={idx} className="w-6 h-6 rounded-full ring-2 ring-background shadow-sm" style={{ backgroundColor: color }} />
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5" /> {brand.posts} posts
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${brand.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                {brand.status}
              </span>
            </div>
          </motion.button>
        ))}

        <motion.button
          onClick={() => setShowNew(true)}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={brands.length + 5}
          className="rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all p-5 flex flex-col items-center justify-center text-center min-h-[260px] group"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <p className="font-semibold text-sm">Add New Brand</p>
          <p className="text-xs text-muted-foreground mt-1">Set up identity & guidelines</p>
        </motion.button>
      </div>

      {/* New Brand modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowNew(false)}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-md shadow-elevated border border-border/40"
            >
              <h3 className="text-lg font-bold mb-1">Create a new brand</h3>
              <p className="text-sm text-muted-foreground mb-5">You can refine all identity details after creation.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">Logo emoji</label>
                  <Input value={newBrand.logo} onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })} maxLength={2} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Brand name</label>
                  <Input value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} placeholder="e.g. Aurora Skincare" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Industry</label>
                  <Input value={newBrand.industry} onChange={(e) => setNewBrand({ ...newBrand, industry: e.target.value })} placeholder="e.g. Beauty · D2C" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Tagline</label>
                  <Input value={newBrand.tagline} onChange={(e) => setNewBrand({ ...newBrand, tagline: e.target.value })} placeholder="One line that says it all" />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <Button variant="ghost" className="flex-1" onClick={() => setShowNew(false)}>Cancel</Button>
                <Button className="flex-1 bg-gradient-hero text-primary-foreground" onClick={handleCreate}>Create brand</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── Brand Detail ─────────────── */

function BrandDetail({ brand, onBack, onUpdate }: { brand: Brand; onBack: () => void; onUpdate: (p: Partial<Brand>) => void }) {
  const [tab, setTab] = useState<"overview" | "identity" | "content" | "clients">("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "identity", label: "Brand Identity" },
    { id: "content", label: "Content & Posts" },
    { id: "clients", label: "Contact" },
  ] as const;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="relative">
      <div className="absolute -top-4 right-10 hidden md:block opacity-40">
        <SpiralDoodle className="w-14 h-14 text-accent" />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to portfolio
        </button>
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ background: brand.colors[0] }} />
          <div className="flex flex-wrap items-start gap-4 relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-soft flex items-center justify-center text-5xl shadow-card">
              {brand.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{brand.name}</h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${brand.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                  {brand.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{brand.industry}</p>
              {brand.tagline && <p className="mt-2 text-sm italic text-foreground/80">"{brand.tagline}"</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => onUpdate({ status: brand.status === "Active" ? "Draft" : "Active" })}>
                {brand.status === "Active" ? "Move to draft" : "Activate"}
              </Button>
              <Button size="sm" className="rounded-xl bg-gradient-hero text-primary-foreground">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Generate post
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-1 border-b border-border/40 -mb-2 relative">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
                  tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {tab === t.id && <motion.div layoutId="bcrm-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          {tab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-5">
              <StatCard icon={FileText} label="Total posts" value={brand.posts.toString()} hint="Across all platforms" />
              <StatCard icon={TrendingUp} label="Avg. engagement" value="+21%" hint="Last 30 days" />
              <StatCard icon={Users} label="Total followers" value={brand.socials.reduce((s, x) => s + parseFloat(x.followers) || 0, 0).toFixed(1) + "K"} hint={`${brand.socials.length} channels`} />

              <div className="lg:col-span-2 bg-card rounded-2xl p-5 shadow-card border border-border/40">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Recent activity</h3>
                {brand.recentPosts.length ? (
                  <div className="space-y-2">
                    {brand.recentPosts.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-gradient-soft flex items-center justify-center">
                          {p.platform === "Instagram" ? <Instagram className="w-4 h-4 text-primary" /> :
                           p.platform === "LinkedIn" ? <Linkedin className="w-4 h-4 text-primary" /> :
                           <Twitter className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.platform} · {p.date}</p>
                        </div>
                        <span className="text-xs font-semibold text-success">{p.engagement}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground py-6 text-center">No posts yet — generate your first one ✨</p>}
              </div>

              <div className="bg-card rounded-2xl p-5 shadow-card border border-border/40">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Signature hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {brand.hashtags.length ? brand.hashtags.map((h) => (
                    <button key={h} onClick={() => copy(h, "Hashtag")} className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-gradient-soft text-foreground hover:shadow-sm transition-shadow">
                      {h}
                    </button>
                  )) : <p className="text-sm text-muted-foreground">No hashtags saved.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === "identity" && (
            <div className="space-y-5">
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Color palette</h3>
                  <Button variant="ghost" size="sm"><Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {brand.colors.map((c, i) => (
                    <button key={i} onClick={() => copy(c, c)} className="group rounded-2xl overflow-hidden border border-border/40 hover:shadow-elevated transition-shadow">
                      <div className="h-24" style={{ backgroundColor: c }} />
                      <div className="p-3 bg-card flex items-center justify-between">
                        <span className="text-xs font-mono">{c}</span>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Type className="w-4 h-4 text-primary" /> Typography</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/40">
                      <p className="text-xs text-muted-foreground mb-1">Heading</p>
                      <p className="text-2xl font-bold">{brand.fonts.heading}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/40">
                      <p className="text-xs text-muted-foreground mb-1">Body</p>
                      <p className="text-base">{brand.fonts.body}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Brand voice</h3>
                  <Textarea
                    value={brand.voice}
                    onChange={(e) => onUpdate({ voice: e.target.value })}
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">This guides all AI-generated captions for this brand.</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Brand guidelines</h3>
                  <Button variant="ghost" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" /> Export PDF</Button>
                </div>
                <Textarea
                  value={brand.guidelines}
                  onChange={(e) => onUpdate({ guidelines: e.target.value })}
                  rows={4}
                  placeholder="Write your do's & don'ts…"
                  className="resize-none"
                />
              </div>
            </div>
          )}

          {tab === "content" && (
            <div className="space-y-5">
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <h3 className="font-semibold mb-4">Connected channels</h3>
                {brand.socials.length ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {brand.socials.map((s) => (
                      <div key={s.handle} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40">
                        <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground">
                          {s.platform === "Instagram" ? <Instagram className="w-4 h-4" /> :
                           s.platform === "LinkedIn" ? <Linkedin className="w-4 h-4" /> :
                           <Twitter className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{s.handle}</p>
                          <p className="text-xs text-muted-foreground">{s.platform} · {s.followers} followers</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No channels connected yet.</p>}
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <h3 className="font-semibold mb-4">Recent posts</h3>
                {brand.recentPosts.length ? brand.recentPosts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-soft flex items-center justify-center text-xl">📝</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.platform} · {p.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-success">{p.engagement}</span>
                  </div>
                )) : <p className="text-sm text-muted-foreground py-6 text-center">Nothing here yet.</p>}
              </div>
            </div>
          )}

          {tab === "clients" && (
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40 max-w-xl">
              <h3 className="font-semibold mb-5 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Client contact</h3>
              <div className="space-y-4">
                <ContactRow icon={Mail} label="Email" value={brand.contact.email} onChange={(v) => onUpdate({ contact: { ...brand.contact, email: v } })} />
                <ContactRow icon={Phone} label="Phone" value={brand.contact.phone} onChange={(v) => onUpdate({ contact: { ...brand.contact, phone: v } })} />
                <ContactRow icon={MapPin} label="Location" value={brand.contact.location} onChange={(v) => onUpdate({ contact: { ...brand.contact, location: v } })} />
                <ContactRow icon={Globe} label="Website" value="" onChange={() => {}} placeholder="https://…" />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-4 left-10 hidden md:block opacity-40">
        <Squiggle className="w-24 h-12 text-primary" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint: string }) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border/40">
      <div className="w-10 h-10 rounded-xl bg-gradient-soft flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, onChange, placeholder }: { icon: any; label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-9" />
      </div>
    </div>
  );
}
