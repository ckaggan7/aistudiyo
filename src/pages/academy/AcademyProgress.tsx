import AcademyPageShell from "@/components/academy/AcademyPageShell";
import ProgressDashboard from "@/components/academy/ProgressDashboard";
import CreatorMissions from "@/components/academy/CreatorMissions";

export default function AcademyProgress() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell className="pt-10">
        <ProgressDashboard />
        <CreatorMissions />
      </AcademyPageShell>
    </div>
  );
}
