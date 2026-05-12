import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Play, FileText, FlaskConical, HelpCircle, Sparkles } from "lucide-react";
import AcademyPageShell from "@/components/academy/AcademyPageShell";
import AIMentorPanel from "@/components/academy/AIMentorPanel";
import DifficultyChip from "@/components/academy/DifficultyChip";
import { getCourse } from "@/lib/academy/courses";
import { useCompletions, useXp } from "@/lib/academy/progress";
import { toast } from "sonner";

const ICONS = { video: Play, reading: FileText, lab: FlaskConical, quiz: HelpCircle } as const;

export default function CourseDetail() {
  const { courseId = "" } = useParams();
  const course = getCourse(courseId);
  const { completed, toggle } = useCompletions();
  const { addXp } = useXp();
  if (!course) return <div className="p-10 text-white">Course not found.</div>;

  const total = course.lessons.length;
  const done = course.lessons.filter((l) => completed[`${course.id}:${l.id}`]).length;

  const markDone = (lid: string) => {
    const k = `${course.id}:${lid}`;
    if (completed[k]) return;
    toggle(k, true);
    addXp(20);
    toast.success("+20 XP — lesson complete!");
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell>
        <div className="px-6 md:px-12 pt-8 pb-10">
          <Link to="/dashboard/academy" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Academy</Link>
          <div className={`relative rounded-3xl overflow-hidden border border-white/10 p-8 md:p-12 bg-gradient-to-br ${course.thumbGradient}`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
              <div className="text-5xl mb-3">{course.emoji}</div>
              <div className="flex items-center gap-2 mb-2"><DifficultyChip level={course.difficulty} /><span className="text-[11px] text-white/80">{course.durationMin}m · {total} lessons · ★ {course.rating}</span></div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{course.title}</h1>
              <p className="mt-2 text-white/85 max-w-2xl">{course.tagline}</p>
              <p className="mt-4 text-sm text-white/80">{done}/{total} complete</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-2">
              {course.lessons.map((l) => {
                const isDone = !!completed[`${course.id}:${l.id}`];
                const Icon = ICONS[l.type];
                return (
                  <div key={l.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <Icon className="w-4 h-4 text-white/70" />
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white">{l.title}</p><p className="text-[11px] text-white/45">{l.type} · {l.minutes}m</p></div>
                    <button onClick={() => markDone(l.id)} className="text-white/70 hover:text-white">{isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5" />}</button>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 mb-4">
                <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-2">Ask the mentor</p>
                <p className="text-sm text-white/70 mb-3">Stuck on a lesson? Get an instant explanation or example.</p>
                <Link to="/dashboard/academy/mentor" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold"><Sparkles className="w-4 h-4" /> Open mentor</Link>
              </div>
              <AIMentorPanel embedded />
            </div>
          </div>
        </div>
      </AcademyPageShell>
    </div>
  );
}
