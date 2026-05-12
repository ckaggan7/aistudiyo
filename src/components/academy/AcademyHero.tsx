import { Link } from "react-router-dom";
import { ArrowRight, Play, GraduationCap, Sparkles } from "lucide-react";
import AIOrb from "@/components/dashboard/AIOrb";
import { COURSES } from "@/lib/academy/courses";

export default function AcademyHero() {
  const floaters = COURSES.slice(0, 3);
  return (
    <section className="relative px-6 md:px-12 pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        <div className="flex-1 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider bg-white/5 border border-white/10 text-white/70">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" /> AISTUDIYO Ads Academy
          </span>
          <h1 className="mt-4 text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">Learn. Create. </span>
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">Grow.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/70 max-w-xl">
            Master AI-powered advertising, social growth, content creation, and business automation — the way creators actually learn.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#tracks" className="inline-flex items-center gap-1.5 h-11 px-6 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 text-white text-sm font-semibold shadow-[0_8px_30px_-8px_rgba(236,72,153,0.7)] hover:scale-[1.02] transition-transform">
              Start learning <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#courses" className="inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-white/5 border border-white/15 text-white/90 text-sm font-medium hover:bg-white/10 transition-colors">
              <Play className="w-3.5 h-3.5" /> Explore courses
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">
            <span><b className="text-white">12,400+</b> creators learning</span>
            <span><b className="text-white">87</b> courses</span>
            <span><b className="text-white">5</b> certifications</span>
          </div>
        </div>

        <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px] shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-violet-600/30 blur-3xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AIOrb size={260} />
          </div>
          {/* Floating course chips */}
          {floaters.map((c, i) => {
            const positions = [
              "top-2 -left-6 rotate-[-6deg]",
              "-right-4 top-1/3 rotate-[5deg]",
              "bottom-2 left-4 rotate-[-3deg]",
            ];
            return (
              <div key={c.id} className={`absolute ${positions[i]} w-[180px] rounded-2xl p-3 bg-gradient-to-br ${c.thumbGradient} shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] border border-white/10`}>
                <div className="text-2xl">{c.emoji}</div>
                <p className="text-[11px] font-semibold mt-1 leading-tight text-white">{c.title}</p>
                <p className="text-[10px] text-white/80 mt-0.5">{c.durationMin}m · ★ {c.rating}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}