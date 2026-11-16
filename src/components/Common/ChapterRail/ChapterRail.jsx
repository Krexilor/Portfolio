// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useEffect, useState } from "react"
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./ChapterRail.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const TOTAL_TICKS = 24

const CHAPTERS = [
    { tick: 0, id: "home", num: "01", label: "Origin" },
    { tick: 6, id: "about", num: "02", label: "Journey" },
    { tick: 12, id: "work", num: "03", label: "Projects" },
    { tick: 18, id: "lab", num: "04", label: "Systems Lab" },
    { tick: 24, id: "contact", num: "05", label: "Contact" }
]

const CHAPTER_BY_TICK = new Map(CHAPTERS.map((chapter) => [chapter.tick, chapter]))
const TICKS = Array.from({ length: TOTAL_TICKS + 1 }, (_, index) => index)

// PROGRESSIVE SCALE TICK --------------------------------------------------------------------------------------------------------------------------|
function ScaleTick({ index, progress, activeId, shouldReduceMotion }) {
    const chapter = CHAPTER_BY_TICK.get(index)
    const isMajor = Boolean(chapter)
    const isMedium = !isMajor && index % 3 === 0

    const threshold = index / TOTAL_TICKS
    const spanStart = Math.max(0, threshold - 0.06)

    const dynamicScaleX = useTransform(
        progress,
        index === 0 ? [0, 1] : [spanStart, threshold],
        index === 0 ? [1, 1] : [0.22, 1]
    )

    const dynamicOpacity = useTransform(
        progress,
        index === 0 ? [0, 1] : [spanStart, threshold],
        index === 0 ? [1, 1] : [0.24, isMajor ? 0.96 : isMedium ? 0.72 : 0.48]
    )

    const isActive = chapter && activeId === chapter.id

    const tickClass = isMajor
        ? styles.tickMajor
        : isMedium
            ? styles.tickMedium
            : styles.tickMinor

    if (chapter) {
        return (
            <div className = {styles.tickSlot} style = {{ top: `${threshold * 100}%` }}>
                <a
                    href = {`#${chapter.id}`}
                    className = {`${styles.chapterAnchor} ${isActive ? styles.chapterAnchorActive : ""}`}
                    aria-label = {`Chapter ${chapter.num}: ${chapter.label}`}
                    aria-current = {isActive ? "step" : undefined}
                >
                    <span className = {styles.chapterHint}>{chapter.label}</span>
                    <span className = {styles.chapterNum}>{chapter.num}</span>
                    <motion.span
                        className = {`${styles.tickBar} ${tickClass} ${isActive ? styles.tickBarActive : ""}`}
                        style = {
                            shouldReduceMotion
                                ? undefined
                                : { scaleX: dynamicScaleX, opacity: dynamicOpacity }
                        }
                    />
                </a>
            </div>
        )
    }

    return (
        <div className = {styles.tickSlot} style = {{ top: `${threshold * 100}%` }} aria-hidden = "true">
            <motion.span
                className = {`${styles.tickBar} ${tickClass}`}
                style = {
                    shouldReduceMotion
                        ? undefined
                        : { scaleX: dynamicScaleX, opacity: dynamicOpacity }
                }
            />
        </div>
    )
}

// RIGHT-EDGE SCROLL SCALE & EASTER EGG ------------------------------------------------------------------------------------------------------------|
export default function ChapterRail() {
    const [activeId, setActiveId] = useState("home")
    const [hexCode, setHexCode] = useState("0x00")
    const [unlocked, setUnlocked] = useState(false)
    const [eggOpen, setEggOpen] = useState(false)

    const shouldReduceMotion = useReducedMotion()
    const { scrollYProgress } = useScroll()

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const clamped = Math.min(1, Math.max(0, latest))
        const byte = Math.round(clamped * 255)
        const nextHex = `0x${byte.toString(16).toUpperCase().padStart(2, "0")}`
        setHexCode((prev) => (prev === nextHex ? prev : nextHex))

        if (clamped >= 0.92) {
            setUnlocked(true)
        }
    })

    useEffect(() => {
        const targets = CHAPTERS.map((ch) => document.getElementById(ch.id)).filter(Boolean)
        if (targets.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

                if (visible[0]?.target?.id) {
                    setActiveId(visible[0].target.id)
                }
            },
            {
                rootMargin: "-35% 0px -45% 0px",
                threshold: [0.1, 0.35, 0.6]
            }
        )

        targets.forEach((target) => observer.observe(target))
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!eggOpen) return
        const handleKey = (event) => {
            if (event.key === "Escape") {
                setEggOpen(false)
            }
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [eggOpen])

    const handleTriggerLatticePulse = () => {
        window.scrollTo({
            top: 0,
            behavior: shouldReduceMotion ? "auto" : "smooth"
        })

        window.setTimeout(() => {
            window.dispatchEvent(new CustomEvent("krexilor:easter-wave"))
        }, shouldReduceMotion ? 20 : 420)

        setEggOpen(false)
    }

    return (
        <aside className = {styles.scaleHost} aria-label = "Scroll calibration scale">
            <div className = {styles.ruler}>
                <div className = {styles.spine} aria-hidden = "true">
                    {!shouldReduceMotion && (
                        <motion.div className = {styles.spineFill} style = {{ scaleY: scrollYProgress }} />
                    )}
                </div>

                {TICKS.map((tickIndex) => (
                    <ScaleTick
                        key = {tickIndex}
                        index = {tickIndex}
                        progress = {scrollYProgress}
                        activeId = {activeId}
                        shouldReduceMotion = {shouldReduceMotion}
                    />
                ))}
            </div>

            <button
                type = "button"
                className = {`${styles.hexTrigger} ${unlocked ? styles.hexTriggerUnlocked : ""}`}
                onClick = {() => setEggOpen((prev) => !prev)}
                aria-expanded = {eggOpen}
                aria-label = {
                    unlocked
                        ? "0xFF full stack calibrated. Inspect calibration easter egg"
                        : `Current scroll byte ${hexCode}. Click to inspect scale status`
                }
                data-testid = "scale-easter-egg"
            >
                {hexCode}
            </button>

            {eggOpen && (
                <div className = {styles.eggPopover} role = "dialog" aria-label = "Scroll scale calibration readout">
                    <div className = {styles.eggHeader}>
                        <span className = {styles.eggTitle}>
                            {unlocked ? "0xFF · Stack Calibrated" : `${hexCode} / 0xFF · Calibrating`}
                        </span>
                        <button
                            type = "button"
                            className = {styles.eggClose}
                            onClick = {() => setEggOpen(false)}
                            aria-label = "Close calibration readout"
                        >
                            ×
                        </button>
                    </div>

                    <p className = {styles.eggBody}>
                        {unlocked
                            ? "All 25 graduation ticks traversed from 0x00 origin to 0xFF terminal. Trigger a harmonic pulse across the hero signal lattice."
                            : "Scroll down to build every graduation tick to 0xFF and unlock the harmonic lattice pulse."}
                    </p>

                    {unlocked && (
                        <button
                            type = "button"
                            className = {styles.eggAction}
                            onClick = {handleTriggerLatticePulse}
                            data-testid = "scale-easter-pulse"
                        >
                            Pulse Signal at 0x00
                        </button>
                    )}
                </div>
            )}
        </aside>
    )
}
