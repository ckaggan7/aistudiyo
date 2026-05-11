import QuickCreateBar from "@/components/dashboard/QuickCreateBar";
import TrendingIdeasStrip from "@/components/dashboard/TrendingIdeasStrip";
import AISuggestions from "@/components/dashboard/AISuggestions";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import WhatsNewCarousel from "@/components/dashboard/WhatsNewCarousel";
import RecentContentPacks from "@/components/dashboard/RecentContentPacks";
import AgentsStrip from "@/components/dashboard/AgentsStrip";

export default function DashboardHome() {
  return (
    <div className="max-w-5xl mx-auto">
      <WelcomeHeader />
      <QuickCreateBar />
      <WhatsNewCarousel />
      <AISuggestions />
      <RecentContentPacks />
      <AgentsStrip />
      <TrendingIdeasStrip />
    </div>
  );
}
