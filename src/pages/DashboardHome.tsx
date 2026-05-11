import QuickCreateBar from "@/components/dashboard/QuickCreateBar";
import AISuggestions from "@/components/dashboard/AISuggestions";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import RecentContentPacks from "@/components/dashboard/RecentContentPacks";
import AgentsStrip from "@/components/dashboard/AgentsStrip";
import TrendingSocialDates from "@/components/dashboard/TrendingSocialDates";
import WhatsNewCarousel from "@/components/dashboard/WhatsNewCarousel";
import TrendingNowFeed from "@/components/dashboard/TrendingNowFeed";
import CreatorMomentum from "@/components/dashboard/CreatorMomentum";
import CalendarPreview from "@/components/dashboard/CalendarPreview";
import CoreActionCards from "@/components/dashboard/CoreActionCards";

export default function DashboardHome() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      {/* Unified bento mosaic — every section is a tile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-min">
        {/* Row 1 — hero spans full width */}
        <div className="lg:col-span-12">
          <WelcomeHeader />
        </div>

        {/* Row 2 — quick create + AI insights */}
        <div className="lg:col-span-7">
          <QuickCreateBar />
        </div>
        <div className="lg:col-span-5">
          <AISuggestions />
        </div>

        {/* Row 3 — agents + trending feed */}
        <div className="lg:col-span-8">
          <AgentsStrip />
        </div>
        <div className="lg:col-span-4 lg:row-span-2">
          <TrendingNowFeed />
        </div>

        {/* Row 3b — what's new carousel beside trending */}
        <div className="lg:col-span-8">
          <WhatsNewCarousel />
        </div>

        {/* Row 4 — calendar moments + content packs */}
        <div className="lg:col-span-5">
          <TrendingSocialDates />
        </div>
        <div className="lg:col-span-7">
          <RecentContentPacks />
        </div>

        {/* Row 5 — momentum + week peek + core actions */}
        <div className="lg:col-span-4">
          <CreatorMomentum />
        </div>
        <div className="lg:col-span-4">
          <CalendarPreview />
        </div>
        <div className="lg:col-span-4">
          <CoreActionCards />
        </div>
      </div>
    </div>
  );
}
