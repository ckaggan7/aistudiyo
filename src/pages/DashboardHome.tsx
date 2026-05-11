import QuickCreateBar from "@/components/dashboard/QuickCreateBar";
import AISuggestions from "@/components/dashboard/AISuggestions";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import RecentContentPacks from "@/components/dashboard/RecentContentPacks";
import AgentsStrip from "@/components/dashboard/AgentsStrip";
import TrendingSocialDates from "@/components/dashboard/TrendingSocialDates";
import CreatorMomentum from "@/components/dashboard/CreatorMomentum";

export default function DashboardHome() {
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <WelcomeHeader />
      <QuickCreateBar />
      <CreatorMomentum />
      <AgentsStrip />
      <AISuggestions />
      <TrendingSocialDates />
      <RecentContentPacks />
    </div>
  );
}
