import { Link } from "react-router-dom";
import { Clock, Star, BadgeCheck } from "lucide-react";
import DifficultyChip from "./DifficultyChip";
import type { Course } from "@/lib/academy/courses";
export default function CourseCard({ course, progress = 0 }: { course: Course; progress?: number }) {
  return (
    <Link to={`/dashboard/academy/course/${course.id}`} className="group snap-start shrink-0 w-[280px] rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-white/30 transition-all">
      <div className={`relative h-36 bg-gradient-to-br ${course.thumbGradient} flex items-center justify-center`}>
        <span className="text-5xl drop-shadow">{course.emoji}</span>
        {course.certBadge && (<span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/40 text-amber-300 border border-amber-300/30 backdrop-blur"><BadgeCheck className="w-3 h-3" /> Cert</span>)}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10"><div className="h-full bg-white" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between"><DifficultyChip level={course.difficulty} /><span className="inline-flex items-center gap-0.5 text-[11px] text-amber-300"><Star className="w-3 h-3 fill-amber-300" /> {course.rating.toFixed(1)}</span></div>
        <h3 className="mt-2 text-base font-semibold text-white leading-tight line-clamp-1">{course.title}</h3>
        <p className="mt-1 text-[12px] text-white/55 leading-snug line-clamp-2">{course.tagline}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-white/45"><span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {course.durationMin}m</span><span>{course.lessons.length} lessons</span></div>
      </div>
    </Link>
  );
}
