import AcademyPageShell from "@/components/academy/AcademyPageShell";
import VideoLearningHub from "@/components/academy/VideoLearningHub";

export default function AcademyVideos() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell className="pt-10">
        <VideoLearningHub />
      </AcademyPageShell>
    </div>
  );
}
