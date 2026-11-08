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

describe("Phase 2 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("tc_p2_01_renders_profile_avatar_and_all_6_portfolio_projects_initially", () => {
    render(<HomePage />);

    const avatarImg = screen.getByTestId("profile-avatar-img");
    expect(avatarImg.getAttribute("src")).toContain("/images/profile-mullo.jpg");

    expect(
      screen.getByTestId("project-card-mfit-gym-tracker")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("project-card-hoax-news-detector")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("project-card-meta-trade-journal")
    ).toBeInTheDocument();
    expect(screen.getByTestId("project-card-3d-porto-web")).toBeInTheDocument();
    expect(
      screen.getByTestId("project-card-sistem-presensi-murid")
    ).toBeInTheDocument();
    expect(screen.getByTestId("project-card-milo-ai")).toBeInTheDocument();
  });

  it("tc_p2_02_category_filter_tabs_partition_projects_accurately", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("filter-tab-mobile"));
    expect(
      screen.getByTestId("project-card-mfit-gym-tracker")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("project-card-meta-trade-journal")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("project-card-hoax-news-detector")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("filter-tab-systems"));
    expect(
      screen.getByTestId("project-card-meta-trade-journal")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("project-card-sistem-presensi-murid")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("project-card-mfit-gym-tracker")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("filter-tab-ai-data"));
    expect(
      screen.getByTestId("project-card-hoax-news-detector")
    ).toBeInTheDocument();
    expect(screen.getByTestId("project-card-milo-ai")).toBeInTheDocument();
    expect(
      screen.queryByTestId("project-card-meta-trade-journal")
    ).not.toBeInTheDocument();
  });

  it("tc_p2_03_case_study_modal_opens_with_full_technical_details_and_closes", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-case-study-hoax-news-detector"));

    const modal = screen.getByTestId("case-study-modal");
    expect(modal).toBeVisible();
    expect(modal).toHaveTextContent(
      /pencarian lintas sumber dengan judul serupa/i
    );

    fireEvent.click(screen.getByTestId("btn-close-modal"));
    expect(screen.queryByTestId("case-study-modal")).not.toBeInTheDocument();
  });

  it("tc_p2_04_verifies_github_and_release_links_for_projects", () => {
    render(<HomePage />);

    expect(screen.getByTestId("link-github-mfit-gym-tracker")).toHaveAttribute(
      "href",
      "https://github.com/Mulocoolbot/Gym-Tracker"
    );
    expect(screen.getByTestId("link-release-mfit-gym-tracker")).toHaveAttribute(
      "href",
      "https://github.com/Mulocoolbot/Gym-Tracker/releases/tag/v2.0.0"
    );
    expect(screen.getByTestId("link-github-milo-ai")).toHaveAttribute(
      "href",
      "https://github.com/Mulocoolbot/Milo.AI"
    );
  });

  it("tc_p2_05_cv_download_button_shows_graceful_pending_banner_when_pdf_is_null", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-download-cv"));
    expect(screen.getByTestId("cv-pending-banner")).toBeInTheDocument();
  });
});

