// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { BlogBtn, ResumeBtn } from "../../Common/Buttons/Buttons.jsx"

// DATA --------------------------------------------------------------------------------------------------------------------------------------------|
import { wordmark } from "../../../data/wordmark.data.js"
import { sectionLinks } from "../../../data/navigation.data.js"

// HOOKS -------------------------------------------------------------------------------------------------------------------------------------------|
import useHoverCapable from "../../../hooks/useHoverCapable.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Navbar.module.css"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const DESKTOP_QUERY = "(min-width: 741px)"

// ANIMATION VARIANTS ------------------------------------------------------------------------------------------------------------------------------|
const logoVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } },
    hover: {}
}

const letterVariants = {
    hidden: { y: 0 },
    visible: { y: 0 },
    hover: (index) => ({
        y: -2,
        transition: { type: "spring", stiffness: 500, damping: 16, delay: index * 0.03 }
    })
}

const strokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

const mobileMenuVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0
        }
    },
    exit: {
        transition: {
            staggerChildren: 0.025,
            staggerDirection: -1
        }
    }
}

const mobileLinkVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 420,
            damping: 28
        }
    },
    exit: {
        opacity: 0,
        y: -5,
        scale: 0.98,
        transition: {
            duration: 0.12,
            ease: "easeIn"
        }
    }
}

const staticMenuVariants = {
    hidden: { opacity: 1, y: 0, scale: 1 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 1, y: 0, scale: 1 }
}

const staticLinkVariants = {
    hidden: { opacity: 1, y: 0, scale: 1 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 1, y: 0, scale: 1 }
}

