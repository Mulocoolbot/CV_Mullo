"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, FileText, MapPin } from "lucide-react";
import { AtsResumeModal } from "@/components/AtsResumeModal";
import { OpticalVortexSculpture } from "@/components/WireframeSculptures3D";
import { profileData } from "@/data/profile";
import { themeTokens, usePreferences } from "@/hooks/usePreferences";
import { getAssetPath } from "@/utils/assetPath";

export function HeroSection() {
  const { lang, theme } = usePreferences();
  const tokens = themeTokens[theme];
  const shouldReduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showCvNotice, setShowCvNotice] = useState(false);

  const gridBorder =
    theme === "dark" ? "border-[#232329]" : "border-[#E5E3DC]";
  const studioFrame =
    theme === "dark"
      ? "border-[#232329] bg-[#0A0A0C]/90 backdrop-blur-sm"
      : "border-[#E5E3DC] bg-[#F7F6F2]/90 backdrop-blur-sm";

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % profileData.roles.length);
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleExploreProjects = () => {
    const target = document.getElementById("portfolio-section");
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadCv = () => {
    if (!profileData.cvPdfUrl) {
      setShowCvNotice(true);
      return;
    }
    window.open(profileData.cvPdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="hero-section"
      data-testid="hero-section"
      className="pt-20 md:pt-28 pb-8 md:pb-10 w-full max-w-7xl mx-auto px-4 sm:px-8 overflow-hidden"
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full border ${studioFrame}`}
      >
        <div
          className={`lg:col-span-7 min-w-0 max-w-full overflow-hidden p-4 sm:p-7 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-r ${gridBorder}`}
        >
          <div className="space-y-5 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 min-w-0">
              {!imageError ? (
                <img
                  src={getAssetPath(profileData.avatarUrl)}
                  alt={profileData.name}
                  data-testid="profile-avatar-img"
                  onError={() => setImageError(true)}
                  className={`w-16 h-16 border object-cover shrink-0 ${gridBorder}`}
                />
              ) : (
                <div
                  data-testid="profile-avatar-fallback"
                  className={`flex w-16 h-16 items-center justify-center border font-mono text-lg font-bold shrink-0 ${gridBorder} ${tokens.secondaryText}`}
                >
                  AMS
                </div>
              )}

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  {profileData.available && (
                    <div
                      data-testid="status-badge"
                      className={`inline-flex max-w-full items-center gap-2 border px-2.5 py-0.5 font-mono text-xs font-medium break-words ${gridBorder}`}
                    >
                      <span className="h-2 w-2 shrink-0 animate-pulse bg-[#FF5A36]" />
                      <span className="break-words">
                        {profileData.statusLabel[lang]}
                      </span>
                    </div>
                  )}

                  <span
                    className={`inline-flex max-w-full items-center gap-1 font-mono text-xs break-words ${tokens.textMuted}`}
                  >
                    <MapPin
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 text-[#2563EB]"
                    />
                    <span className="break-words">{profileData.location}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight break-words">
                  {profileData.name}
                </h1>

                <motion.p
                  key={profileData.roles[roleIndex]}
                  data-testid="active-role"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-xs font-semibold text-[#2563EB] sm:text-sm break-words"
                >
                  {profileData.roles[roleIndex]}
                </motion.p>
              </div>
            </div>

            <div className="space-y-2.5 min-w-0">
              <p className="text-base font-medium leading-snug sm:text-lg break-words">
                {profileData.headline[lang]}
              </p>

              <div
                className={`text-sm leading-relaxed space-y-2 break-words ${tokens.textMuted}`}
              >
                {profileData.bio[lang].map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className={`space-y-5 pt-5 border-t min-w-0 ${gridBorder}`}>
            <div
              className={`grid sm:grid-cols-2 border ${gridBorder} divide-y sm:divide-y-0 sm:divide-x ${
                theme === "dark" ? "divide-[#232329]" : "divide-[#E5E3DC]"
              }`}
            >
              <div className="p-3 min-w-0">
                <ul role="list" className="flex flex-wrap gap-1.5">
                  {profileData.coreStack.map((tech) => (
                    <li
                      key={tech}
                      className={`text-xs px-2 py-0.5 border font-mono font-medium ${gridBorder}`}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 min-w-0">
                <ul role="list" className="flex flex-wrap gap-1.5">
                  {profileData.exploringStack.map((item) => (
                    <li
                      key={item}
                      className="text-xs px-2 py-0.5 border border-[#FF5A36]/50 font-mono font-medium text-[#FF5A36]"
                    >
                      {item}
                    </li>
                  ))}
                  {profileData.softSkills.map((skill) => (
                    <li
                      key={skill}
                      className={`text-xs px-2 py-0.5 border font-medium ${gridBorder} ${tokens.textMuted}`}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                data-testid="btn-explore-projects"
                onClick={handleExploreProjects}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#2563EB] px-4 py-3 md:py-2.5 text-xs font-semibold text-white sm:text-sm transition-opacity hover:opacity-90"
              >
                <span>{lang === "id" ? "Lihat Proyek" : "View Projects"}</span>
                <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
              </button>

              <button
                type="button"
                data-testid="btn-download-cv"
                onClick={handleDownloadCv}
                className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 border px-4 py-3 md:py-2.5 text-xs font-semibold sm:text-sm transition-colors hover:border-[#2563EB] ${gridBorder} ${tokens.secondaryText}`}
              >
                <FileText aria-hidden="true" className="h-4 w-4" />
                <span>{lang === "id" ? "Unduh CV" : "Download CV"}</span>
              </button>
            </div>

            <AtsResumeModal
              isOpen={showCvNotice}
              onClose={() => setShowCvNotice(false)}
            />
          </div>
        </div>

        <div
          className={`lg:col-span-5 min-w-0 max-w-full border flex items-stretch overflow-hidden ${
            theme === "dark"
              ? "bg-[#12151E] border-[#222634]"
              : "bg-white border-[#E2E0D8]"
          }`}
        >
          <OpticalVortexSculpture />
        </div>
      </div>
    </section>
  );
}
