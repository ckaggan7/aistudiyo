import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Bot,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LinkItem = { label: string; href: string };

const PRODUCT: LinkItem[] = [
  { label: "AI Studio", href: "/dashboard/generator" },
  { label: "AI Agents", href: "/dashboard/agents" },
  { label: "Content Calendar", href: "/dashboard/calendar" },
  { label: "Trend Engine", href: "/dashboard/trends" },
  { label: "Brand Voice", href: "/dashboard/branding" },
  { label: "Analytics", href: "/dashboard/analytics" },
];

const RESOURCES: LinkItem[] = [
  { label: "Templates", href: "/dashboard/templates" },
  { label: "Creator Guides", href: "#" },
  { label: "AI Prompts", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Community", href: "#" },
];

const COMPANY: LinkItem[] = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Support", href: "#" },
];

const SOCIALS = [
  { Icon: Twitter, href: "https://twitter.com", label: "X / Twitter" },
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { Icon: MessageCircle, href: "https://discord.com", label: "Discord" },
];

const WHATS_NEW = [
  { tag: "NEW AGENT", title: "Trend Hunter", desc: "Daily viral trend detection." },
  { tag: "TEMPLATES", title: "Viral Hook Pack v3", desc: "120 hooks across 8 niches." },
  { tag: "STUDIO", title: "Carousel Studio", desc: "10-slide carousels in one prompt." },
  { tag: "AUTOPILOT", title: "IG Auto-Publish", desc: "Schedule + publish, hands-free." },
  { tag: "AI BRAIN", title: "Smarter Content Pack", desc: "Hooks, CTAs, scores in one call." },
];

function FooterLink({ href, label }: LinkItem) {
  const isInternal = href.startsWith("/");
  const className =
    "group relative inline-block text-sm text-white/60 hover:text-white transition-colors";
  const inner = (
    <span className="relative">
      {label}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-gradient-to-r from-orange-400 to-primary transition-all duration-300 group-hover:w-full" />
    </span>
  );
  return isInternal ? (
    <Link to={href} className={className}>{inner}</Link>
  ) : (
    <a href={href} className={className}>{inner}</a>
  );
}

export function CinematicFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#070707] text-white">
      {/* Top fade transition from previous section */}
      <div className="absolute inset-x-0 -top-px h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      {/* Top beam */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent blur-2xl pointer-events-none" />

      {/* Ambient orange edge glows */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(22 95% 55% / 0.6), transparent 60%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-48 -right-40 w-[42rem] h-[42rem] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(22 95% 55% / 0.55), transparent 60%)" }}
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Floating particles */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animation: `pulse ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-24 lg:pt-32 pb-10">
        {/* TOP CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative text-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase bg-white/5 border border-white/10 backdrop-blur text-orange-300">
            <Sparkles className="w-3 h-3" /> Start your AI workspace
          </span>
          <h2 className="mt-6 text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">
            Your AI Social Media Team
            <br />
            <span className="text-gradient-hero">Starts Here.</span>
          </h2>
          <p className="mt-5 mx-auto max-w-[58ch] text-base lg:text-lg text-white/60">
            Create viral content, automate workflows, launch AI agents, and grow your audience with AI.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/dashboard"
              className="btn-premium px-7 h-12 rounded-full inline-flex items-center gap-2 text-sm font-semibold"
            >
              Start Creating <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard/agents"
              className="px-7 h-12 rounded-full inline-flex items-center gap-2 text-sm font-semibold border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10 hover:border-orange-400/40 transition-all"
            >
              <Bot className="w-4 h-4" /> Explore AI Agents
            </Link>
          </div>
        </motion.div>

        {/* WHAT'S NEW MINI CAROUSEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold tracking-wide">What's New</h3>
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              Updated weekly
            </span>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {WHATS_NEW.map((it, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[260px] rounded-2xl p-4 border border-white/10 bg-white/[0.03] backdrop-blur hover:bg-white/[0.06] hover:border-orange-400/30 transition-all relative overflow-hidden group"
              >
                <div
                  aria-hidden
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"
                  style={{ background: "radial-gradient(circle, hsl(22 95% 55% / 0.5), transparent 60%)" }}
                />
                <span className="relative text-[9px] font-bold tracking-[0.2em] text-orange-300 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                  {it.tag}
                </span>
                <p className="relative mt-3 text-sm font-semibold">{it.title}</p>
                <p className="relative text-xs text-white/50 mt-1">{it.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-14 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 group" aria-label="AISTUDIYO">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-[0_0_30px_-5px_hsl(22_95%_55%/0.7)]">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight">AISTUDIYO</span>
            </Link>
            <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-[28ch]">
              The AI Operating System for Social Media Creators.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={cn(
                      "group/icon relative inline-flex items-center justify-center w-10 h-10 rounded-full",
                      "border border-white/10 bg-white/[0.03] backdrop-blur",
                      "hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-300",
                      "transition-all hover:-translate-y-0.5",
                    )}
                  >
                    <Icon className="w-4 h-4 text-white/70 group-hover/icon:text-orange-300 transition-colors" />
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity"
                      style={{ boxShadow: "0 0 24px -4px hsl(22 95% 55% / 0.6)" }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-5">Product</h4>
            <ul className="space-y-3">
              {PRODUCT.map((l) => (<li key={l.label}><FooterLink {...l} /></li>))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-5">Resources</h4>
            <ul className="space-y-3">
              {RESOURCES.map((l) => (<li key={l.label}><FooterLink {...l} /></li>))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-5">Company</h4>
            <ul className="space-y-3">
              {COMPANY.map((l) => (<li key={l.label}><FooterLink {...l} /></li>))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-white/45 leading-6">
            <div>© 2026 AISTUDIYO</div>
            <div className="text-white/35">Built for creators.</div>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-white/60 px-3 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>All systems operational</span>
            <span className="text-white/30">·</span>
            <span className="text-white/40">Realtime AI uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default CinematicFooter;