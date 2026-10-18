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
            whileTap = {canHover ? { scale: 0.97 } : undefined}
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
