import { motion } from "framer-motion";
import { Flame, Send, Eye, Sparkles, ArrowUpRight } from "lucide-react";
import QuickCreateBar from "@/components/dashboard/QuickCreateBar";
import AISuggestions from "@/components/dashboard/AISuggestions";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import RecentContentPacks from "@/components/dashboard/RecentContentPacks";
import AgentsStrip from "@/components/dashboard/AgentsStrip";
import TrendingSocialDates from "@/components/dashboard/TrendingSocialDates";
import CreatorMomentum from "@/components/dashboard/CreatorMomentum";

type Stat = {
  icon: any;
  label: string;
  value: string;
  delta: string;
  accent?: boolean;
};

const STATS: Stat[] = [
  { icon: Flame, label: "Streak", value: "7d", delta: "+2 this week" },
  { icon: Send, label: "Posts shipped", value: "23", delta: "8 scheduled" },
  { icon: Eye, label: "Reach", value: "+18.4%", delta: "vs. last 30d", accent: true },
  { icon: Sparkles, label: "Credits", value: "142", delta: "of 200" },
];

function StatCard({ stat, idx }: { stat: Stat; idx: number }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + idx * 0.04 }}
      className={stat.accent ? "card-bento-accent" : "card-bento"}
    >
      <div className="flex items-start justify-between">
        <div
          className={
            stat.accent
              ? "w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
              : "w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
          }
        >
          <Icon className={stat.accent ? "w-4 h-4 text-white" : "w-4 h-4 text-foreground"} />
        </div>
        <ArrowUpRight
          className={
            stat.accent ? "w-4 h-4 text-white/70" : "w-4 h-4 text-muted-foreground"
          }
        />
      </div>
      <p
        className={`text-3xl font-semibold tracking-tight mt-6 ${
          stat.accent ? "text-white" : "text-foreground"
        }`}
      >
        {stat.value}
      </p>
      <div className="flex items-center justify-between mt-1">
        <p
          className={`text-xs ${
            stat.accent ? "text-white/80" : "text-muted-foreground"
          }`}
        >
          {stat.label}
        </p>
        <span
          className={
            stat.accent
              ? "text-[10px] font-medium text-white/80"
              : "text-[10px] font-medium text-muted-foreground"
          }
        >
          {stat.delta}
        </span>
      </div>
    </motion.div>
  );
}

export default function DashboardHome() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <WelcomeHeader />

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} stat={s} idx={i} />
        ))}
      </div>

      {/* Quick create + Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickCreateBar />
        </div>
        <div className="lg:col-span-1">
          <AISuggestions />
        </div>
      </div>

      {/* Momentum + Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CreatorMomentum />
        </div>
        <div className="lg:col-span-1">
          <AgentsStrip />
        </div>
      </div>

      <TrendingSocialDates />
      <RecentContentPacks />
    </div>
  );
}
