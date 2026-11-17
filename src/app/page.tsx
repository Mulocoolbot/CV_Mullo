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
      <div className="bg-[#FAF8F5] dark:bg-[#0B0D12] relative min-h-screen w-full max-w-full overflow-x-hidden">
        <CustomCursor />
        <MeridianGlobeBackground />
        <TopNavbar />
        <main
          id="main-content"
          className="relative z-10 bg-transparent w-full max-w-full overflow-x-hidden"
        >
          <HeroSection />
          <PortfolioSection />
          <ExperienceSection />
          <ServicesAndContactSection />
        </main>
      </div>
    </PreferencesProvider>
  );
}
