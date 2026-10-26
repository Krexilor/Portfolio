// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Link } from "react-router"
import { useReducedMotion } from "motion/react"
import { useState, useEffect, useRef } from "react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { ArrowUpRight } from "../../Common/Icons/Icons.jsx"
import { BackToTopBtn } from "../../Common/Buttons/Buttons.jsx"

// HOOKS -------------------------------------------------------------------------------------------------------------------------------------------|
import useReveal from "../../../hooks/useReveal.js"
import useSpotlight from "../../../hooks/useSpotlight.js"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { wait, shuffle } from "../../../utils/helpers.js"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { profile, socials, site } from "../../../data/profile.js"
import { wordmark, WORDMARK_END } from "../../../data/wordmark.js"
import { sectionLinks, pageLinks } from "../../../data/navigation.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Footer.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const YEAR = new Date().getFullYear()

const SORT_TIMING = { scramble: 520, compare: 110, swap: 170, hold: 2600 }
const CAPTION_SORTING = "sorting… O(n²)"
const CAPTION_SORTED = "sorted. std::sort was right there."

const LETTER_ADVANCES = wordmark.map((letter, index) => (wordmark[index + 1]?.origin ?? WORDMARK_END) - letter.origin)

const getOffsets = (order) => {
    const offsets = []
    let cursor = wordmark[0].origin

    order.forEach((id) => {
        offsets[id] = cursor - wordmark[id].origin
        cursor += LETTER_ADVANCES[id]
    })

    return offsets
}

