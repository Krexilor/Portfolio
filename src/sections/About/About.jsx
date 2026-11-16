// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"

// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import profilePhoto from "../../assets/images/profile.jpeg"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Reveal from "../../components/Common/Reveal/Reveal.jsx"
import TechnicalStack from "./TechnicalStack.jsx"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { aboutIntro, aboutBio, journey } from "../../data/about.data.js"
import { profile } from "../../data/profile.data.js"
import { stackItems, stackCategoryMeta } from "../../data/stack.data.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./About.module.css"

// HELPERS -----------------------------------------------------------------------------------------------------------------------------------------|
function formatCategoryLabel(key) {
    return key.charAt(0).toUpperCase() + key.slice(1)
}

// ABOUT SECTION (CHAPTER 02) ----------------------------------------------------------------------------------------------------------------------|
export default function About() {
    const [stackFilter, setStackFilter] = useState("all")
    const shouldReduceMotion = useReducedMotion()
    const bioParagraphs = Array.isArray(aboutBio) ? aboutBio.filter(Boolean) : []
    const milestones = Array.isArray(journey) ? journey : []

    // Dynamic Stack Categories (supports 1 or many categories & items)
    const dynamicCategories = Object.entries(stackItems || {})
        .filter(([, items]) => Array.isArray(items) && items.length > 0)
        .map(([id, items]) => {
            const meta = stackCategoryMeta?.[id]
            return {
                id,
                label: meta?.label || formatCategoryLabel(id),
                title: meta?.title || formatCategoryLabel(id),
                icon: meta?.icon || "",
                items
            }
        })

    const stackFilters = dynamicCategories.length > 1
        ? [{ id: "all", label: "All Layers", count: dynamicCategories.reduce((sum, cat) => sum + cat.items.length, 0) }, ...dynamicCategories.map((cat) => ({ id: cat.id, label: cat.label, count: cat.items.length }))]
        : []

    const effectiveStackFilter = dynamicCategories.some((cat) => cat.id === stackFilter)
        ? stackFilter
        : "all"

    return (
        <section id = "about" className = {`section ${styles.sectionContainer}`}>
            <div className = "container">
                <Reveal className = "section-header">
                    <span className = "eyebrow">{aboutIntro.eyebrow}</span>
                    <h2>{aboutIntro.heading}</h2>
                </Reveal>

                <div className = {styles.grid}>
                    {/* Portrait Photo Frame */}
                    <Reveal className = {styles.frameColumn} delay = {0.06}>
                        <figure className = {styles.photoFrame}>
                            <div className = {styles.frameViewport}>
                                <span className = {`${styles.corner} ${styles.cornerTl}`} aria-hidden = "true" />
                                <span className = {`${styles.corner} ${styles.cornerTr}`} aria-hidden = "true" />
                                <span className = {`${styles.corner} ${styles.cornerBl}`} aria-hidden = "true" />
                                <span className = {`${styles.corner} ${styles.cornerBr}`} aria-hidden = "true" />

                                <motion.img
                                    src = {profilePhoto}
                                    alt = {`Portrait of ${profile.name}`}
                                    className = {styles.portraitImage}
                                    referrerPolicy = "no-referrer"
                                    whileHover = {shouldReduceMotion ? undefined : { scale: 1.03 }}
                                    transition = {{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                />
                            </div>

                            <figcaption className = {styles.frameCaption}>
                                <span className = {styles.captionTitle}>{profile.name} · {profile.alias}</span>
                                <span className = {styles.captionMeta}>{profile.role}</span>
                                <span className = {styles.captionLoc}>{profile.location}</span>
                            </figcaption>
                        </figure>
                    </Reveal>

                    {/* Story & Journey Timeline */}
                    <div className = {styles.contentColumn}>
                        {bioParagraphs.length > 0 && (
                            <Reveal
                                className = {`${styles.bioStack} ${bioParagraphs.length === 1 ? styles.bioStackSingle : ""}`}
                                delay = {0.1}
                            >
                                {bioParagraphs.map((paragraph, idx) => (
                                    <p key = {idx} className = {styles.bioText}>
                                        {paragraph}
                                    </p>
                                ))}
                            </Reveal>
                        )}

                        {milestones.length > 0 && (
                            <Reveal className = {styles.journeyBlock} delay = {0.16}>
                                <h3 className = {styles.journeyHeading}>{aboutIntro.journeyHeading}</h3>

                                <ol className = {styles.timeline}>
                                    {milestones.map((item, index) => (
                                        <motion.li
                                            key = {`${item.period}-${item.title}-${index}`}
                                            className = {styles.timelineItem}
                                            initial = {shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                                            whileInView = {{ opacity: 1, x: 0 }}
                                            viewport = {{ once: true, amount: 0.1 }}
                                            transition = {{
                                                duration: 0.36,
                                                delay: Math.min(index * 0.05, 0.2),
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                        >
                                            <div className = {styles.timelinePeriod}>{item.period}</div>
                                            <div className = {styles.timelineBody}>
                                                <h4 className = {styles.timelineTitle}>{item.title}</h4>
                                                <p className = {styles.timelineOrg}>{item.org}</p>
                                                <p className = {styles.timelineDetail}>{item.detail}</p>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ol>
                            </Reveal>
                        )}
                    </div>
                </div>

                {/* Technical Stack (moved below bio & journey in Chapter 02) */}
                {dynamicCategories.length > 0 && (
                    <Reveal delay = {0.2}>
                        <TechnicalStack
                            heading = {aboutIntro.stackHeading || "Technical Stack"}
                            dynamicCategories = {dynamicCategories}
                            stackFilters = {stackFilters}
                            effectiveStackFilter = {effectiveStackFilter}
                            onSelectFilter = {setStackFilter}
                        />
                    </Reveal>
                )}
            </div>
        </section>
    )
}
