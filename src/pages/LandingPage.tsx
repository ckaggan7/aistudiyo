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
import { Footer } from "@/components/ui/footer";
import { Sparkles, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";

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
    <Footer
      logo={<Sparkles className="h-8 w-8 text-primary" />}
      brandName="AISTUDIYO"
      socialLinks={[
        { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
        { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com", label: "Instagram" },
        { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: <Youtube className="h-5 w-5" />, href: "https://youtube.com", label: "YouTube" },
        { icon: <MessageCircle className="h-5 w-5" />, href: "https://discord.com", label: "Discord" },
      ]}
      mainLinks={[
        { href: "/dashboard/generator", label: "AI Studio" },
        { href: "/dashboard/agents", label: "AI Agents" },
        { href: "/dashboard/calendar", label: "Calendar" },
        { href: "/dashboard/trends", label: "Trends" },
        { href: "/contact", label: "Contact" },
      ]}
      legalLinks={[
        { href: "#", label: "Privacy" },
        { href: "#", label: "Terms" },
      ]}
      copyright={{ text: "© 2026 AISTUDIYO", license: "Built for creators." }}
    />
    </>
  );
}