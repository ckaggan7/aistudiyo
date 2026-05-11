import FlowArt from "@/components/ui/story-scroll";
import HeroScene from "@/components/landing/HeroScene";
import QuickCreateScene from "@/components/landing/QuickCreateScene";
import AgentsScene from "@/components/landing/AgentsScene";
import ContentEngineScene from "@/components/landing/ContentEngineScene";
import TrendsScene from "@/components/landing/TrendsScene";
import BrandVoiceScene from "@/components/landing/BrandVoiceScene";
import SocialProofScene from "@/components/landing/SocialProofScene";
import FinalCTAScene from "@/components/landing/FinalCTAScene";
import CinematicFooter from "@/components/ui/cinematic-footer";

export default function LandingPage() {
  return (
    <FlowArt aria-label="AISTUDIYO — Cinematic story scroll">
      <HeroScene />
      <QuickCreateScene />
      <AgentsScene />
      <ContentEngineScene />
      <TrendsScene />
      <BrandVoiceScene />
      <SocialProofScene />
      <FinalCTAScene />
      <CinematicFooter />
    </FlowArt>
  );
}