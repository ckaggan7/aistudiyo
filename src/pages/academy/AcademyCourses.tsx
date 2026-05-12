import AcademyPageShell from "@/components/academy/AcademyPageShell";
import FeaturedCoursesCarousel from "@/components/academy/FeaturedCoursesCarousel";

export default function AcademyCourses() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell className="pt-10">
        <FeaturedCoursesCarousel />
      </AcademyPageShell>
    </div>
  );
}