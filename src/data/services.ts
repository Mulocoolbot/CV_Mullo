import type { ContactConfig, Language, ServicePackage } from "@/types/cv";

export const contactConfig: ContactConfig = {
  email: "ahmadmuliasaputra1@gmail.com",
  whatsappRaw: "082280113212",
  whatsappApiNumber: "6282280113212",
  instagramUrl: "https://www.instagram.com/mullo._s/",
  instagramHandle: "@mullo._s",
  githubUrl: "https://github.com/Mulocoolbot",
  githubHandle: "@Mulocoolbot",
};

export const servicesData: ServicePackage[] = [
  {
    id: "web-and-information-systems",
    title: {
      id: "Pengembangan Web & Sistem Informasi",
      en: "Web & Information Systems Development",
    },
    badge: {
      id: "Layanan Utama",
      en: "Core Service",
    },
    startingPrice: {
      id: "Mulai Rp 1.500.000 – Rp 3.000.000+",
      en: "Starts at Rp 1.5M – Rp 3M+ (Flexible)",
    },
    estimatedDuration: {
      id: "Estimasi 1 – 4 Minggu",
      en: "Est. 1 – 4 Weeks",
    },
    pricingNote: {
      id: "Harga fleksibel menyesuaikan jumlah fitur & skala sistem (Terbuka untuk negosiasi UMKM, Instansi & Riset)",
      en: "Flexible pricing tailored to feature complexity & system scale (Open to negotiation for SMEs, Institutions & Research)",
    },
    description: {
      id: "Perancangan dan pembangunan website modern, sistem informasi manajemen berbasis arsitektur MVC, hingga integrasi database dan RESTful API dari nol sampai siap pakai.",
      en: "End-to-end engineering of modern websites, MVC-based management information systems, relational databases, and RESTful APIs.",
    },
    deliverables: {
      id: [
        "Landing Page Interaktif (2D/3D) atau Sistem Informasi Full-Stack (Laravel / Next.js / TypeScript)",
        "Perancangan Skema Database Relasional (SQL) & Integrasi RESTful API",
        "Desain UI/UX Responsif untuk Desktop & Mobile",
        "Source Code Bersih, Panduan Penggunaan & Bantuan Deployment",
      ],
      en: [
        "Interactive Landing Page (2D/3D) or Full-Stack Information System (Laravel / Next.js / TypeScript)",
        "Relational Database Schema Design (SQL) & RESTful API Integration",
        "Responsive UI/UX Design across Desktop & Mobile",
        "Clean Source Code, Documentation & Deployment Assistance",
      ],
    },
    techStack: [
      "TypeScript",
      "React / Next.js",
      "Laravel",
      "PHP",
      "SQL Database",
      "RESTful API",
      "Tailwind CSS",
    ],
  },
  {
    id: "mobile-app-development",
    title: {
      id: "Mobile App Development (Android & Eksplorasi iOS)",
      en: "Mobile App Development (Android & iOS Exploration)",
    },
    badge: {
      id: "Android Native & iOS Learning Track",
      en: "Android Native & iOS Learning Track",
    },
    startingPrice: {
      id: "Mulai Rp 2.500.000 – Rp 4.000.000+",
      en: "Starts at Rp 2.5M – Rp 4M+ (Flexible)",
    },
    estimatedDuration: {
      id: "Estimasi 2 – 6 Minggu",
      en: "Est. 2 – 6 Weeks",
    },
    pricingNote: {
      id: "Biaya menyesuaikan kompleksitas layar, database lokal/API, dan target platform",
      en: "Cost scales with screen count, offline/API persistence, and target platform",
    },
    description: {
      id: "Pengembangan aplikasi mobile Android native berperforma tinggi menggunakan Kotlin & Jetpack Compose, serta dukungan pengembangan aplikasi mobile lintas platform / iOS (sedang dalam pendalaman aktif).",
      en: "High-performance native Android application development using Kotlin & Jetpack Compose, alongside cross-platform / iOS mobile development (currently in active exploration).",
    },
    deliverables: {
      id: [
        "Aplikasi Android Native (Kotlin & Jetpack Compose) & Dukungan Pengembangan Ekosistem iOS",
        "Arsitektur MVVM, Room Database Lokal (Offline-First) atau Integrasi Backend API",
        "Perancangan Antarmuka Material 3 / Bento UI & Animasi Interaktif 60FPS",
        "File Rilis APK Siap Pasang & Dokumentasi Source Code",
      ],
      en: [
        "Native Android App (Kotlin & Jetpack Compose) & iOS Ecosystem Development Support",
        "MVVM Architecture, Offline-First Room Database or Backend API Integration",
        "Material 3 / Bento UI Design & 60FPS Interactive Animations",
        "Installable Release APK & Full Source Code Documentation",
      ],
    },
    techStack: [
      "Kotlin",
      "Jetpack Compose",
      "Android SDK",
      "iOS Exploration",
      "Room Database",
      "Material 3",
    ],
  },
  {
    id: "custom-consultation-and-part-time",
    title: {
      id: "Kolaborasi Part-Time, R&D AI & Konsultasi Kustom",
      en: "Part-Time Collaboration, AI R&D & Custom Consultation",
    },
    badge: {
      id: "Part-Time & Custom Scope",
      en: "Part-Time & Custom Scope",
    },
    startingPrice: {
      id: "Diskusi Sesuai Anggaran Mitra",
      en: "Custom Quote / Partner Budget",
    },
    estimatedDuration: {
      id: "Kontrak Part-Time / Per Sprint Agile",
      en: "Part-Time Contract / Per Agile Sprint",
    },
    pricingNote: {
      id: "Tersedia untuk rekrutmen Part-Time perusahaan, kolaborasi riset AI/Data (Python), atau pengembangan fitur spesifik",
      en: "Available for company Part-Time roles, Python AI/Data R&D collaboration, or custom feature sprints",
    },
    description: {
      id: "Terbuka untuk bergabung sebagai pengembang Part-Time di perusahaan Anda maupun membangun prototipe khusus di bidang Web 3D, sistem verifikasi data, dan eksperimen AI berbasis Python.",
      en: "Open to joining engineering teams as a Part-Time developer or building specialized prototypes in 3D Web, data verification systems, and Python-based AI experiments.",
    },
    deliverables: {
      id: [
        "Pengembangan Fitur Berbasis Sprint Agile & Pengujian Black Box Testing",
        "Eksplorasi Prototipe Data Engineering / On-Device AI dengan Python",
        "Komunikasi Tim & Klien yang Terstruktur Berkat Pengalaman Kepemimpinan Organisasi",
      ],
      en: [
        "Agile Sprint Feature Engineering & Black Box Testing Verification",
        "Data Engineering / On-Device AI Prototyping with Python",
        "Structured Team & Stakeholder Communication Backed by Leadership Experience",
      ],
    },
    techStack: [
      "Full Stack",
      "Agile Sprint",
      "Python",
      "Three.js / 3D Web",
      "Black Box Testing",
    ],
  },
];

