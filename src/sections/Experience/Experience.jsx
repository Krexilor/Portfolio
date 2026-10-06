// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState } from 'react'
import { Briefcase, ChevronDown, ArrowRight } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Experience.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { PrimaryBtn, LinkedinBtn } from '../../components/Common/Button/Button.jsx'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { experienceConfig, experiences } from '../../data/experience.data.js'
import { contactInfo } from '../../data/contact.data.js'
import { languageSkills, webSkills, creativeSkills, toolSkills } from '../../data/about.data.js'

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const { placeholder } = experienceConfig
const showPlaceholder = experienceConfig.showPlaceholder || experiences.length === 0
const entries = showPlaceholder ? [] : experiences

const currentRole = entries.find((exp) => exp.current)
const companyCount = new Set(entries.map((exp) => exp.company)).size
const experienceTags = [...new Set(entries.flatMap((exp) => exp.tags))]
const skillNames = [...languageSkills, ...webSkills, ...creativeSkills, ...toolSkills].map((skill) => skill.name)

const techTags = showPlaceholder ? skillNames : experienceTags
const techLabel = showPlaceholder ? placeholder.techLabel : 'Tech used'
const formatCount = (value) => String(value).padStart(2, '0')

// EXPERIENCE SECTION ------------------------------------------------------------------------------------------------------------------------------|
export default function ExperienceSection() {
    const [openId, setOpenId] = useState((currentRole || entries[0])?.id)

    const toggle = (id) => setOpenId((prev) => (prev === id ? null : id))

    const scrollToTarget = () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        document.querySelector(placeholder.ctaTarget)?.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start'
        })
    }

    return (
        <section id = "experience" className = {styles.section}>
            <div className = {styles.grid}>

                {/* Info Card */}
                <div className = {`${styles.card} ${styles.infoCard}`}>

                    <div className = {styles.infoHeader}>
                        <div className = {styles.titleRow}>
                            <span className = {styles.titleIcon}><Briefcase size = {18} /></span>
                            <h2 className = {styles.title}>Experience</h2>
                        </div>

                        <p className = {styles.subtitle}>Where I've worked, what I've learned, and what I've shipped along the way.</p>
                    </div>

                    <div className = {styles.divider} />

                    {/* Totals */}
                    <div className = {styles.stats}>
                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>{formatCount(entries.length)}</span>
                            <span className = {styles.statCaption}>Roles</span>
                        </div>

                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>{formatCount(companyCount)}</span>
                            <span className = {styles.statCaption}>Companies</span>
                        </div>

                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>{formatCount(experienceTags.length)}</span>
                            <span className = {styles.statCaption}>Tech</span>
                        </div>
                    </div>

                    {/* Current role */}
                    {(showPlaceholder || currentRole) && (
                        <div className = {styles.group}>
                            <span className = {styles.groupLabel}>Currently</span>

                            <div className = {styles.now}>
                                <span className = {styles.pulseDot} />

                                <div className = {styles.nowText}>
                                    <span className = {styles.nowRole}>
                                        {showPlaceholder ? placeholder.status : currentRole.role}
                                    </span>
                                    <span className = {styles.nowMeta}>
                                        {showPlaceholder ? placeholder.statusMeta : `${currentRole.company} · ${currentRole.period}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tech */}
                    {techTags.length > 0 && (
                        <div className = {styles.group}>
                            <span className = {styles.groupLabel}>{techLabel}</span>

                            <div className = {styles.tags}>
                                {techTags.map((tag) => (
                                    <span key = {tag} className = {styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Full history */}
                    <div className = {styles.footer}>
                        <LinkedinBtn className = {styles.profileLink} />
                    </div>

                </div>

                {/* Timeline Card */}
                <div className = {`${styles.card} ${styles.timelineCard}`}>

                    <div className = {styles.timelineHeader}>
                        <span className = {styles.groupLabel}>Career timeline</span>
                        <span className = {styles.hint}>{showPlaceholder ? placeholder.hint : 'Select a role to expand'}</span>
                    </div>

                    <ol className = {styles.timeline}>

                        {showPlaceholder && (
                            <li className = {`${styles.item} ${styles.ghostItem}`}>
                                <span className = {`${styles.marker} ${styles.markerGhost}`} />

                                <div className = {`${styles.entry} ${styles.ghostEntry}`}>

                                    <div className = {styles.ghostHeader}>
                                        <span className = {styles.entryTitle}>
                                            <span className = {styles.role}>{placeholder.role}</span>
                                            <span className = {styles.company}>{placeholder.company}</span>
                                        </span>

                                        <span className = {`${styles.period} ${styles.periodGhost}`}>{placeholder.period}</span>
                                    </div>

                                    <div className = {`${styles.panelContent} ${styles.ghostBody}`}>
                                        <p className = {styles.description}>{placeholder.message}</p>

                                        {placeholder.perks.length > 0 && (
                                            <ul className = {styles.highlights}>
                                                {placeholder.perks.map((perk, index) => (
                                                    <li key = {index} className = {styles.highlight}>{perk}</li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className = {styles.ghostActions}>
                                            <PrimaryBtn onClick = {scrollToTarget}>
                                                {placeholder.ctaLabel}
                                                <ArrowRight size = {16} />
                                            </PrimaryBtn>

                                            <a href = {`mailto:${contactInfo.email}`} className = {styles.secondaryLink}>
                                                {placeholder.secondaryLabel}
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </li>
                        )}

                        {entries.map((exp) => {
                            const isOpen = exp.id === openId

                            return (
                                <li key = {exp.id} className = {`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                                    <span className = {`${styles.marker} ${exp.current ? styles.markerCurrent : ''}`} />

                                    <div className = {styles.entry}>

                                        <button
                                            type = "button"
                                            id = {`${exp.id}-trigger`}
                                            className = {styles.trigger}
                                            onClick = {() => toggle(exp.id)}
                                            aria-expanded = {isOpen}
                                            aria-controls = {`${exp.id}-panel`}
                                        >
                                            <span className = {styles.entryTitle}>
                                                <span className = {styles.role}>{exp.role}</span>
                                                <span className = {styles.company}>{exp.company}</span>
                                            </span>

                                            <span className = {`${styles.period} ${exp.current ? styles.periodCurrent : ''}`}>
                                                {exp.period}
                                            </span>

                                            <ChevronDown size = {16} className = {styles.chevron} />
                                        </button>

                                        <div
                                            id = {`${exp.id}-panel`}
                                            className = {styles.panel}
                                            role = "region"
                                            aria-labelledby = {`${exp.id}-trigger`}
                                            aria-hidden = {!isOpen}
                                        >
                                            <div className = {styles.panelInner}>
                                                <div className = {styles.panelContent}>

                                                    <p className = {styles.description}>{exp.description}</p>

                                                    {exp.highlights.length > 0 && (
                                                        <ul className = {styles.highlights}>
                                                            {exp.highlights.map((item, index) => (
                                                                <li key = {index} className = {styles.highlight}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    {exp.tags.length > 0 && (
                                                        <div className = {styles.tags}>
                                                            {exp.tags.map((tag) => (
                                                                <span key = {tag} className = {styles.tag}>{tag}</span>
                                                            ))}
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </li>
                            )
                        })}

                    </ol>

                </div>

            </div>
        </section>
    )
}
