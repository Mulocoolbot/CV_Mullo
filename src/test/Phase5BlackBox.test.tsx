import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { ServicesSection } from "@/components/ServicesSection";
import {
  buildDirectWhatsAppUrl,
  customBanner,
  freelanceServicesData,
  primaryPackages,
  scopeNotes,
  servicesData,
} from "@/data/servicesData";

vi.mock("@react-three/fiber", () => ({
  Canvas: () => <div data-testid="r3f-canvas-mock" />,
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

describe("Phase 5 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("tc_p5_01_renders_all_3_freelance_service_packages_with_starting_price_guides", () => {
    render(<HomePage />);

    const grid = screen.getByTestId("primary-packages-grid");
    expect(grid).toHaveClass("grid-cols-1", "lg:grid-cols-3");

    expect(
      screen.getByTestId("service-card-landing-page")
    ).toBeInTheDocument();
    const featuredCard = screen.getByTestId("service-card-web-app-si");
    expect(featuredCard).toBeInTheDocument();
    expect(featuredCard).toHaveAttribute("data-featured", "true");
    expect(featuredCard).toHaveClass("border-2", "border-[#2563EB]");
    expect(
      screen.getByTestId("service-badge-web-app-si")
    ).toHaveTextContent("Paling Diminati");

    expect(
      screen.getByTestId("service-card-mobile-android")
    ).toBeInTheDocument();

    for (const pkg of primaryPackages) {
      const card = screen.getByTestId(`service-card-${pkg.id}`);
      expect(card).toHaveTextContent(pkg.audience.id);
      expect(card).toHaveTextContent(pkg.title.id);
      expect(screen.getByTestId(`service-price-${pkg.id}`)).toHaveTextContent(
        pkg.price.id
      );
      expect(
        screen.getByTestId(`service-duration-${pkg.id}`)
      ).toHaveTextContent(pkg.duration.id);
      expect(screen.getByTestId(`service-ref-${pkg.id}`)).toHaveTextContent(
        `Ref: ${pkg.referenceProject}`
      );
      for (const benefit of pkg.benefits.id) {
        expect(card).toHaveTextContent(benefit);
      }
      const techList = screen.getByTestId(`service-tech-${pkg.id}`);
      for (const tag of pkg.techTags) {
        expect(techList).toHaveTextContent(tag);
      }

      const waButton = screen.getByTestId(`btn-whatsapp-service-${pkg.id}`);
      expect(waButton).toHaveAttribute(
        "href",
        `https://wa.me/6282280113212?text=${encodeURIComponent(
          pkg.whatsappMessage.id
        )}`
      );
      expect(waButton).toHaveAttribute("target", "_blank");
      expect(waButton).toHaveAttribute("rel", "noopener noreferrer");
    }

    expect(primaryPackages).toHaveLength(3);
    expect(servicesData.primaryPackages).toEqual(primaryPackages);
    expect(freelanceServicesData).toEqual({
      primaryPackages,
      customBanner,
      scopeNotes,
    });

    const banner = screen.getByTestId("custom-consultation-banner");
    expect(banner).toHaveTextContent(customBanner.title.id);
    expect(banner).toHaveTextContent(customBanner.price.id);
    expect(banner).toHaveTextContent(customBanner.description.id);
    expect(
      screen.getByTestId("btn-whatsapp-custom-banner")
    ).toHaveAttribute(
      "href",
      buildDirectWhatsAppUrl(customBanner.whatsappMessage.id)
    );
    expect(screen.getByTestId("services-scope-footnote")).toHaveTextContent(
      scopeNotes.id
    );
    expect(typeof ServicesSection).toBe("function");
  });

  it("tc_p5_02_selecting_a_service_card_updates_the_project_brief_form_selection", () => {
    render(<HomePage />);

    const contactBlock = screen.getByTestId("contact-brief-block");
    expect(contactBlock).toHaveAttribute("id", "contact");
    const scrollIntoViewMock = vi.fn();
    contactBlock.scrollIntoView = scrollIntoViewMock;

    fireEvent.click(screen.getByTestId("btn-select-service-mobile-android"));

    const selectElement = screen.getByTestId(
      "select-service-type"
    ) as HTMLSelectElement;
    expect(selectElement.value).toBe("mobile-android");
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    fireEvent.click(screen.getByTestId("btn-email-custom-banner"));
    expect(selectElement.value).toBe(customBanner.id);
  });

  it("tc_p5_03_whatsapp_api_and_mailto_links_encode_client_name_and_project_notes_accurately", () => {
    render(<HomePage />);

    fireEvent.change(screen.getByTestId("input-client-name"), {
      target: { value: "Budi Santoso" },
    });
    fireEvent.change(screen.getByTestId("input-project-notes"), {
      target: { value: "Pembuatan sistem informasi presensi" },
    });

    const whatsappHref =
      screen.getByTestId("btn-send-whatsapp").getAttribute("href") ?? "";
    expect(whatsappHref.startsWith("https://wa.me/6282280113212?text=")).toBe(
      true
    );
    expect(whatsappHref).toContain(encodeURIComponent("Budi Santoso"));
    expect(whatsappHref).toContain(
      encodeURIComponent("Pembuatan sistem informasi presensi")
    );

    const emailHref =
      screen.getByTestId("btn-send-email").getAttribute("href") ?? "";
    expect(
      emailHref.startsWith("mailto:ahmadmuliasaputra1@gmail.com") ||
        emailHref.startsWith(
          "https://mail.google.com/mail/?view=cm&fs=1&to=ahmadmuliasaputra1%40gmail.com"
        )
    ).toBe(true);
    expect(emailHref).toContain("ahmadmuliasaputra1");
  });

  it("tc_p5_04_verifies_contact_cards_for_whatsapp_email_instagram_and_github", () => {
    render(<HomePage />);

    expect(screen.getByTestId("contact-card-whatsapp")).toHaveTextContent(
      "082280113212"
    );
    expect(screen.getByTestId("contact-card-email")).toHaveTextContent(
      "ahmadmuliasaputra1@gmail.com"
    );

    const instagramCard = screen.getByTestId("contact-card-instagram");
    expect(instagramCard).toHaveAttribute(
      "href",
      "https://www.instagram.com/mullo._s/"
    );
    expect(instagramCard).toHaveTextContent("@mullo._s");

    expect(screen.getByTestId("contact-card-github")).toHaveAttribute(
      "href",
      "https://github.com/Mulocoolbot"
    );
  });

  it("tc_p5_05_built_in_ats_cv_modal_opens_displays_complete_resume_and_closes", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-download-cv"));

    const modal = screen.getByTestId("ats-resume-modal");
    const sheet = screen.getByTestId("ats-resume-sheet");
    expect(modal).toBeVisible();
    expect(sheet).toBeVisible();
    expect(sheet).toHaveTextContent("ahmadmuliasaputra1@gmail.com");
    expect(sheet).toHaveTextContent("082280113212");

    fireEvent.click(screen.getByTestId("btn-close-ats-cv"));
    expect(screen.queryByTestId("ats-resume-modal")).not.toBeInTheDocument();
  });
});
