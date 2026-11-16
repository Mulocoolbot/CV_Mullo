"use client";

import { useMemo, useState } from "react";
import { Building2, Calendar, CheckCircle2 } from "lucide-react";
import { RubiksCubeSculpture } from "@/components/WireframeSculptures3D";
import {
  skillCategories,
  skillsData,
  timelineCategories,
  timelineData,
} from "@/data/experience";
import { themeTokens, usePreferences } from "@/hooks/usePreferences";
import type { SkillCategory, TimelineCategory } from "@/types/cv";

export function ExperienceSection() {
  const { lang, theme } = usePreferences();
  const tokens = themeTokens[theme];
  const [activeSkillTab, setActiveSkillTab] = useState<SkillCategory>("all");
  const [activeTimelineTab, setActiveTimelineTab] =
    useState<TimelineCategory>("all");

  const gridBorder =
    theme === "dark" ? "border-[#232329]" : "border-[#E5E3DC]";
  const studioFrame =
    theme === "dark"
      ? "border-[#232329] bg-[#0A0A0C]/90 backdrop-blur-sm"
      : "border-[#E5E3DC] bg-[#F7F6F2]/90 backdrop-blur-sm";

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

  return (
    <section
      id="experience-section"
      data-testid="experience-section"
      className="scroll-mt-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-10 overflow-hidden"
    >
      <div className={`grid lg:grid-cols-12 border w-full ${studioFrame}`}>
        <div
          data-testid="skills-matrix-block"
          className={`lg:col-span-5 min-w-0 max-w-full overflow-hidden p-4 sm:p-6 border-b lg:border-b-0 lg:border-r space-y-5 ${gridBorder}`}
        >
          <div className="space-y-4 min-w-0">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {lang === "id" ? "Keahlian" : "Skills"}
            </h2>

            <div className={`h-28 md:h-44 border mb-5 overflow-hidden ${gridBorder}`}>
              <RubiksCubeSculpture className="w-full h-full" />
            </div>

            <div
              role="group"
              aria-label={
                lang === "id"
                  ? "Filter kategori keahlian"
                  : "Skill category filter"
              }
              className="flex flex-wrap gap-1.5 w-full max-w-full"
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
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : `${gridBorder} ${tokens.textMuted} hover:border-[#2563EB]`
                    }`}
                  >
                    <span>{cat.label[lang]}</span>
                    <span
                      className={`px-1.5 py-0.5 font-mono text-[10px] ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            {filteredSkills.map((skill) => {
              const isAiCategory = skill.category === "ai-data";
              return (
                <article
                  key={skill.id}
                  data-testid={`skill-card-${skill.id}`}
                  className={`flex flex-wrap items-center justify-between gap-2 p-3 min-w-0 max-w-full overflow-hidden border transition-colors ${gridBorder}`}
                >
                  <h3 className="text-sm font-bold tracking-tight leading-snug break-words min-w-0">
                    {skill.name}
                  </h3>

                  <span
                    className={`shrink-0 border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                      isAiCategory
                        ? "border-[#FF5A36]/50 text-[#FF5A36]"
                        : `${gridBorder} ${tokens.secondaryText}`
                    }`}
                  >
                    {skill.levelBadge[lang]}
                  </span>
                </article>
              );
            })}
          </div>
        </div>

        <div
          data-testid="timeline-block"
          className="lg:col-span-7 min-w-0 max-w-full overflow-hidden p-4 sm:p-6 space-y-5"
        >
          <div className="space-y-3 min-w-0">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {lang === "id"
                ? "Pengalaman & Pendidikan"
                : "Experience & Education"}
            </h2>

            <div
              role="group"
              aria-label={
                lang === "id"
                  ? "Filter kategori lini masa"
                  : "Timeline category filter"
              }
              className="flex flex-wrap gap-1.5 w-full max-w-full"
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
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : `${gridBorder} ${tokens.textMuted} hover:border-[#2563EB]`
                    }`}
                  >
                    <span>{cat.label[lang]}</span>
                    <span
                      className={`px-1.5 py-0.5 font-mono text-[10px] ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            {filteredTimeline.map((item, idx) => (
              <article
                key={item.id}
                data-testid={`timeline-card-${item.id}`}
                className={`min-w-0 max-w-full overflow-hidden p-4 border space-y-3 transition-colors ${gridBorder} ${
                  filteredTimeline.length === 5 && idx === 0
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 min-w-0">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="text-base font-bold tracking-tight break-words">
                      {item.roleOrDegree[lang]}
                    </h3>

                    <p
                      className={`inline-flex items-center gap-1.5 text-xs font-medium break-words min-w-0 ${tokens.textMuted}`}
                    >
                      <Building2
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 ${tokens.secondaryText}`}
                      />
                      <span className="break-words">{item.organization}</span>
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit shrink-0 items-center gap-1 border px-2.5 py-0.5 font-mono text-[11px] ${gridBorder} ${tokens.textMuted}`}
                  >
                    <Calendar aria-hidden="true" className="h-3 w-3 shrink-0" />
                    <span>{item.period[lang]}</span>
                  </span>
                </div>

                <ul role="list" className="space-y-1.5 min-w-0">
                  {item.highlights[lang].map((highlight, highlightIdx) => (
                    <li
                      key={highlightIdx}
                      className="flex items-start gap-2 text-xs leading-relaxed min-w-0"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tokens.secondaryText}`}
                      />
                      <span className="break-words min-w-0">{highlight}</span>
                    </li>
                  ))}
                </ul>

                <ul role="list" className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className={`border px-2 py-0.5 font-mono text-[11px] ${gridBorder}`}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
