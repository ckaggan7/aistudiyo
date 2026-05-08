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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Style = {
  name: string;
  desc: string;
  thumb: string;
  prompt: string;
};

const STYLES: Style[] = [
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

type Generation = {
  id: string;
  prompt: string;
  style: string | null;
  image_url: string;
  created_at: string;
};

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [openStyle, setOpenStyle] = useState<Style | null>(null);
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (!prompt.trim()) return toast.error("Describe what you want to create");
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("generate-image", {
      body: { prompt, style: "Default", stylePrompt: "", mode: "text" },
    });
    setLoading(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Generation failed");
      return;
    }
    toast.success("Image generated and saved to Media Library");
    setPrompt("");
    loadHistory();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Images</h1>
        <p className="text-muted-foreground">Describe what you want to create — or pick a style below</p>
      </motion.div>

      {/* Prompt bar */}
      <div className="bg-card border border-border/60 rounded-2xl shadow-card p-2 flex items-center gap-2 mb-8">
        <button className="p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground" title="Upload">
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && quickGenerate()}
          placeholder="Describe a new image..."
          className="flex-1 bg-transparent outline-none text-sm px-2"
        />
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

      {/* Style strip */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 px-1">Create an image</h2>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin">
          {STYLES.map((s) => (
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
