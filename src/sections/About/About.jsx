// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { motion } from 'motion/react'
import { MapPin } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './About.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { GithubBtn, LinkedinBtn, XBtn } from '../../components/Common/Button/Button.jsx'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { profile, bio, stats, languageSkills, webSkills, creativeSkills, toolSkills, currentFocus } from '../../data/about.data.js'

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
                        <motion.img
                            src = {skill.icon}
                            alt = {skill.name}
                            className = {styles.chipIcon}
                            whileHover = {{ rotate: 8 }}
                            transition = {{ type: 'spring', stiffness: 300, damping: 15 }}
                        />
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
                <div className = {`${styles.card} ${styles.identityCard}`}>

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
                        <GithubBtn className = {styles.socialLink} />
                        <LinkedinBtn className = {styles.socialLink} />
                        <XBtn className = {styles.socialLink} />
                    </div>
                </div>

                {/* Info Card */}
                <div className = {`${styles.card} ${styles.infoCard}`}>

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
                </div>

                {/* Skills Card */}
                <div className = {`${styles.card} ${styles.skillsCard}`}>

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
                                    <motion.img
                                        src = {focus.icon}
                                        alt = {focus.title}
                                        whileHover = {{ y: -3 }}
                                        transition = {{ type: 'spring', stiffness: 300, damping: 15 }}
                                    />
                                    <div>
                                        <h4>{focus.title}</h4>
                                        <p>{focus.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}
