import fs from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import {
  MeridianGlobeBackground,
  OpticalVortexSculpture,
  RubiksCubeSculpture,
  TrefoilKnotSculpture,
} from "@/components/WireframeSculptures3D";

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

describe("Phase 9 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tc_p9_01_verifies_legacy_3d_files_are_removed_and_unified_module_exists", () => {
    expect(
      fs.existsSync(
        path.join(process.cwd(), "src/components/WireframeSculptures3D.tsx")
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(process.cwd(), "src/components/InteractiveFace3D.tsx")
      )
    ).toBe(false);
    expect(
      fs.existsSync(
        path.join(process.cwd(), "src/components/NeuralGlobeBackground.tsx")
      )
    ).toBe(false);
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "src/components/SectionWireframeSculptures.tsx"
        )
      )
    ).toBe(false);
  });

  it("tc_p9_02_exports_all_4_wireframe_sculpture_components_cleanly", () => {
    expect(typeof MeridianGlobeBackground).toBe("function");
    expect(typeof OpticalVortexSculpture).toBe("function");
    expect(typeof TrefoilKnotSculpture).toBe("function");
    expect(typeof RubiksCubeSculpture).toBe("function");
  });

  it("tc_p9_03_homepage_renders_all_4_unified_3d_sculptures", () => {
    render(<HomePage />);

    expect(screen.getByTestId("neural-globe-bg")).toBeInTheDocument();
    expect(screen.getByTestId("card-3d-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("sculpture-trefoil-knot")).toBeInTheDocument();
    expect(screen.getByTestId("sculpture-rubiks-cube")).toBeInTheDocument();
  });

  it("tc_p9_04_optical_vortex_sculpture_responds_to_click_impulse", () => {
    render(<HomePage />);

    const trigger = screen.getByTestId("neural-face-trigger");
    expect(trigger).toHaveAttribute("data-surprised", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-surprised", "true");
  });

  it("tc_p9_05_unified_3d_sculptures_sync_with_navbar_theme_toggle", () => {
    render(<HomePage />);

    expect(screen.getByTestId("card-3d-canvas")).toHaveAttribute(
      "data-theme-mode",
      "light"
    );
    expect(screen.getByTestId("neural-globe-bg")).toHaveAttribute(
      "data-theme-mode",
      "light"
    );

    fireEvent.click(screen.getByTestId("btn-theme-toggle"));

    expect(screen.getByTestId("card-3d-canvas")).toHaveAttribute(
      "data-theme-mode",
      "dark"
    );
    expect(screen.getByTestId("neural-globe-bg")).toHaveAttribute(
      "data-theme-mode",
      "dark"
    );
  });
});
