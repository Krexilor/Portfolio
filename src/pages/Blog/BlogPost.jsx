// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { Link, useParams } from "react-router"
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react"

// POSTS -------------------------------------------------------------------------------------------------------------------------------------------|
import { blogPosts } from "./Posts/index.js"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { findBlogPostBySlug, getAdjacentBlogPosts, copyTextToClipboard } from "../../utils/contentHelpers.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./BlogPost.module.css"

// CODE BLOCK HELPER -------------------------------------------------------------------------------------------------------------------------------|
function PostCodeBlock({ title = "Implementation", code }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        const ok = await copyTextToClipboard(code)
        if (ok) {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1800)
        }
    }

    return (
        <div className = {styles.codeBlock}>
            <div className = {styles.codeHeader}>
                <span className = {styles.codeTitle}>{title}</span>
                <button
                    type = "button"
                    className = {styles.copyCodeBtn}
                    onClick = {handleCopy}
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className = {styles.codePre}>
                <code>{code}</code>
            </pre>
        </div>
    )
}

// BLOG ARTICLE PAGE --------------------------------------------------------------------------------------------------------------------------------|
export default function BlogPost() {
    const { slug } = useParams()
    const [copiedLink, setCopiedLink] = useState(false)
    const shouldReduceMotion = useReducedMotion()

    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 180,
        damping: 26,
        restDelta: 0.001
    })

    const post = findBlogPostBySlug(blogPosts, slug)
    const { prev, next } = getAdjacentBlogPosts(blogPosts, slug)

    if (!post || !post.Component) {
        return (
            <main className = {styles.pageWrapper}>
                <div className = {`container ${styles.articleContainer}`}>
                    <div className = {styles.notFoundBox}>
                        <span className = "eyebrow">Article Not Found</span>
                        <h1 className = {styles.notFoundTitle}>That engineering note does not exist.</h1>
                        <p>Browse all self-hosted technical write-ups or return to the portfolio.</p>
                        <div className = {styles.notFoundActions}>
                            <Link to = "/blog" className = {styles.primaryBtn}>
                                Browse All Articles
                            </Link>
                            <Link to = "/" className = {styles.secondaryBtn}>
                                Return Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    const handleCopyArticleUrl = async () => {
        const ok = await copyTextToClipboard(window.location.href)
        if (ok) {
            setCopiedLink(true)
            window.setTimeout(() => setCopiedLink(false), 2000)
        }
    }

    const PostComponent = post.Component
    const toc = Array.isArray(post.toc) ? post.toc : []
    const takeaways = Array.isArray(post.takeaways) ? post.takeaways : []
    const tags = Array.isArray(post.tags) ? post.tags : []

    return (
        <main className = {styles.pageWrapper}>
            {!shouldReduceMotion && (
                <motion.div
                    className = {styles.readingProgress}
                    style = {{ scaleX }}
                    aria-hidden = "true"
                />
            )}

            <motion.article
                className = {`container ${styles.articleContainer}`}
                initial = {shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate = {{ opacity: 1, y: 0 }}
                transition = {{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Breadcrumb & Metadata */}
                <div className = {styles.topBar}>
                    <Link to = "/blog" className = {styles.backLink}>
                        ← All Articles
                    </Link>

                    <div className = {styles.topRight}>
                        <div className = {styles.metaLine}>
                            <span>{post.index}</span>
                            <span aria-hidden = "true">·</span>
                            <span className = {styles.topicText}>{post.topic}</span>
                            <span aria-hidden = "true">·</span>
                            <span>{post.date}</span>
                            <span aria-hidden = "true">·</span>
                            <span>{post.readTime}</span>
                            <span aria-hidden = "true">·</span>
                            <span>By {post.author}</span>
                        </div>

                        <button
                            type = "button"
                            className = {`${styles.shareBtn} ${copiedLink ? styles.shareBtnDone : ""}`}
                            onClick = {handleCopyArticleUrl}
                        >
                            {copiedLink ? "Link Copied" : "Copy Link"}
                        </button>
                    </div>
                </div>

                {/* Article Headline */}
                <header className = {styles.header}>
                    <h1 className = {styles.title}>{post.title}</h1>
                    <p className = {styles.excerpt}>{post.excerpt}</p>
                    {tags.length > 0 && (
                        <p className = {styles.tagLine}>{tags.join(" · ")}</p>
                    )}
                </header>

                {/* Cover Visual */}
                {post.coverImage && (
                    <figure className = {styles.coverFrame}>
                        <img
                            src = {post.coverImage}
                            alt = {post.coverAlt || post.title}
                            className = {styles.coverImage}
                            referrerPolicy = "no-referrer"
                        />
                        {post.coverAlt && (
                            <figcaption className = {styles.coverCaption}>{post.coverAlt}</figcaption>
                        )}
                    </figure>
                )}

                {/* Two-Column Reading Body + Sticky Table of Contents */}
                <div className = {`${styles.readingLayout} ${toc.length <= 1 ? styles.readingLayoutSingle : ""}`}>
                    <div className = {styles.mainColumn}>
                        {/* Key Takeaways */}
                        {takeaways.length > 0 && (
                            <section className = {styles.takeawaysCard} aria-label = "Key engineering takeaways">
                                <h2 className = {styles.takeawaysLabel}>Key Takeaways</h2>
                                <ul className = {styles.takeawayList}>
                                    {takeaways.map((point, idx) => (
                                        <li key = {idx} className = {styles.takeawayItem}>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Main Article Prose */}
                        <div className = {styles.proseBody}>
                            <PostComponent CodeBlock = {PostCodeBlock} />
                        </div>
                    </div>

                    {/* Sticky Table of Contents Rail */}
                    {toc.length > 1 && (
                        <aside className = {styles.tocRail} aria-label = "Article Table of Contents">
                            <div className = {styles.tocCard}>
                                <span className = {styles.tocLabel}>On This Page</span>
                                <ol className = {styles.tocList}>
                                    {toc.map((item) => (
                                        <li key = {item.id} className = {styles.tocItem}>
                                            <a href = {`#${item.id}`} className = {styles.tocLink}>
                                                {item.heading}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </aside>
                    )}
                </div>

                {/* Adjacent Posts Navigation */}
                <nav className = {styles.adjacentNav} aria-label = "Adjacent articles">
                    {prev ? (
                        <Link to = {`/blog/${prev.slug}`} className = {styles.adjCard}>
                            <span className = {styles.adjLabel}>← Previous Article</span>
                            <span className = {styles.adjTitle}>{prev.title}</span>
                        </Link>
                    ) : (
                        <Link to = "/blog" className = {styles.adjCard}>
                            <span className = {styles.adjLabel}>← Index</span>
                            <span className = {styles.adjTitle}>Return to All Articles</span>
                        </Link>
                    )}

                    {next ? (
                        <Link to = {`/blog/${next.slug}`} className = {`${styles.adjCard} ${styles.adjCardRight}`}>
                            <span className = {styles.adjLabel}>Next Article →</span>
                            <span className = {styles.adjTitle}>{next.title}</span>
                        </Link>
                    ) : (
                        <Link to = "/#lab" className = {`${styles.adjCard} ${styles.adjCardRight}`}>
                            <span className = {styles.adjLabel}>Interactive Lab →</span>
                            <span className = {styles.adjTitle}>Explore Hash Rings &amp; Lock Contention</span>
                        </Link>
                    )}
                </nav>
            </motion.article>
        </main>
    )
}
