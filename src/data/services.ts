import type {
  ContactConfig,
  CustomConsultationBanner,
  FreelanceServicesCatalog,
  Language,
  LocalizedText,
  PrimaryServicePackage,
} from "@/types/cv";

export const contactConfig: ContactConfig = {
  email: "ahmadmuliasaputra1@gmail.com",
  whatsappRaw: "082280113212",
  whatsappApiNumber: "6282280113212",
  instagramUrl: "https://www.instagram.com/mullo._s/",
  instagramHandle: "@mullo._s",
  githubUrl: "https://github.com/Mulocoolbot",
  githubHandle: "@Mulocoolbot",
};

export const scopeNotes: LocalizedText = {
  id: "Termasuk maksimal 2x revisi mayor. Biaya domain, hosting server, dan akun Google Play Store ditanggung klien sesuai kebutuhan.",
  en: "Includes up to 2 major revisions. Domain, server hosting, and Google Play Store developer fees are covered by the client as needed.",
};

export const transparentScopeNotes: LocalizedText = scopeNotes;

interface PrimaryPackageInput {
  id: PrimaryServicePackage["id"];
  title: LocalizedText;
  badge?: LocalizedText;
  price: LocalizedText;
  duration: LocalizedText;
  audience: LocalizedText;
  benefits: {
    id: string[];
    en: string[];
  };
  referenceProject: string;
  techTags: string[];
  featured: boolean;
  whatsappMessage: LocalizedText;
}

/**
 * Builds a primary service package with backward-compatible field aliases
 * so existing UI consumers and new pricing layouts share one source of truth.
 */
function createPrimaryPackage(input: PrimaryPackageInput): PrimaryServicePackage {
  return {
    ...input,
    startingPrice: input.price,
    estimatedDuration: input.duration,
    pricingNote: scopeNotes,
    description: input.audience,
    deliverables: input.benefits,
    techStack: input.techTags,
  };
}

