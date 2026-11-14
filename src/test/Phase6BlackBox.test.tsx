import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

describe("Phase 6 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tc_p6_01_initializes_bright_minimalist_theme_with_3d_neural_globe_and_zero_settings_popover", () => {
    render(<HomePage />);

    expect(screen.getByTestId("theme-container")).toHaveClass("bg-[#F7F6F2]");
    expect(screen.getByTestId("neural-globe-bg")).toBeInTheDocument();
    expect(screen.getByTestId("top-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("hero-section").className).toMatch(/pt-24|pt-28/);
    expect(screen.queryByTestId("btn-settings-toggle")).toBeNull();
    expect(screen.queryByTestId("settings-popover-card")).toBeNull();
    expect(document.body.textContent).not.toContain("//");
  });

  it("tc_p6_02_clicking_3d_neural_face_triggers_surprised_animation_state", () => {
    vi.useFakeTimers();
    render(<HomePage />);

    const trigger = screen.getByTestId("neural-face-trigger");
    expect(trigger).toHaveAttribute("data-surprised", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-surprised", "true");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(trigger).toHaveAttribute("data-surprised", "false");
  });

  it("tc_p6_03_direct_navbar_toggles_switch_language_id_en_and_sun_moon_theme_immediately", () => {
    render(<HomePage />);

    const langToggle = screen.getByTestId("btn-lang-toggle");
    const themeToggle = screen.getByTestId("btn-theme-toggle");

    expect(langToggle).toHaveTextContent("ID");
    expect(langToggle).toHaveTextContent("EN");
    expect(screen.getByTestId("icon-sun")).toBeInTheDocument();
    expect(screen.getByTestId("icon-moon")).toBeInTheDocument();

    fireEvent.click(langToggle);
    expect(screen.getByTestId("status-badge")).toHaveTextContent(
      "Open for Part-time & Freelance"
    );

    fireEvent.click(themeToggle);
    expect(screen.getByTestId("theme-container")).toHaveClass("bg-[#0D0F12]");
    expect(themeToggle).toHaveAttribute("data-theme-state", "dark");
  });

  it("tc_p6_04_custom_cursor_switches_fill_from_black_in_light_mode_to_white_in_dark_mode", () => {
    render(<HomePage />);

    expect(screen.getByTestId("cursor-arrow-svg").innerHTML).toContain(
      "#111111"
    );

    fireEvent.click(screen.getByTestId("btn-theme-toggle"));

    expect(screen.getByTestId("cursor-arrow-svg").innerHTML).toContain(
      "#FFFFFF"
    );
  });

  it("tc_p6_05_custom_cursor_switches_to_pointing_hand_on_interactive_hover", () => {
    render(<HomePage />);

    fireEvent.mouseOver(screen.getByTestId("btn-theme-toggle"));

    expect(screen.getByTestId("cursor-hand-svg")).toBeInTheDocument();
  });
});
