"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
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

const listeners = new Set<() => void>();
let memoryFallbackPrefs: PreferencesState | null = null;
let cachedRaw: string | null | undefined;
let cachedSnapshot: PreferencesState = DEFAULT_PREFERENCES;

function emitPreferencesChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribePreferences(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      cachedRaw = undefined;
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getPreferencesSnapshot(): PreferencesState {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      if (memoryFallbackPrefs !== null) {
        return memoryFallbackPrefs;
      }
      cachedRaw = null;
      cachedSnapshot = DEFAULT_PREFERENCES;
      return cachedSnapshot;
    }
    memoryFallbackPrefs = null;
    if (raw === cachedRaw) {
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw) as Partial<PreferencesState>;
    const hydrated: PreferencesState = {
      lang: isValidLanguage(parsed.lang)
        ? parsed.lang
        : DEFAULT_PREFERENCES.lang,
      theme: isValidTheme(parsed.theme)
        ? parsed.theme
        : DEFAULT_PREFERENCES.theme,
    };
    cachedRaw = raw;
    cachedSnapshot = hydrated;
    return cachedSnapshot;
  } catch {
    return memoryFallbackPrefs ?? DEFAULT_PREFERENCES;
  }
}

function getServerPreferencesSnapshot(): PreferencesState {
  return DEFAULT_PREFERENCES;
}

function persistPreferences(state: PreferencesState) {
  const serialized = JSON.stringify({ lang: state.lang, theme: state.theme });
  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
    memoryFallbackPrefs = null;
    cachedRaw = serialized;
    cachedSnapshot = state;
  } catch {
    memoryFallbackPrefs = state;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const existingContext = useContext(PreferencesContext);
  const prefs = useSyncExternalStore(
    subscribePreferences,
    getPreferencesSnapshot,
    getServerPreferencesSnapshot
  );

  useEffect(() => {
    if (existingContext) return;
    persistPreferences(prefs);
    const root = document.documentElement;
    root.dataset.theme = prefs.theme;
    root.lang = prefs.lang;
    root.classList.toggle("dark", prefs.theme === "dark");
  }, [existingContext, prefs]);

  const setLang = useCallback((lang: Language) => {
    const current = getPreferencesSnapshot();
    const next: PreferencesState = { ...current, lang };
    persistPreferences(next);
    emitPreferencesChange();
  }, []);

  const toggleLanguage = useCallback(() => {
    const current = getPreferencesSnapshot();
    const next: PreferencesState = {
      ...current,
      lang: current.lang === "id" ? "en" : "id",
    };
    persistPreferences(next);
    emitPreferencesChange();
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    const current = getPreferencesSnapshot();
    const next: PreferencesState = { ...current, theme };
    persistPreferences(next);
    emitPreferencesChange();
  }, []);

  const toggleTheme = useCallback(() => {
    const current = getPreferencesSnapshot();
    const next: PreferencesState = {
      ...current,
      theme: current.theme === "dark" ? "light" : "dark",
    };
    persistPreferences(next);
    emitPreferencesChange();
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
