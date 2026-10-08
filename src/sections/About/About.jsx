// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { motion, MotionConfig } from 'motion/react'
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

// MOTION VARIANTS ---------------------------------------------------------------------------------------------------------------------------------|
const ease = [0.22, 1, 0.36, 1]
const hoverSpring = { type: 'spring', stiffness: 400, damping: 20 }

const viewport = { once: true, amount: 0.15, margin: '0px 0px -10% 0px' }
const reveal = { initial: 'hidden', whileInView: 'visible', viewport }

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (order = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease, delay: order * 0.1 }
    })
}

const groupVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: (order = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease, delay: order * 0.08 }
    })
}

const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } }
}

const chipListVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
    hover: { y: -3, transition: hoverSpring }
}

const chipVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 6 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            opacity: { duration: 0.3, ease },
            default: { type: 'spring', stiffness: 320, damping: 26 }
        }
    },
    hover: { y: -3, transition: hoverSpring }
}

const chipIconVariants = {
    hover: { rotate: 8, transition: hoverSpring }
}

const focusIconVariants = {
    hover: { y: -3, transition: hoverSpring }
}

// SKILL GROUP RENDER HELPER -----------------------------------------------------------------------------------------------------------------------|
function SkillGroup({ label, items, order }) {
    return (
        <motion.div
            className = {styles.skillGroup}
            variants = {groupVariants}
            custom = {order}
            {...reveal}
        >
            <div className = {styles.groupHeader}>
                <span className = {styles.groupLabel}>{label}</span>
                <span className = {styles.groupCount}>{formatCount(items.length)}</span>
            </div>

            <motion.div
                className = {styles.chipRow}
                variants = {chipListVariants}
                {...reveal}
            >
                {items.map((skill) => (
                    <motion.div
                        key = {skill.name}
                        className = {styles.chip}
                        variants = {chipVariants}
                        whileHover = "hover"
                    >
                        <motion.img
                            src = {skill.icon}
                            alt = {skill.name}
                            className = {styles.chipIcon}
                            variants = {chipIconVariants}
                        />
                        <span>{skill.name}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

// ABOUT SECTION -----------------------------------------------------------------------------------------------------------------------------------|
export default function AboutSection() {
    return (
        <MotionConfig reducedMotion = "user">
            <section id = "about" className = {styles.section}>
                <div className = {styles.grid}>

                    {/* Identity Card */}
                    <motion.div
                        className = {`${styles.card} ${styles.identityCard}`}
                        variants = {cardVariants}
                        custom = {0}
                        {...reveal}
                    >
                        <div className = {styles.photoWrapper}>
                            <img src = {profile.photo} alt = {profile.name} className = {styles.photo} />

                            <span className = {`${styles.statusBadge} ${variantClass[profile.badge.variant]}`}>
                                <span className = {`${styles.statusDot} ${variantClass[profile.badge.variant]}`} />
                                {profile.badge.text}
                            </span>
                        </div>

                        <div className = {styles.identityInfo}>
                            <h3 className = {styles.name}>{profile.name}</h3>
                            <p className = {styles.role}>{profile.role}</p>

                            <div className = {styles.location}>
                                <MapPin size = {14} />
                                {profile.location}
                            </div>
                        </div>

                        <div className = {styles.divider} />

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

                        <div className = {styles.socials}>
                            <GithubBtn className = {styles.socialLink} />
                            <LinkedinBtn className = {styles.socialLink} />
                            <XBtn className = {styles.socialLink} />
                        </div>
                    </motion.div>

                    {/* Info Card */}
                    <motion.div
                        className = {`${styles.card} ${styles.infoCard}`}
                        variants = {cardVariants}
                        custom = {1}
                        {...reveal}
                    >
                        <div className = {styles.infoContent}>
                            <h2 className = {styles.hook}>{bio.hook}</h2>

                            <div className = {styles.divider} />

                            {bio.paragraphs.map((paragraph, index) => (
                                <p key = {index} className = {styles.paragraph}>{paragraph}</p>
                            ))}
                        </div>

                        <motion.div
                            className = {styles.stats}
                            variants = {listVariants}
                            {...reveal}
                        >
                            {stats.map((stat) => (
                                <motion.div
                                    key = {stat.caption}
                                    className = {styles.stat}
                                    variants = {itemVariants}
                                    whileHover = "hover"
                                >
                                    <span className = {styles.statNumber}>{stat.number}</span>
                                    <span className = {styles.statCaption}>{stat.caption}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Skills Card */}
                    <motion.div
                        className = {`${styles.card} ${styles.skillsCard}`}
                        variants = {cardVariants}
                        custom = {0}
                        {...reveal}
                    >
                        <div className = {styles.cardHeader}>
                            <div className = {styles.titleRow}>
                                <span className = {styles.titleIcon}><Layers size = {18} /></span>
                                <h3 className = {styles.cardTitle}>Skills & Tools</h3>
                                <span className = {styles.countPill}>{totalSkills} total</span>
                            </div>

                            <p className = {styles.subtitle}>The tech stack and creative software I work with everyday.</p>
                        </div>

                        <div className = {styles.skillMatrix}>
                            {skillGroups.map((group, index) => (
                                <SkillGroup key = {group.label} label = {group.label} items = {group.items} order = {index % 2} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Focus Card */}
                    <motion.div
                        className = {`${styles.card} ${styles.focusCard}`}
                        variants = {cardVariants}
                        custom = {1}
                        {...reveal}
                    >
                        <div className = {styles.cardHeader}>
                            <div className = {styles.titleRow}>
                                <span className = {styles.titleIcon}><Target size = {18} /></span>
                                <h3 className = {styles.cardTitle}>Current Focus</h3>
                                <span className = {styles.pulseDot} />
                            </div>

                            <p className = {styles.subtitle}>What I'm digging into right now.</p>
                        </div>

                        <motion.div
                            className = {styles.focusList}
                            variants = {listVariants}
                            {...reveal}
                        >
                            {currentFocus.map((focus, index) => (
                                <motion.div
                                    key = {focus.title}
                                    className = {styles.focusItem}
                                    variants = {itemVariants}
                                    whileHover = "hover"
                                >
                                    <div className = {styles.focusTop}>
                                        <span className = {styles.focusIcon}>
                                            <motion.img
                                                src = {focus.icon}
                                                alt = {focus.title}
                                                className = {styles.focusImage}
                                                variants = {focusIconVariants}
                                            />
                                        </span>

                                        <span className = {styles.focusIndex}>{formatCount(index + 1)}</span>
                                    </div>

                                    <div className = {styles.focusText}>
                                        <h4 className = {styles.focusTitle}>{focus.title}</h4>
                                        <p className = {styles.focusDescription}>{focus.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                </div>
            </section>
        </MotionConfig>
    )
}
