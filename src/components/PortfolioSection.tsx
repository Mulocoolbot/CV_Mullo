"use client";

import { useMemo, useState } from "react";
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
import { projectCategories, projectsData } from "@/data/projects";
import { themeTokens, usePreferences } from "@/hooks/usePreferences";
import type { ProjectCategory, ProjectItem } from "@/types/cv";

export function PortfolioSection() {
  const { lang, theme } = usePreferences();
  const tokens = themeTokens[theme];
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {lang === "id" ? "Portofolio" : "Projects"}
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
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? `${tokens.secondaryBg} border-transparent`
                    : `${tokens.border} ${tokens.bgSurface} ${tokens.textMuted} hover:border-[#2563EB]`
                }`}
              >
                <span>{cat.label[lang]}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[11px] ${
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            data-testid={`project-card-${project.id}`}
            className={`flex flex-col overflow-hidden rounded-2xl border shadow-sm backdrop-blur-md transition-all ${tokens.bgSurface} ${tokens.border}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={project.screenshots[0]}
                alt={project.title}
                data-testid={`project-thumb-${project.id}`}
                className="h-40 w-full object-cover object-top"
              />
              <span
                data-testid={`project-screen-count-${project.id}`}
                className="absolute top-2.5 right-2.5 rounded-full bg-[#121316]/85 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white backdrop-blur-sm"
              >
                {`${project.screenshots.length} ${
                  lang === "id" ? "Layar" : "Screens"
                }`}
              </span>
            </div>

            <div className="p-4 space-y-2.5 flex flex-1 flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-bold tracking-tight">
                  {project.title}
                </h3>

                <p className={`line-clamp-2 text-xs leading-relaxed ${tokens.textMuted}`}>
                  {project.shortSummary[lang]}
                </p>

                <ul role="list" className="flex flex-wrap gap-1.5 pt-1">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <li
                      key={tech}
                      className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${tokens.border}`}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`flex flex-wrap items-center gap-2 border-t pt-3 ${tokens.border}`}>
                <button
                  type="button"
                  data-testid={`btn-case-study-${project.id}`}
                  onClick={() => handleSelectProject(project)}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[#2563EB] ${tokens.border} ${tokens.secondaryText}`}
                >
                  <Code2 aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{lang === "id" ? "Detail" : "Details"}</span>
                </button>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-github-${project.id}`}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors hover:border-[#2563EB] ${tokens.border}`}
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
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-opacity hover:opacity-90 ${tokens.tertiaryBg}`}
                  >
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                    <span>v2.0.0</span>
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
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
            className={`max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border p-6 shadow-2xl sm:p-8 ${tokens.bgSurface} ${tokens.border} ${tokens.textPrimary}`}
          >
            <div className={`flex items-start justify-between gap-4 border-b pb-5 ${tokens.border}`}>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-0.5 font-mono text-xs font-semibold ${tokens.border} ${tokens.secondaryText}`}
                  >
                    {selectedProject.categoryLabel[lang]}
                  </span>
                  <span className={`rounded-full border px-3 py-0.5 font-mono text-xs ${tokens.border} ${tokens.textMuted}`}>
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
                className={`rounded-xl border p-2 transition-colors hover:border-[#2563EB] ${tokens.border}`}
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {selectedProject.screenshots.length > 0 && (
                <div
                  data-testid="modal-screenshot-gallery"
                  className={`space-y-3 rounded-2xl border p-4 ${tokens.bgPrimary} ${tokens.border}`}
                >
                  <div className={`relative overflow-hidden rounded-xl border bg-[#0D0F12] ${tokens.border}`}>
                    <img
                      src={selectedProject.screenshots[activeSlideIndex]}
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#0D0F12]/80 p-2 text-white backdrop-blur-sm transition-colors hover:bg-[#0D0F12]"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      data-testid="btn-next-screen"
                      aria-label={lang === "id" ? "Layar berikutnya" : "Next screen"}
                      onClick={handleNextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#0D0F12]/80 p-2 text-white backdrop-blur-sm transition-colors hover:bg-[#0D0F12]"
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
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-[#0D0F12]/80 px-2.5 py-1.5 font-mono text-xs text-white backdrop-blur-sm transition-colors hover:bg-[#0D0F12]"
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
                          className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border transition-all ${
                            isCurrent
                              ? "border-[#2563EB] ring-2 ring-[#2563EB]/40"
                              : `${tokens.border} opacity-65 hover:opacity-100`
                          }`}
                        >
                          <img
                            src={shot}
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
                <div className={`rounded-2xl border p-4 ${tokens.border}`}>
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

                <div className={`rounded-2xl border p-4 ${tokens.border}`}>
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
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm ${tokens.border}`}
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
                      className={`rounded-lg border px-3 py-1 font-mono text-xs font-semibold ${tokens.border} ${tokens.secondaryText}`}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5 ${tokens.border}`}>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs font-semibold transition-colors hover:border-[#2563EB] ${tokens.border}`}
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
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold transition-opacity hover:opacity-90 ${tokens.tertiaryBg}`}
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
                className={`rounded-xl border px-5 py-2.5 text-xs font-semibold transition-colors hover:border-[#2563EB] ${tokens.border}`}
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
            className="absolute right-4 top-4 rounded-full border border-white/25 bg-[#0D0F12]/80 p-2.5 text-white transition-colors hover:bg-[#0D0F12] sm:right-6 sm:top-6"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>

          <div className="relative flex w-full max-w-6xl items-center justify-center">
            <button
              type="button"
              aria-label={lang === "id" ? "Layar sebelumnya" : "Previous screen"}
              onClick={handlePrevSlide}
              className="absolute left-2 z-10 rounded-full border border-white/25 bg-[#0D0F12]/80 p-3 text-white transition-colors hover:bg-[#0D0F12] sm:left-4"
            >
              <ChevronLeft aria-hidden="true" className="h-6 w-6" />
            </button>

            <img
              src={selectedProject.screenshots[activeSlideIndex]}
              alt={
                selectedProject.screenshotCaptions[lang][activeSlideIndex] ??
                selectedProject.title
              }
              className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain"
            />

            <button
              type="button"
              aria-label={lang === "id" ? "Layar berikutnya" : "Next screen"}
              onClick={handleNextSlide}
              className="absolute right-2 z-10 rounded-full border border-white/25 bg-[#0D0F12]/80 p-3 text-white transition-colors hover:bg-[#0D0F12] sm:right-4"
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
