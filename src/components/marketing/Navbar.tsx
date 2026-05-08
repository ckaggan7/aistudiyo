import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Solutions", href: "#solutions" },
  { label: "AI Stack", href: "#stack" },
  { label: "Use Cases", href: "#usecases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Community", href: "#community" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("fixed top-0 inset-x-0 z-50 transition-all duration-300", scrolled ? "py-3" : "py-5")}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={cn(
          "flex items-center justify-between rounded-2xl px-4 md:px-5 py-2.5 transition-all",
          scrolled ? "glass-strong shadow-elevated" : "bg-transparent"
        )}>
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.label} href={l.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/40 transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link to="/login" className="hidden sm:inline-flex text-sm font-medium px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-orange text-white shadow-orange-glow hover:shadow-elevated transition-all hover:-translate-y-0.5"
            >
              Start Building
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button onClick={() => setOpen(!open)} className="lg:hidden ml-1 w-9 h-9 inline-flex items-center justify-center rounded-full border border-border/60">
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 flex flex-col gap-1">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary/40">
                {l.label}
              </a>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary/40">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
