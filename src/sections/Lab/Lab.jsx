// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Reveal from "../../components/Common/Reveal/Reveal.jsx"
import CacheSpeedLab from "./CacheSpeedLab.jsx"
import LoadBalancerLab from "./LoadBalancerLab.jsx"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Lab.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const WORKBENCH_MODES = [
    { id: "cache-lab", label: "Cache Speed Lab" },
    { id: "balancer-lab", label: "Load Balancer" }
]

// BACKEND SYSTEMS LAB SECTION (CHAPTER 04) --------------------------------------------------------------------------------------------------------|
export default function Lab() {
    const [mode, setMode] = useState("cache-lab")
    const [barSummary, setBarSummary] = useState("Shelf: 0/3 used · Tap any item")
    const shouldReduceMotion = useReducedMotion()

    return (
        <section id = "lab" className = {`section ${styles.sectionContainer}`}>
            <div className = "container">
                <Reveal className = {styles.labHeader}>
                    <div className = {styles.labTitleCol}>
                        <span className = "eyebrow">Chapter 04 · Interactive Systems Lab</span>
                        <h2>See how backends stay fast.</h2>
                    </div>
                    <p className = {styles.labSubtitle}>
                        Live visual sandboxes for memory caching and traffic routing.
                    </p>
                </Reveal>

                <Reveal delay = {0.06}>
                    <div className = {styles.workbench}>
                        <div className = {styles.workbenchBar}>
                            <div className = {styles.tabGroup} role = "tablist" aria-label = "Interactive systems playgrounds">
                                {WORKBENCH_MODES.map((item) => {
                                    const isActive = mode === item.id
                                    return (
                                        <button
                                            key = {item.id}
                                            type = "button"
                                            role = "tab"
                                            aria-selected = {isActive}
                                            className = {`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ""}`}
                                            onClick = {() => setMode(item.id)}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>

                            <span className = {styles.barTelemetry}>{barSummary}</span>
                        </div>

                        {mode === "cache-lab" ? (
                            <motion.div
                                key = "cache-lab"
                                initial = {shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                                animate = {{ opacity: 1, y: 0 }}
                                transition = {{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <CacheSpeedLab onSummaryChange = {setBarSummary} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key = "balancer-lab"
                                initial = {shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                                animate = {{ opacity: 1, y: 0 }}
                                transition = {{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <LoadBalancerLab onSummaryChange = {setBarSummary} />
                            </motion.div>
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
