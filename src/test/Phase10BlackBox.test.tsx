import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { metadata } from "@/app/layout";
import HomePage from "@/app/page";
import { profileData } from "@/data/profile";
import { projectsData } from "@/data/projects";
import { getAssetPath } from "@/utils/assetPath";

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

  it("tc_p10_02_get_asset_path_resolves_local_and_github_pages_subpath_correctly", () => {
    expect(getAssetPath("/avatar.jpg", "")).toBe("/avatar.jpg");
    expect(getAssetPath("/avatar.jpg", "/CV_Mullo")).toBe(
      "/CV_Mullo/avatar.jpg"
    );
    expect(
      getAssetPath("/CV_Mullo/projects/mfit/screen-1.png", "/CV_Mullo")
    ).toBe("/CV_Mullo/projects/mfit/screen-1.png");
    expect(
      getAssetPath("https://github.com/Mulocoolbot.png", "/CV_Mullo")
    ).toBe("https://github.com/Mulocoolbot.png");
  });

  it("tc_p10_03_verifies_nojekyll_avatar_and_project_screenshots_exist_on_disk", () => {
    expect(fs.existsSync(path.join(process.cwd(), "public/.nojekyll"))).toBe(
      true
    );
    expect(fs.existsSync(path.join(process.cwd(), "public/avatar.jpg"))).toBe(
      true
    );
    expect(
      fs.existsSync(
        path.join(process.cwd(), "public/projects/mfit/screen-1.png")
      )
    ).toBe(true);
  });

  it("tc_p10_04_verifies_hero_and_portfolio_images_render_cleanly", () => {
    render(<HomePage />);

    const avatarImg = screen.getByTestId("profile-avatar-img");
    const avatarSrc = avatarImg.getAttribute("src") ?? "";
    expect(avatarSrc.length).toBeGreaterThan(0);
    expect(avatarSrc).toContain(profileData.avatarUrl);

    const mfitThumb = screen.getByTestId("project-thumb-mfit-gym-tracker");
    const thumbSrc = mfitThumb.getAttribute("src") ?? "";
    expect(thumbSrc.length).toBeGreaterThan(0);
    expect(thumbSrc).toContain(projectsData[0].screenshots[0]);
  });

  it("tc_p10_05_verifies_github_pages_workflow_uses_node_22_and_base_path", () => {
    const workflowContent = fs.readFileSync(
      path.join(process.cwd(), ".github/workflows/deploy.yml"),
      "utf8"
    );
    expect(workflowContent).toContain("22");
    expect(workflowContent).toContain("/CV_Mullo");
    expect(workflowContent).toContain("actions/deploy-pages@v4");
  });
});
