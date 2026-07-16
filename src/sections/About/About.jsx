// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { MapPin } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './About.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import ScrollFade from '../../components/Common/Animations/ScrollFade.jsx'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { profile, socialLinks, bio, stats, languageSkills, webSkills, creativeSkills, toolSkills, currentFocus } from '../../data/about.data.js'

// VARIANT CLASS MAP -------------------------------------------------------------------------------------------------------------------------------|
const variantClass = {
    success: styles.variantSuccess,
    info: styles.variantInfo,
    warning: styles.variantWarning,
    neutral: styles.variantNeutral
}

// SKILL GROUP RENDER HELPER -----------------------------------------------------------------------------------------------------------------------|
function SkillGroup({ label, items }) {
    return (
        <div className = {styles.skillGroup}>
            <span className = {styles.groupLabel}>{label}</span>
            <div className = {styles.chipRow}>
                {items.map((skill) => (
                    <div key = {skill.name} className = {styles.chip}>
                        <img src = {skill.icon} alt = {skill.name} className = {styles.chipIcon} />
                        <span>{skill.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ABOUT SECTION -----------------------------------------------------------------------------------------------------------------------------------|
export default function AboutSection() {
    return (
        <section id = "about" className = {styles.section}>
            <div className = {styles.grid}>

                {/* Identity Card */}
                <ScrollFade className = {`${styles.card} ${styles.identityCard}`}>

                    {/* Photo + status badge */}
                    <div className = {styles.photoWrapper}>
                        <img src = {profile.photo} alt = {profile.name} className = {styles.photo} />

                        <span className = {`${styles.statusBadge} ${variantClass[profile.badge.variant]}`}>
                            <span className = {`${styles.statusDot} ${variantClass[profile.badge.variant]}`} />
                            {profile.badge.text}
                        </span>
                    </div>

                    {/* Name, role, location */}
                    <div className = {styles.identityInfo}>
                        <h2 className = {styles.name}>{profile.name}</h2>
                        <p className = {styles.role}>{profile.role}</p>

                        <div className = {styles.location}>
                            <MapPin size = {14} />
                            {profile.location}
                        </div>
                    </div>

                    <div className = {styles.divider} />

                    {/* Handle + status stats */}
                    <div className = {styles.statsList}>
                        <div className = {styles.statRow}>
                            <span className = {styles.statLabel}>Handle</span>
                            <span className = {styles.statValue}>{profile.handle}</span>
                        </div>

                        <div className = {styles.statRow}>
                            <span className = {styles.statLabel}>{profile.status.label}</span>
                            <span className = {`${styles.statValue} ${variantClass[profile.status.variant]}`}>
                                {profile.status.text}
                            </span>
                        </div>
                    </div>

                    {/* Social links */}
                    <div className = {styles.socials}>
                        <a href = {socialLinks.github} target = "_blank" rel = "noreferrer" className = {styles.socialLink}>
                            <span className = {styles.icon}>
                                <svg viewBox = "0 0 24 24" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg">
                                    <path d = "M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </span>
                            GitHub
                        </a>

                        <a href = {socialLinks.linkedin} target = "_blank" rel = "noreferrer" className = {styles.socialLink}>
                            <span className = {styles.icon}>
                                <svg viewBox = "0 0 24 24" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg">
                                    <path d = "M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.98h4.56V24H.22V8.98zM8.98 8.98h4.37v2.05h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V24h-4.56v-6.98c0-1.67-.03-3.81-2.32-3.81-2.33 0-2.69 1.82-2.69 3.7V24H8.98V8.98z" />
                                </svg>
                            </span>
                            LinkedIn
                        </a>

                        <a href = {socialLinks.x} target = "_blank" rel = "noreferrer" className = {styles.socialLink}>
                            <span className = {styles.icon}>
                                <svg viewBox = "0 0 24 24" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg">
                                    <path d = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </span>
                            Twitter
                        </a>
                    </div>
                </ScrollFade>

                {/* Info Card */}
                <ScrollFade className = {`${styles.card} ${styles.infoCard}`}>

                    {/* Hook + bio paragraphs */}
                    <div className = {styles.infoContent}>
                        <h3 className = {styles.hook}>{bio.hook}</h3>

                        <div className = {styles.divider} />

                        {bio.paragraphs.map((paragraph, index) => (
                            <p key = {index} className = {styles.paragraph}>{paragraph}</p>
                        ))}
                    </div>

                    {/* Bottom stats row */}
                    <div className = {styles.statsRow}>
                        {stats.map((stat) => (
                            <div key = {stat.caption} className = {styles.stat}>
                                <span className = {styles.statNumber}>{stat.number}</span>
                                <span className = {styles.statCaption}>{stat.caption}</span>
                            </div>
                        ))}
                    </div>
                </ScrollFade>

                {/* Skills Card */}
                <ScrollFade className = {`${styles.card} ${styles.skillsCard}`}>

                    {/* Header */}
                    <div className = {styles.skillsHeader}>
                        <h3 className = {styles.skillsTitle}>Skills & Tools</h3>
                        <p className = {styles.skillsSubtitle}>The tech stack and creative software I work with everyday.</p>
                    </div>

                    {/* Skill groups */}
                    <div className = {styles.skillsGrid}>
                        <SkillGroup label = "Languages" items = {languageSkills} />
                        <SkillGroup label = "Web & Frameworks" items = {webSkills} />
                        <SkillGroup label = "3D & Game Dev" items = {creativeSkills} />
                        <SkillGroup label = "Tools" items = {toolSkills} />
                    </div>

                    <div className = {styles.divider} />

                    {/* Current focus areas */}
                    <div className = {styles.learningSection}>
                        <div className = {styles.learningHeader}>
                            <span className = {styles.pulseDot} />
                            <span className = {styles.learningLabel}>Current Focus Areas</span>
                        </div>

                        <div className = {styles.learningGrid}>
                            {currentFocus.map((focus) => (
                                <div key = {focus.title} className = {styles.learningCard}>
                                    <img src = {focus.icon} alt = {focus.title} />
                                    <div>
                                        <h4>{focus.title}</h4>
                                        <p>{focus.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </ScrollFade>

            </div>
        </section>
    )
}
