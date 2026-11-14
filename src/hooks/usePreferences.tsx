"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AccentColor, Language, ThemeMode } from "@/types/cv";

export interface ThemeTokens {
  bgPrimary: string;
  bgSurface: string;
  textPrimary: string;
  textMuted: string;
  border: string;
  secondaryHex: string;
  secondaryBg: string;
  secondaryText: string;
  tertiaryHex: string;
  tertiaryBg: string;
  tertiaryText: string;
}

export const themeTokens: Record<ThemeMode, ThemeTokens> = {
  light: {
    bgPrimary: "bg-[#F7F6F2]",
    bgSurface: "bg-white/90",
    textPrimary: "text-[#121316]",
    textMuted: "text-[#5A5D64]",
    border: "border-[#E2E0D8]",
    secondaryHex: "#2563EB",
    secondaryBg: "bg-[#2563EB] text-white",
    secondaryText: "text-[#2563EB]",
    tertiaryHex: "#FF5A36",
    tertiaryBg: "bg-[#FF5A36] text-white",
    tertiaryText: "text-[#FF5A36]",
  },
  dark: {
    bgPrimary: "bg-[#0D0F12]",
    bgSurface: "bg-[#15181E]/90",
    textPrimary: "text-[#F4F3EF]",
    textMuted: "text-[#9CA3AF]",
    border: "border-[#262932]",
    secondaryHex: "#3B82F6",
    secondaryBg: "bg-[#2563EB] text-white",
    secondaryText: "text-[#3B82F6]",
    tertiaryHex: "#FF5A36",
    tertiaryBg: "bg-[#FF5A36] text-white",
    tertiaryText: "text-[#FF5A36]",
  },
};

export interface AccentTokens {
  bg: string;
  text: string;
  border: string;
  ring: string;
  hex: string;
}

const cobaltAccent: AccentTokens = {
  bg: "bg-[#2563EB]",
  text: "text-[#2563EB]",
  border: "border-[#2563EB]/30",
  ring: "ring-[#2563EB]/40",
  hex: "#2563EB",
};

export const accentPalette: Record<AccentColor, AccentTokens> = {
  emerald: cobaltAccent,
  blue: cobaltAccent,
  violet: cobaltAccent,
  amber: cobaltAccent,
};

export interface PreferencesState {
  lang: Language;
  theme: ThemeMode;
}

export interface PreferencesContextValue extends PreferencesState {
  tokens: ThemeTokens;
  accent: AccentColor;
  enable3D: boolean;
  palette: AccentTokens;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setAccent: (_accent: AccentColor) => void;
  setEnable3D: (_enable3D: boolean) => void;
  toggle3D: () => void;
}

const STORAGE_KEY = "cv_mullo_prefs_v2";

const DEFAULT_PREFERENCES: PreferencesState = {
  lang: "id",
  theme: "light",
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function isValidLanguage(value: unknown): value is Language {
  return value === "id" || value === "en";
}

function isValidTheme(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}

function persistPreferences(state: PreferencesState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lang: state.lang, theme: state.theme })
    );
  } catch {}
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const existingContext = useContext(PreferencesContext);
  const [prefs, setPrefs] = useState<PreferencesState>(DEFAULT_PREFERENCES);
  const isHydratedRef = useRef(false);

  useEffect(() => {
    if (existingContext) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PreferencesState>;
        const hydrated: PreferencesState = {
          lang: isValidLanguage(parsed.lang)
            ? parsed.lang
            : DEFAULT_PREFERENCES.lang,
          theme: isValidTheme(parsed.theme)
            ? parsed.theme
            : DEFAULT_PREFERENCES.theme,
        };
        setPrefs(hydrated);
        isHydratedRef.current = true;
        return;
      }
    } catch {}

    isHydratedRef.current = true;
    persistPreferences(DEFAULT_PREFERENCES);
  }, [existingContext]);

  useEffect(() => {
    if (existingContext || !isHydratedRef.current) return;
    persistPreferences(prefs);
    const root = document.documentElement;
    root.dataset.theme = prefs.theme;
    root.lang = prefs.lang;
    root.classList.toggle("dark", prefs.theme === "dark");
  }, [existingContext, prefs]);

  const setLang = useCallback((lang: Language) => {
    setPrefs((prev) => {
      const next = { ...prev, lang };
      persistPreferences(next);
      return next;
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setPrefs((prev) => {
      const next: PreferencesState = {
        ...prev,
        lang: prev.lang === "id" ? "en" : "id",
      };
      persistPreferences(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setPrefs((prev) => {
      const next = { ...prev, theme };
      persistPreferences(next);
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setPrefs((prev) => {
      const next: PreferencesState = {
        ...prev,
        theme: prev.theme === "dark" ? "light" : "dark",
      };
      persistPreferences(next);
      return next;
    });
  }, []);

  const noop = useCallback(() => {}, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...prefs,
      tokens: themeTokens[prefs.theme],
      accent: "blue",
      enable3D: true,
      palette: cobaltAccent,
      setLang,
      toggleLanguage,
      setTheme,
      toggleTheme,
      setAccent: noop,
      setEnable3D: noop,
      toggle3D: noop,
    }),
    [prefs, setLang, toggleLanguage, setTheme, toggleTheme, noop]
  );

  if (existingContext) {
    return <>{children}</>;
  }

  return (
    <PreferencesContext.Provider value={value}>
      <div
        data-testid="theme-container"
        data-theme={prefs.theme}
        className={`min-h-screen relative transition-colors duration-300 ${
          prefs.theme === "light"
            ? "bg-[#F7F6F2] text-[#121316]"
            : "bg-[#0D0F12] text-[#F4F3EF]"
        }`}
      >
        {children}
      </div>
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
