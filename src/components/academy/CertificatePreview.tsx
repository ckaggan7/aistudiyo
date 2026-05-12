import { BadgeCheck } from "lucide-react";
import type { Certificate } from "@/lib/academy/certificates";
export default function CertificatePreview({ cert, name }: { cert: Certificate; name: string }) {
  return (
    <div className={`relative rounded-3xl p-10 md:p-14 overflow-hidden border border-white/15 bg-gradient-to-br ${cert.color}`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="relative text-center text-white">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">AISTUDIYO Ads Academy</p>
        <div className="my-6 text-6xl">{cert.emoji}</div>
        <p className="text-sm uppercase tracking-wider text-white/70">Certificate of Achievement</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight capitalize">{name}</h1>
        <p className="mt-3 text-base md:text-lg text-white/85">has earned the title of</p>
        <p className="mt-1 text-2xl md:text-3xl font-bold">{cert.name}</p>
        <p className="mt-5 text-sm text-white/80 max-w-md mx-auto">{cert.tagline}</p>
        <div className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-white"><BadgeCheck className="w-4 h-4" /> Verified by AISTUDIYO</div>
      </div>
    </div>
  );
}
