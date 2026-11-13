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

describe("Phase 4 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("tc_p4_01_renders_all_5_career_leadership_and_education_milestones_initially", () => {
    render(<HomePage />);

    expect(
      screen.getByTestId("timeline-card-diskominfosta-bangka-tengah")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeline-card-hmif-itera-kadiv")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeline-card-permikomnas-wilayah-xv")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeline-card-hmif-itera-staff")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeline-card-itera-informatics-education")
    ).toBeInTheDocument();
  });

  it("tc_p4_02_work_filter_isolates_diskominfosta_internship_and_bureaucracy_highlights", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("timeline-tab-work"));

    const workCard = screen.getByTestId(
      "timeline-card-diskominfosta-bangka-tengah"
    );
    expect(workCard).toBeVisible();
    expect(workCard).toHaveTextContent("Backend Developer Intern");
    expect(workCard).toHaveTextContent("MVC");
    expect(workCard).toHaveTextContent("Agile");
    expect(workCard).toHaveTextContent("birokrasi");

    expect(
      screen.queryByTestId("timeline-card-hmif-itera-kadiv")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("timeline-card-itera-informatics-education")
    ).not.toBeInTheDocument();
  });

  it("tc_p4_03_leadership_filter_displays_exact_3_organizational_roles_hmif_and_permikomnas", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("timeline-tab-leadership"));

    expect(
      screen.getByTestId("timeline-card-hmif-itera-kadiv")
    ).toBeVisible();
    expect(
      screen.getByTestId("timeline-card-permikomnas-wilayah-xv")
    ).toBeVisible();
    expect(
      screen.getByTestId("timeline-card-hmif-itera-staff")
    ).toBeVisible();
    expect(
      screen.queryByTestId("timeline-card-diskominfosta-bangka-tengah")
    ).not.toBeInTheDocument();
  });

  it("tc_p4_04_education_filter_displays_itera_informatics_2023_present_rpl_and_si_focus", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("timeline-tab-education"));

    const educationCard = screen.getByTestId(
      "timeline-card-itera-informatics-education"
    );
    expect(educationCard).toBeVisible();
    expect(educationCard).toHaveTextContent("Institut Teknologi Sumatera");
    expect(educationCard).toHaveTextContent("2023");
    expect(educationCard).toHaveTextContent("Sistem Informasi");
  });

  it("tc_p4_05_skill_matrix_tabs_filter_capabilities_and_respond_to_language_toggle", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("skill-tab-ai-data"));

    expect(screen.getByTestId("skill-card-python")).toBeInTheDocument();
    expect(
      screen.getByTestId("skill-card-data-engineering")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("skill-card-php-laravel")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("btn-lang-toggle"));

    expect(
      screen.getByText("Head of External Campus Division")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Head of Interests & Talents Department")
    ).toBeInTheDocument();
  });
});

