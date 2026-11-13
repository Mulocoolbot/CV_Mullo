import { CustomizerDock } from "@/components/CustomizerDock";
import { ExperienceSection } from "@/components/ExperienceSection";
import { HeroSection } from "@/components/HeroSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { PreferencesProvider } from "@/hooks/usePreferences";

export default function HomePage() {
  return (
    <PreferencesProvider>
      <main id="main-content">
        <HeroSection />
        <PortfolioSection />
        <ExperienceSection />
      </main>
      <CustomizerDock />
    </PreferencesProvider>
  );
}
