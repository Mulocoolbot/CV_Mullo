"use client";

import { useMemo, useState } from "react";
import {
  AtSign,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderGit2,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import {
  buildWhatsAppApiUrl,
  contactConfig,
  servicesData,
} from "@/data/services";
import { accentPalette, usePreferences } from "@/hooks/usePreferences";

export function ServicesAndContactSection() {
  const { lang, theme, accent } = usePreferences();
  const currentAccent = accentPalette[accent];
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
      clientName || (lang === "id" ? "Calon Mitra/Klien" : "Prospective Client"),
    serviceTitle: selectedService.title[lang],
    projectNotes:
      projectNotes ||
      (lang === "id"
        ? "Saya ingin berdiskusi terkait pembuatan proyek / kerja sama."
        : "I would like to discuss a project / collaboration."),
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

  const cardSurface =
    theme === "dark"
      ? "border-zinc-800/80 bg-zinc-900/60"
      : "border-zinc-200/90 bg-white/85";

  const inputSurface =
    theme === "dark"
      ? "border-zinc-700/80 bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-500"
      : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400";

  const directContacts = [
    {
      id: "whatsapp",
      testId: "contact-card-whatsapp",
      label: "WhatsApp Direct",
      primaryValue: `${contactConfig.whatsappRaw} (+62 822-8011-3212)`,
      hint: lang === "id" ? "Respon cepat & diskusi proyek" : "Fast reply & project chat",
      href: `https://wa.me/${contactConfig.whatsappApiNumber}`,
      isExternal: true,
      icon: MessageCircle,
    },
    {
      id: "email",
      testId: "contact-card-email",
      label: "Email",
      primaryValue: contactConfig.email,
      hint: lang === "id" ? "Proposal formal & rekrutmen" : "Formal briefs & recruitment",
      href: `mailto:${contactConfig.email}`,
      isExternal: false,
      icon: Mail,
    },
    {
      id: "instagram",
      testId: "contact-card-instagram",
      label: "Instagram",
      primaryValue: contactConfig.instagramHandle,
      hint: lang === "id" ? "Pembaruan aktivitas & visual" : "Updates & creative logs",
      href: contactConfig.instagramUrl,
      isExternal: true,
      icon: AtSign,
    },
    {
      id: "github",
      testId: "contact-card-github",
      label: "GitHub",
      primaryValue: contactConfig.githubHandle,
      hint: lang === "id" ? "Repositori kode & rilis terbuka" : "Code repositories & releases",
      href: contactConfig.githubUrl,
      isExternal: true,
      icon: FolderGit2,
    },
  ];

  return (
    <section
      id="services-contact-section"
      data-testid="services-contact-section"
      className="max-w-6xl mx-auto px-6 pb-36 space-y-20"
    >
      <div data-testid="services-catalog-block" className="space-y-8">
        <div className="space-y-4">
          <div
            className={`inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${currentAccent.text}`}
          >
            <Briefcase aria-hidden="true" className="h-4 w-4" />
            <span>
              {lang === "id"
                ? "Kolaborasi & Jasa Rekayasa"
                : "Services & Collaboration"}
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {lang === "id"
              ? "Katalog Layanan Freelance & Estimasi Investasi"
              : "Freelance Services & Investment Guide"}
          </h2>

          <p className="max-w-3xl text-sm leading-relaxed opacity-80 sm:text-base">
            {lang === "id"
              ? "Tarif transparan yang bersahabat bagi UMKM, instansi, maupun mitra riset — sepenuhnya fleksibel dan terbuka untuk negosiasi sesuai ruang lingkup serta kompleksitas proyek."
              : "Transparent, partner-friendly pricing tailored for SMEs, institutions, and research teams — fully flexible and open to negotiation based on your project complexity."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {servicesData.map((service) => (
            <article
              key={service.id}
              data-testid={`service-card-${service.id}`}
              className={`flex flex-col justify-between rounded-3xl border p-6 shadow-lg backdrop-blur-md transition-all ${cardSurface}`}
            >
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border ${currentAccent.border} px-3 py-1 font-mono text-xs font-semibold ${currentAccent.text}`}
                  >
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                    <span>{service.badge[lang]}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 font-mono text-xs opacity-75">
                    <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{service.estimatedDuration[lang]}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">
                    {service.title[lang]}
                  </h3>

                  <p
                    data-testid={`service-price-${service.id}`}
                    className={`font-mono text-base font-bold ${currentAccent.text}`}
                  >
                    {service.startingPrice[lang]}
                  </p>

                  <p className="text-xs leading-relaxed opacity-70">
                    {service.pricingNote[lang]}
                  </p>
                </div>

                <p className="text-sm leading-relaxed opacity-85">
                  {service.description[lang]}
                </p>

                <ul role="list" className="space-y-2 pt-1">
                  {service.deliverables[lang].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm leading-relaxed opacity-90"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className={`mt-1 h-4 w-4 shrink-0 ${currentAccent.text}`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <ul role="list" className="flex flex-wrap gap-1.5 pt-1">
                  {service.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-lg border border-zinc-500/20 px-2.5 py-1 font-mono text-xs"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-zinc-500/15 pt-4">
                <button
                  type="button"
                  data-testid={`btn-select-service-${service.id}`}
                  onClick={() => handleSelectService(service.id)}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl ${currentAccent.bg} px-4 py-2.5 text-xs font-bold text-zinc-950 transition-opacity hover:opacity-90`}
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  <span>
                    {lang === "id"
                      ? "Pilih Layanan & Diskusi via WA"
                      : "Select Service & Discuss on WA"}
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
        className="grid gap-8 lg:grid-cols-12"
      >
        <div
          className={`rounded-3xl border p-6 shadow-lg backdrop-blur-md sm:p-8 lg:col-span-7 ${cardSurface}`}
        >
          <div className="space-y-2 border-b border-zinc-500/15 pb-5">
            <h3 className="text-2xl font-bold tracking-tight">
              {lang === "id"
                ? "Mulai Diskusi Proyek & Kolaborasi"
                : "Start a Project Brief & Collaboration"}
            </h3>
            <p className="text-sm leading-relaxed opacity-75">
              {lang === "id"
                ? "Lengkapi ringkasan kebutuhan Anda untuk langsung menyusun pesan terstruktur ke WhatsApp API atau Email."
                : "Fill in your brief details to generate a structured message ready to send via WhatsApp API or Email."}
            </p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
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
                placeholder={
                  lang === "id"
                    ? "Contoh: Budi / PT Maju Digital"
                    : "e.g., Alex / Acme Studio"
                }
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 ${currentAccent.ring} ${inputSurface}`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="service-type-select"
                className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80"
              >
                {lang === "id"
                  ? "Jenis Layanan / Kolaborasi"
                  : "Service / Collaboration Type"}
              </label>
              <select
                id="service-type-select"
                data-testid="select-service-type"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 ${currentAccent.ring} ${inputSurface}`}
              >
                {servicesData.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="project-notes-input"
                className="block font-mono text-xs font-semibold uppercase tracking-wider opacity-80"
              >
                {lang === "id"
                  ? "Detail Kebutuhan Proyek / Pesan Rekrutmen"
                  : "Project Details / Recruitment Message"}
              </label>
              <textarea
                id="project-notes-input"
                rows={4}
                data-testid="input-project-notes"
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                placeholder={
                  lang === "id"
                    ? "Ceritakan fitur utama, target waktu, atau posisi Part-Time yang ditawarkan..."
                    : "Describe key features, target timeline, or the Part-Time role details..."
                }
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 ${currentAccent.ring} ${inputSurface}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="btn-send-whatsapp"
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl ${currentAccent.bg} px-5 py-3 text-xs font-bold text-zinc-950 transition-opacity hover:opacity-90 sm:text-sm`}
              >
                <Send aria-hidden="true" className="h-4 w-4" />
                <span>
                  {lang === "id"
                    ? "Kirim Pesan via WhatsApp API"
                    : "Send Message via WhatsApp API"}
                </span>
              </a>

              <a
                href={mailtoHref}
                data-testid="btn-send-email"
                className={`inline-flex items-center justify-center gap-2 rounded-xl border ${currentAccent.border} px-5 py-3 text-xs font-semibold ${currentAccent.text} transition-colors hover:bg-zinc-500/10 sm:text-sm`}
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                <span>{lang === "id" ? "Kirim via Email" : "Send via Email"}</span>
              </a>
            </div>
          </form>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:col-span-5">
          {directContacts.map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                data-testid={item.testId}
                className={`group flex items-center justify-between gap-4 rounded-2xl border p-5 shadow-md backdrop-blur-md transition-all hover:-translate-y-0.5 ${cardSurface}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${currentAccent.border} ${currentAccent.text}`}
                  >
                    <IconComponent aria-hidden="true" className="h-5 w-5" />
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider opacity-70">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold tracking-tight sm:text-base">
                      {item.primaryValue}
                    </p>
                    <p className="text-xs opacity-70">{item.hint}</p>
                  </div>
                </div>

                <ExternalLink
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100 ${currentAccent.text}`}
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
