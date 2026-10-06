// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { motion } from 'motion/react'
import { MapPin, Layers, Target } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './About.module.css'

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { GithubBtn, LinkedinBtn, XBtn } from '../../components/Common/Button/Button.jsx'

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { profile, bio, stats, languageSkills, webSkills, creativeSkills, toolSkills, currentFocus } from '../../data/about.data.js'

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const skillGroups = [
    { label: 'Languages', items: languageSkills },
    { label: 'Web & Frameworks', items: webSkills },
    { label: '3D & Game Dev', items: creativeSkills },
    { label: 'Tools', items: toolSkills }
]

const totalSkills = skillGroups.reduce((sum, group) => sum + group.items.length, 0)
const formatCount = (value) => String(value).padStart(2, '0')

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
            <div className = {styles.groupHeader}>
                <span className = {styles.groupLabel}>{label}</span>
                <span className = {styles.groupCount}>{formatCount(items.length)}</span>
            </div>

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
                        <h3 className = {styles.name}>{profile.name}</h3>
                        <p className = {styles.role}>{profile.role}</p>

                        <div className = {styles.location}>
                            <MapPin size = {14} />
                            {profile.location}
                        </div>
                    </div>

                    <div className = {styles.divider} />

                    {/* Handle + status */}
                    <div className = {styles.detailList}>
                        <div className = {styles.detailRow}>
                            <span className = {styles.detailLabel}>Handle</span>
                            <span className = {styles.detailValue}>{profile.handle}</span>
                        </div>

                        <div className = {styles.detailRow}>
                            <span className = {styles.detailLabel}>{profile.status.label}</span>
                            <span className = {`${styles.detailValue} ${variantClass[profile.status.variant]}`}>
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
                        <h2 className = {styles.hook}>{bio.hook}</h2>

                        <div className = {styles.divider} />

                        {bio.paragraphs.map((paragraph, index) => (
                            <p key = {index} className = {styles.paragraph}>{paragraph}</p>
                        ))}
                    </div>

                    {/* Stat tiles */}
                    <div className = {styles.stats}>
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

                    <div className = {styles.cardHeader}>
                        <div className = {styles.titleRow}>
                            <span className = {styles.titleIcon}><Layers size = {18} /></span>
                            <h3 className = {styles.cardTitle}>Skills & Tools</h3>
                            <span className = {styles.countPill}>{totalSkills} total</span>
                        </div>

                        <p className = {styles.subtitle}>The tech stack and creative software I work with everyday.</p>
                    </div>

                    <div className = {styles.skillMatrix}>
                        {skillGroups.map((group) => (
                            <SkillGroup key = {group.label} label = {group.label} items = {group.items} />
                        ))}
                    </div>

                </div>

                {/* Focus Card */}
                <div className = {`${styles.card} ${styles.focusCard}`}>

                    <div className = {styles.cardHeader}>
                        <div className = {styles.titleRow}>
                            <span className = {styles.titleIcon}><Target size = {18} /></span>
                            <h3 className = {styles.cardTitle}>Current Focus</h3>
                            <span className = {styles.pulseDot} />
                        </div>

                        <p className = {styles.subtitle}>What I'm digging into right now.</p>
                    </div>

                    <div className = {styles.focusList}>
                        {currentFocus.map((focus, index) => (
                            <div key = {focus.title} className = {styles.focusItem}>

                                <div className = {styles.focusTop}>
                                    <span className = {styles.focusIcon}>
                                        <motion.img
                                            src = {focus.icon}
                                            alt = {focus.title}
                                            className = {styles.focusImage}
                                            whileHover = {{ y: -3 }}
                                            transition = {{ type: 'spring', stiffness: 300, damping: 15 }}
                                        />
                                    </span>

                                    <span className = {styles.focusIndex}>{formatCount(index + 1)}</span>
                                </div>

                                <div className = {styles.focusText}>
                                    <h4 className = {styles.focusTitle}>{focus.title}</h4>
                                    <p className = {styles.focusDescription}>{focus.description}</p>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    )
}
