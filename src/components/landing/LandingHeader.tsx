import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "AI Studio", to: "/dashboard/generator" },
  { label: "Agents", to: "/dashboard/agents" },
  { label: "Templates", to: "/dashboard/templates" },
  { label: "Pricing", to: "/pricing" },
  { label: "Community", to: "/contact" },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-5 md:px-8 flex items-center justify-between">
        <Link to="/" className="text-base font-semibold tracking-tight text-white">
          AI <span className="text-[hsl(22_100%_55%)]">STUDIYO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute left-3 right-3 -bottom-px h-px bg-[hsl(22_100%_55%)]/80" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="px-3.5 h-9 inline-flex items-center text-[13px] font-medium text-white/80 hover:text-white rounded-lg transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 h-9 inline-flex items-center gap-1.5 text-[13px] font-semibold rounded-xl text-white bg-gradient-to-b from-[hsl(22_100%_60%)] to-[hsl(22_100%_50%)] shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_4px_14px_-6px_rgba(255,122,26,0.4)] hover:-translate-y-px hover:brightness-110 transition-all"
          >
            Start Creating <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          className="md:hidden text-white/80"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-black/85 backdrop-blur-md">
          <div className="px-5 py-3 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-white/80 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 h-10 inline-flex items-center justify-center text-sm font-medium text-white/80 border border-white/10 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="flex-1 h-10 inline-flex items-center justify-center gap-1.5 text-sm font-semibold rounded-lg text-white bg-[hsl(22_100%_55%)]"
              >
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}