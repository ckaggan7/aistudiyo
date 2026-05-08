import { motion } from "framer-motion";
import { TrendingUp, Hash, Film, Flame } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const trendingHashtags = [
  { tag: "#AIContent", posts: "2.4M", trend: "+18%" },
  { tag: "#SocialMediaTips", posts: "1.8M", trend: "+12%" },
  { tag: "#ContentCreator", posts: "5.2M", trend: "+8%" },
  { tag: "#ReelsViral", posts: "890K", trend: "+25%" },
  { tag: "#BrandBuilding", posts: "620K", trend: "+14%" },
  { tag: "#DigitalMarketing", posts: "3.1M", trend: "+6%" },
];

const trendingTopics = [
  "AI-generated content strategies",
  "Short-form video dominance in 2026",
  "Authentic storytelling for brands",
  "Community-first marketing",
  "User-generated content campaigns",
];

const trendingReels = [
  { title: "Day in the life of a content creator", views: "2.1M", trend: "🔥" },
  { title: "3 hooks that stop the scroll", views: "1.5M", trend: "🔥" },
  { title: "Before & after brand redesign", views: "980K", trend: "📈" },
  { title: "POV: Your first viral post", views: "3.2M", trend: "🔥" },
];

export default function TrendEngine() {
  return (
    <div>
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-2xl font-bold tracking-tight mb-6">
        Trend Engine
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hashtags */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Trending Hashtags</h3>
          </div>
          <div className="space-y-3">
            {trendingHashtags.map((h) => (
              <div key={h.tag} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-sm font-medium">{h.tag}</p>
                  <p className="text-xs text-muted-foreground">{h.posts} posts</p>
                </div>
                <span className="text-xs font-medium text-success">{h.trend}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Topics */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Trending Topics</h3>
          </div>
          <div className="space-y-3">
            {trendingTopics.map((topic, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-secondary/50">
                <span className="text-xs font-bold text-primary mt-0.5">{i + 1}</span>
                <p className="text-sm">{topic}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reels */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Trending Reels</h3>
          </div>
          <div className="space-y-3">
            {trendingReels.map((reel) => (
              <div key={reel.title} className="p-2.5 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{reel.trend}</span>
                  <span className="text-xs text-muted-foreground">{reel.views} views</span>
                </div>
                <p className="text-sm font-medium">{reel.title}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
