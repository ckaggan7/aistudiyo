import { useState } from "react";
import { motion } from "framer-motion";
import { Sticker, Sparkles, Download, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Squiggle, StarDoodle, SpiralDoodle } from "@/components/Doodles";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const styles = [
  { name: "Cartoon Pop", emoji: "🎨", gradient: "from-primary to-accent" },
  { name: "Kawaii", emoji: "🌸", gradient: "from-pink-400 to-accent" },
  { name: "Retro", emoji: "📼", gradient: "from-orange-400 to-primary" },
  { name: "Minimal Line", emoji: "✏️", gradient: "from-accent to-purple-400" },
  { name: "Holographic", emoji: "✨", gradient: "from-purple-400 to-primary-glow" },
  { name: "Doodle", emoji: "🖍️", gradient: "from-primary-glow to-pink-400" },
];

const recentStickers = ["🚀", "💖", "⭐", "🔥", "🎯", "💎", "🌈", "👑"];

export default function StickerGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Cartoon Pop");

  return (
    <div className="relative">
      <div className="absolute -top-4 right-10 hidden md:block opacity-60">
        <Squiggle className="w-24 h-12 text-primary" />
      </div>
      <div className="absolute top-20 right-40 hidden md:block">
        <StarDoodle className="w-8 h-8 text-accent" />
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-glow">
            <Sticker className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sticker Generator</h1>
            <p className="text-sm text-muted-foreground">Turn ideas into custom stickers in seconds</p>
          </div>
        </div>
      </motion.div>

      {/* Prompt card */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="bg-card rounded-2xl p-6 shadow-card border border-border/40 mb-8">
        <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" /> Describe your sticker
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A smiling avocado with sunglasses, bright vibrant colors..."
            className="flex-1 h-12 rounded-xl"
          />
          <Button className="h-12 px-6 bg-gradient-hero text-primary-foreground hover:opacity-90 rounded-xl">
            <Sparkles className="w-4 h-4 mr-2" /> Generate
          </Button>
        </div>

        <p className="text-xs font-semibold text-muted-foreground mt-5 mb-3">PICK A STYLE</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {styles.map((style) => (
            <button
              key={style.name}
              onClick={() => setSelectedStyle(style.name)}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                selectedStyle === style.name
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "border-border/60 hover:border-primary/40"
              }`}
            >
              <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center text-2xl mb-2`}>
                {style.emoji}
              </div>
              <p className="text-xs font-medium">{style.name}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent stickers */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Stickers</h2>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {recentStickers.map((sticker, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 3}
              className="aspect-square bg-gradient-soft rounded-2xl flex items-center justify-center text-5xl shadow-card hover:shadow-elevated hover:scale-105 transition-all cursor-pointer group relative"
            >
              <span>{sticker}</span>
              <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-card shadow-card opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Download className="w-3.5 h-3.5 text-foreground" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-10 hidden md:block opacity-50">
        <SpiralDoodle className="w-16 h-16 text-accent" />
      </div>
    </div>
  );
}
