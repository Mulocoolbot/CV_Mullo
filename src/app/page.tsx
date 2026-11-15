import { CustomCursor } from "@/components/CustomCursor";
import { ExperienceSection } from "@/components/ExperienceSection";
import { HeroSection } from "@/components/HeroSection";
import { MeridianGlobeBackground } from "@/components/WireframeSculptures3D";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ServicesAndContactSection } from "@/components/ServicesAndContactSection";
import { TopNavbar } from "@/components/TopNavbar";
import { PreferencesProvider } from "@/hooks/usePreferences";

export default function HomePage() {
  return (
    <PreferencesProvider>
      <CustomCursor />
      <MeridianGlobeBackground />
      <TopNavbar />
      <main id="main-content" className="relative z-10">
        <HeroSection />
        <PortfolioSection />
        <ExperienceSection />
        <ServicesAndContactSection />
      </main>
    </PreferencesProvider>
  );
}
