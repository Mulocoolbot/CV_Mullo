"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { themeTokens, usePreferences } from "@/hooks/usePreferences";

export function TopNavbar() {
  const { lang, theme, toggleLanguage, toggleTheme } = usePreferences();
  const tokens = themeTokens[theme];
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const trackedSections = [
      "services-contact-section",
      "experience-section",
      "portfolio-section",
    ];

    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, ratio)));

      let currentSection = "hero";
      for (const sectionId of trackedSections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 180) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    if (window.scrollY > 0) {
      handleScroll();
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navLinks = [
    {
      sectionId: "hero",
      testId: "nav-link-hero",
      href: "#",
      label: lang === "id" ? "Profil" : "Profile",
    },
    {
      sectionId: "portfolio-section",
      testId: "nav-link-portfolio",
      href: "#portfolio-section",
      label: lang === "id" ? "Proyek" : "Projects",
    },
    {
      sectionId: "experience-section",
      testId: "nav-link-experience",
      href: "#experience-section",
      label: lang === "id" ? "Pengalaman" : "Experience",
    },
    {
      sectionId: "services-contact-section",
      testId: "nav-link-services",
      href: "#services-contact-section",
      label: lang === "id" ? "Layanan" : "Services",
    },
  ];

  const handleLinkClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false);
  };

  return (
    <header
      data-testid="top-navbar"
      className="fixed top-0 md:top-3 inset-x-0 z-50 w-full max-w-7xl mx-auto px-0 md:px-6"
    >
      {isSidebarOpen && (
        <div
          data-testid="sidebar-backdrop"
          aria-hidden="true"
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 top-14 bg-black/50 backdrop-blur-xs z-40"
        />
      )}

      <div
        className={`w-full h-14 px-4 sm:px-5 md:rounded-none border-b md:border backdrop-blur-md flex items-center justify-between relative z-50 transition-colors duration-300 ${tokens.bgSurface} ${tokens.border}`}
      >
        <a
          href="#"
          data-cursor="pointer"
          onClick={() => handleLinkClick("hero")}
          className="inline-flex items-center gap-2.5 text-sm tracking-tight truncate max-w-[180px] sm:max-w-none font-bold"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF5A36]"
          />
          <span className="truncate">Ahmad Mulia</span>
        </a>

        <button
          type="button"
          data-testid="btn-sidebar-toggle"
          data-cursor="pointer"
          aria-expanded={isSidebarOpen}
          aria-label={lang === "id" ? "Buka menu" : "Toggle menu"}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className={`md:hidden p-2 border transition-colors ${tokens.border} ${tokens.bgPrimary}`}
        >
          {isSidebarOpen ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
        </button>

        <div
          data-testid="collapsible-sidebar"
          data-open={isSidebarOpen ? "true" : "false"}
          className={`fixed md:static top-14 right-0 h-[calc(100dvh-3.5rem)] md:h-auto w-[280px] max-w-[85vw] md:w-auto md:max-w-none z-50 p-5 md:p-0 border-l md:border-0 shadow-2xl md:shadow-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 overflow-y-auto md:overflow-visible transition-transform duration-300 ease-in-out ${
            theme === "dark"
              ? "bg-[#15181E] md:bg-transparent"
              : "bg-white md:bg-transparent"
          } ${tokens.border} ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-2">
            <div
              className={`md:hidden flex items-center justify-between pb-3 border-b ${tokens.border}`}
            >
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                {lang === "id" ? "Menu & Pengaturan" : "Menu & Settings"}
              </span>
              <button
                type="button"
                data-testid="btn-sidebar-close"
                aria-label={lang === "id" ? "Tutup menu" : "Close menu"}
                onClick={() => setIsSidebarOpen(false)}
                className={`p-1.5 border ${tokens.border}`}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <nav
              aria-label={
                lang === "id" ? "Navigasi utama" : "Primary navigation"
              }
              className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-1"
            >
              {navLinks.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    data-testid={link.testId}
                    data-active={isActive ? "true" : "false"}
                    data-cursor="pointer"
                    onClick={() => handleLinkClick(link.sectionId)}
                    className={`rounded-lg px-3 py-2 md:px-2.5 md:py-1 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#2563EB]/10 text-[#2563EB]"
                        : `${tokens.textMuted} ${
                            theme === "light"
                              ? "hover:text-[#2563EB]"
                              : "hover:text-[#3B82F6]"
                          }`
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div
            className={`pt-4 md:pt-0 border-t md:border-0 flex flex-col md:flex-row items-stretch md:items-center gap-3 ${tokens.border}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`md:hidden text-xs font-mono font-semibold uppercase tracking-wider ${tokens.textMuted}`}
              >
                {lang === "id" ? "Bahasa" : "Language"}
              </span>
              <button
                type="button"
                data-testid="btn-lang-toggle"
                data-cursor="pointer"
                onClick={toggleLanguage}
                aria-label="Toggle Language"
                className={`relative inline-flex items-center h-9 w-[76px] shrink-0 rounded-full p-1 transition-colors duration-300 border ${tokens.border} ${tokens.bgPrimary}`}
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
            </div>

            <div className="flex items-center justify-between gap-3">
              <span
                className={`md:hidden text-xs font-mono font-semibold uppercase tracking-wider ${tokens.textMuted}`}
              >
                {lang === "id" ? "Tema" : "Theme"}
              </span>
              <button
                type="button"
                data-testid="btn-theme-toggle"
                data-theme-state={theme}
                data-cursor="pointer"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className={`relative inline-flex items-center h-9 w-[68px] shrink-0 rounded-full p-1 transition-colors duration-500 border overflow-hidden ${
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
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
        >
          <div
            data-testid="navbar-scroll-progress"
            style={{ width: `${scrollProgress}%` }}
            className="h-full bg-[#2563EB] transition-all duration-150"
          />
        </div>
      </div>
    </header>
  );
}
