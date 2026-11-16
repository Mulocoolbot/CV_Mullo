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
import {
  buildGmailDirectComposeUrl,
  dispatchGmailInquiry,
} from "@/utils/gmailService";

export function ServicesAndContactSection() {
  const { lang, theme } = usePreferences();
  const tokens = themeTokens[theme];
  const [selectedServiceId, setSelectedServiceId] = useState(
    servicesData[0].id
  );
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [inquiryType, setInquiryType] = useState<"freelance" | "recruitment">(
    "freelance"
  );
  const [projectNotes, setProjectNotes] = useState("");
  const [emailStatus, setEmailStatus] = useState<{
    state: "idle" | "sending" | "sent" | "error";
    message: string;
  }>({ state: "idle", message: "" });

  const gridBorder =
    theme === "dark" ? "border-[#232329]" : "border-[#E5E3DC]";
  const studioFrame =
    theme === "dark"
      ? "border-[#232329] bg-[#0A0A0C]/90 backdrop-blur-sm"
      : "border-[#E5E3DC] bg-[#F7F6F2]/90 backdrop-blur-sm";

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

  const gmailDirectHref = buildGmailDirectComposeUrl({
    clientName,
    clientEmail,
    inquiryType,
    serviceTitle: selectedService.title[lang],
    projectNotes,
    lang,
  });

  const handleGmailApiSubmit = async () => {
    setEmailStatus({
      state: "sending",
      message:
        lang === "id"
          ? "Mengirim permintaan ke Gmail..."
          : "Sending inquiry to Gmail...",
    });

    const result = await dispatchGmailInquiry({
      clientName,
      clientEmail,
      inquiryType,
      serviceTitle: selectedService.title[lang],
      projectNotes,
      lang,
    });

    setEmailStatus({
      state: result.ok ? "sent" : "error",
      message: result.message,
    });

    if (result.mode === "gmail-compose") {
      window.open(gmailDirectHref, "_blank", "noopener,noreferrer");
    }
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const target = document.getElementById("contact-brief-form");
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const inputSurface =
    theme === "dark"
      ? "border-[#232329] bg-[#0D0F12] text-[#F4F3EF] placeholder:text-[#9CA3AF]/60"
      : "border-[#E5E3DC] bg-[#F7F6F2] text-[#121316] placeholder:text-[#5A5D64]/60";

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
      className="scroll-mt-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-12 pb-16 overflow-hidden"
    >
      <div className={`grid lg:grid-cols-12 border w-full ${studioFrame}`}>
        <div
          data-testid="services-catalog-block"
          className={`lg:col-span-7 min-w-0 max-w-full overflow-hidden p-4 sm:p-6 border-b lg:border-b-0 lg:border-r space-y-5 ${gridBorder}`}
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {lang === "id" ? "Layanan" : "Services"}
          </h2>

          <div className="space-y-4">
            {servicesData.map((service) => (
              <article
                key={service.id}
                data-testid={`service-card-${service.id}`}
                className={`p-4 sm:p-5 min-w-0 max-w-full overflow-hidden border space-y-3 transition-colors ${gridBorder}`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                    <h3 className="text-base font-bold tracking-tight sm:text-lg break-words min-w-0">
                      {service.title[lang]}
                    </h3>

                    <p
                      data-testid={`service-price-${service.id}`}
                      className={`font-mono text-xs font-bold sm:text-sm shrink-0 ${tokens.secondaryText}`}
                    >
                      {service.startingPrice[lang]}
                    </p>
                  </div>

                  <p className={`font-mono text-xs break-words ${tokens.textMuted}`}>
                    {service.estimatedDuration[lang]}
                  </p>
                </div>

                <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.deliverables[lang].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs leading-relaxed min-w-0"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tokens.secondaryText}`}
                      />
                      <span className="break-words min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className={`pt-3 border-t ${gridBorder}`}>
                  <button
                    type="button"
                    data-testid={`btn-select-service-${service.id}`}
                    onClick={() => handleSelectService(service.id)}
                    className="inline-flex items-center gap-2 bg-[#2563EB] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
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
          className="lg:col-span-5 min-w-0 max-w-full overflow-hidden p-4 sm:p-6 space-y-5"
        >
          <h3 className="text-xl font-bold tracking-tight">
            {lang === "id" ? "Hubungi Saya" : "Get in Touch"}
          </h3>

          <form className="space-y-3.5 min-w-0" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5 min-w-0">
              <span className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80">
                {lang === "id" ? "Kategori Pertanyaan" : "Inquiry Type"}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-testid="btn-inquiry-freelance"
                  aria-pressed={inquiryType === "freelance"}
                  onClick={() => setInquiryType("freelance")}
                  className={`border px-3 py-2 text-xs font-semibold transition-colors ${
                    inquiryType === "freelance"
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : `${gridBorder} ${tokens.textMuted} hover:border-[#2563EB]`
                  }`}
                >
                  {lang === "id" ? "Layanan Freelance" : "Freelance Service"}
                </button>
                <button
                  type="button"
                  data-testid="btn-inquiry-recruitment"
                  aria-pressed={inquiryType === "recruitment"}
                  onClick={() => setInquiryType("recruitment")}
                  className={`border px-3 py-2 text-xs font-semibold transition-colors ${
                    inquiryType === "recruitment"
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : `${gridBorder} ${tokens.textMuted} hover:border-[#2563EB]`
                  }`}
                >
                  {lang === "id" ? "HRD / Rekrutmen" : "HRD / Recruitment"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="client-name-input"
                className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80"
              >
                {lang === "id" ? "Nama / Perusahaan" : "Name / Company"}
              </label>
              <input
                id="client-name-input"
                type="text"
                data-testid="input-client-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={lang === "id" ? "Nama Anda" : "Your name"}
                className={`w-full max-w-full min-w-0 box-border border px-3.5 py-2 text-sm outline-none transition-colors focus:border-[#2563EB] ${inputSurface}`}
              />
            </div>

            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="client-email-input"
                className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80"
              >
                {lang === "id" ? "Email Anda" : "Your Email"}
              </label>
              <input
                id="client-email-input"
                type="email"
                data-testid="input-client-email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder={
                  lang === "id"
                    ? "email.anda@perusahaan.com"
                    : "your.email@company.com"
                }
                className={`w-full max-w-full min-w-0 box-border border px-3.5 py-2 text-sm outline-none transition-colors focus:border-[#2563EB] ${inputSurface}`}
              />
            </div>

            <div className="space-y-1.5 min-w-0">
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
                className={`w-full max-w-full min-w-0 box-border border px-3.5 py-2 text-sm outline-none transition-colors focus:border-[#2563EB] ${inputSurface}`}
              >
                {servicesData.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 min-w-0">
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
                className={`w-full max-w-full min-w-0 box-border border px-3.5 py-2 text-sm outline-none transition-colors focus:border-[#2563EB] ${inputSurface}`}
              />
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-1">
              <button
                type="button"
                data-testid="btn-send-gmail-api"
                disabled={emailStatus.state === "sending"}
                onClick={handleGmailApiSubmit}
                className="inline-flex w-full items-center justify-center gap-2 bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                <span>
                  {emailStatus.state === "sending"
                    ? lang === "id"
                      ? "Mengirim..."
                      : "Sending..."
                    : lang === "id"
                      ? "Kirim ke Gmail"
                      : "Send to Gmail"}
                </span>
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="btn-send-whatsapp"
                className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[#2563EB] ${gridBorder} ${tokens.secondaryText}`}
              >
                <Send aria-hidden="true" className="h-3.5 w-3.5" />
                <span>
                  {lang === "id" ? "Kirim via WhatsApp" : "Send via WhatsApp"}
                </span>
              </a>

              <a
                href={gmailDirectHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="btn-send-email"
                className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[#2563EB] ${gridBorder} ${tokens.secondaryText}`}
              >
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                <span>{lang === "id" ? "Buka Gmail" : "Open Gmail"}</span>
              </a>
            </div>

            {emailStatus.state !== "idle" && (
              <div
                data-testid="email-dispatch-status"
                role="status"
                className={`border px-3.5 py-2.5 text-xs font-medium break-words ${
                  emailStatus.state === "error"
                    ? "border-[#FF5A36] text-[#FF5A36]"
                    : "border-[#2563EB] text-[#2563EB]"
                }`}
              >
                {emailStatus.message}
              </div>
            )}
          </form>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 border-t pt-5 gap-2.5 w-full ${gridBorder}`}
          >
            {directContacts.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  data-testid={item.testId}
                  className={`group flex items-center justify-between gap-2 min-w-0 max-w-full overflow-hidden border p-3 transition-colors hover:border-[#2563EB] ${tokens.bgPrimary} ${gridBorder}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <IconComponent
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 ${tokens.secondaryText}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-mono text-[10px] font-semibold uppercase ${tokens.textMuted}`}
                      >
                        {item.label}
                      </p>
                      <p className="truncate break-all text-xs font-bold">
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
    </section>
  );
}
