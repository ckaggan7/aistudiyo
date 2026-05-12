import { Link } from "react-router-dom";
import { Sparkles, Flame, Trophy, ArrowRight } from "lucide-react";
import LevelRing from "./LevelRing";
import { useXp, useCompletions } from "@/lib/academy/progress";
import { tierForXp, tierProgress } from "@/lib/academy/levels";
import { COURSES } from "@/lib/academy/courses";

export default function ProgressHero() {
  const { xp } = useXp();
  const { completed } = useCompletions();
  const tier = tierForXp(xp);
  const prog = tierProgress(xp);
  const nextCourse = COURSES.find((c) => !c.lessons.every((l) => completed[`${c.id}:${l.id}`])) ?? COURSES[0];
  const completedCourses = COURSES.filter((c) => c.lessons.every((l) => completed[`${c.id}:${l.id}`])).length;

  return (
    <section className="relative px-6 md:px-12 pt-12 pb-10">
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/3 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-orange-500/30 via-pink-500/20 to-violet-500/20 blur-[120px]" />
      </div>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-transparent p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <LevelRing value={prog.pct} size={108} stroke={9} color={tier.color} label={`Lv ${tier.level}`} />
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-300" /> Your growth journey
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
              {tier.name}
              <span className="block text-base md:text-lg font-normal text-white/60 mt-2">
                {prog.total > 0 ? `${prog.into} / ${prog.total} XP to next tier` : "Top tier reached — coach others now."}
              </span>
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
              <span className="text-white/50">Today's focus:</span>
              <span className="font-medium text-white">{nextCourse.title}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <Link to={`/dashboard/academy/course/${nextCourse.id}`} className="inline-flex items-center justify-center gap-1.5 h-11 px-6 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 text-white text-sm font-semibold shadow-[0_8px_30px_-8px_rgba(236,72,153,0.7)]">
              Continue learning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard/academy/practice-lab" className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-full bg-white/5 border border-white/15 text-white/90 text-sm font-medium hover:bg-white/10">
              Open practice lab
            </Link>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-white/60 text-[10px] uppercase tracking-wider"><Flame className="w-3.5 h-3.5 text-orange-300" /> Streak</div>
            <p className="mt-1 text-xl font-bold text-white">5 days</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-white/60 text-[10px] uppercase tracking-wider"><Trophy className="w-3.5 h-3.5 text-amber-300" /> Courses</div>
            <p className="mt-1 text-xl font-bold text-white">{completedCourses}/{COURSES.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-white/60 text-[10px] uppercase tracking-wider"><Sparkles className="w-3.5 h-3.5 text-violet-300" /> XP</div>
            <p className="mt-1 text-xl font-bold text-white">{xp.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
