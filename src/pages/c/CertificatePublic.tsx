import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Sparkles, Award, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Cert = { id: string; track_id: string; title: string; score: number; issued_at: string; display_name: string };

export default function CertificatePublic() {
  const { slug } = useParams();
  const [cert, setCert] = useState<Cert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data, error } = await supabase.rpc("get_public_certificate", { _slug: slug });
      if (!error && data && data.length) setCert(data[0] as Cert);
      setLoading(false);
    })();
  }, [slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="min-h-screen bg-[#06060d] text-white px-6 py-16 flex flex-col items-center">
      <Link to="/" className="inline-flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-violet-500 flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
        <span className="font-semibold tracking-tight">AISTUDIYO Academy</span>
      </Link>
      {loading && <p className="text-white/50">Loading certificate…</p>}
      {!loading && !cert && (
        <div className="text-center"><h1 className="text-3xl font-bold">Certificate not found</h1><p className="text-white/60 mt-2">This share link may be invalid or the certificate was revoked.</p></div>
      )}
      {cert && (
        <div className="w-full max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-10 text-center shadow-[0_30px_120px_-40px_rgba(236,72,153,0.4)]">
            <Award className="w-12 h-12 mx-auto text-amber-300" />
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/50">Certificate of Completion</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{cert.title}</h1>
            <p className="mt-6 text-white/70">Awarded to</p>
            <p className="mt-1 text-2xl font-semibold text-white">{cert.display_name}</p>
            <p className="mt-6 text-white/60 text-sm">Score: <b className="text-white">{cert.score}/100</b> · Issued {new Date(cert.issued_at).toLocaleDateString()}</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <a href={linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#0a66c2] text-white text-sm font-semibold">Share on LinkedIn <ExternalLink className="w-3.5 h-3.5" /></a>
              <Link to="/dashboard/academy" className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-white/5 border border-white/15 text-sm">Earn yours</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
