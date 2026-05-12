import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AcademyPageShell from "@/components/academy/AcademyPageShell";
import LevelRing from "@/components/academy/LevelRing";
import { scoreAd, type LabScore } from "@/lib/academy/scoring";
import { FlaskConical, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { buildStudioUrl } from "@/lib/academy/launch";

const PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "Google Ads", "X"];
const OBJECTIVES = ["Awareness", "Engagement", "Clicks", "Conversions"];

const LAB_META: Record<string, { title: string; subtitle: string; placeholder: string }> = {
  "ad-copy":              { title: "Ad Copy Lab",         subtitle: "Score your ad copy",            placeholder: "Paste your full ad copy here…" },
  "hook":                 { title: "Hook Lab",            subtitle: "Stress-test your scroll-stoppers", placeholder: "Paste a single hook (1-2 sentences)…" },
  "cta":                  { title: "CTA Lab",             subtitle: "Score your call-to-action",     placeholder: "Paste your CTA line…" },
  "gbp":                  { title: "Google Profile Lab",  subtitle: "Local SEO check",               placeholder: "Paste your GBP description…" },
  "reel-strategy":        { title: "Reel Strategy Lab",   subtitle: "Score your reel concept",       placeholder: "Paste your reel script or beats…" },
  "viral-hook-challenge": { title: "Viral Hook Challenge", subtitle: "How shareable is your hook?",  placeholder: "Drop one hook. Beat 90 to win." },
  "default":              { title: "Practice Lab",        subtitle: "Score your ad copy",            placeholder: "Paste your hook, caption, or full ad here…" },
};

export default function PracticeLab() {
  const [params] = useSearchParams();
  const type = params.get("type") || "default";
  const meta = LAB_META[type] ?? LAB_META.default;
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [objective, setObjective] = useState("Engagement");
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState<LabScore | null>(null);

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try { setScore(await scoreAd(text, { platform, objective }, type === "default" ? undefined : type)); }
    catch { toast.error("Lab is busy. Try again in a moment."); }
    finally { setBusy(false); }
  };

  const rings = score ? [
    { label: "Hook", value: score.hook_quality },
    { label: "CTR", value: score.ctr_potential },
    { label: "Read", value: score.readability },
    { label: "Engage", value: score.engagement },
    { label: "Platform", value: score.platform_fit },
  ] : [];

  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell>
        <div className="px-6 md:px-12 pt-12 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center"><FlaskConical className="w-5 h-5 text-white" /></div>
            <div><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">{meta.title}</p><h1 className="text-3xl md:text-4xl font-bold tracking-tight">{meta.subtitle}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(LAB_META).filter(([k]) => k !== "default").map(([k, m]) => (
              <Link key={k} to={`/dashboard/academy/practice-lab?type=${k}`} className={`text-[11px] px-3 py-1.5 rounded-full border ${type === k ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/5"}`}>{m.title}</Link>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">{PLATFORMS.map(p => <option key={p} className="bg-black">{p}</option>)}</select>
                <select value={objective} onChange={(e) => setObjective(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">{OBJECTIVES.map(o => <option key={o} className="bg-black">{o}</option>)}</select>
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={meta.placeholder} className="w-full min-h-[220px] rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30" />
              <button onClick={run} disabled={busy || !text.trim()} className="mt-3 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white text-sm font-semibold disabled:opacity-40">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} {busy ? "Scoring…" : "Score it"}
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              {!score && <p className="text-white/50 text-sm">Your score breakdown will appear here.</p>}
              {score && (
                <>
                  <div className="flex items-center gap-4 mb-5">
                    <LevelRing value={score.overall / 100} size={84} stroke={7} color="hsl(38 95% 60%)" label={`${score.overall}`} />
                    <div><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Overall</p><h2 className="text-2xl font-bold">{score.overall >= 80 ? "Gold tier" : score.overall >= 60 ? "Solid" : "Needs work"}</h2></div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mb-5">
                    {rings.map((r) => (<div key={r.label} className="flex flex-col items-center gap-1"><LevelRing value={r.value / 100} size={52} color="hsl(280 70% 65%)" label={`${r.value}`} /><span className="text-[10px] text-white/60">{r.label}</span></div>))}
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 mb-3"><p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1.5">Suggestions</p><ul className="text-[13px] text-white/80 list-disc list-inside space-y-1">{score.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                  <div className="rounded-xl bg-amber-500/[0.06] border border-amber-400/20 p-3"><p className="text-[10px] uppercase tracking-wider text-amber-200 font-semibold mb-1.5">Sharper rewrite</p><p className="text-sm text-white whitespace-pre-wrap">{score.rewrite}</p></div>
                  <div className="mt-3">
                    <Link to={buildStudioUrl({ topic: score.rewrite, platform: platform.toLowerCase().replace(/ .*/, ""), source: "lab" })} className="inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full bg-white/5 border border-white/15 hover:bg-white/10 text-white/85">
                      Build this in Studio <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </AcademyPageShell>
    </div>
  );
}
