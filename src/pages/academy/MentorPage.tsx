import AcademyPageShell from "@/components/academy/AcademyPageShell";
import AIMentorPanel from "@/components/academy/AIMentorPanel";
export default function MentorPage() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell>
        <div className="px-6 md:px-12 pt-12 pb-10">
          <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">AI Mentor</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Ask anything. Practice everything.</h1>
          <AIMentorPanel />
        </div>
      </AcademyPageShell>
    </div>
  );
}
