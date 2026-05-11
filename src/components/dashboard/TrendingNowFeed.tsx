import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, TrendingUp, ArrowRight } from "lucide-react";

const HOOKS = [
  { hook: "POV: you started using AI for content…", reach: "2.3M", platform: "Reels" },
  { hook: "3 prompts that made my carousel viral",   reach: "890K", platform: "LinkedIn" },
  { hook: "Why your hooks aren't converting",         reach: "1.1M", platform: "Shorts" },
];

const TAGS = ["#aiagents", "#creatoreconomy", "#reels", "#promptengineering", "#genz", "#viralhooks", "#aitools", "#contentstrategy"];

export default function TrendingNowFeed() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-bento h-full flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="font-semibold text-base">Trending now</h3>
        </div>
        <span className="chip chip-success">
          <TrendingUp className="w-3 h-3" /> Hot
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {HOOKS.map((h, i) => (
          <Link
            key={i}
            to={`/dashboard/generator?topic=${encodeURIComponent(h.hook)}`}
            className="group rounded-2xl border border-border/60 bg-gradient-to-br from-muted/30 to-transparent hover:from-white hover:border-primary/30 hover:shadow-md p-3 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{h.platform}</span>
              <span className="text-[10px] text-muted-foreground">{h.reach} reach</span>
            </div>
            <p className="text-sm font-medium leading-snug line-clamp-2">{h.hook}</p>
            <span className="mt-2 inline-flex items-center text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Use this <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {/* hashtag marquee */}
      <div className="relative mt-4 -mx-5 -mb-5 overflow-hidden border-t border-border/60 bg-muted/20 py-2.5">
        <div className="flex gap-2 marquee-track whitespace-nowrap w-max">
          {[...TAGS, ...TAGS].map((t, i) => (
            <span
              key={i}
              className="shrink-0 text-xs font-medium px-3 py-1 rounded-full bg-white border border-border/60 text-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
