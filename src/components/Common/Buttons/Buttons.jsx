// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { Link } from "react-router"
import { motion } from "motion/react"

// COMPONENTS --------------------------------------------------------------------------------------------------------------------------------------|
import { ArrowUp } from "../Icons/Icons.jsx"

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
    const canHover = useHoverCapable()
    const handleClick = () => window.scrollTo({ top: 0 })

    return (
        <motion.button
            type = "button"
            className = {`${styles.backToTopBtn} ${className}`}
            onClick = {handleClick}
            whileHover = {canHover ? { y: -2 } : undefined}
            whileTap = {{ scale: 0.97 }}
            transition = {{ type: "spring", stiffness: 400, damping: 20 }}
        >
            {label}
            <ArrowUp className = {styles.backToTopArrow} />
        </motion.button>
    )
}
