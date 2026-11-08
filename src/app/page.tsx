import { CustomizerDock } from "@/components/CustomizerDock";
import { HeroSection } from "@/components/HeroSection";
import { PreferencesProvider } from "@/hooks/usePreferences";

export default function HomePage() {
  return (
    <PreferencesProvider>
      <main id="main-content">
        <HeroSection />
      </main>
      <CustomizerDock />
    </PreferencesProvider>
  );
}
