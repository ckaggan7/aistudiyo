import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Calendar, TrendingUp, Hash, ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { Squiggle, StarDoodle } from "@/components/Doodles";

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

const startActions = [
  {
    title: "New image",
    description: "Generate a visual with AI styles, stickers, and edits.",
    icon: Wand2,
    path: "/dashboard/image-studio",
    gradient: "from-primary to-accent",
  },
  {
    title: "New caption",
    description: "Write captions, hooks and hashtags for any platform.",
    icon: Sparkles,
    path: "/dashboard/generator",
    gradient: "from-accent to-purple-500",
  },
  {
    title: "Schedule a post",
    description: "Plan your week with the visual content calendar.",
    icon: Calendar,
    path: "/dashboard/calendar",
    gradient: "from-orange-400 to-primary",
  },
];

export default function DashboardHome() {
  return (
    <div className="relative">
      <div className="absolute -top-2 right-10 hidden md:block opacity-50">
        <StarDoodle className="w-10 h-10 text-primary" />
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

      {/* Start creating + Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
          <h3 className="font-semibold mb-1">Start creating</h3>
          <p className="text-sm text-muted-foreground mb-4">Jump into the studio</p>
          <div className="space-y-2.5">
            {startActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shrink-0`}>
                  <action.icon className="w-4.5 h-4.5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>

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
      </div>
    </div>
  );
}
