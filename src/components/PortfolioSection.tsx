"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  FolderGit2,
  Maximize2,
  Sparkles,
  X,
} from "lucide-react";
import { TrefoilKnotSculpture } from "@/components/WireframeSculptures3D";
import { projectCategories, projectsData } from "@/data/projects";
import { themeTokens, usePreferences } from "@/hooks/usePreferences";
import type { ProjectCategory, ProjectItem } from "@/types/cv";
import { getAssetPath } from "@/utils/assetPath";

export function PortfolioSection() {
  const { lang, theme } = usePreferences();
  const tokens = themeTokens[theme];
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [tiltedCard, setTiltedCard] = useState<{
    id: string;
    rotateX: number;
    rotateY: number;
  } | null>(null);

  const gridBorder =
    theme === "dark" ? "border-[#232329]" : "border-[#E5E3DC]";
  const studioFrame =
    theme === "dark"
      ? "border-[#232329] bg-[#0A0A0C]/90 backdrop-blur-sm"
      : "border-[#E5E3DC] bg-[#F7F6F2]/90 backdrop-blur-sm";

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && selectedProject.screenshots.length > 0) {
        setActiveSlideIndex(
          (prev) => (prev + 1) % selectedProject.screenshots.length
        );
      } else if (
        event.key === "ArrowLeft" &&
        selectedProject.screenshots.length > 0
      ) {
        setActiveSlideIndex(
          (prev) =>
            (prev - 1 + selectedProject.screenshots.length) %
            selectedProject.screenshots.length
        );
      } else if (event.key === "Escape") {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          setSelectedProject(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject, isLightboxOpen]);

  const handleCardMouseMove = (
    event: MouseEvent<HTMLElement>,
    projectId: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      setTiltedCard({ id: projectId, rotateX: 0, rotateY: 0 });
      return;
    }
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    const clampAngle = (value: number) => Math.max(-5, Math.min(5, value));
    const rotateX = clampAngle(Number((-relY * 10).toFixed(2)));
    const rotateY = clampAngle(Number((relX * 10).toFixed(2)));
    setTiltedCard({ id: projectId, rotateX, rotateY });
  };

  const handleSelectProject = (project: ProjectItem | null) => {
    setSelectedProject(project);
    setActiveSlideIndex(0);
    setIsLightboxOpen(false);
  };

  const handlePrevSlide = () => {
    if (!selectedProject || selectedProject.screenshots.length === 0) {
      return;
    }
    const total = selectedProject.screenshots.length;
    setActiveSlideIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNextSlide = () => {
    if (!selectedProject || selectedProject.screenshots.length === 0) {
      return;
    }
    const total = selectedProject.screenshots.length;
    setActiveSlideIndex((prev) => (prev + 1) % total);
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") {
      return projectsData;
    }
    return projectsData.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const getCategoryCount = (category: ProjectCategory) => {
    if (category === "all") {
      return projectsData.length;
    }
    return projectsData.filter((item) => item.category === category).length;
  };

  return (
    <section
      id="portfolio-section"
      data-testid="portfolio-section"
      className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-8 py-10"
    >
      <div className={`grid lg:grid-cols-12 border mb-6 items-center ${studioFrame}`}>
        <div
          className={`lg:col-span-8 p-6 border-b lg:border-b-0 lg:border-r space-y-4 ${gridBorder}`}
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {lang === "id" ? "Portofolio" : "Portfolio"}
          </h2>

          <div
            role="group"
            aria-label={
              lang === "id" ? "Filter kategori proyek" : "Project category filter"
            }
            className="flex flex-wrap items-center gap-2"
          >
            {projectCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = getCategoryCount(cat.id);

              return (
                <button
                  key={cat.id}
                  type="button"
                  data-testid={`filter-tab-${cat.id}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : `${gridBorder} ${tokens.textMuted} hover:border-[#2563EB]`
                  }`}
                >
                  <span>{cat.label[lang]}</span>
                  <span
                    className={`px-1.5 py-0.5 font-mono text-[11px] ${
                      isActive ? "bg-white/20 text-white" : "bg-zinc-500/15"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 h-44 relative flex items-center justify-center">
          <TrefoilKnotSculpture className="w-full h-full" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          const isTilted = tiltedCard?.id === project.id;
          const rotateX = isTilted ? tiltedCard.rotateX : 0;
          const rotateY = isTilted ? tiltedCard.rotateY : 0;

          return (
            <article
              key={project.id}
              data-testid={`project-card-${project.id}`}
              data-tilt-active={isTilted ? "true" : "false"}
              onMouseMove={(event) => handleCardMouseMove(event, project.id)}
              onMouseLeave={() => setTiltedCard(null)}
              style={{
                transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              }}
              className={`flex flex-col overflow-hidden border transition-all duration-200 ease-out ${studioFrame}`}
            >
              <div className={`relative overflow-hidden border-b ${gridBorder}`}>
                <img
                  src={getAssetPath(project.screenshots[0])}
                  alt={project.title}
                  data-testid={`project-thumb-${project.id}`}
                  className="h-40 w-full object-cover object-top"
                />
                <span
                  data-testid={`project-screen-count-${project.id}`}
                  className="absolute top-2.5 right-2.5 bg-[#0A0A0C]/90 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white border border-white/15"
                >
                  {`${project.screenshots.length} ${
                    lang === "id" ? "Layar" : "Screens"
                  }`}
                </span>
              </div>

              <div className="p-4 space-y-3 flex flex-1 flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold tracking-tight">
                    {project.title}
                  </h3>

                  <p
                    className={`line-clamp-2 text-xs leading-relaxed ${tokens.textMuted}`}
                  >
                    {project.shortSummary[lang]}
                  </p>

                  <ul role="list" className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        className={`border px-2 py-0.5 font-mono text-[11px] ${gridBorder}`}
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`flex flex-wrap items-center gap-2 border-t pt-3 ${gridBorder}`}
                >
                  <button
                    type="button"
                    data-testid={`btn-case-study-${project.id}`}
                    onClick={() => handleSelectProject(project)}
                    className={`inline-flex flex-1 items-center justify-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[#2563EB] ${gridBorder} ${tokens.secondaryText}`}
                  >
                    <Code2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{lang === "id" ? "Detail" : "Details"}</span>
                  </button>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-github-${project.id}`}
                    className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-medium transition-colors hover:border-[#2563EB] ${gridBorder}`}
                  >
                    <FolderGit2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>

                  {project.releaseUrl && (
                    <a
                      href={project.releaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`link-release-${project.id}`}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-xs font-bold transition-opacity hover:opacity-90 ${tokens.tertiaryBg}`}
                    >
                      <Sparkles aria-hidden="true" className="h-3 w-3" />
                      <span>v2.0.0</span>
                      <ExternalLink aria-hidden="true" className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selectedProject && (
        <div
          data-testid="case-study-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
        >
          <div
            className={`max-h-[90vh] w-full max-w-3xl overflow-y-auto border p-6 sm:p-8 ${studioFrame} ${tokens.textPrimary}`}
          >
            <div
              className={`flex items-start justify-between gap-4 border-b pb-5 ${gridBorder}`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`border px-3 py-0.5 font-mono text-xs font-semibold ${gridBorder} ${tokens.secondaryText}`}
                  >
                    {selectedProject.categoryLabel[lang]}
                  </span>
                  <span
                    className={`border px-3 py-0.5 font-mono text-xs ${gridBorder} ${tokens.textMuted}`}
                  >
                    {selectedProject.releaseStatus[lang]}
                  </span>
                </div>

                <h3
                  id="case-study-modal-title"
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  {selectedProject.title}
                </h3>

                <p className={`font-mono text-xs font-semibold ${tokens.secondaryText}`}>
                  {selectedProject.role[lang]}
                </p>
              </div>

              <button
                type="button"
                data-testid="btn-close-modal"
                aria-label={lang === "id" ? "Tutup modal" : "Close modal"}
                onClick={() => handleSelectProject(null)}
                className={`border p-2 transition-colors hover:border-[#2563EB] ${gridBorder}`}
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {selectedProject.screenshots.length > 0 && (
                <div
                  data-testid="modal-screenshot-gallery"
                  className={`space-y-3 border p-4 ${tokens.bgPrimary} ${gridBorder}`}
                >
                  <div className={`relative overflow-hidden border bg-[#0D0F12] ${gridBorder}`}>
                    <img
                      src={getAssetPath(
                        selectedProject.screenshots[activeSlideIndex]
                      )}
                      alt={
                        selectedProject.screenshotCaptions[lang][activeSlideIndex] ??
                        selectedProject.title
                      }
                      data-testid="modal-active-screenshot"
                      className="h-64 w-full object-contain sm:h-80"
                    />

                    <button
                      type="button"
                      data-testid="btn-prev-screen"
                      aria-label={
                        lang === "id" ? "Layar sebelumnya" : "Previous screen"
                      }
                      onClick={handlePrevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 border border-white/20 bg-[#0D0F12]/80 p-2 text-white backdrop-blur-sm transition-colors hover:bg-[#0D0F12]"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      data-testid="btn-next-screen"
                      aria-label={lang === "id" ? "Layar berikutnya" : "Next screen"}
                      onClick={handleNextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 border border-white/20 bg-[#0D0F12]/80 p-2 text-white backdrop-blur-sm transition-colors hover:bg-[#0D0F12]"
                    >
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      data-testid="btn-open-lightbox"
                      aria-label={
                        lang === "id" ? "Perbesar layar penuh" : "Open fullscreen"
                      }
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 border border-white/20 bg-[#0D0F12]/80 px-2.5 py-1.5 font-mono text-xs text-white backdrop-blur-sm transition-colors hover:bg-[#0D0F12]"
                    >
                      <Maximize2 aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>
                        {`${activeSlideIndex + 1} / ${
                          selectedProject.screenshots.length
                        }`}
                      </span>
                    </button>
                  </div>

                  <p
                    data-testid="modal-active-caption"
                    className={`text-center text-xs font-medium sm:text-sm ${tokens.textMuted}`}
                  >
                    {selectedProject.screenshotCaptions[lang][activeSlideIndex]}
                  </p>

                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedProject.screenshots.map((shot, idx) => {
                      const isCurrent = idx === activeSlideIndex;
                      return (
                        <button
                          key={shot}
                          type="button"
                          data-testid={`btn-thumb-${idx}`}
                          aria-label={
                            selectedProject.screenshotCaptions[lang][idx] ??
                            `${selectedProject.title} ${idx + 1}`
                          }
                          aria-pressed={isCurrent}
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`relative h-14 w-24 shrink-0 overflow-hidden border transition-all ${
                            isCurrent
                              ? "border-[#2563EB] ring-2 ring-[#2563EB]/40"
                              : `${gridBorder} opacity-65 hover:opacity-100`
                          }`}
                        >
                          <img
                            src={getAssetPath(shot)}
                            alt={
                              selectedProject.screenshotCaptions[lang][idx] ??
                              selectedProject.title
                            }
                            className="h-full w-full object-cover object-top"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className={`border p-4 ${gridBorder}`}>
                  <h4
                    className={`font-mono text-xs font-semibold uppercase tracking-wider ${tokens.secondaryText}`}
                  >
                    {lang === "id"
                      ? "Latar Belakang & Studi Kasus"
                      : "Problem & Case Study"}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">
                    {selectedProject.caseStudyProblem[lang]}
                  </p>
                </div>

                <div className={`border p-4 ${gridBorder}`}>
                  <h4
                    className={`font-mono text-xs font-semibold uppercase tracking-wider ${tokens.secondaryText}`}
                  >
                    {lang === "id"
                      ? "Solusi Arsitektur & Peran Teknis"
                      : "Technical Solution & Architecture"}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">
                    {selectedProject.technicalSolution[lang]}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4
                  className={`font-mono text-xs font-semibold uppercase tracking-wider ${tokens.secondaryText}`}
                >
                  {lang === "id" ? "Fitur Utama" : "Key Engineered Features"}
                </h4>
                <ul role="list" className="grid gap-2.5 sm:grid-cols-2">
                  {selectedProject.keyFeatures[lang].map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-2.5 border p-3 text-sm ${gridBorder}`}
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className={`mt-0.5 h-4 w-4 shrink-0 ${tokens.secondaryText}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4
                  className={`font-mono text-xs font-semibold uppercase tracking-wider ${tokens.secondaryText}`}
                >
                  Tech Stack
                </h4>
                <ul role="list" className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <li
                      key={tech}
                      className={`border px-3 py-1 font-mono text-xs font-semibold ${gridBorder} ${tokens.secondaryText}`}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={`mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5 ${gridBorder}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-xs font-semibold transition-colors hover:border-[#2563EB] ${gridBorder}`}
                >
                  <FolderGit2 aria-hidden="true" className="h-4 w-4" />
                  <span>GitHub Repository</span>
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>

                {selectedProject.releaseUrl && (
                  <a
                    href={selectedProject.releaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold transition-opacity hover:opacity-90 ${tokens.tertiaryBg}`}
                  >
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                    <span>Release v2.0.0</span>
                    <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSelectProject(null)}
                className={`border px-5 py-2.5 text-xs font-semibold transition-colors hover:border-[#2563EB] ${gridBorder}`}
              >
                {lang === "id" ? "Tutup" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProject && isLightboxOpen && (
        <div
          data-testid="screenshot-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={
            selectedProject.screenshotCaptions[lang][activeSlideIndex] ??
            selectedProject.title
          }
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
        >
          <button
            type="button"
            data-testid="btn-close-lightbox"
            aria-label={lang === "id" ? "Tutup lightbox" : "Close lightbox"}
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 border border-white/25 bg-[#0D0F12]/80 p-2.5 text-white transition-colors hover:bg-[#0D0F12] sm:right-6 sm:top-6"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>

          <div className="relative flex w-full max-w-6xl items-center justify-center">
            <button
              type="button"
              aria-label={lang === "id" ? "Layar sebelumnya" : "Previous screen"}
              onClick={handlePrevSlide}
              className="absolute left-2 z-10 border border-white/25 bg-[#0D0F12]/80 p-3 text-white transition-colors hover:bg-[#0D0F12] sm:left-4"
            >
              <ChevronLeft aria-hidden="true" className="h-6 w-6" />
            </button>

            <img
              src={getAssetPath(selectedProject.screenshots[activeSlideIndex])}
              alt={
                selectedProject.screenshotCaptions[lang][activeSlideIndex] ??
                selectedProject.title
              }
              className="max-h-[82vh] w-auto max-w-full object-contain"
            />

            <button
              type="button"
              aria-label={lang === "id" ? "Layar berikutnya" : "Next screen"}
              onClick={handleNextSlide}
              className="absolute right-2 z-10 border border-white/25 bg-[#0D0F12]/80 p-3 text-white transition-colors hover:bg-[#0D0F12] sm:right-4"
            >
              <ChevronRight aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <p className="mt-4 max-w-3xl text-center text-sm font-medium text-zinc-200">
            {selectedProject.screenshotCaptions[lang][activeSlideIndex]}
          </p>
        </div>
      )}
    </section>
  );
}