// FOOTER ------------------------------------------------------------------------------------------------------------------------------------------|
export default function Footer() {
    const traceRef = useRef(null)
    const isMounted = useRef(false)
    const isSorting = useRef(false)

    const { ref: footerRef, isInView, hasRevealed } = useReveal()
    const shouldReduceMotion = useReducedMotion()

    const [order, setOrder] = useState(() => wordmark.map((_, index) => index))
    const [activePair, setActivePair] = useState([])
    const [caption, setCaption] = useState(null)

    const offsets = getOffsets(order)

    useSpotlight(footerRef)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        const footer = footerRef.current
        const trace = traceRef.current
        if (!footer || !trace) return

        const placeNodes = () => {
            const traceBox = trace.getBoundingClientRect()

            trace.style.setProperty("--trace-width", `${traceBox.width}px`)

            footer.querySelectorAll("[data-node]").forEach((node) => {
                const box = node.getBoundingClientRect()
                const progress = (box.left + box.width / 2 - traceBox.left) / traceBox.width

                node.style.setProperty("--progress", Math.min(1, Math.max(0, progress)).toFixed(3))
            })
        }

        placeNodes()

        const observer = new ResizeObserver(placeNodes)

        observer.observe(footer)
        footer.querySelectorAll("[data-node]").forEach((node) => observer.observe(node.parentElement))

        return () => observer.disconnect()
    }, [footerRef])

    const handleSort = async () => {
        if (isSorting.current) return
        isSorting.current = true

        const sortedOrder = wordmark.map((_, index) => index)
        let shuffled = shuffle(sortedOrder)

        while (shuffled.every((id, index) => id === index)) {
            shuffled = shuffle(sortedOrder)
        }

        const pause = (ms) => wait(shouldReduceMotion ? 0 : ms)

        setOrder(shuffled)
        setCaption(CAPTION_SORTING)
        await pause(SORT_TIMING.scramble)

        const working = [...shuffled]

        for (let pass = 0; pass < working.length - 1; pass++) {
            for (let i = 0; i < working.length - 1 - pass; i++) {
                if (working[i] < working[i + 1]) continue
                if (!isMounted.current) return

                setActivePair([working[i], working[i + 1]])
                await pause(SORT_TIMING.compare)

                const temp = working[i]

                working[i] = working[i + 1]
                working[i + 1] = temp

                setOrder([...working])
                await pause(SORT_TIMING.swap)

                setActivePair([])
            }
        }

        if (!isMounted.current) return

        setCaption(CAPTION_SORTED)
        await wait(SORT_TIMING.hold)

        if (!isMounted.current) return

        setCaption(null)
        isSorting.current = false
    }

    return (
        <footer
            ref = {footerRef}
            className = {styles.footer}
            data-revealed = {hasRevealed}
            data-active = {isInView}
        >
            <div className = {styles.inner}>

                <div ref = {traceRef} className = {styles.trace} aria-hidden = "true">
                    <span className = {styles.packet} />
                </div>

                <div className = {styles.layout}>

                    {/* Brand */}
                    <div className = {`reveal ${styles.column} ${styles.brand}`}>
                        <span className = {styles.node} data-node aria-hidden = "true" />

                        <svg
                            className = {styles.wordmark}
                            viewBox = "0 0 118 24"
                            fill = "none"
                            stroke = "currentColor"
                            strokeWidth = "3"
                            strokeLinecap = "round"
                            strokeLinejoin = "round"
                            xmlns = "http://www.w3.org/2000/svg"
                            role = "img"
                            aria-label = {profile.alias}
                        >
                            {wordmark.map((letter, index) => {
                                const isDot = index === wordmark.length - 1
                                const letterClass = [
                                    styles.letter,
                                    letter.accent && styles.letterAccent,
                                    activePair.includes(index) && styles.letterActive
                                ].filter(Boolean).join(" ")

                                const paths = letter.paths.map((d) => <path key = {d} d = {d} />)

                                return (
                                    <g
                                        key = {index}
                                        className = {letterClass}
                                        style = {{ transform: `translateX(${offsets[index]}px)` }}
                                    >
                                        {isDot ? (
                                            <g className = {styles.dot} onClick = {handleSort}>
                                                <circle className = {styles.dotHit} cx = "115.5" cy = "18.7" r = "8" />
                                                {paths}
                                            </g>
                                        ) : paths}
                                    </g>
                                )
                            })}
                        </svg>

                        <p className = {styles.tagline}>{profile.tagline}</p>
                        <p className = {`${styles.caption} ${caption ? styles.captionSay : ""}`}>
                            {caption ?? profile.interests.join(" · ")}
                        </p>
                    </div>

                    {/* Landing sections */}
                    <nav className = {`reveal ${styles.column} ${styles.sections}`} aria-label = "Footer sections">
                        <span className = {styles.node} data-node aria-hidden = "true" />

                        <p className = {styles.heading}>Sections</p>
                        <ul className = {`${styles.list} ${styles.listColumns}`}>
                            {sectionLinks.map((item) => (
                                <li key = {item.hash}>
                                    <Link to = {{ pathname: "/", hash: item.hash }} className = {styles.link}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Separate pages */}
                    <nav className = {`reveal ${styles.column} ${styles.pages}`} aria-label = "Footer pages">
                        <span className = {styles.node} data-node aria-hidden = "true" />

                        <p className = {styles.heading}>Pages</p>
                        <ul className = {styles.list}>
                            {pageLinks.map((item) => (
                                <li key = {item.to}>
                                    <Link to = {item.to} className = {styles.link}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Profiles */}
                    <div className = {`reveal ${styles.column} ${styles.connect}`} role = "group" aria-label = "Connect">
                        <span className = {styles.node} data-node aria-hidden = "true" />

                        <p className = {styles.heading}>Connect</p>
                        <ul className = {styles.list}>
                            {socials.map((item) => (
                                <li key = {item.label}>
                                    <a
                                        href = {item.href}
                                        className = {styles.link}
                                        target = "_blank"
                                        rel = "noopener noreferrer"
                                    >
                                        {item.label}
                                        <ArrowUpRight className = {styles.arrow} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className = {`reveal ${styles.bottomBar}`}>
                    <small className = {`${styles.meta} ${styles.copyright}`}>© {YEAR} {profile.name}</small>
                    <small className = {`${styles.meta} ${styles.credit}`}>Built with {site.builtWith}</small>
                    <BackToTopBtn className = {styles.backToTop} />
                </div>

            </div>
        </footer>
    )
}
