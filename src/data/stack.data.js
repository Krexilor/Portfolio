// STACK CATEGORY METADATA -------------------------------------------------------------------------------------------------------------------------|
// Each category supports `label` (filter tab), `title` (layer heading), and optional fallback `icon` (any Lucide icon name, e.g. "Code2").
export const stackCategoryMeta = {
    languages: { label: "Languages", title: "Programming Languages", icon: "Code2" },
    systems: { label: "Systems & Net", title: "Systems & Networking", icon: "Terminal" },
    backend: { label: "Backend & DB", title: "Backend & Databases", icon: "Server" },
    tooling: { label: "Tooling", title: "Development Tools", icon: "Wrench" }
}

// STACK ITEMS DATA --------------------------------------------------------------------------------------------------------------------------------|
// Set `icon` on any skill to any Lucide icon name (PascalCase like "Flame" or kebab-case like "git-branch", see lucide.dev/icons).
export const stackItems = {
    languages: [
        {
            name: "C++",
            icon: "Cpu",
            role: "Systems & Storage",
            detail: "Used for memory-conscious storage engines, POSIX socket servers, and mutex-synchronized concurrency."
        },
        {
            name: "Python",
            icon: "Code2",
            role: "Async Services & Automation",
            detail: "Powering AsyncIO reverse proxies, FastAPI middleware, and system automation pipelines."
        },
        {
            name: "SQL",
            icon: "Table2",
            role: "Relational Modeling",
            detail: "Schema design, indexed lookups, transactional queries, and analytical reporting."
        }
    ],
    systems: [
        {
            name: "Linux",
            icon: "SquareTerminal",
            role: "Target Environment",
            detail: "Process lifecycle, file descriptors, fsync durability guarantees, and shell tooling."
        },
        {
            name: "TCP/IP & POSIX Sockets",
            icon: "Network",
            role: "Wire Transport",
            detail: "Raw socket listeners, connection handling, custom binary wire protocols, and framing."
        },
        {
            name: "Concurrency",
            icon: "Workflow",
            role: "Thread Safety",
            detail: "Granular locking with std::mutex, race-condition prevention, and non-blocking event loops."
        }
    ],
    backend: [
        {
            name: "FastAPI & HTTPX",
            icon: "Waypoints",
            role: "Async Reverse Proxy",
            detail: "High-concurrency request routing, upstream forwarding, and standard HTTP 429 enforcement."
        },
        {
            name: "Redis",
            icon: "Layers",
            role: "Atomic State & Caching",
            detail: "Pipelines, Lua scripts, Sliding Window Log sorted sets, and Token Bucket enforcement."
        },
        {
            name: "PostgreSQL",
            icon: "Database",
            role: "Persistent RDBMS",
            detail: "ACID-compliant relational storage, constraint modeling, and query optimization."
        }
    ],
    tooling: [
        {
            name: "CMake",
            icon: "Hammer",
            role: "C++ Build System",
            detail: "Cross-platform build targets, compiler warning flags, and modular C++ linking."
        },
        {
            name: "Docker",
            icon: "Container",
            role: "Container Isolation",
            detail: "Reproducible proxy and Redis multi-container environments for load and burst testing."
        },
        {
            name: "Git",
            icon: "GitBranch",
            role: "Version Control",
            detail: "Clean branch history, structured commits, and collaborative code workflows."
        }
    ]
}
