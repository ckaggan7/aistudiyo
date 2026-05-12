import { COURSES } from "@/lib/academy/courses";
import { useCompletions } from "@/lib/academy/progress";
import CourseCard from "./CourseCard";
export default function FeaturedCoursesCarousel() {
  const { completed } = useCompletions();
  return (
    <section id="courses" className="px-6 md:px-12 pb-14">
      <div className="mb-6"><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Featured</p><h2 className="text-3xl md:text-4xl font-bold tracking-tight">Hand-picked courses</h2></div>
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-thin -mx-1 px-1">
        {COURSES.map((c) => { const total = c.lessons.length; const done = c.lessons.filter((l) => completed[`${c.id}:${l.id}`]).length; return <CourseCard key={c.id} course={c} progress={total ? done / total : 0} />; })}
      </div>
    </section>
  );
}
