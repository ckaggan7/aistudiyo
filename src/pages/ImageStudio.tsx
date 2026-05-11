import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ImageIcon,
  Mic,
  Upload,
  Download,
  RefreshCw,
  Loader2,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Wand2,
  Sticker as StickerIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

type Style = {
  name: string;
  desc: string;
  thumb: string;
  prompt: string;
};

const IMAGE_STYLES: Style[] = [
  { name: "Scribble", desc: "Hand-drawn cartoon doodle style", thumb: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop", prompt: "as a loose hand-drawn cartoon scribble doodle in black ink with playful imperfect lines on white paper" },
  { name: "Animal Infographic", desc: "Educational dark blue with diagrams", thumb: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&h=600&fit=crop", prompt: "as an educational infographic on a deep navy background with cream callouts, dotted lines, vintage scientific diagram aesthetic" },
  { name: "Chibi Stickers", desc: "Cute anime chibi on pastel", thumb: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=600&fit=crop", prompt: "in a cute chibi anime sticker style with big eyes, pastel pink background, sparkles and heart decorations, clean vector illustration" },
  { name: "Luxe Collage", desc: "Photorealistic fashion editorial", thumb: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&h=600&fit=crop", prompt: "as a luxe high-fashion editorial photo collage, 35mm film grain, cinematic lighting, magazine cover composition" },
  { name: "Makeup Guide", desc: "Beauty tutorial grid layout", thumb: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=600&fit=crop", prompt: "as a beauty tutorial grid layout with arrows, swatches and step labels in clean editorial typography" },
  { name: "Monochrome", desc: "Dramatic black & white portrait", thumb: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=600&fit=crop", prompt: "as a dramatic high-contrast black and white portrait, deep shadows, fine grain, gallery photography" },
  { name: "Technicolor", desc: "Bold geometric colorblock", thumb: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=600&fit=crop", prompt: "as a bold technicolor geometric colorblock composition with dramatic shadows, saturated reds, blues and yellows" },
  { name: "Gothic Clay", desc: "3D clay character, gothic mood", thumb: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=600&fit=crop", prompt: "as a detailed 3D clay render in a gothic Victorian environment with dramatic candlelight, dark stone walls, and moody atmosphere" },
  { name: "Risograph", desc: "2-color riso print, halftone", thumb: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=600&fit=crop", prompt: "as a risograph print with only 2 ink colors, halftone dots, slight misregistration, bold graphic design aesthetic" },
  { name: "Dynamite", desc: "Cinematic action movie poster", thumb: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=600&fit=crop", prompt: "as a cinematic action movie poster with explosive lighting, lens flares, bold typography space, dramatic hero pose" },
  { name: "Salon", desc: "Editorial fashion portrait, neutral", thumb: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop", prompt: "as an editorial salon fashion portrait with neutral tones, soft window light, minimalist composition" },
  { name: "Steampunk", desc: "Victorian sci-fi, dramatic skies", thumb: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=600&fit=crop", prompt: "in steampunk style with brass gears, Victorian sci-fi architecture, dramatic stormy skies, sepia color palette" },
  { name: "Sketch", desc: "Pencil drawing on paper", thumb: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&h=600&fit=crop", prompt: "as a detailed graphite pencil sketch on textured paper, cross-hatching, artistic shading" },
  { name: "Noir Room", desc: "Moody dimly lit interior", thumb: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=600&fit=crop", prompt: "as a film noir scene in a dimly lit interior, harsh window blinds shadows, smoke, 1940s cinematography" },
  { name: "Golden Hour", desc: "Warm sunset landscape", thumb: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop", prompt: "in golden hour landscape lighting, warm amber sun rays, soft haze, breathtaking natural scenery" },
];

const STICKER_STYLES: Style[] = [
  { name: "Cartoon Pop", desc: "Bold cartoon sticker", thumb: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=600&fit=crop", prompt: "as a die-cut cartoon sticker with thick white outline, vivid pop colors, transparent background, bold and playful" },
  { name: "Kawaii", desc: "Cute pastel sticker", thumb: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=600&fit=crop", prompt: "as a kawaii chibi sticker with big sparkly eyes, soft pastel colors, white outline, cute and adorable, transparent background" },
  { name: "Retro", desc: "70s vintage sticker", thumb: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&h=600&fit=crop", prompt: "as a retro 70s vintage sticker with warm orange, mustard and brown palette, groovy typography, halftone texture" },
  { name: "Minimal Line", desc: "Single-line illustration", thumb: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&h=600&fit=crop", prompt: "as a minimalist single-line illustration sticker, monoline ink, white background, elegant and simple" },
  { name: "Holographic", desc: "Iridescent shimmer", thumb: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=600&fit=crop", prompt: "as a holographic iridescent sticker with rainbow chrome shimmer, metallic foil finish, glossy reflections, transparent background" },
  { name: "Doodle", desc: "Hand-drawn marker doodle", thumb: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop", prompt: "as a hand-drawn marker doodle sticker with chunky outline, flat pastel fill, slight imperfections, friendly vibe" },
];

const VIDEO_ENGINES = [
  { id: "veo-3", name: "Veo 3", desc: "Cinematic, sound-aware", badge: "Premium", gradient: "from-primary to-accent" },
  { id: "kling-2", name: "Kling 2.0", desc: "Smooth motion, lip sync", badge: "Popular", gradient: "from-accent to-purple-500" },
  { id: "runway-gen3", name: "Runway Gen-3", desc: "Director-grade control", badge: "Pro", gradient: "from-orange-400 to-primary" },
  { id: "pika-2", name: "Pika 2.0", desc: "Stylised short clips", badge: "Stylised", gradient: "from-pink-400 to-accent" },
];

// Quick-apply filter presets — clicking a filter bakes its prompt into generation.
type Filter = { name: string; emoji: string; category: string; prompt: string };
const FILTERS: Filter[] = [
  // Photo
  { name: "Cinematic", emoji: "🎬", category: "Photo", prompt: "cinematic photo, dramatic lighting, shallow depth of field, color graded, anamorphic lens, film grain" },
  { name: "Golden Hour", emoji: "🌅", category: "Photo", prompt: "warm golden hour sunlight, soft amber tones, hazy backlight, lens flare, magazine photography" },
  { name: "Studio Portrait", emoji: "📸", category: "Photo", prompt: "studio portrait, softbox lighting, clean grey backdrop, sharp focus, editorial photography" },
  { name: "Film Grain", emoji: "🎞️", category: "Photo", prompt: "35mm film photo, kodak portra 400, natural grain, warm tones, analog feel" },
  { name: "Black & White", emoji: "⚫", category: "Photo", prompt: "dramatic black and white photograph, high contrast, deep shadows, fine grain, gallery print" },
  { name: "Macro", emoji: "🔍", category: "Photo", prompt: "extreme macro photo, ultra detailed, shallow focus, dewdrop reflections, studio lighting" },
  // Art
  { name: "Watercolor", emoji: "🎨", category: "Art", prompt: "loose watercolor painting on textured paper, soft washes, bleed edges, light pencil sketch underlay" },
  { name: "Oil Painting", emoji: "🖼️", category: "Art", prompt: "classical oil painting, thick impasto brush strokes, rich color palette, Rembrandt lighting" },
  { name: "Sketch", emoji: "✏️", category: "Art", prompt: "graphite pencil sketch on textured paper, cross-hatching, expressive lines, artist study" },
  { name: "Ink Doodle", emoji: "🖊️", category: "Art", prompt: "loose hand-drawn ink doodle, playful imperfect lines on white paper, scribble cartoon style" },
  { name: "Pop Art", emoji: "💥", category: "Art", prompt: "bold pop art illustration, halftone dots, thick black outlines, saturated primary colors, Lichtenstein style" },
  // 3D
  { name: "3D Clay", emoji: "🧱", category: "3D", prompt: "cute 3D clay render character, soft matte material, studio lighting, octane render, isometric angle" },
  { name: "Pixar", emoji: "✨", category: "3D", prompt: "Pixar style 3D animated character, expressive big eyes, polished render, cinematic key light, friendly mood" },
  { name: "Isometric", emoji: "📦", category: "3D", prompt: "clean isometric 3D illustration, pastel palette, miniature diorama, soft shadows, blender render" },
  { name: "Low Poly", emoji: "🔺", category: "3D", prompt: "low-poly 3D render, faceted geometry, flat shaded triangles, modern minimal aesthetic" },
  // Anime
  { name: "Anime", emoji: "🌸", category: "Anime", prompt: "vibrant anime illustration, cel shading, expressive line art, studio ghibli inspired color palette" },
  { name: "Chibi", emoji: "🍡", category: "Anime", prompt: "cute chibi anime character, big sparkly eyes, pastel pastel background, sticker style, kawaii vibes" },
  { name: "Manga B&W", emoji: "🖋️", category: "Anime", prompt: "black and white manga panel, screentone shading, dynamic ink lines, comic book composition" },
  // Retro
  { name: "80s Synthwave", emoji: "🌴", category: "Retro", prompt: "80s synthwave aesthetic, neon magenta and cyan grid horizon, retro chrome, vaporwave sun, palm silhouette" },
  { name: "70s Groovy", emoji: "🪩", category: "Retro", prompt: "70s groovy retro illustration, warm orange mustard brown palette, halftone texture, vintage typography vibe" },
  { name: "Polaroid", emoji: "📷", category: "Retro", prompt: "vintage polaroid photo, faded warm colors, soft focus, light leak, white border, nostalgic mood" },
  { name: "Risograph", emoji: "🟪", category: "Retro", prompt: "risograph print, 2 ink colors only, halftone dots, slight misregistration, bold graphic design feel" },
  // Futuristic
  { name: "Cyberpunk", emoji: "🌃", category: "Futuristic", prompt: "cyberpunk neon city scene, holographic signage, rain-soaked streets, dramatic teal and magenta lighting, blade runner aesthetic" },
  { name: "Holographic", emoji: "💿", category: "Futuristic", prompt: "iridescent holographic chrome surface, rainbow shimmer, glossy metallic foil, ultra clean reflections" },
  { name: "Glassmorph", emoji: "🧊", category: "Futuristic", prompt: "frosted glass morphism aesthetic, soft pastel light, translucent layers, subtle highlights, premium product render" },
  // Mood
  { name: "Dreamy", emoji: "☁️", category: "Mood", prompt: "soft dreamy ethereal scene, pastel haze, glowing rim light, fairytale atmosphere, gentle gradients" },
  { name: "Dark Moody", emoji: "🌑", category: "Mood", prompt: "dark moody scene, deep shadows, single warm light source, rich blacks, atmospheric depth, noir feel" },
  { name: "Minimal", emoji: "⚪", category: "Mood", prompt: "minimalist composition, lots of negative space, single subject, neutral palette, editorial clean look" },
];

const FILTER_CATEGORIES = ["All", "Photo", "Art", "3D", "Anime", "Retro", "Futuristic", "Mood"] as const;
type Category = typeof FILTER_CATEGORIES[number];

type Generation = {
  id: string;
  prompt: string;
  style: string | null;
  image_url: string;
  created_at: string;
};

type Mode = "image" | "sticker" | "video";

export default function ImageStudio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as Mode) || "image";
  const [mode, setMode] = useState<Mode>(
    initialMode === "sticker" || initialMode === "video" ? initialMode : "image",
  );
  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "");
  const [openStyle, setOpenStyle] = useState<Style | null>(null);
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
  const [filterCategory, setFilterCategory] = useState<Category>("All");

  const setModeAndUrl = (m: Mode) => {
    setMode(m);
    const next = new URLSearchParams(searchParams);
    if (m === "image") next.delete("mode");
    else next.set("mode", m);
    setSearchParams(next, { replace: true });
  };

  const styles = mode === "sticker" ? STICKER_STYLES : IMAGE_STYLES;
  const isVideo = mode === "video";

  const loadHistory = async () => {
    const { data } = await supabase
      .from("generations")
      .select("id, prompt, style, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(12);
    if (data) setHistory(data as Generation[]);
  };
  useEffect(() => { loadHistory(); }, []);

  const quickGenerate = async () => {
    if (isVideo) return toast.info("Video generation is coming soon");
    if (!prompt.trim()) return toast.error("Describe what you want to create");
    setLoading(true);
    const baseStickerPrompt =
      "as a die-cut sticker with thick white outline, vivid colors, transparent background";
    const stylePrompt = activeFilter
      ? mode === "sticker"
        ? `${activeFilter.prompt}, ${baseStickerPrompt}`
        : activeFilter.prompt
      : mode === "sticker"
        ? baseStickerPrompt
        : "";
    const styleName = activeFilter?.name ?? (mode === "sticker" ? "Sticker" : "Default");
    const { data, error } = await supabase.functions.invoke("generate-image", {
      body: { prompt, style: styleName, stylePrompt, mode: "text" },
    });
    setLoading(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Generation failed");
      return;
    }
    toast.success(
      activeFilter
        ? `Generated in "${activeFilter.name}" style`
        : `${mode === "sticker" ? "Sticker" : "Image"} generated and saved`,
    );
    setPrompt("");
    loadHistory();
  };

  const visibleFilters =
    filterCategory === "All" ? FILTERS : FILTERS.filter((f) => f.category === filterCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Studio</h1>
        <p className="text-muted-foreground">One place for images, stickers and (soon) video.</p>
      </motion.div>

      {/* Mode switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 rounded-2xl bg-secondary border border-border/40">
          {([
            { id: "image" as Mode, label: "Image", icon: Wand2 },
            { id: "sticker" as Mode, label: "Sticker", icon: StickerIcon },
            { id: "video" as Mode, label: "Video", icon: Video },
          ]).map((m) => (
            <button
              key={m.id}
              onClick={() => setModeAndUrl(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                mode === m.id ? "bg-card shadow-card text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
              {m.id === "video" && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent">SOON</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {isVideo ? (
        <div className="bg-card border border-border/60 rounded-2xl p-8 text-center shadow-card">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center mb-4 shadow-glow">
            <Video className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-1">Video generation is coming soon</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            We're integrating cinematic video models. Get notified the moment it goes live.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
            {VIDEO_ENGINES.map((e) => (
              <div key={e.id} className="p-3 rounded-xl border-2 border-border/60 text-left opacity-70">
                <div className={`w-full aspect-[5/3] rounded-lg bg-gradient-to-br ${e.gradient} mb-2 flex items-end justify-end p-2`}>
                  <span className="text-[10px] font-semibold bg-card/90 backdrop-blur px-2 py-0.5 rounded-full">{e.badge}</span>
                </div>
                <p className="text-sm font-semibold">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>
          <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-90 rounded-xl">
            <a href="/signup">Join the waitlist</a>
          </Button>
        </div>
      ) : (
      <>
      {/* Prompt bar */}
      <div className="bg-card border border-border/60 rounded-2xl shadow-card p-2 flex items-center gap-2 mb-8">
        <button className="p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground" title="Upload">
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && quickGenerate()}
          placeholder={mode === "sticker" ? "Describe a new sticker..." : "Describe a new image..."}
          className="flex-1 bg-transparent outline-none text-sm px-2"
        />
        {activeFilter && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
            {activeFilter.emoji} {activeFilter.name}
            <button
              onClick={() => setActiveFilter(null)}
              className="ml-0.5 hover:text-foreground"
              aria-label="Clear filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        <button className="p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground">
          <Mic className="w-4 h-4" />
        </button>
        <Button
          onClick={quickGenerate}
          disabled={loading}
          size="icon"
          className="rounded-xl bg-gradient-hero text-primary-foreground hover:opacity-90"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h2 className="text-sm font-semibold">Filters</h2>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              — tap one, then describe your image
            </span>
          </div>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              Clear <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {FILTER_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                filterCategory === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-3">
          {visibleFilters.map((f) => {
            const active = activeFilter?.name === f.name;
            return (
              <button
                key={f.name}
                onClick={() => setActiveFilter(active ? null : f)}
                className={`group relative aspect-square rounded-xl border transition-all overflow-hidden flex flex-col items-center justify-center gap-1 p-2 ${
                  active
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border/40 bg-card hover:border-primary/40 hover:-translate-y-0.5"
                }`}
              >
                <span className="text-xl leading-none">{f.emoji}</span>
                <span className="text-[10px] font-medium leading-tight text-center line-clamp-2">
                  {f.name}
                </span>
                {active && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Style strip */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 px-1">
          {mode === "sticker" ? "Pick a sticker style" : "Create an image"}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin">
          {styles.map((s) => (
            <button
              key={s.name}
              onClick={() => setOpenStyle(s)}
              className="group relative shrink-0 w-44 aspect-[4/5] rounded-2xl overflow-hidden border border-border/40 hover:border-primary/50 transition-all"
            >
              <img src={s.thumb} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <p className="text-white text-sm font-semibold">{s.name}</p>
                <p className="text-white/70 text-[11px] line-clamp-1">{s.desc}</p>
              </div>
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs font-semibold bg-card text-foreground px-3 py-1.5 rounded-full">Use this style</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent generations */}
      {history.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3 px-1">Recent generations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {history.map((g) => (
              <a key={g.id} href={g.image_url} target="_blank" rel="noreferrer" className="group block rounded-xl overflow-hidden border border-border/40">
                <img src={g.image_url} alt={g.prompt} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}
      </>
      )}

      <AnimatePresence>
        {openStyle && (
          <StyleModal style={openStyle} onClose={() => { setOpenStyle(null); loadHistory(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StyleModal({ style, onClose }: { style: Style; onClose: () => void }) {
  const [tab, setTab] = useState<"text" | "image">("text");
  const [desc, setDesc] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<{ name: string; data: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [genPrompt, setGenPrompt] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setFile({ name: f.name, data: reader.result as string });
    reader.readAsDataURL(f);
  };

  const generate = async () => {
    setBusy(true);
    setResultUrl(null);
    setGenPrompt(null);
    const body =
      tab === "text"
        ? { prompt: desc, style: style.name, stylePrompt: style.prompt, mode: "text" }
        : { prompt: note, style: style.name, stylePrompt: style.prompt, mode: "image", imageBase64: file?.data };

    if (tab === "text" && !desc.trim()) { setBusy(false); return toast.error("Describe your image"); }
    if (tab === "image" && !file) { setBusy(false); return toast.error("Upload an image first"); }

    const { data, error } = await supabase.functions.invoke("generate-image", { body });
    setBusy(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Generation failed");
      return;
    }
    setResultUrl((data as any).image_url);
    setGenPrompt((data as any).generated_prompt || null);
    toast.success("Saved to Media Library");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl shadow-elevated w-full max-w-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="p-6 border-b flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> {style.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{style.desc}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="text">Text to Image</TabsTrigger>
              <TabsTrigger value="image">Modify My Image</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-4 space-y-3">
              <Textarea
                value={desc} onChange={(e) => setDesc(e.target.value)} rows={4}
                placeholder="Describe your image in this style..." className="rounded-xl"
              />
            </TabsContent>

            <TabsContent value="image" className="mt-4 space-y-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && onPickFile(e.target.files[0])} />
              {file ? (
                <div className="relative rounded-xl overflow-hidden border border-border/60">
                  <img src={file.data} alt="upload" className="w-full max-h-64 object-contain bg-secondary" />
                  <button onClick={() => setFile(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-card/90 hover:bg-card">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to ~10MB</p>
                </button>
              )}
              <Textarea
                value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                placeholder="Any additional instructions? (optional)" className="rounded-xl"
              />
            </TabsContent>
          </Tabs>

          <Button onClick={generate} disabled={busy}
            className="w-full mt-5 h-11 rounded-xl bg-gradient-hero text-primary-foreground hover:opacity-90">
            {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate</>}
          </Button>

          {busy && <Skeleton className="w-full aspect-square rounded-xl mt-4" />}

          {resultUrl && (
            <div className="mt-5 space-y-3">
              <img src={resultUrl} alt="generated" className="w-full rounded-xl border border-border/60" />
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm"><a href={resultUrl} download target="_blank" rel="noreferrer"><Download className="w-4 h-4 mr-2" /> Download</a></Button>
                <Button onClick={generate} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Regenerate</Button>
                {genPrompt && (
                  <Button onClick={() => setShowPrompt((s) => !s)} variant="ghost" size="sm">
                    {showPrompt ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showPrompt ? "Hide" : "Show"} generated prompt
                  </Button>
                )}
              </div>
              {showPrompt && genPrompt && (
                <div className="p-3 rounded-xl bg-secondary text-xs text-muted-foreground whitespace-pre-wrap">{genPrompt}</div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
