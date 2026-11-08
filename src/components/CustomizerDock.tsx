"use client";

import { Box, Globe, Moon, Sun } from "lucide-react";
import { accentPalette, usePreferences } from "@/hooks/usePreferences";
import type { AccentColor } from "@/types/cv";

const ACCENT_COLORS: AccentColor[] = ["emerald", "blue", "violet", "amber"];

export function CustomizerDock() {
  const {
    lang,
    theme,
    accent,
    enable3D,
    toggleLanguage,
    toggleTheme,
    setAccent,
    toggle3D,
  } = usePreferences();

  const currentAccent = accentPalette[accent];

  return (
    <nav
      aria-label="Appearance and experience customizer"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border px-4 py-2 shadow-2xl backdrop-blur-xl ${
        theme === "dark"
          ? "border-zinc-800 bg-zinc-900/85 text-zinc-100"
          : "border-zinc-200 bg-white/90 text-zinc-900"
      }`}
    >
      <button
        type="button"
        data-testid="btn-lang-toggle"
        aria-label="Toggle language"
        onClick={toggleLanguage}
        className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-zinc-500/20 px-3 font-mono text-xs font-semibold uppercase transition-colors hover:border-current"
      >
        <Globe aria-hidden="true" className={`h-3.5 w-3.5 ${currentAccent.text}`} />
        <span>{lang.toUpperCase()}</span>
      </button>

      <button
        type="button"
        data-testid="btn-theme-toggle"
        aria-label="Toggle theme"
        aria-pressed={theme === "dark"}
        onClick={toggleTheme}
        className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-full border border-zinc-500/20 px-2.5 transition-colors hover:border-current"
      >
        {theme === "dark" ? (
          <Sun aria-hidden="true" className={`h-4 w-4 ${currentAccent.text}`} />
        ) : (
          <Moon aria-hidden="true" className={`h-4 w-4 ${currentAccent.text}`} />
        )}
      </button>

      <div
        role="group"
        aria-label="Accent colors"
        className="flex items-center gap-1.5 border-x border-zinc-500/20 px-2.5"
      >
        {ACCENT_COLORS.map((color) => {
          const isSelected = accent === color;
          return (
            <button
              key={color}
              type="button"
              data-testid={`btn-accent-${color}`}
              aria-label={`Select ${color} accent`}
              aria-pressed={isSelected}
              onClick={() => setAccent(color)}
              style={{ backgroundColor: accentPalette[color].hex }}
              className={`h-5 w-5 rounded-full transition-transform ${
                isSelected
                  ? "scale-110 ring-2 ring-current"
                  : "opacity-75 hover:opacity-100"
              }`}
            />
          );
        })}
      </div>

      <button
        type="button"
        data-testid="btn-3d-toggle"
        aria-label="Toggle 3D mode"
        aria-pressed={enable3D}
        onClick={toggle3D}
        className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 font-mono text-xs font-semibold transition-colors ${
          enable3D
            ? `${currentAccent.border} ${currentAccent.text}`
            : "border-zinc-500/20 opacity-65"
        }`}
      >
        <Box aria-hidden="true" className="h-3.5 w-3.5" />
        <span>{enable3D ? "3D ON" : "3D OFF"}</span>
      </button>
    </nav>
  );
}

