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

describe("Phase 7 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("tc_p7_01_top_navbar_renders_scroll_spy_links_and_progress_bar", () => {
    render(<HomePage />);

    expect(screen.getByTestId("nav-link-hero")).toHaveAttribute(
      "data-active",
      "true"
    );
    expect(screen.getByTestId("nav-link-portfolio")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-experience")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-services")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-scroll-progress")).toBeInTheDocument();
  });

  it("tc_p7_02_project_card_activates_3d_perspective_tilt_on_mousemove_and_resets_on_mouseleave", () => {
    render(<HomePage />);

    const card = screen.getByTestId("project-card-mfit-gym-tracker");
    fireEvent.mouseMove(card, { clientX: 120, clientY: 80 });
    expect(card.getAttribute("data-tilt-active")).toBe("true");

    fireEvent.mouseLeave(card);
    expect(card.getAttribute("data-tilt-active")).toBe("false");
  });

  it("tc_p7_03_keyboard_arrow_keys_cycle_screenshots_inside_case_study_modal", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-case-study-mfit-gym-tracker"));

    expect(
      screen.getByTestId("modal-active-screenshot").getAttribute("src")
    ).toContain("screen-1.png");

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(
      screen.getByTestId("modal-active-screenshot").getAttribute("src")
    ).toContain("screen-2.png");

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(
      screen.getByTestId("modal-active-screenshot").getAttribute("src")
    ).toContain("screen-1.png");
  });

  it("tc_p7_04_escape_key_closes_lightbox_first_then_case_study_modal", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-case-study-meta-trade-journal"));
    fireEvent.click(screen.getByTestId("btn-open-lightbox"));

    expect(screen.getByTestId("screenshot-lightbox")).toBeVisible();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("screenshot-lightbox")).not.toBeInTheDocument();
    expect(screen.getByTestId("case-study-modal")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("case-study-modal")).not.toBeInTheDocument();
  });

  it("tc_p7_05_ats_resume_modal_renders_printable_sheet_and_closes_on_escape_key", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-download-cv"));

    expect(screen.getByTestId("ats-resume-sheet")).toHaveAttribute(
      "id",
      "ats-resume-sheet"
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("ats-resume-modal")).not.toBeInTheDocument();
  });
});
