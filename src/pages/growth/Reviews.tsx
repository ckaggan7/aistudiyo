import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Star, AlertTriangle, Copy, Check } from "lucide-react";
import GrowthPageShell from "@/components/growth/GrowthPageShell";
import { REVIEWS, type MockReview } from "@/lib/growth/mockData";
import { callGrowthAi, type ReviewReplyResult } from "@/lib/growth/growthApi";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SENTIMENT_TONE: Record<MockReview["sentiment"], string> = {
  positive: "bg-emerald-50 text-emerald-700",
  neutral: "bg-blue-50 text-blue-700",
  negative: "bg-rose-50 text-rose-700",
};

export default function Reviews() {
  const [reviews, setReviews] = useState<MockReview[]>(REVIEWS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<ReviewReplyResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [autoReply, setAutoReply] = useState(false);

  async function generate(r: MockReview) {
    setActiveId(r.id);
    setLoading(true);
    setReply(null);
    try {
      const res = await callGrowthAi("review_reply", `Review (${r.rating}★) by ${r.author}: "${r.text}"`);
      setReply(res);
    } catch (e) {
      toast({ title: "Reply failed", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }

  function send(text: string) {
    if (!activeId) return;
    setReviews((prev) => prev.map((r) => r.id === activeId ? { ...r, replied: true } : r));
    toast({ title: "Reply sent", description: text.slice(0, 80) + "…" });
    setActiveId(null);
    setReply(null);
  }

  return (
    <GrowthPageShell
      title="Review & Engagement AI"
      subtitle="Sentiment-aware replies, escalation flags, brand-safe tone."
      actions={
        <label className="flex items-center gap-2 text-xs bg-white border border-border rounded-full px-3 py-1.5 cursor-pointer">
          <input type="checkbox" checked={autoReply} onChange={(e) => setAutoReply(e.target.checked)} className="accent-primary" />
          Auto-reply positive reviews
        </label>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
        <div className="lg:col-span-7 space-y-3">
          {reviews.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{r.author}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 text-xs">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", SENTIMENT_TONE[r.sentiment])}>{r.sentiment}</span>
                    <span className="text-[11px] text-muted-foreground">· {r.date}</span>
                    {r.replied && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Replied</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5">{r.text}</p>
                </div>
                <button
                  onClick={() => generate(r)}
                  disabled={loading && activeId === r.id}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-hero text-primary-foreground text-xs font-medium shadow-glow disabled:opacity-60"
                >
                  {loading && activeId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  AI reply
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white border border-border rounded-2xl p-4 shadow-card sticky top-4">
            <div className="text-sm font-semibold mb-2">AI replies</div>
            {!reply && !loading && <div className="text-xs text-muted-foreground">Pick a review to generate 3 tone variants.</div>}
            {loading && <div className="text-xs text-muted-foreground">Generating tone variants…</div>}
            {reply && (
              <div className="space-y-3">
                {reply.escalate && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span><b>Escalate:</b> negative review — assign to manager.</span>
                  </div>
                )}
                {reply.replies.map((v) => (
                  <div key={v.tone} className="p-3 rounded-xl border border-border bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] uppercase tracking-wide font-semibold text-primary">{v.tone}</span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(v.text); setCopied(v.tone); setTimeout(() => setCopied(null), 1200); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copied === v.tone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs">{v.text}</p>
                    <button onClick={() => send(v.text)} className="mt-2 text-[11px] px-2.5 py-1 rounded-full bg-foreground text-background font-medium">
                      Send reply
                    </button>
                  </div>
                ))}
                <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-200/60 text-[11px]">
                  <span className="font-semibold">Internal note:</span> <span className="text-muted-foreground">{reply.improvement_note}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </GrowthPageShell>
  );
}