export function buildWhatsAppApiUrl({
  clientName,
  serviceTitle,
  projectNotes,
  lang,
}: {
  clientName: string;
  serviceTitle: string;
  projectNotes: string;
  lang: Language;
}): string {
  const safeName = clientName.trim() || (lang === "id" ? "Calon Mitra" : "Partner");
  const safeService =
    serviceTitle.trim() ||
    (lang === "id" ? "Konsultasi Umum" : "General Inquiry");
  const safeNotes =
    projectNotes.trim() ||
    (lang === "id"
      ? "Ingin berdiskusi mengenai ruang lingkup proyek dan jadwal."
      : "Would like to discuss project scope and timeline.");

  const message =
    lang === "id"
      ? `Halo Ahmad Mulia Saputra,\n\nPerkenalkan saya ${safeName}.\nSaya tertarik dengan layanan: ${safeService}.\n\nKebutuhan proyek:\n${safeNotes}\n\nTerima kasih.`
      : `Hello Ahmad Mulia Saputra,\n\nMy name is ${safeName}.\nI am interested in: ${safeService}.\n\nProject details:\n${safeNotes}\n\nThank you.`;

  return `https://wa.me/${contactConfig.whatsappApiNumber}?text=${encodeURIComponent(
    message
  )}`;
}
