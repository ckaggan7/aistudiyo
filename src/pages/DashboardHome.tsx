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
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6 space-y-4">
      {/* Band 1 — hero */}
      <WelcomeHeader />

      {/* Band 2 — Act now */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7"><QuickCreateBar /></div>
        <div className="lg:col-span-5"><AISuggestions /></div>
      </div>

      {/* What's new — full row */}
      <WhatsNewCarousel />

      {/* Band 3 — Discover */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7"><AgentsStrip /></div>
        <div className="lg:col-span-5"><TrendingNowFeed /></div>
      </div>

      {/* Upcoming moments — full row */}
      <TrendingSocialDates />

      {/* Band 4 — Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8"><RecentContentPacks /></div>
        <div className="lg:col-span-4"><CalendarPreview /></div>
      </div>

      {/* Band 5 — Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8"><CreatorMomentum /></div>
        <div className="lg:col-span-4"><CoreActionCards /></div>
      </div>
    </div>
  );
}
