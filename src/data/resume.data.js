// RESUME PAGE DATA --------------------------------------------------------------------------------------------------------------------------------|
export const resumeData = {
    pdfHref: "/resume.pdf",
    pdfFilename: "Aarav_Malik_Resume.pdf",
    skills: [
        { category: "Programming Languages", items: ["C++", "Python", "SQL"] },
        { category: "Backend Development", items: ["FastAPI", "HTTPX"] },
        { category: "Systems & Networking", items: ["Linux", "TCP/IP", "Concurrency"] },
        { category: "Databases", items: ["PostgreSQL", "Redis"] },
        { category: "Development Tools", items: ["Git", "CMake", "Docker"] }
    ],
    projects: [
        {
            name: "HueForge — Color & Design System Generator",
            status: "Completed",
            stack: "React · Vite · React Router · CSS Modules · Cloudflare Pages",
            liveUrl: "https://hueforge.pages.dev/",
            bullets: [
                "Built and shipped a browser-based color system studio generating balanced 50–950 shade scales, color harmonies, and multi-stop linear/radial/conic gradients.",
                "Implemented live WCAG contrast ratio validation, color-blindness simulations, and an interactive Palette Playground for testing tokens on real UI components."
            ]
        },
        {
            name: "RedisLite — Multi-Threaded In-Memory Key-Value Store",
            status: "In Design",
            stack: "C++ · Linux · POSIX Sockets · Concurrency · CMake",
            liveUrl: "",
            bullets: [
                "Architected a high-throughput, multi-threaded key-value storage engine in C++ capable of executing custom binary wire protocol commands (GET, SET, DEL, TTL).",
                "Designed thread-safe data access using granular locking primitives (std::mutex) to safely handle concurrent client connections over raw POSIX TCP sockets.",
                "Specified an Append-Only File (AOF) persistence layer using background disk flushing (fsync) to guarantee data durability across process restarts."
            ]
        },
        {
            name: "RateGuard — Distributed API Rate Limiting Proxy",
            status: "In Design",
            stack: "Python · FastAPI · Redis · Docker · AsyncIO",
            liveUrl: "",
            bullets: [
                "Designed an asynchronous reverse proxy middleware to protect downstream microservices against traffic spikes and burst API abuse.",
                "Modeled Sliding Window Log and Token Bucket rate-limiting algorithms in Redis to enforce configured per-IP and per-token request thresholds.",
                "Specified high-concurrency request evaluation using Redis pipelines and atomic scripts, returning standard HTTP 429 status codes with dynamic Retry-After headers."
            ]
        }
    ],
    education: [
        {
            institution: "Chaudhary Charan Singh University",
            period: "2025 – Present",
            degree: "Bachelor of Computer Applications (BCA)",
            details: [
                "Currently pursuing",
                "Expected Graduation: 2028"
            ]
        }
    ],
    certificates: [
        {
            title: "Google IT Automation with Python",
            year: "2024",
            issuer: "Coursera"
        }
    ]
}
