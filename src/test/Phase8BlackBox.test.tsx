import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";

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

describe("Phase 8 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tc_p8_01_topological_face_renders_distinct_occlusion_eyeballs_eyebrows_and_mouth_layers", () => {
    render(<HomePage />);

    const faceTrigger = screen.getByTestId("neural-face-trigger");
    expect(faceTrigger).toContainElement(
      screen.getByTestId("face-occlusion-mesh")
    );
    expect(faceTrigger).toContainElement(
      screen.getByTestId("face-eyeball-left")
    );
    expect(faceTrigger).toContainElement(
      screen.getByTestId("face-eyeball-right")
    );
    expect(faceTrigger).toContainElement(
      screen.getByTestId("face-eyebrow-group")
    );
    expect(faceTrigger).toContainElement(screen.getByTestId("face-mouth-group"));
  });

  it("tc_p8_02_clicking_topological_face_triggers_surprised_mouth_and_brow_state_and_resets", () => {
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

  it("tc_p8_03_y2k_meridian_grid_globe_renders_in_background", () => {
    render(<HomePage />);

    expect(screen.getByTestId("neural-globe-bg")).toBeInTheDocument();
    expect(screen.getByTestId("y2k-globe-meridians")).toBeInTheDocument();
  });

  it("tc_p8_04_portfolio_section_mounts_seamless_3d_trefoil_knot_sculpture", () => {
    render(<HomePage />);

    expect(screen.getByTestId("sculpture-trefoil-knot")).toHaveAttribute(
      "data-loop-mode",
      "seamless-3d"
    );
  });

  it("tc_p8_05_experience_section_mounts_seamless_3d_twisting_rubik_cube_sculpture", () => {
    render(<HomePage />);

    expect(screen.getByTestId("sculpture-rubik-cube")).toHaveAttribute(
      "data-loop-mode",
      "seamless-3d"
    );
  });
});
