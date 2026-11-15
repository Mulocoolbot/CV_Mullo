# Ahmad Mulia Saputra | Web & Mobile Apps Developer

Official Web CV, Interactive 3D Portfolio, and Freelance Software Engineering Hub (`CV_Mullo`) of **Ahmad Mulia Saputra** — Web Developer, Mobile Apps Developer, and Full Stack Developer based in Bandar Lampung, Indonesia.

## Overview

- **Interactive 3D Wireframe Sculptures:** Real-time Three.js / React Three Fiber sculptures (`MeridianGlobeBackground`, `OpticalVortexSculpture`, `TrefoilKnotSculpture`, and `RubiksCubeSculpture`) synchronized with the active theme.
- **Bilingual (`ID` / `EN`) & Light / Dark Neural Theme:** Instant navbar toggles with state persisted in `localStorage`.
- **Built-in Printable ATS CV Generator:** Generates an ATS-friendly resume sheet (`#ats-resume-sheet`) with print/PDF export support directly from the browser.
- **Project Case Studies & WhatsApp API Brief Builder:** Categorized project showcase with interactive screenshot carousels, fullscreen lightbox, freelance service catalog, and pre-filled WhatsApp / email brief generation.

## Local Development & Verification

```bash
npm install
npm run dev
```

Run checks and production build:

```bash
npx tsc --noEmit
npx vitest run
npm run build
```

## How to Update Portfolio Content Without Changing the Live URL

All portfolio content is centralized in typed data modules under `src/data/`:

- `src/data/profile.ts` — Name, roles, location, bio, core stack, and skills summary.
- `src/data/projects.ts` — Project case studies, tech stack, GitHub/release links, and local screenshots under `public/images/projects/`.
- `src/data/experience.ts` — Skills matrix, work experience, organizational leadership, and education milestones.
- `src/data/services.ts` — Freelance service packages, pricing guides, and contact details.

After editing any of those files, commit and push to the `main` branch:

```bash
git add src/data public/images
git commit -m "chore: update portfolio content"
git push origin main
```

Every push to `main` triggers the GitHub Actions verification pipeline (`.github/workflows/deploy.yml`) and automatically redeploys the live production site on your configured hosting provider (e.g., Vercel or GitHub Pages) at the exact same permanent URL without changing the link.
