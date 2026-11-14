// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { motion } from "motion/react"
import { Link, useLocation } from "react-router"

// HOOKS -------------------------------------------------------------------------------------------------------------------------------------------|
import useHoverCapable from "../../../hooks/useHoverCapable.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Buttons.module.css"

// INTERNAL ACTION BUTTON BASE ---------------------------------------------------------------------------------------------------------------------|
function NavActionBtn({ to, label, ariaLabel, className = "" }) {
    const canHover = useHoverCapable()
    const location = useLocation()
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`)

    return (
        <motion.div
            whileHover = {canHover ? { y: -2 } : undefined}
            whileTap = {{ scale: 0.97 }}
            transition = {{ type: "spring", stiffness: 400, damping: 20 }}
            style = {{ display: "inline-block" }}
        >
            <Link
                to = {to}
                className = {`${styles.resumeBtn} ${isActive ? styles.resumeBtnActive : ""} ${className}`}
                aria-label = {ariaLabel}
                aria-current = {isActive ? "page" : undefined}
            >
                {label}
            </Link>
        </motion.div>
    )
}

// REUSABLE BUTTONS --------------------------------------------------------------------------------------------------------------------------------|

// (1) Blog Button
export function BlogBtn({ className = "" }) {
    return (
        <NavActionBtn
            to = "/blog"
            label = "Blog"
            ariaLabel = "View Engineering Blog"
            className = {className}
        />
    )
}

// (2) Resume Button
export function ResumeBtn({ className = "" }) {
    return (
        <NavActionBtn
            to = "/resume"
            label = "Resume"
            ariaLabel = "View Resume"
            className = {className}
        />
    )
}

// (3) Back To Top Button
export function BackToTopBtn({ className = "", label = "Back to top" }) {
    const handleClick = () => window.scrollTo({ top: 0 })

    return (
        <button
            type = "button"
            className = {`${styles.backToTopBtn} ${className}`}
            onClick = {handleClick}
        >
            {label}
            <svg
                className = {styles.backToTopArrow}
                viewBox = "0 0 16 16"
                width = "12"
                height = "12"
                fill = "none"
                stroke = "currentColor"
                strokeWidth = "1.6"
                strokeLinecap = "round"
                strokeLinejoin = "round"
                aria-hidden = "true"
            >
                <path d = "M8 13V3M3.5 7.5L8 3L12.5 7.5" />
            </svg>
        </button>
    )
}
