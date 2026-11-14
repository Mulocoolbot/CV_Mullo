import type {
  LocalizedText,
  SkillCategory,
  SkillItem,
  TimelineCategory,
  TimelineItem,
} from "@/types/cv";

export const skillCategories: { id: SkillCategory; label: LocalizedText }[] = [
  {
    id: "all",
    label: { id: "Semua Keahlian", en: "All Skills" },
  },
  {
    id: "frontend-mobile",
    label: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
  },
  {
    id: "backend-db",
    label: { id: "Backend & Sistem", en: "Backend & Systems" },
  },
  {
    id: "ai-data",
    label: { id: "AI & Data (R&D)", en: "AI & Data (R&D)" },
  },
  {
    id: "workflow-soft",
    label: { id: "Metode & Kepemimpinan", en: "Workflow & Leadership" },
  },
];

export const skillsData: SkillItem[] = [
  {
    id: "kotlin",
    name: "Kotlin",
    category: "frontend-mobile",
    categoryLabel: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Pengembangan aplikasi Android native dan arsitektur MVVM.",
      en: "Native Android and MVVM development.",
    },
  },
  {
    id: "jetpack-compose",
    name: "Jetpack Compose",
    category: "frontend-mobile",
    categoryLabel: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "UI deklaratif modern Android serta animasi Canvas 60FPS.",
      en: "Modern declarative UI and 60FPS Canvas.",
    },
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend-mobile",
    categoryLabel: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Rekayasa web dan full-stack dengan keamanan tipe statis.",
      en: "Type-safe web and full-stack engineering.",
    },
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "frontend-mobile",
    categoryLabel: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Web interaktif serta arsitektur manipulasi DOM modern.",
      en: "Interactive web and DOM architecture.",
    },
  },
  {
    id: "react-nextjs",
    name: "React & Next.js",
    category: "frontend-mobile",
    categoryLabel: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Ekosistem aplikasi web berbasis komponen dan rendering modern.",
      en: "Component-driven web ecosystems.",
    },
  },
  {
    id: "html-css-tailwind",
    name: "HTML5 & Tailwind CSS",
    category: "frontend-mobile",
    categoryLabel: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Tata letak responsif dan styling antarmuka modern.",
      en: "Responsive layout and modern UI styling.",
    },
  },
  {
    id: "threejs-webgl",
    name: "Three.js & WebGL",
    category: "frontend-mobile",
    categoryLabel: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Visualisasi web 3D interaktif dan UI audio spasial.",
      en: "Interactive 3D web and spatial audio UI.",
    },
  },
  {
    id: "php-laravel",
    name: "PHP & Laravel",
    category: "backend-db",
    categoryLabel: { id: "Backend & Sistem", en: "Backend & Systems" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Pengembangan sistem informasi full-stack berbasis pola MVC.",
      en: "Full-stack MVC information systems.",
    },
  },
  {
    id: "nodejs-rest-api",
    name: "Node.js & RESTful API",
    category: "backend-db",
    categoryLabel: { id: "Backend & Sistem", en: "Backend & Systems" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Layanan backend skalabel dan integrasi antar-layanan API.",
      en: "Scalable backend services and API integration.",
    },
  },
  {
    id: "mvc-architecture",
    name: "MVC Architecture",
    category: "backend-db",
    categoryLabel: { id: "Backend & Sistem", en: "Backend & Systems" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Pola arsitektur modular untuk sistem dan SuperApps pemerintahan.",
      en: "Modular enterprise and government SuperApps architecture.",
    },
  },
  {
    id: "sql-room-db",
    name: "SQL & Room Database",
    category: "backend-db",
    categoryLabel: { id: "Backend & Sistem", en: "Backend & Systems" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Perancangan skema relasional dan persistensi data luring.",
      en: "Relational schema design and offline persistence.",
    },
  },
  {
    id: "python",
    name: "Python",
    category: "ai-data",
    categoryLabel: { id: "AI & Data (R&D)", en: "AI & Data (R&D)" },
    levelBadge: { id: "Active R&D", en: "Active R&D" },
    description: {
      id: "Alur pemrosesan AI, otomasi sistem, dan pengolahan data.",
      en: "AI pipelines, automation, and data processing.",
    },
  },
  {
    id: "data-engineering",
    name: "Data Engineering",
    category: "ai-data",
    categoryLabel: { id: "AI & Data (R&D)", en: "AI & Data (R&D)" },
    levelBadge: { id: "Active R&D", en: "Active R&D" },
    description: {
      id: "Verifikasi silang sumber data dan pipeline terstruktur.",
      en: "Cross-source verification and structured data pipelines.",
    },
  },
  {
    id: "on-device-ai-voice",
    name: "On-Device AI & Voice Detection",
    category: "ai-data",
    categoryLabel: { id: "AI & Data (R&D)", en: "AI & Data (R&D)" },
    levelBadge: { id: "Active R&D", en: "Active R&D" },
    description: {
      id: "Inferensi AI suara lokal tanpa ketergantungan API eksternal.",
      en: "Local voice inference without external API dependency.",
    },
  },
  {
    id: "agile-blackbox",
    name: "Agile & Black Box Testing",
    category: "workflow-soft",
    categoryLabel: {
      id: "Metode & Kepemimpinan",
      en: "Workflow & Leadership",
    },
    levelBadge: { id: "Workflow", en: "Workflow" },
    description: {
      id: "Eksekusi sprint iteratif serta verifikasi perilaku perangkat lunak.",
      en: "Iterative sprint execution and behavioral verification.",
    },
  },
  {
    id: "git-github-figma",
    name: "Git, GitHub & Figma",
    category: "workflow-soft",
    categoryLabel: {
      id: "Metode & Kepemimpinan",
      en: "Workflow & Leadership",
    },
    levelBadge: { id: "Workflow", en: "Workflow" },
    description: {
      id: "Kontrol versi, penandaan rilis, dan perancangan antarmuka.",
      en: "Version control, release tagging, and UI prototyping.",
    },
  },
  {
    id: "leadership-concepting",
    name: "Leadership & Concepting",
    category: "workflow-soft",
    categoryLabel: {
      id: "Metode & Kepemimpinan",
      en: "Workflow & Leadership",
    },
    levelBadge: { id: "Executive Soft Skill", en: "Executive Soft Skill" },
    description: {
      id: "Memimpin divisi dan merumuskan konsep program kerja strategis.",
      en: "Leading divisions and shaping strategic program concepts.",
    },
  },
  {
    id: "public-speaking-liaison",
    name: "Public Speaking & External Liaison",
    category: "workflow-soft",
    categoryLabel: {
      id: "Metode & Kepemimpinan",
      en: "Workflow & Leadership",
    },
    levelBadge: { id: "Executive Soft Skill", en: "Executive Soft Skill" },
    description: {
      id: "Diplomasi kelembagaan dan pengelolaan relasi mitra eksternal.",
      en: "Institutional diplomacy and external stakeholder relations.",
    },
  },
];

