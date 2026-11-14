import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";

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

    expect(
      screen.getByTestId("service-card-web-and-information-systems")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("service-card-mobile-app-development")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("service-card-custom-consultation-and-part-time")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("service-card-mobile-app-development")
    ).toHaveTextContent("Mobile App Development (Android & Eksplorasi iOS)");
    expect(
      screen.getByTestId("service-price-web-and-information-systems")
    ).toHaveTextContent("Mulai Rp 1.500.000");
  });

  it("tc_p5_02_selecting_a_service_card_updates_the_project_brief_form_selection", () => {
    render(<HomePage />);

    fireEvent.click(
      screen.getByTestId("btn-select-service-mobile-app-development")
    );

    const selectElement = screen.getByTestId(
      "select-service-type"
    ) as HTMLSelectElement;
    expect(selectElement.value).toBe("mobile-app-development");
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
    expect(emailHref.startsWith("mailto:ahmadmuliasaputra1@gmail.com")).toBe(
      true
    );
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
