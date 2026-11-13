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
      en: "Modern declarative UI & 60FPS Canvas.",
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
      en: "Type-safe web & full-stack engineering.",
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
      en: "Interactive web & DOM architecture.",
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
    name: "HTML5 & CSS3 / Tailwind",
    category: "frontend-mobile",
    categoryLabel: { id: "Mobile & Frontend", en: "Mobile & Frontend" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Tata letak Bento responsif dan styling antarmuka modern.",
      en: "Responsive Bento & modern styling.",
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
      en: "Interactive 3D web & spatial audio UI.",
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
      en: "Scalable backend services & API integration.",
    },
  },
  {
    id: "mvc-architecture",
    name: "MVC Architecture",
    category: "backend-db",
    categoryLabel: { id: "Backend & Sistem", en: "Backend & Systems" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Pola arsitektur modular untuk sistem enterprise dan SuperApps pemerintahan.",
      en: "Modular enterprise & government SuperApps pattern.",
    },
  },
  {
    id: "sql-room-db",
    name: "SQL & Room Database",
    category: "backend-db",
    categoryLabel: { id: "Backend & Sistem", en: "Backend & Systems" },
    levelBadge: { id: "Core Production", en: "Core Production" },
    description: {
      id: "Perancangan skema relasional dan persistensi data luring (offline).",
      en: "Relational schema design & offline persistence.",
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
      en: "AI pipelines, automation & data processing.",
    },
  },
  {
    id: "data-engineering",
    name: "Data Engineering",
    category: "ai-data",
    categoryLabel: { id: "AI & Data (R&D)", en: "AI & Data (R&D)" },
    levelBadge: { id: "Active R&D", en: "Active R&D" },
    description: {
      id: "Verifikasi silang sumber data dan pembangunan pipeline terstruktur.",
      en: "Cross-source verification & structured data pipelines.",
    },
  },
  {
    id: "on-device-ai-voice",
    name: "On-Device AI & Voice Detection",
    category: "ai-data",
    categoryLabel: { id: "AI & Data (R&D)", en: "AI & Data (R&D)" },
    levelBadge: { id: "Active R&D", en: "Active R&D" },
    description: {
      id: "Inferensi AI suara lokal sepenuhnya tanpa ketergantungan API eksternal.",
      en: "Local inference without external API dependency.",
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
      en: "Iterative sprint execution & behavioral verification.",
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
      id: "Kontrol versi, penandaan rilis produksi, dan perancangan UI/UX.",
      en: "Version control, release tagging & UI/UX prototyping.",
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
      id: "Kepala divisi dan perumus konsep strategis acara serta program kerja.",
      en: "Division head, strategic event & program conceptor.",
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
      en: "Institutional diplomacy & external stakeholder relations.",
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
      id: "Pengalaman Kerja / Magang",
      en: "Work / Internship Experience",
    },
    roleOrDegree: {
      id: "Backend Developer Intern",
      en: "Backend Developer Intern",
    },
    organization:
      "Dinas Komunikasi, Informasi, dan Statistika (DISKOMINFOSTA) Bangka Tengah",
    location: "Bangka Tengah, Indonesia",
    period: {
      id: "Magang — 2 Bulan",
      en: "Internship — 2 Months",
    },
    summary: {
      id: "Berkontribusi dalam perancangan dan pengembangan infrastruktur Backend SuperApps layanan terpadu pemerintah daerah dengan pendekatan rekayasa perangkat lunak terstruktur.",
      en: "Contributed to the design and engineering of an integrated regional government SuperApps backend infrastructure using structured software engineering practices.",
    },
    highlights: {
      id: [
        "Merancang dan mengembangkan sistem Backend SuperApps layanan terpadu berbasis arsitektur Model-View-Controller (MVC).",
        "Menerapkan siklus pengembangan perangkat lunak menggunakan metodologi Agile untuk memastikan pengiriman fitur tepat waktu.",
        "Memahami secara mendalam alur birokrasi instansi, tata kelola sistem informasi pemerintahan, serta koordinasi lintas bidang di dunia kerja profesional.",
      ],
      en: [
        "Designed and developed the integrated SuperApps backend system built upon the Model-View-Controller (MVC) architecture.",
        "Executed iterative software delivery using Agile methodology to ensure reliable feature milestones.",
        "Gained firsthand mastery of institutional bureaucracy workflows, government information system governance, and professional workplace coordination.",
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
      id: "Mengepalai divisi strategis yang menjembatani hubungan kelembagaan antara pihak eksternal kampus dengan HMIF ITERA serta merumuskan konsep seluruh program kerja divisi.",
      en: "Led the strategic division bridging institutional relations between external stakeholders and HMIF ITERA while conceptualizing all division-wide initiatives.",
    },
    highlights: {
      id: [
        "Mengepalai dan mengoordinasikan seluruh anggota Divisi Ekstra Kampus sebagai penghubung utama antara pihak eksternal kampus ITERA dengan HMIF ITERA.",
        "Menjadi konseptor utama (Lead Conceptor) dalam merancang arah strategis, kerangka acara, dan seluruh kegiatan yang dibawahi oleh Divisi Ekstra Kampus.",
      ],
      en: [
        "Led and coordinated the External Campus Division as the primary diplomatic bridge between external organizations and HMIF ITERA.",
        "Served as the Lead Conceptor designing strategic frameworks and program blueprints for all activities under the External Campus Division.",
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
      id: "Mengepalai bidang tingkat wilayah yang berfokus pada pemetaan, penampungan, serta penyaluran minat dan bakat mahasiswa informatika dan komputer lintas kampus.",
      en: "Headed the regional department dedicated to mapping, incubating, and channeling the interests and talents of informatics and computer science students across universities.",
    },
    highlights: {
      id: [
        "Mengepalai bidang yang bertugas menjadi wadah penampungan serta penyaluran minat dan bakat seluruh anggota PERMIKOMNAS Wilayah XV.",
        "Menjadi konseptor utama dalam merancang dan mengarahkan seluruh kegiatan pengembangan potensi yang dibawahi oleh Bidang Minat dan Bakat.",
      ],
      en: [
        "Directed the regional department serving as the primary hub for capturing and channeling member interests and talents across PERMIKOMNAS Region XV.",
        "Acted as the primary conceptualizer designing all talent-development programs and collaborative activities under the department.",
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
      id: "Berperan aktif sebagai narahubung eksternal dan eksekutor lapangan untuk program kolaborasi antarkampus dan kunjungan industri.",
      en: "Served actively as an external liaison officer and field concept executor for inter-university collaborations and industrial visits.",
    },
    highlights: {
      id: [
        "Menjadi narahubung (Liaison Officer) antara pihak eksternal kampus ITERA dengan HMIF ITERA.",
        "Menjadi pengeksekusi konsep lapangan untuk kegiatan Kunjungan Lapangan / Kunjungan Industri serta kegiatan Studi Banding bersama kampus lain.",
      ],
      en: [
        "Acted as the official Liaison Officer connecting external institutional partners with HMIF ITERA.",
        "Executed operational concepts for Field/Industrial Visits and inter-university Comparative Study programs.",
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
    location: "Lampung Selatan / Bandar Lampung, Indonesia",
    period: {
      id: "2023 – Sekarang (Aktif Studi)",
      en: "2023 – Present (Active Undergraduate)",
    },
    summary: {
      id: "Menempuh pendidikan sarjana Teknik Informatika dengan fokus pendalaman pada Rekayasa Perangkat Lunak (RPL) dan arsitektur Sistem Informasi, dipadukan dengan pengembangan aktif organisasi kemahasiswaan.",
      en: "Pursuing an undergraduate degree in Informatics Engineering specializing in Software Engineering (RPL) and Information Systems architecture, paired with active student leadership.",
    },
    highlights: {
      id: [
        "Fokus studi utama pada pengembangan Rekayasa Perangkat Lunak (RPL) untuk aplikasi Web & Mobile serta perancangan Sistem Informasi.",
        "Mengintegrasikan pembelajaran akademik dengan riset mandiri di bidang Data Engineering dan pengembangan AI lokal (Python).",
        "Aktif memimpin divisi strategis di HMIF ITERA dan PERMIKOMNAS Wilayah XV selama masa studi.",
      ],
      en: [
        "Core academic specialization in Software Engineering (Web & Mobile) and Information Systems design.",
        "Bridging academic foundations with independent R&D in Data Engineering and on-device AI development using Python.",
        "Actively leading strategic divisions in HMIF ITERA and PERMIKOMNAS Region XV alongside academic coursework.",
      ],
    },
    tags: [
      "Teknik Informatika",
      "ITERA",
      "Rekayasa Perangkat Lunak (RPL)",
      "Sistem Informasi",
      "2023 - Present",
    ],
  },
];

