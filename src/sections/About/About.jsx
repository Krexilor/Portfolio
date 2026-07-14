// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { MapPin } from 'lucide-react'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from './About.module.css'

// ASSETS ------------------------------------------------------------------------------------------------------------------------------------------|
import ProfileImg from '../../assets/images/Profile.jpeg'

import CIcon from '../../assets/Icons/C.png'
import CppIcon from '../../assets/Icons/C++.png'
import GitIcon from '../../assets/Icons/Git.png'
import ViteIcon from '../../assets/Icons/Vite.png'
import JavaIcon from '../../assets/Icons/Java.png'
import KritaIcon from '../../assets/Icons/Krita.png'
import Html5Icon from '../../assets/Icons/HTML5.png'
import ReactIcon from '../../assets/Icons/React.png'
import PythonIcon from '../../assets/Icons/Python.png'
import BlenderIcon from '../../assets/Icons/Blender.png'
import UnrealIcon from '../../assets/Icons/UnrealEngine.png'
import JavaScriptIcon from '../../assets/Icons/JavaScript.png'

// COMPONENTS ----------------------------------------------------------------------------------------------------------------------------------------|
import ScrollFade from '../../components/Common/Animations/ScrollFade.jsx'

// PROFILE CONFIG --------------------------------------------------------------------------------------------------------------------------------------|
const profileConfig = {
    name: 'Aarav Malik',
    role: 'Self-taught dev, currently deep in C++',
    location: 'Delhi, India',
    badge: {
        text: 'Open to opportunities',
        variant: 'success'                                 // success, info, warning, neutral
    },
    status: {
        label: 'Status',
        text: 'Currently learning',
        variant: 'success'
    }
}

// SKILL DATA ----------------------------------------------------------------------------------------------------------------------------------------|
const languageSkills = [
    { icon: CIcon, name: 'C' },
    { icon: CppIcon, name: 'C++' },
    { icon: PythonIcon, name: 'Python' },
    { icon: JavaIcon, name: 'Java' },
    { icon: JavaScriptIcon, name: 'JavaScript' },
    { icon: Html5Icon, name: 'HTML5' }
]

const webSkills = [
    { icon: ReactIcon, name: 'React' },
    { icon: ViteIcon, name: 'Vite' }
]

const creativeSkills = [
    { icon: BlenderIcon, name: 'Blender' },
    { icon: UnrealIcon, name: 'Unreal Engine' },
    { icon: KritaIcon, name: 'Krita' }
]

const toolSkills = [
    { icon: GitIcon, name: 'Git' }
]

// VARIANT CLASS MAP -----------------------------------------------------------------------------------------------------------------------------------|
const variantClass = {
    success: styles.variantSuccess,
    info: styles.variantInfo,
    warning: styles.variantWarning,
    neutral: styles.variantNeutral
}

