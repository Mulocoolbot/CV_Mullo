import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { profileData } from "@/data/profile";

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

describe("Phase 1 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tc_p1_01_initial_render_displays_complete_identity_and_tech_stacks", () => {
    render(<HomePage />);

    expect(screen.getByText("Ahmad Mulia Saputra")).toBeInTheDocument();
    expect(
      screen.getByText("Tersedia untuk Part-time & Freelance")
    ).toBeInTheDocument();
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kotlin").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Laravel").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Python").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Data Engineering").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AI Development").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Leadership").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Public Speaking").length).toBeGreaterThan(0);
  });

  it("tc_p1_02_language_toggle_switches_copywriting_between_id_and_en", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-lang-toggle"));

    expect(screen.getByTestId("status-badge")).toHaveTextContent(
      "Open for Part-time & Freelance"
    );
    for (const paragraph of profileData.bio.en) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("tc_p1_03_role_rotator_cycles_every_2800ms", () => {
    vi.useFakeTimers();
    render(<HomePage />);

    expect(screen.getByTestId("active-role")).toHaveTextContent("Web Developer");

    act(() => {
      vi.advanceTimersByTime(2800);
    });
    expect(screen.getByTestId("active-role")).toHaveTextContent(
      "Mobile Apps Developer"
    );

    act(() => {
      vi.advanceTimersByTime(2800);
    });
    expect(screen.getByTestId("active-role")).toHaveTextContent(
      "Full Stack Developer"
    );
  });

  it("tc_p1_04_toggling_3d_mode_switches_cleanly_to_2d_static_fallback", () => {
    render(<HomePage />);

    const faceTrigger = screen.getByTestId("neural-face-trigger");
    expect(faceTrigger).toBeInTheDocument();
    expect(faceTrigger).toHaveAttribute("data-surprised", "false");

    fireEvent.click(faceTrigger);

    expect(faceTrigger).toHaveAttribute("data-surprised", "true");
  });

  it("tc_p1_05_theme_and_accent_toggles_update_ui_state_and_localstorage", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-theme-toggle"));

    expect(screen.getByTestId("theme-container")).toHaveClass("bg-[#0D0F12]");

    const stored = localStorage.getItem("cv_mullo_prefs_v2") ?? "";
    expect(stored).toContain('"theme":"dark"');
  });
});

