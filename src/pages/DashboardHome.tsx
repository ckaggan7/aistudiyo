import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Calendar, TrendingUp, Hash, Flame, Sticker, Briefcase, ArrowRight, Sparkles, Image as ImageIcon } from "lucide-react";
import { Squiggle, StarDoodle, SpiralDoodle } from "@/components/Doodles";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

const stats = [
  { icon: FileText, label: "Posts Created", value: "128", change: "+12%" },
  { icon: Calendar, label: "Scheduled Posts", value: "24", change: "+8%" },
  { icon: TrendingUp, label: "Engagement Rate", value: "4.8%", change: "+0.3%" },
  { icon: Hash, label: "Trending Hashtags", value: "56", change: "+15%" },
];

const featureCards = [
  {
    title: "Trending Templates",
    description: "Hand-picked templates winning across Reels, Posts & Carousels this week.",
    icon: Flame,
    path: "/dashboard/templates",
    gradient: "from-primary via-orange-500 to-pink-500",
    accent: "bg-primary/10 text-primary",
    badge: "🔥 12 new",
    preview: ["🎬", "🛍️", "💭", "✨"],
  },
  {
    title: "Sticker Generator",
    description: "Type an idea, pick a style, and generate ready-to-use stickers instantly.",
    icon: Sticker,
    path: "/dashboard/stickers",
    gradient: "from-accent via-purple-500 to-pink-400",
    accent: "bg-accent/10 text-accent",
    badge: "✨ AI",
    preview: ["🚀", "💖", "⭐", "🌈"],
  },
  {
    title: "Branding CRM",
    description: "Manage every client brand, color palette, logo, and asset in one place.",
    icon: Briefcase,
    path: "/dashboard/branding",
    gradient: "from-primary-glow via-primary to-accent",
    accent: "bg-primary-glow/10 text-primary",
    badge: "Pro",
    preview: ["☕", "✨", "🌿", "+"],
  },
];

const quickActions = [
  { label: "Generate Caption", icon: Sparkles, path: "/dashboard/generator" },
  { label: "Create Image", icon: ImageIcon, path: "/dashboard/images" },
  { label: "Schedule Post", icon: Calendar, path: "/dashboard/calendar" },
  { label: "View Analytics", icon: TrendingUp, path: "/dashboard/analytics" },
];

export default function DashboardHome() {
  return (
    <div className="relative">
      <div className="absolute -top-2 right-10 hidden md:block opacity-50">
        <StarDoodle className="w-10 h-10 text-primary" />
      </div>
      <div className="absolute top-32 right-1/3 hidden lg:block opacity-40">
        <SpiralDoodle className="w-16 h-16 text-accent" />
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back <span className="text-gradient-hero">Creator</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's trending in your studio today</p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 1}
            className="bg-card rounded-2xl p-5 shadow-card border border-border/40"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-success">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Featured Tools</h2>
        <span className="text-xs text-muted-foreground">Power up your workflow</span>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {featureCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 5}
          >
            <Link
              to={card.path}
              className="group block rounded-2xl overflow-hidden shadow-card border border-border/40 hover:shadow-elevated hover:-translate-y-1 transition-all bg-card h-full"
            >
              {/* Gradient header */}
              <div className={`relative h-32 bg-gradient-to-br ${card.gradient} p-5 flex items-end justify-between overflow-hidden`}>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/15 blur-2xl" />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="relative ml-auto flex gap-1.5">
                  {card.preview.map((emoji, idx) => (
                    <div
                      key={idx}
                      className="w-9 h-9 rounded-xl bg-white/95 flex items-center justify-center text-lg shadow-sm"
                      style={{ transform: `rotate(${(idx - 1.5) * 6}deg)` }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/95 text-foreground">
                  {card.badge}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-base mb-1.5">{card.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{card.description}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                  Open
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent + Quick actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={9} className="bg-card rounded-2xl p-6 shadow-card border border-border/40 relative overflow-hidden">
          <div className="absolute -bottom-2 -right-2 opacity-30">
            <Squiggle className="w-32 h-16 text-primary" />
          </div>
          <h3 className="font-semibold mb-4 relative">Recent Posts</h3>
          <div className="space-y-3 relative">
            {["Summer vibes collection launch 🌊", "Behind the scenes at our studio 🎬", "New product announcement 🚀"].map((post, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
                  IG
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post}</p>
                  <p className="text-xs text-muted-foreground">Instagram · 2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={10} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="p-4 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <action.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