// ABOUT SECTION -------------------------------------------------------------------------------------------------------------------------------------|
export default function AboutSection() {
    return (
        <section id = "about" className = {styles.section}>
            <div className = {styles.grid}>

                {/* Identity Card */}
                <ScrollFade className = {`${styles.card} ${styles.identityCard}`}>

                    {/* Photo + status badge */}
                    <div className = {styles.photoWrapper}>
                        <img src = {ProfileImg} alt = {profileConfig.name} className = {styles.photo} />

                        <span className = {`${styles.statusBadge} ${variantClass[profileConfig.badge.variant]}`}>
                            <span className = {`${styles.statusDot} ${variantClass[profileConfig.badge.variant]}`} />
                            {profileConfig.badge.text}
                        </span>
                    </div>

                    {/* Name, role, location */}
                    <div className = {styles.identityInfo}>
                        <h2 className = {styles.name}>{profileConfig.name}</h2>
                        <p className = {styles.role}>{profileConfig.role}</p>

                        <div className = {styles.location}>
                            <MapPin size = {14} />
                            {profileConfig.location}
                        </div>
                    </div>

                    <div className = {styles.divider} />

                    {/* Handle + status stats */}
                    <div className = {styles.statsList}>
                        <div className = {styles.statRow}>
                            <span className = {styles.statLabel}>Handle</span>
                            <span className = {styles.statValue}>@Krexilor</span>
                        </div>

                        <div className = {styles.statRow}>
                            <span className = {styles.statLabel}>{profileConfig.status.label}</span>
                            <span className = {`${styles.statValue} ${variantClass[profileConfig.status.variant]}`}>
                                {profileConfig.status.text}
                            </span>
                        </div>
                    </div>

                    {/* Social links */}
                    <div className = {styles.socials}>
                        <a href = "https://github.com/Krexilor" target = "_blank" rel = "noreferrer" className = {styles.socialLink}>
                            <span className = {styles.icon}>
                                <svg viewBox = "0 0 24 24" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg">
                                    <path d = "M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </span>
                            GitHub
                        </a>

                        <a href = "https://linkedin.com/" target = "_blank" rel = "noreferrer" className = {styles.socialLink}>
                            <span className = {styles.icon}>
                                <svg viewBox = "0 0 24 24" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg">
                                    <path d = "M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.98h4.56V24H.22V8.98zM8.98 8.98h4.37v2.05h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V24h-4.56v-6.98c0-1.67-.03-3.81-2.32-3.81-2.33 0-2.69 1.82-2.69 3.7V24H8.98V8.98z" />
                                </svg>
                            </span>
                            LinkedIn
                        </a>

                        <a href = "https://x.com/krexilor" target = "_blank" rel = "noreferrer" className = {styles.socialLink}>
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
                        <h3 className = {styles.hook}>
                            Started out in Blender and Unreal Engine, ended up falling into code — right now I'm all in on C++.
                        </h3>

                        <div className = {styles.divider} />

                        <p className = {styles.paragraph}>
                            Hey, I'm Aarav — most places online you'll find me as Krexilor though. I got into tech through 3D and
                            game stuff first (Blender, Unreal Engine), picked up bits of Python and C along the way, and now I'm
                            properly learning C++, which I'm aiming to make my main thing.
                        </p>

                        <p className = {styles.paragraph}>
                            This site's basically part of that whole process — built it with React and Vite while figuring things
                            out as I go. Still learning, still building, and always down to talk code, game dev, or 3D stuff if
                            you're into any of that.
                        </p>

                        <p className = {styles.paragraph}>
                            Outside of code, I spend a lot of time in Blender and Unreal Engine messing around with 3D and small
                            game ideas — that's actually what pulled me toward programming in the first place. I keep going back
                            and forth between the two, and honestly I think that mix is what keeps things interesting for me.
                        </p>
                    </div>

                    {/* Bottom stats row */}
                    <div className = {styles.statsRow}>
                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>00</span>
                            <span className = {styles.statCaption}>Months of Experience</span>
                        </div>

                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>03</span>
                            <span className = {styles.statCaption}>Technologies Learned</span>
                        </div>

                        <div className = {styles.stat}>
                            <span className = {styles.statNumber}>01</span>
                            <span className = {styles.statCaption}>Projects Completed</span>
                        </div>
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

                        <div className = {styles.skillGroup}>
                            <span className = {styles.groupLabel}>Languages</span>
                            <div className = {styles.chipRow}>
                                {languageSkills.map((skill) => (
                                    <ScrollFade key = {skill.name} distance = {16} className = {styles.chip}>
                                        <img src = {skill.icon} alt = {skill.name} className = {styles.chipIcon} />
                                        <span>{skill.name}</span>
                                    </ScrollFade>
                                ))}
                            </div>
                        </div>

                        <div className = {styles.skillGroup}>
                            <span className = {styles.groupLabel}>Web & Frameworks</span>
                            <div className = {styles.chipRow}>
                                {webSkills.map((skill) => (
                                    <ScrollFade key = {skill.name} distance = {16} className = {styles.chip}>
                                        <img src = {skill.icon} alt = {skill.name} className = {styles.chipIcon} />
                                        <span>{skill.name}</span>
                                    </ScrollFade>
                                ))}
                            </div>
                        </div>

                        <div className = {styles.skillGroup}>
                            <span className = {styles.groupLabel}>3D & Game Dev</span>
                            <div className = {styles.chipRow}>
                                {creativeSkills.map((tool) => (
                                    <ScrollFade key = {tool.name} distance = {16} className = {styles.chip}>
                                        <img src = {tool.icon} alt = {tool.name} className = {styles.chipIcon} />
                                        <span>{tool.name}</span>
                                    </ScrollFade>
                                ))}
                            </div>
                        </div>

                        <div className = {styles.skillGroup}>
                            <span className = {styles.groupLabel}>Tools</span>
                            <div className = {styles.chipRow}>
                                {toolSkills.map((tool) => (
                                    <ScrollFade key = {tool.name} distance = {16} className = {styles.chip}>
                                        <img src = {tool.icon} alt = {tool.name} className = {styles.chipIcon} />
                                        <span>{tool.name}</span>
                                    </ScrollFade>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className = {styles.divider} />

                    {/* Current focus areas */}
                    <div className = {styles.learningSection}>
                        <div className = {styles.learningHeader}>
                            <span className = {styles.pulseDot} />
                            <span className = {styles.learningLabel}>Current Focus Areas</span>
                        </div>

                        <div className = {styles.learningGrid}>
                            <div className = {styles.learningCard}>
                                <img src = {CppIcon} alt = "C++" />
                                <div>
                                    <h4>C++ Architectures</h4>
                                    <p>Deep diving into performance optimization, standard libraries, and system layers.</p>
                                </div>
                            </div>

                            <div className = {styles.learningCard}>
                                <img src = {UnrealIcon} alt = "Unreal Engine" />
                                <div>
                                    <h4>Interactive Ecosystems</h4>
                                    <p>Connecting real-time graphics tooling with high-performance native code frameworks.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </ScrollFade>

            </div>
        </section>
    )
}
