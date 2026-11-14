// STACK CATEGORY METADATA -------------------------------------------------------------------------------------------------------------------------|
export const stackCategoryMeta = {
    languages: { label: "Languages", title: "Programming Languages" },
    systems: { label: "Systems & Net", title: "Systems & Networking" },
    backend: { label: "Backend & DB", title: "Backend & Databases" },
    tooling: { label: "Tooling", title: "Development Tools" }
}

// STACK ITEMS DATA --------------------------------------------------------------------------------------------------------------------------------|
export const stackItems = {
    languages: [
        {
            name: "C++",
            role: "Systems & Storage",
            detail: "Used for memory-conscious storage engines, POSIX socket servers, and mutex-synchronized concurrency."
        },
        {
            name: "Python",
            role: "Async Services & Automation",
            detail: "Powering AsyncIO reverse proxies, FastAPI middleware, and system automation pipelines."
        },
        {
            name: "SQL",
            role: "Relational Modeling",
            detail: "Schema design, indexed lookups, transactional queries, and analytical reporting."
        }
    ],
    systems: [
        {
            name: "Linux",
            role: "Target Environment",
            detail: "Process lifecycle, file descriptors, fsync durability guarantees, and shell tooling."
        },
        {
            name: "TCP/IP & POSIX Sockets",
            role: "Wire Transport",
            detail: "Raw socket listeners, connection handling, custom binary wire protocols, and framing."
        },
        {
            name: "Concurrency",
            role: "Thread Safety",
            detail: "Granular locking with std::mutex, race-condition prevention, and non-blocking event loops."
        }
    ],
    backend: [
        {
            name: "FastAPI & HTTPX",
            role: "Async Reverse Proxy",
            detail: "High-concurrency request routing, upstream forwarding, and standard HTTP 429 enforcement."
        },
        {
            name: "Redis",
            role: "Atomic State & Caching",
            detail: "Pipelines, Lua scripts, Sliding Window Log sorted sets, and Token Bucket enforcement."
        },
        {
            name: "PostgreSQL",
            role: "Persistent RDBMS",
            detail: "ACID-compliant relational storage, constraint modeling, and query optimization."
        }
    ],
    tooling: [
        {
            name: "CMake",
            role: "C++ Build System",
            detail: "Cross-platform build targets, compiler warning flags, and modular C++ linking."
        },
        {
            name: "Docker",
            role: "Container Isolation",
            detail: "Reproducible proxy and Redis multi-container environments for load and burst testing."
        },
        {
            name: "Git",
            role: "Version Control",
            detail: "Clean branch history, structured commits, and collaborative code workflows."
        }
    ]
}
