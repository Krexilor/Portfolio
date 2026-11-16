// PURE HELPERS FOR INTERACTIVE TECHNICAL STACK VISUALS --------------------------------------------------------------------------------------------|
export function getSkillKey(categoryId, itemName) {
    return `${categoryId}::${String(itemName || "").trim().toLowerCase()}`
}

export function normalizeLucideIconName(iconName = "") {
    const raw = String(iconName || "").trim()
    if (!raw) return ""
    return raw
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase()
}

export function getCategoryFallbackIconKey(categoryId = "", categoryIcon = "") {
    const explicitCategoryIcon = normalizeLucideIconName(categoryIcon)
    if (explicitCategoryIcon) return explicitCategoryIcon
    if (categoryId === "languages") return "code-2"
    if (categoryId === "systems") return "terminal"
    if (categoryId === "backend") return "server"
    if (categoryId === "tooling") return "wrench"
    return "box"
}

export function resolveSkillIconKey(itemOrName = "", categoryId = "", categoryIcon = "") {
    if (itemOrName && typeof itemOrName === "object") {
        const explicitIcon = normalizeLucideIconName(itemOrName.icon)
        if (explicitIcon) return explicitIcon
        return resolveSkillIconKey(itemOrName.name || "", categoryId, categoryIcon)
    }

    const normalized = String(itemOrName || "").toLowerCase()
    if (normalized.includes("c++") || normalized.includes("cpp")) return "cpu"
    if (normalized.includes("python")) return "code-2"
    if (normalized.includes("sql") && !normalized.includes("postgres")) return "table-2"
    if (normalized.includes("linux")) return "square-terminal"
    if (normalized.includes("tcp") || normalized.includes("socket")) return "network"
    if (normalized.includes("concurrency") || normalized.includes("mutex") || normalized.includes("thread")) return "workflow"
    if (normalized.includes("fastapi") || normalized.includes("httpx") || normalized.includes("proxy")) return "waypoints"
    if (normalized.includes("redis")) return "layers"
    if (normalized.includes("postgres")) return "database"
    if (normalized.includes("cmake")) return "hammer"
    if (normalized.includes("docker") || normalized.includes("container")) return "container"
    if (normalized.includes("git")) return "git-branch"

    return getCategoryFallbackIconKey(categoryId, categoryIcon)
}

export function flattenStackEntries(dynamicCategories = []) {
    const entries = []
    for (const cat of dynamicCategories) {
        if (!Array.isArray(cat.items)) continue
        const fallbackIconKey = getCategoryFallbackIconKey(cat.id, cat.icon)
        cat.items.forEach((item, index) => {
            entries.push({
                key: getSkillKey(cat.id, item.name),
                categoryId: cat.id,
                categoryLabel: cat.label,
                categoryTitle: cat.title,
                indexInCategory: index,
                iconKey: resolveSkillIconKey(item, cat.id, cat.icon),
                fallbackIconKey,
                item
            })
        })
    }
    return entries
}

export function resolveActiveSkillEntry(entries = [], selectedKey = null, activeFilter = "all") {
    if (!entries.length) return null
    const pool = activeFilter === "all"
        ? entries
        : entries.filter((entry) => entry.categoryId === activeFilter)

    const effectivePool = pool.length ? pool : entries
    const found = effectivePool.find((entry) => entry.key === selectedKey)
    return found || effectivePool[0]
}

export function stepActiveSkillEntry(entries = [], currentKey = null, delta = 1, activeFilter = "all") {
    const pool = activeFilter === "all"
        ? entries
        : entries.filter((entry) => entry.categoryId === activeFilter)

    const effectivePool = pool.length ? pool : entries
    if (!effectivePool.length) return null

    const idx = effectivePool.findIndex((entry) => entry.key === currentKey)
    if (idx === -1) return effectivePool[0]
    const nextIdx = (idx + delta + effectivePool.length) % effectivePool.length
    return effectivePool[nextIdx]
}

// Computes architectural layer coordinates & links across dynamic categories for the Stack Blueprint
export function buildStackBlueprintData(dynamicCategories = [], activeFilter = "all", selectedKey = null) {
    const layers = dynamicCategories.map((cat, idx) => {
        const isHighlighted = activeFilter === "all" || activeFilter === cat.id
        const isFocusedLayer = activeFilter === cat.id || cat.items.some((item) => getSkillKey(cat.id, item.name) === selectedKey)
        const fallbackIconKey = getCategoryFallbackIconKey(cat.id, cat.icon)
        return {
            id: cat.id,
            layerNumber: String(idx + 1).padStart(2, "0"),
            label: cat.label,
            title: cat.title,
            isHighlighted,
            isFocusedLayer,
            nodes: cat.items.map((item) => {
                const key = getSkillKey(cat.id, item.name)
                return {
                    key,
                    name: item.name,
                    role: item.role,
                    detail: item.detail,
                    iconKey: resolveSkillIconKey(item, cat.id, cat.icon),
                    fallbackIconKey,
                    isSelected: key === selectedKey
                }
            })
        }
    })

    return {
        layers,
        totalSkills: layers.reduce((sum, l) => sum + l.nodes.length, 0)
    }
}
