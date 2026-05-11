import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";

const IDEAS = [
  { tag: "#AIMarketing", topic: "How AI is changing content marketing in 2026" },
  { tag: "#FounderStory", topic: "Behind-the-scenes of a bootstrapped startup" },
  { tag: "#CreatorEconomy", topic: "5 underrated income streams for creators" },
  { tag: "#Productivity", topic: "Morning routine of high-output founders" },
  { tag: "#BrandBuilding", topic: "Build a brand voice in 7 days" },
  { tag: "#ViralHooks", topic: "Hooks that stopped the scroll this week" },
];

export default function TrendingIdeasStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      className="bg-card rounded-2xl p-5 md:p-6 border border-border/40 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Trending ideas today</h3>
        </div>
        <Link
          to="/dashboard/trends"
          className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline"
        >
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
        {IDEAS.map((idea) => (
          <Link
            key={idea.tag}
            to={`/dashboard/generator?topic=${encodeURIComponent(idea.topic)}&platform=instagram&contentType=post`}
            className="group shrink-0 max-w-[260px] rounded-xl border border-border/40 bg-background/40 backdrop-blur p-3 hover:border-primary/40 hover:bg-secondary/60 transition-colors"
          >
            <p className="text-[11px] font-medium text-primary mb-1">{idea.tag}</p>
            <p className="text-xs text-foreground/80 leading-snug line-clamp-2">{idea.topic}</p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
