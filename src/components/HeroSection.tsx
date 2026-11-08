"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, Cpu, MapPin, Sparkles, UserCheck, Users } from "lucide-react";
import { InteractiveCard3D } from "@/components/InteractiveCard3D";
import { profileData } from "@/data/profile";
import { accentPalette, usePreferences } from "@/hooks/usePreferences";

export function HeroSection() {
  const { lang, theme, accent } = usePreferences();
  const currentAccent = accentPalette[accent];
  const shouldReduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % profileData.roles.length);
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, []);

  const surfaceClass =
    theme === "dark"
      ? "border-zinc-800/80 bg-zinc-900/60"
      : "border-zinc-200/90 bg-white/80";

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-28 grid gap-6 lg:grid-cols-12">
      <div
        className={`lg:col-span-7 flex flex-col justify-between rounded-3xl border p-8 shadow-lg backdrop-blur-md ${surfaceClass}`}
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {profileData.available && (
              <div
                data-testid="status-badge"
                className={`inline-flex items-center gap-2.5 rounded-full border ${currentAccent.border} px-4 py-1.5 font-mono text-xs font-medium ${currentAccent.text}`}
              >
                <span
                  className={`h-2 w-2 animate-pulse rounded-full ${currentAccent.bg}`}
                />
                <span>{profileData.statusLabel[lang]}</span>
              </div>
            )}

            <span className="font-mono text-xs opacity-70">
              @{profileData.handle}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {profileData.name}
            </h1>

            <div className="flex items-center gap-2 pt-1">
              <Sparkles
                aria-hidden="true"
                className={`h-4 w-4 ${currentAccent.text}`}
              />
              <motion.span
                key={profileData.roles[roleIndex]}
                data-testid="active-role"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`font-mono text-sm font-semibold sm:text-base ${currentAccent.text}`}
              >
                {profileData.roles[roleIndex]}
              </motion.span>
            </div>
          </div>

          <p className="text-lg font-medium leading-relaxed opacity-90 sm:text-xl">
            {profileData.headline[lang]}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-500/15 text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <MapPin
              aria-hidden="true"
              className={`h-4 w-4 ${currentAccent.text}`}
            />
            <span>{profileData.location}</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {profileData.workTypes.map((workType) => (
              <span
                key={workType}
                className={`rounded-full border ${currentAccent.border} px-3 py-0.5 font-mono text-xs ${currentAccent.text}`}
              >
                {workType}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <InteractiveCard3D />
      </div>

      <div
        className={`lg:col-span-5 flex flex-col justify-between rounded-3xl border p-8 shadow-lg backdrop-blur-md ${surfaceClass}`}
      >
        <div className="space-y-4">
          <div
            className={`flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
          >
            <UserCheck aria-hidden="true" className="h-4 w-4" />
            <h2>{lang === "id" ? "Ringkasan Profil" : "Profile Summary"}</h2>
          </div>

          <div className="space-y-3.5 text-sm leading-relaxed opacity-85 sm:text-base">
            {profileData.bio[lang].map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 grid gap-6">
        <div
          className={`rounded-3xl border p-7 shadow-lg backdrop-blur-md ${surfaceClass}`}
        >
          <div
            className={`flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
          >
            <Cpu aria-hidden="true" className="h-4 w-4" />
            <h2>Core Tech Stack</h2>
          </div>

          <ul role="list" className="mt-4 flex flex-wrap gap-2.5">
            {profileData.coreStack.map((tech) => (
              <li
                key={tech}
                className="rounded-xl border border-zinc-500/20 px-3.5 py-2 font-mono text-xs font-semibold"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`grid gap-6 rounded-3xl border p-7 shadow-lg backdrop-blur-md sm:grid-cols-2 ${surfaceClass}`}
        >
          <div>
            <div
              className={`flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
            >
              <Compass aria-hidden="true" className="h-4 w-4" />
              <h2>
                {lang === "id" ? "Sedang Ditekuni" : "Currently Exploring"}
              </h2>
            </div>

            <ul role="list" className="mt-4 flex flex-wrap gap-2">
              {profileData.exploringStack.map((item) => (
                <li
                  key={item}
                  className={`rounded-xl border ${currentAccent.border} px-3 py-1.5 font-mono text-xs font-semibold ${currentAccent.text}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div
              className={`flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
            >
              <Users aria-hidden="true" className="h-4 w-4" />
              <h2>Soft Skills &amp; Organisasi</h2>
            </div>

            <ul role="list" className="mt-4 flex flex-wrap gap-2">
              {profileData.softSkills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-xl border border-zinc-500/20 px-3 py-1.5 text-xs font-medium"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

