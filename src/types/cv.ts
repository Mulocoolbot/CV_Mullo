export type Language = "id" | "en";

export type ThemeMode = "dark" | "light";

export type AccentColor = "emerald" | "blue" | "violet" | "amber";

export interface LocalizedText {
  id: string;
  en: string;
}

export interface ProfileData {
  name: string;
  handle: string;
  avatarUrl: string;
  cvPdfUrl: string | null;
  location: string;
  available: boolean;
  workTypes: string[];
  statusLabel: LocalizedText;
  roles: string[];
  headline: LocalizedText;
  bio: {
    id: string[];
    en: string[];
  };
  coreStack: string[];
  exploringStack: string[];
  softSkills: string[];
}

export type ProjectCategory = "all" | "mobile" | "web" | "systems" | "ai-data";

export interface ProjectItem {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, "all">;
  categoryLabel: LocalizedText;
  role: LocalizedText;
  releaseStatus: LocalizedText;
  isPublicRelease: boolean;
  shortSummary: LocalizedText;
  caseStudyProblem: LocalizedText;
  technicalSolution: LocalizedText;
  keyFeatures: {
    id: string[];
    en: string[];
  };
  techStack: string[];
  githubUrl: string;
  releaseUrl?: string;
  screenshots: string[];
}
