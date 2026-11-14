// PURE CONTENT FILTERING & LOOKUP HELPERS ---------------------------------------------------------------------------------------------------------|
export function filterProjects(projects, statusFilter) {
    if (!Array.isArray(projects)) return []
    if (!statusFilter || statusFilter === "all") return projects
    return projects.filter((project) => project.statusKey === statusFilter)
}

export function filterBlogPosts(posts, topicFilter) {
    if (!Array.isArray(posts)) return []
    if (!topicFilter || topicFilter === "all") return posts
    return posts.filter((post) => post.topic === topicFilter)
}

export function findBlogPostBySlug(posts, slug) {
    if (!Array.isArray(posts) || !slug) return null
    return posts.find((post) => post.slug === slug) ?? null
}

export function getAdjacentBlogPosts(posts, slug) {
    if (!Array.isArray(posts) || posts.length === 0) {
        return { prev: null, next: null }
    }
    const index = posts.findIndex((post) => post.slug === slug)
    if (index === -1) return { prev: null, next: null }
    return {
        prev: index > 0 ? posts[index - 1] : null,
        next: index < posts.length - 1 ? posts[index + 1] : null
    }
}

export async function copyTextToClipboard(text) {
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        }
    }
    catch {
        // Fallback below handles restricted contexts
    }

    try {
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        const ok = document.execCommand("copy")
        document.body.removeChild(textarea)
        return ok
    }
    catch {
        return false
    }
}
