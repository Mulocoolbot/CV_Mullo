import type { ProfileData } from "@/types/cv";

export const profileData: ProfileData = {
  name: "Ahmad Mulia Saputra",
  handle: "Mulocoolbot",
  avatarUrl: "/images/profile-mullo.jpg",
  cvPdfUrl: null,
  location: "Bandar Lampung, Indonesia",
  available: true,
  workTypes: ["Part-time", "Freelance"],
  statusLabel: {
    id: "Tersedia untuk Part-time & Freelance",
    en: "Open for Part-time & Freelance",
  },
  roles: ["Web Developer", "Mobile Apps Developer", "Full Stack Developer"],
  headline: {
    id: "Pengembang perangkat lunak berfokus pada aplikasi mobile, ekosistem web, dan sistem informasi.",
    en: "Software developer focused on mobile applications, web ecosystems, and information systems.",
  },
  bio: {
    id: [
      "Saya mengembangkan aplikasi mobile dan web dengan fokus pada keandalan sistem, struktur kode yang bersih, dan pengalaman pengguna yang nyaman.",
      "Pengalaman aktif di organisasi kemahasiswaan membentuk kemampuan kepemimpinan, public speaking, dan koordinasi tim saya.",
      "Saat ini saya mendalami Data Engineering dan pengembangan AI menggunakan ekosistem Python.",
    ],
    en: [
      "I build mobile and web applications with a focus on system reliability, clean architecture, and intuitive user experiences.",
      "Active roles in student organizations have sharpened my leadership, public speaking, and cross-team coordination skills.",
      "I am currently expanding my expertise in Data Engineering and AI development using the Python ecosystem.",
    ],
  },
  coreStack: [
    "TypeScript",
    "JavaScript",
    "Kotlin",
    "HTML",
    "CSS",
    "RESTful API",
    "Laravel",
    "PHP",
  ],
  exploringStack: ["Python", "Data Engineering", "AI Development"],
  softSkills: ["Leadership", "Public Speaking", "Team Collaboration"],
};
