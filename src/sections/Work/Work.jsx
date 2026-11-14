// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import Modal from "../../components/Common/Modal/Modal.jsx"
import Reveal from "../../components/Common/Reveal/Reveal.jsx"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { projects } from "../../data/projects.data.js"

// UTILS -------------------------------------------------------------------------------------------------------------------------------------------|
import { filterProjects } from "../../utils/contentHelpers.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Work.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const PROJECT_FILTERS = [
    { id: "all", label: "All Projects" },
    { id: "completed", label: "Completed" },
    { id: "planned", label: "In Design" }
]

// WORK SECTION ------------------------------------------------------------------------------------------------------------------------------------|
export default function Work() {
    const [activeFilter, setActiveFilter] = useState("all")
    const [selectedProject, setSelectedProject] = useState(null)
    const shouldReduceMotion = useReducedMotion()

    const allProjects = Array.isArray(projects) ? projects : []
    const visibleProjects = filterProjects(allProjects, activeFilter)

    const filterCounts = {
        all: allProjects.length,
        completed: filterProjects(allProjects, "completed").length,
        planned: filterProjects(allProjects, "planned").length
    }

    return (
        <section id = "work" className = {`section ${styles.sectionContainer}`}>
            <div className = "container">
                <div className = {styles.headerRow}>
                    <Reveal className = "section-header">
                        <span className = "eyebrow">Chapter 03 · Projects &amp; Architecture</span>
                        <h2>Completed builds and systems in design.</h2>
                        <p>
                            A unified showcase tracking shipped developer tools alongside low-level systems architectures currently being engineered.
                        </p>
                    </Reveal>

                    <div className = {styles.filterBar} role = "tablist" aria-label = "Filter projects by status">
                        {PROJECT_FILTERS.map((filter) => {
                            const selected = activeFilter === filter.id
                            return (
                                <button
                                    key = {filter.id}
                                    type = "button"
                                    role = "tab"
                                    aria-selected = {selected}
                                    className = {`${styles.filterBtn} ${selected ? styles.filterBtnActive : ""}`}
                                    onClick = {() => setActiveFilter(filter.id)}
                                >
                                    <span>{filter.label}</span>
                                    <span className = {styles.filterCount}>{filterCounts[filter.id]}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <AnimatePresence mode = "wait">
                    <motion.div
                        key = {activeFilter}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                        animate = {{ opacity: 1, y: 0 }}
                        exit = {shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition = {{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {visibleProjects.length === 0 ? (
                            <div className = {styles.emptyState}>
                                <p>No projects currently match this status filter.</p>
                            </div>
                        ) : (
                            <div className = {styles.grid}>
                                {visibleProjects.map((project, index) => {
                                    const stackList = Array.isArray(project.stack) ? project.stack : []
                                    return (
                                        <motion.article
                                            key = {project.id || `${project.title}-${index}`}
                                            className = {styles.card}
                                            initial = {shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                                            whileInView = {{ opacity: 1, y: 0 }}
                                            viewport = {{ once: true, amount: 0.15 }}
                                            transition = {{
                                                duration: 0.45,
                                                delay: Math.min((index % 3) * 0.08, 0.3),
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                            whileHover = {shouldReduceMotion ? undefined : { y: -4 }}
                                        >
                                            {project.image && (
                                                <div className = {styles.cardMedia}>
                                                    <img
                                                        src = {project.image}
                                                        alt = {project.imageAlt || `${project.title} preview`}
                                                        className = {styles.cardImage}
                                                        referrerPolicy = "no-referrer"
                                                    />
                                                </div>
                                            )}

                                            <div className = {styles.cardBody}>
                                                <div className = {styles.metaLine}>
                                                    <span className = {styles.indexNum}>
                                                        {project.index || String(index + 1).padStart(2, "0")}
                                                    </span>
                                                    <span aria-hidden = "true">·</span>
                                                    <span
                                                        className = {
                                                            project.statusKey === "completed"
                                                                ? styles.statusCompleted
                                                                : styles.statusPlanned
                                                        }
                                                    >
                                                        {project.status}
                                                    </span>
                                                    {project.category && (
                                                        <>
                                                            <span aria-hidden = "true">·</span>
                                                            <span>{project.category}</span>
                                                        </>
                                                    )}
                                                    {project.year && (
                                                        <>
                                                            <span aria-hidden = "true">·</span>
                                                            <span>{project.year}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <div className = {styles.titleGroup}>
                                                    <h3 className = {styles.cardTitle}>{project.title}</h3>
                                                    {project.tagline && (
                                                        <p className = {styles.cardTagline}>{project.tagline}</p>
                                                    )}
                                                </div>

                                                <p className = {styles.cardSummary}>{project.summary}</p>

                                                {stackList.length > 0 && (
                                                    <p className = {styles.stackLine}>{stackList.join(" · ")}</p>
                                                )}

                                                <div className = {styles.cardFooter}>
                                                    <button
                                                        type = "button"
                                                        className = {styles.inspectBtn}
                                                        onClick = {() => setSelectedProject(project)}
                                                    >
                                                        Inspect Details
                                                    </button>

                                                    <div className = {styles.extLinks}>
                                                        {project.liveUrl && (
                                                            <a
                                                                href = {project.liveUrl}
                                                                target = "_blank"
                                                                rel = "noreferrer"
                                                                className = {styles.liveLink}
                                                            >
                                                                Live App ↗
                                                            </a>
                                                        )}
                                                        {project.repoUrl && (
                                                            <a
                                                                href = {project.repoUrl}
                                                                target = "_blank"
                                                                rel = "noreferrer"
                                                                className = {styles.repoLink}
                                                            >
                                                                GitHub ↗
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Uniform Project Modal */}
            <Modal
                isOpen = {Boolean(selectedProject)}
                onClose = {() => setSelectedProject(null)}
                eyebrow = {
                    selectedProject
                        ? [selectedProject.index, selectedProject.status, selectedProject.category].filter(Boolean).join(" · ")
                        : ""
                }
                title = {
                    selectedProject
                        ? [selectedProject.title, selectedProject.tagline].filter(Boolean).join(" — ")
                        : ""
                }
            >
                {selectedProject && (
                    <div className = {styles.modalContent}>
                        <p className = {styles.modalSummary}>{selectedProject.summary}</p>

                        {Array.isArray(selectedProject.highlights) && selectedProject.highlights.length > 0 && (
                            <div className = {styles.modalBlock}>
                                <h4 className = {styles.modalSubheading}>Key Engineering Highlights</h4>
                                <ul className = {styles.highlightList}>
                                    {selectedProject.highlights.map((bullet, idx) => (
                                        <li key = {idx} className = {styles.highlightItem}>
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className = {styles.modalFooter}>
                            <span className = {styles.stackLine}>
                                {Array.isArray(selectedProject.stack) ? selectedProject.stack.join(" · ") : ""}
                            </span>

                            <div className = {styles.extLinks}>
                                {selectedProject.liveUrl && (
                                    <a
                                        href = {selectedProject.liveUrl}
                                        target = "_blank"
                                        rel = "noreferrer"
                                        className = {styles.primaryModalBtn}
                                    >
                                        Open Live App ↗
                                    </a>
                                )}
                                {selectedProject.repoUrl && (
                                    <a
                                        href = {selectedProject.repoUrl}
                                        target = "_blank"
                                        rel = "noreferrer"
                                        className = {styles.inspectBtn}
                                    >
                                        GitHub Profile ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    )
}
