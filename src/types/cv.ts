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
