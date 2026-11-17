import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { CustomCursor } from "@/components/CustomCursor";
import { MeridianGlobeBackground } from "@/components/WireframeSculptures3D";
import { customBanner, primaryPackages, scopeNotes } from "@/data/servicesData";
import { PreferencesProvider } from "@/hooks/usePreferences";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="r3f-canvas-mock">{children}</div>
  ),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Float: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  OrbitControls: () => null,
  RoundedBox: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

describe("Phase 12 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it("tc_p12_01_renders_all_3_primary_service_tiers_with_updated_prices_and_duration_estimates", () => {
    render(<HomePage />);

    expect(
      screen.getByTestId("service-card-landing-page")
    ).toBeInTheDocument();
    expect(screen.getByTestId("service-price-landing-page")).toHaveTextContent(
      "Mulai Rp 500.000"
    );
    expect(
      screen.getByTestId("service-duration-landing-page")
    ).toHaveTextContent("Estimasi 3 – 7 Hari");
    expect(
      screen.getByTestId("service-audience-landing-page")
    ).toHaveTextContent("UMKM, personal branding, profil organisasi & event");
    expect(screen.getByTestId("service-ref-landing-page")).toHaveTextContent(
      "Ref: 3D Interactive Web"
    );
    expect(screen.getByTestId("service-tech-landing-page")).toHaveTextContent(
      "Next.jsTailwind CSSSEO Ready"
    );

    expect(screen.getByTestId("service-card-web-app-si")).toBeInTheDocument();
    expect(screen.getByTestId("service-price-web-app-si")).toHaveTextContent(
      "Mulai Rp 1.500.000"
    );
    expect(
      screen.getByTestId("service-duration-web-app-si")
    ).toHaveTextContent("Estimasi 2 – 4 Minggu");
    expect(
      screen.getByTestId("service-audience-web-app-si")
    ).toHaveTextContent(
      "Sekolah, klinik, bisnis lokal, instansi & proyek riset"
    );
    expect(screen.getByTestId("service-ref-web-app-si")).toHaveTextContent(
      "Ref: Sistem Presensi Murid & Meta Trade"
    );
    expect(screen.getByTestId("service-tech-web-app-si")).toHaveTextContent(
      "LaravelNext.jsREST APIMySQL"
    );

    expect(
      screen.getByTestId("service-card-mobile-android")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("service-price-mobile-android")
    ).toHaveTextContent("Mulai Rp 2.000.000");
    expect(
      screen.getByTestId("service-duration-mobile-android")
    ).toHaveTextContent("Estimasi 2 – 6 Minggu");
    expect(
      screen.getByTestId("service-audience-mobile-android")
    ).toHaveTextContent(
      "Bisnis & komunitas yang butuh aplikasi langsung di HP"
    );
    expect(
      screen.getByTestId("service-ref-mobile-android")
    ).toHaveTextContent("Ref: MFit");
    expect(
      screen.getByTestId("service-tech-mobile-android")
    ).toHaveTextContent("KotlinJetpack ComposeRoom DBFirebase");
  });

  it("tc_p12_02_middle_tier_displays_most_popular_highlight_badge_and_cobalt_border", () => {
    render(<HomePage />);

    const landingCard = screen.getByTestId("service-card-landing-page");
    const middleCard = screen.getByTestId("service-card-web-app-si");
    const mobileCard = screen.getByTestId("service-card-mobile-android");

    expect(landingCard).toHaveAttribute("data-featured", "false");
    expect(screen.queryByTestId("service-badge-landing-page")).toBeNull();

    expect(middleCard).toHaveAttribute("data-featured", "true");
    expect(middleCard).toHaveClass("border-2", "border-[#2563EB]");
    expect(middleCard).toHaveTextContent("Sistem Informasi & Web App");
    expect(screen.getByTestId("service-badge-web-app-si")).toHaveTextContent(
      "Paling Diminati"
    );

    expect(mobileCard).toHaveAttribute("data-featured", "false");
    expect(screen.queryByTestId("service-badge-mobile-android")).toBeNull();

    fireEvent.click(screen.getByTestId("btn-lang-toggle"));
    expect(screen.getByTestId("service-badge-web-app-si")).toHaveTextContent(
      "Most Popular"
    );
  });

  it("tc_p12_03_horizontal_rd_ai_part_time_banner_and_scope_footnote_render_accurately", () => {
    render(<HomePage />);

    const banner = screen.getByTestId("custom-consultation-banner");
    expect(banner).toBeInTheDocument();
    expect(screen.getByTestId("custom-banner-title")).toHaveTextContent(
      "Kolaborasi Part-Time & R&D AI"
    );
    expect(screen.getByTestId("custom-banner-price")).toHaveTextContent(
      "Rp 150.000"
    );
    expect(screen.getByTestId("custom-banner-description")).toHaveTextContent(
      customBanner.description.id
    );
    expect(screen.getByTestId("services-scope-footnote")).toHaveTextContent(
      scopeNotes.id
    );

    const contactBlock = screen.getByTestId("contact-brief-block");
    const scrollIntoViewMock = vi.fn();
    contactBlock.scrollIntoView = scrollIntoViewMock;

    fireEvent.click(screen.getByTestId("btn-email-custom-banner"));
    expect(
      (screen.getByTestId("select-service-type") as HTMLSelectElement).value
    ).toBe(customBanner.id);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    fireEvent.click(screen.getByTestId("btn-select-service-landing-page"));
    expect(
      (screen.getByTestId("select-service-type") as HTMLSelectElement).value
    ).toBe("landing-page");
  });

  it("tc_p12_04_every_service_cta_link_encodes_whatsapp_url_with_package_specific_prefilled_text", () => {
    render(<HomePage />);

    const expectedPrefix = "https://wa.me/6282280113212?text=";

    for (const pkg of primaryPackages) {
      const cta = screen.getByTestId(`btn-whatsapp-service-${pkg.id}`);
      const href = cta.getAttribute("href") ?? "";
      expect(href.startsWith(expectedPrefix)).toBe(true);
      expect(href).toBe(
        `${expectedPrefix}${encodeURIComponent(pkg.whatsappMessage.id)}`
      );
      expect(cta).toHaveAttribute("target", "_blank");
      expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    }

    const bannerCta = screen.getByTestId("btn-whatsapp-custom-banner");
    const bannerHref = bannerCta.getAttribute("href") ?? "";
    expect(bannerHref.startsWith(expectedPrefix)).toBe(true);
    expect(bannerHref).toBe(
      `${expectedPrefix}${encodeURIComponent(customBanner.whatsappMessage.id)}`
    );
    expect(bannerCta).toHaveAttribute("target", "_blank");
    expect(bannerCta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("tc_p12_05_language_switcher_updates_all_package_titles_prices_benefits_and_whatsapp_messages", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-lang-toggle"));

    const expectedTitles = [
      "Profile Web & Landing Page",
      "Information System & Web App",
      "Android Mobile Application",
    ];
    const expectedPrices = [
      "Starting from Rp 500K",
      "Starting from Rp 1.5M",
      "Starting from Rp 2M",
    ];
    const expectedDurations = [
      "Est. 3 – 7 Days",
      "Est. 2 – 4 Weeks",
      "Est. 2 – 6 Weeks",
    ];

    primaryPackages.forEach((pkg, index) => {
      const card = screen.getByTestId(`service-card-${pkg.id}`);
      expect(screen.getByTestId(`service-title-${pkg.id}`)).toHaveTextContent(
        expectedTitles[index]
      );
      expect(screen.getByTestId(`service-price-${pkg.id}`)).toHaveTextContent(
        expectedPrices[index]
      );
      expect(
        screen.getByTestId(`service-duration-${pkg.id}`)
      ).toHaveTextContent(expectedDurations[index]);
      expect(
        screen.getByTestId(`service-audience-${pkg.id}`)
      ).toHaveTextContent(pkg.audience.en);

      for (const benefit of pkg.benefits.en) {
        expect(card).toHaveTextContent(benefit);
      }

      expect(
        screen.getByTestId(`btn-whatsapp-service-${pkg.id}`)
      ).toHaveAttribute(
        "href",
        `https://wa.me/6282280113212?text=${encodeURIComponent(
          pkg.whatsappMessage.en
        )}`
      );
    });

    expect(screen.getByTestId("custom-banner-title")).toHaveTextContent(
      "Part-Time Collaboration & AI R&D"
    );
    expect(screen.getByTestId("custom-banner-price")).toHaveTextContent(
      "Starting from Rp 150K / Hour or Per Sprint"
    );
    expect(screen.getByTestId("custom-banner-description")).toHaveTextContent(
      customBanner.description.en
    );
    expect(screen.getByTestId("btn-whatsapp-custom-banner")).toHaveAttribute(
      "href",
      `https://wa.me/6282280113212?text=${encodeURIComponent(
        customBanner.whatsappMessage.en
      )}`
    );
    expect(screen.getByTestId("services-scope-footnote")).toHaveTextContent(
      scopeNotes.en
    );
  });

  it("tc_p12_06_custom_cursor_returns_null_on_mobile_375px_and_coarse_pointer", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { unmount } = render(
      <PreferencesProvider>
        <CustomCursor />
      </PreferencesProvider>
    );
    expect(screen.getByTestId("theme-container")).toBeEmptyDOMElement();
    expect(screen.queryByTestId("custom-cursor")).toBeNull();
    unmount();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1280,
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: query === "(pointer: coarse)",
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    render(
      <PreferencesProvider>
        <CustomCursor />
      </PreferencesProvider>
    );
    expect(screen.getByTestId("theme-container")).toBeEmptyDOMElement();
    expect(screen.queryByTestId("custom-cursor")).toBeNull();
  });

  it("tc_p12_07_meridian_globe_applies_mobile_scale_and_container_constraints_below_768px", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <PreferencesProvider>
        <MeridianGlobeBackground />
      </PreferencesProvider>
    );

    const globeBg = screen.getByTestId("neural-globe-bg");
    const meridiansContainer = screen.getByTestId("y2k-globe-meridians");
    const globeGroup = screen.getByTestId("meridian-globe-group");

    expect(globeBg).toHaveAttribute("data-mobile-optimized", "true");
    expect(globeBg).toHaveAttribute("data-camera-z", "7.2");
    expect(globeBg).toHaveAttribute("data-globe-scale", "0.52");
    expect(globeBg).toHaveClass(
      "opacity-25",
      "md:opacity-55",
      "w-[260px]",
      "h-[260px]",
      "sm:w-[340px]",
      "sm:h-[340px]",
      "md:w-full",
      "md:h-full",
      "mx-auto",
      "my-auto"
    );
    expect(meridiansContainer).toHaveClass(
      "w-[260px]",
      "h-[260px]",
      "sm:w-[340px]",
      "sm:h-[340px]",
      "md:w-full",
      "md:h-full",
      "mx-auto",
      "my-auto"
    );
    expect(globeGroup).toHaveAttribute("data-globe-scale", "0.52");
  });
});
