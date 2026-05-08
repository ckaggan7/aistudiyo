import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Download, BookmarkPlus, Sparkles, Video, Wand2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const imageEngines = [
  { id: "nano-banana", name: "Nano Banana", desc: "Fast & versatile", badge: "Default", gradient: "from-primary to-accent" },
  { id: "nano-banana-pro", name: "Nano Banana Pro", desc: "Highest quality", badge: "Premium", gradient: "from-accent to-purple-500" },
  { id: "nano-banana-2", name: "Nano Banana 2", desc: "Pro quality, faster", badge: "New", gradient: "from-orange-400 to-primary" },
  { id: "flux-pro", name: "Flux Pro", desc: "Photorealistic", badge: "Realism", gradient: "from-pink-400 to-accent" },
  { id: "ideogram-v3", name: "Ideogram v3", desc: "Best for text in image", badge: "Typography", gradient: "from-purple-400 to-primary-glow" },
  { id: "sdxl-turbo", name: "SDXL Turbo", desc: "Lightning fast drafts", badge: "Speed", gradient: "from-primary-glow to-pink-400" },
];

const videoEngines = [
  { id: "veo-3", name: "Veo 3", desc: "Cinematic, sound-aware", badge: "Premium", gradient: "from-primary to-accent" },
  { id: "kling-2", name: "Kling 2.0", desc: "Smooth motion, lip sync", badge: "Popular", gradient: "from-accent to-purple-500" },
  { id: "runway-gen3", name: "Runway Gen-3", desc: "Director-grade control", badge: "Pro", gradient: "from-orange-400 to-primary" },
  { id: "pika-2", name: "Pika 2.0", desc: "Stylised short clips", badge: "Stylised", gradient: "from-pink-400 to-accent" },
];

const languages = [
  { code: "native", label: "Native (Auto-detect)" },
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు · Telugu" },
  { code: "hi", label: "हिन्दी · Hindi" },
  { code: "ta", label: "தமிழ் · Tamil" },
  { code: "kn", label: "ಕನ್ನಡ · Kannada" },
  { code: "ml", label: "മലയാളം · Malayalam" },
  { code: "mr", label: "मराठी · Marathi" },
  { code: "bn", label: "বাংলা · Bengali" },
  { code: "gu", label: "ગુજરાતી · Gujarati" },
  { code: "pa", label: "ਪੰਜਾਬੀ · Punjabi" },
  { code: "ur", label: "اردو · Urdu" },
];

const placeholderImages = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=512&h=512&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=512&h=512&fit=crop",
];

export default function ImageGenerator() {
  const [mode, setMode] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageEngine, setImageEngine] = useState("nano-banana");
  const [videoEngine, setVideoEngine] = useState("veo-3");
  const [language, setLanguage] = useState("native");
  const [aspect, setAspect] = useState("1:1");
  const [duration, setDuration] = useState("5");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2200));
    if (mode === "image") {
      setGeneratedImage(placeholderImages[Math.floor(Math.random() * placeholderImages.length)]);
      toast.success(`Image generated with ${imageEngines.find(e => e.id === imageEngine)?.name}`);
    } else {
      toast.success(`Video queued on ${videoEngines.find(e => e.id === videoEngine)?.name} (${duration}s)`);
    }
    setLoading(false);
  };

  const engines = mode === "image" ? imageEngines : videoEngines;
  const selectedEngine = mode === "image" ? imageEngine : videoEngine;
  const setSelectedEngine = mode === "image" ? setImageEngine : setVideoEngine;

  return (
    <div className="max-w-5xl">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Studio</h1>
          <p className="text-sm text-muted-foreground">Pick an engine, language, and let AI create</p>
        </div>
        {/* Mode switch */}
        <div className="inline-flex p-1 rounded-xl bg-secondary">
          <button
            onClick={() => setMode("image")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              mode === "image" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
            }`}
          >
            <Image className="w-4 h-4" /> Image
          </button>
          <button
            onClick={() => setMode("video")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              mode === "video" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
            }`}
          >
            <Video className="w-4 h-4" /> Video
          </button>
        </div>
      </motion.div>

      {/* Engine picker */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card border border-border/40 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            Choose your {mode === "image" ? "Image" : "Video"} Engine
          </p>
          <span className="text-xs text-muted-foreground">{engines.length} models available</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {engines.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedEngine(e.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                selectedEngine === e.id
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "border-border/60 hover:border-primary/40"
              }`}
            >
              <div className={`w-full aspect-[5/3] rounded-lg bg-gradient-to-br ${e.gradient} mb-2 flex items-end justify-end p-2`}>
                <span className="text-[10px] font-semibold bg-card/90 backdrop-blur px-2 py-0.5 rounded-full">
                  {e.badge}
                </span>
              </div>
              <p className="text-sm font-semibold">{e.name}</p>
              <p className="text-xs text-muted-foreground">{e.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Prompt + options */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card border border-border/40 mb-6">
        <label className="text-sm font-semibold mb-1.5 block">Describe your {mode}</label>
        <Textarea
          placeholder={mode === "image"
            ? "e.g. A vibrant sunset over ocean waves with golden light, cinematic style"
            : "e.g. A drone shot flying over Tirupati hills at sunrise, cinematic"}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="rounded-xl"
        />

        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-accent" /> Prompt Language
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">Aspect Ratio</label>
            <Select value={aspect} onValueChange={setAspect}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">1:1 · Square</SelectItem>
                <SelectItem value="9:16">9:16 · Reel / Story</SelectItem>
                <SelectItem value="16:9">16:9 · Landscape</SelectItem>
                <SelectItem value="4:5">4:5 · Portrait Post</SelectItem>
                <SelectItem value="3:2">3:2 · Classic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "video" ? (
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="15">15 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Quality</label>
              <Select defaultValue="hd">
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft · Fast</SelectItem>
                  <SelectItem value="hd">HD · Balanced</SelectItem>
                  <SelectItem value="4k">4K · Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="mt-5 w-full sm:w-auto bg-gradient-hero text-primary-foreground hover:opacity-90 transition-opacity h-11 rounded-xl">
          {loading ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Generating...</span>
          ) : (
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate {mode === "image" ? "Image" : "Video"}</span>
          )}
        </Button>
      </motion.div>

      {generatedImage && mode === "image" && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
          <img src={generatedImage} alt="Generated" className="w-full max-w-md mx-auto rounded-xl mb-4" />
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => toast.success("Downloading...")}>
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Saved to Media Library")}>
              <BookmarkPlus className="w-4 h-4 mr-2" /> Save to Library
            </Button>
            <Button size="sm" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              <Image className="w-4 h-4 mr-2" /> Use in Post
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
