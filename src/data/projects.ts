import type { LocalizedText, ProjectCategory, ProjectItem } from "@/types/cv";

export const projectCategories: { id: ProjectCategory; label: LocalizedText }[] = [
  {
    id: "all",
    label: { id: "Semua Proyek", en: "All Projects" },
  },
  {
    id: "mobile",
    label: { id: "Mobile Apps", en: "Mobile Apps" },
  },
  {
    id: "web",
    label: { id: "Web & 3D", en: "Web & 3D" },
  },
  {
    id: "systems",
    label: { id: "Sistem Informasi", en: "Information Systems" },
  },
  {
    id: "ai-data",
    label: { id: "AI & Data", en: "AI & Data" },
  },
];

export const projectsData: ProjectItem[] = [
  {
    id: "mfit-gym-tracker",
    title: "MFit — Mobile Gym & Workout Tracker",
    category: "mobile",
    categoryLabel: {
      id: "Aplikasi Mobile Native",
      en: "Native Mobile App",
    },
    role: {
      id: "Full Stack Mobile Developer (Logika Backend Lokal, Database, UI/UX & Frontend)",
      en: "Full Stack Mobile Developer (Local Backend Logic, Database, UI/UX & Frontend)",
    },
    releaseStatus: {
      id: "Rilis v2.0.0 (Proyek Pribadi)",
      en: "Released v2.0.0 (Personal Project)",
    },
    isPublicRelease: true,
    shortSummary: {
      id: "Aplikasi mobile Android untuk mencatat dan menganalisis progres latihan gym secara presisi, dirancang penuh mulai dari arsitektur database lokal hingga antarmuka Bento UI.",
      en: "Native Android mobile app engineered to track and analyze gym workout progression with precision, built end-to-end from local database architecture to Bento UI.",
    },
    caseStudyProblem: {
      id: "Kebutuhan pribadi akan pencatatan progres latihan beban yang cepat, bekerja penuh secara luring (offline) tanpa latensi iklan, serta mampu menghitung metrik kekuatan secara ilmiah.",
      en: "Personal need for a fast, 100% offline-capable workout logger free of ad latency that accurately computes scientific strength progression metrics.",
    },
    technicalSolution: {
      id: "Merancang arsitektur MVVM berbasis Kotlin, Jetpack Compose, dan Room Database dengan fitur kalkulasi otomatis e1RM, heatmap anatomi otot 2D, rest timer latar belakang berfitur audio sintesis, serta animasi pembuka 60FPS.",
      en: "Engineered a Kotlin MVVM architecture using Jetpack Compose and Room Database featuring automated e1RM computation, 2D anatomical muscle heatmaps, synthesized-audio background rest timers, and a 60FPS Canvas intro.",
    },
    keyFeatures: {
      id: [
        "Kalkulasi otomatis Estimasi 1-Rep Max (e1RM) & Kalori berbasis MET",
        "Visualisasi 2D Muscle Heatmap untuk distribusi beban otot mingguan",
        "Background Rest Timer dengan Synthesized Audio & Haptic Feedback",
        "Backup & Restore basis data latihan ke format JSON lokal",
      ],
      en: [
        "Automated Estimated 1-Rep Max (e1RM) & MET Calorie calculation",
        "2D Muscle Heatmap visualization for weekly muscle volume distribution",
        "Background Rest Timer with Synthesized Audio & Haptic Feedback",
        "Offline JSON database Backup & Restore system",
      ],
    },
    techStack: [
      "Kotlin",
      "Jetpack Compose",
      "Room Database",
      "Coroutines",
      "Material 3",
      "Canvas 60FPS",
    ],
    githubUrl: "https://github.com/Mulocoolbot/Gym-Tracker",
    releaseUrl: "https://github.com/Mulocoolbot/Gym-Tracker/releases/tag/v2.0.0",
    screenshots: [],
  },
  {
    id: "hoax-news-detector",
    title: "Sistem Pendeteksi Berita Hoax",
    category: "ai-data",
    categoryLabel: {
      id: "Verifikasi Informasi & Web",
      en: "Information Verification & Web",
    },
    role: {
      id: "Full Stack Developer (Logika Backend, Frontend, Fitur & UI/UX)",
      en: "Full Stack Developer (Backend Logic, Frontend, Features & UI/UX)",
    },
    releaseStatus: {
      id: "Proyek R&D Pribadi",
      en: "Personal R&D Project",
    },
    isPublicRelease: false,
    shortSummary: {
      id: "Sistem berbasis web untuk memverifikasi kebenaran berita melalui ekstraksi judul dari tautan maupun tangkapan layar (screenshot) dan membandingkannya dengan sumber berita kredibel di internet.",
      en: "Web-based news verification system that extracts headlines from links or screenshots and cross-references core claims against credible internet news sources.",
    },
    caseStudyProblem: {
      id: "Maraknya penyebaran potongan gambar (screenshot) dan tautan berita manipulatif yang sulit diverifikasi secara cepat oleh pembaca awam.",
      en: "Widespread circulation of manipulated news screenshots and links that are difficult for everyday readers to verify quickly.",
    },
    technicalSolution: {
      id: "Membangun alur deteksi judul berita otomatis dari input URL atau gambar screenshot, lalu melakukan pencarian lintas sumber dengan judul serupa di internet dan membandingkan kesamaan inti beritanya untuk menentukan status Fakta atau Hoaks.",
      en: "Built an automated pipeline to detect headlines from URLs or uploaded screenshots, search matching articles across credible web sources, and compare core semantic alignment to classify stories as Fact or Hoax.",
    },
    keyFeatures: {
      id: [
        "Ekstraksi judul berita otomatis dari input Link URL maupun Screenshot gambar",
        "Pencarian silang (cross-search) judul berita serupa dari berbagai sumber internet",
        "Analisis kesesuaian inti pembahasan antar sumber untuk klasifikasi Fakta vs Hoaks",
        "Antarmuka dasbor hasil verifikasi dan referensi sumber pembanding",
      ],
      en: [
        "Automated headline extraction from both URL links and uploaded screenshots",
        "Cross-source web search for matching or similar news headlines",
        "Core content alignment analysis across sources for Fact vs Hoax classification",
        "Interactive verification dashboard displaying comparative reference sources",
      ],
    },
    techStack: [
      "Python",
      "JavaScript",
      "HTML/CSS",
      "RESTful API",
      "OCR & Text Matching",
    ],
    githubUrl: "https://github.com/Mulocoolbot/Sistem-Pendeteksi-Berita-Hoaks",
    screenshots: [],
  },
  {
    id: "meta-trade-journal",
    title: "Meta Trade — Trading Journal System",
    category: "systems",
    categoryLabel: {
      id: "Sistem Informasi Finansial",
      en: "Financial Information System",
    },
    role: {
      id: "Full Stack Developer (Backend, Database, Frontend, Fitur & UI/UX)",
      en: "Full Stack Developer (Backend, Database, Frontend, Features & UI/UX)",
    },
    releaseStatus: {
      id: "Sistem Penggunaan Pribadi",
      en: "Personal Production System",
    },
    isPublicRelease: false,
    shortSummary: {
      id: "Sistem pencatatan dan evaluasi trading berbasis web untuk mendokumentasikan trading rules, menguji strategi, dan menganalisis hasil transaksi secara terstruktur.",
      en: "Web-based trading journal and analytics system designed to document trading rules, evaluate strategies, and track trade execution outcomes.",
    },
    caseStudyProblem: {
      id: "Pencatatan transaksi trading secara manual menyulitkan evaluasi kepatuhan terhadap trading rules dan efektivitas strategi dalam jangka panjang.",
      en: "Manual trade logging makes it difficult to audit discipline against trading rules and measure long-term strategy profitability.",
    },
    technicalSolution: {
      id: "Merancang sistem full-stack dengan database relasional terstruktur untuk menghubungkan setiap posisi trading dengan aturan disiplin (trading rules), kategori strategi, serta rekapitulasi hasil profit/loss.",
      en: "Designed a full-stack web system backed by a relational database linking every trade entry to predefined trading rules, strategy tags, and profit/loss performance metrics.",
    },
    keyFeatures: {
      id: [
        "Manajemen parameter Trading Rules dan dokumentasi Trading Strategy",
        "Pencatatan histori dan hasil transaksi (Win/Loss, Risk-Reward, Evaluasi)",
        "Arsitektur database relasional untuk pelacakan konsistensi performa",
        "Antarmuka dasbor analitik yang responsif dan berfokus pada kemudahan input data",
      ],
      en: [
        "Trading Rules parameter management and Trading Strategy documentation",
        "Comprehensive trade outcome logging (Win/Loss, Risk-Reward, Post-Trade Review)",
        "Relational database architecture for tracking performance consistency",
        "Responsive analytics dashboard optimized for rapid trade journaling",
      ],
    },
    techStack: [
      "Laravel",
      "PHP",
      "JavaScript",
      "SQL Database",
      "HTML",
      "CSS",
    ],
    githubUrl: "https://github.com/Mulocoolbot/Journal-Trading-Meta",
    screenshots: [],
  },
  {
    id: "3d-porto-web",
    title: "3D Interactive Web & Audio Lab",
    category: "web",
    categoryLabel: {
      id: "Eksperimen Web 3D & Audio",
      en: "3D Web & Audio Experiment",
    },
    role: {
      id: "Full Stack Developer (Frontend 3D, Fitur Interaktif & UI/UX)",
      en: "Full Stack Developer (3D Frontend, Interactive Features & UI/UX)",
    },
    releaseStatus: {
      id: "Eksperimen R&D Pribadi",
      en: "Personal R&D Experiment",
    },
    isPublicRelease: false,
    shortSummary: {
      id: "Eksperimen pengembangan website interaktif yang menggabungkan komponen visual 3 dimensi dengan umpan balik suara (interactive audio) secara real-time.",
      en: "Interactive web development experiment combining real-time 3D visual components with responsive spatial audio feedback.",
    },
    caseStudyProblem: {
      id: "Website portofolio konvensional umumnya bersifat statis dan kurang memberikan pengalaman eksplorasi multisensori bagi pengunjung.",
      en: "Conventional portfolio websites are often static and lack engaging multisensory exploration for visitors.",
    },
    technicalSolution: {
      id: "Mengintegrasikan rendering objek 3D di browser dengan pemicu audio interaktif yang merespons pergerakan dan interaksi pengguna secara mulus.",
      en: "Integrated browser-based 3D object rendering synchronized with interactive audio triggers that respond smoothly to user movement and clicks.",
    },
    keyFeatures: {
      id: [
        "Integrasi komponen objek 3D interaktif langsung di peramban web",
        "Sinkronisasi efek suara (interactive sound) terhadap interaksi UI/UX pengguna",
        "Eksplorasi tata letak antarmuka modern dan transisi kamera dinamis",
      ],
      en: [
        "Interactive 3D object components rendered directly in the web browser",
        "Synchronized interactive sound effects triggered by user UI/UX actions",
        "Modern experimental interface layout with dynamic camera transitions",
      ],
    },
    techStack: [
      "TypeScript",
      "JavaScript",
      "Three.js / WebGL",
      "Web Audio API",
      "HTML/CSS",
    ],
    githubUrl: "https://github.com/Mulocoolbot/portofolio",
    screenshots: [],
  },
  {
    id: "sistem-presensi-murid",
    title: "Sistem Presensi Murid Digital",
    category: "systems",
    categoryLabel: {
      id: "Sistem Informasi Pendidikan",
      en: "Education Information System",
    },
    role: {
      id: "Full Stack Developer (Backend, Database, Fitur, Frontend & UI/UX)",
      en: "Full Stack Developer (Backend, Database, Features, Frontend & UI/UX)",
    },
    releaseStatus: {
      id: "Prototipe Studi Kasus Sekolah",
      en: "School Case Study Prototype",
    },
    isPublicRelease: false,
    shortSummary: {
      id: "Sistem informasi presensi berbasis web untuk menggantikan absensi kertas (paper-based) di sekolah agar waktu kegiatan belajar-mengajar guru menjadi lebih efektif dan efisien.",
      en: "Web-based student attendance information system built to replace paper-based roll calls and maximize classroom teaching efficiency for teachers.",
    },
    caseStudyProblem: {
      id: "Banyak sekolah di Indonesia masih menggunakan presensi berbasis kertas (paper-based) yang menyita waktu jadwal belajar-mengajar dan rentan terhadap kehilangan data rekapitulasi.",
      en: "Many schools in Indonesia still rely on paper-based attendance sheets, consuming valuable classroom teaching time and risking manual data loss.",
    },
    technicalSolution: {
      id: "Membangun sistem presensi berbasis web terpusat dengan alur input cepat bagi guru di kelas, penyimpanan database terstruktur, serta rekapitulasi kehadiran siswa otomatis.",
      en: "Engineered a centralized web attendance system featuring rapid classroom roll-call input for teachers, structured database persistence, and automated attendance summaries.",
    },
    keyFeatures: {
      id: [
        "Pencatatan kehadiran siswa digital cepat untuk memangkas waktu administrasi kelas",
        "Manajemen data murid, kelas, dan histori status presensi (Hadir, Izin, Sakit, Alfa)",
        "Penyusunan skema database relasional dan antarmuka ramah guru",
      ],
      en: [
        "Rapid digital roll-call workflow reducing classroom administrative overhead",
        "Student, class, and attendance status history management (Present, Permit, Sick, Absent)",
        "Relational database schema paired with a teacher-friendly responsive UI",
      ],
    },
    techStack: [
      "Laravel",
      "PHP",
      "JavaScript",
      "SQL Database",
      "HTML",
      "CSS",
    ],
    githubUrl: "https://github.com/Mulocoolbot/sistem-presensi-murid",
    screenshots: [],
  },
  {
    id: "milo-ai",
    title: "Milo.AI — On-Device Voice Detection AI",
    category: "ai-data",
    categoryLabel: {
      id: "Pengembangan AI Lokal",
      en: "On-Device AI Development",
    },
    role: {
      id: "AI & Software Developer (On-Device Inference, Voice Detection & Core System)",
      en: "AI & Software Developer (On-Device Inference, Voice Detection & Core System)",
    },
    releaseStatus: {
      id: "Tahap Pengembangan Awal (R&D Lokal)",
      en: "Early-Stage Local R&D",
    },
    isPublicRelease: false,
    shortSummary: {
      id: "Proyek eksplorasi pengembangan AI dengan kemampuan Voice Detection yang bekerja dan tersimpan 100% di perangkat pengguna tanpa menggunakan API AI eksternal.",
      en: "AI development exploration featuring Voice Detection that runs and stores data 100% locally on the user's device with zero external AI API dependencies.",
    },
    caseStudyProblem: {
      id: "Ketergantungan pada cloud AI API eksternal menimbulkan biaya berkelanjutan, latensi jaringan, serta risiko privasi pada data suara pengguna.",
      en: "Relying on external cloud AI APIs introduces recurring costs, network latency, and privacy risks for user voice data.",
    },
    technicalSolution: {
      id: "Mengembangkan arsitektur deteksi suara (Voice Detection) berbasis Python yang mengeksekusi pemrosesan dan penyimpanan model sepenuhnya secara lokal di perangkat pengguna.",
      en: "Developed a Python-based Voice Detection pipeline that executes audio processing and model storage entirely on the local device.",
    },
    keyFeatures: {
      id: [
        "Deteksi suara (Voice Detection) tanpa ketergantungan pada AI API pihak ketiga",
        "Pemrosesan dan penyimpanan data sepenuhnya di perangkat lokal (100% On-Device)",
        "Fondasi eksperimen teknis untuk pengembangan asisten AI mandiri",
      ],
      en: [
        "Voice Detection operating with zero third-party AI API dependencies",
        "100% on-device processing and local storage for maximum privacy",
        "Technical R&D foundation for self-contained local AI assistants",
      ],
    },
    techStack: [
      "Python",
      "On-Device AI",
      "Voice Detection",
      "Local Model Storage",
    ],
    githubUrl: "https://github.com/Mulocoolbot/Milo.AI",
    screenshots: [],
  },
];

