import { Link } from "react-router-dom";
import { GraduationCap, Sparkles, Trophy, ArrowRight } from "lucide-react";
import LevelRing from "@/components/academy/LevelRing";
import { useXp, useCompletions, levelForXp, trackProgress } from "@/lib/academy/progress";
import { TRACKS } from "@/lib/academy/tracks";
import { COURSES } from "@/lib/academy/courses";
import { CERTIFICATES } from "@/lib/academy/certificates";

export default function AcademyProgressCard() {
  const { xp } = useXp();
  const { completed } = useCompletions();
  const { level, pct, into, nextAt } = levelForXp(xp);

  // Active track = the one with highest non-complete progress
  const tracksWithProgress = TRACKS.map((t) => ({ t, p: trackProgress(t.courseIds, completed, COURSES) }));
  const active = tracksWithProgress.find((x) => x.p > 0 && x.p < 1) ?? tracksWithProgress[0];
  const earnedCerts = CERTIFICATES.filter((c) => xp >= c.xpRequired).length;

  const nextCourse = COURSES.find((c) => !c.lessons.every((l) => completed[`${c.id}:${l.id}`])) ?? COURSES[0];

  return (
    <section className="card-bento relative overflow-hidden p-5 h-full flex flex-col">
      <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-transparent blur-2xl" />
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Academy</p>
        </div>
        <Link to="/dashboard/academy" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          Open <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="relative flex items-center gap-4">
        <LevelRing value={pct} size={72} stroke={6} color="hsl(22 100% 55%)" trackColor="hsl(var(--muted))" label={`Lv ${level}`} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-tight truncate">{active.t.title}</h3>
          <p className="text-[11px] text-muted-foreground">{into}/{nextAt} XP · {Math.round(active.p * 100)}% track</p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Trophy className="w-3 h-3" /> {earnedCerts} certs</span>
            <span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> {xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      <div className="relative mt-3 rounded-xl bg-muted/50 border border-border/60 p-2.5">
        <p className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">Mentor tip:</span> {active.t.blurb}</p>
      </div>

      <Link
        to={`/dashboard/academy/course/${nextCourse.id}`}
        className="relative mt-auto pt-3 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold hover:opacity-90 transition"
      >
        <Sparkles className="w-3.5 h-3.5" /> Continue learning
      </Link>
    </section>
  );
}