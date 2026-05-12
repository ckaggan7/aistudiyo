import AcademyPageShell from "@/components/academy/AcademyPageShell";
import LearningTracks from "@/components/academy/LearningTracks";

export default function AcademyTracks() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell className="pt-10">
        <LearningTracks />
      </AcademyPageShell>
    </div>
  );
}