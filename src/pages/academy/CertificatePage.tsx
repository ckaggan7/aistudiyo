import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Linkedin } from "lucide-react";
import AcademyPageShell from "@/components/academy/AcademyPageShell";
import CertificatePreview from "@/components/academy/CertificatePreview";
import { getCertificate } from "@/lib/academy/certificates";
import { useAuth } from "@/hooks/useAuth";
import { useXp } from "@/lib/academy/progress";
import { toast } from "sonner";

export default function CertificatePage() {
  const { certId = "" } = useParams();
  const cert = getCertificate(certId);
  const { user } = useAuth();
  const { xp } = useXp();
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "creator";

  if (!cert) return <div className="p-10 text-white">Certificate not found.</div>;
  const unlocked = xp >= cert.xpRequired;

  const share = () => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); };
  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="max-w-[1100px] mx-auto pb-24 lg:pb-6">
      <AcademyPageShell>
        <div className="px-6 md:px-12 pt-8 pb-10">
          <Link to="/dashboard/academy" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Academy</Link>
          {!unlocked && <p className="mb-4 text-amber-300 text-sm">🔒 Locked — earn {cert.xpRequired - xp} more XP to unlock.</p>}
          <CertificatePreview cert={cert} name={name} />
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={share} className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-white/10 border border-white/15 text-white text-sm"><Copy className="w-4 h-4" /> Copy link</button>
            <a href={linkedIn} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#0a66c2] text-white text-sm"><Linkedin className="w-4 h-4" /> Share on LinkedIn</a>
          </div>
        </div>
      </AcademyPageShell>
    </div>
  );
}
