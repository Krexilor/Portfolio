// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { Link } from "react-router"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

// POSTS -------------------------------------------------------------------------------------------------------------------------------------------|
import { blogPosts } from "./Posts/index.js"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { filterBlogPosts } from "../../utils/contentHelpers.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Blog.module.css"

// HELPERS -----------------------------------------------------------------------------------------------------------------------------------------|
function parseReadMinutes(readTime) {
    const match = String(readTime || "").match(/\d+/)
    return match ? Number(match[0]) : 5
}

// BLOG INDEX PAGE ----------------------------------------------------------------------------------------------------------------------------------|
export default function Blog() {
    const [activeTopic, setActiveTopic] = useState("all")
    const shouldReduceMotion = useReducedMotion()

    const posts = Array.isArray(blogPosts) ? blogPosts : []
    const uniqueTopics = Array.from(new Set(posts.map((post) => post.topic).filter(Boolean)))

    const topicTabs = [
        { id: "all", label: "All Articles", count: posts.length },
        ...uniqueTopics.map((topic) => ({
            id: topic,
            label: topic,
            count: posts.filter((post) => post.topic === topic).length
        }))
    ]

    const effectiveTopic = topicTabs.some((t) => t.id === activeTopic) ? activeTopic : "all"
    const visiblePosts = filterBlogPosts(posts, effectiveTopic)

    const totalMinutes = posts.reduce((sum, post) => sum + parseReadMinutes(post.readTime), 0)
    const leadPost = visiblePosts.length > 0 ? visiblePosts[0] : null
    const gridPosts = visiblePosts.length > 1 ? visiblePosts.slice(1) : []

    return (
        <main className = {styles.pageWrapper}>
            <div className = {`container ${styles.shell}`}>
                {/* Editorial Hero Header */}
                <motion.header
                    className = {styles.header}
                    initial = {shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                    animate = {{ opacity: 1, y: 0 }}
                    transition = {{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link to = "/" className = {styles.backLink}>
                        ← Back to Portfolio
                    </Link>

                    <div className = {styles.titleRow}>
                        <div className = {styles.titleBlock}>
                            <span className = "eyebrow">Engineering Journal</span>
                            <h1 className = {styles.title}>Deep dives on C++ backends, networking, and AI systems.</h1>
                            <p className = {styles.subtitle}>
                                Long-form technical write-ups documenting lock striping, POSIX socket framing, crash-safe persistence, and low-latency inference gateways.
                            </p>
                        </div>

                        {posts.length > 0 && (
                            <div className = {styles.metricsStrip}>
                                <div className = {styles.metricItem}>
                                    <span className = {styles.metricLabel}>Published</span>
                                    <span className = {styles.metricValue}>
                                        {String(posts.length).padStart(2, "0")} {posts.length === 1 ? "Article" : "Articles"}
                                    </span>
                                </div>
                                <div className = {styles.metricItem}>
                                    <span className = {styles.metricLabel}>Domains</span>
                                    <span className = {styles.metricValue}>
                                        {uniqueTopics.length} {uniqueTopics.length === 1 ? "Track" : "Tracks"}
                                    </span>
                                </div>
                                <div className = {styles.metricItem}>
                                    <span className = {styles.metricLabel}>Total Reading</span>
                                    <span className = {styles.metricValue}>{totalMinutes} min</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {topicTabs.length > 1 && (
                        <div className = {styles.controlsBar}>
                            <div className = {styles.filterBar} role = "tablist" aria-label = "Filter articles by topic">
                                {topicTabs.map((topic) => {
                                    const isSelected = effectiveTopic === topic.id
                                    return (
                                        <button
                                            key = {topic.id}
                                            type = "button"
                                            role = "tab"
                                            aria-selected = {isSelected}
                                            className = {`${styles.filterBtn} ${isSelected ? styles.filterBtnActive : ""}`}
                                            onClick = {() => setActiveTopic(topic.id)}
                                        >
                                            <span>{topic.label}</span>
                                            <span className = {styles.filterCount}>{topic.count}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </motion.header>

                {/* Articles Feed */}
                <AnimatePresence mode = "wait">
                    <motion.div
                        key = {effectiveTopic}
                        className = {styles.feed}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                        animate = {{ opacity: 1, y: 0 }}
                        exit = {shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition = {{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {!leadPost ? (
                            <div className = {styles.emptyState}>
                                <p>No articles matched the selected topic.</p>
                            </div>
                        ) : (
                            <>
                                {/* Lead Featured Article (always horizontal on desktop & tablet) */}
                                <motion.article
                                    className = {styles.leadCard}
                                    whileHover = {shouldReduceMotion ? undefined : { y: -3 }}
                                    transition = {{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link to = {`/blog/${leadPost.slug}`} className = {styles.leadLink}>
                                        {leadPost.coverImage && (
                                            <div className = {styles.leadCoverWrap}>
                                                <img
                                                    src = {leadPost.coverImage}
                                                    alt = {leadPost.coverAlt || leadPost.title}
                                                    className = {styles.coverImg}
                                                    referrerPolicy = "no-referrer"
                                                />
                                            </div>
                                        )}

                                        <div className = {styles.leadBody}>
                                            <div className = {styles.metaLine}>
                                                <span className = {styles.indexNum}>{leadPost.index || "01"}</span>
                                                <span aria-hidden = "true">·</span>
                                                <span className = {styles.topicText}>{leadPost.topic}</span>
                                                <span aria-hidden = "true">·</span>
                                                <span>{leadPost.date}</span>
                                                <span aria-hidden = "true">·</span>
                                                <span>{leadPost.readTime}</span>
                                            </div>

                                            <h2 className = {styles.leadTitle}>{leadPost.title}</h2>
                                            <p className = {styles.leadExcerpt}>{leadPost.excerpt}</p>

                                            {Array.isArray(leadPost.tags) && leadPost.tags.length > 0 && (
                                                <p className = {styles.tagLine}>{leadPost.tags.join(" · ")}</p>
                                            )}

                                            {Array.isArray(leadPost.takeaways) && leadPost.takeaways.length > 0 && (
                                                <ul className = {styles.takeawayPreview}>
                                                    {leadPost.takeaways.slice(0, 2).map((point) => (
                                                        <li key = {point} className = {styles.takeawayItem}>
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <span className = {styles.readMore}>Read Full Article →</span>
                                        </div>
                                    </Link>
                                </motion.article>

                                {/* Remaining Articles Grid (adapts cleanly for 1 or many remaining posts) */}
                                {gridPosts.length > 0 && (
                                    <div className = {`${styles.grid} ${gridPosts.length === 1 ? styles.gridSingle : ""}`}>
                                        {gridPosts.map((post, index) => (
                                            <motion.article
                                                key = {post.slug}
                                                className = {styles.card}
                                                initial = {shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                                                animate = {{ opacity: 1, y: 0 }}
                                                transition = {{ duration: 0.4, delay: Math.min(index * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
                                                whileHover = {shouldReduceMotion ? undefined : { y: -4 }}
                                            >
                                                <Link
                                                    to = {`/blog/${post.slug}`}
                                                    className = {`${styles.cardLink} ${gridPosts.length === 1 ? styles.cardLinkHorizontal : ""}`}
                                                >
                                                    {post.coverImage && (
                                                        <div className = {styles.cardCoverWrap}>
                                                            <img
                                                                src = {post.coverImage}
                                                                alt = {post.coverAlt || post.title}
                                                                className = {styles.coverImg}
                                                                referrerPolicy = "no-referrer"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className = {styles.cardBody}>
                                                        <div className = {styles.metaLine}>
                                                            <span className = {styles.indexNum}>
                                                                {post.index || String(index + 2).padStart(2, "0")}
                                                            </span>
                                                            <span aria-hidden = "true">·</span>
                                                            <span className = {styles.topicText}>{post.topic}</span>
                                                            <span aria-hidden = "true">·</span>
                                                            <span>{post.date}</span>
                                                            <span aria-hidden = "true">·</span>
                                                            <span>{post.readTime}</span>
                                                        </div>

                                                        <h2 className = {styles.cardTitle}>{post.title}</h2>
                                                        <p className = {styles.cardExcerpt}>{post.excerpt}</p>

                                                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                                                            <p className = {styles.tagLine}>{post.tags.join(" · ")}</p>
                                                        )}

                                                        <span className = {styles.readMore}>Read Article →</span>
                                                    </div>
                                                </Link>
                                            </motion.article>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    )
}
