# Aarav Malik (Krexilor) — Portfolio

Personal portfolio and engineering journal for **Aarav Malik (Krexilor)**, focused on C++, Linux internals, POSIX networking, concurrency primitives, and distributed backend infrastructure.

---

## Overview

- **Landing Page (`/`)**:
  - **Hero & WebGL Signal Field**: Interactive GLSL canvas reacting to pointer hover and click impulses, paired with a hybrid pointer system supporting mouse, pen/stylus, and touch devices.
  - **About & Technical Stack**: Background bio, education/certifications timeline, and a layer-filterable stack matrix.
  - **Projects Showcase**: Filterable project showcase (`Completed` / `In Design`) with interactive architecture & engineering inspection modals (`HueForge`, `RedisLite`, `RateGuard`).
  - **Systems Lab**: Interactive client-side simulators in pure JavaScript modeling a **Consistent Hash Ring** (FNV-1a virtual nodes and shard failover) and **Concurrency & Lock Contention** across threading strategies.
  - **Contact**: Clipboard email copy, direct links, and Web3Forms inbox delivery with honeypot protection and client-side validation.
- **Engineering Blog (`/blog`, `/blog/:slug`)**:
  - Self-hosted technical write-ups organized as standalone React article components under `src/pages/Blog/Posts/` sharing a unified layout and stylesheet, complete with reading progress indicator, sticky table of contents, copyable code blocks, and topic filtering.
- **Resume (`/resume`)**:
  - Print-ready condensed CV sheet, PDF download control, and a sticky Web3Forms hiring/walkthrough inquiry form.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI Framework | React 19 + Vite 8 |
| Routing | React Router 8 |
| Motion | `motion` (`motion/react`) |
| Styling | CSS Modules + CSS Custom Properties (`src/styles/global.css`) |
| Graphics | Custom WebGL GLSL Shaders (`src/shaders/`) |
| Form Delivery | Web3Forms API |

---

## Project Structure

```text
├── public/                     # Static icons, manifest, and static assets
├── src/
│   ├── assets/                 # Blog cover artwork and profile/project images
│   ├── components/
│   │   ├── Common/             # Buttons, ChapterRail, Cursor, Modal, Reveal, ShaderCanvas
│   │   └── Layout/             # AppLayout, Navbar, Footer, ScrollToHash
│   ├── data/                   # Typed JS data modules (*.data.js) for profile, projects, resume, stack
│   ├── hooks/                  # useHoverCapable hybrid pointer hook
│   ├── pages/
│   │   ├── Blog/
│   │   │   └── Posts/          # Standalone JSX article modules + index.js registry
│   │   ├── Landing/
│   │   ├── NotFound/
│   │   └── Resume/
│   ├── sections/               # Home, About, Work, Lab, Contact
│   ├── shaders/                # field.vert.glsl, field.frag.glsl
│   ├── styles/                 # Global design tokens and reset rules
│   └── utils/                  # contentHelpers.js, systemsSim.js
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and **npm**

### Local Development

```bash
git clone https://github.com/Krexilor/Portfolio.git
cd Portfolio
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

Static production output is written to `dist/`.

---

## Customization Notes

- **Portfolio Content**: Edit `src/data/profile.data.js`, `src/data/about.data.js`, `src/data/projects.data.js`, `src/data/stack.data.js`, `src/data/navigation.data.js`, and `src/data/resume.data.js`.
- **Blog Articles**: Create a new post component inside `src/pages/Blog/Posts/` and register it in `src/pages/Blog/Posts/index.js`.
- **Web3Forms Key**: Update `WEB3FORMS_ACCESS_KEY` in `src/sections/Contact/Contact.jsx` and `src/pages/Resume/Resume.jsx` with your own public Web3Forms key if forking.
- **Resume PDF**: Place your PDF file in `public/resume.pdf` (or point to a hosted URL) and update `pdfHref` in `src/data/resume.data.js`.

---

## Learning & Usage Policy

This is the **personal portfolio repository of Aarav Malik (Krexilor)**. You are welcome to explore, reference, and learn from the codebase, component architecture, WebGL shader setup, CSS design tokens, and interactive Systems Lab simulators for **educational and learning purposes** under the terms of the [MIT License](./LICENSE).

If you adapt the code for your own site, please replace all personal biography text, project case studies, profile/blog imagery, resume content, and Web3Forms access keys with your own.
