"use client";

import { useMemo, useState } from "react";
import {
  AtSign,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderGit2,
  Layers,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import {
  buildDirectWhatsAppUrl,
  buildWhatsAppApiUrl,
  contactConfig,
  customBanner,
  primaryPackages,
  scopeNotes,
} from "@/data/services";
import { themeTokens, usePreferences } from "@/hooks/usePreferences";
import {
  buildGmailDirectComposeUrl,
  dispatchGmailInquiry,
} from "@/utils/gmailService";

export function ServicesAndContactSection() {
  const { lang, theme } = usePreferences();
  const tokens = themeTokens[theme];

  const availableServices = useMemo(
    () => [
      ...primaryPackages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        price: pkg.price,
      })),
      {
        id: customBanner.id,
        title: customBanner.title,
        price: customBanner.price,
      },
    ],
    []
  );

  const [selectedServiceId, setSelectedServiceId] = useState(
    primaryPackages[0].id
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
      availableServices.find((service) => service.id === selectedServiceId) ??
      availableServices[0],
    [availableServices, selectedServiceId]
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
    setInquiryType("freelance");
    const target =
      document.getElementById("contact") ??
      document.getElementById("contact-brief-form");
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
      className="scroll-mt-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-12 pb-16 overflow-x-hidden"
    >
      <div
        data-testid="services-catalog-block"
        className={`w-full min-w-0 max-w-full overflow-hidden border p-4 sm:p-6 lg:p-8 ${studioFrame}`}
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 min-w-0">
          <div className="space-y-1.5 min-w-0">
            <p
              className={`font-mono text-xs font-semibold uppercase tracking-wider ${tokens.secondaryText}`}
            >
              {lang === "id"
                ? "Paket Layanan Freelance"
                : "Freelance Service Packages"}
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl break-words">
              {lang === "id"
                ? "Layanan & Estimasi Investasi"
                : "Services & Pricing Guide"}
            </h2>
          </div>

          <p className={`text-xs sm:text-sm max-w-md break-words ${tokens.textMuted}`}>
            {lang === "id"
              ? "Pilih paket yang sesuai kebutuhan atau mulai konsultasi gratis sebelum pengembangan dimulai."
              : "Pick a package tailored to your scope or start with a free consultation before development begins."}
          </p>
        </div>

        <div
          data-testid="primary-packages-grid"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full min-w-0"
        >
          {primaryPackages.map((pkg) => {
            const isFeatured = pkg.featured;

            return (
              <article
                key={pkg.id}
                data-testid={`service-card-${pkg.id}`}
                data-featured={isFeatured ? "true" : "false"}
                className={`flex flex-col justify-between min-w-0 max-w-full overflow-hidden p-5 sm:p-6 transition-all ${
                  isFeatured
                    ? `border-2 border-[#2563EB] shadow-lg shadow-[#2563EB]/10 ${
                        theme === "dark" ? "bg-[#121622]/90" : "bg-white/95"
                      }`
                    : `border ${gridBorder} ${
                        theme === "dark" ? "bg-[#0D0F12]/80" : "bg-white/80"
                      }`
                }`}
              >
                <div className="space-y-4 min-w-0">
                  {pkg.badge && (
                    <span
                      data-testid={`service-badge-${pkg.id}`}
                      className="inline-flex items-center gap-1.5 bg-[#2563EB] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white"
                    >
                      <Sparkles aria-hidden="true" className="h-3 w-3 shrink-0" />
                      <span>{pkg.badge[lang]}</span>
                    </span>
                  )}

                  <p
                    data-testid={`service-audience-${pkg.id}`}
                    className={`font-mono text-[11px] font-semibold uppercase tracking-wider leading-relaxed min-w-0 break-words ${tokens.textMuted}`}
                  >
                    {pkg.audience[lang]}
                  </p>

                  <div className="space-y-2 min-w-0">
                    <h3
                      data-testid={`service-title-${pkg.id}`}
                      className="text-lg font-bold tracking-tight sm:text-xl break-words min-w-0"
                    >
                      {pkg.title[lang]}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <p
                        data-testid={`service-price-${pkg.id}`}
                        className={`font-mono text-xl font-extrabold tracking-tight break-words min-w-0 ${tokens.secondaryText}`}
                      >
                        {pkg.price[lang]}
                      </p>

                      <span
                        data-testid={`service-duration-${pkg.id}`}
                        className={`inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[11px] font-medium break-words max-w-full ${gridBorder} ${tokens.textMuted}`}
                      >
                        <Clock aria-hidden="true" className="h-3 w-3 shrink-0" />
                        <span>{pkg.duration[lang]}</span>
                      </span>
                    </div>
                  </div>

                  <ul role="list" className="space-y-2.5 pt-1 min-w-0">
                    {pkg.benefits[lang].map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed min-w-0"
                      >
                        <CheckCircle2
                          aria-hidden="true"
                          className={`mt-0.5 h-4 w-4 shrink-0 ${tokens.secondaryText}`}
                        />
                        <span className="break-words min-w-0">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 space-y-4 min-w-0">
                  <div
                    data-testid={`service-ref-${pkg.id}`}
                    className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[11px] min-w-0 max-w-full ${gridBorder} ${tokens.textMuted}`}
                  >
                    <Layers
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 shrink-0 ${tokens.secondaryText}`}
                    />
                    <span className="break-words min-w-0">
                      Ref:{" "}
                      <strong className={`font-semibold ${tokens.textPrimary}`}>
                        {pkg.referenceProject}
                      </strong>
                    </span>
                  </div>

                  <ul
                    role="list"
                    data-testid={`service-tech-${pkg.id}`}
                    className="flex flex-wrap gap-1.5 min-w-0"
                  >
                    {pkg.techTags.map((tag) => (
                      <li
                        key={tag}
                        className={`border px-2 py-0.5 font-mono text-[11px] font-medium break-words ${gridBorder} ${tokens.textMuted}`}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`pt-4 border-t flex flex-col gap-2 min-w-0 ${gridBorder}`}
                  >
                    <a
                      href={buildDirectWhatsAppUrl(pkg.whatsappMessage[lang])}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`btn-whatsapp-service-${pkg.id}`}
                      className="inline-flex w-full items-center justify-center gap-2 bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 text-center break-words"
                    >
                      <MessageCircle
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0"
                      />
                      <span>
                        {lang === "id"
                          ? "Konsultasi via WhatsApp"
                          : "Consult via WhatsApp"}
                      </span>
                    </a>

                    <button
                      type="button"
                      data-testid={`btn-select-service-${pkg.id}`}
                      onClick={() => handleSelectService(pkg.id)}
                      className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-2 text-xs font-semibold transition-colors hover:border-[#2563EB] text-center break-words ${gridBorder} ${tokens.secondaryText}`}
                    >
                      <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {lang === "id"
                          ? "Kirim Brief via Email"
                          : "Send Brief via Email"}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div
          data-testid="custom-consultation-banner"
          className={`w-full mt-6 p-5 sm:p-6 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-w-0 max-w-full overflow-hidden ${
            theme === "dark"
              ? "border-white/15 bg-zinc-900/70"
              : "border-black/15 bg-white/80"
          }`}
        >
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5 min-w-0">
              <h3
                data-testid="custom-banner-title"
                className="text-base sm:text-lg font-bold tracking-tight break-words min-w-0"
              >
                {customBanner.title[lang]}
              </h3>
              <span
                data-testid="custom-banner-price"
                className={`inline-flex items-center border border-[#2563EB]/40 bg-[#2563EB]/10 px-2.5 py-0.5 font-mono text-xs font-bold break-words max-w-full ${tokens.secondaryText}`}
              >
                {customBanner.price[lang]}
              </span>
            </div>

            <p
              data-testid="custom-banner-description"
              className={`text-xs sm:text-sm leading-relaxed break-words min-w-0 ${tokens.textMuted}`}
            >
              {customBanner.description[lang]}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <a
              href={buildDirectWhatsAppUrl(customBanner.whatsappMessage[lang])}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="btn-whatsapp-custom-banner"
              className="inline-flex items-center justify-center gap-2 bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 text-center"
            >
              <MessageCircle
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0"
              />
              <span>
                {lang === "id" ? "Diskusi via WhatsApp" : "Discuss on WhatsApp"}
              </span>
            </a>

            <button
              type="button"
              data-testid="btn-email-custom-banner"
              onClick={() => handleSelectService(customBanner.id)}
              className={`inline-flex items-center justify-center gap-2 border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[#2563EB] text-center ${gridBorder} ${tokens.secondaryText}`}
            >
              <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span>
                {lang === "id" ? "Konsultasi via Email" : "Consult via Email"}
              </span>
            </button>
          </div>
        </div>

        <p
          data-testid="services-scope-footnote"
          className={`mt-3 text-xs leading-relaxed break-words min-w-0 ${tokens.textMuted}`}
        >
          {scopeNotes[lang]}
        </p>
      </div>

      <div
        id="contact"
        data-testid="contact-brief-block"
        className={`mt-8 scroll-mt-24 grid lg:grid-cols-12 border w-full min-w-0 max-w-full overflow-hidden ${studioFrame}`}
      >
        <div
          className={`lg:col-span-7 min-w-0 max-w-full overflow-hidden p-4 sm:p-6 border-b lg:border-b-0 lg:border-r space-y-5 ${gridBorder}`}
        >
          <div className="space-y-1 min-w-0">
            <h3 className="text-xl font-bold tracking-tight break-words">
              {lang === "id" ? "Hubungi Saya" : "Get in Touch"}
            </h3>
            <p className={`text-xs break-words ${tokens.textMuted}`}>
              {lang === "id"
                ? "Kirim detail kebutuhan proyek atau undangan kolaborasi langsung ke Gmail atau WhatsApp."
                : "Send your project brief or collaboration inquiry directly via Gmail or WhatsApp."}
            </p>
          </div>

          <form
            id="contact-brief-form"
            className="space-y-3.5 min-w-0"
            onSubmit={(e) => e.preventDefault()}
          >
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

            <div className="grid sm:grid-cols-2 gap-3.5 min-w-0">
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
            </div>

            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor="service-type-select"
                className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80"
              >
                {lang === "id" ? "Layanan / Paket" : "Service / Package"}
              </label>
              <select
                id="service-type-select"
                data-testid="select-service-type"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className={`w-full max-w-full min-w-0 box-border border px-3.5 py-2 text-sm outline-none transition-colors focus:border-[#2563EB] ${inputSurface}`}
              >
                {availableServices.map((service) => (
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

            <div className="grid sm:grid-cols-3 gap-2.5 w-full pt-1">
              <button
                type="button"
                data-testid="btn-send-gmail-api"
                disabled={emailStatus.state === "sending"}
                onClick={handleGmailApiSubmit}
                className="inline-flex w-full items-center justify-center gap-2 bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
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
                <Send aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
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
                <ExternalLink
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0"
                />
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
        </div>

        <div className="lg:col-span-5 min-w-0 max-w-full overflow-hidden p-4 sm:p-6 flex flex-col justify-between gap-5">
          <div className={`border p-4 space-y-2 min-w-0 ${gridBorder} ${tokens.bgPrimary}`}>
            <span
              className={`block font-mono text-[10px] font-semibold uppercase tracking-wider ${tokens.textMuted}`}
            >
              {lang === "id" ? "Paket Dipilih" : "Selected Package"}
            </span>
            <p className="text-sm font-bold tracking-tight break-words">
              {selectedService.title[lang]}
            </p>
            <p
              className={`font-mono text-xs font-semibold break-words ${tokens.secondaryText}`}
            >
              {selectedService.price[lang]}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5 w-full min-w-0">
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
