// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Link } from "react-router"
import { motion } from "motion/react"

// HOOKS -------------------------------------------------------------------------------------------------------------------------------------------|
import useHoverCapable from "../../../hooks/useHoverCapable.js"

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import styles from "./Buttons.module.css"

// REUSABLE BUTTONS --------------------------------------------------------------------------------------------------------------------------------|

// (1) Resume Button
export function ResumeBtn({ className = "" }) {
    const canHover = useHoverCapable()

    return (
        <motion.div
            whileHover = {canHover ? { y: -2 } : undefined}
            whileTap = {{ scale: 0.97 }}
            transition = {{ type: "spring", stiffness: 400, damping: 20 }}
            style = {{ display: "inline-block" }}
        >
            <Link
                to = "/resume"
                className = {`${styles.resumeBtn} ${className}`}
                aria-label = "View Resume"
            >
                Resume
            </Link>
        </motion.div>
    )
}

// (2) Back To Top Button
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
