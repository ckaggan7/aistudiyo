import AcademyPageShell from "@/components/academy/AcademyPageShell";
import AcademyHero from "@/components/academy/AcademyHero";
import LearningTracks from "@/components/academy/LearningTracks";
import FeaturedCoursesCarousel from "@/components/academy/FeaturedCoursesCarousel";
import AIMentorPanel from "@/components/academy/AIMentorPanel";
import PracticeLabPreview from "@/components/academy/PracticeLabPreview";
import CertificationsShowcase from "@/components/academy/CertificationsShowcase";
import VideoLearningHub from "@/components/academy/VideoLearningHub";
import CreatorMissions from "@/components/academy/CreatorMissions";
import CommunityFeed from "@/components/academy/CommunityFeed";
import ProgressDashboard from "@/components/academy/ProgressDashboard";

export default function AcademyHome() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell>
        <AcademyHero />
        <ProgressDashboard />
        <LearningTracks />
        <FeaturedCoursesCarousel />
        <section className="px-6 md:px-12 pb-14 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><AIMentorPanel embedded /></div>
          <div className="space-y-3"><PracticeLabPreview /></div>
        </section>
        <CertificationsShowcase />
        <VideoLearningHub />
        <CreatorMissions compact />
        <CommunityFeed />
      </AcademyPageShell>
    </div>
  );
}