export const primaryPackages: PrimaryServicePackage[] = [
  createPrimaryPackage({
    id: "landing-page",
    title: {
      id: "Web Profil & Landing Page",
      en: "Profile Web & Landing Page",
    },
    price: {
      id: "Mulai Rp 500.000",
      en: "Starting from Rp 500K",
    },
    duration: {
      id: "Estimasi 3 – 7 Hari",
      en: "Est. 3 – 7 Days",
    },
    audience: {
      id: "UMKM, personal branding, profil organisasi & event",
      en: "MSMEs, personal branding, organization & event profiles",
    },
    benefits: {
      id: [
        "Tampil profesional dan mudah ditemukan di Google",
        "Halaman ringan, responsif, dan cepat diakses dari HP",
        "Terhubung langsung ke tombol WhatsApp bisnis & media sosial",
      ],
      en: [
        "Professional online presence optimized for search visibility",
        "Lightweight, responsive pages built for fast mobile loading",
        "Direct integration with business WhatsApp & social channels",
      ],
    },
    referenceProject: "3D Interactive Web",
    techTags: ["Next.js", "Tailwind CSS", "SEO Ready"],
    featured: false,
    whatsappMessage: {
      id: "Halo Ahmad, saya melihat portofoliomu dan tertarik konsultasi untuk pembuatan Web Profil & Landing Page (Mulai Rp 500.000).",
      en: "Hi Ahmad, I checked your portfolio and would like to consult about a Profile Web & Landing Page (Starting from Rp 500K).",
    },
  }),
  createPrimaryPackage({
    id: "web-app-si",
    title: {
      id: "Sistem Informasi & Web App",
      en: "Information System & Web App",
    },
    badge: {
      id: "Paling Diminati",
      en: "Most Popular",
    },
    price: {
      id: "Mulai Rp 1.500.000",
      en: "Starting from Rp 1.5M",
    },
    duration: {
      id: "Estimasi 2 – 4 Minggu",
      en: "Est. 2 – 4 Weeks",
    },
    audience: {
      id: "Sekolah, klinik, bisnis lokal, instansi & proyek riset",
      en: "Schools, clinics, local businesses, institutions & research",
    },
    benefits: {
      id: [
        "Digitalisasi pencatatan manual ke satu dashboard admin rapi",
        "Kelola data pelanggan, stok, transaksi, atau presensi real-time",
        "Sistem hak akses bertingkat (Admin, Staf, Pengguna) yang aman",
      ],
      en: [
        "Digitize manual records into a clean, centralized admin dashboard",
        "Manage customer data, inventory, transactions, or attendance in real-time",
        "Secure multi-role access control (Admin, Staff, User)",
      ],
    },
    referenceProject: "Sistem Presensi Murid & Meta Trade",
    techTags: ["Laravel", "Next.js", "REST API", "MySQL"],
    featured: true,
    whatsappMessage: {
      id: "Halo Ahmad, saya melihat portofoliomu dan tertarik konsultasi untuk pembuatan Sistem Informasi / Web App (Mulai Rp 1.500.000).",
      en: "Hi Ahmad, I checked your portfolio and would like to consult about an Information System / Web App (Starting from Rp 1.5M).",
    },
  }),
  createPrimaryPackage({
    id: "mobile-android",
    title: {
      id: "Aplikasi Mobile Android",
      en: "Android Mobile Application",
    },
    price: {
      id: "Mulai Rp 2.000.000",
      en: "Starting from Rp 2M",
    },
    duration: {
      id: "Estimasi 2 – 6 Minggu",
      en: "Est. 2 – 6 Weeks",
    },
    audience: {
      id: "Bisnis & komunitas yang butuh aplikasi langsung di HP",
      en: "Businesses & communities needing native Android apps",
    },
    benefits: {
      id: [
        "Aplikasi ringan yang terpasang langsung di smartphone Android",
        "Tetap berjalan lancar tanpa koneksi internet (offline-first)",
        "Antarmuka modern dengan sinkronisasi data cloud opsional",
      ],
      en: [
        "Lightweight native performance installed directly on Android devices",
        "Works reliably even without an internet connection (offline-first)",
        "Modern UI with optional cloud data synchronization",
      ],
    },
    referenceProject: "MFit",
    techTags: ["Kotlin", "Jetpack Compose", "Room DB", "Firebase"],
    featured: false,
    whatsappMessage: {
      id: "Halo Ahmad, saya melihat portofoliomu dan tertarik konsultasi untuk pembuatan Aplikasi Mobile Android (Mulai Rp 2.000.000).",
      en: "Hi Ahmad, I checked your portfolio and would like to consult about an Android Mobile Application (Starting from Rp 2M).",
    },
  }),
];

const customBannerPrice: LocalizedText = {
  id: "Mulai Rp 150.000 / Jam atau Per Sprint",
  en: "Starting from Rp 150K / Hour or Per Sprint",
};

export const customBanner: CustomConsultationBanner = {
  id: "custom-collaboration-ai-rd",
  title: {
    id: "Kolaborasi Part-Time & R&D AI",
    en: "Part-Time Collaboration & AI R&D",
  },
  price: customBannerPrice,
  startingPrice: customBannerPrice,
  description: {
    id: "Punya ide sistem khusus, butuh riset AI/Python, atau masih bingung menentukan paket yang pas? Diskusikan kebutuhanmu secara gratis.",
    en: "Have a custom system idea, need AI/Python R&D, or unsure which package fits best? Let's discuss your requirements for free.",
  },
  referenceProject: "Fact Check & Milo.AI",
  whatsappMessage: {
    id: "Halo Ahmad, saya ingin berdiskusi mengenai kolaborasi Part-Time / R&D AI atau konsultasi kebutuhan sistem khusus.",
    en: "Hi Ahmad, I would like to discuss a Part-Time / AI R&D collaboration or custom system consultation.",
  },
};

export const freelanceServicesData: FreelanceServicesCatalog = {
  primaryPackages,
  customBanner,
  scopeNotes,
};

export type ServicesDataCollection = PrimaryServicePackage[] &
  FreelanceServicesCatalog;

export const servicesData: ServicesDataCollection = Object.assign(
  [...primaryPackages],
  freelanceServicesData
);

/**
 * Encodes a pre-filled WhatsApp message into a direct wa.me URL.
 */
export function buildDirectWhatsAppUrl(message: string): string {
  return `https://wa.me/${contactConfig.whatsappApiNumber}?text=${encodeURIComponent(
    message.trim()
  )}`;
}

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

  return buildDirectWhatsAppUrl(message);
}