// NAVBAR ------------------------------------------------------------------------------------------------------------------------------------------|
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const navRef = useRef(null)
    const menuBtnRef = useRef(null)
    const canHover = useHoverCapable()
    const navigate = useNavigate()
    const location = useLocation()
    const shouldReduceMotion = useReducedMotion()

    const toggleMenu = () => setIsOpen((prev) => !prev)

    const isItemActive = (item) => {
        if (item.type === "route") {
            return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
        }
        if (location.pathname !== "/") return false
        if (!location.hash && item.hash === "#home") return true
        return location.hash === item.hash
    }

    const handleItemClick = (event, item) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

        event.preventDefault()
        setIsOpen(false)

        if (item.type === "route") {
            navigate(item.to)
        } else {
            navigate({ pathname: "/", hash: item.hash })
        }
    }

    useEffect(() => {
        setIsOpen(false)
    }, [location.key])

    useEffect(() => {
        const query = window.matchMedia(DESKTOP_QUERY)
        const handleChange = (event) => {
            if (event.matches) setIsOpen(false)
        }

        query.addEventListener("change", handleChange)

        return () => query.removeEventListener("change", handleChange)
    }, [])

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key !== "Escape") return

            setIsOpen(false)
            menuBtnRef.current?.focus()
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("touchstart", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen])

    return (
        <motion.header
            ref = {navRef}
            className = {styles.navbar}
            initial = {shouldReduceMotion ? false : { y: -14, opacity: 0 }}
            animate = {{ y: 0, opacity: 1 }}
            transition = {{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Left Group: Hamburger (Mobile) + Brand Wordmark */}
            <div className = {styles.leftGroup}>
                <button
                    ref = {menuBtnRef}
                    type = "button"
                    className = {styles.hamburgerBtn}
                    onClick = {toggleMenu}
                    aria-label = "Toggle Navigation Menu"
                    aria-expanded = {isOpen}
                    aria-controls = {isOpen ? "mobile-menu" : undefined}
                >
                    <motion.span
                        animate = {{ rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }}
                        className = {styles.hamburgerLine}
                    />
                    <motion.span
                        animate = {{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
                        className = {styles.hamburgerLine}
                    />
                    <motion.span
                        animate = {{ rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }}
                        className = {styles.hamburgerLine}
                    />
                </button>

                <div className = {styles.brandContainer}>
                    <motion.a
                        href = "/#home"
                        onClick = {(event) => handleItemClick(event, { type: "hash", hash: "#home" })}
                        className = {styles.brandLogo}
                        aria-label = "Krexilor Home"
                        variants = {logoVariants}
                        initial = "hidden"
                        animate = "visible"
                        whileHover = {canHover ? "hover" : undefined}
                        whileTap = {canHover ? { scale: 0.98 } : undefined}
                    >
                        <svg
                            className = {styles.brandWordmark}
                            viewBox = "0 0 118 24"
                            fill = "none"
                            stroke = "currentColor"
                            strokeWidth = "3"
                            strokeLinecap = "round"
                            strokeLinejoin = "round"
                            xmlns = "http://www.w3.org/2000/svg"
                            aria-hidden = "true"
                        >
                            {wordmark.map((letter, index) => (
                                <motion.g key = {index} variants = {letterVariants} custom = {index}>
                                    {letter.paths.map((d) => (
                                        <motion.path
                                            key = {d}
                                            d = {d}
                                            variants = {strokeVariants}
                                            stroke = {letter.accent ? "var(--color-accent)" : "currentColor"}
                                        />
                                    ))}
                                </motion.g>
                            ))}
                        </svg>
                    </motion.a>

                    <div className = {styles.divider} aria-hidden = "true" />
                </div>
            </div>

            {/* Centered Section Links (Desktop & Tablet) */}
            {sectionLinks.length > 0 && (
                <nav className = {styles.navLinks} aria-label = "Main Navigation">
                    {sectionLinks.map((item) => {
                        const href = `/${item.hash}`
                        const active = isItemActive(item)
                        return (
                            <a
                                key = {item.label}
                                href = {href}
                                onClick = {(event) => handleItemClick(event, item)}
                                className = {`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                                aria-current = {active ? "location" : undefined}
                            >
                                <span className = {styles.navLabel}>{item.label}</span>
                            </a>
                        )
                    })}
                </nav>
            )}

            {/* Route Action Buttons (Blog & Resume) */}
            <div className = {styles.actions}>
                <BlogBtn className = {styles.actionBtn} />
                <ResumeBtn className = {styles.actionBtn} />
            </div>

            {/* Mobile Menu Dropdown Wrapper */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className = {styles.mobileMenuWrapper}
                        initial = {shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                        animate = {{ opacity: 1, y: 0 }}
                        exit = {shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition = {{ duration: 0.2, ease: "easeOut" }}
                    >
                        <motion.div
                            id = "mobile-menu"
                            className = {styles.mobileMenu}
                            variants = {shouldReduceMotion ? staticMenuVariants : mobileMenuVariants}
                            initial = "hidden"
                            animate = "visible"
                            exit = "exit"
                            transition = {{ duration: 0.24, ease: "easeOut" }}
                        >
                            {sectionLinks.length > 0 && (
                                <nav className = {styles.mobileNavLinks} aria-label = "Mobile Navigation">
                                    {sectionLinks.map((item, idx) => {
                                        const href = `/${item.hash}`
                                        const active = isItemActive(item)
                                        return (
                                            <motion.a
                                                key = {item.label}
                                                href = {href}
                                                onClick = {(event) => handleItemClick(event, item)}
                                                className = {`${styles.mobileNavLink} ${active ? styles.mobileNavLinkActive : ""}`}
                                                variants = {shouldReduceMotion ? staticLinkVariants : mobileLinkVariants}
                                                whileTap = {shouldReduceMotion ? undefined : { scale: 0.97 }}
                                            >
                                                <span className = {styles.mobileIdx}>{String(idx + 1).padStart(2, "0")}</span>
                                                <span className = {styles.navLabel}>{item.label}</span>
                                            </motion.a>
                                        )
                                    })}
                                </nav>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
