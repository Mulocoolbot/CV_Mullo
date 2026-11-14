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
      id: "Mulai Rp 1.500.000",
      en: "Starts at Rp 1.5M (Flexible)",
    },
    estimatedDuration: {
      id: "Estimasi 1 - 4 Minggu",
      en: "Est. 1 - 4 Weeks",
    },
    pricingNote: {
      id: "Harga fleksibel menyesuaikan cakupan fitur dan terbuka untuk negosiasi UMKM, instansi, maupun riset.",
      en: "Flexible pricing tailored to feature scope and open to negotiation for SMEs, institutions, and research.",
    },
    description: {
      id: "Pembangunan website modern dan sistem informasi berbasis MVC dengan database relasional serta RESTful API siap produksi.",
      en: "End-to-end engineering of modern websites and MVC information systems with relational databases and RESTful APIs.",
    },
    deliverables: {
      id: [
        "Landing Page atau Sistem Informasi Full-Stack (Laravel, Next.js, TypeScript)",
        "Perancangan Skema Database Relasional (SQL) dan Integrasi RESTful API",
        "Desain UI Responsif untuk Desktop dan Mobile",
        "Source Code Bersih, Panduan Penggunaan, dan Bantuan Deployment",
      ],
      en: [
        "Landing Page or Full-Stack Information System (Laravel, Next.js, TypeScript)",
        "Relational Database Schema Design (SQL) and RESTful API Integration",
        "Responsive UI Design across Desktop and Mobile",
        "Clean Source Code, Documentation, and Deployment Assistance",
      ],
    },
    techStack: [
      "TypeScript",
      "React & Next.js",
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
      id: "Android Native & iOS Track",
      en: "Android Native & iOS Track",
    },
    startingPrice: {
      id: "Mulai Rp 2.500.000",
      en: "Starts at Rp 2.5M (Flexible)",
    },
    estimatedDuration: {
      id: "Estimasi 2 - 6 Minggu",
      en: "Est. 2 - 6 Weeks",
    },
    pricingNote: {
      id: "Biaya menyesuaikan jumlah layar, kebutuhan database luring atau API, serta target platform.",
      en: "Pricing scales with screen complexity, offline or API storage needs, and target platform.",
    },
    description: {
      id: "Pengembangan aplikasi Android native dengan Kotlin dan Jetpack Compose beserta dukungan eksplorasi aplikasi lintas platform maupun iOS.",
      en: "Native Android application development using Kotlin and Jetpack Compose alongside cross-platform and iOS mobile exploration.",
    },
    deliverables: {
      id: [
        "Aplikasi Android Native (Kotlin & Jetpack Compose) dan Dukungan Ekosistem iOS",
        "Arsitektur MVVM, Room Database Luring, atau Integrasi Backend API",
        "Antarmuka Material 3 modern dengan animasi responsif 60FPS",
        "File Rilis APK siap pasang dan dokumentasi kode sumber",
      ],
      en: [
        "Native Android App (Kotlin & Jetpack Compose) and iOS Ecosystem Support",
        "MVVM Architecture, Offline Room Database, or Backend API Integration",
        "Modern Material 3 interface with smooth 60FPS animations",
        "Installable Release APK and full source code documentation",
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
      en: "Custom Quote by Partner Budget",
    },
    estimatedDuration: {
      id: "Part-Time atau Per Sprint Agile",
      en: "Part-Time or Per Agile Sprint",
    },
    pricingNote: {
      id: "Tersedia untuk peran Part-Time tim produk, kolaborasi riset AI atau Data Python, dan sprint fitur khusus.",
      en: "Available for product team Part-Time roles, Python AI or Data R&D collaboration, and custom feature sprints.",
    },
    description: {
      id: "Terbuka untuk kolaborasi Part-Time maupun pembuatan prototipe khusus di bidang Web 3D, verifikasi data, dan AI berbasis Python.",
      en: "Open for Part-Time engineering roles or custom prototyping across 3D Web, data verification systems, and Python AI.",
    },
    deliverables: {
      id: [
        "Pengembangan fitur berbasis Sprint Agile dan pengujian Black Box",
        "Prototipe Data Engineering atau On-Device AI menggunakan Python",
        "Kolaborasi tim dan pemangku kepentingan yang terstruktur",
      ],
      en: [
        "Agile Sprint feature delivery and Black Box Testing verification",
        "Data Engineering or On-Device AI prototyping in Python",
        "Structured team and stakeholder collaboration",
      ],
    },
    techStack: [
      "Full Stack",
      "Agile Sprint",
      "Python",
      "Three.js & 3D Web",
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
