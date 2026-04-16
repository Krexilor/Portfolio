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
├── public/                                  # Static assets (favicons, manifest, etc.)
├── src/                                     # Source files
│   ├── assets/                              # Global media assets
│   │   ├── images/                          # Images used across the project
│   │   │    └── Logo.png
│   │   └── models/                          # models used for 3D scenes
│   │        └── Loader.glb
│   ├── components/                          # Reusable UI components (Buttons, Cards)
│   │   ├── common/                          # Shared UI elements (Cursor, Loader)
│   │   │    ├── Cursor.jsx
│   │   │    └── PreLoader.jsx
│   │   ├── forms/                           # User input components
│   │   │    └── ContactForm.jsx
│   │   └── layout/                          # Structural components (Nav, Footer)
│   │        ├── Footer.jsx
│   │        └── Navbar.jsx
│   ├── sections/                            # High-level page sections
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   └── Skills.jsx
│   ├── shaders/                             # Custom GLSL shader files
│   │   └── PreLoader/
│   │        ├── fragment.glsl
│   │        └── vertex.glsl
│   ├── styles/                              # Global CSS or Tailwind modules
│   │   ├── components/                      # Styles for specific UI components
│   │   │    ├── common/
│   │   │    │    ├── Cursor.css
│   │   │    │    └── PreLoader.css
│   │   │    ├── forms/
│   │   │    │    └── ContactForm.css
│   │   │    └── layout/
│   │   │         ├── Footer.css
│   │   │         └── Navbar.css
│   │   ├── sections/                        # Styles for main page sections
│   │   │    ├── About.css
│   │   │    ├── Contact.css
│   │   │    ├── Home.css
│   │   │    ├── Projects.css
│   │   │    └── Skills.css
│   │   └── globals.css                      # Global CSS resets and variables
│   ├── utils/                               # Helper functions and constants
│   │   ├── helpers.js
│   │   └── preLoaderUtils.js
│   ├── App.jsx                              # Main application component
│   └── main.jsx                             # Application entry point
├── .gitignore                               # Files to ignore for git
├── index.html                               # HTML template
├── LICENSE                                  # MIT License
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
=======
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
├── public/                                  # Static assets (favicons, manifest, etc.)
├── src/                                     # Source files
│   ├── assets/                              # Global media assets
│   │   ├── images/                          # Images used across the project
│   │   │    └── Logo.png
│   │   └── models/                          # models used for 3D scenes
│   │        └── Loader.glb
│   ├── components/                          # Reusable UI components (Buttons, Cards)
│   │   ├── common/                          # Shared UI elements (Cursor, Loader)
│   │   │    ├── Cursor.jsx
│   │   │    └── PreLoader.jsx
│   │   ├── forms/                           # User input components
│   │   │    └── ContactForm.jsx
│   │   └── layout/                          # Structural components (Nav, Footer)
│   │        ├── Footer.jsx
│   │        └── Navbar.jsx
│   ├── sections/                            # High-level page sections
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   └── Skills.jsx
│   ├── shaders/                             # Custom GLSL shader files
│   │   └── PreLoader/
│   │        ├── fragment.glsl
│   │        └── vertex.glsl
│   ├── styles/                              # Global CSS or Tailwind modules
│   │   ├── components/                      # Styles for specific UI components
│   │   │    ├── common/
│   │   │    │    ├── Cursor.css
│   │   │    │    └── PreLoader.css
│   │   │    ├── forms/
│   │   │    │    └── ContactForm.css
│   │   │    └── layout/
│   │   │         ├── Footer.css
│   │   │         └── Navbar.css
│   │   ├── sections/                        # Styles for main page sections
│   │   │    ├── About.css
│   │   │    ├── Contact.css
│   │   │    ├── Home.css
│   │   │    ├── Projects.css
│   │   │    └── Skills.css
│   │   └── globals.css                      # Global CSS resets and variables
│   ├── utils/                               # Helper functions and constants
│   │   ├── helpers.js
│   │   └── preLoaderUtils.js
│   ├── App.jsx                              # Main application component
│   └── main.jsx                             # Application entry point
├── .gitignore                               # Files to ignore for git
├── index.html                               # HTML template
├── LICENSE                                  # MIT License
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
