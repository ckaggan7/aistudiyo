import QuickCreateBar from "@/components/dashboard/QuickCreateBar";
import AISuggestions from "@/components/dashboard/AISuggestions";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import RecentContentPacks from "@/components/dashboard/RecentContentPacks";
import AgentsStrip from "@/components/dashboard/AgentsStrip";
import TrendingSocialDates from "@/components/dashboard/TrendingSocialDates";
import WhatsNewCarousel from "@/components/dashboard/WhatsNewCarousel";
import TrendingNowFeed from "@/components/dashboard/TrendingNowFeed";

export default function DashboardHome() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-5 pb-20 lg:pb-6">
      {/* Hero */}
      <WelcomeHeader />

      {/* Quick create + AI insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <QuickCreateBar />
        </div>
        <div className="lg:col-span-1">
          <AISuggestions />
        </div>
      </div>

      {/* What's new carousel */}
      <WhatsNewCarousel />

      {/* AI Agents + Trending Now */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <AgentsStrip />
        </div>
        <div className="lg:col-span-5">
          <TrendingNowFeed />
        </div>
      </div>

      {/* Social calendar + Content packs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <TrendingSocialDates />
        </div>
        <div className="lg:col-span-7">
          <RecentContentPacks />
        </div>
      </div>
    </div>
  );
}
