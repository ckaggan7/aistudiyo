import { Flame, Trophy, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useXp, useCompletions, levelForXp } from "@/lib/academy/progress";
import { COURSES } from "@/lib/academy/courses";
import LevelRing from "./LevelRing";
export default function ProgressDashboard() {
  const { xp } = useXp();
  const { completed } = useCompletions();
  const { level, pct, into, nextAt } = levelForXp(xp);
  const completedCourses = COURSES.filter((c) => c.lessons.every((l) => completed[`${c.id}:${l.id}`])).length;
  const nextCourse = COURSES.find((c) => !c.lessons.every((l) => completed[`${c.id}:${l.id}`])) ?? COURSES[0];
  const stats = [{ icon: Flame, label: "Streak", value: "5 days" }, { icon: BookOpen, label: "Completed", value: `${completedCourses}/${COURSES.length}` }, { icon: Trophy, label: "XP", value: xp.toLocaleString() }];
  return (
    <section className="px-6 md:px-12 pb-10">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <LevelRing value={pct} size={96} stroke={8} color="hsl(38 95% 60%)" label={`Lv ${level}`} />
          <div className="flex-1"><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Your progress</p><h3 className="text-2xl md:text-3xl font-bold tracking-tight">Level {level} — {into}/{nextAt} XP</h3><p className="text-sm text-white/60 mt-1">Next up: <span className="text-white font-medium">{nextCourse.title}</span></p></div>
          <Link to={`/dashboard/academy/course/${nextCourse.id}`} className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold"><Sparkles className="w-4 h-4" /> Continue</Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">{stats.map((s) => (<div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-center gap-2 text-white/60 text-[11px] uppercase tracking-wider"><s.icon className="w-3.5 h-3.5" /> {s.label}</div><p className="mt-1 text-xl font-bold text-white">{s.value}</p></div>))}</div>
      </div>
    </section>
  );
}
