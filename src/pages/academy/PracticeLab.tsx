import { useState } from "react";
import AcademyPageShell from "@/components/academy/AcademyPageShell";
import LevelRing from "@/components/academy/LevelRing";
import { scoreAd, type LabScore } from "@/lib/academy/scoring";
import { FlaskConical, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "Google Ads", "X"];
const OBJECTIVES = ["Awareness", "Engagement", "Clicks", "Conversions"];

export default function PracticeLab() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [objective, setObjective] = useState("Engagement");
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState<LabScore | null>(null);

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try { setScore(await scoreAd(text, { platform, objective })); }
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
            <div><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Practice Lab</p><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Score your ad copy</h1></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">{PLATFORMS.map(p => <option key={p} className="bg-black">{p}</option>)}</select>
                <select value={objective} onChange={(e) => setObjective(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">{OBJECTIVES.map(o => <option key={o} className="bg-black">{o}</option>)}</select>
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your hook, caption, or full ad here…" className="w-full min-h-[220px] rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30" />
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
                </>
              )}
            </div>
          </div>
        </div>
      </AcademyPageShell>
    </div>
  );
}
