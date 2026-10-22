// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate, useLocation } from "react-router"

// CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------|
const DESKTOP_QUERY = "(min-width: 861px)"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { ResumeBtn } from "../../Common/Buttons/Buttons.jsx"

// HOOKS -------------------------------------------------------------------------------------------------------------------------------------------|
import useHoverCapable from "../../../hooks/useHoverCapable.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Navbar.module.css"

// NAVBAR DATA -------------------------------------------------------------------------------------------------------------------------------------|
const navItems = [
    { hash: "#home", label: "Home" },
    { hash: "#about", label: "About" },
    { hash: "#work", label: "Work" },
    { hash: "#stack", label: "Stack" },
    { hash: "#explore", label: "Explore" },
    { hash: "#notes", label: "Notes" },
    { hash: "#contact", label: "Contact" }
]

// WORDMARK DATA -----------------------------------------------------------------------------------------------------------------------------------|
const wordmark = [
    { paths: ["M4 4V20", "M18 5L7 12L18 19"], accent: true },
    { paths: ["M26 8V20", "M26 14C26 10 28.5 8 32 8"] },
    { paths: ["M38 14H50C50 10.7 47.3 8 44 8C40.7 8 38 10.7 38 14C38 17.3 40.7 20 44 20C46 20 47.6 19.1 48.7 17.7"] },
    { paths: ["M56 8L66 20", "M66 8L56 20"] },
    { paths: ["M73 8V20", "M73 2.8V2.9"] },
    { paths: ["M79 3V20"] },
    { paths: ["M85 14C85 10.7 87.7 8 91 8C94.3 8 97 10.7 97 14C97 17.3 94.3 20 91 20C87.7 20 85 17.3 85 14Z"] },
    { paths: ["M103 8V20", "M103 14C103 10 105.5 8 109 8"] },
    { paths: ["M115 18.6V18.7"], accent: true }
]

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

// NAVBAR ------------------------------------------------------------------------------------------------------------------------------------------|
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const navRef = useRef(null)
    const menuBtnRef = useRef(null)
    const canHover = useHoverCapable()
    const navigate = useNavigate()
    const location = useLocation()

    const toggleMenu = () => setIsOpen((prev) => !prev)

    const handleNavClick = (event, hash) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

        event.preventDefault()
        navigate({ pathname: "/", hash })
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
            initial = {{ y: -20, opacity: 0 }}
            animate = {{ y: 0, opacity: 1 }}
            transition = {{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >

            {/* Navbar Logo (Desktop Only) */}
            <div className = {styles.brandContainer}>
                <motion.a
                    href = "/#home"
                    onClick = {(event) => handleNavClick(event, "#home")}
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

            {/* Hamburger Toggle Button (Mobile/Tablet Left) */}
            <button
                ref = {menuBtnRef}
                className = {styles.hamburgerBtn}
                onClick = {toggleMenu}
                aria-label = "Toggle Navigation Menu"
                aria-expanded = {isOpen}
                aria-controls = {isOpen ? "mobile-menu" : undefined}
            >
                <motion.span
                    animate = {{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                    className = {styles.hamburgerLine}
                />
                <motion.span
                    animate = {{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
                    className = {styles.hamburgerLine}
                />
                <motion.span
                    animate = {{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                    className = {styles.hamburgerLine}
                />
            </button>

            {/* Navbar Links (Desktop) */}
            <nav className = {styles.navLinks} aria-label = "Main Navigation">
                {navItems.map((item) => (
                    <motion.a
                        key = {item.hash}
                        href = {`/${item.hash}`}
                        onClick = {(event) => handleNavClick(event, item.hash)}
                        className = {styles.navLink}
                        whileHover = {canHover ? { y: -1 } : undefined}
                        whileTap = {canHover ? { scale: 0.96 } : undefined}
                        transition = {{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <span className = {styles.navLabel}>{item.label}</span>
                    </motion.a>
                ))}
            </nav>

            {/* Navbar Actions (Desktop & Mobile Right Header) */}
            <div className = {styles.actions}>
                <ResumeBtn />
            </div>

            {/* Mobile Menu Dropdown Wrapper */}
            <AnimatePresence>
                {isOpen && (
                    <div className = {styles.mobileMenuWrapper}>
                        <motion.div
                            id = "mobile-menu"
                            className = {styles.mobileMenu}
                            initial = {{ opacity: 0, y: -10, scale: 0.98 }}
                            animate = {{ opacity: 1, y: 0, scale: 1 }}
                            exit = {{ opacity: 0, y: -10, scale: 0.98 }}
                            transition = {{ duration: 0.2, ease: "easeOut" }}
                        >
                            <nav className = {styles.mobileNavLinks} aria-label = "Mobile Navigation">
                                {navItems.map((item) => (
                                    <motion.a
                                        key = {item.hash}
                                        href = {`/${item.hash}`}
                                        onClick = {(event) => handleNavClick(event, item.hash)}
                                        className = {styles.navLink}
                                        whileHover = {canHover ? { y: -1 } : undefined}
                                        whileTap = {canHover ? { scale: 0.96 } : undefined}
                                        transition = {{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        <span className = {styles.navLabel}>{item.label}</span>
                                    </motion.a>
                                ))}
                            </nav>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
