import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Calendar, Tag, Image as ImageIcon } from "lucide-react";
import GrowthPageShell from "@/components/growth/GrowthPageShell";
import { BUSINESS_CONTEXT } from "@/lib/growth/mockData";
import { callGrowthAi, type PostGeneratorResult } from "@/lib/growth/growthApi";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "offer", label: "Offer" },
  { id: "announcement", label: "Announcement" },
  { id: "update", label: "Update" },
  { id: "event", label: "Event" },
  { id: "festive", label: "Festive" },
  { id: "trending", label: "Trending" },
];

export default function BusinessProfile() {
  const { user } = useAuth();
  const [type, setType] = useState("offer");
  const [hint, setHint] = useState("Weekend brunch — 20% off for first-timers");
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<PostGeneratorResult | null>(null);

  async function generate() {
    setLoading(true);
    try {
      const r = await callGrowthAi("post_generator", `Type: ${type}. Goal: ${hint}`, { type });
      setPost(r);
    } catch (e) {
      toast({ title: "Generation failed", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }

  async function schedule() {
    if (!post) return;
    const when = new Date(); when.setHours(when.getHours() + 4);
    const { error } = await supabase.from("scheduled_posts").insert({
      user_id: user?.id ?? null,
      platform: "google_business",
      title: post.title,
      caption: `${post.body}\n\n${post.hashtags.join(" ")}`,
      scheduled_for: when.toISOString(),
      status: "scheduled",
    });
    if (error) {
      toast({ title: "Couldn't schedule", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Post scheduled", description: `Will publish ${when.toLocaleString()}` });
  }

  return (
    <GrowthPageShell
      title="Google Business Profile AI"
      subtitle="Generate posts, optimize listing, climb local search."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
        {/* Profile card */}
        <div className="lg:col-span-4 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="aspect-[16/9] rounded-xl bg-gradient-hero mb-3 flex items-center justify-center text-primary-foreground font-semibold">
            {BUSINESS_CONTEXT.name}
          </div>
          <div className="text-sm font-semibold">{BUSINESS_CONTEXT.name}</div>
          <div className="text-xs text-muted-foreground">{BUSINESS_CONTEXT.category} · {BUSINESS_CONTEXT.city}</div>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="font-medium">4.7 ★ (312)</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Profile completeness</span><span className="font-medium text-emerald-700">92%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Local SEO</span><span className="font-medium">78 / 100</span></div>
          </div>
          <div className="mt-3 p-2.5 rounded-xl bg-orange-50/60 border border-orange-200/60 text-[11px] text-foreground">
            <span className="font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" />AI tip</span>
            <span className="text-muted-foreground">Add 3 more interior photos to lift profile views ~8%.</span>
          </div>
        </div>

        {/* Post generator */}
        <div className="lg:col-span-8 bg-white border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl bg-gradient-hero shadow-glow flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold">Google Post Generator</div>
              <div className="text-[11px] text-muted-foreground">Optimized for local SEO + engagement</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-medium border transition-all",
                  type === t.id ? "bg-primary text-primary-foreground border-primary" : "bg-white text-muted-foreground border-border hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <textarea
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="What's this post about? (offer, event, news…)"
          />

          <div className="mt-3 flex items-center gap-2">
            <button onClick={generate} disabled={loading || !hint.trim()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-hero text-primary-foreground text-sm font-medium shadow-glow disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Generating…" : "Generate post"}
            </button>
            {post && (
              <button onClick={schedule} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-border text-sm font-medium hover:shadow-elegant">
                <Calendar className="w-4 h-4" /> Schedule
              </button>
            )}
          </div>

          {post && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-2xl border border-border bg-muted/30 space-y-3">
              <div className="text-sm font-semibold">{post.title}</div>
              <p className="text-sm whitespace-pre-wrap">{post.body}</p>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-foreground text-background">{post.cta_label}</button>
              <div className="flex flex-wrap gap-1">
                {post.hashtags.map((h, i) => <span key={i} className="text-[11px] text-primary">{h.startsWith("#") ? h : `#${h}`}</span>)}
              </div>
              <div className="pt-2 border-t border-border space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5 text-muted-foreground"><ImageIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span><b className="text-foreground">Image prompt:</b> {post.image_prompt}</span></div>
                <div className="flex items-start gap-1.5 text-muted-foreground"><Tag className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span><b className="text-foreground">Local keywords:</b> {post.keywords.join(", ")}</span></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </GrowthPageShell>
  );
}