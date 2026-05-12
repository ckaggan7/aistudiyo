import { TRACKS } from "@/lib/academy/tracks";
import { COURSES } from "@/lib/academy/courses";
import { useCompletions, trackProgress } from "@/lib/academy/progress";
import TrackCard from "./TrackCard";
export default function LearningTracks() {
  const { completed } = useCompletions();
  return (
    <section id="tracks" className="px-6 md:px-12 pb-14">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Learning paths</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pick a track. Level up weekly.</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TRACKS.map((t) => <TrackCard key={t.id} track={t} progress={trackProgress(t.courseIds, completed, COURSES)} />)}
      </div>
    </section>
  );
}
