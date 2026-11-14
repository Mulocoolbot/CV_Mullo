"use client";

import { Printer, X } from "lucide-react";
import { timelineData } from "@/data/experience";
import { profileData } from "@/data/profile";
import { projectsData } from "@/data/projects";
import { contactConfig } from "@/data/services";
import { accentPalette, usePreferences } from "@/hooks/usePreferences";

interface AtsResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AtsResumeModal({ isOpen, onClose }: AtsResumeModalProps) {
  const { lang, theme, accent } = usePreferences();
  const currentAccent = accentPalette[accent];

  if (!isOpen) {
    return null;
  }

  const handlePrintCv = () => {
    if (typeof window !== "undefined" && typeof window.print === "function") {
      window.print();
    }
  };

  const experienceItems = timelineData.filter(
    (item) => item.category !== "education"
  );

  return (
    <div
      data-testid="ats-resume-modal"
      role="dialog"
      aria-modal="true"
      aria-label={
        lang === "id" ? "Pratinjau CV ATS-Friendly" : "ATS-Friendly CV Preview"
      }
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-6 print:static print:overflow-visible print:bg-white print:p-0"
    >
      <div
        className={`w-full max-w-4xl space-y-4 rounded-3xl border p-4 shadow-2xl sm:p-6 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none ${
          theme === "dark"
            ? "border-zinc-800 bg-zinc-900 text-zinc-100"
            : "border-zinc-200 bg-zinc-100 text-zinc-900"
        }`}
      >
        <div
          data-testid="cv-pending-banner"
          role="status"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border ${currentAccent.border} px-4 py-3 text-xs leading-relaxed sm:text-sm print:hidden`}
        >
          <p className="max-w-xl font-medium">
            {lang === "id"
              ? "Dokumen CV PDF (ATS) siap dicetak atau disimpan sebagai PDF melalui tombol Cetak di samping."
              : "The ATS-Friendly CV is ready to print or save as PDF using the Print button."}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="btn-print-ats-cv"
              onClick={handlePrintCv}
              className={`inline-flex items-center gap-2 rounded-xl ${currentAccent.bg} px-4 py-2 text-xs font-bold text-zinc-950 transition-opacity hover:opacity-90`}
            >
              <Printer aria-hidden="true" className="h-4 w-4" />
              <span>
                {lang === "id" ? "Cetak / Simpan PDF" : "Print / Save as PDF"}
              </span>
            </button>

            <button
              type="button"
              data-testid="btn-close-ats-cv"
              aria-label={lang === "id" ? "Tutup pratinjau CV" : "Close CV preview"}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-500/30 px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-zinc-500/10"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              <span>{lang === "id" ? "Tutup" : "Close"}</span>
            </button>
          </div>
        </div>

        <article
          data-testid="ats-resume-sheet"
          className="space-y-6 rounded-2xl border border-zinc-300 bg-white p-6 text-zinc-900 shadow-sm sm:p-10 print:rounded-none print:border-0 print:p-6 print:shadow-none"
        >
          <header className="space-y-2 border-b-2 border-zinc-900 pb-4">
            <h1 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              {profileData.name}
            </h1>
            <p className="text-sm font-semibold text-zinc-700">
              {profileData.roles.join(" · ")}
            </p>
            <p className="text-xs leading-relaxed text-zinc-700">
              {`Bandar Lampung, Indonesia | ${contactConfig.whatsappRaw} | ${contactConfig.email} | github.com/Mulocoolbot | instagram.com/mullo._s`}
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="border-b border-zinc-300 pb-1 text-xs font-bold uppercase tracking-wider text-zinc-900">
              {lang === "id" ? "Ringkasan Profesional" : "Professional Summary"}
            </h2>
            <div className="space-y-1.5 text-xs leading-relaxed text-zinc-800">
              {profileData.bio[lang].map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="border-b border-zinc-300 pb-1 text-xs font-bold uppercase tracking-wider text-zinc-900">
              {lang === "id" ? "Pendidikan" : "Education"}
            </h2>
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <p className="font-bold text-zinc-900">
                Institut Teknologi Sumatera (ITERA)
              </p>
              <p className="font-medium text-zinc-600">
                Bandar Lampung, Indonesia
              </p>
            </div>
            <p className="text-xs font-semibold text-zinc-800">
              S1 Teknik Informatika (2023 – Present, Fokus RPL &amp; Sistem
              Informasi)
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="border-b border-zinc-300 pb-1 text-xs font-bold uppercase tracking-wider text-zinc-900">
              {lang === "id"
                ? "Pengalaman Kerja & Kepemimpinan Organisasi"
                : "Work & Organizational Experience"}
            </h2>
            <div className="space-y-3">
              {experienceItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                    <p className="font-bold text-zinc-900">
                      {`${item.roleOrDegree[lang]} — ${item.organization}`}
                    </p>
                    <p className="font-medium text-zinc-600">
                      {item.period[lang]}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-700">
                    {item.summary[lang]}
                  </p>
                  <ul className="list-disc space-y-0.5 pl-4 text-xs leading-relaxed text-zinc-800">
                    {item.highlights[lang].map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="border-b border-zinc-300 pb-1 text-xs font-bold uppercase tracking-wider text-zinc-900">
              {lang === "id"
                ? "Proyek Rekayasa Pilihan"
                : "Selected Engineering Projects"}
            </h2>
            <div className="space-y-2.5">
              {projectsData.map((project) => (
                <div key={project.id} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                    <p className="font-bold text-zinc-900">{project.title}</p>
                    <p className="font-mono text-[11px] text-zinc-600">
                      {project.techStack.join(", ")}
                    </p>
                  </div>
                  <p className="text-[11px] font-semibold text-zinc-700">
                    {project.role[lang]}
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-800">
                    {project.shortSummary[lang]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="border-b border-zinc-300 pb-1 text-xs font-bold uppercase tracking-wider text-zinc-900">
              {lang === "id"
                ? "Keahlian Teknis & Soft Skills"
                : "Technical & Soft Skills"}
            </h2>
            <div className="space-y-1 text-xs leading-relaxed text-zinc-800">
              <p>
                <span className="font-bold text-zinc-900">Core Stack: </span>
                {profileData.coreStack.join(", ")}
              </p>
              <p>
                <span className="font-bold text-zinc-900">
                  Exploring &amp; R&amp;D:{" "}
                </span>
                {profileData.exploringStack.join(", ")}
              </p>
              <p>
                <span className="font-bold text-zinc-900">Soft Skills: </span>
                {profileData.softSkills.join(", ")}
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
