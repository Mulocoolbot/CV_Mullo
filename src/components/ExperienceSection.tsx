"use client";

import { useMemo, useState } from "react";
import { Building2, Calendar, CheckCircle2 } from "lucide-react";
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
      className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-8 py-10"
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div
          data-testid="skills-matrix-block"
          className="lg:col-span-5 space-y-4"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {lang === "id" ? "Keahlian" : "Skills"}
            </h2>

            <div
              role="group"
              aria-label={
                lang === "id" ? "Filter kategori keahlian" : "Skill category filter"
              }
              className="flex flex-wrap gap-1.5"
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
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold transition-all ${
                      isActive
                        ? `${tokens.secondaryBg} border-transparent`
                        : `${tokens.border} ${tokens.bgSurface} ${tokens.textMuted} hover:border-[#2563EB]`
                    }`}
                  >
                    <span>{cat.label[lang]}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
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

          <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
            {filteredSkills.map((skill) => {
              const isAiCategory = skill.category === "ai-data";
              return (
                <article
                  key={skill.id}
                  data-testid={`skill-card-${skill.id}`}
                  className={`p-3 rounded-xl border space-y-1.5 shadow-sm backdrop-blur-md transition-all ${tokens.bgSurface} ${tokens.border}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold tracking-tight leading-snug">
                      {skill.name}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        isAiCategory
                          ? "border-[#FF5A36]/40 text-[#FF5A36]"
                          : `${tokens.border} ${tokens.secondaryText}`
                      }`}
                    >
                      {skill.levelBadge[lang]}
                    </span>
                  </div>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${tokens.textMuted}`}>
                    {skill.description[lang]}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div
          data-testid="timeline-block"
          className="lg:col-span-7 space-y-4"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {lang === "id" ? "Pengalaman & Pendidikan" : "Experience & Education"}
            </h2>

            <div
              role="group"
              aria-label={
                lang === "id"
                  ? "Filter kategori lini masa"
                  : "Timeline category filter"
              }
              className="flex flex-wrap gap-1.5"
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
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-all ${
                      isActive
                        ? `${tokens.secondaryBg} border-transparent`
                        : `${tokens.border} ${tokens.bgSurface} ${tokens.textMuted} hover:border-[#2563EB]`
                    }`}
                  >
                    <span>{cat.label[lang]}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
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

          <div className="grid gap-3.5 sm:grid-cols-2">
            {filteredTimeline.map((item, idx) => (
              <article
                key={item.id}
                data-testid={`timeline-card-${item.id}`}
                className={`p-4 rounded-xl border space-y-3 shadow-sm backdrop-blur-md transition-all ${tokens.bgSurface} ${tokens.border} ${
                  filteredTimeline.length === 5 && idx === 0
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="text-base font-bold tracking-tight">
                      {item.roleOrDegree[lang]}
                    </h3>

                    <p className={`inline-flex items-center gap-1.5 text-xs font-medium ${tokens.textMuted}`}>
                      <Building2
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 ${tokens.secondaryText}`}
                      />
                      <span>{item.organization}</span>
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${tokens.border} ${tokens.textMuted}`}
                  >
                    <Calendar aria-hidden="true" className="h-3 w-3" />
                    <span>{item.period[lang]}</span>
                  </span>
                </div>

                <ul role="list" className="space-y-1.5">
                  {item.highlights[lang].map((highlight, highlightIdx) => (
                    <li
                      key={highlightIdx}
                      className="flex items-start gap-2 text-xs leading-relaxed"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tokens.secondaryText}`}
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <ul role="list" className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${tokens.border}`}
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
