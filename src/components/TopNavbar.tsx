"use client";

import { themeTokens, usePreferences } from "@/hooks/usePreferences";

export function TopNavbar() {
  const { lang, theme, toggleLanguage, toggleTheme } = usePreferences();
  const tokens = themeTokens[theme];

  const navLinks = [
    {
      href: "#",
      label: lang === "id" ? "Profil" : "Profile",
    },
    {
      href: "#portfolio-section",
      label: lang === "id" ? "Proyek" : "Projects",
    },
    {
      href: "#experience-section",
      label: lang === "id" ? "Pengalaman" : "Experience",
    },
    {
      href: "#services-contact-section",
      label: lang === "id" ? "Layanan" : "Services",
    },
  ];

  return (
    <header
      data-testid="top-navbar"
      className="fixed top-3 inset-x-0 z-40 max-w-7xl mx-auto px-4 sm:px-8"
    >
      <div
        className={`h-14 px-5 rounded-2xl backdrop-blur-md border shadow-sm flex items-center justify-between transition-colors duration-300 ${tokens.bgSurface} ${tokens.border}`}
      >
        <a
          href="#"
          data-cursor="pointer"
          className="inline-flex items-center gap-2.5 text-sm font-bold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-[#FF5A36]"
          />
          <span>Ahmad Mulia</span>
        </a>

        <nav
          aria-label={lang === "id" ? "Navigasi utama" : "Primary navigation"}
          className="hidden items-center gap-7 md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="pointer"
              className={`text-sm font-medium transition-colors ${tokens.textMuted} ${
                theme === "light"
                  ? "hover:text-[#2563EB]"
                  : "hover:text-[#3B82F6]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="btn-lang-toggle"
            data-cursor="pointer"
            onClick={toggleLanguage}
            aria-label="Toggle Language"
            className={`relative inline-flex items-center h-9 w-[76px] rounded-full p-1 transition-colors duration-300 border ${tokens.border} ${tokens.bgPrimary}`}
          >
            <span
              aria-hidden="true"
              className={`absolute top-1 bottom-1 w-[32px] rounded-full bg-[#2563EB] transition-transform duration-300 ease-out ${
                lang === "id" ? "translate-x-0" : "translate-x-[34px]"
              }`}
            />
            <span
              className={`relative z-10 flex-1 text-center text-xs font-semibold tracking-wide transition-colors duration-300 ${
                lang === "id" ? "text-white" : tokens.textMuted
              }`}
            >
              ID
            </span>
            <span
              className={`relative z-10 flex-1 text-center text-xs font-semibold tracking-wide transition-colors duration-300 ${
                lang === "en" ? "text-white" : tokens.textMuted
              }`}
            >
              EN
            </span>
          </button>

          <button
            type="button"
            data-testid="btn-theme-toggle"
            data-theme-state={theme}
            data-cursor="pointer"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`relative inline-flex items-center h-9 w-[68px] rounded-full p-1 transition-colors duration-500 border overflow-hidden ${
              theme === "light"
                ? "bg-[#FDF8EE] border-[#E2E0D8]"
                : "bg-[#0B0E17] border-[#262932]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                theme === "light" ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF5A36]/25 blur-[1px]" />
              <span className="absolute right-3.5 bottom-2 h-1.5 w-1.5 rounded-full bg-amber-400/50" />
            </span>

            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                theme === "dark" ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="absolute left-2.5 top-2 h-1 w-1 rounded-full bg-blue-200/90" />
              <span className="absolute left-5 top-4 h-0.5 w-0.5 rounded-full bg-white/80" />
              <span className="absolute left-3 bottom-2 h-1 w-1 rounded-full bg-blue-300/75" />
            </span>

            <span
              aria-hidden="true"
              className={`relative z-10 h-7 w-7 rounded-full flex items-center justify-center shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                theme === "light"
                  ? "translate-x-0 bg-[#FF5A36] text-white"
                  : "translate-x-[32px] bg-[#2563EB] text-white"
              }`}
            >
              <svg
                data-testid="icon-sun"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`absolute h-4 w-4 transition-all duration-500 ease-out ${
                  theme === "light"
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-0 rotate-90 opacity-0"
                }`}
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>

              <svg
                data-testid="icon-moon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`absolute h-4 w-4 transition-all duration-500 ease-out ${
                  theme === "light"
                    ? "scale-0 -rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                }`}
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
