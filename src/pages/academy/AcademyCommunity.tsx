import AcademyPageShell from "@/components/academy/AcademyPageShell";
import CommunityFeed from "@/components/academy/CommunityFeed";

export default function AcademyCommunity() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell className="pt-10">
        <CommunityFeed />
      </AcademyPageShell>
    </div>
  );
}
