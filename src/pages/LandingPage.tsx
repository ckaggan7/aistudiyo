import FlowArt from "@/components/ui/story-scroll";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroScene from "@/components/landing/HeroScene";
import QuickCreateScene from "@/components/landing/QuickCreateScene";
import AgentsScene from "@/components/landing/AgentsScene";
import ContentEngineScene from "@/components/landing/ContentEngineScene";
import TrendsScene from "@/components/landing/TrendsScene";
import BrandVoiceScene from "@/components/landing/BrandVoiceScene";
import SocialProofScene from "@/components/landing/SocialProofScene";
import FinalCTAScene from "@/components/landing/FinalCTAScene";
import { Link } from "react-router-dom";
import { Sparkles, Heart, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function LandingPage() {
  return (
    <>
    <LandingHeader />
    <FlowArt aria-label="AISTUDIYO — Cinematic story scroll">
      <HeroScene />
      <QuickCreateScene />
      <AgentsScene />
      <ContentEngineScene />
      <TrendsScene />
      <BrandVoiceScene />
      <SocialProofScene />
      <FinalCTAScene />
    </FlowArt>
    <footer className="bg-white border-t border-black/10 text-zinc-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link to="/" className="flex items-center gap-2" aria-label="AISTUDIYO">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(22_100%_60%)] to-[hsl(22_100%_50%)] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900">
              AI <span className="text-[hsl(22_100%_55%)]">STUDIYO</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link to="/dashboard/generator" className="hover:text-[hsl(22_100%_50%)] transition-colors">AI Studio</Link>
            <Link to="/dashboard/agents" className="hover:text-[hsl(22_100%_50%)] transition-colors">AI Agents</Link>
            <Link to="/dashboard/calendar" className="hover:text-[hsl(22_100%_50%)] transition-colors">Calendar</Link>
            <Link to="/dashboard/trends" className="hover:text-[hsl(22_100%_50%)] transition-colors">Trends</Link>
            <Link to="/contact" className="hover:text-[hsl(22_100%_50%)] transition-colors">Contact</Link>
          </nav>

          <ul className="flex items-center gap-2">
            {[
              { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-black/10 bg-white hover:border-[hsl(22_100%_55%)]/40 hover:text-[hsl(22_100%_50%)] hover:-translate-y-0.5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 pt-6 border-t border-black/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-sm leading-relaxed">
            <p className="flex items-center gap-1.5 text-zinc-700">
              Made with <Heart className="w-4 h-4 text-[hsl(22_100%_55%)] fill-[hsl(22_100%_55%)]" aria-hidden /> by{" "}
              <span className="font-semibold text-zinc-900">Orange Economy India</span>
            </p>
            <p className="text-zinc-500 mt-1">
              A Product by <span className="font-semibold text-zinc-800">WOC @ Wise Owl Communications</span> · New Delhi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            <span>© 2026 AISTUDIYO</span>
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}