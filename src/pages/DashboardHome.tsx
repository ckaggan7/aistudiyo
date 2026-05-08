import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Wand2, Calendar, ArrowRight, ArrowUpRight,
  ImageIcon, FileText, TrendingUp, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ScheduledPostsPanel from "@/components/scheduled/ScheduledPostsPanel";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

type Generation = {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
};

const stats = [
  { icon: ImageIcon, label: "Images",  value: "128", delta: "+12%" },
  { icon: FileText,  label: "Captions", value: "64",  delta: "+8%"  },
  { icon: Calendar,  label: "Scheduled",value: "24",  delta: "+3"   },
  { icon: TrendingUp,label: "Engagement",value: "4.8%",delta: "+0.3%"},
];

export default function DashboardHome() {
  const [recent, setRecent] = useState<Generation[]>([]);

  useEffect(() => {
    supabase
      .from("generations")
      .select("id, image_url, prompt, created_at")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setRecent((data as Generation[]) ?? []));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <motion.section
        initial="hidden" animate="visible" variants={fadeUp} custom={0}
        className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 md:p-10 mb-8"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-hero opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-accent opacity-15 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-4">
              <Zap className="w-3 h-3" /> Studio is ready
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Good to see you, <span className="text-gradient-hero">Creator</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              One canvas for every idea — generate, design, and schedule in seconds.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-glow">
              <Link to="/dashboard/image-studio">
                <Wand2 className="w-4 h-4" /> New image
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard/generator">
                <Sparkles className="w-4 h-4" /> New caption
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}
            className="group bg-card rounded-2xl p-5 border border-border/40 hover:border-primary/30 hover:shadow-card transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-success inline-flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />{s.delta}
              </span>
            </div>
            <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={5}
          className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border/40"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Quick start</h3>
          </div>
          <div className="space-y-1">
            {[
              { title: "Image Studio",  desc: "Generate & edit visuals", icon: Wand2,    to: "/dashboard/image-studio" },
              { title: "Caption Writer",desc: "Hooks, posts, hashtags",   icon: Sparkles, to: "/dashboard/generator" },
              { title: "Calendar",      desc: "Plan your week",           icon: Calendar, to: "/dashboard/calendar" },
              { title: "Trends",        desc: "What's hot today",         icon: TrendingUp,to: "/dashboard/trends" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-secondary/60 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <a.icon className="w-4 h-4 text-foreground/70 group-hover:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{a.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Scheduled posts widget */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={6}
          className="lg:col-span-2"
        >
          <ScheduledPostsPanel />
        </motion.div>
      </div>

      {/* Recent creations strip */}
      {recent.length > 0 && (
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={7}
          className="mt-6 bg-card rounded-2xl p-6 border border-border/40"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Recent creations</h3>
              <p className="text-xs text-muted-foreground">Latest from the studio</p>
            </div>
            <Link to="/dashboard/media" className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {recent.map((g) => (
              <Link key={g.id} to="/dashboard/media" className="group relative aspect-square rounded-xl overflow-hidden bg-secondary">
                <img src={g.image_url} alt={g.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
