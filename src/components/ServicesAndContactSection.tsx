"use client";

import { useMemo, useState } from "react";
import {
  AtSign,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  buildWhatsAppApiUrl,
  contactConfig,
  servicesData,
} from "@/data/services";
import { themeTokens, usePreferences } from "@/hooks/usePreferences";

export function ServicesAndContactSection() {
  const { lang, theme } = usePreferences();
  const tokens = themeTokens[theme];
  const [selectedServiceId, setSelectedServiceId] = useState(
    servicesData[0].id
  );
  const [clientName, setClientName] = useState("");
  const [projectNotes, setProjectNotes] = useState("");

  const selectedService = useMemo(
    () =>
      servicesData.find((service) => service.id === selectedServiceId) ??
      servicesData[0],
    [selectedServiceId]
  );

  const whatsappHref = buildWhatsAppApiUrl({
    clientName:
      clientName || (lang === "id" ? "Calon Mitra" : "Prospective Client"),
    serviceTitle: selectedService.title[lang],
    projectNotes:
      projectNotes ||
      (lang === "id"
        ? "Saya ingin berdiskusi terkait kerja sama proyek."
        : "I would like to discuss a project collaboration."),
    lang,
  });

  const mailtoHref = `mailto:${contactConfig.email}?subject=${encodeURIComponent(
    selectedService.title[lang]
  )}&body=${encodeURIComponent(projectNotes || "")}`;

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const target = document.getElementById("contact-brief-form");
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const inputSurface =
    theme === "dark"
      ? "border-[#262932] bg-[#0D0F12] text-[#F4F3EF] placeholder:text-[#9CA3AF]/60"
      : "border-[#E2E0D8] bg-[#F7F6F2] text-[#121316] placeholder:text-[#5A5D64]/60";

  const directContacts = [
    {
      id: "whatsapp",
      testId: "contact-card-whatsapp",
      label: "WhatsApp",
      primaryValue: contactConfig.whatsappRaw,
      href: `https://wa.me/${contactConfig.whatsappApiNumber}`,
      isExternal: true,
      icon: MessageCircle,
    },
    {
      id: "email",
      testId: "contact-card-email",
      label: "Email",
      primaryValue: contactConfig.email,
      href: `mailto:${contactConfig.email}`,
      isExternal: false,
      icon: Mail,
    },
    {
      id: "instagram",
      testId: "contact-card-instagram",
      label: "Instagram",
      primaryValue: contactConfig.instagramHandle,
      href: contactConfig.instagramUrl,
      isExternal: true,
      icon: AtSign,
    },
    {
      id: "github",
      testId: "contact-card-github",
      label: "GitHub",
      primaryValue: contactConfig.githubHandle,
      href: contactConfig.githubUrl,
      isExternal: true,
      icon: FolderGit2,
    },
  ];

  return (
    <section
      id="services-contact-section"
      data-testid="services-contact-section"
      className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-16"
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div
          data-testid="services-catalog-block"
          className="lg:col-span-7 space-y-4"
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {lang === "id" ? "Layanan" : "Services"}
          </h2>

          <div className="space-y-3.5">
            {servicesData.map((service) => (
              <article
                key={service.id}
                data-testid={`service-card-${service.id}`}
                className={`p-4 sm:p-5 rounded-2xl border space-y-3 shadow-sm backdrop-blur-md transition-all ${tokens.bgSurface} ${tokens.border}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold tracking-tight sm:text-lg">
                    {service.title[lang]}
                  </h3>

                  <p
                    data-testid={`service-price-${service.id}`}
                    className={`font-mono text-xs font-bold sm:text-sm ${tokens.secondaryText}`}
                  >
                    {service.startingPrice[lang]}
                  </p>
                </div>

                <ul role="list" className="grid gap-1.5 sm:grid-cols-2">
                  {service.deliverables[lang].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs leading-relaxed"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tokens.secondaryText}`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className={`pt-2 border-t ${tokens.border}`}>
                  <button
                    type="button"
                    data-testid={`btn-select-service-${service.id}`}
                    onClick={() => handleSelectService(service.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-opacity hover:opacity-90 ${tokens.secondaryBg}`}
                  >
                    <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>
                      {lang === "id" ? "Pilih Layanan" : "Select Service"}
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          id="contact-brief-form"
          data-testid="contact-brief-block"
          className="lg:col-span-5"
        >
          <div
            className={`p-5 rounded-2xl border space-y-4 shadow-sm backdrop-blur-md ${tokens.bgSurface} ${tokens.border}`}
          >
            <h3 className="text-xl font-bold tracking-tight">
              {lang === "id" ? "Hubungi Saya" : "Get in Touch"}
            </h3>

            <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label
                  htmlFor="client-name-input"
                  className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80"
                >
                  {lang === "id" ? "Nama atau Instansi" : "Name or Company"}
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  data-testid="input-client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={lang === "id" ? "Nama Anda" : "Your name"}
                  className={`w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#2563EB]/40 ${inputSurface}`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="service-type-select"
                  className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80"
                >
                  {lang === "id" ? "Layanan" : "Service"}
                </label>
                <select
                  id="service-type-select"
                  data-testid="select-service-type"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className={`w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#2563EB]/40 ${inputSurface}`}
                >
                  {servicesData.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="project-notes-input"
                  className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80"
                >
                  {lang === "id" ? "Ringkasan Proyek" : "Project Notes"}
                </label>
                <textarea
                  id="project-notes-input"
                  rows={3}
                  data-testid="input-project-notes"
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder={
                    lang === "id"
                      ? "Tuliskan kebutuhan proyek atau tawaran posisi Part-Time."
                      : "Describe project scope or Part-Time role details."
                  }
                  className={`w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#2563EB]/40 ${inputSurface}`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="btn-send-whatsapp"
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-90 ${tokens.secondaryBg}`}
                >
                  <Send aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>
                    {lang === "id" ? "Kirim via WhatsApp" : "Send via WhatsApp"}
                  </span>
                </a>

                <a
                  href={mailtoHref}
                  data-testid="btn-send-email"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[#2563EB] ${tokens.border} ${tokens.secondaryText}`}
                >
                  <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{lang === "id" ? "Email" : "Email"}</span>
                </a>
              </div>
            </form>

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t ${tokens.border}`}>
              {directContacts.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    data-testid={item.testId}
                    className={`group flex items-center justify-between gap-2 rounded-xl border p-3 transition-colors hover:border-[#2563EB] ${tokens.bgPrimary} ${tokens.border}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 ${tokens.secondaryText}`}
                      />
                      <div className="min-w-0">
                        <p className={`font-mono text-[10px] font-semibold uppercase ${tokens.textMuted}`}>
                          {item.label}
                        </p>
                        <p className="truncate text-xs font-bold">
                          {item.primaryValue}
                        </p>
                      </div>
                    </div>

                    <ExternalLink
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100 ${tokens.secondaryText}`}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
