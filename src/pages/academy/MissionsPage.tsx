import AcademyPageShell from "@/components/academy/AcademyPageShell";
import CreatorMissions from "@/components/academy/CreatorMissions";
export default function MissionsPage() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell>
        <div className="pt-10"><CreatorMissions /></div>
      </AcademyPageShell>
    </div>
  );
}
