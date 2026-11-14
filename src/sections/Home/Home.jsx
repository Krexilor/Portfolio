// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import ShaderCanvas from "../../components/Common/ShaderCanvas/ShaderCanvas.jsx"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { profile } from "../../data/profile.data.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Home.module.css"

// HOME SECTION ------------------------------------------------------------------------------------------------------------------------------------|
export default function Home() {
    const sectionRef = useRef(null)
    const shouldReduceMotion = useReducedMotion()

    const heroLead = profile.hero?.lead || profile.summary
    const shaderHint = profile.hero?.shaderHint || ""
    const focusStrip = Array.isArray(profile.hero?.focusStrip) ? profile.hero.focusStrip : []

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    })

    const heroY = useTransform(scrollYProgress, [0, 1], [0, 64])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

    return (
        <section id = "home" ref = {sectionRef} className = {styles.sectionContainer}>
            <ShaderCanvas />

            <div className = {`container ${styles.inner}`}>
                <motion.div
                    className = {styles.heroContent}
                    style = {shouldReduceMotion ? undefined : { y: heroY, opacity: heroOpacity }}
                >
                    <motion.p
                        className = {`eyebrow ${styles.eyebrow}`}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                        animate = {{ opacity: 1, y: 0 }}
                        transition = {{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {profile.name} · {profile.role}
                    </motion.p>

                    <motion.h1
                        className = {styles.headline}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                        animate = {{ opacity: 1, y: 0 }}
                        transition = {{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {profile.tagline}
                    </motion.h1>

                    <motion.p
                        className = {styles.lead}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                        animate = {{ opacity: 1, y: 0 }}
                        transition = {{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {heroLead}
                    </motion.p>

                    <motion.div
                        className = {styles.ctaRow}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                        animate = {{ opacity: 1, y: 0 }}
                        transition = {{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <a href = "#work" className = {styles.primaryBtn}>
                            Explore Work
                            <svg
                                width = "15"
                                height = "15"
                                viewBox = "0 0 16 16"
                                fill = "none"
                                stroke = "currentColor"
                                strokeWidth = "1.75"
                                strokeLinecap = "round"
                                strokeLinejoin = "round"
                                aria-hidden = "true"
                            >
                                <path d = "M3 8H13M9 4L13 8L9 12" />
                            </svg>
                        </a>

                        <a href = "#lab" className = {styles.secondaryBtn}>
                            Open Systems Lab
                        </a>
                    </motion.div>

                    {shaderHint && (
                        <motion.p
                            className = {styles.shaderHint}
                            initial = {shouldReduceMotion ? false : { opacity: 0 }}
                            animate = {{ opacity: 1 }}
                            transition = {{ duration: 0.6, delay: 0.35 }}
                        >
                            {shaderHint}
                        </motion.p>
                    )}
                </motion.div>

                {focusStrip.length > 0 && (
                    <motion.div
                        className = {styles.focusStrip}
                        style = {{ "--focus-cols": Math.min(4, focusStrip.length) }}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                        animate = {{ opacity: 1, y: 0 }}
                        transition = {{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {focusStrip.map((item, index) => (
                            <div key = {`${item.label}-${index}`} className = {styles.focusItem}>
                                <span className = {styles.focusLabel}>{item.label}</span>
                                <span className = {styles.focusValue}>{item.value}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    )
}