export const timelineCategories: {
  id: TimelineCategory;
  label: LocalizedText;
}[] = [
  {
    id: "all",
    label: { id: "Semua Jejak", en: "All Milestones" },
  },
  {
    id: "work",
    label: { id: "Pengalaman Kerja", en: "Work Experience" },
  },
  {
    id: "leadership",
    label: { id: "Organisasi & Kepemimpinan", en: "Organizations & Leadership" },
  },
  {
    id: "education",
    label: { id: "Pendidikan", en: "Education" },
  },
];

export const timelineData: TimelineItem[] = [
  {
    id: "diskominfosta-bangka-tengah",
    category: "work",
    categoryLabel: {
      id: "Pengalaman Magang",
      en: "Internship Experience",
    },
    roleOrDegree: {
      id: "Backend Developer Intern",
      en: "Backend Developer Intern",
    },
    organization:
      "Dinas Komunikasi, Informasi, dan Statistika (DISKOMINFOSTA) Bangka Tengah",
    location: "Bangka Tengah, Indonesia",
    period: {
      id: "Magang 2 Bulan",
      en: "2 Months Internship",
    },
    summary: {
      id: "Merancang dan mengembangkan layanan Backend SuperApps terpadu pemerintah daerah dengan standar rekayasa perangkat lunak terstruktur.",
      en: "Designed and engineered integrated regional government SuperApps backend services using structured software practices.",
    },
    highlights: {
      id: [
        "Mengembangkan Backend SuperApps layanan terpadu berbasis arsitektur MVC.",
        "Menjalankan siklus pengiriman fitur teratur menggunakan metodologi Agile.",
        "Mempelajari alur birokrasi instansi, tata kelola sistem pemerintahan, dan koordinasi lintas bidang.",
      ],
      en: [
        "Built the integrated SuperApps backend built on MVC architecture.",
        "Delivered iterative feature milestones under Agile methodology.",
        "Navigated institutional bureaucracy workflows, government IT governance, and cross-team coordination.",
      ],
    },
    tags: [
      "Backend Development",
      "MVC Architecture",
      "SuperApps",
      "Agile Methodology",
      "GovTech Bureaucracy",
    ],
  },
  {
    id: "hmif-itera-kadiv",
    category: "leadership",
    categoryLabel: {
      id: "Kepemimpinan Organisasi",
      en: "Organizational Leadership",
    },
    roleOrDegree: {
      id: "Kepala Divisi Ekstra Kampus",
      en: "Head of External Campus Division",
    },
    organization:
      "Himpunan Mahasiswa Teknik Informatika Institut Teknologi Sumatera (HMIF ITERA)",
    location: "Lampung, Indonesia",
    period: {
      id: "Jabatan Kepemimpinan",
      en: "Leadership Tenure",
    },
    summary: {
      id: "Memimpin divisi strategis penghubung antara mitra eksternal kampus dengan HMIF ITERA sekaligus merumuskan konsep program kerja.",
      en: "Led the strategic division bridging external stakeholders with HMIF ITERA while shaping division-wide programs.",
    },
    highlights: {
      id: [
        "Mengoordinasikan tim Divisi Ekstra Kampus sebagai penghubung resmi antara pihak eksternal ITERA dan himpunan.",
        "Menjadi Lead Conceptor dalam merancang arah strategis serta kerangka seluruh kegiatan divisi.",
      ],
      en: [
        "Coordinated the External Campus Division as the diplomatic link between external partners and HMIF ITERA.",
        "Served as Lead Conceptor crafting strategic frameworks for all division activities.",
      ],
    },
    tags: [
      "Leadership",
      "Lead Conceptor",
      "External Relations",
      "Public Speaking",
      "HMIF ITERA",
    ],
  },
  {
    id: "permikomnas-wilayah-xv",
    category: "leadership",
    categoryLabel: {
      id: "Kepemimpinan Tingkat Wilayah",
      en: "Regional Student Leadership",
    },
    roleOrDegree: {
      id: "Kepala Bidang Minat dan Bakat",
      en: "Head of Interests & Talents Department",
    },
    organization:
      "Perhimpunan Mahasiswa Informatika dan Komputer Nasional (PERMIKOMNAS) Wilayah XV",
    location: "Wilayah XV, Indonesia",
    period: {
      id: "Kepengurusan Wilayah",
      en: "Regional Executive Tenure",
    },
    summary: {
      id: "Memimpin bidang tingkat wilayah untuk memetakan, menampung, dan menyalurkan minat serta bakat mahasiswa informatika lintas kampus.",
      en: "Directed the regional department dedicated to mapping and channeling informatics student talents across universities.",
    },
    highlights: {
      id: [
        "Mengelola wadah penyaluran minat dan bakat bagi mahasiswa anggota PERMIKOMNAS Wilayah XV.",
        "Merancang konsep serta mengarahkan eksekusi kegiatan pengembangan potensi di tingkat wilayah.",
      ],
      en: [
        "Managed talent-development hubs for informatics students across PERMIKOMNAS Region XV.",
        "Conceptualized and guided collaborative student programs at the regional level.",
      ],
    },
    tags: [
      "Regional Leadership",
      "Program Conceptor",
      "Talent Management",
      "PERMIKOMNAS XV",
    ],
  },
  {
    id: "hmif-itera-staff",
    category: "leadership",
    categoryLabel: {
      id: "Pengalaman Organisasi",
      en: "Organizational Experience",
    },
    roleOrDegree: {
      id: "Staf Divisi Ekstra Kampus",
      en: "External Campus Division Staff",
    },
    organization:
      "Himpunan Mahasiswa Teknik Informatika Institut Teknologi Sumatera (HMIF ITERA)",
    location: "Lampung, Indonesia",
    period: {
      id: "Periode Staf Aktif",
      en: "Active Staff Tenure",
    },
    summary: {
      id: "Berperan sebagai narahubung eksternal dan pelaksana teknis untuk program kunjungan industri serta studi banding antarkampus.",
      en: "Served as external liaison and field coordinator for industrial visits and inter-university comparative studies.",
    },
    highlights: {
      id: [
        "Menjadi Liaison Officer antara mitra eksternal kampus dengan HMIF ITERA.",
        "Mengeksekusi kegiatan Kunjungan Industri dan Studi Banding bersama himpunan kampus lain.",
      ],
      en: [
        "Acted as Liaison Officer connecting external partners with HMIF ITERA.",
        "Executed Industrial Visits and Comparative Study programs alongside partner student organizations.",
      ],
    },
    tags: [
      "External Liaison",
      "Industrial Visit",
      "Comparative Study",
      "Event Execution",
    ],
  },
  {
    id: "itera-informatics-education",
    category: "education",
    categoryLabel: {
      id: "Pendidikan Tinggi",
      en: "Higher Education",
    },
    roleOrDegree: {
      id: "S1 Teknik Informatika (Fokus RPL & Sistem Informasi)",
      en: "B.Sc. in Informatics Engineering (Software Engineering & Information Systems)",
    },
    organization: "Institut Teknologi Sumatera (ITERA)",
    location: "Lampung Selatan, Indonesia",
    period: {
      id: "2023 - Sekarang",
      en: "2023 - Present",
    },
    summary: {
      id: "Menempuh studi Teknik Informatika dengan pendalaman Rekayasa Perangkat Lunak (RPL) dan arsitektur Sistem Informasi.",
      en: "Pursuing an Informatics Engineering degree focused on Software Engineering (RPL) and Information Systems architecture.",
    },
    highlights: {
      id: [
        "Mendalami pengembangan perangkat lunak Web & Mobile serta perancangan Sistem Informasi.",
        "Menggabungkan studi akademik dengan riset mandiri Data Engineering dan AI lokal berbasis Python.",
        "Aktif memimpin divisi strategis di HMIF ITERA dan PERMIKOMNAS Wilayah XV selama masa studi.",
      ],
      en: [
        "Specializing in Web & Mobile Software Engineering and Information Systems design.",
        "Complementing coursework with independent Data Engineering and Python on-device AI R&D.",
        "Actively leading divisions in HMIF ITERA and PERMIKOMNAS Region XV alongside academic studies.",
      ],
    },
    tags: [
      "Teknik Informatika",
      "ITERA",
      "Rekayasa Perangkat Lunak",
      "Sistem Informasi",
      "2023 - Present",
    ],
  },
];
