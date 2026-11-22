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
  localizedTitle?: LocalizedText;
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
  liveDemoUrl?: string;
  screenshots: string[];
  screenshotCaptions: {
    id: string[];
    en: string[];
  };
}

export type SkillCategory =
  | "all"
  | "frontend-mobile"
  | "backend-db"
  | "ai-data"
  | "workflow-soft";

export interface SkillItem {
  id: string;
  name: string;
  category: Exclude<SkillCategory, "all">;
  categoryLabel: LocalizedText;
  levelBadge: LocalizedText;
  description: LocalizedText;
}

export type TimelineCategory = "all" | "work" | "leadership" | "education";

export interface TimelineItem {
  id: string;
  category: Exclude<TimelineCategory, "all">;
  categoryLabel: LocalizedText;
  roleOrDegree: LocalizedText;
  organization: string;
  location: string;
  period: LocalizedText;
  summary: LocalizedText;
  highlights: {
    id: string[];
    en: string[];
  };
  tags: string[];
}

export interface ServicePackage {
  id: string;
  title: LocalizedText;
  badge?: LocalizedText;
  startingPrice: LocalizedText;
  estimatedDuration: LocalizedText;
  pricingNote: LocalizedText;
  description: LocalizedText;
  deliverables: {
    id: string[];
    en: string[];
  };
  techStack: string[];
}

export interface PrimaryServicePackage extends ServicePackage {
  id: "landing-page" | "web-app-si" | "mobile-android" | (string & {});
  price: LocalizedText;
  duration: LocalizedText;
  audience: LocalizedText;
  benefits: {
    id: string[];
    en: string[];
  };
  referenceProject: string;
  techTags: string[];
  featured: boolean;
  whatsappMessage: LocalizedText;
}

export interface CustomConsultationBanner {
  id: string;
  title: LocalizedText;
  price: LocalizedText;
  startingPrice: LocalizedText;
  description: LocalizedText;
  whatsappMessage: LocalizedText;
}

export interface FreelanceServicesCatalog {
  primaryPackages: PrimaryServicePackage[];
  customBanner: CustomConsultationBanner;
  scopeNotes: LocalizedText;
}

export interface ContactConfig {
  email: string;
  whatsappRaw: string;
  whatsappApiNumber: string;
  instagramUrl: string;
  instagramHandle: string;
  githubUrl: string;
  githubHandle: string;
}
