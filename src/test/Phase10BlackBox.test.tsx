import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { metadata } from "@/app/layout";
import HomePage from "@/app/page";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

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

describe("Phase 10 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("tc_p10_01_verifies_official_website_title_and_opengraph_metadata", () => {
    expect(metadata.title).toBe(
      "Ahmad Mulia Saputra | Web & Mobile Apps Developer"
    );
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        title: "Ahmad Mulia Saputra | Web & Mobile Apps Developer",
        description:
          "Web Developer, Mobile Apps Developer & Full Stack Developer based in Bandar Lampung, Indonesia.",
        siteName: "Ahmad Mulia Saputra | Web & Mobile Apps Developer",
        type: "website",
      })
    );
  });

  it("tc_p10_02_verifies_temporary_scripts_and_boilerplate_svgs_are_removed", () => {
    expect(
      fs.existsSync(path.join(process.cwd(), "capture-projects.mjs"))
    ).toBe(false);
    expect(fs.existsSync(path.join(process.cwd(), "public/next.svg"))).toBe(
      false
    );
    expect(fs.existsSync(path.join(process.cwd(), "public/vercel.svg"))).toBe(
      false
    );
  });

  it("tc_p10_03_verifies_production_avatar_and_project_screenshots_remain_intact", () => {
    expect(fs.existsSync(path.join(process.cwd(), "public/avatar.jpg"))).toBe(
      true
    );
    expect(
      fs.existsSync(
        path.join(process.cwd(), "public/projects/mfit/screen-1.png")
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(process.cwd(), "public/projects/metatrade/screen-1.png")
      )
    ).toBe(true);
  });

  it("tc_p10_04_verifies_readme_and_ci_workflow_exist", () => {
    const readmeContent = fs.readFileSync(
      path.join(process.cwd(), "README.md"),
      "utf8"
    );
    expect(readmeContent).toContain(
      "Ahmad Mulia Saputra | Web & Mobile Apps Developer"
    );
    expect(
      fs.existsSync(path.join(process.cwd(), ".github/workflows/deploy.yml"))
    ).toBe(true);
  });

  it("tc_p10_05_verifies_full_application_renders_cleanly_for_release", () => {
    render(<HomePage />);

    expect(screen.getByTestId("top-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("card-3d-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("portfolio-section")).toBeInTheDocument();
    expect(screen.getByTestId("experience-section")).toBeInTheDocument();
    expect(screen.getByTestId("services-contact-section")).toBeInTheDocument();
  });
});
