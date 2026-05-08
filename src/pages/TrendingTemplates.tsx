import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Heart, Eye, Bookmark, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Squiggle, SpiralDoodle } from "@/components/Doodles";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const categories = ["All", "Reels", "Posts", "Stories", "Carousels", "Ads"];

const templates = [
  { title: "Minimal Product Drop", category: "Posts", views: "12.4k", likes: "892", gradient: "from-primary to-primary-glow", emoji: "🛍️", trending: true },
  { title: "Behind the Scenes Reel", category: "Reels", views: "28.1k", likes: "2.1k", gradient: "from-accent to-purple-400", emoji: "🎬", trending: true },
  { title: "Quote Carousel", category: "Carousels", views: "9.8k", likes: "654", gradient: "from-primary-glow to-pink-400", emoji: "💭" },
  { title: "Before & After", category: "Posts", views: "15.2k", likes: "1.3k", gradient: "from-pink-400 to-accent", emoji: "✨", trending: true },
  { title: "Story Countdown", category: "Stories", views: "7.6k", likes: "421", gradient: "from-orange-400 to-primary", emoji: "⏳" },
  { title: "Promo Sale Reel", category: "Reels", views: "32.5k", likes: "2.8k", gradient: "from-purple-400 to-accent", emoji: "🔥", trending: true },
  { title: "Testimonial Card", category: "Posts", views: "6.4k", likes: "312", gradient: "from-accent to-primary", emoji: "💬" },
  { title: "Tutorial Carousel", category: "Carousels", views: "18.9k", likes: "1.5k", gradient: "from-primary to-accent", emoji: "📚" },
];

export default function TrendingTemplates() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? templates : templates.filter((t) => t.category === active);

  return (
    <div className="relative">
      <div className="absolute top-0 right-10 hidden md:block opacity-60">
        <SpiralDoodle className="w-20 h-20 text-accent" />
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-glow">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trending Templates</h1>
            <p className="text-sm text-muted-foreground">Hand-picked templates winning across platforms this week</p>
          </div>
        </div>
      </motion.div>

      {/* Category filter */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              active === cat
                ? "bg-gradient-hero text-primary-foreground shadow-glow"
                : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Templates grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((tpl, i) => (
          <motion.div
            key={tpl.title}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 2}
            className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/40 hover:shadow-elevated hover:-translate-y-1 transition-all group"
          >
            <div className={`relative aspect-[4/5] bg-gradient-to-br ${tpl.gradient} flex items-center justify-center text-7xl`}>
              <span>{tpl.emoji}</span>
              {tpl.trending && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/95 backdrop-blur text-xs font-semibold text-primary">
                  <TrendingUp className="w-3 h-3" /> Trending
                </div>
              )}
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/95 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Bookmark className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{tpl.category}</p>
              <h3 className="font-semibold text-sm mb-3 line-clamp-1">{tpl.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> {tpl.views}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> {tpl.likes}
                </span>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">Use</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 hidden md:block opacity-40">
        <Squiggle className="w-32 h-16 text-primary" />
      </div>
    </div>
  );
}
