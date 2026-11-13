"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Cpu,
  GraduationCap,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import {
  skillCategories,
  skillsData,
  timelineCategories,
  timelineData,
} from "@/data/experience";
import { accentPalette, usePreferences } from "@/hooks/usePreferences";
import type {
  SkillCategory,
  TimelineCategory,
  TimelineItem,
} from "@/types/cv";

export function ExperienceSection() {
  const { lang, theme, accent } = usePreferences();
  const currentAccent = accentPalette[accent];
  const [activeSkillTab, setActiveSkillTab] = useState<SkillCategory>("all");
  const [activeTimelineTab, setActiveTimelineTab] =
    useState<TimelineCategory>("all");

  const filteredSkills = useMemo(() => {
    if (activeSkillTab === "all") {
      return skillsData;
    }
    return skillsData.filter((skill) => skill.category === activeSkillTab);
  }, [activeSkillTab]);

  const filteredTimeline = useMemo(() => {
    if (activeTimelineTab === "all") {
      return timelineData;
    }
    return timelineData.filter((item) => item.category === activeTimelineTab);
  }, [activeTimelineTab]);

  const getSkillCount = (category: SkillCategory) => {
    if (category === "all") {
      return skillsData.length;
    }
    return skillsData.filter((skill) => skill.category === category).length;
  };

  const getTimelineCount = (category: TimelineCategory) => {
    if (category === "all") {
      return timelineData.length;
    }
    return timelineData.filter((item) => item.category === category).length;
  };

  const renderCategoryIcon = (category: TimelineItem["category"]) => {
    if (category === "work") {
      return <Briefcase aria-hidden="true" className="h-3.5 w-3.5" />;
    }
    if (category === "leadership") {
      return <Users aria-hidden="true" className="h-3.5 w-3.5" />;
    }
    return <GraduationCap aria-hidden="true" className="h-3.5 w-3.5" />;
  };

  const cardSurface =
    theme === "dark"
      ? "border-zinc-800/80 bg-zinc-900/60"
      : "border-zinc-200/90 bg-white/85";

  return (
    <section
      id="experience-section"
      data-testid="experience-section"
      className="max-w-6xl mx-auto px-6 pb-32 space-y-20"
    >
      <div data-testid="skills-matrix-block" className="space-y-8">
        <div className="space-y-4">
          <div
            className={`inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
          >
            <Cpu aria-hidden="true" className="h-4 w-4" />
            <span>
              {lang === "id"
                ? "Kompetensi & Teknologi"
                : "Capabilities & Stack"}
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {lang === "id"
              ? "Matriks Keahlian Teknis & Manajerial"
              : "Technical & Leadership Capability Matrix"}
          </h2>

          <p className="max-w-3xl text-sm leading-relaxed opacity-80 sm:text-base">
            {lang === "id"
              ? "Pemetaan terstruktur atas penguasaan rekayasa perangkat lunak produksi, arsitektur backend, riset AI lokal, hingga kepemimpinan organisasi lintas kampus."
              : "Structured mapping across production software engineering, backend architecture, on-device AI R&D, and inter-university organizational leadership."}
          </p>
        </div>

        <div
          role="group"
          aria-label={
            lang === "id" ? "Filter kategori keahlian" : "Skill category filter"
          }
          className="flex flex-wrap items-center gap-2.5"
        >
          {skillCategories.map((cat) => {
            const isActive = activeSkillTab === cat.id;
            const count = getSkillCount(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                data-testid={`skill-tab-${cat.id}`}
                aria-pressed={isActive}
                onClick={() => setActiveSkillTab(cat.id)}
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <article
              key={skill.id}
              data-testid={`skill-card-${skill.id}`}
              className={`flex flex-col justify-between rounded-2xl border p-5 shadow-md backdrop-blur-md transition-all ${cardSurface}`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-wider opacity-70">
                    {skill.categoryLabel[lang]}
                  </span>

                  <span
                    className={`rounded-full border ${currentAccent.border} px-2.5 py-0.5 font-mono text-[11px] font-semibold ${currentAccent.text}`}
                  >
                    {skill.levelBadge[lang]}
                  </span>
                </div>

                <h3 className="text-lg font-bold tracking-tight">
                  {skill.name}
                </h3>

                <p className="text-sm leading-relaxed opacity-80">
                  {skill.description[lang]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div data-testid="timeline-block" className="space-y-8">
        <div className="space-y-4">
          <div
            className={`inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            <span>
              {lang === "id"
                ? "Rekam Jejak Profesional & Akademik"
                : "Career, Leadership & Academic Record"}
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {lang === "id"
              ? "Pengalaman Kerja, Kepemimpinan Organisasi & Pendidikan"
              : "Work Experience, Organizational Leadership & Education"}
          </h2>
        </div>

        <div
          role="group"
          aria-label={
            lang === "id"
              ? "Filter kategori lini masa"
              : "Timeline category filter"
          }
          className="flex flex-wrap items-center gap-2.5"
        >
          {timelineCategories.map((cat) => {
            const isActive = activeTimelineTab === cat.id;
            const count = getTimelineCount(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                data-testid={`timeline-tab-${cat.id}`}
                aria-pressed={isActive}
                onClick={() => setActiveTimelineTab(cat.id)}
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

        <div className="relative space-y-6 border-l-2 border-zinc-500/25 pl-6 sm:pl-8">
          {filteredTimeline.map((item) => (
            <article
              key={item.id}
              data-testid={`timeline-card-${item.id}`}
              className={`relative rounded-3xl border p-6 shadow-lg backdrop-blur-md transition-all ${cardSurface}`}
            >
              <span
                aria-hidden="true"
                className={`absolute -left-[33px] top-8 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 sm:-left-[41px] ${currentAccent.bg}`}
              />

              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border ${currentAccent.border} px-3 py-1 font-mono text-xs font-semibold ${currentAccent.text}`}
                >
                  {renderCategoryIcon(item.category)}
                  <span>{item.categoryLabel[lang]}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-500/25 px-3 py-1 font-mono text-xs opacity-85">
                  <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{item.period[lang]}</span>
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {item.roleOrDegree[lang]}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium opacity-80 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 ${currentAccent.text}`}
                    />
                    <span>{item.organization}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.location}</span>
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed opacity-85">
                {item.summary[lang]}
              </p>

              <ul role="list" className="mt-4 space-y-2">
                {item.highlights[lang].map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm leading-relaxed opacity-90"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className={`mt-1 h-4 w-4 shrink-0 ${currentAccent.text}`}
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <ul role="list" className="mt-5 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-lg border border-zinc-500/20 px-2.5 py-1 font-mono text-xs"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

