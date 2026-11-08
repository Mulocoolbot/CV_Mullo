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

export interface AccentTokens {
  bg: string;
  text: string;
  border: string;
  ring: string;
  hex: string;
}

export const accentPalette: Record<AccentColor, AccentTokens> = {
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    ring: "ring-emerald-500/50",
    hex: "#10b981",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-400",
    border: "border-blue-500/30",
    ring: "ring-blue-500/50",
    hex: "#3b82f6",
  },
  violet: {
    bg: "bg-violet-500",
    text: "text-violet-400",
    border: "border-violet-500/30",
    ring: "ring-violet-500/50",
    hex: "#8b5cf6",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-400",
    border: "border-amber-500/30",
    ring: "ring-amber-500/50",
    hex: "#f59e0b",
  },
};

export interface PreferencesState {
  lang: Language;
  theme: ThemeMode;
  accent: AccentColor;
  enable3D: boolean;
}

export interface PreferencesContextValue extends PreferencesState {
  palette: AccentTokens;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setAccent: (accent: AccentColor) => void;
  setEnable3D: (enable3D: boolean) => void;
  toggle3D: () => void;
}

const STORAGE_KEY = "cv_mullo_prefs_v1";

const DEFAULT_PREFERENCES: PreferencesState = {
  lang: "id",
  theme: "dark",
  accent: "emerald",
  enable3D: true,
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function isValidLanguage(value: unknown): value is Language {
  return value === "id" || value === "en";
}

function isValidTheme(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}

function isValidAccent(value: unknown): value is AccentColor {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(accentPalette, value)
  );
}

function persistPreferences(state: PreferencesState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
          accent: isValidAccent(parsed.accent)
            ? parsed.accent
            : DEFAULT_PREFERENCES.accent,
          enable3D:
            typeof parsed.enable3D === "boolean"
              ? parsed.enable3D
              : DEFAULT_PREFERENCES.enable3D,
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
    root.dataset.accent = prefs.accent;
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

  const setAccent = useCallback((accent: AccentColor) => {
    setPrefs((prev) => {
      const next = { ...prev, accent };
      persistPreferences(next);
      return next;
    });
  }, []);

  const setEnable3D = useCallback((enable3D: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev, enable3D };
      persistPreferences(next);
      return next;
    });
  }, []);

  const toggle3D = useCallback(() => {
    setPrefs((prev) => {
      const next = { ...prev, enable3D: !prev.enable3D };
      persistPreferences(next);
      return next;
    });
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...prefs,
      palette: accentPalette[prefs.accent],
      setLang,
      toggleLanguage,
      setTheme,
      toggleTheme,
      setAccent,
      setEnable3D,
      toggle3D,
    }),
    [
      prefs,
      setLang,
      toggleLanguage,
      setTheme,
      toggleTheme,
      setAccent,
      setEnable3D,
      toggle3D,
    ]
  );

  if (existingContext) {
    return <>{children}</>;
  }

  return (
    <PreferencesContext.Provider value={value}>
      <div
        data-testid="theme-container"
        data-theme={prefs.theme}
        data-accent={prefs.accent}
        className={`min-h-screen transition-colors duration-300 ${
          prefs.theme === "dark"
            ? "bg-zinc-950 text-zinc-100"
            : "bg-zinc-50 text-zinc-900"
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

