"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  FolderGit2,
  Image as ImageIcon,
  Layers,
  Maximize2,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { projectCategories, projectsData } from "@/data/projects";
import { accentPalette, usePreferences } from "@/hooks/usePreferences";
import type { ProjectCategory, ProjectItem } from "@/types/cv";

export function PortfolioSection() {
  const { lang, theme, accent } = usePreferences();
  const currentAccent = accentPalette[accent];
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

  const cardSurface =
    theme === "dark"
      ? "border-zinc-800/80 bg-zinc-900/60"
      : "border-zinc-200/90 bg-white/85";

  const blueprintSurface =
    theme === "dark"
      ? "border-zinc-800 bg-zinc-950/80"
      : "border-zinc-200 bg-zinc-100/80";

  return (
    <section
      id="portfolio-section"
      data-testid="portfolio-section"
      className="max-w-6xl mx-auto px-6 pb-32"
    >
      <div className="space-y-4">
        <div
          className={`inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
        >
          <Layers aria-hidden="true" className="h-4 w-4" />
          <span>
            {lang === "id" ? "Karya & Arsitektur" : "Selected Works & Architecture"}
          </span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {lang === "id"
            ? "Portofolio & Studi Kasus Rekayasa"
            : "Engineering Portfolio & Case Studies"}
        </h2>

        <p className="max-w-3xl text-sm leading-relaxed opacity-80 sm:text-base">
          {lang === "id"
            ? "Dokumentasi proyek pengembangan end-to-end mencakup aplikasi Mobile Android Native, Sistem Informasi Web, eksperimen 3D interaktif, hingga riset AI dan Data Engineering."
            : "End-to-end engineering case studies spanning Native Android Mobile Apps, Full Stack Information Systems, interactive 3D WebGL experiments, and On-Device AI & Data Engineering."}
        </p>
      </div>

      <div
        role="group"
        aria-label={lang === "id" ? "Filter kategori proyek" : "Project category filter"}
        className="mt-8 flex flex-wrap items-center gap-2.5"
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
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                isActive
                  ? `${currentAccent.border} ${currentAccent.text} ring-1 ${currentAccent.ring}`
                  : "border-zinc-500/20 opacity-75 hover:opacity-100"
              }`}
            >
              <span>{cat.label[lang]}</span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-xs ${
                  isActive
                    ? `${currentAccent.bg} text-zinc-950`
                    : "bg-zinc-500/15"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            data-testid={`project-card-${project.id}`}
            className={`flex flex-col justify-between rounded-3xl border p-6 shadow-lg backdrop-blur-md transition-all ${cardSurface}`}
          >
            <div className="space-y-5">
              <div
                className={`relative overflow-hidden rounded-2xl border p-4 ${blueprintSurface}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border ${currentAccent.border} px-3 py-1 font-mono text-xs font-semibold ${currentAccent.text}`}
                  >
                    <Tag aria-hidden="true" className="h-3 w-3" />
                    <span>{project.categoryLabel[lang]}</span>
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                      project.isPublicRelease
                        ? `${currentAccent.bg} text-zinc-950 font-semibold`
                        : "border border-zinc-500/25 opacity-80"
                    }`}
                  >
                    {project.releaseStatus[lang]}
                  </span>
                </div>

                {project.screenshots.length === 0 ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-zinc-500/25 px-3 py-2.5 font-mono text-xs opacity-70">
                    <ImageIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span>
                      {lang === "id"
                        ? "Blueprint Arsitektur · Galeri Screenshot Siap"
                        : "Architecture Blueprint · Screenshot Slot Ready"}
                    </span>
                  </div>
                ) : (
                  <div className="relative mt-4 overflow-hidden rounded-xl border border-zinc-500/20">
                    <img
                      src={project.screenshots[0]}
                      alt={project.title}
                      data-testid={`project-thumb-${project.id}`}
                      className="h-40 w-full object-cover object-top"
                    />
                    <span
                      data-testid={`project-screen-count-${project.id}`}
                      className="absolute bottom-2 right-2 rounded-full bg-zinc-950/80 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-100 backdrop-blur-sm"
                    >
                      {`${project.screenshots.length} ${
                        lang === "id" ? "Layar" : "Screens"
                      }`}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xl font-bold tracking-tight">
                  {project.title}
                </h3>

                <p className={`font-mono text-xs font-medium ${currentAccent.text}`}>
                  {project.role[lang]}
                </p>

                <p className="text-sm leading-relaxed opacity-85">
                  {project.shortSummary[lang]}
                </p>
              </div>

              <ul role="list" className="flex flex-wrap gap-1.5 pt-1">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-lg border border-zinc-500/20 px-2.5 py-1 font-mono text-xs"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-zinc-500/15 pt-4">
              <button
                type="button"
                data-testid={`btn-case-study-${project.id}`}
                onClick={() => handleSelectProject(project)}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border ${currentAccent.border} px-3.5 py-2 text-xs font-semibold ${currentAccent.text} transition-colors hover:bg-zinc-500/10`}
              >
                <Code2 aria-hidden="true" className="h-3.5 w-3.5" />
                <span>
                  {lang === "id"
                    ? "Studi Kasus & Detail"
                    : "Case Study & Details"}
                </span>
              </button>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-github-${project.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-500/25 px-3.5 py-2 font-mono text-xs font-medium transition-colors hover:border-current"
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
                  className={`inline-flex items-center gap-1.5 rounded-xl ${currentAccent.bg} px-3.5 py-2 font-mono text-xs font-bold text-zinc-950 transition-opacity hover:opacity-90`}
                >
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>v2.0.0</span>
                  <ExternalLink aria-hidden="true" className="h-3 w-3" />
                </a>
              )}
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
            className={`max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8 ${
              theme === "dark"
                ? "border-zinc-800 bg-zinc-900 text-zinc-100"
                : "border-zinc-200 bg-white text-zinc-900"
            }`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-500/15 pb-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border ${currentAccent.border} px-3 py-0.5 font-mono text-xs font-semibold ${currentAccent.text}`}
                  >
                    {selectedProject.categoryLabel[lang]}
                  </span>
                  <span className="rounded-full border border-zinc-500/25 px-3 py-0.5 font-mono text-xs">
                    {selectedProject.releaseStatus[lang]}
                  </span>
                </div>

                <h3
                  id="case-study-modal-title"
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  {selectedProject.title}
                </h3>

                <p className={`font-mono text-xs font-semibold ${currentAccent.text}`}>
                  {selectedProject.role[lang]}
                </p>
              </div>

              <button
                type="button"
                data-testid="btn-close-modal"
                aria-label={lang === "id" ? "Tutup modal" : "Close modal"}
                onClick={() => handleSelectProject(null)}
                className="rounded-xl border border-zinc-500/25 p-2 transition-colors hover:border-current"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {selectedProject.screenshots.length > 0 && (
                <div
                  data-testid="modal-screenshot-gallery"
                  className={`space-y-3 rounded-2xl border p-4 ${blueprintSurface}`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-zinc-500/20 bg-zinc-950">
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-500/30 bg-zinc-950/75 p-2 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-zinc-900"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      data-testid="btn-next-screen"
                      aria-label={lang === "id" ? "Layar berikutnya" : "Next screen"}
                      onClick={handleNextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-500/30 bg-zinc-950/75 p-2 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-zinc-900"
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
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-zinc-500/30 bg-zinc-950/75 px-2.5 py-1.5 font-mono text-xs text-zinc-100 backdrop-blur-sm transition-colors hover:bg-zinc-900"
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
                    className="text-center text-xs font-medium opacity-85 sm:text-sm"
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
                              ? `${currentAccent.border} ring-2 ${currentAccent.ring}`
                              : "border-zinc-500/25 opacity-60 hover:opacity-100"
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
                <div className="rounded-2xl border border-zinc-500/20 p-4">
                  <h4
                    className={`font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
                  >
                    {lang === "id"
                      ? "Latar Belakang & Studi Kasus"
                      : "Problem & Case Study"}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">
                    {selectedProject.caseStudyProblem[lang]}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-500/20 p-4">
                  <h4
                    className={`font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
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
                  className={`font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
                >
                  {lang === "id" ? "Fitur Utama" : "Key Engineered Features"}
                </h4>
                <ul role="list" className="grid gap-2.5 sm:grid-cols-2">
                  {selectedProject.keyFeatures[lang].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 rounded-xl border border-zinc-500/15 p-3 text-sm"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className={`mt-0.5 h-4 w-4 shrink-0 ${currentAccent.text}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4
                  className={`font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
                >
                  Tech Stack
                </h4>
                <ul role="list" className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <li
                      key={tech}
                      className={`rounded-lg border ${currentAccent.border} px-3 py-1 font-mono text-xs font-semibold ${currentAccent.text}`}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-500/15 pt-5">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-500/25 px-4 py-2.5 font-mono text-xs font-semibold transition-colors hover:border-current"
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
                    className={`inline-flex items-center gap-2 rounded-xl ${currentAccent.bg} px-4 py-2.5 font-mono text-xs font-bold text-zinc-950 transition-opacity hover:opacity-90`}
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
                className="rounded-xl border border-zinc-500/25 px-5 py-2.5 text-xs font-semibold transition-colors hover:bg-zinc-500/10"
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
            className="absolute right-4 top-4 rounded-full border border-zinc-500/40 bg-zinc-900/80 p-2.5 text-zinc-100 transition-colors hover:bg-zinc-800 sm:right-6 sm:top-6"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>

          <div className="relative flex w-full max-w-6xl items-center justify-center">
            <button
              type="button"
              aria-label={lang === "id" ? "Layar sebelumnya" : "Previous screen"}
              onClick={handlePrevSlide}
              className="absolute left-2 z-10 rounded-full border border-zinc-500/40 bg-zinc-900/80 p-3 text-zinc-100 transition-colors hover:bg-zinc-800 sm:left-4"
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
              className="absolute right-2 z-10 rounded-full border border-zinc-500/40 bg-zinc-900/80 p-3 text-zinc-100 transition-colors hover:bg-zinc-800 sm:right-4"
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

