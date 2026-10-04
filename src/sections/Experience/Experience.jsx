// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './Experience.module.css'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { experiences } from '../../data/experience.data.js'

// EXPERIENCE SECTION ------------------------------------------------------------------------------------------------------------------------------|
export default function ExperienceSection() {
    return (
        <section id = "experience" className = {styles.section}>
            <div className = {styles.container}>

                <div className = {styles.card}>

                    {/* Header */}
                    <div className = {styles.header}>
                        <h2 className = {styles.title}>Experience</h2>
                        <p className = {styles.subtitle}>Where I've worked, what I've learned, and what I've shipped along the way.</p>
                    </div>

                    {/* Timeline */}
                    <div className = {styles.timeline}>
                        {experiences.map((exp) => (
                            <article key = {exp.id} className = {styles.entry}>
                                <span className = {`${styles.marker} ${exp.current ? styles.markerCurrent : ''}`} />

                                <div className = {styles.entryCard}>

                                    <div className = {styles.entryHeader}>
                                        <div className = {styles.entryTitle}>
                                            <h3 className = {styles.role}>{exp.role}</h3>
                                            <p className = {styles.company}>{exp.company}</p>
                                        </div>

                                        <span className = {`${styles.period} ${exp.current ? styles.periodCurrent : ''}`}>
                                            {exp.period}
                                        </span>
                                    </div>

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
                            </article>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    )
}
