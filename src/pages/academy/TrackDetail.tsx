import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AcademyPageShell from "@/components/academy/AcademyPageShell";
import { getTrack } from "@/lib/academy/tracks";
import { COURSES } from "@/lib/academy/courses";
import { useCompletions, trackProgress } from "@/lib/academy/progress";
import CourseCard from "@/components/academy/CourseCard";
import LevelRing from "@/components/academy/LevelRing";

export default function TrackDetail() {
  const { trackId = "" } = useParams();
  const track = getTrack(trackId);
  const { completed } = useCompletions();
  if (!track) return <div className="p-10 text-white">Track not found.</div>;
  const courses = COURSES.filter((c) => track.courseIds.includes(c.id));
  const progress = trackProgress(track.courseIds, completed, COURSES);
  const Icon = track.icon;
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell>
        <div className="px-6 md:px-12 pt-8 pb-10">
          <Link to="/dashboard/academy" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Academy</Link>
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${track.gradient} flex items-center justify-center shadow-xl`}><Icon className="w-7 h-7 text-white" /></div>
            <div className="flex-1"><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Track</p><h1 className="text-3xl md:text-4xl font-bold tracking-tight">{track.title}</h1><p className="text-sm text-white/60 mt-1">{track.blurb}</p></div>
            <LevelRing value={progress} size={72} stroke={6} color={track.accent} />
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => { const total = c.lessons.length; const done = c.lessons.filter((l) => completed[`${c.id}:${l.id}`]).length; return <CourseCard key={c.id} course={c} progress={total ? done / total : 0} />; })}
          </div>
        </div>
      </AcademyPageShell>
    </div>
  );
}
