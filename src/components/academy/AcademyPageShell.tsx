import { ReactNode } from "react";

export default function AcademyPageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[28px] overflow-hidden bg-[#0a0a0d] text-white ${className}`}>
      {/* Edge gradients */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-orange-500/30 via-pink-500/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-violet-600/30 via-indigo-500/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animation: `academy-float ${10 + (i % 7) * 2}s ease-in-out ${i * 0.4}s infinite`,
              opacity: 0.4 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes academy-float { 0%,100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(10px); } }`}</style>
      <div className="relative z-10">{children}</div>
    </div>
  );
}