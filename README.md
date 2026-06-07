<p align = "center">
  <img src = "" width = "100%" />
</p>

<p align = "center">
  <img src = "https://readme-typing-svg.herokuapp.com?lines=Loading+Portfolio...;3D+Portfolio&center=true&width=500&height=40" />
</p>

---
## ➜ Overview
> [!NOTE]
> ✨ This is an interactive 3D portfolio built to showcase my work in real-time environments.<br>
> 💫 All 3D models, assets, and visual elements are created by me unless stated otherwise.<br>
> 🌟 The project focuses on performance, smooth interaction, and immersive presentation.<br>

---
## ➜ Tech Stack
### 🎨 Rendering & 3D
- **Three.js** - Core 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Helpers and abstractions for R3F
- **Postprocessing** - Visual effects pipeline

### ⚛️ Frontend
- **React** - UI architecture
- **Framer Motion** - Animations and transitions

### 🎨 Styling
- **Tailwind CSS** - Utility-first styling

### ⚡Build & Tooling
- **Vite** - Fast development and build tool
- **vite-plugin-glsl** - Shader support

---
## ➜ Project Structure
```
Porfolio/
├── public/                                  # Static assets
├── src/                                     # Source files
│   ├── assets/                              # Global media assets
│   │   ├── images/                          # Images used across the project
│   │   │    └── branding/
|   |   |         └── Logo.png
│   │   └── models/                          # models used for 3D scenes
│   │        └── Loader.glb
│   ├── components/                          # Reusable UI components
│   │   ├── common/                          # Shared UI elements
│   │   │    ├── Cursor/
|   |   |    |    ├── Cursor.jsx
|   |   |    |    └── Cursor.module.css
│   │   │    └── PreLoader/
|   |   |         ├── PreLoader.jsx
|   |   |         └── PreLoader.module.css
│   │   └── layout/                          # Structural components
│   │        ├── Footer/
|   |        |    ├── Footer.jsx
|   |        |    └── Footer.module.css
│   │        └── Navbar/
|   |             ├── Navbar.jsx
|   |             └── Navbar.module.css
│   ├── sections/                            # Main sections    
|   |    ├── About/
|   |    |    ├── About.jsx
|   |    |    └── About.module.css
|   |    ├── Achievements/
|   |    |    ├── Achievements.jsx
|   |    |    └── Achievements.module.css
|   |    ├── Contact/
|   |    |    ├── Contact.jsx
|   |    |    └── Contact.module.css
|   |    ├── Home/
|   |    |    ├── Home.jsx
|   |    |    └── Home.module.css
|   |    ├── Process/
|   |    |    ├── Process.jsx
|   |    |    └── Process.module.css
|   |    ├── Projects/
|   |    |    ├── Projects.jsx
|   |    |    └── Projects.module.css
|   |    └── Skills/
|   |         ├── Skills.jsx
|   |         └── Skills.module.css
│   ├── shaders/                             # Custom GLSL shader files
│   │   └── PreLoader/
│   │        ├── fragment.glsl
│   │        └── vertex.glsl
│   ├── styles/                              # Global CSS or Tailwind modules
│   │   └── globals.css                      # Global CSS resets and variables
│   ├── utils/                               # Helper functions and constants
│   │   ├── helpers.js
│   │   └── preLoaderUtils.js
│   ├── App.jsx                              # Main application component
│   └── main.jsx                             # Application entry point
├── .gitignore                               # Files to ignore for git
├── index.html                               # HTML template
├── LICENSE                                  # Custom License
├── package-load.json                        # Versioned dependency tree
├── package.json                             # Project dependencies and scripts
├── README.md                                # Project documentation
└── vite.config.js                           # Vite configuration 
```

---
## ➜ Challenges Faced
### 📜 Scroll Interaction During Loading
- **Problem:** The loading screen visually blocked the UI, but the background scrolling was still active. This allowed users to scroll and reveal unfinished placeholder sections.
- **Solution:** Implemented scroll locking while the loading screen is active to fully restrict user interaction until initialization is complete.

---
## ➜ Future Improvements


---
## ➜ License
This project is protected under a custom All Rights Reserved license.

You may view and study the source code for educational purposes only. Copying, modification, redistribution, republication, or commercial use of any part of this project is prohibited without explicit written permission.

See the LICENSE file for full terms.
