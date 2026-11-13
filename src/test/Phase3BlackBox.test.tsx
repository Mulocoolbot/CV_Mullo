import fs from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { projectsData } from "@/data/projects";

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

describe("Phase 3 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("tc_p3_01_all_project_screenshots_are_real_png_files_on_disk_with_matching_captions", () => {
    expect(projectsData).toHaveLength(6);

    for (const project of projectsData) {
      expect(project.screenshots.length).toBeGreaterThanOrEqual(1);

      for (const screenshotPath of project.screenshots) {
        expect(screenshotPath.endsWith(".png")).toBe(true);
        expect(screenshotPath.endsWith(".svg")).toBe(false);

        const fullPath = path.join(process.cwd(), "public", screenshotPath);
        expect(fs.existsSync(fullPath)).toBe(true);
        expect(fs.statSync(fullPath).size).toBeGreaterThan(1000);
      }

      expect(project.screenshotCaptions.id).toHaveLength(
        project.screenshots.length
      );
      expect(project.screenshotCaptions.en).toHaveLength(
        project.screenshots.length
      );
    }
  });

  it("tc_p3_02_all_6_project_cards_render_png_thumbnails_and_dynamic_screen_counts", () => {
    render(<HomePage />);

    for (const project of projectsData) {
      const thumb = screen.getByTestId(`project-thumb-${project.id}`);
      expect(thumb.getAttribute("src")).toContain("screen-1.png");

      const badge = screen.getByTestId(`project-screen-count-${project.id}`);
      expect(badge).toHaveTextContent(`${project.screenshots.length} Layar`);
    }
  });

  it("tc_p3_03_modal_carousel_next_and_prev_buttons_cycle_real_png_screenshots", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-case-study-mfit-gym-tracker"));

    const activeImg = screen.getByTestId("modal-active-screenshot");
    expect(activeImg.getAttribute("src")).toContain("screen-1.png");

    const mfitProject = projectsData.find(
      (item) => item.id === "mfit-gym-tracker"
    );
    if (mfitProject && mfitProject.screenshots.length > 1) {
      fireEvent.click(screen.getByTestId("btn-next-screen"));
      expect(
        screen.getByTestId("modal-active-screenshot").getAttribute("src")
      ).toContain("screen-2.png");

      fireEvent.click(screen.getByTestId("btn-prev-screen"));
      expect(
        screen.getByTestId("modal-active-screenshot").getAttribute("src")
      ).toContain("screen-1.png");
    }
  });

  it("tc_p3_04_clicking_thumbnail_selector_switches_active_png_screenshot", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-case-study-hoax-news-detector"));

    const lastIndex = projectsData[1].screenshots.length - 1;
    fireEvent.click(screen.getByTestId(`btn-thumb-${lastIndex}`));

    expect(
      screen.getByTestId("modal-active-screenshot").getAttribute("src")
    ).toBe(projectsData[1].screenshots[lastIndex]);
  });

  it("tc_p3_05_fullscreen_lightbox_opens_and_closes_cleanly", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-case-study-meta-trade-journal"));

    fireEvent.click(screen.getByTestId("btn-open-lightbox"));
    expect(screen.getByTestId("screenshot-lightbox")).toBeVisible();

    fireEvent.click(screen.getByTestId("btn-close-lightbox"));
    expect(screen.queryByTestId("screenshot-lightbox")).not.toBeInTheDocument();
    expect(screen.getByTestId("case-study-modal")).toBeInTheDocument();
  });
});

