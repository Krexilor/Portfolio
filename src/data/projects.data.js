// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import placeholderImage from "../assets/images/placeholder.png"

// PROJECTS DATA ------------------------------------------------------------------------------------------------------------------------------------|
export const projects = [
    {
        id: "hueforge",
        index: "01",
        title: "HueForge",
        tagline: "Color & Design System Generator",
        status: "Completed",
        statusKey: "completed",
        category: "Developer Tooling",
        year: "2025",
        summary: "A browser-based design system generator that turns a single brand color into calibrated 50–950 shade scales, color harmonies, draggable multi-stop gradients, WCAG contrast audits, and live component previews.",
        stack: ["React", "Vite", "React Router", "CSS Modules", "Cloudflare Pages"],
        image: placeholderImage,
        imageAlt: "HueForge project preview",
        highlights: [
            "Generates balanced 50–950 lightness shade scales and explores analogous, triad, and split-complementary harmonies on an interactive color wheel.",
            "Includes a Gradient Studio supporting linear, radial, and conic gradients alongside real-time WCAG contrast checks and color-blindness simulations.",
            "Built and shipped as a fast single-page application with a live Palette Playground for validating tokens directly on UI components."
        ],
        liveUrl: "https://hueforge.pages.dev/",
        repoUrl: "https://github.com/Krexilor/HueForge/"
    },
    {
        id: "redislite",
        index: "02",
        title: "RedisLite",
        tagline: "Multi-Threaded In-Memory Key-Value Store",
        status: "In Design",
        statusKey: "planned",
        category: "Systems & Storage",
        year: "2026",
        summary: "A multi-threaded key-value storage engine architecture in C++ designed to parse custom binary wire protocol commands over raw POSIX TCP sockets with durable Append-Only File persistence.",
        stack: ["C++", "Linux", "POSIX Sockets", "Concurrency", "CMake"],
        image: placeholderImage,
        imageAlt: "RedisLite project preview",
        highlights: [
            "Target architecture executes binary wire protocol frames (GET, SET, DEL, TTL) over non-blocking POSIX TCP socket listeners.",
            "Designed around granular std::mutex locking scopes to isolate hash-table mutations from network socket I/O.",
            "Specifies an Append-Only File (AOF) persistence pipeline using background fsync() flushing for crash recovery across restarts."
        ],
        liveUrl: "",
        repoUrl: "https://github.com/Krexilor"
    },
    {
        id: "rateguard",
        index: "03",
        title: "RateGuard",
        tagline: "Distributed API Rate Limiting Proxy",
        status: "In Design",
        statusKey: "planned",
        category: "Backend & Networking",
        year: "2026",
        summary: "An asynchronous reverse proxy middleware specification engineered to shield downstream microservices against traffic spikes and burst API abuse using atomic Redis evaluation.",
        stack: ["Python", "FastAPI", "Redis", "Docker", "AsyncIO"],
        image: placeholderImage,
        imageAlt: "RateGuard project preview",
        highlights: [
            "Middleware architecture enforces per-IP and per-token thresholds via Sliding Window Log and Token Bucket algorithms.",
            "Designed to evaluate concurrent traffic through Redis pipelines and atomic Lua scripts without cross-worker race conditions.",
            "Emits standard HTTP 429 Too Many Requests responses paired with dynamically calculated Retry-After headers."
        ],
        liveUrl: "",
        repoUrl: "https://github.com/Krexilor"
    }
]
