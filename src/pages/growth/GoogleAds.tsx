import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, X, Target, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import GrowthPageShell from "@/components/growth/GrowthPageShell";
import { CAMPAIGNS, type MockCampaign } from "@/lib/growth/mockData";
import { callGrowthAi, type AdsCampaignResult } from "@/lib/growth/growthApi";
import { cn } from "@/lib/utils";

function StatusPill({ status }: { status: MockCampaign["status"] }) {
  const map = {
    active: "bg-emerald-50 text-emerald-700",
    paused: "bg-amber-50 text-amber-700",
    draft: "bg-muted text-muted-foreground",
  } as const;
  return <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full capitalize", map[status])}>{status}</span>;
}

export default function GoogleAds() {
  const [campaigns, setCampaigns] = useState<MockCampaign[]>(CAMPAIGNS);
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("Drive weekend brunch reservations from young professionals in Bangalore.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdsCampaignResult | null>(null);

  async function generate() {
    setLoading(true);
    setResult(null);
    try {
      const r = await callGrowthAi("ads_campaign", prompt);
      setResult(r);
    } catch (e) {
      toast({ title: "Generation failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function saveDraft() {
    if (!result) return;
    setCampaigns((prev) => [
      {
        id: `c${prev.length + 1}`,
        name: result.campaign_name,
        status: "draft",
        cpc: result.predicted_cpc_usd,
        ctr: result.predicted_ctr,
        conversions: 0,
        spend: 0,
        ai_score: result.ai_score,
      },
      ...prev,
    ]);
    setOpen(false);
    setResult(null);
    toast({ title: "Campaign saved as draft", description: result.campaign_name });
  }

  return (
    <GrowthPageShell
      title="Google Ads AI"
      subtitle="AI builds headlines, descriptions, keywords and audience — in one click."
      actions={
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-hero text-primary-foreground text-sm font-medium shadow-glow"
        >
          <Sparkles className="w-4 h-4" /> New AI Campaign
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {campaigns.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white border border-border rounded-2xl p-4 shadow-card hover:shadow-elegant transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">{c.name}</div>
              <StatusPill status={c.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div><div className="text-[10px] text-muted-foreground">CPC</div><div className="text-sm font-semibold">${c.cpc.toFixed(2)}</div></div>
              <div><div className="text-[10px] text-muted-foreground">CTR</div><div className="text-sm font-semibold">{c.ctr}%</div></div>
              <div><div className="text-[10px] text-muted-foreground">Conv.</div><div className="text-sm font-semibold">{c.conversions}</div></div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-[11px] text-muted-foreground">Spend ${c.spend}</div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-primary">
                <Sparkles className="w-3 h-3" /> AI {c.ai_score || "—"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold">New AI Campaign</div>
                  <div className="text-xs text-muted-foreground">Describe your business goal — AI builds the rest.</div>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4 overflow-y-auto scrollbar-thin">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. Drive weekend brunch reservations from young professionals in Bangalore."
                />
                <button
                  onClick={generate}
                  disabled={loading || !prompt.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-hero text-primary-foreground text-sm font-medium shadow-glow disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? "Generating..." : "Generate campaign"}
                </button>

                {result && (
                  <div className="space-y-3">
                    <div className="bg-orange-50/60 border border-orange-200/60 rounded-2xl p-3">
                      <div className="text-sm font-semibold">{result.campaign_name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{result.objective}</div>
                      <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" />{result.audience}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${result.daily_budget_usd}/day</span>
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{result.predicted_ctr}% CTR · ${result.predicted_cpc_usd.toFixed(2)} CPC</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-primary font-semibold"><Sparkles className="w-3 h-3" />AI {result.ai_score}</span>
                      </div>
                    </div>
                    <Section label="Headlines">
                      <div className="flex flex-wrap gap-1.5">
                        {result.headlines.map((h, i) => <span key={i} className="text-xs bg-white border border-border rounded-full px-2.5 py-1">{h}</span>)}
                      </div>
                    </Section>
                    <Section label="Descriptions">
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {result.descriptions.map((d, i) => <li key={i}>· {d}</li>)}
                      </ul>
                    </Section>
                    <Section label="Keywords">
                      <div className="flex flex-wrap gap-1">
                        {result.keywords.map((k, i) => <span key={i} className="text-[11px] bg-muted px-2 py-0.5 rounded-full">{k}</span>)}
                      </div>
                    </Section>
                    <Section label="Ad groups">
                      <div className="flex flex-wrap gap-1">
                        {result.ad_groups.map((g, i) => <span key={i} className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{g}</span>)}
                      </div>
                    </Section>
                    <p className="text-[11px] text-muted-foreground italic">{result.rationale}</p>
                    <button onClick={saveDraft} className="w-full px-3 py-2 rounded-xl bg-foreground text-background text-sm font-medium">
                      Save as draft campaign
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GrowthPageShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1.5">{label}</div>
      {children}
    </div>
  );
}