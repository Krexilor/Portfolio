// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Link, useLocation } from "react-router"
import { motion, useReducedMotion } from "motion/react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import ShaderCanvas from "../../components/Common/ShaderCanvas/ShaderCanvas.jsx"

// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import notFoundImage from "../../assets/images/NotFound.png"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { wordmark } from "../../data/wordmark.data.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./NotFound.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const RECOVERY_ROUTES = [
    { index: "01", label: "Origin", path: "/#home", to: "/" },
    { index: "02", label: "Projects", path: "/#work", to: { pathname: "/", hash: "#work" } },
    { index: "03", label: "Systems Lab", path: "/#lab", to: { pathname: "/", hash: "#lab" } },
    { index: "04", label: "Engineering Blog", path: "/blog", to: "/blog" }
]

// NOT FOUND PAGE ----------------------------------------------------------------------------------------------------------------------------------|
export default function NotFound() {
    const shouldReduceMotion = useReducedMotion()
    const location = useLocation()
    const requestedPath = `${location.pathname}${location.search}${location.hash}` || "/"

    return (
        <main className = {styles.pageWrapper}>
            <ShaderCanvas />

            <div className = {`container ${styles.shell}`}>
                {/* Minimal Top Bar */}
                <header className = {styles.topBar}>
                    <Link to = "/" className = {styles.brandLink} aria-label = "Krexilor Home">
                        <svg
                            className = {styles.brandWordmark}
                            viewBox = "0 0 118 24"
                            fill = "none"
                            stroke = "currentColor"
                            strokeWidth = "3"
                            strokeLinecap = "round"
                            strokeLinejoin = "round"
                            xmlns = "http://www.w3.org/2000/svg"
                            aria-hidden = "true"
                        >
                            {wordmark.map((letter, index) => (
                                <g key = {index}>
                                    {letter.paths.map((d) => (
                                        <path
                                            key = {d}
                                            d = {d}
                                            stroke = {letter.accent ? "var(--color-accent)" : "currentColor"}
                                        />
                                    ))}
                                </g>
                            ))}
                        </svg>
                    </Link>

                    <nav className = {styles.quickNav} aria-label = "Quick recovery links">
                        <Link to = "/" className = {styles.quickLink}>Portfolio</Link>
                        <Link to = "/blog" className = {styles.quickLink}>Blog</Link>
                        <Link to = "/resume" className = {styles.quickLink}>Resume</Link>
                    </nav>
                </header>

                {/* Main Split Diagnostic Layout */}
                <motion.section
                    className = {styles.content}
                    initial = {shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                    animate = {{ opacity: 1, y: 0 }}
                    transition = {{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className = {styles.copy}>
                        <div className = {styles.codeBadge}>
                            <span className = {styles.codeDot} aria-hidden = "true" />
                            <span>404 · ERR_ROUTE_UNMAPPED</span>
                        </div>

                        <h1 className = {styles.title}>Signal lost at this endpoint.</h1>
                        <p className = {styles.description}>
                            The route you requested has no active handler in the application router, or the target resource has moved to another chapter.
                        </p>

                        {/* Requested Path Terminal Readout */}
                        <div className = {styles.traceBox} aria-label = "Requested route trace">
                            <div className = {styles.traceHeader}>
                                <span className = {styles.traceLabel}>ROUTER TRACE</span>
                                <span className = {styles.traceStatus}>HTTP 404</span>
                            </div>
                            <code className = {styles.traceCmd}>
                                <span className = {styles.traceMethod}>GET</span>{" "}
                                <span className = {styles.tracePath}>{requestedPath}</span>{" "}
                                <span className = {styles.traceArrow}>→</span>{" "}
                                <span className = {styles.traceErr}>UNMAPPED</span>
                            </code>
                        </div>

                        {/* Valid Route Recovery Grid */}
                        <div className = {styles.routesSection}>
                            <span className = {styles.routesLabel}>Valid Endpoints</span>
                            <div className = {styles.routesGrid}>
                                {RECOVERY_ROUTES.map((route) => (
                                    <Link key = {route.index} to = {route.to} className = {styles.routeTile}>
                                        <span className = {styles.routeTop}>
                                            <span className = {styles.routeIdx}>{route.index}</span>
                                            <span className = {styles.routeArrow}>↗</span>
                                        </span>
                                        <span className = {styles.routeName}>{route.label}</span>
                                        <span className = {styles.routePath}>{route.path}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className = {styles.actions}>
                            <Link to = "/" className = {styles.homeBtn}>
                                ← Return to Origin
                            </Link>
                            <Link to = "/resume" className = {styles.secondaryBtn}>
                                View Resume
                            </Link>
                        </div>
                    </div>

                    {/* Right Diagnostic Visual Frame */}
                    <figure className = {styles.artFrame}>
                        <div className = {styles.artViewport}>
                            <span className = {`${styles.corner} ${styles.cornerTl}`} aria-hidden = "true" />
                            <span className = {`${styles.corner} ${styles.cornerTr}`} aria-hidden = "true" />
                            <span className = {`${styles.corner} ${styles.cornerBl}`} aria-hidden = "true" />
                            <span className = {`${styles.corner} ${styles.cornerBr}`} aria-hidden = "true" />

                            <img
                                src = {notFoundImage}
                                alt = "Illustration of an explorer inspecting a disconnected terminal window"
                                className = {styles.artwork}
                                referrerPolicy = "no-referrer"
                            />
                        </div>

                        <figcaption className = {styles.artCaption}>
                            <span>NODE: EDGE_ROUTER</span>
                            <span>STATE: DISCONNECTED</span>
                            <span className = {styles.artCaptionAccent}>RECOVERY: READY</span>
                        </figcaption>
                    </figure>
                </motion.section>
            </div>
        </main>
    )
}
