import AcademyPageShell from "@/components/academy/AcademyPageShell";
import CertificationsShowcase from "@/components/academy/CertificationsShowcase";

export default function AcademyCertificates() {
  return (
    <div className="max-w-[1440px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell className="pt-10">
        <CertificationsShowcase />
      </AcademyPageShell>
    </div>
  );
}
