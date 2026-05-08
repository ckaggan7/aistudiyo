import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { EcosystemGrid } from "@/components/marketing/EcosystemGrid";
import { LiveDashboardPreview } from "@/components/marketing/LiveDashboardPreview";
import { ToolsMarquee } from "@/components/marketing/ToolsMarquee";
import { StatsBand } from "@/components/marketing/StatsBand";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <EcosystemGrid />
      <LiveDashboardPreview />
      <ToolsMarquee />
      <StatsBand />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
